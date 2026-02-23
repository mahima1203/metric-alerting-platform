-- Create tables for the metric alerting platform

-- Table for alerts configuration
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    threshold FLOAT NOT NULL,
    comparator TEXT NOT NULL, -- GT / LT
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for triggered alert events
CREATE TABLE IF NOT EXISTS alert_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value FLOAT NOT NULL,
    message TEXT NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Table for latest metric measurements (for real-time monitoring)
CREATE TABLE IF NOT EXISTS metrics (
    metric_name TEXT PRIMARY KEY,
    last_value FLOAT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
