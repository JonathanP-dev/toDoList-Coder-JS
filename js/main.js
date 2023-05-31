// obtengo del document los diferentes elementos a utilizar
// en este caso, el contenedor de la lista de tareas y el div alert.
const list = document.getElementById( 'todo-list' );
const alert = document.getElementById( 'alert' )

// para asegurarme de tener algo para guardar en el local storage si esta vacio seteo el arreglo
const toDoList = []

// este componente funcional muestra la alerta en las diferentes situaciones.
// recibe por parametro el tipo de alerta (error, success) y el mensaje de la misma
// voy cambiando el texto y seteando las clases para poder mostrar la alerta.
const showAlert = ( type, msg ) => {
  alert.innerHTML = msg;
  alert.classList.toggle( 'show' );
  alert.classList.toggle( `${type}` );
  setTimeout( () => {
    alert.classList.toggle( 'show' );
    alert.classList.toggle( `${type}` );
    alert.innerHTML = ''
  }, 1500 )

}

// esta funcion sirve para crear la tarea, recibe por parametros el texto de la tarea
// el mismo lo voy a sacar del input que uso para agregar.
const createTask = ( taskText ) => {

  // encierro todo en un try/catch para asegurarme que haya error al leer del localStorage
  // y ya soluciono el problema del array vacio.
  try {
    // para empezar me aseguro que se ingrese un texto como tarea, si no lo hace muestro alerta y salgo
    if ( taskText == '' ) {
      showAlert( 'error', 'Empty task. Try again.' )
      return
    }

    // leo la lista del local storage
    const toDoListStorage = localStorage.getItem( 'toDoList' )
    const toDoList = JSON.parse( toDoListStorage );

    // verifico si existe una tarea con esa misma descripcion, en caso de que exista aviso y salgo de la funcion
    const found = toDoList.find( task => task.task == taskText )
    console.log( found )
    if ( found ) {
      console.log( alert )
      showAlert( 'error', `'${taskText}' is already in the list.` )
      return
    }

    // si paso los filtros anteriores ya puedo agregar la tarea
    // creo el objeto, lo agrego al arreglo, lo guardo en el localStorage y muestro la alerta correspondiente
    const newTask = { id: Date.now(), task: taskText }
    toDoList.push( newTask )
    localStorage.setItem( 'toDoList', JSON.stringify( toDoList ) )
    showAlert( 'success', `Task added correctly.` )
  } catch ( error ) {

    // en caso de entrar al catch, seria porque no puede leer esa key en el Storage
    // para solucionarlo igualo el toDoList a un array vacio y llamo recursivamente a la funcion
    const toDoList = []
    localStorage.setItem( 'toDoList', JSON.stringify( toDoList ) )
    createTask( taskText )
  }

}

// esta funcion va a manejar el uso del boton delete (eliminar tarea)
const handleDelete = ( e ) => {

  // esta constante va a almacenar el texto de la tarea a eliminar
  // para acceder al mismo obtengo el padre del boton y busco el primer hijo (span con el texto de la tarea)
  // extraigo el texto y lo guardo.
  const taskToDelete = e.target.parentNode.firstChild.textContent

  try {
    // leo el local storage, en este caso no puede estar vacio ya que para que exista el boton tiene que existir
    // la lista en el localStorage
    const toDoListStorage = localStorage.getItem( 'toDoList' )
    const toDoList = JSON.parse( toDoListStorage );

    // filtro lo que obtuve menos la tarea que tenga el mismo texto que tiene la que voy a eliminar
    const newToDoList = toDoList.filter( item => item.task !== taskToDelete )

    // por las dudas chequeo que se haya filtrado algo (deberia filtrarse siempre)
    if ( toDoList.length == newToDoList.length ) return

    // guardo el nuevo array en el localStorage y vuelvo a leer el mismo para refrescar los datos de la lista.
    localStorage.setItem( 'toDoList', JSON.stringify( newToDoList ) )
    readList()

    showAlert( 'success', 'Task deleted correctly.' )
  } catch ( error ) {
    console.log( error )
  }
}

// esta funcion se va a encargar de leer el localStorage y agregar al dom la lista
const readList = () => {
  try {
    // en principio voy a setear el texto de la lista a vacio, para asegurarme que no se duplique informacion
    list.innerHTML = ``

    // leo el localStorage
    const toDoListStorage = localStorage.getItem( 'toDoList' )
    const toDoList = JSON.parse( toDoListStorage );

    if ( toDoList.length == 0 ) return list.innerHTML = `NO TASK TO SHOW`
    // recorro el array que obtuve del storage y por cada elemento creo un li que insertare en la lista que obtuve al inicio
    // adicionalmente voy a agregar un boton que va a escuchar el evento click para llamar a la funcion handleDelete
    toDoList.forEach( item => {
      const taskContainer = document.createElement( 'li' )
      const btnDelete = document.createElement( 'button' )
      btnDelete.innerHTML = `delete`
      btnDelete.classList.add( 'btn-delete' )
      btnDelete.addEventListener( 'click', ( e ) => handleDelete( e ) )

      const task = document.createElement( 'span' )
      task.innerHTML = `${item.task}`
      taskContainer.classList.add( 'task' )
      taskContainer.append( task )
      taskContainer.append( btnDelete )
      list.append( taskContainer )
    } );

  } catch ( error ) {
    // en caso de que haya un error para leer el localStorage (la primera vez siempre va a haber ya que no deberias tener tareas cargadas si no usaste la app)
    // muestro el mensaje de que no hay.
    list.innerHTML = `NO TASK TO SHOW`
  }

}

// ejecuto la lectura de lista
readList()

// obtengo el boton agregar y el input del lado 'to do' de la aplicacion.
const addBtn = document.getElementById( 'add-btn' )
const inputTask = document.getElementById( 'task' )

// al boton agregar le agrego la escucha al evento click, una vez que lo clickeo se ejecuta el createTask, el readList y limpio el contenido del input
// al ser de tipo submit debo asegurarme de no refrescar la pagina instantaneamente, para eso uso el event.preventDefault()
addBtn.addEventListener( 'click', ( e ) => {
  e.preventDefault()
  createTask( inputTask.value.toUpperCase() )
  readList( toDoList )
  inputTask.value = ''
} )
