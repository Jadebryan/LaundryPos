// Service Worker for Offline Support
const CACHE_NAME = 'laundry-pos-v2'
const RUNTIME_CACHE = 'laundry-runtime-v2'
const STATIC_CACHE = 'laundry-static-v2'

// Critical assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip API requests (handled by queue system)
  if (url.pathname.startsWith('/api/')) {
    return
  }

  // Network first strategy for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request)
        })
    )
    return
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request)
          .then((response) => {
            if (response.ok) {
              const responseClone = response.clone()
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone)
              })
            }
            return response
          })
      })
  )
})

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (!event.data) return
  if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(RUNTIME_CACHE).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true })
      }
    })
  }
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

