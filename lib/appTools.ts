export function normalizePort(port: string): unknown {
  const parsedPort = parseInt(port, 10);

  if (isNaN(parsedPort)) {
    return port;
  }

  if (parsedPort >= 0) {
    return parsedPort;
  }

  return false;
}

export function onError(error: NodeJS.ErrnoException): void {
  throw error;
}
