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

1. Launch Truffle's interactive development console.

    ``` bash
    truffle develop
    ```

    Truffle creates a local development blockchain and provides an interactive console.

## Connect to transaction node

Use *Web3* to connect to the transaction node. You can get the *Web3* connection string from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your Azure Blockchain Service member. Select **Transaction nodes** and the default transaction node link.

    ![Select default transaction node](./media/connect-truffle/transaction-nodes.png)

1. Select **Sample Code > Web3**.
1. Copy the JavaScript from **HTTPS (Access key 1)**. You need the code for Truffle's interactive development console.

    ![Web3 code](./media/connect-truffle/web3-code.png)

1. Paste the JavaScript code from the previous step into the Truffle interactive development console. The code creates a web3 object that is connected to your Azure Blockchain Service transaction node.

    Example output:

    ```bash
    truffle(develop)> var Web3 = require("Web3");
    truffle(develop)> var provider = new Web3.providers.HttpProvider("https://myblockchainmember.blockchain.azure.com:3200/hy5FMu5TaPR0Zg8GxiPwned");
    truffle(develop)> var web3 = new Web3(provider);
    ```

    You can call methods on the **web3** object to interact with your transaction node.

1. Call the **getBlockNumber** method to return the current block number.

    ```bash
    web3.eth.getBlockNumber();
    ```

    Example output:

    ```bash
    truffle(develop)> web3.eth.getBlockNumber();
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