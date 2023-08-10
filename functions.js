let numero_movimientos = 0;
let suma_de_piezas_en_juego = 0;
let flagAction = false;
let inGame = true;
let mlsMovientoCasilla = 1000;
let contador_segundos = 0;
let contador_minutos = 0;

/*
Funcion que pausa la ejecucion del programa 
ENTRADAS:
  @ms: tiempo en milisegundos, que se desea pausar el programa
SALIDAS:
  Pausar la ejecucion del programa
*/

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
Funcion que genera un 2 o un 4 o un 8 aleatoriamente
ENTRADAS:

SALIDAS:
  +Numero 2 o 4 o 8(aleatoriamente)  
DESCRIPCION:
  Para replicar la generacion de numeros del juego la cual es aleatorio entre 2,4 o 8
*/
function random_2_or_4_or_8(){
  const random = Math.floor(Math.random() * 3);//Se genera un numero aleatorio del 0 al 3
  if(random === 1)
    return 4;
  else if(random == 2)
    return 8;
  else
    return 2;
}

/*
Listener de teclas presionadas
DESCRIPCION: 
  Cuando el usuario presiona alguna tecla se ejecuta el codigo de abajo.
  Dentro del programa solo se necesita saber cuando estas teclas son las teclas de abajo, derecha o izquierda
  Por lo tanto con un switch que abarque los casos es suficiente
*/
document.addEventListener('keydown',function(event) {
  if(inGame){//Primero se confirma si el usuario no ha perdido
    switch (event.key){//Se crea un switch con la tecla que se presiono 
      case 'ArrowLeft'://Caso que la tecla izquierda se presione
        tecla_izquierda_presionada();
        break;
      case 'ArrowRight'://Caso que la tecla derecha se presione
        tecla_derecha_presionada();
        break;
      case 'ArrowDown'://Caso que la tecla de abajo se presione
        mlsMovientoCasilla = 200;//Se reduce el tiempo con el que las piezas caen a 2 segundos
        break;
    }
  }
});

/*
Funcion cuando se presiona la tecla izquierda
ENTRADAS:

SALIDAS:
  Representacion grafica y logica del movimiento hacia la izquierda de la casilla que esta cayendo 

DESCRIPCION:
  Esta funcion solo se ejecuta en caso que el usuario haya presionado la tecla izquierda
  Confirma que la casilla que esta cayendo se puede mover hacia la izquierda(No esta en la columna 0)
  En caso que se puede mover
    Confirma si este movimiento provoca una suma de casillas(casilla de la izquierda es igual a la casilla cayendo)
    O si solo se mueve a un espacio vacio
*/ 
function tecla_izquierda_presionada(){
  if((actual.columna > 0) ){//Si nos encontramos en alguna columna que sea mayor a la 0
    if(actual.numero === matrix[actual.fila][actual.columna-1]){//Si la casilla cayendo es igual a la casilla de la izquierda
      suma_horizontal(-1);//Se pueden sumar horizontalmente a la izquierda
    }else if (matrix[actual.fila][actual.columna-1] === 0){//Si el espacio de la izquierda es igual a 0(esta vacio)
      mover_horizontalmente(-1);//La casilla cayendo se mueve a la izquierda
    }
  }
}

/*
Funcion cuando se presiona la tecla derecha
ENTRADAS:

SALIDAS:
  Representacion grafica y logica del movimiento hacia el lado derecho de la casilla que esta cayendo 

DESCRIPCION:
  Esta funcion solo se ejecuta en caso que el usuario haya presionado la tecla derecha
  Confirma que la casilla que esta cayendo se puede mover hacia la derecha(No esta en la columna 0)
  En caso que se puede mover
    Confirma si este movimiento provoca una suma de casillas(casilla de la derecha es igual a la casilla cayendo)
    O si solo se mueve a un espacio vacio
*/ 
function tecla_derecha_presionada(){
  if(actual.columna < 3){//Si nos encontramos en alguna columna que sea menor a la 3
    if(actual.numero === matrix[actual.fila][actual.columna+1]){//Si la casilla cayendo es igual a la casilla de la derecha
      suma_horizontal(1);//Se pueden sumar horizontalmente a la derecha
    }else if (matrix[actual.fila][actual.columna+1] === 0){//Si el espacio de la derecha es igual a 0(esta vacio)
      mover_horizontalmente(1)//La casilla cayendo se mueve a la derecha
    }
  }
}

