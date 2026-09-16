const STORAGE_KEY = 'business-pos-pro-v1';
const DELIVERY_STATUSES = ['Preparing', 'Ready for Delivery', 'Dispatched', 'On the Way', 'Arrived', 'Delivered', 'Failed'];
const DELIVERY_FAILURE_REASONS = ['Customer unavailable', 'Wrong address', 'Customer cancelled', 'Other'];

const defaultState = {
  session: {
    loggedIn: false,
    userId: null
  },
  business: {
    name: 'BusinessPOS Pro',
    phone: '0700000000',
    address: 'Kampala, Uganda'
  },
  users: [
    { id: 'user-admin', username: 'admin', password: 'admin123', displayName: 'Admin', role: 'admin', phone: '', email: '', address: '' },
    { id: 'user-sales', username: 'sales', password: 'sales123', displayName: 'Sales', role: 'sales', phone: '', email: '', address: '' },
    { id: 'user-purchase', username: 'purchase', password: 'purchase123', displayName: 'Purchase & Inventory', role: 'purchase', phone: '', email: '', address: '' }
  ],
  products: [
    { id: 'prod-1', name: 'Coke 500ml', category: 'Beverages', sku: 'COKE500', buyingPrice: 1200, sellingPrice: 2000, stock: 50, lowStockThreshold: 10 },
    { id: 'prod-2', name: 'Bread', category: 'Bakery', sku: 'BREAD', buyingPrice: 1800, sellingPrice: 3500, stock: 12, lowStockThreshold: 5 },
    { id: 'prod-3', name: 'Sugar 1kg', category: 'Groceries', sku: 'SUGAR1', buyingPrice: 2600, sellingPrice: 5000, stock: 4, lowStockThreshold: 5 },
    { id: 'prod-4', name: 'Samsung TV 32"', category: 'Electronics', sku: 'TV32', buyingPrice: 620000, sellingPrice: 850000, stock: 7, lowStockThreshold: 2 },
    { id: 'prod-5', name: 'Men Shirt', category: 'Fashion', sku: 'SHIRT', buyingPrice: 12000, sellingPrice: 30000, stock: 15, lowStockThreshold: 5 }
  ],
  customers: [
    { id: 'cust-1', name: 'Walk-in Customer', phone: '', type: 'Physical', balance: 0, totalPurchases: 0 },
    { id: 'cust-2', name: 'John', phone: '0701234567', type: 'Call Order', balance: 50000, totalPurchases: 450000 }
  ],
  vendors: [
    { id: 'vend-1', name: 'ABC Distributors', phone: '0709876543', amountOwed: 300000 },
    { id: 'vend-2', name: 'Fresh Foods Ltd', phone: '0776543210', amountOwed: 0 }
  ],
  sales: [
    {
      id: 'sale-1',
      createdAt: '2026-09-15T09:15:00',
      customerId: 'cust-1',
      customerName: 'Walk-in Customer',
      customerType: 'Physical',
      cashierId: 'user-admin',
      cashierName: 'Admin',
      items: [
        { productId: 'prod-5', name: 'Men Shirt', qty: 2, price: 30000, total: 60000 }
      ],
      subtotal: 60000,
      discount: 0,
      total: 60000,
      paymentMethod: 'Mobile Money',
      status: 'Completed',
      receiptNo: 'POS-1001'
    }
  ],
  purchases: [
    {
      id: 'pur-1',
      createdAt: '2026-09-15T08:00:00',
      vendorId: 'vend-2',
      vendorName: 'Fresh Foods Ltd',
      actorId: 'user-admin',
      actorName: 'Admin',
      items: [
        { productId: 'prod-1', name: 'Coke 500ml', qty: 20, buyingPrice: 1200, total: 24000 }
      ],
      total: 24000
    }
  ],
  expenses: [
    { id: 'exp-1', name: 'Electricity', amount: 100000, date: '2026-09-15', description: 'Monthly office power bill' },
    { id: 'exp-2', name: 'Transport', amount: 50000, date: '2026-09-15', description: 'Delivery transport' }
  ],
  payments: [
    { id: 'pay-1', type: 'Income', label: 'Customer payment', amount: 250000, date: '2026-09-15' },
    { id: 'pay-2', type: 'Expense', label: 'Rent', amount: 300000, date: '2026-09-15' }
  ],
  deliveries: [
    { id: 'del-1', customerName: 'John', address: 'Kampala, Nakawa', phone: '0701234567', fee: 15000, status: 'Pending' },
    { id: 'del-2', customerName: 'Mary', address: 'Mbarara Road', phone: '0771234567', fee: 12000, status: 'Delivered' }
  ]
};

const state = loadState();
const saleDraft = {
  items: [],
  customerId: '',
  paymentMethod: 'Cash',
  discount: 0
};
const purchaseDraft = { items: [], vendorId: '' };

const navButtons = document.querySelectorAll('.nav-item');
const pageTitle = document.getElementById('page-title');
const sections = document.querySelectorAll('.module-section');
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

const salesCustomerSelect = document.getElementById('sales-customer');
const salesCashierSelect = document.getElementById('sales-cashier');
const salesPaymentMethod = document.getElementById('sales-payment-method');
const salesProductSelect = document.getElementById('sales-product');
const salesQtyInput = document.getElementById('sales-qty');
const salesDiscountInput = document.getElementById('sales-discount');
const salesCartBox = document.getElementById('sales-cart');
const salesSubtotal = document.getElementById('sales-subtotal');
const salesDiscountTotal = document.getElementById('sales-discount-total');
const salesGrandTotal = document.getElementById('sales-grand-total');
const salesHistoryBox = document.getElementById('sales-history');
const receiptPreview = document.getElementById('receipt-preview');

const purchaseVendorSelect = document.getElementById('purchase-vendor');
const purchaseProductSelect = document.getElementById('purchase-product');
const purchaseQtyInput = document.getElementById('purchase-qty');
const purchasePriceInput = document.getElementById('purchase-price');
const purchaseCartBox = document.getElementById('purchase-cart');
const purchaseGrandTotal = document.getElementById('purchase-grand-total');
const purchaseHistoryBox = document.getElementById('purchase-history');

const customerForm = document.getElementById('customer-form');
const customerSearch = document.getElementById('customer-search');
const customerListBox = document.getElementById('customer-list');
const businessSettingsForm = document.getElementById('business-settings-form');
const staffAccountForm = document.getElementById('staff-account-form');
const staffAccountList = document.getElementById('staff-account-list');

const vendorForm = document.getElementById('vendor-form');
const vendorSearch = document.getElementById('vendor-search');
const vendorListBox = document.getElementById('vendor-list');

const productForm = document.getElementById('product-form');
const lowStockListBox = document.getElementById('low-stock-list');
const productListBox = document.getElementById('product-list');

const expenseForm = document.getElementById('expense-form');
const paymentForm = document.getElementById('payment-form');
const expenseHistoryBox = document.getElementById('expense-history');
const todayIncome = document.getElementById('today-income');
const todayExpenses = document.getElementById('today-expenses');
const todayProfit = document.getElementById('today-profit');

const deliveryListBox = document.getElementById('delivery-list');
const deliverySummary = document.getElementById('delivery-summary');
const deliveryBoardCount = document.getElementById('delivery-board-count');
const deliveryFilterDate = document.getElementById('delivery-filter-date');
const deliveryFilterStatus = document.getElementById('delivery-filter-status');
const deliveryFilterDriver = document.getElementById('delivery-filter-driver');
const deliveryFilterCustomer = document.getElementById('delivery-filter-customer');
const deliveryModal = document.getElementById('delivery-modal');
const deliveryModalForm = document.getElementById('delivery-modal-form');
const deliveryModalTitle = document.getElementById('delivery-modal-title');
const deliveryModalFields = document.getElementById('delivery-modal-fields');
const deliveryModalSubmit = document.getElementById('delivery-modal-submit');
let deliveryModalAction = '';
let deliveryModalDeliveryId = '';
const historyYearSelect = document.getElementById('history-year');
const historyMonthSelect = document.getElementById('history-month');
const historyCalendar = document.getElementById('history-calendar');
const historySelectedTitle = document.getElementById('history-selected-title');
const historySelectedTotal = document.getElementById('history-selected-total');
const historySelectedList = document.getElementById('history-selected-list');

const historyView = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  day: new Date().getDate()
};

const liveStockBadge = document.getElementById('live-stock-badge');
const lowStockBadge = document.getElementById('low-stock-badge');

let lastReceiptText = 'No sale completed yet.';

setup();

function setup() {
  bindNavigation();
  bindSalesActions();
  bindPurchaseActions();
  bindCustomerActions();
  bindVendorActions();
  bindInventoryActions();
  bindAccountActions();
  bindDeliveryActions();
  bindHistoryActions();
  bindAdminSettingsActions();
  bindAuthActions();
  renderAll();
  applyAuthState();
}

