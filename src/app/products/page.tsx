"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Search,
  Filter,
  Download,
  ShoppingCart,
  AlertTriangle,
  Snowflake,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Info
} from "lucide-react";

interface ProductRecord {
  id: string;
  name: string;
  principal: string;
  pack: string;
  stock: number;
  avgDay: number;
  daysCover: number;
  batches: Array<{
    batchNo: string;
    qty: number;
    exp: string;
    tag?: "push" | "overstock" | "quarantine";
  }>;
  scheme: string;
  suggestedPo: number | string;
  coldChain?: boolean;
  scheduleH?: boolean;
  mrp: number;
  ptr: number;
  pts: number;
  binLocation: string;
}

const PRODUCTS_DATA: ProductRecord[] = [
  {
    id: "p-1",
    name: "Insulin glargine pen",
    principal: "Principal A",
    pack: "1 pen",
    stock: 0,
    avgDay: 22,
    daysCover: 0,
    batches: [],
    scheme: "—",
    suggestedPo: 300,
    coldChain: true,
    mrp: 750.00,
    ptr: 612.00,
    pts: 550.80,
    binLocation: "Cold Room 02 · Rack CR-1"
  },
  {
    id: "p-2",
    name: "Amoxicillin + Clav 625",
    principal: "Principal B",
    pack: "10 tab",
    stock: 120,
    avgDay: 95,
    daysCover: 1.3,
    batches: [
      { batchNo: "AC2408", qty: 120, exp: "03/27" }
    ],
    scheme: "10+1",
    suggestedPo: 1650,
    mrp: 204.00,
    ptr: 162.40,
    pts: 146.16,
    binLocation: "Aisle C · Rack 04 · Bin 2"
  },
  {
    id: "p-3",
    name: "Pantoprazole 40",
    principal: "Principal C",
    pack: "15 tab",
    stock: 300,
    avgDay: 140,
    daysCover: 2.1,
    batches: [
      { batchNo: "PN2502", qty: 300, exp: "06/27" }
    ],
    scheme: "10+1",
    suggestedPo: 2200,
    mrp: 125.00,
    ptr: 98.10,
    pts: 88.29,
    binLocation: "Aisle B · Rack 01 · Bin 4"
  },
  {
    id: "p-4",
    name: "Azithromycin 500",
    principal: "Principal A",
    pack: "3 tab",
    stock: 1420,
    avgDay: 60,
    daysCover: 23.7,
    batches: [
      { batchNo: "AZ2412", qty: 220, exp: "12/26", tag: "push" },
      { batchNo: "AZ2508", qty: 1200, exp: "08/27" }
    ],
    scheme: "10+1",
    suggestedPo: "—",
    mrp: 95.00,
    ptr: 74.60,
    pts: 67.14,
    binLocation: "Aisle A · Rack 03 · Bin 1"
  },
  {
    id: "p-5",
    name: "Vitamin D3 60K",
    principal: "Principal A",
    pack: "4 cap",
    stock: 2900,
    avgDay: 18,
    daysCover: 161.0,
    batches: [
      { batchNo: "VD2502", qty: 2900, exp: "02/27", tag: "overstock" }
    ],
    scheme: "—",
    suggestedPo: "—",
    mrp: 140.00,
    ptr: 110.00,
    pts: 99.00,
    binLocation: "Aisle D · Rack 02 · Bin 3"
  },
  {
    id: "p-6",
    name: "Cough syrup 100 ml",
    principal: "Principal D",
    pack: "1 btl",
    stock: 640,
    avgDay: 35,
    daysCover: 18.3,
    batches: [
      { batchNo: "CS2501", qty: 640, exp: "01/27" }
    ],
    scheme: "12+2",
    suggestedPo: "—",
    scheduleH: true,
    mrp: 115.00,
    ptr: 89.50,
    pts: 80.55,
    binLocation: "Aisle E · Rack 01 · Bin 2"
  }
];

