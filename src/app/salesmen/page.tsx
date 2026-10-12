"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  QrCode,
  DollarSign,
  TrendingUp,
  Target,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  AlertTriangle,
  FileCheck2,
  Share2,
  Award,
  ChevronRight,
  ShieldCheck,
  Plus
} from "lucide-react";

interface BeatVisit {
  id: string;
  sequence: number;
  customerName: string;
  customerCode: string;
  type: string;
  distance: string;
  status: "completed" | "in_progress" | "pending" | "skipped";
  orderBooked?: number;
  collected?: number;
  dueAmount: number;
  usualOrderAmount: number;
  gpsCheckedInAt?: string;
  skipReason?: string;
  licenceStatus: "valid" | "renewal_due" | "blocked";
  licenceNote?: string;
}

interface SalesmanRecord {
  id: string;
  name: string;
  code: string;
  phone: string;
  assignedRoute: string;
  routeDay: string;
  monthlyTarget: number;
  achievedAmount: number;
  todayOrdersBooked: number;
  todayCollections: number;
  plannedVisits: number;
  completedVisits: number;
  productivityPercent: number;
  status: "on_beat" | "idle" | "completed";
  beatVisits: BeatVisit[];
}

const SAMPLE_SALESMEN: SalesmanRecord[] = [
  {
    id: "rep-1",
    name: "Ravi Kumar",
    code: "REP-04",
    phone: "+91 98451 90211",
    assignedRoute: "Route 3 (Central Commercial)",
    routeDay: "Thu, 8 Oct",
    monthlyTarget: 2800000,
    achievedAmount: 1708000, // 61%
    todayOrdersBooked: 160000,
    todayCollections: 48000,
    plannedVisits: 22,
    completedVisits: 9,
    productivityPercent: 78,
    status: "on_beat",
    beatVisits: [
      {
        id: "v-1",
        sequence: 10,
        customerName: "City Care Pharmacy",
        customerCode: "C-1980",
        type: "Retail Chemist",
        distance: "350 m away",
        status: "in_progress",
        dueAmount: 42300,
        usualOrderAmount: 28000,
        licenceStatus: "valid"
      },
      {
        id: "v-2",
        sequence: 11,
        customerName: "Janata Medical Store",
        customerCode: "C-1102",
        type: "Retail Chemist",
        distance: "750 m away",
        status: "pending",
        dueAmount: 18400,
        usualOrderAmount: 15000,
        licenceStatus: "renewal_due",
        licenceNote: "Licence renewal due in 12 days — collect renewal challan"
      },
      {
        id: "v-3",
        sequence: 12,
        customerName: "Arogya Clinic & Chemist",
        customerCode: "C-0914",
        type: "Clinic / Pharmacy",
        distance: "1.2 km away",
        status: "skipped",
        skipReason: "Blocked for overdue >45 days (₹86K) — payment recovery required",
        dueAmount: 86000,
        usualOrderAmount: 35000,
        licenceStatus: "blocked"
      },
      {
        id: "v-4",
        sequence: 9,
        customerName: "Sri Sai Medicals",
        customerCode: "C-2041",
        type: "Retail Chemist",
        distance: "0 m",
        status: "completed",
        gpsCheckedInAt: "10:12 AM (Lat 12.9716, Lng 77.5946)",
        orderBooked: 62480,
        collected: 24000,
        dueAmount: 184200,
        usualOrderAmount: 48000,
        licenceStatus: "valid"
      }
    ]
  },
  {
    id: "rep-2",
    name: "Suresh Gowda",
    code: "REP-02",
    phone: "+91 98452 77102",
    assignedRoute: "Route 1 (North Extension)",
    routeDay: "Thu, 8 Oct",
    monthlyTarget: 2400000,
    achievedAmount: 1680000, // 70%
    todayOrdersBooked: 125000,
    todayCollections: 38000,
    plannedVisits: 20,
    completedVisits: 14,
    productivityPercent: 82,
    status: "on_beat",
    beatVisits: []
  },
  {
    id: "rep-3",
    name: "Mahesh Sharma",
    code: "REP-05",
    phone: "+91 98453 11849",
    assignedRoute: "Route 2 (Old City Bazaar)",
    routeDay: "Thu, 8 Oct",
    monthlyTarget: 2200000,
    achievedAmount: 1100000, // 50%
    todayOrdersBooked: 95000,
    todayCollections: 22000,
    plannedVisits: 18,
    completedVisits: 8,
    productivityPercent: 68,
    status: "on_beat",
    beatVisits: []
  }
];

