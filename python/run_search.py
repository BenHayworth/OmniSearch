from flask import Flask, jsonify, request
from pathlib import Path
import sqlite3
from contextlib import closing

app = Flask(__name__)

MAX_FILES = 1000
DB_PATH = Path(__file__).resolve().parent.parent / "knowledge.db"


def open_database():
    db = sqlite3.connect(DB_PATH)
    db.execute("CREATE TABLE IF NOT EXISTS files (path TEXT PRIMARY KEY, name TEXT NOT NULL)")
    return db


@app.route("/knowledge", methods=["GET", "POST", "DELETE"])
def knowledge():
    files = []
    if request.method in ("POST", "DELETE"):
        body = request.get_json(silent=True)
        files = body.get("files") if isinstance(body, dict) else None
        if (not isinstance(files, list) or (request.method == "POST" and len(files) > MAX_FILES)
                or not all(isinstance(file, str) and file.strip() for file in files)):
            return jsonify({"error": "Invalid file list."}), 400
    with closing(open_database()) as db:
        with db:
            before = db.total_changes
            if request.method == "DELETE":
                db.executemany("DELETE FROM files WHERE path = ?", [(file,) for file in files])
            else:
                db.executemany("INSERT OR IGNORE INTO files (path, name) VALUES (?, ?)",
                               [(file, Path(file).name) for file in files])
            added = db.total_changes - before
        saved = [dict(path=row[0], name=row[1]) for row in
                 db.execute("SELECT path, name FROM files ORDER BY name, path")]
    return jsonify({"files": saved, "added": added if request.method != "DELETE" else 0,
                    "deleted": added if request.method == "DELETE" else 0})


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
