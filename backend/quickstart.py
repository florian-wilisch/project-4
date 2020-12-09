from __future__ import print_function
import datetime
import pickle
# import cPickle
import os.path
from app import db
from googleapiclient.discovery import build
# from google_auth_oauthlib.flow import flow
from google.auth.transport.requests import Request
import json
from models.user import User
from sqlalchemy.sql import select
# If modifying these scopes, delete the file token.pickle.
import google.oauth2.credentials
from google.oauth2 import service_account
import google_auth_oauthlib.flow
# SCOPES = ['https://www.googleapis.com/auth/calendar']

# SCOPES = ['https://www.googleapis.com/auth/sqlservice.admin']
# SERVICE_ACCOUNT_FILE = '/path/to/service.json'


# def main(event_request):
#     """Shows basic usage of the Google Calendar API.
#     Prints the start and name of the next 10 events on the user's calendar.
#     """
#     creds = None
#     # The file token.pickle stores the user's access and refresh tokens, and is
#     # created automatically when the authorization flow completes for the first
#     # time.

#     flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
#     'client_secret.json',
#     SCOPES)

#     flow.redirect_uri = 'https://www.example.com/oauth2callback'
#     authorization_url, state = flow.authorization_url(
#         # Enable offline access so that you can refresh an access token without
#         # re-prompting the user for permission. Recommended for web server apps.
#         access_type='offline',
#         # Enable incremental authorization. Recommended as a best practice.
#         include_granted_scopes='true')
    
#     # if os.path.exists('token.pickle'):
#     #     with open('token.pickle', 'rb') as token:
#     #         creds = (pickle.load(token))
#     #         str_token = creds.to_json()
#     #         print("PICKLE INFO", type(creds))
#     #         # print("PICKLE INFO", db.engine.execute(f"""UPDATE users FROM users SET google_Auth_Token = lopi WHERE id = 1;"""))
#     #         print("PICKLE INFO", db.engine.execute(f"""UPDATE users SET "google_Auth_Token" = '{str_token}' WHERE id = 2;"""))

#     #         # for i in len(creds):
#     #         #   print(creds[i])

#     # # If there are no (valid) credentials available, let the user log in.
#     # if not creds or not creds.valid:
#     #     if creds and creds.expired and creds.refresh_token:
#     #         creds.refresh(Request())
#     #     else:
#     #         flow = InstalledAppFlow.from_client_secrets_file(
#     #             'credentials.json', SCOPES)
#     #         creds = flow.run_local_server(port=0)
#     #     # Save the credentials for the next run
#     #     with open('token.pickle', 'wb') as token:
#     #         pickle.dump(creds, token)

#     service = build('calendar', 'v3', credentials=creds)
#     # print(creds.to_json())


#     # Call the Calendar API
#     now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
#     print('Getting the upcoming 10 events')
#     events_result = service.events().list(calendarId='primary', timeMin=now,
#                                         maxResults=10, singleEvents=True,
#                                         orderBy='startTime').execute()



#     event_request = service.events().insert(calendarId='primary', body=event_request).execute()

#     # add_event = service.events().insert(calendarId='primary', )
#     events = events_result.get('items', [])
#     # events.insert()
#     if not events:
#         print('No upcoming events found.')
#     for event in events:
#         start = event['start'].get('dateTime', event['start'].get('date'))
#         print(start, event['summary'])



# import google.oauth2.credentials
# import google_auth_oauthlib.flow
# import flask

# def main(event_request):
#   state = flask.session['state']
#   flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
#       'credentials.json',
#       scopes=['https://www.googleapis.com/auth/calendar'], state=state)
#   # flow.redirect_uri = 'http://localhost:8001'
#   flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

#   authorization_response = flask.request.url
#   flow.fetch_token(authorization_response=authorization_response)

#   credentials = flow.credentials
#   flask.session['credentials'] = {
#     'token': credentials.token,
#     'refresh_token': credentials.refresh_token,
#     'token_uri': credentials.token_uri,
#     'client_id': credentials.client_id,
#     'client_secret': credentials.client_secret,
#     'scopes': credentials.scopes}

#   service = build('calendar', 'v3', credentials=credentials)

#   # authorization_url, state = flow.authorization_url(
#   #     # Enable offline access so that you can refresh an access token without
#   #     # re-prompting the user for permission. Recommended for web server apps.
#   #     access_type='offline',
#   #     # Enable incremental authorization. Recommended as a best practice.
#   #     include_granted_scopes='true')
#       # Call the Calendar API
#   now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
#   print('Getting the upcoming 10 events')
#   events_result = service.events().list(calendarId='primary', timeMin=now,
#                                       maxResults=10, singleEvents=True,
#                                       orderBy='startTime').execute()


#   # return flask.redirect(authorization_url)


import os
import flask
import requests

import google.oauth2.credentials
import google_auth_oauthlib.flow
import googleapiclient.discovery

# # This variable specifies the name of a file that contains the OAuth 2.0
# # information for this application, including its client_id and client_secret.
# CLIENT_SECRETS_FILE = "credentials.json"

# # This OAuth 2.0 access scope allows for full read/write access to the
# # authenticated user's account and requires requests to use an SSL connection.
# SCOPES = ['https://www.googleapis.com/auth/calendar']
# API_SERVICE_NAME = 'calendar'
# API_VERSION = 'v3'

