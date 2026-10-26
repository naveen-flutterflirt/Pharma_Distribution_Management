"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  FileCheck2,
  CreditCard,
  Building,
  Plus,
  Send,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Phone,
  Calendar,
  Lock,
  Download,
  Share2,
  ExternalLink,
  TrendingUp,
  Receipt
} from "lucide-react";

interface CustomerRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  grade: "Grade A" | "Grade B" | "Grade C";
  route: string;
  salesman: string;
  gstin: string;
  gstinVerified: boolean;
  dlNumber: string;
  dlValidTo: string;
  pharmacistOnRecord: boolean;
  appUserSince: number;
  creditLimit: number;
  creditUsed: number;
  termsDays: number;
  oldestDueDays: number;
  avgDaysToPay: number;
  chequeBounces12m: number;
  status: "active" | "blocked" | "warning";
  blockReason?: string;
  monthlyAveragePurchase: number;
  growthVsLastHalfYear: number;
  topProducts: Array<{ name: string; amountPerMonth: number }>;
  notBuyingLately?: { product: string; lastOrderDaysAgo: number };
  openInvoices: Array<{ invoiceNo: string; date: string; amount: number; dueDate: string }>;
  documents: Array<{ name: string; status: string; expiry?: string }>;
  returnsAndNotes: Array<{ date: string; amount: number; noteNo: string; type: string }>;
  salesmanTip?: string;
}

