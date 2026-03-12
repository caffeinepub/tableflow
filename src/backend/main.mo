import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  // Types and comparison modules
  type MenuItem = {
    id : Nat;
    name : Text;
    price : Float;
    foodType : Text;
    isVeg : Bool;
    imageEmoji : Text;
    description : Text;
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Nat.compare(menuItem1.id, menuItem2.id);
    };
  };

  type OrderItem = {
    menuId : Nat;
    name : Text;
    qty : Nat;
    price : Float;
    status : Text;
  };

  module OrderItem {
    public func compare(orderItem1 : OrderItem, orderItem2 : OrderItem) : Order.Order {
      switch (Nat.compare(orderItem1.menuId, orderItem2.menuId)) {
        case (#equal) { Text.compare(orderItem1.name, orderItem2.name) };
        case (order) { order };
      };
    };

    public func fromMenuItem(menuItem : MenuItem, qty : Nat) : OrderItem {
      {
        menuId = menuItem.id;
        name = menuItem.name;
        qty;
        price = menuItem.price;
        status = "Preparing";
      };
    };
  };

  type Order = {
    id : Nat;
    tableNumber : Nat;
    time : Text;
    paymentStatus : Text;
    items : [OrderItem];
  };

  module OrderOps {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };

    public func addItems(order : Order, newItems : [OrderItem]) : Order {
      { order with items = order.items.concat(newItems) };
    };

    public func markAllServed(order : Order) : Order {
      let updatedItems = order.items.map(
        func(item) { { item with status = "Served" } }
      );
      { order with items = updatedItems };
    };
  };

  // Data Structures
  var nextMenuId = 9;
  var nextOrderId = 4;
  let menuItems = Map.fromArray<Nat, MenuItem>(
    [(1, {
      id = 1;
      name = "Butter Chicken";
      price = 12.99;
      foodType = "Main Course";
      isVeg = false;
      imageEmoji = "🍗";
      description = "Creamy chicken curry";
    }), (2, {
      id = 2;
      name = "Garlic Naan";
      price = 2.99;
      foodType = "Starter";
      isVeg = true;
      imageEmoji = "🥖";
      description = "Flatbread with garlic";
    }), (3, {
      id = 3;
      name = "Mango Lassi";
      price = 3.99;
      foodType = "Drinks";
      isVeg = true;
      imageEmoji = "🥭";
      description = "Mango yogurt drink";
    }), (4, {
      id = 4;
      name = "Paneer Tikka";
      price = 10.99;
      foodType = "Main Course";
      isVeg = true;
      imageEmoji = "🧀";
      description = "Grilled paneer cubes";
    }), (5, {
      id = 5;
      name = "Dal Makhani";
      price = 9.99;
      foodType = "Curry";
      isVeg = true;
      imageEmoji = "🥘";
      description = "Black lentil curry";
    }), (6, {
      id = 6;
      name = "Veg Biryani";
      price = 11.99;
      foodType = "Main Course";
      isVeg = true;
      imageEmoji = "🍚";
      description = "Spiced rice with vegetables";
    }), (7, {
      id = 7;
      name = "Chicken Soup";
      price = 5.99;
      foodType = "Soup";
      isVeg = false;
      imageEmoji = "🍲";
      description = "Hot chicken broth";
    }), (8, {
      id = 8;
      name = "Masala Chai";
      price = 2.49;
      foodType = "Drinks";
      isVeg = true;
      imageEmoji = "🍵";
      description = "Spiced tea";
    })]
  );

  let orders = Map.fromArray<Nat, Order>(
    [(1, {
      id = 1;
      tableNumber = 5;
      time = "12:30 PM";
      paymentStatus = "Yet to Pay";
      items = [
        {
          menuId = 1;
          name = "Butter Chicken";
          qty = 2;
          price = 12.99;
          status = "Preparing";
        },
        {
          menuId = 2;
          name = "Garlic Naan";
          qty = 4;
          price = 2.99;
          status = "Preparing";
        },
      ];
    }), (2, {
      id = 2;
      tableNumber = 3;
      time = "1:15 PM";
      paymentStatus = "Paid";
      items = [
        {
          menuId = 3;
          name = "Mango Lassi";
          qty = 1;
          price = 3.99;
          status = "Served";
        },
        {
          menuId = 4;
          name = "Paneer Tikka";
          qty = 2;
          price = 10.99;
          status = "Served";
        },
      ];
    }), (3, {
      id = 3;
      tableNumber = 7;
      time = "11:45 AM";
      paymentStatus = "Yet to Pay";
      items = [
        {
          menuId = 5;
          name = "Dal Makhani";
          qty = 1;
          price = 9.99;
          status = "Preparing";
        },
      ];
    })]
  );

  // Menu Operations
  public query ({ caller }) func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray().sort();
  };

  public shared ({ caller }) func addMenuItem(
    name : Text,
    price : Float,
    foodType : Text,
    isVeg : Bool,
    imageEmoji : Text,
    description : Text,
  ) : async Nat {
    let id = nextMenuId;
    let newItem : MenuItem = {
      id;
      name;
      price;
      foodType;
      isVeg;
      imageEmoji;
      description;
    };
    menuItems.add(id, newItem);
    nextMenuId += 1;
    id;
  };

  public shared ({ caller }) func updateMenuItem(
    id : Nat,
    name : Text,
    price : Float,
    foodType : Text,
    isVeg : Bool,
    imageEmoji : Text,
    description : Text,
  ) : async Bool {
    let updatedItem : MenuItem = {
      id;
      name;
      price;
      foodType;
      isVeg;
      imageEmoji;
      description;
    };
    switch (menuItems.get(id)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?_) {
        menuItems.add(id, updatedItem);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteMenuItem(id : Nat) : async Bool {
    if (menuItems.containsKey(id)) {
      menuItems.remove(id);
      true;
    } else {
      false;
    };
  };

  // Order Operations
  public query ({ caller }) func getOrders() : async [Order] {
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func createOrder(
    tableNumber : Nat,
    time : Text,
    items : [OrderItem],
  ) : async Nat {
    let id = nextOrderId;
    let newOrder : Order = {
      id;
      tableNumber;
      time;
      paymentStatus = "Yet to Pay";
      items;
    };
    orders.add(id, newOrder);
    nextOrderId += 1;
    id;
  };

  public shared ({ caller }) func addItemsToOrder(orderId : Nat, items : [OrderItem]) : async Bool {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder = OrderOps.addItems(existingOrder, items);
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func updateOrderItemStatus(orderId : Nat, itemIndex : Nat, status : Text) : async Bool {
    if (status != "Preparing" and status != "Served") {
      Runtime.trap("Invalid status. Must be 'Preparing' or 'Served'");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (itemIndex >= order.items.size()) {
          Runtime.trap("Order item not found - check your index!");
        };
        let updatedItems = Array.tabulate(
          order.items.size(),
          func(i) {
            if (i == itemIndex) { { order.items[i] with status } : OrderItem } else {
              order.items[i];
            };
          },
        );
        let updatedOrder = { order with items = updatedItems };
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func updatePaymentStatus(orderId : Nat, paymentStatus : Text) : async Bool {
    if (paymentStatus != "Paid" and paymentStatus != "Yet to Pay") {
      Runtime.trap("Invalid payment status - must be 'Paid' or 'Yet to Pay'");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with
          paymentStatus
        };
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };

  public shared ({ caller }) func markAllServed(orderId : Nat) : async Bool {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = OrderOps.markAllServed(order);
        orders.add(orderId, updatedOrder);
        true;
      };
    };
  };
};
