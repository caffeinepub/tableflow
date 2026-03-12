import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem, Order, OrderItem } from "../backend.d";
import ItemSelector from "../components/ItemSelector";
import {
  useAddItemsToOrder,
  useCreateOrder,
  useMarkAllServed,
  useMenuItems,
  useOrders,
  useUpdateOrderItemStatus,
  useUpdatePaymentStatus,
} from "../hooks/useQueries";

const C = {
  primary: "#8B1A1A",
  primaryBg: "#FDF5F5",
  card: "#FFFFFF",
  border: "#F0E0E0",
  text: "#1A1A1A",
  textMuted: "#888",
  green: "#27AE60",
  greenBg: "#E8F8EF",
  greenBorder: "#A9DFBF",
  orange: "#E67E22",
  orangeBg: "#FEF3E8",
  orangeBorder: "#F5CBA7",
  yellow: "#F39C12",
  yellowBg: "#FFFAE8",
  yellowBorder: "#F9E79F",
};

function StatusBadge({
  status,
  onClick,
}: { status: string; onClick?: () => void }) {
  const isPreparing = status === "Preparing";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: isPreparing ? C.orangeBg : C.greenBg,
        color: isPreparing ? C.orange : C.green,
        border: `1px solid ${isPreparing ? C.orangeBorder : C.greenBorder}`,
        borderRadius: 20,
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase" as const,
        cursor: onClick ? "pointer" : "default",
        whiteSpace: "nowrap" as const,
      }}
    >
      {status}
    </button>
  );
}

function PaymentBadge({
  status,
  onClick,
}: { status: string; onClick?: () => void }) {
  const isPaid = status === "Paid";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: isPaid ? C.greenBg : C.yellowBg,
        color: isPaid ? C.green : C.yellow,
        border: `1px solid ${isPaid ? C.greenBorder : C.yellowBorder}`,
        borderRadius: 20,
        padding: "5px 12px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap" as const,
      }}
    >
      {status}
    </button>
  );
}

function OrderCard({
  order,
  index,
  onAddItems,
  onToggleStatus,
  onTogglePayment,
  onMarkServed,
}: {
  order: Order;
  index: number;
  onAddItems: (order: Order) => void;
  onToggleStatus: (orderId: bigint, itemIdx: number) => void;
  onTogglePayment: (orderId: bigint) => void;
  onMarkServed: (orderId: bigint) => void;
}) {
  const total = order.items.reduce((s, i) => s + i.price * Number(i.qty), 0);
  const allServed = order.items.every((i) => i.status === "Served");
  const ocidBase = `orders.item.${index}`;

  return (
    <div
      data-ocid={ocidBase}
      style={{
        background: C.card,
        borderRadius: 20,
        padding: "18px 18px 16px",
        boxShadow: "0 2px 12px rgba(139,26,26,0.07)",
        border: `1px solid ${C.border}`,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
            }}
          >
            Table {order.tableNumber.toString()}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
            ORDER #{order.id.toString()} • {order.time}
          </div>
        </div>
        <PaymentBadge
          status={order.paymentStatus}
          onClick={() => onTogglePayment(order.id)}
        />
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, margin: "10px 0" }} />

      {order.items.map((item, idx) => (
        <div
          key={String(item.menuId)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, color: C.text, flex: 1 }}>
            {item.qty.toString()}× {item.name}
          </span>
          <StatusBadge
            status={item.status}
            onClick={() => onToggleStatus(order.id, idx)}
          />
        </div>
      ))}

      <div
        style={{ borderTop: `1px solid ${C.border}`, margin: "12px 0 10px" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: C.textMuted }}>Total Amount</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: C.text,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            ₹{total.toLocaleString("en-IN")}.00
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            data-ocid="order.add_items.button"
            onClick={() => onAddItems(order)}
            style={{
              background: "#FDE8E8",
              color: C.primary,
              border: "none",
              borderRadius: 14,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              minHeight: 44,
            }}
          >
            Add Items
          </button>
          <button
            type="button"
            data-ocid="order.mark_served.button"
            onClick={() => !allServed && onMarkServed(order.id)}
            style={{
              background: allServed ? "#ccc" : C.primary,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: allServed ? "default" : "pointer",
              minHeight: 44,
            }}
          >
            {allServed ? "All Served" : "Mark Served"}
          </button>
        </div>
      </div>
    </div>
  );
}

