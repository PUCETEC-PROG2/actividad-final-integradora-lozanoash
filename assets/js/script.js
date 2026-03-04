document.addEventListener('DOMContentLoaded', () => {
    // 1. DEFINICIÓN DE VARIABLES (Fundamental para que no de error)
    const panel = document.getElementById('carrito-panel');
    const formulario = document.getElementById('form-compra');
    const opcionesPago = document.querySelectorAll('input[name="metodo-pago"]');
    const divTarjeta = document.getElementById('campos-tarjeta');
    const inputTarjeta = document.getElementById('num-tarjeta');
    const contador = document.getElementById('contador-items');
    const lista = document.getElementById('lista-carrito');
    let itemsTotal = 0;
    let totalDinero = 0;
    const displayTotal = document.getElementById('precio-total');
    // 1. Seleccionamos el nuevo botón flotante
    const botonFlotante = document.getElementById('carrito-flotante');
    const contadorFlotante = document.getElementById('contador-flotante');
    

    // 2. Al hacer clic, le añadimos la clase 'activo' al panel que ya tenías
    if (botonFlotante) {
        botonFlotante.addEventListener('click', () => {
            // 'panel' es la variable que ya definiste al inicio de tu JS
            panel.classList.add('activo');
        });
    }

    // 2. LÓGICA DE AÑADIR PRODUCTOS
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const nombreProd = producto.querySelector('h3').textContent;

            // Extraer el precio (quitando el símbolo $)
            const precioTexto = producto.querySelector('.precio').textContent;
            const precioNumerico = parseFloat(precioTexto.replace('$', ''));

            // Actualizar contador e items
            itemsTotal++;
            if (contador) contador.textContent = itemsTotal;

            // El contador del botón flotante (Esto es lo que añadimos para el icono circular)
            if (contadorFlotante) {
                contadorFlotante.textContent = itemsTotal;
                botonFlotante.style.transform = "scale(1.2)";
                setTimeout(() => { botonFlotante.style.transform = "scale(1)"; }, 200);
            }

            // ACTUALIZAR TOTAL (Suma el precio al acumulado)
            totalDinero += precioNumerico;
            if (displayTotal) displayTotal.textContent = totalDinero.toFixed(2);

            // AGREGAR A LA LISTA VISIBLE
            const li = document.createElement('li');
            li.classList.add('item-carrito'); // Añadimos una clase para el CSS
            li.innerHTML = `
    <span class="item-nombre">${nombreProd}</span>
    <span class="item-precio">${precioTexto}</span>
`;
            if (lista) lista.appendChild(li);
        });
    });
    // 3. MOSTRAR/OCULTAR TARJETA
    opcionesPago.forEach(opcion => {
        opcion.addEventListener('change', (e) => {
            if (e.target.value === 'tarjeta') {
                divTarjeta.style.display = 'block';
                inputTarjeta.required = true;
            } else {
                divTarjeta.style.display = 'none';
                inputTarjeta.required = false;
            }
        });
    });

    // 4. VALIDACIÓN ÚNICA Y FINALIZAR PEDIDO
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre');
        const direccion = document.getElementById('direccion');
        const metodoPago = document.querySelector('input[name="metodo-pago"]:checked');

        let errores = 0;

        // Validar Nombre (Mínimo 3 letras)
        if (nombre.value.trim().length < 3) {
            nombre.classList.add('invalido');
            errores++;
        } else {
            nombre.classList.remove('invalido');
        }

        // Validar Dirección (Mínimo 5 caracteres)
        if (direccion.value.trim().length < 5) {
            direccion.classList.add('invalido');
            errores++;
        } else {
            direccion.classList.remove('invalido');
        }

        // Validar Tarjeta solo si se eligió ese método
        if (metodoPago && metodoPago.value === 'tarjeta') {
            const numLimpio = inputTarjeta.value.replace(/\s+/g, '');
            if (numLimpio.length >= 13 && numLimpio.length <= 16 && !isNaN(numLimpio)) {
                inputTarjeta.classList.remove('invalido');
            } else {
                inputTarjeta.classList.add('invalido');
                errores++;
            }
        }

        if (errores === 0) {
            // ÉXITO: Ocultar panel y mostrar Modal central
            panel.classList.remove('activo');

            const modal = document.getElementById('modal-exito');
            document.getElementById('detalle-pago-modal').textContent = `Pagas con: ${metodoPago.value.toUpperCase()}`;
            modal.style.display = 'flex';
        }
    });

    // 5. CERRAR PANEL Y MODAL
    document.getElementById('cerrar-carrito').addEventListener('click', () => {
        panel.classList.remove('activo');
    });

    document.getElementById('btn-cerrar-modal').addEventListener('click', () => {
        const modal = document.getElementById('modal-exito');
        modal.style.display = 'none';

        // Solo recarga si el pedido fue exitoso
        if (document.querySelector('.icon-check').textContent === "✔") {
            location.reload();
        }
    });
    // 4. VALIDACIÓN ÚNICA Y FINALIZAR PEDIDO
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre');
        const direccion = document.getElementById('direccion');
        const metodoPago = document.querySelector('input[name="metodo-pago"]:checked');

        let errores = 0;

        // Validar Nombre
        if (nombre.value.trim().length < 3) {
            nombre.classList.add('invalido');
            errores++;
        } else {
            nombre.classList.remove('invalido');
        }

        // Validar Dirección
        if (direccion.value.trim().length < 5) {
            direccion.classList.add('invalido');
            errores++;
        } else {
            direccion.classList.remove('invalido');
        }

        // Validar Tarjeta
        if (metodoPago && metodoPago.value === 'tarjeta') {
            const numLimpio = inputTarjeta.value.replace(/\s+/g, '');
            if (numLimpio.length !== 16 || isNaN(numLimpio)) {
                inputTarjeta.classList.add('invalido');
                errores++;
            } else {
                inputTarjeta.classList.remove('invalido');
            }
        }

        // LÓGICA DE MENSAJES
        if (errores > 0) {
            // 1. Buscamos el modal y sus elementos
            const modal = document.getElementById('modal-exito');
            const tituloModal = modal.querySelector('h2');
            const textoModal = document.getElementById('detalle-pago-modal');
            const icono = modal.querySelector('.icon-check');

            // 2. Cambiamos el contenido para que parezca de error
            tituloModal.textContent = "¡Ups! Algo falta";
            tituloModal.style.color = "#ff4d4d";
            textoModal.textContent = "Revisa los campos en rojo e inténtalo de nuevo.";
            icono.textContent = "❌"; // Cambiamos el check por una X
            icono.style.color = "#ff4d4d";

            // 3. Lo mostramos en el centro
            modal.style.display = 'flex';

        } else {
            // SI TODO ESTÁ BIEN: Mostramos el mensaje de éxito original
            const modal = document.getElementById('modal-exito');
            const tituloModal = modal.querySelector('h2');
            const icono = modal.querySelector('.icon-check');

            tituloModal.textContent = "¡Pedido Confirmado!";
            tituloModal.style.color = "#27ae60";
            icono.textContent = "✔";
            icono.style.color = "#27ae60";
            document.getElementById('detalle-pago-modal').textContent = `Pagas con: ${metodoPago.value.toUpperCase()}`;

            panel.classList.remove('activo');
            modal.style.display = 'flex';
        }
    });

});
// 1. Esperamos a que el DOM esté cargado para evitar errores
document.addEventListener('DOMContentLoaded', () => {
    
    // 2. Seleccionamos el formulario por su ID
    const formulario = document.querySelector('#formulario-contacto');

    // 3. Verificamos que el formulario exista en la página actual
    if (formulario) {
        formulario.addEventListener('submit', function(event) {
            // Detenemos el envío automático para procesarlo con JS
            event.preventDefault();

            // 4. Capturamos los valores de los inputs y eliminamos espacios vacíos
            const nombre = document.querySelector('#nombre').value.trim();
            const email = document.querySelector('#email').value.trim();
            const mensaje = document.querySelector('#mensaje').value.trim();

            // 5. Lógica de validación avanzada
            
            // Validación: Campos no vacíos
            if (nombre === "" || email === "" || mensaje === "") {
                alert("Por favor, llena todos los campos antes de enviar.");
                return;
            }

            // Validación: Nombre mínimo 3 caracteres
            if (nombre.length < 3) {
                alert("El nombre debe tener al menos 3 caracteres.");
                return;
            }

            // Validación: Email con formato válido (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Por favor, ingresa un correo electrónico válido (ejemplo@correo.com).");
                return;
            }

            // Validación: Descripción (mensaje) mínimo 10 caracteres
            if (mensaje.length < 10) {
                alert("El mensaje es muy corto. Por favor, escribe al menos 10 caracteres.");
                return;
            }

            // Si pasa todas las validaciones anteriores, el código continúa aquí:

            // 6. Simulación de envío exitoso (Manipulación del DOM)
            console.log(`Formulario enviado por: ${nombre} (${email})`);
            
            // Cambiamos el contenido del formulario por un mensaje de éxito
            formulario.innerHTML = `
                <div style="text-align: center; padding: 20px; border: 2px solid #000;">
                    <h3>¡GRACIAS, ${nombre.toUpperCase()}!</h3>
                    <p>Hemos recibido tu mensaje correctamente.</p>
                    <p>Nos pondremos en contacto contigo al correo: <strong>${email}</strong></p>
                    <button onclick="location.reload()" style="margin-top:20px; padding:10px; background:#000; color:#fff; border:none; cursor:pointer;">VOLVER A ESCRIBIR</button>
                </div>
            `;
        });
    }
});