from app import app, db
from models import User

with app.app_context():
    try:
        users = User.query.all()
        print(f"Total users found: {len(users)}")
        for user in users:
            print(f"ID: {user.id}, Email: {user.email}, Role: {user.role}")
    except Exception as e:
        print(f"Error querying users: {e}")
