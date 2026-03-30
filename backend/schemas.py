from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Organization Schemas
class OrganizationBase(BaseModel):
    name: str
    default_low_stock_threshold: int = 5

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    organization_id: int

class User(UserBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}

# Product Schemas
class ProductBase(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    quantity_on_hand: int = 0
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    low_stock_threshold: Optional[int] = None

class ProductCreate(ProductBase):
    organization_id: int

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
