"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  IndianRupee,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  FileCheck2,
  Calendar,
  Building,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Printer,
  Download,
  Share2,
  RefreshCw,
  TrendingDown,
  UserCheck,
  FileText
} from "lucide-react";

interface CollectionRecord {
  id: string;
  receiptNo: string;
  customerName: string;
  customerCode: string;
  route: string;
  collectorName: string;
  collectorRole: "Salesman" | "Delivery Driver" | "Counter / Direct";
  amount: number;
  mode: "UPI QR" | "Cheque" | "Bank NEFT" | "Cash";
  referenceNo: string;
  date: string;
  time: string;
  allocatedInvoices: string[];
  reconciliationStatus: "Matched (Auto)" | "Pending Bank Clearance" | "Disputed";
  bankAccount: string;
}

const SAMPLE_COLLECTIONS: CollectionRecord[] = [
  {
    id: "col-1",
    receiptNo: "REC-25-8812",
    customerName: "Sri Sai Medicals",
    customerCode: "C-2041",
    route: "Route 3",
    collectorName: "Ramesh Kumar (Van Driver)",
    collectorRole: "Delivery Driver",
    amount: 24000,
    mode: "UPI QR",
    referenceNo: "UPI/261009184421/HDFC",
    date: "08 Oct 2026",
    time: "11:20 AM",
    allocatedInvoices: ["INV-25-48812"],
    reconciliationStatus: "Matched (Auto)",
    bankAccount: "HDFC Primary Current A/c (..8821)"
  },
  {
    id: "col-2",
    receiptNo: "REC-25-8811",
    customerName: "Janata Medical Store",
    customerCode: "C-1102",
    route: "Route 4",
    collectorName: "Ravi (Field Rep)",
    collectorRole: "Salesman",
    amount: 18400,
    mode: "Cheque",
    referenceNo: "CHQ #441920 (SBI)",
    date: "08 Oct 2026",
    time: "10:45 AM",
    allocatedInvoices: ["INV-25-48719"],
    reconciliationStatus: "Pending Bank Clearance",
    bankAccount: "ICICI Clearing A/c (..3109)"
  },
  {
    id: "col-3",
    receiptNo: "REC-25-8810",
    customerName: "Arogya Nursing Home",
    customerCode: "C-0840",
    route: "Hospital Direct",
    collectorName: "Accounts Portal (NEFT)",
    collectorRole: "Counter / Direct",
    amount: 52000,
    mode: "Bank NEFT",
    referenceNo: "UTR-CMS-901842019",
    date: "08 Oct 2026",
    time: "09:30 AM",
    allocatedInvoices: ["INV-25-48501", "INV-25-48612"],
    reconciliationStatus: "Matched (Auto)",
    bankAccount: "HDFC Primary Current A/c (..8821)"
  },
  {
    id: "col-4",
    receiptNo: "REC-25-8809",
    customerName: "City Care Pharmacy",
    customerCode: "C-1980",
    route: "Route 1",
    collectorName: "Suresh (Field Rep)",
    collectorRole: "Salesman",
    amount: 12500,
    mode: "Cash",
    referenceNo: "CASH-DESK-019",
    date: "08 Oct 2026",
    time: "09:15 AM",
    allocatedInvoices: ["INV-25-49102"],
    reconciliationStatus: "Matched (Auto)",
    bankAccount: "Cash Drawer 01"
  }
];

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionRecord[]>(SAMPLE_COLLECTIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "upi" | "cheque" | "neft" | "cash">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & New Receipt State
  const [showNewReceiptModal, setShowNewReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<CollectionRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchesSearch =
        c.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.collectorName.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "upi") return c.mode === "UPI QR";
      if (activeFilter === "cheque") return c.mode === "Cheque";
      if (activeFilter === "neft") return c.mode === "Bank NEFT";
      if (activeFilter === "cash") return c.mode === "Cash";

      return true;
    });
  }, [collections, searchQuery, activeFilter]);

  const totalCollectedToday = useMemo(() => {
    return collections.reduce((acc, curr) => acc + curr.amount, 0);
  }, [collections]);

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
                Collections &amp; Receivables Reconciliation
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Live Bank Feed Synced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Receipt posting, invoice-level allocations, automated bank reconciliation, and DSO management.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/delivery"
              className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              ← Van Deliveries
            </Link>
            <Link
              href="/customers"
              className="px-3 py-2 bg-teal-50 border border-teal-200 text-[#178582] rounded-md text-xs font-semibold hover:bg-teal-100 transition-colors"
            >
              Customer Ledgers →
            </Link>
            <button
              onClick={() => {
                showToast("Bank Statement API imported: 14 NEFT credits automatically reconciled with open invoices.", "success");
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#178582]" />
              <span>Auto-Match Bank Feeds</span>
            </button>
            <button
              onClick={() => setShowNewReceiptModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Record Receipt</span>
            </button>
          </div>
        </div>

        {/* Financial Metrics Strip Matching Pages 4 & 12 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Total Collected Today</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">₹4.70 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">UPI 61% · cheque 24% · cash 15%</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Total Outstanding Receivables</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">₹2.84 Cr</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">₹38L over 45 days</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Days Sales Outstanding (DSO)</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">24.6 Days</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Target: &le; 30 days</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Auto-Blocked for Overdue</div>
            <div className="text-lg font-bold text-red-600 mt-0.5">17 Accounts</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Enforcing credit rules strictly</div>
          </div>
        </div>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
        
        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Receipts ({collections.length})
            </button>
            <button
              onClick={() => setActiveFilter("upi")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "upi" ? "bg-white text-[#178582] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              UPI QR (Doorstep)
            </button>
            <button
              onClick={() => setActiveFilter("neft")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "neft" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Bank NEFT / RTGS
            </button>
            <button
              onClick={() => setActiveFilter("cheque")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "cheque" ? "bg-white text-amber-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cheques
            </button>
            <button
              onClick={() => setActiveFilter("cash")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "cash" ? "bg-white text-emerald-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cash Collections
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Receipt #, Chemist, Ref / UTR..."
              className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collections Ledger Grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-xs text-left">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Receipt # &amp; Date</th>
                  <th className="py-3 px-4">Chemist Account</th>
                  <th className="py-3 px-4">Amount Collected</th>
                  <th className="py-3 px-4">Payment Mode &amp; Ref</th>
                  <th className="py-3 px-4">Collected By</th>
                  <th className="py-3 px-4">Allocated Invoices</th>
                  <th className="py-3 px-4">Bank Reconciliation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredCollections.map((col) => (
                  <tr key={col.id} className="hover:bg-gray-50/80 transition-colors group">
                    
                    {/* Receipt No */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 font-mono text-sm">{col.receiptNo}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{col.date} · {col.time}</div>
                    </td>

                    {/* Chemist */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 text-[13px]">{col.customerName}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{col.customerCode} · {col.route}</div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-gray-900">
                      ₹{col.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Mode & Ref */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                        {col.mode === "UPI QR" && <QrCode className="w-3.5 h-3.5 text-[#178582]" />}
                        {col.mode === "Cheque" && <CreditCard className="w-3.5 h-3.5 text-amber-700" />}
                        {col.mode === "Bank NEFT" && <Building className="w-3.5 h-3.5 text-blue-600" />}
                        {col.mode === "Cash" && <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{col.mode}</span>
                      </div>
                      <div className="font-mono text-[11px] text-gray-500 mt-0.5">{col.referenceNo}</div>
                    </td>

                    {/* Collected By */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{col.collectorName}</div>
                      <div className="text-[11px] text-gray-400">{col.collectorRole}</div>
                    </td>

                    {/* Invoices */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {col.allocatedInvoices.map((inv, idx) => (
                          <span key={idx} className="font-mono text-[11px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {inv}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Reconciliation */}
                    <td className="py-3.5 px-4">
                      {col.reconciliationStatus === "Matched (Auto)" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" /> Bank Clearing
                        </span>
                      )}
                      <div className="text-[10px] text-gray-400 mt-0.5">{col.bankAccount}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReceipt(col)}
                          className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 cursor-pointer shadow-xs"
                          title="View Receipt Voucher"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            showToast(`Payment acknowledgment receipt dispatched to ${col.customerName} on WhatsApp.`, "success");
                          }}
                          className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-emerald-600 cursor-pointer shadow-xs"
                          title="Send WhatsApp Receipt"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RECORD RECEIPT MODAL */}
      {showNewReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Record Payment Receipt</h3>
                <p className="text-xs text-gray-500">Post collection &amp; allocate directly to unpaid open invoices</p>
              </div>
              <button onClick={() => setShowNewReceiptModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Select Chemist</label>
                <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                  <option className="text-gray-900 bg-white">Sri Sai Medicals · Route 3 (O/S: ₹1,84,200)</option>
                  <option className="text-gray-900 bg-white">City Care Pharmacy · Route 1 (O/S: ₹1,12,000)</option>
                  <option className="text-gray-900 bg-white">New Life Chemists · Route 2 (O/S: ₹1,78,000 - Blocked)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Amount Received (₹)</label>
                  <input
                    type="number"
                    defaultValue="58240"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-bold font-mono focus:ring-2 focus:ring-[#178582] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Payment Mode</label>
                  <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                    <option className="text-gray-900 bg-white">UPI QR (Instant)</option>
                    <option className="text-gray-900 bg-white">Cheque Deposit</option>
                    <option className="text-gray-900 bg-white">Bank NEFT / RTGS</option>
                    <option className="text-gray-900 bg-white">Cash at Counter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Transaction Ref / Cheque No / UTR</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-908122 or CHQ #40921"
                  defaultValue="UPI/261012998412/HDFC"
                  className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium font-mono focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Allocate to Open Invoices (FIFO Auto)</label>
                <div className="p-2.5 bg-emerald-50 rounded-md border border-emerald-200 text-emerald-900 font-medium flex justify-between items-center">
                  <span>INV-25-48812 (Due 16 Oct)</span>
                  <span className="font-bold font-mono">₹58,240 allocated</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowNewReceiptModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewReceiptModal(false);
                  showToast("Receipt posted! Customer ledger credited and Tally synced.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Post Receipt &amp; Credit Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT VOUCHER PREVIEW MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-gray-900">
                  Payment Receipt Voucher — {selectedReceipt.receiptNo}
                </h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-bold text-gray-900">{selectedReceipt.customerName} ({selectedReceipt.customerCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Received:</span>
                  <span className="font-bold text-emerald-700 text-sm font-mono">₹{selectedReceipt.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Channel:</span>
                  <span className="font-semibold text-gray-800">{selectedReceipt.mode} ({selectedReceipt.referenceNo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Collector:</span>
                  <span className="text-gray-800">{selectedReceipt.collectorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Deposit Bank:</span>
                  <span className="text-gray-800">{selectedReceipt.bankAccount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedReceipt(null);
                  showToast("Receipt thermal print dispatched.", "info");
                }}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-gray-600" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
