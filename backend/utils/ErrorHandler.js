export class ErrorHandler extends Error {
  constructor(msg, stCode) {
    super(msg);
    this.statusCode = stCode;
  }
}