export default function SalesmenPage() {
  const [salesmen, setSalesmen] = useState<SalesmanRecord[]>(SAMPLE_SALESMEN);
  const [selectedRepId, setSelectedRepId] = useState<string>("rep-1");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals & State
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [activeVisit, setActiveVisit] = useState<BeatVisit | null>(null);
  const [orderAmountInput, setOrderAmountInput] = useState("27940");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "warning" | "info">("info");

  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const selectedRep = useMemo(() => {
    return salesmen.find((s) => s.id === selectedRepId) || salesmen[0];
  }, [salesmen, selectedRepId]);

  const targetPercent = useMemo(() => {
    if (!selectedRep) return 0;
    return Math.round((selectedRep.achievedAmount / selectedRep.monthlyTarget) * 100);
  }, [selectedRep]);

  // Handle GPS Check-in
  const handleGpsCheckIn = (visit: BeatVisit) => {
    setSalesmen((prev) =>
      prev.map((s) =>
        s.id === selectedRep.id
          ? {
              ...s,
              completedVisits: s.completedVisits + 1,
              beatVisits: s.beatVisits.map((v) =>
                v.id === visit.id
                  ? {
                      ...v,
                      status: "completed",
                      gpsCheckedInAt: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (GPS Verified ✓)`
                    }
                  : v
              )
            }
          : s
      )
    );
    showToast(`GPS Check-in recorded at ${visit.customerName}. Geo-fence perimeter validated.`, "success");
    setShowCheckInModal(false);
  };

  // Handle Booking Field Order
  const handleBookOrder = () => {
    const val = Number(orderAmountInput) || 0;
    setSalesmen((prev) =>
      prev.map((s) =>
        s.id === selectedRep.id
          ? {
              ...s,
              todayOrdersBooked: s.todayOrdersBooked + val,
              achievedAmount: s.achievedAmount + val
            }
          : s
      )
    );
    setShowOrderModal(false);
    showToast(`Order of ₹${val.toLocaleString("en-IN")} booked for ${activeVisit?.customerName}! Transmitted to Order Desk.`, "success");
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
      <header className="px-4 sm:px-8 py-6 bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Salesmen &amp; Beat Management
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Live GPS Geo-Fencing Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Field rep beat plans, GPS check-ins, order booking from history, and instant doorstep collection receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                showToast("Today's beat plan push-notified to salesmen mobile apps.", "info");
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#178582]" />
              <span>Broadcast Beat Plan</span>
            </button>
            <button
              onClick={() => {
                showToast("Salesman performance scorecard exported to Excel.", "success");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Productivity Report</span>
            </button>
          </div>
        </div>

        {/* Salesman Active Beat Banner Matching Page 8 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Field Representative</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">{selectedRep.name}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{selectedRep.assignedRoute}</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Beat Visits Completed</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
              {selectedRep.completedVisits} / {selectedRep.plannedVisits}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Productivity: {selectedRep.productivityPercent}%</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Orders Booked Today</div>
            <div className="text-base sm:text-lg font-bold text-[#178582] mt-0.5">
              ₹{(selectedRep.todayOrdersBooked / 100000).toFixed(1)} Lakh
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">Collections: ₹{(selectedRep.todayCollections / 1000).toFixed(0)}K</div>
          </div>
          <div className="bg-[#fbfcfd] p-3.5 rounded-lg border border-gray-200/80">
            <div className="text-xs text-gray-500 font-medium">Monthly Target (₹28L)</div>
            <div className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">{targetPercent}% Achieved</div>
            <div className="text-[11px] text-gray-500 mt-0.5">₹{(selectedRep.achievedAmount / 100000).toFixed(1)}L of ₹28L target</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: Field Reps List */}
        <div className="w-full lg:w-[320px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#fbfcfd] flex flex-col max-h-[220px] lg:max-h-full">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Field Force
            </h2>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Rep, Route..."
                className="pl-8 pr-3 py-1.5 w-full rounded-md border border-gray-200 text-xs focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {salesmen.map((rep) => {
              const isSelected = rep.id === selectedRepId;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedRepId(rep.id)}
                  className={`p-3 rounded-lg transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-white border-2 border-[#178582] shadow-sm ring-1 ring-[#178582]/20"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-xs">{rep.name}</h3>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded">
                      {rep.status === "on_beat" ? "On Beat" : "Idle"}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mb-1.5">{rep.assignedRoute}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">{rep.completedVisits}/{rep.plannedVisits} visits</span>
                    <span className="font-semibold text-gray-800">₹{(rep.todayOrdersBooked / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Salesman Beat Console Matching Page 8 */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
          
          {/* Header of Active Beat */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {selectedRep.routeDay} · {selectedRep.assignedRoute}
                </h2>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Hi, {selectedRep.name.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Beat plan with GPS check-in; visits without an order require logging a statutory reason.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
              <span className="text-gray-500">Visits: <strong className="text-gray-900">{selectedRep.completedVisits}/{selectedRep.plannedVisits}</strong></span>
              <span className="text-gray-500">Orders: <strong className="text-[#178582]">₹{(selectedRep.todayOrdersBooked / 100000).toFixed(1)}L</strong></span>
              <span className="text-gray-500">Collected: <strong className="text-emerald-700">₹{(selectedRep.todayCollections / 1000).toFixed(0)}K</strong></span>
            </div>
          </div>

          {/* Beat Visits List */}
          <div className="p-6 space-y-4 flex-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Beat Stops Sequence
            </h3>

            <div className="space-y-3">
              {selectedRep.beatVisits.map((visit) => {
                return (
                  <div
                    key={visit.id}
                    className={`p-4 rounded-xl border transition-all ${
                      visit.status === "in_progress"
                        ? "bg-white border-2 border-[#178582] shadow-sm ring-1 ring-[#178582]/20"
                        : visit.status === "completed"
                        ? "bg-gray-50/70 border-gray-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center">
                          {visit.sequence}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{visit.customerName}</h4>
                          <span className="text-xs text-gray-400 font-mono">{visit.customerCode} · {visit.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {visit.status === "in_progress" && (
                          <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Next on Beat · {visit.distance}
                          </span>
                        )}
                        {visit.status === "completed" && (
                          <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Visited ({visit.gpsCheckedInAt})
                          </span>
                        )}
                        {visit.status === "skipped" && (
                          <span className="text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                            Blocked · Overdue
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Due & Usual order figures */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-3 bg-gray-50 rounded-lg text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px]">Due Amount</span>
                        <div className="font-bold text-gray-900 font-mono">₹{visit.dueAmount.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px]">Usual Order Size</span>
                        <div className="font-bold text-gray-900 font-mono">₹{visit.usualOrderAmount.toLocaleString("en-IN")}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px]">Order Booked Today</span>
                        <div className="font-bold text-[#178582] font-mono">
                          {visit.orderBooked ? `₹${visit.orderBooked.toLocaleString("en-IN")}` : "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px]">Collected Today</span>
                        <div className="font-bold text-emerald-700 font-mono">
                          {visit.collected ? `₹${visit.collected.toLocaleString("en-IN")}` : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Warning note if applicable */}
                    {visit.licenceNote && (
                      <div className="mb-3 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{visit.licenceNote}</span>
                      </div>
                    )}
                    {visit.skipReason && (
                      <div className="mb-3 p-2 bg-red-50 rounded border border-red-200 text-xs text-red-800 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{visit.skipReason}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          showToast(`Navigation directed to ${visit.customerName}.`, "info");
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#178582]" />
                        <span>Navigate</span>
                      </button>

                      {visit.status === "in_progress" && (
                        <>
                          <button
                            onClick={() => {
                              setActiveVisit(visit);
                              setShowCheckInModal(true);
                            }}
                            className="px-3.5 py-1.5 border border-[#178582] text-[#178582] hover:bg-[#178582]/10 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>GPS Check In</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveVisit(visit);
                              setShowOrderModal(true);
                            }}
                            className="px-4 py-1.5 bg-[#178582] text-white rounded text-xs font-semibold hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Book Order</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target Progress Bar Matching Page 8 */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-gray-900">Month target: ₹28L</span>
                <span className="text-gray-500 ml-2">· Achieved: {targetPercent}%</span>
              </div>
              <div className="w-full sm:w-64 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#178582] rounded-full" style={{ width: `${targetPercent}%` }} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* GPS CHECK IN MODAL */}
      {showCheckInModal && activeVisit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">GPS Geo-Fence Check-In</h3>
                  <p className="text-xs text-gray-500">Validate physical field visit at {activeVisit.customerName}</p>
                </div>
              </div>
              <button onClick={() => setShowCheckInModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer Location:</span>
                  <span className="font-bold text-gray-900">{activeVisit.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Device Coordinates:</span>
                  <span className="font-mono text-gray-800">12.9716° N, 77.5946° E</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Geo-Fence Status:</span>
                  <span className="font-bold">Inside Store Perimeter (15 m) ✓</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowCheckInModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGpsCheckIn(activeVisit)}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Confirm GPS Check-in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK ORDER MODAL MATCHING PAGE 8 */}
      {showOrderModal && activeVisit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 border border-gray-200 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Book Order · {activeVisit.customerName}</h3>
                <p className="text-xs text-gray-500">Order from purchase history with inline schemes &amp; live credit check</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-blue-900">
                <span className="font-bold">Suggested from purchase history:</span> 14 items usually ordered every Thursday
              </div>

              <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <div>
                    <div className="font-bold text-gray-900">Pantoprazole 40 (15 tab)</div>
                    <div className="text-[11px] text-gray-400 font-mono">PTR ₹98.10 · Stock ✓ · Scheme 10+1</div>
                  </div>
                  <span className="font-mono font-bold text-gray-800">50 strips</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div>
                    <div className="font-bold text-gray-900">Metformin 500 SR (10 tab)</div>
                    <div className="text-[11px] text-gray-400 font-mono">PTR ₹21.30 · Stock ✓</div>
                  </div>
                  <span className="font-mono font-bold text-gray-800">100 strips</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Calculated Order Total (₹)</label>
                <input
                  type="number"
                  value={orderAmountInput}
                  onChange={(e) => setOrderAmountInput(e.target.value)}
                  className="w-full font-mono font-bold text-base border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:ring-2 focus:ring-[#178582] focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center text-xs">
                <span className="text-gray-500">Credit check: ₹2.1L of ₹2.5L used</span>
                <span className="font-semibold text-emerald-700">Near Limit · Approved ✓</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBookOrder}
                className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-sm"
              >
                Place Order · ₹{Number(orderAmountInput).toLocaleString("en-IN")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
