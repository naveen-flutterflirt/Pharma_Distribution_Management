"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Check, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  Printer, 
  ArrowRight, 
  Search, 
  Filter, 
  X, 
  Plus, 
  QrCode,
  ShieldAlert,
  Sparkles,
  ArrowUpDown
} from "lucide-react";

interface OrderItem {
  id: string;
  product: string;
  batch: string;
  exp: string;
  qty: number;
  free: number | string;
  ptr: number;
  disc: string;
  gst: number;
  amount: number;
  isShort?: boolean;
  shortNote?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  linesCount: number;
  channel: "all" | "app" | "salesman" | "whatsapp";
  channelLabel: string;
  sub: string;
  time: string;
  route: string;
  creditStatus: {
    badge: string;
    color: "green" | "blue" | "red" | "yellow";
    isBlocked?: boolean;
    reason?: string;
  };
  gstin: string;
  gstinValid: boolean;
  dlNumber: string;
  dlValid: boolean;
  creditLimit: number;
  creditUsed: number;
  orderTotal: number;
  termsDays: number;
  status: "pending" | "hold" | "billed";
  irn?: string;
  ewayBill?: string;
  billedAt?: string;
  schemesApplied: {
    description: string;
    freeGoodsValue: number;
  };
  shortSupply?: {
    item: string;
    note: string;
  };
  items: OrderItem[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "SO-2026-8812",
    customerName: "Sri Sai Medicals",
    linesCount: 42,
    channel: "salesman",
    channelLabel: "Salesman: Ravi",
    sub: "Salesman: Ravi · 10:12 · Route 3",
    time: "10:12",
    route: "Route 3",
    creditStatus: { badge: "Credit OK", color: "green" },
    gstin: "29AABCU9603R1ZM",
    gstinValid: true,
    dlNumber: "DL 20B/21B valid to 2028",
    dlValid: true,
    creditLimit: 300000,
    creditUsed: 184200,
    orderTotal: 62480,
    termsDays: 30,
    status: "pending",
    schemesApplied: {
      description: "Amox-Clav 10+1 · Pantoprazole 10+1 · Azithro 10+1",
      freeGoodsValue: 3842,
    },
    shortSupply: {
      item: "Cefixime 200",
      note: "80 strips back-ordered · Auto-billed when the next GRN arrives",
    },
    items: [
      { id: "i-1", product: "Amoxicillin + Clav 625 (10)", batch: "AC2408", exp: "03/27", qty: 60, free: 6, ptr: 162.40, disc: "—", gst: 12, amount: 9744.00 },
      { id: "i-2", product: "Pantoprazole 40 (15)", batch: "PN2502", exp: "06/27", qty: 100, free: 10, ptr: 98.10, disc: "—", gst: 12, amount: 9810.00 },
      { id: "i-3", product: "Metformin 500 SR (10)", batch: "MF2511", exp: "11/27", qty: 200, free: "—", ptr: 21.30, disc: "2%", gst: 12, amount: 4174.80 },
      { id: "i-4", product: "Insulin glargine pen", batch: "IG2507", exp: "07/27", qty: 10, free: "—", ptr: 612.00, disc: "—", gst: 5, amount: 6120.00 },
      { id: "i-5", product: "Azithromycin 500 (3)", batch: "AZ2412", exp: "12/26", qty: 80, free: 8, ptr: 74.60, disc: "—", gst: 12, amount: 5968.00 },
      { id: "i-6", product: "Cefixime 200 (10) — short", batch: "only 40 of 120", exp: "04/27", qty: 40, free: "—", ptr: 88.20, disc: "—", gst: 12, amount: 3528.00, isShort: true },
    ]
  },
  {
    id: "ord-2",
    orderNumber: "SO-2026-8813",
    customerName: "City Care Pharmacy",
    linesCount: 18,
    channel: "app",
    channelLabel: "Chemist app",
    sub: "Chemist app · 10:09",
    time: "10:09",
    route: "Route 1",
    creditStatus: { badge: "Credit OK", color: "green" },
    gstin: "29AABCU4412K1Z9",
    gstinValid: true,
    dlNumber: "DL 20B/21B valid to 2027",
    dlValid: true,
    creditLimit: 250000,
    creditUsed: 112000,
    orderTotal: 34850,
    termsDays: 21,
    status: "pending",
    schemesApplied: {
      description: "Paracetamol 20+2 · Cetirizine 15+1",
      freeGoodsValue: 1250,
    },
    items: [
      { id: "i-201", product: "Paracetamol 650 tab (15)", batch: "PC2409", exp: "09/27", qty: 120, free: 12, ptr: 28.50, disc: "—", gst: 12, amount: 3420.00 },
      { id: "i-202", product: "Montelukast + Levocet 10", batch: "ML2503", exp: "05/27", qty: 90, free: 6, ptr: 118.00, disc: "3%", gst: 12, amount: 10301.40 },
      { id: "i-203", product: "Telmisartan 40 (10)", batch: "TL2411", exp: "10/26", qty: 150, free: "—", ptr: 64.20, disc: "—", gst: 12, amount: 9630.00 },
      { id: "i-204", product: "Atorvastatin 10 (15)", batch: "AT2501", exp: "01/28", qty: 80, free: 8, ptr: 143.70, disc: "—", gst: 12, amount: 11496.00 }
    ]
  },
  {
    id: "ord-3",
    orderNumber: "SO-2026-8814",
    customerName: "Arogya Nursing Home",
    linesCount: 9,
    channel: "all",
    channelLabel: "Email PO",
    sub: "Email PO · 10:02 · institutional",
    time: "10:02",
    route: "Hospital Route",
    creditStatus: { badge: "Special rate", color: "blue" },
    gstin: "29AABCA9101L1ZZ",
    gstinValid: true,
    dlNumber: "Institutional Exemption DL-4882",
    dlValid: true,
    creditLimit: 500000,
    creditUsed: 220000,
    orderTotal: 48900,
    termsDays: 45,
    status: "pending",
    schemesApplied: {
      description: "Institutional Tender Discount (Rate diff claimable from principal)",
      freeGoodsValue: 0,
    },
    items: [
      { id: "i-301", product: "Ceftriaxone 1g Inj (Vial)", batch: "CF2410", exp: "08/26", qty: 200, free: "—", ptr: 55.00, disc: "Special", gst: 12, amount: 11000.00 },
      { id: "i-302", product: "Normal Saline 500ml IV", batch: "NS2504", exp: "04/28", qty: 400, free: "—", ptr: 38.00, disc: "Special", gst: 12, amount: 15200.00 },
      { id: "i-303", product: "Meropenem 1g Inj", batch: "MR2412", exp: "12/26", qty: 30, free: "—", ptr: 756.60, disc: "—", gst: 12, amount: 22700.00 }
    ]
  },
  {
    id: "ord-4",
    orderNumber: "SO-2026-8815",
    customerName: "New Life Chemists",
    linesCount: 26,
    channel: "whatsapp",
    channelLabel: "WhatsApp",
    sub: "WhatsApp · 09:55",
    time: "09:55",
    route: "Route 2",
    creditStatus: { 
      badge: "Blocked · overdue ₹86K", 
      color: "red", 
      isBlocked: true,
      reason: "Invoice INV-25-47219 is 54 days overdue (>45 days limit)."
    },
    gstin: "29AABCZ5512B1ZX",
    gstinValid: true,
    dlNumber: "DL 20B/21B valid to 2026",
    dlValid: true,
    creditLimit: 150000,
    creditUsed: 178000,
    orderTotal: 42100,
    termsDays: 30,
    status: "pending",
    schemesApplied: {
      description: "Standard retail scheme",
      freeGoodsValue: 840,
    },
    items: [
      { id: "i-401", product: "Rabeprazole 20 + DSR", batch: "RB2501", exp: "02/27", qty: 100, free: 10, ptr: 110.00, disc: "—", gst: 12, amount: 11000.00 },
      { id: "i-402", product: "Dolo 650 tab (15)", batch: "DL2502", exp: "07/27", qty: 300, free: 30, ptr: 29.10, disc: "—", gst: 12, amount: 8730.00 },
      { id: "i-403", product: "Levocetirizine 5 (10)", batch: "LC2409", exp: "11/26", qty: 250, free: 25, ptr: 34.00, disc: "—", gst: 12, amount: 8500.00 }
    ]
  },
  {
    id: "ord-5",
    orderNumber: "SO-2026-8816",
    customerName: "Janata Medical Store",
    linesCount: 11,
    channel: "all",
    channelLabel: "Phone",
    sub: "Phone · 09:48",
    time: "09:48",
    route: "Route 4",
    creditStatus: { 
      badge: "Licence expires in 12 d", 
      color: "yellow",
      reason: "Drug license 20B/21B renewal pending with State FDA."
    },
    gstin: "29AABCJ8821C1ZU",
    gstinValid: true,
    dlNumber: "DL 20B/21B valid till 24-Oct-2026",
    dlValid: true,
    creditLimit: 200000,
    creditUsed: 94000,
    orderTotal: 28400,
    termsDays: 30,
    status: "pending",
    schemesApplied: {
      description: "Amox-Clav 10+1",
      freeGoodsValue: 1400,
    },
    items: [
      { id: "i-501", product: "Ciprofloxacin 500 (10)", batch: "CP2411", exp: "10/26", qty: 80, free: 8, ptr: 62.00, disc: "—", gst: 12, amount: 4960.00 },
      { id: "i-502", product: "Amoxicillin 500 (10)", batch: "AM2505", exp: "05/27", qty: 120, free: 12, ptr: 71.50, disc: "—", gst: 12, amount: 8580.00 }
    ]
  }
];

