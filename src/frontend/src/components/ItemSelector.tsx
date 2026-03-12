import { useState } from "react";
import type { MenuItem } from "../backend.d";

const C = {
  primary: "#8B1A1A",
  card: "#FFFFFF",
  border: "#F0E0E0",
  text: "#1A1A1A",
  textMuted: "#888",
};

interface Props {
  menuItems: MenuItem[];
  initialQuantities?: Record<number, number>;
  onSend: (quantities: Record<number, number>) => void;
  sendLabel?: string;
}

export default function ItemSelector({
  menuItems,
  initialQuantities = {},
  onSend,
  sendLabel = "Send to Kitchen",
}: Props) {
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] =
    useState<Record<number, number>>(initialQuantities);

  const filtered = menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.foodType.toLowerCase().includes(search.toLowerCase()),
  );

  const setQty = (id: number, delta: number) => {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) + delta) }));
  };

  const selected = menuItems.filter((m) => quantities[Number(m.id)] > 0);
  const total = selected.reduce(
    (s, m) => s + m.price * (quantities[Number(m.id)] || 0),
    0,
  );
  const totalItems = selected.reduce(
    (s, m) => s + (quantities[Number(m.id)] || 0),
    0,
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Search */}
      <div style={{ padding: "12px 16px 8px" }}>
        <div
          style={{
            background: "#F5EDED",
            borderRadius: 14,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            data-ocid="item_selector.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu items..."
            style={{
              border: "none",
              background: "none",
              outline: "none",
              fontSize: 14,
              width: "100%",
              color: C.text,
            }}
          />
        </div>
      </div>

      {/* Items list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px" }}>
        {filtered.map((item) => {
          const qty = quantities[Number(item.id)] || 0;
          return (
            <div
              key={item.id.toString()}
              style={{
                display: "flex",
                alignItems: "center",
                background: C.card,
                borderRadius: 16,
                padding: "12px 14px",
                marginBottom: 10,
                boxShadow: "0 1px 6px rgba(139,26,26,0.06)",
                border: `1px solid ${qty > 0 ? "#F5CBA7" : C.border}`,
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ fontSize: 32, marginRight: 12 }}>
                {item.imageEmoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>
                  {item.name}
                </div>
                <div
                  style={{ fontSize: 13, color: C.primary, fontWeight: 600 }}
                >
                  ₹{item.price}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setQty(Number(item.id), -1)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: qty > 0 ? C.primary : "#EEE",
                    color: qty > 0 ? "#fff" : "#999",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    width: 26,
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    color: qty > 0 ? C.primary : C.text,
                  }}
                >
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Number(item.id), 1)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: C.primary,
                    color: "#fff",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Send bar */}
      {totalItems > 0 && (
        <div
          style={{
            margin: "0 16px 16px",
            background: C.primary,
            borderRadius: 18,
            padding: "14px 18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 16px rgba(139,26,26,0.25)",
          }}
        >
          <div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
              {totalItems} {totalItems === 1 ? "item" : "items"} • ₹
              {total.toLocaleString("en-IN")}
            </div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              {sendLabel}
            </div>
          </div>
          <button
            type="button"
            data-ocid="new_order.send.button"
            onClick={() => onSend(quantities)}
            style={{
              background: "#fff",
              color: C.primary,
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            → Send
          </button>
        </div>
      )}
    </div>
  );
}
