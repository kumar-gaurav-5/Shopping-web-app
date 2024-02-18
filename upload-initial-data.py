from main import app
from application.sec import datastore
from application.models import db, Role, Category
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="manager", description="User is an Store Manager")
    datastore.find_or_create_role(name="customer", description="User is a Customer")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            username="Admin",email="admin@email.com", password=generate_password_hash("admin@123"), roles=["admin"])
    cat1 = Category(category_name ='category1',creator_id=1,is_approved=True)
    db.session.add(cat1)
    cat2 = Category(category_name ='category2',creator_id=1,is_approved=True)
    db.session.add(cat2)
    cat3 = Category(category_name ='category3',creator_id=1,is_approved=True)
    db.session.add(cat3)
    cat4 = Category(category_name ='category4',creator_id=1,is_approved=True)
    db.session.add(cat4)
    cat5 = Category(category_name ='category5',creator_id=1,is_approved=True)
    db.session.add(cat5)
    cat6 = Category(category_name ='category6',creator_id=1,is_approved=True)
    db.session.add(cat6)
    cat7 = Category(category_name ='category7',creator_id=1,is_approved=True)
    db.session.add(cat7)
    db.session.commit()