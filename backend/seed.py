import os
import sys
from sqlalchemy.orm import Session

# Add current directory to path for imports
sys.path.append(os.getcwd())

from database import SessionLocal, engine
import models, auth

def seed():
    db: Session = SessionLocal()
    
    try:
        # 1. Create Demo Organization
        org = db.query(models.Organization).filter(models.Organization.name == "Demo Store").first()
        if not org:
            org = models.Organization(name="Demo Store", default_low_stock_threshold=10)
            db.add(org)
            db.commit()
            db.refresh(org)
            print(f"Created Org: {org.name}")
        else:
            print(f"Org already exists: {org.name}")

        # 2. Create Demo User
        user = db.query(models.User).filter(models.User.email == "demo@stockflow.com").first()
        if not user:
            hashed_pwd = auth.hash_password("demo1234")
            user = models.User(
                email="demo@stockflow.com",
                password_hash=hashed_pwd,
                organization_id=org.id
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created User: {user.email}")
        else:
            print(f"User already exists: {user.email}")

        # 3. Create Demo Products
        products_data = [
            {"name": "Widget A", "sku": "WID-A", "quantity_on_hand": 50, "cost_price": 10.0, "selling_price": 20.0, "low_stock_threshold": 5},
            {"name": "Widget B", "sku": "WID-B", "quantity_on_hand": 3, "cost_price": 15.0, "selling_price": 30.0, "low_stock_threshold": 5}, # Low stock
            {"name": "Gadget X", "sku": "GAD-X", "quantity_on_hand": 100, "cost_price": 50.0, "selling_price": 80.0, "low_stock_threshold": 20},
            {"name": "Gadget Y", "sku": "GAD-Y", "quantity_on_hand": 8, "cost_price": 40.0, "selling_price": 70.0, "low_stock_threshold": None}, # Uses org default (10) -> Low stock
            {"name": "Super Tool", "sku": "TOOL-S", "quantity_on_hand": 2, "cost_price": 100.0, "selling_price": 200.0, "low_stock_threshold": 1},
        ]

        for p_data in products_data:
            existing_p = db.query(models.Product).filter(
                models.Product.organization_id == org.id,
                models.Product.sku == p_data["sku"]
            ).first()
            
            if not existing_p:
                p = models.Product(**p_data, organization_id=org.id)
                db.add(p)
                print(f"Created Product: {p.name}")
            else:
                print(f"Product already exists: {p_data['name']}")
        
        db.commit()
        print("Seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
