```javascript
// ==========================================
// PRECISION AUTOMOTRIZ GROUP
// SISTEMA DE SEGUIMIENTO DE VEHÍCULOS
// ==========================================

// Órdenes de demostración.
// Podés conservarlas para realizar pruebas.

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
        foto: "",
        fechaIngreso: "30/09/2026",
        fechaEntrega: "02/10/2026",
        estado: "En diagnóstico",
        trabajo: "Diagnóstico general",
        observaciones: "Esperando resultado del diagnóstico."
    }
};


// ==========================================
// FUNCIONES DE SEGURIDAD Y FORMATO
// ==========================================

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caracter]);
}

function obtenerTexto(valor, alternativa = "No informado") {
    return escaparHTML(valor || alternativa);
}


// ==========================================
// CONECTAR FORMULARIO DE SEGUIMIENTO
// ==========================================

const formularioSeguimiento = document.getElementById("formularioSeguimiento");
const boton = document.getElementById("botonConsulta");
const campo = document.getElementById("codigoOrden");

if (formularioSeguimiento && boton && campo) {
    formularioSeguimiento.addEventListener("submit", function(evento) {
        evento.preventDefault();
        consultarVehiculo();
    });
}


// ==========================================
// BUSCAR VEHÍCULO
// ==========================================

function consultarVehiculo() {
    const codigo = (campo?.value || "").trim().toUpperCase();

    if (!codigo) {
        mostrarResultado(`
            <div class="resultado error">
                <h3>⚠️ Ingresá el código</h3>
                <p>Escribí el código de tu orden de trabajo para continuar.</p>
            </div>
        `);
        campo?.focus();
        return;
    }

    let vehiculo = vehiculos[codigo];

    // Buscar también las órdenes guardadas en este navegador.
    if (!vehiculo) {
        try {
            const ordenes = JSON.parse(
                localStorage.getItem("ordenesPAG") || "{}"
            );

            vehiculo = ordenes[codigo];
        } catch (error) {
            console.error("No se pudieron leer las órdenes locales:", error);
        }
    }

    if (!vehiculo) {
        mostrarResultado(`
            <div class="resultado error">
                <h3>❌ Orden no encontrada</h3>
                <p>El código ingresado no corresponde a una orden disponible.</p>
                <p>Revisá que esté escrito correctamente.</p>
                <p>Si el problema continúa, comunicate con el taller.</p>
            </div>
        `);
        return;
    }

    mostrarFichaVehiculo(codigo, vehiculo);
}


// ==========================================
// MOSTRAR FICHA DEL VEHÍCULO
// ==========================================

function mostrarFichaVehiculo(codigo, vehiculo) {
    const estado = String(vehiculo.estado || "En recepción").toLowerCase();

    const pasos = [
        { nombre: "Recepción", palabras: ["recepción", "recepcion"] },
        { nombre: "Diagnóstico", palabras: ["diagnóstico", "diagnostico"] },
        { nombre: "Reparación", palabras: ["reparación", "reparacion", "esperando repuestos"] },
        { nombre: "Listo", palabras: ["listo"] },
        { nombre: "Entregado", palabras: ["entregado"] }
    ];

    let pasoActual = 0;

    if (estado.includes("diagnóstico") || estado.includes("diagnostico")) {
        pasoActual = 1;
    } else if (estado.includes("reparación") ||
               estado.includes("reparacion") ||
               estado.includes("repuestos")) {
        pasoActual = 2;
    } else if (estado.includes("listo")) {
        pasoActual = 3;
    } else if (estado.includes("entregado")) {
        pasoActual = 4;
    }

    const progreso = pasos.map((paso, indice) => `
        <div class="paso ${indice <= pasoActual ? "activo" : ""}">
            <span>${indice + 1}</span>
            <small>${paso.nombre}</small>
        </div>
        ${indice < pasos.length - 1 ? '<div class="linea"></div>' : ""}
    `).join("");

    let mensajeEstado = "📋 Tu vehículo se encuentra en proceso de atención.";

    if (estado.includes("diagnóstico") || estado.includes("diagnostico")) {
        mensajeEstado = "🔍 Estamos revisando tu vehículo y realizando el diagnóstico correspondiente.";
    } else if (estado.includes("repuestos")) {
        mensajeEstado = "📦 Estamos esperando los repuestos necesarios para continuar con el trabajo.";
    } else if (estado.includes("reparación") || estado.includes("reparacion")) {
        mensajeEstado = "🔧 Nuestro equipo está trabajando en tu vehículo.";
    } else if (estado.includes("listo")) {
        mensajeEstado = "✅ Tu vehículo está listo para retirar. Comunicate con el taller para coordinar.";
    } else if (estado.includes("entregado")) {
        mensajeEstado = "🚗 Tu vehículo figura como entregado.";
    } else if (estado.includes("recepción") || estado.includes("recepcion")) {
        mensajeEstado = "📋 Registramos el ingreso de tu vehículo.";
    }

    const fotoHTML = vehiculo.foto
        ? `
            <h4 class="titulo-seccion">📸 Fotos del vehículo</h4>
            <img
                src="${escaparHTML(vehiculo.foto)}"
                alt="Foto del vehículo"
                class="foto-vehiculo"
                loading="lazy"
                onerror="this.style.display='none'"
            >
        `
        : "";

    mostrarResultado(`
        <div class="resultado">
            <h3>🚗 Seguimiento del vehículo</h3>

            <div class="ficha-cabecera">
                <span>ORDEN DE TRABAJO</span>
                <strong>${escaparHTML(codigo)}</strong>
            </div>

            <h4 class="titulo-seccion">🚗 Datos del vehículo</h4>

            <p><strong>Cliente:</strong> ${obtenerTexto(vehiculo.cliente)}</p>
            <p><strong>Vehículo:</strong> ${obtenerTexto(vehiculo.vehiculo)}</p>
            <p><strong>Patente:</strong> ${obtenerTexto(vehiculo.patente)}</p>
            <p><strong>Kilometraje de ingreso:</strong> ${obtenerTexto(vehiculo.kilometrajeIngreso)}</p>
            <p><strong>Kilometraje de salida:</strong> ${obtenerTexto(vehiculo.kilometrajeSalida)}</p>

            <h4 class="titulo-seccion">🔧 Progreso del trabajo</h4>

            <div class="progreso-vehiculo">
                ${progreso}
            </div>

            <p>
                <strong>Estado actual:</strong>
                <span class="estado-vehiculo">${escaparHTML(String(vehiculo.estado || "En recepción").toUpperCase())}</span>
            </p>

            <div class="mensaje-estado">
                ${escaparHTML(mensajeEstado)}
            </div>

            <p><strong>Trabajo a realizar o realizado:</strong> ${obtenerTexto(vehiculo.trabajo)}</p>
            <p><strong>Fecha de ingreso:</strong> ${obtenerTexto(vehiculo.fechaIngreso)}</p>
            <p><strong>Fecha estimada de entrega:</strong> ${obtenerTexto(vehiculo.fechaEntrega, "A confirmar")}</p>

            <h4 class="titulo-seccion">📝 Observaciones</h4>
            <p>${obtenerTexto(vehiculo.observaciones)}</p>

            ${fotoHTML}
        </div>
    `);
}


// ==========================================
// MOSTRAR RESULTADOS
// ==========================================

function mostrarResultado(contenido) {
    let resultado = document.getElementById("resultadoSeguimiento");

    // Compatibilidad por si otra página todavía utiliza el ID anterior.
    if (!resultado) {
        resultado = document.getElementById("resultado");
    }

    if (!resultado && campo) {
        resultado = document.createElement("div");
        resultado.id = "resultadoSeguimiento";
        campo.insertAdjacentElement("afterend", resultado);
    }

    if (resultado) {
        resultado.innerHTML = contenido;
    }
}
```
