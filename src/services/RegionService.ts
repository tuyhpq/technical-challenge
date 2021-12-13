import axios from '@/plugins/axios';
import * as E from 'fp-ts/Either';
import { ApiError, Region, RegionRaw, Result, SystemError } from './models';
import { decodeModel, isDecodeError } from './utilities';

export namespace RegionService {
  export const getAll = async (): Result<Region[]> => {
    try {
      const response = await axios.get('/regions');
      const data = decodeModel(response.data, RegionRaw);
      return E.right(Region(data));
    } catch (e) {
      if (isDecodeError(e)) {
        return E.left(ApiError());
      }
      return E.left(SystemError);
    }
  };
}
