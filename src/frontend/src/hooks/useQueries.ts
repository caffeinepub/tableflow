import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, Order, OrderItem } from "../backend.d";
import { useActor } from "./useActor";

export function useMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<MenuItem, "id">) => {
      if (!actor) throw new Error("No actor");
      return actor.addMenuItem(
        item.name,
        item.price,
        item.foodType,
        item.isVeg,
        item.imageEmoji,
        item.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: MenuItem) => {
      if (!actor) throw new Error("No actor");
      return actor.updateMenuItem(
        item.id,
        item.name,
        item.price,
        item.foodType,
        item.isVeg,
        item.imageEmoji,
        item.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tableNumber,
      time,
      items,
    }: { tableNumber: bigint; time: string; items: OrderItem[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.createOrder(tableNumber, time, items);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useAddItemsToOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      items,
    }: { orderId: bigint; items: OrderItem[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.addItemsToOrder(orderId, items);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderItemStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      itemIndex,
      status,
    }: { orderId: bigint; itemIndex: bigint; status: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateOrderItemStatus(orderId, itemIndex, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      paymentStatus,
    }: { orderId: bigint; paymentStatus: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePaymentStatus(orderId, paymentStatus);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useMarkAllServed() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.markAllServed(orderId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
