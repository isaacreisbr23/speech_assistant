type StatusBadgeProps = {
  active: boolean;
  label?: string;
};

export default function StatusBadge({
  active,
  label,
}: StatusBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: 999,
        backgroundColor: active ? "#14532d" : "#3f3f46",
        color: "white",
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      <span style={{ position: "relative", width: 10, height: 10 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            display: "block",
            backgroundColor: active ? "#22c55e" : "#ef4444",
          }}
        />

        {active && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              animation: "pulse 1.2s infinite",
              opacity: 0.6,
            }}
          />
        )}
      </span>

      <span>{label ?? (active ? "Ativo" : "Inativo")}</span>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.6;
            }
            70% {
              transform: scale(2.2);
              opacity: 0;
            }
            100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}