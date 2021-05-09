require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, inquirePausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
const { Tareas } = require('./models/tareas');

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if (tareasDB) {
        //establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    // await inquirePausa();

    do {

        // esta funcion imprime el menu
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripcion: ');
                tareas.crearTarea(desc);
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3':
                tareas.listarPendientesCompletadas();
                break;

            case '4':
                tareas.listarPendientes();
                break;
            case '5':
              const ids=  await mostrarListadoCheckList(tareas.listadoArr);
                tareas.toggleCompletadas(ids);
                break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                if (id !== '0') {
                    const ok = await confirmar('¿Esta Seguro que desea Borrar?');
                    if(ok) {tareas.borrarTarea(id);
                        console.log('Tarea Borrada');
                    }
                }
            break;
                
        }
        guardarDB(tareas.listadoArr);


        await inquirePausa();

    } while (opt !== '0');
}

main();

