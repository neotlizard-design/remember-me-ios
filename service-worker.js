const cacheName = "smart-plate-he-v4";
const appShell = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "manifest.webmanifest",
  "assets/food-hero.jpg",
  "assets/app-icon.svg",
  "assets/app-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(appShell)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key === "smart-plate-v1" || (key.startsWith("smart-plate-he-") && key !== cacheName))
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
