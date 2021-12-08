import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

const DecodeErrorC = t.type({
  name: t.string,
  message: t.string,
  response: t.type({
    data: t.unknown,
  }),
});
type DecodeError = t.TypeOf<typeof DecodeErrorC>;
const DecodeError = (data: DecodeError): DecodeError => data;

export const decodeModel = <Codec extends t.Mixed>(data: unknown, codec: Codec) => {
  return pipe(
    codec.decode(data),
    fold(
      (errors): never => {
        console.warn('Data of decode error', data);
        throw DecodeError({
          name: 'DecodeException',
          message: '\n' + errors.map((error) => error.context.map(({ key }) => key).join('.')).join('\n'),
          response: { data },
        });
      },
      (value): t.TypeOf<typeof codec> => value
    )
  );
};

export const isDecodeError = (data: unknown): data is DecodeError => {
  return pipe(
    DecodeErrorC.decode(data),
    fold(
      () => false,
      () => true
    )
  );
};
