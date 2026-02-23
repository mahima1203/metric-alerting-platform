'use client';

import { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function MetricForm({ onMetricSent }: { onMetricSent: () => void }) {
    const [metricName, setMetricName] = useState('');
    const [metricValue, setMetricValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:3000/api/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metric_name: metricName,
                    metric_value: parseFloat(metricValue),
                }),
            });

            if (response.ok) {
                setMetricValue('');
                onMetricSent();
                const data = await response.json();
                if (data.triggered_count > 0) {
                    showToast(`Alert Triggered! (${data.triggered_count})`, 'info');
                } else {
                    showToast('Metric processed successfully', 'success');
                }
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to send metric', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error connecting to backend', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Send Metric</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Metric Name</label>
                    <input
                        type="text"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
                        required
                        placeholder="cpu_usage"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                        type="number"
                        step="0.1"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400"
                        required
                        placeholder="85.0"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Sending...' : 'Send Metric'}
                </button>
            </form>
        </div>
    );
}
