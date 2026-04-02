import { useState } from "react";
import { useLocation } from "react-router-dom";
import { perms, abonnements, whitelist } from "../data/shopData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CoinIcon from "../components/CoinIcon";

// Perms de niveau Crown ou supérieur
const CROWN_PERMS = ["crown", "admin", "botbot", "invisible", "couronne", "createur", "systeme"];

function wlItemName(id) {
  for (const cat of whitelist) {
    const found = cat.items.find((i) => i.id === id);
    if (found) return found.name;
  }
  return id;
}

function getWlBlockReason(item, ownedWlIds, ownedPermId, cartItems, cartPerm) {
  if (item.requiredPerm) {
    if (item.requiredPerm === "crown") {
      const hasPerm = CROWN_PERMS.includes(ownedPermId) || (cartPerm && CROWN_PERMS.includes(cartPerm.id));
      if (!hasPerm) return "Requiert la perm Crown ou supérieure";
    } else {
      const hasIt = ownedWlIds.includes(item.requiredPerm) || !!cartItems.find((i) => i.id === item.requiredPerm);
      if (!hasIt) return `Requiert ${wlItemName(item.requiredPerm)}`;
    }
  }
  if (item.requiredWL) {
    const hasIt = ownedWlIds.includes(item.requiredWL) || !!cartItems.find((i) => i.id === item.requiredWL);
    if (!hasIt) return `Requiert ${wlItemName(item.requiredWL)}`;
  }
  return null;
}

