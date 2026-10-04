from flask import Flask, jsonify, request
import os
from pathlib import Path

app = Flask(__name__)


@app.post("/search")
def search():
    body = request.get_json()

    print(body, flush=True)

    path = Path(body["folder"])

    folders = [
        name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))
    ]
    files = []

    for item in path.iterdir():
        if item.is_file():
            files.append(item.name)
            print(item.name, "FILE", flush=True)
        elif item.is_dir():
            print(item.name, "FOLDER", flush=True)

    return jsonify({"files": str(files)})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
