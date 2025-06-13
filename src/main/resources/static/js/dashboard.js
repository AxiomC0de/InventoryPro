import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar
  document.getElementById("sidebarCollapse").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active")
  })

  // Load dashboard data
  loadDashboardData()

  // Set up export functionality
  document.getElementById("exportData").addEventListener("click", () => {
    exportInventoryReport()
  })
})

// Load dashboard data from API
async function loadDashboardData() {
  try {
    // Fetch inventory summary
    const summaryResponse = await fetch("/api/reports/inventory-summary")
    const summary = await summaryResponse.json()

    // Update stats cards
    document.getElementById("totalItems").textContent = summary.totalProducts
    document.getElementById("lowStockItems").textContent = summary.lowStockProducts
    document.getElementById("outOfStockItems").textContent = summary.outOfStockProducts
    document.getElementById("inventoryValue").textContent = formatCurrency(summary.totalInventoryValue)

    // Fetch low stock items
    const lowStockResponse = await fetch("/api/reports/low-stock")
    const lowStockItems = await lowStockResponse.json()

    // Update low stock table
    const lowStockTable = document.getElementById("lowStockTable")
    lowStockTable.innerHTML = ""

    lowStockItems.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.sku}</td>
                <td>${item.stock}</td>
                <td><span class="badge bg-warning">${item.stock} left</span></td>
            `
      lowStockTable.appendChild(row)
    })

    // Fetch monthly sales data for chart
    const salesResponse = await fetch("/api/reports/monthly-sales")
    const salesData = await salesResponse.json()

    // Create chart
    createInventoryChart(salesData)

    // Load recent activity (mock data for now)
    loadRecentActivity()

    // Load top selling items (mock data for now)
    loadTopSellingItems()
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    // If API fails, load mock data for demonstration
    loadMockData()
  }
}

// Load mock data if API is not available
function loadMockData() {
  // Update stats cards with mock data
  document.getElementById("totalItems").textContent = "1,248"
  document.getElementById("lowStockItems").textContent = "23"
  document.getElementById("outOfStockItems").textContent = "7"
  document.getElementById("inventoryValue").textContent = "$45,231.89"

  // Mock low stock items
  const lowStockItems = [
    { name: "AirPods Pro", sku: "AP-PRO-2", stock: 3 },
    { name: "Sony WH-1000XM5", sku: "SONY-WH1000XM5", stock: 5 },
    { name: "Apple Watch Series 7", sku: "AW-S7-44MM", stock: 8 },
    { name: 'iPad Pro 11"', sku: "IPAD-PRO-11", stock: 10 },
  ]

  const lowStockTable = document.getElementById("lowStockTable")
  lowStockTable.innerHTML = ""

  lowStockItems.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.sku}</td>
            <td>${item.stock}</td>
            <td><span class="badge bg-warning">${item.stock} left</span></td>
        `
    lowStockTable.appendChild(row)
  })

  // Create chart with mock data
  const mockChartData = [
    { month: "Jan", sales: 4500 },
    { month: "Feb", sales: 3800 },
    { month: "Mar", sales: 5200 },
    { month: "Apr", sales: 4800 },
    { month: "May", sales: 5900 },
    { month: "Jun", sales: 6500 },
    { month: "Jul", sales: 7200 },
    { month: "Aug", sales: 6800 },
    { month: "Sep", sales: 7900 },
    { month: "Oct", sales: 8500 },
    { month: "Nov", sales: 9200 },
    { month: "Dec", sales: 10500 },
  ]

  createInventoryChart(mockChartData)

  // Load mock recent activity
  loadRecentActivity()

  // Load mock top selling items
  loadTopSellingItems()
}

// Create inventory chart
function createInventoryChart(data) {
  const ctx = document.getElementById("inventoryChart").getContext("2d")

  // Extract months and sales values
  const months = data.map((item) => item.month || item[0])
  const sales = data.map((item) => item.sales || item[1])

  new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Monthly Sales",
          data: sales,
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          borderColor: "rgba(37, 99, 235, 1)",
          borderWidth: 2,
          tension: 0.3,
          pointBackgroundColor: "rgba(37, 99, 235, 1)",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
          },
          ticks: {
            callback: (value) => "$" + value,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => "Sales: $" + context.parsed.y,
          },
        },
      },
    },
  })
}

