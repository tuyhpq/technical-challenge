import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import moment from 'moment';
import axios from '@/plugins/axios';
import { ApiError, Report, ReportRaw, Result, SystemError, TotalReport, TotalReportRaw } from './models';
import { decodeModel, isDecodeError } from './utilities';

export namespace ReportService {
  export const getTotalReport = async (date?: Date): Result<TotalReport> => {
    try {
      const response = await axios.get('/reports/total', {
        params: {
          date: date ? moment(date).format('YYYY-MM-DD') : undefined,
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

  export const getTotalReportRange = async (dates: Date[]): Result<TotalReport[]> => {
    try {
      const responses = await Promise.all(
        dates.map((date) =>
          axios.get('/reports/total', {
            params: {
              date: moment(date).format('YYYY-MM-DD'),
            },
          })
        )
      );
      const data = decodeModel(
        responses.map((response) => response.data),
        t.array(TotalReportRaw)
      );
      return E.right(data.map(TotalReport));
    } catch (e) {
      if (isDecodeError(e)) {
        return E.left(ApiError());
      }
      return E.left(SystemError);
    }
  };

  export const getReports = async ({
    regionProvince,
    iso,
    query,
  }: {
    regionProvince?: string;
    iso?: string;
    query?: string;
    date?: Date;
  }): Result<Report> => {
    try {
      const response = await axios.get('/reports', {
        params: {
          region_province: regionProvince || undefined,
          iso: iso || undefined,
          q: query || undefined,
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
