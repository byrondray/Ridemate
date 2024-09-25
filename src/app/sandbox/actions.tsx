"use server";

import { OpenAI } from "llamaindex";
import { Document, VectorStoreIndex, Settings } from "llamaindex";

export async function queryLlamaIndex(question: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key is not set in environment variables.");
  }

  const openaiLLM = new OpenAI({ apiKey });
  Settings.llm = openaiLLM;

  const documents = [
    new Document({ text: "Square root of 144 is 12" }),
    new Document({ text: "This is the second document." }),
  ];

  const index = await VectorStoreIndex.fromDocuments(documents);

  const queryEngine = index.asQueryEngine();
  const result = await queryEngine.query({ query: question });

  return result.response;
}
