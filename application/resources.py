from flask_restful import Resource, Api, reqparse, fields, marshal, inputs
from flask_security import auth_required, roles_required, current_user, roles_accepted
from flask import request,jsonify
from sqlalchemy import or_,and_
from .models import Category, db, DeleteCategory, EditCategory, Product, Cart,User ,Order
from datetime import datetime
from pytz import timezone
from .instances import cache

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('category_name', type=str,help='Category Name Should be String', required=True)

class Creator(fields.Raw):
    def format(self, user):
        return user.email

categories_fields = {
    'category_id': fields.Integer,
    'category_name': fields.String,
    'is_approved': fields.Boolean,
    'creator': Creator
}

class CategoryRes(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        if "admin" in current_user.roles:
            all_categories = Category.query.filter(Category.is_approved == True).all()
        else:
            all_categories = Category.query.filter(
                or_(Category.is_approved == True, Category.creator == current_user)).all()
        if len(all_categories) > 0:
            return marshal(all_categories, categories_fields)
        else:
            return {"message": "No Category Found"}, 404
    
    @auth_required("token")
    @roles_accepted('admin', 'manager')
    def post(self):
        args = parser.parse_args()
        if "admin" in current_user.roles:
            category = Category(category_name=args.get("category_name"),is_approved=True, creator_id=current_user.id)
        else:
            category = Category(category_name=args.get("category_name"),is_approved=False, creator_id=current_user.id)   
        db.session.add(category)
        db.session.commit()
        cache.clear()
        return {"message": "Category Created"}
    
    @auth_required("token")
    def delete(self, category_id=None):
        if category_id is None:
            return {"message": "Category ID not passed"}, 400
        cat = Category.query.get(category_id)            #using get as category_id is primary key
        delcat = DeleteCategory.query.filter_by(category_id=category_id).first()          #not necessarily a primary key
        if cat:
            db.session.delete(cat)
            if delcat:
                 db.session.delete(delcat)
            db.session.commit()
            cache.clear()
            return {"message": "Category deleted successfully"}, 204
        else:
            return {"message": "Category not found"}, 404
        
    @auth_required("token")
    def put(self):
        data = request.get_json()
        category_id = data['category_id']
        category = Category.query.get(category_id)
        edit_cat = EditCategory.query.filter_by(category_id=category_id).first()
        if not category:
            return {"message": "Category not found"}, 404
        if category:
            category.category_name = data.get("category_name")
            if edit_cat:
               db.session.delete(edit_cat)
            db.session.commit()
            cache.clear()
            return {"message": "Category updated successfully"}
        else:
            return {"message": "Category not found"}, 404

api.add_resource(CategoryRes, '/get-category', '/get-category/<int:category_id>')

class Request_Category_Delete(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        category_id = data["category_id"]
        category_name = data["category_name"]
        category = DeleteCategory(category_id=category_id,category_name=category_name)   
        db.session.add(category)
        db.session.commit()
        return {"message": "Request Sent to Admin"}
    
api.add_resource(Request_Category_Delete, '/request-delete')

class Request_Category_Edit(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        category_id = data["category_id"]
        category_name = data["category_name"]
        category = EditCategory(category_id=category_id,category_name=category_name)   
        db.session.add(category)
        db.session.commit()
        return {"message": "Request Sent to Admin"}
    
api.add_resource(Request_Category_Edit, '/request-edit')
      
parser_prod = reqparse.RequestParser()
parser_prod.add_argument('product_name', type=str,help='Product Name Should be String', required=True)
parser_prod.add_argument('unit', type=str,help='Product Unit Should be String', required=True)
parser_prod.add_argument('rate_per_unit', type=float,help='Product Rate Should be Float', required=True)
parser_prod.add_argument('quantity', type=int,help='Product quantity Should be Integer', required=True)
parser_prod.add_argument('manufacture_date', type=inputs.date,help='Product Manufacture Should be Date', required=True)
parser_prod.add_argument('expiry_date', type=inputs.date,help='Product Expiry Should be Date', required=True)
parser_prod.add_argument('category_id', type=int, help='Category ID should be Integer',required=True)

class ProductRes(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self,category_id):
        products = Product.query.filter_by(category_id=category_id).all()
        if len(products) > 0:
            serialized_products = [{'product_id': p.product_id, 'product_name': p.product_name,'unit': p.unit,
                                    'rate_per_unit': p.rate_per_unit,'quantity': p.quantity,
                                    'manufacture_date': p.manufacture_date.isoformat() if p.manufacture_date else None,
                                    'expiry_date': p.expiry_date.isoformat() if p.expiry_date else None,
                                    'category_id': p.category_id,} for p in products]
            return serialized_products 
        else:
            return {'error':'No product found'},404
    
    
    @auth_required("token")
    def post(self):
        args = parser_prod.parse_args()
        product = Product(product_name=args.get("product_name"),unit=args.get("unit"),rate_per_unit=args.get("rate_per_unit"),
                          quantity=args.get("quantity"),manufacture_date=args.get("manufacture_date"), 
                          expiry_date=args.get("expiry_date"),category_id=args.get("category_id") )
        db.session.add(product)
        db.session.commit()
        cache.clear()
        return {"message": "Product Added"}
    
    @auth_required("token")
    def delete(self, product_id=None,category_id=None):
        if product_id is None:
            return {"message": "Product ID not passed"}, 400
        prod = Product.query.get(product_id)          
        if prod:
            db.session.delete(prod)
            db.session.commit()
            cache.clear()
            return {"message": "Product deleted successfully"}
        else:
            return {"message": "Product not found"}, 404

    @auth_required("token")
    def put(self):
        data = request.get_json()
        product_id = data['product_id']
        product = Product.query.get(product_id)
        if not product:
            return {"message": "product not found"}, 404
        if product:
            product.product_name = data.get("product_name")
            product.unit = data.get("unit")
            product.rate_per_unit = data.get('rate_per_unit')
            product.quantity = data.get('quantity')
            manufacture_date_str = data.get('manufacture_date')
            if manufacture_date_str:
                 product.manufacture_date = datetime.strptime(manufacture_date_str, '%Y-%m-%d').date()
            expiry_date_str = data.get('expiry_date')
            if expiry_date_str:
                 product.expiry_date = datetime.strptime(expiry_date_str, '%Y-%m-%d').date()
            db.session.commit()
            cache.clear()
            return {"message": "Product updated successfully"}
        else:
            return {"message": "Product not found"}, 404

api.add_resource(ProductRes, '/get-product', '/get-product/<int:category_id>','/get-product/<int:product_id>/<int:category_id>')

class Product_user_dash(Resource):
    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self):
        products = Product.query.all()
        if len(products) > 0:
            serialized_products = [{'product_id': p.product_id, 'product_name': p.product_name,'unit': p.unit,
                                    'rate_per_unit': p.rate_per_unit,'quantity': p.quantity,
                                    'manufacture_date': p.manufacture_date.isoformat() if p.manufacture_date else None,
                                    'expiry_date': p.expiry_date.isoformat() if p.expiry_date else None,
                                    'category_id': p.category_id,} for p in products]
            return serialized_products 
        else:
            return {'error':'No product found'},404
        
api.add_resource(Product_user_dash, '/allproducts')

class BuyNow(Resource):
    @auth_required("token")
    def get(self, user_id=None, product_id=None):
        if user_id is not None and product_id is not None:
            # Check if the product is already in the cart
            cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

            if cart_item:
                # If product already in cart, increment the quantity
                cart_item.product_quantity += 1
            else:
                cart_item = Cart(user_id=user_id, product_id=product_id, product_quantity=1)
                db.session.add(cart_item)
            db.session.commit()
    
    @auth_required("token")
    def put(self):
        data = request.get_json()
        user_id=current_user.id
        product_id = data['product_id']
        newquantity = int(data['newquantity'])
        cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        product = Product.query.get(product_id)
        if cart_item:
            cart_item.user_id=user_id
            cart_item.product_id=product_id
            if newquantity>0:
                 cart_item.product_quantity=newquantity
            else:
                 return {"message": "Quantity must be greater than 1"} ,400
            if product.quantity < newquantity:
                 return {"message": f"Only {product.quantity} available"} , 400
            db.session.commit()
            cache.clear()
            return {"message": "Quantity updated successfully"}
        else:
            return {"message":"Error updating quantity"} ,404
    
    @auth_required("token")
    def post(self):
        data = request.get_json()
        user_id = data['user_id']
        product_id = data['product_id']
        cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
        product = Product.query.get(product_id)
        user = User.query.get(user_id)
        if cart_item.product_quantity > product.quantity:
            return {"message": f"Only {product.quantity} available"} , 400
        if cart_item:
            product.quantity = product.quantity - cart_item.product_quantity
            product.quantity_sold = product.quantity_sold + cart_item.product_quantity
            user.last_activity_timestamp = datetime.now(timezone('Asia/Kolkata'))
            order = Order(user_id=user_id, product_id=product_id, product_name=product.product_name,
                          quantity=cart_item.product_quantity,amount=cart_item.product_quantity*product.rate_per_unit,
                          order_timestamp=datetime.now(timezone('Asia/Kolkata')))
            db.session.add(order)
            db.session.delete(cart_item)
            db.session.commit()
            cache.clear()
            return {"message": "purchase successfully processed"}
        else:
            return {"message":"Error during checkout"} ,404
    
api.add_resource(BuyNow, '/buynow/<int:user_id>/<int:product_id>','/buynow' )

class BuyNowProduct(Resource):
    @auth_required("token")
    def get(self,user_id,product_id):
       buynowproduct = Product.query.get(product_id)
       cart = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
       formatted_manufacture_date = buynowproduct.manufacture_date.strftime('%d %b %Y')
       formatted_expiry_date = buynowproduct.expiry_date.strftime('%d %b %Y')
       if buynowproduct and cart:
            return jsonify({
                "buynowproduct": {
                    "product_name": buynowproduct.product_name,
                    "unit": buynowproduct.unit,
                    "rate_per_unit": buynowproduct.rate_per_unit,
                    "manufacture_date": formatted_manufacture_date,
                    "expiry_date": formatted_expiry_date,
                },
                "cart": {
                    "product_quantity": cart.product_quantity,
                    "totalamount": (cart.product_quantity*buynowproduct.rate_per_unit)
                }
            })
       
api.add_resource(BuyNowProduct, '/buynowproduct/<int:user_id>/<int:product_id>')

class AddtoCart(Resource):
    @auth_required("token")
    def get(self, user_id=None, product_id=None):
        if user_id is not None and product_id is not None:
            # Check if the product is already in the cart
            cart_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()

            if cart_item:
                # If product already in cart, increment the quantity
                cart_item.product_quantity += 1
            else:
                cart_item = Cart(user_id=user_id, product_id=product_id, product_quantity=1)
                db.session.add(cart_item)
            db.session.commit()
            return {"message":"Product Added to Cart"}
        else:
            return {"message":"Error Adding to cart"} ,404
    
api.add_resource(AddtoCart, '/addtocart/<int:user_id>/<int:product_id>')

class CartedProducts(Resource):
    @auth_required("token")
    def get(self):
        user_id=current_user.id
        cart_products = Cart.query.filter_by(user_id=user_id).all()
        cart_products_list = []
        totalamount=0
        for c in cart_products:
            product = Product.query.get(c.product_id)
            formatted_manufacture_date = product.manufacture_date.strftime('%d %b %Y')
            formatted_expiry_date = product.expiry_date.strftime('%d %b %Y')
            # Add the cart item and product details to the list
            totalamount+=c.product_quantity*product.rate_per_unit
            cart_products_list.append({
                "product_id": product.product_id,
                "product_name": product.product_name,
                "unit": product.unit,
                "rate_per_unit": product.rate_per_unit,
                "available_quantity": product.quantity,
                "manufacture_date": formatted_manufacture_date,
                "expiry_date": formatted_expiry_date,
                "product_quantity": c.product_quantity,
                "quantity_sold": product.quantity_sold
            })

        return jsonify(cart_products=cart_products_list,totalamount=totalamount)
    
    def post(self):
           data = request.get_json()
           user_id=current_user.id
           for c in data:
               product_id = c['product_id']
               product_name =c['product_name']
               quantity_in_cart = int(c["product_quantity"])
               available_quantity = int(c["available_quantity"])
               quantity_sold = int(c["quantity_sold"])
               product = Product.query.get(product_id)
               if available_quantity < quantity_in_cart:
                   return {"message": f"Only {available_quantity} stock of {product_name} available"} , 400
               product.quantity = available_quantity-quantity_in_cart
               product.quantity_sold = quantity_sold + quantity_in_cart

               order = Order(user_id=user_id, product_id=product_id, product_name=product_name,
                          quantity=quantity_in_cart,amount=quantity_in_cart*product.rate_per_unit,
                          order_timestamp=datetime.now(timezone('Asia/Kolkata')))
               db.session.add(order)
               
           
           user_id=current_user.id
           user = User.query.get(user_id)
           user.last_activity_timestamp = datetime.now(timezone('Asia/Kolkata'))
           
           # Deleting all records
           db.session.query(Cart).delete()
           db.session.commit()
           cache.clear()
           return {"message":"Purchase Done"}
        
    
api.add_resource(CartedProducts, '/cartedproducts')

class Remove_product_FromCart(Resource):
    @auth_required("token")
    def get(self,product_id):
        user_id=current_user.id
        cart_product = Cart.query.filter_by(user_id=user_id,product_id=product_id).first()
        if not cart_product:
            return {'message':'Product not found in the cart'}
            
        else:
            db.session.delete(cart_product)
            db.session.commit()
    
    @auth_required("token")
    def delete(self):
        user_id=current_user.id
        cart_products = Cart.query.filter_by(user_id=user_id).all()
        if len(cart_products)>0:
             for c in cart_products:
                 db.session.delete(c)
             db.session.commit()
             return {'message':'Cart Cleared'}
        else:
            return {'message':'No Product found in your cart'}
        
        
api.add_resource(Remove_product_FromCart, '/removecartedproduct/<int:product_id>','/removecartedproduct')

class SearchCategory(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        search_query = data['query']
        results = []
        if ("admin" in current_user.roles) or ("customer" in current_user.roles):
            searchresult = db.session.query(Category).filter(and_(Category.category_name.contains(search_query), Category.is_approved==True)).all()
            for s in searchresult:
                results.append({'category_id':s.category_id,'category_name':s.category_name,
                            'creator_id':s.creator_id,'is_approved':s.is_approved})
        elif "manager" in current_user.roles:
            searchresult = db.session.query(Category).filter(
              or_(
                 and_(Category.category_name.contains(search_query), Category.is_approved==True),
                 and_(Category.category_name.contains(search_query), Category.is_approved==False, Category.creator_id==current_user.id)
                )).all()
            for s in searchresult:
                results.append({'category_id':s.category_id,'category_name':s.category_name,
                            'creator_id':s.creator_id,'is_approved':s.is_approved})
        cache.clear()
        return jsonify(results=results)

api.add_resource(SearchCategory,'/searchcategory')

class SearchProduct(Resource):
    @auth_required("token")
    def post(self):
        data = request.get_json()
        search_query = data['query']
        searchresult = db.session.query(Product).filter(Product.product_name.contains(search_query)).all()
        prod_results = []
        for s in searchresult:
            formatted_manufacture_date = s.manufacture_date.strftime('%d %b %Y')
            formatted_expiry_date = s.expiry_date.strftime('%d %b %Y')
            prod_results.append({'product_id':s.product_id,'product_name':s.product_name,
                            'unit':s.unit,'rate_per_unit':s.rate_per_unit,'quantity':s.quantity,
                            'manufacture_date':formatted_manufacture_date,
                            'expiry_date':formatted_expiry_date,'category_id':s.category_id})
        cache.clear()
        return jsonify(prod_results=prod_results)

api.add_resource(SearchProduct,'/searchproduct')