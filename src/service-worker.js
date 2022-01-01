/**
 * @file service-worker.js
 * 
 * @brief Implement a ServiceWorker for a simple PWA.
 *
 * This uses Workbox to implement pre-caching, caching, and background sync.
 *
 * Pre-caching is implemented by a single call using a manifest generated
 * by webpack during the build.
 *
 * Caching and background sync are implemented by hooking network transfers.
 * The Workbox pattern for this is to associate plugins with routes.
 */
import { precacheAndRoute } from 'workbox-precaching';

import { registerRoute } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
  NetworkOnly,
} from 'workbox-strategies';

// Used for filtering matches based on status code, header, or both
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// Used to limit entries in cache, remove entries after a certain period of time
import { ExpirationPlugin } from 'workbox-expiration';

import { BackgroundSyncPlugin } from 'workbox-background-sync';

/**
 * Handle UI requests to update.
 */
addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * This implements pre-caching.
 */
precacheAndRoute(self.__WB_MANIFEST);

/**
 * The following implement caching of resources using various strategies.
 */

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === 'navigate',
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'pages',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  // Use a Stale While Revalidate caching strategy
  new StaleWhileRevalidate({
    // Put all cached files in a cache named 'assets'
    cacheName: 'assets',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// Cache images with a Cache First strategy
registerRoute(
  // Check to see if the request's destination is style for an image
  ({ request }) => request.destination === 'image',
  // Use a Cache First caching strategy
  new CacheFirst({
    // Put all cached files in a cache named 'images'
    cacheName: 'images',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      // Don't cache more than 50 items, and expire them after 30 days
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
      }),
    ],
  }),
);

/**
 * The following implements background sync for calls to our app API.
 */

// Plugin to sync failed requests
const bgSyncPlugin = new BackgroundSyncPlugin('submitBarcodeQueue', {
    maxRetentionTime: 31 * 24 * 60 // Retry for max of 31 days (specified in minutes)
});

// Plugin to turn a server 5xx response into a failed request
const statusPlugin = {
  fetchDidSucceed: ({response}) => {
    if (response.status >= 500) {
      // Throwing anything here will trigger fetchDidFail.
      throw new Error(`Server error (${response.status})`);
    }
    // If it's not 5xx, use the response as-is.
    return response;
  },
};

// Execute the plugins for our app API calls.
registerRoute(
  /\/api\/.*/,
  new NetworkOnly({
    plugins: [statusPlugin, bgSyncPlugin]
  }),
  'POST'
);
