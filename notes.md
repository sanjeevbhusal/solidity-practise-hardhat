# RPC URL

- There has to be some nodes which are taking transactions, verifying it, adding it to the next block and finally
  adding it to blockchain.
- These Nodes expose an RPC URL (just like a API). User have to send transactions request to this RPC URL.
  You can do this via code or use third party providers like metamask.
- Whenever you create a transaction, metamask will send the details of the transaction to a particular node in
  that network. It does it via RPC URL exposed by that Node.

### Local Blockchain

- Local Blockchain such as Ganache also operates on the same principle. It will have its own RPC URL. We have to send
  transaction request to that RPC URL to perform any operations on blockchain.

## JSON RPC URL CONNECTION

- every Node which exposes a RPC Url has implemented few methods. By doing a API call with library like "axios",
  we can get any information of the blockchain.

- The information about methods available and sending in the correct format is available at:
  https://playground.open-rpc.org/?schemaUrl=https://raw.githubusercontent.com/ethereum/execution-apis/assembled-spec/openrpc.json&uiSchema%5BappBar%5D%5Bui:splitView%5D=false&uiSchema%5BappBar%5D%5Bui:input%5D=false&uiSchema%5BappBar%5D%5Bui:examplesDropdown%5D=false

### Terminology

#### Provider

- A provider is something that allows us to connect to a blockchain.
  A provider provides a very simple interface (via abstraction).
- Metamask can act as a provider as it allows us to connect to any different blockchain providers.
- Libraries like Ethers.js can also act as a provider as they have functionalities to connect to different blockchain
  providers

#### Signer

- A signer is something that allows us to sign a message or a transaction.
- A signer has access to the private key.
- Metamask can act as a signer as it allows us to perform operations and signs the operation using our private key.
- Libraries like Ethers.js can also act as a signer as they have functionalities to sign the operation using our private
  key.
- Both Metamask and Ethers allows us to choose our Max Fee, Priority Fee etc.

#### Contract Factory

- Contract Factory is available in ethers library.
- It is used to deploy the contract.
- Contract Factory needs the information about contract abi, contract binary
  and information about wallet( RPC URL, private key)
- It returns a contract object

## Deploying transaction

- When deploying a contract, ethers.js does a bunch of API calls to the RPC Url to get the necessary information needed
  to create a transaction object such as getting the chainId, getting correct nonce etc.
- All these calls follow a similar pattern discussed above in **JSON RPC URL CONNECTION**
- After deploying a transaction, you get a contract object back.
- This contract object is obtained by doing many API calls to the node behind RPC URl
- Depending upon user's need, ethers can do a bunch of API calls like getting Transaction Receipt, getting block Number
  etc.
- The contract object has a property called deployTransaction.
- This property contains information about the transaction such as nonce, transaction data, gasPrice, gasLimit
  transaction hash, blockConfirmations etc.
- deployTransaction object also has a method called wait.
- The method is used to wait for certain blocks to be added to blockchain.
-
- When you deploy your transaction, you are just creating a transaction. You get transaction information in the
- contract.deployTransaction object.
- The transaction has not yet been confirmed into the block and added to the blockchain.
- So, you can wait for few blocks to be mined. Hopefully, your transaction has been added into the blockchain by now.
- Block Explorers can also now find your contract.
- The response of the wait method will be information regarding the sender address, receiver address, gasUsed,
- in which the transaction is included, etc

### Nonce (Number only used once)

- Nonce, when talking about Blockchain mining is used to solve the puzzle for consensus mechanism.
- Nonce, when talking about Wallets talks about the unique number associated with each transaction.
- wallet.getTransactionCount() gives the current nonce number of the blockchain.

### Chain Id (Network Id)

- Each blockchain has a unique chain Id.

### Creating a transaction yourself

- While deploying a contract using ethers.js, a lot of information about the transaction such as nonce, gasPrice,
  gasLimit, chainId etc are filled automatically.
- However, we can create our own transaction object by specifying all that information and use that.

### Contract Object

- The contract object has all the methods for interacting with the smart contract.
- That's why we need to pass abi to contract factory.

### Big Number

- Javascript will round up numbers after a certain point.
- A 1 ether is 10^18 wei, it is not possible to represent it in javascript.
- So, ethers library uses BigNumber to represent wei.

### Alchemy

- Alchemy has a node as a service.
- It allows us to connect to any blockchain that they support.
- While creating a application on Alchemy, we can choose the blockchain, and we will get a RPC URL.
- The RPC URL is a connection to a node run by Alchemy. The node will process our transaction and add it to the
  blockchain
- We also need to have an account on that blockchain in order to sign transactions.
- Deploying on a main network or test network takes more time as compared to local network like Ganache.
- This is because main/test network have to propagate blocks, wait for some time to add a block etc
- Whenever you deploy/interact with your contract using alchemy's RPC Url, all the information is getting logged.
- You can view all the API calls that ethers did behind the scenes using Alchemy's dashboard.

### Etherscan

- Once you have deployed your contract on a main net or test net, you can view all the transactions using the memory
  address of the contract.
- Additionally, you can also verify your smart contract by pasting the source code. This gives security because people
  can actually see the source code of the contract they are interacting with.
- To verify, Etherscan compiles the source code and generates binary data and abi.
- Then it compares the binary data to the contract's binary data.
- If binary data matches, it is proved that the source code is actually correct.
- However, you can also do the same verification programmatically using API provided by Etherscan.

### Hardhat

#### Problems with ethers.js

- Ethers.js simplifies a lot on deploying smart contracts but there a lot of features that it lacks.
- With ethers.js, we can't make our code a cross blockchain applications.
- We have to constantly change our RPC Url and Private key.
- We don't have any testing facility from Ethers
- Besides, we have to also write a lot of code ourselves.
    - First we have to compile our code.
    - Then get the abi and binary data and create a contract Factory.
- You can absolutely work with just ethers.js to interact with the smart contract but HardHat provides a more robust way
  to achieve the same result.

#### Hardhat features

- It is used by several billion dollar protocols like InstaDapp, Aave, Uniswap etc.
- It gives us environment to compile, deploy, test and debug EVM based smart contracts.
- Provides Local Blockchain Network like Ganache to test the application faster.
- Has a lot of plugins which extends its features.

#### Hardhat characteristics

- Everything in Hardhat is defined as a task.
- Everytime you run Hardhat from command line, you are basically running a hardhat task.
- Hardhat comes with predefined tasks. You can extend those tasks by installing plugins.
- A task can call other task. So, there are a lot of plugins available which combines the work of multiple task into 
  single.
- There is a task called compile. this tasks compiles all the contracts inside the contracts' folder.
- There is a task called test. this tasks runs all the tests inside the test folder.
- There is a task called run. this tasks runs user defined scripts.
  - First, it compiles all the contracts in the project.
  - Then it runs the user defined script.
  - The run task will also set HRE (Hardhat Runtime Environment) as a global variable for the script. 
  So, you don't need to import it. 
  - However, if you are running the script as a standalone file, you need to import hre.
- By default, hardhat spins up a local Hardhat blockchain network whenever it is run.
- The network is closed whenever the project finishes executing.
- However, you can spin up a local Hardhat blockchain network in a standalone way which runs for as long as you want. 
  - The network will use JSON-RPC Interface.
  - You can connect to this network using providers like MetaMask or even a Dapp frontend.