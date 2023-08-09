//Matriz de globlal de logica 
const actual = {
  fila: 0,
  columna: 1,
  numero: 0
}  
matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
iniciar_cronometro();

async function main(){  
  if(!inGame){
    perder();
    return
  }
  actual.columna = Math.floor(Math.random() * 4);  // Se genera el número de la columna en que el número va a caer
  actual.numero = random_2_or_4_or_8();               // Se genera el número random que va a caer
  actual.fila = 0;
  actualizar_suma_de_piezas(actual.numero);
  for (let columna = 0; columna < 4; columna++) {
    reiniciar_casilla_generacion_numero(columna);
  }
  await caida(actual.numero, actual.fila, actual.columna, matrix);
  main();
}

main()