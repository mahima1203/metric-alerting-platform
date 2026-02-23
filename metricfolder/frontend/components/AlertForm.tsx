'use client';

import { useState } from 'react';
import { useNotification } from '@/context/NotificationContext';

export default function AlertForm({ onAlertCreated }: { onAlertCreated: () => void }) {
    const [metricName, setMetricName] = useState('');
    const [threshold, setThreshold] = useState('');
    const [comparator, setComparator] = useState('GT');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:3000/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    metric_name: metricName,
                    threshold: parseFloat(threshold),
                    comparator,
                    message,
                }),
            });

            if (response.ok) {
                setMetricName('');
                setThreshold('');
                setMessage('');
                onAlertCreated();
                showToast('Alert created successfully!', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to create alert', 'error');
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create Alert</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Metric Name (e.g., cpu_usage)</label>
                    <input
                        type="text"
                        value={metricName}
                        onChange={(e) => setMetricName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                        required
                        placeholder="cpu_usage"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Threshold</label>
                    <input
                        type="number"
                        step="0.1"
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                        required
                        placeholder="90.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Comparator</label>
                    <select
                        value={comparator}
                        onChange={(e) => setComparator(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                        <option value="GT">Greater Than (GT)</option>
                        <option value="LT">Less Than (LT)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Alert Message</label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                        required
                        placeholder="CPU usage is too high!"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Creating...' : 'Create Alert'}
                </button>
            </form>
        </div>
    );
}
