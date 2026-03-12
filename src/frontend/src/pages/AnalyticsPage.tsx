import { useState } from "react";

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

const BARS = [
  { time: "11 AM", val: 28 },
  { time: "12 PM", val: 45 },
  { time: "1 PM", val: 52 },
  { time: "2 PM", val: 38 },
  { time: "3 PM", val: 65 },
  { time: "4 PM", val: 58 },
  { time: "5 PM", val: 71 },
  { time: "6 PM", val: 82 },
  { time: "7 PM", val: 75 },
  { time: "8 PM", val: 60 },
  { time: "9 PM", val: 42 },
  { time: "10 PM", val: 28 },
];
const MAX_BAR = Math.max(...BARS.map((b) => b.val));

export default function AnalyticsPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

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

          {/* Empty cells for first week */}
          {Array.from({ length: firstDay }, (_, i) => {
            // biome-ignore lint/suspicious/noArrayIndexKey: calendar spacers have no meaningful key
            return <div key={`spacer-${i}`} />;
          })}

          {/* Day cells */}
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
            value: "1,284",
            delta: "+12.5%",
            icon: "📦",
          },
          { label: "REVENUE", value: "₹42.5k", delta: "+8.2%", icon: "💰" },
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
            <div
              style={{
                color: C.green,
                fontSize: 12,
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              ↑ {s.delta}
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
              🍴 MOST ORDERED TODAY
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Butter Chicken
            </div>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 2 }}>
              142 orders today
            </div>
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
              width: "78%",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Orders Per Hour Chart */}
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
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span>⏱️</span>
            <span
              style={{
                fontSize: 11,
                color: C.textMuted,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              ORDERS PER HOUR
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            42{" "}
            <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>
              avg/hr
            </span>
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 4,
            height: 80,
          }}
        >
          {BARS.map((b) => (
            <div
              key={b.time}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  width: "100%",
                  borderRadius: "4px 4px 0 0",
                  background: b.val / MAX_BAR > 0.7 ? C.primary : "#F5D0D0",
                  height: `${(b.val / MAX_BAR) * 100}%`,
                  minHeight: 4,
                  transition: "height 0.3s ease",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
          }}
        >
          {["11 AM", "3 PM", "7 PM", "10 PM"].map((t) => (
            <span key={t} style={{ fontSize: 10, color: C.textMuted }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Performance */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: 1,
            marginBottom: 10,
            textTransform: "uppercase" as const,
          }}
        >
          Recent Performance
        </div>
        {[
          {
            iconBg: "#E8F8EF",
            iconColor: C.green,
            icon: "↑",
            title: "Dinner Peak",
            desc: "Service efficiency increased by 15%",
            time: "2h ago",
          },
          {
            iconBg: "#FEF3E8",
            iconColor: "#E67E22",
            icon: "📦",
            title: "Inventory Alert",
            desc: "Butter Chicken stock is running low",
            time: "5h ago",
          },
        ].map((p) => (
          <div
            key={p.title}
            style={{
              background: C.card,
              borderRadius: 16,
              padding: "14px",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 1px 6px rgba(139,26,26,0.06)",
              border: `1px solid ${C.border}`,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: p.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: p.iconColor,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{p.desc}</div>
            </div>
            <span style={{ fontSize: 12, color: C.textMuted, flexShrink: 0 }}>
              {p.time}
            </span>
          </div>
        ))}
      </div>

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
