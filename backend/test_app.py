import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    print("--- Starting End-to-End API Tests ---")
    
    # 1. Upload Test
    print("\n1. Testing POST /upload...")
    with open("sample_study_notes.pdf", "rb") as f:
        response = requests.post(f"{BASE_URL}/upload", files={"file": ("sample_study_notes.pdf", f, "application/pdf")})
    
    if response.status_code != 200:
        print(f"FAIL: /upload returned status {response.status_code}: {response.text}")
        return False
    
    upload_data = response.json()
    doc_id = upload_data.get("document_id")
    print(f"PASS: Upload successful! document_id={doc_id}, chunks={upload_data.get('chunks_count')}")
    
    # 2. Ask Question Test
    print("\n2. Testing POST /ask...")
    ask_payload = {
        "document_id": doc_id,
        "question": "How many layers does the OSI model have?"
    }
    response = requests.post(f"{BASE_URL}/ask", json=ask_payload)
    if response.status_code != 200:
        print(f"FAIL: /ask returned status {response.status_code}: {response.text}")
        return False
    
    ask_data = response.json()
    print(f"PASS: /ask successful!")
    print(f"Answer snippet: {ask_data.get('answer', '')[:100]}...")
    
    # 3. Quiz Test
    print("\n3. Testing POST /quiz...")
    doc_payload = {"document_id": doc_id}
    response = requests.post(f"{BASE_URL}/quiz", json=doc_payload)
    if response.status_code != 200:
        print(f"FAIL: /quiz returned status {response.status_code}: {response.text}")
        return False
    
    quiz_data = response.json()
    quiz_items = quiz_data.get("quiz", [])
    print(f"PASS: /quiz successful! Generated {len(quiz_items)} questions.")
    
    # 4. Flashcards Test
    print("\n4. Testing POST /flashcards...")
    response = requests.post(f"{BASE_URL}/flashcards", json=doc_payload)
    if response.status_code != 200:
        print(f"FAIL: /flashcards returned status {response.status_code}: {response.text}")
        return False
    
    flash_data = response.json()
    cards = flash_data.get("flashcards", [])
    print(f"PASS: /flashcards successful! Generated {len(cards)} flashcards.")
    
    # 5. Summary Test
    print("\n5. Testing POST /summary...")
    response = requests.post(f"{BASE_URL}/summary", json=doc_payload)
    if response.status_code != 200:
        print(f"FAIL: /summary returned status {response.status_code}: {response.text}")
        return False
    
    summary_data = response.json()
    summary_text = summary_data.get("summary", "")
    print(f"PASS: /summary successful!")
    print(f"Summary snippet: {summary_text[:100]}...")
    
    print("\n--- ALL TESTS PASSED SUCCESSFULLY! ---")
    return True

if __name__ == "__main__":
    run_tests()
