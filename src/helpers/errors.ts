export abstract class ClientError extends Error {
  isClientError = true;

  constructor(
    message: string,
    readonly innerError?: Error,
    readonly httpStatus: number = 400,
  ) {
    super(message || 'Client Error');
  }
}

export class BadRequest extends ClientError {
  constructor(message?: string, innerError?: Error) {
    super(message || 'Bad Request', innerError);
    this.name = this.constructor.name;
  }
}
