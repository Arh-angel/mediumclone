import {
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);

    if (typeof obj !== 'object') {
      return value;
    }

    const errors = await validate(obj);

    if (errors.length === 0) {
      return value;
    }

    throw new HttpException(
      { errors: this.formateError(errors) },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  formateError(errors: ValidationError[]) {
    return errors.reduce((acc, err) => {
      acc[err.property] = Object.values(err.constraints);

      return acc;
    }, {});
  }
}