export default function ProductsPage() {
  const [selectedPrincipal, setSelectedPrincipal] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "low-stock" | "near-expiry" | "overstock">("all");
  
  // Modals & Toasts
  const [showPoModal, setShowPoModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info">("info");

  const showToast = (msg: string, type: "success" | "info" = "info") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const principalsList = ["All", "Principal A", "Principal B", "Principal C", "Principal D"];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      if (selectedPrincipal !== "All" && p.principal !== selectedPrincipal) return false;

      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pack.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batches.some(b => b.batchNo.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeTab === "low-stock") return p.daysCover <= 3;
      if (activeTab === "near-expiry") return p.batches.some(b => b.tag === "push");
      if (activeTab === "overstock") return p.daysCover > 45 || p.batches.some(b => b.tag === "overstock");

      return true;
    });
  }, [selectedPrincipal, searchQuery, activeTab]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8f9] overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`absolute top-4 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-xs font-semibold transition-all transform animate-in slide-in-from-top-3 duration-200 ${
            toastType === "success" 
              ? "bg-emerald-900 text-white border-emerald-700" 
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          {toastType === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Products &amp; Stock
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              6,420 products · 112 principals · stock value <strong className="text-gray-800">₹4.92 Cr</strong> at PTS
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter: Principal Dropdown */}
            <div className="relative">
              <select
                value={selectedPrincipal}
                onChange={(e) => setSelectedPrincipal(e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-md text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#178582] transition-colors cursor-pointer shadow-xs appearance-none"
              >
                {principalsList.map((p) => (
                  <option key={p} value={p} className="text-gray-900 bg-white">
                    {p === "All" ? "Filter: All Principals" : `Filter: ${p}`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-md text-sm hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
            >
              Export
            </button>

            {/* Suggest Purchase Order Button */}
            <button
              onClick={() => setShowPoModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white font-semibold rounded-md text-sm hover:bg-[#126b68] transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Suggest purchase order</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-5 pt-5 border-t border-gray-100">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Formulations
            </button>
            <button
              onClick={() => setActiveTab("low-stock")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "low-stock" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Low Cover (&lt;3 days)
            </button>
            <button
              onClick={() => setActiveTab("near-expiry")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "near-expiry" ? "bg-white text-amber-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Push / Short-Dated
            </button>
            <button
              onClick={() => setActiveTab("overstock")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "overstock" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Overstocked
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product, pack, batch..."
              className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
        
        {/* Products Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Pack</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Avg/day</th>
                  <th className="py-3 px-4">Days cover</th>
                  <th className="py-3 px-4">Batches (qty · expiry)</th>
                  <th className="py-3 px-4">Scheme</th>
                  <th className="py-3 px-4 text-right">Suggested PO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                      No matching products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isZeroStock = p.stock === 0;
                    const isLowCover = p.daysCover <= 3;
                    
                    return (
                      <tr 
                        key={p.id} 
                        onClick={() => setSelectedProduct(p)}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      >
                        {/* Product Name & Flags */}
                        <td className="py-3.5 px-4 font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{p.name}</span>
                            {p.coldChain && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                <Snowflake className="w-2.5 h-2.5" /> Cold
                              </span>
                            )}
                            {p.scheduleH && (
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                                Rx · H
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                            {p.principal} · {p.binLocation}
                          </div>
                        </td>

                        {/* Pack */}
                        <td className="py-3.5 px-4 text-gray-600 font-medium">
                          {p.pack}
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4 font-bold font-mono">
                          <span className={isZeroStock ? "text-red-600 bg-red-50 px-2 py-0.5 rounded" : "text-gray-900"}>
                            {p.stock.toLocaleString("en-IN")}
                          </span>
                        </td>

                        {/* Avg/day */}
                        <td className="py-3.5 px-4 font-mono text-gray-700">
                          {p.avgDay}
                        </td>

                        {/* Days cover */}
                        <td className="py-3.5 px-4 font-bold font-mono">
                          <span className={
                            p.daysCover === 0 
                              ? "text-red-600" 
                              : p.daysCover <= 2.5 
                              ? "text-amber-600" 
                              : "text-emerald-700"
                          }>
                            {p.daysCover} d
                          </span>
                        </td>

                        {/* Batches (qty · expiry) */}
                        <td className="py-3.5 px-4 font-mono text-gray-700">
                          {p.batches.length === 0 ? (
                            <span className="text-gray-400">—</span>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              {p.batches.map((b, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1">
                                  <span>{b.qty.toLocaleString("en-IN")} · {b.exp}</span>
                                  {b.tag === "push" && (
                                    <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-1 py-0.2 rounded font-sans uppercase">
                                      push
                                    </span>
                                  )}
                                  {b.tag === "overstock" && (
                                    <span className="text-[10px] font-bold bg-gray-200 text-gray-800 px-1 py-0.2 rounded font-sans uppercase">
                                      overstock
                                    </span>
                                  )}
                                  {idx < p.batches.length - 1 && <span className="text-gray-300">·</span>}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Scheme */}
                        <td className="py-3.5 px-4 font-semibold text-emerald-800">
                          {p.scheme}
                        </td>

                        {/* Suggested PO */}
                        <td className="py-3.5 px-4 text-right font-bold font-mono text-gray-900">
                          {p.suggestedPo !== "—" ? (
                            <span className="text-[#178582] bg-[#178582]/10 px-2 py-0.5 rounded">
                              {Number(p.suggestedPo).toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span className="text-gray-400 font-normal">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Formula Footnote */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>
              Suggested PO = (forecast × lead time + safety stock − stock − open PO), rounded to the principal&apos;s case size and adjusted so the order qualifies for the current scheme slab.
            </span>
          </div>
        </div>

        {/* Lower Two Panels: Action Board & Stock Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Near-Expiry Action Board */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-bold text-gray-900">
                  Near-expiry action board · next 6 months
                </h2>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Total Exposure: ₹26.6L
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2">Bucket</th>
                      <th className="pb-2">Value</th>
                      <th className="pb-2 text-right">Action Recommended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-bold text-red-600">Expired (in stock)</td>
                      <td className="py-2.5 font-mono font-bold text-gray-900">₹1.1L</td>
                      <td className="py-2.5 text-right">
                        <button 
                          onClick={() => showToast("Quarantine initiated. Expiry debit note generated for Principal.", "success")}
                          className="text-[#178582] hover:text-[#126b68] font-semibold hover:underline cursor-pointer"
                        >
                          Quarantine · raise expiry claim to principal →
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-bold text-amber-600">0–3 months</td>
                      <td className="py-2.5 font-mono font-bold text-gray-900">₹8.4L</td>
                      <td className="py-2.5 text-right">
                        <button 
                          onClick={() => showToast("Institutional priority allocation sheet prepared for hospitals.", "info")}
                          className="text-[#178582] hover:text-[#126b68] font-semibold hover:underline cursor-pointer"
                        >
                          Return within principal&apos;s window · offer to hospitals →
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-bold text-gray-800">3–6 months</td>
                      <td className="py-2.5 font-mono font-bold text-gray-900">₹14.9L</td>
                      <td className="py-2.5 text-right">
                        <button 
                          onClick={() => showToast("Push campaign with +2% incentive pushed to Salesman App beats.", "success")}
                          className="text-[#178582] hover:text-[#126b68] font-semibold hover:underline cursor-pointer"
                        >
                          Push via salesman app, small scheme, transfer to branch →
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="py-2.5 font-bold text-gray-800">Chemist returns waiting</td>
                      <td className="py-2.5 font-mono font-bold text-gray-900">₹2.2L</td>
                      <td className="py-2.5 text-right">
                        <button 
                          onClick={() => showToast("Credit note verification module opened.", "info")}
                          className="text-[#178582] hover:text-[#126b68] font-semibold hover:underline cursor-pointer"
                        >
                          Verify, credit note, add to principal claim →
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>Expiry alerts auto-synchronize with WhatsApp salesman briefings daily at 8:00 AM.</span>
            </div>
          </div>

          {/* Stock Rules Enforced */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#178582]" />
                <span>Stock rules enforced by system</span>
              </h2>

              <ul className="space-y-2.5 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178582] mt-1.5 shrink-0" />
                  <span><strong>Billing picks the earliest-expiry batch first (FEFO)</strong> — no manual batch overrides permitted without checker login.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178582] mt-1.5 shrink-0" />
                  <span><strong>Minimum shelf life on sale</strong> — system hard-blocks any batch under 90 days from billing to retail chemists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span><strong>Expired and recalled batches hard-blocked</strong> from inventory reservation across all order channels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span><strong>Cold-chain items flagged</strong> for insulated cold-box packing with validated ice-gel packs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178582] mt-1.5 shrink-0" />
                  <span><strong>Schedule H1 &amp; narcotics sales</strong> automatically logged in statutory drug registers with doctor details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#178582] mt-1.5 shrink-0" />
                  <span><strong>Multiple warehouses / branches</strong> supported with tracked Inter-Stock Transfers (IST).</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Complies with Drugs &amp; Cosmetics Act Rule 65 &amp; Good Distribution Practice (GDP).</span>
            </div>
          </div>

        </div>

      </div>

      {/* SUGGEST PURCHASE ORDER MODAL */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Automated Purchase Order Recommendations
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Calculated against lead times, buffer covers, and scheme qualifiers
                </p>
              </div>
              <button onClick={() => setShowPoModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <div>
                  <span className="text-gray-500">Selected Principal:</span>
                  <div className="font-bold text-gray-900 text-sm">{selectedPrincipal === "All" ? "Principal B (Priority)" : selectedPrincipal}</div>
                </div>
                <div className="text-right">
                  <span className="text-gray-500">Scheme Slab Qualifier:</span>
                  <div className="font-bold text-emerald-700">100+10 Free (Eligible)</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-100/70 text-gray-500 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Stock</th>
                      <th className="py-2 px-3">Run-rate</th>
                      <th className="py-2 px-3 text-right">Recommended PO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="py-2 px-3 font-semibold text-gray-900">Amoxicillin + Clav 625</td>
                      <td className="py-2 px-3 font-mono text-red-600">120 (1.3d)</td>
                      <td className="py-2 px-3 font-mono">95/day</td>
                      <td className="py-2 px-3 text-right font-bold text-[#178582] font-mono">1,650 strips</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-gray-900">Pantoprazole 40</td>
                      <td className="py-2 px-3 font-mono text-amber-600">300 (2.1d)</td>
                      <td className="py-2 px-3 font-mono">140/day</td>
                      <td className="py-2 px-3 text-right font-bold text-[#178582] font-mono">2,200 strips</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold text-gray-900">Insulin glargine pen</td>
                      <td className="py-2 px-3 font-mono text-red-600">0 (0d)</td>
                      <td className="py-2 px-3 font-mono">22/day</td>
                      <td className="py-2 px-3 text-right font-bold text-[#178582] font-mono">300 pens</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-xs p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-900">
                <span>Estimated PO Value (PTS): <strong className="text-gray-900">₹4,85,250</strong></span>
                <span className="font-semibold text-emerald-800">Earns ₹48,500 in Free Goods</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowPoModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPoModal(false);
                  showToast("Purchase Order PO-2026-9041 raised and transmitted to Principal portal via EDI.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Create &amp; Transmit PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT DATA MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-gray-200">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Export Stock &amp; Batch Register
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Select format for 6,420 SKUs with FEFO expiry and warehouse bin locations.
            </p>

            <div className="space-y-2 mb-5 text-xs">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  showToast("Excel Stock Register with FEFO batches downloaded.", "success");
                }}
                className="w-full p-3 border border-gray-200 rounded-lg hover:border-[#178582] hover:bg-emerald-50/40 text-left font-semibold text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Microsoft Excel (.xlsx)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </button>

              <button
                onClick={() => {
                  setShowExportModal(false);
                  showToast("CSV raw stock file downloaded.", "success");
                }}
                className="w-full p-3 border border-gray-200 rounded-lg hover:border-[#178582] hover:bg-emerald-50/40 text-left font-semibold text-gray-800 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Standard CSV (.csv)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT BATCH REGISTER DRAWER / MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">{selectedProduct.name}</h3>
                  {selectedProduct.coldChain && (
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold">Cold</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedProduct.principal} · Pack: {selectedProduct.pack} · {selectedProduct.binLocation}
                </p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div>
                  <span className="text-gray-400 text-[10px]">MRP</span>
                  <div className="font-bold text-gray-900 font-mono">₹{selectedProduct.mrp.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px]">PTR (Sell)</span>
                  <div className="font-bold text-[#178582] font-mono">₹{selectedProduct.ptr.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px]">PTS (Cost)</span>
                  <div className="font-bold text-gray-700 font-mono">₹{selectedProduct.pts.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">Allocated FEFO Batches:</h4>
                {selectedProduct.batches.length === 0 ? (
                  <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 text-xs">
                    Stockout! Zero active batches currently in warehouse inventory.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedProduct.batches.map((b, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded border border-gray-200">
                        <div>
                          <span className="font-mono font-bold text-gray-900">{b.batchNo}</span>
                          <span className="text-gray-500 ml-2">Exp: {b.exp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {b.tag && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                              {b.tag}
                            </span>
                          )}
                          <span className="font-mono font-bold text-gray-900">{b.qty} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
