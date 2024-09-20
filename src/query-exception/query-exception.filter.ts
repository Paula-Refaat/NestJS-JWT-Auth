import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Default message for unhandled errors
    let message = 'Internal server error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle duplicate entry error (code 1062 in MySQL)
    if (exception.message.includes('Duplicate entry')) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Duplicate entry found';
    }

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
