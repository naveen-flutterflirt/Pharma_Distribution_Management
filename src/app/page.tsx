import { HeaderActions } from "@/components/HeaderActions";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f6f8f9] overflow-y-auto">
      {/* Top Header */}
      <header className="px-4 sm:px-8 py-5 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 bg-white sm:bg-transparent">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Good morning, Mr. Shah</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Thursday, 8 Oct · Main warehouse</p>
        </div>
        <HeaderActions />
      </header>

      {/* Main Content Area */}
      <div className="p-4 sm:p-8 space-y-6">
        
        {/* KPI Cards Row (Fully responsive grid: 2 cols on mobile, 3 on tablet/half-screen, 6 on wide desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <KpiCard title="Sales today" value="₹14.6L" subtitle="▲ 8% vs last Thu" subtitleColor="text-emerald-600" />
          <KpiCard title="Gross margin" value="9.8%" subtitle="▼ 0.3 pts — schemes" subtitleColor="text-orange-500" />
          <KpiCard title="Orders" value="412" subtitle="38 pending billing" subtitleColor="text-gray-500" />
          <KpiCard title="Fill rate" value="96.1%" subtitle="71 lines short" subtitleColor="text-orange-500" />
          <KpiCard title="Outstanding" value="₹2.84Cr" subtitle="₹38L over 45 days" subtitleColor="text-orange-500" />
          <KpiCard title="Claims pending" value="₹11.2L" subtitle="₹3.1L older than 90 d" subtitleColor="text-orange-500" />
        </div>

        {/* Middle Row (1 col on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Sales by channel */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <h2 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-4">Sales by channel — today</h2>
            <div className="space-y-4">
              <ChannelBar label="Salesman app" value="₹6.1L" percent={60} color="bg-[#178582]" />
              <ChannelBar label="Chemist app" value="₹3.8L" percent={40} color="bg-[#178582]" />
              <ChannelBar label="Phone / WhatsApp" value="₹2.4L" percent={25} color="bg-[#94a3b8]" />
              <ChannelBar label="Hospitals" value="₹1.9L" percent={20} color="bg-[#178582]" />
              <ChannelBar label="Counter" value="₹0.4L" percent={5} color="bg-[#178582]" />
            </div>
          </div>

          {/* Top principals */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <h2 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-4">Top principals — month to date</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[260px]">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 text-[11px] sm:text-xs font-semibold">
                    <th className="pb-2.5 pr-3 font-semibold">Principal</th>
                    <th className="pb-2.5 px-3 font-semibold">Sales</th>
                    <th className="pb-2.5 pl-3 font-semibold text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900 font-medium">
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-gray-800 whitespace-nowrap">Principal A (Cipla)</td>
                    <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">₹62.4L</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-emerald-700 font-bold whitespace-nowrap">10.2%</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-gray-800 whitespace-nowrap">Principal B (Sun)</td>
                    <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">₹48.1L</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-emerald-700 font-bold whitespace-nowrap">9.1%</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-gray-800 whitespace-nowrap">Principal C (Abbott)</td>
                    <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">₹31.7L</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-emerald-700 font-bold whitespace-nowrap">11.4%</td>
                  </tr>
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="py-2.5 pr-3 font-bold text-gray-800 whitespace-nowrap">Principal D (GSK)</td>
                    <td className="py-2.5 px-3 font-mono font-semibold whitespace-nowrap">₹22.9L</td>
                    <td className="py-2.5 pl-3 text-right font-mono text-emerald-700 font-bold whitespace-nowrap">8.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Receivables ageing */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5 flex flex-col md:col-span-2 xl:col-span-1">
            <h2 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-6">Receivables ageing</h2>
            <div className="flex-1 flex items-end justify-between gap-2 pb-2 min-h-[120px]">
              <AgeingBar label="0–15 d" value="₹1.36Cr" height="h-24" color="bg-[#a8d3d1]" />
              <AgeingBar label="16–30 d" value="₹0.88Cr" height="h-16" color="bg-[#a8d3d1]" />
              <AgeingBar label="31–45 d" value="₹0.22Cr" height="h-8" color="bg-[#f59e0b]" />
              <AgeingBar label=">45 d" value="₹0.38Cr" height="h-10" color="bg-[#ef4444]" />
            </div>
            <div className="text-xs text-red-600 font-bold mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              <span>17 customers auto-blocked for overdue &gt; 45d</span>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Shortages hurting fill rate */}
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-sm sm:text-[15px] font-bold text-gray-900">Shortages hurting fill rate</h2>
              <a href="/purchase" className="text-xs sm:text-sm text-[#178582] hover:underline font-semibold cursor-pointer">
                Create purchase order →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[540px]">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100 text-[11px] sm:text-xs">
                    <th className="pb-2.5 pr-4 font-semibold">Product</th>
                    <th className="pb-2.5 px-3 font-semibold">Principal</th>
                    <th className="pb-2.5 px-3 font-semibold">Demand today</th>
                    <th className="pb-2.5 px-3 font-semibold text-center">In stock</th>
                    <th className="pb-2.5 pl-3 font-semibold text-right">Lost sales</th>
                  </tr>
                </thead>
                <tbody className="text-gray-900 font-medium">
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4 font-bold text-gray-900 whitespace-nowrap">Amoxicillin + Clav 625 tab</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">Principal B</td>
                    <td className="py-3 px-3 font-semibold whitespace-nowrap">340 strips</td>
                    <td className="py-3 px-3 font-mono text-amber-700 font-bold text-center whitespace-nowrap">120</td>
                    <td className="py-3 pl-3 text-right text-red-600 font-bold font-mono whitespace-nowrap">₹21,400</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4 font-bold text-gray-900 whitespace-nowrap">Insulin glargine pen</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">Principal A</td>
                    <td className="py-3 px-3 font-semibold whitespace-nowrap">48</td>
                    <td className="py-3 px-3 font-mono text-red-700 font-bold text-center whitespace-nowrap">0</td>
                    <td className="py-3 pl-3 text-right text-red-600 font-bold font-mono whitespace-nowrap">₹18,900</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4 font-bold text-gray-900 whitespace-nowrap">Pantoprazole 40 tab</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">Principal C</td>
                    <td className="py-3 px-3 font-semibold whitespace-nowrap">510 strips</td>
                    <td className="py-3 px-3 font-mono text-amber-700 font-bold text-center whitespace-nowrap">300</td>
                    <td className="py-3 pl-3 text-right text-red-600 font-bold font-mono whitespace-nowrap">₹9,600</td>
                  </tr>
                  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 pr-4 font-bold text-gray-900 whitespace-nowrap">ORS sachet</td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">Principal D</td>
                    <td className="py-3 px-3 font-semibold whitespace-nowrap">1,200</td>
                    <td className="py-3 px-3 font-mono text-gray-700 font-bold text-center whitespace-nowrap">650</td>
                    <td className="py-3 pl-3 text-right text-red-600 font-bold font-mono whitespace-nowrap">₹4,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: Expiry watch & Collected today */}
          <div className="space-y-4 sm:space-y-6">
            {/* Expiry watch */}
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-5">
              <h2 className="text-sm sm:text-[15px] font-bold text-gray-900 mb-4">Expiry watch</h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expiring in 90 days</span>
                  <span className="font-bold text-gray-900 font-mono">₹8.4L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Returnable to principals</span>
                  <span className="font-bold text-[#178582] font-mono">₹6.9L</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expired returns from chemists</span>
                  <span className="font-bold text-gray-900 font-mono">₹2.2L</span>
                </div>
              </div>
            </div>

            {/* Collected today */}
            <div className="bg-[#0c2427] text-white rounded-xl shadow-xs p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">₹4.7L</div>
              <div>
                <div className="font-bold text-sm sm:text-[15px] text-white">Collected today</div>
                <div className="text-xs text-[#8ea7aa] mt-0.5">UPI 61% · cheque 24% · cash 15%</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, subtitleColor }: { title: string, value: string, subtitle: string, subtitleColor: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-3.5 sm:p-4 flex flex-col justify-between hover:border-gray-300 transition-colors">
      <div className="text-xs text-gray-500 font-semibold truncate" title={title}>{title}</div>
      <div className="my-1.5 text-xl sm:text-2xl font-bold text-gray-900 font-mono tracking-tight">{value}</div>
      <div className={`text-[11px] sm:text-xs font-semibold ${subtitleColor} truncate`} title={subtitle}>{subtitle}</div>
    </div>
  );
}

function ChannelBar({ label, value, percent, color }: { label: string, value: string, percent: number, color: string }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
      <div className="w-28 sm:w-32 text-gray-600 font-medium truncate" title={label}>{label}</div>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
      <div className="w-12 sm:w-14 text-right font-bold text-gray-900 font-mono">{value}</div>
    </div>
  );
}

function AgeingBar({ label, value, height, color }: { label: string, value: string, height: string, color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <div className={`w-full max-w-[36px] sm:max-w-[44px] rounded-t-sm ${color} ${height} transition-all`}></div>
      <div className="text-center text-[10px] sm:text-xs">
        <div className="text-gray-500 font-medium">{label}</div>
        <div className="font-bold text-gray-900 mt-0.5 font-mono">{value}</div>
      </div>
    </div>
  );
}
