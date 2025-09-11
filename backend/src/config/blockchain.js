const Web3 = require('web3');

// Initialize Web3 connection
const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID');

// Smart contract ABI and address
const CARBON_CREDIT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "submissionId", "type": "uint256"}
    ],
    "name": "issueCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "submissionId", "type": "uint256"},
      {"internalType": "int256", "name": "latE7", "type": "int256"},
      {"internalType": "int256", "name": "lngE7", "type": "int256"}
    ],
    "name": "recordSubmissionLocation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transferCredits",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getCarbonBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const CARBON_CREDIT_ADDRESS = process.env.CARBON_CREDIT_CONTRACT_ADDRESS;

// Initialize contract
const carbonCreditContract = new web3.eth.Contract(CARBON_CREDIT_ABI, CARBON_CREDIT_ADDRESS);

// Admin wallet for transactions
const adminWallet = web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);

module.exports = {
  web3,
  carbonCreditContract,
  adminWallet
};

