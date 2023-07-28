
// peticion con async-await
const cargarMates = async () => {
    const res = await fetch("mates.json")
    const data = await res.json()
    console.log(data)
    for (let mate of data) {
        let mateData = new Mate(mate.id, mate.tipo, mate.precio, mate.imagen)
        matesPush.push(mateData)
    }
    console.log(matesPush)
    localStorage.setItem("matesPush", JSON.stringify(matesPush))
}


let matesDiv = document.getElementById("mates")
let btnGuardarMateBtn = document.getElementById("guardarMateBtn")
let botonCarrito = document.getElementById("botonCarrito")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let buscador = document.getElementById("buscador")
let botonFinCompra = document.getElementById("botonFinalizarCompra")


class Mate {
    constructor(id, tipo, precio, imagen) {
        this.id = id,
            this.tipo = tipo,
            this.precio = precio,
            this.imagen = imagen
    }

    mostrarInfoMate() {
        console.log(`Mate ${this.tipo}, tiene un precio de ${this.precio}`)
    }

}

let matesPush = []

if (localStorage.getItem("matesPush")) {
    matesPush = JSON.parse(localStorage.getItem("matesPush"))
} else {
    cargarMates()
}

// array con productoss en carrito
let productosEnCarrito
if (localStorage.getItem("carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
} else {
    //no existe nada en el storage
    productosEnCarrito = []
    localStorage.setItem("carrito", productosEnCarrito)
}


function cargarProductosCarrito(array) {
    modalBodyCarrito.innerHTML = ``
    // primer for each imprimer  card
    array.forEach((productoCarrito) => {
        modalBodyCarrito.innerHTML += `
    
         <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                  <img class="card-img-top" src="${productoCarrito.imagen}" alt="">
                  <div class="card-body">
                         <h4 class="card-title">${productoCarrito.tipo}</h4>
                         <p class="card-text">$${productoCarrito.precio}</p> 
                          <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                  </div>    
             </div>
       
    `
    })
    // segundo for each elimina
    array.forEach((productoCarrito) => {
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () => {
            console.log(`eliminar producto`)
            // borrar del dom
            let cartaproducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cartaproducto.remove()
            // borrar del array
            let productoEliminar = array.find((mate) => mate.id == productoCarrito.id)
            console.log(productoEliminar)

            let posicion = array.indexOf(productoEliminar)
            console.log(productoEliminar)

            array.splice(posicion, 1)

            localStorage.setItem("carrito", JSON.stringify(array))
            calcularTotal(array)
        })
    })

    calcularTotal(array)
}

function finalizarCompra(array) {
    Swal.fire({
        title: 'Esta seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si.',
        cancelButtonText: 'No.',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',

    }).then((result) => {
        if (result.isConfirmed) {
            let totalFinal = calcularTotal(array)
            Swal.fire({
                title: 'Compra realizada',
                icon: 'success',
                confirmButtonColor: 'green',
                text: `Muchas gracias, ha adquirido nuestros mates. Deber abonar ${totalFinal} `,
            })
            productosEnCarrito = []
            localStorage.removeItem("carrito")

        } else {
            Swal.fire({
                title: 'Compra no realizada',
                info: 'info',
                text: 'La compra no ha sido realizada, su carrito sigue intacto.',
                confirmButtonColor: 'green',
                timer: 2500
            })
        }
    })
}

function calcularTotal(array) {

    //DOS PARAMETROS: primero la function y segundo valor en el que quiero inicializar el acumulador
    let total = array.reduce((acc, productoCarrito) => acc + productoCarrito.precio, 0)
    // console.log(`El total es ${total}`)
    total == 0 ? precioTotal.innerHTML = `No hay productos en el carrito` : precioTotal.innerHTML = `El total es <strong>${total}</strong>`
return total
}


function mostrarCatalogo(array) {
    matesDiv.innerHTML = ``
    for (let mate of matesPush) {

        let nuevoMateDiv = document.createElement("div")
        nuevoMateDiv.className = "col-12 col-md-4 col-lg-4 my-2"
        nuevoMateDiv.innerHTML = `<div id="${mate.id}" class="card">
    <img src="${mate.imagen}" alt="${mate.tipo}" class="card-img-top img-fluid">
        <div class="card-body">
            <h4 class="card-title">
                <p>${mate.tipo}</p>
                <p>${mate.precio}</p>
                <button id="agregarBtn${mate.id}" class="btn btn-outline-success"> Agregar al carrito</button>
            </h4>
        </div>`
        matesDiv.appendChild(nuevoMateDiv)

        let agregarBtn = document.getElementById(`agregarBtn${mate.id}`)
        agregarBtn.addEventListener("click", () => {

            agregarAlCarrito(mate)
        })
    }
}



function agregarAlCarrito(mate) {
    //preguntar si existe ese mate en el array
    let mateAgregado = productosEnCarrito.find((elem) => elem.id == mate.id)
    //me devuelve sino encuentra undefined, si encuenta el elemento
    if (mateAgregado == undefined) {
        //código para sumar al array carrito
        productosEnCarrito.push(mate)
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        console.log(productosEnCarrito)
    } else {
        //sumar uno a cantidad
        console.log(`El mate ${mate.tipo} ya está en el carrito `)
    }
}

btnGuardarMateBtn.addEventListener("click", function (event) {
    event.preventDefault()
    agregarMate(matesPush)
    console.log(`${matesPush}`)
})

// AGREGAR MATE PARA DOM
function agregarMate(array) {
    let tipoMate = document.getElementById("tipoInput")
    let precioMate = document.getElementById("precioInput")
    const mateNuevo = new Mate(array.length + 1, tipoMate.value, parseInt(precioMate.value), "multimedia/mateNuevo.jpg")
    array.push(mateNuevo)
    localStorage.setItem("matesPush", JSON.stringify(array))
    mostrarCatalogo(matesPush)
}

let stock = (localStorage.getItem("carrito") || `No existen mates en el carrito`)

botonCarrito.addEventListener("click", () => {
    cargarProductosCarrito(productosEnCarrito)
})

botonFinCompra.addEventListener("click", () => {
    finalizarCompra(productosEnCarrito)
})

let coincidencia = document.getElementById("coincidencia")
function buscarInfo(buscado, array) {
    let busqueda = array.filter(
        (dato) => dato.tipo.toLowerCase().includes(buscado.toLowerCase())
    ) || dato.id.toLowerCase().includes(buscado.toLowerCase())
    busqueda.length == 0 ?
        (coincidencia.innerHTML = `<h3>No hay coincidencias con la búsqueda ${buscado}</h3>`,
            mostrarCatalogo(busqueda)) :
        (coincidencia.innerHTML = "", mostrarCatalogo(busqueda))
}

buscador.addEventListener("input", () => {
    buscarInfo(buscador.value, matesPush)
})

mostrarCatalogo(matesPush)