import os
import json
import argparse
import importlib
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
app = FastAPI()
app.add_middleware(
CORSMiddleware,
allow_origins=["*"], # Allows all origins
allow_credentials=True,
allow_methods=["*"], # Allows all methods
allow_headers=["*"], # Allows all headers
)

# parser = argparse.ArgumentParser()
# parser.add_argument("--port", default=8081, type=int)
# parser.add_argument("--host", default="127.0.0.1", type=str)
# args = parser.parse_args()

# @app.on_event('startup')
# def startup():
#     ...


@app.post("/set_config")
def get_config_params(quer_msg:dict):
    print(quer_msg)
    return {
        "response": "ok", "code": 200
    }

# if __name__ == "__main__":
#     uvicorn.run(app="main:app", host=args.host, port=args.port, reload=True)

