// ==========================================
// NUEVA ORDEN
// ==========================================

function mostrarNuevaOrden() {

    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `

        <div class="admin-logo">
            PAG
        </div>

        <h2>Nueva orden de trabajo</h2>

        <p class="admin-description">
            Cargá los datos del cliente y del vehículo.
        </p>

        <form id="formNuevaOrden">

            <input
                type="text"
                id="codigo"
                placeholder="Código de orden. Ej: PAG-00127"
                required
            >

            <input
                type="text"
                id="cliente"
                placeholder="Nombre del cliente"
                required
            >

            <input
                type="text"
                id="telefono"
                placeholder="Teléfono"
            >

            <input
                type="text"
                id="vehiculo"
                placeholder="Vehículo. Ej: Volkswagen Virtus"
                required
            >

            <input
                type="text"
                id="patente"
                placeholder="Patente"
                required
            >

            <input
                type="text"
                id="kilometrajeIngreso"
                placeholder="Kilometraje de ingreso"
            >

            <input
                type="date"
                id="fechaIngreso"
                required
            >

            <input
                type="date"
                id="fechaEntrega"
            >

            <select id="estado">

                <option value="En recepción">
                    En recepción
                </option>

                <option value="En diagnóstico">
                    En diagnóstico
                </option>

                <option value="En reparación">
                    En reparación
                </option>

                <option value="Esperando repuestos">
                    Esperando repuestos
                </option>

                <option value="Listo para retirar">
                    Listo para retirar
                </option>

                <option value="Entregado">
                    Entregado
                </option>

            </select>

            <textarea
                id="trabajo"
                placeholder="Trabajo a realizar"
                rows="4"
            ></textarea>

            <textarea
                id="observaciones"
                placeholder="Observaciones"
                rows="4"
            ></textarea>

            <button
                type="submit"
                class="admin-button"
            >
                💾 Guardar orden
            </button>

        </form>

        <button
            class="admin-button"
            onclick="location.reload()"
        >
            ← Volver al panel
        </button>

    `;

    // ==========================================
    // GUARDAR ORDEN
    // ==========================================

    document
        .getElementById("formNuevaOrden")
        .addEventListener("submit", function(event) {

            event.preventDefault();

            const orden = {

                cliente:
                    document.getElementById("cliente").value,

                telefono:
                    document.getElementById("telefono").value,

                vehiculo:
                    document.getElementById("vehiculo").value,

                patente:
                    document.getElementById("patente").value,

                kilometrajeIngreso:
                    document.getElementById("kilometrajeIngreso").value,

                kilometrajeSalida:
                    "Pendiente",

                fechaIngreso:
                    document.getElementById("fechaIngreso").value,

                fechaEntrega:
                    document.getElementById("fechaEntrega").value,

                estado:
                    document.getElementById("estado").value,

                trabajo:
                    document.getElementById("trabajo").value,

                observaciones:
                    document.getElementById("observaciones").value,

                foto:
                    ""

            };

            const codigo =
                document.getElementById("codigo").value
                .trim()
                .toUpperCase();

            // Guardar la orden en el navegador

            const ordenes =
    JSON.parse(localStorage.getItem("ordenesPAG")) || {};

ordenes[codigo] = orden;

localStorage.setItem(
    "ordenesPAG",
    JSON.stringify(ordenes)
);

            alert(
                "✅ Orden " + codigo + " guardada correctamente."
            );

            location.reload();

        });

}
// ==========================================
// EDITAR ORDEN EXISTENTE
// ==========================================

function mostrarEditarOrden() {

    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `

        <div class="admin-logo">
            PAG
        </div>

        <h2>Editar orden existente</h2>

        <p class="admin-description">
            Ingresá el código de la orden que querés modificar.
        </p>

        <input
            type="text"
            id="codigoEditar"
            placeholder="Ej: PAG-00128"
        >

        <button
            class="admin-button"
            onclick="buscarOrdenParaEditar()"
        >
            🔍 Buscar orden
        </button>

        <button
            class="admin-button"
            onclick="location.reload()"
        >
            ← Volver al panel
        </button>

    `;
}
// ==========================================
// BUSCAR ORDEN PARA EDITAR
// ==========================================

