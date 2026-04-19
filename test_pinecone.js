import { config } from 'dotenv';
config();

const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.VITE_PINECONE_API_KEY;
const PINECONE_HOST = process.env.VITE_PINECONE_HOST;
const EMBEDDING_MODEL = 'text-embedding-3-small';

async function getEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI error: ${err.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return data.data[0].embedding;
}

async function queryPinecone(embedding, topK = 3) {
  const response = await fetch(`${PINECONE_HOST}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': PINECONE_API_KEY,
    },
    body: JSON.stringify({
      vector: embedding,
      topK,
      includeMetadata: true,
      namespace: '',
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Pinecone query error: ${err.message || response.statusText}`);
  }
  const data = await response.json();
  return data.matches || [];
}

async function test() {
  try {
    const emb = await getEmbedding('PM Kisan');
    const matches = await queryPinecone(emb, 3);
    console.log(JSON.stringify(matches, null, 2));
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

test();
