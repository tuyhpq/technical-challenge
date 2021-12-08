import { Either } from 'fp-ts/Either';

export type Result<T> = Promise<Either<SystemError | ApiError, T>>;

export type SystemError = {
  type: 'SystemError';
  message: string;
};
export const SystemError: SystemError = {
  type: 'SystemError',
  message: 'Lỗi hệ thống!',
};

export type ApiError = {
  type: 'ApiError';
  message: string;
};
export const ApiError = (code?: string): ApiError => {
  const getMessage = (code?: string): string => {
    switch (code) {
      default:
        return 'Lỗi khi gọi API!';
    }
  };
  return {
    type: 'ApiError',
    message: getMessage(code),
  };
};
