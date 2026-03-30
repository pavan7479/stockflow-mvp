from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas, auth

router = APIRouter()

@router.post("/signup", response_model=schemas.TokenResponse)
async def signup(request: schemas.SignupRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create Organization
    new_org = models.Organization(name=request.organization_name)
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    
    # Create User
    hashed_password = auth.hash_password(request.password)
    new_user = models.User(
        email=request.email,
        password_hash=hashed_password,
        organization_id=new_org.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate Token
    access_token = auth.create_access_token(data={"sub": str(new_user.id), "org_id": new_org.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.TokenResponse)
async def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user or not auth.verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": str(user.id), "org_id": user.organization_id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
async def get_me(current_user: models.User = Depends(get_current_user)):
    user_out = schemas.UserOut.model_validate(current_user)
    if current_user.organization:
        user_out.organization_name = current_user.organization.name
    return user_out
