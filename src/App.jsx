// import { useState, useRef, useEffect } from "react";

// const AGENT_TOOLS = [
//   { id: "web_search", icon: "🔍", label: "Web Search", color: "#00d4ff" },
//   { id: "summarize", icon: "📋", label: "Summarize", color: "#a78bfa" },
//   { id: "analyze", icon: "🧠", label: "Analyze", color: "#34d399" },
//   { id: "code", icon: "💻", label: "Write Code", color: "#fb923c" },
//   { id: "plan", icon: "🗺️", label: "Plan & Strategy", color: "#f472b6" },
// ];

// const SYSTEM_PROMPT = `You are NOVA — a Neural Optimized Velocity Agent. You are creative, fast, and brilliantly intelligent.

// When responding:
// - Be direct and concise but thorough
// - Use markdown formatting (bold, bullets, code blocks) where helpful
// - If asked to search the web, use your web_search tool
// - Break complex problems into clear steps
// - Show your reasoning when it adds value
// - Always aim to be genuinely useful, not just informative

// You have access to web search. Use it for current events, facts you're unsure about, or when the user asks you to look something up.`;

// function TypingIndicator() {
//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "14px 18px" }}>
//       {[0, 1, 2].map(i => (
//         <div key={i} style={{
//           width: 8, height: 8, borderRadius: "50%", background: "#00d4ff",
//           animation: "pulse 1.4s ease-in-out infinite",
//           animationDelay: `${i * 0.2}s`,
//           opacity: 0.7
//         }} />
//       ))}
//     </div>
//   );
// }

// function MessageBubble({ msg }) {
//   const isUser = msg.role === "user";
//   const isSystem = msg.role === "system";

//   if (isSystem) {
//     return (
//       <div style={{
//         textAlign: "center", padding: "6px 16px", margin: "8px auto",
//         background: "rgba(0,212,255,0.08)", borderRadius: 20, fontSize: 12,
//         color: "#64748b", maxWidth: 400, border: "1px solid rgba(0,212,255,0.15)"
//       }}>
//         {msg.content}
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
//       marginBottom: 8, animation: "slideIn 0.3s ease-out"
//     }}>
//       {!isUser && (
//         <div style={{
//           width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 16, flexShrink: 0, marginRight: 10, marginTop: 4,
//           boxShadow: "0 0 12px rgba(0,212,255,0.4)"
//         }}>✦</div>
//       )}
//       <div style={{
//         maxWidth: "75%",
//         background: isUser
//           ? "linear-gradient(135deg, #1e40af, #4f46e5)"
//           : "rgba(15, 23, 42, 0.8)",
//         border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
//         borderRadius: isUser ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
//         padding: "10px 14px",
//         backdropFilter: "blur(10px)",
//         boxShadow: isUser ? "0 4px 20px rgba(79,70,229,0.3)" : "0 4px 20px rgba(0,0,0,0.3)"
//       }}>
//         {msg.toolUsed && (
//           <div style={{
//             fontSize: 11, color: "#00d4ff", marginBottom: 8,
//             display: "flex", alignItems: "center", gap: 4, opacity: 0.8
//           }}>
//             <span>⚡</span> Used {msg.toolUsed}
//           </div>
//         )}
//         <div style={{
//           color: isUser ? "#e2e8f0" : "#cbd5e1", fontSize: 14,
//           lineHeight: 1.7, whiteSpace: "pre-wrap"
//         }}
//           dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
//         />
//         <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", marginTop: 6, textAlign: "right" }}>
//           {msg.time}
//         </div>
//       </div>
//       {isUser && (
//         <div style={{
//           width: 36, height: 36, borderRadius: "50%",
//           background: "linear-gradient(135deg, #1e40af, #4f46e5)",
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 14, flexShrink: 0, marginLeft: 10, marginTop: 4
//         }}>👤</div>
//       )}
//     </div>
//   );
// }

// function formatMessage(text) {
//   return text
//     .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.4);padding:12px;border-radius:8px;overflow-x:auto;font-family:monospace;font-size:13px;border:1px solid rgba(255,255,255,0.08);margin:8px 0"><code>$2</code></pre>')
//     .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#00d4ff">$1</code>')
//     .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
//     .replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;margin:12px 0 6px;font-size:15px">$1</h3>')
//     .replace(/^## (.+)$/gm, '<h2 style="color:#00d4ff;margin:12px 0 6px;font-size:16px">$1</h2>')
//     .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#00d4ff;margin-top:2px">▸</span><span>$1</span></div>')
//     .replace(/^\d+\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#a78bfa">●</span><span>$1</span></div>')
//     .replace(/\n/g, '<br/>');
// }