export default function OrderDesk() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<"all" | "app" | "salesman" | "whatsapp">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("ord-1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");
  
  // Modals
  const [showBilledModal, setShowBilledModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [lastBilledData, setLastBilledData] = useState<{ order: Order; irn: string; ewb: string; tray: string } | null>(null);

  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId) || orders[0];
  }, [orders, selectedOrderId]);

  // Filter orders by active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((o) => o.channel === activeTab);
  }, [orders, activeTab]);

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Keyboard shortcut listener for F9: Bill & Send to Pick
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault();
        handleBillAction();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedOrder]);

  // Handle Hold / Release action
  const handleHoldToggle = () => {
    if (!selectedOrder) return;
    
    const isCurrentlyHold = selectedOrder.status === "hold";
    const nextStatus = isCurrentlyHold ? "pending" : "hold";
    
    setOrders((prev) =>
      prev.map((o) => o.id === selectedOrder.id ? { ...o, status: nextStatus } : o)
    );

    if (isCurrentlyHold) {
      showToast(`Order for ${selectedOrder.customerName} resumed. Ready for billing.`, "info");
    } else {
      showToast(`Order for ${selectedOrder.customerName} placed on HOLD. Picking paused.`, "warning");
    }
  };

  // Main Billing Trigger
  const handleBillAction = () => {
    if (!selectedOrder) return;

    // Check if customer is blocked due to overdue
    if (selectedOrder.creditStatus.isBlocked) {
      setShowOverrideModal(true);
      return;
    }

    finalizeBilling(selectedOrder);
  };

  // Finalize Billing Function (Generates IRN + e-Way Bill)
  const finalizeBilling = (orderToBill: Order, overrideReason?: string) => {
    const generatedIRN = `9e82${Math.random().toString(36).substring(2, 10).toUpperCase()}41209B1802${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedEway = `2410${Math.floor(10000000 + Math.random() * 90000000)}`;
    const assignedTray = "Tray 14 · Bin C-04-2";

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderToBill.id
          ? {
              ...o,
              status: "billed",
              irn: generatedIRN,
              ewayBill: generatedEway,
              billedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : o
      )
    );

    setLastBilledData({
      order: orderToBill,
      irn: generatedIRN,
      ewb: generatedEway,
      tray: assignedTray,
    });

    setShowOverrideModal(false);
    setShowBilledModal(true);
  };

  // Derived Calculations for current active order
  const calculatedTaxable = useMemo(() => {
    if (!selectedOrder) return 0;
    return selectedOrder.items.reduce((acc, item) => acc + (item.amount / (1 + item.gst / 100)), 0);
  }, [selectedOrder]);

  const calculatedGST = useMemo(() => {
    if (!selectedOrder) return 0;
    return selectedOrder.orderTotal - calculatedTaxable;
  }, [selectedOrder, calculatedTaxable]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-full bg-[#f6f8f9] overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`absolute top-4 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium transition-all transform animate-in slide-in-from-top-3 duration-200 ${
            toastType === "success" 
              ? "bg-emerald-900 text-white border-emerald-700" 
              : toastType === "warning"
              ? "bg-amber-900 text-white border-amber-700"
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          {toastType === "success" && <FileCheck2 className="w-5 h-5 text-emerald-400" />}
          {toastType === "warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {toastType === "info" && <Sparkles className="w-5 h-5 text-blue-400" />}
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left Panel - Incoming Orders */}
      <div className="w-full lg:w-[340px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfcfd] flex flex-col max-h-[260px] lg:max-h-full">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-gray-900">
              Incoming orders <span className="text-gray-400 font-normal">· {orders.length}</span>
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
              Live Feed
            </span>
          </div>

          {/* Interactive Filter Tabs Matching the User's Screenshot */}
          <div className="flex space-x-1 bg-gray-100/90 p-1 rounded-md">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer text-center ${
                activeTab === "all"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              } focus:outline-none focus:ring-2 focus:ring-blue-600`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("app")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer text-center ${
                activeTab === "app"
                  ? "bg-white text-gray-900 shadow-sm border-2 border-blue-600 font-semibold text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              } focus:outline-none focus:ring-2 focus:ring-blue-600`}
            >
              App
            </button>
            <button
              onClick={() => setActiveTab("salesman")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer text-center ${
                activeTab === "salesman"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              } focus:outline-none focus:ring-2 focus:ring-blue-600`}
            >
              Salesman
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer text-center ${
                activeTab === "whatsapp"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200/60 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              } focus:outline-none focus:ring-2 focus:ring-blue-600`}
            >
              WhatsApp
            </button>
          </div>
        </div>
        
        {/* Orders Queue List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              No orders found for &quot;{activeTab}&quot; channel.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-3 rounded-lg transition-all cursor-pointer group relative ${
                    isSelected
                      ? "bg-white border-2 border-[#178582] shadow-md ring-1 ring-[#178582]/20"
                      : "bg-white border border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-[14px] group-hover:text-[#178582] transition-colors">
                      {order.customerName}{" "}
                      <span className="font-normal text-gray-400 text-xs">
                        · {order.linesCount} lines
                      </span>
                    </h3>
                    {order.status === "hold" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                        HOLD
                      </span>
                    )}
                    {order.status === "billed" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        BILLED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{order.sub}</p>
                  <div className="flex items-center justify-between">
                    <Badge color={order.creditStatus.color}>
                      {order.creditStatus.badge}
                    </Badge>
                    <span className="text-xs font-semibold text-gray-700">
                      ₹{order.orderTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel - Order Workspace */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        
        {/* Order Header Matching the Exact Layout & Buttons */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shadow-xs z-10">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                {selectedOrder.customerName}
              </h2>
              <div className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/80">
                GSTIN <Check className="w-3.5 h-3.5 text-emerald-600 ml-1 stroke-[2.5]" />
              </div>
              <div className="flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200/80">
                {selectedOrder.dlNumber} <Check className="w-3.5 h-3.5 text-emerald-600 ml-1 stroke-[2.5]" />
              </div>

              {selectedOrder.status === "hold" && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 rounded-full animate-pulse">
                  Order on Hold
                </span>
              )}
              {selectedOrder.status === "billed" && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" /> Billed & Sent to Pick ({selectedOrder.billedAt})
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Credit limit ₹{selectedOrder.creditLimit.toLocaleString("en-IN")} · used ₹{selectedOrder.creditUsed.toLocaleString("en-IN")} · this order ₹{selectedOrder.orderTotal.toLocaleString("en-IN")} · terms {selectedOrder.termsDays} days
            </p>
          </div>
          
          {/* Action Buttons: Hold & Bill & send to pick (F9) */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button 
              onClick={handleHoldToggle}
              title="Toggle hold status for this order"
              className={`px-3.5 py-2 border font-medium rounded-md text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
                selectedOrder.status === "hold"
                  ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {selectedOrder.status === "hold" ? "Resume Order" : "Hold"}
            </button>

            <button 
              onClick={handleBillAction}
              disabled={selectedOrder.status === "billed"}
              title="Shortcut: Press F9 anywhere on this screen"
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 font-medium rounded-md text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-95 ${
                selectedOrder.status === "billed"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
                  : "bg-[#178582] text-white hover:bg-[#126b68] hover:shadow"
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Bill &amp; send to pick (F9)</span>
            </button>
          </div>
        </div>

        {/* Warning Banner if Overdue Block exists */}
        {selectedOrder.creditStatus.isBlocked && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center justify-between text-xs text-red-700 font-medium">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>
                <strong>System Credit Lock:</strong> {selectedOrder.creditStatus.reason} Standard dispatch blocked until accounts approval or payment receipt.
              </span>
            </div>
            <button
              onClick={() => setShowOverrideModal(true)}
              className="underline text-red-800 hover:text-red-950 font-bold cursor-pointer"
            >
              Request Manager Override
            </button>
          </div>
        )}

        {/* Order Items Data Grid */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left min-w-[680px]">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200 text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Batch</th>
                  <th className="pb-3 font-semibold">Exp</th>
                  <th className="pb-3 font-semibold">Qty</th>
                  <th className="pb-3 font-semibold">Free</th>
                  <th className="pb-3 font-semibold">PTR</th>
                  <th className="pb-3 font-semibold">Disc</th>
                  <th className="pb-3 font-semibold">GST</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 divide-y divide-gray-50">
                {selectedOrder.items.map((item) => {
                  if (item.isShort) {
                    return (
                      <tr key={item.id} className="bg-red-50/40 text-red-600 font-medium">
                        <td className="py-3.5">{item.product}</td>
                        <td className="py-3.5" colSpan={2}>{item.batch}</td>
                        <td className="py-3.5 font-bold">{item.qty}</td>
                        <td className="py-3.5">{item.free}</td>
                        <td className="py-3.5">₹{item.ptr.toFixed(2)}</td>
                        <td className="py-3.5">{item.disc}</td>
                        <td className="py-3.5">{item.gst}%</td>
                        <td className="py-3.5 text-right font-bold">₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 font-medium text-gray-900">{item.product}</td>
                      <td className="py-3.5 font-mono text-xs text-gray-700">{item.batch}</td>
                      <td className="py-3.5 text-gray-600">{item.exp}</td>
                      <td className="py-3.5 font-semibold text-gray-900">{item.qty}</td>
                      <td className="py-3.5 text-emerald-600 font-medium">{item.free}</td>
                      <td className="py-3.5 text-gray-700">₹{item.ptr.toFixed(2)}</td>
                      <td className="py-3.5 text-gray-500">{item.disc}</td>
                      <td className="py-3.5 text-gray-500">{item.gst}%</td>
                      <td className="py-3.5 text-right font-medium text-gray-900">
                        ₹{item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-400 mt-4 pl-2 font-medium">
            + {selectedOrder.linesCount - selectedOrder.items.length} more lines auto-verified against FEFO batch allocation
          </div>
        </div>

        {/* Bottom Three Summary Blocks matching Blueprint */}
        <div className="p-6 bg-gray-50/70 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Schemes Applied */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-gray-900 mb-1.5 flex items-center justify-between">
                <span>Schemes applied</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold">
                  Auto-applied
                </span>
              </h4>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                {selectedOrder.schemesApplied.description}
              </p>
            </div>
            <p className="text-[13px] text-gray-500 pt-2 border-t border-gray-100">
              Free goods value <span className="font-bold text-emerald-700">₹{selectedOrder.schemesApplied.freeGoodsValue.toLocaleString("en-IN")}</span>
            </p>
          </div>

          {/* Short Supply */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-gray-900 mb-1.5 flex items-center justify-between">
                <span>Short supply</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                  Back-order
                </span>
              </h4>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-2">
                {selectedOrder.shortSupply?.item || "All lines available in full"}: {selectedOrder.shortSupply?.note || "Zero pending backlog"}
              </p>
            </div>
            <p className="text-[12px] text-gray-400 pt-2 border-t border-gray-100">
              Auto-billed when the next GRN arrives
            </p>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Taxable</span>
                <span className="font-medium text-gray-800">
                  ₹{calculatedTaxable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">GST (IGST/CGST/SGST)</span>
                <span className="font-medium text-gray-800">
                  ₹{calculatedGST.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900 text-sm">Total</span>
                <span className="font-bold text-gray-900 text-lg">
                  ₹{selectedOrder.orderTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-3 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              e-invoice IRN + e-way bill generated on save
            </div>
          </div>

        </div>

      </div>

      {/* SUCCESS MODAL: Billed & Sent to Pick */}
      {showBilledModal && lastBilledData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Invoice Generated &amp; Sent to Pick!
                </h3>
                <p className="text-xs text-gray-500">
                  Order successfully processed under statutory GST and Drug Distribution rules.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Customer</span>
                <span className="font-bold text-gray-900">{lastBilledData.order.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">Invoice Amount</span>
                <span className="font-bold text-gray-900">₹{lastBilledData.order.orderTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">e-Invoice IRN</span>
                <span className="font-mono text-gray-800 break-all text-[11px]">{lastBilledData.irn}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-500">e-Way Bill No.</span>
                <span className="font-mono font-bold text-gray-900">{lastBilledData.ewb}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Pick Location</span>
                <span className="font-semibold text-[#178582]">{lastBilledData.tray}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  showToast("Invoice print queued for thermal/laser printer.", "info");
                  setShowBilledModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>
              <button
                onClick={() => {
                  setShowBilledModal(false);
                  // Auto-advance to next pending order
                  const nextPending = orders.find((o) => o.status === "pending" && o.id !== lastBilledData.order.id);
                  if (nextPending) {
                    setSelectedOrderId(nextPending.id);
                    showToast(`Switched to next order: ${nextPending.customerName}`, "info");
                  }
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Next Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERRIDE MODAL: Maker-Checker Credit Clearance */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Credit Limit / Overdue Override
                </h3>
                <p className="text-xs text-red-600 font-medium">
                  Compliance Rule: Maker-Checker audit trail enforced
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              <strong>{selectedOrder.customerName}</strong> is blocked because receivables are past terms (&gt;45 days). Overriding requires logging the authorization reason.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Authorization Note:
                </label>
                <input
                  type="text"
                  defaultValue="Cheque received #409122 / post-dated deposit"
                  className="w-full text-xs border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3.5 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  finalizeBilling(selectedOrder, "Cheque received #409122 / post-dated deposit");
                  showToast("Manager override logged to statutory audit trail.", "warning");
                }}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer shadow-sm"
              >
                Approve &amp; Bill (Logged)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "green" | "blue" | "red" | "yellow" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    red: "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
  };
  
  return (
    <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold border rounded-sm ${colors[color]}`}>
      {children}
    </span>
  );
}
