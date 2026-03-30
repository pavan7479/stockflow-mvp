from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter()

def map_product_out(product: models.Product, default_threshold: int) -> schemas.ProductOut:
    threshold = product.low_stock_threshold if product.low_stock_threshold is not None else default_threshold
    is_low_stock = product.quantity_on_hand <= threshold
    
    return schemas.ProductOut(
        id=product.id,
        organization_id=product.organization_id,
        name=product.name,
        sku=product.sku,
        description=product.description,
        quantity_on_hand=product.quantity_on_hand,
        cost_price=product.cost_price,
        selling_price=product.selling_price,
        low_stock_threshold=product.low_stock_threshold,
        created_at=product.created_at,
        updated_at=product.updated_at,
        is_low_stock=is_low_stock
    )

@router.get("/", response_model=List[schemas.ProductOut])
async def list_products(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    query = db.query(models.Product).filter(models.Product.organization_id == current_user.organization_id)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(or_(
            models.Product.name.ilike(search_filter),
            models.Product.sku.ilike(search_filter)
        ))
    
    products = query.all()
    default_threshold = current_user.organization.default_low_stock_threshold
    
    return [map_product_out(p, default_threshold) for p in products]

@router.post("/", response_model=schemas.ProductOut)
async def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # Check SKU uniqueness in org
    existing = db.query(models.Product).filter(
        models.Product.organization_id == current_user.organization_id,
        models.Product.sku == product.sku
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"Product with SKU '{product.sku}' already exists")
    
    db_product = models.Product(**product.dict(), organization_id=current_user.organization_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return map_product_out(db_product, current_user.organization.default_low_stock_threshold)

@router.get("/{product_id}", response_model=schemas.ProductOut)
async def get_product(
    product_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.organization_id == current_user.organization_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return map_product_out(product, current_user.organization.default_low_stock_threshold)

@router.put("/{product_id}", response_model=schemas.ProductOut)
async def update_product(
    product_id: int,
    product_update: schemas.ProductUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.organization_id == current_user.organization_id
    ).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check SKU uniqueness if changed
    update_data = product_update.dict(exclude_unset=True)
    if 'sku' in update_data and update_data['sku'] != db_product.sku:
        existing = db.query(models.Product).filter(
            models.Product.organization_id == current_user.organization_id,
            models.Product.sku == update_data['sku']
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail=f"Product with SKU '{update_data['sku']}' already exists")
            
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return map_product_out(db_product, current_user.organization.default_low_stock_threshold)

@router.delete("/{product_id}")
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.organization_id == current_user.organization_id
    ).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    db.delete(db_product)
    db.commit()
    return {"success": True, "message": "Product deleted"}

@router.patch("/{product_id}/adjust-stock", response_model=schemas.ProductOut)
async def adjust_stock(
    product_id: int,
    request: schemas.StockAdjustRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.organization_id == current_user.organization_id
    ).first()
    
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    new_qty = db_product.quantity_on_hand + request.adjustment
    if new_qty < 0:
        raise HTTPException(status_code=400, detail="Quantity cannot go below 0")
        
    db_product.quantity_on_hand = new_qty
    db.commit()
    db.refresh(db_product)
    return map_product_out(db_product, current_user.organization.default_low_stock_threshold)
