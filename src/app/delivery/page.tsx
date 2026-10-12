"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  MapPin,
  Navigation,
  Phone,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Signature,
  FileCheck2,
  CreditCard,
  IndianRupee,
  RotateCcw,
  Clock,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface DeliveryDrop {
  id: string;
  sequence: number;
  customerName: string;
  customerCode: string;
  address: string;
  contactPerson: string;
  phone: string;
  invoiceNo: string;
  boxesCount: number;
  invoiceAmount: number;
  oldDues: number;
  paymentMode: "Credit" | "Cash on Delivery" | "Cheque / UPI";
  returnPickUp?: {
    itemsCount: string;
    reason: string;
  };
  podStatus: {
    otpVerified: boolean;
    photoTaken: boolean;
    signatureObtained: boolean;
  };
  status: "pending" | "in_transit" | "delivered" | "failed";
  collectedAmount?: number;
  collectionMethod?: "UPI QR" | "Cheque" | "Cash";
  deliveredAt?: string;
  failureReason?: string;
}

interface DeliveryRoute {
  id: string;
  routeNumber: string;
  driverName: string;
  vanNumber: string;
  totalDrops: number;
  deliveredDrops: number;
  totalOrderValue: number;
  totalCollected: number;
  cashCollected: number;
  upiCollected: number;
  chequeCollected: number;
  status: "on_route" | "settled" | "loading";
  drops: DeliveryDrop[];
}

const SAMPLE_ROUTES: DeliveryRoute[] = [
  {
    id: "route-3",
    routeNumber: "Route 3",
    driverName: "Ramesh Kumar",
    vanNumber: "Van KA-XX-1234",
    totalDrops: 18,
    deliveredDrops: 7,
    totalOrderValue: 428000,
    totalCollected: 31200,
    cashCollected: 4680,
    upiCollected: 19032,
    chequeCollected: 7488,
    status: "on_route",
    drops: [
      {
        id: "drop-1",
        sequence: 8,
        customerName: "Sri Sai Medicals",
        customerCode: "C-2041",
        address: "Shop 14, Main Market, MG Road",
        contactPerson: "Mr. Satish (Pharmacist)",
        phone: "+91 98451 22019",
        invoiceNo: "INV-25-50388",
        boxesCount: 3,
        invoiceAmount: 62480,
        oldDues: 24000,
        paymentMode: "Credit",
        returnPickUp: {
          itemsCount: "1 bag",
          reason: "Expiry return claim (CN-1182)"
        },
        podStatus: {
          otpVerified: true,
          photoTaken: true,
          signatureObtained: false
        },
        status: "in_transit"
      },
      {
        id: "drop-2",
        sequence: 9,
        customerName: "City Care Pharmacy",
        customerCode: "C-1980",
        address: "24/B, 4th Cross, Gandhi Square",
        contactPerson: "Dr. Kulkarni",
        phone: "+91 98452 88190",
        invoiceNo: "INV-25-50387",
        boxesCount: 2,
        invoiceAmount: 34850,
        oldDues: 0,
        paymentMode: "Cheque / UPI",
        podStatus: {
          otpVerified: false,
          photoTaken: false,
          signatureObtained: false
        },
        status: "pending"
      },
      {
        id: "drop-3",
        sequence: 7,
        customerName: "Janata Medical Store",
        customerCode: "C-1102",
        address: "Opp. City Hospital Gate",
        contactPerson: "Mr. Anand",
        phone: "+91 97410 99411",
        invoiceNo: "INV-25-50380",
        boxesCount: 1,
        invoiceAmount: 18400,
        oldDues: 12000,
        paymentMode: "Cash on Delivery",
        podStatus: {
          otpVerified: true,
          photoTaken: true,
          signatureObtained: true
        },
        status: "delivered",
        collectedAmount: 12000,
        collectionMethod: "UPI QR",
        deliveredAt: "10:45 AM"
      }
    ]
  },
  {
    id: "route-1",
    routeNumber: "Route 1",
    driverName: "Suresh Gowda",
    vanNumber: "Van KA-01-MJ-8812",
    totalDrops: 14,
    deliveredDrops: 10,
    totalOrderValue: 295000,
    totalCollected: 45600,
    cashCollected: 8200,
    upiCollected: 29400,
    chequeCollected: 8000,
    status: "on_route",
    drops: []
  }
];

