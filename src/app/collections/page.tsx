"use client";

import React, { useState } from "react";
import { 
  IndianRupee, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  X, 
  CreditCard,
  Building,
  QrCode
} from "lucide-react";

interface PaymentRecord {
  id: string;
  receiptNo: string;
  customerName: string;
  amount: number;
  mode: "UPI" | "Cheque" | "Cash" | "Bank NEFT";
  referenceNo: string;
  date: string;
  status: "Received" | "Pending Clearance";
}

const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: "col-1", receiptNo: "REC-2026-104", customerName: "Sri Sai Medicals", amount: 24000, mode: "UPI", referenceNo: "UPI/261009184421", date: "Today, 10:30 AM", status: "Received" },
  { id: "col-2", receiptNo: "REC-2026-103", customerName: "City Care Pharmacy", amount: 15000, mode: "Cheque", referenceNo: "CHQ-884129 (HDFC)", date: "Today, 09:15 AM", status: "Pending Clearance" },
  { id: "col-3", receiptNo: "REC-2026-102", customerName: "Apollo Pharmacy Sec-14", amount: 85000, mode: "Bank NEFT", referenceNo: "NEFT-AXIS-9921", date: "Yesterday", status: "Received" },
  { id: "col-4", receiptNo: "REC-2026-101", customerName: "MedPlus Chemist", amount: 12500, mode: "Cash", referenceNo: "CASH-REC-01", date: "24 Oct 2026", status: "Received" }
];

export default function CollectionsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"All" | "UPI" | "Cheque" | "Cash" | "Bank NEFT">("All");

  // Record Payment Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState(10000);
  const [mode, setMode] = useState<"UPI" | "Cheque" | "Cash" | "Bank NEFT">("UPI");
  const [refNo, setRefNo] = useState("");

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || amount <= 0) return;

    const newPay: PaymentRecord = {
      id: `col-${Date.now()}`,
      receiptNo: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      amount: Number(amount),
      mode,
      referenceNo: refNo || `${mode}-REF-01`,
      date: "Just now",
      status: mode === "Cheque" ? "Pending Clearance" : "Received"
    };

    setPayments([newPay, ...payments]);
    setIsAddOpen(false);
    setCustomerName("");
    setAmount(10000);
    setRefNo("");
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          p.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
                          p.referenceNo.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (modeFilter !== "All" && p.mode !== modeFilter) return false;
    return true;
  });

  const totalCollected = payments
    .filter(p => p.status === "Received")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Payments &amp; Collections
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">Total: ₹{totalCollected.toLocaleString("en-IN")} realized</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Payment Receipts
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Payment</span>
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
              placeholder="Search receipt #, customer, ref..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto overflow-x-auto">
            {(["All", "UPI", "Cheque", "Cash", "Bank NEFT"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setModeFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  modeFilter === tab
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

      {/* Payments Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Chemist / Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Reference / UTR</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {p.receiptNo}
                    </td>
                    <td className="py-3.5 px-4 text-gray-900 font-medium">
                      {p.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                        {p.mode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                      {p.referenceNo}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {p.status === "Received" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Received
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          In Clearing
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Record Customer Payment</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Customer / Chemist Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sri Sai Medicals"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Amount Received (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / QR)</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Bank Cheque</option>
                  <option value="Bank NEFT">Bank Transfer (NEFT / RTGS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reference / Transaction No / Cheque No
                </label>
                <input
                  type="text"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="e.g. UPI/2026/88412 or Cheque #12401"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#178582] hover:bg-[#126b68] rounded-lg shadow-2xs cursor-pointer"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
