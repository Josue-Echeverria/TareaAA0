
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
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      console.log(matrix[i][j] + " "); // Use "\t" for tab spacing between elements
    }
    console.log("\n"); 
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

/*
Funcion caida
+Entradas:
  -num: El numero que va a caer 
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
function caida(num, columna, matrix){
  for(let i = 0;i<matrix.length;i++){ //For que recorre las filas de la matriz
    if(matrix[i][columna] !== 0)      //Si el espacio no esta vacio 
      break;                          //Significa que no puede caer mas y por lo tanto se termina 
    else{                             //Si el espacio esta vacio
      matrix[i][columna] = num;       //Se coloca el numero en esa posicion
      if(i>0)                         //Si estamos en alguna fila despues de la 0 
        matrix[i-1][columna] = 0;     //Se elimina el numero de la posicion anterior
    }
  }
}