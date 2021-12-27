const TruffleConfig = require('../truffle-config');

var Election = artifacts.require('./Election.sol');

module.exports = function (deployer, network) {
  const config = TruffleConfig.networks[network];

  console.log('Deploying contracts');
  console.log('Unlocking account ' + config.from);
  web3.eth.personal.unlockAccount(config.from, config.password, 36000).then(function () {
    return deployer
      .then(function () {
        return deployer.deploy(Election);
      })
      .catch(console.error);
  });
};
