function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Retorna el numero 2 o 4 o 8 (Aleatoriamente)
function random_2_or_4_or_8(){
  const random = Math.floor(Math.random() * 3);
  if(random === 1)
    return 4;
  else if(random == 2){
    return 8;
  }
  else
    return 2;
}
let numero_movimientos = 0;
let suma_de_piezas_en_juego = 0;
let flagAction = false;
let inGame = true;
let mlsMovientoCasilla = 1000;
let contador_segundos = 0;
let contador_minutos = 0;
document.addEventListener('keydown',function(event) {
  if(inGame){
  
  switch (event.key){
    case 'ArrowLeft':
      if((columnaAleatoria[0] > 0) ){
        if((numAleatorio[0] === matrix[filaActual[0]][columnaAleatoria[0]-1])){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]--;
          sumar_casillas(numAleatorio);
          acomodarNumeros(matrix);
          actualizar_numero_movimientos();
        }else if (matrix[filaActual[0]][columnaAleatoria[0]-1] === 0){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]--;
          mover_numero_de_casilla(filaActual, columnaAleatoria, numAleatorio);
          reiniciar_casilla_generacion_numero([columnaAleatoria[0]+1])
          actualizar_numero_movimientos();
        }
      }
      break;
    case 'ArrowRight':
      if(columnaAleatoria[0] < 3){
        if((numAleatorio[0] === matrix[filaActual[0]][columnaAleatoria[0]+1])){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]++;
          sumar_casillas(numAleatorio);
          acomodarNumeros(matrix);
          actualizar_numero_movimientos();
        }else if (matrix[filaActual[0]][columnaAleatoria[0]+1] === 0){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]++;
          mover_numero_de_casilla(filaActual, columnaAleatoria, numAleatorio);
          reiniciar_casilla_generacion_numero([columnaAleatoria[0]-1])
          actualizar_numero_movimientos();
        }
      }
      break;
    case 'ArrowDown':
      mlsMovientoCasilla = 200;
      break;
  }}
  });

//Comprueba si ya se perdio la partida o no
function comprobar_condicion_partida(matrix, columna, num){
  return matrix[0][columna] === 0 || matrix[0][columna] === num[0];
}

/*
Funcion caida
+Entradas:
  -num: El numero que va a caer 
  -fila: En la fila que va a caer
  -columna: En la columna que va a caer el numero
  -matrix: la matriz en la que el numero va a caer 
+Funcion:
  -Genera efecto de caida en la matriz
  -El numero empieza en la fila 0
  -El numero baja fila por fila hasta que se encuentre con otro nummero o el final de la matriz
  -(Bajar signinifica escribir el numero en la posicion actual y eliminarlo de la fila anterior)
+Salida:
  -No hay salida ya que se modifica la matriz directamente(Como pasar por referencia en c++)
*/


async function caida(num, fila, columna, matrix){
  mlsMovientoCasilla = 1000;                         //pausa entre cada moviento de casilla
  await esperar(mlsMovientoCasilla);                      //pausa la ejecucion segun los mls enviados
  reiniciar_casilla_generacion_numero(columna);           //se coloca la casilla de generacion con los valores por defecto

  for(fila[0] = 0;fila[0]<matrix.length;fila[0]++){
    
    if(matrix[fila[0]][columna[0]] !== num[0] && matrix[fila[0]][columna[0]] !== 0 && fila[0] > 0){   //caso en el que se deba colocar un numero arriba de otro
      fila[0]--;      
      mover_numero_de_casilla(fila, columna, num);    //coloca graficamente el numero en la casilla de arriba 
      matrix[fila[0]][columna[0]] = num[0];           //lo mismo pero internamente en las matrices
      fila[0] = 0;
      return;
    }
    else if(matrix[fila[0]][columna[0]] === num[0]){            //caso en el que el numero generado sea igual al de la casilla actual
      reiniciar_casilla(fila, columna);              //borra la casilla actual           
      await unir_numeros_vertical(num, fila, columna, matrix);  //pausa segun los mls ingresados
      return;                                  
    }

    //generacion de efecto de caida por default, lo que se hace es colocar el numero en la casilla actual, pausar, continuar y borrar el actual0
    mover_numero_de_casilla(fila, columna, num);   //caso por default, mueve el numero a la casilla actual
    await esperar(mlsMovientoCasilla);             //pausa de x mls para generar el efecto de caida
    reiniciar_casilla(fila, columna);              //borra la casilla actual         
    matrix[fila[0]][columna[0]] = 0;  
    reiniciar_casilla_generacion_numero(columna);  //se coloca la casilla de generacion con los valores por defecto
  }
  
  fila[0]--;
  matrix[(fila[0])][columna[0]] = num[0];         //se coloca el numero generadi en el fondo de la columna[0]
  mover_numero_de_casilla(fila, columna, num);      //hace lo mismo pero graficamente
  fila[0] = 0;
}

