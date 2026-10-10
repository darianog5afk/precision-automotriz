// ==========================================
// DATOS DE LOS VEHÍCULOS
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
// BOTÓN DE CONSULTA
// ==========================================

const boton = document.querySelector(".tracking-box .btn-primary");
const campo = document.getElementById("codigoOrden");

if (boton && campo) {

   boton.addEventListener("click", async function (evento) {
    evento.preventDefault();

        const codigo = campo.value.trim().toUpperCase();
       if (codigo.startsWith("PAG-T-")) {
    const telefono = prompt("Ingresá el teléfono que usaste para solicitar el turno:");

    if (telefono === null || !telefono.trim()) return;

    if (!window.supabase) {
        alert("No se pudo conectar con el sistema. Recargá la página.");
        return;
    }

    const clienteSupabase = window.supabase.createClient(
        "https://wzekdvkwdivzuujnvcnj.supabase.co",
        "sb_publishable_5y6uaC69wKM0WlNYRSfPyQ_RpeCSKJh"
    );

    const { data, error } = await clienteSupabase.rpc(
        "consultar_estado_turno",
        {
            p_codigo: codigo,
            p_telefono: telefono.trim()
        }
    );

    if (error) {
        console.error(error);
        alert("No se pudo consultar el turno. Intentá nuevamente.");
        return;
    }

    if (!data || data.length === 0) {
        alert("No encontramos el turno. Revisá el código y el teléfono.");
        return;
    }

    const turno = data[0];

    mostrarResultado(`
        <div class="resultado">
            <h3>📅 Seguimiento de tu turno</h3>
            <p><strong>Código:</strong> ${codigo}</p>
            <p><strong>Cliente:</strong> ${turno.nombre || ""}</p>
            <p><strong>Teléfono:</strong> ${turno.telefono || ""}</p>
            <p><strong>Vehículo:</strong> ${turno.vehiculo || ""}</p>
            <p><strong>Patente:</strong> ${turno.patente || "No informada"}</p>
            <p><strong>Fecha:</strong> ${turno.fecha || ""}</p>
            <p><strong>Horario:</strong> ${turno.hora || ""}</p>
            <p><strong>Servicio:</strong> ${turno.servicio || "No especificado"}</p>
            <p><strong>Estado:</strong> ${(turno.estado || "Pendiente").toUpperCase()}</p>
        </div>
    `);

    return;
}

        if (codigo === "") {
            alert("Ingresá el código de tu orden.");
            return;
        }

        let vehiculo = vehiculos[codigo];

        if (!vehiculo) {

            const ordenes =
                JSON.parse(localStorage.getItem("ordenesPAG")) || {};

            vehiculo = ordenes[codigo];
        }

        if (vehiculo) {

            mostrarResultado(`

                <div class="resultado">

                    <h3>🚗 Seguimiento del vehículo</h3>

                    <div class="ficha-cabecera">
                        <span>ORDEN DE TRABAJO</span>
                        <strong>${codigo}</strong>
                    </div>

                    <h4 class="titulo-seccion">
                        🚗 Datos del vehículo
                    </h4>

                    <p>
                        <strong>Cliente:</strong>
                        ${vehiculo.cliente}
                    </p>

                    <p>
                        <strong>Orden:</strong>
                        ${codigo}
                    </p>

                    <p>
                        <strong>Vehículo:</strong>
                        ${vehiculo.vehiculo}
                    </p>

                    <p>
                        <strong>Patente:</strong>
                        ${vehiculo.patente}
                    </p>

                    <p>
                        <strong>Kilometraje de ingreso:</strong>
                        ${vehiculo.kilometrajeIngreso}
                    </p>

                    <p>
                        <strong>Kilometraje de salida:</strong>
                        ${vehiculo.kilometrajeSalida}
                    </p>

                    <h4 class="titulo-seccion">
                        🔧 Trabajo y estado del vehículo
                    </h4>
<div class="progreso-vehiculo">

    <div class="paso activo">
        <span>1</span>
        <small>Recepción</small>
    </div>

    <div class="linea"></div>

    <div class="paso activo">
        <span>2</span>
        <small>Diagnóstico</small>
    </div>

    <div class="linea"></div>

    <div class="paso activo">
        <span>3</span>
        <small>Reparación</small>
    </div>

    <div class="linea"></div>

    <div class="paso">
        <span>4</span>
        <small>Listo</small>
    </div>

    <div class="linea"></div>

    <div class="paso">
        <span>5</span>
        <small>Entregado</small>
    </div>

</div>
<script>
    const estadoActual = vehiculo.estado.toLowerCase();

    const pasos = document.querySelectorAll(".progreso-vehiculo .paso");

    pasos.forEach(paso => {
        paso.classList.remove("activo");
    });

    if (estadoActual.includes("recepción")) {
        pasos[0].classList.add("activo");
    }

    if (estadoActual.includes("diagnóstico")) {
        pasos[0].classList.add("activo");
        pasos[1].classList.add("activo");
    }

    if (estadoActual.includes("reparación")) {
        pasos[0].classList.add("activo");
        pasos[1].classList.add("activo");
        pasos[2].classList.add("activo");
    }

    if (estadoActual.includes("listo")) {
        pasos[0].classList.add("activo");
        pasos[1].classList.add("activo");
        pasos[2].classList.add("activo");
        pasos[3].classList.add("activo");
    }

    if (estadoActual.includes("entregado")) {
        pasos.forEach(paso => {
            paso.classList.add("activo");
        });
    }
</script>
                    <p>
                        <strong>Estado:</strong>
                        <span class="estado-vehiculo">
                            ${vehiculo.estado.toUpperCase()}
                        </span>
                    </p>
<div class="mensaje-estado">
    ${
        vehiculo.estado.toLowerCase().includes("diagnóstico")
        ? "🔍 Estamos revisando tu vehículo y realizando el diagnóstico correspondiente."
        : vehiculo.estado.toLowerCase().includes("reparación")
        ? "🔧 Nuestro equipo está trabajando en tu vehículo."
        : vehiculo.estado.toLowerCase().includes("repuestos")
? "📦 Estamos esperando los repuestos necesarios para continuar con el trabajo."
        : vehiculo.estado.toLowerCase().includes("listo")
        ? "✅ Tu vehículo ya está listo para retirar."
        : vehiculo.estado.toLowerCase().includes("entregado")
        ? "🚗 Tu vehículo fue entregado."
        : "📋 Tu vehículo se encuentra en proceso de atención."
    }
</div>
                    <p>
                        <strong>Trabajo realizado:</strong>
                        ${vehiculo.trabajo}
                    </p>

                    <p>
                        <strong>Fecha de ingreso:</strong>
                        ${vehiculo.fechaIngreso}
                    </p>

                    <p>
                        <strong>Fecha estimada de entrega:</strong>
                        ${vehiculo.fechaEntrega}
                    </p>

                    <h4 class="titulo-seccion">
                        📝 Observaciones
                    </h4>

                    <p>
                        <strong>Observaciones:</strong>
                        ${vehiculo.observaciones}
                    </p>

                    <h4 class="titulo-seccion">
                        📸 Fotos del vehículo
                    </h4>

                    ${
                        vehiculo.foto
                        ? `
                            <img
                                src="${vehiculo.foto}"
                                alt="Foto del vehículo"
                                class="foto-vehiculo"
                            >
                        `
                        : ""
                    }

                </div>

            `);

        } else {

            mostrarResultado(`

                <div class="resultado error">

                    <h3>❌ Orden no encontrada</h3>

                    <p>
                        El código ingresado no corresponde
                        a ninguna orden registrada.
                    </p>

                    <p>
                        Revisá el código e intentá nuevamente.
                    </p>

                </div>

            `);

        }

    });

}


// ==========================================
// MOSTRAR RESULTADO
// ==========================================

function mostrarResultado(contenido) {

    let resultado = document.getElementById("resultado");

    if (!resultado) {

        resultado = document.createElement("div");

        resultado.id = "resultado";

        campo.insertAdjacentElement(
            "afterend",
            resultado
        );

    }

    resultado.innerHTML = contenido;

}

