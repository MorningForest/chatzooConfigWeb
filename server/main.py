import os
import argparse
import uvicorn

from loguru import logger
from peewee import SqliteDatabase
from playhouse.shortcuts import model_to_dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.crud.user_crud import update_or_create_username, adjust_username_in_user
from database.crud.config_crud import get_config_by_username, create_config
from database.models.user import User
from database.models.config import Config

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

parser = argparse.ArgumentParser()
parser.add_argument("--port", default=8081, type=int)
parser.add_argument("--host", default="127.0.0.1", type=str)
parser.add_argument("--db_path", default="./data.db", type=str)
parser.add_argument("--db_dtype", default="sqlite", type=str)
args = parser.parse_args()
db = None

def initial_database(database_path, db_type='sqlite'):

    db = SqliteDatabase(database_path)
    print(db)
    User._meta.database = db
    Config._meta.database = db
    db.connect()
    db.create_tables([User, Config])
    return db

def init_user(users):
    for idx, user in enumerate(users):
        result = update_or_create_username(user)
        logger.info(f"{idx} : {result}")

def init_folder(username: str):
    if  not os.path.exists("tmp"):
        os.makedirs("tmp")
    new_folder = os.path.join("tmp", username)
    if not os.path.exists(new_folder):
        os.makedirs(new_folder)
    return new_folder

def covert_config_to_py(folder_path, file_name, model_info_list, user_info_list, port):
    new_folder = init_folder(folder_path)
    file_name = os.path.join(new_folder, file_name)
    with open(file_name, "w", encoding="utf8") as fp:
        fp.write(f"model_list = {model_info_list}\n")
        fp.write(f"user_list = {user_info_list}\n")
        fp.write(f"host_name = '10.140.60.23'\n")
        fp.write(f"port = {8081+port}\n")
        fp.write(f"mode = 'evaluation'\n")
        fp.write(f"database_dtype = 'sqlite\n'")
        fp.write(f"database_path = './data.db\n'")
        

# 启动进程
@app.on_event("startup")
async def app_start():
    global db
    logger.info("------Init----------")
    user_list = ["hjw", "ghl"]
    db = initial_database(args.db_path, args.db_dtype)
    init_user(user_list)

@app.post("/login")
async def login_web(quer_msg: dict):
    global db
    logger.info(quer_msg)
    username = quer_msg.get("username")
    users = User.select().get()
    logger.info(users)
    valid = adjust_username_in_user(username)
    logger.info(f"当前的登录状态 --> {valid}")
    if valid[0]:
        return {
            "response": "ok", "code": 200
        }
    else:
        return {
            "response": "ok", "code": 400
        }


@app.get("/user_config")
def get_user_config(username):
    configs = get_config_by_username(username)
    logger.info(configs)
    return {
        "response": "ok", "code": 200,
        "data": {"data": configs}
    }

@app.post("/set_config")
def get_config_params(quer_msg:dict):
    
    def check_model_info(model_info_list: list):
        vaild = True
        for model_info in model_info_list:
            if not os.path.exists(model_info["model_name_or_path"]):
                vaild &= False
        return vaild
    
    model_info_list = quer_msg.get("modelInfo")
    user_info_list = quer_msg.get("userInfo")
    config_name = quer_msg.get("config_name")
    username = quer_msg.get("username")
    valid = check_model_info(model_info_list)
    if valid:
        flag = create_config(model_info_list, user_info_list, username, config_name)
        covert_config_to_py(username, f"{flag}.py", model_info_list, user_info_list, flag.config_id)
        logger.info(f"数据检测正确 : {flag} {flag.config_id}")
        return {
            "response": "ok", "code": 200
        }
    else:
        logger.error("模型路径存在问题，需要重新修改")
        return {
            "response": "error", "code": 200
        }

if __name__ == "__main__":
    uvicorn.run(app="main:app", host=args.host, port=args.port, reload=True)