function buscarOrdenParaEditar() {

    const codigo =
        document.getElementById("codigoEditar")
        .value
        .trim()
        .toUpperCase();

    if (codigo === "") {
        alert("Ingresá el código de la orden.");
        return;
    }

    const ordenes =
        JSON.parse(localStorage.getItem("ordenesPAG")) || {};

    const orden = ordenes[codigo];

    if (!orden) {
        alert("No se encontró la orden " + codigo);
        return;
    }

    const adminBox =
        document.querySelector(".admin-box");

    adminBox.innerHTML = `

        <div class="admin-logo">
            PAG
        </div>

        <h2>Editar orden ${codigo}</h2>

        <p class="admin-description">
            Modificá los datos que necesites.
        </p>

        <form id="formEditarOrden">

            <input
                type="text"
                id="editarCliente"
                value="${orden.cliente || ""}"
                placeholder="Nombre del cliente"
            >

            <input
                type="text"
                id="editarTelefono"
                value="${orden.telefono || ""}"
                placeholder="Teléfono"
            >

            <input
                type="text"
                id="editarVehiculo"
                value="${orden.vehiculo || ""}"
                placeholder="Vehículo"
            >

            <input
                type="text"
                id="editarPatente"
                value="${orden.patente || ""}"
                placeholder="Patente"
            >

            <input
                type="text"
                id="editarKilometraje"
                value="${orden.kilometrajeIngreso || ""}"
                placeholder="Kilometraje"
            >

            <select id="editarEstado">

                <option value="En recepción">
                    En recepción
                </option>

                <option value="En diagnóstico">
                    En diagnóstico
                </option>

                <option value="En reparación">
                    En reparación
                </option>

                <option value="Esperando repuestos">
                    Esperando repuestos
                </option>

                <option value="Listo para retirar">
                    Listo para retirar
                </option>

                <option value="Entregado">
                    Entregado
                </option>

            </select>

            <textarea
                id="editarTrabajo"
                rows="4"
                placeholder="Trabajo a realizar"
            >${orden.trabajo || ""}</textarea>

            <textarea
                id="editarObservaciones"
                rows="4"
                placeholder="Observaciones"
            >${orden.observaciones || ""}</textarea>

            <button
                type="submit"
                class="admin-button"
            >
                💾 Guardar cambios
            </button>

        </form>

        <button
            class="admin-button"
            onclick="location.reload()"
        >
            ← Volver al panel
        </button>

    `;

    document.getElementById("editarEstado").value =
        orden.estado || "En recepción";


    document
        .getElementById("formEditarOrden")
        .addEventListener("submit", function(event) {

            event.preventDefault();

            orden.cliente =
                document.getElementById("editarCliente").value;

            orden.telefono =
                document.getElementById("editarTelefono").value;

            orden.vehiculo =
                document.getElementById("editarVehiculo").value;

            orden.patente =
                document.getElementById("editarPatente").value;

            orden.kilometrajeIngreso =
                document.getElementById("editarKilometraje").value;

            orden.estado =
                document.getElementById("editarEstado").value;

            orden.trabajo =
                document.getElementById("editarTrabajo").value;

            orden.observaciones =
                document.getElementById("editarObservaciones").value;


            ordenes[codigo] = orden;

            localStorage.setItem(
                "ordenesPAG",
                JSON.stringify(ordenes)
            );

            alert(
                "✅ Orden " + codigo + " actualizada correctamente."
            );

            location.reload();

        });

}
// ==========================================
// VER TODAS LAS ÓRDENES
// ==========================================

