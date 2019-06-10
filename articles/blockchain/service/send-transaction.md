---
title: Send transactions using Azure Blockchain Service
description: Tutorial on how to use Azure Blockchain Service to deploy a smart contract and send a transaction.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 06/07/2019
ms.topic: tutorial
ms.service: azure-blockchain
ms.reviewer: chrisseg
manager: femila
#Customer intent: As a developer, I want to use Azure Blockchain Service so that I can send a blockchain transaction to a consortium member.
---

# Tutorial: Send a transaction to Azure Blockchain Service

In this tutorial, you'll use the Azure Blockchain Development Kit for Ethereum to create and deploy a smart contract then send a transaction to a consortium member blockchain in Azure Blockchain Service.

You use Azure Blockchain Development Kit to:

> [!div class="checklist"]
> * Connect to Azure Blockchain Service consortium member
> * Create a smart contract
> * Deploy a smart contract
> * Send a transaction

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Complete [Quickstart: Create a blockchain member using the Azure portal](create-member.md) or [Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI](create-member-cli.md)
* [Visual Studio Code](https://code.visualstudio.com/Download)
* [Azure Blockchain Development Kit for Ethereum extension](https://marketplace.visualstudio.com/items?itemName=AzBlockchain.azure-blockchain)
* [Node.js (10.15.0)](https://nodejs.org)
* [Git (2.10.0)](https://git-scm.com)
* [Python (2.7.15)](https://www.python.org/downloads/release/python-2715/). Add python.exe to your path.
* [Truffle (5.0.0)](https://github.com/trufflesuite/truffle)
* [Ganache CLI (6.0.0)](https://github.com/trufflesuite/ganache-cli)

## Connect to consortium member

You can connect to consortium members using the Azure Blockchain Development Kit for Ethereum extension.

1. Complete the prerequisite [Quickstart: Create a blockchain member using the Azure portal](create-member.md) or [Quickstart: Create an Azure Blockchain Service blockchain member using Azure CLI](create-member-cli.md).
1. Choose **Azure Blockchain: Connect to Consortium** from the Visual Studio Code (VS Code) command palette.
1. Choose **Connect to Azure Blockchain Service consortium**. If prompted for Azure authentication, follow the prompts to authenticate using a browser. 
1. Select the subscription and resource group associated with your Azure Blockchain Service consortium member.
1. Choose the consortium member from the list.

## Create smart contract

The Azure Blockchain Development Kit for Ethereum uses the Truffle Suite of tools to help scaffold, build, and deploy contracts.

1. Choose **Azure Blockchain: new Solidity Project** from the VS Code command palette.
1. Choose **Create basic project**.
1. Create a new folder named `newcontract` and **Select new project path**. The Azure Blockchain Development Kit uses Truffle to create and initialize the Solidity project. The project structure looks like the following:

    [screenshot]

Your Solidity project includes a simple contract and all the necessary files to build and deploy a simple, working, contract to the Azure Blockchain Service.

## Build smart contract

Explain build.

1. Open the contract folder.
1. Choose **Azure Blockchain: Build Contracts** from the VS Code command palette.

Once compiled, you have your contract, contract metadata (e.g., contract ABI, bytecode) available in the ./build directory.

Once you deployment/creation of the Azure Blockchain Service is complete you will also see that consortium in your VS Code Blockchain tab. 

## Deploy smart contract

Explain deploy.

1. To deploy your contract, choose **Azure Blockchain: Deploy Contracts** from the VS Code command palette.
1. Options for test, local, and consortium. Choose consortium network. 
1. Generate mnemonic. Save it.

the deployment process gives users the option to deploy a contract to a local Ethereum emulation environment, an Azure Blockchain Service, or various public Ethereum endpoints such as a testnet, or mainnet. 



1. In the **contracts** folder, create a new file named `SimpleStorage.sol`. Add the following code.

    ```solidity
    pragma solidity >=0.4.21 <0.6.0;
    
    contract SimpleStorage {
        string public storedData;
    
        constructor(string memory initVal) public {
            storedData = initVal;
        }
    
        function set(string memory x) public {
            storedData = x;
        }
    
        function get() view public returns (string memory retVal) {
            return storedData;
        }
    }
    ```
    
1. In the **migrations** folder, create a new file named `2_deploy_simplestorage.js`. Add the following code.

    ```solidity
    var SimpleStorage = artifacts.require("SimpleStorage.sol");
    
    module.exports = function(deployer) {
    
      // Pass 42 to the contract as the first constructor parameter
      deployer.deploy(SimpleStorage, "42", {privateFor: ["<alpha node public key>"], from:"<Ethereum account address>"})  
    };
    ```

1. Replace the values in the angle brackets.

    | Value | Description
    |-------|-------------
    | \<alpha node public key\> | Public key of the alpha node
    | \<Ethereum account address\> | Ethereum account address created in the default transaction node

    In this example, the initial value of the **storeData** value is set to 42.

    **privateFor** defines the nodes to which the contract is available. In this example, the default transaction node's account can cast private transactions to the **alpha** node. You add public keys for all private transaction participants. If you don't include **privateFor:** and **from:**, the smart contract transactions are public and can be seen by all consortium members.

1. Save all files by selecting **File > Save All**.

## Deploy smart contract

Use Truffle to deploy `SimpleStorage.sol` to default transaction node network.

```bash
truffle migrate --network defaultnode
```

Truffle first compiles and then deploys the **SimpleStorage** smart contract.

Example output:

```
admin@desktop:/mnt/c/truffledemo$ truffle migrate --network defaultnode

2_deploy_simplestorage.js
=========================

   Deploying 'SimpleStorage'
   -------------------------
   > transaction hash:    0x3f695ff225e7d11a0239ffcaaab0d5f72adb545912693a77fbfc11c0dbe7ba72
   > Blocks: 2            Seconds: 12
   > contract address:    0x0b15c15C739c1F3C1e041ef70E0011e641C9D763
   > account:             0x1a0B9683B449A8FcAd294A01E881c90c734735C3
   > balance:             0
   > gas used:            0
   > gas price:           0 gwei
   > value sent:          0 ETH
   > total cost:          0 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:                   0 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0 ETH
```

## Validate contract privacy

Because of contract privacy, contract values can only be queried from nodes we declared in **privateFor**. In this example, we can query the default transaction node because the account exists in that node. 

1. Using the Truffle console, connect to the default transaction node.

    ```bash
    truffle console --network defaultnode
    ```

1. In the Truffle console, execute code that returns the value of the contract instance.

    ```bash
    SimpleStorage.deployed().then(function(instance){return instance.get();})
    ```

    If querying the default transaction node is successful, the value 42 is returned. For example:

    ```
    admin@desktop:/mnt/c/truffledemo$ truffle console --network defaultnode
    truffle(defaultnode)> SimpleStorage.deployed().then(function(instance){return instance.get();})
    '42'
    ```

1. Exit the Truffle console.

    ```bash
    .exit
    ```

Since we declared **alpha** node's public key in **privateFor**, we can query the **alpha** node.

1. Using the Truffle console, connect to the **alpha** node.

    ```bash
    truffle console --network alpha
    ```

1. In the Truffle console, execute code that returns the value of the contract instance.

    ```bash
    SimpleStorage.deployed().then(function(instance){return instance.get();})
    ```

    If querying the **alpha** node is successful, the value 42 is returned. For example:

    ```
    admin@desktop:/mnt/c/truffledemo$ truffle console --network alpha
    truffle(alpha)> SimpleStorage.deployed().then(function(instance){return instance.get();})
    '42'
    ```

1. Exit the Truffle console.

    ```bash
    .exit
    ```

Since we did not declare **beta** node's public key in **privateFor**, we won't be able to query the **beta** node because of contract privacy.

1. Using the Truffle console, connect to the **beta** node.

    ```bash
    truffle console --network beta
    ```

1. Execute a code that returns the value of the contract instance.

    ```bash
    SimpleStorage.deployed().then(function(instance){return instance.get();})
    ```

1. Querying the **beta** node fails since the contract is private. For example:

    ```
    admin@desktop:/mnt/c/truffledemo$ truffle console --network beta
    truffle(beta)> SimpleStorage.deployed().then(function(instance){return instance.get();})
    Thrown:
    Error: Returned values aren't valid, did it run Out of Gas?
        at XMLHttpRequest._onHttpResponseEnd (/mnt/c/truffledemo/node_modules/xhr2-cookies/xml-http-request.ts:345:8)
        at XMLHttpRequest._setReadyState (/mnt/c/truffledemo/node_modules/xhr2-cookies/xml-http-request.ts:219:8)
        at XMLHttpRequestEventTarget.dispatchEvent (/mnt/c/truffledemo/node_modules/xhr2-cookies/xml-http-request-event-target.ts:44:13)
        at XMLHttpRequest.request.onreadystatechange (/mnt/c/truffledemo/node_modules/web3-providers-http/src/index.js:96:13)
    ```

1. Exit the Truffle console.

    ```bash
    .exit
    ```
    
## Send a transaction

1. Create a file called `sampletx.js`. Save it in the root of your project.
1. The following script sets the contract **storedData** variable value to 65. Add the code to the new file.

    ```javascript
    var SimpleStorage = artifacts.require("SimpleStorage");
    
    module.exports = function(done) {
      console.log("Getting deployed version of SimpleStorage...")
      SimpleStorage.deployed().then(function(instance) {
        console.log("Setting value to 65...");
        return instance.set("65", {privateFor: ["<alpha node public key>"], from:"<Ethereum account address>"});
      }).then(function(result) {
        console.log("Transaction:", result.tx);
        console.log("Finished!");
        done();
      }).catch(function(e) {
        console.log(e);
        done();
      });
    };
    ```

    Replace the values in the angle brackets then save the file.

    | Value | Description
    |-------|-------------
    | \<alpha node public key\> | Public key of the alpha node
    | \<Ethereum account address\> | Ethereum account address created in the default transaction node.

    **privateFor** defines the nodes to which the transaction is available. In this example, the default transaction node's account can cast private transactions to the **alpha** node. You need to add public keys for all private transaction participants.

1. Use Truffle to execute the script for the default transaction node.

    ```bash
    truffle exec sampletx.js --network defaultnode
    ```

1. In the Truffle console, execute code that returns the value of the contract instance.

    ```bash
    SimpleStorage.deployed().then(function(instance){return instance.get();})
    ```

    If the transaction was successful, the value 65 is returned. For example:
    
    ```
    Getting deployed version of SimpleStorage...
    Setting value to 65...
    Transaction: 0x864e67744c2502ce75ef6e5e09d1bfeb5cdfb7b880428fceca84bc8fd44e6ce0
    Finished!
    ```

1. Exit the Truffle console.

    ```bash
    .exit
    ```
    
## Validate transaction privacy

Because of transaction privacy, transactions can only be performed on nodes we declared in **privateFor**. In this example, we can perform transactions since we declared **alpha** node's public key in **privateFor**. 

1. Use Truffle to execute the transaction on the **alpha** node.

    ```bash
    truffle exec sampletx.js --network alpha
    ```
    
1. Execute code that returns the value of the contract instance.

    ```bash
    SimpleStorage.deployed().then(function(instance){return instance.get();})
    ```
    
    If the transaction was successful, the value 65 is returned. For example:

    ```
    Getting deployed version of SimpleStorage...
    Setting value to 65...
    Transaction: 0x864e67744c2502ce75ef6e5e09d1bfeb5cdfb7b880428fceca84bc8fd44e6ce0
    Finished!
    ```
    
1. Exit the Truffle console.

    ```bash
    .exit
    ```

## Clean up resources

When no longer needed, you can delete the resources by deleting the `myResourceGroup` resource group you created by the Azure Blockchain Service.

To delete the resource group:

1. In the Azure portal, navigate to **Resource group** in the left navigation pane and select the resource group you want to delete.
1. Select **Delete resource group**. Verify deletion by entering the resource group name and select **Delete**.

## Next steps

In this tutorial, you added two transaction nodes to demonstrate contract and transaction privacy. You used the default node to deploy a private smart contract. You tested privacy by querying contract values and performing transactions on the blockchain.

> [!div class="nextstepaction"]
> [Developing blockchain applications using Azure Blockchain Service](develop.md)
