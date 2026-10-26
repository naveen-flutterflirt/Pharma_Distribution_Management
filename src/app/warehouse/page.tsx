"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Boxes,
  Truck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Search,
  Filter,
  Snowflake,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Printer,
  Barcode,
  RefreshCw,
  Clock,
  Eye,
  ScanLine
} from "lucide-react";

interface PickWaveItem {
  id: string;
  binLocation: string;
  productName: string;
  pack: string;
  billedBatch: string;
  expiryDate: string;
  qty: number;
  freeQty: number | string;
  isColdChain?: boolean;
  status: "picked" | "pending" | "mismatch";
  scannedBatch?: string;
  mismatchNote?: string;
}

interface PickWave {
  id: string;
  trayId: string;
  invoiceNo: string;
  customerName: string;
  linesCount: number;
  totalUnits: number;
  route: string;
  vanAssigned: string;
  weightKg: number;
  boxesCount: number;
  status: "picking" | "checking" | "sealed" | "dispatched";
  isColdChainRequired?: boolean;
  items: PickWaveItem[];
}

const SAMPLE_WAVES: PickWave[] = [
  {
    id: "wave-1",
    trayId: "Tray 14",
    invoiceNo: "INV-25-50388",
    customerName: "Sri Sai Medicals",
    linesCount: 42,
    totalUnits: 490,
    route: "Route 3 (Ravi)",
    vanAssigned: "Van KA-01-MJ-8812",
    weightKg: 14.2,
    boxesCount: 3,
    status: "checking",
    isColdChainRequired: true,
    items: [
      {
        id: "p-1",
        binLocation: "C-04-2",
        productName: "Pantoprazole 40",
        pack: "15 tab",
        billedBatch: "PN2502",
        expiryDate: "06/27",
        qty: 100,
        freeQty: 10,
        status: "picked",
        scannedBatch: "PN2502"
      },
      {
        id: "p-2",
        binLocation: "C-05-1",
        productName: "Metformin 500 SR",
        pack: "10 tab",
        billedBatch: "MF2511",
        expiryDate: "11/27",
        qty: 200,
        freeQty: "—",
        status: "picked",
        scannedBatch: "MF2511"
      },
      {
        id: "p-3",
        binLocation: "A-02-1",
        productName: "Azithromycin 500",
        pack: "3 tab",
        billedBatch: "AZ2412",
        expiryDate: "12/26",
        qty: 80,
        freeQty: 8,
        status: "mismatch",
        scannedBatch: "AZ2508",
        mismatchNote: "Scanned batch AZ2508 differs from billed batch AZ2412 (earlier expiry). Swap before sealing."
      },
      {
        id: "p-4",
        binLocation: "Cold Box 02",
        productName: "Insulin glargine pen",
        pack: "1 pen",
        billedBatch: "IG2507",
        expiryDate: "07/27",
        qty: 10,
        freeQty: "—",
        isColdChain: true,
        status: "pending"
      }
    ]
  },
  {
    id: "wave-2",
    trayId: "Tray 09",
    invoiceNo: "INV-25-50387",
    customerName: "City Care Pharmacy",
    linesCount: 18,
    totalUnits: 290,
    route: "Route 1 (Suresh)",
    vanAssigned: "Van KA-01-MJ-8812",
    weightKg: 9.8,
    boxesCount: 2,
    status: "picking",
    items: [
      {
        id: "p-201",
        binLocation: "B-01-4",
        productName: "Paracetamol 650 tab",
        pack: "15 tab",
        billedBatch: "PC2409",
        expiryDate: "09/27",
        qty: 120,
        freeQty: 12,
        status: "picked",
        scannedBatch: "PC2409"
      },
      {
        id: "p-202",
        binLocation: "B-03-2",
        productName: "Montelukast + Levocet 10",
        pack: "10 tab",
        billedBatch: "ML2503",
        expiryDate: "05/27",
        qty: 90,
        freeQty: 6,
        status: "pending"
      }
    ]
  },
  {
    id: "wave-3",
    trayId: "Tray 04",
    invoiceNo: "INV-25-50385",
    customerName: "Apollo Medics Hub",
    linesCount: 31,
    totalUnits: 450,
    route: "Route 2 (Mahesh)",
    vanAssigned: "Van KA-02-AB-3391",
    weightKg: 18.5,
    boxesCount: 4,
    status: "sealed",
    items: [
      {
        id: "p-301",
        binLocation: "D-02-3",
        productName: "Telmisartan 40",
        pack: "10 tab",
        billedBatch: "TL2411",
        expiryDate: "10/26",
        qty: 300,
        freeQty: 30,
        status: "picked",
        scannedBatch: "TL2411"
      }
    ]
  }
];

