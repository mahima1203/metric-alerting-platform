import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/alert-events - List all triggered alert events
export async function GET() {
    try {
        const result = await query('SELECT * FROM alert_events ORDER BY triggered_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching alert events:', error);
        return NextResponse.json({ error: 'Failed to fetch alert events' }, { status: 500 });
    }
}
