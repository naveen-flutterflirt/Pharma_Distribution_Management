"use client";

import React, { useState } from "react";
import { 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  X, 
  Eye, 
  FileText, 
  Download, 
  IndianRupee 
} from "lucide-react";

interface InvoiceItem {
  name: string;
  batch: string;
  exp: string;
  qty: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  orderNo: string;
  customerName: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  paymentStatus: "Paid" | "Unpaid";
  items: InvoiceItem[];
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNo: "INV-2026-1041",
    orderNo: "SO-8812",
    customerName: "Sri Sai Medicals",
    date: "26 Oct 2026",
    dueDate: "25 Nov 2026",
    totalAmount: 48500,
    paymentStatus: "Unpaid",
    items: [
      { name: "Amoxicillin + Clav 625 (10 tabs)", batch: "AC2408", exp: "03/27", qty: 50, rate: 162, amount: 8100 },
      { name: "Pantoprazole 40 (15 tabs)", batch: "PN2502", exp: "06/27", qty: 100, rate: 98, amount: 9800 },
      { name: "Azithromycin 500 (3 tabs)", batch: "AZ2412", exp: "12/26", qty: 80, rate: 75, amount: 6000 }
    ]
  },
  {
    id: "inv-2",
    invoiceNo: "INV-2026-1040",
    orderNo: "SO-8810",
    customerName: "Apollo Pharmacy Sec-14",
    date: "26 Oct 2026",
    dueDate: "25 Nov 2026",
    totalAmount: 114500,
    paymentStatus: "Paid",
    items: [
      { name: "Insulin Glargine Pen", batch: "IG2507", exp: "07/27", qty: 20, rate: 612, amount: 12240 },
      { name: "Amoxicillin + Clav 625", batch: "AC2408", exp: "03/27", qty: 150, rate: 162, amount: 24300 },
      { name: "Pantoprazole 40", batch: "PN2502", exp: "06/27", qty: 200, rate: 98, amount: 19600 }
    ]
  },
  {
    id: "inv-3",
    invoiceNo: "INV-2026-1039",
    orderNo: "SO-8809",
    customerName: "MedPlus Chemist",
    date: "25 Oct 2026",
    dueDate: "24 Nov 2026",
    totalAmount: 33400,
    paymentStatus: "Paid",
    items: [
      { name: "Pantoprazole 40", batch: "PN2502", exp: "06/27", qty: 120, rate: 98, amount: 11760 },
      { name: "Azithromycin 500", batch: "AZ2412", exp: "12/26", qty: 60, rate: 75, amount: 4500 }
    ]
  },
  {
    id: "inv-4",
    invoiceNo: "INV-2026-1038",
    orderNo: "SO-8808",
    customerName: "Wellness Forever",
    date: "24 Oct 2026",
    dueDate: "23 Nov 2026",
    totalAmount: 28900,
    paymentStatus: "Unpaid",
    items: [
      { name: "Cefixime 200 (10 tabs)", batch: "CF2501", exp: "04/27", qty: 80, rate: 88, amount: 7040 },
      { name: "Metformin 500 SR (10 tabs)", batch: "MF2511", exp: "11/27", qty: 150, rate: 21, amount: 3150 }
    ]
  }
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Unpaid">("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Toggle payment status
  const handleTogglePaid = (id: string) => {
    setInvoices(invoices.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          paymentStatus: inv.paymentStatus === "Paid" ? "Unpaid" : "Paid"
        };
      }
      return inv;
    }));
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
                          inv.orderNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Billing &amp; Invoices
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{filteredInvoices.length} invoices recorded</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Customer Invoices
          </h1>
        </div>
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
              placeholder="Search Invoice #, Chemist..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {(["All", "Paid", "Unpaid"] as const).map((tab) => (
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

      {/* Invoices Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500 text-sm">
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                        {inv.orderNo}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-900">
                        {inv.customerName}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {inv.date}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {inv.dueDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        {inv.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Bill</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTogglePaid(inv.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                              inv.paymentStatus === "Paid"
                                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            }`}
                          >
                            {inv.paymentStatus === "Paid" ? "Mark Unpaid" : "Mark Paid"}
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

      {/* VIEW / PRINT INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Invoice Top Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div>
                <div className="text-xs font-bold uppercase text-[#178582] tracking-wider">TAX INVOICE</div>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{selectedInvoice.invoiceNo}</h3>
                <p className="text-xs text-gray-500">Ref: {selectedInvoice.orderNo} · Date: {selectedInvoice.date}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill To Info */}
            <div className="p-3 bg-gray-50 rounded-lg text-xs flex justify-between">
              <div>
                <span className="text-gray-500 font-semibold">Billed To:</span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedInvoice.customerName}</p>
                <p className="text-gray-500">Drug License: DL-20B/21B-88412</p>
              </div>
              <div className="text-right">
                <span className="text-gray-500 font-semibold">Payment Status:</span>
                <p className={`font-bold mt-0.5 ${selectedInvoice.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                  {selectedInvoice.paymentStatus.toUpperCase()}
                </p>
                <p className="text-gray-500">Due: {selectedInvoice.dueDate}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-2.5">Item</th>
                    <th className="p-2.5">Batch</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-gray-900">{item.name}</td>
                      <td className="p-2.5 text-gray-500">{item.batch}</td>
                      <td className="p-2.5 text-right text-gray-700">{item.qty}</td>
                      <td className="p-2.5 text-right font-mono text-gray-700">₹{item.rate}</td>
                      <td className="p-2.5 text-right font-bold text-gray-900 font-mono">₹{item.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div className="flex items-center justify-between pt-2 border-t text-sm font-bold">
              <span className="text-gray-700">Total Invoice Amount (incl. GST)</span>
              <span className="text-xl font-mono text-[#178582]">
                ₹{selectedInvoice.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTogglePaid(selectedInvoice.id);
                    setSelectedInvoice(prev => prev ? { ...prev, paymentStatus: prev.paymentStatus === "Paid" ? "Unpaid" : "Paid" } : null);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer text-white ${
                    selectedInvoice.paymentStatus === "Paid" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {selectedInvoice.paymentStatus === "Paid" ? "Mark as Unpaid" : "Mark as Paid"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
