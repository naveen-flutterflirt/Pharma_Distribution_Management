"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  FileText,
  Download,
  ArrowRight,
  ShieldAlert,
  X,
  Sparkles,
  QrCode,
  FileCheck2,
  Check,
  ChevronDown,
  Layers,
  ReceiptText,
  Boxes
} from "lucide-react";

interface PurchaseOrderRecord {
  id: string;
  poNumber: string;
  principalName: string;
  depotLocation: string;
  orderDate: string;
  expectedDate: string;
  linesCount: number;
  totalPts: number;
  freeGoodsValue: number;
  schemeSlab: string;
  status: "transmitted" | "inwarding" | "received" | "discrepancy";
  grnNumber?: string;
  supplierInvoiceNo?: string;
  debitNoteNo?: string;
  debitNoteAmount?: number;
  backOrdersWaiting: number;
  items: Array<{
    name: string;
    pack: string;
    orderedQty: number;
    freeQty: number;
    receivedQty?: number;
    ptsPrice: number;
    invoicedPts?: number;
    mrp: number;
    batchNo?: string;
    expDate?: string;
    isDiscrepancy?: boolean;
    discrepancyNote?: string;
  }>;
}

const SAMPLE_POS: PurchaseOrderRecord[] = [
  {
    id: "po-1",
    poNumber: "PO-2026-9041",
    principalName: "Principal B (Glaxo Regional)",
    depotLocation: "Regional C&F Depot, Sector 4",
    orderDate: "07 Oct 2026",
    expectedDate: "09 Oct 2026",
    linesCount: 4,
    totalPts: 485250,
    freeGoodsValue: 48500,
    schemeSlab: "10+1 Free Goods Slab (100+10)",
    status: "inwarding",
    supplierInvoiceNo: "INV-C&F-88912",
    grnNumber: "GRN-25-1048",
    backOrdersWaiting: 80,
    items: [
      {
        name: "Amoxicillin + Clav 625 (10)",
        pack: "10 tab",
        orderedQty: 1650,
        freeQty: 165,
        receivedQty: 1650,
        ptsPrice: 146.16,
        invoicedPts: 146.16,
        mrp: 204.00,
        batchNo: "AC2501",
        expDate: "08/28"
      },
      {
        name: "Cefixime 200 (10)",
        pack: "10 tab",
        orderedQty: 400,
        freeQty: 40,
        receivedQty: 400,
        ptsPrice: 79.38,
        invoicedPts: 79.38,
        mrp: 110.00,
        batchNo: "CF2502",
        expDate: "05/28"
      },
      {
        name: "Paracetamol 650 tab",
        pack: "15 tab",
        orderedQty: 1200,
        freeQty: 120,
        receivedQty: 1200,
        ptsPrice: 25.65,
        invoicedPts: 25.65,
        mrp: 34.50,
        batchNo: "PC2504",
        expDate: "10/28"
      }
    ]
  },
  {
    id: "po-2",
    poNumber: "PO-2026-9038",
    principalName: "Principal A (Novartis / Sandoz)",
    depotLocation: "Central Logistics Hub",
    orderDate: "05 Oct 2026",
    expectedDate: "08 Oct 2026",
    linesCount: 3,
    totalPts: 320400,
    freeGoodsValue: 0,
    schemeSlab: "Net Rate Contract (Cold Chain Priority)",
    status: "discrepancy",
    supplierInvoiceNo: "INV-NOV-44102",
    grnNumber: "GRN-25-1046",
    debitNoteNo: "DN-25-0104",
    debitNoteAmount: 14400,
    backOrdersWaiting: 0,
    items: [
      {
        name: "Insulin glargine pen",
        pack: "1 pen",
        orderedQty: 300,
        freeQty: 0,
        receivedQty: 300,
        ptsPrice: 550.80,
        invoicedPts: 598.80, // Invoiced higher than contract!
        mrp: 750.00,
        batchNo: "IG2509",
        expDate: "11/27",
        isDiscrepancy: true,
        discrepancyNote: "Rate mismatch: Invoiced at ₹598.80 instead of contracted PTS ₹550.80. Debit note generated."
      },
      {
        name: "Vildagliptin 50 (15)",
        pack: "15 tab",
        orderedQty: 250,
        freeQty: 0,
        receivedQty: 250,
        ptsPrice: 172.00,
        invoicedPts: 172.00,
        mrp: 235.00,
        batchNo: "VG2502",
        expDate: "06/28"
      }
    ]
  },
  {
    id: "po-3",
    poNumber: "PO-2026-9040",
    principalName: "Principal C (Cipla Stockist)",
    depotLocation: "State Mother Warehouse",
    orderDate: "06 Oct 2026",
    expectedDate: "09 Oct 2026",
    linesCount: 5,
    totalPts: 245800,
    freeGoodsValue: 24500,
    schemeSlab: "10+1 free formulation scheme",
    status: "transmitted",
    backOrdersWaiting: 15,
    items: [
      {
        name: "Pantoprazole 40 (15)",
        pack: "15 tab",
        orderedQty: 2200,
        freeQty: 220,
        ptsPrice: 88.29,
        mrp: 125.00
      },
      {
        name: "Azithromycin 500 (3)",
        pack: "3 tab",
        orderedQty: 600,
        freeQty: 60,
        ptsPrice: 67.14,
        mrp: 95.00
      }
    ]
  },
  {
    id: "po-4",
    poNumber: "PO-2026-9022",
    principalName: "Principal D (Abbott Care)",
    depotLocation: "Regional Depot 01",
    orderDate: "02 Oct 2026",
    expectedDate: "05 Oct 2026",
    linesCount: 2,
    totalPts: 185000,
    freeGoodsValue: 26400,
    schemeSlab: "12+2 Festival Offer",
    status: "received",
    supplierInvoiceNo: "INV-ABB-99120",
    grnNumber: "GRN-25-1039",
    backOrdersWaiting: 0,
    items: [
      {
        name: "Cough syrup 100 ml",
        pack: "1 btl",
        orderedQty: 1440,
        freeQty: 240,
        receivedQty: 1440,
        ptsPrice: 80.55,
        invoicedPts: 80.55,
        mrp: 115.00,
        batchNo: "CS2503",
        expDate: "04/28"
      }
    ]
  }
];

