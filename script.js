document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { 
            name: "COSMIC ENERGY", 
            img: "https://i.imgur.com/qBUEYRy.png", 
            images: [
                "https://i.imgur.com/pi1zQo9.png", 
                "https://i.imgur.com/KBLkmGR.jpeg", 
                "https://i.imgur.com/pW36dBc.png", 
                "https://i.imgur.com/4RF2JJ3.jpeg", 
                "https://i.imgur.com/O9Qx2K1.png", 
                "https://i.imgur.com/qBUEYRy.png"
            ], 
            price: 75000, 
            includes: "Oversize fit, Cuello en rib 2cm, Color: Blanco" 
        },
     

        { 
            name: "SENTIR SABER", 
            img: "https://i.imgur.com/Rj3ygI1.jpeg", 
            images: [
                "https://i.imgur.com/D7vps6t.jpeg", 
                "https://i.imgur.com/8vn9pqu.jpeg", 
                "https://i.imgur.com/7jTYe78.jpeg", 
                "https://i.imgur.com/Rj3ygI1.jpeg", 
                "https://i.imgur.com/1oomF8e.jpeg", 
                "https://i.imgur.com/kiA3IOr.jpeg", 
                "https://i.imgur.com/IyiytBd.jpeg", 
                "https://i.imgur.com/VzkGkGX.jpeg"
            ], 
            price: 60000, 
            includes: "Regular fit,  Color: Negro" 
        },
   { 
            name: "VULNERABILITY", 
            img: "https://i.imgur.com/QJsfFng.jpeg", 
            images: [
                "https://i.imgur.com/Mjxpxs2.jpeg", 
                "https://i.imgur.com/QJsfFng.jpeg", 
                "https://i.imgur.com/C98lNyS.jpeg", 
                "https://i.imgur.com/JdNqeYU.jpeg", 
                "https://i.imgur.com/uIqBhIy.jpeg", 
                "https://i.imgur.com/fSrSrmZ.jpeg"
            ], 
            price: 60000, 
            includes: "Regular fit,  Color: Blanco" 
        },
      
    ];

    const cart = [];
    let total = 0;
    let currentSlide = 0;
    let selectedProduct = null;

    // Render products
    function displayProducts() {
        const menu = document.getElementById('menu');
        menu.innerHTML = '';
        products.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.img}" alt="${product.name}" onclick="showProductModal(${index})">
                <h3>${product.name} 💜</h3>
                <p>$${product.price.toLocaleString("es-CO")} COP</p>
                <p>${product.includes} </p>
            `;
            menu.appendChild(productItem);
        });
    }

    // Show product modal
    window.showProductModal = function (index) {
        selectedProduct = products[index];
        const carouselImages = document.getElementById('carousel-images');
        const productDetails = document.getElementById('product-details');
        carouselImages.innerHTML = selectedProduct.images.map(img => `<img src="${img}" alt="${selectedProduct.name}" onclick="showZoomedImage('${img}')">`).join('');
        productDetails.innerHTML = `
            <h3>${selectedProduct.name} 🌟</h3>
            <p>💲Precio: $${selectedProduct.price.toLocaleString("es-CO")} COP</p>
            <p>${selectedProduct.includes} ✨</p>
        `;
        currentSlide = 0;
        updateCarousel();
        toggleProductModal();
    };

    // Zoom image
    window.showZoomedImage = function (img) {
        const zoomedImage = document.getElementById('zoomed-image');
        zoomedImage.src = img;
        zoomedImage.classList.add('show');

        // Hide zoomed image after 3 seconds
        setTimeout(() => {
            zoomedImage.classList.remove('show');
        }, 3000);
    };

    // Carousel functionality
    function updateCarousel() {
        const carouselImages = document.getElementById('carousel-images');
        carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    window.nextSlide = function () {
        const totalSlides = selectedProduct.images.length;
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    };

    window.prevSlide = function () {
        const totalSlides = selectedProduct.images.length;
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    };

    // Add product to cart
    document.getElementById('add-to-cart-btn').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const size = document.getElementById('product-size').value;
        const existingProduct = cart.find(item => item.name === selectedProduct.name && item.size === size);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ name: selectedProduct.name, price: selectedProduct.price, size, quantity });
        }

        updateCart();
        toggleProductModal();
        alert(`Producto agregado al carrito: ${selectedProduct.name} (Talla: ${size}) x ${quantity}`);
    });

    // Remove product from cart
    window.removeFromCart = function (productName, size) {
        const productIndex = cart.findIndex(item => item.name === productName && item.size === size);
        if (productIndex !== -1) {
            cart.splice(productIndex, 1);
        }
        updateCart();
    };

    // Update cart
    function updateCart() {
        const cartItemsSection = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        cartItemsSection.innerHTML = '';
        total = 0;

        cart.forEach(item => {
            cartItemsSection.innerHTML += `<p>${item.name} (Talla: ${item.size}) - $${item.price.toLocaleString("es-CO")} COP x ${item.quantity} = $${(item.price * item.quantity).toLocaleString("es-CO")} COP <button class="eliminar-btn" onclick="removeFromCart('${item.name}', '${item.size}')">Eliminar</button></p>`;
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `Total: $${total.toLocaleString("es-CO")} COP`;
        updatePayPalForm(total);
    }

    // Update PayPal form
    function updatePayPalForm(totalAmount) {
        const paypalForm = document.getElementById('paypal-form');
        paypalForm.innerHTML = `
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="danielavasquez529@gmail.com" />
                <input type="hidden" name="currency_code" value="COP" />
                <input type="hidden" name="amount" value="${totalAmount}" />
                <input type="hidden" name="item_name" value="${cart.map(item => `${item.name} (${item.size}, ${item.quantity})`).join(', ')}" />
                <input type="image" src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/silver-pill-paypal-44px.png" border="0" name="submit" title="Pay with PayPal" alt="PayPal - The safer, easier way to pay online!" />
            </form>
        `;
    }

    // Confirm order via WhatsApp
    window.confirmByWhatsApp = function () {
        const deliveryAddress = document.getElementById('delivery-address').value;
        const notes = document.getElementById('notes').value;
        const whatsappMessage = cart.map(item => `${item.quantity} x ${item.name} (Talla: ${item.size}) - $${item.price.toLocaleString("es-CO")} COP`).join('\n');
        const finalMessage = `Pedido:\n${whatsappMessage}\nTotal: $${total.toLocaleString("es-CO")} COP\nDirección de entrega: ${deliveryAddress}\nNotas: ${notes}`;
        const whatsappUrl = `https://wa.me/34635365724?text=${encodeURIComponent(finalMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    displayProducts(); // Initial product render
});

// Toggle Cart Visibility
function toggleCart() {
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'none' || cart.style.display === '' ? 'block' : 'none';
}

// Toggle Product Modal Visibility
function toggleProductModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'block' : 'none';
}

// Close Modal or Zoomed Image when clicking outside
window.onclick = function (event) {
    const productModal = document.getElementById('product-modal');
    const zoomedImage = document.getElementById('zoomed-image');
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === zoomedImage) {
        zoomedImage.classList.remove('show');
    }
};
