import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import eventEmitter, { EVENTS } from '@/lib/events';

// DELETE /api/alerts/[id] - Delete an alert
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await query('DELETE FROM alerts WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
        }

        // Notify all clients via SSE
        eventEmitter.emit(EVENTS.UPDATE);

        return NextResponse.json({ message: 'Alert deleted successfully' });
    } catch (error) {
        console.error('Error deleting alert:', error);
        return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
}