function mostrarOrdenes() {

    const adminBox = document.querySelector(".admin-box");

    const ordenes =
        JSON.parse(localStorage.getItem("ordenesPAG")) || {};

    let contenido = "";

    if (Object.keys(ordenes).length === 0) {

        contenido = `
            <p class="admin-description">
                No hay órdenes registradas todavía.
            </p>
        `;

    } else {

        Object.keys(ordenes).forEach(codigo => {

            const orden = ordenes[codigo];

            contenido += `

                <div class="orden-admin">

                    <h3>${codigo}</h3>

                    <p>
                        <strong>Cliente:</strong>
                        ${orden.cliente || "-"}
                    </p>

                    <p>
                        <strong>Vehículo:</strong>
                        ${orden.vehiculo || "-"}
                    </p>

                    <p>
    <strong>Patente:</strong>
    ${orden.patente || "-"}
</p>

<p>
    <strong>Teléfono:</strong>
    ${orden.telefono || "-"}
</p>

<p>
    <strong>Fecha de ingreso:</strong>
    ${orden.fechaIngreso || "-"}
</p>

<p>
    <strong>Estado:</strong>

    <span class="estado-orden
        ${
            (orden.estado || "").toLowerCase().includes("recepción")
            ? "estado-recepcion"
            : (orden.estado || "").toLowerCase().includes("diagnóstico")
            ? "estado-diagnostico"
            : (orden.estado || "").toLowerCase().includes("reparación")
            ? "estado-reparacion"
            : (orden.estado || "").toLowerCase().includes("repuestos")
            ? "estado-repuestos"
            : (orden.estado || "").toLowerCase().includes("listo")
            ? "estado-listo"
            : (orden.estado || "").toLowerCase().includes("entregado")
            ? "estado-entregado"
            : ""
        }
    ">
        ${orden.estado || "-"}
    </span>

</p>
<p>
    <strong>Trabajo:</strong>
    ${orden.trabajo || "-"}
</p>
                    <button
                        class="admin-button"
                        onclick="editarDesdeLista('${codigo}')"
                    >
                        ✏️ Editar orden
                    </button>
<button
    class="admin-button"
    onclick="window.open('seguimiento.html?orden=${codigo}', '_blank')"
>
    👁️ Ver seguimiento
</button>
                </div>

            `;
        });
    }

    adminBox.innerHTML = `

        <div class="admin-logo">
            PAG
        </div>

        <h2>📋 Órdenes del taller</h2>

        <p class="admin-description">
            Estas son las órdenes registradas actualmente.
        </p>
<input
    type="text"
    id="buscarOrden"
    placeholder="🔎 Buscar por cliente, patente o número de orden"
    oninput="filtrarOrdenes()"
>
        <div id="resultadosBusqueda">
    ${contenido}
</div>

        <button
            class="admin-button"
            onclick="location.reload()"
        >
            ← Volver al panel
        </button>

    `;
}


// ==========================================
// EDITAR DESDE LA LISTA
// ==========================================

function editarDesdeLista(codigo) {

    mostrarEditarOrden();

    document.getElementById("codigoEditar").value = codigo;

    buscarOrdenParaEditar();

}
// ==========================================
// BUSCAR ÓRDENES
// ==========================================

// ==========================================
// BUSCAR ÓRDENES
// ==========================================

function filtrarOrdenes() {

    const buscador = document.getElementById("buscarOrden");
    const resultados = document.getElementById("resultadosBusqueda");

    if (!buscador || !resultados) {
        return;
    }

    const texto = buscador.value.trim().toLowerCase();

    const ordenes =
        JSON.parse(localStorage.getItem("ordenesPAG")) || {};

    let contenido = "";

    Object.entries(ordenes).forEach(([codigo, orden]) => {

        const cliente = String(orden.cliente || "").toLowerCase();
        const patente = String(orden.patente || "").toLowerCase();
        const vehiculo = String(orden.vehiculo || "").toLowerCase();
        const codigoMinuscula = codigo.toLowerCase();

        const coincide =
            texto === "" ||
            codigoMinuscula.includes(texto) ||
            cliente.includes(texto) ||
            patente.includes(texto) ||
            vehiculo.includes(texto);

        if (coincide) {

            contenido += `
                <div class="orden-admin">

                    <h3>${codigo}</h3>

                    <p>
                        <strong>Cliente:</strong>
                        ${orden.cliente || "-"}
                    </p>

                    <p>
                        <strong>Vehículo:</strong>
                        ${orden.vehiculo || "-"}
                    </p>

                    <p>
                        <strong>Patente:</strong>
                        ${orden.patente || "-"}
                    </p>

                    <p>
                        <strong>Estado:</strong>
                        ${orden.estado || "-"}
                    </p>

                    <button
                        class="admin-button"
                        onclick="editarDesdeLista('${codigo}')"
                    >
                        ✏️ Editar orden
                    </button>

                </div>
            `;
        }

    });

    if (contenido === "") {

        contenido = `
            <p class="admin-description">
                No se encontraron órdenes.
            </p>
        `;

    }

    resultados.innerHTML = contenido;
}
// ...todo tu código anterior...


 
// ==========================================
// VER TURNOS
// ==========================================


let turnosAdmin = [];

