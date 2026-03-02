import { NextRequest } from 'next/server';
import eventEmitter, { EVENTS } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();

            const onUpdate = () => {
                const message = `data: ${JSON.stringify({ type: 'update' })}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            // Listen for updates
            eventEmitter.on(EVENTS.UPDATE, onUpdate);

            // Send initial connection message
            const initial = `data: ${JSON.stringify({ type: 'connected' })}\n\n`;
            controller.enqueue(encoder.encode(initial));

            // Keep the connection alive with a heartbeat every 30s
            const heartbeat = setInterval(() => {
                controller.enqueue(encoder.encode(': heartbeat\n\n'));
            }, 30000);

            // Cleanup when the connection is closed
            req.signal.onabort = () => {
                clearInterval(heartbeat);
                eventEmitter.off(EVENTS.UPDATE, onUpdate);
                console.log('SSE connection closed');
            };
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}
