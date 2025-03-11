// Variable global para controlar la página actual y cantidad de cartas por página
let paginaActual = 1;
const limite = 5;
// Referencias a elementos del DOM
const contenedor = document.getElementById("caracteres");
const paginationContainer = document.getElementById("pagination");
const modal = document.getElementById("modal");
const detalles = document.getElementById("detalles-personaje");
/**
 * Función auxiliar para crear elementos HTML.
 * @param {string} tipo - Tipo de elemento a crear (ej. "div", "p", "img").
 * @param {object} atributos - Objeto con atributos a asignar al elemento.
 * @param {string} contenido - Texto que se insertará en el elemento.
 * @returns {HTMLElement} - Elemento HTML creado.
 */
const crearElemento = (tipo, atributos = {}, contenido = "") => {
  let elemento = document.createElement(tipo);
  Object.assign(elemento, atributos);
  if (contenido) elemento.textContent = contenido;
  return elemento;
};
/**
 * Función para mostrar los personajes en el contenedor.
 * Se crea una "tarjeta" para cada personaje con imagen e información.
 * @param {Array} personajes - Array de personajes obtenido de la API.
 */
function mostrarPersonajes(personajes) {
  personajes.forEach(personaje => {
    // Se crea la tarjeta y se asigna un evento para mostrar detalles al hacer clic.
    let div = crearElemento("div", {
      className: "personaje",
      onclick: () => obtenerDetallesPersonaje(personaje.id)
    });
    // Se establece un fondo decorativo.
    div.style.background = `url("img/Fondo.jfif") center/cover no-repeat`;
    // Se crea la imagen del personaje.
    let img = crearElemento("img", { src: personaje.image, alt: personaje.name });
    // Se crean párrafos con la información del personaje.
    let nombre = crearElemento("p", { className: "info" }, `Nombre: ${personaje.name}`);
    let raza = crearElemento("p", { className: "info" }, `Raza: ${personaje.race || "Desconocida"}`);
    let genero = crearElemento("p", { className: "info" }, `Género: ${personaje.gender || "No especificado"}`);
    let poder = crearElemento("p", { className: "ki" }, `Poder: ${personaje.ki || "Desconocido"}`);
    let afiliacion = crearElemento("p", { className: "afiliacion" }, `Afiliación: ${personaje.affiliation || "Ninguna"}`);
    // Se agregan la imagen y la información a la tarjeta.
    div.append(img, nombre, raza, genero, poder, afiliacion);
    // Se inserta la tarjeta en el contenedor principal.
    contenedor.appendChild(div);
  });
};
/**
 * Función para obtener los personajes desde la API.
 * Se construye la URL según la página actual y se renderiza la paginación.
 * @param {string} [url] - URL opcional para realizar la consulta.
 */
async function obtenerPersonajes(url = `https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${limite}`) {
  try {
    // Se realiza la solicitud a la API.
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("Error al obtener los personajes");
    
    // Se obtiene la respuesta en formato JSON.
    const { items, meta } = await respuesta.json();
    
    // Se limpia el contenedor de personajes.
    contenedor.innerHTML = "";
    // Se muestran los personajes en pantalla.
    mostrarPersonajes(items);
    
    // Se renderiza la paginación utilizando la metadata.
    renderPagination(meta);
  } catch (error) {
    console.error(error);
  };
};
/**
 * Función para renderizar la paginación.
 * Se crean botones para "Anterior", "Siguiente" y números de página, utilizando Bootstrap.
 * @param {object} meta - Objeto con la metadata de la respuesta de la API.
 */
function renderPagination(meta) {
  const totalPages = meta.totalPages;
  const currentPage = meta.currentPage;
  // Se limpia el contenedor de paginación.
  paginationContainer.innerHTML = "";
  // Se crea una lista (<ul>) con clases de Bootstrap para la paginación.
  const ul = crearElemento("ul", { className: "pagination justify-content-center" });
  // Botón "Anterior": se desactiva si se está en la primera página.
  const liPrev = crearElemento("li", { className: `page-item ${currentPage === 1 ? 'disabled' : ''}` });
  const aPrev = crearElemento("a", { className: "page-link", href: "#" }, "Anterior");
  aPrev.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) loadPage(currentPage - 1);
  });
  liPrev.appendChild(aPrev);
  ul.appendChild(liPrev);
  // Botones numerados para cada página.
  for (let i = 1; i <= totalPages; i++) {
    const li = crearElemento("li", { className: `page-item ${i === currentPage ? 'active' : ''}` });
    const a = crearElemento("a", { className: "page-link", href: "#" }, i);
    a.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(i);
    });
    li.appendChild(a);
    ul.appendChild(li);
  };
  // Botón "Siguiente": se desactiva si se está en la última página.
  const liNext = crearElemento("li", { className: `page-item ${currentPage === totalPages ? 'disabled' : ''}` });
  const aNext = crearElemento("a", { className: "page-link", href: "#" }, "Siguiente");
  aNext.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) loadPage(currentPage + 1);
  });
  liNext.appendChild(aNext);
  ul.appendChild(liNext);
  // Se agrega la lista de paginación al contenedor.
  paginationContainer.appendChild(ul);
};
/**
 * Función para cargar una página específica.
 * Actualiza la variable global y solicita la API con la URL correspondiente.
 * @param {number} pageNumber - Número de página a cargar.
 */
