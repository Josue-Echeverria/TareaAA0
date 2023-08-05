//Matriz de globlal de logica 
let matrix = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
iniciar_cronometro();

let columnaAleatoria = [1];
let filaActual = [0];
let numAleatorio = [0];
async function main(){  
  //Se genera el numero de la columna en que el numero va a caer
  columnaAleatoria[0] = Math.floor(Math.random() * 4);
 
  //Se genera el numero random que va a caer
  numAleatorio[0] = random_2_or_4_or_8();
  actualizar_suma_de_piezas(numAleatorio[0]);
  let arrayTemp = [0];
  for(let columna = 0; columna <4; columna++){
    arrayTemp[0] = columna;
    reiniciar_casilla_generacion_numero(arrayTemp);
  }
  filaActual[0] = 0;
  mover_numero_de_casilla(filaActual, columnaAleatoria, numAleatorio)

  if(comprobar_condicion_partida(matrix, columnaAleatoria[0], numAleatorio)){
    await caida(numAleatorio, filaActual, columnaAleatoria, matrix);
    main();
  }
  else{
    inGame =false;
    perder();
    return;
  }
}

main()