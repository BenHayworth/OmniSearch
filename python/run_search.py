from flask import Flask, jsonify, request

app = Flask(__name__)


@app.post("/search")
def search():
    body = request.get_json()

    print(body, flush=True)

    return jsonify({"message": "Hello from Python"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
