export class NoTL8ContextError extends Error {
  constructor() {
    super('No TL8 Context. Use <TL8Provider> to initialize TL8 in your application.');
  }
}