// Load recent activity
function loadRecentActivity() {
  const recentActivity = [
    { type: "added", title: "New item added", description: "iPhone 15 Pro Max - 10 units", time: "2 hours ago" },
    { type: "removed", title: "Item removed", description: "Samsung Galaxy S23 - 5 units", time: "5 hours ago" },
    { type: "updated", title: "Stock updated", description: 'MacBook Pro 16" - 15 units', time: "Yesterday" },
    { type: "alert", title: "Low stock alert", description: "AirPods Pro - 3 units remaining", time: "2 days ago" },
  ]

  const activityFeed = document.getElementById("recentActivity")
  activityFeed.innerHTML = ""

  recentActivity.forEach((item) => {
    const activityItem = document.createElement("div")
    activityItem.className = "activity-item"

    let iconClass = ""
    switch (item.type) {
      case "added":
        iconClass = "bi-plus-circle text-success"
        break
      case "removed":
        iconClass = "bi-dash-circle text-danger"
        break
      case "updated":
        iconClass = "bi-arrow-repeat text-primary"
        break
      case "alert":
        iconClass = "bi-exclamation-triangle text-warning"
        break
    }

    activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="bi ${iconClass}"></i>
            </div>
            <div class="activity-content">
                <h6 class="mb-1">${item.title}</h6>
                <p class="text-muted mb-0">${item.description}</p>
                <small class="text-muted">${item.time}</small>
            </div>
        `

    activityFeed.appendChild(activityItem)
  })
}

// Load top selling items
function loadTopSellingItems() {
  const topSellingItems = [
    { name: "iPhone 15 Pro Max", category: "Electronics", sold: 124, revenue: 148799.76 },
    { name: 'MacBook Pro 16"', category: "Electronics", sold: 98, revenue: 235199.02 },
    { name: "AirPods Pro", category: "Audio", sold: 87, revenue: 21749.13 },
    { name: 'iPad Pro 11"', category: "Electronics", sold: 65, revenue: 51999.35 },
  ]

  const topSellingTable = document.getElementById("topSellingTable")
  topSellingTable.innerHTML = ""

  topSellingItems.forEach((item) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.sold}</td>
            <td>${formatCurrency(item.revenue)}</td>
        `
    topSellingTable.appendChild(row)
  })
}

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

// Export inventory report as printable page
function exportInventoryReport() {
  // Fetch all inventory data
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      // Populate print template
      document.getElementById("reportDate").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
      document.getElementById("printTotalItems").textContent = document.getElementById("totalItems").textContent
      document.getElementById("printLowStockItems").textContent = document.getElementById("lowStockItems").textContent
      document.getElementById("printOutOfStockItems").textContent =
        document.getElementById("outOfStockItems").textContent
      document.getElementById("printInventoryValue").textContent = document.getElementById("inventoryValue").textContent

      // Populate inventory table
      const printTable = document.getElementById("printInventoryTable").querySelector("tbody")
      printTable.innerHTML = ""

      products.forEach((product) => {
        const row = document.createElement("tr")
        const inventoryValue = product.price * product.stock

        let statusClass = ""
        if (product.stock <= 0) {
          statusClass = "text-danger"
        } else if (product.stock < product.lowStockThreshold) {
          statusClass = "text-warning"
        } else {
          statusClass = "text-success"
        }

        row.innerHTML = `
                    <td>${product.sku}</td>
                    <td>${product.name}</td>
                    <td>${product.category.name}</td>
                    <td>${product.stock}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>${formatCurrency(inventoryValue)}</td>
                    <td class="${statusClass}">${product.stockStatus}</td>
                `

        printTable.appendChild(row)
      })

      // Open print window
      const printWindow = window.open("", "_blank")
      printWindow.document.write("<html><head><title>Inventory Report</title>")
      printWindow.document.write("<style>")
      printWindow.document.write(`
                body { font-family: Arial, sans-serif; margin: 20px; }
                .print-header { text-align: center; margin-bottom: 20px; }
                .print-summary, .print-details { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .text-danger { color: #dc3545; }
                .text-warning { color: #ffc107; }
                .text-success { color: #28a745; }
                .print-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                @media print {
                    .print-header { margin-bottom: 15px; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                }
            `)
      printWindow.document.write("</style></head><body>")
      printWindow.document.write(document.getElementById("printTemplate").innerHTML)
      printWindow.document.write("</body></html>")
      printWindow.document.close()

      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print()
      }, 500)
    })
    .catch((error) => {
      console.error("Error fetching inventory data:", error)
      alert("Failed to generate report. Please try again later.")

      // If API fails, use mock data
      exportMockInventoryReport()
    })
}

