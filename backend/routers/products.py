from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Product])
async def get_products(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Product).filter(models.Product.organization_id == current_user.organization_id).all()

@router.post("/", response_model=schemas.Product)
async def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
