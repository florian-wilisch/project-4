from app import app, db
from models.user import User
from models.contact import Contact
# from models.want import Want

with app.app_context():
  db.drop_all()
  db.create_all()

  adam = User(
    username='adam',
    email='adam@gmail.com',
    password='pass'
  )

  florian = User(
    username='florian',
    email='florian@gmail.com',
    password='pass'
  )

  adam.save()
  florian.save()
  
  print('starting users created')
  

  friend1 = Contact(
    name='jon',
    birthday='02/03/2001',
    user=adam,
    wants = []
  )

  friend4 = Contact(
    name='george',
    birthday='02/03/2001',
    user=adam,
    wants = []
  )
  
  friend2 = Contact(
    name='bob',
    birthday='02/01/2010',
    user=florian,
    wants=['Book']
  )

  friend3 = Contact(
    name='Sarah',
    birthday='02/04/2004',
    user=florian,
    wants=['bike', 'laptop', 'helicopter']
  )
  
  db.session.add_all([friend1,friend2,friend3,friend4])
  db.session.commit()
  
  print('we have friends')