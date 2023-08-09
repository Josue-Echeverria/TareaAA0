let numero_movimientos = 0;
let suma_de_piezas_en_juego = 0;
let flagAction = false;
let inGame = true;
let mlsMovientoCasilla = 1000;
let contador_segundos = 0;
let contador_minutos = 0;

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

document.addEventListener('keydown',function(event) {
  let { fila, columna, numero } = actual;
  if(inGame){
  
  switch (event.key){
    case 'ArrowLeft':
      if((actual.columna > 0) ){
        if((actual.numero === matrix[actual.fila][actual.columna-1])){
          reiniciar_casilla(actual.fila, actual.columna);
          matrix[actual.fila][actual.columna] = 0;
          acomodarNumeros(actual.columna);
          actual.columna--;
          sumar_casillas(actual.numero);
          actual.numero*=2;
          acomodarNumeros(actual.columna);
          actualizar_numero_movimientos();
        }else if (matrix[actual.fila][actual.columna-1] === 0){
          reiniciar_casilla(actual.fila, actual.columna);
          matrix[actual.fila][actual.columna] = 0;
          acomodarNumeros(actual.columna);
          actual.columna--;
          matrix[actual.fila][actual.columna] = actual.numero;
          mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);
          //acomodarNumeros(matrix,actual.columna);
          reiniciar_casilla_generacion_numero(actual.columna+1)
          actualizar_numero_movimientos();
        }
      }
      break;
    case 'ArrowRight':
      if(actual.columna < 3){
        if((actual.numero === matrix[actual.fila][actual.columna+1])){
          reiniciar_casilla(actual.fila, actual.columna);
          matrix[actual.fila][actual.columna] = 0;
          acomodarNumeros(actual.columna);
          actual.columna++;
          sumar_casillas(actual.numero);
          actual.numero*=2;
          acomodarNumeros(actual.columna);
          actualizar_numero_movimientos();
        }else if (matrix[actual.fila][actual.columna+1] === 0){
          reiniciar_casilla(actual.fila, actual.columna);
          matrix[actual.fila][actual.columna] = 0;
          acomodarNumeros(actual.columna);
          actual.columna++;
          matrix[actual.fila][actual.columna] = actual.numero;
          mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);
         // acomodarNumeros(matrix,actual.columna);
          reiniciar_casilla_generacion_numero(actual.columna-1)
          actualizar_numero_movimientos();
        }
      }
      break;
      case 'ArrowDown':
        mlsMovientoCasilla = 200;
        break;
    }
  }
});

//Comprueba si ya se perdio la partida o no
function comprobar_condicion_partida(matrix, columna, numero){
  return matrix[1][columna] === 0 || matrix[1][columna] === numero;
}

/*
Funcion caida
+Entradas:
  -numero: El numero que va a caer 
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


async function caida(numero, fila, columna, matrix){
  mlsMovientoCasilla = 1000;                         //pausa entre cada moviento de casilla
  reiniciar_casilla_generacion_numero(columna);           //se coloca la casilla de generacion con los valores por defecto

  for(actual.fila = 0; actual.fila < matrix.length; actual.fila++){
    if(matrix[actual.fila][actual.columna] !== actual.numero && matrix[actual.fila][actual.columna] !== 0 && actual.fila > 0){   //caso en el que se deba colocar un numero arriba de otro
      actual.fila--;      
      if(actual.fila === 0)
      {
        inGame = false;
      }
      mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);    //coloca graficamente el numero en la casilla de arriba 
      matrix[actual.fila][actual.columna] = actual.numero;           //lo mismo pero internamente en las matrices
      actual.fila = 0;
      return;
    }
    else if(matrix[actual.fila][actual.columna] === actual.numero){            //caso en el que el numero generado sea igual al de la casilla actual
      reiniciar_casilla(actual.fila, actual.columna);              //borra la casilla actual           
      await unir_numeros_vertical(actual.numero, actual.fila, actual.columna, matrix);  //pausa segun los mls ingresados
      return;                                  
    }
    //generacion de efecto de caida por default, lo que se hace es colocar el numero en la casilla actual, pausar, continuar y borrar el actual0
    mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);   //caso por default, mueve el numero a la casilla actual
    matrix[actual.fila][actual.columna] = actual.numero;  
    await esperar(mlsMovientoCasilla);             //pausa de x mls para generar el efecto de caida
    reiniciar_casilla(actual.fila, actual.columna);              //borra la casilla actual         
    matrix[actual.fila][actual.columna] = 0;  
    reiniciar_casilla_generacion_numero(actual.columna);  //se coloca la casilla de generacion con los valores por defecto
  }
  actual.fila--;
  matrix[actual.fila][actual.columna] = actual.numero;         //se coloca el numero generadi en el fondo de la columna[0]
  mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);      //hace lo mismo pero graficamente
  actual.fila = 0;
}

/* 
  En terminos generales produce el efecto de unir dos casillas que tengan en mismo valor.
  Al encontrar una casilla adyacente vertical, con el mismo valor, se une en una sola multiplicando su valor por 2.
  Este proceso, al entrar a la funcion, se hace al menos 1 vez, y despues se va verificando si debajo de esta casilla se produce el mismo efecto.
*/
async function sumar_casillas(numero){
  numero *= 2;                            //numero ingresado multiplicado por dos
  matrix[actual.fila][actual.columna] = numero;//se coloca el numero duplicado en la casilla (efecto de union)
  mover_numero_de_casilla(actual.fila, actual.columna, numero);   //efecto de union en la parte grafica
}
//CAMBIAR EESTA FUNCION
async function unir_numeros_vertical(numero, fila, columna, matrix){
  const mlsMovientoCasilla = 500;                //mls de espera cuando cada vez que se produce el efecto de unir dos casillas
  sumar_casillas(actual.numero);
  actual.numero*=2;
  while(actual.fila < matrix.length - 1){
    await esperar(mlsMovientoCasilla);    //pausa la2 ejecucion del programa, segun los mls segundos enviados
    if(actual.numero  === matrix[actual.fila + 1][actual.columna]){
      matrix[actual.fila][actual.columna] = 0;      //se coloca un 0 en la casilla actual 
      reiniciar_casilla(actual.fila, actual.columna);     //se reinicia la casilla (es decir, se pone tal cual como esta al inicio de la ejecucion)               
      actual.fila++;
      sumar_casillas(actual.numero);
      actual.numero*=2;
    }else{
      //acomodarNumeros(matrix,columna);
      break;
    }
  }
  acomodarNumeros(actual.columna);
  actual.fila = 0;
}

