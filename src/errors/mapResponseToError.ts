import {
  HTTPError,
  NotFoundError,
  InternalServerError,
  ServiceUnavailableError,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_SERVICE_UNAVAILABLE,
} from "./errors";

export function mapHttpResponseToError(
  status: number,
  body?: any,
  original?: unknown,
) {
  if (status === HTTP_NOT_FOUND) {
    return new NotFoundError(HTTP_NOT_FOUND, body?.message ?? "Not found", {
      body,
      original,
    });
  }

  if (status === HTTP_INTERNAL_SERVER_ERROR) {
    return new InternalServerError(
      HTTP_INTERNAL_SERVER_ERROR,
      body?.message ?? "Unexpected error",
      { body, original },
    );
  }

  if (status === HTTP_SERVICE_UNAVAILABLE) {
    return new ServiceUnavailableError(
      HTTP_SERVICE_UNAVAILABLE,
      body?.message ?? "Service unavailable",
      { body, original },
    );
  }

  return new HTTPError(status, body?.message ?? `HTTP ${status}`, {
    body,
    original,
  });
}
