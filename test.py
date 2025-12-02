from transformers import pipeline

generator = pipeline("text-generation", model="gpt2")
result = generator("Write a haiku about AI", max_length=30, num_return_sequences=1)
print(result[0]["generated_text"])