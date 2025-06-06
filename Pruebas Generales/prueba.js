// script.js

const productos = [
    {
        id: 1,
        nombre: 'Auriculares Inalámbricos X1',
        descripcion: 'Experimenta un sonido nítido y graves potentes con cancelación de ruido activa.',
        precio: '€99.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 2,
        nombre: 'Auriculares Bluetooth Z2 Pro',
        descripcion: 'Disfruta de tu música favorita con la mejor calidad de audio y gran autonomía.',
        precio: '€129.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 3,
        nombre: 'Cascos Deportivos R5',
        descripcion: 'Diseñados para el ejercicio intenso, resistentes al sudor y con ajuste seguro.',
        precio: '€79.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 4,
        nombre: 'Audífonos Gaming G3',
        descripcion: 'Inmersión total en tus juegos con sonido envolvente y micrófono con cancelación de ruido.',
        precio: '€149.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 5,
        nombre: 'Auriculares de Diadema Clásicos',
        descripcion: 'Comodidad y estilo vintage con un sonido balanceado para todas tus pistas.',
        precio: '€89.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 6,
        nombre: 'In-Ear Ergonómicos S6',
        descripcion: 'Aislamiento de ruido pasivo y ajuste perfecto para llevarlos todo el día.',
        precio: '€59.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 7,
        nombre: 'Auriculares Plegables Viajeros',
        descripcion: 'Ligeros y fáciles de transportar, ideales para tus desplazamientos diarios.',
        precio: '€69.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 8,
        nombre: 'Mini Auriculares Discretos',
        descripcion: 'Pequeños pero potentes, perfectos para una escucha discreta en cualquier lugar.',
        precio: '€49.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 9,
        nombre: 'Auriculares Infantiles Seguros',
        descripcion: 'Volumen limitado para proteger los oídos de los más pequeños, con diseños divertidos.',
        precio: '€39.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 10,
        nombre: 'Auriculares de Conducción Ósea',
        descripcion: 'Escucha tu música sin bloquear el sonido ambiente, ideal para deportes al aire libre.',
        precio: '€119.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 11,
        nombre: 'Auriculares con Cable Reforzado',
        descripcion: 'Durabilidad extrema y sonido de alta fidelidad para un uso prolongado.',
        precio: '€45.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 12,
        nombre: 'Auriculares Profesionales Estudio',
        descripcion: 'Precisión de audio para mezclas y masterizaciones, con almohadillas super cómodas.',
        precio: '€199.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 13,
        nombre: 'Auriculares USB-C Modernos',
        descripcion: 'Conexión directa para dispositivos de última generación, sin necesidad de adaptadores.',
        precio: '€55.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 14,
        nombre: 'Auriculares con Cancelación Híbrida',
        descripcion: 'Tecnología avanzada para bloquear el ruido ambiental y sumergirte en tu música.',
        precio: '€169.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
        id: 15,
        nombre: 'Auriculares de Clip Ligeros',
        descripcion: 'Ideales para actividades al aire libre, se ajustan cómodamente y no se caen.',
        precio: '€35.99',
        imagenUrl: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
];

const productosContainer = document.getElementById('productos-container');

function crearTarjetaProducto(producto) {
    // Crear el contenedor principal de la tarjeta
    const card = document.createElement('div');
    card.classList.add('product-card'); // Añade la clase CSS base para la tarjeta

    // Crear el contenedor de la imagen
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('product-card-image-container');

    // Crear la imagen
    const imagen = document.createElement('img');
    imagen.src = producto.imagenUrl;
    imagen.alt = producto.nombre;
    imagen.classList.add('product-card-image'); // Añade la clase CSS para la imagen

    imageContainer.appendChild(imagen); // Añade la imagen a su contenedor

    // Crear el contenedor de los detalles del texto
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('product-card-details');

    // Crear el título
    const titulo = document.createElement('h3');
    titulo.classList.add('product-card-title');
    titulo.textContent = producto.nombre;

    // Crear la descripción
    const descripcion = document.createElement('p');
    descripcion.classList.add('product-card-description');
    descripcion.textContent = producto.descripcion;

    // Crear el precio
    const precio = document.createElement('span');
    precio.classList.add('product-card-price');
    precio.textContent = producto.precio;

    // Añadir título, descripción y precio al contenedor de detalles
    detailsContainer.appendChild(titulo);
    detailsContainer.appendChild(descripcion);
    detailsContainer.appendChild(precio);

    // Añadir el contenedor de la imagen y el contenedor de detalles a la tarjeta principal
    card.appendChild(imageContainer);
    card.appendChild(detailsContainer);

    // Añadir interactividad con classList
    card.addEventListener('click', () => {
        // Al hacer click, alterna la clase 'highlight-card'
        card.classList.toggle('highlight-card');
        console.log(`Tarjeta "${producto.nombre}" ${card.classList.contains('highlight-card') ? 'resaltada' : 'normal'}`);
    });

    // Ejemplo de añadir/remover clases programáticamente (por ejemplo, después de un tiempo)
    if (producto.id === 2) { // Deshabilitar el segundo producto después de 3 segundos
        setTimeout(() => {
            card.classList.add('disabled-card');
            console.log(`Tarjeta "${producto.nombre}" deshabilitada.`);
        }, 3000);

        setTimeout(() => {
            card.classList.remove('disabled-card');
            console.log(`Tarjeta "${producto.nombre}" habilitada de nuevo.`);
        }, 6000);
    }

    return card;
}

// Recorrer los datos de los productos y crear una tarjeta para cada uno
productos.forEach(producto => {
    const nuevaCard = crearTarjetaProducto(producto);
    productosContainer.appendChild(nuevaCard); // Añadir la tarjeta al contenedor en el HTML
});