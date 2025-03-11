let paginaActual = 1; // Variable para rastrear la página actual de la API
const limite = 20; // Cantidad de personajes que se cargarán por página

// Función para obtener los personajes de la API
async function obtenerPersonajes() {
    const url = `https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${limite}`;

    try {
        // Hacemos la petición a la API con fetch (solicitud HTTP GET por defecto)
        const respuesta = await fetch(url); 
        
        // Verificamos si la respuesta es exitosa (código HTTP 200-299)
        if (!respuesta.ok) throw new Error("Error al obtener los personajes");

        // Convertimos la respuesta en formato JSON para poder usar los datos
        const datos = await respuesta.json(); 
        
        // Llamamos a la función para mostrar los personajes en el HTML
        mostrarPersonajes(datos.items); 

        // Si la API no tiene más páginas, ocultamos el botón "Cargar más"
        if (!datos.links || !datos.links.next) {
            document.getElementById("cargar-mas").style.display = "none";
        }
    } catch (error) {
        console.error(error); // Muestra el error en la consola si ocurre un problema
    }
}

// Función para mostrar los personajes en la página con fondo en cada tarjeta
function mostrarPersonajes(personajes) {
    let contenedor = document.getElementById("caracteres"); // Contenedor principal donde se insertarán los personajes

    personajes.forEach(personaje => {
        // Creamos un nuevo <div> para contener la información de cada personaje
        let div = document.createElement('div');
        div.className = "personaje"; // Asignamos una clase para los estilos CSS

        // Agregamos el fondo a la tarjeta
        div.style.backgroundImage = 'url("img/Dragon ball Super.jfif")';
        div.style.backgroundSize = 'cover';         // La imagen cubrirá toda la tarjeta
        div.style.backgroundRepeat = 'no-repeat';     // Evita que se repita la imagen
        div.style.backgroundPosition = 'center center'; // Centra la imagen en la tarjeta

        // Imagen del personaje
        let img = document.createElement('img');
        img.src = personaje.image; // URL de la imagen desde la API
        img.alt = personaje.name;  // Texto alternativo para accesibilidad

        // Nombre del personaje
        let nombre = document.createElement('p');
        nombre.textContent = `Nombre: ${personaje.name}`;

        // Raza del personaje
        let raza = document.createElement('p');
        raza.textContent = `Raza: ${personaje.race || "Desconocida"}`;

        // Género del personaje
        let genero = document.createElement('p');
        genero.textContent = `Género: ${personaje.gender || "No especificado"}`;

        // Poder del personaje
        let poder = document.createElement('p');
        poder.textContent = `Poder: ${personaje.ki || "Desconocido"}`;

        // Afiliación del personaje
        let afiliacion = document.createElement('p');
        afiliacion.textContent = `Afiliación: ${personaje.affiliation || "Ninguna"}`;

        // Agregamos un evento para que al hacer clic se muestren los detalles del personaje
        div.onclick = () => obtenerDetallesPersonaje(personaje.id);

        // Agregamos los elementos creados al div contenedor
        div.appendChild(img);
        div.appendChild(nombre);
        div.appendChild(raza);
        div.appendChild(genero);
        div.appendChild(poder);
        div.appendChild(afiliacion);

        // Agregamos el div del personaje dentro del contenedor principal
        contenedor.appendChild(div);
    });
}


// Función para obtener detalles de un personaje en específico
async function obtenerDetallesPersonaje(id) {
    const url = `https://dragonball-api.com/api/characters/${id}`;

    try {
        // Realizamos la petición a la API para obtener la información del personaje
        const respuesta = await fetch(url); 
        if (!respuesta.ok) throw new Error("Error al obtener el personaje");

        // Convertimos la respuesta a formato JSON
        const personaje = await respuesta.json(); 

        // Llamamos a la función para mostrar el modal con los detalles
        mostrarModal(personaje); 
    } catch (error) {
        console.error(error);
    }
}

