document.addEventListener("DOMContentLoaded", () => {
  // Toggle sidebar
  document.getElementById("sidebarCollapse").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("active")
  })

  // Initialize DataTable
  const $ = window.jQuery // Declare the $ variable
  const inventoryTable = $("#inventoryTable").DataTable({
    responsive: true,
    pageLength: 10,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "All"],
    ],
    columnDefs: [
      { orderable: false, targets: 6 }, // Disable sorting on actions column
    ],
  })

  // Load inventory data
  loadInventoryData()

  // Load categories for filters and form
  loadCategories()

  // Set up search functionality
  document.getElementById("searchInput").addEventListener("keyup", function () {
    inventoryTable.search(this.value).draw()
  })

  // Set up filter functionality
  document.getElementById("categoryFilter").addEventListener("change", () => {
    filterTable()
  })

  document.getElementById("statusFilter").addEventListener("change", () => {
    filterTable()
  })

  document.getElementById("priceFilter").addEventListener("change", () => {
    filterTable()
  })

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.getElementById("categoryFilter").value = ""
    document.getElementById("statusFilter").value = ""
    document.getElementById("priceFilter").value = ""
    document.getElementById("searchInput").value = ""
    inventoryTable.search("").columns().search("").draw()
  })

  // Set up modal events
  const itemModal = document.getElementById("itemModal")
  itemModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget
    const isEdit = button && button.getAttribute("data-action") === "edit"

    document.getElementById("itemModalLabel").textContent = isEdit ? "Edit Item" : "Add New Item"
    document.getElementById("itemForm").reset()

    if (isEdit) {
      const itemId = button.getAttribute("data-id")
      loadItemDetails(itemId)
    } else {
      document.getElementById("itemId").value = ""
    }
  })

  // Save item button
  document.getElementById("saveItem").addEventListener("click", () => {
    saveItem()
  })

  // Delete confirmation
  const deleteModal = document.getElementById("deleteModal")
  deleteModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget
    const itemId = button.getAttribute("data-id")
    const itemName = button.getAttribute("data-name")

    document.getElementById("deleteItemName").textContent = itemName
    document.getElementById("confirmDelete").setAttribute("data-id", itemId)
  })

  // Confirm delete button
  document.getElementById("confirmDelete").addEventListener("click", function () {
    const itemId = this.getAttribute("data-id")
    deleteItem(itemId)
  })

  // Export inventory button
  document.getElementById("exportInventory").addEventListener("click", () => {
    exportInventory()
  })

  // Import inventory button
  document.getElementById("importInventory").addEventListener("click", () => {
    // This would typically open a file upload dialog
    alert("Import functionality would be implemented here.")
  })
})

// Load inventory data from API
async function loadInventoryData() {
  try {
    const response = await fetch("/api/products")
    const products = await response.json()

    populateInventoryTable(products)
  } catch (error) {
    console.error("Error loading inventory data:", error)
    // If API fails, load mock data for demonstration
    loadMockInventoryData()
  }
}

// Load mock inventory data
function loadMockInventoryData() {
  const mockProducts = [
    {
      id: 1,
      sku: "IP-15-PRO-256",
      name: "iPhone 15 Pro Max",
      category: { name: "Electronics" },
      stock: 15,
      price: 1199.99,
      lowStockThreshold: 5,
    },
    {
      id: 2,
      sku: "MB-PRO-16-512",
      name: 'MacBook Pro 16"',
      category: { name: "Electronics" },
      stock: 12,
      price: 2399.99,
      lowStockThreshold: 3,
    },
    {
      id: 3,
      sku: "AW-S7-44MM",
      name: "Apple Watch Series 7",
      category: { name: "Wearables" },
      stock: 8,
      price: 429.99,
      lowStockThreshold: 5,
    },
    {
      id: 4,
      sku: "AP-PRO-2",
      name: "AirPods Pro",
      category: { name: "Audio" },
      stock: 3,
      price: 249.99,
      lowStockThreshold: 10,
    },
    {
      id: 5,
      sku: "SG-S23-256",
      name: "Samsung Galaxy S23",
      category: { name: "Electronics" },
      stock: 0,
      price: 899.99,
      lowStockThreshold: 5,
    },
    {
      id: 6,
      sku: "IPAD-PRO-11",
      name: 'iPad Pro 11"',
      category: { name: "Electronics" },
      stock: 10,
      price: 799.99,
      lowStockThreshold: 5,
    },
    {
      id: 7,
      sku: "SONY-WH1000XM5",
      name: "Sony WH-1000XM5",
      category: { name: "Audio" },
      stock: 5,
      price: 349.99,
      lowStockThreshold: 5,
    },
    {
      id: 8,
      sku: "DELL-XPS-15",
      name: "Dell XPS 15",
      category: { name: "Electronics" },
      stock: 7,
      price: 1899.99,
      lowStockThreshold: 3,
    },
  ]

  populateInventoryTable(mockProducts)

  // Also load mock categories
  const mockCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Wearables" },
    { id: 3, name: "Audio" },
    { id: 4, name: "Accessories" },
    { id: 5, name: "Computers" },
  ]

  populateCategoryDropdowns(mockCategories)
}

