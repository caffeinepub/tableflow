# TableFlow

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full restaurant order management app (TableFlow)
- Orders page: list active orders, create new orders, add items to existing orders, toggle item status (Preparing/Served), toggle payment status (Paid/Yet to Pay)
- Menu page: list menu items with search, add/edit menu items with name, food type, veg/non-veg, price, description
- Analytics page: calendar (month/year nav, today highlighted), daily stats (total orders, revenue, most ordered item, orders per hour bar chart), recent performance feed
- Bottom navigation bar (always visible): Orders, Menu, Analytics
- Sample data: 8 menu items (Indian cuisine), 3 initial orders

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store menu items and orders in stable memory with CRUD operations
2. Frontend: implement all pages using the provided code as reference, wiring to backend APIs
   - OrdersPage with tabs (Active/Completed/Cancelled), OrderCard, NewOrder flow, AddItems flow
   - MenuPage with search, add/edit form
   - AnalyticsPage with calendar, stats cards, bar chart
   - Bottom navigation
3. Design: deep red primary (#8B1A1A), Playfair Display + DM Sans fonts, card-based, touch-friendly
