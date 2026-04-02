export default function FactionSelect({ onSelect }) {
  const selectFaction = (faction) => {
    localStorage.setItem("mh_faction", faction);
    document.documentElement.setAttribute("data-faction", faction);
    document.body.setAttribute("data-faction", faction);
    onSelect(faction);
  };

  return (
    <div className="faction-page">
      <div className="faction-title">
        <h1>Choisissez votre voie</h1>
        <p>Deux sectes. Un seul serveur.</p>
      </div>

      <div className="faction-cards">
        <div className="faction-card azery" onClick={() => selectFaction("azery")}>
          <div className="faction-glow azery-glow" />
          <div className="faction-inner">
            <span className="faction-icon">🌸</span>
            <h2 className="faction-name azery-name">Secte Azery</h2>
            <p className="faction-desc">La voie du cerisier. Discipline, rang et honneur.</p>
            <button className="faction-btn azery-btn">Rejoindre</button>
          </div>
        </div>

        <div className="faction-card kraken" onClick={() => selectFaction("kraken")}>
          <div className="faction-glow kraken-glow" />
          <div className="faction-inner">
            <span className="faction-icon">🦑</span>
            <h2 className="faction-name kraken-name">Secte Kraken</h2>
            <p className="faction-desc">La voie des abysses. Puissance, chaos et conquête.</p>
            <button className="faction-btn kraken-btn">Rejoindre</button>
          </div>
        </div>
      </div>
    </div>
  );
}
