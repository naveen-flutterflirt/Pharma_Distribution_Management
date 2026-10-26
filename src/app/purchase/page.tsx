"use client";

import React, { useState } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  X, 
  PackageCheck,
  Building2,
  IndianRupee
} from "lucide-react";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  date: string;
  itemsSummary: string;
  totalAmount: number;
  status: "Ordered" | "Received";
}

const INITIAL_PURCHASES: PurchaseOrder[] = [
  { id: "po-1", poNumber: "PO-2026-088", supplierName: "Cipla Ltd (Depot)", date: "25 Oct 2026", itemsSummary: "Amoxicillin 625 (200 strips), Asthalin (100)", totalAmount: 142000, status: "Ordered" },
  { id: "po-2", poNumber: "PO-2026-087", supplierName: "Sun Pharma Central", date: "24 Oct 2026", itemsSummary: "Metformin 500 (500 strips), Volini (50)", totalAmount: 88500, status: "Received" },
  { id: "po-3", poNumber: "PO-2026-086", supplierName: "Alkem Laboratories", date: "23 Oct 2026", itemsSummary: "Pantoprazole 40 (300 strips)", totalAmount: 64200, status: "Received" },
  { id: "po-4", poNumber: "PO-2026-085", supplierName: "Sanofi India", date: "22 Oct 2026", itemsSummary: "Insulin Glargine Pens (50 pens)", totalAmount: 52000, status: "Ordered" }
];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Ordered" | "Received">("All");

  // Add PO Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [itemsSummary, setItemsSummary] = useState("");
  const [totalAmount, setTotalAmount] = useState(50000);

  const handleReceiveStock = (id: string) => {
    setPurchases(purchases.map(p => p.id === id ? { ...p, status: "Received" } : p));
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) return;

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName,
      date: "Today",
      itemsSummary: itemsSummary || "Standard stock replenishment",
      totalAmount: Number(totalAmount),
      status: "Ordered"
    };

    setPurchases([newPO, ...purchases]);
    setIsAddOpen(false);
    setSupplierName("");
    setItemsSummary("");
    setTotalAmount(50000);
  };

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = p.supplierName.toLowerCase().includes(search.toLowerCase()) || 
                          p.poNumber.toLowerCase().includes(search.toLowerCase()) ||
                          p.itemsSummary.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "Ordered") return p.status === "Ordered";
    if (filter === "Received") return p.status === "Received";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Procurement &amp; Supply
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{filteredPurchases.length} purchase orders</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Supplier Purchases
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
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
              placeholder="Search supplier, PO #, item..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {(["All", "Ordered", "Received"] as const).map((tab) => (
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

      {/* Purchases Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier / Manufacturer</th>
                  <th className="py-3 px-4">Ordered Medicines</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredPurchases.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {po.supplierName}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 max-w-xs truncate">
                      {po.itemsSummary}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {po.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      ₹{po.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4">
                      {po.status === "Ordered" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          In Transit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Stock Inwarded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {po.status === "Ordered" ? (
                        <button
                          type="button"
                          onClick={() => handleReceiveStock(po.id)}
                          className="px-2.5 py-1 text-xs font-bold bg-[#178582] hover:bg-[#126b68] text-white rounded-md shadow-2xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Receive Stock</span>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Added to Inventory</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* NEW PURCHASE ORDER MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Create Purchase Order</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Supplier / Pharma Manufacturer *
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Cipla Ltd / Sun Pharma"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Medicines to Order
                </label>
                <textarea
                  rows={3}
                  value={itemsSummary}
                  onChange={(e) => setItemsSummary(e.target.value)}
                  placeholder="e.g. Augmentin 625 (100 boxes), Pantocid 40 (50 boxes)"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimated Total Amount (₹)
                </label>
                <input
                  type="number"
                  min={1}
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
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
                  Create PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