/*
Suma de casillas de forma horizontal
ENTRADAS:
  @Orientacion: Hacia el lado del que se debe de sumar la casilla(derecha = 1, izquierda = -1)
SALIDAS:
  +Casilla resultado de la suma de forma grafica y logica
DESCRIPCION:
  Elimina la casilla actual
  Se suma con la casilla de la derecha o izquierda
  La casilla actual pasa a ser la casilla resultado de la suma
*/ 
function suma_horizontal(orientacion){
  reiniciar_casilla(actual.fila, actual.columna);//Se elimina de forma grafica la casilla actual
  matrix[actual.fila][actual.columna] = 0;//Se elimina de forma logica(en la matriz) en la casilla actual
  acomodarNumeros(actual.columna);//Se acomodan los numeros de la columna de la casilla que se elimino
  actual.columna+=orientacion;//La columna actual cambia dependiendo hacia donde se movieron las flechas(derecha = 1, izquierda = -1)
  sumar_casillas(actual.numero);//Se suman las casillas 
  actual.numero*=2;//Se actualiza el numero ya que ahora es el resultado de la suma de casillas
  acomodarNumeros(actual.columna);//Se acomodan los numeros de la columna donde quedo la casilla resultado de la suma
  actualizar_numero_movimientos();
}

/*
Movimiento de casillas de forma horizontal
ENTRADAS:
  @Orientacion: Hacia el lado del que se debe de mover la casilla(derecha = 1, izquierda = -1)
SALIDAS:
  +Movimiento de la casilla actual hacia la derecha o izquierda de forma grafica y logica
DESCRIPCION:
  Elimina la casilla actual
  Se genera una copia de la casilla en derecha o izquierda(dependiendo de la entrada) de la casilla eliminada
  La casilla generada pasa a ser la actual
*/ 
function mover_horizontalmente(orientacion){
  reiniciar_casilla(actual.fila, actual.columna);//Se elimina de forma grafica la casilla actual
  matrix[actual.fila][actual.columna] = 0;//Se elimina de forma logica(en la matriz) en la casilla actual
  acomodarNumeros(actual.columna);//Se acomodan los numeros de la columna de la casilla que se elimino
  actual.columna+=orientacion;//La columna actual se mueve dependiendo hacia donde se movieron las flechas(derecha = 1, izquierda = -1)
  matrix[actual.fila][actual.columna] = actual.numero;//Se genera la casilla en la matriz de logica
  mover_numero_de_casilla(actual.fila, actual.columna, actual.numero); //Se genera la casilla de forma grafica
  reiniciar_casilla_generacion_numero(actual.columna-orientacion);//Se elimina la casilla en la de la fila 0
  actualizar_numero_movimientos();
}

/*
Funcion para comprobar si el usuario ya perdio
ENTRADAS:
  @numero: El numero que se genero
  @columna: En la columna que va a caer el numero
  @matrix: La matriz en la que el numero va a caer 
SALIDA:
  +True: si en la fila 1 y en la columna en la que va a caer el numero es 0 o 
         si en la fila 1 y en la columna en la que va a caer el numero es igual al numero
  +False: si en la fila 1 y en la columna en la que va a caer el numero es diferente de 0 y
          si en la fila 1 y en la columna en la que va a caer el numero es diferente al numero
*/
function comprobar_condicion_partida(matrix, columna, numero){
  return matrix[1][columna] === 0 || matrix[1][columna] === numero;
}

