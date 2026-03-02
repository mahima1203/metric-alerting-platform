import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import eventEmitter, { EVENTS } from '@/lib/events';

// POST /api/metrics - Receive a metric and evaluate alerts
export async function POST(request: Request) {
    try {
        const { metric_name, metric_value } = await request.json();

        if (!metric_name || metric_value === undefined) {
            return NextResponse.json({ error: 'Missing metric name or value' }, { status: 400 });
        }

        // 0. Update latest metric value (Upsert)
        await query(
            'INSERT INTO metrics (metric_name, last_value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (metric_name) DO UPDATE SET last_value = $2, updated_at = CURRENT_TIMESTAMP',
            [metric_name, metric_value]
        );

        // 1. Find all alerts for this metric
        const alertsResult = await query('SELECT * FROM alerts WHERE metric_name = $1', [metric_name]);
        const alerts = alertsResult.rows;

        if (alerts.length === 0) {
            return NextResponse.json(
                { error: `No alert configuration found for metric: "${metric_name}". Please create an alert rule first.` },
                { status: 404 }
            );
        }

        const triggeredEvents = [];

        // 2. Evaluate each alert
        for (const alert of alerts) {
            let triggered = false;
            if (alert.comparator === 'GT' && metric_value > alert.threshold) {
                triggered = true;
            } else if (alert.comparator === 'LT' && metric_value < alert.threshold) {
                triggered = true;
            }

            if (triggered) {
                // 3. Store alert event if triggered
                const eventResult = await query(
                    'INSERT INTO alert_events (alert_id, metric_name, metric_value, message) VALUES ($1, $2, $3, $4) RETURNING *',
                    [alert.id, metric_name, metric_value, alert.message]
                );
                triggeredEvents.push(eventResult.rows[0]);
            }
        }

        // Notify all clients via SSE
        eventEmitter.emit(EVENTS.UPDATE);

        return NextResponse.json({
            message: 'Metric processed',
            triggered_count: triggeredEvents.length,
            events: triggeredEvents
        });
    } catch (error) {
        console.error('Error processing metric:', error);
        return NextResponse.json({ error: 'Failed to process metric' }, { status: 500 });
    }
}
