// FAST FOOD EXPRESS
// GPS lokatsiya bilan yangilangan frontend

const products = [
    { id: 1, name: "Cheeseburger", description: "Mol go‘shti, pishloq va maxsus sous", price: 35000, category: "burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" },
    { id: 2, name: "Double Burger", description: "Ikki qavatli go‘sht va pishloq", price: 45000, category: "burger", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600" },
    { id: 3, name: "Tovuqli Lavash", description: "Tovuq go‘shti, sabzavot va sous", price: 30000, category: "lavash", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600" },
    { id: 4, name: "Mol go‘shtli Lavash", description: "Mol go‘shti va yangi sabzavotlar", price: 35000, category: "lavash", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600" },
    { id: 5, name: "Margarita Pizza", description: "Pishloq, pomidor va maxsus sous", price: 65000, category: "pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600" },
    { id: 6, name: "Pepperoni Pizza", description: "Pepperoni kolbasasi va pishloq", price: 75000, category: "pizza", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600" },
    { id: 7, name: "Coca-Cola", description: "Sovuq ichimlik, 0.5 litr", price: 10000, category: "drink", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600" },
    { id: 8, name: "Sharbat", description: "Mevali sharbat, 0.5 litr", price: 12000, category: "drink", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600" }
];

let cart = loadData("ffe_cart", []);
let favorites = loadData("ffe_favorites", []);
let orders = loadData("ffe_orders", []);
let profile = loadData("ffe_profile", { name: "Mehmon", phone: "" });

let currentCategory = "all";
let toastTimer;
let customerLocation = null;

function loadData(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveData() {
    localStorage.setItem("ffe_cart", JSON.stringify(cart));
    localStorage.setItem("ffe_favorites", JSON.stringify(favorites));
    localStorage.setItem("ffe_orders", JSON.stringify(orders));
    localStorage.setItem("ffe_profile", JSON.stringify(profile));
}

function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;
}

function productCard(product) {
    const isFavorite = favorites.includes(product.id);

    return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="favorite-btn ${isFavorite ? "selected" : ""}"
                            data-favorite="${product.id}">
                        ${isFavorite ? "♥" : "♡"}
                    </button>
                    <button class="add-cart-btn" data-add="${product.id}">
                        + Savat
                    </button>
                </div>
            </div>
        </article>
    `;
}

function showProducts() {
    const list = document.getElementById("productsList");
    const search = document.getElementById("searchInput").value.toLowerCase().trim();

    const filtered = products.filter(product => {
        const categoryMatch =
            currentCategory === "all" || product.category === currentCategory;

        const searchMatch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search);

        return categoryMatch && searchMatch;
    });

    list.innerHTML = filtered.length
        ? filtered.map(productCard).join("")
        : '<p class="empty-message">Mahsulot topilmadi.</p>';
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });

    saveData();
    updateCartCount();
    showToast(product.name + " savatga qo‘shildi!");
}

function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    saveData();
    showCart();
    updateCartCount();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveData();
    showCart();
    updateCartCount();
    showToast("Mahsulot savatdan olib tashlandi.");
}

function showCart() {
    const container = document.getElementById("cartItems");
    const summary = document.getElementById("cartSummary");
    const checkoutButton = document.getElementById("checkoutBtn");

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-message">Savatingiz hozircha bo‘sh.</p>';
        summary.innerHTML = "";
        checkoutButton.disabled = true;
        checkoutButton.style.opacity = ".5";
        return;
    }

    checkoutButton.disabled = false;
    checkoutButton.style.opacity = "1";

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${formatPrice(item.price * item.quantity)}</p>
                <div class="quantity-controls">
                    <button data-minus="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button data-plus="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-btn" data-remove="${item.id}">🗑</button>
        </div>
    `).join("");

    summary.innerHTML = `
        <div class="total-row">
            <span>Jami:</span>
            <span>${formatPrice(cartTotal())}</span>
        </div>
    `;
}

function showFavorites() {
    const container = document.getElementById("favoritesList");
    const favoriteProducts = products.filter(item => favorites.includes(item.id));

    container.innerHTML = favoriteProducts.length
        ? favoriteProducts.map(productCard).join("")
        : '<p class="empty-message">Sevimlilar ro‘yxati bo‘sh.</p>';
}

function showOrders() {
    const container = document.getElementById("ordersList");

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-message">Hozircha buyurtmalaringiz yo‘q.</p>';
        return;
    }

    container.innerHTML = [...orders].reverse().map(order => `
        <div class="order-card">
            <h3>Buyurtma #${order.id}</h3>
            <p>Sana: ${order.date}</p>
            <p>Mahsulotlar: ${order.items.map(item =>
                item.name + " × " + item.quantity
            ).join(", ")}</p>
            <p>Olish usuli: ${order.deliveryType === "pickup"
                ? "O‘zim olib ketaman" : "Yetkazib berish"}</p>
            <p>To‘lov: ${order.paymentType === "cash"
                ? "Naqd pul" : "Karta (demo)"}</p>
            <p>Jami: ${formatPrice(order.total)}</p>
            ${order.address ? `<p>Manzil: ${escapeHTML(order.address)}</p>` : ""}
            ${order.location ? `
                <p>📍 Lokatsiya:
                    <a href="https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}"
                       target="_blank" rel="noopener">Xaritada ko‘rish</a>
                </p>
            ` : ""}
            <p class="order-status">Holati: ${order.status}</p>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function showPage(page) {
    const home = document.getElementById("homePage");
    const panels = [
        "cartPage", "checkoutPage", "ordersPage",
        "favoritesPage", "profilePage"
    ];

    home.hidden = page !== "home";

    panels.forEach(id => {
        document.getElementById(id).hidden = id !== page + "Page";
    });

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    if (page === "cart") showCart();
    if (page === "orders") showOrders();
    if (page === "favorites") showFavorites();
    if (page === "profile") updateProfile();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateProfile() {
    document.getElementById("profileName").textContent = profile.name || "Mehmon";
}

function openCheckout() {
    if (cart.length === 0) {
        showToast("Avval savatga mahsulot qo‘shing.");
        return;
    }

    document.getElementById("checkoutTotal").textContent =
        "Jami: " + formatPrice(cartTotal());

    document.getElementById("customerName").value = profile.name || "";
    document.getElementById("customerPhone").value = profile.phone || "";

    customerLocation = null;
    updateLocationStatus("Lokatsiya hali yuborilmadi.");

    showPage("checkout");
}

function updateLocationStatus(message) {
    const status = document.getElementById("locationStatus");
    if (status) status.textContent = message;
}

// GPS LOKATSIYANI OLISH
function sendLocation() {
    if (!navigator.geolocation) {
        updateLocationStatus("Telefoningiz GPS xizmatini qo‘llab-quvvatlamaydi.");
        return;
    }

    const button = document.getElementById("locationBtn");
    button.disabled = true;
    button.textContent = "⏳ Lokatsiya aniqlanmoqda...";

    updateLocationStatus("Telefoningizdan joylashuv olinmoqda...");

    navigator.geolocation.getCurrentPosition(
        position => {
            customerLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            updateLocationStatus(
                "✅ Lokatsiya olindi. Aniqlik: taxminan " +
                Math.round(customerLocation.accuracy) + " metr."
            );

            button.disabled = false;
            button.textContent = "📍 Lokatsiya olindi";
            showToast("Lokatsiyangiz olindi!");
        },
        error => {
            customerLocation = null;

            let message = "Lokatsiyani olib bo‘lmadi.";

            if (error.code === 1) {
                message = "Lokatsiya ruxsati berilmadi. Telefon sozlamalaridan ruxsat bering.";
            } else if (error.code === 2) {
                message = "Joylashuv aniqlanmadi. GPS xizmatini yoqing.";
            } else if (error.code === 3) {
                message = "Lokatsiya olish vaqti tugadi. Qayta urinib ko‘ring.";
            }

            updateLocationStatus("⚠️ " + message);
            button.disabled = false;
            button.textContent = "📍 Qayta urinib ko‘rish";
        },
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
    );
}

function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Savatingiz bo‘sh.");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const deliveryType = document.getElementById("deliveryType").value;
    const address = document.getElementById("customerAddress").value.trim();
    const paymentType = document.getElementById("paymentType").value;

    if (!name || !phone) {
        showToast("Ism va telefon raqamingizni kiriting.");
        return;
    }

    if (deliveryType === "delivery" && !address && !customerLocation) {
        showToast("Manzilni yozing yoki lokatsiyani yuboring.");
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString("uz-UZ"),
        items: cart.map(item => ({ ...item })),
        total: cartTotal(),
        name,
        phone,
        deliveryType,
        address,
        location: deliveryType === "delivery" ? customerLocation : null,
        paymentType,
        status: "Qabul qilinishi kutilmoqda"
    };

    orders.push(order);

    profile.name = name;
    profile.phone = phone;

    cart = [];
    customerLocation = null;

    saveData();
    updateCartCount();

    document.getElementById("checkoutForm").reset();
    updateLocationStatus("Lokatsiya hali yuborilmadi.");

    const locationButton = document.getElementById("locationBtn");
    locationButton.disabled = false;
    locationButton.textContent = "📍 Lokatsiyamni yuborish";

    showPage("orders");
    showToast("Buyurtmangiz saqlandi!");
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        showToast("Sevimlilardan olib tashlandi.");
    } else {
        favorites.push(id);
        showToast("Sevimlilarga qo‘shildi!");
    }

    saveData();
    showProducts();
    showFavorites();
}

// Kategoriyalar
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.dataset.category;

        document.querySelectorAll("[data-category]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        showProducts();
    });
});

// Mahsulot tugmalari
document.getElementById("productsList").addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");

    if (addButton) addToCart(Number(addButton.dataset.add));
    if (favoriteButton) toggleFavorite(Number(favoriteButton.dataset.favorite));
});

document.getElementById("favoritesList").addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");

    if (addButton) addToCart(Number(addButton.dataset.add));
    if (favoriteButton) toggleFavorite(Number(favoriteButton.dataset.favorite));
});

// Savat tugmalari
document.getElementById("cartItems").addEventListener("click", event => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const remove = event.target.closest("[data-remove]");

    if (plus) changeQuantity(Number(plus.dataset.plus), 1);
    if (minus) changeQuantity(Number(minus.dataset.minus), -1);
    if (remove) removeFromCart(Number(remove.dataset.remove));
});

// Qidiruv
document.getElementById("searchInput").addEventListener("input", showProducts);

// Menyu
document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

// Pastki menyu
document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.page;

        if (page === "home" || page === "menu") {
            showPage("home");

            if (page === "menu") {
                setTimeout(() => {
                    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } else {
            showPage(page);
        }
    });
});

// Savat va buyurtma
document.getElementById("checkoutBtn").addEventListener("click", openCheckout);
document.getElementById("checkoutForm").addEventListener("submit", submitOrder);

// GPS tugmasi
document.getElementById("locationBtn").addEventListener("click", sendLocation);

// Profil
document.getElementById("profileBtn").addEventListener("click", () => showPage("profile"));

document.getElementById("editProfileBtn").addEventListener("click", () => {
    const newName = prompt("Ismingizni kiriting:", profile.name);

    if (newName && newName.trim()) {
        profile.name = newName.trim();
        saveData();
        updateProfile();
        showToast("Profil yangilandi.");
    }
});

document.getElementById("favoritesBtn").addEventListener("click", () => {
    showPage("favorites");
});

// Yetkazib berish yoki olib ketish
document.getElementById("deliveryType").addEventListener("change", event => {
    const addressBox = document.getElementById("addressBox");
    addressBox.hidden = event.target.value !== "delivery";

    if (event.target.value === "pickup") {
        customerLocation = null;
    }
});

// Panelni yopish
document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => showPage("home"));
});

// Dastlabki ishga tushirish
showProducts();
updateCartCount();
updateProfile();
showPage("home");