# app = flask.Flask(__name__)
# # Note: A secret key is included in the sample so that it works.
# # If you use this code in your application, replace this with a truly secret
# # key. See https://flask.palletsprojects.com/quickstart/#sessions.
# app.secret_key = 'random secret'

# def main():


#   @app.route('/')
#   def index():
#     return print_index_table()


#   @app.route('/test')
#   def test_api_request():
#     if 'credentials' not in flask.session:
#       return flask.redirect('authorize')

#     # Load credentials from the session.
#     credentials = google.oauth2.credentials.Credentials(
#         **flask.session['credentials'])

#     service = googleapiclient.discovery.build(
#         API_SERVICE_NAME, API_VERSION, credentials=credentials)


#     now = datetime.datetime.utcnow().isoformat() + 'Z' # 'Z' indicates UTC time
#         print('Getting the upcoming 10 events')
#         events_result = service.events().list(calendarId='primary', timeMin=now,
#                                             maxResults=10, singleEvents=True,
#                                             orderBy='startTime').execute()
#     # channel = youtube.channels().list(mine=True, part='snippet').execute()

#     # Save credentials back to session in case access token was refreshed.
#     # ACTION ITEM: In a production app, you likely want to save these
#     #              credentials in a persistent database instead.
#     flask.session['credentials'] = credentials_to_dict(credentials)

#     return flask.jsonify(**now)


#   @app.route('/authorize')
#   def authorize():
#     # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
#     flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
#         CLIENT_SECRETS_FILE, scopes=SCOPES)

#     # The URI created here must exactly match one of the authorized redirect URIs
#     # for the OAuth 2.0 client, which you configured in the API Console. If this
#     # value doesn't match an authorized URI, you will get a 'redirect_uri_mismatch'
#     # error.
#     flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

#     authorization_url, state = flow.authorization_url(
#         # Enable offline access so that you can refresh an access token without
#         # re-prompting the user for permission. Recommended for web server apps.
#         access_type='offline',
#         # Enable incremental authorization. Recommended as a best practice.
#         include_granted_scopes='true')

#     # Store the state so the callback can verify the auth server response.
#     flask.session['state'] = state

#     return flask.redirect(authorization_url)



#     # Specify the state when creating the flow in the callback so that it can
#     # verified in the authorization server response.
#     state = flask.session['state']

#     flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
#         CLIENT_SECRETS_FILE, scopes=SCOPES, state=state)
#     flow.redirect_uri = flask.url_for('oauth2callback', _external=True)

#     # Use the authorization server's response to fetch the OAuth 2.0 tokens.
#     authorization_response = flask.request.url
#     flow.fetch_token(authorization_response=authorization_response)

#     # Store credentials in the session.
#     # ACTION ITEM: In a production app, you likely want to save these
#     #              credentials in a persistent database instead.
#     credentials = flow.credentials
#     flask.session['credentials'] = credentials_to_dict(credentials)

#     return flask.redirect(flask.url_for('test_api_request'))


#   @app.route('/revoke')
#   def revoke():
#     if 'credentials' not in flask.session:
#       return ('You need to <a href="/authorize">authorize</a> before ' +
#               'testing the code to revoke credentials.')

#     credentials = google.oauth2.credentials.Credentials(
#       **flask.session['credentials'])

#     revoke = requests.post('https://oauth2.googleapis.com/revoke',
#         params={'token': credentials.token},
#         headers = {'content-type': 'application/x-www-form-urlencoded'})

#     status_code = getattr(revoke, 'status_code')
#     if status_code == 200:
#       return('Credentials successfully revoked.' + print_index_table())
#     else:
#       return('An error occurred.' + print_index_table())


#   @app.route('/clear')
#   def clear_credentials():
#     if 'credentials' in flask.session:
#       del flask.session['credentials']
#     return ('Credentials have been cleared.<br><br>' +
#             print_index_table())


#   def credentials_to_dict(credentials):
#     return {'token': credentials.token,
#             'refresh_token': credentials.refresh_token,
#             'token_uri': credentials.token_uri,
#             'client_id': credentials.client_id,
#             'client_secret': credentials.client_secret,
#             'scopes': credentials.scopes}

#   def print_index_table():
#     return ('<table>' +
#             '<tr><td><a href="/test">Test an API request</a></td>' +
#             '<td>Submit an API request and see a formatted JSON response. ' +
#             '    Go through the authorization flow if there are no stored ' +
#             '    credentials for the user.</td></tr>' +
#             '<tr><td><a href="/authorize">Test the auth flow directly</a></td>' +
#             '<td>Go directly to the authorization flow. If there are stored ' +
#             '    credentials, you still might not be prompted to reauthorize ' +
#             '    the application.</td></tr>' +
#             '<tr><td><a href="/revoke">Revoke current credentials</a></td>' +
#             '<td>Revoke the access token associated with the current user ' +
#             '    session. After revoking credentials, if you go to the test ' +
#             '    page, you should see an <code>invalid_grant</code> error.' +
#             '</td></tr>' +
#             '<tr><td><a href="/clear">Clear Flask session credentials</a></td>' +
#             '<td>Clear the access token currently stored in the user session. ' +
#             '    After clearing the token, if you <a href="/test">test the ' +
#             '    API request</a> again, you should go back to the auth flow.' +
#             '</td></tr></table>')