export default function DeliveryPage() {
  const [routes, setRoutes] = useState<DeliveryRoute[]>(SAMPLE_ROUTES);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-3");
  const [selectedDropId, setSelectedDropId] = useState<string>("drop-1");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Interactive Modals
  const [showPodModal, setShowPodModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDayEndModal, setShowDayEndModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("4092");
  const [paymentAmount, setPaymentAmount] = useState("24000");
  const [paymentMethod, setPaymentMethod] = useState<"UPI QR" | "Cheque" | "Cash">("UPI QR");
  
  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const currentDrop = useMemo(() => {
    return currentRoute.drops.find((d) => d.id === selectedDropId) || currentRoute.drops[0];
  }, [currentRoute, selectedDropId]);

  // Handle Complete Proof of Delivery
  const handleCompletePod = () => {
    if (!currentDrop) return;

    setRoutes((prev) =>
      prev.map((r) =>
        r.id === currentRoute.id
          ? {
              ...r,
              deliveredDrops: r.deliveredDrops + 1,
              drops: r.drops.map((d) =>
                d.id === currentDrop.id
                  ? {
                      ...d,
                      status: "delivered",
                      deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      podStatus: { otpVerified: true, photoTaken: true, signatureObtained: true }
                    }
                  : d
              )
            }
          : r
      )
    );

    setShowPodModal(false);
    showToast(`Proof of Delivery (POD) confirmed for ${currentDrop.customerName}! Delivered timestamp & OTP recorded.`, "success");
  };

  // Handle Payment Collection
  const handleRecordCollection = () => {
    const collectedVal = Number(paymentAmount) || 0;
    
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === currentRoute.id
          ? {
              ...r,
              totalCollected: r.totalCollected + collectedVal,
              upiCollected: paymentMethod === "UPI QR" ? r.upiCollected + collectedVal : r.upiCollected,
              cashCollected: paymentMethod === "Cash" ? r.cashCollected + collectedVal : r.cashCollected,
              chequeCollected: paymentMethod === "Cheque" ? r.chequeCollected + collectedVal : r.chequeCollected,
              drops: r.drops.map((d) =>
                d.id === currentDrop.id
                  ? {
                      ...d,
                      oldDues: Math.max(0, d.oldDues - collectedVal),
                      collectedAmount: collectedVal,
                      collectionMethod: paymentMethod
                    }
                  : d
              )
            }
          : r
      )
    );

    setShowPaymentModal(false);
    showToast(`Collected ₹${collectedVal.toLocaleString("en-IN")} via ${paymentMethod} for ${currentDrop.customerName}. WhatsApp receipt dispatched.`, "success");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8f9] overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`absolute top-4 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold transition-all transform animate-in slide-in-from-top-3 duration-200 ${
            toastType === "success" 
              ? "bg-emerald-900 text-white border-emerald-700" 
              : toastType === "warning"
              ? "bg-amber-900 text-white border-amber-700"
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          {toastType === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toastType === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {toastType === "info" && <Sparkles className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-white/70 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <header className="px-4 sm:px-8 py-5 sm:py-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Delivery &amp; Route Management (POD)
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Live Van GPS Tracking Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Optimized delivery drops, OTP / Photo proof of delivery, cash/UPI collection, and return pickup.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDayEndModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <IndianRupee className="w-4 h-4 text-[#178582]" />
              <span>Day-End Cash Settlement</span>
            </button>
            <button
              onClick={() => {
                showToast(`Optimized sequence generated for ${currentRoute.routeNumber}. Shortest-path routing applied.`, "info");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Optimize Route Sequence</span>
            </button>
          </div>
        </div>

        {/* Live Route Summary Bar Matching Page 9 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">{currentRoute.routeNumber} · Van Activity</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">{currentRoute.vanNumber}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Driver: {currentRoute.driverName}</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Delivery Progress</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              {currentRoute.deliveredDrops} / {currentRoute.totalDrops} Delivered
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Next drop in 350 meters</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Collected on Route</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">
              ₹{currentRoute.totalCollected.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">UPI 61% · cheque 24% · cash 15%</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Total Consignment Load</div>
            <div className="text-lg font-bold text-[#178582] mt-0.5">
              ₹{(currentRoute.totalOrderValue / 100000).toFixed(1)} Lakh
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">e-Way bills assigned</div>
          </div>
        </div>
      </header>

      {/* Main Content Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Route Stops List */}
        <div className="w-full lg:w-[380px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfcfd] flex flex-col max-h-[260px] lg:max-h-full">
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h2 className="text-[14px] font-bold text-gray-900">
              Delivery Stops ({currentRoute.drops.length})
            </h2>
            <span className="text-xs font-semibold text-[#178582] bg-[#178582]/10 px-2 py-0.5 rounded">
              Route 3 · 18 drops
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {currentRoute.drops.map((drop) => {
              const isSelected = drop.id === selectedDropId;
              return (
                <div
                  key={drop.id}
                  onClick={() => setSelectedDropId(drop.id)}
                  className={`p-3.5 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white border-2 border-[#178582] shadow-md ring-1 ring-[#178582]/20"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                        {drop.sequence}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">{drop.customerName}</h3>
                    </div>
                    {drop.status === "delivered" && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                        Delivered
                      </span>
                    )}
                    {drop.status === "in_transit" && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded uppercase">
                        Next Stop
                      </span>
                    )}
                    {drop.status === "pending" && (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">
                        Queued
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-2 pl-7">{drop.address}</p>

                  <div className="pl-7 flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>{drop.boxesCount} boxes · ₹{drop.invoiceAmount.toLocaleString("en-IN")}</span>
                    {drop.oldDues > 0 && (
                      <span className="text-amber-700">Old dues: ₹{drop.oldDues.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Stop Details & Proof of Delivery Console */}
        {currentDrop ? (
          <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
            
            {/* Stop Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{currentDrop.customerName}</h2>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
                    {currentDrop.customerCode}
                  </span>
                  <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                    Invoice #{currentDrop.invoiceNo}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {currentDrop.address} · Contact: {currentDrop.contactPerson} ({currentDrop.phone})
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast(`Turn-by-turn navigation launched for ${currentDrop.address}`, "info");
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#178582]" />
                  <span>Navigate</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Dialing ${currentDrop.contactPerson} (${currentDrop.phone})...`, "info");
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Chemist</span>
                </button>
              </div>
            </div>

            {/* Stop Actions Workspace Matching Page 9 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Consignment Packages Card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Packages to Deliver
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-800 text-lg">
                      {currentDrop.boxesCount}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">
                        {currentDrop.boxesCount} Sealed Warehouse Cartons
                      </div>
                      <div className="text-xs text-gray-500">
                        Invoice Total: <strong className="text-gray-900">₹{currentDrop.invoiceAmount.toLocaleString("en-IN")}</strong> · Terms: {currentDrop.paymentMode}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    e-Way Bill &amp; Tax Invoice Inside Box #1
                  </div>
                </div>
              </div>

              {/* Proof of Delivery (POD) Section */}
              <div className="border border-gray-200 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-900">
                    Proof of Delivery (Mandatory for Closed Loop Dispatch)
                  </h3>
                  <button
                    onClick={() => setShowPodModal(true)}
                    className="text-xs font-bold text-[#178582] hover:underline cursor-pointer"
                  >
                    Open POD Verification &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${currentDrop.podStatus.otpVerified ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <CheckCircle2 className={`w-5 h-5 ${currentDrop.podStatus.otpVerified ? "text-emerald-600" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold">Chemist OTP</div>
                      <div className="text-[11px] text-gray-500">{currentDrop.podStatus.otpVerified ? "Verified (OTP #4092)" : "SMS sent to phone"}</div>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${currentDrop.podStatus.photoTaken ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <Camera className={`w-5 h-5 ${currentDrop.podStatus.photoTaken ? "text-emerald-600" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold">Storefront / Box Photo</div>
                      <div className="text-[11px] text-gray-500">{currentDrop.podStatus.photoTaken ? "Geo-tagged photo saved" : "Tap to capture photo"}</div>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-lg border flex items-center gap-3 ${currentDrop.podStatus.signatureObtained ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                    <Signature className={`w-5 h-5 ${currentDrop.podStatus.signatureObtained ? "text-emerald-600" : "text-gray-400"}`} />
                    <div>
                      <div className="font-bold">Digital Signature</div>
                      <div className="text-[11px] text-gray-500">{currentDrop.podStatus.signatureObtained ? "Pharmacist signed ✓" : "Optional / on glass"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Receivables Collection Card */}
              {currentDrop.oldDues > 0 && (
                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-amber-800">Payment Collection</span>
                    <div className="text-base font-bold text-gray-900 mt-0.5">
                      Collect old dues: ₹{currentDrop.oldDues.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      UPI QR Code at doorstep, Account Cheque, or Cash accepted
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPaymentMethod("UPI QR");
                        setShowPaymentModal(true);
                      }}
                      className="px-3.5 py-2 bg-white border border-gray-300 rounded font-semibold text-xs text-gray-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <QrCode className="w-4 h-4 text-[#178582]" />
                      <span>UPI QR</span>
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("Cheque");
                        setShowPaymentModal(true);
                      }}
                      className="px-3.5 py-2 bg-white border border-gray-300 rounded font-semibold text-xs text-gray-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span>Cheque</span>
                    </button>
                    <button
                      onClick={() => {
                        setPaymentMethod("Cash");
                        setShowPaymentModal(true);
                      }}
                      className="px-3.5 py-2 bg-white border border-gray-300 rounded font-semibold text-xs text-gray-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <span>Cash</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Return Pick-Up Card */}
              {currentDrop.returnPickUp && (
                <div className="border border-gray-200 rounded-xl p-5 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xs">
                        Pick up returns: {currentDrop.returnPickUp.itemsCount} (Expiry Stock)
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {currentDrop.returnPickUp.reason} · Verified against sales ledger
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast("Return bag sealed & linked to Chemist Credit Note.", "success");
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                  >
                    Confirm Return Pick-up
                  </button>
                </div>
              )}

            </div>

            {/* Bottom Action Drawer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                Drop Sequence: Stop #{currentDrop.sequence} of {currentRoute.totalDrops} on {currentRoute.routeNumber}
              </span>

              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    showToast("Marked as Chemist Shop Closed / Rescheduled for Afternoon Wave.", "warning");
                  }}
                  className="px-3.5 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-white cursor-pointer"
                >
                  Mark Unreachable / Retry
                </button>
                <button
                  onClick={handleCompletePod}
                  className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Delivery &amp; Move to Next Stop</span>
                </button>
              </div>
            </div>

          </div>
        ) : null}

      </div>

      {/* POD VERIFICATION MODAL */}
      {showPodModal && currentDrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Proof of Delivery (POD)</h3>
                <p className="text-xs text-gray-500">Capture chemist authentication for {currentDrop.customerName}</p>
              </div>
              <button onClick={() => setShowPodModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Enter 4-Digit OTP from Chemist SMS:
                </label>
                <input
                  type="text"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  maxLength={4}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Storefront Photo Upload:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Photo Attached
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Digital Stylus Signature:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Signed on Screen
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowPodModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompletePod}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Verify &amp; Seal POD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && currentDrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Collect Outstanding Dues</h3>
                <p className="text-xs text-gray-500">Doorstep payment collection for {currentDrop.customerName}</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["UPI QR", "Cheque", "Cash"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`p-2 border rounded-md font-semibold text-center cursor-pointer transition-colors ${
                        paymentMethod === m ? "bg-[#178582] text-white border-[#178582]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Amount to Collect (₹)</label>
                <input
                  type="text"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full font-mono font-bold text-base border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              {paymentMethod === "UPI QR" && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center flex flex-col items-center justify-center">
                  <div className="w-28 h-28 bg-white border border-gray-300 rounded-lg flex items-center justify-center mb-2">
                    <QrCode className="w-20 h-20 text-gray-900" />
                  </div>
                  <span className="text-[11px] text-gray-600 font-medium">Dynamic UPI QR generated for ₹{paymentAmount}</span>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordCollection}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Record Receipt &amp; WhatsApp SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAY-END SETTLEMENT MODAL */}
      {showDayEndModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Day-End Cash &amp; Van Settlement</h3>
                <p className="text-xs text-gray-500">Cash desk reconciliation for Driver: {currentRoute.driverName}</p>
              </div>
              <button onClick={() => setShowDayEndModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Route Collections:</span>
                  <span className="font-bold font-mono">₹{currentRoute.totalCollected.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Instant UPI QR (Direct Bank):</span>
                  <span className="font-bold font-mono">₹{currentRoute.upiCollected.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Physical Cheques:</span>
                  <span className="font-bold font-mono">₹{currentRoute.chequeCollected.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-gray-200 text-sm font-bold text-gray-900">
                  <span>Physical Cash to Handover:</span>
                  <span className="font-mono text-[#178582]">₹{currentRoute.cashCollected.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Cashier Handover Acknowledgment:</label>
                <input
                  type="text"
                  defaultValue="Cashier: Deepa S. · Cash drawer matched"
                  className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900 font-medium text-xs focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowDayEndModal(false)}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDayEndModal(false);
                  showToast("Day-end cash collection settled with accounts ledger.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Settle &amp; Close Route
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
