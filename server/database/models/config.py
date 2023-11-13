from peewee import  DateTimeField, TextField, ForeignKeyField, AutoField
import datetime

from .utils import BaseModel, JSONField
from .user import User

class Config(BaseModel):
    
    config_id = AutoField(primary_key=True)
    config_name = TextField(null=True)
    model_info_list = JSONField()
    user_info_list = JSONField()
    username = ForeignKeyField(User, backref='config') # User 表外键关联
    create_time = DateTimeField(default=datetime.datetime.now)
