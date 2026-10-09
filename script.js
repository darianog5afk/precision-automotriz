```javascript
// ==========================================
// CONFIGURACIÓN DE SUPABASE
// ==========================================

const PAG_SUPABASE_URL = "https://wzekdvkwdivzuujnvcnj.supabase.co";
const PAG_SUPABASE_KEY = "sb_publishable_5y6uaC69wKM0WlNYRSfPyQ_RpeCSKJh";

let pagSupabase = null;

if (window.supabase && window.supabase.createClient) {
    pagSupabase = window.supabase.createClient(
        PAG_SUPABASE_URL,
        PAG_SUPABASE_KEY
    );
}


// ==========================================
// DATOS DE LOS VEHÍCULOS DE PRUEBA
// ==========================================

const vehiculos = {
    "PAG-00125": {
        cliente: "Cliente de prueba",
        vehiculo: "Volkswagen Virtus",
        patente: "AB 123 CD",
        kilometrajeIngreso: "85.420 km",
        kilometrajeSalida: "Pendiente",
        foto: "fotos/PAG-00125/auto.jpg",
        fechaIngreso: "30/09/2026",
        fechaEntrega: "A confirmar",
        estado: "En reparación",
        trabajo: "Reparación y mantenimiento",
        observaciones: "Vehículo actualmente en el taller."
    },

    "PAG-00126": {
        cliente: "Otro cliente",
        vehiculo: "Volkswagen Amarok",
        patente: "AC 456 EF",
        kilometrajeIngreso: "124.650 km",
        kilometrajeSalida: "Pendiente",
        fechaIngreso: "30/09/2026",
        fechaEntrega: "02/10/2026",
        estado: "En diagnóstico",
        trabajo: "Diagnóstico general",
        observaciones: "Esperando resultado del diagnóstico."
    }
};


// ==========================================
// INICIAR SEGUIMIENTO
// ==========================================

const formularioSeguimiento = document.getElementById("formularioSeguimiento");
const campo = document.getElementById("codigoOrden");

if (formularioSeguimiento && campo) {
    formularioSeguimiento.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const codigo = campo.value.trim().toUpperCase();

        if (!codigo) {
            alert("Ingresá el código de tu orden o turno.");
            return;
        }

        const boton = document.getElementById("botonConsulta");
        if (boton) {
            boton.disabled = true;
            boton.textContent = "Consultando...";
        }

        try {
            // Primero: consultar órdenes de reparación existentes.
            if (!codigo.startsWith("PAG-T-")) {
                let vehiculo = vehiculos[codigo];

                if (!vehiculo) {
                    const ordenes = JSON.parse(
                        localStorage.getItem("ordenesPAG") || "{}"
                    );
                    vehiculo = ordenes[codigo];
                }

                if (vehiculo) {
                    mostrarOrdenVehiculo(codigo, vehiculo);
                    return;
                }

                mostrarResultado(`
                    <div class="resultado error">
                        <h3>❌ Orden no encontrada</h3>
                        <p>El código ingresado no corresponde a una orden registrada.</p>
                        <p>Revisá el código e intentá nuevamente.</p>
                    </div>
                `);
                return;
            }

            // Segundo: los turnos requieren el teléfono registrado.
            const telefonoAnterior = document.getElementById("telefonoSeguimiento");

            if (!telefonoAnterior) {
                mostrarResultado(`
                    <div class="resultado">
                        <h3>📅 Consultar solicitud de turno</h3>
                        <p>Para proteger tus datos, ingresá también el teléfono que usaste al solicitar el turno.</p>
                        <label for="telefonoSeguimiento"><strong>Teléfono registrado</strong></label>
                        <input
                            type="tel"
                            id="telefonoSeguimiento"
                            placeholder="Ej.: 11 4091-5051"
                            autocomplete="tel"
                            required
                        >
                        <button type="button" class="btn btn-primary" id="consultarTurno">
                            Consultar turno
                        </button>
                    </div>
                `);

                document.getElementById("consultarTurno").addEventListener("click", function () {
                    consultarTurnoSupabase(codigo);
                });
                return;
            }

            await consultarTurnoSupabase(codigo);

        } catch (error) {
            console.error("Error en seguimiento:", error);
            mostrarResultado(`
                <div class="resultado error">
                    <h3>⚠️ No pudimos realizar la consulta</h3>
                    <p>Intentá nuevamente dentro de unos minutos.</p>
                </div>
            `);
        } finally {
            if (boton) {
                boton.disabled = false;
                boton.textContent = "Consultar";
            }
        }
    });
}


// ==========================================
// CONSULTAR TURNO EN SUPABASE
// ==========================================

async function consultarTurnoSupabase(codigo) {
    const telefonoCampo = document.getElementById("telefonoSeguimiento");
    const telefono = telefonoCampo ? telefonoCampo.value.trim() : "";

    if (!telefono) {
        alert("Ingresá el teléfono registrado en la solicitud.");
        return;
    }

    if (!pagSupabase) {
        mostrarResultado(`
            <div class="resultado error">
                <h3>⚠️ Servicio no disponible</h3>
                <p>No se pudo conectar con el sistema de turnos. Actualizá la página e intentá nuevamente.</p>
            </div>
        `);
        return;
    }

    const botonTurno = document.getElementById("consultarTurno");
    if (botonTurno) {
        botonTurno.disabled = true;
        botonTurno.textContent = "Consultando...";
    }

    try {
        const { data, error } = await pagSupabase.rpc(
            "consultar_estado_turno",
            {
                p_codigo: codigo,
                p_telefono: telefono
            }
        );

        if (error) {
            console.error("Error al consultar turno:", error);
            mostrarResultado(`
                <div class="resultado error">
                    <h3>⚠️ No pudimos consultar el turno</h3>
                    <p>Intentá nuevamente. Si el problema continúa, contactá al taller.</p>
                </div>
            `);
            return;
        }

        if (!data || data.length === 0) {
            mostrarResultado(`
                <div class="resultado error">
                    <h3>❌ No encontramos la solicitud</h3>
                    <p>El código o el teléfono no coinciden con una solicitud registrada.</p>
                    <p>Revisá los datos e intentá nuevamente.</p>
                </div>
            `);
            return;
        }

        const turno = data[0];

        mostrarResultado(`
            <div class="resultado">
                <h3>📅 Seguimiento de tu turno</h3>

                <div class="ficha-cabecera">
                    <span>CÓDIGO DE SOLICITUD</span>
                    <strong>${escaparHTML(codigo)}</strong>
                </div>

                <h4 class="titulo-seccion">👤 Datos del cliente</h4>
                <p><strong>Cliente:</strong> ${escaparHTML(turno.nombre)}</p>
                <p><strong>Teléfono:</strong> ${escaparHTML(turno.telefono)}</p>

                <h4 class="titulo-seccion">🚗 Datos del vehículo</h4>
                <p><strong>Vehículo:</strong> ${escaparHTML(turno.vehiculo)}</p>
                <p><strong>Patente:</strong> ${escaparHTML(turno.patente || "No registrada")}</p>

                <h4 class="titulo-seccion">📅 Detalles del turno</h4>
                <p><strong>Fecha:</strong> ${escaparHTML(turno.fecha)}</p>
                <p><strong>Hora:</strong> ${escaparHTML(turno.hora)}</p>
                <p><strong>Servicio:</strong> ${escaparHTML(turno.servicio || "No especificado")}</p>

                <p>
                    <strong>Estado:</strong>
                    <span class="estado-vehiculo">${escaparHTML((turno.estado || "Pendiente").toUpperCase())}</span>
                </p>

                <div class="mensaje-estado">
                    ${mensajeEstadoTurno(turno.estado)}
                </div>
            </div>
        `);

    } catch (error) {
        console.error("Error de conexión:", error);
        mostrarResultado(`
            <div class="resultado error">
                <h3>⚠️ Error de conexión</h3>
                <p>Revisá tu conexión a internet e intentá nuevamente.</p>
            </div>
        `);
    } finally {
        if (botonTurno) {
            botonTurno.disabled = false;
            botonTurno.textContent = "Consultar turno";
        }
    }
}


// ==========================================
// MOSTRAR ORDEN DE REPARACIÓN
// ==========================================

function mostrarOrdenVehiculo(codigo, vehiculo) {
    const estado = String(vehiculo.estado || "Pendiente").toLowerCase();

    const pasos = [
        { texto: "Recepción", activo: true },
        { texto: "Diagnóstico", activo: /diagnóstico|reparación|repuestos|listo|entregado/.test(estado) },
        { texto: "Reparación", activo: /reparación|repuestos|listo|entregado/.test(estado) },
        { texto: "Listo", activo: /listo|entregado/.test(estado) },
        { texto: "Entregado", activo: estado.includes("entregado") }
    ];

    const progreso = pasos.map((paso, indice) => `
        ${indice > 0 ? '<div class="linea"></div>' : ""}
        <div class="paso ${paso.activo ? "activo" : ""}">
            <span>${indice + 1}</span>
            <small>${paso.texto}</small>
        </div>
    `).join("");

    mostrarResultado(`
        <div class="resultado">
            <h3>🚗 Seguimiento del vehículo</h3>

            <div class="ficha-cabecera">
                <span>ORDEN DE TRABAJO</span>
                <strong>${escaparHTML(codigo)}</strong>
            </div>

            <h4 class="titulo-seccion">🚗 Datos del vehículo</h4>
            <p><strong>Cliente:</strong> ${escaparHTML(vehiculo.cliente)}</p>
            <p><strong>Orden:</strong> ${escaparHTML(codigo)}</p>
            <p><strong>Vehículo:</strong> ${escaparHTML(vehiculo.vehiculo)}</p>
            <p><strong>Patente:</strong> ${escaparHTML(vehiculo.patente)}</p>
            <p><strong>Kilometraje de ingreso:</strong> ${escaparHTML(vehiculo.kilometrajeIngreso)}</p>
            <p><strong>Kilometraje de salida:</strong> ${escaparHTML(vehiculo.kilometrajeSalida)}</p>

            <h4 class="titulo-seccion">🔧 Trabajo y estado del vehículo</h4>
            <div class="progreso-vehiculo">${progreso}</div>

            <p>
                <strong>Estado:</strong>
                <span class="estado-vehiculo">${escaparHTML(estado.toUpperCase())}</span>
            </p>

            <div class="mensaje-estado">
                ${mensajeEstadoVehiculo(estado)}
            </div>

            <p><strong>Trabajo realizado:</strong> ${escaparHTML(vehiculo.trabajo)}</p>
            <p><strong>Fecha de ingreso:</strong> ${escaparHTML(vehiculo.fechaIngreso)}</p>
            <p><strong>Fecha estimada de entrega:</strong> ${escaparHTML(vehiculo.fechaEntrega)}</p>

            <h4 class="titulo-seccion">📝 Observaciones</h4>
            <p><strong>Observaciones:</strong> ${escaparHTML(vehiculo.observaciones)}</p>

            <h4 class="titulo-seccion">📸 Fotos del vehículo</h4>
            ${vehiculo.foto ? `<img src="${escaparHTML(vehiculo.foto)}" alt="Foto del vehículo" class="foto-vehiculo">` : ""}
        </div>
    `);
}


// ==========================================
// MENSAJES DE ESTADO
// ==========================================

function mensajeEstadoTurno(estado) {
    const valor = String(estado || "Pendiente").toLowerCase();

    if (valor.includes("confirmado")) {
        return "✅ Tu turno está confirmado. Te esperamos en el taller.";
    }
    if (valor.includes("cancelado")) {
        return "❌ Tu turno fue cancelado. Comunicate con el taller si necesitás coordinar otra fecha.";
    }
    if (valor.includes("atendido")) {
        return "🔧 El turno figura como atendido.";
    }
    return "🟠 Recibimos tu solicitud. El taller todavía debe confirmar el turno.";
}

function mensajeEstadoVehiculo(estado) {
    if (estado.includes("diagnóstico")) {
        return "🔍 Estamos revisando tu vehículo y realizando el diagnóstico correspondiente.";
    }
    if (estado.includes("repuestos")) {
        return "📦 Estamos esperando los repuestos necesarios para continuar con el trabajo.";
    }
    if (estado.includes("reparación")) {
        return "🔧 Nuestro equipo está trabajando en tu vehículo.";
    }
    if (estado.includes("listo")) {
        return "✅ Tu vehículo ya está listo para retirar.";
    }
    if (estado.includes("entregado")) {
        return "🚗 Tu vehículo fue entregado.";
    }
    return "📋 Tu vehículo se encuentra en proceso de atención.";
}


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultado(contenido) {
    let resultado =
        document.getElementById("resultadoSeguimiento") ||
        document.getElementById("resultado");

    if (!resultado) {
        resultado = document.createElement("div");
        resultado.id = "resultadoSeguimiento";

        if (formularioSeguimiento) {
            formularioSeguimiento.insertAdjacentElement("afterend", resultado);
        } else if (campo) {
            campo.insertAdjacentElement("afterend", resultado);
        } else {
            document.body.appendChild(resultado);
        }
    }

    resultado.innerHTML = contenido;
}


// ==========================================
// PROTEGER EL TEXTO MOSTRADO EN PANTALLA
// ==========================================

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[caracter];
    });
}
```
