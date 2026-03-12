import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../backend.d";
import {
  useAddMenuItem,
  useMenuItems,
  useUpdateMenuItem,
} from "../hooks/useQueries";

const C = {
  primary: "#8B1A1A",
  card: "#FFFFFF",
  border: "#F0E0E0",
  text: "#1A1A1A",
  textMuted: "#888",
  green: "#27AE60",
  accent: "#C0392B",
};

const FOOD_TYPES = [
  "Starter",
  "Main Course",
  "Curry",
  "Soup",
  "Drinks",
] as const;
const FOOD_TYPE_EMOJIS: Record<string, string> = {
  Starter: "🥗",
  "Main Course": "🍛",
  Curry: "🍲",
  Soup: "🍜",
  Drinks: "🥤",
};

type FormState = {
  name: string;
  foodType: string;
  isVeg: boolean;
  price: string;
  description: string;
  imageEmoji: string;
};

function MenuItemRow({
  item,
  index,
  onEdit,
}: { item: MenuItem; index: number; onEdit: (item: MenuItem) => void }) {
  return (
    <div
      data-ocid={`menu.item.${index}`}
      style={{
        background: C.card,
        borderRadius: 16,
        padding: "12px 14px",
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
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "#F5EDED",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          flexShrink: 0,
        }}
      >
        {item.imageEmoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}>
          {item.name}
        </div>
        <div style={{ fontSize: 14, color: C.primary, fontWeight: 600 }}>
          ₹{item.price}
        </div>
        <div
          style={{
            fontSize: 11,
            color: item.isVeg ? C.green : C.accent,
            marginTop: 2,
          }}
        >
          {item.isVeg ? "🌿 Veg" : "🍖 Non-Veg"} • {item.foodType}
        </div>
      </div>
      <button
        type="button"
        data-ocid={`menu.item.edit_button.${index}`}
        onClick={() => onEdit(item)}
        style={{
          background: "#F5EDED",
          border: "none",
          borderRadius: 12,
          width: 42,
          height: 42,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        ✏️
      </button>
    </div>
  );
}

export default function MenuPage() {
  const { data: menuItems = [], isLoading } = useMenuItems();
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();

  const [search, setSearch] = useState("");
  const [screen, setScreen] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<bigint | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    foodType: "Starter",
    isVeg: true,
    price: "",
    description: "",
    imageEmoji: "🍽️",
  });

  const filtered = menuItems.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.foodType.toLowerCase().includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm({
      name: "",
      foodType: "Starter",
      isVeg: true,
      price: "",
      description: "",
      imageEmoji: "🍽️",
    });
    setEditing(null);
    setScreen("form");
  };

  const openEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      foodType: item.foodType,
      isVeg: item.isVeg,
      price: String(item.price),
      description: item.description,
      imageEmoji: item.imageEmoji,
    });
    setEditing(item.id);
    setScreen("form");
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Please fill in item name and price");
      return;
    }
    const emoji = FOOD_TYPE_EMOJIS[form.foodType] || "🍽️";
    try {
      if (editing !== null) {
        await updateMenuItem.mutateAsync({
          id: editing,
          name: form.name,
          price: Number.parseFloat(form.price),
          foodType: form.foodType,
          isVeg: form.isVeg,
          imageEmoji: emoji,
          description: form.description,
        });
        toast.success("Item updated!");
      } else {
        await addMenuItem.mutateAsync({
          name: form.name,
          price: Number.parseFloat(form.price),
          foodType: form.foodType,
          isVeg: form.isVeg,
          imageEmoji: emoji,
          description: form.description,
        });
        toast.success("Item added to menu!");
      }
      setScreen("list");
    } catch {
      toast.error("Failed to save item");
    }
  };

  const isSaving = addMenuItem.isPending || updateMenuItem.isPending;

  if (screen === "form") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 16px 12px",
            gap: 12,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <button
            type="button"
            onClick={() => setScreen("list")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 22,
              color: C.primary,
              padding: "4px 8px",
              minHeight: 44,
            }}
          >
            ←
          </button>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {editing !== null ? "Edit" : "Add"} Menu Item
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {/* Item Name */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
                color: C.text,
              }}
            >
              Item Name
            </div>
            <input
              data-ocid="menu_form.name.input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Traditional Lamb Curry"
              style={{
                width: "100%",
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "13px 14px",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box" as const,
                color: C.text,
                background: "#fff",
              }}
            />
          </div>

          {/* Food Type */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
                color: C.text,
              }}
            >
              Food Type
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {FOOD_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setForm((f) => ({ ...f, foodType: t }))}
                  style={{
                    background: form.foodType === t ? C.primary : "#fff",
                    color: form.foodType === t ? "#fff" : C.text,
                    border: `1.5px solid ${form.foodType === t ? C.primary : C.border}`,
                    borderRadius: 20,
                    padding: "8px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 500,
                    minHeight: 44,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Veg / Non-Veg */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
                color: C.text,
              }}
            >
              Dietary Preference
            </div>
            <div
              style={{
                display: "flex",
                background: "#F5EDED",
                borderRadius: 12,
                padding: 4,
                width: "fit-content",
              }}
            >
              {([true, false] as const).map((v) => (
                <button
                  type="button"
                  key={String(v)}
                  onClick={() => setForm((f) => ({ ...f, isVeg: v }))}
                  style={{
                    background:
                      form.isVeg === v
                        ? v
                          ? C.green
                          : C.accent
                        : "transparent",
                    color: form.isVeg === v ? "#fff" : C.textMuted,
                    border: "none",
                    borderRadius: 9,
                    padding: "9px 20px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    minHeight: 44,
                  }}
                >
                  {v ? "🌿 VEG" : "🍖 NON-VEG"}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
                color: C.text,
              }}
            >
              Price (₹)
            </div>
            <div style={{ position: "relative" as const }}>
              <span
                style={{
                  position: "absolute" as const,
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: C.primary,
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                ₹
              </span>
              <input
                data-ocid="menu_form.price.input"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
                placeholder="0"
                style={{
                  width: "100%",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12,
                  padding: "13px 14px 13px 32px",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box" as const,
                  color: C.text,
                  background: "#fff",
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
                color: C.text,
              }}
            >
              Description{" "}
              <span style={{ color: C.textMuted, fontWeight: 400 }}>
                (optional)
              </span>
            </div>
            <textarea
              data-ocid="menu_form.description.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Briefly describe the dish..."
              style={{
                width: "100%",
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: "13px 14px",
                fontSize: 14,
                outline: "none",
                resize: "none" as const,
                height: 88,
                boxSizing: "border-box" as const,
                color: C.text,
                background: "#fff",
                fontFamily: "'General Sans', sans-serif",
              }}
            />
          </div>

          <button
            type="button"
            data-ocid="menu_form.save.button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              width: "100%",
              background: isSaving ? "#ccc" : C.primary,
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "16px",
              fontSize: 16,
              fontWeight: 700,
              cursor: isSaving ? "default" : "pointer",
              minHeight: 52,
            }}
          >
            {isSaving
              ? "Saving..."
              : editing !== null
                ? "Save Changes"
                : "Add to Menu"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          padding: "18px 16px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontWeight: 700,
            color: C.text,
          }}
        >
          Menu
        </span>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <div
          style={{
            background: "#F5EDED",
            borderRadius: 14,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 16 }}>🔍</span>
          <input
            data-ocid="menu.search_input"
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
        <button
          type="button"
          data-ocid="menu.add_item.button"
          onClick={openAdd}
          style={{
            width: "100%",
            background: C.primary,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "14px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            minHeight: 52,
          }}
        >
          + Add New Item
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 16px 10px",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 15 }}>Menu Items</span>
        <span
          style={{
            background: "#FDE8E8",
            color: C.primary,
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {filtered.length} Items
        </span>
      </div>

      <div
        data-ocid="menu.list"
        style={{ flex: 1, overflowY: "auto", padding: "0 16px 8px" }}
      >
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                background: C.card,
                borderRadius: 16,
                padding: "12px 14px",
                marginBottom: 10,
                display: "flex",
                gap: 12,
                alignItems: "center",
                border: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "#F5EDED",
                  borderRadius: 14,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: 16,
                    background: "#F5EDED",
                    borderRadius: 6,
                    marginBottom: 8,
                    width: "60%",
                  }}
                />
                <div
                  style={{
                    height: 12,
                    background: "#F5ECEC",
                    borderRadius: 6,
                    width: "40%",
                  }}
                />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", color: C.textMuted, marginTop: 60 }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>No items found</div>
          </div>
        ) : (
          filtered.map((item, idx) => (
            <MenuItemRow
              key={item.id.toString()}
              item={item}
              index={idx + 1}
              onEdit={openEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}
