from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

from transformers import pipeline

import os
os.environ["TRANSFORMERS_CACHE"] = "C:/Users/Administrator/.cache/huggingface"

generator = pipeline("text-generation", model="distilgpt2")

@app.route("/generate", methods=["POST"])
def generate_text():
    data = request.json
    prompt = data.get("prompt", "")
    try:
        # Generate text using the model
        result = generator(prompt, max_length=50, num_return_sequences=1)
        return jsonify({"response": result[0]["generated_text"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)