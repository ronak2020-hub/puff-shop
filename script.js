/* 
   Puff Delight - Main JavaScript Application
   LocalStorage State Management, Product Rendering, Auth, Cart, Wishlist, Checkout & Orders
*/

// Products Data Array (15 Distinct Items)
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Veg Puff",
    category: "Veg",
    price: 25,
    rating: 4.8,
    description: "Classic golden flaky puff stuffed with savory spiced potatoes, carrots and green peas.",
    image: "vegpuff.jpeg"
  },
  {
    id: 2,
    name: "Paneer Puff",
    category: "Paneer",
    price: 30,
    rating: 4.9,
    description: "Fresh cottage cheese cubes marinated in aromatic Indian spices baked in buttery puff layers.",
    image: "paneerpuff.jpeg"
  },
  {
    id: 3,
    name: "Cheese Puff",
    category: "Cheese",
    price: 45,
    rating: 4.9,
    description: "Melted triple-cheese blend with Italian herbs wrapped inside crispy baked golden layers.",
    image: "cheesepuff.jpeg"
  },
  {
    id: 4,
    name: "Schezwan Puff",
    category: "Spicy",
    price: 45,
    rating: 4.7,
    description: "Fiery Indo-Chinese Schezwan sauce with sautéed crunchy vegetables and chili flakes.",
    image: "schezwanpuff.jpeg"
  },
  {
    id: 5,
    name: "Mayonnaise Puff",
    category: "Veg",
    price: 40,
    rating: 4.6,
    description: "Silky smooth garlic mayonnaise layered over seasoned mixed veggies in a golden crust.",
    image: "mayonnaisepuff.jpeg"
  },
  {
    id: 6,
    name: "Malai Puff",
    category: "Special",
    price: 45,
    rating: 4.8,
    description: "Rich cream and fresh malai marinated paneer with mild aromatic cardamom & spices.",
    image: "malaipuff.jpeg"
  },
  {
    id: 7,
    name: "Pizza Puff",
    category: "Cheese",
    price: 65,
    rating: 4.9,
    description: "Loaded with tangy marinara sauce, mozzarella cheese, sweet corn, bell peppers and oregano.",
    image: "pizzapuff.jpeg"
  },
  {
    id: 8,
    name: "Sev Sing Puff",
    category: "Veg",
    price: 40,
    rating: 4.5,
    description: "Crunchy ratlami sev and spiced roasted peanut mix for an unforgettable street food delight.",
    image: "sevsingpuff.jpeg"
  },
  {
    id: 9,
    name: "Peri Peri Puff",
    category: "Spicy",
    price: 35,
    rating: 4.8,
    description: "Zesty African peri-peri spice dust tossed with crisp garden veggies inside flaky crust.",
    image: "periperipuff.jpeg"
  },
  {
    id: 10,
    name: "Chinese Puff",
    category: "Veg",
    price: 50,
    rating: 4.6,
    description: "Wok-tossed Hakka noodles, shredded cabbage, carrots and dark soy sauce wrapped in puff pastry.",
    image: "chinesepuff.jpeg"
  },
  {
    id: 11,
    name: "Cheese Mint Mayonnaise Puff",
    category: "Cheese",
    price: 80,
    rating: 4.9,
    description: "Refreshing pudina mint mayo fused with molten cheddar cheese and savory potato filling.",
    image: "cheesemintmayonnaisepuff.jpeg"
  },
  {
    id: 12,
    name: "Garlic Puff",
    category: "Veg",
    price: 45,
    rating: 4.7,
    description: "Roasted garlic herb butter infused into golden puff dough filled with seasoned veggies.",
    image: "garlicpuff.jpeg"
  },
  {
    id: 13,
    name: "Mexican Puff",
    category: "Spicy",
    price: 90,
    rating: 4.8,
    description: "Spicy jalapeño slices, red kidney beans, sweet corn and Mexican salsa sauce.",
    image: "mexicanpuff.jpeg"
  },
  {
    id: 14,
    name: "Tandoori Puff",
    category: "Spicy",
    price: 80,
    rating: 4.9,
    description: "Smoky tandoori paneer tikka chunks with sliced onions and spicy chat masala.",
    image: "tandooripuff.jpeg"
  },
  {
    id: 15,
    name: "Special Puff",
    category: "Special",
    price: 180,
    rating: 5.0,
    description: "Chef's signature double-decker puff loaded with extra cheese, paneer and secret house spices.",
    image: "specialpuff.jpeg"
  }
];

// LocalStorage Helper Utilities
function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("LocalStorage read error:", e);
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("LocalStorage write error:", e);
  }
}

// Global State
let activeCategory = "All";
let searchQuery = "";

