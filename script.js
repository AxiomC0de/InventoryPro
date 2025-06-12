document.addEventListener('DOMContentLoaded', function() {
    // Page Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Show the active page
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
        }
    }

    // Handle navigation item clicks
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = item.getAttribute('data-page');
            showPage(pageId);

            // Toggle active class for nav items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Set default active page
    showPage('dashboard');
    
    // Modal for Add/Edit Product
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const closeModal = document.getElementById('closeModal');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const productForm = document.getElementById('productForm');

    // Open Modal
    addProductBtn.addEventListener('click', function() {
        productModal.classList.add('active');
    });

    // Close Modal
    closeModal.addEventListener('click', function() {
        productModal.classList.remove('active');
    });

    cancelBtn.addEventListener('click', function() {
        productModal.classList.remove('active');
    });

    // Handle Save Product
    saveBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const formData = new FormData(productForm);
        const product = {
            name: formData.get('name'),
            sku: formData.get('sku'),
            category: formData.get('category'),
            quantity: formData.get('quantity'),
            price: formData.get('price'),
            cost: formData.get('cost'),
            minStock: formData.get('minStock'),
            maxStock: formData.get('maxStock'),
            supplier: formData.get('supplier'),
            location: formData.get('location')
        };

        // Simulate saving the product to inventory
        console.log('Product Saved:', product);
        
        // Close the modal after saving
        productModal.classList.remove('active');

        // Optionally, you can reset the form after saving
        productForm.reset();
    });

    // Product Table Population (mock data)
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const inventoryGrid = document.getElementById('inventoryGrid');

    const products = [
        { name: 'Laptop', sku: '12345', category: 'Electronics', quantity: 50, price: 799.99, status: 'In Stock' },
        { name: 'Smartphone', sku: '67890', category: 'Electronics', quantity: 30, price: 499.99, status: 'Low Stock' },
        { name: 'Socks', sku: '11223', category: 'Clothing', quantity: 200, price: 5.99, status: 'In Stock' },
        { name: 'Coffee Maker', sku: '44556', category: 'Home', quantity: 10, price: 89.99, status: 'Out of Stock' }
    ];

    // Function to populate table
    function populateTable() {
        inventoryTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox"></td>
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>$${product.price}</td>
                <td><span class="status-badge ${product.status === 'In Stock' ? 'status-in-stock' : product.status === 'Low Stock' ? 'status-low-stock' : 'status-out-of-stock'}">${product.status}</span></td>
                <td>Last Updated</td>
                <td>
                    <button class="action-btn edit">Edit</button>
                    <button class="action-btn delete">Delete</button>
                </td>
            `;
            inventoryTableBody.appendChild(row);
        });
    }

    // Function to populate grid
    function populateGrid() {
        inventoryGrid.innerHTML = '';
        products.forEach(product => {
            const item = document.createElement('div');
            item.classList.add('grid-item');
            item.innerHTML = `
                <div class="grid-item-header">
                    <img class="grid-item-image" src="https://via.placeholder.com/60" alt="${product.name}">
                    <div class="grid-item-info">
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                </div>
                <div class="grid-item-details">
                    <div class="grid-detail">
                        <div class="grid-detail-label">Quantity</div>
                        <div class="grid-detail-value">${product.quantity}</div>
                    </div>
                    <div class="grid-detail">
                        <div class="grid-detail-label">Price</div>
                        <div class="grid-detail-value">$${product.price}</div>
                    </div>
                </div>
                <div class="grid-item-footer">
                    <button class="btn btn-primary">View</button>
                </div>
            `;
            inventoryGrid.appendChild(item);
        });
    }

    // Handle Table/Grid View Toggle
    const toggleViewBtn = document.getElementById('toggleView');
    toggleViewBtn.addEventListener('click', function() {
        const isGridView = inventoryGrid.style.display === 'grid';
        if (isGridView) {
            inventoryGrid.style.display = 'none';
            inventoryTableBody.style.display = 'table-row-group';
            toggleViewBtn.innerHTML = 'Grid View';
        } else {
            inventoryTableBody.style.display = 'none';
            inventoryGrid.style.display = 'grid';
            toggleViewBtn.innerHTML = 'Table View';
        }
    });

    // Handle Search and Filters
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    searchInput.addEventListener('input', function() {
        const searchValue = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchValue) || 
            product.sku.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );
        updateTableAndGrid(filteredProducts);
    });

    categoryFilter.addEventListener('change', function() {
        const categoryValue = categoryFilter.value;
        const filteredProducts = products.filter(product => 
            categoryValue === '' || product.category === categoryValue
        );
        updateTableAndGrid(filteredProducts);
    });

    statusFilter.addEventListener('change', function() {
        const statusValue = statusFilter.value;
        const filteredProducts = products.filter(product => 
            statusValue === '' || product.status === statusValue
        );
        updateTableAndGrid(filteredProducts);
    });

    // Function to update table and grid based on filter/search
    function updateTableAndGrid(filteredProducts) {
        if (inventoryTableBody.style.display !== 'none') {
            inventoryTableBody.innerHTML = '';
            filteredProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${product.name}</td>
                    <td>${product.sku}</td>
                    <td>${product.category}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price}</td>
                    <td><span class="status-badge ${product.status === 'In Stock' ? 'status-in-stock' : product.status === 'Low Stock' ? 'status-low-stock' : 'status-out-of-stock'}">${product.status}</span></td>
                    <td>Last Updated</td>
                    <td>
                        <button class="action-btn edit">Edit</button>
                        <button class="action-btn delete">Delete</button>
                    </td>
                `;
                inventoryTableBody.appendChild(row);
            });
        }

        if (inventoryGrid.style.display !== 'none') {
            inventoryGrid.innerHTML = '';
            filteredProducts.forEach(product => {
                const item = document.createElement('div');
                item.classList.add('grid-item');
                item.innerHTML = `
                    <div class="grid-item-header">
                        <img class="grid-item-image" src="https://via.placeholder.com/60" alt="${product.name}">
                        <div class="grid-item-info">
                            <h4>${product.name}</h4>
                            <p>${product.category}</p>
                        </div>
                    </div>
                    <div class="grid-item-details">
                        <div class="grid-detail">
                            <div class="grid-detail-label">Quantity</div>
                            <div class="grid-detail-value">${product.quantity}</div>
                        </div>
                        <div class="grid-detail">
                            <div class="grid-detail-label">Price</div>
                            <div class="grid-detail-value">$${product.price}</div>
                        </div>
                    </div>
                    <div class="grid-item-footer">
                        <button class="btn btn-primary">View</button>
                    </div>
                `;
                inventoryGrid.appendChild(item);
            });
        }
    }

    // Initial population of the table/grid
    populateTable();
    populateGrid();
});
