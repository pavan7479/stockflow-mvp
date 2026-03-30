from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter()

@router.get("/organization", response_model=schemas.Organization)
async def get_organization_settings(current_user: models.User = Depends(get_current_user)):
    return current_user.organization
