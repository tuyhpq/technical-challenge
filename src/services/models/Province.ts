import * as t from 'io-ts';

export const ProvinceRaw = t.type({
  data: t.array(
    t.type({
      name: t.string,
      province: t.string,
    })
  ),
});
export type ProvinceRaw = t.TypeOf<typeof ProvinceRaw>;

export const ProvinceC = t.type({
  name: t.string,
  value: t.string,
});
export type Province = t.TypeOf<typeof ProvinceC>;
export const Province = ({ data }: ProvinceRaw): Province[] =>
  data.map((data) => ({
    name: data.name,
    value: data.province,
  }));