// export default function AIAgent() {
//   const [messages, setMessages] = useState([
//     {
//       role: "system",
//       content: "NOVA Agent initialized • Web search enabled • Ready"
//     },
//     {
//       role: "assistant",
//       content: "Hello! I'm **NOVA** — your Neural Optimized Velocity Agent. I can search the web, write code, analyze data, create plans, and much more.\n\nWhat would you like me to help you with today?",
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     }
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedTool, setSelectedTool] = useState(null);
//   const [conversationHistory, setConversationHistory] = useState([]);
//   const bottomRef = useRef(null);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isLoading]);

//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userText = input.trim();
//     const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//     const userMsg = { role: "user", content: userText, time: timeStr };
//     setMessages(prev => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     const newHistory = [...conversationHistory, { role: "user", content: userText }];

//     let enhancedContent = userText;
//     if (selectedTool === "web_search") enhancedContent = `[Use web search to answer this] ${userText}`;
//     else if (selectedTool === "code") enhancedContent = `[Write working code for this] ${userText}`;
//     else if (selectedTool === "plan") enhancedContent = `[Create a detailed step-by-step plan for this] ${userText}`;
//     else if (selectedTool === "summarize") enhancedContent = `[Provide a clear, structured summary] ${userText}`;
//     else if (selectedTool === "analyze") enhancedContent = `[Provide deep analysis with insights] ${userText}`;

//     const apiHistory = newHistory.map((m, i) =>
//       i === newHistory.length - 1 ? { ...m, content: enhancedContent } : m
//     );

//     try {
//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         max_tokens: 1000,
//         messages: [
//           { role: "system", content: SYSTEM_PROMPT },
//           ...apiHistory
//         ]
//       })
//       });

//       const data = await response.json();
//       console.log("STATUS:", response.status);
//       console.log("DATA:", JSON.stringify(data));

//       const textBlocks = data.choices?.[0]?.message?.content || "";

//       const usedSearch = false;

//       const assistantMsg = {
//         role: "assistant",
//         content: textBlocks || "I encountered an issue. Please try again.",
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         toolUsed: usedSearch ? "Web Search" : selectedTool ? AGENT_TOOLS.find(t => t.id === selectedTool)?.label : null
//       };

//       setMessages(prev => [...prev, assistantMsg]);
//       setConversationHistory([...newHistory, { role: "assistant", content: textBlocks }]);
//       setSelectedTool(null);

//     } catch (err) {
//       console.log("CATCH ERROR:", err);
//       setMessages(prev => [...prev, {
//         role: "assistant",
//         content: "Connection error: " + err.message,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       }]);
//     }

//     setIsLoading(false);
//   };

//   const handleKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       { role: "system", content: "New session started • NOVA ready" },
//       {
//         role: "assistant",
//         content: "Fresh start! What can I help you with?",
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       }
//     ]);
//     setConversationHistory([]);
//   };

//   const quickPrompts = [
//     "Search for latest AI news today",
//     "Write a Python web scraper",
//     "Plan a 7-day fitness routine",
//     "Explain quantum computing simply",
//   ];

//   return (
//     <div style={{
//       height: "100%", width: "100%", background: "#000000",
//       fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//       display: "flex", flexDirection: "column",
//       color: "#e2e8f0"
//     }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         ::-webkit-scrollbar { width: 6px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 3px; }
//         @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes pulse { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
//         @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.2); } 50% { box-shadow: 0 0 40px rgba(0,212,255,0.5); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//         textarea:focus { outline: none; }
//         textarea { resize: none; }
//         button:hover { opacity: 0.85; transform: scale(0.98); }
//         button { transition: all 0.15s ease; cursor: pointer; }
//       `}</style>

