"use client";

import { useState } from "react";
import { queryLlamaIndex } from "./actions";

export default function SandboxPage() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await queryLlamaIndex(question);
      setResponse(result);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>LlamaIndex Sandbox</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Ask a question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ marginLeft: "10px", width: "400px" }}
          />
        </label>
        <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
          {loading ? "Fetching..." : "Submit"}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