// Toast Notification System
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-check-circle";
  if (type === "error") icon = "fa-exclamation-circle";

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Navigation & Auth Controls Sync
function updateNavState() {
  const loggedIn = getStorage("puffAuthLoggedIn", false);
  const currentUser = getStorage("puffCurrentUser", null);
  const cart = getStorage("puffCart", []);
  const wishlist = getStorage("puffWishlist", []);

  // Update Cart & Wishlist Badges
  const cartBadge = document.getElementById("cart-badge");
  if (cartBadge) {
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalCartCount;
  }

  const wishlistBadge = document.getElementById("wishlist-badge");
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length;
  }

  // Update User Icon / Account Button
  const userBtn = document.getElementById("user-nav-btn");
  if (userBtn) {
    if (loggedIn && currentUser) {
      userBtn.href = "account.html";
      const firstName = currentUser.name ? currentUser.name.split(' ')[0] : "Account";
      userBtn.innerHTML = `<i class="fas fa-user-circle"></i> <span>${firstName}</span>`;
    } else {
      userBtn.href = "login.html";
      userBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> <span>Login</span>`;
    }
  }
}

// Search Input Focus Helper
function focusSearchInput() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => searchInput.focus(), 300);
  } else {
    window.location.href = "index.html#products";
  }
}

// Product Grid Renderer
function renderProducts() {
  const container = document.getElementById("products-grid-container");
  if (!container) return;

  const wishlist = getStorage("puffWishlist", []);

  const filtered = PRODUCTS_DATA.filter(product => {
    const matchesCategory = (activeCategory === "All") || (product.category === activeCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-products-msg">
        <i class="fas fa-cookie-bite"></i>
        <h3>No products found.</h3>
        <p>Try searching for another keyword like "cheese", "paneer", or selecting a different category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const isWishlisted = wishlist.includes(product.id);
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <button class="wishlist-heart-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
            <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
          </button>
          <span class="product-category-tag">${product.category}</span>
        </div>
        <div class="product-details">
          <div class="product-header-row">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <span>${product.rating}</span>
            </div>
          </div>
          <p class="product-desc">${product.description}</p>
          <div class="product-price-row">
            <span class="product-price">₹${product.price}</span>
          </div>
          <div class="product-card-actions">
            <button class="btn btn-card-add" onclick="addToCart(${product.id})">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="btn btn-card-buy" onclick="buyNow(${product.id})">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Category Filter Controller
function setCategory(category, element) {
  activeCategory = category;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
  renderProducts();
}

// Search Input Handler
function handleSearchInput(e) {
  searchQuery = e.target.value;
  renderProducts();
}

// Cart System Functions
function addToCart(productId, quantity = 1, openCart = false) {
  const cart = getStorage("puffCart", []);
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  setStorage("puffCart", cart);
  updateNavState();
  renderCartDrawer();
  showToast(`${product.name} added to cart 🛒`, "success");

  if (openCart) {
    openDrawer('cart-drawer');
  }
}

function updateCartQuantity(productId, delta) {
  let cart = getStorage("puffCart", []);
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
      showToast("Product removed from cart", "info");
    }
  }
  setStorage("puffCart", cart);
  updateNavState();
  renderCartDrawer();
}

function removeFromCart(productId) {
  let cart = getStorage("puffCart", []);
  cart = cart.filter(item => item.id !== productId);
  setStorage("puffCart", cart);
  updateNavState();
  renderCartDrawer();
  showToast("Product removed from cart", "info");
}

function renderCartDrawer() {
  const drawerBody = document.getElementById("cart-drawer-body");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (!drawerBody) return;

  const cart = getStorage("puffCart", []);

  if (cart.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-drawer-msg">
        <i class="fas fa-shopping-basket"></i>
        <p>Your cart is empty.</p>
        <button class="btn btn-primary" style="margin-top: 1rem;" onclick="closeDrawer('cart-drawer')">Explore Menu</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (totalEl) totalEl.textContent = "₹0";
    return;
  }

  let totalAmount = 0;
  drawerBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    totalAmount += itemTotal;
    return `
      <div class="drawer-item">
        <img src="${item.image}" alt="${item.name}" class="drawer-item-img">
        <div class="drawer-item-info">
          <div class="drawer-item-title">${item.name}</div>
          <div class="drawer-item-price">₹${item.price} × ${item.quantity} = ₹${itemTotal}</div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = `₹${totalAmount}`;
  if (totalEl) totalEl.textContent = `₹${totalAmount}`;
}

function buyNow(productId) {
  addToCart(productId, 1, false);
  proceedToCheckout();
}

// Wishlist Functions
function toggleWishlist(productId) {
  let wishlist = getStorage("puffWishlist", []);
  const product = PRODUCTS_DATA.find(p => p.id === productId);

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast(`Removed from wishlist`, "info");
  } else {
    wishlist.push(productId);
    showToast(`${product ? product.name : 'Item'} added to wishlist ❤️`, "success");
  }

  setStorage("puffWishlist", wishlist);
  updateNavState();
  renderProducts();
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  const drawerBody = document.getElementById("wishlist-drawer-body");
  if (!drawerBody) return;

  const wishlist = getStorage("puffWishlist", []);
  const wishlistedProducts = PRODUCTS_DATA.filter(p => wishlist.includes(p.id));

  if (wishlistedProducts.length === 0) {
    drawerBody.innerHTML = `
      <div class="empty-drawer-msg">
        <i class="far fa-heart"></i>
        <p>Your wishlist is empty</p>
      </div>
    `;
    return;
  }

  drawerBody.innerHTML = wishlistedProducts.map(product => `
    <div class="drawer-item">
      <img src="${product.image}" alt="${product.name}" class="drawer-item-img">
      <div class="drawer-item-info">
        <div class="drawer-item-title">${product.name}</div>
        <div class="drawer-item-price">₹${product.price}</div>
      </div>
      <button class="btn btn-card-add" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="addToCart(${product.id}, 1, true)">
        Add to Cart
      </button>
      <button class="remove-item-btn" onclick="toggleWishlist(${product.id})" title="Remove">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join("");
}

// Drawer Controls
function openDrawer(drawerId) {
  const overlay = document.getElementById(drawerId);
  if (overlay) {
    overlay.classList.add("active");
    if (drawerId === 'cart-drawer') renderCartDrawer();
    if (drawerId === 'wishlist-drawer') renderWishlistDrawer();
  }
}

function closeDrawer(drawerId) {
  const overlay = document.getElementById(drawerId);
  if (overlay) overlay.classList.remove("active");
}

// Modal Controls
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("active");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
}

// Payment Option Selection Helper
function selectPaymentOption(element) {
  document.querySelectorAll(".payment-option-card").forEach(card => card.classList.remove("selected"));
  element.classList.add("selected");
  const radio = element.querySelector("input[type='radio']");
  if (radio) radio.checked = true;
}

// Checkout & Order Functions
function proceedToCheckout() {
  const loggedIn = getStorage("puffAuthLoggedIn", false);
  const cart = getStorage("puffCart", []);

  if (!loggedIn) {
    showToast("Please login to proceed with checkout", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
    return;
  }

  if (cart.length === 0) {
    showToast("Your cart is empty!", "error");
    return;
  }

  closeDrawer("cart-drawer");
  renderCheckoutSummary();
  
  // Pre-fill user data
  const currentUser = getStorage("puffCurrentUser", {});
  const nameInput = document.getElementById("checkout-name");
  const emailInput = document.getElementById("checkout-email");
  const phoneInput = document.getElementById("checkout-phone");

  if (nameInput) nameInput.value = currentUser.name || "";
  if (emailInput) emailInput.value = currentUser.email || "";
  if (phoneInput) phoneInput.value = currentUser.phone || "";

  openModal("checkout-modal");
}

function renderCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-order-summary");
  const grandTotalEl = document.getElementById("checkout-grand-total");
  if (!summaryContainer) return;

  const cart = getStorage("puffCart", []);
  let total = 0;

  summaryContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="summary-row">
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${itemTotal}</span>
      </div>
    `;
  }).join("");

  if (grandTotalEl) grandTotalEl.textContent = `₹${total}`;
}

