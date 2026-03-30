from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, products, dashboard, settings
from database import engine, Base
import models  # noqa: F401 — ensures all models register with Base metadata
import os

app = FastAPI(title="StockFlow API")

# Create all tables on startup (safe: skips existing tables)
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])

@app.get("/")
async def health_check():
    return {"status": "ok", "app": "StockFlow"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))