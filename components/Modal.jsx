export default function Modal({ eyebrow = "艺集操作", title, children, actions, onClose }) {
  if (!title) return null;

  return (
    <div className="app-modal visible" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button className="modal-close" type="button" aria-label="关闭" onClick={onClose}>×</button>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="modalTitle">{title}</h2>
        <div className="modal-body">{children}</div>
        {actions ? <div className="modal-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
