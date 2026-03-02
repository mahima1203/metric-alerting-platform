'use client';

import { useState, useEffect } from 'react';
import AlertForm from '@/components/AlertForm';
import MetricForm from '@/components/MetricForm';
import EventTable from '@/components/EventTable';
import AlertList from '@/components/AlertList';
import ActiveMonitor from '@/components/ActiveMonitor';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total_alerts: 0,
    total_events: 0,
    active_alerts_count: 0,
    metrics_status: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch events
      const eventsRes = await fetch('http://127.0.0.1:3000/api/alert-events');
      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }

      // Fetch stats
      const statsRes = await fetch('http://127.0.0.1:3000/api/stats');
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Setup SSE for real-time updates
    const eventSource = new EventSource('http://127.0.0.1:3000/api/events/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'update') {
        console.log('SSE: Update received, refreshing data...');
        fetchData();
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
      // Optionally fallback to interval if SSE fails
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Metric Alerting Platform
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Monitor metrics and manage alerts in real-time.
          </p>
        </header>

        <nav className="mb-8 flex justify-center space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('management')}
            className={`pb-2 px-4 font-medium ${activeTab === 'management' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Alert Management
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-2 px-4 font-medium ${activeTab === 'metrics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Metric Simulation
          </button>
        </nav>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center">
                <p className="text-sm font-medium text-gray-500 uppercase">Alert Configurations</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_alerts}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center">
                <p className="text-sm font-medium text-gray-500 uppercase">Active Alerts</p>
                <p className={`mt-2 text-3xl font-bold ${stats.active_alerts_count > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.active_alerts_count}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-center">
                <p className="text-sm font-medium text-gray-500 uppercase">Lifetime Events</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{stats.total_events}</p>
              </div>
            </div>

            {/* Live Status Monitor */}
            <ActiveMonitor metrics={stats.metrics_status} />

            {loading ? (
              <div className="mt-10 text-center text-gray-500">Loading events...</div>
            ) : (
              <EventTable events={events} />
            )}
          </div>
        )}

        {activeTab === 'management' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <AlertForm onAlertCreated={fetchData} />
            </div>
            <div className="lg:col-span-2">
              <AlertList />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="max-w-md mx-auto">
            <MetricForm onMetricSent={fetchData} />
          </div>
        )}
      </div>
    </main>
  );
}