type Screen = "list" | "new" | "addItems";

export default function OrdersPage() {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: menuItems = [], isLoading: menuLoading } = useMenuItems();
  const createOrder = useCreateOrder();
  const addItemsToOrder = useAddItemsToOrder();
  const updateItemStatus = useUpdateOrderItemStatus();
  const updatePayment = useUpdatePaymentStatus();
  const markAllServed = useMarkAllServed();

  const [screen, setScreen] = useState<Screen>("list");
  const [tab, setTab] = useState<"Active" | "Completed" | "Cancelled">(
    "Active",
  );
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [tableNum, setTableNum] = useState("");
  const [newOrderStep, setNewOrderStep] = useState(1);

  const isLoading = ordersLoading || menuLoading;

  const handleNewOrder = async (quantities: Record<number, number>) => {
    const items: OrderItem[] = menuItems
      .filter((m) => quantities[Number(m.id)] > 0)
      .map((m) => ({
        menuId: m.id,
        name: m.name,
        qty: BigInt(quantities[Number(m.id)]),
        price: m.price,
        status: "Preparing",
      }));
    try {
      await createOrder.mutateAsync({
        tableNumber: BigInt(tableNum),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        items,
      });
      toast.success("Order sent to kitchen!");
      setScreen("list");
      setTableNum("");
      setNewOrderStep(1);
    } catch {
      toast.error("Failed to create order");
    }
  };

  const handleAddItems = async (quantities: Record<number, number>) => {
    if (!editingOrder) return;
    const newItems: OrderItem[] = menuItems
      .filter((m) => quantities[Number(m.id)] > 0)
      .map((m) => ({
        menuId: m.id,
        name: m.name,
        qty: BigInt(quantities[Number(m.id)]),
        price: m.price,
        status: "Preparing",
      }));
    try {
      await addItemsToOrder.mutateAsync({
        orderId: editingOrder.id,
        items: newItems,
      });
      toast.success("Items added!");
      setScreen("list");
      setEditingOrder(null);
    } catch {
      toast.error("Failed to add items");
    }
  };

  const handleToggleStatus = async (orderId: bigint, itemIdx: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const currentStatus = order.items[itemIdx].status;
    const newStatus = currentStatus === "Preparing" ? "Served" : "Preparing";
    try {
      await updateItemStatus.mutateAsync({
        orderId,
        itemIndex: BigInt(itemIdx),
        status: newStatus,
      });
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleTogglePayment = async (orderId: bigint) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const newStatus = order.paymentStatus === "Paid" ? "Yet to Pay" : "Paid";
    try {
      await updatePayment.mutateAsync({ orderId, paymentStatus: newStatus });
    } catch {
      toast.error("Failed to update payment");
    }
  };

  const handleMarkServed = async (orderId: bigint) => {
    try {
      await markAllServed.mutateAsync(orderId);
      toast.success("All items marked as served!");
    } catch {
      toast.error("Failed to mark as served");
    }
  };

  // New Order — Step 1: Table number
  if (screen === "new" && newOrderStep === 1) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 16px 8px",
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
            New Order
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 32px",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              marginBottom: 8,
              color: C.text,
            }}
          >
            New Order
          </div>
          <div
            style={{
              color: C.textMuted,
              marginBottom: 32,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Enter the table number to begin
          </div>
          <input
            data-ocid="new_order.table_input"
            type="number"
            value={tableNum}
            onChange={(e) => setTableNum(e.target.value)}
            placeholder="Table Number"
            style={{
              width: "100%",
              maxWidth: 280,
              border: `2px solid ${C.border}`,
              borderRadius: 16,
              padding: "16px 20px",
              fontSize: 28,
              textAlign: "center",
              fontWeight: 700,
              outline: "none",
              color: C.text,
              background: "#fff",
            }}
          />
          <button
            type="button"
            data-ocid="new_order.continue.button"
            disabled={!tableNum}
            onClick={() => setNewOrderStep(2)}
            style={{
              marginTop: 24,
              background: tableNum ? C.primary : "#DDD",
              color: "#fff",
              border: "none",
              borderRadius: 16,
              padding: "16px 0",
              fontSize: 16,
              fontWeight: 700,
              cursor: tableNum ? "pointer" : "default",
              width: "100%",
              maxWidth: 280,
              minHeight: 52,
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  // New Order — Step 2: Item selection
  if (screen === "new" && newOrderStep === 2) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 16px 8px",
            gap: 12,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <button
            type="button"
            onClick={() => setNewOrderStep(1)}
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
            Table {tableNum} — Select Items
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ItemSelector
            menuItems={menuItems}
            onSend={handleNewOrder}
            sendLabel="Send to Kitchen"
          />
        </div>
      </div>
    );
  }

  // Add Items screen
  if (screen === "addItems" && editingOrder) {
    const existingQty: Record<number, number> = {};
    for (const item of editingOrder.items) {
      existingQty[Number(item.menuId)] = Number(item.qty);
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 16px 8px",
            gap: 12,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setScreen("list");
              setEditingOrder(null);
            }}
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
            Table {editingOrder.tableNumber.toString()} — Add Items
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ItemSelector
            menuItems={menuItems}
            initialQuantities={existingQty}
            onSend={handleAddItems}
            sendLabel="Update Order"
          />
        </div>
      </div>
    );
  }

  // Main orders list
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "18px 16px 0",
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
          Orders
        </span>
        <button
          type="button"
          data-ocid="orders.new_order.button"
          onClick={() => {
            setScreen("new");
            setNewOrderStep(1);
          }}
          style={{
            background: C.primary,
            color: "#fff",
            border: "none",
            borderRadius: 16,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            minHeight: 44,
          }}
        >
          + New Order
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          padding: "14px 16px 0",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {(["Active", "Completed", "Cancelled"] as const).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`orders.${t.toLowerCase()}.tab`}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                tab === t ? `2px solid ${C.primary}` : "2px solid transparent",
              color: tab === t ? C.primary : C.textMuted,
              fontWeight: tab === t ? 700 : 500,
              padding: "8px 16px",
              cursor: "pointer",
              fontSize: 14,
              minHeight: 44,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Order list */}
      <div
        data-ocid="orders.list"
        style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  borderRadius: 20,
                  padding: 18,
                  border: `1px solid ${C.border}`,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              >
                <div
                  style={{
                    height: 20,
                    background: "#F0E0E0",
                    borderRadius: 8,
                    marginBottom: 10,
                    width: "40%",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    background: "#F5ECEC",
                    borderRadius: 6,
                    marginBottom: 8,
                    width: "70%",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    background: "#F5ECEC",
                    borderRadius: 6,
                    marginBottom: 8,
                    width: "60%",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    background: "#F5ECEC",
                    borderRadius: 6,
                    width: "50%",
                  }}
                />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div
            data-ocid="orders.empty_state"
            style={{ textAlign: "center", color: C.textMuted, marginTop: 60 }}
          >
            <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
              No active orders
            </div>
            <div style={{ fontSize: 13 }}>Tap + New Order to get started</div>
          </div>
        ) : (
          orders.map((order, idx) => (
            <OrderCard
              key={order.id.toString()}
              order={order}
              index={idx + 1}
              onAddItems={(o) => {
                setEditingOrder(o);
                setScreen("addItems");
              }}
              onToggleStatus={handleToggleStatus}
              onTogglePayment={handleTogglePayment}
              onMarkServed={handleMarkServed}
            />
          ))
        )}
      </div>
    </div>
  );
}