function placeOrder(event) {
  event.preventDefault();

  const name = document.getElementById("checkout-name").value.trim();
  const email = document.getElementById("checkout-email").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const address = document.getElementById("checkout-address").value.trim();
  const city = document.getElementById("checkout-city").value.trim();
  const pincode = document.getElementById("checkout-pincode").value.trim();

  if (!name || !email || !phone || !address || !city || !pincode) {
    showToast("Please fill in all required shipping details", "error");
    return;
  }

  const cart = getStorage("puffCart", []);
  if (cart.length === 0) {
    showToast("Cart is empty", "error");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderId = "PD" + Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentUser = getStorage("puffCurrentUser", {});

  const newOrder = {
    orderId: orderId,
    userEmail: currentUser.email || email.toLowerCase(),
    date: currentDate,
    items: cart,
    total: totalAmount,
    status: "Order Placed",
    shippingDetails: { name, email, phone, address, city, pincode }
  };

  const orders = getStorage("puffOrders", []);
  orders.unshift(newOrder); // newest first
  setStorage("puffOrders", orders);

  // Clear Cart
  setStorage("puffCart", []);
  updateNavState();

  closeModal("checkout-modal");

  // Show Confirmation Modal
  const confOrderId = document.getElementById("conf-order-id");
  const confTotal = document.getElementById("conf-order-total");
  if (confOrderId) confOrderId.textContent = `#${orderId}`;
  if (confTotal) confTotal.textContent = `₹${totalAmount}`;

  openModal("order-confirmation-modal");
  showToast("Order placed successfully 🎉", "success");
}

// User Registration Handler
function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim().toLowerCase();
  const phone = document.getElementById("reg-phone").value.trim();
  const password = document.getElementById("reg-password").value;
  const confirmPassword = document.getElementById("reg-confirm-password").value;

  if (!name || !email || !phone || !password || !confirmPassword) {
    showToast("Please fill all required fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  if (password.length < 4) {
    showToast("Password must be at least 4 characters long", "error");
    return;
  }

  const users = getStorage("puffUserAccounts", []);
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    showToast("Email address is already registered!", "error");
    return;
  }

  const newUser = { name, email, phone, password };
  users.push(newUser);
  setStorage("puffUserAccounts", users);

  showToast("Account created successfully! Redirecting to login...", "success");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
}