function loadState() {
  const freshState = JSON.parse(JSON.stringify(defaultState));
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return freshState;

  try {
    const parsed = JSON.parse(saved);
    return {
      ...freshState,
      ...parsed,
      session: {
        ...freshState.session,
        ...(parsed.session || {})
      },
      business: {
        ...freshState.business,
        ...(parsed.business || {})
      },
      users: parsed.users || freshState.users,
      products: parsed.products || freshState.products,
      customers: parsed.customers || freshState.customers,
      vendors: parsed.vendors || freshState.vendors,
      sales: parsed.sales || freshState.sales,
      purchases: parsed.purchases || freshState.purchases,
      expenses: parsed.expenses || freshState.expenses,
      payments: parsed.payments || freshState.payments,
      deliveries: (parsed.deliveries || freshState.deliveries).map(normalizeDelivery)
    };
  } catch (error) {
    return freshState;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function bindNavigation() {
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.section;
      pageTitle.textContent = button.textContent.trim();
      sections.forEach((section) => section.classList.toggle('active', section.id === target));
      navButtons.forEach((item) => item.classList.toggle('active', item === button));
    });
  });
}

function bindAuthActions() {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const user = state.users.find((entry) => entry.username === username && entry.password === password);
    if (user) {
      state.session.loggedIn = true;
      state.session.userId = user.id;
      saveState();
      applyAuthState();
    } else {
      alert('Invalid login credentials. Use admin / admin123');
    }
  });

  logoutButton.addEventListener('click', () => {
    state.session.loggedIn = false;
    state.session.userId = null;
    saveState();
    applyAuthState();
  });
}

function applyAuthState() {
  const isLoggedIn = !!(state.session && state.session.loggedIn);
  loginOverlay.classList.toggle('hidden', isLoggedIn);
  document.getElementById('app-shell').style.filter = isLoggedIn ? 'none' : 'blur(2px)';
  if (!isLoggedIn) {
    document.getElementById('login-password').value = 'admin123';
  }
  applyRolePermissions();
  renderAll();
}

function getCurrentUser() {
  return state.users.find((user) => user.id === state.session?.userId) || state.users[0];
}

function hasRole(...roles) {
  return roles.includes(getCurrentUser()?.role);
}

function applyRolePermissions() {
  const user = getCurrentUser();
  const role = user?.role || 'admin';
  const allowedSections = {
    admin: ['dashboard', 'sales', 'purchases', 'customers', 'vendors', 'inventory', 'accounts', 'delivery', 'history'],
    sales: ['dashboard', 'sales', 'inventory', 'delivery', 'history'],
    purchase: ['dashboard', 'purchases', 'inventory', 'delivery', 'history'],
    delivery: ['delivery']
  }[role] || ['dashboard'];

  renderCashierOptions();

  navButtons.forEach((button) => {
    button.hidden = !allowedSections.includes(button.dataset.section);
  });
  sections.forEach((section) => {
    section.hidden = !allowedSections.includes(section.id);
  });

  const salesEditor = document.querySelector('#sales .card-grid:first-child');
  if (salesEditor) salesEditor.hidden = role === 'purchase';
  const receiptPanel = document.getElementById('customer-editor-panel');
  if (receiptPanel) receiptPanel.hidden = role === 'purchase';
  if (salesCashierSelect) salesCashierSelect.disabled = role !== 'admin';
  const inventoryEditor = document.querySelector('#inventory .card-grid:first-child .panel-card:first-child');
  if (inventoryEditor) inventoryEditor.hidden = role === 'sales';
  const deliveryEditor = document.getElementById('delivery-create-panel');
  if (deliveryEditor) deliveryEditor.hidden = role === 'purchase';
  if (document.getElementById('admin-settings-panel')) {
    document.getElementById('admin-settings-panel').hidden = role !== 'admin';
  }
}

function bindSalesActions() {
  document.getElementById('add-sale-item').addEventListener('click', addSaleItem);
  document.getElementById('clear-sales-draft').addEventListener('click', clearSaleDraft);
  document.getElementById('complete-sale').addEventListener('click', completeSale);
  document.getElementById('print-receipt').addEventListener('click', () => {
    if (hasRole('purchase')) return;
    window.print();
  });
  salesPaymentMethod.addEventListener('change', () => {
    saleDraft.paymentMethod = salesPaymentMethod.value;
  });
  salesCashierSelect.addEventListener('change', () => {
    saleDraft.cashierId = salesCashierSelect.value;
  });
  salesDiscountInput.addEventListener('input', (event) => {
    saleDraft.discount = Number(event.target.value || 0);
    renderSalesSummary();
  });
  document.getElementById('sales-requires-delivery').addEventListener('change', (event) => {
    document.getElementById('sales-delivery-details').hidden = !event.target.checked;
    document.getElementById('sales-delivery-fee-field').hidden = !event.target.checked;
    document.getElementById('sales-delivery-address').required = event.target.checked;
  });
}

function bindPurchaseActions() {
  document.getElementById('add-purchase-item').addEventListener('click', addPurchaseItem);
  document.getElementById('complete-purchase').addEventListener('click', completePurchase);
}

function bindCustomerActions() {
  customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('customer-id').value;
    const customer = {
      id: id || uid('cust'),
      name: document.getElementById('customer-name').value.trim(),
      phone: document.getElementById('customer-phone').value.trim(),
      type: document.getElementById('customer-type').value,
      balance: Number(document.getElementById('customer-balance').value || 0),
      totalPurchases: 0
    };
    if (!customer.name) {
      alert('Customer name is required.');
      return;
    }

    const existing = state.customers.find((entry) => entry.id === customer.id);
    if (existing) {
      Object.assign(existing, customer);
    } else {
      state.customers.push(customer);
    }
    saveState();
    customerForm.reset();
    renderAll();
  });

  document.getElementById('reset-customer-form').addEventListener('click', () => {
    customerForm.reset();
    document.getElementById('customer-id').value = '';
  });

  customerSearch.addEventListener('input', renderCustomers);
}

function bindAdminSettingsActions() {
  businessSettingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (getCurrentUser()?.role !== 'admin') return;
    state.business.name = document.getElementById('business-name').value.trim();
    state.business.phone = document.getElementById('business-phone').value.trim();
    state.business.address = document.getElementById('business-address').value.trim();
    saveState();
    renderAdminSettings();
    alert('Business details saved.');
  });

  staffAccountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (getCurrentUser()?.role !== 'admin') return;
    const id = document.getElementById('staff-id').value;
    const username = document.getElementById('staff-username').value.trim();
    const existing = state.users.find((user) => user.id === id);
    const password = document.getElementById('staff-password').value;
    if (!username || (!existing && !password)) {
      alert('Username and password are required for a new account.');
      return;
    }
    if (state.users.some((user) => user.id !== id && user.username.toLowerCase() === username.toLowerCase())) {
      alert('That username is already registered.');
      return;
    }
    const account = {
      id: id || uid('user'),
      username,
      password: password || existing?.password,
      displayName: document.getElementById('staff-name').value.trim(),
      role: document.getElementById('staff-role').value,
      phone: document.getElementById('staff-phone').value.trim(),
      email: document.getElementById('staff-email').value.trim(),
      address: document.getElementById('staff-address').value.trim()
    };
    if (!account.displayName) {
      alert('Full name is required.');
      return;
    }
    if (existing) Object.assign(existing, account);
    else state.users.push(account);
    saveState();
    resetStaffForm();
    renderAll();
    alert(existing ? 'Account details updated.' : 'Staff account registered.');
  });

  document.getElementById('reset-staff-form').addEventListener('click', resetStaffForm);
  staffAccountList.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-user]');
    const deleteButton = event.target.closest('[data-delete-user]');
    if (editButton) editStaffAccount(editButton.dataset.editUser);
    if (deleteButton) deleteStaffAccount(deleteButton.dataset.deleteUser);
  });
}

function resetStaffForm() {
  staffAccountForm.reset();
  document.getElementById('staff-id').value = '';
  document.getElementById('staff-password').required = true;
  document.getElementById('staff-submit-button').textContent = 'Register Staff Account';
}

function editStaffAccount(userId) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) return;
  document.getElementById('staff-id').value = user.id;
  document.getElementById('staff-name').value = user.displayName || '';
  document.getElementById('staff-username').value = user.username || '';
  document.getElementById('staff-password').value = '';
  document.getElementById('staff-password').required = false;
  document.getElementById('staff-role').value = user.role || 'sales';
  document.getElementById('staff-phone').value = user.phone || '';
  document.getElementById('staff-email').value = user.email || '';
  document.getElementById('staff-address').value = user.address || '';
  document.getElementById('staff-submit-button').textContent = 'Update Account';
  document.getElementById('staff-name').focus();
}