//       {/* Header */}
//       <div style={{
//         padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
//         borderBottom: "1px solid rgba(255,255,255,0.06)",
//         background: "rgba(2,8,23,0.95)", backdropFilter: "blur(20px)",
//         position: "sticky", top: 0, zIndex: 100
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//           <div style={{
//             width: 42, height: 42, borderRadius: "50%",
//             background: "linear-gradient(135deg, #ffffff, #aaaaaa, #ffffff)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             fontSize: 20, animation: "glow 3s ease-in-out infinite",
//             boxShadow: "0 0 20px rgba(0,212,255,0.3)"
//           }}>✦</div>
//           <div>
//             <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#fff" }}>
//               NOVA
//             </div>
//             <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: 1 }}>
//               NEURAL OPTIMIZED VELOCITY AGENT
//             </div>
//           </div>
//         </div>
//         <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
//           <div style={{
//             display: "flex", alignItems: "center", gap: 6,
//             background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
//             borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#34d399"
//           }}>
//             <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
//             Web Search On
//           </div>
//           <button onClick={clearChat} style={{
//             background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: 8, padding: "6px 14px", color: "#94a3b8", fontSize: 12
//           }}>
//             New Chat
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div style={{
//         flex: 1, overflowY: "auto", padding: "24px 16px",
//         maxWidth: 800, width: "100%", margin: "0 auto"
//       }}>
//         {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
//         {isLoading && (
//           <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.3s ease-out" }}>
//             <div style={{
//               width: 36, height: 36, borderRadius: "50%",
//               background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
//               display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
//             }}>✦</div>
//             <div style={{
//               background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)",
//               borderRadius: "4px 20px 20px 20px"
//             }}>
//               <TypingIndicator />
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Quick Prompts */}
//       {messages.length <= 2 && (
//         <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px 16px" }}>
//           <div style={{ fontSize: 11, color: "#475569", marginBottom: 10, letterSpacing: 1 }}>TRY ASKING</div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//             {quickPrompts.map(p => (
//               <button key={p} onClick={() => setInput(p)} style={{
//                 background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)",
//                 borderRadius: 20, padding: "8px 14px", color: "#94a3b8", fontSize: 12,
//                 fontFamily: "inherit"
//               }}>{p}</button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Tool Selector */}
//       <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px 10px" }}>
//         <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
//           {AGENT_TOOLS.map(tool => (
//             <button key={tool.id} onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)} style={{
//               background: selectedTool === tool.id ? `${tool.color}22` : "rgba(255,255,255,0.03)",
//               border: `1px solid ${selectedTool === tool.id ? tool.color : "rgba(255,255,255,0.08)"}`,
//               borderRadius: 20, padding: "5px 12px", fontSize: 12,
//               color: selectedTool === tool.id ? tool.color : "#64748b",
//               display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit"
//             }}>
//               <span>{tool.icon}</span> {tool.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Input Area */}
//       <div style={{
//         padding: "12px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
//         background: "rgba(2,8,23,0.98)", backdropFilter: "blur(20px)"
//       }}>
//         <div style={{ maxWidth: 800, width: "100%", margin: "0 auto" }}>
//           <div style={{
//             display: "flex", gap: 10, alignItems: "flex-end",
//             background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)",
//             borderRadius: 16, padding: "8px 8px 8px 16px",
//             boxShadow: "0 0 30px rgba(0,0,0,0.3)",
//             transition: "border-color 0.2s",
//             borderColor: input ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)"
//           }}>
//             <textarea
//               ref={textareaRef}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={handleKey}
//               placeholder={selectedTool ? `Using ${AGENT_TOOLS.find(t => t.id === selectedTool)?.label}... type your message` : "Ask NOVA anything..."}
//               rows={1}
//               style={{
//                 flex: 1, background: "transparent", border: "none",
//                 color: "#e2e8f0", fontSize: 14, lineHeight: 1.6,
//                 fontFamily: "inherit", minHeight: 24, maxHeight: 120,
//                 overflowY: "auto"
//               }}
//               onInput={e => {
//                 e.target.style.height = "auto";
//                 e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
//               }}
//             />
//             <button onClick={sendMessage} disabled={!input.trim() || isLoading} style={{
//               width: 40, height: 40, borderRadius: 10, border: "none",
//               background: input.trim() && !isLoading
//                 ? "linear-gradient(135deg, #00d4ff, #4f46e5)"
//                 : "rgba(255,255,255,0.05)",
//               color: input.trim() && !isLoading ? "#fff" : "#374151",
//               fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
//               flexShrink: 0, boxShadow: input.trim() && !isLoading ? "0 0 20px rgba(0,212,255,0.3)" : "none"
//             }}>
//               {isLoading ? (
//                 <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//               ) : "↑"}
//             </button>
//           </div>
//           <div style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 8 }}>
//             Press Enter to send • Shift+Enter for new line • Select a tool above to guide responses
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";

// ── Chat History Helpers ──────────────────────────────────────────
const STORAGE_KEY = "nova_chat_sessions";
function saveSessions(sessions) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch {}
}
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

