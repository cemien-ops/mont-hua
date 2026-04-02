import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function renderAvatar(avatar, size = "24px") {
  if (!avatar) return "🌸";
  if (typeof avatar === "string" && (avatar.startsWith("data:") || avatar.startsWith("http"))) {
    return <img src={avatar} alt="" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", verticalAlign: "middle" }} />;
  }
  return avatar;
}

function UserDropdown({ user, logout, deleteProfile }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDelete = () => {
    if (window.confirm("Es-tu sûr de vouloir supprimer ton profil ? Cette action est irréversible.")) {
      deleteProfile(user.pseudo);
    }
  };

  const userPerms = user.perms || [];
  const orderedPerms = userPerms.includes("Gérant")
    ? ["Gérant", ...userPerms.filter(p => p !== "Gérant")]
    : userPerms;
  const aboName  = user.abonnement || null;
  const wlNames  = user.whitelist || [];

  return (
    <div className="user-dropdown-wrapper" ref={ref}>
      <button className="user-pseudo-btn" onClick={() => setOpen(!open)}>
        {renderAvatar(user.avatar)} {user.pseudo} ▾
      </button>

      {open && (
        <div className="user-dropdown">
          <div className="dropdown-section">
            {orderedPerms.length > 0 && (
              <>
                <span className="dropdown-label">⛩️ Permission</span>
                <div className="dropdown-tags">
                  {orderedPerms.map(p => (
                    <span key={p} className={`tag tag-perm ${p === "Gérant" ? "role-gerant" : ""}`}>
                      {p === "Gérant" ? "👑 Gérant" : p}
                    </span>
                  ))}
                </div>
              </>
            )}
            {aboName && (
              <>
                <span className="dropdown-label">💎 Abonnement</span>
                <div className="dropdown-tags">
                  <span className="tag tag-abo">{aboName}</span>
                </div>
              </>
            )}
            {wlNames.length > 0 && (
              <>
                <span className="dropdown-label">📋 Whitelist</span>
                <div className="dropdown-tags">
                  {wlNames.map((w) => (
                    <span key={w} className="tag tag-wl">{w}</span>
                  ))}
                </div>
              </>
            )}
            {orderedPerms.length === 0 && !aboName && wlNames.length === 0 && (
              <span style={{ color: "rgba(255,200,220,0.5)", fontSize: "0.8rem" }}>Aucune possession</span>
            )}
          </div>

          <hr className="dropdown-divider" />

          {user.id !== "azery-001" && user.id !== "kraken-001" && (
            <button className="dropdown-delete" onClick={handleDelete}>
              🗑️ Supprimer mon profil
            </button>
          )}
          <button className="dropdown-logout" onClick={logout}>
            🚪 Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { items, setOpen } = useCart();
  const { user, logout, deleteProfile, getUnreadCount } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread,   setUnread]   = useState(0);

  useEffect(() => {
    document.body.setAttribute("data-faction", user?.faction || "azery");
  }, [user]);

  useEffect(() => {
    const refresh = () => setUnread(getUnreadCount ? getUnreadCount() : 0);
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [user, getUnreadCount]);

  const goto = (path) => navigate("/" + (path === "home" ? "" : path));

  const navLinks = [
    { to: "/",       label: "Accueil" },
    { to: "/shop",   label: "Boutique" },
    { to: "/members",label: "Membres" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img
          src="https://i.imgur.com/mqupgXe.png"
          alt="Mont Hua"
          style={{ width: "36px", height: "36px", objectFit: "contain" }}
        />
        <span className="navbar-title">Mont Hua</span>
      </div>

      <div className="navbar-links">
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`nav-link ${location.pathname === l.to ? "active" : ""}`}
          >
            {l.label}
          </Link>
        ))}
        {user && (
          <Link
            to="/messages"
            className={`nav-link ${location.pathname === "/messages" ? "active" : ""}`}
          >
            ✉️ Messages
            {unread > 0 && <span className="msg-badge">{unread}</span>}
          </Link>
        )}
        {user?.isAdmin && (
          <Link
            to="/admin"
            className={`nav-link nav-admin ${location.pathname === "/admin" ? "active" : ""}`}
          >
            ⚙️ Admin
          </Link>
        )}
      </div>

      <div className="navbar-actions">
        {user ? (
          <UserDropdown user={user} logout={logout} deleteProfile={deleteProfile} />
        ) : (
          <Link to="/auth" className="btn-ghost">Connexion</Link>
        )}
        <button className="cart-btn" onClick={() => setOpen(true)}>
          🛒
          {items.length > 0 && <span className="cart-badge">{items.length}</span>}
        </button>
        <button className="burger-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <button onClick={() => { goto("home");     setMenuOpen(false); }}>Accueil</button>
          <button onClick={() => { goto("shop");     setMenuOpen(false); }}>Boutique</button>
          <button onClick={() => { goto("members");  setMenuOpen(false); }}>Membres</button>
          {user && (
            <button onClick={() => { goto("messages"); setMenuOpen(false); }}>
              ✉️ Messages {unread > 0 && `(${unread})`}
            </button>
          )}
          {user?.isAdmin && (
            <button onClick={() => { goto("admin"); setMenuOpen(false); }}>⚙️ Admin</button>
          )}
        </div>
      )}
    </nav>
  );
}
