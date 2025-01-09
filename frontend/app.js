let web3;
let contract;
const CONTRACT_ADDRESS = "0xEC43247D1aD0D3fC039675542A1A3aD82AfEcAfB";
const ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "ModelListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "ModelPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "rater",
        "type": "address"
      }
    ],
    "name": "ModelRated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "modelCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "models",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address payable",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "ratingCount",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "totalRating",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "purchasedModels",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "listModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "purchaseModel",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "rating",
        "type": "uint8"
      }
    ],
    "name": "rateModel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "modelId",
        "type": "uint256"
      }
    ],
    "name": "getModelDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "averageRating",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
window.onload = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    document.getElementById("account").innerText = `Connected Account: ${accounts[0]}`;
    contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    loadModels();
  } else {
    alert("Please install MetaMask!");
  }
};

// Function to list a new model
document.getElementById("listModelForm").onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("modelName").value;
  const description = document.getElementById("modelDescription").value;
  const price = document.getElementById("modelPrice").value;
  const accounts = await web3.eth.getAccounts();

  try {
    await contract.methods.listModel(name, description, price).send({ from: accounts[0] });
    alert("Model listed successfully!");
    loadModels();
  } catch (error) {
    alert("Error listing model: " + error.message);
  }
};

// Function to load all available models
const loadModels = async () => {
  const modelList = document.getElementById("modelList");
  modelList.innerHTML = "Loading models...";
  try {
    const modelCount = await contract.methods.modelCount().call();
    modelList.innerHTML = "";
    for (let i = 1; i <= modelCount; i++) {
      const model = await contract.methods.getModelDetails(i).call();
      const modelElement = document.createElement("div");
      modelElement.className = "model";
      modelElement.innerHTML = `
        <h3>${model[0]}</h3>
        <p>${model[1]}</p>
        <p>Price: ${model[2]} Wei</p>
        <button onclick="purchaseModel(${i}, ${model[2]})">Purchase</button>
      `;
      modelList.appendChild(modelElement);
    }
  } catch (error) {
    modelList.innerHTML = "Failed to load models: " + error.message;
  }
};

// Function to purchase a model
const purchaseModel = async (modelId, price) => {
  const accounts = await web3.eth.getAccounts();
  try {
    await contract.methods.purchaseModel(modelId).send({ from: accounts[0], value: price });
    alert("Model purchased successfully!");
  } catch (error) {
    alert("Error purchasing model: " + error.message);
  }
};