/* 
  En terminos generales produce el efecto de unir dos casillas que tengan en mismo valor.
  Al encontrar una casilla adyacente vertical, con el mismo valor, se une en una sola multiplicando su valor por 2.
  Este proceso, al entrar a la funcion, se hace al menos 1 vez, y despues se va verificando si debajo de esta casilla se produce el mismo efecto.
*/
async function sumar_casillas(num){
  num[0] *= 2;                            //numero ingresado multiplicado por dos
  matrix[filaActual[0]][columnaAleatoria[0]] = num[0];//se coloca el numero duplicado en la casilla (efecto de union)
  mover_numero_de_casilla(filaActual, columnaAleatoria, num);   //efecto de union en la parte grafica
}

async function unir_numeros_vertical(num, fila, columna, matrix){
  const mlsMovientoCasilla = 500;                //mls de espera cuando cada vez que se produce el efecto de unir dos casillas
  sumar_casillas(num);
  
  while(fila[0] < matrix.length - 1 && num[0] === matrix[fila[0] + 1][columna[0]]){
    await esperar(mlsMovientoCasilla);    //pausa la2 ejecucion del programa, segun los mls segundos enviados
    matrix[fila[0]][columna[0]] = 0;      //se coloca un 0 en la casilla actual 
    reiniciar_casilla(fila, columna);     //se reinicia la casilla (es decir, se pone tal cual como esta al inicio de la ejecucion)               
    fila[0]++;
    sumar_casillas(num);
  }
  acomodarNumeros(matrix);
  fila[0] = 0;
}

//de momento no se usa[PROTOTIPO]
function acomodarNumeros2(fila, matrix){
  console.log("Acomondando numeros")
  for(let i = fila[0];i>0;i--){
    console.log(matrix[i][columnaAleatoria[0]])
    if(matrix[i][columnaAleatoria[0]] != 0){
      fila[0] = i;
      numAleatorio = matrix[i][columnaAleatoria[0]];
      return i;
    }
  }
  return 0;
}

//acomoda los numeros para no dejar espacios vacios entre casillas 
async function acomodarNumeros(matrix){
  for(let i = 0; i < matrix.length - 1; i++){ //hace el for 4 veces para asegurar que se haga el proceso bien (se puede mejorar)
    for(let fila = [matrix.length - 1]; fila[0] > 1; fila[0]--){ //empieza a recorrer desde la ultima fila hasta la fila 2
      let filaArriba = [fila[0] - 1];                            //se obtiene la fila de arriba 
      let num = [matrix[filaArriba][columnaAleatoria[0]]];        //se obtiene el numero que este por arriba de la fila actual
      
      if(num[0] !== 0){                                     //comprueba que la casilla de arriba no este vacia
        if(matrix[fila[0]][columnaAleatoria[0]] === 0){     //comprueba si la casilla actual esta vacia, para bajar el numero de arriba              
          matrix[fila[0]][columnaAleatoria[0]] = num[0];    //le coloca a la casilla actual el numero de arriba
          mover_numero_de_casilla(fila, columnaAleatoria, num); //lo hace graficamente
          matrix[filaArriba[0]][columnaAleatoria[0]] = 0;   //le pone un cero a la casilla de arriba
          reiniciar_casilla(filaArriba, columnaAleatoria);  //lo hace graficamente
        }
        else if(num[0] === matrix[fila[0]][columnaAleatoria[0]]){ //comprueba si la casilla actual tiene el mismo numero que la de arriba, para unirlos
          matrix[filaArriba[0]][columnaAleatoria[0]] = 0;         //pone la casilla de arriba vacia
          reiniciar_casilla(filaArriba, columnaAleatoria);        //lo hace graficamente
          filaActual[0] ++;                                       //incrementa la fila actual, para llamar el metodo sumar la casilla que le correponde
          sumar_casillas(num);                                    //suma las casillas y las une
          numAleatorio[0] = num[0];                               //le pone al numero aleatorio el resultado de la union
        }
      }
    }
  }
  return 0;
}