export default function PurchasePage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(SAMPLE_POS);
  const [activeFilter, setActiveFilter] = useState<"all" | "inwarding" | "transmitted" | "discrepancy" | "received">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [showNewPoModal, setShowNewPoModal] = useState(false);
  const [showGrnModal, setShowGrnModal] = useState(false);
  const [selectedPoForGrn, setSelectedPoForGrn] = useState<PurchaseOrderRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("info");

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.principalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (po.grnNumber && po.grnNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (po.supplierInvoiceNo && po.supplierInvoiceNo.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === "inwarding") return po.status === "inwarding";
      if (activeFilter === "transmitted") return po.status === "transmitted";
      if (activeFilter === "discrepancy") return po.status === "discrepancy";
      if (activeFilter === "received") return po.status === "received";

      return true;
    });
  }, [purchaseOrders, searchQuery, activeFilter]);

  const handleInwardGrn = (po: PurchaseOrderRecord) => {
    setSelectedPoForGrn(po);
    setShowGrnModal(true);
  };

  const confirmGrnVerification = () => {
    if (!selectedPoForGrn) return;

    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPoForGrn.id
          ? { ...po, status: "received", grnNumber: po.grnNumber || `GRN-25-${Math.floor(1050 + Math.random() * 50)}` }
          : po
      )
    );

    setShowGrnModal(false);
    showToast(
      `GRN inwarded successfully! Batch inventory updated and ${selectedPoForGrn.backOrdersWaiting > 0 ? `${selectedPoForGrn.backOrdersWaiting} back-orders auto-released for billing!` : "stock allocated to FEFO bins."}`,
      "success"
    );
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
                Purchase Orders &amp; GRN Inwarding
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Principal EDI Connected
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Purchase-to-stock workflow: suggest PO, verify GRN barcode batches, resolve rate discrepancies, and auto-bill back-orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast("Importing e-invoice JSON from C&F SFTP server...", "info");
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-gray-500" />
              <span>Import C&amp;F e-Invoice</span>
            </button>
            <button
              onClick={() => setShowNewPoModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Purchase Order</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Open Orders to Principals</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">₹34.2 Lakh</div>
            <div className="text-[11px] text-gray-400 mt-0.5">8 POs active across 4 principals</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Inwarding / GRN in Progress</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">3 Shipments</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Physical batch scanning in progress</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Rate Discrepancy Claims</div>
            <div className="text-lg font-bold text-red-600 mt-0.5">₹14,400</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Debit Note DN-25-0104 pending</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Back-Orders Waiting Arrival</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">95 Lines</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Auto-bills on GRN confirmation</div>
          </div>
        </div>
      </header>

      {/* Main Table Area */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-4">
        
        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setActiveFilter("inwarding")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "inwarding" ? "bg-white text-amber-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Inwarding / GRN Active
            </button>
            <button
              onClick={() => setActiveFilter("discrepancy")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "discrepancy" ? "bg-white text-red-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Discrepancies / Debit Notes
            </button>
            <button
              onClick={() => setActiveFilter("transmitted")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "transmitted" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              PO Sent to C&amp;F
            </button>
            <button
              onClick={() => setActiveFilter("received")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeFilter === "received" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed &amp; Stocked
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PO #, Principal, Supplier Inv..."
              className="pl-9 pr-4 py-2 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Purchase Orders Grid */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[850px]">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">PO # &amp; Date</th>
                  <th className="py-3 px-4">Principal / C&amp;F Depot</th>
                  <th className="py-3 px-4">Lines &amp; Value (PTS)</th>
                  <th className="py-3 px-4">Scheme Benefit</th>
                  <th className="py-3 px-4">Inward Status</th>
                  <th className="py-3 px-4">Back-Order Impact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-900">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                      No matching purchase orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50/80 transition-colors group">
                      
                      {/* PO # & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 font-mono text-sm">{po.poNumber}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Ordered: {po.orderDate}</div>
                      </td>

                      {/* Principal & Depot */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900 text-[13px]">{po.principalName}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{po.depotLocation}</div>
                      </td>

                      {/* Lines & Value */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-gray-900 text-sm">₹{po.totalPts.toLocaleString("en-IN")}</div>
                        <div className="text-[11px] text-gray-500">{po.linesCount} SKUs requested</div>
                      </td>

                      {/* Scheme Benefit */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded inline-block">
                          {po.schemeSlab}
                        </div>
                        {po.freeGoodsValue > 0 && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Free Goods: <span className="font-bold text-gray-800">₹{po.freeGoodsValue.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                      </td>

                      {/* Inward Status */}
                      <td className="py-3.5 px-4">
                        {po.status === "inwarding" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <Boxes className="w-3 h-3 text-amber-600" /> GRN Inwarding ({po.grnNumber})
                            </span>
                            <div className="text-[10px] text-gray-400 mt-0.5">Inv #{po.supplierInvoiceNo}</div>
                          </div>
                        )}
                        {po.status === "transmitted" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Truck className="w-3 h-3 text-blue-600" /> Transmitted via EDI
                          </span>
                        )}
                        {po.status === "discrepancy" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-300">
                              <AlertTriangle className="w-3 h-3 text-red-600" /> Rate Discrepancy (DN #{po.debitNoteNo})
                            </span>
                            <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                              Debit Note: ₹{po.debitNoteAmount?.toLocaleString("en-IN")}
                            </div>
                          </div>
                        )}
                        {po.status === "received" && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> GRN Completed
                            </span>
                            <div className="text-[10px] text-gray-400 mt-0.5">{po.grnNumber}</div>
                          </div>
                        )}
                      </td>

                      {/* Back-Order Impact */}
                      <td className="py-3.5 px-4">
                        {po.backOrdersWaiting > 0 ? (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200">
                            {po.backOrdersWaiting} strips will auto-bill
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">No pending back-orders</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {po.status === "inwarding" && (
                            <button
                              onClick={() => handleInwardGrn(po)}
                              className="px-3 py-1.5 bg-[#178582] text-white font-semibold rounded text-xs hover:bg-[#126b68] cursor-pointer shadow-xs"
                            >
                              Verify GRN
                            </button>
                          )}
                          {po.status === "discrepancy" && (
                            <button
                              onClick={() => {
                                showToast(`Debit note ${po.debitNoteNo} downloaded for Principal claim reconciliation.`, "info");
                              }}
                              className="px-2.5 py-1.5 border border-red-300 bg-red-50 text-red-700 font-semibold rounded text-xs hover:bg-red-100 cursor-pointer"
                            >
                              View Debit Note
                            </button>
                          )}
                          <button
                            onClick={() => {
                              showToast(`PO ${po.poNumber} document opened for printing/export.`, "info");
                            }}
                            className="p-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600 cursor-pointer"
                            title="Download PO PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
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

      {/* VERIFY GRN MODAL */}
      {showGrnModal && selectedPoForGrn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900">
                    Verify Goods Receipt Note ({selectedPoForGrn.grnNumber || "GRN Inward"})
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                    Supplier Inv: {selectedPoForGrn.supplierInvoiceNo}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scan received barcodes, verify FEFO expiry dates, and reconcile invoiced PTS against PO.
                </p>
              </div>
              <button onClick={() => setShowGrnModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-4 space-y-4 text-xs">
              
              {/* Items Inwarding Table */}
              <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left min-w-[550px]">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Batch &amp; Exp</th>
                      <th className="py-2.5 px-3">Ordered</th>
                      <th className="py-2.5 px-3">Received Qty</th>
                      <th className="py-2.5 px-3 text-right">PTS Match</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {selectedPoForGrn.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-semibold text-gray-900">{item.name}</td>
                        <td className="py-2.5 px-3 font-mono text-gray-700">
                          {item.batchNo || "Scan Batch"} · {item.expDate || "MM/YY"}
                        </td>
                        <td className="py-2.5 px-3 font-mono">{item.orderedQty} + {item.freeQty} free</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          {item.receivedQty || item.orderedQty} ✓
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {item.isDiscrepancy ? (
                            <span className="text-red-600 font-bold">₹{item.invoicedPts} (Diff)</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">₹{item.ptsPrice} ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Automatic Back-Order Resolution Banner */}
              {selectedPoForGrn.backOrdersWaiting > 0 && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-emerald-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs">Back-Order Auto-Billing Queue Activated:</div>
                    <div className="text-[11px] text-emerald-800 mt-0.5">
                      Confirming this GRN will automatically allocate <strong>80 strips of Cefixime 200</strong> directly to <strong>Sri Sai Medicals (Order SO-2026-8812)</strong> and generate their pending pick invoice.
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowGrnModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmGrnVerification}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Complete GRN &amp; Auto-Bill Backorders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PURCHASE ORDER MODAL */}
      {showNewPoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Create Purchase Order (EDI Transmit)</h3>
                <p className="text-xs text-gray-500">Order directly to Principal C&amp;F depot with scheme slab optimizer</p>
              </div>
              <button onClick={() => setShowNewPoModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Select Principal / Manufacturer</label>
                <select className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none">
                  <option className="text-gray-900 bg-white">Principal B · Glaxo Regional C&amp;F Depot</option>
                  <option className="text-gray-900 bg-white">Principal A · Novartis Logistics Hub</option>
                  <option className="text-gray-900 bg-white">Principal C · Cipla State Depot</option>
                  <option className="text-gray-900 bg-white">Principal D · Abbott Care Depot</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1.5">Add Formulations</label>
                <input
                  type="text"
                  defaultValue="Amoxicillin + Clav 625 (1,650 strips) + Pantoprazole 40 (2,200 strips)"
                  className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-medium focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Calculated Scheme Slab</label>
                  <input
                    type="text"
                    defaultValue="10+1 Free Goods Applied"
                    disabled
                    className="w-full border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold rounded-md p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1.5">Free Goods Value</label>
                  <input
                    type="text"
                    defaultValue="₹48,500 Earned"
                    disabled
                    className="w-full border border-emerald-300 bg-emerald-50 text-emerald-900 font-bold rounded-md p-2.5"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Estimated Total Order Value (PTS):</span>
                <span className="text-base font-bold text-gray-900 font-mono">₹4,85,250.00</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowNewPoModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newPo: PurchaseOrderRecord = {
                    id: `po-${Date.now()}`,
                    poNumber: `PO-2026-${Math.floor(9050 + Math.random() * 50)}`,
                    principalName: "Principal B (Glaxo Regional)",
                    depotLocation: "Regional C&F Depot, Sector 4",
                    orderDate: "Today",
                    expectedDate: "In 2 days",
                    linesCount: 2,
                    totalPts: 485250,
                    freeGoodsValue: 48500,
                    schemeSlab: "10+1 Free Goods Slab (100+10)",
                    status: "transmitted",
                    backOrdersWaiting: 80,
                    items: []
                  };
                  setPurchaseOrders([newPo, ...purchaseOrders]);
                  setShowNewPoModal(false);
                  showToast("Purchase order transmitted to Principal B via EDI portal.", "success");
                }}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Transmit PO via EDI
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
