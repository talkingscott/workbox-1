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
