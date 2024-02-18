from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    last_activity_timestamp = db.Column(db.DateTime(timezone=True))
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    category_resource = db.relationship('Category', backref='creator')
    carts = db.relationship('Cart', backref='owner', lazy='dynamic')
    orders = db.relationship('Order', backref='user', lazy=True)
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Category(db.Model):
    category_id = db.Column(db.Integer, primary_key = True)
    category_name = db.Column(db.String, nullable = False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_approved = db.Column(db.Boolean())
    products = db.relationship('Product', backref='category', cascade='all, delete-orphan', lazy=True)

class DeleteCategory(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    category_id = db.Column(db.Integer, unique=True,nullable = False)
    category_name = db.Column(db.String, nullable = False)

class EditCategory(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    category_id = db.Column(db.Integer, unique=True,nullable = False)
    category_name = db.Column(db.String, nullable = False)
    
class Product(db.Model):
   product_id = db.Column(db.Integer, primary_key = True)
   product_name = db.Column(db.String, nullable = False)
   unit = db.Column(db.String, nullable=False)
   rate_per_unit = db.Column(db.Float, nullable=False)
   quantity = db.Column(db.Integer, nullable=False)
   manufacture_date = db.Column(db.Date)
   expiry_date = db.Column(db.Date)
   category_id = db.Column(db.Integer, db.ForeignKey('category.category_id', ondelete='CASCADE'), nullable=False)
   quantity_sold = db.Column(db.Integer,nullable=False,default=0)
   carts = db.relationship('Cart', backref='prod', lazy='dynamic')
   orders = db.relationship('Order', backref='product', lazy=True)

class Cart(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'), primary_key=True)
    product_quantity = db.Column(db.Integer, nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'), nullable=False)
    product_name = db.Column(db.String, nullable = False)
    quantity = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    order_timestamp = db.Column(db.DateTime(timezone=True))
    