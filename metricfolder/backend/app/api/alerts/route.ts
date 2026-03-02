import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import eventEmitter, { EVENTS } from '@/lib/events';

// GET /api/alerts - List all alerts
export async function GET() {
    try {
        const result = await query('SELECT * FROM alerts ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
}

// POST /api/alerts - Create a new alert
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received alert creation request:', body);
        const { metric_name, threshold, comparator, message } = body;

        if (!metric_name || threshold === undefined || !comparator || !message) {
            console.log('Validation failed: missing fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('Executing query: INSERT INTO alerts...');
        const result = await query(
            'INSERT INTO alerts (metric_name, threshold, comparator, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [metric_name, threshold, comparator, message]
        );

        console.log('Query successful, created alert:', result.rows[0]);

        // Notify all clients via SSE
        eventEmitter.emit(EVENTS.UPDATE);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('CRITICAL ERROR creating alert:', error);
        return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }
}
