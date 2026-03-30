from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter()

@router.get("/", response_model=schemas.SettingsOut)
async def get_settings(current_user: models.User = Depends(get_current_user)):
    return schemas.SettingsOut(
        default_low_stock_threshold=current_user.organization.default_low_stock_threshold
    )

@router.put("/", response_model=schemas.SettingsOut)
async def update_settings(
    settings_update: schemas.SettingsUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    org = current_user.organization
    org.default_low_stock_threshold = settings_update.default_low_stock_threshold
    db.commit()
    db.refresh(org)
    
    return schemas.SettingsOut(
        default_low_stock_threshold=org.default_low_stock_threshold
    )
