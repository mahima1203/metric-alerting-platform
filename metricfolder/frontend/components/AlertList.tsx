'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';

interface Alert {
    id: string;
    metric_name: string;
    threshold: number;
    comparator: string;
    message: string;
    created_at: string;
}

export default function AlertList() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast, confirm } = useNotification();

    const fetchAlerts = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3000/api/alerts');
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        confirm({
            title: 'Delete Alert',
            message: 'Are you sure you want to delete this alert configuration? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:3000/api/alerts/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        setAlerts(alerts.filter(a => a.id !== id));
                        showToast('Alert deleted successfully', 'success');
                    } else {
                        showToast('Failed to delete alert', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting alert:', error);
                    showToast('Connection error', 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchAlerts();
        // Poll every 10 seconds for list updates
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="text-center py-4">Loading alerts...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <h2 className="text-xl font-bold p-6 border-b border-gray-200 text-gray-800">Alert Configurations</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No alerts configured.</td>
                            </tr>
                        ) : (
                            alerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.metric_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {alert.comparator} {alert.threshold}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDelete(alert.id)}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
