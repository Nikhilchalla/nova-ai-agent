import { useState, useRef, useEffect } from "react";

const AGENT_TOOLS = [
  { id: "web_search", icon: "⌕", label: "Web Search", color: "#c9a96e" },
  { id: "summarize", icon: "◈", label: "Summarize", color: "#c9a96e" },
  { id: "analyze", icon: "◎", label: "Analyze", color: "#c9a96e" },
  { id: "code", icon: "⟨⟩", label: "Write Code", color: "#c9a96e" },
  { id: "plan", icon: "◻", label: "Plan", color: "#c9a96e" },
];

const SYSTEM_PROMPT = `You are NOVA — a Neural Optimized Velocity Agent. You are creative, fast, and brilliantly intelligent.

When responding:
- Be direct and concise but thorough
- Use markdown formatting (bold, bullets, code blocks) where helpful
- If asked to search the web, use your web_search tool
- Break complex problems into clear steps
- Show your reasoning when it adds value
- Always aim to be genuinely useful, not just informative

You have access to web search. Use it for current events, facts you're unsure about, or when the user asks you to look something up.`;

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "12px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#c9a96e",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function formatMessage(text) {
  return text
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre style="background:#1a1a1a;padding:16px;border-radius:4px;overflow-x:auto;font-family:\'Courier New\',monospace;font-size:13px;border-left:3px solid #c9a96e;margin:12px 0;line-height:1.6"><code style="color:#e8dcc8">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:#1a1a1a;padding:2px 7px;border-radius:3px;font-family:\'Courier New\',monospace;font-size:13px;color:#c9a96e">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#f0e6d3;font-weight:600">$1</strong>')
    .replace(/^### (.+)$/gm, '<div style="color:#c9a96e;margin:16px 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:500">$1</div>')
    .replace(/^## (.+)$/gm, '<div style="color:#f0e6d3;margin:16px 0 8px;font-size:16px;font-weight:600;border-bottom:1px solid #2a2a2a;padding-bottom:6px">$1</div>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:10px;margin:5px 0;align-items:flex-start"><span style="color:#c9a96e;margin-top:1px;font-size:10px">◆</span><span style="color:#b8a99a">$1</span></div>')
    .replace(/^\d+\. (.+)$/gm, '<div style="display:flex;gap:10px;margin:5px 0"><span style="color:#c9a96e;min-width:16px;font-size:12px">›</span><span style="color:#b8a99a">$1</span></div>')
    .replace(/\n/g, '<br/>');
}

function MessageBubble({ msg, index }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <div style={{
        textAlign: "center", padding: "4px 0", margin: "12px 0",
        fontSize: 11, color: "#3a3a3a", letterSpacing: "1.5px",
        textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
        {msg.content}
        <div style={{ flex: 1, height: "1px", background: "#1e1e1e" }} />
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      gap: 14, marginBottom: 28,
      animation: `fadeUp 0.4s ease-out ${index * 0.05}s both`
    }}>
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isUser ? "#1a1a1a" : "#1a1a1a",
        border: isUser ? "1px solid #2a2a2a" : "1px solid #c9a96e33",
        fontSize: isUser ? 13 : 15,
        color: isUser ? "#666" : "#c9a96e",
        marginTop: 2
      }}>
        {isUser ? "↑" : "✦"}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        <div style={{
          fontSize: 11, color: "#3a3a3a", marginBottom: 6,
          letterSpacing: "1px", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8
        }}>
          {isUser ? "You" : "Nova"}
          {msg.toolUsed && (
            <span style={{
              color: "#c9a96e", fontSize: 10, letterSpacing: "1px",
              border: "1px solid #c9a96e33", borderRadius: 2,
              padding: "1px 6px"
            }}>⚡ {msg.toolUsed}</span>
          )}
        </div>
        <div style={{
          background: isUser ? "#141414" : "transparent",
          border: isUser ? "1px solid #222" : "none",
          borderRadius: isUser ? 8 : 0,
          borderLeft: isUser ? undefined : "2px solid #c9a96e33",
          padding: isUser ? "12px 16px" : "4px 0 4px 16px",
          color: "#b8a99a", fontSize: 14, lineHeight: 1.8,
        }}
          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
        />
        <div style={{ fontSize: 10, color: "#2e2e2e", marginTop: 5, paddingLeft: isUser ? 0 : 16 }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

export default function AIAgent() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Nova initialized • ready" },
    {
      role: "assistant",
      content: "Hello. I'm **NOVA** — your Neural Optimized Velocity Agent.\n\nI can search the web, write code, analyze data, build plans, and much more. What shall we work on?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { role: "user", content: userText, time: timeStr }]);
    setInput("");
    setIsLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const newHistory = [...conversationHistory, { role: "user", content: userText }];

    let enhancedContent = userText;
    if (selectedTool === "web_search") enhancedContent = `[Use web search to answer this] ${userText}`;
    else if (selectedTool === "code") enhancedContent = `[Write working code for this] ${userText}`;
    else if (selectedTool === "plan") enhancedContent = `[Create a detailed step-by-step plan for this] ${userText}`;
    else if (selectedTool === "summarize") enhancedContent = `[Provide a clear, structured summary] ${userText}`;
    else if (selectedTool === "analyze") enhancedContent = `[Provide deep analysis with insights] ${userText}`;

    const apiHistory = newHistory.map((m, i) =>
      i === newHistory.length - 1 ? { ...m, content: enhancedContent } : m
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...apiHistory
          ]
        })
      });

      const data = await response.json();
      console.log("STATUS:", response.status);
      console.log("DATA:", JSON.stringify(data));

      const textBlocks = data.choices?.[0]?.message?.content || "";
      const usedSearch = false;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: textBlocks || "I encountered an issue. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolUsed: usedSearch ? "Web Search" : selectedTool ? AGENT_TOOLS.find(t => t.id === selectedTool)?.label : null
      }]);
      setConversationHistory([...newHistory, { role: "assistant", content: textBlocks }]);
      setSelectedTool(null);

    } catch (err) {
      console.log("CATCH ERROR:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error: " + err.message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }

    setIsLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "system", content: "new session • nova ready" },
      {
        role: "assistant",
        content: "Fresh start. What can I help you with?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setConversationHistory([]);
  };

  const quickPrompts = [
    "What's happening in AI today?",
    "Write a Python web scraper",
    "Plan a 7-day fitness routine",
    "Explain quantum computing",
  ];

  return (
    <div style={{
      height: "100%", background: "#0d0d0d",
      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      display: "flex", flexDirection: "column",
      color: "#b8a99a"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Courier+Prime:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; margin: 0; padding: 0; background: #0d0d0d; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        textarea:focus { outline: none; }
        textarea { resize: none; }
        .tool-btn:hover { border-color: #c9a96e !important; color: #c9a96e !important; }
        .send-btn:hover { background: #c9a96e !important; color: #0d0d0d !important; }
        .clear-btn:hover { color: #c9a96e !important; border-color: #c9a96e33 !important; }
        .quick-btn:hover { border-color: #c9a96e66 !important; color: #c9a96e !important; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid #161616",
        background: "#0d0d0d",
        position: "sticky", top: 0, zIndex: 100,
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid #c9a96e66",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#c9a96e",
            animation: "breathe 3s ease-in-out infinite"
          }}>✦</div>
          <div>
            <div style={{
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 700, fontSize: 16, letterSpacing: "4px",
              color: "#f0e6d3", textTransform: "uppercase"
            }}>NOVA</div>
            <div style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "2px", textTransform: "uppercase" }}>
              Neural Optimized Velocity Agent
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#3d3d3d", letterSpacing: "1px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a7c59", animation: "pulse 2s infinite" }} />
            Online
          </div>
          <button className="clear-btn" onClick={clearChat} style={{
            background: "transparent", border: "1px solid #1e1e1e",
            borderRadius: 4, padding: "5px 14px", color: "#3a3a3a",
            fontSize: 11, letterSpacing: "1px", textTransform: "uppercase",
            fontFamily: "'Courier Prime', monospace", cursor: "pointer",
            transition: "all 0.2s"
          }}>New Chat</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "32px 40px",
        width: "100%"
      }}>
        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} index={i} />)}

        {isLoading && (
          <div style={{ display: "flex", gap: 14, marginBottom: 28, animation: "fadeUp 0.3s ease-out" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #c9a96e33", fontSize: 15, color: "#c9a96e", marginTop: 2
            }}>✦</div>
            <div>
              <div style={{ fontSize: 11, color: "#3a3a3a", marginBottom: 6, letterSpacing: "1px", textTransform: "uppercase" }}>Nova</div>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div style={{ width: "100%", padding: "0 40px 20px" }}>
          <div style={{ fontSize: 10, color: "#2a2a2a", marginBottom: 10, letterSpacing: "2px", textTransform: "uppercase" }}>
            Suggestions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {quickPrompts.map(p => (
              <button key={p} className="quick-btn" onClick={() => setInput(p)} style={{
                background: "transparent", border: "1px solid #1e1e1e",
                borderRadius: 3, padding: "7px 14px", color: "#3a3a3a",
                fontSize: 12, fontFamily: "'Cormorant Garamond', serif",
                cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.3px"
              }}>{p}</button>
            ))}
          </div>
        </div>
      )}

      {/* Tool Selector */}
      <div style={{ width: "100%", padding: "0 40px 12px" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {AGENT_TOOLS.map(tool => (
            <button key={tool.id} className="tool-btn"
              onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
              style={{
                background: selectedTool === tool.id ? "#c9a96e11" : "transparent",
                border: `1px solid ${selectedTool === tool.id ? "#c9a96e66" : "#1e1e1e"}`,
                borderRadius: 3, padding: "5px 12px",
                color: selectedTool === tool.id ? "#c9a96e" : "#333",
                fontSize: 11, letterSpacing: "1px", textTransform: "uppercase",
                fontFamily: "'Courier Prime', monospace",
                display: "flex", alignItems: "center", gap: 6,
                cursor: "pointer", transition: "all 0.2s"
              }}>
              <span style={{ fontSize: 13 }}>{tool.icon}</span> {tool.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 40px 24px",
        borderTop: "1px solid #161616",
        background: "#0d0d0d",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex", gap: 12, alignItems: "flex-end",
          background: "#111", border: "1px solid #1e1e1e",
          borderRadius: 6, padding: "12px 12px 12px 20px",
          transition: "border-color 0.2s",
          borderColor: input ? "#c9a96e33" : "#1e1e1e"
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={selectedTool
              ? `${AGENT_TOOLS.find(t => t.id === selectedTool)?.label} mode — type your message`
              : "Ask NOVA anything..."}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none",
              color: "#c8b89a", fontSize: 15, lineHeight: 1.7,
              fontFamily: "'Cormorant Garamond', serif",
              minHeight: 26, maxHeight: 140, overflowY: "auto",
              letterSpacing: "0.3px"
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
          />
          <button className="send-btn" onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            style={{
              width: 38, height: 38, borderRadius: 4, border: "1px solid",
              borderColor: input.trim() && !isLoading ? "#c9a96e66" : "#1e1e1e",
              background: "transparent",
              color: input.trim() && !isLoading ? "#c9a96e" : "#2a2a2a",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, cursor: input.trim() && !isLoading ? "pointer" : "default",
              transition: "all 0.2s"
            }}>
            {isLoading
              ? <div style={{ width: 14, height: 14, border: "1.5px solid #333", borderTopColor: "#c9a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              : "↑"}
          </button>
        </div>
        <div style={{
          textAlign: "center", fontSize: 10, color: "#222",
          marginTop: 10, letterSpacing: "1.5px", textTransform: "uppercase"
        }}>
          Enter to send · Shift+Enter for new line · Select a mode above
        </div>
      </div>
    </div>
  );
}