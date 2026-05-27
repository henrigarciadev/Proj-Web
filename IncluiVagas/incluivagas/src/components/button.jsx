function Button({ label, onClick }) {
  return (
    <button onClick={onClick} className="saiba-btn">
      {label}
    </button>
  );
}

export default Button;