function loadPage(pageNumber) {
  paginaActual = pageNumber;
  const url = `https://dragonball-api.com/api/characters?page=${pageNumber}&limit=${limite}`;
  obtenerPersonajes(url);
};

/**
 * Función para obtener los detalles de un personaje.
 * Se solicita la API con el ID del personaje y se muestra el modal.
 * @param {number|string} id - ID del personaje.
 */
async function obtenerDetallesPersonaje(id) {
  try {
    const respuesta = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!respuesta.ok) throw new Error("Error al obtener el personaje");
    mostrarModal(await respuesta.json());
  } catch (error) {
    console.error(error);
  };
};

/**
 * Función para mostrar el modal con los detalles de un personaje.
 * Se crean dinámicamente los elementos del modal y se insertan en el contenedor.
 * @param {object} personaje - Objeto con la información del personaje.
 */
function mostrarModal(personaje) {
  detalles.innerHTML = "";
  let titulo = crearElemento("h2", {}, personaje.name);
  let img = crearElemento("img", { src: personaje.image, alt: personaje.name });
  let contenedorImagen = crearElemento("div", { className: "imagen-personaje" });
  contenedorImagen.appendChild(img);
  let infoContainer = crearElemento("div", { className: "info-personaje" });
  let info = [
    crearElemento("p", {}, `Ki: ${personaje.ki}`),
    crearElemento("p", {}, `Máx Ki: ${personaje.maxKi}`),
    crearElemento("p", {}, `Raza: ${personaje.race}`),
    crearElemento("p", {}, `Género: ${personaje.gender}`),
    crearElemento("p", {}, `Afiliación: ${personaje.affiliation || "Desconocida"}`)
  ];
  infoContainer.append(...info);
  detalles.append(titulo, contenedorImagen, infoContainer);
  if (personaje.originPlanet) {
    let planeta = crearElemento("div", { className: "contenedor-planeta" });
    let tituloPlaneta = crearElemento("h3", {}, "Planeta de Origen:");
    let imgPlaneta = crearElemento("img", { src: personaje.originPlanet.image, alt: personaje.originPlanet.name, width: 120 });
    let descPlaneta = crearElemento("p", {}, `${personaje.originPlanet.name} - ${personaje.originPlanet.description}`);
    planeta.append(tituloPlaneta, imgPlaneta, descPlaneta);
    detalles.appendChild(planeta);
  };
  if (personaje.transformations && personaje.transformations.length > 0) {
    let contenedorTrans = crearElemento("div", { className: "contenedor-transformaciones" });
    let tituloTrans = crearElemento("h3", {}, "Transformaciones:");
    contenedorTrans.appendChild(tituloTrans);
    personaje.transformations.forEach(trans => {
      let divTrans = crearElemento("div", { className: "transformacion" });
      let imgTrans = crearElemento("img", { src: trans.image, width: 80, alt: trans.name });
      let textoTrans = crearElemento("p", {}, `${trans.name} (Ki: ${trans.ki})`);
      divTrans.append(imgTrans, textoTrans);
      contenedorTrans.appendChild(divTrans);
    });
    detalles.appendChild(contenedorTrans);
  };
  modal.classList.add("activo");
  document.body.classList.add("modal-abierto");
};
/**
 * Función para cerrar el modal.
 * Quita la clase "activo" y restaura el scroll en el body.
 */
function cerrarModal() {
  modal.classList.remove("activo");
  document.body.classList.remove("modal-abierto");
};
// Cierra el modal si se hace clic fuera del contenido.
window.addEventListener("click", (evento) => {
  if (evento.target === modal) {
    cerrarModal();
  };
});
// Inicializa la carga de personajes cuando el documento está listo.
document.addEventListener("DOMContentLoaded", () => {
  obtenerPersonajes();
});