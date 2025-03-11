// URL de la API
const apiURL = "http://localhost:3000/products";

// Referencia al contenedor donde se mostrará la tabla
const tableContainer = document.getElementById("product-table-container");

// Función para obtener productos de la API
async function fetchProducts() {
  try {
    const response = await fetch(apiURL);
    const products = await response.json();

    // Generar la tabla
    const table = document.createElement("table");
    table.className = "table table-bordered";

    // Crear encabezados
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th><input type="checkbox" id="select-all"></th>
        <th>ID</th>
        <th>Nombre</th>
        <th>Categoría</th>
        <th>Descripción</th>
        <th>Precio</th>
        <th>Imagen</th>
        <th>Acciones</th>
      </tr>`;
    table.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement("tbody");
    products.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-product" data-id="${product.id}"></td>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td><img src="${product.img}" alt="${product.name}" style="max-width: 100px; max-height: 100px;"></td>
        <td>
          <button class="btn btn-warning btn-edit" data-id="${product.id}">Editar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Añadir la tabla al contenedor
    tableContainer.appendChild(table);

    // Asignar eventos a los checkboxes
    const selectAllCheckbox = document.getElementById("select-all");
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = document.querySelectorAll(".select-product");
      checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    tableContainer.innerHTML = '<p class="text-danger">Error al cargar los productos.</p>';
  }
}

// Función para eliminar productos seleccionados
document.addEventListener("click", async (e) => {
  if (e.target.id === "delete-selected") {
    const selectedCheckboxes = document.querySelectorAll(".select-product:checked");

    if (selectedCheckboxes.length === 0) {
      alert("Por favor, selecciona al menos un producto para eliminar.");
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar los productos seleccionados?")) {
      return;
    }

    const productIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute("data-id"));

    try {
      // Realizar solicitudes DELETE para cada ID seleccionado
      for (const id of productIds) {
        await fetch(`${apiURL}/${id}`, { method: "DELETE" });
      }

      alert("Productos eliminados exitosamente");
      location.reload(); // Recargar la tabla para reflejar los cambios
    } catch (error) {
      console.error("Error al eliminar productos:", error);
      alert("Error al eliminar los productos seleccionados.");
    }
  }
});

// Llamar a la función para cargar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  // Botón para eliminar seleccionados
  const deleteButton = document.createElement("button");
  deleteButton.id = "delete-selected";
  deleteButton.textContent = "Eliminar seleccionados";
  deleteButton.className = "btn btn-danger mt-3";
  tableContainer.insertAdjacentElement("afterend", deleteButton);
});

// *Archivo: products.js*

document.addEventListener("DOMContentLoaded", () => {
  // Obtener todos los botones "Agregar al carrito"
  const addToCartButtons = document.querySelectorAll(".card-hover-content button");

  addToCartButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
          // Encontrar la tarjeta del producto correspondiente
          const card = button.closest(".card");
          const productName = card.querySelector(".card-content h6").innerText;
          const productPrice = card.querySelector(".card-content .price").innerText;
          const productImage = card.querySelector("img").src;

          // Crear el objeto del producto
          const product = {
              id: index + 1,
              name: productName,
              price: productPrice,
              image: productImage
          };

          // Obtener los productos guardados en el carrito desde localStorage
          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          // Agregar el producto al carrito
          cart.push(product);
          localStorage.setItem("cart", JSON.stringify(cart));

          alert(`${productName} ha sido agregado al carrito.`);

      });
  });
});

//editar
  // Manejo del botón de Editar
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const productId = e.target.getAttribute('data-id');

      // Crear un objeto para los campos permitidos
      const updatedProduct = {
        name: prompt("Nuevo nombre del producto:"),
        category: prompt("Nueva categoría:"),
        description: prompt("Nueva descripción:"),
        price: parseFloat(prompt("Nuevo precio:")),
        img: prompt("Nueva URL de la imagen:")
      };

      try {
        // Solicitud PUT al servidor
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        });

        if (response.ok) {
          alert("Producto actualizado exitosamente");
          location.reload(); // Recarga la tabla
        } else {
          alert("Error al actualizar el producto");
        }
        if (!updatedProduct.name || !updatedProduct.category || !updatedProduct.description || isNaN(updatedProduct.price) || !updatedProduct.img) {
          alert("Todos los campos son obligatorios y deben tener valores válidos.");
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor");
      }
    }
  });
