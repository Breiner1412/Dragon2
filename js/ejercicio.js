// Variables globales y referencias al DOM
let paginaActual = 1;
const limite = 5;
const contenedor = document.getElementById("caracteres");
const contenedorPaginacion = document.getElementById("pagination");
const modal = document.getElementById("modal");
const detalles = document.getElementById("detalles-personaje");
const btnCerrarModal = document.getElementById("btnCerrarModal");

// Función utilitaria para crear elementos y asignar atributos
const crearElemento = (tipo, atributos = {}, contenido = "") => {
  const elem = document.createElement(tipo);
  Object.assign(elem, atributos);
  if (contenido) elem.textContent = contenido;
  return elem;
};

// Función para limpiar un contenedor sin usar innerHTML
const limpiarElemento = (el) => { while(el.firstChild) el.removeChild(el.firstChild); };

// Muestra las tarjetas de personajes en el contenedor principal
function mostrarPersonajes(personajes) {
  personajes.forEach(personaje => {
    const tarjeta = crearElemento("div", {
      className: "personaje",
      onclick: () => obtenerDetallesPersonaje(personaje.id)
    });
    tarjeta.style.background = 'url("img/Fondo.jfif") center/cover no-repeat';
    
    const imagen = crearElemento("img", { src: personaje.image, alt: personaje.name });
    const infoNombre = crearElemento("p", { className: "info" }, `Nombre: ${personaje.name}`);
    const infoRaza = crearElemento("p", { className: "info" }, `Raza: ${personaje.race || "Desconocida"}`);
    const infoGenero = crearElemento("p", { className: "info" }, `Género: ${personaje.gender || "No especificado"}`);
    const infoKi = crearElemento("p", { className: "ki" }, `Poder: ${personaje.ki || "Desconocido"}`);
    const infoAfiliacion = crearElemento("p", { className: "afiliacion" }, `Afiliación: ${personaje.affiliation || "Ninguna"}`);
    
    tarjeta.append(imagen, infoNombre, infoRaza, infoGenero, infoKi, infoAfiliacion);
    contenedor.appendChild(tarjeta);
  });
}

// Función asíncrona para obtener personajes con paginación
async function obtenerPersonajes(url = `https://dragonball-api.com/api/characters?page=${paginaActual}&limit=${limite}`) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("Error al obtener los personajes");
    const { items, meta } = await respuesta.json();
    limpiarElemento(contenedor);
    mostrarPersonajes(items);
    renderizarPaginacion(meta);
  } catch (error) {
    console.error(error);
  }
}

// Renderiza el paginador basado en la metadata
function renderizarPaginacion(meta) {
  const { totalPages, currentPage } = meta;
  limpiarElemento(contenedorPaginacion);
  const ul = crearElemento("ul", { className: "pagination justify-content-center" });
  
  const liAnterior = crearElemento("li", { className: `page-item ${currentPage === 1 ? "disabled" : ""}` });
  const aAnterior = crearElemento("a", { className: "page-link", href: "#" }, "Anterior");
  aAnterior.addEventListener("click", e => { e.preventDefault(); if (currentPage > 1) cargarPagina(currentPage - 1); });
  liAnterior.appendChild(aAnterior);
  ul.appendChild(liAnterior);
  
  for (let i = 1; i <= totalPages; i++) {
    const li = crearElemento("li", { className: `page-item ${i === currentPage ? "active" : ""}` });
    const a = crearElemento("a", { className: "page-link", href: "#" }, i);
    a.addEventListener("click", e => { e.preventDefault(); cargarPagina(i); });
    li.appendChild(a);
    ul.appendChild(li);
  }
  
  const liSiguiente = crearElemento("li", { className: `page-item ${currentPage === totalPages ? "disabled" : ""}` });
  const aSiguiente = crearElemento("a", { className: "page-link", href: "#" }, "Siguiente");
  aSiguiente.addEventListener("click", e => { e.preventDefault(); if (currentPage < totalPages) cargarPagina(currentPage + 1); });
  liSiguiente.appendChild(aSiguiente);
  ul.appendChild(liSiguiente);
  
  contenedorPaginacion.appendChild(ul);
}

// Cambia la página actual y carga los personajes correspondientes
function cargarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  const url = `https://dragonball-api.com/api/characters?page=${nuevaPagina}&limit=${limite}`;
  obtenerPersonajes(url);
}

// Obtiene y muestra detalles de un personaje en el modal
async function obtenerDetallesPersonaje(id) {
  try {
    const respuesta = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!respuesta.ok) throw new Error("Error al obtener el personaje");
    const personaje = await respuesta.json();
    mostrarModal(personaje);
  } catch (error) {
    console.error(error);
  }
}

function mostrarModal(personaje) {
  limpiarElemento(detalles);
  const titulo = crearElemento("h2", {}, personaje.name);
  const contImagen = crearElemento("div", { className: "imagen-personaje" });
  const img = crearElemento("img", { src: personaje.image, alt: personaje.name });
  contImagen.appendChild(img);
  
  const contInfo = crearElemento("div", { className: "info-personaje" });
  const infoItems = [
    crearElemento("p", {}, `Ki: ${personaje.ki}`),
    crearElemento("p", {}, `Máx Ki: ${personaje.maxKi}`),
    crearElemento("p", {}, `Raza: ${personaje.race}`),
    crearElemento("p", {}, `Género: ${personaje.gender}`),
    crearElemento("p", {}, `Afiliación: ${personaje.affiliation || "Desconocida"}`),
    crearElemento("p", {}, `Descripción: ${personaje.description}`)
  ];
  contInfo.append(...infoItems);
  
  detalles.append(titulo, contImagen, contInfo);
  
  if (personaje.originPlanet) {
    const contPlaneta = crearElemento("div", { className: "contenedor-planeta" });
    contPlaneta.append(
      crearElemento("h3", {}, "Planeta de Origen:"),
      crearElemento("img", { src: personaje.originPlanet.image, alt: personaje.originPlanet.name, width: 120 }),
      crearElemento("p", {}, `${personaje.originPlanet.name} - ${personaje.originPlanet.description}`)
    );
    detalles.appendChild(contPlaneta);
  }
  
  if (personaje.transformations?.length) {
    const contTrans = crearElemento("div", { className: "contenedor-transformaciones" });
    contTrans.appendChild(crearElemento("h3", {}, "Transformaciones:"));
    personaje.transformations.forEach(trans => {
      const divTrans = crearElemento("div", { className: "transformacion" });
      divTrans.append(
        crearElemento("img", { src: trans.image, width: 80, alt: trans.name }),
        crearElemento("p", {}, `${trans.name} (Ki: ${trans.ki})`)
      );
      contTrans.appendChild(divTrans);
    });
    detalles.appendChild(contTrans);
  }
  
  modal.classList.add("activo");
  document.body.classList.add("modal-abierto");
}

function cerrarModal() {
  modal.classList.remove("activo");
  document.body.classList.remove("modal-abierto");
}
btnCerrarModal.addEventListener("click", cerrarModal);
window.addEventListener("click", e => { if (e.target === modal) cerrarModal(); });

document.addEventListener("DOMContentLoaded", () => { obtenerPersonajes(); });