// Populate inventory table with data
function populateInventoryTable(products) {
  const table = window.jQuery("#inventoryTable").DataTable() // Use window.jQuery instead of $
  table.clear()

  products.forEach((product) => {
    let stockStatus = ""
    let statusBadge = ""

    if (product.stock <= 0) {
      stockStatus = "Out of Stock"
      statusBadge = '<span class="badge bg-danger">Out of Stock</span>'
    } else if (product.stock < product.lowStockThreshold) {
      stockStatus = "Low Stock"
      statusBadge = '<span class="badge bg-warning">Low Stock</span>'
    } else {
      stockStatus = "In Stock"
      statusBadge = '<span class="badge bg-success">In Stock</span>'
    }

    const actions = `
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${product.id}" data-bs-toggle="modal" data-bs-target="#itemModal">
                    <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-eye"></i>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-id="${product.id}" data-name="${product.name}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `

    table.row.add([
      product.sku,
      product.name,
      product.category.name,
      product.stock,
      formatCurrency(product.price),
      statusBadge,
      actions,
    ])
  })

  table.draw()
}

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch("/api/categories")
    const categories = await response.json()

    populateCategoryDropdowns(categories)
  } catch (error) {
    console.error("Error loading categories:", error)
    // If API fails, categories will be loaded with mock data in loadMockInventoryData
  }
}

// Populate category dropdowns
function populateCategoryDropdowns(categories) {
  const categoryFilter = document.getElementById("categoryFilter")
  const categorySelect = document.getElementById("category")

  // Clear existing options except the first one
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1)
  }

  while (categorySelect.options.length > 0) {
    categorySelect.remove(0)
  }

  // Add categories to filter dropdown
  categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category.name
    option.textContent = category.name
    categoryFilter.appendChild(option)
  })

  // Add categories to form dropdown
  categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category.id
    option.textContent = category.name
    categorySelect.appendChild(option)
  })
}

// Filter table based on selected filters
function filterTable() {
  const table = window.jQuery("#inventoryTable").DataTable() // Use window.jQuery instead of $
  const categoryFilter = document.getElementById("categoryFilter").value
  const statusFilter = document.getElementById("statusFilter").value
  const priceFilter = document.getElementById("priceFilter").value

  // Clear existing filters
  table.columns().search("").draw()

  // Apply category filter
  if (categoryFilter) {
    table.column(2).search(categoryFilter).draw()
  }

  // Apply status filter
  if (statusFilter) {
    table.column(5).search(statusFilter).draw()
  }

  // Apply price filter
  if (priceFilter) {
    // Custom filtering for price ranges
    window.jQuery.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
      const price = Number.parseFloat(data[4].replace(/[^0-9.-]+/g, ""))

      switch (priceFilter) {
        case "0-100":
          return price < 100
        case "100-500":
          return price >= 100 && price < 500
        case "500-1000":
          return price >= 500 && price < 1000
        case "1000+":
          return price >= 1000
        default:
          return true
      }
    })

    table.draw()

    // Remove the custom filter after drawing
    window.jQuery.fn.dataTable.ext.search.pop()
  }
}

