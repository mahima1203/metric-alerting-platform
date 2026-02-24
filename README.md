**Metric Alerting Platform**
Project Overview

The Metric Alerting Platform is a full-stack application designed to simulate a simplified real-time monitoring and alerting system. It allows users to define alert rules, submit metric data, automatically evaluate thresholds, generate alert events, and review alert history through a dashboard interface.

This project was developed as part of an assessment to demonstrate backend, frontend, and database integration skills.

**Problem Statement**

Modern systems continuously generate operational metrics such as CPU usage, memory usage, disk utilization, API latency, and error rates. Monitoring these metrics and triggering alerts when abnormal conditions occur is a critical part of system reliability.

This platform implements a simplified alerting mechanism that:

Stores alert configurations

Accepts metric data

Evaluates alert rules

Generates alert events

Displays alert history

**Features Implemented**
Alert Rule Management

Create alert rules with:

Metric name

Comparator (GT / LT)

Threshold value

Custom alert message

Persist rules in PostgreSQL

Metric Ingestion

Submit metric values through the user interface

Backend API validates incoming data

Alert Evaluation Engine

Retrieves matching alert rules based on metric name

Compares metric value against threshold

**Supports:**

GT (Greater Than)

LT (Less Than)

Alert Event Generation

Automatically generates alert events when conditions are met

Stores event details:

Alert ID

Metric name

Metric value

Message

Timestamp

Alert History Dashboard

Displays recent alert events

Updates dynamically using polling

Built with Next.js and Tailwind CSS

Notification System

Displays toast notifications using Sonner

Replaces default browser alerts for improved user experience

Technology Stack
Frontend

Next.js

Tailwind CSS

Sonner (toast notifications)

Backend

Next.js API Routes

PostgreSQL

Database

PostgreSQL

Tables:

alerts

alert_events

Prerequisites

Ensure the following are installed:

Node.js

PostgreSQL (running locally)

Database Setup

Connect to PostgreSQL.

Create the database:

CREATE DATABASE metric_db;

Run the initialization script:

psql -U postgres -d metric_db -f backend/scripts/init-db.sql
Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Verify the database connection string in lib/db.ts.

Default configuration:

postgres://postgres:postgres@localhost:5432/metric_db

Start the backend server:

npm run dev

Backend runs on:

http://localhost:3000
Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the frontend server:

npm run dev -- -p 3001

Frontend runs on:

http://localhost:3001
Troubleshooting
Database Connection Issues

If you encounter a 500 Internal Server Error or connection failure:

Check PostgreSQL status

Windows: Use Services Manager

Mac/Linux:

sudo service postgresql status

Verify database exists

psql -U postgres -c "CREATE DATABASE metric_db;"

Verify credentials

Ensure the connection string in:

backend/lib/db.ts

matches your PostgreSQL configuration.

Re-run initialization script

psql -U postgres -d metric_db -f backend/scripts/init-db.sql
Assessment Objectives Demonstrated

Full-stack application design

REST API development

Database schema design

Rule-based evaluation logic

Real-time UI updates

Error handling and validation
