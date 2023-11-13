import traceback

from peewee import chunked
from playhouse.shortcuts import model_to_dict

from ..models.config import Config


def create_config(model_info_list, user_info_list, username, config_name):
    try:
        return Config.create(model_info_list=model_info_list,
                      user_info_list=user_info_list,
                      config_name=config_name,
                      username=username)
        return True
    except:
        traceback.print_exc()
        return False

def delete_config(username, config_name):
    try:
        Config.delete(username=username, config_name=config_name)
        return True
    except:
        traceback.print_exc()
        return False

def get_config_by_username(username):
    try:
        configs = Config.select().where(Config.username==username)
        result = []
        for config in configs:
            config = model_to_dict(config)
            result.append(config)
        return result
    except:
        traceback.print_exc()
        return None