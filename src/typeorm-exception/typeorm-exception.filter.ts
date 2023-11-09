import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeormExceptionFilter extends BaseExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    console.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message.replace(/\n/g, '');

    if (exception instanceof QueryFailedError) {
      const status = HttpStatus.BAD_REQUEST;
      response.status(status).json({
        statusCode: status,
        message: message,
      });
    } else {
      // default 500 error code
      super.catch(exception, host);
    }
  }
}
