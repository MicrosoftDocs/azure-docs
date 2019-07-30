---
title: Connect using Truffle
description: Connect to an Azure Blockchain Service network using Truffle
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/29/2019
ms.topic: quickstart
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a developer, I want to connect to my blockchain member node so that I can perform actions on a blockchain.
---

# Quickstart: Use Truffle to connect to an Azure Blockchain Service network

Truffle is a blockchain development environment you can use to connect to an Azure Blockchain Service node.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Create an Azure Blockchain member](create-member.md)
* Install [Truffle](https://github.com/trufflesuite/truffle). Truffle requires several tools to be installed including [Node.js](https://nodejs.org), [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
* Install [Python 2.7.15](https://www.python.org/downloads/release/python-2715/). Python is needed for Web3.
* Install [Visual Studio Code](https://code.visualstudio.com/Download)
* Install [Visual Studio Code Solidity extension](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

## Create Truffle project

1. Open a Node.js command prompt or shell.
1. Change directory to where you want to create the Truffle project directory.
1. Create a directory for the project and change your path to the new directory. For example,

    ``` bash
    mkdir truffledemo
    cd truffledemo
    ```

1. Initialize the Truffle project.

    ``` bash
    truffle init
    ```

1. Install Ethereum JavaScript API web3 in the project folder. Currently, version web3 version 1.0.0-beta.37 is required.

    ``` bash
    npm install web3@1.0.0-beta.37
    ```

    You may receive npm warnings during installation.
    
## Configure Truffle project

To configure the Truffle project, you need some transaction node information from the Azure portal.

### Transaction node endpoint addresses

1. In the Azure portal, navigate to each transaction node and select **Transaction nodes > Connection strings**.
1. Copy and save the endpoint URL from **HTTPS (Access key 1)** for each transaction node. You need the endpoint addresses for the smart contract configuration file later in the tutorial.

    ![Transaction endpoint address](./media/send-transaction/endpoint.png)

### Edit configuration file

1. Launch Visual Studio Code and open the Truffle project directory folder using the **File > Open Folder** menu.
1. Open the Truffle configuration file `truffle-config.js`.
1. Replace the contents of the file with the following configuration information. Add a variable containing the endpoint address. Replace the angle bracket with values you collected from previous sections.

    ``` javascript
    var defaultnode = "<default transaction node connection string>";   
    var Web3 = require("web3");
    
    module.exports = {
      networks: {
        defaultnode: {
          provider: new Web3.providers.HttpProvider(defaultnode),
          network_id: "*"
        }
      }
    }
    ```

1. Save the changes to `truffle-config.js`.

## Connect to transaction node

Use *Web3* to connect to the transaction node.

1. Use the Truffle console to connect to the default transaction node.

    ``` bash
    truffle console --network defaultnode
    ```

    Truffle connects to the default transaction node and provides an interactive console.

    You can call methods on the **web3** object to interact with your transaction node.

1. Call the **getBlockNumber** method to return the current block number.

    ```bash
    web3.eth.getBlockNumber();
    ```

    Example output:

    ```bash
    truffle(defaultnode)> web3.eth.getBlockNumber();
    18567
    ```
1. Exit the Truffle development console.

    ```bash
    .exit
    ```

## Next steps

In this quickstart, you created a Truffle project to connect to your Azure Blockchain Service default transaction node.

Try the next tutorial to use Truffle to send a transaction to your consortium blockchain network.

> [!div class="nextstepaction"]
> [Send a transaction](send-transaction.md)
