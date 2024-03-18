document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('container');
  let contadores = 0; // Variable para contar el número de contenedores creados

  crearContenedores(1); // Inicialmente, crear 15 contenedores al cargar la página

  document.getElementById('cargarMas').addEventListener('click', function() {
      crearContenedores(1); // Crear 1 fila de contenedores adicionales al hacer clic en "Cargar Más"
  });

  document.getElementById('searchInput').addEventListener('input', function(event) {
    event.preventDefault(); // Evitar que se modifique la barra de direcciones
    
    const searchValue = this.value.trim().toLowerCase();
    const url = `https://thesimpsonsquoteapi.glitch.me/quotes?character=${searchValue}`;

    // Realiza una solicitud fetch a la URL construida
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Limpiar el contenedor antes de agregar nuevos resultados
            container.innerHTML = '';

            // Crea y agrega contenedores para los personajes filtrados
            data.forEach(character => {
                const contenedor = createCharacterContainer(character);
                container.appendChild(contenedor);
            });
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
  });

  function crearContenedores(filas) {
    const charactersSet = new Set(); // Conjunto para almacenar los nombres de los personajes sin repetir

    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < filas; i++) {
                const fila = document.createElement('div');
                fila.classList.add('fila');

                let quote = data[Math.floor(Math.random() * data.length)]; // Obtener una cita aleatoria

                // Verificar si el nombre del personaje ya está en el conjunto
                while (charactersSet.has(quote.character)) {
                    quote = data[Math.floor(Math.random() * data.length)]; // Obtener otra cita aleatoria
                }

                charactersSet.add(quote.character); // Agregar el nombre del personaje al conjunto

                const contenedor = document.createElement('div');
                contenedor.classList.add('contenedor');

                const cita = document.createElement('p');
                cita.textContent = quote.quote;
                contenedor.appendChild(cita);

                const imagen = document.createElement('img');
                imagen.src = quote.image;
                contenedor.appendChild(imagen);

                const nombrePersonaje = document.createElement('p');
                nombrePersonaje.textContent = quote.character;
                contenedor.appendChild(nombrePersonaje);

                // Evento de clic para abrir la ventana modal al hacer clic en el contenedor
                contenedor.addEventListener('click', function() {
                  const modal = document.getElementById('myModal');
                  const modalText = document.getElementById('modalText');

                  // Actualiza el contenido de la ventana modal con la información del personaje
                  modalText.innerHTML = `
                    <h2>${quote.character}</h2>
                    <p>${quote.quote}</p>
                    <img src="${quote.image}" alt="${quote.character}">
                  `;

                  // Cambia el fondo de la ventana modal
                  modal.style.backgroundImage = 'url("Images/fondo.jpg")';

                  // Muestra la ventana modal
                  modal.style.display = 'block';
                });

                // Evento de hover para agregar un borde rojo al contenedor y cambiar el cursor a puntero
                contenedor.addEventListener('mouseover', function() {
                  contenedor.style.border = '2px solid red';
                  contenedor.style.cursor = 'pointer';
                  contenedor.style.boxShadow = '5px 5px 10px #888888'; // Sombra
                });

                // Evento para quitar el borde rojo y la sombra al contenedor cuando se deja de hacer hover
                contenedor.addEventListener('mouseout', function() {
                  contenedor.style.border = 'none';
                  contenedor.style.cursor = 'default';
                  contenedor.style.boxShadow = 'none';
                });

                fila.appendChild(contenedor);
                container.appendChild(fila);
            }
        });
  }

  // Evento de clic para cerrar la ventana modal al hacer clic en el botón de cerrar
  document.getElementById('closeButton').addEventListener('click', function() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  });
});

