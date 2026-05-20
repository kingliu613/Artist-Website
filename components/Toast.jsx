export default function Toast({ message }) {
  if (!message) return null;
  return <div className="app-toast visible">{message}</div>;
}
