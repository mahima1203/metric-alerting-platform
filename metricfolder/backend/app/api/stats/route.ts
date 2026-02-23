import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const alertsCount = await query('SELECT COUNT(*) FROM alerts');
        const eventsCount = await query('SELECT COUNT(*) FROM alert_events');

        // Get active alerts (current values that cross thresholds)
        const activeAlertsQuery = `
            SELECT a.*, m.last_value as current_value, m.updated_at as last_seen
            FROM alerts a
            JOIN metrics m ON a.metric_name = m.metric_name
            WHERE (a.comparator = 'GT' AND m.last_value > a.threshold)
               OR (a.comparator = 'LT' AND m.last_value < a.threshold)
        `;
        const activeAlertsResult = await query(activeAlertsQuery);

        // Get all metrics with their latest status
        const allMetricsQuery = `
            SELECT m.*, 
                   EXISTS (
                       SELECT 1 FROM alerts a 
                       WHERE a.metric_name = m.metric_name 
                         AND ((a.comparator = 'GT' AND m.last_value > a.threshold) 
                           OR (a.comparator = 'LT' AND m.last_value < a.threshold))
                   ) as is_firing
            FROM metrics m
        `;
        const allMetricsResult = await query(allMetricsQuery);

        return NextResponse.json({
            total_alerts: parseInt(alertsCount.rows[0].count),
            total_events: parseInt(eventsCount.rows[0].count),
            active_alerts_count: activeAlertsResult.rows.length,
            active_alerts: activeAlertsResult.rows,
            metrics_status: allMetricsResult.rows
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
    }
}
