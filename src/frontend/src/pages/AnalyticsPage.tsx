import { useState } from "react";
import { useOrders } from "../hooks/useQueries";

const C = {
  primary: "#8B1A1A",
  card: "#FFFFFF",
  border: "#F0E0E0",
  text: "#1A1A1A",
  textMuted: "#888",
  green: "#27AE60",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

export default function AnalyticsPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const { data: orders = [], isLoading } = useOrders();

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");

  const totalOrders = paidOrders.length;

  const totalRevenue = paidOrders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((s, item) => s + item.price * Number(item.qty), 0)
    );
  }, 0);

  // Most ordered item
  const itemQtyMap: Record<string, number> = {};
  for (const order of paidOrders) {
    for (const item of order.items) {
      itemQtyMap[item.name] = (itemQtyMap[item.name] || 0) + Number(item.qty);
    }
  }
  const mostOrderedEntry = Object.entries(itemQtyMap).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const mostOrderedName = mostOrderedEntry?.[0] ?? null;
  const mostOrderedQty = mostOrderedEntry?.[1] ?? 0;

  const hasData = totalOrders > 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "18px 16px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Analytics
        </span>
        <div
          style={{
            width: 40,
            height: 40,
            background: "#F5EDED",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🔔
        </div>
      </div>

      {/* Calendar */}
      <div
        style={{
          background: C.card,
          borderRadius: 20,
          padding: 16,
          marginBottom: 14,
          boxShadow: "0 2px 10px rgba(139,26,26,0.07)",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            data-ocid="analytics.calendar.prev.button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            style={{
              background: "#F5EDED",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: C.primary,
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, color: C.primary, fontWeight: 600 }}>
              {year}
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {MONTH_NAMES[month]}
            </div>
          </div>
          <button
            type="button"
            data-ocid="analytics.calendar.next.button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            style={{
              background: "#F5EDED",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: C.primary,
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 2,
            textAlign: "center",
          }}
        >
          {DAY_NAMES.map((d, i) => (
            <div
              key={d + String(i)}
              style={{
                fontSize: 11,
                color: C.textMuted,
                padding: "4px 0",
                fontWeight: 700,
              }}
            >
              {d}
            </div>
          ))}

          {Array.from({ length: firstDay }, (_, i) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: calendar spacers have no meaningful key
            return <div key={`spacer-${i}`} />;
          })}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            return (
              <div
                key={day}
                style={{
                  padding: "7px 0",
                  fontSize: 13,
                  borderRadius: 8,
                  background: isToday ? C.primary : "transparent",
                  color: isToday ? "#fff" : C.text,
                  fontWeight: isToday ? 700 : 400,
                  textAlign: "center",
                  position: "relative" as const,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[1, 2].map((i) => (
              <div
                key={i}
                data-ocid="analytics.loading_state"
                style={{
                  background: C.card,
                  borderRadius: 18,
                  padding: 16,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    height: 12,
                    background: "#F5EDED",
                    borderRadius: 6,
                    marginBottom: 12,
                    width: "60%",
                  }}
                />
                <div
                  style={{
                    height: 28,
                    background: "#F5EDED",
                    borderRadius: 8,
                    width: "80%",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              background: C.card,
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                height: 12,
                background: "#F5EDED",
                borderRadius: 6,
                marginBottom: 12,
                width: "50%",
              }}
            />
            <div
              style={{
                height: 24,
                background: "#F5EDED",
                borderRadius: 8,
                width: "70%",
              }}
            />
          </div>
        </>
      ) : !hasData ? (
        /* Empty State */
        <div
          data-ocid="analytics.empty_state"
          style={{
            background: C.card,
            borderRadius: 20,
            padding: "40px 24px",
            marginBottom: 14,
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(139,26,26,0.07)",
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 14 }}>📊</div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            No completed orders yet
          </div>
          <div style={{ fontSize: 14, color: C.textMuted }}>
            Statistics will appear here once orders are paid and completed.
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              {
                label: "TOTAL ORDERS",
                value: totalOrders.toString(),
                icon: "📦",
              },
              {
                label: "REVENUE",
                value: `₹${totalRevenue.toFixed(2)}`,
                icon: "💰",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: C.card,
                  borderRadius: 18,
                  padding: 16,
                  boxShadow: "0 2px 10px rgba(139,26,26,0.07)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: C.textMuted,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {/* Most Ordered */}
          <div
            style={{
              background: C.card,
              borderRadius: 18,
              padding: 16,
              marginBottom: 14,
              boxShadow: "0 2px 10px rgba(139,26,26,0.07)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  🍴 MOST ORDERED ITEM
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {mostOrderedName ?? "No data yet"}
                </div>
                {mostOrderedName && (
                  <div
                    style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}
                  >
                    {mostOrderedQty} ordered
                  </div>
                )}
              </div>
              <div
                style={{
                  background: "#FDE8E8",
                  borderRadius: 14,
                  width: 52,
                  height: 52,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                🍛
              </div>
            </div>
            <div
              style={{
                marginTop: 12,
                background: "#F5EDED",
                borderRadius: 10,
                height: 8,
              }}
            >
              <div
                style={{
                  background: C.primary,
                  borderRadius: 10,
                  height: 8,
                  width: mostOrderedName ? "100%" : "0%",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <footer style={{ textAlign: "center", paddingBottom: 8 }}>
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: C.textMuted, textDecoration: "none" }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using caffeine.ai
        </a>
      </footer>
    </div>
  );
}
