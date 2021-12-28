# workbox-1

An attempt to get a PWA running with Workbox.

* Started with https://developers.google.com/web/tools/workbox/guides/get-started
* Added webpack for ESM import rewriting and manifest injection
* Added background sync

The PWA UI is a simple pseudo-form that accepts a "barcode" as text input and provides a button to submit the value to the server API.

The service worker code is mostly cut-and-paste from Workbox documentation.

The webpack entry script registers the service worker and puts the button click handler in place.

The server is a simple Express app that serves the output of the webpack build and provides a single API endpoint.

The webpack configuration is as spare as possible, relying on many default values.

## Development

### SSL

Generate a SSL key and certificate with `openssl`:

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=US/ST=Pennsylvania/L=Pittsburgh/O=Company/OU=Org/CN=192.168.1.135"
```

However, service workers don't work on Chrome with self-signed certificates!  The fetch of the service worker script fails.

On a desktop OS, use a command line option to treat an origin as secure:

```
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ --user-data-dir=/tmp/foo --unsafely-treat-insecure-origin-as-secure=http://www.your.site
```

### Chrome Troubleshooting

Use `chrome://inspece#devices` to inspect chrome on an Android with developer mode and USB debugging both enabled.

Look at `chrome://serviceworker-internals/` to quickly see Service Worker info in Chrome on Android.  However, this does not show a service worker when a self-signed certificate is used.  *sigh*

Similarly, `chrome://indexeddb-internals/` shows nothing for IndexedDB used with a self-signed certificate.

