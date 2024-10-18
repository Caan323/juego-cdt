const totalCards = 16; // Total de cartas (6 pares de imágenes)
const availableCards = [
   'imagenes/disco-duro.png', 
   'imagenes/fuente.png', 
   'imagenes/monitor.png', 
   'imagenes/placa-madre.png',  
   'imagenes/ram.png',
   'imagenes/raton.png',
   'imagenes/teclado.png',
   'imagenes/torre-de-pc.png',
]; // URLs de las imágenes

let cards = [];
let selectedCards = [];
let valuesUsed = [];
let currentMove = 0;
let currentAttempts = 0;
let matchedPairs = 0; // Contador para pares coincidentes

const maxAttempts = 10; // Número máximo de intentos permitidos
let cardTemplate = '<div class="card"><div class="back"></div><div class="face"></div></div>';

function activate(e) {
   if (currentMove < 2) {
      if ((!selectedCards[0] || selectedCards[0] !== e.target) && !e.target.classList.contains('active')) {
         e.target.classList.add('active');
         selectedCards.push(e.target);

         if (++currentMove == 2) {
            // Verificar si el número de intentos ha alcanzado el máximo
            if (currentAttempts >= maxAttempts) {
               Swal.fire({
                  title: 'fin del juego',
                  background: '#000',
                  allowOutsideClick: false,
               }).then(() => {
                  location.reload(); // Recargar la página cuando el usuario hace clic en "OK"
               });
               disableGame(); // Detener el juego
               return;
            }

            // Comparar si las dos cartas seleccionadas coinciden (mismo src de imagen)
            if (selectedCards[0].querySelector('.face img').src == selectedCards[1].querySelector('.face img').src) {
               // Si coinciden, incrementar el contador de pares
               matchedPairs++;
               selectedCards = [];
               currentMove = 0;

               // Si se han encontrado todos los pares, finalizar el juego
               if (matchedPairs * 2 === totalCards) {
                  Swal.fire({
                     title: '¡Felicidades! Has encontrado todas las cartas.',
                     background: '#000',
                     allowOutsideClick: false,
                  }).then(() => {
                     location.reload(); // Recargar la página cuando el usuario hace clic en "OK"
                  });
                  disableGame();
               }
            } else {
               // Incrementar intentos solo si no coinciden
               currentAttempts++;
               document.querySelector('#stats').innerHTML = currentAttempts + ' intentos';

               setTimeout(() => {
                  selectedCards[0].classList.remove('active');
                  selectedCards[1].classList.remove('active');
                  selectedCards = [];
                  currentMove = 0;
               }, 600);
            }
         }
      }
   }
}

function randomValue() {
   let rnd = Math.floor(Math.random() * totalCards * 0.5);
   let values = valuesUsed.filter(value => value === rnd);
   if (values.length < 2) { // Asegura que cada imagen solo aparezca en dos cartas
      valuesUsed.push(rnd);
   } else {
      randomValue(); // Llama nuevamente hasta obtener un valor no repetido más de dos veces
   }
}

function getFaceValue(value) {
   let rtn = value;
   if (value < availableCards.length) {
      // Retorna la etiqueta <img> con la URL de la imagen correspondiente
      rtn = `<img src="${availableCards[value]}" alt="Imagen de carta">`;
   }
   return rtn;
}

// Deshabilitar el juego al alcanzar el número máximo de intentos
function disableGame() {
   cards.forEach(card => {
      card.querySelector('.card').removeEventListener('click', activate);
   });
}

// Crear cartas
for (let i = 0; i < totalCards; i++) {
   let div = document.createElement('div');
   div.innerHTML = cardTemplate;
   cards.push(div);
   document.querySelector('#game').append(cards[i]);
   randomValue();
   // Asignar la imagen a la cara de la carta
   cards[i].querySelector('.face').innerHTML = getFaceValue(valuesUsed[i]);
   // Agregar el evento de clic a la carta
   cards[i].querySelector('.card').addEventListener('click', activate);
}