import { useState } from "react";

export default function SplashScreen({ onEnter }) {
  const [fading, setFading] = useState(false);

  const handleEnter = () => {
    if (fading) return;
    setFading(true);
    setTimeout(() => onEnter(), 800);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        overflow: "hidden",
        imageRendering: "crisp-edges",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      <img
        src="https://i.imgur.com/XLRPbpX.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center bottom",
          imageRendering: "crisp-edges",
          WebkitFontSmoothing: "antialiased",
        }}
      />

      {/* Porte gauche */}
      <button
        onClick={handleEnter}
        style={{
          position: "absolute",
          left: "35%",
          top: "45%",
          width: "14%",
          height: "50%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          zIndex: 2,
          transition: "box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "inset 0 0 60px rgba(255, 215, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        aria-label="Entrer par la porte gauche"
      />

      {/* Porte droite */}
      <button
        onClick={handleEnter}
        style={{
          position: "absolute",
          left: "51%",
          top: "45%",
          width: "14%",
          height: "50%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          zIndex: 2,
          transition: "box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "inset 0 0 60px rgba(255, 215, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
        aria-label="Entrer par la porte droite"
      />
    </div>
  );
}
