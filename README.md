# StockFlow - SaaS Inventory Management

StockFlow is a modern, high-performance inventory management application built for small to medium-sized businesses. It features secure multi-tenant architecture, real-time metrics, and a sleek, developer-first design.

## 🚀 Quick Start

### Backend Setup
1. **Prequisites**: Python 3.10+, PostgreSQL.
2. **Environment**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
3. **Database**:
   - Create a `.env` file based on `.env.example`.
   - Run migrations: `alembic upgrade head`.
   - Seed initial data: `python seed.py`.
4. **Run**: `uvicorn main:app --reload`.

### Frontend Setup
1. **Environment**:
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   ```
2. **Run**: `npm run dev`.
3. **Access**: [http://localhost:3000](http://localhost:3000).

## 🛠 Features

### Core Infrastructure
- [x] **Multi-tenant isolation**: Every organization has its own private data scope.
- [x] **JWT Authentication**: Secure login/signup with organization creation.
- [x] **Protected Routes**: Client-side guards and API-level authorization.

### Product Management
- [x] **Inventory CRUD**: Complete management of products, SKUs, and pricing.
- [x] **Quick Stock Adjustment**: Update inventory levels instantly.
- [x] **Search & Filter**: Client-side filtering by name and SKU.
- [x] **Low Stock Alerts**: Automatic flagging based on customizable thresholds.

### Insights & Settings
- [x] **Real-time Dashboard**: Overview of total products, total stock, and active alerts.
- [x] **Global Thresholds**: Set organization-wide defaults for low stock notifications.

## 🎨 Design System
- **Background**: `#0a0f1e` (Deep Navy)
- **Accent**: `#2563eb` (Electric Blue)
- **Surface**: `#111827` (Card Gradient)
- **Font**: DM Sans

## 📜 License
MIT License. Created by StockFlow Team.