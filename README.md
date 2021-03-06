# workbox-1

An attempt to get a PWA running with Workbox.

* Started with https://developers.google.com/web/tools/workbox/guides/get-started
* Added webpack for ESM import rewriting and manifest injection
* Added background sync
* Added manifest, icons, and event listeners for installation
* Added install button
* Added UI for upgrading the service worker
* Added qr-scanner package to actually scan QR codes
* Added geolocation data

The PWA UI is a simple pseudo-form that accepts a QR code as input from a QR code scanning package and provides a button to submit the value to the server API.

The service worker code is mostly cut-and-paste from Workbox documentation.

The webpack entry script registers the service worker and puts the button click handler in place.

The server is a simple Express app that serves the output of the webpack build and provides a single API endpoint.

The webpack configuration is as spare as possible, relying on many default values.

## Behavior Notes

Per https://caniuse.com/?search=a2hs, installation only works on a subset of browser/OS combinations.  Per https://caniuse.com/?search=background%20sync, only Chrome-based browsers support background sync.  _However_, workbox background sync documentation suggests that they primitively polyfill by attempting to send all queued requests whenever the service worker is started.

On an newish Pixel running Android 12, there was never an option to install the app.  In fact, there was never an option to install any app, including https://developers.google.com.  The root cause was no default Home (launcher).  This phone replaced another Pixel.  Apps were transferred, but the default Home never set.  Upon restart, the phone always asked the user to select a launcher.  Anyway, once a default launcher was configured, everything started working.

Remember to allow the app to use the camera and location!  If you accidentally deny access, the ease or difficulty of reversing that choice varies based on OS and browser.

The QR scanner package seems to have a bias toward motion.  In order to scan, increase or decrease the distance between the code and camera in a smooth, steady motion.

## Local Testing

### localhost

Service workers work fine over HTTP to localhost.  That's the best way to test on a developer laptop.

### Android

For Chrome on an Android with developer mode and USB debugging both enabled, connect to the developer laptop via USB and go to `chrome://inspece#devices` on the laptop.  Use chrome dev tools port forwarding to forward mobile port 3000 to laptop localhost:3000.

### iOS

Hmmm.  You can navigate to `chrome://inspect` in Chrome on iOS to see JavaScript logs.  Maybe this works: https://jonsadka.com/blog/how-to-debug-a-chrome-specific-bug-on-ios-using-remote-debugging.

### Local SSL

tl;dr - Don't bother trying this

Generate a SSL key and certificate with `openssl`:

```
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/C=US/ST=Pennsylvania/L=Pittsburgh/O=Company/OU=Org/CN=192.168.1.135"
```

However, service workers don't work on Chrome with self-signed certificates!  The fetch of the service worker script fails.

On a desktop OS, use a command line option to treat an origin as secure:

```
/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ --user-data-dir=/tmp/foo --unsafely-treat-insecure-origin-as-secure=http://www.your.site
```

### AWS SSL

Run the server on a non-public instance with ELB in front of it.  Put a certificate on the ELB.

Run the server on a public instance with CloudFront in front of it.  Put a certificate on CloudFront.

### Chrome Troubleshooting (dev tools and web inspect are much more useful)

Look at `chrome://serviceworker-internals/` to quickly see Service Worker info in Chrome on Android.  However, this does not show a service worker when a self-signed certificate is used.  *sigh*

Similarly, `chrome://indexeddb-internals/` shows nothing for IndexedDB used with a self-signed certificate.
