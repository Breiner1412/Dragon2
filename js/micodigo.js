let paginaActual = 1; // Variable que rastrea la página actual en la API
const limite = 20; // Cantidad de personajes que se mostrarán por página
//Referencias a elementos del DOM para evitar llamarlos varias veces
const contenedor = document.getElementById("caracteres");
const modal = document.getElementById("modal");
const detalles = document.getElementById("detalles-personaje");
//Función auxiliar para crear elementos de forma rápida y reutilizable
const crearElemento = (tipo, atributos = {}, contenido = "") => {
    let elemento = document.createElement(tipo); // Crea el elemento HTML del tipo especificado
    Object.assign(elemento, atributos); // Asigna los atributos proporcionados
    if (contenido) elemento.textContent = contenido; // Agrega contenido de texto si es necesario
    return elemento;
};
//Función para obtener personajes de la API
async function obtenerPersonajes() {
    try {
        const url = `https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${limite}`;
        const respuesta = await fetch(url); // Realiza la solicitud a la API
        if (!respuesta.ok) throw new Error("Error al obtener los personajes"); // Maneja errores en la solicitud
        const { items, links } = await respuesta.json(); // Convierte la respuesta a JSON
        mostrarPersonajes(items); // Llama a la función para mostrar los personajes en la página
        // Si no hay más páginas disponibles, oculta el botón "Cargar más"
        if (!links?.next) document.getElementById("cargar-mas").style.display = "none";
    } catch (error) {
        console.error(error); // Captura y muestra errores en la consola
    };
};
// Función para mostrar los personajes en la página
function mostrarPersonajes(personajes) {
    personajes.forEach(personaje => {
        //Crea un contenedor para el personaje
        let div = crearElemento("div", { className: "personaje", onclick: () => obtenerDetallesPersonaje(personaje.id) });
        //Agrega imagen de fondo a la tarjeta del personaje
        div.style.background = `url("img/Fondo.jfif") center/cover no-repeat`;
        //Imagen del personaje
        let img = crearElemento("img", { src: personaje.image, alt: personaje.name });
        //Información del personaje
        let info = [
            crearElemento("p", {}, `Nombre: ${personaje.name}`),
            crearElemento("p", {}, `Raza: ${personaje.race || "Desconocida"}`),
            crearElemento("p", {}, `Género: ${personaje.gender || "No especificado"}`),
            crearElemento("p", {}, `Poder: ${personaje.ki || "Desconocido"}`),
            crearElemento("p", {}, `Afiliación: ${personaje.affiliation || "Ninguna"}`)
        ];
        //Agrega los elementos al div y lo inserta en la página
        div.append(img, ...info);
        contenedor.appendChild(div);
    });
};
// Función para obtener detalles de un personaje específico
async function obtenerDetallesPersonaje(id) {
    try {
        const respuesta = await fetch(`https://dragonball-api.com/api/characters/${id}`); // Solicita información de un solo personaje
        if (!respuesta.ok) throw new Error("Error al obtener el personaje");
        mostrarModal(await respuesta.json()); // Muestra la información en el modal
    } catch (error) {
        console.error(error);
    };
};

//Función para mostrar los detalles de un personaje en un modal
function mostrarModal(personaje) {
    detalles.innerHTML = ""; // 🧹 Limpia el contenido anterior del modal
    //Nombre del personaje
    let titulo = crearElemento("h2", {}, personaje.name);
    // Imagen del personaje
    let img = crearElemento("img", { src: personaje.image, alt: personaje.name });
    let contenedorImagen = crearElemento("div", { className: "imagen-personaje" });
    contenedorImagen.appendChild(img);
    //Información general del personaje
    let infoContainer = crearElemento("div", { className: "info-personaje" });
    let info = [
        crearElemento("p", {}, `Ki: ${personaje.ki}`),
        crearElemento("p", {}, `Máx Ki: ${personaje.maxKi}`),
        crearElemento("p", {}, `Raza: ${personaje.race}`),
        crearElemento("p", {}, `Género: ${personaje.gender}`),
        crearElemento("p", {}, `Afiliación: ${personaje.affiliation || "Desconocida"}`)
    ];
    infoContainer.append(...info);
    //Agrega los elementos al modal
    detalles.append(titulo, contenedorImagen, infoContainer);
    //Sección de Planeta de Origen (solo si existe información)
    if (personaje.originPlanet) {
        let planeta = crearElemento("div", { className: "contenedor-planeta" });
        let tituloPlaneta = crearElemento("h3", {}, "Planeta de Origen:");
        let imgPlaneta = crearElemento("img", { src: personaje.originPlanet.image, alt: personaje.originPlanet.name, width: 120 });
        let descPlaneta = crearElemento("p", {}, `${personaje.originPlanet.name} - ${personaje.originPlanet.description}`);
        planeta.append(tituloPlaneta, imgPlaneta, descPlaneta);
        detalles.appendChild(planeta);
    };
    //Sección de Transformaciones (se agregan al final del modal)
    if (personaje.transformations?.length) {
        let contenedorTrans = crearElemento("div", { className: "contenedor-transformaciones" });
        let tituloTrans = crearElemento("h3", {}, "Transformaciones:");
        personaje.transformations.forEach(trans => {
            let divTrans = crearElemento("div", { className: "transformacion" });
            let imgTrans = crearElemento("img", { src: trans.image, width: 80, alt: trans.name });
            let textoTrans = crearElemento("p", {}, `${trans.name} (Ki: ${trans.ki})`);
            divTrans.append(imgTrans, textoTrans);
            contenedorTrans.appendChild(divTrans);
        });
        detalles.appendChild(contenedorTrans);
    };
    //Activa el modal en la pantalla
    modal.classList.add("activo");
    document.body.classList.add("modal-abierto");
};
//Función para cerrar el modal
function cerrarModal() {
    modal.classList.remove("activo"); // Oculta el modal
    document.body.classList.remove("modal-abierto"); // Restaura el desplazamiento en la página
};

//Evento para cargar más personajes cuando se presiona el botón "Cargar más"
document.getElementById("cargar-mas").addEventListener("click", () => {
    paginaActual++; // Aumenta el número de la página
    obtenerPersonajes(); // Llama a la función para obtener más personajes
});

//Evento para cerrar el modal si el usuario hace clic fuera de él
window.onclick = evento => {
    if (evento.target === modal) cerrarModal();
};
//Llamamos a la función para cargar los personajes cuando la página se carga por primera vez
obtenerPersonajes();