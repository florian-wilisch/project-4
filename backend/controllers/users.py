from flask import Blueprint, request
from models.user import User
from serializers.user import UserSchema
from serializers.user_populate import UserPopSchema
from serializers.contact import Contact

user_schema = UserSchema()
user_pop_schema = UserPopSchema()

router = Blueprint(__name__, 'users')

@router.route('/signup', methods=['POST'])
def signup():
  request_body = request.get_json()
  user = user_schema.load(request_body)
  user.save()
  return user_schema.jsonify(user), 200


@router.route('/login',methods=['POST'])
def login():
  data = request.get_json()
  user = User.query.filter_by(email=data['email']).first()

  if not user:
    return { 'message': 'No user found with this email'}, 200
  if not user.validate_password(data['password']):
    return {'message': ' Unauthorized'}, 402

  token = user.generate_token()

  return {'token': token, 'message': 'Welcome back'}

## Get USER
@router.route('/users/<int:id>', methods=['GET'])
# @secure_route
def get_single_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_schema.jsonify(user), 200

## Get Populated USER
@router.route('/users-pop/<int:id>', methods=['GET'])
# @secure_route
def get_single_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_pop_schema.jsonify(user), 200