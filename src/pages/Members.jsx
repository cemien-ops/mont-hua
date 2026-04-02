import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { perms, abonnements } from "../data/shopData";

const ROLE_CLASS_MAP = {
  "Co-owner": "kami", "Owner": "oni", "Diamant": "ryu", "Billet": "samui",
  "Soleil": "shogun", "Trèfle": "nakama", "Flocon": "daimyo", "Bulle": "shinigami",
  "Royal": "royal", "Crown": "crown", "Admin": "admin", "BOT=BOT": "bot",
  "Invisible": "invisible", "Couronne": "couronne", "Créateur": "createur", "Système": "systeme",
};

function renderAvatar(avatar, size = "2.5rem") {
  if (!avatar) return <span>🌸</span>;
  if (typeof avatar === "string" && (avatar.startsWith("data:") || avatar.startsWith("http"))) {
    return <img src={avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  }
  return <span>{avatar}</span>;
}

function getRoleClass(roleName) {
  if (roleName === "Gérant") return "role-gerant";
  return ROLE_CLASS_MAP[roleName] ? `role-${ROLE_CLASS_MAP[roleName]}` : "";
}

function getMaxPermPrice(permNames) {
  if (!permNames?.length) return 0;
  return Math.max(...permNames.map(name => {
    if (name === "Gérant") return 999999;
    const p = perms.find(p => p.role === name);
    return p ? p.price : 0;
  }));
}

function getPrimaryPerm(permNames) {
  if (!permNames?.length) return null;
  if (permNames.includes("Gérant")) return "Gérant";
  return [...permNames].sort((a, b) => {
    const pa = perms.find(p => p.role === a)?.price || 0;
    const pb = perms.find(p => p.role === b)?.price || 0;
    return pb - pa;
  })[0];
}

export default function Members() {
  const { members, user } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);

  const selectedFaction = localStorage.getItem("mh_faction") || "azery";
  const visibleMembers = members.filter(m => {
    if (user?.pseudo === "Azery" || user?.pseudo === "Kraken") return true;
    if (!user) return m.faction === selectedFaction || m.pseudo === "Azery" || m.pseudo === "Kraken";
    return m.faction === user.faction || m.pseudo === "Azery" || m.pseudo === "Kraken";
  });
  const sorted = [...visibleMembers].sort((a, b) => getMaxPermPrice(b.perms) - getMaxPermPrice(a.perms));

  return (
    <main className="members">
      <div className="members-header">
        <h1>Nos Membres</h1>
        <p>La communauté Mont Hua</p>
      </div>

      {sorted.length === 0 ? (
        <div className="members-empty">
          <p>🌸 Aucun membre pour l'instant.<br />Crée ton compte pour apparaître ici !</p>
        </div>
      ) : (
        <div className="members-grid">
          {sorted.map((m) => {
            const primary = getPrimaryPerm(m.perms);
            return (
              <div key={m.pseudo} className="member-card">
                <div
                  className="member-avatar"
                  onClick={() => setSelectedMember(m)}
                  style={{ cursor: "pointer", transition: "0.2s", userSelect: "none" }}
                  title="Voir le profil"
                >
                  {renderAvatar(m.avatar)}
                </div>
                <div className="member-info">
                  <span className="member-pseudo">{m.pseudo}</span>
                  <span className={`member-role ${getRoleClass(primary)}`}>
                    {primary === "Gérant" ? "👑 Gérant" : (primary || "Membre")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedMember && (() => {
        const aboData = abonnements.find((a) => a.name === selectedMember.abonnement);
        const orderedPerms = selectedMember.perms?.includes("Gérant")
          ? ["Gérant", ...(selectedMember.perms.filter(p => p !== "Gérant"))]
          : (selectedMember.perms || []);
        return (
          <>
            <div className="modal-overlay" onClick={() => setSelectedMember(null)} />
            <div className="member-modal">
              <button className="modal-close" onClick={() => setSelectedMember(null)}>✕</button>
              <div className="modal-avatar">{renderAvatar(selectedMember.avatar, "4rem")}</div>
              <div className="modal-pseudo">{selectedMember.pseudo}</div>
              {selectedMember.customId && (
                <div className="modal-custom-id">{selectedMember.customId}</div>
              )}

              <div className="modal-section">
                <h4>🎭 Perm</h4>
                <div className="tags">
                  {orderedPerms.length > 0 ? orderedPerms.map(p => (
                    <span key={p} className={`tag perm ${getRoleClass(p)}`}>
                      {p === "Gérant" ? "👑 Gérant" : p}
                    </span>
                  )) : <span className="empty">Aucune perm</span>}
                </div>
              </div>

              <div className="modal-section">
                <h4>💎 Abonnement</h4>
                <div className="tags">
                  {selectedMember.abonnement
                    ? <span className="tag abo">{selectedMember.abonnement}</span>
                    : <span className="empty">Aucun abonnement</span>}
                </div>
              </div>

              <div className="modal-section">
                <h4>📋 Whitelist</h4>
                <div className="tags">
                  {selectedMember.whitelist?.length
                    ? selectedMember.whitelist.map((w) => <span key={w} className="tag wl">{w}</span>)
                    : <span className="empty">Aucune whitelist</span>}
                </div>
              </div>

              {(user?.pseudo === "Azery" || user?.pseudo === "Kraken") && selectedMember.parrain && (
                <div className="modal-section">
                  <h4>🤝 Parrainage</h4>
                  <span className="modal-parrain">Parrainé par : <strong>{selectedMember.parrain}</strong></span>
                </div>
              )}
            </div>
          </>
        );
      })()}
    </main>
  );
}
