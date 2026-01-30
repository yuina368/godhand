import { NextResponse } from 'next/server';

/**
 * Keep-alive endpoint
 * External services (like UptimeRobot) will ping this every 10 minutes
 */
export async function GET() {
    return NextResponse.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        service: '手相AI Premium',
    });
}
