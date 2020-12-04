from app import db
from models.base import BaseModel
from models.user import User

class Contact(db.Model, BaseModel):
  __tablename__ = 'contacts'
  name = db.Column(db.String(40), nullable=False)
  birthday = db.Column(db.String(40), nullable=True)
  # wants = db.Column(db.ARRAY(db.String(40)), nullable=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  user = db.relationship('User', backref='contacts')