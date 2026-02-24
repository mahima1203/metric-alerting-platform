# Metric Alerting Platform

## Project Overview

The Metric Alerting Platform is a full-stack application developed using Next.js and PostgreSQL. The platform simulates a simplified real-time monitoring and alerting system that allows users to configure alert rules, submit metric data, evaluate thresholds, generate alert events, and review alert history through a dashboard interface.

This project was created as part of an assessment to demonstrate frontend, backend, and database integration.

---

## Problem Statement

Modern systems continuously generate operational metrics such as CPU usage, memory usage, API latency, and error rates. Monitoring these metrics and triggering alerts when predefined conditions are violated is essential for maintaining system reliability.

This platform implements a simplified alerting workflow that:

- Stores alert configurations  
- Accepts metric data  
- Evaluates alert rules  
- Generates alert events  
- Displays alert history  

---

## Features

### Alert Rule Management
Create alert rules with:

- Metric name  
- Comparator (GT / LT)  
- Threshold value  
- Custom alert message  

---

### Metric Ingestion

- Submit metric values through the user interface  
- Backend API validates incoming metric data  

---

### Alert Evaluation

- Retrieves alert rules based on metric name  
- Compares metric values against defined thresholds  

Supports:

- GT (Greater Than)  
- LT (Less Than)  

---

### Alert Event Generation

- Automatically creates alert events when conditions are met  

Stores:

- Alert ID  
- Metric name  
- Metric value  
- Message  
- Timestamp  

---

### Dashboard

- Displays recent alert events  
- Dynamic updates using polling  
- Clean UI built with Tailwind CSS  

---

### Notifications

- Toast notifications implemented using Sonner  
- Non-blocking user feedback  

---

## Technology Stack

**Frontend**

- Next.js  
- Tailwind CSS  
- Sonner (toast notifications)  

**Backend**

- Next.js API Routes  
- PostgreSQL  

**Database**

- PostgreSQL  

---

## Database Schema

Tables used:

- alerts  
- alert_events  

---

## Setup Instructions

### Prerequisites

- Node.js  
- PostgreSQL (running locally)  

---

### Database Setup

Create the database:

CREATE DATABASE metric_db;

Run initialization script:

psql -U postgres -d metric_db -f backend/scripts/init-db.sql

---

### Backend Setup

cd backend  
npm install  
npm run dev  

Backend runs on:

http://localhost:3000

---

### Frontend Setup

cd frontend  
npm install  
npm run dev -- -p 3001  

Frontend runs on:

http://localhost:3001

---

## Application Preview

### Dashboard
![Dashboard](screenshots/dashboard_img.png)

---

### Alert Management
![Alert Management](screenshots/Alert_management.png)

---

### Additional View
![Additional View](screenshots/image.png)

---

## Troubleshooting

### Database Connection Issues

If you encounter a 500 Internal Server Error:

- Verify PostgreSQL is running  
- Confirm database metric_db exists  
- Check connection string in backend/lib/db.ts  

Default:

postgres://postgres:postgres@localhost:5432/metric_db

- Re-run initialization script if needed