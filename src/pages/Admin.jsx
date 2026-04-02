import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { perms, abonnements, whitelist } from "../data/shopData";

function renderAvatar(avatar, size = "2rem") {
  if (!avatar) return <span>🌸</span>;
  if (typeof avatar === "string" && (avatar.startsWith("data:") || avatar.startsWith("http"))) {
    return <img src={avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  }
  return <span>{avatar}</span>;
}

function loadOrders() {
  try { return JSON.parse(localStorage.getItem("mh_orders")) || []; } catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem("mh_orders", JSON.stringify(orders));
}

const allWLItems = whitelist.flatMap(cat => cat.items);

function RoleAssignSection({ selectedPerms, setSelectedPerms, selectedAbo, setSelectedAbo, selectedWL, setSelectedWL }) {
  const togglePerm = (role) => setSelectedPerms(prev =>
    prev.includes(role) ? prev.filter(p => p !== role) : [...prev, role]
  );
  const toggleWL = (name) => setSelectedWL(prev =>
    prev.includes(name) ? prev.filter(w => w !== name) : [...prev, name]
  );

  return (
    <div className="role-assign-section">
      <h4 className="role-assign-title">🎭 Permissions</h4>
      <div className="role-assign-grid">
        {perms.map(p => (
          <label key={p.id} className={`role-checkbox-label role-${p.id === "botbot" ? "bot" : p.id}`}>
            <input
              type="checkbox"
              checked={selectedPerms.includes(p.role)}
              onChange={() => togglePerm(p.role)}
            />
            <span>{p.role}</span>
          </label>
        ))}
      </div>

      <h4 className="role-assign-title">💎 Abonnement</h4>
      <select className="mh-select" value={selectedAbo} onChange={e => setSelectedAbo(e.target.value)}>
        <option value="">Aucun</option>
        {abonnements.map(a => (
          <option key={a.id} value={a.name}>{a.name}</option>
        ))}
      </select>

      <h4 className="role-assign-title">📋 Whitelist</h4>
      <div className="role-assign-grid">
        {allWLItems.map(item => (
          <label key={item.id} className="role-checkbox-label">
            <input
              type="checkbox"
              checked={selectedWL.includes(item.name)}
              onChange={() => toggleWL(item.name)}
            />
            <span>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, users, createUser, deleteUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("members");

  // Create form
  const [newPseudo,    setNewPseudo]    = useState("");
  const [userId,       setUserId]       = useState("");
  const [newPassword,  setNewPassword]  = useState("");
  const [newIsAdmin,   setNewIsAdmin]   = useState(false);
  const [avatarMode,   setAvatarMode]   = useState("emoji");
  const [avatarEmoji,  setAvatarEmoji]  = useState("");
  const [avatarUrl,    setAvatarUrl]    = useState("");
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [avatarData,   setAvatarData]   = useState("");
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [selectedAbo,   setSelectedAbo]   = useState("");
  const [selectedWL,    setSelectedWL]    = useState([]);
  const [createMsg,    setCreateMsg]    = useState("");
  const [creating,     setCreating]     = useState(false);

  // Edit modal
  const [editUser,    setEditUser]    = useState(null);
  const [editPerms,   setEditPerms]   = useState([]);
  const [editAbo,     setEditAbo]     = useState("");
  const [editWL,      setEditWL]      = useState([]);
  const [editParrain, setEditParrain] = useState("");

  // Orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(loadOrders());
  }, [tab]);

  if (!user?.isAdmin) {
    navigate("/");
    return null;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newPseudo.trim() || !newPassword) { setCreateMsg("Remplis pseudo et mot de passe."); return; }
    if (users.find(u => u.pseudo.toLowerCase() === newPseudo.trim().toLowerCase())) {
      setCreateMsg("Ce pseudo existe déjà.");
      return;
    }
    setCreating(true);
    const finalAvatar = avatarMode === "emoji" ? (avatarEmoji || "🌸")
                      : avatarMode === "url"   ? avatarUrl
                      : avatarData || "🌸";
    const newUser = await createUser({
      pseudo: newPseudo, password: newPassword, avatar: finalAvatar,
      isAdmin: newIsAdmin, customId: userId.trim() || null,
      perms: selectedPerms, abonnement: selectedAbo || null, whitelist: selectedWL,
    });
    setNewPseudo(""); setUserId(""); setNewPassword(""); setNewIsAdmin(false);
    setAvatarMode("emoji"); setAvatarEmoji(""); setAvatarUrl(""); setAvatarFile(null); setAvatarData("");
    setSelectedPerms([]); setSelectedAbo(""); setSelectedWL([]);
    setCreateMsg(`Compte "${newUser.pseudo}" créé avec succès !`);
    setCreating(false);
    setTimeout(() => setCreateMsg(""), 3000);
  };

  const managedUsers = (user?.pseudo === "Azery" || user?.pseudo === "Kraken")
    ? users
    : users.filter(u => u.faction === user?.faction || u.id === "azery-001" || u.id === "kraken-001");

  const toggleAdmin = (u) => {
    if (u.id === "azery-001" || u.id === "kraken-001") return;
    updateUser(u.id, { isAdmin: !u.isAdmin });
  };

  const openEditModal = (u) => {
    setEditUser(u);
    setEditPerms(u.perms || []);
    setEditAbo(u.abonnement || "");
    setEditWL(u.whitelist || []);
    setEditParrain(Array.isArray(u.parrain) ? u.parrain.join(", ") : (u.parrain || ""));
  };

  const handleSaveEdit = () => {
    const isGerant = user?.pseudo === "Azery" || user?.pseudo === "Kraken";
    const parrainArray = isGerant
      ? editParrain.split(",").map(s => s.trim()).filter(Boolean)
      : editUser.parrain;
    updateUser(editUser.id, {
      perms: editPerms, abonnement: editAbo || null, whitelist: editWL,
      parrain: parrainArray,
    });
    setEditUser(null);
  };

  const PERM_PRICES = {
    "Co-owner": 10, "Owner": 25, "Diamant": 50, "Billet": 100, "Soleil": 160,
    "Trèfle": 230, "Flocon": 300, "Bulle": 400, "Royal": 550, "Crown": 800,
    "Admin": 1200, "BOT=BOT": 1800, "Invisible": 2500, "Couronne": 3500,
    "Créateur": 5500, "Système": 8500,
  };
  const ABO_PRICES = {
    "SILVER": 14.99, "GOLD": 29.99, "PLAT": 44.99,
    "DIAMS": 74.99, "RUBY": 149.99, "OPAL": 299.99,
  };

  const handleTreated = (order) => {
    // 1. Marquer la commande comme traitée
    const updatedOrders = orders.map(o => o.id === order.id ? { ...o, treated: true } : o);
    saveOrders(updatedOrders);
    setOrders(updatedOrders);

    // 2. Trouver le membre
    const allUsers = JSON.parse(localStorage.getItem("mh_users") || "[]");
    const memberIndex = allUsers.findIndex(u => u.id === order.userId);
    if (memberIndex === -1) return;
    const member = { ...allUsers[memberIndex] };

    // 3. Classer les items par type (perm / abo / wl)
    const permNames = new Set(Object.keys(PERM_PRICES));
    const aboNames  = new Set(Object.keys(ABO_PRICES));
    const permItems = order.items.filter(i => permNames.has(i.name));
    const aboItems  = order.items.filter(i => aboNames.has(i.name));
    const wlItems   = order.items.filter(i => !permNames.has(i.name) && !aboNames.has(i.name));

    // 4. Appliquer la nouvelle perm (remplace les perms connues, garde les spéciales)
    if (permItems.length > 0) {
      const newPerm = permItems.sort((a, b) => (PERM_PRICES[b.name] || 0) - (PERM_PRICES[a.name] || 0))[0];
      const knownPerms = Object.keys(PERM_PRICES);
      member.perms = [
        ...(member.perms || []).filter(p => !knownPerms.includes(p)),
        newPerm.name,
      ];
    }

    // 5. Appliquer le nouvel abonnement
    if (aboItems.length > 0) {
      const newAbo = aboItems.sort((a, b) => (ABO_PRICES[b.name] || 0) - (ABO_PRICES[a.name] || 0))[0];
      member.abonnement = newAbo.name;
    }

    // 6. Ajouter les whitelist (sans doublons)
    if (wlItems.length > 0) {
      const newWLNames = wlItems.map(i => i.name);
      member.whitelist = [...new Set([...(member.whitelist || []), ...newWLNames])];
    }

    // 7. Message de confirmation au membre
    const confirmContent = [
      "✅ Ta commande a été traitée !",
      "",
      permItems.length > 0 ? `🎭 Perm ajoutée : ${permItems.map(p => p.name).join(", ")}` : null,
      aboItems.length > 0  ? `💎 Abonnement : ${aboItems.map(a => a.name).join(", ")}`    : null,
      wlItems.length > 0   ? `📋 Whitelist ajoutée : ${wlItems.map(w => w.name).join(", ")}` : null,
      "",
      "Merci pour ta confiance ! 🌸",
    ].filter(l => l !== null).join("\n");

    const msgs = JSON.parse(localStorage.getItem("mh_messages") || "[]");
    msgs.push({
      id: `msg-${Date.now()}`,
      fromId: "azery-001", fromPseudo: "Azery",
      toId: member.id, toPseudo: member.pseudo,
      content: confirmContent,
      date: new Date().toISOString(), read: false,
      attachments: [],
    });
    localStorage.setItem("mh_messages", JSON.stringify(msgs));

    // 8. Mettre à jour le profil via le contexte
    updateUser(member.id, {
      perms: member.perms,
      abonnement: member.abonnement,
      whitelist: member.whitelist,
    });
  };

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Panel Admin</h1>
        <p>Gestion du serveur Mont Hua</p>
      </div>

      <div className="tabs" style={{ justifyContent: "flex-start" }}>
        {[["members","👥 Membres"], ["create","➕ Créer un compte"], ["orders","📦 Commandes"]].map(([id, label]) => (
          <button key={id} className={`tab ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Pseudo</th>
                <th>Perms</th>
                <th>Abonnement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managedUsers.map(u => (
                <tr key={u.id} className="admin-row">
                  <td style={{ fontSize: "1.4rem" }}>{renderAvatar(u.avatar, "36px")}</td>
                  <td className="admin-pseudo">
                    {u.pseudo}
                    {u.isAdmin && <span className="badge-admin">Admin</span>}
                  </td>
                  <td style={{ color: "#BFA6C9", fontSize: "0.8rem" }}>
                    {(u.perms || []).slice(0, 2).join(", ") || "—"}
                    {(u.perms || []).length > 2 && ` +${u.perms.length - 2}`}
                  </td>
                  <td style={{ color: "#D9B45B" }}>{u.abonnement || "—"}</td>
                  <td>
                    <span className={`status-dot ${u.id === user.id ? "online" : ""}`} />
                  </td>
                  <td className="admin-actions">
                    <button
                      className="admin-action-btn edit"
                      onClick={() => openEditModal(u)}
                    >
                      ✏️ Modifier
                    </button>
                    {u.id !== "azery-001" && u.id !== "kraken-001" && (
                      <>
                        <button
                          className="admin-action-btn toggle-admin"
                          onClick={() => toggleAdmin(u)}
                          title={u.isAdmin ? "Retirer admin" : "Accorder admin"}
                        >
                          👑 {u.isAdmin ? "Retirer" : "Admin"}
                        </button>
                        <button
                          className="admin-action-btn delete"
                          onClick={() => { if (window.confirm(`Supprimer ${u.pseudo} ?`)) deleteUser(u.id); }}
                        >
                          🗑️ Supprimer
                        </button>
                      </>
                    )}
                    {(u.id === "azery-001" || u.id === "kraken-001") && <span style={{ color: "#7A6A85", fontSize: "0.8rem" }}>Protégé</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "create" && (
        <div className="admin-create-wrap">
          <div className="create-form-wrapper">
            <div className="spiral-petals">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="spiral-petal" style={{ "--i": i }} />
              ))}
            </div>
            <div className="admin-create-form">
              <h3 style={{ color: "#F2E9F7", marginBottom: "1.25rem", fontFamily: "'Cinzel', serif" }}>
                Nouveau membre
              </h3>
              <form onSubmit={handleCreate}>
                <input placeholder="Pseudo" className="mh-input" value={newPseudo} onChange={e => setNewPseudo(e.target.value)} />
                <input className="mh-input" placeholder="ID personnalisé (ex: #0001)" value={userId} onChange={e => setUserId(e.target.value)} />
                <input type="password" placeholder="Mot de passe" className="mh-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <div className="avatar-input-section">
                  <label className="role-assign-title">🤍 AVATAR</label>
                  <div className="avatar-tabs">
                    <button className={`avatar-tab ${avatarMode === "emoji" ? "active" : ""}`} onClick={() => setAvatarMode("emoji")} type="button">Emoji</button>
                    <button className={`avatar-tab ${avatarMode === "url" ? "active" : ""}`} onClick={() => setAvatarMode("url")} type="button">Lien URL</button>
                    <button className={`avatar-tab ${avatarMode === "file" ? "active" : ""}`} onClick={() => setAvatarMode("file")} type="button">Fichier</button>
                  </div>
                  {avatarMode === "emoji" && (
                    <input className="mh-input" placeholder="Ex: 🌸 👑 🐉" value={avatarEmoji} onChange={e => setAvatarEmoji(e.target.value)} />
                  )}
                  {avatarMode === "url" && (
                    <input className="mh-input" placeholder="https://..." value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} />
                  )}
                  {avatarMode === "file" && (
                    <label className="avatar-file-label">
                      {avatarFile ? (
                        <img src={URL.createObjectURL(avatarFile)} alt="avatar" className="avatar-file-preview" />
                      ) : (
                        <span>📁 Cliquer pour choisir une image</span>
                      )}
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setAvatarFile(file);
                          const reader = new FileReader();
                          reader.onload = () => setAvatarData(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  )}
                  <div className="avatar-preview">
                    {avatarMode === "emoji" && <span style={{ fontSize: "2.5rem" }}>{avatarEmoji || "🌸"}</span>}
                    {avatarMode === "url" && avatarUrl && <img src={avatarUrl} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />}
                    {avatarMode === "file" && avatarData && <img src={avatarData} alt="" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />}
                  </div>
                </div>
                <label className="admin-checkbox">
                  <input type="checkbox" checked={newIsAdmin} onChange={e => setNewIsAdmin(e.target.checked)} />
                  <span>Accorder les droits Admin</span>
                </label>

                <RoleAssignSection
                  selectedPerms={selectedPerms} setSelectedPerms={setSelectedPerms}
                  selectedAbo={selectedAbo}     setSelectedAbo={setSelectedAbo}
                  selectedWL={selectedWL}       setSelectedWL={setSelectedWL}
                />

                {createMsg && (
                  <div style={{ color: createMsg.includes("succès") ? "#90ffb0" : "#ff6b6b", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
                    {createMsg}
                  </div>
                )}
                <button type="submit" className="mh-btn" disabled={creating} style={{ marginTop: "1rem" }}>
                  {creating ? "Création…" : "Créer le compte"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="admin-orders">
          {orders.length === 0 ? (
            <div className="members-empty"><p>📦 Aucune commande pour l'instant.</p></div>
          ) : (
            [...orders].reverse().map(order => (
              <div key={order.id} className={`order-card ${order.treated ? "order-treated" : ""}`}>
                <div className="order-header">
                  <span className="order-pseudo">{order.pseudo}</span>
                  <span className="order-date">{new Date(order.date).toLocaleString("fr-FR")}</span>
                  {order.treated && <span className="badge-treated">✓ Traité</span>}
                </div>
                <div className="order-items">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="order-item">
                      <span>{item.name}</span>
                      <span style={{ color: "#D9B45B" }}>{item.price} 🪙</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">Total : <strong>{order.total?.toFixed?.(2) ?? order.total} 🪙</strong></span>
                  {!order.treated && (
                    <button className="admin-btn admin-btn-treat" onClick={() => handleTreated(order)}>
                      ✓ Traité
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <>
          <div className="admin-edit-overlay" onClick={() => setEditUser(null)} />
          <div className="admin-edit-modal">
            <button className="modal-close" onClick={() => setEditUser(null)}>✕</button>
            <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{renderAvatar(editUser.avatar, "48px")}</div>
            <h3 style={{ color: "#F2E9F7", fontFamily: "'Cinzel', serif", marginBottom: "0.5rem" }}>
              {editUser.pseudo}
            </h3>
            <RoleAssignSection
              selectedPerms={editPerms} setSelectedPerms={setEditPerms}
              selectedAbo={editAbo}     setSelectedAbo={setEditAbo}
              selectedWL={editWL}       setSelectedWL={setEditWL}
            />
            {(user?.pseudo === "Azery" || user?.pseudo === "Kraken") && (
              <div style={{ marginTop: "1rem" }}>
                <label className="role-assign-title">🤝 Parrain(s)</label>
                <input
                  className="mh-input"
                  placeholder="ex: Azery, Sakura, #0042"
                  value={editParrain}
                  onChange={e => setEditParrain(e.target.value)}
                />
                <p style={{ fontSize: "0.72rem", color: "#7A6A85", marginTop: "4px" }}>
                  Pseudo(s) ou ID(s) séparés par des virgules. Si plusieurs membres ont le même pseudo, utilise leur ID.
                </p>
              </div>
            )}
            <button className="mh-btn" style={{ marginTop: "1.25rem" }} onClick={handleSaveEdit}>
              💾 Sauvegarder
            </button>
          </div>
        </>
      )}
    </main>
  );
}
