import uuid
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os

from pdf_utils import extract_text, split_into_chunks
from embeddings import get_embeddings, build_faiss_index, search_index
from llm import ask_question, generate_quiz, generate_flashcards, generate_summary

# Load environment variables and configure Gemini API
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create FastAPI app with CORS enabled for React frontend
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for uploaded documents
documents = {}

# Request model for the ask endpoint
class AskRequest(BaseModel):
    document_id: str
    question: str

# Request model for document-based endpoints
class DocRequest(BaseModel):
    document_id: str

# Upload a PDF, extract text, chunk it, embed chunks, and build FAISS index
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    is_pdf = (file.content_type == "application/pdf") or (file.filename and file.filename.lower().endswith(".pdf"))
    if not is_pdf:
        raise HTTPException(400, "Only PDF files are allowed")
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "File size must be under 10 MB")
    try:
        text = extract_text(io.BytesIO(contents))
        chunks = split_into_chunks(text)
        embeddings = get_embeddings(chunks)
        index = build_faiss_index(embeddings)
        doc_id = str(uuid.uuid4())
        documents[doc_id] = {"chunks": chunks, "index": index}
        return {"document_id": doc_id, "chunks_count": len(chunks)}
    except Exception as e:
        raise HTTPException(500, f"Error processing PDF: {str(e)}")

# Answer a question using RAG: embed query, find top chunks, ask LLM
@app.post("/ask")
async def ask(req: AskRequest):
    if req.document_id not in documents:
        raise HTTPException(404, "Document not found")
    try:
        doc = documents[req.document_id]
        query_embedding = get_embeddings([req.question])[0]
        top_indices = search_index(doc["index"], query_embedding, k=3)
        source_chunks = [doc["chunks"][i] for i in top_indices]
        context = "\n\n".join(source_chunks)
        answer = ask_question(context, req.question)
        return {"answer": answer, "sources": source_chunks}
    except Exception as e:
        raise HTTPException(500, f"Error answering question: {str(e)}")

# Generate 5 MCQs from the document content
@app.post("/quiz")
async def quiz(req: DocRequest):
    if req.document_id not in documents:
        raise HTTPException(404, "Document not found")
    try:
        doc = documents[req.document_id]
        context = "\n\n".join(doc["chunks"][:6])
        questions = generate_quiz(context)
        return {"quiz": questions}
    except Exception as e:
        raise HTTPException(500, f"Error generating quiz: {str(e)}")

# Generate 10 flashcards from the document content
@app.post("/flashcards")
async def flashcards(req: DocRequest):
    if req.document_id not in documents:
        raise HTTPException(404, "Document not found")
    try:
        doc = documents[req.document_id]
        context = "\n\n".join(doc["chunks"][:6])
        cards = generate_flashcards(context)
        return {"flashcards": cards}
    except Exception as e:
        raise HTTPException(500, f"Error generating flashcards: {str(e)}")

# Generate a short summary of the document content
@app.post("/summary")
async def summary(req: DocRequest):
    if req.document_id not in documents:
        raise HTTPException(404, "Document not found")
    try:
        doc = documents[req.document_id]
        context = "\n\n".join(doc["chunks"][:6])
        result = generate_summary(context)
        return {"summary": result}
    except Exception as e:
        raise HTTPException(500, f"Error generating summary: {str(e)}")