// User Login Handler
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please enter both email and password", "error");
    return;
  }

  const users = getStorage("puffUserAccounts", []);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    showToast("Invalid email or password", "error");
    return;
  }

  // Set Auth Session
  setStorage("puffAuthLoggedIn", true);
  setStorage("puffCurrentUser", { name: user.name, email: user.email, phone: user.phone });

  showToast("Login successful ✅ Redirecting...", "success");
  setTimeout(() => {
    window.location.href = "account.html";
  }, 1200);
}

// User Logout Handler
function handleLogout() {
  setStorage("puffAuthLoggedIn", false);
  setStorage("puffCurrentUser", null);
  showToast("Logged out successfully", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}

// Render Order History on Account Page
function renderAccountOrders() {
  const container = document.getElementById("account-orders-list");
  if (!container) return;

  const currentUser = getStorage("puffCurrentUser", null);
  if (!currentUser) return;

  const allOrders = getStorage("puffOrders", []);
  const userOrders = allOrders.filter(o => o.userEmail === currentUser.email);

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div class="empty-drawer-msg">
        <i class="fas fa-box-open"></i>
        <h3>No orders placed yet</h3>
        <p>Order your favorite delicious puffs today!</p>
        <a href="index.html#products" class="btn btn-primary" style="margin-top: 1rem;">Explore Menu</a>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(order => `
    <div class="order-history-card">
      <div class="order-card-header">
        <div>
          <span class="order-id">Order #${order.orderId}</span>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${order.date}</div>
        </div>
        <span class="order-status-badge">${order.status}</span>
      </div>
      <div class="order-card-body">
        ${order.items.map(item => `
          <div class="order-item-row">
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${item.price * item.quantity}</span>
          </div>
        `).join("")}
      </div>
      <div class="order-card-footer">
        <span>Total Amount</span>
        <span style="color: var(--primary-dark); font-size: 1.1rem;">₹${order.total}</span>
      </div>
    </div>
  `).join("");
}

// Mobile Navbar Hamburger Toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  if (navLinks) {
    navLinks.classList.toggle("mobile-active");
  }
}

// Contact Form Handler
function handleContactForm(event) {
  event.preventDefault();
  showToast("Thank you! Your message has been received.", "success");
  event.target.reset();
}

// Initialize App on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  updateNavState();
  renderProducts();

  // Search input listener
  const searchBox = document.getElementById("search-input");
  if (searchBox) {
    searchBox.addEventListener("input", handleSearchInput);
  }

  // Auto close mobile navbar when clicking links
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      const navLinks = document.querySelector(".nav-links");
      if (navLinks) navLinks.classList.remove("mobile-active");
    });
  });

  // Account Page Orders check & profile fill
  const accountOrdersList = document.getElementById("account-orders-list");
  if (accountOrdersList) {
    const loggedIn = getStorage("puffAuthLoggedIn", false);
    if (!loggedIn) {
      window.location.href = "login.html";
    } else {
      renderAccountOrders();
      const currentUser = getStorage("puffCurrentUser", {});
      const nameEl = document.getElementById("profile-user-name");
      const emailEl = document.getElementById("profile-user-email");
      const phoneEl = document.getElementById("profile-user-phone");
      const avatarEl = document.getElementById("profile-avatar");

      if (nameEl) nameEl.textContent = currentUser.name || "Valued Customer";
      if (emailEl) emailEl.textContent = currentUser.email || "";
      if (phoneEl) phoneEl.textContent = currentUser.phone || "";
      if (avatarEl && currentUser.name) avatarEl.textContent = currentUser.name.charAt(0).toUpperCase();
    }
  }
});
