"use client";

import React, { useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Edit2, 
  IndianRupee 
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  company: string;
  batch: string;
  expiry: string;
  mrp: number;
  ptr: number; // Price to Retailer
  stock: number;
  minStock: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "p-1", name: "Amoxicillin + Clav 625 (10 tabs)", company: "Cipla", batch: "AC2408", expiry: "03/27", mrp: 210, ptr: 162.4, stock: 120, minStock: 50 },
  { id: "p-2", name: "Pantoprazole 40mg (15 tabs)", company: "Alkem", batch: "PN2502", expiry: "06/27", mrp: 145, ptr: 98.1, stock: 18, minStock: 60 },
  { id: "p-3", name: "Metformin 500 SR (10 tabs)", company: "Sun Pharma", batch: "MF2511", expiry: "11/27", mrp: 35, ptr: 21.3, stock: 350, minStock: 100 },
  { id: "p-4", name: "Insulin Glargine Pen (1 pen)", company: "Sanofi", batch: "IG2507", expiry: "07/27", mrp: 850, ptr: 612.0, stock: 0, minStock: 20 },
  { id: "p-5", name: "Azithromycin 500mg (3 tabs)", company: "Zydus", batch: "AZ2412", expiry: "12/26", mrp: 115, ptr: 74.6, stock: 8, minStock: 40 },
  { id: "p-6", name: "Cefixime 200mg (10 tabs)", company: "Mankind", batch: "CF2501", expiry: "04/27", mrp: 130, ptr: 88.2, stock: 95, minStock: 40 },
  { id: "p-7", name: "Paracetamol 650mg (15 tabs)", company: "Micro Labs", batch: "PC2410", expiry: "09/27", mrp: 32, ptr: 19.5, stock: 450, minStock: 150 },
  { id: "p-8", name: "Telmisartan 40mg (15 tabs)", company: "Torrent", batch: "TL2504", expiry: "08/27", mrp: 98, ptr: 64.0, stock: 14, minStock: 50 }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Low Stock" | "Out of Stock">("All");

  // Add Product Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [batch, setBatch] = useState("");
  const [expiry, setExpiry] = useState("");
  const [mrp, setMrp] = useState(100);
  const [ptr, setPtr] = useState(80);
  const [stock, setStock] = useState(100);
  const [minStock, setMinStock] = useState(30);

  // Edit stock modal
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editStockVal, setEditStockVal] = useState(0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.company.toLowerCase().includes(search.toLowerCase()) ||
                          p.batch.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "Low Stock") return p.stock > 0 && p.stock <= p.minStock;
    if (filter === "Out of Stock") return p.stock === 0;
    return true;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProd: Product = {
      id: `p-${Date.now()}`,
      name,
      company: company || "General",
      batch: batch || `B-${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: expiry || "12/27",
      mrp: Number(mrp),
      ptr: Number(ptr),
      stock: Number(stock),
      minStock: Number(minStock)
    };

    setProducts([newProd, ...products]);
    setIsAddOpen(false);
    setName("");
    setCompany("");
    setBatch("");
    setExpiry("");
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    setProducts(products.map(p => p.id === editProduct.id ? { ...p, stock: Number(editStockVal) } : p));
    setEditProduct(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Inventory
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">{filteredProducts.length} medicines listed</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Products &amp; Stock
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
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
              placeholder="Search medicine, company, batch..."
              className="w-full pl-9 pr-3 py-2 bg-white rounded-lg border border-gray-200 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582] focus:border-[#178582] shadow-2xs"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            {(["All", "Low Stock", "Out of Stock"] as const).map((tab) => (
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

      {/* Products Table */}
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Medicine Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4">MRP</th>
                  <th className="py-3 px-4">Rate (PTR)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock === 0;
                  const isLow = p.stock > 0 && p.stock <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {p.company}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                        {p.batch}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {p.expiry}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-500">
                        ₹{p.mrp}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        ₹{p.ptr}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={isOutOfStock ? "text-red-600" : isLow ? "text-amber-600" : "text-gray-900"}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isOutOfStock && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Out of Stock
                          </span>
                        )}
                        {isLow && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock
                          </span>
                        )}
                        {!isOutOfStock && !isLow && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditProduct(p);
                            setEditStockVal(p.stock);
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Update Stock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD MEDICINE MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add New Medicine to Stock</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Medicine Name &amp; Strength *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Augmentin 625 Duo (10 tabs)"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company / Principal
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. GSK / Cipla"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. AG2601"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="e.g. 05/27"
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Initial Stock Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rate to Retailer (PTR ₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={ptr}
                    onChange={(e) => setPtr(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-300 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-[#178582]"
                  />
                </div>
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
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE STOCK MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Update Stock Quantity</h3>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Set available inventory for <strong>{editProduct.name}</strong> ({editProduct.batch}):
            </p>

            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Current In Stock
                </label>
                <input
                  type="number"
                  min={0}
                  required
                  value={editStockVal}
                  onChange={(e) => setEditStockVal(Number(e.target.value))}
                  className="w-full px-3 py-2 text-lg font-bold text-center bg-white rounded-lg border border-gray-300 focus:ring-1 focus:ring-[#178582]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#178582] hover:bg-[#126b68] rounded-lg shadow-2xs cursor-pointer"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