export default function WarehousePage() {
  const [waves, setWaves] = useState<PickWave[]>(SAMPLE_WAVES);
  const [selectedWaveId, setSelectedWaveId] = useState<string>("wave-1");
  const [activeFilter, setActiveFilter] = useState<"all" | "picking" | "checking" | "sealed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Barcode Scanning / Checker State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedWave = useMemo(() => {
    return waves.find((w) => w.id === selectedWaveId) || waves[0];
  }, [waves, selectedWaveId]);

  const filteredWaves = useMemo(() => {
    return waves.filter((w) => {
      const matchesSearch =
        w.trayId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.route.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "picking") return w.status === "picking";
      if (activeFilter === "checking") return w.status === "checking";
      if (activeFilter === "sealed") return w.status === "sealed";

      return true;
    });
  }, [waves, searchQuery, activeFilter]);

  // Handle Barcode Check Simulation
  const handleSimulateScan = () => {
    if (!barcodeInput.trim()) return;

    if (barcodeInput.toUpperCase().includes("AZ2412")) {
      // Corrected the mismatch
      setWaves((prev) =>
        prev.map((w) =>
          w.id === selectedWave.id
            ? {
                ...w,
                items: w.items.map((it) =>
                  it.id === "p-3"
                    ? { ...it, status: "picked", scannedBatch: "AZ2412", mismatchNote: undefined }
                    : it
                )
              }
            : w
        )
      );
      showToast("Batch AZ2412 verified successfully! Swapped with earlier-expiry stock.", "success");
      setBarcodeInput("");
      setShowScannerModal(false);
    } else {
      showToast(`Scanned: ${barcodeInput} — Item confirmed against Tray Pick List.`, "info");
      setBarcodeInput("");
    }
  };

  // Seal Box & Print e-Way Bill Label
  const handleSealAndPrint = () => {
    setWaves((prev) =>
      prev.map((w) =>
        w.id === selectedWave.id ? { ...w, status: "sealed" } : w
      )
    );
    showToast(`Boxes sealed for ${selectedWave.customerName}! e-Way bill consignment barcode & outer shipping label printed.`, "success");
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
                Warehouse Dispatch, Picking &amp; Checking
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Barcode className="w-3.5 h-3.5 text-blue-600" />
                Mobile Scanner &amp; Wave Picking
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Bin-sorted pick paths, batch-wise barcode scanning, cold-room box staging, and 2-hour order-to-dispatch SLA.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/billing"
              className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors"
            >
              ← Billed Invoices
            </Link>
            <Link
              href="/delivery"
              className="px-3 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              Van Delivery Manifest →
            </Link>
            <button
              onClick={() => setShowScannerModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-[#178582]" />
              <span>Barcode Check</span>
            </button>
            <button
              onClick={handleSealAndPrint}
              disabled={selectedWave.status === "sealed"}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors shadow-sm cursor-pointer ${
                selectedWave.status === "sealed"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#178582] text-white hover:bg-[#126b68] active:scale-95"
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Verify &amp; Seal ({selectedWave.boxesCount} Boxes)</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Order-to-Dispatch Median</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">1h 14m</div>
            <div className="text-[11px] text-gray-400 mt-0.5">SLA Target: &le; 2.0 hours</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Pick Accuracy (Scanning)</div>
            <div className="text-lg font-bold text-gray-900 mt-0.5">99.88%</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Zero wrong-batch dispatch</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Active Pick Trays</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">14 Trays</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Wave picking for 4 delivery routes</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Cold-Chain Staging</div>
            <div className="text-lg font-bold text-blue-700 mt-0.5">6 Insulated Boxes</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Packed last with ice-gel packs</div>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left Trays Queue, Right Tray Checker */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Trays & Waves List */}
        <div className="w-full lg:w-[360px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfcfd] flex flex-col max-h-[260px] lg:max-h-full">
          
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer text-center ${
                  activeFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Trays
              </button>
              <button
                onClick={() => setActiveFilter("checking")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer text-center ${
                  activeFilter === "checking" ? "bg-white text-amber-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Checking
              </button>
              <button
                onClick={() => setActiveFilter("picking")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer text-center ${
                  activeFilter === "picking" ? "bg-white text-blue-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Picking
              </button>
              <button
                onClick={() => setActiveFilter("sealed")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer text-center ${
                  activeFilter === "sealed" ? "bg-white text-emerald-800 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sealed
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredWaves.map((wave) => {
              const isSelected = wave.id === selectedWaveId;
              return (
                <div
                  key={wave.id}
                  onClick={() => setSelectedWaveId(wave.id)}
                  className={`p-3.5 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white border-2 border-[#178582] shadow-md ring-1 ring-[#178582]/20"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{wave.trayId}</h3>
                      <span className="font-mono text-xs text-gray-400">· {wave.invoiceNo}</span>
                    </div>
                    {wave.status === "checking" && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase">
                        Checking
                      </span>
                    )}
                    {wave.status === "picking" && (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded uppercase">
                        Picking
                      </span>
                    )}
                    {wave.status === "sealed" && (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase">
                        Sealed ✓
                      </span>
                    )}
                  </div>

                  <p className="font-semibold text-gray-800 text-xs mb-1">{wave.customerName}</p>
                  <p className="text-[11px] text-gray-500 mb-2">{wave.route} · {wave.vanAssigned}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
                    <span>{wave.linesCount} lines · {wave.totalUnits} units</span>
                    <span>{wave.boxesCount} boxes · {wave.weightKg} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Tray Verification & Pick Path Workspace */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          
          {/* Active Tray Summary Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Checking &amp; Verification — {selectedWave.trayId}
                </h2>
                <span className="font-mono text-xs sm:text-sm font-semibold text-gray-500">
                  {selectedWave.invoiceNo} · {selectedWave.customerName}
                </span>
                {selectedWave.isColdChainRequired && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    <Snowflake className="w-3 h-3 text-blue-600" /> Cold-Room Box Required
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Scan every SKU barcode before sealing. Pick path optimized by rack hierarchy: Aisle &rarr; Rack &rarr; Bin.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-gray-400">Consignment Weight</div>
              <div className="text-base sm:text-lg font-bold text-gray-900 font-mono">
                {selectedWave.weightKg} kg · {selectedWave.boxesCount} Boxes
              </div>
            </div>
          </div>

          {/* Alert if Mismatch Found */}
          {selectedWave.items.some((it) => it.status === "mismatch") && (
            <div className="bg-red-50 border-b border-red-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-700 font-medium">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Batch Mismatch Warning:</strong> Billed batch is <strong>AZ2412 (12/26 expiry)</strong>. Physical tray contains <strong>AZ2508</strong>. Swap with earlier-expiry batch from Bin A-02-1 before sealing.
                </span>
              </div>
              <button
                onClick={() => {
                  setBarcodeInput("AZ2412");
                  setShowScannerModal(true);
                }}
                className="underline text-red-800 hover:text-red-950 font-bold cursor-pointer shrink-0"
              >
                Scan Correct Batch (AZ2412)
              </button>
            </div>
          )}

          {/* Verification Table */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-200 uppercase font-semibold text-[11px]">
                    <th className="pb-3 pr-3">Pick Bin</th>
                    <th className="pb-3 px-3">Product Description</th>
                    <th className="pb-3 px-3">Billed Batch</th>
                    <th className="pb-3 px-3">Expiry</th>
                    <th className="pb-3 px-3">Billed Qty</th>
                    <th className="pb-3 px-3">Free Qty</th>
                    <th className="pb-3 px-3">Verification Scan</th>
                    <th className="pb-3 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-900 font-medium">
                {selectedWave.items.map((item) => {
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Pick Bin */}
                      <td className="py-3 font-mono font-bold text-gray-900">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                          {item.binLocation}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="py-3">
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <span>{item.productName}</span>
                          {item.isColdChain && (
                            <Snowflake className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-normal">Pack: {item.pack}</div>
                      </td>

                      {/* Billed Batch */}
                      <td className="py-3 font-mono font-bold text-gray-900">
                        {item.billedBatch}
                      </td>

                      {/* Expiry */}
                      <td className="py-3 font-mono text-gray-600">
                        {item.expiryDate}
                      </td>

                      {/* Qty */}
                      <td className="py-3 font-mono font-bold text-gray-900">
                        {item.qty}
                      </td>

                      {/* Free */}
                      <td className="py-3 font-mono text-emerald-700">
                        {item.freeQty}
                      </td>

                      {/* Scanned Batch */}
                      <td className="py-3 font-mono">
                        {item.scannedBatch ? (
                          <span className={item.status === "mismatch" ? "text-red-600 font-bold" : "text-emerald-700 font-semibold"}>
                            {item.scannedBatch}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Pending scan</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 text-right">
                        {item.status === "picked" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Verified
                          </span>
                        )}
                        {item.status === "mismatch" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-300">
                            Wrong Batch
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Cold Box
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>

          {/* Footer Bar: Boxes, Weight & Outer Consignment Label */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-600">
              <span>Boxes: <strong className="text-gray-900">{selectedWave.boxesCount}</strong></span>
              <span>Weight: <strong className="text-gray-900">{selectedWave.weightKg} kg</strong></span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Shipping label + e-way bill ready for printer
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/delivery"
                className="px-3.5 py-1.5 bg-[#0c2427] text-white hover:bg-[#153a3e] rounded font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Truck className="w-3.5 h-3.5 text-teal-400" />
                <span>Dispatch to Van →</span>
              </Link>
              <button
                onClick={() => showToast(`Thermal outer carton label printed for ${selectedWave.trayId}.`, "info")}
                className="px-3.5 py-1.5 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-white flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Box Label</span>
              </button>
              <button
                onClick={handleSealAndPrint}
                className="px-4 py-1.5 bg-[#178582] text-white rounded font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Seal Tray &amp; Stage for Van</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* BARCODE SCANNER MODAL */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <ScanLine className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Scan Product / Batch Barcode</h3>
                  <p className="text-xs text-gray-500">Warehouse scanner integration emulator</p>
                </div>
              </div>
              <button onClick={() => setShowScannerModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Enter Barcode or Batch String:
                </label>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="e.g. AZ2412 or 890104388129"
                  className="w-full border border-gray-300 rounded-md p-2.5 bg-white text-gray-900 font-mono font-bold focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-600">
                <div className="font-semibold text-gray-800 mb-1">Quick Test Actions:</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBarcodeInput("AZ2412")}
                    className="px-2.5 py-1 bg-white border border-gray-300 rounded text-[11px] font-mono text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    Set: AZ2412 (Correct)
                  </button>
                  <button
                    onClick={() => setBarcodeInput("AZ2508")}
                    className="px-2.5 py-1 bg-white border border-gray-300 rounded text-[11px] font-mono text-gray-800 hover:bg-gray-100 cursor-pointer"
                  >
                    Set: AZ2508 (Wrong)
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowScannerModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleSimulateScan}
                className="px-4 py-2 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Process Scan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
