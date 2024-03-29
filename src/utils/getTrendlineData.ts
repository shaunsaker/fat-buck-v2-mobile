import PolynomialRegression from 'js-polynomial-regression';

interface Datum {
  date: Date;
  value: number;
}

export const getTrendlineData = (data: Datum[]) => {
  if (!data || !data.length || (data && data.length === 1)) {
    return { data: [] };
  }

  const mappedData = data.map(({ value, date }) => {
    return {
      y: value,
      x: date.getTime(),
    };
  });

  const model = PolynomialRegression.read(mappedData, 3);
  const terms = model.getTerms();
  const startTime = data[0].date.getTime();
  const endTime = data[data.length - 1].date.getTime();
  const dataPoints = 100; // as low as possible but still creates a nice curve
  const interval = (endTime - startTime) / dataPoints;
  const trendlineData = [...Array(dataPoints).keys()].map((_, index) => {
    const time = startTime + interval * index;
    const value = model.predictY(terms, time);
    const date = new Date(time);

    return {
      value,
      date,
    };
  });

  const linearModel = PolynomialRegression.read(mappedData, 1);
  const linearTerms = linearModel.getTerms();

  return { data: trendlineData, model, terms, linearModel, linearTerms };
};
