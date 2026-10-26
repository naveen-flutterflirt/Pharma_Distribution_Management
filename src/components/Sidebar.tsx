"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Truck, 
  Users, 
  IndianRupee, 
  ShieldAlert, 
  UserCheck, 
  BarChart3, 
  Settings as SettingsIcon,
  ChevronRight,
  LogOut
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Orders', href: '/order-desk', icon: FileText },
  { name: 'Invoices', href: '/billing', icon: Receipt },
  { name: 'Products & Stock', href: '/products', icon: Package },
  { name: 'Purchases', href: '/purchase', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Payments', href: '/collections', icon: IndianRupee },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === '/login') {
    return null;
  }

  const activeItem = menuItems.find(item => item.href === pathname) || menuItems[0];

  return (
    <>
      {/* MOBILE TOP NAVBAR (Visible only on screens < md) */}
      <div className="md:hidden w-full bg-[#0c2427] text-white px-4 py-3 flex items-center justify-between border-b border-[#153a3e] shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#178582] flex items-center justify-center font-bold text-sm">
            +
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight leading-tight">[Distributor] DMS</span>
            <span className="text-[10px] text-[#8ea7aa] leading-tight flex items-center gap-1">
              <span>{activeItem.name}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-1.5 rounded-lg bg-[#153a3e] hover:bg-[#1c4d52] text-white transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] bg-[#0c2427] text-[#8ea7aa] h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-5 flex items-center justify-between border-b border-[#153a3e] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#178582] flex items-center justify-center font-bold text-base">
                  +
                </div>
                <div>
                  <div className="font-bold text-base leading-tight">[Distributor] DMS</div>
                  <div className="text-[11px] text-[#8ea7aa]">Pharma Operations Suite</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#153a3e] text-gray-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
                      isActive
                        ? 'bg-[#153a3e] text-white font-semibold shadow-xs'
                        : 'hover:bg-[#153a3e]/50 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#178582]' : 'text-[#8ea7aa]'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-[#178582]" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#153a3e] text-[11px] text-[#8ea7aa] flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">Mr. Rajesh Shah</div>
                <div className="text-[10px] text-emerald-400">Director • Depot 1</div>
              </div>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-2.5 py-1.5 rounded bg-[#153a3e] hover:bg-[#1c4d52] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Visible on md and up) */}
      <aside className="w-56 bg-[#0c2427] text-[#8ea7aa] min-h-screen flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto hidden md:flex border-r border-[#153a3e]">
        <div className="p-6 flex items-center gap-3 text-white">
          <div className="w-8 h-8 rounded bg-[#178582] flex items-center justify-center font-bold text-lg shadow-xs">
            +
          </div>
          <div>
            <div className="font-semibold text-xs leading-tight text-[#8ea7aa]">[Distributor]</div>
            <div className="font-bold text-lg leading-tight tracking-tight">DMS</div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 pb-6 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md transition-colors text-xs font-semibold cursor-pointer ${
                  isActive 
                    ? 'bg-[#153a3e] text-white shadow-sm' 
                    : 'hover:bg-[#153a3e]/50 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#178582]' : 'text-[#8ea7aa]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mx-3 mb-4 rounded-lg bg-[#153a3e]/40 border border-[#153a3e] text-[11px] text-[#8ea7aa]">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-white font-semibold truncate">Mr. Rajesh Shah</div>
              <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="truncate">Director • Depot 1</span>
              </div>
            </div>
            <Link 
              href="/login" 
              title="Sign In / Switch Persona"
              className="p-1.5 rounded-md hover:bg-[#1c4d52] text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
