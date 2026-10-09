```javascript
// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================

const SUPABASE_URL = "https://wzekdvkwdivzuujnvcnj.supabase.co";
const SUPABASE_KEY = "sb_publishable_5y6uaC69wKM0WlNYRSfPyQ_RpeCSKJh";

if (!window.supabase || !window.supabase.createClient) {
    console.error("No se pudo cargar la biblioteca de Supabase.");
    alert("No se pudo conectar con el sistema. Recargá la página.");
} else {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}

// ==========================================
// FUNCIONES GENERALES
// ==========================================

function volverAlPanel() {
    location.reload();
}

// ==========================================
// NUEVA ORDEN
// ==========================================

function mostrarNuevaOrden() {
    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>Nueva orden de trabajo</h2>
        <p class="admin-description">Cargá los datos del cliente y del vehículo.</p>

        <form id="formNuevaOrden">
            <input type="text" id="codigo" placeholder="Código. Ej: PAG-00127" required>
            <input type="text" id="cliente" placeholder="Nombre del cliente" required>
            <input type="text" id="telefono" placeholder="Teléfono">
            <input type="text" id="vehiculo" placeholder="Vehículo" required>
            <input type="text" id="patente" placeholder="Patente" required>
            <input type="text" id="kilometrajeIngreso" placeholder="Kilometraje de ingreso">
            <label for="fechaIngreso">Fecha de ingreso</label>
            <input type="date" id="fechaIngreso" required>
            <label for="fechaEntrega">Fecha de entrega</label>
            <input type="date" id="fechaEntrega">

            <label for="estado">Estado del vehículo</label>
            <select id="estado">
                <option value="En recepción">En recepción</option>
                <option value="En diagnóstico">En diagnóstico</option>
                <option value="En reparación">En reparación</option>
                <option value="Esperando repuestos">Esperando repuestos</option>
                <option value="Listo para retirar">Listo para retirar</option>
                <option value="Entregado">Entregado</option>
            </select>

            <textarea id="trabajo" placeholder="Trabajo a realizar" rows="4"></textarea>
            <textarea id="observaciones" placeholder="Observaciones" rows="4"></textarea>

            <button type="submit" class="admin-button">💾 Guardar orden</button>
        </form>

        <button class="admin-button" onclick="volverAlPanel()">← Volver al panel</button>
    `;

    document.getElementById("formNuevaOrden").addEventListener("submit", function(event) {
        event.preventDefault();

        const codigo = document.getElementById("codigo").value.trim().toUpperCase();

        if (!/^PAG-\d{5}$/.test(codigo)) {
            alert("Usá un código con este formato: PAG-00127");
            return;
        }

        const ordenes = JSON.parse(localStorage.getItem("ordenesPAG")) || {};

        if (ordenes[codigo]) {
            alert("Ya existe una orden con ese código.");
            return;
        }

        const orden = {
            cliente: document.getElementById("cliente").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            vehiculo: document.getElementById("vehiculo").value.trim(),
            patente: document.getElementById("patente").value.trim(),
            kilometrajeIngreso: document.getElementById("kilometrajeIngreso").value.trim(),
            kilometrajeSalida: "Pendiente",
            fechaIngreso: document.getElementById("fechaIngreso").value,
            fechaEntrega: document.getElementById("fechaEntrega").value,
            estado: document.getElementById("estado").value,
            trabajo: document.getElementById("trabajo").value.trim(),
            observaciones: document.getElementById("observaciones").value.trim(),
            foto: ""
        };

        ordenes[codigo] = orden;
        localStorage.setItem("ordenesPAG", JSON.stringify(ordenes));

        alert("Orden " + codigo + " guardada correctamente.");
        volverAlPanel();
    });
}

// ==========================================
// EDITAR ORDEN
// ==========================================

