import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AnalyticsPage from "./pages/AnalyticsPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";

const C = {
  primary: "#8B1A1A",
  primaryLight: "#A52020",
  primaryBg: "#FDF5F5",
  card: "#FFFFFF",
  border: "#F0E0E0",
  text: "#1A1A1A",
  textMuted: "#888",
};

type Page = "orders" | "menu" | "analytics";

export default function App() {
  const [page, setPage] = useState<Page>("orders");

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "orders", label: "Orders", icon: "📋" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div
      style={{
        fontFamily: "'General Sans', 'Segoe UI', sans-serif",
        background: C.primaryBg,
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(139,26,26,0.08)",
      }}
    >
      <Toaster position="top-center" />

      {/* Page content */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {page === "orders" && <OrdersPage />}
        {page === "menu" && <MenuPage />}
        {page === "analytics" && <AnalyticsPage />}
      </div>

      {/* Bottom Navigation */}
      <nav
        style={{
          background: C.card,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          padding: "8px 0 env(safe-area-inset-bottom, 12px)",
          flexShrink: 0,
        }}
      >
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            data-ocid={`nav.${item.id}.link`}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "6px 0",
              minHeight: 56,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                filter:
                  page === item.id ? "none" : "grayscale(1) opacity(0.45)",
                transition: "filter 0.15s",
              }}
            >
              {item.icon}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: page === item.id ? C.primary : C.textMuted,
                transition: "color 0.15s",
              }}
            >
              {item.label}
            </span>
            {page === item.id && (
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: C.primary,
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
