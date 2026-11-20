// ANGEL'S CLOSET JAVASCRIPT

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const cartBackdrop = document.getElementById("cartBackdrop");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const cartItemsElement = document.getElementById("cartItems");
const bagCountElement = document.getElementById("bagCount");
const drawerCountElement = document.getElementById("drawerCount");
const cartTotalElement = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");

// CHANGE THIS TO YOUR WHATSAPP NUMBER
const WHATSAPP_NUMBER = "234XXXXXXXXXX";

let cart = [];

// MOBILE MENU

menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

});

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});

// OPEN SHOPPING BAG

function openCart() {

    cartBackdrop.classList.add("open");

    cartBackdrop.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}

// CLOSE SHOPPING BAG

function closeCart() {

    cartBackdrop.classList.remove("open");

    cartBackdrop.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}

openCartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartBackdrop.addEventListener("click", event => {

    if (event.target === cartBackdrop) {
        closeCart();
    }

});

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeCart();
    }

});

// ADD PRODUCTS TO BAG

document.querySelectorAll(".add-button").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;

        const price = Number(button.dataset.price);

        const found = cart.find(item => item.name === name);

        if (found) {

            found.quantity += 1;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        renderCart();

        const originalText = button.textContent;

        button.textContent = "Added to Bag ✓";

        setTimeout(() => {

            button.textContent = originalText;

        }, 900);

    });

});

// CHANGE PRODUCT QUANTITY

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    renderCart();

}

// REMOVE PRODUCT

function removeItem(index) {

    cart.splice(index, 1);

    renderCart();

}

// DISPLAY SHOPPING BAG

function renderCart() {

    cartItemsElement.replaceChildren();

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    bagCountElement.textContent = totalItems;

    drawerCountElement.textContent = `(${totalItems})`;

    cartTotalElement.textContent =
        `₦${total.toLocaleString("en-NG")}`;

    if (cart.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-cart";

        empty.textContent =
            "Your bag is waiting for something lovely.";

        cartItemsElement.appendChild(empty);

        return;

    }

    cart.forEach((item, index) => {

        const row = document.createElement("div");

        row.className = "cart-row";

        const info = document.createElement("div");

        const title = document.createElement("h3");

        title.textContent = item.name;

        const price = document.createElement("p");

        price.textContent =
            `₦${(item.price * item.quantity).toLocaleString("en-NG")}`;

        info.append(title, price);

        const controls = document.createElement("div");

        controls.className = "cart-controls";

        const minus = document.createElement("button");

        minus.type = "button";

        minus.textContent = "−";

        minus.setAttribute(
            "aria-label",
            `Remove one ${item.name}`
        );

        minus.addEventListener("click", () => {

            changeQuantity(index, -1);

        });

        const quantity = document.createElement("span");

        quantity.textContent = item.quantity;

        const plus = document.createElement("button");

        plus.type = "button";

        plus.textContent = "+";

        plus.setAttribute(
            "aria-label",
            `Add one ${item.name}`
        );

        plus.addEventListener("click", () => {

            changeQuantity(index, 1);

        });

        const remove = document.createElement("button");

        remove.type = "button";

        remove.className = "remove";

        remove.textContent = "×";

        remove.setAttribute(
            "aria-label",
            `Remove ${item.name}`
        );

        remove.addEventListener("click", () => {

            removeItem(index);

        });

        controls.append(minus, quantity, plus, remove);

        row.append(info, controls);

        cartItemsElement.appendChild(row);

    });

}

// CATEGORY FILTERING

document.querySelectorAll(".category-button").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-button").forEach(item => {

            item.classList.remove("active");

        });

        button.classList.add("active");

        const category = button.dataset.category;

        document.querySelectorAll(".product-card").forEach(card => {

            card.hidden =
                category !== "all" &&
                card.dataset.category !== category;

        });

    });

});

// WHATSAPP CHECKOUT

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your bag is empty. Add an item before checking out.");

        return;

    }

    if (WHATSAPP_NUMBER.includes("X")) {

        alert(
            "Please add your WhatsApp number in js/script.js before using checkout."
        );

        return;

    }

    let message =
        "Hello Angel's Closet! I'd like to place an order:\n\n";

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        message +=
            `${item.name} x ${item.quantity} — ₦${subtotal.toLocaleString("en-NG")}\n`;

    });

    message +=
        `\nSubtotal: ₦${total.toLocaleString("en-NG")}`;

    message +=
        "\nPlease let me know the delivery details. Thank you!";

    const url =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");

});

// INITIALIZE SHOPPING BAG

renderCart();
