const alertWatchdog = require('./dist/index');

async function run() {
    console.log("Initializing Alert Watchdog...");

    // Test initialization with custom config (optional)
    // await alertWatchdog.init({ redis: { host: '127.0.0.1', port: 6379 } });

    // Or default init
    await alertWatchdog.init();
    console.log("Initialization complete.");

    console.log("Simulating handled error...");
    alertWatchdog.catchError(async () => {
        throw new Error("This is a simulated handled error");
    }, {
        context: { userId: 123, action: 'test_simulation' }
    }).catch(err => {
        console.log("CAUGHT ERROR:", err.message);
    });

    console.log("Simulating unhandled rejection (will be caught by global handler)...");
    // alertWatchdog.errorHandler((err, context) => {
    //     console.log("Global Handler Caught:", err.message, context);
    // }, { NoCrash: true });

    // Simulate async error
    // Promise.reject(new Error("Async Failure !"));

    // Allow some time for redis operations
    setTimeout(async () => {
        console.log("Closing...");
        if (alertWatchdog.close) await alertWatchdog.close();
        process.exit(0);
    }, 2000);
}

run();
