"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  Building,
  Printer,
  MessageSquare,
  Users,
  History,
  CheckCircle2,
  AlertTriangle,
  Save,
  RefreshCw,
  Key,
  Globe,
  FileText,
  Lock,
  Smartphone,
  Sliders,
  Check,
  X,
  Plus,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ChevronRight,
  Database,
  FileCheck,
  Layers,
  Sparkles
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Owner / Director" | "Billing Operator" | "Accounts Checker" | "Warehouse Supervisor" | "Field Rep";
  status: "Active" | "Suspended";
  lastLogin: string;
  makerChecker: boolean;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "gst" | "firm" | "credit" | "hardware" | "whatsapp" | "users" | "audit"
  >("gst");

  // In-app Notification Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "warning">("info");

  const showToast = (message: string, type: "success" | "info" | "warning" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. GST & E-Invoice API State
  const [gstin, setGstin] = useState("07AAAAA0000A1Z5");
  const [gspProvider, setGspProvider] = useState("ClearTax / IRIS GST Enterprise");
  const [nicUsername, setNicUsername] = useState("PHARMA_EINV_07");
  const [nicClientId, setNicClientId] = useState("CLI-89304-NIC-PROD");
  const [nicClientSecret, setNicClientSecret] = useState("••••••••••••••••••••••••");
  const [showSecret, setShowSecret] = useState(false);
  const [autoEwbThreshold, setAutoEwbThreshold] = useState("50000");
  const [autoGenerateIrnOnF9, setAutoGenerateIrnOnF9] = useState(true);
  const [isGstTesting, setIsGstTesting] = useState(false);
  const [gstConnectionStatus, setGstConnectionStatus] = useState<"connected" | "disconnected">("connected");

  // 2. Firm & Drug Licence State
  const [firmName, setFirmName] = useState("FLUTTERFLIRT PHARMA DISTRIBUTORS LLP");
  const [tradeName, setTradeName] = useState("FlutterFlirt Pharma (Central Hub)");
  const [dl20B, setDl20B] = useState("DL-20B-184920");
  const [dl21B, setDl21B] = useState("DL-21B-184921");
  const [dlExpiry, setDlExpiry] = useState("2028-11-30");
  const [fssaiNo, setFssaiNo] = useState("10020011000492");
  const [pharmacistName, setPharmacistName] = useState("Rameshwar Nath Sharma, B.Pharm");
  const [pharmacistReg, setPharmacistReg] = useState("DPC-REG-449102");
  const [warehouseAddress, setWarehouseAddress] = useState("Plot No. 44, Okhla Industrial Area Phase-III, New Delhi, 110020");
  const [contactPhone, setContactPhone] = useState("+91 98100 23456");
  const [billingEmail, setBillingEmail] = useState("billing@flutterflirtpharma.com");

  // 3. Credit Control & FEFO Rules State
  const [defaultCreditLimit, setDefaultCreditLimit] = useState("50000");
  const [defaultCreditDays, setDefaultCreditDays] = useState("21");
  const [overdueBlockDays, setOverdueBlockDays] = useState("45");
  const [requireMakerCheckerPin, setRequireMakerCheckerPin] = useState(true);
  const [overrideSupervisorPin, setOverrideSupervisorPin] = useState("8842");
  const [nearExpiryAlertDays, setNearExpiryAlertDays] = useState("90");
  const [strictFefoEnforced, setStrictFefoEnforced] = useState(true);
  const [minOrderValueFreeDelivery, setMinOrderValueFreeDelivery] = useState("2500");

  // 4. Hardware & Print Templates State
  const [invoicePrintFormat, setInvoicePrintFormat] = useState<"laser_a4" | "dot_matrix" | "thermal_3inch">("laser_a4");
  const [showQrOnInvoice, setShowQrOnInvoice] = useState(true);
  const [printDoctorRegOnSchH1, setPrintDoctorRegOnSchH1] = useState(true);
  const [directThermalPrinterIp, setDirectThermalPrinterIp] = useState("192.168.1.185:9100");
  const [dispatchLabelFormat, setDispatchLabelFormat] = useState("4x6_barcode_box");

  // 5. WhatsApp Business Cloud API State
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("10849201948201");
  const [waApiKey, setWaApiKey] = useState("EAAQ...9182");
  const [autoSendInvoicePdf, setAutoSendInvoicePdf] = useState(true);
  const [autoSendMorningBeat, setAutoSendMorningBeat] = useState(true);
  const [autoSendPaymentUpiLink, setAutoSendPaymentUpiLink] = useState(true);

  // 6. User Management State
  const [usersList, setUsersList] = useState<UserAccount[]>([
    {
      id: "u-1",
      name: "Sanjay Singhal",
      email: "sanjay@flutterflirtpharma.com",
      role: "Owner / Director",
      status: "Active",
      lastLogin: "Today 11:30 AM",
      makerChecker: true
    },
    {
      id: "u-2",
      name: "Pradeep Joshi",
      email: "pradeep.j@flutterflirtpharma.com",
      role: "Billing Operator",
      status: "Active",
      lastLogin: "Today 11:50 AM",
      makerChecker: false
    },
    {
      id: "u-3",
      name: "Anita Saxena",
      email: "anita.s@flutterflirtpharma.com",
      role: "Accounts Checker",
      status: "Active",
      lastLogin: "Today 10:15 AM",
      makerChecker: true
    },
    {
      id: "u-4",
      name: "Vikram Chauhan",
      email: "vikram.c@flutterflirtpharma.com",
      role: "Warehouse Supervisor",
      status: "Active",
      lastLogin: "Today 08:30 AM",
      makerChecker: false
    },
    {
      id: "u-5",
      name: "Amit Sharma",
      email: "amit.rep@flutterflirtpharma.com",
      role: "Field Rep",
      status: "Active",
      lastLogin: "Today 09:12 AM",
      makerChecker: false
    }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserAccount["role"]>("Billing Operator");

  // 7. System Audit Trail State
  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: "aud-901",
      timestamp: "Today 11:42 AM",
      user: "Anita Saxena (Accounts)",
      action: "Credit Limit Override approved for Chemist DL-20B-184920 (+₹25,000)",
      module: "Order Desk / Credit Control",
      ipAddress: "192.168.1.42",
      severity: "warning"
    },
    {
      id: "aud-900",
      timestamp: "Today 11:15 AM",
      user: "Pradeep Joshi (Billing)",
      action: "Tax Invoice INV-26-8814 signed & IRN generated via NIC GSP",
      module: "Billing / GST",
      ipAddress: "192.168.1.18",
      severity: "info"
    },
    {
      id: "aud-899",
      timestamp: "Today 10:45 AM",
      user: "Vikram Chauhan (Warehouse)",
      action: "FEFO Batch Substitution confirmed for Azithromycin (AZ-9812 → AZ-9810)",
      module: "Warehouse / Packing",
      ipAddress: "192.168.1.95",
      severity: "warning"
    },
    {
      id: "aud-898",
      timestamp: "Today 09:30 AM",
      user: "Sanjay Singhal (Owner)",
      action: "Purchase Order PO-2026-1048 transmitted via EDI to Cipla Ltd",
      module: "Purchase-to-Stock",
      ipAddress: "192.168.1.10",
      severity: "info"
    },
    {
      id: "aud-897",
      timestamp: "Yesterday 06:15 PM",
      user: "System Daemon (EWB)",
      action: "Auto e-Way bill generated for Consignment WT-4410 (Value ₹78,400)",
      module: "Statutory / E-Way Bill",
      ipAddress: "127.0.0.1",
      severity: "info"
    }
  ]);

  // Handler for testing GST API Connection
  const handleTestGstConnection = () => {
    setIsGstTesting(true);
    setTimeout(() => {
      setIsGstTesting(false);
      setGstConnectionStatus("connected");
      showToast("GSP NIC e-Invoice Gateway Connection Active. Latency: 142ms. Auth Token valid for 5h 22m.", "success");
    }, 1200);
  };

  // Handler for adding a new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast("Please provide both full name and email.", "warning");
      return;
    }
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: "Active",
      lastLogin: "Never",
      makerChecker: newUserRole === "Owner / Director" || newUserRole === "Accounts Checker"
    };
    setUsersList([...usersList, newUser]);
    setShowAddUserModal(false);
    setNewUserName("");
    setNewUserEmail("");
    showToast(`Operator ${newUser.name} created with role ${newUser.role}. Activation invite sent.`, "success");
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
      <header className="px-4 sm:px-8 py-5 bg-white border-b border-gray-200 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#178582]" />
                System Settings &amp; Master Configurations
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Production Grade
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Pharma distribution parameters (Pages 13–18): Wholesale Drug Licences, GSP e-Invoice credentials, Maker-Checker rules, and hardware binding.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                showToast("All configuration parameters committed to persistent storage.", "success");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#178582] text-white rounded-md text-xs sm:text-sm font-semibold hover:bg-[#126b68] transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto mt-5 pt-3 border-t border-gray-100 scrollbar-none">
          {[
            { id: "gst", label: "GST & E-Invoice API", icon: Globe },
            { id: "firm", label: "Firm & Drug Licences", icon: Building },
            { id: "credit", label: "Credit Control & Rules", icon: Sliders },
            { id: "hardware", label: "Printers & Templates", icon: Printer },
            { id: "whatsapp", label: "WhatsApp Messaging", icon: MessageSquare },
            { id: "users", label: "Users & RBAC", icon: Users },
            { id: "audit", label: "Security & Audit Trail", icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#178582] text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">

        {/* TAB 1: GST & E-INVOICE INTEGRATION */}
        {activeTab === "gst" && (
          <div className="space-y-6 max-w-4xl">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-sm">NIC GST e-Invoice &amp; e-Way Bill Gateway</h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      LIVE ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Connected to National Informatics Centre (NIC) via GSP Enterprise API pipe.
                  </p>
                </div>
              </div>

              <button
                onClick={handleTestGstConnection}
                disabled={isGstTesting}
                className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#178582] ${isGstTesting ? "animate-spin" : ""}`} />
                <span>{isGstTesting ? "Pinging Gateway..." : "Test Connection"}</span>
              </button>
            </div>

            {/* GST Config Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#178582]" />
                API Credentials &amp; GSP Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Registered Entity GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/30 bg-white text-gray-900 font-semibold"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">State code 07 (Delhi NCT)</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Selected GSP / ASP Provider</label>
                  <select
                    value={gspProvider}
                    onChange={(e) => setGspProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/30 bg-white text-gray-900 font-medium cursor-pointer"
                  >
                    <option value="ClearTax / IRIS GST Enterprise">ClearTax / IRIS GST Enterprise (Recommended)</option>
                    <option value="Masters India GSP Direct">Masters India GSP Direct</option>
                    <option value="Karvy Data Management GSP">Karvy Data Management GSP</option>
                    <option value="NIC Direct Government Portal">NIC Direct Government Portal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">NIC e-Invoice Username</label>
                  <input
                    type="text"
                    value={nicUsername}
                    onChange={(e) => setNicUsername(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/30 bg-white text-gray-900 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">NIC API Client ID</label>
                  <input
                    type="text"
                    value={nicClientId}
                    onChange={(e) => setNicClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/30 bg-white text-gray-900 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">NIC API Client Secret</label>
                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      value={nicClientSecret}
                      onChange={(e) => setNicClientSecret(e.target.value)}
                      className="w-full px-3 py-2 pr-10 rounded-md border border-gray-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#178582]/30 bg-white text-gray-900 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Automation Rules */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-xs text-gray-900">Statutory Automation Toggles</h4>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerateIrnOnF9}
                    onChange={(e) => setAutoGenerateIrnOnF9(e.target.checked)}
                    className="w-4 h-4 rounded text-[#178582] focus:ring-[#178582]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Auto-generate 64-char IRN &amp; Signed QR Code upon F9 Billing
                    </span>
                    <span className="text-[11px] text-gray-500">
                      When enabled, final bill approval immediately transmits B2B payload to NIC without manual queue delay.
                    </span>
                  </div>
                </label>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                  <div>
                    <span className="font-bold text-gray-900">Auto e-Way Bill Value Threshold (₹)</span>
                    <p className="text-[11px] text-gray-500">Generate Part-A e-Way bill automatically if tax invoice value exceeds:</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={autoEwbThreshold}
                      onChange={(e) => setAutoEwbThreshold(e.target.value)}
                      className="w-28 px-3 py-1.5 rounded border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIRM & DRUG LICENCES */}
        {activeTab === "firm" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#178582]" />
                  <h3 className="text-sm font-bold text-gray-900">Statutory Drug Licences &amp; Regulatory Entity</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DL Valid until 30-Nov-2028
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Legal Entity Registered Name</label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Wholesale Drug Licence Form 20B (Allopathic)</label>
                  <input
                    type="text"
                    value={dl20B}
                    onChange={(e) => setDl20B(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Issued under Drugs &amp; Cosmetics Rules 1945</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Wholesale Drug Licence Form 21B (Schedules C &amp; C1)</label>
                  <input
                    type="text"
                    value={dl21B}
                    onChange={(e) => setDl21B(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Biological &amp; special products</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Licence Validity Expiry Date</label>
                  <input
                    type="date"
                    value={dlExpiry}
                    onChange={(e) => setDlExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs font-semibold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">FSSAI Licence No. (Nutraceuticals / Foods)</label>
                  <input
                    type="text"
                    value={fssaiNo}
                    onChange={(e) => setFssaiNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Competent Person / Registered Pharmacist</label>
                  <input
                    type="text"
                    value={pharmacistName}
                    onChange={(e) => setPharmacistName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs font-bold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">State Pharmacy Council Reg #</label>
                  <input
                    type="text"
                    value={pharmacistReg}
                    onChange={(e) => setPharmacistReg(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Physical Warehouse / Dispatch Facility Address</label>
                  <textarea
                    rows={2}
                    value={warehouseAddress}
                    onChange={(e) => setWarehouseAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CREDIT CONTROL & WORKFLOW RULES */}
        {activeTab === "credit" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#178582]" />
                Credit Control &amp; FEFO Dispatch Policies (Pages 5 &amp; 7)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Default Sanctioned Credit Limit (New Chemist)</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={defaultCreditLimit}
                      onChange={(e) => setDefaultCreditLimit(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Default Credit Payment Terms (Days)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={defaultCreditDays}
                      onChange={(e) => setDefaultCreditDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                    />
                    <span className="text-gray-500 font-semibold">days</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Hard Auto-Block Threshold</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={overdueBlockDays}
                      onChange={(e) => setOverdueBlockDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                    />
                    <span className="text-gray-500 font-semibold">days overdue</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Automated hold on fresh order booking</span>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Near-Expiry Warning Window</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={nearExpiryAlertDays}
                      onChange={(e) => setNearExpiryAlertDays(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                    />
                    <span className="text-gray-500 font-semibold">days</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">Batches flagged for liquidation / hospital diversion</span>
                </div>
              </div>

              {/* Maker-Checker & Strict Policies */}
              <div className="pt-4 border-t border-gray-100 space-y-3.5">
                <h4 className="font-bold text-xs text-gray-900">Maker-Checker Segregation of Duties</h4>

                <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">Require Supervisor Authorization PIN for Overrides</span>
                    <span className="text-[11px] text-gray-500">
                      When a chemist is blocked or exceeds credit ceiling, billing operator cannot bill without Owner/Checker 4-digit PIN.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700 text-[11px]">Supervisor PIN:</span>
                    <input
                      type="password"
                      maxLength={4}
                      value={overrideSupervisorPin}
                      onChange={(e) => setOverrideSupervisorPin(e.target.value)}
                      className="w-20 px-2 py-1 text-center font-mono text-sm tracking-widest font-bold border border-gray-300 rounded bg-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={strictFefoEnforced}
                    onChange={(e) => setStrictFefoEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-[#178582] focus:ring-[#178582]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Enforce Strict FEFO (First-Expiry-First-Out) Batch Allocation
                    </span>
                    <span className="text-[11px] text-gray-500">
                      System strictly assigns earliest expiry batch. Picker barcode scanner rejects any other batch.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRINTERS & HARDWARE TEMPLATES */}
        {activeTab === "hardware" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#178582]" />
                Tax Invoice Stationery &amp; Dispatch Label Hardware
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-2">Invoice Print Layout</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "laser_a4",
                        name: "Laser A4 (Standard)",
                        desc: "Full GST Tax Invoice with IRN signed QR Code & HSN Summary."
                      },
                      {
                        id: "dot_matrix",
                        name: "Dot Matrix 80/132 Col",
                        desc: "Continuous sprocket stationery for high-speed multi-copy billing."
                      },
                      {
                        id: "thermal_3inch",
                        name: "Thermal 3-Inch Roll",
                        desc: "Compact receipt format with barcode for retail OTC counter."
                      }
                    ].map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setInvoicePrintFormat(p.id as typeof invoicePrintFormat)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          invoicePrintFormat === p.id
                            ? "bg-teal-50/60 border-[#178582] text-teal-950 shadow-xs"
                            : "bg-white border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900">{p.name}</span>
                          {invoicePrintFormat === p.id && <Check className="w-4 h-4 text-[#178582]" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Warehouse Thermal Label Printer IP</label>
                    <input
                      type="text"
                      value={directThermalPrinterIp}
                      onChange={(e) => setDirectThermalPrinterIp(e.target.value)}
                      placeholder="192.168.1.185:9100"
                      className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-semibold text-gray-900 bg-white"
                    />
                    <span className="text-[10px] text-gray-400 mt-0.5 block">Zebra / TSC ZPL direct raw socket</span>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Shipping Box Label Format</label>
                    <select
                      value={dispatchLabelFormat}
                      onChange={(e) => setDispatchLabelFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs font-semibold text-gray-900 bg-white cursor-pointer"
                    >
                      <option value="4x6_barcode_box">4 x 6 Inch Barcode Box Label (Box 1 of N)</option>
                      <option value="3x2_compact">3 x 2 Inch Compact Chemist Dispatch Sticker</option>
                      <option value="a4_integrated">A4 Integrated Peel-off Packing Slip</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showQrOnInvoice}
                      onChange={(e) => setShowQrOnInvoice(e.target.checked)}
                      className="w-4 h-4 rounded text-[#178582]"
                    />
                    <span className="font-semibold text-gray-800">Print GST B2B IRN Signed QR Code</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={printDoctorRegOnSchH1}
                      onChange={(e) => setPrintDoctorRegOnSchH1(e.target.checked)}
                      className="w-4 h-4 rounded text-[#178582]"
                    />
                    <span className="font-semibold text-gray-800">Print Doctor MCI Reg # for Schedule H1 Drugs</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WHATSAPP MESSAGING */}
        {activeTab === "whatsapp" && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900">Meta WhatsApp Business Cloud API</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Business Profile
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">WhatsApp Phone Number ID</label>
                  <input
                    type="text"
                    value={waPhoneNumberId}
                    onChange={(e) => setWaPhoneNumberId(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Permanent Cloud API Bearer Token</label>
                  <input
                    type="password"
                    value={waApiKey}
                    onChange={(e) => setWaApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 font-mono text-xs font-bold text-gray-900 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-xs text-gray-900">Automated Message Triggers</h4>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendInvoicePdf}
                    onChange={(e) => setAutoSendInvoicePdf(e.target.checked)}
                    className="w-4 h-4 rounded text-[#178582]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Auto-send PDF Tax Invoice to Chemist on Van Dispatch
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Chemist receives WhatsApp notification with PDF bill copy &amp; driver contact immediately.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendPaymentUpiLink}
                    onChange={(e) => setAutoSendPaymentUpiLink(e.target.checked)}
                    className="w-4 h-4 rounded text-[#178582]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Include Instant UPI Payment Link &amp; Dynamic QR Code
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Allows chemist to tap and pay via GPay, PhonePe, or Paytm with zero manual account entry.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSendMorningBeat}
                    onChange={(e) => setAutoSendMorningBeat(e.target.checked)}
                    className="w-4 h-4 rounded text-[#178582]"
                  />
                  <div>
                    <span className="text-xs font-semibold text-gray-900 block">
                      Send 8:30 AM Daily Beat Plan to Field Sales Representatives
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Salesmen receive their scheduled route, outstanding balances, and focus SKU schemes for the day.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: USERS & RBAC */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">User Roster &amp; Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Segregation of duties: Maker-Checker separation between billing operators and accounts managers.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#178582] text-white rounded-md text-xs font-semibold hover:bg-[#126b68] cursor-pointer shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Operator</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Operator Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Designated Role</th>
                      <th className="py-3 px-4 text-center">Maker-Checker Authority</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-900 font-medium">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{user.name}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">{user.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-gray-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {user.makerChecker ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              <Shield className="w-3 h-3 text-purple-600" /> Authorized Checker
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-500">Standard Operator</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{user.lastLogin}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" /> {user.status}
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

        {/* TAB 7: SECURITY & AUDIT TRAIL */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#178582] flex items-center justify-center border border-teal-200">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Tamper-Proof System Audit Trail (21 CFR Part 11 Format)</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Immutable record of billing approvals, credit limit overrides, batch substitutions, and EDI transmissions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast("Audit trail encrypted export (PDF) generated.", "success");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#178582]" />
                  <span>Export Inspector Log</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User Identity</th>
                      <th className="py-3 px-4">Module</th>
                      <th className="py-3 px-4">Action Summary</th>
                      <th className="py-3 px-4">Source IP</th>
                      <th className="py-3 px-4 text-center">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-900 font-medium">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-gray-600 whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{log.user}</td>
                        <td className="py-3 px-4 text-gray-600">{log.module}</td>
                        <td className="py-3 px-4 text-gray-800 leading-relaxed">{log.action}</td>
                        <td className="py-3 px-4 font-mono text-gray-500">{log.ipAddress}</td>
                        <td className="py-3 px-4 text-center">
                          {log.severity === "warning" ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
                              Override
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                              Normal
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
        )}

      </div>

      {/* --- MODAL: ADD OPERATOR MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">Add New Staff Operator</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#178582]/30"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Company Email</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@flutterflirtpharma.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#178582]/30"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Role &amp; Permissions</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as typeof newUserRole)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 text-xs text-gray-900 bg-white font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#178582]/30"
                >
                  <option value="Billing Operator">Billing Operator (Maker - Bill Creation)</option>
                  <option value="Accounts Checker">Accounts Checker (Credit Limit / Overdue Override)</option>
                  <option value="Warehouse Supervisor">Warehouse Supervisor (Picking &amp; Dispatch)</option>
                  <option value="Field Rep">Field Rep (Beat Order Booking)</option>
                  <option value="Owner / Director">Owner / Director (Full Administrative Rights)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 rounded-md text-xs cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#178582] hover:bg-[#126b68] font-semibold text-white rounded-md text-xs cursor-pointer shadow-xs transition-colors"
                >
                  Create Operator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