//Cambiar el color de la casilla segun la fila, columna y fila al color de entrada(formato: #123456)
function cambiar_color_casilla(fila,columna,color){
  const casilla = document.getElementById('casilla'+(fila[0])+columna[0]);
  if(casilla != null){
    casilla.style.backgroundColor = color;
  }
  
}

//Cambiar el numero de una casilla.
function cambiar_numero_casilla(fila,columna,numero){
  const casilla = document.getElementById('casilla'+fila[0]+columna[0]);
  if(numero !== null ){
    casilla.textContent = numero[0];
  }else{
    casilla.textContent = null;
  }
}

//borra un numero de una casilla
function borrar_numero_casilla(fila,columna){
  const casilla = document.getElementById('casilla'+(fila[0])+columna[0]);
  if(casilla != null){
    casilla.get
    casilla.textContent = null;
  }
  
}

//Le pone el color inicial y le borra el numero a una casilla
function reiniciar_casilla(fila, columna){
  cambiar_color_casilla(fila,columna,'#9A80E1');
  borrar_numero_casilla(fila, columna);
}

//Le pone el color inicial y le borra el numero a una casilla que genera numeros
function reiniciar_casilla_generacion_numero(columna){
  cambiar_numero_casilla([0], columna, null);
  cambiar_color_casilla([0], columna, "#6437E1");
}

//mueve el numero de una casilla a otra
function mover_numero_de_casilla(fila, columna, num){
  cambiar_color_casilla(fila, columna,'#FFFFFF');
  cambiar_numero_casilla(fila, columna,  num);
}

function actualizar_numero_movimientos(){
  numero_movimientos++;
  const casilla = document.getElementById('numero_de_movimientos');
  casilla.textContent = numero_movimientos;
}

function actualizar_cronometro(minutos,segundos){
  if(Math.floor(segundos / 10) === 0){
    segundos = "0"+segundos;
  }
  const casilla = document.getElementById('tiempo');
  casilla.textContent = minutos + " : " + segundos;
}

async function iniciar_cronometro(){
  while(true){
    await esperar(1000);
    if(contador_segundos == 60){
      contador_minutos++;
      contador_segundos = 0;
    }
    actualizar_cronometro(contador_minutos,contador_segundos);
    contador_segundos++;
    if(!inGame)
      break;
  }
}

function actualizar_suma_de_piezas(num){
  suma_de_piezas_en_juego += num;
  const casilla = document.getElementById('suma_de_piezas');
  casilla.textContent = suma_de_piezas_en_juego;
}

function perder(){
  const div = document.getElementById('game_over_screen');
  const casilla = document.getElementById('tiempo_final');
  casilla.textContent = contador_minutos + " : " + contador_segundos;
  const casilla1 = document.getElementById('suma_de_piezas_final');
  casilla1.textContent = suma_de_piezas_en_juego;
  const casilla2 = document.getElementById('numero_de_movimientos_final');
  casilla2.textContent = numero_movimientos;
  div.style.display = "flex";

  /*
  actualizar_suma_de_piezas(numAleatorio[0]*-1);
  numero_movimientos--;
  actualizar_numero_movimientos();
  actualizar_cronometro(contador_minutos,contador_segundos);*/
}

const restart_button = document.getElementById("restart_button");
restart_button.addEventListener('click', function() {
  const div = document.getElementById('game_over_screen');
  div.style.display = 'none';
  restart_game();
});

function restart_game(){
  numero_movimientos = -1;
  actualizar_numero_movimientos();
  suma_de_piezas_en_juego = 0;
  columnaAleatoria = [0];
  filaActual = [0];
  numAleatorio = [0];
  inGame = true;
  contador_minutos = 0;
  contador_segundos = 0;
  iniciar_cronometro();
  for(let i = 0;i<5;i++){
    for(let j = 0;j<4;j++){
      matrix[i][j] = 0;
      if(i === 0){
        reiniciar_casilla_generacion_numero([j]);
        continue;
      }
      reiniciar_casilla([i],[j]);
    }
  }
  main();
}