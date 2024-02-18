from flask import current_app as app, jsonify, request,send_file ,render_template
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from .models import User,Role, db, Category, DeleteCategory, EditCategory

from .sec import datastore
from flask_restful import marshal, fields

import flask_excel as excel
from celery.result import AsyncResult
from .tasks import products_csv
from datetime import datetime
from pytz import timezone
from .instances import cache

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')




import re

def is_valid_email(email):
    # Regular expression for a basic email validation
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    
    # Check if the email matches the pattern
    return re.match(email_regex, email) is not None


@app.route('/user-login', methods=['POST'])
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "Email not provided"}), 400
    
    if not is_valid_email(email):
            return jsonify({"message": "Email type is invalid"}), 400
    
    if not data.get("password"):
        return jsonify({"message": "Password not entered"}), 400
    
    

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")) and user.active == True:
        user.last_activity_timestamp = datetime.now(timezone('Asia/Kolkata'))
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    
    elif user.active == False:
        return jsonify({"message":"Account is not approved by Admin."}), 404
        
    elif not check_password_hash(user.password, data.get("password")):
        return jsonify({"message": "Wrong Password"}), 400
    
    

@app.route('/user-register', methods=['POST'])
def user_register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username:
        return jsonify({"message": "Username not provided"}), 400
    
    if not email:
        return jsonify({"message": "Email not provided"}), 400
    
    if not is_valid_email(email):
            return jsonify({"message": "Email type is invalid"}), 400
    
    if not password:
        return jsonify({"message": "Password not provided"}), 400

    # Check if the role is valid
    if role not in ['manager', 'customer']:
        return jsonify({"message": "Invalid role"}), 400
    
    # Check if the email already exists
    existing_user = datastore.find_user(email=email)
    if existing_user:
        return jsonify({"message": "Email already exists."}), 400

    # Create a new user
    
    datastore.create_user(
            username=username,email=email, password=generate_password_hash(password),active = role == 'customer', roles=[role])

    # Setting active status based on the role
   

    db.session.commit()

    return jsonify({"message": "User registered successfully"})    

@app.get('/activate/manager/<int:manager_id>')
@auth_required("token")
@roles_required("admin")
def activate_instructor(manager_id):
    manager = User.query.get(manager_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({"message": "Manager not found"}), 404

    manager.active = True
    db.session.commit()
    return jsonify({"message": "Manager Account Approved"})

manager_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}

category_fields = {
    "category_id": fields.Integer,
    "category_name": fields.String,
    "is_approved": fields.Boolean
}


@app.get('/manager')
@auth_required("token")
@roles_required("admin")
def all_managers():
    managers = User.query.filter(User.roles.any(Role.name == 'manager')).all()
    if len(managers) == 0:
        return jsonify({"message": "No Manager Found"}), 404
    return marshal(managers, manager_fields)

@app.get('/category_false')
@auth_required("token")
@roles_required("admin")
def all_false_category():
    category = Category.query.filter(Category.is_approved==False).all()
    if len(category) == 0:
        return jsonify({"message": "No new create category request"}), 404
    return marshal(category, category_fields)



@app.get('/approve/category/<int:category_id>')
@auth_required("token")
@roles_required("admin")
def approve_create_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    category.is_approved = True
    db.session.commit()
    cache.clear()
    return jsonify({"message": "Category Creation Approved"})

delete_category_fields = {
    "category_id": fields.Integer,
    "category_name": fields.String,
}

@app.get('/get-delete-category')
@auth_required("token")
@roles_required("admin")
def Alldelete_category():
    delete_category = DeleteCategory.query.all()
    if len(delete_category) == 0:
        return jsonify({"message": "No new delete category request"}), 404
    return marshal(delete_category, delete_category_fields)

@app.get('/get-edit-category')
@auth_required("token")
@roles_required("admin")
def Alledit_category():
    edit_category = EditCategory.query.all()
    if len(edit_category) == 0:
        return jsonify({"message": "No new edit category request"}), 404
    return marshal(edit_category, delete_category_fields)   #fields same as delete_category_fields
    
@app.get('/current_user')
@auth_required("token")
def currentuser():
     user_id=current_user.id
     user = User.query.filter_by(id=user_id).first()
     return jsonify(user_id=user_id,username=user.username)


@app.get('/download_product_details')
def download_products_details():
    task = products_csv.delay()
    return jsonify({"task-id": task.id})

@app.get('/get_csv_file/<task_id>')
def get_csvFile(task_id):
    response = AsyncResult(task_id)
    if response.ready():
        filename = response.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": "Waiting to download..."}), 404
    
@app.route('/clear-cache')
def clear_cache():
    cache.clear()
    return 'Cache cleared'