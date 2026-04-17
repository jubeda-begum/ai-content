import React, { useState } from "react";

function App() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setOutput("");
    setCopied(false);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Content Generator",
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Write a catchy Instagram caption about "${topic}" with emojis and relevant hashtags.`,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        setOutput(`❌ ${data.error.message}`);
      } else {
        const text =
          data?.choices?.[0]?.message?.content ||
          "⚠️ No response generated.";

        setOutput(text);
      }
    } catch (error) {
      setOutput("⚠️ Error generating content. Please try again.");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTopic("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 AI Content Generator</h1>
        <p style={styles.subtitle}>
          Generate captions & hashtags instantly using AI
        </p>

        <input
          type="text"
          placeholder="Enter topic (e.g. fitness, coding, travel)"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setOutput("");
            setCopied(false);
          }}
          style={styles.input}
        />

        <button onClick={generateContent} style={styles.button}>
          {loading ? "⏳ Generating..." : "✨ Generate"}
        </button>

        {output && (
          <div style={styles.outputBox}>
            <p style={styles.outputText}>{output}</p>

            <div style={styles.buttonGroup}>
              <button onClick={handleCopy} style={styles.copyButton}>
                📋 Copy
              </button>

              <button onClick={handleClear} style={styles.clearButton}>
                🔄 Clear
              </button>
            </div>

            {copied && (
              <p style={styles.copiedText}>✅ Copied to clipboard</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "14px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#667eea",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "15px",
  },
  outputBox: {
    marginTop: "10px",
    padding: "15px",
    background: "#f5f5f5",
    borderRadius: "10px",
    textAlign: "left",
  },
  outputText: {
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "8px",
  },
  copyButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
  },
  clearButton: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#999",
    color: "#fff",
    cursor: "pointer",
  },
  copiedText: {
    color: "green",
    fontSize: "13px",
    marginTop: "5px",
  },
};

export default App;