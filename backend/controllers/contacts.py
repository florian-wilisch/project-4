from flask import Blueprint, request, g
from models.contact import Contact
from models.user import User
from serializers.user import UserSchema
from serializers.contact import ContactSchema
from marshmallow import ValidationError
from serializers.user_populate import UserPopSchema

user_schema = UserSchema()
user_pop_schema = UserPopSchema()
contact_schema = ContactSchema()
router = Blueprint(__name__, 'contacts')

## * Post single contact
@router.route('/users/<int:user_id>/contacts', methods=['POST'])
def contact_create(user_id):
  contact_data = request.get_json()
  user = User.query.get(user_id)
  contact = contact_schema.load(contact_data)
  contact.user = user
  contact.save()
  return contact_schema.jsonify(contact)



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


@router.route('/contacts/<int:contact_id>', methods=['GET'])
def get_single_contact(contact_id):
  contact = Contact.query.get(contact_id)
  print(contact)
  if not contact:
    return { 'message': 'contact does not exist' }, 404
  return contact_schema.jsonify(contact)


@router.route('/contacts/<int:contact_id>', methods=['DELETE'])
# @secure_route
def delete_single_contact(contact_id):
  contact = Contact.query.get(contact_id)

  # if contact.user != g.current_user:
  #   return { 'message': 'Unauthorized' }, 401
    
  contact.remove()
  return { 'message': f'Contact with id#{contact_id} was deleted successfully' }



# @router.route('/users/<int:user_id>/contacts/<int:contact_id>/wants', methods=['POST'])
# def add_wishlist(user_id, contact_id):
#   contact_wants = Contact.query.get(contact_id).wants
#   want_to_add = request.get_json()["wants"]
#   print(type(want_to_add))
#   print(type(request.get_json()))
#   try:
#     contact = contact_schema.load(
#       want_to_add,
#       instance=contact_wants,
#       partial=True
#     )
#   except ValidationError as e:
#     return { 'errors': e.messages, 'message': 'Something went wrong.' }

#   if contact_wants is None:
#     print('NO WANTS')
#     # contact = contact_schema.load(
      
#     # )
#   return contact_schema.jsonify(want_to_add, many=True), 200
  # try:
  #   contact = contact_schema.load(
  #     request.get_json(),
  #     instance=existing_contact,
  #     partial=True
  #   )