const AGENT_TOOLS = [
  { id: "web_search", icon: "🔍", label: "Web Search", color: "#00d4ff" },
  { id: "summarize", icon: "📋", label: "Summarize", color: "#a78bfa" },
  { id: "analyze", icon: "🧠", label: "Analyze", color: "#34d399" },
  { id: "code", icon: "💻", label: "Write Code", color: "#fb923c" },
  { id: "plan", icon: "🗺️", label: "Plan & Strategy", color: "#f472b6" },
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
    <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "14px 18px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#00d4ff",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
          opacity: 0.7
        }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <div style={{
        textAlign: "center", padding: "6px 16px", margin: "8px auto",
        background: "rgba(0,212,255,0.08)", borderRadius: 20, fontSize: 12,
        color: "#64748b", maxWidth: 400, border: "1px solid rgba(0,212,255,0.15)"
      }}>
        {msg.content}
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 8, animation: "slideIn 0.3s ease-out"
    }}>
      {!isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, flexShrink: 0, marginRight: 10, marginTop: 4,
          boxShadow: "0 0 12px rgba(0,212,255,0.4)"
        }}>✦</div>
      )}
      <div style={{
        maxWidth: "75%",
        background: isUser
          ? "linear-gradient(135deg, #1e40af, #4f46e5)"
          : "rgba(15, 23, 42, 0.8)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: isUser ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
        padding: "10px 14px",
        backdropFilter: "blur(10px)",
        boxShadow: isUser ? "0 4px 20px rgba(79,70,229,0.3)" : "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        {msg.toolUsed && (
          <div style={{
            fontSize: 11, color: "#00d4ff", marginBottom: 8,
            display: "flex", alignItems: "center", gap: 4, opacity: 0.8
          }}>
            <span>⚡</span> Used {msg.toolUsed}
          </div>
        )}
        {msg.fileName && (
          <div style={{
            fontSize: 11, color: "#94a3b8", marginBottom: 8,
            padding: "5px 10px", background: "rgba(0,212,255,0.05)",
            borderRadius: 6, border: "1px solid rgba(0,212,255,0.15)",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <span>📎</span> {msg.fileName}
          </div>
        )}
        <div style={{
          color: isUser ? "#e2e8f0" : "#cbd5e1", fontSize: 14,
          lineHeight: 1.7, whiteSpace: "pre-wrap"
        }}
          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
        />
        <div style={{ fontSize: 10, color: "rgba(148,163,184,0.5)", marginTop: 6, textAlign: "right" }}>
          {msg.time}
        </div>
      </div>
      {isUser && (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #1e40af, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0, marginLeft: 10, marginTop: 4
        }}>👤</div>
      )}
    </div>
  );
}

function formatMessage(text) {
  return text
    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre style="background:rgba(0,0,0,0.4);padding:12px;border-radius:8px;overflow-x:auto;font-family:monospace;font-size:13px;border:1px solid rgba(255,255,255,0.08);margin:8px 0"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.3);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#00d4ff">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;margin:12px 0 6px;font-size:15px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#00d4ff;margin:12px 0 6px;font-size:16px">$1</h2>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#00d4ff;margin-top:2px">▸</span><span>$1</span></div>')
    .replace(/^\d+\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0"><span style="color:#a78bfa">●</span><span>$1</span></div>')
    .replace(/\n/g, '<br/>');
}

