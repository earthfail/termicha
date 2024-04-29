
class Error1 extends Error {
    constructor(message) {
      super(message);
      this.name = 'MyCustomError';
    }
  }

export {Error1}
