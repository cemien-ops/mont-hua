import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sendNotification } from "../onesignal";

function renderAvatar(avatar, size = "2.5rem") {
  if (!avatar) return <span>🌸</span>;
  if (typeof avatar === "string" && (avatar.startsWith("data:") || avatar.startsWith("http"))) {
    return <img src={avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  }
  return <span>{avatar}</span>;
}

export default function Messages() {
  const { user, users, getMessages, sendMessage, markAllRead } = useAuth();
  const navigate = useNavigate();
  const [selectedConv, setSelectedConv] = useState(null);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [allMsgs, setAllMsgs] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewConv, setShowNewConv] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
  }, [user]);

  useEffect(() => {
    const refresh = () => setAllMsgs(getMessages());
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!selectedConv) return;
    if (selectedConv.isGroup) {
      const msgs = JSON.parse(localStorage.getItem("mh_messages") || "[]");
      const updated = msgs.map(m =>
        m.groupId === selectedConv.groupId && m.fromId !== user.id ? { ...m, read: true } : m
      );
      localStorage.setItem("mh_messages", JSON.stringify(updated));
      setAllMsgs(getMessages());
    } else {
      markAllRead(selectedConv.otherId);
      setAllMsgs(getMessages());
    }
  }, [selectedConv]);

  if (!user) return null;

  const allStoredUsers = JSON.parse(localStorage.getItem("mh_users") || "[]");
  const availableUsers = allStoredUsers.filter(u => {
    if (u.id === user.id) return false;
    if (user.pseudo === "Azery" || user.pseudo === "Kraken") return true;
    return u.faction === user.faction || u.pseudo === "Azery" || u.pseudo === "Kraken";
  });

  const startConversation = (otherUser) => {
    const convKey = `dm-${otherUser.id}`;
    const existing = conversations.find(c => c.id === convKey);
    if (existing) {
      setSelectedConv(existing);
    } else {
      setSelectedConv({
        id: convKey,
        isGroup: false,
        otherId: otherUser.id,
        pseudo: otherUser.pseudo,
        avatar: otherUser.avatar,
        lastMsg: null,
        unread: 0,
      });
    }
    setShowNewConv(false);
    setSearchUser("");
  };

  // Build conversations list from allMsgs
  const convMap = {};
  allMsgs.forEach(msg => {
    if (msg.isGroup && msg.groupId) {
      if (!convMap[msg.groupId]) {
        convMap[msg.groupId] = {
          id: msg.groupId,
          isGroup: true,
          groupId: msg.groupId,
          participantIds: msg.participantIds || [],
          participantPseudos: msg.participantPseudos || [],
          groupName: msg.groupName || null,
          lastMsg: null,
          unread: 0,
        };
      }
      if (msg.groupName) convMap[msg.groupId].groupName = msg.groupName;
      convMap[msg.groupId].lastMsg = msg;
      if (!msg.read && msg.toId === user.id) convMap[msg.groupId].unread++;
    } else {
      const otherId = msg.fromId === user.id ? msg.toId : msg.fromId;
      if (!otherId) return;
      const convKey = `dm-${otherId}`;
      if (!convMap[convKey]) {
        const contactUser = users.find(u => u.id === otherId) || { id: otherId, pseudo: otherId === "system" ? "Système" : otherId, avatar: "⚙️" };
        convMap[convKey] = {
          id: convKey,
          isGroup: false,
          otherId,
          pseudo: contactUser.pseudo,
          avatar: contactUser.avatar,
          lastMsg: null,
          unread: 0,
        };
      }
      convMap[convKey].lastMsg = msg;
      if (!msg.read && msg.toId === user.id) convMap[convKey].unread++;
    }
  });

  const canMessage = (conv) => {
    if (user.pseudo === "Azery" || user.pseudo === "Kraken") return true;
    if (conv.isGroup) return true;
    if (conv.otherId === "system") return true;
    const otherUser = users.find(u => u.id === conv.otherId);
    if (!otherUser) return true;
    if (otherUser.pseudo === "Azery" || otherUser.pseudo === "Kraken") return true;
    return otherUser.faction === user.faction;
  };

  const conversations = Object.values(convMap)
    .filter(canMessage)
    .sort((a, b) => {
      const lastA = a.lastMsg?.date || "";
      const lastB = b.lastMsg?.date || "";
      return lastB.localeCompare(lastA);
    });

  const thread = selectedConv
    ? selectedConv.isGroup
      ? allMsgs.filter(m => m.groupId === selectedConv.groupId)
      : allMsgs.filter(m =>
          (m.fromId === selectedConv.otherId && m.toId === user.id) ||
          (m.toId === selectedConv.otherId && m.fromId === user.id)
        )
    : [];

  const isDisabled = !selectedConv || (!selectedConv.isGroup && selectedConv.otherId === "system");

  const formatTime = (date) => new Date(date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  const linkifyText = (text) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (urlRegex.test(part)) {
        urlRegex.lastIndex = 0;
        const href = part.startsWith("http") ? part : `https://${part}`;
        return (
          <a key={i} href={href} target="_blank" rel="noreferrer" className="msg-link" onClick={e => e.stopPropagation()}>
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const saveGroupName = () => {
    if (!newGroupName.trim()) return;
    const msgs = JSON.parse(localStorage.getItem("mh_messages") || "[]");
    const updated = msgs.map(m =>
      m.groupId === selectedConv.groupId ? { ...m, groupName: newGroupName.trim() } : m
    );
    localStorage.setItem("mh_messages", JSON.stringify(updated));
    setAllMsgs(getMessages());
    setSelectedConv(prev => ({ ...prev, groupName: newGroupName.trim() }));
    setEditingGroupName(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (i) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    if (isDisabled) return;

    const encodedAttachments = await Promise.all(
      attachments.map(file => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
        reader.readAsDataURL(file);
      }))
    );

    if (selectedConv.isGroup) {
      // Envoie à tous les participants du groupe (sauf soi-même)
      const allUsers = JSON.parse(localStorage.getItem("mh_users") || "[]");
      const msgs = JSON.parse(localStorage.getItem("mh_messages") || "[]");
      const { groupId, participantIds, participantPseudos } = selectedConv;

      participantIds
        .filter(id => id !== user.id)
        .forEach((id, i) => {
          const recipient = allUsers.find(u => u.id === id);
          if (!recipient) return;
          msgs.push({
            id: `msg-${Date.now()}-${i}`,
            fromId: user.id, fromPseudo: user.pseudo,
            toId: id, toPseudo: recipient.pseudo,
            content: input.trim(),
            attachments: encodedAttachments,
            date: new Date().toISOString(), read: false,
            isGroup: true, groupId, participantIds, participantPseudos,
          });
        });
      localStorage.setItem("mh_messages", JSON.stringify(msgs));
      setTimeout(() => setAllMsgs(getMessages()), 100);
    } else {
      sendMessage(selectedConv.otherId, input.trim(), encodedAttachments);
      setTimeout(() => setAllMsgs(getMessages()), 100);
    }

    setInput("");
    setAttachments([]);

    // Push notifications
    const allUsers = JSON.parse(localStorage.getItem("mh_users") || "[]");
    if (selectedConv.isGroup) {
      const recipients = allUsers.filter(u =>
        selectedConv.participantIds.includes(u.id) && u.id !== user.id && u.oneSignalId
      );
      const playerIds = recipients.map(u => u.oneSignalId).filter(Boolean);
      if (playerIds.length > 0) {
        sendNotification(playerIds, `💬 ${user.pseudo} — ${selectedConv.groupName || "Groupe"}`, input.slice(0, 100)).catch(() => {});
      }
    } else {
      const recipient = allUsers.find(u => u.id === selectedConv.otherId && u.oneSignalId);
      if (recipient?.oneSignalId) {
        sendNotification([recipient.oneSignalId], `💬 ${user.pseudo}`, input.slice(0, 100)).catch(() => {});
      }
    }
  };

  const paymentPanel = (
    <div className="payment-panel">
      <h3 className="payment-title">💳 Moyens de paiement</h3>
      <div className="payment-methods">
        <button className="payment-card revolut" onClick={() => handleCopy("https://revolut.me/suururugi", "revolut")}>
          <div className="payment-logo">💙</div>
          <div className="payment-info"><span className="payment-name">Revolut</span><span className="payment-link">revolut.me/suururugi</span></div>
          <span className="payment-arrow">{copied === "revolut" ? "✓ Copié" : "📋"}</span>
        </button>
        <button className="payment-card paypal" onClick={() => handleCopy("https://www.paypal.me/darkvadorducss", "paypal")}>
          <div className="payment-logo">🅿️</div>
          <div className="payment-info"><span className="payment-name">PayPal</span><span className="payment-link">paypal.me/darkvadorducss</span></div>
          <span className="payment-arrow">{copied === "paypal" ? "✓ Copié" : "📋"}</span>
        </button>
        <button className="payment-card bitcoin" onClick={() => handleCopy("bc1qc0hget6a7wnfaylxyh78psrycm8e55gjlrxvgq", "btc")}>
          <div className="payment-logo">₿</div>
          <div className="payment-info"><span className="payment-name">Bitcoin</span><span className="payment-link">bc1qc0hget6a7wnfaylxyh78psrycm8e55gjlrxvgq</span></div>
          <span className="payment-arrow">{copied === "btc" ? "✓ Copié" : "📋"}</span>
        </button>
        <button className="payment-card ltc" onClick={() => handleCopy("LawXU3nBgDoDUUy5ijcKrgzWCT6qefgDp9", "ltc")}>
          <div className="payment-logo">Ł</div>
          <div className="payment-info"><span className="payment-name">Litecoin</span><span className="payment-link">LawXU3nBgDoDUUy5ijcKrgzWCT6qefgDp9</span></div>
          <span className="payment-arrow">{copied === "ltc" ? "✓ Copié" : "📋"}</span>
        </button>
        <button className="payment-card virement" onClick={() => handleCopy("FR76 2823 30000188 0778 9405 046", "vir")}>
          <div className="payment-logo">🏦</div>
          <div className="payment-info"><span className="payment-name">Virement bancaire</span><span className="payment-link">FR76 2823 30000188 0778 9405 046</span></div>
          <span className="payment-arrow">{copied === "vir" ? "✓ Copié" : "📋"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <main className="messages-page">
      {/* Colonne principale — conversation */}
      <div className="msg-main">
        <div className="msg-thread">
          {!selectedConv ? (
            <div className="msg-empty">
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
              <p>Sélectionne une conversation</p>
            </div>
          ) : (
            <>
              {/* Header de la conversation */}
              <div className="msg-conv-header">
                {selectedConv.isGroup ? (
                  <div className="msg-group-header">
                    <span style={{ fontSize: "1.4rem" }}>👥</span>
                    <div style={{ flex: 1 }}>
                      {editingGroupName ? (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            className="group-name-input"
                            value={newGroupName}
                            onChange={e => setNewGroupName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveGroupName(); if (e.key === "Escape") setEditingGroupName(false); }}
                            autoFocus
                          />
                          <button className="group-name-save" onClick={saveGroupName}>✓</button>
                          <button className="group-name-cancel" onClick={() => setEditingGroupName(false)}>✕</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div className="msg-conv-title">
                            {selectedConv.groupName || "Groupe"}
                          </div>
                          <button
                            className="group-rename-btn"
                            onClick={() => { setNewGroupName(selectedConv.groupName || "Groupe"); setEditingGroupName(true); }}
                            title="Renommer le groupe"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                      <div className="msg-conv-participants">
                        {selectedConv.participantPseudos?.join(" · ")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="msg-group-header">
                    <span className="conv-avatar">{renderAvatar(selectedConv.avatar, "36px")}</span>
                    <div className="msg-conv-title">{selectedConv.pseudo}</div>
                  </div>
                )}
              </div>

              <div className="msg-bubbles">
                {thread.map((m, i) => {
                  const isMine = m.fromId === user.id;
                  const prevDate = i > 0 ? formatDate(thread[i-1].date) : null;
                  const currDate = formatDate(m.date);
                  return (
                    <div key={m.id}>
                      {currDate !== prevDate && (
                        <div className="msg-date-sep">{currDate}</div>
                      )}
                      <div className={`msg-bubble-wrap ${isMine ? "sent" : "received"}`}>
                        <div className={isMine ? "msg-bubble-sent" : "msg-bubble-received"}>
                          {selectedConv.isGroup && !isMine && (
                            <div className="msg-sender-name">{m.fromPseudo}</div>
                          )}
                          {m.content && <div className="msg-text">{linkifyText(m.content)}</div>}
                          {m.attachments?.length > 0 && (
                            <div className="msg-attachments">
                              {m.attachments.map((att, idx) => (
                                att.type?.startsWith("image/") ? (
                                  <img
                                    key={idx}
                                    src={att.data}
                                    alt={att.name}
                                    className="msg-attachment-img"
                                    onClick={() => window.open(att.data)}
                                  />
                                ) : (
                                  <a key={idx} href={att.data} download={att.name} className="msg-attachment-file">
                                    📄 {att.name}
                                  </a>
                                )
                              ))}
                            </div>
                          )}
                          <div className="msg-time">{formatTime(m.date)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {user?.isAdmin && (
          <>
            {paymentOpen && paymentPanel}
            <div className="payment-toggle" onClick={() => setPaymentOpen(!paymentOpen)}>
              <span>{paymentOpen ? "▼ Fermer les paiements" : "▲ Moyens de paiement"}</span>
            </div>
          </>
        )}

        <form className="msg-input-bar" onSubmit={handleSend}>
          <label className="attach-btn" title="Joindre un fichier">
            📎
            <input
              type="file"
              accept="image/*,.pdf,.txt,.doc,.docx"
              style={{ display: "none" }}
              onChange={handleFileAttach}
              multiple
            />
          </label>

          <div className="msg-input-col">
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((file, i) => (
                  <div key={i} className="attach-preview-item">
                    {file.type.startsWith("image/") ? (
                      <img src={URL.createObjectURL(file)} alt={file.name} className="attach-thumb" />
                    ) : (
                      <span className="attach-file-name">📄 {file.name}</span>
                    )}
                    <button type="button" className="attach-remove" onClick={() => removeAttachment(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <textarea
              placeholder={isDisabled ? "Impossible de répondre au système" : "Envoyer un message…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isDisabled}
              rows={1}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
              }}
            />
          </div>

          <button type="submit" className="msg-send-btn" disabled={isDisabled}>
            Envoyer
          </button>
        </form>
      </div>

      {/* Modale nouvelle conversation */}
      {showNewConv && (
        <div className="new-conv-modal">
          <div className="new-conv-inner">
            <button className="modal-close" onClick={() => { setShowNewConv(false); setSearchUser(""); }}>✕</button>
            <h3 className="new-conv-title">Nouvelle conversation</h3>
            <input
              className="mh-input"
              placeholder="Chercher un membre..."
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              autoFocus
            />
            <div className="new-conv-list">
              {availableUsers
                .filter(u => u.pseudo.toLowerCase().includes(searchUser.toLowerCase()))
                .map(u => (
                  <div key={u.id} className="new-conv-item" onClick={() => startConversation(u)}>
                    <div className="contact-avatar">
                      {typeof u.avatar === "string" && (u.avatar.startsWith("data:") || u.avatar.startsWith("http"))
                        ? <img src={u.avatar} alt="" style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "1.3rem" }}>{u.avatar || "🌸"}</span>}
                    </div>
                    <div>
                      <div className="contact-name">{u.pseudo}</div>
                      <div className="contact-preview">{u.perms?.[0] || "Membre"}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Colonne contacts — à droite */}
      <div className="msg-contacts">
        <div className="msg-contacts-header">
          <span>💬 Conversations</span>
          <button className="new-conv-btn" onClick={() => setShowNewConv(true)}>+</button>
        </div>
        {conversations.length === 0 && (
          <div style={{ color: "#7A6A85", padding: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
            Aucune conversation
          </div>
        )}
        {conversations.map(conv => (
          <div
            key={conv.id}
            className={`contact-item ${selectedConv?.id === conv.id ? "active" : ""}`}
            onClick={() => setSelectedConv(conv)}
          >
            <div className="contact-avatar">
              {conv.isGroup
                ? <span style={{ fontSize: "1.2rem" }}>👥</span>
                : renderAvatar(conv.avatar, "40px")
              }
            </div>
            <div className="contact-info">
              <div className="contact-name">
                {conv.isGroup
                  ? `👥 ${conv.participantPseudos?.join(" · ")}`
                  : conv.pseudo
                }
              </div>
              <div className="contact-preview">
                {conv.lastMsg?.content?.slice(0, 35)}{conv.lastMsg?.content?.length > 35 ? "…" : ""}
              </div>
            </div>
            {conv.unread > 0 && <span className="msg-badge">{conv.unread}</span>}
          </div>
        ))}
      </div>
    </main>
  );
}