/*
Funcion caida
ENTRADAS:
  @numero: El numero que va a caer 
  @fila: En la fila que va a caer
  @columna: En la columna que va a caer el numero
  @matrix: la matriz en la que el numero va a caer 
SALIDA:
  Efector de caida de casillas en el juego
DESCRIPCION:
  El numero empieza en la fila 0
  El numero baja fila por fila hasta que se encuentre con otro nummero o el final de la matriz
  En ese caso se termina la funcion
  (Bajar signinifica escribir el numero en la posicion actual y eliminarlo de la fila anterior)
*/
async function caida(columna, matrix){
  mlsMovientoCasilla = 1000;//cantidad de milisegundos para la pausa entre cada moviento de casilla
  reiniciar_casilla_generacion_numero(columna);//se coloca la casilla de generacion(casilla en la fila 0) con los valores por defecto
  for(actual.fila = 0; actual.fila < matrix.length; actual.fila++){//For para recorrer las filas de la matriz
    if(matrix[actual.fila][actual.columna] !== actual.numero && matrix[actual.fila][actual.columna] !== 0 && actual.fila > 0){//caso en el que se deba colocar un numero arriba de otro
      actual.fila--;//Nos movemos a la fila de arriba
      if(actual.fila === 0)//Si esta fila es la 0
        inGame = false;//Significa que ya se perdio
      mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);//coloca graficamente el numero en la casilla de arriba 
      matrix[actual.fila][actual.columna] = actual.numero;//lo mismo pero internamente en la matriz
      actual.fila = 0;
      return;
    } else if(matrix[actual.fila][actual.columna] === actual.numero){//caso en el que el numero generado sea igual al de la casilla actual
      reiniciar_casilla(actual.fila, actual.columna);//borra la casilla actual           
      await unir_numeros_vertical();//Se empiezan a unir los numeros 
      return;                                  
    }
    //generacion de efecto de caida por default, lo que se hace es colocar el numero en la casilla actual, pausar, continuar y borrar el actual0
    mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);//caso por default, mueve el numero a la casilla actual
    matrix[actual.fila][actual.columna] = actual.numero;
    await esperar(mlsMovientoCasilla);//pausa de x mls para generar el efecto de caida
    reiniciar_casilla(actual.fila, actual.columna);//borra la casilla actual         
    matrix[actual.fila][actual.columna] = 0;  
    reiniciar_casilla_generacion_numero(actual.columna);  //se coloca la casilla de generacion con los valores por defecto
  }
  actual.fila--;
  matrix[actual.fila][actual.columna] = actual.numero;//se coloca el numero generadi en el fondo de la columna[0]
  mover_numero_de_casilla(actual.fila, actual.columna, actual.numero);//hace lo mismo pero graficamente
  actual.fila = 0;//Para que vuelva a al principio de la matriz
}

/* 
ENTRADAS:
  @numero: el numero de entrada el cual se va a sumar
SALIDAS:
  Una casilla resultado de esa suma
DESCRIPCION:
  Al encontrar una casilla adyacente vertical, con el mismo valor, se une en una sola multiplicando su valor por 2.
  Este proceso, al entrar a la funcion, se hace al menos 1 vez, y despues se va verificando si debajo de esta casilla se produce el mismo efecto.
*/
async function sumar_casillas(numero){
  numero *= 2;//numero ingresado multiplicado por dos
  matrix[actual.fila][actual.columna] = numero;//se coloca el numero duplicado en la casilla (efecto de union)
  mover_numero_de_casilla(actual.fila, actual.columna, numero);//efecto de union en la parte grafica
}

/*
Une casillas de forma horizontal
SALIDA:
  La union vertical de numeros para una columna.
DESCRIPCION:
  Une dos casillas en forma vertical
  Repite el proceso hasta que ya no se puedan unir mas.
*/
async function unir_numeros_vertical(){
  const mlsMovientoCasilla = 500;//mls de espera cuando cada vez que se produce el efecto de unir dos casillas
  sumar_casillas(actual.numero); //se suman las casillas para unirlas
  actual.numero*=2; //duplica el numero actual
  while(actual.fila < matrix.length - 1){ //repite el proceso hasta que ya no se puedan unir mas
    await esperar(mlsMovientoCasilla);//pausa la ejecucion del programa, segun los ms segundos enviados
    if(actual.fila === matrix.length-1){//verifica si la fila actual se encuentra en la ultima fila para salirse
      break;
    }
    if(actual.numero === matrix[actual.fila + 1][actual.columna]){//comprueba si el numero actual es igual a al que esta en la casilla inferior
      matrix[actual.fila][actual.columna] = 0;//se coloca un 0 en la casilla actual 
      reiniciar_casilla(actual.fila, actual.columna);//se reinicia la casilla (es decir, se pone tal cual como esta al inicio de la ejecucion)               
      actual.fila++;//incrementa la fila actual
      sumar_casillas(actual.numero);//une la casilla actual con la inferior
      actual.numero*=2;//duplica el numero
    }else{//caso en el que no haya que unir, simplemente detiene el ciclo
      break;
    }
  }
  acomodarNumeros(actual.columna);//acomoda los numeros de la columna actual, para evitar dejar espacios vacios entre casillas
  actual.fila = 0;//reinicia la fila actual
}

