"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Building,
  ArrowRight,
  FileText,
  Layers,
  Sparkles,
  Printer,
  Share2,
  Check,
  X,
  ChevronDown,
  Info,
  Eye,
  FileCheck,
  ThermometerSnowflake,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Table as TableIcon
} from "lucide-react";

// --- INTERFACES ---
interface KpiItem {
  id: string;
  name: string;
  definition: string;
  owner: "Purchase" | "Warehouse" | "Owner" | "Claims" | "Accounts" | "Sales head";
  currentValue: string;
  target: string;
  trend: "up" | "down" | "neutral";
  status: "good" | "warning" | "critical";
  formulaExplanation: string;
  historicalTrend: { month: string; value: string }[];
  actionRecommendation: string;
}

interface ReportDescriptor {
  id: string;
  category: "Standard statutory" | "Commercial & Sales" | "Stock & Supply";
  title: string;
  description: string;
  frequency: "Daily" | "Monthly" | "Real-time" | "On-demand";
  format: "Excel / PDF" | "JSON / GSTR" | "FDA Register";
  lastGenerated: string;
  recordCount: number;
}

// --- MOCK KPI DATA (PAGE 12 BLUEPRINT) ---
const KPIS_DATA: KpiItem[] = [
  {
    id: "k-1",
    name: "Fill rate",
    definition: "Lines supplied in full ÷ lines ordered",
    owner: "Purchase",
    currentValue: "96.1%",
    target: "≥ 95%",
    trend: "up",
    status: "good",
    formulaExplanation: "Total order line items dispatched without stock-out cut divided by total order line items placed by chemists across all booking channels.",
    historicalTrend: [
      { month: "Jun", value: "93.4%" },
      { month: "Jul", value: "94.8%" },
      { month: "Aug", value: "95.2%" },
      { month: "Sep", value: "95.7%" },
      { month: "Oct", value: "96.1%" }
    ],
    actionRecommendation: "Buffer stock maintained on top 200 fast-moving molecules. Maintain lead time tracking with Cipla and Sun Pharma."
  },
  {
    id: "k-2",
    name: "Order-to-dispatch",
    definition: "Order received → van loaded (median)",
    owner: "Warehouse",
    currentValue: "1h 14m",
    target: "≤ 2 h",
    trend: "down",
    status: "good",
    formulaExplanation: "Median duration elapsed from order approval on the Order Desk to final barcode-scanned invoice box packing and loading onto delivery vehicle.",
    historicalTrend: [
      { month: "Jun", value: "1h 48m" },
      { month: "Jul", value: "1h 32m" },
      { month: "Aug", value: "1h 25m" },
      { month: "Sep", value: "1h 19m" },
      { month: "Oct", value: "1h 14m" }
    ],
    actionRecommendation: "Wave picking trays and rack-sequence routing have slashed picker travel distance by 34%."
  },
  {
    id: "k-3",
    name: "Pick accuracy",
    definition: "Lines without wrong item / batch / qty",
    owner: "Warehouse",
    currentValue: "99.88%",
    target: "≥ 99.8%",
    trend: "up",
    status: "good",
    formulaExplanation: "Total lines audited at the packing checker table without any barcode mismatch or FEFO batch substitution error.",
    historicalTrend: [
      { month: "Jun", value: "99.4%" },
      { month: "Jul", value: "99.6%" },
      { month: "Aug", value: "99.75%" },
      { month: "Sep", value: "99.82%" },
      { month: "Oct", value: "99.88%" }
    ],
    actionRecommendation: "2D DataMatrix scanning at checking table blocks mismatched batch packaging automatically."
  },
  {
    id: "k-4",
    name: "Stock turns",
    definition: "Annual COGS ÷ average stock at PTS",
    owner: "Owner",
    currentValue: "10.4×",
    target: "≥ 10×",
    trend: "up",
    status: "good",
    formulaExplanation: "Cost of Goods Sold over trailing 12 months divided by average warehouse inventory valuation at Price to Stockist (PTS).",
    historicalTrend: [
      { month: "Jun", value: "9.2×" },
      { month: "Jul", value: "9.6×" },
      { month: "Aug", value: "9.9×" },
      { month: "Sep", value: "10.1×" },
      { month: "Oct", value: "10.4×" }
    ],
    actionRecommendation: "Working capital turnover is optimal. Ensure slow-moving (>60 days cover) SKUs are reviewed bi-weekly."
  },
  {
    id: "k-5",
    name: "Days of stock",
    definition: "Stock value ÷ avg daily COGS",
    owner: "Purchase",
    currentValue: "28 days",
    target: "25–35 d",
    trend: "neutral",
    status: "good",
    formulaExplanation: "Total inventory value at PTS divided by average daily Cost of Goods Sold over the last 30 operational days.",
    historicalTrend: [
      { month: "Jun", value: "34 d" },
      { month: "Jul", value: "31 d" },
      { month: "Aug", value: "29 d" },
      { month: "Sep", value: "27 d" },
      { month: "Oct", value: "28 d" }
    ],
    actionRecommendation: "Healthy buffer cover across all 5 major principals without risk of overstocking or cash lockup."
  },
  {
    id: "k-6",
    name: "Expiry loss %",
    definition: "Unrecovered expiry value ÷ sales",
    owner: "Claims",
    currentValue: "0.22%",
    target: "< 0.3%",
    trend: "down",
    status: "good",
    formulaExplanation: "Total net debit loss from unsaleable near-expiry stock after deducting principal credit notes, divided by gross sales turnover.",
    historicalTrend: [
      { month: "Jun", value: "0.38%" },
      { month: "Jul", value: "0.32%" },
      { month: "Aug", value: "0.29%" },
      { month: "Sep", value: "0.25%" },
      { month: "Oct", value: "0.22%" }
    ],
    actionRecommendation: "Automated near-expiry allocation to high-volume hospital accounts 90 days before expiry date."
  },
  {
    id: "k-7",
    name: "DSO (Days Sales Outstanding)",
    definition: "Receivables ÷ avg daily credit sales",
    owner: "Accounts",
    currentValue: "24.6 days",
    target: "≤ 30 d",
    trend: "down",
    status: "good",
    formulaExplanation: "Total outstanding trade receivables divided by average daily credit sales over the rolling 90-day cycle.",
    historicalTrend: [
      { month: "Jun", value: "31.2 d" },
      { month: "Jul", value: "28.5 d" },
      { month: "Aug", value: "26.8 d" },
      { month: "Sep", value: "25.2 d" },
      { month: "Oct", value: "24.6 d" }
    ],
    actionRecommendation: "Early payment cash discount schemes (1.5% in 7 days) and digital UPI collection at delivery have reduced DSO."
  },
  {
    id: "k-8",
    name: "Overdue %",
    definition: "Receivables past terms ÷ total receivables",
    owner: "Accounts",
    currentValue: "13.4%",
    target: "< 10%",
    trend: "up",
    status: "warning",
    formulaExplanation: "Receivable balances exceeding chemist credit terms (typically 21–30 days) divided by total gross ledger outstanding.",
    historicalTrend: [
      { month: "Jun", value: "9.8%" },
      { month: "Jul", value: "10.4%" },
      { month: "Aug", value: "11.2%" },
      { month: "Sep", value: "12.7%" },
      { month: "Oct", value: "13.4%" }
    ],
    actionRecommendation: "17 chemists currently exceed 45 days. Strict auto-blocking is enforced on fresh order creation until settlement."
  },
  {
    id: "k-9",
    name: "Claim recovery",
    definition: "Claims settled ÷ claims raised (value)",
    owner: "Claims",
    currentValue: "92.5%",
    target: "≥ 90%",
    trend: "up",
    status: "good",
    formulaExplanation: "Total rupees recovered via principal credit notes divided by total gross claims lodged (breakage, expiry, hospital rate diff, schemes).",
    historicalTrend: [
      { month: "Jun", value: "86.0%" },
      { month: "Jul", value: "88.5%" },
      { month: "Aug", value: "90.1%" },
      { month: "Sep", value: "91.8%" },
      { month: "Oct", value: "92.5%" }
    ],
    actionRecommendation: "Electronic proof submission with batch photos has eliminated manufacturer dispute delays."
  },
  {
    id: "k-10",
    name: "Net margin %",
    definition: "Section 10 true margin by product / customer",
    owner: "Owner",
    currentValue: "9.8%",
    target: "Trend up",
    trend: "up",
    status: "good",
    formulaExplanation: "True gross trade margin plus scheme reimbursements and early settlement discounts, minus interest carrying cost, delivery expenses, and bad debts.",
    historicalTrend: [
      { month: "Jun", value: "8.9%" },
      { month: "Jul", value: "9.2%" },
      { month: "Aug", value: "9.4%" },
      { month: "Sep", value: "9.6%" },
      { month: "Oct", value: "9.8%" }
    ],
    actionRecommendation: "Higher share of chronic therapies (cardiac/diabetic) yielding better margin stability."
  },
  {
    id: "k-11",
    name: "Salesman productivity",
    definition: "Productive calls ÷ planned calls; sales per call",
    owner: "Sales head",
    currentValue: "78.0%",
    target: "≥ 70%",
    trend: "up",
    status: "good",
    formulaExplanation: "Number of chemist visits resulting in an active order divided by total scheduled beat plan visits for the month.",
    historicalTrend: [
      { month: "Jun", value: "69.5%" },
      { month: "Jul", value: "72.0%" },
      { month: "Aug", value: "74.8%" },
      { month: "Sep", value: "76.4%" },
      { month: "Oct", value: "78.0%" }
    ],
    actionRecommendation: "Sales rep tablet app displays chemist's unpurchased SKU churn alerts during physical visit."
  },
  {
    id: "k-12",
    name: "App order share",
    definition: "Orders from chemist app ÷ all orders",
    owner: "Owner",
    currentValue: "26.0%",
    target: "Grow monthly",
    trend: "up",
    status: "good",
    formulaExplanation: "Digital self-service orders booked directly by chemists via Chemist B2B mobile portal as a percentage of total order volume.",
    historicalTrend: [
      { month: "Jun", value: "14.2%" },
      { month: "Jul", value: "18.0%" },
      { month: "Aug", value: "21.5%" },
      { month: "Sep", value: "23.8%" },
      { month: "Oct", value: "26.0%" }
    ],
    actionRecommendation: "Night-time booking bonus incentive program driving significant adoption among busy high-volume chemists."
  }
];

