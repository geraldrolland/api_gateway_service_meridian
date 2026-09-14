import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

/**
 * Structured JSON logger for the API gateway.
 * Outputs to stdout with ISO timestamps and error stack traces.
 * Log level is configurable via `LOG_LEVEL` env var (default: "info").
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'api-gateway' },
  transports: [new winston.transports.Console()],
});

/**
 * Request logging middleware.
 * Records the start time and logs method, URL, status, duration,
 * client IP, and user agent when the response finishes.
 *
 * @param req - The incoming request
 * @param res - Express response (listens for `finish` event)
 * @param next - Called immediately to not block the request pipeline
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}
