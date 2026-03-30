from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, products, dashboard, settings

app = FastAPI(title="StockFlow API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(settings.router, prefix="/api/settings", tags=["Settings"])

@app.get("/")
async def health_check():
    return {"status": "ok", "app": "StockFlow"}