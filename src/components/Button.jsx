export default function Button({ label, onClick, variant }) {
  const getVariantClass = (v) => {
    switch (v) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "danger":
        return "btn-danger";
      case "outline":
        return "btn-outline";
      default:
        return "btn-default";
    }
  };

  return (
    <>
      <button onClick={onClick} className={getVariantClass(variant)}>
        {" "}
        {label}{" "}
      </button>
    </>
  );
}
