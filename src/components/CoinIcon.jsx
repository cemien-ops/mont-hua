export default function CoinIcon({ size = 18, style = {} }) {
  return (
    <img
      src="/coin.png"
      alt="coin"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        verticalAlign: "middle",
        marginLeft: "4px",
        ...style,
      }}
    />
  );
}
