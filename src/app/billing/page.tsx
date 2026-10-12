"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
  Truck,
  ShieldCheck,
  ChevronRight,
  X,
  ExternalLink,
  Plus,
  RefreshCw,
  Copy,
  Check,
  FileSpreadsheet,
  FileDown,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  orderNo: string;
  customerName: string;
  customerCode: string;
  route: string;
  gstin: string;
  date: string;
  time: string;
  dueDate: string;
  linesCount: number;
  taxable: number;
  gstAmount: number;
  total: number;
  irn: string;
  ewayBill?: string;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  dispatchStatus: "Tray Assigned" | "Packed & Sealed" | "Out for Delivery" | "Delivered";
  trayId: string;
  items: Array<{
    name: string;
    hsn: string;
    batch: string;
    exp: string;
    qty: number;
    free: number | string;
    ptr: number;
    gst: number;
    total: number;
  }>;
}

const SAMPLE_INVOICES: InvoiceRecord[] = [
  {
    id: "inv-1",
    invoiceNo: "INV-25-50388",
    orderNo: "SO-2026-8812",
    customerName: "Sri Sai Medicals",
    customerCode: "C-2041",
    route: "Route 3 (Ravi)",
    gstin: "29AABCU9603R1ZM",
    date: "08 Oct 2026",
    time: "10:15 AM",
    dueDate: "07 Nov 2026",
    linesCount: 42,
    taxable: 55786,
    gstAmount: 6694,
    total: 62480,
    irn: "9e82c5a08fb6d81249b109b8201a48c20188ef4a919028b19d4e782a19283f01",
    ewayBill: "241098451290",
    paymentStatus: "Unpaid",
    dispatchStatus: "Tray Assigned",
    trayId: "Tray 14 · Bin C-04-2",
    items: [
      { name: "Amoxicillin + Clav 625 (10)", hsn: "30041010", batch: "AC2408", exp: "03/27", qty: 60, free: 6, ptr: 162.40, gst: 12, total: 9744.00 },
      { name: "Pantoprazole 40 (15)", hsn: "30049099", batch: "PN2502", exp: "06/27", qty: 100, free: 10, ptr: 98.10, gst: 12, total: 9810.00 },
      { name: "Metformin 500 SR (10)", hsn: "30049089", batch: "MF2511", exp: "11/27", qty: 200, free: "—", ptr: 21.30, gst: 12, total: 4174.80 },
      { name: "Insulin glargine pen", hsn: "30043110", batch: "IG2507", exp: "07/27", qty: 10, free: "—", ptr: 612.00, gst: 5, total: 6120.00 },
      { name: "Azithromycin 500 (3)", hsn: "30042099", batch: "AZ2412", exp: "12/26", qty: 80, free: 8, ptr: 74.60, gst: 12, total: 5968.00 },
      { name: "Cefixime 200 (10)", hsn: "30042010", batch: "CF2501", exp: "04/27", qty: 40, free: "—", ptr: 88.20, gst: 12, total: 3528.00 }
    ]
  },
  {
    id: "inv-2",
    invoiceNo: "INV-25-50387",
    orderNo: "SO-2026-8809",
    customerName: "City Care Pharmacy",
    customerCode: "C-1980",
    route: "Route 1 (Suresh)",
    gstin: "29AABCU4412K1Z9",
    date: "08 Oct 2026",
    time: "09:45 AM",
    dueDate: "29 Oct 2026",
    linesCount: 18,
    taxable: 31116,
    gstAmount: 3734,
    total: 34850,
    irn: "8f21d4918e9b11048b29e018d940a4b71890ea391028374a819b18274019283e",
    ewayBill: "241098451184",
    paymentStatus: "Unpaid",
    dispatchStatus: "Packed & Sealed",
    trayId: "Tray 09 · Box 2",
    items: [
      { name: "Paracetamol 650 tab (15)", hsn: "30049099", batch: "PC2409", exp: "09/27", qty: 120, free: 12, ptr: 28.50, gst: 12, total: 3420.00 },
      { name: "Montelukast + Levocet 10", hsn: "30049089", batch: "ML2503", exp: "05/27", qty: 90, free: 6, ptr: 118.00, gst: 12, total: 10301.40 },
      { name: "Atorvastatin 10 (15)", hsn: "30049079", batch: "AT2501", exp: "01/28", qty: 80, free: 8, ptr: 143.70, gst: 12, total: 11496.00 }
    ]
  },
  {
    id: "inv-3",
    invoiceNo: "INV-25-50386",
    orderNo: "SO-2026-8801",
    customerName: "Arogya Nursing Home",
    customerCode: "C-0840",
    route: "Hospital Route (Direct)",
    gstin: "29AABCA9101L1ZZ",
    date: "08 Oct 2026",
    time: "09:10 AM",
    dueDate: "22 Nov 2026",
    linesCount: 9,
    taxable: 43660,
    gstAmount: 5240,
    total: 48900,
    irn: "1b99a418d098e14710189b21840e9d1048172635481928301928471928471920",
    ewayBill: undefined, // Under ₹50k exemption
    paymentStatus: "Unpaid",
    dispatchStatus: "Out for Delivery",
    trayId: "Van KA-01-MJ-8812",
    items: [
      { name: "Ceftriaxone 1g Inj (Vial)", hsn: "30042099", batch: "CF2410", exp: "08/26", qty: 200, free: "—", ptr: 55.00, gst: 12, total: 11000.00 },
      { name: "Normal Saline 500ml IV", hsn: "30049099", batch: "NS2504", exp: "04/28", qty: 400, free: "—", ptr: 38.00, gst: 12, total: 15200.00 },
      { name: "Meropenem 1g Inj", hsn: "30042099", batch: "MR2412", exp: "12/26", qty: 30, free: "—", ptr: 756.60, gst: 12, total: 22700.00 }
    ]
  },
  {
    id: "inv-4",
    invoiceNo: "INV-25-50385",
    orderNo: "SO-2026-8794",
    customerName: "Apollo Medics Hub",
    customerCode: "C-3102",
    route: "Route 2 (Mahesh)",
    gstin: "29AABCA7721N1ZM",
    date: "08 Oct 2026",
    time: "08:30 AM",
    dueDate: "15 Oct 2026",
    linesCount: 31,
    taxable: 82500,
    gstAmount: 9900,
    total: 92400,
    irn: "7a19283740192834b71029384719283a01928374b6192837401928374a019283",
    ewayBill: "241098450912",
    paymentStatus: "Paid",
    dispatchStatus: "Delivered",
    trayId: "Delivered (POD OTP ✓)",
    items: [
      { name: "Telmisartan 40 (10)", hsn: "30049089", batch: "TL2411", exp: "10/26", qty: 300, free: 30, ptr: 64.20, gst: 12, total: 19260.00 },
      { name: "Rosuvastatin 20 (15)", hsn: "30049079", batch: "RS2502", exp: "08/27", qty: 150, free: 15, ptr: 182.00, gst: 12, total: 27300.00 }
    ]
  }
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(SAMPLE_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "irn" | "ewb" | "unpaid">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [copiedIrn, setCopiedIrn] = useState<string | null>(null);
  
  // Custom Modals & In-App Popups
  const [showGstrModal, setShowGstrModal] = useState(false);
  const [showDirectBillModal, setShowDirectBillModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("info");

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = 
        inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.orderNo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "irn") return Boolean(inv.irn);
      if (activeFilter === "ewb") return Boolean(inv.ewayBill) || inv.total >= 50000;
      if (activeFilter === "unpaid") return inv.paymentStatus === "Unpaid";
      return true;
    });
  }, [invoices, searchQuery, activeFilter]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIrn(id);
    showToast("IRN hash copied to clipboard.", "success");
    setTimeout(() => setCopiedIrn(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8f9] overflow-hidden relative">
      
      {/* IN-APP TOAST POPUP (Replaces browser alert) */}
      {toastMessage && (
        <div 
          className={`absolute top-4 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border text-xs font-medium transition-all transform animate-in slide-in-from-top-3 duration-200 ${
            toastType === "success" 
              ? "bg-emerald-900 text-white border-emerald-700" 
              : toastType === "warning"
              ? "bg-amber-900 text-white border-amber-700"
              : "bg-slate-900 text-white border-slate-700"
          }`}
        >
          {toastType === "success" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          {toastType === "info" && <Sparkles className="w-4 h-4 text-blue-400" />}
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white cursor-pointer"
          >
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
                GST Billing &amp; e-Invoice Register
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                NIC e-Invoice Connected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Government-compliant e-Invoice IRN generation, e-Way bills, and GST registers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGstrModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>GSTR-1 Export</span>
            </button>
            <button
              onClick={() => setShowDirectBillModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-sm font-medium hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Direct Bill (F2)</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Today&apos;s Billed Volume</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">₹14.62 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">412 invoices sealed</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">IRN Compliance Rate</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">100.0%</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Zero unassigned lines</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">e-Way Bills Generated</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">38 Bills</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Consignments &gt; ₹50,000</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Average Billed Ticket</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">₹35,485</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Fast-mover formulations</div>
          </div>
        </div>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
        
        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Channel Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveFilter("irn")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === "irn"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              e-Invoice IRN Valid
            </button>
            <button
              onClick={() => setActiveFilter("ewb")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === "ewb"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              e-Way Bill Eligible (&gt;₹50k)
            </button>
            <button
              onClick={() => setActiveFilter("unpaid")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeFilter === "unpaid"
                  ? "bg-white text-gray-900 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Receivables Pending
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Invoice #, Chemist, GSTIN..."
              className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Invoice Grid Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Invoice # &amp; Date</th>
                  <th className="py-3 px-4">Customer &amp; Route</th>
                  <th className="py-3 px-4">Lines</th>
                  <th className="py-3 px-4">Taxable</th>
                  <th className="py-3 px-4">GST</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">e-Invoice IRN</th>
                  <th className="py-3 px-4">e-Way Bill</th>
                  <th className="py-3 px-4">Dispatch Tray</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                      No matching invoice records found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      {/* Invoice No & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{inv.invoiceNo}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{inv.date} · {inv.time}</div>
                      </td>

                      {/* Customer & Route */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 group-hover:text-[#178582] transition-colors">
                          {inv.customerName}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {inv.route} · <span className="font-mono text-gray-400">{inv.gstin}</span>
                        </div>
                      </td>

                      {/* Lines */}
                      <td className="py-3.5 px-4 font-medium text-gray-600">
                        {inv.linesCount} lines
                      </td>

                      {/* Taxable */}
                      <td className="py-3.5 px-4 font-mono text-gray-700">
                        ₹{inv.taxable.toLocaleString("en-IN")}
                      </td>

                      {/* GST */}
                      <td className="py-3.5 px-4 font-mono text-gray-700">
                        ₹{inv.gstAmount.toLocaleString("en-IN")}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-bold text-gray-900 text-sm font-mono">
                        ₹{inv.total.toLocaleString("en-IN")}
                      </td>

                      {/* IRN */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            IRN Verified
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(inv.irn, inv.id);
                            }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer"
                            title="Copy IRN Hash"
                          >
                            {copiedIrn === inv.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* e-Way Bill */}
                      <td className="py-3.5 px-4 font-mono">
                        {inv.ewayBill ? (
                          <span className="text-gray-900 font-medium bg-blue-50/70 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                            {inv.ewayBill}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px] italic">
                            {inv.total < 50000 ? "Exempt (<₹50k)" : "Pending"}
                          </span>
                        )}
                      </td>

                      {/* Dispatch Tray */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium text-[11px]">
                          <Truck className="w-3.5 h-3.5 text-[#178582]" />
                          <span>{inv.trayId}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                            title="View Tax Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => showToast(`Thermal print job queued for ${inv.invoiceNo}`, "info")}
                            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                            title="Print Tax Invoice"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
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

      {/* PROPER GSTR-1 EXPORT POPUP MODAL (Replaces the browser alert) */}
      {showGstrModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    GSTR-1 Return Package (Govt Schema 1.1)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Validated against GSTN Portal specs &amp; HSN Table 12
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGstrModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary details */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-[11px] text-gray-500 font-medium">B2B Registered Invoices</div>
                <div className="text-base font-bold text-gray-900 mt-0.5">412 Vouchers</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">100% Valid GSTIN</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-[11px] text-gray-500 font-medium">Total Taxable Value</div>
                <div className="text-base font-bold text-gray-900 mt-0.5">₹14,62,400</div>
                <div className="text-[10px] text-gray-500 mt-0.5">CGST+SGST: ₹1,75,488</div>
              </div>
            </div>

            {/* Schema Check list */}
            <div className="space-y-2 mb-5 bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>All 412 records mapped with 64-char NIC e-Invoice IRN &amp; QR</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>HSN 8-digit Chapter 30 codes validated without anomalies</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowGstrModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowGstrModal(false);
                  showToast("GSTR-1 Excel workbook downloaded with B2B & HSN sheets.", "success");
                }}
                className="px-4 py-2 border border-emerald-600 text-emerald-700 rounded-md text-xs font-semibold hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download Excel</span>
              </button>
              <button
                onClick={() => {
                  setShowGstrModal(false);
                  showToast("GSTR-1 Official JSON package exported successfully.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL TAX INVOICE PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 border border-gray-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#178582]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  Tax Invoice — {selectedInvoice.invoiceNo}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                  GST e-Invoice
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-200/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Document Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-gray-700">
              
              {/* Distributor & Customer Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="font-bold text-gray-900 text-sm">[Distributor] DMS Pharma</div>
                  <div className="text-gray-500 mt-1">Main Central Warehouse, Plot 42-B, Industrial Area</div>
                  <div className="text-gray-500">GSTIN: <span className="font-mono font-medium text-gray-800">29AAAAA0000A1Z5</span></div>
                  <div className="text-gray-500">Drug Licence: <span className="font-mono font-medium text-gray-800">DL-20B/21B-441829</span></div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm">{selectedInvoice.customerName}</div>
                  <div className="text-gray-500 mt-1">{selectedInvoice.route}</div>
                  <div className="text-gray-500">GSTIN: <span className="font-mono font-medium text-gray-800">{selectedInvoice.gstin}</span></div>
                  <div className="text-gray-500">Payment Terms: <span className="font-medium text-gray-800">Due {selectedInvoice.dueDate}</span></div>
                </div>
              </div>

              {/* Statutory e-Invoice IRN & e-Way Box */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Government e-Invoice IRN</div>
                  <div className="font-mono text-gray-900 text-[11px] break-all select-all font-semibold">
                    {selectedInvoice.irn}
                  </div>
                  {selectedInvoice.ewayBill && (
                    <div className="mt-1 text-xs">
                      e-Way Bill: <span className="font-mono font-bold text-gray-900">{selectedInvoice.ewayBill}</span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 bg-white border border-gray-300 rounded flex items-center justify-center shrink-0 ml-3">
                  <QrCode className="w-9 h-9 text-gray-800" />
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[550px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-[11px] uppercase">
                      <th className="py-2">Item</th>
                      <th className="py-2">HSN</th>
                      <th className="py-2">Batch</th>
                      <th className="py-2">Exp</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Free</th>
                      <th className="py-2 text-right">PTR</th>
                      <th className="py-2 text-right">GST</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2 font-sans font-medium text-gray-900">{it.name}</td>
                        <td className="py-2 text-gray-500">{it.hsn}</td>
                        <td className="py-2 text-gray-700">{it.batch}</td>
                        <td className="py-2 text-gray-500">{it.exp}</td>
                        <td className="py-2 text-right font-bold">{it.qty}</td>
                        <td className="py-2 text-right text-emerald-600">{it.free}</td>
                        <td className="py-2 text-right">₹{it.ptr.toFixed(2)}</td>
                        <td className="py-2 text-right">{it.gst}%</td>
                        <td className="py-2 text-right font-bold text-gray-900">₹{it.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="pt-3 border-t border-gray-200 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxable Amount:</span>
                    <span className="font-mono font-medium">₹{selectedInvoice.taxable.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">CGST + SGST:</span>
                    <span className="font-mono font-medium">₹{selectedInvoice.gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-sm text-gray-900">
                    <span>Invoice Total:</span>
                    <span className="font-mono text-[#178582]">₹{selectedInvoice.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="text-[10px] text-gray-400 italic pt-2">
                * Note: Invoices are immutable once the IRN is generated. Any corrections or returns must be adjusted solely via registered Credit / Debit notes under Rule 48(4) of CGST Rules.
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Tray: <strong className="text-gray-800">{selectedInvoice.trayId}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast(`Encrypted invoice PDF sent to ${selectedInvoice.customerName} via WhatsApp.`, "success")}
                  className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send PDF</span>
                </button>
                <button
                  onClick={() => showToast("Tax Invoice print job sent with IRN barcode.", "info")}
                  className="px-4 py-1.5 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DIRECT BILL / COUNTER SALE MODAL */}
      {showDirectBillModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Direct Counter Bill (F2)</h3>
                <p className="text-xs text-gray-500">Fast keyboard order generation for walk-in retail chemists</p>
              </div>
              <button
                onClick={() => setShowDirectBillModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Select Customer / Chemist</label>
                <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:border-[#178582] focus:outline-none shadow-xs">
                  <option className="text-gray-900 bg-white">Sri Sai Medicals · Route 3</option>
                  <option className="text-gray-900 bg-white">City Care Pharmacy · Route 1</option>
                  <option className="text-gray-900 bg-white">Janata Medical Store · Route 4</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Add Product (Type first letters)</label>
                <input
                  type="text"
                  placeholder="e.g. AMOX or PANT"
                  defaultValue="Pantoprazole 40 (15)"
                  className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-[#178582] focus:border-[#178582] focus:outline-none shadow-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Batch (FEFO auto)</label>
                  <input
                    type="text"
                    defaultValue="PN2502 (06/27)"
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 rounded-md p-2.5 text-gray-900 font-semibold shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Billing Qty</label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-bold focus:ring-2 focus:ring-[#178582] focus:border-[#178582] focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Scheme Free</label>
                  <input
                    type="text"
                    defaultValue="+5 free (10+1)"
                    disabled
                    className="w-full border border-emerald-300 bg-emerald-50 text-emerald-900 rounded-md p-2.5 font-bold shadow-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center text-xs">
                <span className="font-medium text-gray-600">Calculated Net Payable:</span>
                <span className="text-base font-bold text-gray-900 font-mono">₹4,905.00</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowDirectBillModal(false)}
                className="px-3.5 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDirectBillModal(false);
                  showToast("Counter Invoice sealed! e-Invoice IRN requested from NIC Portal.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Generate e-Invoice &amp; Print
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
