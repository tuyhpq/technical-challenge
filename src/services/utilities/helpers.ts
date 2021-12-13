import _ from 'lodash';

export const withCommas = (input: number | string): string => {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const debounce = _.debounce;
