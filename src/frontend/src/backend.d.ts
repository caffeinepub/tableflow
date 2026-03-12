import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    description: string;
    imageEmoji: string;
    isVeg: boolean;
    price: number;
    foodType: string;
}
export interface Order {
    id: bigint;
    paymentStatus: string;
    time: string;
    tableNumber: bigint;
    items: Array<OrderItem>;
}
export interface OrderItem {
    qty: bigint;
    menuId: bigint;
    status: string;
    name: string;
    price: number;
}
export interface backendInterface {
    addItemsToOrder(orderId: bigint, items: Array<OrderItem>): Promise<boolean>;
    addMenuItem(name: string, price: number, foodType: string, isVeg: boolean, imageEmoji: string, description: string): Promise<bigint>;
    createOrder(tableNumber: bigint, time: string, items: Array<OrderItem>): Promise<bigint>;
    deleteMenuItem(id: bigint): Promise<boolean>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrders(): Promise<Array<Order>>;
    markAllServed(orderId: bigint): Promise<boolean>;
    updateMenuItem(id: bigint, name: string, price: number, foodType: string, isVeg: boolean, imageEmoji: string, description: string): Promise<boolean>;
    updateOrderItemStatus(orderId: bigint, itemIndex: bigint, status: string): Promise<boolean>;
    updatePaymentStatus(orderId: bigint, paymentStatus: string): Promise<boolean>;
}
