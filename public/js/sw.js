
const CACHE_NAME = 'todomvc',
urlsToCache=[
 	'./',
    './formulario.js',
    './main.js',
    './ruta.js',
    '../index.html',
    '../manifest.json',
    '../registro.html',
    '../img/ico1.png',
    '../img/ico2.png',
    '../css/estilos.css',
    '../css/style.css',
    '../../server/index.js'
]

self.addEventListener('install', e => {
  console.log('Evento: SW Instalado')
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Archivos en cache')
        return cache.addAll(urlsToCache)
      })
      .catch(err => console.log('Falló registro de cache', err) )
  )
})

self.addEventListener('activate', e => {
  console.log('Evento: SW Activado')
  const cacheList = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          //Eliminamos lo que ya no se necesita en cache
          if ( cacheList.indexOf(cacheName) === -1 )
            return caches.delete(cacheName)
        })
      )
    })
    .then(() => {
      console.log('Cache actualizado')
      // Le indica al SW activar el cache actual y que este a la espera de nuevo cache o cambio 
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', e => {
  console.log('Evento: SW Recuperando')

  e.respondWith(
    //Miramos si la petición coincide con algún elemento del cache
    caches.match(e.request)
      .then(res => {
        console.log('Recuperando cache')
        if ( res ) {
          //Si coincide lo retornamos del cache
          console.log('Recuperando con exito')
          return res
        }
        //Sino, lo solicitamos a la red
        return fetch(e.request)
        .then(res=> {
        	let resToCache = res.clone()
        	caches.open(CACHE_NAME)
        	.then(cache => {
        	cache
	        	.put(e.request,resToCache)
	        	.catch(err => console.log('${request.url} : ${err.message}'))
        	})
        console.log('Recuperando sin exito')
        	return res
        })
      })
    )
})

self.addEventListener('push', e => {
  console.log('Evento: SW Recuperando')
})