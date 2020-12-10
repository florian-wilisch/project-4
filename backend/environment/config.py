import os

db_URI = os.getenv('DATABASE_URL', 'postgres://localhost:5432/users_db')
secret = os.getenv('SECRET', 'Secret code, hush hush')