async function mostrarTurnos() {
    const adminBox = document.querySelector(".admin-box");

    adminBox.innerHTML = `
        <div class="admin-logo">PAG</div>
        <h2>📅 Turnos del taller</h2>
        <p class="admin-description">Administración de turnos de Precision Automotriz Group.</p>
        <div id="listaTurnos">Cargando turnos...</div>
        <button class="admin-button" onclick="location.reload()">← Volver al panel</button>
    `;

    const { data, error } = await window.supabaseClient
        .from("Turnos")
        .select("*")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

    if (error) {
        console.error("Error al cargar turnos:", error);
        document.getElementById("listaTurnos").innerHTML =
            "<p>No se pudieron cargar los turnos. Revisá tu sesión y los permisos.</p>";
        return;
    }

    turnosAdmin = data || [];
    dibujarTurnos();
}

function dibujarTurnos() {
    const contenedor = document.getElementById("listaTurnos");
    if (!contenedor) return;

    const buscar = (document.getElementById("buscarTurno")?.value || "")
        .toLowerCase().trim();

    const turnos = [...turnosAdmin]
        .filter(t =>
            [t.nombre, t.telefono, t.vehiculo, t.patente, t.servicio]
                .some(v => String(v || "").toLowerCase().includes(buscar))
        )
        .sort((a, b) => {
            if (a.estado === "Cancelado" && b.estado !== "Cancelado") return 1;
            if (a.estado !== "Cancelado" && b.estado === "Cancelado") return -1;
            return new Date(`${a.fecha}T${a.hora}`) -
                   new Date(`${b.fecha}T${b.hora}`);
        });

    if (turnos.length === 0) {
        contenedor.innerHTML = `
            <p class="admin-description">📭 No hay turnos para mostrar.</p>`;
        return;
    }

    contenedor.innerHTML = turnos.map(t => `
        <div class="orden-admin">
            <h3>📅 ${t.fecha ? t.fecha.split("-").reverse().join("/") : ""} — ${t.hora || ""}</h3>
            <p><strong>Código de solicitud:</strong> ${t.codigo || "Sin código"}</p>
            <p><strong>Cliente:</strong> ${t.nombre || ""}</p>
            <p><strong>Teléfono:</strong> ${t.telefono || ""}</p>
            <p><strong>Vehículo:</strong> ${t.vehiculo || ""}</p>
            <p><strong>Patente:</strong> ${t.patente || ""}</p>
            <p><strong>Servicio:</strong> ${t.servicio || "No especificado"}</p>
            <p><strong>Motivo:</strong> ${t.motivo || ""}</p>
            <p><strong>Estado:</strong> ${t.estado || "Pendiente"}</p>
            <button class="admin-button" onclick="confirmarTurno(${t.id})">✅ Confirmar</button>
            <button class="admin-button" onclick="atenderTurno(${t.id})">🔧 Marcar atendido</button>
            <button class="admin-button" onclick="cancelarTurno(${t.id})">❌ Cancelar</button>
            <button class="admin-button" onclick="eliminarTurno(${t.id})">🗑️ Eliminar</button>
        </div>
    `).join("");
}

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

function filtrarTurnos() {
    dibujarTurnos();
}

async function guardarTurno() {
    const nombre = document.getElementById("turnoCliente").value.trim();
    const telefono = document.getElementById("turnoTelefono").value.trim();
    const vehiculo = document.getElementById("turnoVehiculo").value.trim();
    const patente = document.getElementById("turnoPatente").value.trim();
    const fecha = document.getElementById("turnoFecha").value;
    const hora = document.getElementById("turnoHora").value;
    const servicio = document.getElementById("turnoTipoServicio").value;
    const motivo = document.getElementById("turnoMotivo").value.trim();

    if (!nombre || !telefono || !vehiculo || !fecha || !hora || !servicio) {
        alert("Completá nombre, teléfono, vehículo, fecha, horario y tipo de servicio.");
        return;
    }

    const { error } = await window.supabaseClient
        .from("Turnos")
        .insert([{
            nombre,
            telefono,
            vehiculo,
            patente,
            fecha,
            hora,
            servicio,
            motivo,
            estado: "Pendiente"
        }]);

    if (error) {
        console.error("Error al guardar turno:", error);
        alert("No se pudo guardar el turno. Revisá la consola y los permisos de Supabase.");
        return;
    }

    alert("Turno guardado correctamente.");
    await mostrarTurnos();
}

