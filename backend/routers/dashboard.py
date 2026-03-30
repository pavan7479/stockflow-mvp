from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from dependencies import get_current_user
import models, schemas
from .products import map_product_out

router = APIRouter()

@router.get("/", response_model=schemas.DashboardOut)
async def get_dashboard(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    org_id = current_user.organization_id
    default_threshold = current_user.organization.default_low_stock_threshold
    
    # Get all products for org
    products = db.query(models.Product).filter(models.Product.organization_id == org_id).all()
    
    total_products = len(products)
    total_quantity = sum(p.quantity_on_hand for p in products)
    
    # Filter low stock items
    low_stock_items = []
    for p in products:
        threshold = p.low_stock_threshold if p.low_stock_threshold is not None else default_threshold
        if p.quantity_on_hand <= threshold:
            low_stock_items.append(map_product_out(p, default_threshold))
            
    return schemas.DashboardOut(
        total_products=total_products,
        total_quantity=total_quantity,
        low_stock_items=low_stock_items
    )
