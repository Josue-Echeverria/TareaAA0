function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Retorna el numero 2 o 4 o 8 (Aleatoriamente)
function random_2_or_4_or_8(){
  const random = Math.floor(Math.random() * 3);
  if(random === 1)
    return 4;
  else if(random === 2)
    return 8;
  else
    return 2;
}
let flagAction = false;
let inGame = true;
document.addEventListener('keydown', function(event) {
  if(inGame){
  switch (event.key) {
    case 'ArrowLeft':
      if((columnaAleatoria[0] > 0) ){
        if((numAleatorio[0] === matrix[filaActual[0]][columnaAleatoria[0]-1])){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]--;
          unir_numeros_vertical(numAleatorio, filaActual, columnaAleatoria, matrix);  //pausa segun los mls ingresados
          flagAction = true;
          return;
        }else if (matrix[filaActual[0]][columnaAleatoria[0]-1] === 0){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]--;
          mover_numero_de_casilla(filaActual, columnaAleatoria, numAleatorio);
        }
      }
      reiniciar_casilla_generacion_numero([columnaAleatoria[0]+1])
      break;
    case 'ArrowRight':
      if(columnaAleatoria[0] < 3){
        if((numAleatorio[0] === matrix[filaActual[0]][columnaAleatoria[0]+1])){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]++;
          unir_numeros_vertical(numAleatorio, filaActual, columnaAleatoria, matrix);  //pausa segun los mls ingresados
          flagAction = true;
          return;
        }else if (matrix[filaActual[0]][columnaAleatoria[0]+1] === 0){
          reiniciar_casilla(filaActual, columnaAleatoria);
          columnaAleatoria[0]++;
          mover_numero_de_casilla(filaActual, columnaAleatoria, numAleatorio);
        }
      }
      reiniciar_casilla_generacion_numero([columnaAleatoria[0]-1])
      break;
    case 'ArrowDown':

      break;
  }}
  });

//Confirma que en la primera fila haya un 0()
function confirmar_movimientos_en_matriz(matrix){
  for (let j = 0; j < matrix.length; j++) { //For que recorre las columnas de la matriz
    if(matrix[0][j] === 0)                  //Si en la fila 0 columna actual hay un 0 
      return true;                          
  }
  return false;//Si se acaba la ejecucioin del for y no se encontro un 0 se retorna false
}



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
  let mlsMovientoCasilla = 1500;                         //pausa entre cada moviento de casilla
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
      await unir_numeros_vertical(num, fila, columna, matrix);  //pausa segun los mls ingresados
      fila[0] = 0;
      return;                                  
    }
    
    //generacion de efecto de caida por default, lo que se hace es colocar el numero en la casilla actual, pausar, continuar y borrar el actual0
    mover_numero_de_casilla(fila, columna, num);   //caso por default, mueve el numero a la casilla actual
    await esperar(mlsMovientoCasilla);             //pausa de x mls para generar el efecto de caida
    if(flagAction){
      flagAction = false;
      return;
    }
    reiniciar_casilla(fila, columna);              //borra la casilla actual           
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
async function unir_numeros_vertical(num, fila, columna, matrix){
  const mlsMovientoCasilla = 1000;                //mls de espera cuando cada vez que se produce el efecto de unir dos casillas
  let dNum = num[0] * 2;                          //numero ingresado multiplicado por dos
  matrix[fila[0]][columna[0]] = dNum;             //se coloca el numero duplicado en la casilla (efecto de union)
  mover_numero_de_casilla(fila, columna, [dNum]); //efecto de union en la parte grafica 
  while(fila[0] < matrix.length - 1 && dNum === matrix[fila[0] + 1][columna]){
    await esperar(mlsMovientoCasilla);    //pausa la ejecucion del programa, segun los mls segundos enviados
    matrix[fila[0]][columna[0]] = 0;      //se coloca un 0 en la casilla actual 
    reiniciar_casilla(fila, columna);     //se reinicia la casilla (es decir, se pone tal cual como esta al inicio de la ejecucion)
    dNum *= 2;                            //se vuelve a duplicar el numero
    fila[0] ++;
    matrix[fila[0]][columna[0]] = dNum;     //se unen las casillas y se duplica el numero en la casilla de abajo
    mover_numero_de_casilla(fila, columna, [dNum]);   //se produce el mismo efecto anterior graficamente
  }
  bajar_casillas_superiores();
}

//de momento no se usa
function acomodarNumeros(fila, columna, matrix){
  while(fila > 0){
    cambiar_color_casilla(fila, columna,'#9A80E1');
    cambiar_numero_casilla(fila, columna,  matrix[fila - 1][columna]);
    matrix[fila][columna] = matrix[fila - 1][columna];
    matrix[fila - 1][columna] = 0;
    cambiar_color_casilla(fila - 1,columna,'#9A80E1');
    borrar_numero_casilla(fila, columna);
    fila--;
  }
}

function bajar_casillas_superiores(){
  for(let i = filaActual[0]; i > 0; i--){
//    if(matr)
  }
}
//Cambiar el color de la casilla segun la fila, columna y fila al color de entrada(formato: #123456)
function cambiar_color_casilla(fila,columna,color){
  const casilla = document.getElementById('casilla'+(fila[0])+columna[0]);
  casilla.style.backgroundColor = color;
}

//Cambiar el numero de una casilla.
function cambiar_numero_casilla(fila,columna,numero){
  const casilla = document.getElementById('casilla'+(fila[0])+columna[0]);
  if(numero !== null){
    casilla.textContent = numero[0];
  }else{
    casilla.textContent = null;
  }
}

//borra un numero de una casilla
function borrar_numero_casilla(fila,columna){
  const casilla = document.getElementById('casilla'+(fila[0])+columna[0]);
  casilla.textContent = null;
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