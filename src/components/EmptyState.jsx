export default function EmptyState({ message }) {
    return <p className="empty-state">{message || "Nothing to display here"}</p>;
}