// --- MOCK STANDARD REGISTERS (PAGE 12 BLUEPRINT) ---
const STANDARD_REPORTS: ReportDescriptor[] = [
  {
    id: "rep-1",
    category: "Commercial & Sales",
    title: "Stock & sales statement per principal (monthly)",
    description: "Standard pharmaceutical principal audit statement: opening stock, purchases, sales at PTS/PTR, closing stock, and free goods.",
    frequency: "Monthly",
    format: "Excel / PDF",
    lastGenerated: "01 Oct 2026",
    recordCount: 142
  },
  {
    id: "rep-2",
    category: "Commercial & Sales",
    title: "Party-wise outstanding & ageing report",
    description: "Comprehensive 0-15d, 16-30d, 31-45d, and >45d breakdown with auto-blocked credit accounts.",
    frequency: "Daily",
    format: "Excel / PDF",
    lastGenerated: "Today 09:00 AM",
    recordCount: 284
  },
  {
    id: "rep-3",
    category: "Commercial & Sales",
    title: "Salesman & route productivity performance",
    description: "Beat plan strike rates, visits per salesman, daily orders booked, and collection efficiency.",
    frequency: "Daily",
    format: "Excel / PDF",
    lastGenerated: "Today 10:30 AM",
    recordCount: 8
  },
  {
    id: "rep-4",
    category: "Stock & Supply",
    title: "Near-expiry & non-moving stock register",
    description: "Batches expiring in 0-90 days, slow movers with >60 days cover, and hospital return allocations.",
    frequency: "Daily",
    format: "Excel / PDF",
    lastGenerated: "Today 08:00 AM",
    recordCount: 36
  },
  {
    id: "rep-5",
    category: "Commercial & Sales",
    title: "Scheme & claim register (Principal-wise)",
    description: "Free goods pass-on, institutional hospital tender rate differences, and debit note tracking.",
    frequency: "Monthly",
    format: "Excel / PDF",
    lastGenerated: "Yesterday",
    recordCount: 19
  },
  {
    id: "rep-6",
    category: "Standard statutory",
    title: "GSTR-1 / GSTR-3B data & purchase register",
    description: "Government-compliant GST e-invoice IRN data, B2B sales register, and HSN Table 12 summary.",
    frequency: "Monthly",
    format: "JSON / GSTR",
    lastGenerated: "05 Oct 2026",
    recordCount: 418
  },
  {
    id: "rep-7",
    category: "Standard statutory",
    title: "Schedule H1 & narcotics sales registers",
    description: "Statutory drug inspector register under Drugs & Cosmetics Rules with batch numbers, doctor names, and patient IDs.",
    frequency: "Real-time",
    format: "FDA Register",
    lastGenerated: "Real-time",
    recordCount: 94
  },
  {
    id: "rep-8",
    category: "Standard statutory",
    title: "Customer drug licence expiry tracking list",
    description: "State FDA Retail Chemist DL 20B/21B validities with 30-day renewal warnings.",
    frequency: "Monthly",
    format: "Excel / PDF",
    lastGenerated: "08 Oct 2026",
    recordCount: 42
  }
];

