"use client";

import React, { useState } from "react";
import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  Phone, 
  Mail, 
  MapPin 
} from "lucide-react";

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState("Shah Healthcare & Distribution Pvt. Ltd.");
  const [dlNumber, setDlNumber] = useState("DL-20B/21B-88412-MH");
  const [gstin, setGstin] = useState("29AABCU9603R1ZM");
  const [address, setAddress] = useState("Plot 42, Central Pharma Logistics Zone, Sector 18");
  const [phone, setPhone] = useState("+91 98200 12345");
  const [email, setEmail] = useState("admin@pharma.com");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-2026-");
  
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              System Configuration
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">Agency Profile &amp; Rules</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Admin Settings
          </h1>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-6 max-w-4xl space-y-6">
        
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Settings and agency profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Business Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <Building2 className="w-5 h-5 text-[#178582]" />
              <h2 className="text-base font-bold text-gray-900">Distribution Business Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Agency / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Drug License Number (DL 20B/21B) *
                </label>
                <input
                  type="text"
                  required
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  GSTIN Number *
                </label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered Warehouse Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Official Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>
            </div>
          </div>

          {/* Invoicing & Billing Rules Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <FileText className="w-5 h-5 text-[#178582]" />
              <h2 className="text-base font-bold text-gray-900">Billing &amp; Payment Rules</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Default Payment Due Days
                </label>
                <input
                  type="number"
                  min={0}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
                <p className="text-[11px] text-gray-400 mt-1">Number of credit days given to chemists by default</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white rounded-lg border border-gray-300 text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
                <p className="text-[11px] text-gray-400 mt-1">E.g. INV-2026-001</p>
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-bold rounded-lg shadow-sm shadow-[#178582]/30 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
