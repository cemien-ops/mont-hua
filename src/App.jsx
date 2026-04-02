import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Petals from "./components/Petals";
import SplashScreen from "./components/SplashScreen";
import FactionSelect from "./pages/FactionSelect";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Members from "./pages/Members";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Messages from "./pages/Messages";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [factionSelected, setFactionSelected] = useState(null);

  useEffect(() => {
    const savedFaction = localStorage.getItem("mh_faction");
    if (savedFaction) {
      const session = localStorage.getItem("mh_session");
      if (session) {
        document.documentElement.setAttribute("data-faction", savedFaction);
        document.body.setAttribute("data-faction", savedFaction);
        setFactionSelected(savedFaction);
      }
      // Sinon laisse null → page de sélection s'affiche
    }
  }, []);

  useEffect(() => {
    if (factionSelected) {
      document.documentElement.setAttribute("data-faction", factionSelected);
      document.body.setAttribute("data-faction", factionSelected);
    }
  }, [factionSelected]);

  const handleFactionSelect = (faction) => {
    localStorage.setItem("mh_faction", faction);
    document.documentElement.setAttribute("data-faction", faction);
    document.body.setAttribute("data-faction", faction);
    setFactionSelected(faction);
  };

  if (!splashDone) {
    return <SplashScreen onEnter={() => setSplashDone(true)} />;
  }

  if (!factionSelected) {
    return <FactionSelect onSelect={handleFactionSelect} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Petals />
          <Navbar />
          <Cart />
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/shop"     element={<Shop />} />
            <Route path="/members"  element={<Members />} />
            <Route path="/auth"     element={<Auth />} />
            <Route path="/admin"    element={<Admin />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
