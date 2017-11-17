deployContract = function(FILENAME, RPC_ADDRESS, callback) {
	// Load Viper compiler wrapper
	const Viper = require('./Wrapper.js');
	// Start compilation of contract
	Viper.compileAll(FILENAME, function(compiled_contract) {

		// get contract abi
		abi = compiled_contract['abi']
		// console.log(abi);
		abi = JSON.parse(abi)

		// get contract bytecode
		bytecode = compiled_contract['bytecode'].replace('\n','')
		// console.log(bytecode)

		// load web3
		const Web3 = require('web3');
		const web3 = new Web3(new Web3.providers.HttpProvider(RPC_ADDRESS));
		owner = web3.eth.accounts[0];

		// create contract object from abi
		contract = web3.eth.contract(abi);

		// deploy contract - Gas used: 182704 with Ganache testrpc
		contractInstance = contract.new({ 
			from: web3.eth.accounts[0], 
			gas: 185000,
			data: bytecode
		})

		// normally need to wait here until tx receipt is available
		// https://ethereum.stackexchange.com/questions/9636/whats-the-proper-way-to-wait-for-a-transaction-to-be-mined-and-get-the-results
		receipt = web3.eth.getTransactionReceipt(contractInstance.transactionHash)
		address = receipt.contractAddress

		contract = contract.at(address)
		callback(contract)

	})
}

module.exports = {
	deployContract : deployContract
}
