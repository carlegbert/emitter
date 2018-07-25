const Spy = () => {
  let count = 0;
  let lastArgs;
  return {
    count: () => count,
    lastArgs: () => lastArgs,
    fn: (...args) => {
      count += 1;
      lastArgs = args;
    },
  };
};

module.exports = {
  Spy,
};