// --- MOCK DETAILED REGISTER DATA FOR INTERACTIVE PREVIEW MODAL ---

// 1. Schedule H1 Register Sample Rows
const SCHEDULE_H1_ROWS = [
  {
    date: "12-Oct-2026",
    invoiceNo: "INV-26-8812",
    chemistName: "Apollo Pharmacy - Civil Lines",
    chemistDl: "DL-20B-184920 / 21B-184921",
    drugName: "Azithromycin 500mg Tab",
    batchNo: "AZ-9812",
    qty: 100,
    doctorName: "Dr. Arvind Mehta, MD",
    docRegNo: "MCI-48190-DEL",
    patientName: "Sunil Verma",
    address: "B-42 Civil Lines, Delhi"
  },
  {
    date: "12-Oct-2026",
    invoiceNo: "INV-26-8814",
    chemistName: "Sanjivani Medicos",
    chemistDl: "DL-20B-229104 / 21B-229105",
    drugName: "Cefixime 200mg DT",
    batchNo: "CF-5541",
    qty: 50,
    doctorName: "Dr. K. S. Rathore, MS",
    docRegNo: "MCI-19342-UP",
    patientName: "Rekha Sharma",
    address: "Shop 14, Main Market, Agra"
  },
  {
    date: "11-Oct-2026",
    invoiceNo: "INV-26-8809",
    chemistName: "MedPlus Chemist - Sector 18",
    chemistDl: "DL-20B-901824 / 21B-901825",
    drugName: "Zolpidem 10mg Tab (Narcotic Sch H1)",
    batchNo: "ZP-2201",
    qty: 30,
    doctorName: "Dr. Priya Sengupta, MD (Psych)",
    docRegNo: "MCI-88410-WB",
    patientName: "Amitabh Sen",
    address: "Flat 402, Green Park, Noida"
  },
  {
    date: "11-Oct-2026",
    invoiceNo: "INV-26-8803",
    chemistName: "LifeCare Chemist Hub",
    chemistDl: "DL-20B-771923 / 21B-771924",
    drugName: "Levofloxacin 500mg Tab",
    batchNo: "LV-4490",
    qty: 80,
    doctorName: "Dr. N. K. Bansal, MD",
    docRegNo: "MCI-33109-DEL",
    patientName: "Geeta Rani",
    address: "C-11 East Patel Nagar, Delhi"
  },
  {
    date: "10-Oct-2026",
    invoiceNo: "INV-26-8798",
    chemistName: "City Care Pharmacy",
    chemistDl: "DL-20B-339182 / 21B-339183",
    drugName: "Alprazolam 0.5mg Tab",
    batchNo: "AL-1109",
    qty: 40,
    doctorName: "Dr. Rajeshwar Singh, DPM",
    docRegNo: "MCI-66219-UP",
    patientName: "Mohd. Asif",
    address: "24/B Railway Colony, Lucknow"
  }
];

// 2. Stock & Sales Statement Rows
const STOCK_SALES_ROWS = [
  {
    principal: "Cipla Ltd",
    sku: "Budecort 0.5mg Respules (Pack of 5)",
    openingQty: 450,
    receivedQty: 600,
    salesQty: 720,
    freeQty: 30,
    closingQty: 300,
    ptsValue: 88500,
    ptrValue: 101775,
    coverDays: 14
  },
  {
    principal: "Cipla Ltd",
    sku: "Foracort 200 Inhaler 120 MDI",
    openingQty: 180,
    receivedQty: 250,
    salesQty: 290,
    freeQty: 0,
    closingQty: 140,
    ptsValue: 56700,
    ptrValue: 65205,
    coverDays: 16
  },
  {
    principal: "Sun Pharma",
    sku: "Rosuvas 10mg Tab (Strip of 15)",
    openingQty: 800,
    receivedQty: 1200,
    salesQty: 1450,
    freeQty: 72,
    closingQty: 478,
    ptsValue: 124280,
    ptrValue: 142922,
    coverDays: 11
  },
  {
    principal: "Sun Pharma",
    sku: "Volini Gel 50g Tube",
    openingQty: 320,
    receivedQty: 500,
    salesQty: 560,
    freeQty: 28,
    closingQty: 232,
    ptsValue: 33640,
    ptrValue: 38686,
    coverDays: 13
  },
  {
    principal: "Abbott Healthcare",
    sku: "Thyronorm 50mcg Tab (120s)",
    openingQty: 550,
    receivedQty: 800,
    salesQty: 910,
    freeQty: 0,
    closingQty: 440,
    ptsValue: 79200,
    ptrValue: 91080,
    coverDays: 15
  },
  {
    principal: "GlaxoSmithKline (GSK)",
    sku: "Augmentin 625 Duo Tab (10s)",
    openingQty: 620,
    receivedQty: 1500,
    salesQty: 1840,
    freeQty: 92,
    closingQty: 188,
    ptsValue: 34780,
    ptrValue: 39997,
    coverDays: 3
  }
];

