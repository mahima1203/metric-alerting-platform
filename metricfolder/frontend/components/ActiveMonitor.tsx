'use client';

interface MetricStatus {
    metric_name: string;
    last_value: number;
    updated_at: string;
    is_firing: boolean;
}

interface ActiveMonitorProps {
    metrics: MetricStatus[];
}

export default function ActiveMonitor({ metrics }: ActiveMonitorProps) {
    if (!metrics || metrics.length === 0) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 text-center text-gray-500">
                No active metrics detected yet. Send some metrics to start monitoring!
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <h2 className="text-lg font-bold p-4 border-b border-gray-200 text-gray-800">Live Status Monitor</h2>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div
                        key={m.metric_name}
                        className={`p-4 rounded-xl border-2 transition-all duration-500 ${m.is_firing
                            ? 'bg-red-50 border-red-200 shadow-md ring-1 ring-red-400'
                            : 'bg-green-50 border-green-200'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-sm text-gray-900 truncate pr-2">{m.metric_name}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${m.is_firing ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'
                                }`}>
                                {m.is_firing ? 'Firing' : 'Healthy'}
                            </span>
                        </div>
                        <div className="flex items-baseline space-x-1">
                            <span className="text-xl font-black text-gray-900">{m.last_value}</span>
                            <span className="text-[10px] text-gray-500 font-medium">unit</span>
                        </div>
                        <p className="mt-2 text-[10px] text-gray-400 font-mono">
                            Last Updated: {new Date(m.updated_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
