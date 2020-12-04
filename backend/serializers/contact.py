from app import ma
from serializers.base import BaseSchema
from marshmallow import fields
from models.contact import Contact

class ContactSchema(ma.SQLAlchemyAutoSchema, BaseSchema):
  class Meta:
    model = Contact
    load_instance = True
    load_only = ('user_id',)
  # user_id = fields.Integer()
  # user = fields.Nested('UserSchema', only=('id', 'username'))
  # user = fields.Nested('UserSchema', only=('id', 'username'))
  # wants = fields.Nested('WantSchema', many=True)