const SAMPLE_CUSTOMERS: CustomerRecord[] = [
  {
    id: "c-1",
    code: "C-2041",
    name: "Sri Sai Medicals",
    type: "Retail chemist",
    grade: "Grade A",
    route: "Route 3",
    salesman: "Ravi",
    gstin: "29AABCU9603R1ZM",
    gstinVerified: true,
    dlNumber: "DL 20B/21B valid to 2028",
    dlValidTo: "Mar-2028",
    pharmacistOnRecord: true,
    appUserSince: 2025,
    creditLimit: 300000,
    creditUsed: 184200,
    termsDays: 30,
    oldestDueDays: 22,
    avgDaysToPay: 24,
    chequeBounces12m: 0,
    status: "active",
    monthlyAveragePurchase: 480000,
    growthVsLastHalfYear: 14,
    topProducts: [
      { name: "Pantoprazole 40", amountPerMonth: 38000 },
      { name: "Metformin 500 SR", amountPerMonth: 31000 },
      { name: "Amox-Clav 625", amountPerMonth: 27000 }
    ],
    notBuyingLately: {
      product: "Telmisartan 40",
      lastOrderDaysAgo: 74
    },
    openInvoices: [
      { invoiceNo: "INV-25-48812", date: "16 Sep", amount: 58240, dueDate: "16 Oct" },
      { invoiceNo: "INV-25-49530", date: "24 Sep", amount: 71900, dueDate: "24 Oct" },
      { invoiceNo: "INV-25-50115", date: "2 Oct", amount: 54060, dueDate: "1 Nov" }
    ],
    documents: [
      { name: "Drug licence 20B", status: "Mar-2028" },
      { name: "Drug licence 21B", status: "Mar-2028" },
      { name: "GST registration", status: "Verified" },
      { name: "PAN", status: "Verified" },
      { name: "Security cheque", status: "On file" }
    ],
    returnsAndNotes: [
      { date: "2 Oct", amount: 4120, noteNo: "CN-1182", type: "Expiry return" },
      { date: "18 Sep", amount: 640, noteNo: "CN-1104", type: "Breakage" }
    ],
    salesmanTip: "Eligible for Principal C quarterly scheme — ₹12K more purchase unlocks 3% extra discount."
  },
  {
    id: "c-2",
    code: "C-1980",
    name: "City Care Pharmacy",
    type: "Retail chemist",
    grade: "Grade A",
    route: "Route 1",
    salesman: "Suresh",
    gstin: "29AABCU4412K1Z9",
    gstinVerified: true,
    dlNumber: "DL 20B/21B valid to 2027",
    dlValidTo: "Jun-2027",
    pharmacistOnRecord: true,
    appUserSince: 2024,
    creditLimit: 250000,
    creditUsed: 112000,
    termsDays: 21,
    oldestDueDays: 15,
    avgDaysToPay: 18,
    chequeBounces12m: 0,
    status: "active",
    monthlyAveragePurchase: 320000,
    growthVsLastHalfYear: 8,
    topProducts: [
      { name: "Paracetamol 650", amountPerMonth: 42000 },
      { name: "Atorvastatin 10", amountPerMonth: 29000 }
    ],
    openInvoices: [
      { invoiceNo: "INV-25-49912", date: "28 Sep", amount: 42100, dueDate: "19 Oct" }
    ],
    documents: [
      { name: "Drug licence 20B", status: "Jun-2027" },
      { name: "GST registration", status: "Verified" }
    ],
    returnsAndNotes: []
  },
  {
    id: "c-3",
    code: "C-1102",
    name: "New Life Chemists",
    type: "Retail chemist",
    grade: "Grade C",
    route: "Route 2",
    salesman: "Mahesh",
    gstin: "29AABCZ5512B1ZX",
    gstinVerified: true,
    dlNumber: "DL 20B/21B valid to 2026",
    dlValidTo: "Dec-2026",
    pharmacistOnRecord: true,
    appUserSince: 2025,
    creditLimit: 150000,
    creditUsed: 178000,
    termsDays: 30,
    oldestDueDays: 54,
    avgDaysToPay: 52,
    chequeBounces12m: 1,
    status: "blocked",
    blockReason: "Credit limit exceeded and Invoice INV-25-47219 is 54 days overdue (>45 days rule).",
    monthlyAveragePurchase: 180000,
    growthVsLastHalfYear: -6,
    topProducts: [
      { name: "Rabeprazole 20 + DSR", amountPerMonth: 22000 }
    ],
    openInvoices: [
      { invoiceNo: "INV-25-47219", date: "15 Aug", amount: 86400, dueDate: "14 Sep" }
    ],
    documents: [
      { name: "Drug licence 20B", status: "Dec-2026" },
      { name: "Security cheque", status: "On file" }
    ],
    returnsAndNotes: []
  }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(SAMPLE_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("c-1");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "blocked" | "warning">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & Popups
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.salesman.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "active") return c.status === "active";
      if (activeFilter === "blocked") return c.status === "blocked";
      if (activeFilter === "warning") return c.status === "warning";

      return true;
    });
  }, [customers, searchQuery, activeFilter]);

  const creditUsedPercent = useMemo(() => {
    if (!selectedCustomer) return 0;
    return Math.min(100, Math.round((selectedCustomer.creditUsed / selectedCustomer.creditLimit) * 100));
  }, [selectedCustomer]);

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

      {/* Main Layout Split Pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Customers Directory */}
        <div className="w-full lg:w-[340px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfcfd] flex flex-col max-h-[260px] lg:max-h-full">
          
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Customer 360
              </h1>
              <span className="text-xs font-semibold text-gray-400">
                {customers.length} Accounts
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Chemist, Code, Route..."
                className="pl-8 pr-3 py-1.5 w-full rounded-md border border-gray-200 text-xs focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>

            <div className="flex space-x-1 bg-gray-100 p-0.5 rounded-md">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer transition-all ${
                  activeFilter === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer transition-all ${
                  activeFilter === "active" ? "bg-white text-emerald-800 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter("blocked")}
                className={`flex-1 py-1 text-[11px] font-semibold rounded cursor-pointer transition-all ${
                  activeFilter === "blocked" ? "bg-white text-red-800 shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Blocked
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredCustomers.map((c) => {
              const isSelected = c.id === selectedCustomerId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomerId(c.id)}
                  className={`p-3 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white border-2 border-[#178582] shadow-sm ring-1 ring-[#178582]/20"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-xs">{c.name}</h3>
                    {c.status === "active" && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                        {c.grade}
                      </span>
                    )}
                    {c.status === "blocked" && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500 mb-1.5">
                    {c.code} · {c.route} ({c.salesman})
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">Used: ₹{(c.creditUsed / 1000).toFixed(0)}K</span>
                    <span className="font-semibold text-gray-800">Limit: ₹{(c.creditLimit / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Customer 360 Workspace Matching Page 7 */}
        {selectedCustomer ? (
          <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
            
            {/* Top Customer Banner */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#178582]/10 text-[#178582] flex items-center justify-center font-bold text-base border border-[#178582]/20 shrink-0">
                  {selectedCustomer.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                      {selectedCustomer.name}
                    </h2>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active · {selectedCustomer.grade}
                    </span>
                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                      {selectedCustomer.route} · {selectedCustomer.salesman}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>{selectedCustomer.type}</span>
                    <span>·</span>
                    <span className="font-mono">Customer {selectedCustomer.code}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">GSTIN ✓</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">Drug licence 20B/21B ✓ to {selectedCustomer.dlValidTo}</span>
                    <span>·</span>
                    <span>Pharmacist on record ✓</span>
                    <span>·</span>
                    <span>App user since {selectedCustomer.appUserSince}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/collections"
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-xs"
                >
                  Record Payment →
                </Link>
                <button
                  onClick={() => setShowLedgerModal(true)}
                  className="px-3.5 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  Ledger
                </button>
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="px-3.5 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  Send reminder
                </button>
                <Link
                  href="/order-desk"
                  className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>New order →</span>
                </Link>
              </div>
            </div>

            {/* Main Multi-Column Content Area */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Row 1: Credit Profile, Purchases Trend, Documents */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Credit Profile & Rules */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Credit</h3>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Limit:</span>
                        <span className="font-bold text-gray-900 font-mono">₹{selectedCustomer.creditLimit.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Used:</span>
                        <span className="font-bold text-gray-900 font-mono">₹{selectedCustomer.creditUsed.toLocaleString("en-IN")}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden my-2">
                        <div 
                          className={`h-full rounded-full ${creditUsedPercent > 85 ? "bg-red-500" : "bg-[#178582]"}`}
                          style={{ width: `${creditUsedPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between pt-1">
                        <span className="text-gray-500">Terms:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.termsDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Oldest due:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.oldestDueDays} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg days to pay:</span>
                        <span className="font-medium text-gray-900">{selectedCustomer.avgDaysToPay}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cheque bounces (12 m):</span>
                        <span className="font-medium text-gray-900 font-mono">{selectedCustomer.chequeBounces12m}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200/80">
                    <strong className="text-gray-800">Credit rules enforced:</strong> Block new orders if limit exceeded, any bill &gt; 45 days, or 2 bounced cheques. Soft warning at 85% of limit.
                  </div>
                </div>

                {/* Purchases — Last 6 Months & Top Products */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Purchases — last 6 months</h3>
                    <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
                      <span>Avg ₹{(selectedCustomer.monthlyAveragePurchase / 100000).toFixed(1)}L / month</span>
                      <span className="text-emerald-700 font-bold flex items-center">
                        ▲ {selectedCustomer.growthVsLastHalfYear}% vs last half-year
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-800 mb-2">Top products bought:</h4>
                    <div className="space-y-2 text-xs">
                      {selectedCustomer.topProducts.map((prod, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">{prod.name}</span>
                          <span className="font-mono font-bold text-gray-900">
                            ₹{(prod.amountPerMonth / 1000).toFixed(0)}K / m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedCustomer.notBuyingLately && (
                    <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <strong>Not buying from you lately:</strong> {selectedCustomer.notBuyingLately.product} — last order {selectedCustomer.notBuyingLately.lastOrderDaysAgo} days ago.
                    </div>
                  )}
                </div>

                {/* Documents & Compliance Register */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Documents</h3>
                    <div className="space-y-2.5 text-xs">
                      {selectedCustomer.documents.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                          <span className="text-gray-600 font-medium">{doc.name}</span>
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                    * Automated Drug Authority licence verification synced with FDA Portal.
                  </div>
                </div>

              </div>

              {/* Row 2: Open Invoices, Returns & Notes, Salesman Tip */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Open Invoices Table */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900">Open Invoices</h3>
                    <span className="text-xs font-semibold text-gray-400">
                      Total Due: ₹{selectedCustomer.openInvoices.reduce((a, b) => a + b.amount, 0).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] text-xs text-left">
                      <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase text-[10px]">
                        <th className="pb-2">Invoice #</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2 text-right">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {selectedCustomer.openInvoices.map((inv, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2.5 font-bold font-mono text-gray-900">{inv.invoiceNo}</td>
                          <td className="py-2.5 text-gray-600">{inv.date}</td>
                          <td className="py-2.5 font-bold font-mono text-gray-900">₹{inv.amount.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 text-right font-semibold text-emerald-800">{inv.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>

                {/* Returns & Notes + Salesman Tip */}
                <div className="space-y-4">
                  
                  {/* Returns & Notes */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                      Returns &amp; Credit Notes
                    </h3>
                    {selectedCustomer.returnsAndNotes.length === 0 ? (
                      <p className="text-xs text-gray-400">Zero active credit notes on file.</p>
                    ) : (
                      <div className="space-y-2 text-xs">
                        {selectedCustomer.returnsAndNotes.map((rn, idx) => (
                          <div key={idx} className="p-2 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-800">{rn.type} · {rn.date}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{rn.noteNo}</div>
                            </div>
                            <span className="font-bold text-gray-900 font-mono">
                              ₹{rn.amount.toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Salesman Tip */}
                  {selectedCustomer.salesmanTip && (
                    <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Salesman Tip for {selectedCustomer.salesman}:</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {selectedCustomer.salesmanTip}
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        ) : null}

      </div>

      {/* LEDGER MODAL */}
      {showLedgerModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Customer Financial Ledger — {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  GST compliant double-entry statement for Customer {selectedCustomer.code}
                </p>
              </div>
              <button onClick={() => setShowLedgerModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div>
                  <span className="text-gray-400 text-[10px]">Opening Balance</span>
                  <div className="font-bold text-gray-900 font-mono">₹0.00</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px]">Debits (Sales)</span>
                  <div className="font-bold text-gray-900 font-mono">₹1,84,200.00</div>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px]">Net Balance Due</span>
                  <div className="font-bold text-[#178582] font-mono">₹1,84,200.00</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full min-w-[420px] text-left">
                  <thead className="bg-gray-100 text-gray-500 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Voucher Ref</th>
                      <th className="py-2 px-3">Debit (₹)</th>
                      <th className="py-2 px-3 text-right">Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {selectedCustomer.openInvoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 px-3">{inv.date}</td>
                        <td className="py-2 px-3 font-mono font-bold text-gray-900">{inv.invoiceNo}</td>
                        <td className="py-2 px-3 font-mono">₹{inv.amount.toLocaleString("en-IN")}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">₹{inv.amount.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowLedgerModal(false);
                  showToast("Statement PDF exported for WhatsApp dispatch.", "success");
                }}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-600" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => setShowLedgerModal(false)}
                className="px-4 py-2 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND PAYMENT REMINDER MODAL */}
      {showReminderModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Send Payment Reminder</h3>
                <p className="text-xs text-gray-500">Automated WhatsApp &amp; SMS notice for {selectedCustomer.name}</p>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 leading-relaxed font-sans">
                &ldquo;Dear Sri Sai Medicals, this is a reminder from [Distributor] DMS regarding pending invoices totaling <strong>₹1,84,200</strong> due within 8 days. Click here to pay instantly via UPI: [Pay Link]&rdquo;
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Select Channel:</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                  <option className="text-gray-900 bg-white">WhatsApp Business API (Instant Delivery)</option>
                  <option className="text-gray-900 bg-white">SMS DLT Gateway</option>
                  <option className="text-gray-900 bg-white">Salesman App Task for Ravi</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowReminderModal(false);
                  showToast(`Payment reminder dispatched to ${selectedCustomer.name} via WhatsApp.`, "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Dispatch Reminder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
