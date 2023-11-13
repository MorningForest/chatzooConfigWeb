import traceback

from peewee import chunked

from ..models.user import User


def create_user(username):
    try:
        User.create(username=username)
        return True
    except:
        traceback.print_exc()
        return False

def delete_user_by_username(username: str):
    try:
        User.delete(User.username == username)
        return True
    except:
        traceback.print_exc()
        return False

def update_user(username: str):
    try:
        User.update(username=username)
        return True
    except:
        traceback.print_exc()
        return False

def read_user_by_username(username: str):
    try:
        return User.select().where(User.username == username)
    except:
        traceback.print_exc()
        return None

def read_all_users():
    try:
        return User.select()
    except:
        traceback.print_exc()
        return None

def adjust_username_in_user(username: str):
    # 判断username是否存在
    try:
        query = User.select().where(User.username == username).get()
        return True, query
    except:
        return False, None

def update_or_create_username(username):
    try:
        return User.select().where(User.username == username).get()
    except:
        print("create")
        return User.create(username=username)

def insert_many_users(batch_data, chunk_num):
    try:
        for data_chunk in chunked(batch_data, chunk_num):
            User.insert_many(data_chunk).execute()
        return True
    except:
        traceback.print_exc()
        return False