/*
ENTRADAS:
  @columna: la columna en la que se acomodaran los numeros
SALIDA:
  Una columna completamente acomodada
DESCRPICION:
  Se recorre la columna desde abajo hasta arriba
  Comparando siempre el de arriba con el actual
  En caso que se encuentre dos casillas iguales
    Las suma y se devuelve a la parte de abajo de la columna
  En caso que se encuentre un numero arriba y un 0 debajo 
    Mueve el numero hacia la posicion del 0
*/

async function acomodarNumeros(columna){
  for(let fila = matrix.length - 1; fila > 1; fila--){ //empieza a recorrer desde la ultima fila hasta la fila 2
    let filaArriba = fila - 1;//se obtiene la fila de arriba 
    let num = matrix[filaArriba][columna];//se obtiene el numero que este por arriba de la fila actual
    if(num !== 0){//comprueba que la casilla de arriba no este vacia
      if(matrix[fila][columna] === 0){//comprueba si la casilla actual esta vacia, para bajar el numero de arriba              
        matrix[filaArriba][columna] = 0;//le pone un cero a la casilla de arriba
        reiniciar_casilla(filaArriba, columna);//lo hace graficamente
        matrix[fila][columna] = num;//le coloca a la casilla actual el numero de arriba
        mover_numero_de_casilla(fila,columna, num);//lo hace graficamente
        fila = matrix.length;//Para que en la siguiente iteracion inicie desde abajo de nuevo
      }else if(num === matrix[fila][columna]){ //comprueba si la casilla actual tiene el mismo numero que la de arriba, para unirlos
        matrix[filaArriba][columna] = 0;//pone la casilla de arriba vacia
        reiniciar_casilla(filaArriba, columna);//lo hace graficamente
        actual.fila = fila;//actualiza la fila actual, para llamar el metodo sumar la casilla que le correponde
        sumar_casillas(num);//suma las casillas
        num*=2;//se actualiza el numero ya que este se sumó
        if(actual.numero*2 === num)//Si el doble del numero actual es igual a num
          actual.numero = num;//le pone al numero actual el resultado de la union
        acomodarNumeros(columna);//Se acomodan los numeros que estan en la columna de las suma
      }
    }
  }
  return 0;
}

/*
Cambia el color de una casilla
ENTRADAS:
  @fila: fila a moficar
  @columna: columna a modificar
  @color: color a colocar en la casilla
SALIDAS:
  La casilla modificada con el color enviado
DESCRIPCION:
  Cambia el color de la casilla segun la fila y columna.
  Verifica que la casilla no sea nula, es decir que las posiciones enviadas sean validas
  Usa el formato de entrada #123456
*/
function cambiar_color_casilla(fila, columna, color){
  const casilla = document.getElementById('casilla' + fila + columna);
  if(casilla != null){
    casilla.style.backgroundColor = color;
  }
  
}

/*
Cambia el numero de una casilla
ENTRADAS:
  @fila: fila a moficar
  @columna: columna a modificar
  @numero: numero a colocar en la casilla
SALIDAS:
  La casilla modificada con el numero enviado
DESCRIPCION:
  Cambia el numero de la casilla segun la fila y columna.
  Verifica si el numero no es nulo.
*/
function cambiar_numero_casilla(fila, columna, numero){
  const casilla = document.getElementById('casilla'+ fila + columna);
  if(numero !== null ){
    casilla.textContent = numero;
  }else{
    casilla.textContent = null;
  }
}

/*
borra el numero de una casilla
ENTRADAS:
  @fila: fila a borrar
  @columna: columna a borrar
SALIDAS:
  La casilla con el numero borrado
DESCRIPCION:
  Borra el numero de la casilla segun la fila y columna.
  Verifica que la casilla no sea nula, es decir que las posiciones enviadas sean validas
  Coloca en null el contenido de la casilla
*/
function borrar_numero_casilla(fila, columna){
  const casilla = document.getElementById('casilla' + fila + columna);
  if(casilla != null){
    casilla.get
    casilla.textContent = null;
  }
  
}