// Export mock inventory report if API fails
function exportMockInventoryReport() {
  // Mock products data
  const mockProducts = [
    {
      sku: "IP-15-PRO-256",
      name: "iPhone 15 Pro Max",
      category: { name: "Electronics" },
      stock: 15,
      price: 1199.99,
      lowStockThreshold: 5,
      stockStatus: "In Stock",
    },
    {
      sku: "MB-PRO-16-512",
      name: 'MacBook Pro 16"',
      category: { name: "Electronics" },
      stock: 12,
      price: 2399.99,
      lowStockThreshold: 3,
      stockStatus: "In Stock",
    },
    {
      sku: "AW-S7-44MM",
      name: "Apple Watch Series 7",
      category: { name: "Wearables" },
      stock: 8,
      price: 429.99,
      lowStockThreshold: 5,
      stockStatus: "Low Stock",
    },
    {
      sku: "AP-PRO-2",
      name: "AirPods Pro",
      category: { name: "Audio" },
      stock: 3,
      price: 249.99,
      lowStockThreshold: 10,
      stockStatus: "Low Stock",
    },
    {
      sku: "SG-S23-256",
      name: "Samsung Galaxy S23",
      category: { name: "Electronics" },
      stock: 0,
      price: 899.99,
      lowStockThreshold: 5,
      stockStatus: "Out of Stock",
    },
    {
      sku: "IPAD-PRO-11",
      name: 'iPad Pro 11"',
      category: { name: "Electronics" },
      stock: 10,
      price: 799.99,
      lowStockThreshold: 5,
      stockStatus: "In Stock",
    },
    {
      sku: "SONY-WH1000XM5",
      name: "Sony WH-1000XM5",
      category: { name: "Audio" },
      stock: 5,
      price: 349.99,
      lowStockThreshold: 5,
      stockStatus: "Low Stock",
    },
    {
      sku: "DELL-XPS-15",
      name: "Dell XPS 15",
      category: { name: "Electronics" },
      stock: 7,
      price: 1899.99,
      lowStockThreshold: 3,
      stockStatus: "In Stock",
    },
  ]

  // Populate print template
  document.getElementById("reportDate").textContent =
    new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString()
  document.getElementById("printTotalItems").textContent = document.getElementById("totalItems").textContent
  document.getElementById("printLowStockItems").textContent = document.getElementById("lowStockItems").textContent
  document.getElementById("printOutOfStockItems").textContent = document.getElementById("outOfStockItems").textContent
  document.getElementById("printInventoryValue").textContent = document.getElementById("inventoryValue").textContent

  // Populate inventory table
  const printTable = document.getElementById("printInventoryTable").querySelector("tbody")
  printTable.innerHTML = ""

  mockProducts.forEach((product) => {
    const row = document.createElement("tr")
    const inventoryValue = product.price * product.stock

    let statusClass = ""
    if (product.stock <= 0) {
      statusClass = "text-danger"
    } else if (product.stock < product.lowStockThreshold) {
      statusClass = "text-warning"
    } else {
      statusClass = "text-success"
    }

    row.innerHTML = `
            <td>${product.sku}</td>
            <td>${product.name}</td>
            <td>${product.category.name}</td>
            <td>${product.stock}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(inventoryValue)}</td>
            <td class="${statusClass}">${product.stockStatus}</td>
        `

    printTable.appendChild(row)
  })

  // Open print window
  const printWindow = window.open("", "_blank")
  printWindow.document.write("<html><head><title>Inventory Report</title>")
  printWindow.document.write("<style>")
  printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        .print-header { text-align: center; margin-bottom: 20px; }
        .print-summary, .print-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .text-danger { color: #dc3545; }
        .text-warning { color: #ffc107; }
        .text-success { color: #28a745; }
        .print-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        @media print {
            .print-header { margin-bottom: 15px; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
        }
    `)
  printWindow.document.write("</style></head><body>")
  printWindow.document.write(document.getElementById("printTemplate").innerHTML)
  printWindow.document.write("</body></html>")
  printWindow.document.close()

  // Wait for resources to load then print
  setTimeout(() => {
    printWindow.print()
  }, 500)
}
