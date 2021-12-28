if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    console.log('Add event listener');
    window.addEventListener('load', () => {
        console.log('Register service worker');
        navigator.serviceWorker.register('/service-worker.js');
    });
}
