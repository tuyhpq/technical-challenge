import * as t from 'io-ts';

export const TotalReportRaw = t.type({
  data: t.type({
    confirmed: t.number,
    confirmed_diff: t.number,
    deaths: t.number,
    deaths_diff: t.number,
    active: t.number,
    active_diff: t.number,
  }),
});
export type TotalReportRaw = t.TypeOf<typeof TotalReportRaw>;

export const TotalReportC = t.type({
  confirmed: t.number,
  confirmedDiff: t.number,
  deaths: t.number,
  deathsDiff: t.number,
  active: t.number,
  activeDiff: t.number,
});
export type TotalReport = t.TypeOf<typeof TotalReportC>;
export const TotalReport = ({ data }: TotalReportRaw): TotalReport => ({
  confirmed: data.confirmed,
  confirmedDiff: data.confirmed_diff,
  deaths: data.deaths,
  deathsDiff: data.deaths_diff,
  active: data.active,
  activeDiff: data.active_diff,
});