function PermModal({ item, ownedPermId, userPerms, userPermPrice, onClose }) {
  const { add, items, getPermPrice } = useCart();
  const inCart = items.find((i) => i.id === item.id);
  const isOwned = (userPerms || []).includes(item.role);
  const isBlocked = item.price <= userPermPrice;
  const effectivePrice = getPermPrice(item, ownedPermId);
  const hasDiscount = effectivePrice < item.price;

  const handleAdd = () => {
    add({ ...item, _type: "perm", effectivePrice });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="perm-modal">
        <div className="modal-shine" />
        <div className="particles">
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
        </div>
        <div className="modal-inner">
          <button className="modal-close" onClick={onClose}>✕</button>
          {item.deco && <div className="modal-deco">✦ {item.deco}</div>}
          <div className={`modal-perm-title role-${item.id === "botbot" ? "bot" : item.id}`}>
            {item.role}
          </div>
          {item.description && (
            <div className="modal-perm-desc">{item.description}</div>
          )}
          <div className="modal-perm-price">
            {hasDiscount ? (
              <>
                <s style={{ color: "#7A6A85" }}>{item.price}</s>
                <CoinIcon size={16} />
                <span>{effectivePrice}</span>
                <CoinIcon size={16} />
                <span style={{ fontSize: "0.75rem", color: "#CBAFBE" }}>après échange</span>
              </>
            ) : (
              <>{item.price} <CoinIcon size={16} /></>
            )}
          </div>
          <button
            className="modal-add-btn"
            onClick={handleAdd}
            disabled={!!inCart || isBlocked || isOwned}
          >
            {isOwned ? "Déjà possédé" : inCart ? "✓ Ajouté au panier" : isBlocked ? "Non disponible" : "Ajouter au panier 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

function WlModal({ item, ownedWlIds, userWL, ownedPermId, cartItems, cartPerm, onClose }) {
  const { add } = useCart();
  const inCart = cartItems.find((i) => i.id === item.id);
  const isOwned = (userWL || []).includes(item.name);

  const blockReason = getWlBlockReason(item, ownedWlIds, ownedPermId, cartItems, cartPerm);
  const isDisabled = isOwned || !!inCart || !!blockReason;

  const handleAdd = () => {
    add({ ...item, _type: "wl", effectivePrice: item.price });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="perm-modal wl-modal">
        <div className="modal-shine" />
        <div className="particles">
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
        </div>
        <div className="modal-inner">
          <button className="modal-close" onClick={onClose}>✕</button>
          {item.category && <div className="modal-deco">✦ {item.category}</div>}
          <div className="modal-perm-title" style={{ color: "#D46A9E", textShadow: "0 0 10px #D46A9E, 0 0 20px #D46A9E" }}>
            {item.name}
          </div>
          {item.description && (
            <div className="modal-perm-desc" style={{ whiteSpace: "pre-line" }}>{item.description}</div>
          )}
          {blockReason && (
            <p style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center" }}>🔒 {blockReason}</p>
          )}
          <div className="modal-perm-price">
            {item.price} <CoinIcon size={16} />
          </div>
          <button className="modal-add-btn" onClick={handleAdd} disabled={isDisabled}>
            {isOwned ? "Déjà possédé" : inCart ? "✓ Ajouté au panier" : blockReason ? "Non disponible" : "Ajouter au panier 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

function PermCard({ item, ownedPermId, userPerms, userPermPrice, cartPerm, onDetails }) {
  const { add, items, getPermPrice } = useCart();
  const inCart = items.find((i) => i.id === item.id);

  const isOwned = (userPerms || []).includes(item.role);
  const isLocked = item.price <= userPermPrice;

  // Also account for cart perm for blocking
  const refPerm = perms.find((p) => p.id === (ownedPermId || cartPerm?.id || null));
  const isBlocked = isLocked || (refPerm && item.price <= refPerm.price);

  const effectivePrice = getPermPrice(item, ownedPermId);
  const hasDiscount = effectivePrice < item.price;

  const handleAdd = () => { add({ ...item, _type: "perm", effectivePrice }); };

  let btnLabel = "Ajouter";
  if (isOwned) btnLabel = "Possédé";
  else if (inCart) btnLabel = "✓ Ajouté";
  else if (isBlocked) btnLabel = "Indisponible";

  const lockedStyle = isLocked ? { opacity: 0.45, pointerEvents: "none", filter: "grayscale(0.6)" } : {};

  return (
    <div
      className={`perm-card ${isBlocked || isOwned ? "card-disabled" : ""}`}
      style={{ "--card-color": item.color, position: "relative", ...lockedStyle }}
    >
      {item.id === "systeme" && <span className="badge-new-corner">NEW</span>}
      <div className="perm-card-top">
        {item.deco && <span className="perm-deco">{item.deco}</span>}
        <span className={`perm-role role-${item.id === "botbot" ? "bot" : item.id}`}>{item.role}</span>
      </div>
      <div className="perm-price">
        {hasDiscount ? (
          <>
            <span className="price-original">{item.price} <CoinIcon size={14} /></span>
            <span className="price-effective">{effectivePrice} <CoinIcon size={16} /></span>
            <span className="price-label">après échange</span>
          </>
        ) : (
          <>{item.price} <CoinIcon size={16} /></>
        )}
      </div>
      <div className="perm-card-actions">
        <button
          className={`btn-add ${inCart ? "in-cart" : ""} ${isOwned ? "owned" : ""}`}
          onClick={handleAdd}
          disabled={!!inCart || isBlocked || isOwned}
        >
          {btnLabel}
        </button>
        <button className="btn-details" onClick={() => onDetails(item)}>
          <img src="/info-icon.png" alt="info" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
        </button>
      </div>
    </div>
  );
}

function AboModal({ item, ownedAboId, userAbonnement, userAboPrice, onClose }) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.id === item.id);
  const isOwned = item.name === userAbonnement;
  const isBlocked = item.price <= userAboPrice;

  const handleAdd = () => {
    add({ ...item, role: item.name, _type: "abo", effectivePrice: item.price });
    onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="perm-modal abo-modal">
        <div className="modal-shine" />
        <div className="particles">
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
          <span/><span/><span/><span/><span/>
        </div>
        <div className="modal-inner">
          <button className="modal-close" onClick={onClose}>✕</button>
          <img src={item.banner} alt={item.name} style={{ width: "100%", borderRadius: "12px", marginBottom: "0.5rem", display: "block" }} />
          <div className={`modal-perm-title plan-${item.id}`} style={{ fontSize: "1.5rem" }}>
            {item.name}
          </div>
          <div className="modal-perm-price">
            {item.price.toFixed(2)} €<span style={{ fontSize: "0.8rem", color: "#CBAFBE", marginLeft: "4px" }}>/mois</span>
          </div>
          {item.description && (
            <div className="modal-perm-desc">{item.description}</div>
          )}
          <button
            className="modal-add-btn"
            onClick={handleAdd}
            disabled={!!inCart || isBlocked || isOwned}
          >
            {isOwned ? "Déjà possédé" : inCart ? "✓ Ajouté au panier" : isBlocked ? "Non disponible" : "S'abonner 🌸"}
          </button>
        </div>
      </div>
    </>
  );
}

function AboCard({ item, ownedAboId, userAbonnement, userAboPrice, cartAbo, onDetails }) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.id === item.id);

  const isOwned = item.name === userAbonnement;
  const isLocked = item.price <= userAboPrice;

  const refAbo = abonnements.find((a) => a.id === (ownedAboId || cartAbo?.id || null));
  const isBlocked = isLocked || (refAbo && item.price <= refAbo.price);
  const disabled = !!inCart || isBlocked || isOwned;

  let btnLabel = "S'abonner";
  if (isOwned) btnLabel = "Possédé";
  else if (inCart) btnLabel = "✓ Ajouté";
  else if (isBlocked) btnLabel = "Indisponible";

  const lockedStyle = isLocked ? { opacity: 0.45, pointerEvents: "none", filter: "grayscale(0.6)" } : {};

  return (
    <div className={`abo-card ${isBlocked || isOwned ? "card-disabled" : ""}`} style={{ "--abo-gradient": item.gradient, ...lockedStyle }}>
      <div className="abo-card-glow" />
      <div className={`abo-name plan-${item.id}`}>
        {item.icon && (
          <img src={item.icon} alt="" style={{ width: "28px", height: "28px", objectFit: "contain", verticalAlign: "middle", marginRight: "8px" }} />
        )}
        {item.name}
      </div>
      <div className="abo-price">{item.price.toFixed(2)} <span>€/mois</span></div>
      <div className="abo-actions">
        <button
          className={`abo-add-btn ${inCart ? "in" : ""}`}
          onClick={() => add({ ...item, role: item.name, _type: "abo", effectivePrice: item.price })}
          disabled={disabled}
        >
          {btnLabel}
        </button>
        <button className="abo-info-btn" onClick={() => onDetails(item)}>
          <img src="/info-icon.png" alt="info" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
        </button>
      </div>
    </div>
  );
}

function WlSection({ ownedWlIds, userWL, ownedPermId, cartPerm, onDetails }) {
  const { add, items } = useCart();

  return (
    <div className="wl-grid">
      {whitelist.map((cat) => (
        <div key={cat.category} className="wl-category" style={{ position: "relative" }}>
          {cat.category === "Bendo" && <span className="badge-new-corner">NEW</span>}
          <h4 className="wl-cat-title">{cat.category}</h4>
          {cat.items.map((item) => {
            const inCart = items.find((i) => i.id === item.id);
            const isOwned = (userWL || []).includes(item.name);
            const blockReason = getWlBlockReason(item, ownedWlIds, ownedPermId, items, cartPerm);
            const isDisabled = isOwned || !!inCart || !!blockReason;

            const ownedStyle = isOwned ? { opacity: 0.45, pointerEvents: "none" } : {};

            return (
              <div
                key={item.id}
                className={`wl-item ${isOwned ? "wl-owned" : ""} ${blockReason ? "wl-blocked" : ""}`}
                style={ownedStyle}
              >
                <div className="wl-item-info">
                  <span className="wl-item-name">{item.name}</span>
                  {item.note && <span className="wl-item-note">{item.note}</span>}
                  {blockReason && <span className="wl-item-note req-note">{blockReason}</span>}
                </div>
                <div className="wl-item-right">
                  <span className="wl-item-price">{item.price} <CoinIcon size={14} /></span>
                  {item.description && (
                    <button className="btn-details" onClick={() => onDetails(item)}>
                      <img src="/info-icon.png" alt="info" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                    </button>
                  )}
                  <button
                    className={`btn-add small ${inCart ? "in-cart" : ""} ${isOwned ? "owned" : ""}`}
                    onClick={() => add({ ...item, _type: "wl", effectivePrice: item.price })}
                    disabled={isDisabled}
                    title={blockReason || (isOwned ? "Déjà possédé" : "")}
                  >
                    {isOwned
                      ? <span style={{ color: "#4ade80", fontSize: "0.75rem" }}>Possédé ✓</span>
                      : inCart ? "✓" : blockReason ? "🔒" : "+"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function Shop() {
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.tab || "perms");
  const [detailItem, setDetailItem] = useState(null);
  const [detailAbo,  setDetailAbo]  = useState(null);
  const [detailWl,   setDetailWl]   = useState(null);
  const { user } = useAuth();
  const { items } = useCart();
  const faction   = localStorage.getItem("mh_faction") || "azery";
  const isKraken  = faction === "kraken";

  // Perms — new model: user.perms is array of role names
  const userPermPrice = perms.find(p => user?.perms?.includes(p.role))?.price || 0;
  const ownedPermId   = [...perms].reverse().find(p => user?.perms?.includes(p.role))?.id || null;
  const userPerms     = user?.perms || [];

  // Abos — new model: user.abonnement is a name string
  const userAboPrice  = abonnements.find(a => a.name === user?.abonnement)?.price || 0;
  const ownedAboId    = abonnements.find(a => a.name === user?.abonnement)?.id || null;
  const userAbonnement = user?.abonnement || null;

  // WL — new model: user.whitelist is array of names; convert to ids for block-reason checks
  const userWL = user?.whitelist || [];
  const ownedWlIds = userWL.map(name => {
    for (const cat of whitelist) {
      const found = cat.items.find(i => i.name === name);
      if (found) return found.id;
    }
    return null;
  }).filter(Boolean);

  const cartPerm = items.find((i) => i._type === "perm") || null;
  const cartAbo  = items.find((i) => i._type === "abo")  || null;

  return (
    <main className="shop">
      <div className="shop-header">
        <h1>Boutique</h1>
        <p>Choisis tes items et passe commande</p>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "perms" ? "active" : ""}`} onClick={() => setTab("perms")}>
          {isKraken ? "⛓️" : "⛩️"} Permissions
        </button>
        <button className={`tab ${tab === "abos" ? "active" : ""}`} onClick={() => setTab("abos")}>
          {isKraken ? "🌊" : "🌸"} Abonnements
        </button>
        <button className={`tab ${tab === "wl" ? "active" : ""}`} onClick={() => setTab("wl")}>
          <img
            src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png"
            style={{ width: "18px", height: "18px", objectFit: "contain", verticalAlign: "middle", marginRight: "5px" }}
            alt=""
          />
          Whitelist
        </button>
      </div>

      {detailItem && (
        <PermModal
          item={detailItem}
          ownedPermId={ownedPermId}
          userPerms={userPerms}
          userPermPrice={userPermPrice}
          onClose={() => setDetailItem(null)}
        />
      )}
      {detailAbo && (
        <AboModal
          item={detailAbo}
          ownedAboId={ownedAboId}
          userAbonnement={userAbonnement}
          userAboPrice={userAboPrice}
          onClose={() => setDetailAbo(null)}
        />
      )}
      {detailWl && (
        <WlModal
          item={detailWl}
          ownedWlIds={ownedWlIds}
          userWL={userWL}
          ownedPermId={ownedPermId}
          cartItems={items}
          cartPerm={cartPerm}
          onClose={() => setDetailWl(null)}
        />
      )}

      <div className="shop-content">
        {tab === "perms" && (
          <div className="perms-grid">
            {perms.map((p) => (
              <PermCard
                key={p.id}
                item={p}
                ownedPermId={ownedPermId}
                userPerms={userPerms}
                userPermPrice={userPermPrice}
                cartPerm={cartPerm}
                onDetails={setDetailItem}
              />
            ))}
          </div>
        )}
        {tab === "abos" && (
          <div className="abos-grid">
            {abonnements.map((a) => (
              <AboCard
                key={a.id}
                item={a}
                ownedAboId={ownedAboId}
                userAbonnement={userAbonnement}
                userAboPrice={userAboPrice}
                cartAbo={cartAbo}
                onDetails={setDetailAbo}
              />
            ))}
          </div>
        )}
        {tab === "wl" && (
          <WlSection
            ownedWlIds={ownedWlIds}
            userWL={userWL}
            ownedPermId={ownedPermId}
            cartPerm={cartPerm}
            onDetails={setDetailWl}
          />
        )}
      </div>
    </main>
  );
}
