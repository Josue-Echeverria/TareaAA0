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

function main(){
  //Se genera el numero de la columna en que el numero va a caer
  const posicion_random_j = Math.floor(Math.random() * 4);
 
  //Se genera el numero random que va a caer
  let nuevo_random = random_2_or_4_or_8();
 
  /*
  Aqui se deberia de mostrar ese numero en la parte de arriba del tablero
  */ 

  //Funcion que genera el efecto de caida dentro de la matriz
  caida(nuevo_random,posicion_random_j,matrix);

  printMatrix(matrix);

  //ESTE ES EL FINAL
  //Aqui se confirma si hay movimientos en la matriz(si no se ha llenado)
  if(confirmar_movimientos_en_matriz(matrix))//Si aun hay movimientos en la matriz(campo para que los numeros caigan)
    setTimeout(main,2500);//Se vuelve a llamar al main despues que pasen 2500ms
  else//Si ya no hay movimientos 
    return;//Se hace un return vacio para ya salir de la funcion
}

main();