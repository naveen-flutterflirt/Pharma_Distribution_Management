"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  ArrowRight, 
  ShoppingCart, 
  Package, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Receipt,
  Users,
  Search
} from "lucide-react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([
    { id: "ORD-8812", customer: "Sri Sai Medicals", items: 6, amount: 62480, status: "Pending", time: "10:15 AM" },
    { id: "ORD-8811", customer: "City Care Pharmacy", items: 4, amount: 28400, status: "Pending", time: "09:40 AM" },
    { id: "ORD-8810", customer: "Apollo Pharmacy Sec-14", items: 12, amount: 114500, status: "Billed", time: "09:10 AM" },
    { id: "ORD-8809", customer: "MedPlus Chemist", items: 8, amount: 45200, status: "Billed", time: "Yesterday" },
    { id: "ORD-8808", customer: "Wellness Forever", items: 5, amount: 33100, status: "Billed", time: "Yesterday" },
  ]);

  const [lowStock, setLowStock] = useState([
    { name: "Insulin Glargine Pen", company: "Sanofi", stock: 0, min: 20, status: "Out of Stock" },
    { name: "Amoxicillin + Clav 625", company: "Cipla", stock: 12, min: 50, status: "Low Stock" },
    { name: "Pantoprazole 40mg", company: "Alkem", stock: 18, min: 60, status: "Low Stock" },
    { name: "Azithromycin 500mg", company: "Zydus", stock: 8, min: 40, status: "Low Stock" },
  ]);

  const handleApproveOrder = (id: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Billed" } : o));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f6f8f9] min-h-screen overflow-y-auto">
      {/* Top Header */}
      <header className="px-6 py-6 bg-white border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#178582] border border-teal-200">
              Admin Portal
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">Main Distribution Depot</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">
            Dashboard Overview
          </h1>
        </div>

        {/* Quick Action Buttons for Admin */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/order-desk"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#178582] hover:bg-[#126b68] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-gray-500" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/collections"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <IndianRupee className="w-4 h-4 text-gray-500" />
            <span>Record Payment</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-6 space-y-6">
        
        {/* 4 Core Admin KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Today's Sales */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Sales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹1,48,250</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>↑ 12% vs yesterday</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#178582] flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">2 Orders</h3>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                Awaiting billing approval
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Stock Alert</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">4 Items</h3>
              <p className="text-xs text-red-600 font-semibold mt-1">
                Need immediate reorder
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          {/* Total Outstanding */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Due (Chemist)</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹3,42,800</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Across 18 registered parties
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* 2 Main Management Sections (Orders & Low Stock) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Orders Management (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
                <p className="text-xs text-gray-500 mt-0.5">Approve, bill, and dispatch customer orders</p>
              </div>
              <Link 
                href="/order-desk" 
                className="text-xs font-bold text-[#178582] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/75 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-xs sm:text-sm">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {ord.id}
                        <div className="text-[11px] text-gray-400 font-normal">{ord.time}</div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800">
                        {ord.customer}
                        <div className="text-[11px] text-gray-400 font-normal">{ord.items} medicine lines</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        ₹{ord.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        {ord.status === "Pending" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Billed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ord.status === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => handleApproveOrder(ord.id)}
                            className="px-3 py-1.5 bg-[#178582] hover:bg-[#126b68] text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer"
                          >
                            Approve &amp; Bill
                          </button>
                        ) : (
                          <Link
                            href="/billing"
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors cursor-pointer inline-block"
                          >
                            View Invoice
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Low Stock Alert (1 Col) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Low Stock Alert</h2>
                <p className="text-xs text-gray-500 mt-0.5">Medicines reaching reorder point</p>
              </div>
              <Link 
                href="/purchase" 
                className="text-xs font-bold text-[#178582] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Order Stock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 divide-y divide-gray-100">
              {lowStock.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-500">{item.company}</p>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      Stock: <span className="font-bold text-red-600">{item.stock}</span> (Min: {item.min})
                    </div>
                  </div>
                  <div>
                    <Link
                      href="/purchase"
                      className="px-2.5 py-1 text-xs font-bold rounded bg-teal-50 text-[#178582] border border-teal-200 hover:bg-teal-100 transition-colors inline-block cursor-pointer"
                    >
                      Reorder
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto rounded-b-xl text-center">
              <Link
                href="/products"
                className="text-xs font-bold text-gray-700 hover:text-[#178582] transition-colors cursor-pointer"
              >
                View Full Medicine Inventory ({`1,280 products`}) &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
