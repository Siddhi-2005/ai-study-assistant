import json
import google.generativeai as genai

# Call Gemini LLM with a prompt and return the text response
def call_llm(prompt):
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    return response.text

# Answer a question using only the provided context chunks
def ask_question(context, question):
    prompt = f"""Answer the question using ONLY the context below.
If the answer is not found in the context, say "I don't know based on the provided document."

Context:
{context}

Question: {question}

Answer:"""
    return call_llm(prompt)

# Helper function to extract and parse JSON array from LLM response
def parse_json_response(text):
    text = text.strip()
    start = text.find('[')
    end = text.rfind(']')
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start:end+1])
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())

# Generate 5 MCQs from the context as a JSON array
def generate_quiz(context):
    prompt = f"""Based on the following content, generate exactly 5 multiple choice questions.
Return ONLY a JSON array with this format:
[{{"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": "A", "explanation": "..."}}]

Content:
{context}"""
    response = call_llm(prompt)
    return parse_json_response(response)

# Generate 10 flashcards from the context as a JSON array
def generate_flashcards(context):
    prompt = f"""Based on the following content, generate exactly 10 flashcards for studying.
Return ONLY a JSON array with this format:
[{{"front": "question or term", "back": "answer or definition"}}]

Content:
{context}"""
    response = call_llm(prompt)
    return parse_json_response(response)

# Generate a short summary of the content
def generate_summary(context):
    prompt = f"""Provide a clear and concise summary of the following content in 5-8 sentences.

Content:
{context}"""
    return call_llm(prompt)
