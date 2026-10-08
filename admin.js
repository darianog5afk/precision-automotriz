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

function mostrarTurnos() {

    const adminBox = document.querySelector(".admin-box");

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];
        turnos.sort((a, b) => {

    const fechaA = new Date(`${a.fecha}T${a.hora}`);
    const fechaB = new Date(`${b.fecha}T${b.hora}`);

    // Los cancelados van al final
    if (a.estado === "Cancelado" && b.estado !== "Cancelado") {
        return 1;
    }

    if (a.estado !== "Cancelado" && b.estado === "Cancelado") {
        return -1;
    }

    return fechaA - fechaB;
});

    let listaTurnos = "";

    if (turnos.length === 0) {

        listaTurnos = `
            <p class="admin-description">
                📭 Todavía no hay turnos registrados.
            </p>
        `;

    } else {

        turnos.forEach((turno) => {

            listaTurnos += `

                <div class="orden-admin">

                    <h3>
    📅 ${turno.fecha.split("-").reverse().join("/")} — ${turno.hora}
</h3>

                    <p>
                        <strong>Cliente:</strong>
                        ${turno.cliente}
                    </p>

                    <p>
                        <strong>Teléfono:</strong>
                        ${turno.telefono}
                    </p>

                    <p>
                        <strong>Vehículo:</strong>
                        ${turno.vehiculo}
                    </p>

                    <p>
                        <strong>Patente:</strong>
                        ${turno.patente}
                    </p>
                    <p>
    <strong>Tipo de servicio:</strong>
    ${turno.tipoServicio || "No especificado"}
</p>

                    <p>
                        <strong>Motivo:</strong>
                        ${turno.motivo}
                    </p>

                    <p>
    <strong>Estado:</strong>

    <span class="estado-turno ${
    turno.estado === "Pendiente"
    ? "estado-pendiente"
    : turno.estado === "Confirmado"
    ? "estado-confirmado"
    : turno.estado === "Atendido"
    ? "estado-atendido"
    : "estado-cancelado"
    }">
        ${turno.estado}
    </span>
</p>
                    <button
    class="admin-button"
    onclick="confirmarTurno(${turno.id})"
>
    ✅ Confirmar turno
</button>
<button
    class="admin-button"
    onclick="atenderTurno(${turno.id})"
>
    🔧 Marcar como atendido
</button>
<button
    class="admin-button"
    onclick="cancelarTurno(${turno.id})"
>
    ❌ Cancelar turno
</button>
<button
    class="admin-button"
    onclick="eliminarTurno(${turno.id})"
>
    🗑️ Eliminar turno
</button>

                </div>

            `;

        });

    }

    adminBox.innerHTML = `

        <div class="admin-logo">
            PAG
        </div>

        <h2>📅 Turnos del taller</h2>

        <p class="admin-description">
            Desde acá podés registrar y consultar los turnos de los clientes.
        </p>

        <div class="orden-admin">

            <h3>➕ Nuevo turno</h3>

            <label>Nombre y apellido</label>
            <input
                type="text"
                id="turnoCliente"
                placeholder="Ej: Juan Pérez"
            >

            <label>Teléfono</label>
            <input
                type="text"
                id="turnoTelefono"
                placeholder="Ej: 11 1234-5678"
            >

            <label>Vehículo</label>
            <input
                type="text"
                id="turnoVehiculo"
                placeholder="Ej: Volkswagen Virtus"
            >

            <label>Patente</label>
            <input
                type="text"
                id="turnoPatente"
                placeholder="Ej: AB 123 CD"
            >

            <label>Fecha</label>
            <input
                type="date"
                id="turnoFecha"
            >

            <label>Horario</label>
            <input
                type="time"
                id="turnoHora"
            >
            <label>Tipo de servicio</label>

<select id="turnoTipoServicio">

    <option value="">
        Seleccioná un servicio
    </option>

    <option value="Mantenimiento general">
        🔧 Mantenimiento general
    </option>

    <option value="Frenos y suspensión">
        🚗 Frenos y suspensión
    </option>

    <option value="Embrague y transmisión">
        ⚙️ Embrague y transmisión
    </option>

    <option value="Electricidad">
        🔌 Electricidad
    </option>

    <option value="Diagnóstico">
        🔍 Diagnóstico
    </option>

    <option value="Distribución">
        🛠️ Distribución
    </option>

    <option value="Otro">
        📋 Otro
    </option>

</select>

            <label>Motivo de la consulta</label>
            <textarea
                id="turnoMotivo"
                placeholder="Ej: Cambio de aceite y revisión general"
            ></textarea>

            <button
                class="admin-button"
                onclick="guardarTurno()"
            >
                💾 Guardar turno
            </button>

        </div>

        <h2>📋 Turnos registrados</h2>

<input
    type="text"
    id="buscarTurno"
    placeholder="🔎 Buscar cliente, patente, vehículo o teléfono"
    oninput="filtrarTurnos()"
>

<div id="listaTurnos">
    ${listaTurnos}
</div>

        <button
            class="admin-button"
            onclick="location.reload()"
        >
            ← Volver al panel
        </button>

    `;
}
function guardarTurno() {

    const cliente = document.getElementById("turnoCliente").value.trim();
    const telefono = document.getElementById("turnoTelefono").value.trim();
    const vehiculo = document.getElementById("turnoVehiculo").value.trim();
    const patente = document.getElementById("turnoPatente").value.trim();
    const fecha = document.getElementById("turnoFecha").value;
    const hora = document.getElementById("turnoHora").value;
    const motivo = document.getElementById("turnoMotivo").value.trim();
    const tipoServicio = document.getElementById("turnoTipoServicio").value;
    

    if (
        cliente === "" ||
        telefono === "" ||
        vehiculo === "" ||
        patente === "" ||
        fecha === "" ||
        hora === "" ||
        motivo === ""
    ) {
        alert("Por favor completá todos los campos.");
        return;
    }

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const nuevoTurno = {

        id: Date.now(),

        cliente: cliente,
        telefono: telefono,
        vehiculo: vehiculo,
        patente: patente,
        fecha: fecha,
        hora: hora,
        motivo: motivo,
        tipoServicio: tipoServicio,

        estado: "Pendiente"
    };

    turnos.push(nuevoTurno);

    localStorage.setItem(
        "turnosPAG",
        JSON.stringify(turnos)
    );

    alert("✅ Turno guardado correctamente.");

    mostrarTurnos();
}
function confirmarTurno(id) {

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        alert("No se encontró el turno.");
        return;
    }

    turno.estado = "Confirmado";

    localStorage.setItem(
        "turnosPAG",
        JSON.stringify(turnos)
    );

    alert("✅ Turno confirmado correctamente.");

    mostrarTurnos();
}
function cancelarTurno(id) {

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        alert("No se encontró el turno.");
        return;
    }

    turno.estado = "Cancelado";

    localStorage.setItem(
        "turnosPAG",
        JSON.stringify(turnos)
    );

    alert("❌ Turno cancelado.");

    mostrarTurnos();
}
function eliminarTurno(id) {

    const confirmar = confirm(
        "¿Seguro que querés eliminar este turno?"
    );

    if (!confirmar) {
        return;
    }

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const nuevosTurnos =
        turnos.filter(turno => turno.id !== id);

    localStorage.setItem(
        "turnosPAG",
        JSON.stringify(nuevosTurnos)
    );

    alert("🗑️ Turno eliminado correctamente.");

    mostrarTurnos();
}
function filtrarTurnos() {

    const buscador = document.getElementById("buscarTurno");
    const lista = document.getElementById("listaTurnos");

    if (!buscador || !lista) {
        return;
    }

    const texto = buscador.value.trim().toLowerCase();

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const resultados = turnos.filter(turno => {

        return (
            String(turno.cliente || "").toLowerCase().includes(texto) ||
            String(turno.telefono || "").toLowerCase().includes(texto) ||
            String(turno.vehiculo || "").toLowerCase().includes(texto) ||
            String(turno.patente || "").toLowerCase().includes(texto) ||
            String(turno.tipoServicio || "").toLowerCase().includes(texto)
        );

    });

    if (resultados.length === 0) {

        lista.innerHTML = `
            <p class="admin-description">
                📭 No se encontraron turnos.
            </p>
        `;

        return;
    }

    let contenido = "";

    resultados.forEach(turno => {

        contenido += `

            <div class="orden-admin">

                <h3>
                    📅 ${turno.fecha.split("-").reverse().join("/")}
                    — ${turno.hora}
                </h3>

                <p>
                    <strong>Cliente:</strong>
                    ${turno.cliente}
                </p>

                <p>
                    <strong>Teléfono:</strong>
                    ${turno.telefono}
                </p>

                <p>
                    <strong>Vehículo:</strong>
                    ${turno.vehiculo}
                </p>

                <p>
                    <strong>Patente:</strong>
                    ${turno.patente}
                </p>
                <p>
    <strong>Tipo de servicio:</strong>
    ${turno.tipoServicio || "No especificado"}
</p>

                <p>
                    <strong>Motivo:</strong>
                    ${turno.motivo}
                </p>

                <p>
                    <strong>Estado:</strong>
                    ${turno.estado}
                </p>

            </div>

        `;
    });

    lista.innerHTML = contenido;
}
function atenderTurno(id) {

    const turnos =
        JSON.parse(localStorage.getItem("turnosPAG")) || [];

    const turno = turnos.find(t => t.id === id);

    if (!turno) {
        alert("No se encontró el turno.");
        return;
    }

    turno.estado = "Atendido";

    localStorage.setItem(
        "turnosPAG",
        JSON.stringify(turnos)
    );

    alert("🔧 Turno marcado como atendido.");

    mostrarTurnos();
}