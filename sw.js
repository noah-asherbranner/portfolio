const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  'videos/pipetool.mp4',
  'videos/tellodrone.mp4',
  'videos/roboarm.mp4'
];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // IMPORTANT: Clone the request.
        // A request is a stream and can only be consumed once. 
        // Since we are consuming this once by cache and once by the browser for fetch, 
        // we need to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response.
            // A response is a stream and can only be consumed once.
            // Since we are consuming this once by cache and once by the browser for fetch,
            // we need to clone the response.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
