module.exports = function ({ options }) {
  let { configuration } = options;

  let { no_proxy } = configuration;

  process.env.NO_PROXY = [no_proxy]
    .flat()
    .reduce(
      (no_proxy, host) => `${no_proxy},${host}`,
      process.env.NO_PROXY || process.env.no_proxy || ""
    );

  console.log(process.env.NO_PROXY);

  return (req, res, next) => {
    next();
  };
};