function deleteStaffAccount(userId) {
  const user = state.users.find((entry) => entry.id === userId);
  if (!user) return;
  if (user.id === state.session.userId) {
    alert('You cannot delete the account you are currently using.');
    return;
  }
  if (user.role === 'admin' && state.users.filter((entry) => entry.role === 'admin').length === 1) {
    alert('At least one administrator account must remain.');
    return;
  }
  if (!confirm(`Delete the account for ${user.displayName}?`)) return;
  state.users = state.users.filter((entry) => entry.id !== userId);
  saveState();
  renderAll();
}

function bindVendorActions() {
  vendorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('vendor-id').value;
    const vendor = {
      id: id || uid('vend'),
      name: document.getElementById('vendor-name').value.trim(),
      phone: document.getElementById('vendor-phone').value.trim(),
      amountOwed: Number(document.getElementById('vendor-owed').value || 0)
    };
    if (!vendor.name) {
      alert('Vendor name is required.');
      return;
    }

    const existing = state.vendors.find((entry) => entry.id === vendor.id);
    if (existing) {
      Object.assign(existing, vendor);
    } else {
      state.vendors.push(vendor);
    }
    saveState();
    vendorForm.reset();
    renderAll();
  });

  document.getElementById('reset-vendor-form').addEventListener('click', () => {
    vendorForm.reset();
    document.getElementById('vendor-id').value = '';
  });

  vendorSearch.addEventListener('input', renderVendors);
}

function bindInventoryActions() {
  productForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!hasRole('admin', 'purchase')) {
      alert('Your account can view inventory only.');
      return;
    }
    const id = document.getElementById('product-id').value;
    const product = {
      id: id || uid('prod'),
      name: document.getElementById('product-name').value.trim(),
      category: document.getElementById('product-category').value.trim(),
      sku: document.getElementById('product-sku').value.trim(),
      buyingPrice: Number(document.getElementById('product-buying-price').value || 0),
      sellingPrice: Number(document.getElementById('product-selling-price').value || 0),
      stock: Number(document.getElementById('product-stock').value || 0),
      lowStockThreshold: Number(document.getElementById('product-low-stock').value || 0)
    };
    if (!product.name) {
      alert('Product name is required.');
      return;
    }

    const existing = state.products.find((entry) => entry.id === product.id);
    if (existing) {
      Object.assign(existing, product);
    } else {
      state.products.push(product);
    }
    saveState();
    productForm.reset();
    renderAll();
  });

  document.getElementById('reset-product-form').addEventListener('click', () => {
    productForm.reset();
    document.getElementById('product-id').value = '';
  });
}

function bindAccountActions() {
  expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const item = {
      id: uid('exp'),
      name: document.getElementById('expense-name').value.trim(),
      amount: Number(document.getElementById('expense-amount').value || 0),
      date: document.getElementById('expense-date').value || dateISO(),
      description: document.getElementById('expense-description').value.trim()
    };
    if (!item.name || item.amount <= 0) {
      alert('Please provide a valid expense name and amount.');
      return;
    }
    state.expenses.push(item);
    saveState();
    expenseForm.reset();
    renderAccounts();
  });

  paymentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const item = {
      id: uid('pay'),
      type: document.getElementById('payment-type').value,
      label: document.getElementById('payment-label').value.trim(),
      amount: Number(document.getElementById('payment-amount').value || 0),
      date: document.getElementById('payment-date').value || dateISO()
    };
    if (!item.label || item.amount <= 0) {
      alert('Please provide a valid payment label and amount.');
      return;
    }
    state.payments.push(item);
    saveState();
    paymentForm.reset();
    renderAccounts();
  });
}

function bindDeliveryActions() {
  [deliveryFilterDate, deliveryFilterStatus, deliveryFilterDriver, deliveryFilterCustomer].forEach((control) => {
    control.addEventListener('input', renderDeliveries);
    control.addEventListener('change', renderDeliveries);
  });
  deliveryListBox.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-delivery-action]');
    if (!actionButton) return;
    handleDeliveryAction(actionButton.dataset.deliveryAction, actionButton.dataset.deliveryId);
  });
  document.getElementById('delivery-modal-cancel').addEventListener('click', closeDeliveryModal);
  deliveryModalForm.addEventListener('submit', submitDeliveryModal);
  deliveryModalFields.addEventListener('change', (event) => {
    if (event.target.id === 'delivery-failure-reason') {
      document.getElementById('delivery-failure-description-field').hidden = event.target.value !== 'Other';
    }
  });
}

function bindHistoryActions() {
  historyYearSelect.addEventListener('change', () => {
    historyView.year = Number(historyYearSelect.value);
    historyView.day = 1;
    renderHistoryCalendar();
  });

  historyMonthSelect.addEventListener('change', () => {
    historyView.month = Number(historyMonthSelect.value);
    historyView.day = 1;
    renderHistoryCalendar();
  });

  document.getElementById('history-today').addEventListener('click', () => {
    const today = new Date();
    historyView.year = today.getFullYear();
    historyView.month = today.getMonth();
    historyView.day = today.getDate();
    renderHistoryCalendar();
  });

  historyCalendar.addEventListener('click', (event) => {
    const dayButton = event.target.closest('[data-history-day]');
    if (!dayButton) return;
    historyView.day = Number(dayButton.dataset.historyDay);
    renderHistoryCalendar();
  });
}

function addSaleItem() {
  const productId = salesProductSelect.value;
  const qty = Number(salesQtyInput.value || 0);
  if (!productId || qty <= 0) {
    alert('Choose a valid product and quantity.');
    return;
  }

  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;

  if (qty > product.stock) {
    alert(`Only ${product.stock} units available for ${product.name}.`);
    return;
  }

  const existing = saleDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.total = existing.qty * product.sellingPrice;
  } else {
    saleDraft.items.push({
      productId: product.id,
      name: product.name,
      qty,
      price: product.sellingPrice,
      total: product.sellingPrice * qty
    });
  }

  saleDraft.customerId = salesCustomerSelect.value || 'cust-1';
  saleDraft.paymentMethod = salesPaymentMethod.value;
  renderSalesSummary();
}

function clearSaleDraft() {
  saleDraft.items = [];
  saleDraft.customerId = salesCustomerSelect.value || 'cust-1';
  saleDraft.discount = 0;
  salesDiscountInput.value = '0';
  document.getElementById('sales-requires-delivery').checked = false;
  document.getElementById('sales-delivery-details').hidden = true;
  document.getElementById('sales-delivery-fee-field').hidden = true;
  document.getElementById('sales-delivery-address').required = false;
  document.getElementById('sales-delivery-address').value = '';
  document.getElementById('sales-delivery-fee').value = '0';
  renderSalesSummary();
}

function completeSale() {
  if (!hasRole('admin', 'sales')) {
    alert('Your account can view sales but cannot record sales.');
    return;
  }
  if (!saleDraft.items.length) {
    alert('Add at least one item to the sale.');
    return;
  }

  const subtotal = saleDraft.items.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(saleDraft.discount || 0);
  const total = Math.max(subtotal - discount, 0);
  const customerId = salesCustomerSelect.value || 'cust-1';
  const customer = state.customers.find((entry) => entry.id === customerId) || state.customers[0];
  const requiresDelivery = document.getElementById('sales-requires-delivery').checked;
  const deliveryAddress = document.getElementById('sales-delivery-address').value.trim();
  const deliveryFee = Number(document.getElementById('sales-delivery-fee').value || 0);
  if (requiresDelivery && !deliveryAddress) {
    alert('Delivery address is required for a delivery sale.');
    return;
  }
  const cashier = state.users.find((entry) => entry.id === salesCashierSelect.value) || getCurrentUser();
  const sale = {
    id: uid('sale'),
    createdAt: new Date().toISOString(),
    customerId: customer.id,
    customerName: customer.name,
    customerType: customer.type || 'Physical',
    cashierId: cashier.id,
    cashierName: cashier.displayName,
    items: saleDraft.items.map((item) => ({ ...item })),
    subtotal,
    discount,
    total,
    paymentMethod: saleDraft.paymentMethod,
    status: 'Completed',
    receiptNo: `POS-${Date.now().toString().slice(-6)}`,
    requiresDelivery,
    deliveryAddress: requiresDelivery ? deliveryAddress : '',
    deliveryFee: requiresDelivery ? deliveryFee : 0
  };

  const saleItems = sale.items;
  saleItems.forEach((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (product) {
      product.stock = Math.max(product.stock - item.qty, 0);
    }
  });

  if (sale.paymentMethod === 'Credit') {
    customer.balance = Number(customer.balance || 0) + total;
  }

  customer.totalPurchases = Number(customer.totalPurchases || 0) + total;
  state.sales.unshift(sale);
  if (requiresDelivery) createDeliveryFromSale(sale, customer);
  lastReceiptText = buildReceiptText(sale);
  receiptPreview.textContent = lastReceiptText;
  saveState();
  clearSaleDraft();
  renderAll();
  renderDashboard();
}

