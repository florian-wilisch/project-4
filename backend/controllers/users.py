from flask import Blueprint, request, g
from models.user import User
from models.contact import Contact
from serializers.user import UserSchema
from serializers.user_populate import UserPopSchema
from serializers.contact import ContactSchema
# from serializers.want import WantSchema
from marshmallow import ValidationError

user_schema = UserSchema()
user_pop_schema = UserPopSchema()
contact_schema = ContactSchema()

router = Blueprint(__name__, 'users')

@router.route('/signup', methods=['POST'])
def signup():
  request_body = request.get_json()
  user = user_schema.load(request_body)
  user.save()
  return user_schema.jsonify(user), 200


@router.route('/login', methods=['POST'])
def login():
  data = request.get_json()
  user = User.query.filter_by(email=data['email']).first()
  print(user)
  if not user:
    return { 'message': 'No user found with this email'}, 200
  if not user.validate_password(data['password']):
    return {'message': ' Unauthorized'}, 402
  token = user.generate_token()
  user_name = user.username
  user_id = user.id
  return {'token': token, 'user_name': user_name, 'user_id': user_id, 'message': 'Welcome back'}

## * Get USER
@router.route('/users-only/<int:id>', methods=['GET'])
# @secure_route
def get_single_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_schema.jsonify(user), 200


## * Get Populated USER
@router.route('/users/<int:id>', methods=['GET'])
# @secure_route
def get_single_pop_user(id):
  user = User.query.get(id)
  if not user:
    return { 'message': 'User not available' }, 404
  return user_pop_schema.jsonify(user), 200


## * Post single contact
@router.route('/users/<int:user_id>/contacts', methods=['POST'])
def contact_create(user_id):
  contact_data = request.get_json()
  user = User.query.get(user_id)
  contact = contact_schema.load(contact_data)
  contact.user = user
  contact.save()
  return contact_schema.jsonify(contact)


## Get single contact
## do we need this?


## * Update contact
@router.route('/users/<int:user_id>/contacts/<int:contact_id>', methods=['PUT'])
# @secure_route
def update_contact(user_id, contact_id):
  existing_contact = Contact.query.get(contact_id)
  print(request.get_json())
  try:
    contact = contact_schema.load(
      request.get_json(),
      instance=existing_contact,
      partial=True
    )
  except ValidationError as e:
    return { 'errors': e.messages, 'message': 'Something went wrong.' }

  # if contact.user != g.current_user:
  #   return { 'message': 'Unauthorized' }, 401

  contact.save()

  return contact_schema.jsonify(contact), 201

@router.route('/users/<int:user_id>/contacts', methods=['GET'])
def get_all_contacts(user_id):
  contact_list = []
  for contact in Contact.query.all():
    if contact.user_id == user_id:
      contact_list.append(contact)
  return contact_schema.jsonify(contact_list, many=True), 200
