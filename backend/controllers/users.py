from flask import Blueprint, request, g
from models.user import User
from models.contact import Contact
from serializers.user import UserSchema
from serializers.user_populate import UserPopSchema
from serializers.contact import ContactSchema
# from serializers.want import WantSchema
from marshmallow import ValidationError
# from quickstart import main
from middleware.secure_route import secure_route
import re

user_schema = UserSchema()
user_pop_schema = UserPopSchema()
contact_schema = ContactSchema()

router = Blueprint(__name__, 'users')

@router.route('/signup', methods=['POST'])
def signup():
  request_body = request.get_json()
  username = User.query.filter_by(username=request_body['username']).first()
  if username:
    return { 'message': 'This username already exists. Please choose another one.'}, 400
  find_email = User.query.filter_by(email=request_body['email']).first()
  if find_email:
    return { 'message': 'This email is already registered. Please go to login.'}, 400
  email = request_body['email']
  match = re.search(r'\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b', email, re.I)
  if not match:
    return { 'message': 'Please use a valid email address.'}, 400
  user = user_schema.load(request_body)
  user.save()
  return user_schema.jsonify(user), 200


@router.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  user = User.query.filter_by(email=data['email']).first()
  print(user)
  if not user:
    return { 'message': 'No user found with this email'}, 404
  if not user.validate_password(data['password']):
    return {'message': ' Unauthorized'}, 401
  token = user.generate_token()
  user_name = user.username
  user_id = user.id
  return {'token': token, 'user_name': user_name, 'user_id': user_id, 'message': 'Welcome back'}

## * Get USER
@router.route('/users-only/<int:id>', methods=['GET'])
@secure_route
def get_single_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_schema.jsonify(user), 200


## * Get Populated USER
@router.route('/users/<int:id>', methods=['GET'])
@secure_route
def get_single_pop_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_pop_schema.jsonify(user), 200


