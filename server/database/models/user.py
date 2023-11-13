from peewee import CharField, IntegerField, DateTimeField, Model
import datetime

from .utils import BaseModel


class User(BaseModel):
    
    username = CharField(unique=True, primary_key=True)
    create_time = DateTimeField(default=datetime.datetime.now)
