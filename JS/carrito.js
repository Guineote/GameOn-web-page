// **Archivo: carrito.js**
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector("#cart-items");
    const totalItemsElement = document.querySelector("#total-items");
    const totalPriceElement = document.querySelector("#total-price");

    // Obtener los productos del carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
        totalItemsElement.textContent = "0";
        totalPriceElement.textContent = "$ 0.00";
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(product => {
        const productRow = document.createElement("div");
        productRow.classList.add("row", "mb-4", "d-flex", "justify-content-between", "align-items-center");

        // Capturar solo el segundo precio si existen varios
        const finalPrice = product.price.split(' ').pop();

        productRow.innerHTML = `
            <div class="col-md-2 col-lg-2 col-xl-2">
                <img src="${product.image}" class="img-fluid rounded-3" alt="${product.name}">
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
                <h6 class="text-muted">Producto</h6>
                <h6 class="mb-0">${product.name}</h6>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 class="mb-0">${finalPrice}</h6>
            </div>
            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                <button class="btn btn-danger btn-sm remove-item" data-id="${product.id}">Eliminar</button>
            </div>
        `;

        cartContainer.appendChild(productRow);

        // Calcular el total de productos y precios
        totalItems++;
        totalPrice += parseFloat(finalPrice.replace(/[€$]/g, ""));
    });

    // Actualizar el resumen
    totalItemsElement.textContent = totalItems;
    totalPriceElement.textContent = `$ ${totalPrice.toFixed(2)}`;

    // Agregar funcionalidad para eliminar productos
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", (e) => {
            const idToRemove = parseInt(e.target.dataset.id);
            const updatedCart = cart.filter(item => item.id !== idToRemove);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            location.reload(); // Recargar la página para reflejar los cambios
        });
    });
});