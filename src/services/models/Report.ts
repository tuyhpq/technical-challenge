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
      region: t.type({
        name: t.string,
        province: t.string,
      }),
      last_update: t.string,
    })
  ),
});
export type ReportRaw = t.TypeOf<typeof ReportRaw>;

export const ReportC = t.array(
  t.type({
    confirmed: t.number,
    confirmedDiff: t.number,
    deaths: t.number,
    deathsDiff: t.number,
    active: t.number,
    activeDiff: t.number,
    region: t.type({
      name: t.string,
      province: t.string,
    }),
    lastUpdate: t.string,
  })
);
export type Report = t.TypeOf<typeof ReportC>;
export const Report = ({ data }: ReportRaw): Report =>
  data.map((record) => ({
    confirmed: record.confirmed,
    confirmedDiff: record.confirmed_diff,
    deaths: record.deaths,
    deathsDiff: record.deaths_diff,
    active: record.active,
    activeDiff: record.active_diff,
    region: record.region,
    lastUpdate: record.last_update,
  }));
