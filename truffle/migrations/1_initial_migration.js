const TruffleConfig = require('../truffle-config');

var Migrations = artifacts.require('./Migrations.sol');

module.exports = function (deployer, network) {
  const config = TruffleConfig.networks[network];
  console.log('Unlocking account ' + config.from);
  web3.eth.personal.unlockAccount(config.from, config.password, 36000);
  console.log('Deploying migrations');
  deployer.deploy(Migrations).catch(console.error);
};
