from celery import shared_task
import flask_excel as excel
from .models import User, Role, Product, Order
from jinja2 import Template
from .mail_service import send_message
from datetime import datetime, timedelta
from pytz import timezone
from dateutil.relativedelta import relativedelta
import calendar

@shared_task(ignore_result=False)
def products_csv():
    products = Product.query.with_entities(Product.product_name, Product.unit,Product.rate_per_unit,
                        Product.quantity,Product.quantity_sold,Product.manufacture_date,Product.expiry_date,).all()
    csv_output = excel.make_response_from_query_sets(
                    products, ["product_name", "unit", "rate_per_unit", "quantity", "quantity_sold", 
                               "manufacture_date", "expiry_date"], "csv")
    filename = "products.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename

@shared_task(ignore_result=True)
def daily_reminder(subject):
    now = datetime.now(timezone('Asia/Kolkata'))                # Get the current time
    users = User.query.filter(
          User.roles.any(Role.name == 'customer'),         # get all customers whose last activity was a day(24 hours) ago or before
          User.last_activity_timestamp <= now - timedelta(days=1)
          ).all()
    for user in users:
        with open('application/daily_reminder.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                         template.render(username=user.username))
    return "OK"

@shared_task(ignore_result=True)
def monthly_report(subject):
    now = datetime.now(timezone('Asia/Kolkata'))

    last_month = now - relativedelta(months=1)

    users = User.query.filter(User.roles.any(Role.name == 'customer')).all()

    for user in users:
        orders = Order.query.filter(     # Fetching orders from last month
            Order.user_id == user.id,
            Order.order_timestamp >= last_month,
            Order.order_timestamp < now
        ).all()

        total_expenditure = sum(order.amount for order in orders)         # Calculating total expenditure
        with open('application/monthly_report.html', 'r') as f:
            template = Template(f.read())
            html = template.render(orders=orders,user=user, total_expenditure=total_expenditure)
        send_message(user.email, subject, html)

    return "OK"