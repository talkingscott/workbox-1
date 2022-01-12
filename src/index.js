/**
 * @file index.js
 *
 * @brief Register our ServiceWorker and set up the button click handler.
 *
 * This depends on element id values from index.ejs.
 *
 * This is the webpack default entry point.
 */
import QrScanner from 'qr-scanner';
import { Workbox } from 'workbox-window';

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

function hideInstallUI() {
    console.log('Hide install UI');
    const install = document.getElementById('install-ui');
    install.hidden = true;
}

function showInstallUI() {
    console.log('Show install UI');
    const install = document.getElementById('install-ui');
    install.hidden = false;
}

function hideUpdateUI() {
    console.log('Hide update UI');
    const updateUI = document.getElementById('update-ui');
    updateUI.hidden = true;
}

function showUpdateUI() {
    console.log('Show update UI');
    const updateUI = document.getElementById('update-ui');
    updateUI.hidden = false;
}

if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    console.log('Add load event handler');
    window.addEventListener('load', () => {
        console.log('Received load event');

        hideInstallUI();
        hideUpdateUI();

        const wb = new Workbox('/service-worker.js');

        console.log('Add activated event handler');
        wb.addEventListener('activated', (event) => {
            console.log('Received activated event');
            hideUpdateUI();
            // `event.isUpdate` will be true if another version of the service
            // worker was controlling the page when this version was registered.
            if (!event.isUpdate) {
                console.log('Service worker activated for the first time!');
                // Precache assets should all be available now.
            }
        });

        console.log('Add waiting event handler');
        wb.addEventListener('waiting', (event) => {
            console.log('Received waiting event');
            showUpdateUI();
        });

        console.log('Register service worker');
        wb.register();

        console.log('Add submit click event handler');
        const submit = document.getElementById('submit-qrcode');
        submit.addEventListener('click', (ev) => {
            console.log('Received submit click event');
            const input = document.getElementById('qrcode');
            const qrcode = input.value;
            const location = 'placeholder';
            const user = 'placeholder';
            const submitted = Date.now();
            console.log('Submit qrcode', qrcode, submitted);
            fetch('/api/v1/qrcode', {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({ qrcode, location, user, submitted }), // body data type must match "Content-Type" header
            }).then((response) => {
                input.value = '';
                document.getElementById('submit-qrcode').hidden = true;
                console.log('Data sent?', response.ok);
            }).catch((err) => {
                input.value = '';
                console.log('Send error', err);
            });
        });

        console.log('Add install click event handler');
        const install = document.getElementById('install');
        install.addEventListener('click', async (ev) => {
            console.log('Received install click event');

            // Hide the install button.
            hideInstallUI();

            const promptEvent = deferredPrompt;
            if (!promptEvent) {
                console.log('The deferred prompt is not available');
                return;
            }
            // Show the install prompt.
            promptEvent.prompt();
            // Log the result
            const result = await promptEvent.userChoice;
            console.log('userChoice', result);
            // Reset the deferred prompt variable, since prompt() can only
            // be called once.
            deferredPrompt = null;
        });        

        console.log('Add update click event handler');
        const update = document.getElementById('update');
        update.addEventListener('click', (ev) => {
            console.log('Received update click event');

            // Hide the update UI.
            hideUpdateUI();

            // Reload the page as soon as the previously waiting
            // service worker has taken control.
            wb.addEventListener('controlling', (event) => {
                window.location.reload();
            });
    
            wb.messageSkipWaiting();
        });

        console.log('Set up QR code scanner');
        const scanVideo = document.getElementById('scan-video');
        const qrScanner = new QrScanner(scanVideo, (result) => {
            console.log('decoded qr code:', result);
            document.getElementById('qrcode').value = result;
            document.getElementById('submit-qrcode').hidden = false;
            document.getElementById('rescan').hidden = false;
            qrScanner.stop();
        });
        qrScanner.WORKER_PATH = 'qr-scanner-worker.min.js';
        qrScanner.start();

        console.log('Add rescan click event handler');
        const rescan = document.getElementById('rescan');
        rescan.addEventListener('click', (ev) => {
            console.log('Received rescan click event');
            document.getElementById('qrcode').value = '';
            document.getElementById('submit-qrcode').hidden = true;
            qrScanner.start();
        });
    });

    console.log('Add beforeinstallprompt event listener');
    window.addEventListener('beforeinstallprompt', (e) => {
        // Optionally, send analytics event that PWA install promo was shown.
        console.log('Received beforeinstallprompt event');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        showInstallUI();
    });

    console.log('Add appinstalled event listener');
    window.addEventListener('appinstalled', () => {
        // Optionally, send analytics event to indicate successful install
        console.log('Received appinstalled event');
        // Hide the app-provided install promotion
        hideInstallUI();
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt = null;
    });
}
