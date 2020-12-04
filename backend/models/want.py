# from app import db
# from models.base import BaseModel

# class Want(db.Model, BaseModel):
#   __tablename__ = 'wants'
#   name = db.Column(db.String(40), unique=True, nullable=True)
#   contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
#   contact = db.relationship('Contact', backref='wants')