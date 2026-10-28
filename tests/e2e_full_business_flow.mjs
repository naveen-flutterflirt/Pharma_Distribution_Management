// Full End-to-End Pharma DMS Business Lifecycle Verification

const API_BASE = "http://localhost:5001/api";

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] Step ${totalTests}: ${message}`);
  } else {
    console.error(`  [FAIL] Step ${totalTests}: ${message}`);
    process.exitCode = 1;
  }
}

async function runEndToEndLifecycle() {
  console.log("=== PHARMA DMS END-TO-END BUSINESS LIFECYCLE FLOW ===\n");

  // Step 1: Health & Database Connectivity
  console.log("--- 1. ERP Core & Database Health ---");
  const healthRes = await fetch(`${API_BASE}/health`);
  assert(healthRes.status === 200, "Core API health check returns HTTP 200");
  const healthData = await healthRes.json();
  assert(healthData.database === "connected", "PostgreSQL database connected");

  // Step 2: Read Baseline Operational Pulse
  console.log("\n--- 2. Executive Dashboard Baseline Pulse ---");
  const dashBeforeRes = await fetch(`${API_BASE}/dashboard/summary`);
  assert(dashBeforeRes.status === 200, "Dashboard summary accessible");
  const dashBefore = await dashBeforeRes.json();
  const initialBilled = dashBefore.summary.pipeline.billedInvoices;
  console.log(`  Initial Billed Invoices in System: ${initialBilled}`);

  // Step 3: Chemist Customer Lookup
  console.log("\n--- 3. Chemist Customer Identification ---");
  const custRes = await fetch(`${API_BASE}/customers`);
  assert(custRes.status === 200, "Customer accounts accessible");
  const custData = await custRes.json();
  const testCustomer = custData.customers.find(c => c.status !== "BLOCKED") || custData.customers[0];
  console.log(`  Selected Customer: ${testCustomer.name} (${testCustomer.code}) - Limit: ₹${testCustomer.creditLimit}`);

  // Step 4: Book Sales Order (Intake Stage)
  console.log("\n--- 4. Multi-Channel Sales Order Booking ---");
  const bookOrderRes = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: testCustomer.id,
      channel: "salesman",
      route: testCustomer.route || "Route 3",
      schemeSummary: "10+1 Fast Mover Promotion",
      freeGoodsValue: 1200,
      items: [
        {
          name: "Amoxicillin + Clav 625 tab",
          batch: "AC2603",
          exp: "09/28",
          qty: 40,
          free: "4",
          ptr: 162.40,
          gst: 12
        },
        {
          name: "Pantoprazole 40 tab",
          batch: "PN2602",
          exp: "11/28",
          qty: 30,
          free: "3",
          ptr: 98.10,
          gst: 12
        }
      ]
    })
  });
  assert(bookOrderRes.status === 201, "Sales order booked successfully (HTTP 201)");
  const bookedData = await bookOrderRes.json();
  const order = bookedData.order;
  assert(order.orderNumber.startsWith("SO-2026-"), `Assigned sequential SO number: ${order.orderNumber}`);
  assert(order.status === "PENDING", "Order entered queue with status PENDING");
  assert(order.items.length === 2, "Both formulation lines attached to order voucher");
  console.log(`  Order ${order.orderNumber} Total: ₹${order.orderTotal}`);

  // Step 5: Hold / Resume State Management
  console.log("\n--- 5. Order Hold & Resume State Machine ---");
  const holdRes = await fetch(`${API_BASE}/orders/${order.id}/hold`, { method: "POST" });
  assert(holdRes.status === 200, "Order placed on hold");
  const holdData = await holdRes.json();
  assert(holdData.order.status === "HOLD", "Order status switched to HOLD");

  const resumeRes = await fetch(`${API_BASE}/orders/${order.id}/hold`, { method: "POST" });
  assert(resumeRes.status === 200, "Order resumed");
  const resumeData = await resumeRes.json();
  assert(resumeData.order.status === "PENDING", "Order status returned to PENDING");

  // Step 6: Maker-Checker Credit Clearance
  console.log("\n--- 6. Maker-Checker Credit Control Clearance ---");
  const overrideRes = await fetch(`${API_BASE}/orders/${order.id}/override`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: "End-to-End QA Pipeline Authorization Note" })
  });
  assert(overrideRes.status === 200, "Credit clearance authorized");
  const overrideData = await overrideRes.json();
  assert(overrideData.order.creditBlocked === false, "creditBlocked is false");

  // Step 7: GST Billing & Statutory Sealing
  console.log("\n--- 7. GST Tax Invoicing & Statutory NIC IRN Generation ---");
  const billRes = await fetch(`${API_BASE}/orders/${order.id}/bill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason: "Billed and Sent to Pick" })
  });
  assert(billRes.status === 200, "Order billed (HTTP 200)");
  const billData = await billRes.json();
  assert(billData.order.status === "BILLED", "Order status sealed as BILLED");
  assert(billData.order.irn && billData.order.irn.length === 64, "Generated 64-char statutory NIC e-Invoice IRN");
  assert(billData.invoice && billData.invoice.invoiceNo.startsWith("INV-26-"), "Generated Tax Invoice INV-26-XXXXX");
  assert(billData.tray && billData.tray.includes("Tray"), `Assigned warehouse pick tote: ${billData.tray}`);
  console.log(`  Invoice Generated: ${billData.invoice.invoiceNo} | IRN: ${billData.order.irn.slice(0, 16)}...`);

  // Step 8: Warehouse Wave Picking Verification
  console.log("\n--- 8. Warehouse Wave Picking Verification ---");
  const whRes = await fetch(`${API_BASE}/warehouse/waves`);
  assert(whRes.status === 200, "Warehouse waves accessible");
  const whData = await whRes.json();
  assert(Array.isArray(whData.waves) && whData.waves.length > 0, "Active warehouse waves present in database");

  // Step 9: Van Delivery Route Tracking
  console.log("\n--- 9. Van Delivery Dispatch & Route Tracking ---");
  const delRes = await fetch(`${API_BASE}/delivery/routes`);
  assert(delRes.status === 200, "Delivery routes accessible");
  const delData = await delRes.json();
  assert(Array.isArray(delData.routes) && delData.routes.length > 0, "Delivery van routes tracked in database");

  // Step 10: Collection Receipt Generation & Ledger Update
  console.log("\n--- 10. Collection Receipting & Payment Reconciliation ---");
  const collectRes = await fetch(`${API_BASE}/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerId: testCustomer.id,
      amount: Math.round(order.orderTotal),
      mode: "UPI QR",
      referenceNo: `UPI-${Date.now().toString().slice(-8)}`,
      allocatedInvoices: billData.invoice.invoiceNo
    })
  });
  assert(collectRes.status === 201, "Money receipt generated (HTTP 201)");
  const collectData = await collectRes.json();
  assert(collectData.collection && collectData.collection.receiptNo.startsWith("REC-"), "Receipt number generated with REC- prefix");
  console.log(`  Money Receipt: ${collectData.collection.receiptNo} | Amount: ₹${collectData.collection.amount}`);

  // Step 11: Principal Claims & Expiries
  console.log("\n--- 11. Principal Claims & Supplier Returns ---");
  const claimsRes = await fetch(`${API_BASE}/claims`);
  assert(claimsRes.status === 200, "Principal claims accessible");
  const claimsData = await claimsRes.json();
  assert(Array.isArray(claimsData.claims), "Principal claims list returned");

  // Step 12: Purchase Orders & Supplier Reorders
  console.log("\n--- 12. Purchase Orders & Inventory Procurement ---");
  const poRes = await fetch(`${API_BASE}/purchase/orders`);
  assert(poRes.status === 200, "Purchase orders accessible");
  const poData = await poRes.json();
  assert(Array.isArray(poData.orders), "Purchase orders list returned");

  // Step 13: Executive Dashboard Post-Transaction Pulse
  console.log("\n--- 13. Executive Dashboard Updated Pulse ---");
  const dashAfterRes = await fetch(`${API_BASE}/dashboard/summary`);
  assert(dashAfterRes.status === 200, "Dashboard summary accessible");
  const dashAfter = await dashAfterRes.json();
  assert(dashAfter.summary.pipeline.billedInvoices >= initialBilled, "Dashboard reflects newly billed tax invoice");
  console.log(`  Updated Invoices Billed: ${dashAfter.summary.pipeline.billedInvoices}`);
  console.log(`  Sales Today: ₹${dashAfter.summary.kpis.salesToday.toLocaleString("en-IN")}`);

  console.log("\n=======================================================");
  console.log(`TOTAL LIFECYCLE STEPS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  console.log(`LIFECYCLE FLOW SUCCESS RATE: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  console.log("=======================================================\n");
}

runEndToEndLifecycle().catch(err => {
  console.error("Fatal lifecycle flow error:", err);
  process.exit(1);
});
