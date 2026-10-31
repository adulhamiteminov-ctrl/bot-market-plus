// FAST FOOD EXPRESS
// 3-qism: Ilovaning ishlash kodi

const products = [
    {
        id: 1,
        name: "Cheeseburger",
        description: "Mol go‘shti, pishloq va maxsus sous",
        price: 35000,
        category: "burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
    },
    {
        id: 2,
        name: "Double Burger",
        description: "Ikki qavatli go‘sht va pishloq",
        price: 45000,
        category: "burger",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=600"
    },
    {
        id: 3,
        name: "Tovuqli Lavash",
        description: "Tovuq go‘shti, sabzavot va sous",
        price: 30000,
        category: "lavash",
        image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600"
    },
    {
        id: 4,
        name: "Mol go‘shtli Lavash",
        description: "Mol go‘shti va yangi sabzavotlar",
        price: 35000,
        category: "lavash",
        image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600"
    },
    {
        id: 5,
        name: "Margarita Pizza",
        description: "Pishloq, pomidor va maxsus sous",
        price: 65000,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600"
    },
    {
        id: 6,
        name: "Pepperoni Pizza",
        description: "Pepperoni kolbasasi va pishloq",
        price: 75000,
        category: "pizza",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600"
    },
    {
        id: 7,
        name: "Coca-Cola",
        description: "Sovuq ichimlik, 0.5 litr",
        price: 10000,
        category: "drink",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600"
    },
    {
        id: 8,
        name: "Sharbat",
        description: "Mevali sharbat, 0.5 litr",
        price: 12000,
        category: "drink",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600"
    }
];

let cart = [];
let currentCategory = "all";

const productsList = document.getElementById("productsList");
const searchInput = document.getElementById("searchInput");

// Narxni so‘m ko‘rinishida chiqarish
function formatPrice(price) {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so‘m";
}

// Mahsulotlarni chiqarish
function showProducts() {
    if (!productsList) {
        console.error("productsList elementi topilmadi.");
        return;
    }

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productsList.innerHTML = "";

    if (filteredProducts.length === 0) {
        productsList.innerHTML =
            '<div class="empty-message">Mahsulot topilmadi.</div>';
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}"
                 alt="${product.name}"
                 loading="lazy">

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="product-bottom">
                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button class="add-cart-btn"
                            data-product-id="${product.id}">
                        + Savat
                    </button>
                </div>
            </div>
        `;

        productsList.appendChild(card);
    });
}

// Savatga mahsulot qo‘shish
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();

    alert(product.name + " savatga qo‘shildi!");
}

// Savatdagi mahsulotlar soni
function updateCartCount() {
    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartButton = document.getElementById("cartCount");

    if (cartButton) {
        cartButton.textContent = count;
    }
}

// Kategoriyalar
document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.dataset.category;

        document.querySelectorAll("[data-category]").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        showProducts();
    });
});

// Qidiruv
if (searchInput) {
    searchInput.addEventListener("input", showProducts);
}

// Savat tugmalari
if (productsList) {
    productsList.addEventListener("click", event => {
        const button = event.target.closest("[data-product-id]");

        if (!button) return;

        const productId = Number(button.dataset.productId);
        addToCart(productId);
    });
}

// Dastlab mahsulotlarni chiqarish
showProducts();
