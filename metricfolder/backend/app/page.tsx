export default function Home() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>📊 Metric Alerting Platform - Backend API</h1>
      <p>The backend server is running successfully.</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Available Endpoints:</h3>
        <ul>
          <li><code>GET /api/alerts</code> - List all alerts</li>
          <li><code>POST /api/alerts</code> - Create a new alert</li>
          <li><code>GET /api/alert-events</code> - List all alert events</li>
          <li><code>POST /api/metrics</code> - Send a metric to evaluate</li>
        </ul>
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>
        Note: This is a JSON API. Use the <a href="http://localhost:3001">Frontend Dashboard</a> to interact with it visually.
      </p>
    </main>
  );
}
