import * as t from 'io-ts';

export const RegionRaw = t.type({
  data: t.array(
    t.type({
      iso: t.string,
      name: t.string,
    })
  ),
});
export type RegionRaw = t.TypeOf<typeof RegionRaw>;

export const RegionC = t.type({
  name: t.string,
  value: t.string,
});
export type Region = t.TypeOf<typeof RegionC>;
export const Region = ({ data }: RegionRaw): Region[] =>
  data.map((data) => ({
    name: data.name,
    value: data.iso,
  }));
