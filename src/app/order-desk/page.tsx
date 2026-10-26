"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  Receipt, 
  Trash2, 
  AlertCircle,
  IndianRupee,
  Calendar,
  User,
  ShoppingBag
} from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  ptr: number; // Price to Retailer
  amount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: "Pending" | "Billed" | "Cancelled";
  items: OrderItem[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "SO-8812",
    customerName: "Sri Sai Medicals",
    phone: "+91 98450 12345",
    date: "Today, 10:15 AM",
    itemsCount: 3,
    totalAmount: 48500,
    status: "Pending",
    items: [
      { name: "Amoxicillin + Clav 625 (10 tabs)", qty: 50, ptr: 162, amount: 8100 },
      { name: "Pantoprazole 40 (15 tabs)", qty: 100, ptr: 98, amount: 9800 },
      { name: "Azithromycin 500 (3 tabs)", qty: 80, ptr: 75, amount: 6000 }
    ]
  },
  {
    id: "ord-2",
    orderNumber: "SO-8811",
    customerName: "City Care Pharmacy",
    phone: "+91 98210 55432",
    date: "Today, 09:40 AM",
    itemsCount: 2,
    totalAmount: 24200,
    status: "Pending",
    items: [
      { name: "Cefixime 200 (10 tabs)", qty: 60, ptr: 88, amount: 5280 },
      { name: "Metformin 500 SR (10 tabs)", qty: 200, ptr: 21, amount: 4200 }
    ]
  },
  {
    id: "ord-3",
    orderNumber: "SO-8810",
    customerName: "Apollo Pharmacy Sec-14",
    phone: "+91 99001 88765",
    date: "Today, 09:10 AM",
    itemsCount: 4,
    totalAmount: 114500,
    status: "Billed",
    items: [
      { name: "Insulin Glargine Pen", qty: 20, ptr: 612, amount: 12240 },
      { name: "Amoxicillin + Clav 625", qty: 150, ptr: 162, amount: 24300 },
      { name: "Pantoprazole 40", qty: 200, ptr: 98, amount: 19600 }
    ]
  },
  {
    id: "ord-4",
    orderNumber: "SO-8809",
    customerName: "MedPlus Chemist",
    phone: "+91 98452 77123",
    date: "Yesterday",
    itemsCount: 3,
    totalAmount: 33400,
    status: "Billed",
    items: [
      { name: "Pantoprazole 40", qty: 120, ptr: 98, amount: 11760 },
      { name: "Azithromycin 500", qty: 60, ptr: 75, amount: 4500 }
    ]
  }
];

export default function OrderDeskPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Billed" | "Cancelled">("All");

  // View details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Create new order modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemPrice, setNewItemPrice] = useState(100);
  const [orderItemsList, setOrderItemsList] = useState<OrderItem[]>([]);

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Actions
  const handleApprove = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Billed" } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: "Billed" } : null);
    }
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: "Cancelled" } : o));
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: "Cancelled" } : null);
      }
    }
  };

  const handleAddItemToNewOrder = () => {
    if (!newItemName.trim()) return;
    const amount = Number(newItemQty) * Number(newItemPrice);
    setOrderItemsList([...orderItemsList, {
      name: newItemName,
      qty: Number(newItemQty),
      ptr: Number(newItemPrice),
      amount
    }]);
    setNewItemName("");
    setNewItemQty(10);
    setNewItemPrice(100);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim()) {
      alert("Please enter customer name");
      return;
    }
    if (orderItemsList.length === 0) {
      alert("Please add at least one medicine item");
      return;
    }

    const total = orderItemsList.reduce((sum, item) => sum + item.amount, 0);
    const newOrd: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SO-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomer,
      phone: newPhone || "+91 98000 00000",
      date: "Just now",
      itemsCount: orderItemsList.length,
      totalAmount: total,
      status: "Pending",
      items: orderItemsList
    };

    setOrders([newOrd, ...orders]);
    setIsCreateOpen(false);
    setNewCustomer("");
    setNewPhone("");
    setOrderItemsList([]);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Orders Management
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{filteredOrders.length} orders found</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Customer Orders
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </header>

      {/* Filter and Search Bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Chemist or Order #..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {(["All", "Pending", "Billed", "Cancelled"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Orders Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Order No</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-gray-900">
                        <div className="font-bold">{ord.customerName}</div>
                        <div className="text-[11px] text-gray-400">{ord.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-xs">
                        {ord.date}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {ord.itemsCount} items
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        ₹{ord.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.status === "Pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                        {ord.status === "Billed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Billed
                          </span>
                        )}
                        {ord.status === "Cancelled" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            <X className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                            title="View order details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {ord.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(ord.id)}
                                className="px-2.5 py-1 bg-[#178582] hover:bg-[#126b68] text-white text-xs font-bold rounded-md transition-colors cursor-pointer shadow-2xs"
                              >
                                Approve &amp; Bill
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancel(ord.id)}
                                className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                title="Cancel order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {ord.status === "Billed" && (
                            <Link
                              href="/billing"
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer inline-block"
                            >
                              Invoice
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Order Details — {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">{selectedOrder.customerName} · {selectedOrder.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medicine items table */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b">
                  <tr>
                    <th className="p-2.5">Medicine</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-gray-900">{item.name}</td>
                      <td className="p-2.5 text-right text-gray-600">{item.qty}</td>
                      <td className="p-2.5 text-right text-gray-600 font-mono">₹{item.ptr}</td>
                      <td className="p-2.5 text-right font-bold text-gray-900 font-mono">₹{item.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 text-sm font-bold border-t">
              <span className="text-gray-600">Total Order Amount</span>
              <span className="text-lg font-mono text-[#178582]">
                ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Close
              </button>
              {selectedOrder.status === "Pending" && (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedOrder.id)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#178582] hover:bg-[#126b68] rounded-lg shadow-2xs cursor-pointer"
                >
                  Approve &amp; Generate Bill
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW ORDER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                Create New Customer Order
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Customer / Chemist Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Apollo Pharmacy Sec-5"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
              </div>

              {/* Add items to order row */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-800">Add Medicines to Order</div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Medicine Name (e.g. Paracetamol 500)"
                      className="w-full px-2.5 py-1.5 bg-white rounded border border-gray-300 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      placeholder="Qty"
                      className="w-full px-2.5 py-1.5 bg-white rounded border border-gray-300 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                      placeholder="Price"
                      className="w-full px-2.5 py-1.5 bg-white rounded border border-gray-300 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItemToNewOrder}
                      className="w-full py-1.5 bg-[#178582] text-white text-xs font-bold rounded cursor-pointer hover:bg-[#126b68]"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Added items list */}
                {orderItemsList.length > 0 && (
                  <div className="pt-2 divide-y divide-gray-200">
                    {orderItemsList.map((item, idx) => (
                      <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-800">{item.name} (x{item.qty})</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-900">₹{item.amount}</span>
                          <button
                            type="button"
                            onClick={() => setOrderItemsList(orderItemsList.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#178582] hover:bg-[#126b68] rounded-lg shadow-2xs cursor-pointer"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
