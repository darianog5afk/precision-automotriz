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
            <button class="admin-button" onclick="window.open('seguimiento.html?orden=${encodeURIComponent(codigo)}', '_blank')">👁️ Ver seguimiento</button>
        </div>
    `).join("");
}

function filtrarOrdenes() {
    const texto = (document.getElementById("buscarOrden")?.value || "").trim().toLowerCase();
    const ordenes = JSON.parse(localStorage.getItem("ordenesPAG")) || {};

    const filtradas = Object.fromEntries(
        Object.entries(ordenes).filter(([codigo, orden]) =>
            [
                codigo,
                orden.cliente,
                orden.patente,
                orden.vehiculo,
                orden.telefono
            ].some(valor => String(valor || "").toLowerCase().includes(texto))
        )
    );

    dibujarOrdenes(filtradas);
}

function editarDesdeLista(codigo) {
    mostrarEditarOrden();
    document.getElementById("codigoEditar").value = codigo;
    buscarOrdenParaEditar();
}

// ==========================================
// VER TURNOS - SUPABASE
// ==========================================

let turnosAdmin = [];

async function mostrarTurnos() {
    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>📅 Turnos del taller</h2>
        <p class="admin-description">Administración de turnos de Precision Automotriz Group.</p>

        <input type="text" id="buscarTurno" placeholder="🔎 Buscar por código, cliente, patente o vehículo..." oninput="filtrarTurnos()">

        <div id="listaTurnos" aria-live="polite">Cargando turnos...</div>

        <button class="admin-button" onclick="volverAlPanel()">← Volver al panel</button>
    `;

    if (!window.supabaseClient) {
        document.getElementById("listaTurnos").textContent =
            "No se pudo iniciar la conexión con Supabase. Recargá la página.";
        return;
    }

    const { data, error } = await window.supabaseClient
        .from("Turnos")
        .select("*")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

    if (error) {
        console.error("Error al cargar turnos:", error);
        document.getElementById("listaTurnos").innerHTML =
            "<p>No se pudieron cargar los turnos. Revisá la sesión y los permisos de Supabase.</p>";
        return;
    }

    turnosAdmin = data || [];
    dibujarTurnos();
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

function dibujarTurnos() {
    const contenedor = document.getElementById("listaTurnos");
    if (!contenedor) return;

    const buscar = (document.getElementById("buscarTurno")?.value || "").toLowerCase().trim();

    const turnos = [...turnosAdmin]
        .filter(t => [
            t.codigo, t.nombre, t.telefono, t.vehiculo,
            t.patente, t.servicio, t.estado
        ].some(valor => String(valor || "").toLowerCase().includes(buscar)))
        .sort((a, b) => {
            if (a.estado === "Cancelado" && b.estado !== "Cancelado") return 1;
            if (a.estado !== "Cancelado" && b.estado === "Cancelado") return -1;
            return new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`);
        });

    if (!turnos.length) {
        contenedor.innerHTML = `<p class="admin-description">📭 No hay turnos para mostrar.</p>`;
        return;
    }

    contenedor.innerHTML = turnos.map(t => `
        <div class="orden-admin">
            <h3>📅 ${escaparHTML(t.fecha ? t.fecha.split("-").reverse().join("/") : "-")} — ${escaparHTML(t.hora || "-")}</h3>
            <p><strong>Código de solicitud:</strong> ${escaparHTML(t.codigo || "Sin código")}</p>
            <p><strong>Cliente:</strong> ${escaparHTML(t.nombre || "-")}</p>
            <p><strong>Teléfono:</strong> ${escaparHTML(t.telefono || "-")}</p>
            <p><strong>Vehículo:</strong> ${escaparHTML(t.vehiculo || "-")}</p>
            <p><strong>Patente:</strong> ${escaparHTML(t.patente || "-")}</p>
            <p><strong>Tipo de servicio:</strong> ${escaparHTML(t.servicio || "No especificado")}</p>
            <p><strong>Motivo:</strong> ${escaparHTML(t.motivo || "-")}</p>
            <p><strong>Estado:</strong> ${escaparHTML(t.estado || "Pendiente")}</p>

            <button class="admin-button" onclick="confirmarTurno(${Number(t.id)})">✅ Confirmar turno</button>
            <button class="admin-button" onclick="atenderTurno(${Number(t.id)})">🔧 Marcar como atendido</button>
            <button class="admin-button" onclick="cancelarTurno(${Number(t.id)})">❌ Cancelar turno</button>
            <button class="admin-button" onclick="eliminarTurno(${Number(t.id)})">🗑️ Eliminar turno</button>
        </div>
    `).join("");
}

function filtrarTurnos() {
    dibujarTurnos();
}

// ==========================================
// CAMBIAR ESTADO Y ELIMINAR TURNOS
// ==========================================

async function confirmarTurno(id) {
    await cambiarEstadoTurno(id, "Confirmado");
}

async function atenderTurno(id) {
    await cambiarEstadoTurno(id, "Atendido");
}

async function cancelarTurno(id) {
    await cambiarEstadoTurno(id, "Cancelado");
}

async function cambiarEstadoTurno(id, estado) {
    const { error } = await window.supabaseClient
        .from("Turnos")
        .update({ estado })
        .eq("id", id);

    if (error) {
        console.error("Error al actualizar turno:", error);
        alert("No se pudo actualizar el turno. Revisá los permisos de Supabase.");
        return;
    }

    alert("Turno actualizado correctamente.");
    await mostrarTurnos();
}

async function eliminarTurno(id) {
    if (!confirm("¿Querés eliminar este turno definitivamente?")) return;

    const { error } = await window.supabaseClient
        .from("Turnos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error al eliminar turno:", error);
        alert("No se pudo eliminar el turno. Revisá los permisos de Supabase.");
        return;
    }

    alert("Turno eliminado correctamente.");
    await mostrarTurnos();
}

// ==========================================
// GUARDAR TURNO DESDE ADMINISTRACIÓN
// ==========================================

async function guardarTurno() {
    const nombre = document.getElementById("turnoCliente")?.value.trim() || "";
    const telefono = document.getElementById("turnoTelefono")?.value.trim() || "";
    const vehiculo = document.getElementById("turnoVehiculo")?.value.trim() || "";
    const patente = document.getElementById("turnoPatente")?.value.trim() || "";
    const fecha = document.getElementById("turnoFecha")?.value || "";
    const hora = document.getElementById("turnoHora")?.value || "";
    const servicio = document.getElementById("turnoTipoServicio")?.value || "";
    const motivo = document.getElementById("turnoMotivo")?.value.trim() || "";

    if (!nombre || !telefono || !vehiculo || !fecha || !hora || !servicio) {
        alert("Completá nombre, teléfono, vehículo, fecha, horario y tipo de servicio.");
        return;
    }

    const { data: codigo, error } = await window.supabaseClient.rpc(
        "solicitar_turno",
        {
            p_nombre: nombre,
            p_telefono: telefono,
            p_vehiculo: vehiculo,
            p_patente: patente,
            p_fecha: fecha,
            p_hora: hora,
            p_servicio: servicio,
            p_motivo: motivo
        }
    );

    if (error) {
        console.error("Error al guardar turno:", error);
        alert("No se pudo guardar el turno. Revisá los permisos de Supabase.");
        return;
    }

    alert(`Turno guardado correctamente. Código: ${codigo}`);
    await mostrarTurnos();
}
```