//acomoda los numeros para no dejar espacios vacios entre casillas 
//AREGLAR ESTA TAMBIEN

async function acomodarNumeros(columna){
 // for(let i = 0; i < matrix.length - 1; i++){ //hace el for 4 veces para asegurar que se haga el proceso bien (se puede mejorar)
    for(let fila = matrix.length - 1; fila > 1; fila--){ //empieza a recorrer desde la ultima fila hasta la fila 2
      let filaArriba = fila - 1;                            //se obtiene la fila de arriba 
      let num = matrix[filaArriba][columna];        //se obtiene el numero que este por arriba de la fila actual
      if(num !== 0){       //comprueba que la casilla de arriba no este vacia
        if(matrix[fila][columna] === 0){     //comprueba si la casilla actual esta vacia, para bajar el numero de arriba              
          matrix[filaArriba][columna] = 0;   //le pone un cero a la casilla de arriba
          reiniciar_casilla(filaArriba, columna);  //lo hace graficamente
          matrix[fila][columna] = num;            //le coloca a la casilla actual el numero de arriba
          mover_numero_de_casilla(fila,columna, num);//lo hace graficamente
          fila = matrix.length;
        }
        else if(num === matrix[fila][columna]){ //comprueba si la casilla actual tiene el mismo numero que la de arriba, para unirlos
          matrix[filaArriba][columna] = 0;         //pone la casilla de arriba vacia
          reiniciar_casilla(filaArriba, columna);        //lo hace graficamente
          actual.fila = fila;                                       //incrementa la fila actual, para llamar el metodo sumar la casilla que le correponde
          sumar_casillas(num);                                    //suma las casillas y las une
          num*=2;
          if(actual.numero*2 === num)
            actual.numero = num;//le pone al numero aleatorio el resultado de la union
          acomodarNumeros(columna);
        }
      }
  }
  return 0;
}



//Cambiar el color de la casilla segun la fila, columna y fila al color de entrada(formato: #123456)
function cambiar_color_casilla(fila, columna, color){
  const casilla = document.getElementById('casilla' + fila + columna);
  if(casilla != null){
    casilla.style.backgroundColor = color;
  }
  
}

//Cambiar el numero de una casilla.
function cambiar_numero_casilla(fila, columna, numero){
  const casilla = document.getElementById('casilla'+ fila + columna);
  if(numero !== null ){
    casilla.textContent = numero;
  }else{
    casilla.textContent = null;
  }
}

//borra un numero de una casilla
function borrar_numero_casilla(fila, columna){
  const casilla = document.getElementById('casilla' + fila + columna);
  if(casilla != null){
    casilla.get
    casilla.textContent = null;
  }
  
}

//Le pone el color inicial y le borra el numero a una casilla
function reiniciar_casilla(fila, columna){
  cambiar_color_casilla(fila, columna, '#9A80E1');
  borrar_numero_casilla(fila, columna);
}

//Le pone el color inicial y le borra el numero a una casilla que genera numeros
function reiniciar_casilla_generacion_numero(columna){
  cambiar_numero_casilla(0, columna, null);
  cambiar_color_casilla(0, columna, "#6437E1");
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
  actual.columna = 0;
  fila = 0;
  numero = 0;
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