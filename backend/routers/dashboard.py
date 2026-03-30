from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Placeholder for dashboard logic
    return {"total_products": 0, "low_stock_alerts": 0, "recent_activity": []}
