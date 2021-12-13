import axios from '@/plugins/axios';
import * as E from 'fp-ts/Either';
import { ApiError, Province, ProvinceRaw, Result, SystemError } from './models';
import { decodeModel, isDecodeError } from './utilities';

export namespace ProvinceService {
  export const getByISO = async (iso: string): Result<Province[]> => {
    try {
      const response = await axios.get('/provinces', {
        params: { iso: iso },
      });
      const data = decodeModel(response.data, ProvinceRaw);
      return E.right(Province(data));
    } catch (e) {
      if (isDecodeError(e)) {
        return E.left(ApiError());
      }
      return E.left(SystemError);
    }
  };
}
