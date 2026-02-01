export abstract class AppError extends Error {
  public abstract readonly type: string;
  public readonly original?: unknown;

  constructor(message: string, original?: unknown) {
    super(message);
    this.original = original;

    // Fix prototype chain for ES5/TS targets
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
  }

  // Avoids serializing original error
  toJSON() {
    return {
      type: this.type,
      name: this.name,
      message: this.message,
    };
  }
}

const ERRORS_NETWORK_ERROR_TYPE = "network";
const ERRORS_GENERIC_HTTP_TYPE = "http";
const ERRORS_NOT_FOUND_TYPE = "not-found";
const ERRORS_INTERNAL_SERVER_ERROR_TYPE = "internal-server-error";
const ERRORS_SERVICE_UNAVAILABLE = "service-unavailable";

export class NetworkError extends AppError {
  readonly type = ERRORS_NETWORK_ERROR_TYPE;
  constructor(message = "Network error", original?: unknown) {
    super(message, original);
  }
}

export const HTTP_BAD_REQUEST = 400;
export const HTTP_NOT_FOUND = 404;
export const HTTP_INTERNAL_SERVER_ERROR = 500;
export const HTTP_SERVICE_UNAVAILABLE = 503;
const HTTP_SERVER_MAX_CODE = 599;

export class HTTPError extends AppError {
  readonly type: string;
  public readonly status: number;
  public readonly statusText?: string;
  public readonly body?: unknown;

  constructor(
    status: number,
    message = "HTTP error",
    opts: { statusText?: string; body?: unknown; original?: unknown } = {},
  ) {
    super(message, opts.original);
    this.type = ERRORS_GENERIC_HTTP_TYPE;
    this.status = status;
    this.statusText = opts.statusText;
    this.body = opts.body;
  }

  isClientError() {
    return (
      this.status >= HTTP_BAD_REQUEST &&
      this.status < HTTP_INTERNAL_SERVER_ERROR
    );
  }

  isServerError() {
    return (
      this.status >= HTTP_INTERNAL_SERVER_ERROR &&
      this.status <= HTTP_SERVER_MAX_CODE
    );
  }
}

export class NotFoundError extends HTTPError {
  readonly type = ERRORS_NOT_FOUND_TYPE;
  constructor(
    status = HTTP_NOT_FOUND,
    message = "Not found",
    opts: { body?: unknown; original?: unknown } = {},
  ) {
    super(status, message, { ...opts });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InternalServerError extends HTTPError {
  readonly type = ERRORS_INTERNAL_SERVER_ERROR_TYPE;
  constructor(
    status = HTTP_INTERNAL_SERVER_ERROR,
    message = "Internal server error",
    opts: { body?: unknown; original?: unknown } = {},
  ) {
    super(status, message, { ...opts });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServiceUnavailableError extends HTTPError {
  readonly type = ERRORS_SERVICE_UNAVAILABLE;
  public readonly retryAfter?: string;
  constructor(
    status = HTTP_SERVICE_UNAVAILABLE,
    message = "Service unavailable",
    opts: { body?: unknown; retryAfter?: string; original?: unknown } = {},
  ) {
    super(status, message, { ...opts });
    this.retryAfter = opts.retryAfter;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* TYPE GUARDS */
export function isAppError(e: unknown): e is AppError {
  return typeof e === "object" && e !== null && "type" in e;
}

export function isHTTPError(e: unknown): e is HTTPError {
  return isAppError(e) && (e as AppError).type === ERRORS_GENERIC_HTTP_TYPE;
}

export function isNetworkError(e: unknown): e is NetworkError {
  return isAppError(e) && (e as AppError).type === ERRORS_NETWORK_ERROR_TYPE;
}

export function isNotFoundError(e: unknown): e is NotFoundError {
  return isAppError(e) && (e as AppError).type === ERRORS_NOT_FOUND_TYPE;
}

export function isInternalServerError(e: unknown): e is InternalServerError {
  return (
    isAppError(e) && (e as AppError).type === ERRORS_INTERNAL_SERVER_ERROR_TYPE
  );
}

export function isServiceUnavailableError(
  e: unknown,
): e is ServiceUnavailableError {
  return isAppError(e) && (e as AppError).type === ERRORS_SERVICE_UNAVAILABLE;
}