/*
Reinicia una casilla, es decir, le coloca el color inicial y le borra el numero
ENTRADAS:
  @fila: fila a moficar
  @columna: columna a modificar

SALIDAS:
  La casilla reiniciada
DESCRIPCION:
  Le pone el color original a la casilla segun la fila y columna.
  El color usa el formato de entrada #123456
*/
function reiniciar_casilla(fila, columna){
  cambiar_color_casilla(fila, columna, '#9A80E1');
  borrar_numero_casilla(fila, columna);
}

/*
Reinicia una casilla de generacion de numeros, es decir, le coloca el color inicial y le borra el numero
ENTRADAS:
  @columna: columna a modificar
SALIDAS:
  La casilla de generacion reiniciada
DESCRIPCION:
  Le pone el color original a la casilla de generacion de numeros segun la fila y columna.
  El color usa el formato de entrada #123456
*/
function reiniciar_casilla_generacion_numero(columna){
  cambiar_numero_casilla(0, columna, null);
  cambiar_color_casilla(0, columna, "#6437E1");
}

/*
Mueve el numero a otra casilla, y le pone color
ENTRADAS:
  @fila: fila a moficar
  @columna: columna a modificar
  @num: numero a colocar en la casilla
SALIDAS:
  La casilla modificada con el numero y color correspondiente
DESCRIPCION:
  Le pone el color blanco a la casilla 
  El color usa el formato de entrada #123456
  Y finalmente le pone el numero enviado
*/
function mover_numero_de_casilla(fila, columna, num){
  cambiar_color_casilla(fila, columna,'#FFFFFF');
  cambiar_numero_casilla(fila, columna,  num);
}

/*
Mueve el numero a otra casilla, y le pone color
ENTRADAS:
SALIDAS:
  Aumenta en 1 el numero de movientos realizados hasta el momento
DESCRIPCION:
  Le suma 1 al numero de movientos y lo actualiza en la parte grafica
*/
function actualizar_numero_movimientos(){
  numero_movimientos++;
  const casilla = document.getElementById('numero_de_movimientos');
  casilla.textContent = numero_movimientos;
}

/*
Actualiza el cronometro
ENTRADAS:
  @minutos: minutos actuales
  @segundos: segundos actuales
SALIDAS:
  Actualiza graficamente el cronometro 
DESCRIPCION:
  Se actualiza el cronometro graficamente
*/
function actualizar_cronometro(minutos,segundos){
  if(Math.floor(segundos / 10) === 0){
    segundos = "0"+segundos;
  }
  const casilla = document.getElementById('tiempo');
  casilla.textContent = minutos + " : " + segundos;
}

/*
Inicia el cronometro
ENTRADAS:
SALIDAS:
  Iniciar el cronometro
DESCRIPCION:
  Se inicia el cronometro
  Se sigue actualizando mientras la partida no hay finalizado
*/
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

/*
Actualiza la sumatoria de las piezas en la matrix
ENTRADAS:
  @num: cada numero aleatorio que se vaya generando
SALIDAS:
  La suma entre el nuevo rand y la sumatoria actual
DESCRIPCION:
  Va llevando la sumatorio actual y le agrega cada numero ingresado
  Lo actualiza graficamente
*/
function actualizar_suma_de_piezas(num){
  suma_de_piezas_en_juego += num;
  const casilla = document.getElementById('suma_de_piezas');
  casilla.textContent = suma_de_piezas_en_juego;
}

/*
Funcion de game over
ENTRADAS:
SALIDAS:
  Se despliega una pantalla con el resumen de la partida
DESCRIPCION:
  Se le indica al usuario que se perdio
  Se despliega el resumen que contiene:
    El tiempo total
    Movimientos totales realizados
    Sumatorio total de las piezas en la matriz
*/
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

/*
Listener que verifica si se pulsa el boton de reiniciar la partida
DESCRIPCION:
  Se despliega una vez finalizada la partida
  En caso de seleccionar reiniciar partida se llama a la funcion que ejecuta dicho proceso
*/
const restart_button = document.getElementById("restart_button");
restart_button.addEventListener('click', function() {
  const div = document.getElementById('game_over_screen');
  div.style.display = 'none';
  restart_game();
});

/*
Reinicia una nueva partida
ENTRADAS:
SALIDAS:
  Una nueva partida desde cero
DESCRIPCION:
  Reinicia los datos del resumen de la partida
  Reinicia las posiciones actuales y el numero
  Reinicia la condicion de juego 
  Y recorre todas las casilla para reiniciar el numero y sus colores.
  Finalmente llama de nuevo al main
*/
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