// 3. GSTR-1 Sales Register Sample Rows
const GSTR1_ROWS = [
  {
    invoiceNo: "INV-26-8812",
    date: "12-Oct-2026",
    customerGstin: "07AAAAA0000A1Z5",
    partyName: "Apollo Pharmacy - Civil Lines",
    taxableVal: 48500.0,
    cgst: 2910.0,
    sgst: 2910.0,
    igst: 0.0,
    totalVal: 54320.0,
    irnStatus: "Generated (NIC)",
    hsn: "300420"
  },
  {
    invoiceNo: "INV-26-8814",
    date: "12-Oct-2026",
    customerGstin: "09BBBBB1111B2Z6",
    partyName: "Sanjivani Medicos",
    taxableVal: 22400.0,
    cgst: 1344.0,
    sgst: 1344.0,
    igst: 0.0,
    totalVal: 25088.0,
    irnStatus: "Generated (NIC)",
    hsn: "300410"
  },
  {
    invoiceNo: "INV-26-8809",
    date: "11-Oct-2026",
    customerGstin: "19CCCCC2222C3Z7",
    partyName: "MedPlus Chemist - Sector 18",
    taxableVal: 18250.0,
    cgst: 0.0,
    sgst: 0.0,
    igst: 2190.0,
    totalVal: 20440.0,
    irnStatus: "Generated (NIC)",
    hsn: "300490"
  },
  {
    invoiceNo: "INV-26-8803",
    date: "11-Oct-2026",
    customerGstin: "07DDDDD3333D4Z8",
    partyName: "LifeCare Chemist Hub",
    taxableVal: 35600.0,
    cgst: 2136.0,
    sgst: 2136.0,
    igst: 0.0,
    totalVal: 39872.0,
    irnStatus: "Generated (NIC)",
    hsn: "300420"
  }
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"kpi" | "reports" | "alerts" | "coldchain">("kpi");
  const [searchQuery, setSearchQuery] = useState("");
  const [kpiOwnerFilter, setKpiOwnerFilter] = useState<string>("All");
  const [reportCategoryFilter, setReportCategoryFilter] = useState<string>("All");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("October 2026");

  // Selected modals
  const [viewingKpi, setViewingKpi] = useState<KpiItem | null>(null);
  const [viewingReport, setViewingReport] = useState<ReportDescriptor | null>(null);
  const [showAuditPackModal, setShowAuditPackModal] = useState(false);

  // In-app Notification Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("info");

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered KPI list
  const filteredKpis = useMemo(() => {
    return KPIS_DATA.filter((k) => {
      const matchesSearch =
        k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOwner = kpiOwnerFilter === "All" || k.owner === kpiOwnerFilter;
      return matchesSearch && matchesOwner;
    });
  }, [searchQuery, kpiOwnerFilter]);

  // Filtered Reports list
  const filteredReports = useMemo(() => {
    return STANDARD_REPORTS.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = reportCategoryFilter === "All" || r.category === reportCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, reportCategoryFilter]);

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
      <header className="px-4 sm:px-8 py-5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                KPI Dictionary &amp; Statutory Reports
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Live Pharma BI &amp; FDA Registers
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Distribution executive metrics (Page 12 Blueprint): SLA benchmarks, Schedule H1 drug inspector audits, Principal stock statements &amp; GSTR registers.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Period Selector */}
            <div className="relative">
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582]/30 cursor-pointer shadow-xs"
              >
                <option value="Today">Today (12-Oct-2026)</option>
                <option value="This Week">This Week</option>
                <option value="October 2026">October 2026 (Current Month)</option>
                <option value="September 2026">September 2026 (Last Month)</option>
                <option value="Q3 FY 2026-27">Q3 FY 2026-27</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Export Audit Pack */}
            <button
              onClick={() => setShowAuditPackModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-700 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#178582]" />
              <span>Export Audit Pack</span>
            </button>

            {/* Send Daily MIS */}
            <button
              onClick={() => {
                showToast("WhatsApp MIS digest dispatched to Owner & Management phone numbers.", "success");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Daily MIS (9 AM)</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs & Filters */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mt-5 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap space-x-1 bg-gray-100 p-1 rounded-lg w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("kpi")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "kpi" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              KPI Dictionary (12 Core Metrics)
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "reports" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Standard Registers (8 Reports)
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "alerts" ? "bg-white text-red-700 shadow-sm font-bold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Statutory Alerts (Live Feed)
            </button>
            <button
              onClick={() => setActiveTab("coldchain")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "coldchain" ? "bg-white text-blue-700 shadow-sm font-bold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cold-Chain Log (GDP 2–8°C)
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {activeTab === "kpi" && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Owner:</span>
                <select
                  value={kpiOwnerFilter}
                  onChange={(e) => setKpiOwnerFilter(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-1 px-2 rounded focus:outline-none focus:ring-1 focus:ring-[#178582] cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  <option value="Owner">Owner</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Accounts">Accounts</option>
                  <option value="Claims">Claims</option>
                  <option value="Sales head">Sales Head</option>
                </select>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span>Category:</span>
                <select
                  value={reportCategoryFilter}
                  onChange={(e) => setReportCategoryFilter(e.target.value)}
                  className="bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-1 px-2 rounded focus:outline-none focus:ring-1 focus:ring-[#178582] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Standard statutory">Standard Statutory (FDA/GST)</option>
                  <option value="Commercial & Sales">Commercial &amp; Sales</option>
                  <option value="Stock & Supply">Stock &amp; Supply</option>
                </select>
              </div>
            )}

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search KPI, register, or SLA..."
                className="pl-9 pr-7 py-1.5 w-full rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/20 focus:border-[#178582] bg-white text-gray-900 placeholder:text-gray-400 font-medium"
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
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">

        {/* VIEW 1: KPI DICTIONARY TABLE (PAGE 12 BLUEPRINT) */}
        {activeTab === "kpi" && (
          <div className="space-y-6">
            {/* Quick KPI Highlight Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fill Rate</span>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 font-mono mt-0.5">96.1%</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Target ≥ 95%
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Order-to-Dispatch</span>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 font-mono mt-0.5">1h 14m</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3" /> Target ≤ 2 hrs
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Receivables DSO</span>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 font-mono mt-0.5">24.6 days</div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <Check className="w-3 h-3" /> Target ≤ 30 d
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between bg-amber-50/20">
                <div>
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Overdue &gt; Terms</span>
                  <div className="text-xl sm:text-2xl font-bold text-amber-900 font-mono mt-0.5">13.4%</div>
                  <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3" /> Target &lt; 10% (17 Blocked)
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Full KPI Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#178582]" />
                  <h3 className="font-bold text-sm text-gray-900">
                    Distribution Mathematical Metrics ({filteredKpis.length} defined)
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Click any metric row to drill into formula breakdown &amp; historical trend
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">KPI Name</th>
                      <th className="py-3 px-4">Mathematical Definition</th>
                      <th className="py-3 px-4">Functional Owner</th>
                      <th className="py-3 px-4">Current Value</th>
                      <th className="py-3 px-4">Target Benchmark</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Drilldown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-900 font-medium">
                    {filteredKpis.map((kpi) => (
                      <tr
                        key={kpi.id}
                        onClick={() => setViewingKpi(kpi)}
                        className="hover:bg-teal-50/40 transition-colors cursor-pointer group"
                      >
                        {/* Name */}
                        <td className="py-3.5 px-4 font-bold text-gray-900 text-sm group-hover:text-[#178582] flex items-center gap-2">
                          <span>{kpi.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#178582] transition-transform group-hover:translate-x-0.5" />
                        </td>

                        {/* Definition */}
                        <td className="py-3.5 px-4 text-gray-600 font-mono text-[11px] max-w-xs truncate">
                          {kpi.definition}
                        </td>

                        {/* Owner */}
                        <td className="py-3.5 px-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-gray-200">
                            {kpi.owner}
                          </span>
                        </td>

                        {/* Current Value */}
                        <td className="py-3.5 px-4 font-mono font-bold text-sm text-gray-900">
                          {kpi.currentValue}
                        </td>

                        {/* Target */}
                        <td className="py-3.5 px-4 font-mono text-gray-700 font-semibold">
                          {kpi.target}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {kpi.status === "good" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" /> On Target
                            </span>
                          )}
                          {kpi.status === "warning" && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-600" /> Action Required
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingKpi(kpi);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#178582] bg-teal-50 hover:bg-[#178582] hover:text-white rounded border border-teal-200 transition-colors cursor-pointer"
                          >
                            View Formula
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: STANDARD REPORTS & REGISTERS (PAGE 12 BLUEPRINT) */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between hover:border-[#178582]/50 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          report.category === "Standard statutory"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : report.category === "Stock & Supply"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {report.category}
                      </span>
                      <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                        Freq: {report.frequency}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center justify-between">
                      <span>{report.title}</span>
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {report.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-gray-400 text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>Last: {report.lastGenerated}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-semibold text-gray-600">{report.recordCount} records</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Interactive View Button */}
                      <button
                        onClick={() => setViewingReport(report)}
                        className="px-3 py-1.5 bg-[#178582] text-white rounded font-semibold text-xs hover:bg-[#126b68] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Register</span>
                      </button>

                      {/* Quick Download Button */}
                      <button
                        onClick={() => {
                          showToast(`Exported ${report.title} (${report.format}) successfully.`, "success");
                        }}
                        className="px-3 py-1.5 border border-gray-200 rounded font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        title="Quick Export"
                      >
                        <Download className="w-3.5 h-3.5 text-[#178582]" />
                        <span>{report.format.split(" ")[0]}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: LIVE STATUTORY ALERTS FEED (PAGE 12 BLUEPRINT) */}
        {activeTab === "alerts" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Active Statutory &amp; Inventory Alerts (Page 12 Blueprint)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Automated trigger rules defined in the pharma distribution specification.
                </p>
              </div>
              <button
                onClick={() => showToast("All system sensors and inventory rules refreshed.", "info")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer w-fit"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                <span>Refresh Rules</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Alert 1: Fast-mover cover */}
              <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-red-950 text-sm">Fast-mover below 3 days cover:</div>
                    <div className="text-red-900 mt-1 leading-relaxed">
                      <strong>Augmentin 625 Duo Tab (GSK)</strong> &amp; <strong>Amoxicillin + Clav 625</strong> have only <strong>1.3 days cover remaining</strong> (120 in stock, demand 95/day).
                    </div>
                    <div className="text-red-700 text-[11px] mt-1 font-medium">
                      Trigger rule: Cover days &lt; 3 → Instant replenishment recommendation
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast("PO draft PO-2026-1049 for 1,650 strips prepared for GSK.", "success")}
                  className="px-3.5 py-1.5 bg-red-700 text-white font-semibold rounded-md hover:bg-red-800 transition-colors cursor-pointer shrink-0 w-fit"
                >
                  Generate Emergency PO
                </button>
              </div>

              {/* Alert 2: Chemist credit limit / 45 days */}
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-950 text-sm">Customer crosses credit limit or 45 days:</div>
                    <div className="text-amber-900 mt-1 leading-relaxed">
                      <strong>17 retail chemists are auto-blocked</strong> from fresh order booking. Largest exposure: <strong>New Life Chemists</strong> (₹86,400 overdue for 54 days).
                    </div>
                    <div className="text-amber-700 text-[11px] mt-1 font-medium">
                      Trigger rule: Overdue &gt; 45 days OR outstanding &gt; 100% of sanctioned limit → Hard order hold
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Dispatched WhatsApp payment statement links to all 17 chemists.", "success")}
                  className="px-3.5 py-1.5 bg-amber-800 text-white font-semibold rounded-md hover:bg-amber-900 transition-colors cursor-pointer shrink-0 w-fit"
                >
                  Send Payment Demand Notes
                </button>
              </div>

              {/* Alert 3: Drug Licence expiring in 30 days */}
              <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-950 text-sm">Customer Drug Licence expiring in 30 days:</div>
                    <div className="text-blue-900 mt-1 leading-relaxed">
                      <strong>Janata Medical Store</strong> DL 20B/21B expires in <strong>12 days (24-Oct-2026)</strong>. System will automatically prohibit billing on 25-Oct-2026.
                    </div>
                    <div className="text-blue-700 text-[11px] mt-1 font-medium">
                      Statutory rule: Drugs &amp; Cosmetics Act requires valid 20B/21B at time of tax invoice creation
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Assigned Beat Salesman task: Collect renewal challan copy.", "info")}
                  className="px-3.5 py-1.5 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition-colors cursor-pointer shrink-0 w-fit"
                >
                  Assign to Field Rep Beat
                </button>
              </div>

              {/* Alert 4: Unsettled manufacturer claim > 90 days */}
              <div className="p-4 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-950 text-sm">Principal claim not settled in 90 days:</div>
                    <div className="text-purple-900 mt-1 leading-relaxed">
                      Claim <strong>CLM-25-0174 (Principal C - Hospital Rate Diff)</strong> for <strong>₹1,24,500</strong> has remained pending for 98 days.
                    </div>
                    <div className="text-purple-700 text-[11px] mt-1 font-medium">
                      Commercial rule: Section 10 net margin eroded if claims stall beyond quarterly ledger reconciliation
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast("Escalated formal statement dossier to Area Sales Manager (Principal C).", "success")}
                  className="px-3.5 py-1.5 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition-colors cursor-pointer shrink-0 w-fit"
                >
                  Escalate to Principal ASM
                </button>
              </div>

              {/* Alert 5: Cold-room temperature log */}
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ThermometerSnowflake className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 text-sm">Cold-room temperature within statutory range:</div>
                    <div className="text-emerald-900 mt-1 leading-relaxed">
                      Main Vaccine Cold Room IoT sensor: <strong>4.2°C</strong> (Statutory range: 2.0°C to 8.0°C). Logged every 15 minutes.
                    </div>
                    <div className="text-emerald-700 text-[11px] mt-1 font-medium">
                      GDP compliance: Insulin, vaccines &amp; biologicals integrity maintained. Backup diesel generator on standby.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("coldchain")}
                  className="px-3.5 py-1.5 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-800 transition-colors cursor-pointer shrink-0 w-fit"
                >
                  View 24h Temperature Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: COLD CHAIN & GDP TEMPERATURE LOG */}
        {activeTab === "coldchain" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <ThermometerSnowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Cold-Room GDP Compliance Log (2.0°C – 8.0°C)
                    </h2>
                    <p className="text-xs text-gray-500">
                      Mandatory Drug Inspector biologicals register: Vaccines, Human Insulin, Erythropoietin &amp; Monoclonal Antibodies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      showToast("Exported FDA GDP Cold-Chain Certificate (PDF).", "success");
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#178582]" />
                    <span>Download FDA Certificate</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#178582] text-white text-xs font-semibold rounded-md hover:bg-[#126b68] cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Log</span>
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Live Sensor #1 (Main Chamber)</span>
                  <div className="text-2xl font-bold font-mono text-blue-900 mt-1">4.2°C</div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant (Range 2–8°C)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Live Sensor #2 (Transit Deep Box)</span>
                  <div className="text-2xl font-bold font-mono text-blue-900 mt-1">3.8°C</div>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Compliant (Range 2–8°C)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Auxiliary Power / Generator</span>
                  <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">Grid Normal</div>
                  <span className="text-xs text-gray-600 font-semibold flex items-center gap-1 mt-0.5">
                    DG Genset 25 kVA Standby (Ready)
                  </span>
                </div>
              </div>

              {/* Hourly Reading Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full min-w-[650px] text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Sensor ID</th>
                      <th className="py-2.5 px-4">Recorded Temp</th>
                      <th className="py-2.5 px-4">Relative Humidity</th>
                      <th className="py-2.5 px-4">GDP Tolerance</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-900 font-medium">
                    {[
                      { time: "Today 11:45 AM", id: "CR-SNS-01", temp: "4.2°C", hum: "52%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 11:30 AM", id: "CR-SNS-01", temp: "4.1°C", hum: "53%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 11:15 AM", id: "CR-SNS-01", temp: "4.3°C", hum: "51%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 11:00 AM", id: "CR-SNS-01", temp: "4.4°C", hum: "52%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 10:45 AM", id: "CR-SNS-01", temp: "4.2°C", hum: "50%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 10:30 AM", id: "CR-SNS-01", temp: "4.0°C", hum: "54%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 10:15 AM", id: "CR-SNS-01", temp: "3.9°C", hum: "55%", tol: "2.0°C – 8.0°C", status: "Pass" },
                      { time: "Today 10:00 AM", id: "CR-SNS-01", temp: "4.1°C", hum: "52%", tol: "2.0°C – 8.0°C", status: "Pass" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-4 font-mono text-gray-700">{row.time}</td>
                        <td className="py-2.5 px-4 font-semibold text-gray-800">{row.id}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-900">{row.temp}</td>
                        <td className="py-2.5 px-4 text-gray-600">{row.hum}</td>
                        <td className="py-2.5 px-4 font-mono text-gray-500">{row.tol}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> Compliant
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL 1: KPI FORMULA & SLA DRILLDOWN MODAL --- */}
      {viewingKpi && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#178582] bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  Functional Owner: {viewingKpi.owner}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {viewingKpi.name} — Technical Specification
                </h2>
              </div>
              <button
                onClick={() => setViewingKpi(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-700">
              {/* Target vs Current Metric Banner */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="text-gray-500 font-semibold text-[11px]">Current Measurement</div>
                  <div className="text-2xl font-bold font-mono text-gray-900 mt-1">{viewingKpi.currentValue}</div>
                  <div className="text-emerald-700 font-semibold text-[11px] mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Measured on rolling 30-day window
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold text-[11px]">Target Benchmark</div>
                  <div className="text-2xl font-bold font-mono text-[#178582] mt-1">{viewingKpi.target}</div>
                  <div className="text-gray-500 text-[11px] mt-0.5">
                    Defined in Blueprint v1.0 SLA
                  </div>
                </div>
              </div>

              {/* Mathematical Formula Box */}
              <div>
                <h4 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#178582]" />
                  Mathematical Definition &amp; Formula
                </h4>
                <div className="bg-slate-900 text-teal-300 font-mono p-3 rounded-lg border border-slate-800 text-xs">
                  {viewingKpi.definition}
                </div>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {viewingKpi.formulaExplanation}
                </p>
              </div>

              {/* 5-Month Trend Progression */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#178582]" />
                  Trailing 5-Month Trend Progression
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {viewingKpi.historicalTrend.map((t, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-center">
                      <div className="text-gray-500 font-bold text-[10px] uppercase">{t.month}</div>
                      <div className="font-mono font-bold text-gray-900 text-sm mt-1">{t.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating Recommendation */}
              <div className="p-3.5 bg-teal-50/60 rounded-lg border border-teal-200 text-teal-950">
                <span className="font-bold block text-teal-900 mb-1">Operational Action &amp; Remediation:</span>
                <p className="leading-relaxed text-teal-900/90">{viewingKpi.actionRecommendation}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setViewingKpi(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 rounded-md text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: INTERACTIVE REGISTER VIEWER (SCHEDULE H1, GSTR-1, STOCK & SALES) --- */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#178582] flex items-center justify-center border border-teal-200">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-800 px-2 py-0.5 rounded">
                      {viewingReport.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Format: {viewingReport.format}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                    {viewingReport.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-xs font-semibold hover:bg-gray-100 cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Print Register</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`Exported ${viewingReport.title} to Excel / CSV spreadsheet.`, "success");
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setViewingReport(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Register Sub-header Banner */}
            <div className="px-6 py-2.5 bg-gray-100 border-b border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-600 shrink-0">
              <div className="flex items-center gap-4">
                <span>Period: <strong>{selectedDateRange}</strong></span>
                <span>Active Records: <strong>{viewingReport.recordCount} entries</strong></span>
                <span>Audit Status: <strong className="text-emerald-700">Verified &amp; Certified</strong></span>
              </div>
              <div className="text-gray-500 font-mono text-[11px]">
                Licensee: FLUTTERFLIRT PHARMA DISTRIBUTORS (DL: 20B/21B-49102-DL)
              </div>
            </div>

            {/* Modal Body - Contextual Table depending on report ID */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">

              {/* 1. SCHEDULE H1 REGISTER TABLE (MANDATORY FDA INSPECTOR AUDIT) */}
              {viewingReport.id === "rep-7" && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-3 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs text-purple-900">
                    <div className="flex items-center gap-2 font-bold">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      Drugs and Cosmetics Rules, 1945 — Schedule H1 Register Format
                    </div>
                    <span className="text-[11px] font-semibold text-purple-700">
                      Mandatory 3-year record retention under Rule 65(4)(4)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-xs text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Invoice No</th>
                          <th className="py-2.5 px-3">Chemist / Purchaser</th>
                          <th className="py-2.5 px-3">Drug &amp; Dosage</th>
                          <th className="py-2.5 px-3">Batch</th>
                          <th className="py-2.5 px-3 text-right">Qty</th>
                          <th className="py-2.5 px-3">Registered Doctor &amp; Reg #</th>
                          <th className="py-2.5 px-3">Patient Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-900">
                        {SCHEDULE_H1_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-mono text-gray-700 whitespace-nowrap">{row.date}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#178582]">{row.invoiceNo}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-gray-900">{row.chemistName}</div>
                              <div className="text-[10px] text-gray-500 font-mono">{row.chemistDl}</div>
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-gray-900">{row.drugName}</td>
                            <td className="py-2.5 px-3 font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded text-center">{row.batchNo}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">{row.qty}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-gray-800">{row.doctorName}</div>
                              <div className="text-[10px] text-gray-500 font-mono">{row.docRegNo}</div>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-gray-800">{row.patientName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. STOCK & SALES STATEMENT PER PRINCIPAL */}
              {viewingReport.id === "rep-1" && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900">
                    <div className="flex items-center gap-2 font-bold">
                      <Building className="w-4 h-4 text-blue-700" />
                      Monthly Principal Audit Statement (Opening Stock + Receipts = Sales + Closing)
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 font-mono">
                      Cipla, Sun Pharma, Abbott, GSK
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-xs text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                          <th className="py-2.5 px-3">Principal</th>
                          <th className="py-2.5 px-3">Product Name &amp; Pack</th>
                          <th className="py-2.5 px-3 text-right">Opening Qty</th>
                          <th className="py-2.5 px-3 text-right">Receipts</th>
                          <th className="py-2.5 px-3 text-right">Sales Qty</th>
                          <th className="py-2.5 px-3 text-right">Free Qty</th>
                          <th className="py-2.5 px-3 text-right">Closing Qty</th>
                          <th className="py-2.5 px-3 text-right">PTS Value (₹)</th>
                          <th className="py-2.5 px-3 text-right">Cover Days</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-900">
                        {STOCK_SALES_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-bold text-gray-800">{row.principal}</td>
                            <td className="py-2.5 px-3 font-semibold text-gray-900">{row.sku}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-gray-700">{row.openingQty}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-semibold">+{row.receivedQty}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-blue-700 font-bold">{row.salesQty}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-gray-500">{row.freeQty}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900 bg-gray-50/50">{row.closingQty}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">₹{row.ptsValue.toLocaleString("en-IN")}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-700">{row.coverDays} d</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. GSTR-1 REGISTER TABLE */}
              {viewingReport.id === "rep-6" && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2 font-bold">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      GSTR-1 B2B Invoices &amp; Table 12 HSN Summary (Govt GST e-Invoice Schema)
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                      IRN Authenticated via NIC Portal
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-xs text-left">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                          <th className="py-2.5 px-3">Invoice #</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Customer GSTIN</th>
                          <th className="py-2.5 px-3">Party Name</th>
                          <th className="py-2.5 px-3 text-right">Taxable Val (₹)</th>
                          <th className="py-2.5 px-3 text-right">CGST (6%)</th>
                          <th className="py-2.5 px-3 text-right">SGST (6%)</th>
                          <th className="py-2.5 px-3 text-right">Total Invoice (₹)</th>
                          <th className="py-2.5 px-3 text-center">IRN Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-900">
                        {GSTR1_ROWS.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#178582]">{row.invoiceNo}</td>
                            <td className="py-2.5 px-3 font-mono text-gray-700">{row.date}</td>
                            <td className="py-2.5 px-3 font-mono text-gray-800 font-semibold">{row.customerGstin}</td>
                            <td className="py-2.5 px-3 font-semibold text-gray-900">{row.partyName}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">₹{row.taxableVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-gray-700">₹{row.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-gray-700">₹{row.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-gray-900">₹{row.totalVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" /> {row.irnStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. GENERIC / OTHER REGISTER PREVIEWS */}
              {viewingReport.id !== "rep-7" && viewingReport.id !== "rep-1" && viewingReport.id !== "rep-6" && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#178582] flex items-center justify-center mx-auto border border-teal-200">
                    <TableIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{viewingReport.title}</h3>
                    <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                      {viewingReport.description}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{viewingReport.recordCount} rows tabulated for {selectedDateRange}</span>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        showToast(`Exported ${viewingReport.title} to Excel format.`, "success");
                      }}
                      className="px-4 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Complete Dataset (Excel)</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-xs font-semibold flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Summary</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-[11px] text-gray-500">
                System generated by FlutterFlirt Pharma DMS v1.0 • Formats comply with State Drug Control Administration
              </span>
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 font-semibold text-gray-800 rounded-md text-xs cursor-pointer transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: EXPORT AUDIT PACK MODAL --- */}
      {showAuditPackModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#178582] flex items-center justify-center border border-teal-200">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Generate Month-End Audit Pack</h3>
                  <p className="text-xs text-gray-500">Bundled export for Auditors, Drug Inspector &amp; Principals</p>
                </div>
              </div>
              <button
                onClick={() => setShowAuditPackModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-gray-800 block">Select Registers to Bundle:</label>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-teal-50/40 rounded-lg border border-gray-200 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="rounded text-[#178582] focus:ring-[#178582] w-4 h-4" />
                  <div>
                    <div className="font-semibold text-gray-900">Schedule H1 &amp; Narcotics Sales Register</div>
                    <div className="text-[11px] text-gray-500">FDA format with Doctor MCI Reg # and batch numbers</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-teal-50/40 rounded-lg border border-gray-200 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="rounded text-[#178582] focus:ring-[#178582] w-4 h-4" />
                  <div>
                    <div className="font-semibold text-gray-900">Principal Stock &amp; Sales Statement (Cipla/Sun/Abbott)</div>
                    <div className="text-[11px] text-gray-500">Opening, purchases, sales, free items &amp; closing stocks</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-teal-50/40 rounded-lg border border-gray-200 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="rounded text-[#178582] focus:ring-[#178582] w-4 h-4" />
                  <div>
                    <div className="font-semibold text-gray-900">GSTR-1 &amp; Table 12 HSN Tax Audit Register</div>
                    <div className="text-[11px] text-gray-500">B2B invoice level IRN numbers with tax breakups</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-gray-50 hover:bg-teal-50/40 rounded-lg border border-gray-200 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="rounded text-[#178582] focus:ring-[#178582] w-4 h-4" />
                  <div>
                    <div className="font-semibold text-gray-900">Party-wise Ageing &amp; Auto-Blocked Chemist Ledger</div>
                    <div className="text-[11px] text-gray-500">0-15, 16-30, 31-45, &gt;45 days overdue balances</div>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <label className="text-[11px] font-bold text-gray-700 block mb-1">Target Period:</label>
                <select className="w-full bg-white border border-gray-200 text-gray-800 text-xs font-semibold py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#178582]/30 cursor-pointer">
                  <option>October 2026 (Month-to-date)</option>
                  <option>September 2026 (Full Month)</option>
                  <option>Q2 FY 2026-27 (Jul–Sep 2026)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowAuditPackModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 rounded-md text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAuditPackModal(false);
                  showToast("Month-End Audit Pack (4 Registers in ZIP) downloaded successfully.", "success");
                }}
                className="px-4 py-2 bg-[#178582] hover:bg-[#126b68] font-semibold text-white rounded-md text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Bundled Pack (ZIP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
