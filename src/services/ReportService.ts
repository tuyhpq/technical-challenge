import * as E from 'fp-ts/Either';
import axios from '@/plugins/axios';
import { ApiError, Report, ReportRaw, Result, SystemError, TotalReport, TotalReportRaw } from './models';
import { decodeModel, isDecodeError } from './utilities';

export namespace ReportService {
  export const getTotalReport = async (date?: Date): Result<TotalReport> => {
    try {
      const response = await axios.get('/reports/total', {
        params: {
          date: date,
        },
      });
      const data = decodeModel(response.data, TotalReportRaw);
      return E.right(TotalReport(data));
    } catch (e) {
      if (isDecodeError(e)) {
        return E.left(ApiError());
      }
      return E.left(SystemError);
    }
  };

  export const getReports = async ({
    cityName,
    regionProvince,
    iso,
    regionName,
    query,
    date,
  }: {
    cityName?: string;
    regionProvince?: string;
    iso?: string;
    regionName?: string;
    query?: string;
    date?: Date;
  }): Result<Report> => {
    try {
      const response = await axios.get('/reports', {
        params: {
          city_name: cityName,
          region_province: regionProvince,
          iso: iso,
          region_name: regionName,
          q: query,
          date: date,
        },
      });
      const data = decodeModel(response.data, ReportRaw);
      return E.right(Report(data));
    } catch (e) {
      if (isDecodeError(e)) {
        return E.left(ApiError());
      }
      return E.left(SystemError);
    }
  };
}
