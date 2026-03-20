import { useState, useRef, useEffect } from "react";

const STORAGE_KEY = "nova_chat_sessions";
function saveSessions(sessions) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch {}
}
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

const AGENT_TOOLS = [
  { id: "web_search", icon: "🔍", label: "Web Search" },
  { id: "summarize", icon: "📋", label: "Summarize" },
  { id: "analyze",   icon: "🧠", label: "Analyze" },
  { id: "code",      icon: "💻", label: "Write Code" },
  { id: "plan",      icon: "🗺️", label: "Plan & Strategy" },
];

const SYSTEM_PROMPT = `You are NOVA — a Neural Optimized Velocity Agent. You are creative, fast, and brilliantly intelligent.
When responding:
- Be direct and concise but thorough
- Use markdown formatting (bold, bullets, code blocks) where helpful
- Break complex problems into clear steps
- Show your reasoning when it adds value
- Always aim to be genuinely useful, not just informative`;

const C = {
  bg:          "#212121",
  surface:     "#2f2f2f",
  border:      "rgba(255,255,255,0.1)",
  borderFaint: "rgba(255,255,255,0.06)",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecond:  "rgba(255,255,255,0.5)",
  textMuted:   "rgba(255,255,255,0.2)",
};

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          animation: "novaPulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}

function formatMessage(text) {
  return text
    .replace(/```(\w+)?\n?([\s\S]*?)```/g,
      `<pre style="background:#171717;padding:14px 16px;border-radius:10px;overflow-x:auto;
       font-family:'JetBrains Mono',monospace;font-size:13px;
       border:1px solid rgba(255,255,255,0.08);margin:10px 0;
       color:rgba(255,255,255,0.85);line-height:1.6"><code>$2</code></pre>`)
    .replace(/`([^`]+)`/g,
      `<code style="background:rgba(255,255,255,0.08);padding:2px 7px;border-radius:5px;
       font-family:'JetBrains Mono',monospace;font-size:13px;color:rgba(255,255,255,0.88)">$1</code>`)
    .replace(/\*\*([^*]+)\*\*/g,
      `<strong style="color:rgba(255,255,255,0.95);font-weight:600">$1</strong>`)
    .replace(/^### (.+)$/gm,
      `<div style="color:rgba(255,255,255,0.55);margin:14px 0 5px;font-size:11px;
       letter-spacing:1.5px;text-transform:uppercase;font-weight:600">$1</div>`)
    .replace(/^## (.+)$/gm,
      `<div style="color:rgba(255,255,255,0.88);margin:14px 0 6px;font-size:16px;font-weight:600">$1</div>`)
    .replace(/^- (.+)$/gm,
      `<div style="display:flex;gap:10px;margin:5px 0;color:rgba(255,255,255,0.8)">
       <span style="color:rgba(255,255,255,0.25);margin-top:2px;font-size:11px">●</span><span>$1</span></div>`)
    .replace(/^\d+\. (.+)$/gm,
      `<div style="display:flex;gap:10px;margin:5px 0;color:rgba(255,255,255,0.8)">
       <span style="color:rgba(255,255,255,0.25)">–</span><span>$1</span></div>`)
    .replace(/\n/g, "<br/>");
}

function MessageBubble({ msg }) {
  const isUser   = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) return (
    <div style={{
      textAlign: "center", fontSize: 11, color: C.textMuted,
      margin: "12px auto", letterSpacing: "0.4px"
    }}>{msg.content}</div>
  );

  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      gap: 10, marginBottom: 20,
      animation: "novaSlide 0.2s ease-out"
    }}>
      {!isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 2,
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, color: C.textSecond
        }}>✦</div>
      )}

      <div style={{ maxWidth: "80%" }}>
        {msg.toolUsed && (
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 5 }}>
            ⚡ Used {msg.toolUsed}
          </div>
        )}
        {msg.fileName && (
          <div style={{
            fontSize: 11, color: C.textSecond, marginBottom: 8,
            padding: "3px 10px", border: `1px solid ${C.border}`,
            borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 6
          }}>📎 {msg.fileName}</div>
        )}
        <div style={{
          background: isUser ? C.surface : "transparent",
          border: isUser ? `1px solid ${C.borderFaint}` : "none",
          borderRadius: isUser ? "18px 18px 4px 18px" : 0,
          padding: isUser ? "10px 15px" : "2px 0",
        }}>
          <div style={{
            color: C.textPrimary, fontSize: 14.5,
            lineHeight: 1.75, whiteSpace: "pre-wrap"
          }}
            dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
          />
        </div>
        <div style={{
          fontSize: 10, color: C.textMuted, marginTop: 4,
          textAlign: isUser ? "right" : "left"
        }}>{msg.time}</div>
      </div>

      {isUser && (
        <div style={{
          width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 2,
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: C.textSecond
        }}>U</div>
      )}
    </div>
  );
}

