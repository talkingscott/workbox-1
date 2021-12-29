/**
 * @file index.js
 *
 * @brief Register our ServiceWorker and set up the button click handler.
 *
 * This depends on element id values from index.ejs.
 *
 * This is the webpack default entry point.
 */

if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    console.log('Add load event listener');
    window.addEventListener('load', () => {
        console.log('Register service worker');
        navigator.serviceWorker.register('/service-worker.js').then((reg) => {
            console.log('Service worker registered', reg);
        }).catch((err) => {
            console.log('Service worker registration failed', err);
            alert(err);
        });

        console.log('Add click event handler');
        const submit = document.getElementById('submit-barcode');
        submit.addEventListener('click', (ev) => {
            const input = document.getElementById('barcode');
            const barcode = input.value;
            console.log('Submit barcode', barcode);
            fetch('/api/v1/barcode', {
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
                body: JSON.stringify({ barcode }), // body data type must match "Content-Type" header
            }).then((response) => {
                console.log('Data sent?', response.ok);
            }).catch((err) => {
                console.log('Send error', err);
            });
        });
    });

    console.log('Add beforeinstallprompt event listener');
    // Initialize deferredPrompt for use later to show browser install prompt.
//    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
//        e.preventDefault();
        // Stash the event so it can be triggered later.
//        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
//        showInstallPromotion();
        // Optionally, send analytics event that PWA install promo was shown.
        console.log(`'beforeinstallprompt' event was fired.`);
    });

    console.log('Add appinstalled event listener');
    window.addEventListener('appinstalled', () => {
        // Hide the app-provided install promotion
//        hideInstallPromotion();
        // Clear the deferredPrompt so it can be garbage collected
//        deferredPrompt = null;
        // Optionally, send analytics event to indicate successful install
        console.log('PWA has been installed');
      });
}