function createDeliveryFromSale(sale, customer) {
  const createdAt = new Date().toISOString();
  state.deliveries.unshift({
    id: uid('del'),
    deliveryNo: `D${sale.receiptNo.replace(/\D/g, '')}`,
    saleId: sale.id,
    receiptNo: sale.receiptNo,
    customerId: customer.id,
    customerName: customer.name,
    address: sale.deliveryAddress,
    phone: customer.phone || '',
    orderTotal: sale.total,
    fee: sale.deliveryFee,
    status: 'Preparing',
    driverId: '',
    driverName: '',
    pin: String(Math.floor(1000 + Math.random() * 9000)),
    createdAt,
    timestamps: { created: createdAt },
    failureReason: '',
    failureDescription: ''
  });
}

function addPurchaseItem() {
  const productId = purchaseProductSelect.value;
  const qty = Number(purchaseQtyInput.value || 0);
  const sellingPrice = Number(purchasePriceInput.value || 0);
  if (!productId || qty <= 0 || sellingPrice < 0) {
    alert('Choose a valid product, quantity, and buying price.');
    return;
  }

  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;

  const existing = purchaseDraft.items.find((entry) => entry.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.total = existing.qty * sellingPrice;
  } else {
    purchaseDraft.items.push({
      productId: product.id,
      name: product.name,
      qty,
      buyingPrice: sellingPrice,
      total: qty * sellingPrice
    });
  }
  purchaseDraft.vendorId = purchaseVendorSelect.value || state.vendors[0]?.id || '';
  renderPurchases();
}

function completePurchase() {
  if (!hasRole('admin', 'purchase')) {
    alert('Only admin or purchase accounts can record purchases.');
    return;
  }
  if (!purchaseDraft.items.length) {
    alert('Add at least one purchase item.');
    return;
  }

  const vendorId = purchaseVendorSelect.value || state.vendors[0]?.id || '';
  const vendor = state.vendors.find((entry) => entry.id === vendorId);
  if (!vendor) {
    alert('Select a valid vendor.');
    return;
  }

  const total = purchaseDraft.items.reduce((sum, item) => sum + item.total, 0);
  const record = {
    id: uid('pur'),
    createdAt: new Date().toISOString(),
    vendorId: vendor.id,
    vendorName: vendor.name,
    actorId: getCurrentUser().id,
    actorName: getCurrentUser().displayName,
    items: purchaseDraft.items.map((item) => ({ ...item })),
    total
  };

  record.items.forEach((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (product) {
      product.stock += item.qty;
      product.buyingPrice = item.buyingPrice || product.buyingPrice;
    }
  });

  vendor.amountOwed = Number(vendor.amountOwed || 0) + total;
  state.purchases.unshift(record);
  saveState();
  purchaseDraft.items = [];
  renderAll();
  renderDashboard();
}

function renderAll() {
  renderDashboard();
  renderProductOptions();
  renderCustomerOptions();
  renderCashierOptions();
  renderVendorOptions();
  renderSalesSummary();
  renderPurchases();
  renderCustomers();
  renderVendors();
  renderInventory();
  renderAccounts();
  renderDeliveries();
  renderHistoryCalendar();
  renderAdminSettings();
  renderBadgeSummary();
}

function renderCashierOptions() {
  const currentUser = getCurrentUser();
  const cashiers = state.users.filter((user) => user.role === 'admin' || user.role === 'sales');
  salesCashierSelect.innerHTML = cashiers.map((user) => `<option value="${user.id}">${user.displayName}</option>`).join('');
  const selectedId = currentUser.role === 'admin' ? salesCashierSelect.value : currentUser.id;
  salesCashierSelect.value = cashiers.some((user) => user.id === selectedId) ? selectedId : currentUser.id;
  salesCashierSelect.disabled = currentUser.role !== 'admin';
}

function renderAdminSettings() {
  if (!businessSettingsForm || !staffAccountList) return;
  document.getElementById('business-name').value = state.business.name || '';
  document.getElementById('business-phone').value = state.business.phone || '';
  document.getElementById('business-address').value = state.business.address || '';
  staffAccountList.innerHTML = `
    <div class="list-header"><span>Account</span><span>Contact</span><span>Department</span><span>Status</span><span>Actions</span></div>
    ${state.users.map((user) => `
      <div class="list-row">
        <span><strong>${escapeHtml(user.displayName)}</strong><br><span class="text-muted">@${escapeHtml(user.username)}</span></span>
        <span>${escapeHtml(user.phone || 'No phone')}<br><span class="text-muted">${escapeHtml(user.email || 'No email')}</span></span>
        <span>${formatRole(user.role)}<br><span class="text-muted">${escapeHtml(user.address || 'No address')}</span></span>
        <span class="text-muted">Active account</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-user="${user.id}">Edit</button>
          <button class="small-btn delete" data-delete-user="${user.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  `;
}

