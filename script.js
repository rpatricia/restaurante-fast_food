
        const menu = [
            {
                category: "Hambúrgueres",
                items: [
                    { name: "Cheeseburger", description: "Delicious cheeseburger with cheddar cheese", price: 10.99 },
                    { name: "Bacon Burger", description: "Burger with crispy bacon and BBQ sauce", price: 12.99 },
                ]
            },
            {
                category: "Salgados",
                items: [
                    { name: "Coxinha", description: "Traditional Brazilian chicken snack", price: 3.50 },
                    { name: "Kibe", description: "Lebanese snack made with bulgur wheat and meat", price: 4.00 },
                ]
            },
            {
                category: "Bebidas",
                items: [
                    { name: "Coca-Cola", description: "500ml bottle", price: 5.00 },
                    { name: "Guaraná", description: "500ml bottle", price: 4.50 },
                ]
            }
        ];

        let cart = [];

        function renderMenu() {
            const menuContainer = document.getElementById("menu");
            menu.forEach(category => {
                const categoryDiv = document.createElement("div");
                categoryDiv.className = "menu-category";
                categoryDiv.innerHTML = `<h2>${category.category}</h2>`;
                category.items.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "menu-item";
                    itemDiv.innerHTML = `
                        <div>
                            <input type="checkbox" id="${item.name}" name="item" value="${item.name}" data-price="${item.price}">
                            <label for="${item.name}">${item.name} - $${item.price.toFixed(2)}</label>
                            <p>${item.description}</p>
                        </div>
                        <div>
                            <input type="number" id="qty-${item.name}" name="qty" min="1" max="10" value="1" disabled>
                        </div>
                    `;
                    categoryDiv.appendChild(itemDiv);
                });
                menuContainer.appendChild(categoryDiv);
            });

            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', event => {
                    const qtyInput = document.getElementById(`qty-${event.target.value}`);
                    qtyInput.disabled = !event.target.checked;
                    if (!event.target.checked) qtyInput.value = 1;
                    updateCart(event.target);
                });
            });
        }

        function updateCart(checkbox) {
            const itemName = checkbox.value;
            const itemPrice = parseFloat(checkbox.dataset.price);
            const itemQty = parseInt(document.getElementById(`qty-${itemName}`).value);

            const existingItem = cart.find(item => item.name === itemName);
            if (checkbox.checked) {
                if (existingItem) {
                    existingItem.qty = itemQty;
                } else {
                    cart.push({ name: itemName, price: itemPrice, qty: itemQty });
                }
            } else {
                cart = cart.filter(item => item.name !== itemName);
            }

            renderCart();
        }

        function renderCart() {
            const cartContainer = document.getElementById("cart-items");
            cartContainer.innerHTML = "";

            let totalPrice = 0;
            cart.forEach(item => {
                totalPrice += item.price * item.qty;
                const cartItemDiv = document.createElement("div");
                cartItemDiv.className = "cart-item";
                cartItemDiv.innerHTML = `
                    <span>${item.name} (x${item.qty}) - $${(item.price * item.qty).toFixed(2)}</span>
                `;
                cartContainer.appendChild(cartItemDiv);
            });

            document.getElementById("total-price").innerText = totalPrice.toFixed(2);
        }

        function finalizeOrder() {
            document.getElementById("checkout").style.display = "block";
            document.getElementById("cart").style.display = "none";

            const summaryContainer = document.getElementById("order-summary");
            summaryContainer.innerHTML = "";

            cart.forEach(item => {
                const summaryItemDiv = document.createElement("div");
                summaryItemDiv.innerHTML = `${item.name} (x${item.qty}) - $${(item.price * item.qty).toFixed(2)}`;
                summaryContainer.appendChild(summaryItemDiv);
            });

            const totalSummaryDiv = document.createElement("div");
            totalSummaryDiv.innerHTML = `Total: $${document.getElementById("total-price").innerText}`;
            summaryContainer.appendChild(totalSummaryDiv);
        }

        function confirmOrder() {
            const paymentMethod = document.getElementById("payment-method").value;
            const customerName = document.getElementById("customer-name").value;
            const customerAddress = document.getElementById("customer-address").value;

            if (customerName && customerAddress) {
                alert(`Order confirmed!\nPayment Method: ${paymentMethod}\nName: ${customerName}\nAddress: ${customerAddress}`);
                cart = [];
                document.getElementById("checkout").style.display = "none";
                document.getElementById("cart").style.display = "block";
                document.getElementById("cart-items").innerHTML = "";
                document.getElementById("total-price").innerText = "0.00";
                renderMenu();
            } else {
                alert("Please fill in all the details.");
            }
        }

        function cancelOrder() {
            cart = [];
            document.getElementById("checkout").style.display = "none";
            document.getElementById("cart").style.display = "block";
            renderMenu();
        }

        renderMenu();
    