"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  IndianRupee,
  Building,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Download,
  Share2,
  FileCheck2,
  Layers,
  Calendar,
  ChevronDown,
  Info,
  ExternalLink
} from "lucide-react";

interface ClaimRecord {
  id: string;
  claimNo: string;
  type: "Expiry returns" | "Breakage / damage" | "Rate difference (hospitals)" | "Scheme reimbursement" | "Price-drop protection";
  principalName: string;
  cnfDepot: string;
  amount: number;
  dateRaised: string;
  ageDays: number;
  status: "Draft" | "Sent to C&F" | "Verified" | "Credit Note Received";
  creditNoteNo?: string;
  creditNoteAmount?: number;
  evidenceFilesCount: number;
  batchDetails: string;
  linesCount: number;
}

const SAMPLE_CLAIMS: ClaimRecord[] = [
  {
    id: "cl-1",
    claimNo: "CLM-25-0182",
    type: "Expiry returns",
    principalName: "Principal B (Glaxo Regional)",
    cnfDepot: "Regional C&F Depot, Sector 4",
    amount: 580000,
    dateRaised: "14 Aug 2026",
    ageDays: 59,
    status: "Verified",
    creditNoteNo: "PCN-GLX-9941",
    creditNoteAmount: 580000,
    evidenceFilesCount: 4,
    batchDetails: "Amoxicillin 500 (AM2301, 140 strips) · Cefixime (CF2309)",
    linesCount: 8
  },
  {
    id: "cl-2",
    claimNo: "CLM-25-0188",
    type: "Rate difference (hospitals)",
    principalName: "Principal A (Novartis Institutional)",
    cnfDepot: "Central Logistics Hub",
    amount: 310000,
    dateRaised: "18 Sep 2026",
    ageDays: 24,
    status: "Sent to C&F",
    evidenceFilesCount: 6,
    batchDetails: "Arogya Nursing Home tender rate gap (PTR ₹612 vs Contract ₹550)",
    linesCount: 12
  },
  {
    id: "cl-3",
    claimNo: "CLM-25-0174",
    type: "Scheme reimbursement",
    principalName: "Principal C (Cipla Stockist)",
    cnfDepot: "State Mother Warehouse",
    amount: 120000,
    dateRaised: "05 Jul 2026",
    ageDays: 98,
    status: "Sent to C&F",
    evidenceFilesCount: 3,
    batchDetails: "Quarterly Target scheme pass-on (10+1 free goods given at cost)",
    linesCount: 5
  },
  {
    id: "cl-4",
    claimNo: "CLM-25-0192",
    type: "Breakage / damage",
    principalName: "Principal D (Abbott Care)",
    cnfDepot: "Regional Depot 01",
    amount: 60000,
    dateRaised: "29 Sep 2026",
    ageDays: 13,
    status: "Draft",
    evidenceFilesCount: 5,
    batchDetails: "Cough syrup transit bottle breakage in sealed master carton",
    linesCount: 3
  },
  {
    id: "cl-5",
    claimNo: "CLM-25-0190",
    type: "Price-drop protection",
    principalName: "Principal B (Glaxo Regional)",
    cnfDepot: "Regional C&F Depot, Sector 4",
    amount: 50000,
    dateRaised: "22 Sep 2026",
    ageDays: 20,
    status: "Credit Note Received",
    creditNoteNo: "PCN-GLX-9988",
    creditNoteAmount: 50000,
    evidenceFilesCount: 2,
    batchDetails: "NPPA / DPCO gazette ceiling price revision stock adjustment",
    linesCount: 4
  }
];

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>(SAMPLE_CLAIMS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredClaims = useMemo(() => {
    return claims.filter((cl) => {
      const matchesSearch =
        cl.claimNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cl.principalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cl.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cl.batchDetails.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "expiry") return cl.type === "Expiry returns";
      if (activeFilter === "rate_diff") return cl.type === "Rate difference (hospitals)";
      if (activeFilter === "scheme") return cl.type === "Scheme reimbursement";
      if (activeFilter === "breakage") return cl.type === "Breakage / damage";
      if (activeFilter === "overdue") return cl.ageDays > 60;

      return true;
    });
  }, [claims, searchQuery, activeFilter]);

  const totalPendingClaims = useMemo(() => {
    return claims.reduce((acc, curr) => acc + curr.amount, 0);
  }, [claims]);

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
      <header className="px-4 sm:px-8 py-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Claims Management with Principals
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Audit Trail Tracked
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              End-to-end recovery: Expiry returns, transit breakage, hospital institutional rate differences, and scheme reimbursements.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/purchase"
              className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              ← Purchases
            </Link>
            <Link
              href="/collections"
              className="px-3 py-2 bg-teal-50 border border-teal-200 text-[#178582] rounded-md text-xs font-semibold hover:bg-teal-100 transition-colors"
            >
              Collections →
            </Link>
            <button
              onClick={() => {
                showToast("Generating batch-wise claim package in Principal EDI format...", "info");
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#178582]" />
              <span>Export Dossier</span>
            </button>
            <button
              onClick={() => setShowNewClaimModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Claim</span>
            </button>
          </div>
        </div>

        {/* 5 Claims Categories Strip Matching Page 11 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Expiry Returns</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">₹5.8 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Sent with debit note</div>
          </div>
          <div className="bg-[#fbfcfd] p-3 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Rate Difference</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">₹3.1 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Hospital tender gap</div>
          </div>
          <div className="bg-[#fbfcfd] p-3 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Scheme Reimbursement</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">₹1.2 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Free goods given at cost</div>
          </div>
          <div className="bg-[#fbfcfd] p-3 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Breakage / Damage</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">₹0.6 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Transit evidence logged</div>
          </div>
          <div className="bg-[#fbfcfd] p-3 rounded-lg border border-gray-200/80 col-span-2 lg:col-span-1">
            <div className="text-xs text-gray-500 font-medium">Price-Drop Protection</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">₹0.5 Lakh</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">DPCO ceiling revision</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
        
        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                activeFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Claims ({claims.length})
            </button>
            <button
              onClick={() => setActiveFilter("expiry")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                activeFilter === "expiry" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Expiry Returns
            </button>
            <button
              onClick={() => setActiveFilter("rate_diff")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                activeFilter === "rate_diff" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Rate Difference (Hospitals)
            </button>
            <button
              onClick={() => setActiveFilter("scheme")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                activeFilter === "scheme" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Scheme Claims
            </button>
            <button
              onClick={() => setActiveFilter("overdue")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer shrink-0 ${
                activeFilter === "overdue" ? "bg-white text-red-700 shadow-sm font-bold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Ageing &gt; 60 d (Alerts)
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Claim #, Principal, Product..."
              className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Claims Register Grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-xs text-left">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Claim # &amp; Date</th>
                  <th className="py-3 px-4">Claim Category</th>
                  <th className="py-3 px-4">Principal / Depot</th>
                  <th className="py-3 px-4">Claim Amount</th>
                  <th className="py-3 px-4">Ageing &amp; SLA</th>
                  <th className="py-3 px-4">Settlement Status</th>
                  <th className="py-3 px-4">Audit Evidence</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredClaims.map((cl) => {
                  const isOld = cl.ageDays > 60;
                  return (
                    <tr key={cl.id} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* Claim # & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 font-mono text-sm">{cl.claimNo}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Raised: {cl.dateRaised}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                          {cl.type}
                        </span>
                        <div className="text-[11px] text-gray-500 font-normal mt-0.5 truncate max-w-[200px]">
                          {cl.batchDetails}
                        </div>
                      </td>

                      {/* Principal */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">{cl.principalName}</div>
                        <div className="text-[11px] text-gray-400">{cl.cnfDepot}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sm text-gray-900">
                        ₹{cl.amount.toLocaleString("en-IN")}
                      </td>

                      {/* Ageing */}
                      <td className="py-3.5 px-4">
                        <div className={`font-mono font-bold ${isOld ? "text-red-600" : "text-gray-700"}`}>
                          {cl.ageDays} days
                        </div>
                        {isOld && (
                          <div className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Overdue SLA (&gt;60 d)
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {cl.status === "Credit Note Received" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Settled ({cl.creditNoteNo})
                          </span>
                        )}
                        {cl.status === "Verified" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" /> Verified by C&amp;F
                          </span>
                        )}
                        {cl.status === "Sent to C&F" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                            Sent to C&amp;F
                          </span>
                        )}
                        {cl.status === "Draft" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            Draft (Compiling)
                          </span>
                        )}
                      </td>

                      {/* Evidence */}
                      <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                        {cl.evidenceFilesCount} files (Invoices, Photos)
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedClaim(cl)}
                            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 cursor-pointer shadow-xs"
                            title="View Claim Dossier"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              showToast(`Claim notice and debit note PDF resent to ${cl.principalName}.`, "info");
                            }}
                            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-[#178582] cursor-pointer shadow-xs"
                            title="Transmit Notice"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 10 Formula & True Margin Architecture Note */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Info className="w-4 h-4 text-[#178582]" />
            <span>True Margin View Architecture (Page 11):</span>
          </div>
          <p className="text-gray-600 font-mono text-[11px] leading-relaxed bg-gray-50 p-2.5 rounded border border-gray-200">
            Net margin = (PTR &times; qty &minus; customer discount &minus; free goods given at cost) &minus; (PTS &times; qty &minus; principal discount &minus; free goods received) + claimable amounts
          </p>
          <p className="text-gray-500 text-[11px]">
            The system tracks claims per invoice line so the distributor sees true margin by product, principal, customer, and salesman — preventing loss-making accounts.
          </p>
        </div>

      </div>

      {/* RAISE NEW CLAIM MODAL */}
      {showNewClaimModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Raise Claim with Principal</h3>
                <p className="text-xs text-gray-500">Submit claim package in principal format with attached invoices and batch photos</p>
              </div>
              <button onClick={() => setShowNewClaimModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Claim Category</label>
                <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                  <option className="text-gray-900 bg-white">Expiry returns (Quarantine stock claim)</option>
                  <option className="text-gray-900 bg-white">Rate difference (Hospital tender contract gap)</option>
                  <option className="text-gray-900 bg-white">Scheme reimbursement (Target pass-on)</option>
                  <option className="text-gray-900 bg-white">Breakage / Damage in transit</option>
                  <option className="text-gray-900 bg-white">Price-drop protection (NPPA / DPCO revision)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Select Principal</label>
                <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                  <option className="text-gray-900 bg-white">Principal B · Glaxo Regional C&amp;F Depot</option>
                  <option className="text-gray-900 bg-white">Principal A · Novartis Central Logistics Hub</option>
                  <option className="text-gray-900 bg-white">Principal C · Cipla State Mother Warehouse</option>
                  <option className="text-gray-900 bg-white">Principal D · Abbott Care Regional Depot</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Claim Amount (₹)</label>
                  <input
                    type="number"
                    defaultValue="48200"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-mono font-bold focus:ring-2 focus:ring-[#178582] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Attach Debit Note</label>
                  <input
                    type="text"
                    defaultValue="DN-25-0105"
                    className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-mono font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Batch &amp; Evidence Summary</label>
                <textarea
                  rows={2}
                  defaultValue="Quarantined batch AC2308 (120 strips) collected from chemist returns. Barcode photos & invoice copies attached."
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowNewClaimModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newClaim: ClaimRecord = {
                    id: `cl-${Date.now()}`,
                    claimNo: `CLM-25-${Math.floor(193 + Math.random() * 20)}`,
                    type: "Expiry returns",
                    principalName: "Principal B (Glaxo Regional)",
                    cnfDepot: "Regional C&F Depot, Sector 4",
                    amount: 48200,
                    dateRaised: "Today",
                    ageDays: 0,
                    status: "Sent to C&F",
                    evidenceFilesCount: 3,
                    batchDetails: "Quarantined batch AC2308 (120 strips)",
                    linesCount: 2
                  };
                  setClaims([newClaim, ...claims]);
                  setShowNewClaimModal(false);
                  showToast("Claim package dispatched to C&F depot with statutory debit note.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Generate &amp; Send to C&amp;F
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM DOSSIER DETAILS MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Claim Dossier — {selectedClaim.claimNo}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedClaim.type} · {selectedClaim.principalName}</p>
              </div>
              <button onClick={() => setSelectedClaim(null)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500">Claim Amount:</span>
                  <span className="font-bold text-gray-900 text-sm font-mono">₹{selectedClaim.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Current Status:</span>
                  <span className="font-bold text-blue-700">{selectedClaim.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ageing SLA:</span>
                  <span className={`font-bold font-mono ${selectedClaim.ageDays > 60 ? "text-red-600" : "text-gray-800"}`}>
                    {selectedClaim.ageDays} days ({selectedClaim.dateRaised})
                  </span>
                </div>
                {selectedClaim.creditNoteNo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Principal Credit Note:</span>
                    <span className="font-bold font-mono">{selectedClaim.creditNoteNo} (₹{selectedClaim.creditNoteAmount?.toLocaleString("en-IN")})</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="text-gray-500">Batch Lines:</span>
                  <span className="text-gray-800">{selectedClaim.batchDetails}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                <span className="font-bold">Audit Evidence on Record:</span>
                <div className="text-[11px] text-emerald-800 mt-1">
                  &bull; Original Chemist Return Slips &bull; Outer Master Carton Barcode Scan &bull; Distributor Purchase Invoices &bull; Commercial Debit Note Acknowledgement
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedClaim(null);
                  showToast("Dossier and debit note exported as PDF.", "info");
                }}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-gray-600" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
