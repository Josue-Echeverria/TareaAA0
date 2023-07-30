//Matriz de globlal de logica 
let matrix = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];


/*
TO DELETE
EL MAIN SOLO EN PROTOTIPO PARA QUE LO QUE ESTE ADENTRO SE EJECUTE CADA 2.5
FUNCIONA COMO UN TIPO DE RECURSIVIDAD YA QUE AL FINAL SE ESTA LLAMANDO A SI MISMA 
(SE PUEDE CAMBIAR)
*/

async function main(){  
  //Se genera el numero de la columna en que el numero va a caer
  const columnaAleatoria = Math.floor(Math.random() * 4);
 
  //Se genera el numero random que va a caer
  let numAleatorio = random_2_or_4_or_8();
 
  /*
  Aqui se deberia de mostrar ese numero en la parte de arriba del tablero
  */ 

  for(let columna = 0; columna < matrix.length; columna++){
    reiniciar_casilla_generacion_numero(columna);
  }

  mover_numero_de_casilla(-1, columnaAleatoria, numAleatorio)
  
  if(comprobar_condicion_partida(matrix, columnaAleatoria, numAleatorio)){
    //Funcion que genera el efecto de caida dentro de la matriz
    await caida(numAleatorio, 0, columnaAleatoria, matrix);
    main();
  }

  else{
    return;
  }
}

main()