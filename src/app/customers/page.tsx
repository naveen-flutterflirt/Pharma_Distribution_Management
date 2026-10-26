"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  IndianRupee,
  FileCheck2
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  owner: string;
  phone: string;
  dlNumber: string;
  gstin: string;
  creditLimit: number;
  outstanding: number;
  status: "Active" | "Blocked";
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "c-1", name: "Sri Sai Medicals", owner: "Ravi Sharma", phone: "+91 98450 12345", dlNumber: "DL-20B/21B-8812", gstin: "29AABCU9603R1ZM", creditLimit: 200000, outstanding: 62480, status: "Active" },
  { id: "c-2", name: "City Care Pharmacy", owner: "Suresh Gupta", phone: "+91 98210 55432", dlNumber: "DL-20B/21B-4412", gstin: "29AABCU4412K1Z9", creditLimit: 150000, outstanding: 28400, status: "Active" },
  { id: "c-3", name: "Apollo Pharmacy Sec-14", owner: "Kiran Rao", phone: "+91 99001 88765", dlNumber: "DL-20B/21B-9021", gstin: "29AABCA1290M1Z4", creditLimit: 500000, outstanding: 114500, status: "Active" },
  { id: "c-4", name: "MedPlus Chemist", owner: "Deepak Patel", phone: "+91 98452 77123", dlNumber: "DL-20B/21B-3310", gstin: "29AABCM8821P1Z2", creditLimit: 250000, outstanding: 45200, status: "Active" },
  { id: "c-5", name: "Wellness Forever", owner: "Anil Verma", phone: "+91 98765 43210", dlNumber: "DL-20B/21B-1190", gstin: "29AABCW9901Q1Z8", creditLimit: 300000, outstanding: 0, status: "Active" },
  { id: "c-6", name: "National Drug Store", owner: "Mohan Lal", phone: "+91 98111 22334", dlNumber: "DL-20B/21B-7721", gstin: "29AABCN6610R1Z3", creditLimit: 100000, outstanding: 92400, status: "Blocked" }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Has Dues" | "Blocked">("All");

  // Add Customer Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [phone, setPhone] = useState("");
  const [dlNumber, setDlNumber] = useState("");
  const [gstin, setGstin] = useState("");
  const [creditLimit, setCreditLimit] = useState(200000);

  const handleToggleBlock = (id: string) => {
    setCustomers(customers.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "Active" ? "Blocked" : "Active"
        };
      }
      return c;
    }));
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCust: Customer = {
      id: `c-${Date.now()}`,
      name,
      owner: owner || "Shop Manager",
      phone: phone || "+91 98000 00000",
      dlNumber: dlNumber || "DL-20B/21B-NEW",
      gstin: gstin || "29AABCU0000X1Z0",
      creditLimit: Number(creditLimit),
      outstanding: 0,
      status: "Active"
    };

    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);
    setName("");
    setOwner("");
    setPhone("");
    setDlNumber("");
    setGstin("");
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.owner.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "Has Dues") return c.outstanding > 0;
    if (filter === "Blocked") return c.status === "Blocked";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Retailers &amp; Chemists
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{filteredCustomers.length} registered parties</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Customer Directory
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </header>

      {/* Search and Filters */}
      <div className="px-6 pt-6 pb-2">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chemist, owner, phone..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {(["All", "Has Dues", "Blocked"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab
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

      {/* Customers Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Chemist / Shop Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Drug License (DL)</th>
                  <th className="py-3 px-4">GSTIN</th>
                  <th className="py-3 px-4">Credit Limit</th>
                  <th className="py-3 px-4">Outstanding Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {c.name}
                      <div className="text-[11px] text-gray-400 font-normal">Contact: {c.owner}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-600">
                      {c.dlNumber}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                      {c.gstin}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">
                      ₹{c.creditLimit.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={c.outstanding > 0 ? "text-amber-700" : "text-gray-400"}>
                        ₹{c.outstanding.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {c.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3" />
                          Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleBlock(c.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          c.status === "Active"
                            ? "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {c.status === "Active" ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add New Chemist / Hospital</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Chemist / Shop Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Balaji Medical Store"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Owner / Pharmacist Name
                  </label>
                  <input
                    type="text"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Drug License No (DL 20B/21B)
                  </label>
                  <input
                    type="text"
                    value={dlNumber}
                    onChange={(e) => setDlNumber(e.target.value)}
                    placeholder="e.g. DL 20B/21B-4521"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AABCU1234X1Z5"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
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
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
