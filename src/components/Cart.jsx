import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CoinIcon from "./CoinIcon";

function findParrains(parrainList, allUsers) {
  return parrainList.map(parrainRef => {
    const byPseudo = allUsers.filter(u =>
      u.pseudo.toLowerCase() === parrainRef.toLowerCase()
    );
    if (byPseudo.length === 1) return byPseudo[0];
    if (byPseudo.length > 1) return allUsers.find(u => u.customId === parrainRef) || null;
    return allUsers.find(u => u.customId === parrainRef) || null;
  }).filter(Boolean);
}

function saveOrder(user, items, total) {
  const order = {
    id: Date.now(),
    userId: user.id,
    pseudo: user.pseudo,
    items: items.map(i => ({ name: i.role || i.name, price: i.effectivePrice ?? i.price })),
    total,
    date: new Date().toISOString(),
    treated: false,
  };
  const orders = JSON.parse(localStorage.getItem("mh_orders") || "[]");
  orders.push(order);
  localStorage.setItem("mh_orders", JSON.stringify(orders));
  return order;
}

export default function Cart() {
  const { items, remove, clear, total, open, setOpen } = useCart();
  const { user } = useAuth();

  if (!open) return null;

  const handleCheckout = () => {
    if (!user) { alert("Connecte-toi pour passer commande !"); return; }

    // IMPORTANT : relire le user complet depuis localStorage, pas depuis le contexte
    const allUsers = JSON.parse(localStorage.getItem("mh_users") || "[]");
    const freshUser = allUsers.find(u => u.id === user.id);
    console.log("freshUser.parrain:", freshUser?.parrain);
    if (!freshUser) return;

    const parrainRefs = Array.isArray(freshUser.parrain)
      ? freshUser.parrain
      : typeof freshUser.parrain === "string" && freshUser.parrain.trim()
        ? freshUser.parrain.split(",").map(s => s.trim()).filter(Boolean)
        : [];
    console.log("parrainRefs après normalisation:", parrainRefs);

    const parrains = parrainRefs.map(ref => {
      const trimmed = ref.trim();
      const byPseudo = allUsers.filter(u => u.pseudo.toLowerCase() === trimmed.toLowerCase());
      if (byPseudo.length === 1) {
        console.log("Trouvé par pseudo:", byPseudo[0].pseudo);
        return byPseudo[0];
      }
      if (byPseudo.length > 1) {
        const byId = allUsers.find(u => u.customId === trimmed);
        console.log("Plusieurs pseudos identiques, trouvé par ID:", byId?.pseudo);
        return byId || null;
      }
      const byId = allUsers.find(u => u.customId === trimmed);
      console.log("Trouvé par ID:", byId?.pseudo);
      return byId || null;
    }).filter(Boolean);
    console.log("Parrains résolus:", parrains.map(p => p.pseudo));

    const azery = allUsers.find(u => u.pseudo === "Azery");
    const participantIds = [
      freshUser.id,
      ...(azery ? [azery.id] : []),
      ...parrains.map(p => p.id),
    ].filter(Boolean).filter((id, i, arr) => arr.indexOf(id) === i);
    const participantPseudos = [
      freshUser.pseudo,
      ...(azery ? ["Azery"] : []),
      ...parrains.map(p => p.pseudo),
    ].filter(Boolean).filter((p, i, arr) => arr.indexOf(p) === i);
    console.log("Participants finaux:", participantPseudos);

    const now = Date.now();
    const groupId = `group-order-${now}`;
    const msgId = `msg-${now}`;
    const itemsList = items.map(i => `• ${i.role || i.name} — ${(i.effectivePrice ?? i.price).toFixed(2)} 🪙`).join("\n");

    const orderMsg = {
      id: msgId,
      fromId: "system", fromPseudo: "Système",
      toId: null,
      content: `🛒 Nouvelle commande de ${freshUser.pseudo} !\n\nItems :\n${itemsList}\n\nTotal : ${total.toFixed(2)} 🪙\nDate : ${new Date().toLocaleString("fr-FR")}`,
      date: new Date().toISOString(),
      read: false,
      attachments: [],
      isGroup: true,
      groupId,
      participantIds,
      participantPseudos,
    };

    // Un seul message partagé dans mh_messages (pas un par participant)
    const msgs = JSON.parse(localStorage.getItem("mh_messages") || "[]");
    if (!msgs.some(m => m.id === msgId)) {
      msgs.push(orderMsg);
    }
    localStorage.setItem("mh_messages", JSON.stringify(msgs));

    // Sauvegarder la commande
    const order = {
      id: Date.now(),
      userId: currentUser.id,
      pseudo: currentUser.pseudo,
      items: items.map(i => ({ name: i.role || i.name, price: i.effectivePrice ?? i.price })),
      total,
      date: new Date().toISOString(),
      treated: false,
      groupId, participantIds, participantPseudos,
    };
    const orders = JSON.parse(localStorage.getItem("mh_orders") || "[]");
    localStorage.setItem("mh_orders", JSON.stringify([...orders, order]));

    clear();
    setOpen(false);
    alert("✅ Commande envoyée ! Azery a été notifié 🌸");
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setOpen(false)} />
      <aside className="cart-panel">
        <div className="cart-header">
          <h2>🛒 Panier</h2>
          <button className="cart-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span>🌸</span>
            <p>Ton panier est vide</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.role || item.name}</span>
                    <span className="cart-item-price">{item.effectivePrice ?? item.price} <CoinIcon size={14} /></span>
                  </div>
                  <button className="cart-item-remove" onClick={() => remove(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>{total.toFixed(2)} <CoinIcon size={16} /></span>
              </div>
              <button className="btn-primary" onClick={handleCheckout}>Commander</button>
              <button className="btn-ghost" onClick={clear}>Vider le panier</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