function mostrarEditarOrden() {
    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>Editar orden existente</h2>
        <p class="admin-description">Ingresá el código de la orden que querés modificar.</p>

        <input type="text" id="codigoEditar" placeholder="Ej: PAG-00128">

        <button class="admin-button" onclick="buscarOrdenParaEditar()">🔍 Buscar orden</button>
        <button class="admin-button" onclick="volverAlPanel()">← Volver al panel</button>
    `;
}

function buscarOrdenParaEditar() {
    const codigo = document.getElementById("codigoEditar").value.trim().toUpperCase();

    if (!codigo) {
        alert("Ingresá el código de la orden.");
        return;
    }

    const ordenes = JSON.parse(localStorage.getItem("ordenesPAG")) || {};
    const orden = ordenes[codigo];

    if (!orden) {
        alert("No se encontró la orden " + codigo);
        return;
    }

    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>Editar orden ${codigo}</h2>

        <form id="formEditarOrden">
            <label for="editarCliente">Cliente</label>
            <input type="text" id="editarCliente" required>

            <label for="editarTelefono">Teléfono</label>
            <input type="text" id="editarTelefono">

            <label for="editarVehiculo">Vehículo</label>
            <input type="text" id="editarVehiculo" required>

            <label for="editarPatente">Patente</label>
            <input type="text" id="editarPatente" required>

            <label for="editarKilometraje">Kilometraje</label>
            <input type="text" id="editarKilometraje">

            <label for="editarEstado">Estado</label>
            <select id="editarEstado">
                <option value="En recepción">En recepción</option>
                <option value="En diagnóstico">En diagnóstico</option>
                <option value="En reparación">En reparación</option>
                <option value="Esperando repuestos">Esperando repuestos</option>
                <option value="Listo para retirar">Listo para retirar</option>
                <option value="Entregado">Entregado</option>
            </select>

            <textarea id="editarTrabajo" rows="4" placeholder="Trabajo a realizar"></textarea>
            <textarea id="editarObservaciones" rows="4" placeholder="Observaciones"></textarea>

            <button type="submit" class="admin-button">💾 Guardar cambios</button>
        </form>

        <button class="admin-button" onclick="volverAlPanel()">← Volver al panel</button>
    `;

    document.getElementById("editarCliente").value = orden.cliente || "";
    document.getElementById("editarTelefono").value = orden.telefono || "";
    document.getElementById("editarVehiculo").value = orden.vehiculo || "";
    document.getElementById("editarPatente").value = orden.patente || "";
    document.getElementById("editarKilometraje").value = orden.kilometrajeIngreso || "";
    document.getElementById("editarEstado").value = orden.estado || "En recepción";
    document.getElementById("editarTrabajo").value = orden.trabajo || "";
    document.getElementById("editarObservaciones").value = orden.observaciones || "";

    document.getElementById("formEditarOrden").addEventListener("submit", function(event) {
        event.preventDefault();

        orden.cliente = document.getElementById("editarCliente").value.trim();
        orden.telefono = document.getElementById("editarTelefono").value.trim();
        orden.vehiculo = document.getElementById("editarVehiculo").value.trim();
        orden.patente = document.getElementById("editarPatente").value.trim();
        orden.kilometrajeIngreso = document.getElementById("editarKilometraje").value.trim();
        orden.estado = document.getElementById("editarEstado").value;
        orden.trabajo = document.getElementById("editarTrabajo").value.trim();
        orden.observaciones = document.getElementById("editarObservaciones").value.trim();

        ordenes[codigo] = orden;
        localStorage.setItem("ordenesPAG", JSON.stringify(ordenes));

        alert("Orden " + codigo + " actualizada correctamente.");
        volverAlPanel();
    });
}

// ==========================================
// VER ÓRDENES
// ==========================================

function mostrarOrdenes() {
    const adminBox = document.querySelector(".admin-box");
    const ordenes = JSON.parse(localStorage.getItem("ordenesPAG")) || {};

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>📋 Órdenes del taller</h2>
        <p class="admin-description">Buscá por código, cliente, patente o vehículo.</p>

        <input type="text" id="buscarOrden" placeholder="🔎 Buscar orden..." oninput="filtrarOrdenes()">
        <div id="resultadosBusqueda"></div>

        <button class="admin-button" onclick="volverAlPanel()">← Volver al panel</button>
    `;

    dibujarOrdenes(ordenes);
}

function dibujarOrdenes(ordenes) {
    const resultados = document.getElementById("resultadosBusqueda");
    if (!resultados) return;

    const lista = Object.entries(ordenes);

    if (!lista.length) {
        resultados.innerHTML = `<p class="admin-description">No hay órdenes registradas todavía.</p>`;
        return;
    }

    resultados.innerHTML = lista.map(([codigo, orden]) => `
        <div class="orden-admin">
            <h3>${escaparHTML(codigo)}</h3>
            <p><strong>Cliente:</strong> ${escaparHTML(orden.cliente || "-")}</p>
            <p><strong>Vehículo:</strong> ${escaparHTML(orden.vehiculo || "-")}</p>
            <p><strong>Patente:</strong> ${escaparHTML(orden.patente || "-")}</p>
            <p><strong>Teléfono:</strong> ${escaparHTML(orden.telefono || "-")}</p>
            <p><strong>Fecha de ingreso:</strong> ${escaparHTML(orden.fechaIngreso || "-")}</p>
            <p><strong>Estado:</strong> ${escaparHTML(orden.estado || "-")}</p>
            <p><strong>Trabajo:</strong> ${escaparHTML(orden.trabajo || "-")}</p>

            <button class="admin-button" onclick="editarDesdeLista('${escaparHTML(codigo)}')">✏️ Editar orden</button>
```
