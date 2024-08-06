interface IHandledEvent {
  name: string;
  value: any;
  previousValue: any;
}

export const handledEvent = (
  name: string,
  value?: any,
  previousValue?: any
) => {
  return {
    name,
    item: { value: value || undefined },
    previous: {
      value: previousValue || undefined,
    },
  };
};