export default function AIAgent() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "NOVA Agent initialized • Web search enabled • Ready"
    },
    {
      role: "assistant",
      content: "Hello! I'm **NOVA** — your Neural Optimized Velocity Agent. I can search the web, write code, analyze data, create plans, and much more.\n\nWhat would you like me to help you with today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // ── NEW: Chat History State ──────────────────────────────────────
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // ── NEW: File Upload State ───────────────────────────────────────
  const [attachedFile, setAttachedFile] = useState(null);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null); // NEW: file input ref

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── NEW: Auto-save chat to localStorage ─────────────────────────
  useEffect(() => {
    if (messages.length <= 2) return;
    const title = messages.find(m => m.role === "user")?.content?.slice(0, 40) || "New Chat";
    const session = {
      id: activeSessionId || Date.now().toString(),
      title,
      messages,
      conversationHistory,
      savedAt: new Date().toLocaleDateString()
    };
    setActiveSessionId(session.id);
    setSessions(prev => {
      const updated = [session, ...prev.filter(s => s.id !== session.id)].slice(0, 20);
      saveSessions(updated);
      return updated;
    });
  }, [messages]);

  // ── NEW: File Upload Handler ─────────────────────────────────────
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
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg = {
      role: "user",
      content: userText || `Analyze this file: ${attachedFile?.name}`,
      time: timeStr,
      fileName: attachedFile?.name || null  // NEW: store filename in message
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: "user", content: userText || `Analyze: ${attachedFile?.name}` }];

    let enhancedContent = userText;

    // ── NEW: Inject file content into message ────────────────────
    if (attachedFile) {
      enhancedContent = `File uploaded: "${attachedFile.name}"\n\nContents:\n${attachedFile.content}\n\nUser request: ${userText || "Please analyze this file and summarize it."}`;
      setAttachedFile(null);
    }

    if (selectedTool === "web_search") enhancedContent = `[Use web search to answer this] ${enhancedContent}`;
    else if (selectedTool === "code") enhancedContent = `[Write working code for this] ${enhancedContent}`;
    else if (selectedTool === "plan") enhancedContent = `[Create a detailed step-by-step plan for this] ${enhancedContent}`;
    else if (selectedTool === "summarize") enhancedContent = `[Provide a clear, structured summary] ${enhancedContent}`;
    else if (selectedTool === "analyze") enhancedContent = `[Provide deep analysis with insights] ${enhancedContent}`;

    const apiHistory = newHistory.map((m, i) =>
      i === newHistory.length - 1 ? { ...m, content: enhancedContent } : m
    );

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
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

      const assistantMsg = {
        role: "assistant",
        content: textBlocks || "I encountered an issue. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        toolUsed: usedSearch ? "Web Search" : selectedTool ? AGENT_TOOLS.find(t => t.id === selectedTool)?.label : null
      };

      setMessages(prev => [...prev, assistantMsg]);
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
      { role: "system", content: "New session started • NOVA ready" },
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

  // ── NEW: Load a past session ─────────────────────────────────────
  const loadSession = (session) => {
    setMessages(session.messages);
    setConversationHistory(session.conversationHistory || []);
    setActiveSessionId(session.id);
    setShowHistory(false);
  };

  // ── NEW: Delete a session ────────────────────────────────────────
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

  return (
    <div style={{
      height: "100%", width: "100%", background: "#000000",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "row", // CHANGED: row for sidebar layout
      color: "#e2e8f0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; margin: 0; padding: 0; background: #000000; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 3px; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.2); } 50% { box-shadow: 0 0 40px rgba(0,212,255,0.5); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus { outline: none; }
        textarea { resize: none; }
        button:hover { opacity: 0.85; transform: scale(0.98); }
        button { transition: all 0.15s ease; cursor: pointer; }
        .session-item:hover { background: rgba(0,212,255,0.05) !important; }
      `}</style>

      {/* ── NEW: Sidebar ─────────────────────────────────────────── */}
      <div style={{
        width: showHistory ? 260 : 0,
        minWidth: showHistory ? 260 : 0,
        background: "#050d1a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
        flexShrink: 0
      }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#475569", letterSpacing: 2, marginBottom: 12 }}>
            CHAT HISTORY
          </div>
          <button onClick={clearChat} style={{
            width: "100%", padding: "8px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: "#94a3b8", fontSize: 12,
            textAlign: "left", display: "flex", alignItems: "center", gap: 8
          }}>＋ New Chat</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {sessions.length === 0 && (
            <div style={{ fontSize: 12, color: "#334155", padding: "16px 8px", textAlign: "center" }}>
              No saved chats yet
            </div>
          )}
          {sessions.map(session => (
            <div key={session.id} className="session-item" onClick={() => loadSession(session)} style={{
              padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
              background: activeSessionId === session.id ? "rgba(0,212,255,0.06)" : "transparent",
              border: activeSessionId === session.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.title}
                </div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 3 }}>{session.savedAt}</div>
              </div>
              <button onClick={(e) => deleteSession(e, session.id)} style={{
                background: "transparent", border: "none",
                color: "#334155", fontSize: 13, flexShrink: 0
              }}>✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Header */}
        <div style={{
          padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(2,8,23,0.95)", backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 100, flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* NEW: History toggle button */}
            <button onClick={() => setShowHistory(h => !h)} style={{
              width: 34, height: 34, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)",
              background: showHistory ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
              color: showHistory ? "#00d4ff" : "#64748b",
              fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center"
            }}>☰</button>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #ffffff, #aaaaaa, #ffffff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, animation: "glow 3s ease-in-out infinite",
              boxShadow: "0 0 20px rgba(0,212,255,0.3)"
            }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2, color: "#fff" }}>
                NOVA
              </div>
              <div style={{ fontSize: 11, color: "#00d4ff", letterSpacing: 1 }}>
                NEURAL OPTIMIZED VELOCITY AGENT
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#34d399"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
              Web Search On
            </div>
            <button onClick={clearChat} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, padding: "6px 14px", color: "#94a3b8", fontSize: 12
            }}>
              New Chat
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px 16px",
          maxWidth: 800, width: "100%", margin: "0 auto"
        }}>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {isLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.3s ease-out" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
              }}>✦</div>
              <div style={{
                background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px 20px 20px 20px"
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 2 && (
          <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px 16px" }}>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 10, letterSpacing: 1 }}>TRY ASKING</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickPrompts.map(p => (
                <button key={p} onClick={() => setInput(p)} style={{
                  background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)",
                  borderRadius: 20, padding: "8px 14px", color: "#94a3b8", fontSize: 12,
                  fontFamily: "inherit"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}

        {/* Tool Selector */}
        <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px 10px" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AGENT_TOOLS.map(tool => (
              <button key={tool.id} onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)} style={{
                background: selectedTool === tool.id ? `${tool.color}22` : "rgba(255,255,255,0.03)",
                border: `1px solid ${selectedTool === tool.id ? tool.color : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20, padding: "5px 12px", fontSize: 12,
                color: selectedTool === tool.id ? tool.color : "#64748b",
                display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit"
              }}>
                <span>{tool.icon}</span> {tool.label}
              </button>
            ))}
          </div>
        </div>

        {/* NEW: File Preview */}
        {attachedFile && (
          <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px 8px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px", background: "rgba(0,212,255,0.05)",
              border: "1px solid rgba(0,212,255,0.15)", borderRadius: 20,
              fontSize: 12, color: "#94a3b8"
            }}>
              📎 {attachedFile.name}
              <button onClick={() => setAttachedFile(null)} style={{
                background: "none", border: "none", color: "#475569", fontSize: 13
              }}>✕</button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={{
          padding: "12px 16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(2,8,23,0.98)", backdropFilter: "blur(20px)", flexShrink: 0
        }}>
          {/* NEW: Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.csv,.json,.js,.py,.html,.css"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <div style={{ maxWidth: 800, width: "100%", margin: "0 auto" }}>
            <div style={{
              display: "flex", gap: 10, alignItems: "flex-end",
              background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16, padding: "8px 8px 8px 12px",
              boxShadow: "0 0 30px rgba(0,0,0,0.3)",
              transition: "border-color 0.2s",
              borderColor: input ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)"
            }}>
              {/* NEW: File attach button */}
              <button onClick={() => fileInputRef.current?.click()} style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                background: attachedFile ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                color: attachedFile ? "#00d4ff" : "#64748b",
                fontSize: 16, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }} title="Attach file">📎</button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={attachedFile ? `Ask about ${attachedFile.name}...` : selectedTool ? `Using ${AGENT_TOOLS.find(t => t.id === selectedTool)?.label}... type your message` : "Ask NOVA anything..."}
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none",
                  color: "#e2e8f0", fontSize: 14, lineHeight: 1.6,
                  fontFamily: "inherit", minHeight: 24, maxHeight: 120,
                  overflowY: "auto"
                }}
                onInput={e => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
              <button onClick={sendMessage} disabled={(!input.trim() && !attachedFile) || isLoading} style={{
                width: 40, height: 40, borderRadius: 10, border: "none",
                background: (input.trim() || attachedFile) && !isLoading
                  ? "linear-gradient(135deg, #00d4ff, #4f46e5)"
                  : "rgba(255,255,255,0.05)",
                color: (input.trim() || attachedFile) && !isLoading ? "#fff" : "#374151",
                fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: (input.trim() || attachedFile) && !isLoading ? "0 0 20px rgba(0,212,255,0.3)" : "none"
              }}>
                {isLoading ? (
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : "↑"}
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 8 }}>
              Press Enter to send • Shift+Enter for new line • 📎 attach files • ☰ chat history
            </div>
          </div>
        </div>

      </div> {/* closes main area */}
    </div>   {/* closes outer flex row */}
  );
}