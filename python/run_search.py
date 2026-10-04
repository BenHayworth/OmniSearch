from flask import Flask, jsonify, request
from pathlib import Path

app = Flask(__name__)

MAX_FILES = 1000


@app.post("/search")
def search():
    body = request.get_json()

    print(body, flush=True)

    path = Path(body["folder"])

    stack = []

    files = []

    stack.append(path)
    while stack and len(files) < MAX_FILES:
        current_folder = stack.pop()
        for item in current_folder.iterdir():
            if item.is_file():
                files.append(str(item))
                print(item, "FILE", flush=True)
                if len(files) >= MAX_FILES:
                    break
            elif item.is_dir() and not item.is_symlink():
                stack.append(item)
                print(item.name, "FOLDER", flush=True)

    return jsonify({"files": files})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
