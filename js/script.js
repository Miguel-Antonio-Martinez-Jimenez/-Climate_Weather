const apiKey = "2e86e29109cb42438a7174534242909"; // Sustituye con tu API key

document.getElementById('btn-buscar').addEventListener('click', function() {
    const ciudad = document.getElementById('input-ciudad').value.trim(); // Trim para eliminar espacios en blanco

    if (!ciudad) {
        mostrarError("Parece que no ingresaste nada. Inténtalo de nuevo.");
        return; // Salir de la función si la ciudad está vacía
    }

    obtenerClima(ciudad);
    obtenerPronostico(ciudad);
});

async function obtenerClima(ciudad) {
    const respuesta = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${ciudad}&lang=es`);
    if (respuesta.ok) {
        const datos = await respuesta.json();
        actualizarUI(datos);
    } else {
        mostrarError("Por favor, asegúrate de ingresar el nombre de una ciudad válida.");
    }
}

async function obtenerPronostico(ciudad) {
    const respuesta = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${ciudad}&days=5&lang=es`);
    if (respuesta.ok) {
        const datos = await respuesta.json();
        mostrarPronostico(datos.forecast.forecastday);
    }
}

function actualizarUI(datos) {
    // Obtener la fecha y crear un objeto Date
    const fecha = new Date(datos.location.localtime);

    // Crear un array con los días de la semana
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Obtener el día de la semana correspondiente
    const diaSemana = diasSemana[fecha.getDay()];

    // Actualizar la UI con los datos del clima
    document.getElementById('ciudad').innerText = `${datos.location.name} - ${diaSemana}`;
    document.getElementById('temperatura').innerText = `${datos.current.temp_c}°C`;
    document.getElementById('descripcion').innerText = datos.current.condition.text;
    document.getElementById('humedad').innerText = `Humedad: ${datos.current.humidity}%`;

    // Asignar el ícono correspondiente basado en la condición del clima
    const condition = datos.current.condition.text.toLowerCase();
    let iconoClima;

    if (condition.includes("nublado")) {
        iconoClima = "cloud";
    } else if (condition.includes("soleado") || condition.includes("despejado")) {
        iconoClima = "sun";
    } else if (condition.includes("lluvia") || condition.includes("chuva")) {
        iconoClima = "cloud-drizzle";
    } else if (condition.includes("tormenta")) {
        iconoClima = "cloud-lightning";
    } else if (condition.includes("niebla") || condition.includes("neblina")) {
        iconoClima = "cloud-fog";
    } else {
        iconoClima = "cloud";
    }

    document.getElementById('icono-clima').className = `bi bi-${iconoClima}`;
}

function mostrarPronostico(forecast) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = ''; // Limpiar pronóstico anterior

    // Contenedor flex-row para los pronósticos
    const pronosticoContainer = document.createElement('div');
    pronosticoContainer.className = 'd-flex justify-content-between'; // Colocar los pronósticos en una fila

    forecast.forEach(day => {
        const iconUrl = day.day.condition.icon; // Obtener el ícono de la API
        
        const dayCard = `
            <div class="card text-center mx-2" style="min-width: 120px; background-color: rgba(255, 255, 255, 0.8);">
                <div class="card-body">
                    <h6 class="card-title">${new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</h6>
                    <img src="${iconUrl}" alt="Icono del clima" style="width: 40px; height: 40px;">
                    <p class="mb-0">Max: ${day.day.maxtemp_c}°C</p>
                    <p class="mb-0">Min: ${day.day.mintemp_c}°C</p>
                    <p class="mb-0">${day.day.condition.text}</p>
                </div>
            </div>
        `;

        pronosticoContainer.innerHTML += dayCard; // Agregar cada tarjeta al contenedor
    });

    forecastDiv.appendChild(pronosticoContainer); // Agregar el contenedor de pronóstico a la UI
}

function mostrarError(mensaje) {
    const modal = new bootstrap.Modal(document.getElementById('modalError'));
    document.getElementById('mensaje-error').innerText = mensaje;
    modal.show();
}