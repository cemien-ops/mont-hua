import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const USERS_KEY    = "mh_users";
const MESSAGES_KEY = "mh_messages";
const SESSION_KEY  = "mh_session";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function loadUsers()    { try { return JSON.parse(localStorage.getItem(USERS_KEY))    || []; } catch { return []; } }
function loadMessages() { try { return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || []; } catch { return []; } }
function saveUsersStorage(u)   { localStorage.setItem(USERS_KEY,    JSON.stringify(u)); }
function saveMessagesStorage(m){ localStorage.setItem(MESSAGES_KEY, JSON.stringify(m)); }

const DB_VERSION = "2";

export function AuthProvider({ children }) {
  const [users, setUsersState] = useState([]);
  const [user,  setUser]       = useState(null);
  const [msgs,  setMsgsState]  = useState([]);

  useEffect(() => {
    (async () => {
      // Force réinitialisation des comptes si version changée
      const savedVersion = localStorage.getItem("mh_db_version");
      if (savedVersion !== DB_VERSION) {
        localStorage.removeItem(USERS_KEY);
        localStorage.setItem("mh_db_version", DB_VERSION);
      }

      let stored = loadUsers();
      let storedMsgs = loadMessages();

      if (stored.length === 0) {
        const hashAzery  = await sha256("Azery");
        const hashKraken = await sha256("Kraken");
        const azery = {
          id: "azery-001", pseudo: "Azery", password: hashAzery,
          isAdmin: true, faction: "azery", avatar: "👑",
          perms: ["Gérant"], abonnement: null, whitelist: [],
        };
        const kraken = {
          id: "kraken-001", pseudo: "Kraken", password: hashKraken,
          isAdmin: true, faction: "kraken", avatar: "🦑",
          perms: ["Gérant"], abonnement: null, whitelist: [],
        };
        stored = [azery, kraken];
        saveUsersStorage(stored);

        storedMsgs = [
          {
            id: "welcome-azery",
            fromId: "system", fromPseudo: "Système",
            toId: "azery-001", toPseudo: "Azery",
            content: "Bienvenue chef de secte. Le site Mont Hua est opérationnel.",
            date: new Date().toISOString(), read: true,
          },
          {
            id: "welcome-kraken",
            fromId: "system", fromPseudo: "Système",
            toId: "kraken-001", toPseudo: "Kraken",
            content: "Bienvenue dans les abysses. Le site Mont Hua est opérationnel.",
            date: new Date().toISOString(), read: true,
          },
        ];
        saveMessagesStorage(storedMsgs);
      }

      setUsersState(stored);
      setMsgsState(storedMsgs);

      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const u = stored.find(u => u.id === sessionId);
        if (u) setUser(u);
      }
    })();
  }, []);

  const saveUsers = (newUsers) => { setUsersState(newUsers); saveUsersStorage(newUsers); };
  const saveMsgs  = (newMsgs)  => { setMsgsState(newMsgs);  saveMessagesStorage(newMsgs); };

  const login = async (pseudo, password) => {
    const hash = await sha256(password);
    const u = loadUsers().find(u => u.pseudo.toLowerCase() === pseudo.trim().toLowerCase() && u.password === hash);
    if (!u) return false;
    // Azery et Kraken peuvent se connecter des deux côtés
    if (u.pseudo === "Azery" || u.pseudo === "Kraken") {
      setUser(u);
      localStorage.setItem(SESSION_KEY, u.id);
      return true;
    }
    // Les autres membres doivent être du bon côté
    const selectedFaction = localStorage.getItem("mh_faction");
    if (selectedFaction && u.faction && u.faction !== selectedFaction) {
      return "wrong_faction";
    }
    setUser(u);
    localStorage.setItem(SESSION_KEY, u.id);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const createUser = async ({ pseudo, password, avatar, isAdmin, customId, perms: userPerms, abonnement, whitelist: userWL }) => {
    const hash = await sha256(password);
    const newUser = {
      id: `user-${Date.now()}`,
      pseudo: pseudo.trim(),
      password: hash,
      isAdmin: !!isAdmin,
      avatar: avatar || "🌸",
      customId: customId || null,
      parrain: user?.pseudo || null,
      faction: user?.faction || "azery",
      perms: userPerms || [],
      abonnement: abonnement || null,
      whitelist: userWL || [],
    };
    const updated = [...loadUsers(), newUser];
    saveUsers(updated);
    // Auto-message from new member to faction leader
    const isKraken = newUser.faction === "kraken";
    const autoMsg = {
      id: `msg-${Date.now()}-welcome`,
      fromId: newUser.id, fromPseudo: newUser.pseudo,
      toId: isKraken ? "kraken-001" : "azery-001",
      toPseudo: isKraken ? "Kraken" : "Azery",
      content: isKraken
        ? `Bonjour Kraken, je suis un nouveau membre des abysses.`
        : `Bonjour Azery, je suis un nouveau membre de la secte.`,
      date: new Date().toISOString(), read: false,
    };
    saveMsgs([...loadMessages(), autoMsg]);
    return newUser;
  };

  const deleteUser = (id) => {
    if (id === "azery-001" || id === "kraken-001") return;
    saveUsers(loadUsers().filter(u => u.id !== id));
  };

  const updateUser = (id, data) => {
    const updated = loadUsers().map(u => u.id === id ? { ...u, ...data } : u);
    saveUsers(updated);
    if (user?.id === id) setUser(prev => ({ ...prev, ...data }));
  };

  const sendMessage = (toId, content, attachments = []) => {
    const allUsers = loadUsers();
    const toUser = allUsers.find(u => u.id === toId);
    if (!toUser || !user) return;
    const msg = {
      id: `msg-${Date.now()}`,
      fromId: user.id, fromPseudo: user.pseudo,
      toId, toPseudo: toUser.pseudo,
      content, date: new Date().toISOString(), read: false,
      attachments,
    };
    const updated = [...loadMessages(), msg];
    saveMsgs(updated);
  };

  const getMessages = () => {
    const all = loadMessages();
    return all.filter(m =>
      m.toId === user?.id ||
      m.fromId === user?.id ||
      (m.isGroup && Array.isArray(m.participantIds) && m.participantIds.includes(user?.id))
    );
  };

  const getUnreadCount = () => {
    return loadMessages().filter(m =>
      !m.read && (
        m.toId === user?.id ||
        (m.isGroup && Array.isArray(m.participantIds) && m.participantIds.includes(user?.id) && m.fromId !== user?.id)
      )
    ).length;
  };

  const markRead = (messageId) => {
    const updated = loadMessages().map(m => m.id === messageId ? { ...m, read: true } : m);
    saveMsgs(updated);
  };

  const markAllRead = (contactId) => {
    const updated = loadMessages().map(m =>
      m.toId === user?.id && m.fromId === contactId ? { ...m, read: true } : m
    );
    saveMsgs(updated);
  };

  // Compatibilité avec ancien code
  const members = users.map(u => ({
    pseudo: u.pseudo,
    avatar: u.avatar,
    customId: u.customId || null,
    parrain: u.parrain || null,
    faction: u.faction || "azery",
    perms: u.perms || [],
    abonnement: u.abonnement || null,
    whitelist: u.whitelist || [],
  }));

  const deleteProfile = (pseudo) => {
    const u = loadUsers().find(u => u.pseudo === pseudo);
    if (u && u.id !== "azery-001") deleteUser(u.id);
    logout();
  };

  const updatePossessions = (updates) => {
    if (!user) return;
    updateUser(user.id, updates);
  };

  return (
    <AuthContext.Provider value={{
      user, users, members,
      login, logout, createUser, deleteUser, updateUser,
      sendMessage, getMessages, getUnreadCount, markRead, markAllRead,
      deleteProfile, updatePossessions,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
