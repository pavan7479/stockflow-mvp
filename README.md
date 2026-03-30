# StockFlow - SaaS Inventory Management

StockFlow is a modern, high-performance inventory management application designed for small to medium-sized businesses. It features secure multi-tenant architecture, real-time metrics, and a sleek, developer-first design.

## 🚀 Quick Start

### Backend Setup
1. **Prequisites**: Python 3.10+, PostgreSQL/SQLite.
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
- [x] **Multi-tenant isolation**: Secure, private data scope for every organization.
- [x] **JWT Authentication**: Secure login/signup flow with automatic organization creation.
- [x] **Redirection Logic**: Smart routing based on authentication status.

### Product Management
- [x] **Inventory CRUD**: Comprehensive management of products, SKUs, and descriptions.
- [x] **Quick Stock Adjustment**: Instant inventory updates with precision handling.
- [x] **Search & Filter**: Real-time client-side filtering by name and SKU.
- [x] **Precision Pricing**: `Numeric(10, 2)` implementation for exact financial tracking.

### Insights & Settings
- [x] **Real-time Dashboard**: Live overview of total stock, product counts, and low-stock alerts.
- [x] **Alert Thresholds**: Customizable low-stock notification triggers at both organization and product levels.

## 🎨 Design System
- **Background**: `#0a0f1e` (Deep Navy)
- **Accent**: `#2563eb` (Electric Blue)
- **Surface**: `#111827` (Card Gradient)
- **Typography**: DM Sans (Modern SaaS Aesthetic)

## 📜 License
MIT License. Created by the StockFlow Team.