from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, model_validator
from datetime import datetime

# --- Organization Schemas ---
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

class OrganizationOut(OrganizationBase):
    id: int
    model_config = {"from_attributes": True}

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
    created_at: datetime
    model_config = {"from_attributes": True}

# --- Product Schemas ---
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
    model_config = {"from_attributes": True}

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
