from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import datetime

# --- Organization & Settings Schemas ---
class OrganizationBase(BaseModel):
    name: str
    default_low_stock_threshold: int = Field(5, ge=1)

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = {"from_attributes": True}

class OrganizationOut(OrganizationBase):
    id: int
    model_config = {"from_attributes": True}

class SettingsOut(BaseModel):
    default_low_stock_threshold: int

class SettingsUpdate(BaseModel):
    default_low_stock_threshold: int = Field(..., ge=1)

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    organization_id: int

class User(UserBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    model_config = {"from_attributes": True}

class UserOut(UserBase):
    id: int
    organization_id: int
    organization_name: Optional[str] = None
    created_at: datetime
    model_config = {"from_attributes": True}

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1)
    sku: str = Field(..., min_length=1)
    description: Optional[str] = None
    quantity_on_hand: int = Field(0, ge=0)
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    low_stock_threshold: Optional[int] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    sku: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    quantity_on_hand: Optional[int] = Field(None, ge=0)
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None
    low_stock_threshold: Optional[int] = None

class StockAdjustRequest(BaseModel):
    adjustment: int

class ProductOut(ProductBase):
    id: int
    organization_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    is_low_stock: bool

    model_config = {"from_attributes": True}

# --- Dashboard Schemas ---
class DashboardOut(BaseModel):
    total_products: int
    total_quantity: int
    low_stock_items: List[ProductOut]

# --- Auth Schemas ---
class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    organization_name: str = Field(..., min_length=1)

    @model_validator(mode='after')
    def check_passwords_match(self) -> 'SignupRequest':
        if self.password != self.confirm_password:
            raise ValueError('passwords do not match')
        return self

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    org_id: Optional[int] = None
