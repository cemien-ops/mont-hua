export default function Petals() {
  const faction = localStorage.getItem("mh_faction") || "azery";
  const isKraken = faction === "kraken";

  return (
    <div className="petals-container" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: isKraken ? `${4 + (i % 6)}px` : `${7 + (i % 5) * 1.5}px`,
            height: isKraken ? `${8 + (i % 6) * 3}px` : `${10 + (i % 5) * 2}px`,
            borderRadius: isKraken
              ? "50% 50% 40% 40% / 60% 60% 40% 40%"
              : "50% 0 50% 0",
            background: isKraken
              ? "linear-gradient(180deg, rgba(200,240,255,0.95) 0%, rgba(80,180,255,0.7) 50%, rgba(30,100,200,0.4) 100%)"
              : "linear-gradient(135deg, rgba(255,182,200,0.9), rgba(231,138,195,0.5))",
            boxShadow: isKraken
              ? "inset 0 2px 3px rgba(255,255,255,0.6), inset -1px -2px 3px rgba(30,100,200,0.3), 0 0 8px rgba(50,150,255,0.4)"
              : "none",
            left: `${(i * 1.7 + 0.5) % 100}%`,
            top: "-30px",
            opacity: isKraken ? 0.85 : 0.6,
            animation: `${isKraken ? "dropFall" : "petalFall"} ${5 + (i % 9) * 0.7}s ${-(i * 0.35)}s linear infinite`,
          }}
        />
      ))}
    </div>
  );
}
