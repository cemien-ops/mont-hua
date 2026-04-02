import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { perms, abonnements, whitelist } from "../data/shopData";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pseudo = location.state?.pseudo || "";

  const [selectedPerm, setSelectedPerm] = useState(null);
  const [selectedAbo, setSelectedAbo] = useState(null);
  const [selectedWl, setSelectedWl] = useState([]);

  if (!pseudo) {
    navigate("/auth");
    return null;
  }

  const toggleWl = (id) => {
    setSelectedWl((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(pseudo, {
      perm: selectedPerm,
      abonnement: selectedAbo,
      wlItems: selectedWl,
    });
    navigate("/");
  };

  return (
    <main className="auth">
      <div className="auth-card register-card">
        <div className="auth-icon">🌸</div>
        <h2>Bienvenue, {pseudo} !</h2>
        <p>Indique ce que tu possèdes déjà sur le serveur</p>

        <form onSubmit={handleSubmit} className="auth-form register-form">

          {/* PERM ACTUELLE */}
          <div className="reg-section">
            <h3 className="reg-section-title">⛩️ Permission actuelle</h3>
            <div className="reg-perm-grid">
              <label className={`reg-option ${selectedPerm === null ? "selected" : ""}`}>
                <input type="radio" name="perm" value="" checked={selectedPerm === null}
                  onChange={() => setSelectedPerm(null)} />
                Aucune
              </label>
              {perms.map((p) => (
                <label
                  key={p.id}
                  className={`reg-option ${selectedPerm === p.id ? "selected" : ""}`}
                  style={{ "--opt-color": p.color }}
                >
                  <input type="radio" name="perm" value={p.id}
                    checked={selectedPerm === p.id}
                    onChange={() => setSelectedPerm(p.id)} />
                  {p.role}
                </label>
              ))}
            </div>
          </div>

          {/* ABO ACTUEL */}
          <div className="reg-section">
            <h3 className="reg-section-title">🌸 Abonnement actuel</h3>
            <div className="reg-abo-grid">
              <label className={`reg-option ${selectedAbo === null ? "selected" : ""}`}>
                <input type="radio" name="abo" value="" checked={selectedAbo === null}
                  onChange={() => setSelectedAbo(null)} />
                Aucun
              </label>
              {abonnements.map((a) => (
                <label
                  key={a.id}
                  className={`reg-option ${selectedAbo === a.id ? "selected" : ""}`}
                >
                  <input type="radio" name="abo" value={a.id}
                    checked={selectedAbo === a.id}
                    onChange={() => setSelectedAbo(a.id)} />
                  {a.name}
                </label>
              ))}
            </div>
          </div>

          {/* WHITELIST ACTUELLE */}
          <div className="reg-section">
            <h3 className="reg-section-title">⚔️ Whitelist possédée</h3>
            <div className="reg-wl-grid">
              {whitelist.map((cat) => (
                <div key={cat.category} className="reg-wl-cat">
                  <span className="reg-wl-cat-title">{cat.category}</span>
                  {cat.items.map((item) => (
                    <label
                      key={item.id}
                      className={`reg-option small ${selectedWl.includes(item.id) ? "selected" : ""}`}
                    >
                      <input type="checkbox" checked={selectedWl.includes(item.id)}
                        onChange={() => toggleWl(item.id)} />
                      {item.name}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary">Créer mon compte 🌸</button>
        </form>
      </div>
    </main>
  );
}
