export const MOCKED_MOMENT_ISO_STRING = '2018-08-26T19:17:02.349Z';

const mockedMoment = () => ({
  toISOString: () => MOCKED_MOMENT_ISO_STRING,
});

export default mockedMoment;