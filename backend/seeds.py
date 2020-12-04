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
    name='Jon',
    birthday='02/03/2001',
    user=adam
  )
  
  friend2 = Contact(
    name='Bob',
    birthday='02/01/2010',
    user=florian,
    wants=['Book']
  )

  friend3 = Contact(
    name='Sarah',
    birthday='02/01/2010',
    user=florian,
    wants=['bike', 'laptop', 'helicopter']
  )
  
  db.session.add(friend1)
  db.session.add(friend2)
  db.session.add(friend3)
  db.session.commit()
  
  print('we have friends')