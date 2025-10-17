
// Popup open/close
document.getElementById("cart-icon").addEventListener("click", () => {
    document.getElementById("cart-popup").classList.add("show");
});

document.getElementById("close-cart").addEventListener("click", () => {
    document.getElementById("cart-popup").classList.remove("show");
});

function buyNow() {
    alert("Proceeding to buy...");
}


/*sign up*/

function handleSignup() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const phone = document.getElementById("signupPhone").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !phone || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Enter a valid 10-digit phone number.");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Enter a valid email address.");
        return;
    }

    alert("Registration Successful!");
    closeModal("signupModal");
}

/*sign up toggle*/
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Toggle between two modals
function toggleModals(hideModalId, showModalId) {
    closeModal(hideModalId);
    openModal(showModalId);
}
// Explanation:
// Clicking “Login” on the sign-up modal calls toggleModals('signupModal', 'loginModal').

// It hides the sign-up modal and shows the login modal.

// Similarly, you can toggle back from login to sign-up with the link on the login modal.

// Would you like me to help you integrate this into your existing code? If yes, please share your current modal HTML and JavaScript!



// Cart pop up displaying the count of cart in home page

// Load cart from localStorage or initialize empty

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartCountSpan = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const cartItemsDiv = document.getElementById('cart-items');
const closeCartBtn = document.getElementById('close-cart');

const itemCountSpan = document.getElementById('item-count');
const qtyCountSpan = document.getElementById('qty-count');
const itemTotalSpan = document.getElementById('item-total');
const totalPaySpan = document.getElementById('total-pay');

// Save to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update top right cart count
function updateCartCount() {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalQty;
    saveCart();
}

// Attach event listeners to add buttons
document.querySelectorAll('.add-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // prevent navigation if inside <a>

        const productCard = btn.closest('.buy-card, .fish-card, .dairy-card, .explore-card');
        if (!productCard) return; // safety fallback
        const name = productCard.querySelector('.product-name').innerText;
        const price = parseFloat(productCard.querySelector('.price').innerText.replace('₹', ''));
        const img = productCard.querySelector('img').getAttribute('src');

        if (!name || !price || !img) return; // skip if info is missing

        const existingIndex = cart.findIndex(item => item.name === name);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push({ name, price, img, quantity: 1 });
        }

        updateCartCount();
    });
});

// Show My Cart popup
cartIcon.addEventListener('click', () => {
    displayCartItems();
    cartPopup.style.display = 'block';
});

// Close popup
closeCartBtn.onclick = () => {
    cartPopup.style.display = 'none';
};
window.onclick = (e) => {
    if (e.target == cartPopup) {
        cartPopup.style.display = 'none';
    }
};

// Display items inside popup
function displayCartItems() {
    cartItemsDiv.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalQty += item.quantity;
        totalPrice += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.style.borderBottom = '1px solid #ccc';
        itemDiv.style.padding = '10px 0';

        itemDiv.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <div style="display:flex; align-items:center;">
                    <img src="${item.img}" style="width:50px; margin-right:10px;">
                    <div>
                        <p style="margin:0;"><strong>${item.name}</strong></p>
                        <p style="margin:0;">Price: ₹${item.price}</p>
                        <p style="margin:0;">Total: ₹${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end;">
                    <button class="remove-btn" data-index="${index}">Remove</button>
                    <div style="margin-top:5px;">
                        <button class="decrease-qty" data-index="${index}">-</button>
                        <span style="margin: 0 10px;">${item.quantity}</span>
                        <button class="increase-qty" data-index="${index}">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    attachPopupEventListeners();

    itemCountSpan.innerText = cart.length;
    qtyCountSpan.innerText = totalQty;
    itemTotalSpan.innerText = `₹${totalPrice.toFixed(2)}`;
    totalPaySpan.innerText = `₹${(totalPrice + 10).toFixed(2)}/-`; // ₹10 handling
}

// Attach popup controls
function attachPopupEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCartCount();
            displayCartItems();
        };
    });

    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.getAttribute('data-index'));
            cart[index].quantity += 1;
            updateCartCount();
            displayCartItems();
        };
    });

    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.getAttribute('data-index'));
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            updateCartCount();
            displayCartItems();
        };
    });
}

// On page load
updateCartCount();

function prepareSecuredProduct(product, quantity) {
  const numericPrice = parseFloat(product.price.replace(/[₹,]/g, "").trim());
  return {
    ...product,
    quantity,
    totalPrice: "₹" + (numericPrice * quantity).toFixed(2)
  };
}