function getTransactionHistory() {
  const entries = [];
  const currentUser = getCurrentUser();
  const role = currentUser?.role;

  const visibleSales = getVisibleSales();
  visibleSales.forEach((sale) => {
    entries.push({
      id: sale.id,
      type: 'Sale',
      label: sale.receiptNo,
      amount: sale.total,
      date: sale.createdAt || new Date().toISOString(),
      reference: `${sale.customerName} · Cashier: ${sale.cashierName || 'Admin'}`,
      category: 'Sales',
      direction: 'income'
    });
  });

  const visiblePurchases = getVisiblePurchases();
  visiblePurchases.forEach((purchase) => {
    entries.push({
      id: purchase.id,
      type: 'Purchase',
      label: purchase.vendorName,
      amount: purchase.total,
      date: purchase.createdAt || new Date().toISOString(),
      reference: `${purchase.vendorName} · By: ${purchase.actorName || 'Admin'}`,
      category: 'Purchases',
      direction: 'expense'
    });
  });

  if (role === 'admin') state.expenses.forEach((expense) => {
    entries.push({
      id: expense.id,
      type: 'Expense',
      label: expense.name,
      amount: expense.amount,
      date: expense.date ? `${expense.date}T00:00:00` : new Date().toISOString(),
      reference: expense.description || 'Operating cost',
      category: 'Expenses',
      direction: 'expense'
    });
  });

  if (role === 'admin') state.payments.forEach((payment) => {
    entries.push({
      id: payment.id,
      type: payment.type,
      label: payment.label,
      amount: payment.amount,
      date: payment.date ? `${payment.date}T00:00:00` : new Date().toISOString(),
      reference: payment.label,
      category: payment.type === 'Income' ? 'Cash In' : 'Cash Out',
      direction: payment.type === 'Income' ? 'income' : 'expense'
    });
  });

  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getVisibleSales() {
  const currentUser = getCurrentUser();
  if (currentUser?.role === 'sales') {
    return state.sales.filter((sale) => sale.cashierId === currentUser.id);
  }
  return currentUser?.role === 'purchase' ? [] : state.sales;
}

function getVisiblePurchases() {
  const currentUser = getCurrentUser();
  if (currentUser?.role === 'purchase') {
    return state.purchases.filter((purchase) => purchase.actorId === currentUser.id);
  }
  return currentUser?.role === 'sales' ? [] : state.purchases;
}

function buildPeriodSummary(transactions, period) {
  const bucket = {};

  transactions.forEach((entry) => {
    const date = new Date(entry.date);
    const key = period === 'day'
      ? date.toISOString().slice(0, 10)
      : period === 'month'
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : `${date.getFullYear()}`;

    if (!bucket[key]) {
      bucket[key] = { label: key, income: 0, expense: 0, transactions: 0 };
    }

    bucket[key].transactions += 1;
    if (entry.direction === 'income') {
      bucket[key].income += Number(entry.amount || 0);
    } else {
      bucket[key].expense += Number(entry.amount || 0);
    }
  });

  return Object.values(bucket)
    .map((item) => ({ ...item, net: item.income - item.expense }))
    .sort((a, b) => b.label.localeCompare(a.label));
}

function renderLiveTransactions() {
  const today = dateISO();
  const visibleSales = getVisibleSales();
  const visiblePurchases = getVisiblePurchases();
  const liveTransactionTypes = [
    { label: 'Sales', icon: '↗', accent: 'var(--accent)', count: visibleSales.filter((entry) => localDateKey(entry.createdAt) === today).length },
    { label: 'Purchases', icon: '↓', accent: 'var(--primary)', count: visiblePurchases.filter((entry) => localDateKey(entry.createdAt) === today).length },
    { label: 'Expenses', icon: '−', accent: 'var(--danger)', count: state.expenses.filter((entry) => entry.date === today).length },
    { label: 'Payments', icon: '↔', accent: 'var(--warning)', count: state.payments.filter((entry) => entry.date === today).length }
  ];

  document.getElementById('live-transactions-date').textContent = new Date().toLocaleDateString('en-UG', { dateStyle: 'full' });
  document.getElementById('live-transactions').innerHTML = liveTransactionTypes.map((item) => `
    <div class="live-transaction-card" style="--card-accent:${item.accent}">
      <div class="live-transaction-icon">${item.icon}</div>
      <h4>${item.label}</h4>
      <strong>${item.count}</strong>
    </div>
  `).join('');
}

function localDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function renderHistoryCalendar() {
  const transactions = getTransactionHistory();
  const transactionDates = new Set(transactions.map((entry) => localDateKey(entry.date)));
  const years = new Set([new Date().getFullYear(), historyView.year]);

  transactions.forEach((entry) => {
    const date = new Date(entry.date);
    if (!Number.isNaN(date.getTime())) years.add(date.getFullYear());
  });

  historyYearSelect.innerHTML = [...years]
    .sort((a, b) => b - a)
    .map((year) => `<option value="${year}">${year}</option>`)
    .join('');
  historyYearSelect.value = String(historyView.year);
  historyMonthSelect.value = String(historyView.month);

  const firstDay = new Date(historyView.year, historyView.month, 1).getDay();
  const daysInMonth = new Date(historyView.year, historyView.month + 1, 0).getDate();
  const selectedDateKey = `${historyView.year}-${String(historyView.month + 1).padStart(2, '0')}-${String(historyView.day).padStart(2, '0')}`;
  const todayKey = localDateKey(new Date());
  const monthName = new Date(historyView.year, historyView.month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const headings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    .map((day) => `<div class="calendar-heading">${day}</div>`)
    .join('');
  const emptyDays = Array.from({ length: firstDay }, () => '<div class="calendar-empty"></div>').join('');
  const dayButtons = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateKey = `${historyView.year}-${String(historyView.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const classes = [
      'calendar-day',
      dateKey === selectedDateKey ? 'selected' : '',
      dateKey === todayKey ? 'today' : '',
      transactionDates.has(dateKey) ? 'has-transactions' : ''
    ].filter(Boolean).join(' ');
    return `<button class="${classes}" type="button" data-history-day="${day}" aria-label="View transactions for ${dateKey}"><span class="calendar-day-number">${day}</span></button>`;
  }).join('');

  historyCalendar.innerHTML = `<div class="calendar-month-label">${monthName}</div>${headings}${emptyDays}${dayButtons}`;

  const selectedTransactions = transactions.filter((entry) => localDateKey(entry.date) === selectedDateKey);
  const selectedNet = selectedTransactions.reduce((total, entry) => total + (entry.direction === 'income' ? entry.amount : -entry.amount), 0);
  historySelectedTitle.textContent = `Activity for ${new Date(historyView.year, historyView.month, historyView.day).toLocaleDateString('en-UG', { dateStyle: 'full' })}`;
  historySelectedTotal.textContent = formatCurrency(selectedNet);
  historySelectedList.innerHTML = selectedTransactions.length ? `
    <div class="list-header">
      <span>Record</span>
      <span>Type</span>
      <span>Time</span>
      <span>Amount</span>
      <span>Details</span>
    </div>
    ${selectedTransactions.map((entry) => `
      <div class="list-row">
        <span><strong>${entry.label}</strong></span>
        <span class="history-record-type">${entry.type}</span>
        <span>${formatDate(entry.date)}</span>
        <span class="${entry.direction === 'income' ? 'income' : 'expense'}">${entry.direction === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}</span>
        <span>${entry.reference}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No purchases, sales, expenses, or payments recorded for this day.</div>';
}

function renderDashboard() {
  const visibleSales = getVisibleSales();
  const totalRevenue = visibleSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = state.expenses.reduce((sum, entry) => sum + entry.amount, 0) + state.payments.filter((item) => item.type === 'Expense').reduce((sum, entry) => sum + entry.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  document.getElementById('dashboard-total-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('dashboard-total-expenses').textContent = formatCurrency(totalExpenses);
  document.getElementById('dashboard-net-profit').textContent = formatCurrency(netProfit);
  renderLiveTransactions();

  const chartData = visibleSales.slice(0, 6).reverse();
  const maxValue = chartData.length ? Math.max(...chartData.map((sale) => sale.total), 1) : 1;
  const bars = chartData.length ? chartData.map((sale) => `
    <div class="chart-bar-wrap">
      <div class="chart-bar" style="height:${Math.max((sale.total / maxValue) * 150, 18)}px"></div>
      <span class="chart-label">${new Date(sale.createdAt).toLocaleDateString('en-US', { month: 'short' })}</span>
    </div>
  `).join('') : '<div class="empty-state">No sales data for charting.</div>';
  document.getElementById('dashboard-chart').innerHTML = bars;

  const summaryItems = [
    { label: 'Products in Stock', value: state.products.reduce((sum, product) => sum + product.stock, 0) },
    { label: 'Low Stock Items', value: state.products.filter((product) => product.stock <= product.lowStockThreshold).length },
    { label: 'Customers', value: state.customers.length },
    { label: 'Vendors', value: state.vendors.length }
  ];

  document.getElementById('dashboard-summary').innerHTML = summaryItems.map((item) => `
    <div class="summary-item">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </div>
  `).join('');

  const recentSales = visibleSales.slice(0, 5);
  document.getElementById('dashboard-recent-sales').innerHTML = recentSales.length ? `
    <div class="list-header">
      <span>Receipt</span>
      <span>Customer</span>
      <span>Total</span>
      <span>Method</span>
    </div>
    ${recentSales.map((sale) => `
      <div class="list-row">
        <span>${sale.receiptNo}</span>
        <span>${sale.customerName}</span>
        <span>${formatCurrency(sale.total)}</span>
        <span>${sale.paymentMethod}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No recent sales.</div>';

}

function renderProductOptions() {
  const selectedSalesProduct = salesProductSelect.value;
  const selectedPurchaseProduct = purchaseProductSelect.value;
  const productOptions = state.products.map((product) => `<option value="${product.id}">${product.name} · ${product.stock} in stock</option>`).join('');
  salesProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;
  purchaseProductSelect.innerHTML = `<option value="">Select product</option>${productOptions}`;

  const firstProductId = state.products[0]?.id || '';
  salesProductSelect.value = state.products.some((product) => product.id === selectedSalesProduct)
    ? selectedSalesProduct
    : firstProductId;
  purchaseProductSelect.value = state.products.some((product) => product.id === selectedPurchaseProduct)
    ? selectedPurchaseProduct
    : firstProductId;
}

function renderCustomerOptions() {
  const options = state.customers.map((customer) => `<option value="${customer.id}">${customer.name} · ${customer.type || 'Physical'}</option>`).join('');
  salesCustomerSelect.innerHTML = options;
  const firstCustomer = state.customers.find((customer) => customer.id === 'cust-1') || state.customers[0];
  if (firstCustomer) salesCustomerSelect.value = saleDraft.customerId || firstCustomer.id;
  saleDraft.customerId = salesCustomerSelect.value || 'cust-1';
  salesPaymentMethod.value = saleDraft.paymentMethod;
}

function renderVendorOptions() {
  const options = state.vendors.map((vendor) => `<option value="${vendor.id}">${vendor.name}</option>`).join('');
  purchaseVendorSelect.innerHTML = `<option value="">Select vendor</option>${options}`;
  if (state.vendors.length) {
    purchaseVendorSelect.value = purchaseDraft.vendorId || state.vendors[0].id;
    purchaseDraft.vendorId = purchaseVendorSelect.value;
  }
}

function renderSalesSummary() {
  const subtotal = saleDraft.items.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(saleDraft.discount || 0);
  const total = Math.max(subtotal - discount, 0);

  salesSubtotal.textContent = formatCurrency(subtotal);
  salesDiscountTotal.textContent = formatCurrency(discount);
  salesGrandTotal.textContent = formatCurrency(total);

  salesCartBox.innerHTML = saleDraft.items.length ? `
    <div class="list-header">
      <span>Item</span>
      <span>Qty</span>
      <span>Price</span>
      <span>Total</span>
      <span></span>
    </div>
    ${saleDraft.items.map((item) => `
      <div class="list-row">
        <span class="item-name">${item.name}</span>
        <span>${item.qty}</span>
        <span>${formatCurrency(item.price)}</span>
        <span>${formatCurrency(item.total)}</span>
        <button class="small-btn delete" data-remove-sale-item="${item.productId}">Remove</button>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No items yet in this sale.</div>';

  salesCartBox.querySelectorAll('[data-remove-sale-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.removeSaleItem;
      saleDraft.items = saleDraft.items.filter((item) => item.productId !== targetId);
      renderSalesSummary();
    });
  });

  const currentUser = getCurrentUser();
  const visibleSales = getVisibleSales();
  const history = visibleSales.map((sale) => `
    <div class="list-row">
      <span>
        <strong>${sale.receiptNo}</strong><br>
        <span class="text-muted">${formatDate(sale.createdAt)} · ${sale.cashierName || 'Admin'}</span>
      </span>
      <span>${sale.customerName}</span>
      <span>${formatCurrency(sale.total)}</span>
      <span>${sale.paymentMethod}</span>
        ${currentUser?.role === 'admin' ? `<span class="action-controls">
          <button class="small-btn success" data-return-sale="${sale.id}">Return</button>
        </span>` : '<span></span>'}
    </div>
  `).join('');

  salesHistoryBox.innerHTML = visibleSales.length ? `
    <div class="list-header">
      <span>Receipt</span>
      <span>Customer</span>
      <span>Total</span>
      <span>Method</span>
      <span>Action</span>
    </div>
    ${history}
  ` : '<div class="empty-state">No sales recorded yet.</div>';

  salesHistoryBox.querySelectorAll('[data-return-sale]').forEach((button) => {
    button.addEventListener('click', () => {
      const saleId = button.dataset.returnSale;
      returnSale(saleId);
    });
  });

  if (saleDraft.items.length) {
    document.getElementById('sale-status-tag').textContent = 'Draft';
  } else {
    document.getElementById('sale-status-tag').textContent = 'Draft';
  }
}

function renderPurchases() {
  const total = purchaseDraft.items.reduce((sum, item) => sum + item.total, 0);
  purchaseGrandTotal.textContent = formatCurrency(total);

  purchaseCartBox.innerHTML = purchaseDraft.items.length ? `
    <div class="list-header">
      <span>Item</span>
      <span>Qty</span>
      <span>Price</span>
      <span>Total</span>
      <span></span>
    </div>
    ${purchaseDraft.items.map((item) => `
      <div class="list-row">
        <span class="item-name">${item.name}</span>
        <span>${item.qty}</span>
        <span>${formatCurrency(item.buyingPrice)}</span>
        <span>${formatCurrency(item.total)}</span>
        <button class="small-btn delete" data-remove-purchase-item="${item.productId}">Remove</button>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No purchase items yet.</div>';

  purchaseCartBox.querySelectorAll('[data-remove-purchase-item]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.removePurchaseItem;
      purchaseDraft.items = purchaseDraft.items.filter((item) => item.productId !== targetId);
      renderPurchases();
    });
  });

  const currentUser = getCurrentUser();
  const visiblePurchases = getVisiblePurchases();
  purchaseHistoryBox.innerHTML = visiblePurchases.length ? `
    <div class="list-header">
      <span>Vendor</span>
      <span>Date</span>
      <span>Total</span>
      <span>Recorded by</span>
    </div>
    ${visiblePurchases.map((purchase) => `
      <div class="list-row">
        <span>${purchase.vendorName}</span>
        <span>${formatDate(purchase.createdAt)}</span>
        <span>${formatCurrency(purchase.total)}</span>
        <span>${purchase.actorName || 'Admin'} · ${purchase.items.length} item(s)</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No supplier purchases recorded.</div>';
}

function renderCustomers() {
  const filter = customerSearch.value.trim().toLowerCase();
  const filtered = state.customers.filter((customer) => {
    const haystack = `${customer.name} ${customer.phone}`.toLowerCase();
    return haystack.includes(filter);
  });

  customerListBox.innerHTML = filtered.length ? `
    <div class="list-header">
      <span>Customer</span>
      <span>Phone</span>
      <span>Balance</span>
      <span>Action</span>
    </div>
    ${filtered.map((customer) => `
      <div class="list-row">
        <span>
          <strong>${customer.name}</strong><br>
          <span class="text-muted">${customer.type || 'Physical'} · Total purchases: ${formatCurrency(customer.totalPurchases || 0)}</span>
        </span>
        <span>${customer.phone || '—'}</span>
        <span>${formatCurrency(customer.balance || 0)}</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-customer="${customer.id}">Edit</button>
          <button class="small-btn delete" data-delete-customer="${customer.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No customer found.</div>';

  customerListBox.querySelectorAll('[data-edit-customer]').forEach((button) => {
    button.addEventListener('click', () => {
      const customer = state.customers.find((entry) => entry.id === button.dataset.editCustomer);
      if (!customer) return;
      document.getElementById('customer-id').value = customer.id;
      document.getElementById('customer-name').value = customer.name;
      document.getElementById('customer-phone').value = customer.phone || '';
      document.getElementById('customer-type').value = customer.type || 'Physical';
      document.getElementById('customer-balance').value = customer.balance || 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  customerListBox.querySelectorAll('[data-delete-customer]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteCustomer;
      if (!confirm('Delete this customer?')) return;
      state.customers = state.customers.filter((entry) => entry.id !== id);
      saveState();
      renderAll();
    });
  });
}

function renderVendors() {
  const filter = vendorSearch.value.trim().toLowerCase();
  const filtered = state.vendors.filter((vendor) => vendor.name.toLowerCase().includes(filter));

  vendorListBox.innerHTML = filtered.length ? `
    <div class="list-header">
      <span>Vendor</span>
      <span>Phone</span>
      <span>Owed</span>
      <span>Action</span>
    </div>
    ${filtered.map((vendor) => `
      <div class="list-row">
        <span>
          <strong>${vendor.name}</strong><br>
          <span class="text-muted">Products supplied</span>
        </span>
        <span>${vendor.phone || '—'}</span>
        <span>${formatCurrency(vendor.amountOwed || 0)}</span>
        <span class="action-controls">
          <button class="small-btn edit" data-edit-vendor="${vendor.id}">Edit</button>
          <button class="small-btn delete" data-delete-vendor="${vendor.id}">Delete</button>
        </span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No vendor found.</div>';

  vendorListBox.querySelectorAll('[data-edit-vendor]').forEach((button) => {
    button.addEventListener('click', () => {
      const vendor = state.vendors.find((entry) => entry.id === button.dataset.editVendor);
      if (!vendor) return;
      document.getElementById('vendor-id').value = vendor.id;
      document.getElementById('vendor-name').value = vendor.name;
      document.getElementById('vendor-phone').value = vendor.phone || '';
      document.getElementById('vendor-owed').value = vendor.amountOwed || 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  vendorListBox.querySelectorAll('[data-delete-vendor]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.deleteVendor;
      if (!confirm('Delete this vendor?')) return;
      state.vendors = state.vendors.filter((entry) => entry.id !== id);
      saveState();
      renderAll();
    });
  });
}

function renderInventory() {
  const canManageInventory = hasRole('admin', 'purchase');
  const lowStock = state.products.filter((product) => product.stock <= product.lowStockThreshold);
  lowStockListBox.innerHTML = lowStock.length ? lowStock.map((product) => `
    <div class="low-stock-item">⚠️ ${product.name} — Stock: ${product.stock} (threshold: ${product.lowStockThreshold})</div>
  `).join('') : '<div class="empty-state">All products are above the low-stock threshold.</div>';

  productListBox.innerHTML = `
    <div class="list-header">
      <span>Product</span>
      <span>Price</span>
      <span>Stock</span>
      <span>Low Stock</span>
      ${canManageInventory ? '<span>Action</span>' : ''}
    </div>
    ${state.products.map((product) => `
      <div class="list-row">
        <span>
          <strong>${product.name}</strong><br>
          <span class="text-muted">${product.category || 'General'} • ${product.sku || '—'}</span>
        </span>
        <span>${formatCurrency(product.sellingPrice)}<br><span class="text-muted">Buy: ${formatCurrency(product.buyingPrice)}</span></span>
        <span>${product.stock}</span>
        <span>${product.lowStockThreshold}</span>
        ${canManageInventory ? `<span class="action-controls">
          <button class="small-btn edit" data-edit-product="${product.id}">Edit</button>
          <button class="small-btn delete" data-delete-product="${product.id}">Delete</button>
        </span>` : ''}
      </div>
    `).join('')}
  `;

  productListBox.querySelectorAll('[data-edit-product]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!canManageInventory) return;
      const product = state.products.find((entry) => entry.id === button.dataset.editProduct);
      if (!product) return;
      document.getElementById('product-id').value = product.id;
      document.getElementById('product-name').value = product.name;
      document.getElementById('product-category').value = product.category || '';
      document.getElementById('product-sku').value = product.sku || '';
      document.getElementById('product-buying-price').value = product.buyingPrice || 0;
      document.getElementById('product-selling-price').value = product.sellingPrice || 0;
      document.getElementById('product-stock').value = product.stock || 0;
      document.getElementById('product-low-stock').value = product.lowStockThreshold || 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  productListBox.querySelectorAll('[data-delete-product]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!canManageInventory) return;
      const id = button.dataset.deleteProduct;
      if (!confirm('Delete this product?')) return;
      state.products = state.products.filter((entry) => entry.id !== id);
      saveState();
      renderAll();
    });
  });

  renderBadgeSummary();
}

function renderAccounts() {
  const today = dateISO();
  const income = state.sales.filter((sale) => sale.createdAt && sale.createdAt.startsWith(today)).reduce((sum, sale) => sum + sale.total, 0);
  const expenses = state.expenses.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);
  const paymentExpense = state.payments.filter((entry) => entry.type === 'Expense' && entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);
  const paymentIncome = state.payments.filter((entry) => entry.type === 'Income' && entry.date === today).reduce((sum, entry) => sum + entry.amount, 0);

  const totalIncome = income + paymentIncome;
  const totalExpense = expenses + paymentExpense;
  const profit = totalIncome - totalExpense;

  todayIncome.textContent = formatCurrency(totalIncome);
  todayExpenses.textContent = formatCurrency(totalExpense);
  todayProfit.textContent = formatCurrency(profit);

  const ledger = [...state.expenses, ...state.payments.map((item) => ({
    id: item.id,
    name: item.label,
    amount: item.amount,
    date: item.date,
    description: `Cash ${item.type}`
  }))].sort((a, b) => new Date(b.date) - new Date(a.date));

  expenseHistoryBox.innerHTML = ledger.length ? `
    <div class="list-header">
      <span>Name</span>
      <span>Date</span>
      <span>Amount</span>
      <span>Description</span>
    </div>
    ${ledger.map((entry) => `
      <div class="list-row">
        <span>${entry.name}</span>
        <span>${formatDate(entry.date)}</span>
        <span>${formatCurrency(entry.amount)}</span>
        <span>${entry.description || '—'}</span>
      </div>
    `).join('')}
  ` : '<div class="empty-state">No ledger entries yet.</div>';
}

function renderDeliveries() {
  const currentUser = getCurrentUser();
  const selectedStatus = deliveryFilterStatus.value;
  const selectedDriver = deliveryFilterDriver.value;
  const visibleDeliveries = state.deliveries
    .filter((delivery) => currentUser?.role !== 'delivery' || delivery.driverId === currentUser.id)
    .filter((delivery) => !deliveryFilterDate.value || (delivery.createdAt || '').startsWith(deliveryFilterDate.value))
    .filter((delivery) => !deliveryFilterStatus.value || delivery.status === deliveryFilterStatus.value)
    .filter((delivery) => !deliveryFilterDriver.value || delivery.driverId === deliveryFilterDriver.value)
    .filter((delivery) => {
      const query = deliveryFilterCustomer.value.trim().toLowerCase();
      return !query || `${delivery.customerName} ${delivery.phone}`.toLowerCase().includes(query);
    });

  deliveryBoardCount.textContent = `${visibleDeliveries.length} deliver${visibleDeliveries.length === 1 ? 'y' : 'ies'}`;
  deliveryFilterStatus.innerHTML = `<option value="">All statuses</option>${DELIVERY_STATUSES.map((status) => `<option value="${status}">${status}</option>`).join('')}`;
  deliveryFilterStatus.value = deliveryFilterStatus.value || '';
  const drivers = state.users.filter((user) => user.role === 'delivery' || user.role === 'sales');
  deliveryFilterDriver.innerHTML = `<option value="">All delivery people</option>${drivers.map((driver) => `<option value="${driver.id}">${escapeHtml(driver.displayName)}</option>`).join('')}`;
  deliveryFilterStatus.value = selectedStatus;
  deliveryFilterDriver.value = selectedDriver;

  deliverySummary.innerHTML = DELIVERY_STATUSES.map((status) => `<span class="delivery-summary-item"><strong>${state.deliveries.filter((delivery) => delivery.status === status).length}</strong>${status}</span>`).join('');
  deliveryListBox.innerHTML = visibleDeliveries.length ? `
    <div class="delivery-board">
      ${visibleDeliveries.map((delivery) => renderDeliveryCard(delivery, currentUser)).join('')}
    </div>
  ` : '<div class="empty-state">No deliveries match the selected filters.</div>';
}

function renderDeliveryCard(delivery, currentUser) {
  const canSeePin = currentUser?.role !== 'delivery' || delivery.driverId === currentUser.id;
  return `<article class="delivery-card">
    <div class="delivery-card-head">
      <div><strong>DELIVERY #${escapeHtml(delivery.deliveryNo || delivery.id)}</strong><br><span class="text-muted">Sale ${escapeHtml(delivery.receiptNo || 'Not linked')} · ${formatDate(delivery.createdAt)}</span></div>
      <span class="delivery-status status-${slugify(delivery.status)}">${escapeHtml(delivery.status)}</span>
    </div>
    <div class="delivery-card-grid">
      <div><span class="label">Customer</span><strong>${escapeHtml(delivery.customerName)}</strong><span>${escapeHtml(delivery.phone || 'No phone')}</span></div>
      <div><span class="label">Address</span><strong>${escapeHtml(delivery.address || 'No address')}</strong></div>
      <div><span class="label">Order / Fee</span><strong>${formatCurrency(delivery.orderTotal)}</strong><span>Fee: ${formatCurrency(delivery.fee)}</span></div>
      <div><span class="label">Delivery Person</span><strong>${escapeHtml(delivery.driverName || 'Unassigned')}</strong>${canSeePin ? `<span>Customer PIN: <strong>${escapeHtml(delivery.pin)}</strong></span>` : ''}</div>
    </div>
    ${delivery.failureReason ? `<div class="delivery-failure"><strong>Failed:</strong> ${escapeHtml(delivery.failureReason)}${delivery.failureDescription ? ` · ${escapeHtml(delivery.failureDescription)}` : ''}</div>` : ''}
    <div class="delivery-card-foot"><span class="text-muted">${formatDeliveryTimeline(delivery)}</span><span class="action-controls">${renderDeliveryActions(delivery, currentUser)}</span></div>
  </article>`;
}

function renderDeliveryActions(delivery, currentUser) {
  const isAssigned = delivery.driverId === currentUser?.id;
  const isManager = hasRole('admin', 'sales');
  const canOperate = isManager || (currentUser?.role === 'delivery' && isAssigned);
  const actions = [];
  if (isManager && !['Delivered', 'Failed'].includes(delivery.status)) actions.push(`<button class="small-btn edit" data-delivery-action="assign" data-delivery-id="${delivery.id}">${delivery.driverId ? 'Reassign' : 'Assign'}</button>`);
  if (isManager && delivery.status === 'Preparing') actions.push(actionButton('ready', delivery.id, 'Ready for Delivery'));
  if (isManager && delivery.status === 'Ready for Delivery') actions.push(actionButton('dispatch', delivery.id, 'Dispatch'));
  if (canOperate && delivery.status === 'Dispatched') actions.push(actionButton('start', delivery.id, 'Start Delivery'));
  if (canOperate && delivery.status === 'On the Way') actions.push(actionButton('arrive', delivery.id, "I've Arrived"));
  if (canOperate && delivery.status === 'Arrived') actions.push(actionButton('confirm', delivery.id, 'Confirm Delivery'));
  if (canOperate && !['Delivered', 'Failed'].includes(delivery.status)) actions.push(`<button class="small-btn delete" data-delivery-action="fail" data-delivery-id="${delivery.id}">Mark Failed</button>`);
  return actions.join('') || '<span class="text-muted">No action</span>';
}

function actionButton(action, id, label) {
  return `<button class="small-btn success" data-delivery-action="${action}" data-delivery-id="${id}">${label}</button>`;
}

function formatDeliveryTimeline(delivery) {
  const timestamps = delivery.timestamps || {};
  const latest = Object.entries(timestamps).sort((a, b) => new Date(b[1]) - new Date(a[1]))[0];
  return latest ? `${latest[0].replace(/^./, (character) => character.toUpperCase())}: ${formatDate(latest[1])}` : 'No events recorded';
}

function handleDeliveryAction(action, deliveryId) {
  const delivery = state.deliveries.find((entry) => entry.id === deliveryId);
  const currentUser = getCurrentUser();
  if (!delivery) return;
  const isManager = hasRole('admin', 'sales');
  const isAssigned = delivery.driverId === currentUser?.id;
  if (action === 'assign') return openDeliveryModal(action, delivery);
  if (currentUser?.role === 'delivery' && !isAssigned) return alert('You can only manage deliveries assigned to you.');
  if (!isManager && currentUser?.role !== 'delivery') return alert('Your account is not authorized to update deliveries.');
  const nextStatus = { ready: 'Ready for Delivery', dispatch: 'Dispatched', start: 'On the Way', arrive: 'Arrived' }[action];
  if (nextStatus) return transitionDelivery(delivery, nextStatus);
  if (action === 'confirm' || action === 'fail') return openDeliveryModal(action, delivery);
}

function openDeliveryModal(action, delivery) {
  if (action === 'assign' && !hasRole('admin', 'sales')) return alert('Only managers can assign delivery people.');
  deliveryModalAction = action;
  deliveryModalDeliveryId = delivery.id;
  deliveryModalTitle.textContent = action === 'assign' ? 'Assign delivery person' : action === 'confirm' ? 'Confirm delivery' : 'Mark delivery failed';
  deliveryModalSubmit.textContent = action === 'assign' ? 'Assign' : action === 'confirm' ? 'Confirm Delivery' : 'Mark Failed';
  if (action === 'assign') {
    const drivers = state.users.filter((user) => user.role === 'delivery' || user.role === 'sales');
    deliveryModalFields.innerHTML = `<div class="field"><label for="delivery-driver-choice">Delivery Person</label><select id="delivery-driver-choice" required>${drivers.map((driver) => `<option value="${driver.id}" ${driver.id === delivery.driverId ? 'selected' : ''}>${escapeHtml(driver.displayName)}</option>`).join('')}</select></div>`;
  } else if (action === 'confirm') {
    deliveryModalFields.innerHTML = '<div class="field"><label for="delivery-pin-entry">Customer 4-digit PIN</label><input id="delivery-pin-entry" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" required autofocus /></div>';
  } else {
    deliveryModalFields.innerHTML = `<div class="field"><label for="delivery-failure-reason">Failure reason</label><select id="delivery-failure-reason" required>${DELIVERY_FAILURE_REASONS.map((reason) => `<option value="${reason}">${reason}</option>`).join('')}</select></div><div class="field" id="delivery-failure-description-field" hidden><label for="delivery-failure-description">Description</label><textarea id="delivery-failure-description" rows="3" placeholder="Describe the issue" required></textarea></div>`;
  }
  deliveryModal.hidden = false;
}

function closeDeliveryModal() {
  deliveryModal.hidden = true;
  deliveryModalForm.reset();
  deliveryModalAction = '';
  deliveryModalDeliveryId = '';
}

function submitDeliveryModal(event) {
  event.preventDefault();
  const delivery = state.deliveries.find((entry) => entry.id === deliveryModalDeliveryId);
  if (!delivery) return closeDeliveryModal();
  if (deliveryModalAction === 'assign') {
    const driver = state.users.find((user) => user.id === document.getElementById('delivery-driver-choice').value);
    if (driver) assignDelivery(delivery, driver);
  } else if (deliveryModalAction === 'confirm') {
    confirmDelivery(delivery, document.getElementById('delivery-pin-entry').value.trim());
  } else if (deliveryModalAction === 'fail') {
    failDelivery(delivery, document.getElementById('delivery-failure-reason').value, document.getElementById('delivery-failure-description')?.value.trim() || '');
  }
  closeDeliveryModal();
}

function assignDelivery(delivery, driver) {
  if (!hasRole('admin', 'sales')) return alert('Only managers can assign delivery people.');
  if (!driver) return;
  delivery.driverId = driver.id;
  delivery.driverName = driver.displayName;
  saveState();
  renderDeliveries();
}

function transitionDelivery(delivery, nextStatus) {
  const expectedNext = { Preparing: 'Ready for Delivery', 'Ready for Delivery': 'Dispatched', Dispatched: 'On the Way', 'On the Way': 'Arrived' }[delivery.status];
  if (expectedNext !== nextStatus) return alert(`This delivery must move from ${delivery.status} to ${expectedNext || 'a final status'} first.`);
  if (nextStatus === 'Dispatched' && !delivery.driverId) return alert('Assign a delivery person before dispatching this order.');
  const timestamp = new Date().toISOString();
  delivery.status = nextStatus;
  delivery.timestamps[nextStatusTimestampKey(nextStatus)] = timestamp;
  saveState();
  renderDeliveries();
}

function confirmDelivery(delivery, enteredPin) {
  if (delivery.status !== 'Arrived') return alert('The delivery must be marked Arrived before confirmation.');
  if (enteredPin !== delivery.pin) return alert('Incorrect delivery PIN. Delivery was not completed.');
  const timestamp = new Date().toISOString();
  delivery.status = 'Delivered';
  delivery.timestamps.delivered = timestamp;
  saveState();
  renderDeliveries();
  alert('Delivery confirmed successfully.');
}

function failDelivery(delivery, selectedReason, description) {
  if (!selectedReason) return;
  if (selectedReason === 'Other' && !description) return alert('A description is required for Other.');
  delivery.status = 'Failed';
  delivery.failureReason = selectedReason;
  delivery.failureDescription = description || '';
  delivery.timestamps.failed = new Date().toISOString();
  saveState();
  renderDeliveries();
}

function nextStatusTimestampKey(status) {
  return { 'Ready for Delivery': 'ready', Dispatched: 'dispatched', 'On the Way': 'started', Arrived: 'arrived' }[status];
}

function renderBadgeSummary() {
  const totalProducts = state.products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockCount = state.products.filter((product) => product.stock <= product.lowStockThreshold).length;
  liveStockBadge.textContent = totalProducts;
  lowStockBadge.textContent = lowStockCount;
}

function returnSale(saleId) {
  const sale = state.sales.find((entry) => entry.id === saleId);
  if (!sale) return;

  sale.items.forEach((item) => {
    const product = state.products.find((entry) => entry.id === item.productId);
    if (product) {
      product.stock += item.qty;
    }
  });

  state.sales = state.sales.filter((entry) => entry.id !== saleId);
  saveState();
  renderAll();
  alert(`Returned sale ${sale.receiptNo}. Inventory adjusted.`);
}

function buildReceiptText(sale) {
  const soldItems = sale.items.map((item) => `${item.name} x${item.qty} @ ${formatCurrency(item.price)} = ${formatCurrency(item.total)}`).join('\n');
  return [
    state.business.name || 'BUSINESSPOS PRO',
    `Contact: ${state.business.phone || '—'}`,
    state.business.address ? `Address: ${state.business.address}` : '',
    '====================',
    `Receipt: ${sale.receiptNo}`,
    `Date: ${formatDate(sale.createdAt)}`,
    `Customer: ${sale.customerName}`,
    `Customer type: ${sale.customerType || 'Physical'}`,
    `Cashier: ${sale.cashierName || 'Admin'}`,
    'Items:',
    soldItems,
    `Subtotal: ${formatCurrency(sale.subtotal)}`,
    `Discount: ${formatCurrency(sale.discount)}`,
    `Total: ${formatCurrency(sale.total)}`,
    `Payment: ${sale.paymentMethod}`,
    sale.requiresDelivery ? `Delivery: Yes\nAddress: ${sale.deliveryAddress}\nDelivery fee: ${formatCurrency(sale.deliveryFee)}\nDelivery PIN: ${state.deliveries.find((delivery) => delivery.saleId === sale.id)?.pin || '—'}` : 'Delivery: No',
    'Thank you for your purchase.'
  ].join('\n');
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeDelivery(delivery) {
  const createdAt = delivery.createdAt || new Date().toISOString();
  const legacyStatus = { Pending: 'Preparing', 'Out for Delivery': 'Dispatched' }[delivery.status] || delivery.status;
  return {
    ...delivery,
    deliveryNo: delivery.deliveryNo || `D${String(delivery.id || uid('del')).replace(/\D/g, '').slice(-6) || Date.now().toString().slice(-6)}`,
    status: DELIVERY_STATUSES.includes(legacyStatus) ? legacyStatus : 'Preparing',
    orderTotal: Number(delivery.orderTotal || 0),
    fee: Number(delivery.fee || 0),
    driverId: delivery.driverId || '',
    driverName: delivery.driverName || '',
    pin: delivery.pin || String(Math.floor(1000 + Math.random() * 9000)),
    createdAt,
    timestamps: { created: createdAt, ...(delivery.timestamps || {}) },
    failureReason: delivery.failureReason || '',
    failureDescription: delivery.failureDescription || ''
  };
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function formatCurrency(value) {
  return `UGX ${Number(value || 0).toLocaleString('en-US')}`;
}

function formatRole(role) {
  return { admin: 'Administrator', sales: 'Sales', purchase: 'Purchase & Inventory', delivery: 'Delivery Person' }[role] || role;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-UG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function dateISO() {
  return new Date().toISOString().split('T')[0];
}

window.addEventListener('load', () => {
  receiptPreview.textContent = lastReceiptText;
  renderBadgeSummary();
});
