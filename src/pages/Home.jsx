import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const faction = localStorage.getItem("mh_faction") || "azery";
  const isKraken = faction === "kraken";

  const goToShop = (tab) => navigate("/shop", { state: { tab } });

  return (
    <main className="home">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-kanji">{isKraken ? "海" : "山"}</span>
            {isKraken ? "Secte Kraken" : "Mont Hua"}
          </h1>
          <p className="hero-subtitle">{isKraken ? "Boutique Discord • Abysses" : "Boutique Discord • Thème japonais"}</p>
          <p className="hero-desc">
            {isKraken
              ? "Acquiers des permissions, des pactes exclusifs et des accès aux profondeurs pour dominer le serveur."
              : "Acquiers des permissions, des rôles exclusifs et des abonnements pour enrichir ton expérience sur le serveur."}
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary">{isKraken ? "Voir la boutique 🦑" : "Voir la boutique 🌸"}</Link>
            <Link to="/members" className="btn-ghost">Nos membres</Link>
          </div>
        </div>
      </div>

      <section className="home-features">
        <div className="feat-grid">
          <div className={`feat-card${isKraken ? " feat-card-kraken" : ""}`} onClick={() => goToShop("perms")}>
            <span className="feat-icon">{isKraken ? "⛓️" : "⛩️"}</span>
            <h3>Permissions</h3>
            <p>{isKraken
              ? "Des titres et pouvoirs des abysses pour asseoir ta domination sur la secte"
              : "Des titres et insignes sacrés pour marquer ton rang au sein de la secte"}</p>
          </div>
          <div className={`feat-card${isKraken ? " feat-card-kraken" : ""}`} onClick={() => goToShop("abos")}>
            <span className="feat-icon">{isKraken ? "🌊" : "🌸"}</span>
            <h3>Abonnements</h3>
            <p>{isKraken
              ? "Des pactes mensuels t'accordant puissance et privilèges des profondeurs"
              : "Des offrandes mensuelles t'accordant pouvoir et privilèges spirituels"}</p>
          </div>
          <div className={`feat-card${isKraken ? " feat-card-kraken" : ""}`} onClick={() => goToShop("wl")}>
            <div className="feat-icon">
              <img src="https://em-content.zobj.net/source/apple/354/japanese-castle_1f3ef.png" alt="" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
            </div>
            <h3>Whitelist</h3>
            <p>{isKraken
              ? "Accède aux cercles des profondeurs, là où seuls les élus des abysses sont admis"
              : "Accède aux cercles intérieurs, là où seuls les initiés sont admis"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
