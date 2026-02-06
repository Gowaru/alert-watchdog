declare module 'unhandled-rejection' {
    interface RejectionEmitter {
        on(event: 'unhandledRejection', listener: (error: any, promise: Promise<any>) => void): void;
    }
    function unhandled(options?: any): RejectionEmitter;
    export = unhandled;
}
