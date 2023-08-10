//Clase globlal que tiene todas las variables actuales 
const actual = {
  fila: 0,
  columna: 1,
  numero: 0
}  
//Matriz de globlal de logica 
matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

iniciar_cronometro();

/*
Funcion principal para la ejecucion de todo el programa
DESCRIPCION:
  Se genera el numero aleatriamente que va a caer 
  Se genera la columna aleatoria en la que va a caer
  Se llama a una funcion que va a mover el numero fila por fila dentro de la columna generada
  Confirmamos que el numero cayo exitosamente(no perdio)
  Si es asi se vuelve a ejecutar la funcion
*/
async function main(){  
  if(!inGame){//Se comprueba si el usuario no ha perdido
    perder();//Se invoca la funcion para mostrar un resumen y la opcion de reiniciar
    return;
  }
  actual.columna = Math.floor(Math.random() * 4);//Se genera el número de la columna en que el número va a caer
  actual.numero = random_2_or_4_or_8();//Se genera el número random que va a caer
  actual.fila = 0;//Se reinicia la fila para que empieze desde el inicio 
  actualizar_suma_de_piezas(actual.numero);//Se suma el numero generado 
  for (let columna = 0; columna < 4; columna++) {//For para recorrer las columnas 
    reiniciar_casilla_generacion_numero(columna);//Se elimina cualquier numero que se encuentre en la fila 0
  }
  await caida(actual.columna, matrix);//funcion que baja el numero fila por fila en la columna que se genero 
  main();//Se vuelve al inicio de la funcion main 
}

main()