function mostrarModal(personaje) {
    // 🏮 Obtiene el modal y el contenedor donde se mostrarán los detalles del personaje
    const modal = document.getElementById("modal");
    const detalles = document.getElementById("detalles-personaje");

    // 🧹 Limpia el contenido anterior del modal para evitar duplicaciones
    detalles.innerHTML = "";

    // 🏷️ Crea y asigna un título con el nombre del personaje
    let titulo = document.createElement("h2");
    titulo.textContent = personaje.name;

    // 🖼️ Crea un contenedor para la imagen del personaje
    let contenedorImagen = document.createElement("div");
    contenedorImagen.className = "imagen-personaje"; 

    let img = document.createElement("img");
    img.src = personaje.image; // Establece la URL de la imagen
    img.alt = personaje.name; // Agrega un texto alternativo en caso de error de carga
    contenedorImagen.appendChild(img); // Agrega la imagen al contenedor

    // ℹ️ Sección con información clave del personaje
    let info = document.createElement("div");
    info.className = "info-personaje"; // Agrega una clase para los estilos CSS

    // 📊 Crea y agrega la información de Ki, Máx Ki, Raza, Género y Afiliación
    let ki = document.createElement("p");
    ki.textContent = `Ki: ${personaje.ki}`;

    let maxKi = document.createElement("p");
    maxKi.textContent = `Máx Ki: ${personaje.maxKi}`;

    let raza = document.createElement("p");
    raza.textContent = `Raza: ${personaje.race}`;

    let genero = document.createElement("p");
    genero.textContent = `Género: ${personaje.gender}`;

    let afiliacion = document.createElement("p");
    afiliacion.textContent = `Afiliación: ${personaje.affiliation || "Desconocida"}`;

    // 📌 Agrega cada elemento al contenedor de información
    info.appendChild(ki);
    info.appendChild(maxKi);
    info.appendChild(raza);
    info.appendChild(genero);
    info.appendChild(afiliacion);

    // 📜 Crea la descripción del personaje
    let descripcion = document.createElement("p");
    descripcion.textContent = personaje.description || "Sin descripción disponible";

    // 🌍 Sección para mostrar el planeta de origen si está disponible
    let contenedorPlaneta = document.createElement("div");
    contenedorPlaneta.classList.add("contenedor-planeta");

    if (personaje.originPlanet) {
        let tituloPlaneta = document.createElement("h3");
        tituloPlaneta.textContent = "Planeta de Origen:";

        // 🪐 Imagen del planeta
        let imgPlaneta = document.createElement("img");
        imgPlaneta.src = personaje.originPlanet.image;
        imgPlaneta.alt = personaje.originPlanet.name;
        imgPlaneta.width = 120; // Define un tamaño estándar

        // 📖 Información del planeta
        let infoPlaneta = document.createElement("p");
        let nombrePlaneta = document.createElement("strong");
        nombrePlaneta.textContent = personaje.originPlanet.name;

        // Agrega el nombre del planeta y su descripción
        infoPlaneta.appendChild(nombrePlaneta);
        infoPlaneta.appendChild(document.createTextNode(` - ${personaje.originPlanet.description}`));

        // Agrega los elementos al contenedor del planeta
        contenedorPlaneta.appendChild(tituloPlaneta);
        contenedorPlaneta.appendChild(imgPlaneta);
        contenedorPlaneta.appendChild(infoPlaneta);
    }

    // 🏗️ Agrega todos los elementos creados al contenedor de detalles antes de las transformaciones
    detalles.appendChild(titulo);
    detalles.appendChild(contenedorImagen);
    detalles.appendChild(info);
    detalles.appendChild(descripcion);
    if (personaje.originPlanet) detalles.appendChild(contenedorPlaneta); // Solo se agrega si existe información del planeta

    // ⚡ Sección para mostrar las transformaciones (ubicada al final)
    if (personaje.transformations && personaje.transformations.length > 0) {
        let contenedorTrans = document.createElement("div");
        contenedorTrans.classList.add("contenedor-transformaciones");

        let tituloTrans = document.createElement("h3");
        tituloTrans.textContent = "Transformaciones:";
        contenedorTrans.appendChild(tituloTrans);

        // 🔄 Itera sobre cada transformación y la agrega al modal
        personaje.transformations.forEach(trans => {
            let divTrans = document.createElement("div");
            divTrans.classList.add("transformacion");

            let imgTrans = document.createElement("img");
            imgTrans.src = trans.image;
            imgTrans.width = 80; // Define un tamaño estándar para las imágenes
            imgTrans.alt = trans.name;

            let textoTrans = document.createElement("p");
            textoTrans.textContent = `${trans.name} (Ki: ${trans.ki})`;

            // Agrega la imagen y el texto al contenedor de la transformación
            divTrans.appendChild(imgTrans);
            divTrans.appendChild(textoTrans);
            contenedorTrans.appendChild(divTrans);
        });

        detalles.appendChild(contenedorTrans); // Agrega todas las transformaciones al final del modal
    };

    // Activa el modal para que sea visible en la pantalla
    modal.classList.add("activo");
    document.body.classList.add("modal-abierto"); // Evita que el fondo se desplace mientras el modal está abierto
};

// Función para cerrar el modal
function cerrarModal() {
    document.getElementById("modal").classList.remove("activo"); // Ocultamos el modal
    document.body.classList.remove("modal-abierto"); // Permitimos nuevamente el desplazamiento de la página
};

// Evento para cargar más personajes cuando se presiona el botón "Cargar más"
document.getElementById("cargar-mas").addEventListener("click", () => {
    paginaActual++; // Aumentamos el número de la página
    obtenerPersonajes(); // Llamamos a la función para obtener más personajes
});

// Evento para cerrar el modal si el usuario hace clic fuera de él
window.onclick = function(evento) {
    const modal = document.getElementById("modal");
    if (evento.target === modal) {
        cerrarModal();
    };
};

// Llamamos a la función para cargar los personajes cuando la página se carga por primera vez
obtenerPersonajes();