export default function AIAgent() {
  const [messages, setMessages] = useState([
    { role: "system", content: "NOVA initialized • ready" },
    {
      role: "assistant",
      content: "Hello! I'm **NOVA** — your Neural Optimized Velocity Agent. I can search the web, write code, analyze data, create plans, and much more.\n\nWhat would you like me to help you with today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput]                     = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [selectedTool, setSelectedTool]       = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [sessions, setSessions]               = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory]         = useState(false);
  const [attachedFile, setAttachedFile]       = useState(null);
  const bottomRef    = useRef(null);
  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length <= 2) return;
    const title = messages.find(m => m.role === "user")?.content?.slice(0, 40) || "New Chat";
    const session = {
      id: activeSessionId || Date.now().toString(),
      title, messages, conversationHistory,
      savedAt: new Date().toLocaleDateString()
    };
    setActiveSessionId(session.id);
    setSessions(prev => {
      const updated = [session, ...prev.filter(s => s.id !== session.id)].slice(0, 20);
      saveSessions(updated);
      return updated;
    });
  }, [messages]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAttachedFile({ name: file.name, content: ev.target.result });
    reader.readAsText(file);
    e.target.value = "";
  };

  const sendMessage = async () => {
    if ((!input.trim() && !attachedFile) || isLoading) return;
    const userText = input.trim();
    const timeStr  = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, {
      role: "user",
      content: userText || `Analyze this file: ${attachedFile?.name}`,
      time: timeStr,
      fileName: attachedFile?.name || null
    }]);
    setInput("");
    setIsLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "24px";

    const newHistory = [...conversationHistory, {
      role: "user", content: userText || `Analyze: ${attachedFile?.name}`
    }];
    let enhanced = userText;

    if (attachedFile) {
      enhanced = `File: "${attachedFile.name}"\n\nContents:\n${attachedFile.content}\n\nRequest: ${userText || "Please analyze and summarize this file."}`;
      setAttachedFile(null);
    }
    if (selectedTool === "web_search")  enhanced = `[Use web search] ${enhanced}`;
    else if (selectedTool === "code")        enhanced = `[Write working code] ${enhanced}`;
    else if (selectedTool === "plan")        enhanced = `[Create a detailed plan] ${enhanced}`;
    else if (selectedTool === "summarize")   enhanced = `[Provide a clear summary] ${enhanced}`;
    else if (selectedTool === "analyze")     enhanced = `[Provide deep analysis] ${enhanced}`;

    const apiHistory = newHistory.map((m, i) =>
      i === newHistory.length - 1 ? { ...m, content: enhanced } : m
    );

    try {
      const res  = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...apiHistory]
        })
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";

      setMessages(prev => [...prev, {
        role: "assistant",
        content: text || "I encountered an issue. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolUsed: selectedTool ? AGENT_TOOLS.find(t => t.id === selectedTool)?.label : null
      }]);
      setConversationHistory([...newHistory, { role: "assistant", content: text }]);
      setSelectedTool(null);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error: " + err.message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    }
    setIsLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([
      { role: "system", content: "New session • NOVA ready" },
      {
        role: "assistant",
        content: "Fresh start! What can I help you with?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setConversationHistory([]);
    setActiveSessionId(null);
    setAttachedFile(null);
  };

  const loadSession = (session) => {
    setMessages(session.messages);
    setConversationHistory(session.conversationHistory || []);
    setActiveSessionId(session.id);
    setShowHistory(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSessions(updated);
      return updated;
    });
    if (activeSessionId === id) clearChat();
  };

  const quickPrompts = [
    "Search for latest AI news today",
    "Write a Python web scraper",
    "Plan a 7-day fitness routine",
    "Explain quantum computing simply",
  ];

  const canSend = (input.trim() || attachedFile) && !isLoading;

  return (
    <div style={{
      height: "100%", width: "100%",
      background: C.bg,
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      display: "flex", flexDirection: "row",
      color: C.textPrimary, overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        html, body, #root { height:100%; width:100%; margin:0; padding:0; background:${C.bg}; overflow:hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        textarea { resize:none; }
        textarea:focus { outline:none; }
        textarea::placeholder { color: rgba(255,255,255,0.28); }
        button { cursor:pointer; transition: opacity 0.15s ease, background 0.15s ease; }
        button:hover { opacity: 0.75; }
        @keyframes novaSlide {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes novaPulse {
          0%,80%,100% { transform:scale(0.65); opacity:0.3; }
          40%          { transform:scale(1);    opacity:0.9; }
        }
        @keyframes novaSpin  { to { transform:rotate(360deg); } }
        @keyframes novaGlow {
          0%, 100% { transform:scale(1);   opacity:0.5; }
          50%       { transform:scale(1.4); opacity:1;   }
        }
        .sidebar-item:hover { background: rgba(255,255,255,0.05) !important; }
        .tool-btn:hover { border-color: rgba(255,255,255,0.22) !important; color: rgba(255,255,255,0.75) !important; }
        .quick-btn:hover { border-color: rgba(255,255,255,0.22) !important; color: rgba(255,255,255,0.65) !important; }
      `}</style>

      {/* ═══ SIDEBAR ═══════════════════════════════════════════════ */}
      <div style={{
        width: showHistory ? 256 : 0,
        minWidth: showHistory ? 256 : 0,
        background: C.bg,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.22s ease, min-width 0.22s ease",
        flexShrink: 0
      }}>
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${C.borderFaint}` }}>
          <div style={{
            fontSize: 10, color: C.textMuted, letterSpacing: "2px",
            marginBottom: 12, fontFamily: "'Space Mono',monospace"
          }}>CHAT HISTORY</div>
          <button onClick={clearChat} style={{
            width: "100%", padding: "8px 12px",
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8, color: C.textSecond, fontSize: 12,
            textAlign: "left", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "inherit"
          }}>＋ New Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 8px" }}>
          {sessions.length === 0 && (
            <div style={{ fontSize: 12, color: C.textMuted, padding: "20px 8px", textAlign: "center" }}>
              No saved chats yet
            </div>
          )}
          {sessions.map(s => (
            <div key={s.id} className="sidebar-item" onClick={() => loadSession(s)} style={{
              padding: "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
              background: activeSessionId === s.id ? C.surface : "transparent",
              border: `1px solid ${activeSessionId === s.id ? C.border : "transparent"}`,
              display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, color: C.textSecond,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>{s.title}</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{s.savedAt}</div>
              </div>
              <button onClick={(e) => deleteSession(e, s.id)} style={{
                background: "transparent", border: "none",
                color: C.textMuted, fontSize: 12, flexShrink: 0, padding: "0 2px"
              }}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MAIN ══════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* ── Header ── */}
        <div style={{
          padding: "13px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${C.borderFaint}`,
          background: C.bg, flexShrink: 0, zIndex: 10
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowHistory(h => !h)} style={{
              width: 32, height: 32, borderRadius: 7,
              border: `1px solid ${C.border}`,
              background: showHistory ? C.surface : "transparent",
              color: showHistory ? C.textPrimary : C.textSecond,
              fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
            }}>☰</button>

            {/* Glowing dot logo */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, position: "relative"
            }}>
              <div style={{
                position: "absolute", width: 28, height: 28, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                animation: "novaGlow 3s ease-in-out infinite"
              }} />
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 0 8px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.15)"
              }} />
            </div>

            <div>
              <div style={{
                fontFamily: "'Space Mono',monospace", fontWeight: 700,
                fontSize: 15, letterSpacing: "3px", color: C.textPrimary
              }}>NOVA</div>
              <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: "1.5px" }}>
                NEURAL OPTIMIZED VELOCITY AGENT
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              border: `1px solid ${C.borderFaint}`,
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, color: C.textMuted
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#4ade80",
                animation: "novaPulse 2.5s infinite"
              }} />
              Online
            </div>
            <button onClick={clearChat} style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 7, padding: "5px 14px",
              color: C.textSecond, fontSize: 12, fontFamily: "inherit"
            }}>New Chat</button>
          </div>
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "28px 24px 12px",
          maxWidth: 900, width: "100%",
          margin: "0 auto", alignSelf: "stretch", boxSizing: "border-box"
        }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {isLoading && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, animation: "novaSlide 0.2s ease-out" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: C.textSecond
              }}>✦</div>
              <TypingIndicator />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Quick Prompts ── */}
        {messages.length <= 2 && (
          <div style={{
            maxWidth: 900, width: "100%", margin: "0 auto",
            padding: "0 24px 14px", boxSizing: "border-box"
          }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 10, letterSpacing: "1.5px" }}>
              TRY ASKING
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickPrompts.map(p => (
                <button key={p} className="quick-btn" onClick={() => setInput(p)} style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: "7px 15px",
                  color: C.textSecond, fontSize: 12, fontFamily: "inherit"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Tool Selector ── */}
        <div style={{
          maxWidth: 900, width: "100%", margin: "0 auto",
          padding: "0 24px 10px", boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AGENT_TOOLS.map(tool => (
              <button key={tool.id} className="tool-btn"
                onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                style={{
                  background: selectedTool === tool.id ? C.surface : "transparent",
                  border: `1px solid ${selectedTool === tool.id ? C.border : C.borderFaint}`,
                  borderRadius: 20, padding: "5px 13px", fontSize: 12,
                  color: selectedTool === tool.id ? C.textPrimary : C.textMuted,
                  display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit"
                }}>
                <span>{tool.icon}</span>{tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── File Preview ── */}
        {attachedFile && (
          <div style={{
            maxWidth: 900, width: "100%", margin: "0 auto",
            padding: "0 24px 8px", boxSizing: "border-box"
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 12px", border: `1px solid ${C.border}`,
              borderRadius: 20, fontSize: 12, color: C.textSecond
            }}>
              📎 {attachedFile.name}
              <button onClick={() => setAttachedFile(null)} style={{
                background: "none", border: "none", color: C.textMuted, fontSize: 13
              }}>✕</button>
            </div>
          </div>
        )}

        {/* ── Input Area ── */}
        <div style={{
          padding: "10px 24px 20px",
          borderTop: `1px solid ${C.borderFaint}`,
          background: C.bg, flexShrink: 0
        }}>
          <input ref={fileInputRef} type="file"
            accept=".txt,.md,.csv,.json,.js,.py,.html,.css"
            onChange={handleFileUpload} style={{ display: "none" }} />

          <div style={{ maxWidth: 900, width: "100%", margin: "0 auto" }}>
            <div style={{
              display: "flex", gap: 8, alignItems: "flex-end",
              background: C.surface,
              border: `1px solid ${input ? C.border : C.borderFaint}`,
              borderRadius: 14, padding: "8px 8px 8px 14px",
              transition: "border-color 0.2s"
            }}>
              <button onClick={() => fileInputRef.current?.click()} style={{
                width: 32, height: 32, borderRadius: 7,
                border: `1px solid ${attachedFile ? C.border : C.borderFaint}`,
                background: "transparent",
                color: attachedFile ? C.textPrimary : C.textMuted,
                fontSize: 15, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }} title="Attach file">📎</button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={
                  attachedFile ? `Ask about ${attachedFile.name}...` :
                  selectedTool ? `${AGENT_TOOLS.find(t => t.id === selectedTool)?.label} mode...` :
                  "Ask NOVA anything..."
                }
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: C.textPrimary, fontSize: 14, lineHeight: 1.6,
                  fontFamily: "inherit", minHeight: 24, maxHeight: 120, overflowY: "auto"
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />

              <button onClick={sendMessage} disabled={!canSend} style={{
                width: 32, height: 32, borderRadius: 8,
                border: `1px solid ${canSend ? C.border : C.borderFaint}`,
                background: canSend ? "rgba(255,255,255,0.12)" : "transparent",
                color: canSend ? C.textPrimary : C.textMuted,
                fontSize: 15, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                {isLoading
                  ? <div style={{
                      width: 13, height: 13,
                      border: "1.5px solid rgba(255,255,255,0.15)",
                      borderTopColor: "rgba(255,255,255,0.7)",
                      borderRadius: "50%", animation: "novaSpin 0.8s linear infinite"
                    }} />
                  : "↑"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}