// Load item details for editing
async function loadItemDetails(itemId) {
  try {
    const response = await fetch(`/api/products/${itemId}`)
    const product = await response.json()

    // Populate form fields
    document.getElementById("itemId").value = product.id
    document.getElementById("sku").value = product.sku
    document.getElementById("name").value = product.name
    document.getElementById("description").value = product.description || ""
    document.getElementById("category").value = product.category.id
    document.getElementById("stock").value = product.stock
    document.getElementById("price").value = product.price
    document.getElementById("cost").value = product.cost
    document.getElementById("lowStockThreshold").value = product.lowStockThreshold
    document.getElementById("imageUrl").value = product.imageUrl || ""
  } catch (error) {
    console.error("Error loading item details:", error)
    alert("Failed to load item details. Please try again.")
  }
}

// Save item (create or update)
async function saveItem() {
  const itemId = document.getElementById("itemId").value
  const isEdit = itemId !== ""

  const product = {
    sku: document.getElementById("sku").value,
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    category: {
      id: document.getElementById("category").value,
    },
    stock: Number.parseInt(document.getElementById("stock").value),
    price: Number.parseFloat(document.getElementById("price").value),
    cost: Number.parseFloat(document.getElementById("cost").value),
    lowStockThreshold: Number.parseInt(document.getElementById("lowStockThreshold").value),
    imageUrl: document.getElementById("imageUrl").value,
  }

  try {
    let response

    if (isEdit) {
      // Update existing product
      response = await fetch(`/api/products/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
    } else {
      // Create new product
      response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })
    }

    if (response.ok) {
      // Close modal and reload data
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("itemModal")) // Use window.bootstrap instead of bootstrap
      modal.hide()

      // Show success message
      alert(isEdit ? "Item updated successfully!" : "Item added successfully!")

      // Reload inventory data
      loadInventoryData()
    } else {
      alert("Failed to save item. Please check your inputs and try again.")
    }
  } catch (error) {
    console.error("Error saving item:", error)
    alert("Failed to save item. Please try again later.")
  }
}

// Delete item
async function deleteItem(itemId) {
  try {
    const response = await fetch(`/api/products/${itemId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      // Close modal and reload data
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("deleteModal")) // Use window.bootstrap instead of bootstrap
      modal.hide()

      // Show success message
      alert("Item deleted successfully!")

      // Reload inventory data
      loadInventoryData()
    } else {
      alert("Failed to delete item. Please try again.")
    }
  } catch (error) {
    console.error("Error deleting item:", error)
    alert("Failed to delete item. Please try again later.")
  }
}

// Export inventory as printable page
function exportInventory() {
  // Get current table data
  const table = window.jQuery("#inventoryTable").DataTable() // Use window.jQuery instead of $
  const data = table.rows().data()

  // Open print window
  const printWindow = window.open("", "_blank")
  printWindow.document.write("<html><head><title>Inventory Report</title>")
  printWindow.document.write("<style>")
  printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        .print-header { text-align: center; margin-bottom: 20px; }
        .print-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
        th { background-color: #f2f2f2; }
        .print-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        @media print {
            .print-header { margin-bottom: 15px; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
        }
    `)
  printWindow.document.write("</style></head><body>")

  // Print header
  printWindow.document.write(`
        <div class="print-header">
            <h1>InventoryPro - Inventory Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
        </div>
    `)

  // Print inventory table
  printWindow.document.write(`
        <div class="print-details">
            <h2>Inventory Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
    `)

  // Add rows
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    printWindow.document.write("<tr>")
    // Skip the last column (actions)
    for (let j = 0; j < row.length - 1; j++) {
      printWindow.document.write(`<td>${row[j]}</td>`)
    }
    printWindow.document.write("</tr>")
  }

  printWindow.document.write(`
                </tbody>
            </table>
        </div>
    `)

  // Print footer
  printWindow.document.write(`
        <div class="print-footer">
            <p>InventoryPro &copy; 2023 - All Rights Reserved</p>
        </div>
    `)

  printWindow.document.write("</body></html>")
  printWindow.document.close()

  // Wait for resources to load then print
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}
