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



#! PYTHON TEST ZONE

@router.route('/users/test', methods=['POST'])
def test_python():
  #Logs in the user with googleAuth2.0 and checks if they have upcoming events 
  #check the backend console for result
  #Currently being called from homepage button
  event_request = request.get_json()
  print(event_request)
  main(event_request)
  return 'WORKS' , 200






#! Scopes:
#! use readonly to check if event has been added to calendar. if not change the readonly to readwrite, and add event
# Docs to keep track of

# auth calls and scopes: https://developers.google.com/calendar/auth
# events.insert info: https://developers.google.com/calendar/create-events?hl=en_US

#! event creation template (v1): 

#! Make location, end, attendees and time optional.
#! This is for a onetime event

# event = {
#   'summary': 'Google I/O 2015',
#   'location': '800 Howard St., San Francisco, CA 94103',
#   'description': 'A chance to hear more about Google\'s developer products.',
#   'start': {
#     'dateTime': '2015-05-28T09:00:00-07:00',
#     'timeZone': 'America/Los_Angeles',
#   },
#   'end': {
#     'dateTime': '2015-05-28T17:00:00-07:00',
#     'timeZone': 'America/Los_Angeles',
#   },
#   'recurrence': [
#     'RRULE:FREQ=DAILY;COUNT=2'
#   ],
#   'attendees': [
#     {'email': 'lpage@example.com'},
#     {'email': 'sbrin@example.com'},
#   ],
#   'reminders': {
#     'useDefault': False,
#     'overrides': [
#       {'method': 'email', 'minutes': 24 * 60},
#       {'method': 'popup', 'minutes': 10},
#     ],
#   },
# }

# event = service.events().insert(calendarId='primary', body=event).execute()
# print 'Event created: %s' % (event.get('htmlLink'))