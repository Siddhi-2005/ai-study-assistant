import numpy as np
import faiss
import google.generativeai as genai

# Generate embeddings for a list of texts using Gemini API
def get_embeddings(texts):
    embeddings = []
    for text in texts:
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text
        )
        embeddings.append(result['embedding'])
    return embeddings

# Build a FAISS vector index from embeddings for fast search
def build_faiss_index(embeddings):
    dimension = len(embeddings[0])
    index = faiss.IndexFlatL2(dimension)
    vectors = np.array(embeddings, dtype="float32")
    index.add(vectors)
    return index

# Search the FAISS index and return indices of top-k similar chunks
def search_index(index, query_embedding, k=3):
    k = min(k, max(1, index.ntotal))
    query_vector = np.array([query_embedding], dtype="float32")
    distances, indices = index.search(query_vector, k)
    return [i for i in indices[0].tolist() if i >= 0]

