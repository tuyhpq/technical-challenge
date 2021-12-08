import * as t from 'io-ts';

export const ReportRaw = t.type({
  data: t.array(
    t.type({
      confirmed: t.number,
      confirmed_diff: t.number,
      deaths: t.number,
      deaths_diff: t.number,
      active: t.number,
      active_diff: t.number,
    })
  ),
});
export type ReportRaw = t.TypeOf<typeof ReportRaw>;

export const ReportC = t.type({
  records: t.array(
    t.type({
      confirmed: t.number,
      confirmedDiff: t.number,
      deaths: t.number,
      deathsDiff: t.number,
      active: t.number,
      activeDiff: t.number,
    })
  ),
});
export type Report = t.TypeOf<typeof ReportC>;
export const Report = ({ data }: ReportRaw): Report => ({
  records: data.map((record) => ({
    confirmed: record.confirmed,
    confirmedDiff: record.confirmed_diff,
    deaths: record.deaths,
    deathsDiff: record.deaths_diff,
    active: record.active,
    activeDiff: record.active_diff,
  })),
});
