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

//Imprime una matriz
function printMatrix(matrix){
  for(let i = 0; i < matrix.length; i++){
    for(let j = 0; j < matrix[i].length; j++){
      document.write(matrix[i][j] + " ")
    }
    document.write("<br>")
  }
}

//Prototipo de un listener de teclas
document.addEventListener('keydown', function(event) {
  switch (event.key) {
    case 'ArrowLeft':
      console.log('Left arrow key pressed');
      break;
    case 'ArrowUp':
      console.log('Up arrow key pressed');
      break;
    case 'ArrowRight':
      console.log('Right arrow key pressed');
      break;
    case 'ArrowDown':
      console.log('Down arrow key pressed');
      break;
  }
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
  return matrix[0][columna] === 0 || matrix[0][columna] === num;
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
  let mlsMovientoCasilla = 1250;                          //pausa entre cada moviento de casilla
  await esperar(mlsMovientoCasilla);                      //pausa la ejecucion segun los mls enviados
  reiniciar_casilla_generacion_numero(columna);           //se coloca la casilla de generacion con los valores por defecto

  //recorre las casillas verticalmente
  while(fila < matrix.length){ 
    if(matrix[fila][columna] !== num && matrix[fila][columna] !== 0 && fila > 0){   //caso en el que se deba colocar un numero arriba de otro
      mover_numero_de_casilla(fila - 1, columna, num);    //coloca graficamente el numero en la casilla de arriba 
      matrix[fila - 1][columna] = num;                    //lo mismo pero internamente en las matrices
      return;
    }
    else if(matrix[fila][columna] === num){      //caso en el que el numero generado sea igual al de la casilla actual
      await unir_numeros_vertical(num, fila, columna, matrix);  //pausa segun los mls ingresados
      return;                                  
    }

    //generacion de efecto de caida por default, lo que se hace es colocar el numero en la casilla actual, pausar, continuar y borrar el actual
    mover_numero_de_casilla(fila, columna, num);        //caso por default, mueve el numero a la casilla actual
    await esperar(mlsMovientoCasilla);                  //pausa de x mls para generar el efecto de caida
    reiniciar_casilla(fila, columna);                   //borra la casilla actual           
    fila ++;
  }

  matrix[fila - 1][columna] = num;                      //se coloca el numero generadi en el fondo de la columna
  mover_numero_de_casilla(fila - 1, columna, num);      //hace lo mismo pero graficamente
}

/* 
  En terminos generales produce el efecto de unir dos casillas que tengan en mismo valor.
  Al encontrar una casilla adyacente vertical, con el mismo valor, se une en una sola multiplicando su valor por 2.
  Este proceso, al entrar a la funcion, se hace al menos 1 vez, y despues se va verificando si debajo de esta casilla se produce el mismo efecto.
*/
async function unir_numeros_vertical(num, fila, columna, matrix){
  const mlsMovientoCasilla = 1000;        //mls de espera cuando cada vez que se produce el efecto de unir dos casillas
  let dNum = num * 2;                     //numero ingresado multiplicado por dos
  matrix[fila][columna] = dNum;           //se coloca el numero duplicado en la casilla (efecto de union)
  mover_numero_de_casilla(fila, columna, dNum);  //efecto de union en la parte grafica 

  //sigue comprobando si se produce el efecto de union vertical hacia abajo
  while(fila < matrix.length - 1 && dNum === matrix[fila + 1][columna]){
    await esperar(mlsMovientoCasilla);    //pausa la ejecucion del programa, segun los mls segundos enviados
    matrix[fila][columna] = 0;            //se coloca un 0 en la casilla actual 
    reiniciar_casilla(fila, columna);     //se reinicia la casilla (es decir, se pone tal cual como esta al inicio de la ejecucion)
    dNum *= 2;                            //se vuelve a duplicar el numero
    matrix[fila + 1][columna] = dNum;     //se unen las casillas y se duplica el numero en la casilla de abajo
    mover_numero_de_casilla(fila + 1, columna, dNum);   //se produce el mismo efecto anterior graficamente
    fila ++;
  }
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

//Cambiar el color de la casilla segun la fila, columna y fila al color de entrada(formato: #123456)
function cambiar_color_casilla(fila,columna,color){
  fila ++;
  const casilla = document.getElementById('casilla'+fila+columna);
  casilla.style.backgroundColor = color;
}

//Cambiar el numero de una casilla.
function cambiar_numero_casilla(fila,columna,numero){
  fila++;
  const casilla = document.getElementById('casilla'+fila+columna);
  casilla.textContent = numero;
}

//borra un numero de una casilla
function borrar_numero_casilla(fila,columna){
  fila++;
  const casilla = document.getElementById('casilla'+fila+columna);
  casilla.textContent = null;
}

//Le pone el color inicial y le borra el numero a una casilla
function reiniciar_casilla(fila, columna){
  cambiar_color_casilla(fila,columna,'#9A80E1');
  borrar_numero_casilla(fila, columna);
}

//Le pone el color inicial y le borra el numero a una casilla que genera numeros
function reiniciar_casilla_generacion_numero(columna){
  cambiar_numero_casilla(-1, columna, null);
  cambiar_color_casilla(-1, columna, "#6437E1");
}

//mueve el numero de una casilla a otra
function mover_numero_de_casilla(fila, columna, num){
  cambiar_color_casilla(fila, columna,'#FFFFFF');
  cambiar_numero_casilla(fila, columna,  num);
}