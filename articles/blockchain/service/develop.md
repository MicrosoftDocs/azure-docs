---
title: Azure Blockchain Service development overview
description: Introduction on developing solutions on Azure Blockchain Service.
ms.date: 03/26/2020
ms.topic: conceptual
ms.reviewer: janders
#Customer intent: As a blockchain developer, I want to understand common development tools I can use with Azure Blockchain Service, so that I can get started developing blockchain applications using Azure.
---

# Azure Blockchain Service development overview

With Azure Blockchain Service, you can create consortium blockchain networks to enable enterprise scenarios like asset tracking, digital token, loyalty and reward, supply chain financial, and provenance. The following sections introduce Azure Blockchain Service development for implementing enterprise blockchain solutions.

## Connecting to Azure Blockchain Service

There are different types of clients for blockchain networks including full nodes, light nodes, and remote clients. Azure Blockchain Service builds a blockchain network that includes nodes. You can use different clients as your gateway to Azure Blockchain Service for blockchain development. Azure Blockchain Service offers basic authentication or access key as a development endpoint. The following are popular clients you can use connect.

### Visual Studio Code

You can connect to consortium members using the Azure Blockchain Development Kit Visual Studio Code extension. Once connected to a consortium, you can compile, build, and deploy smart contracts to an Azure Blockchain Service consortium member.

To develop sophisticated enterprise blockchain solutions, a development framework is needed to connect to different blockchain networks and manage smart contract lifecycles. Most projects interact with at least two blockchain nodes. Developers use a local blockchain during development. When the application is ready for test or release, the developer deploys to a blockchain network. For example, the main public Ethereum network or Azure Blockchain Service. Azure Blockchain Development Kit for Ethereum extension in Visual Studio Code uses Truffle. Truffle is a popular blockchain development framework to write, compile, deploy, and test decentralized applications on Ethereum blockchains. You can also think of Truffle as a framework that attempts to seamlessly integrate smart contract development and traditional web development.

For more information, see [Quickstart: Use Visual Studio Code to connect to an Azure Blockchain Service consortium network](connect-vscode.md).

### MetaMask

MetaMask is a browser-based wallet (remote client), RPC client, and basic contract explorer. Unlike other browser wallets, MetaMask injects a web3 instance into the browser JavaScript context, acting as an RPC client that connects to a variety of Ethereum blockchains (*mainnet*, *Ropsten testnet*, *Kovan testnet*, local RPC node, etc.). You can set up custom RPC easily to connect to Azure Blockchain Service and start blockchain development using Remix.

For more information, see [Quickstart: Use MetaMask to connect and deploy a smart contract](connect-metamask.md)

### Geth

Geth is the command-line interface for running a full Ethereum node implemented in Go. You don't need to run full node but can launch its interactive console that provides a JavaScript runtime environment exposing a JavaScript API to interact with Azure Blockchain Service.

For more information, see [Quickstart: Use Geth to attach to an Azure Blockchain Service transaction node](connect-geth.md).

## Ethereum Quorum private transactions

Quorum is an Ethereum-based distributed ledger protocol with transaction plus contract privacy and new consensus mechanisms. Key
enhancements over Go-Ethereum include:

* **Privacy** - Quorum supports private transactions and private contracts through public and private state separation and utilizes peer-to-peer encrypted message exchanges for directed transfer of private data to network participants.
* **Alternative consensus mechanisms** - proof-of-work or proof-of-stake consensus is not needed for a permissioned network. Quorum offers multiple consensus mechanisms that are designed for consortium chains such as RAFT and IBFT.  Azure Blockchain Service uses the IBFT consensus mechanism.
* **Peer permissioning** - node and peer permissioning using smart contracts ensures only known parties can join the network.
* **Higher Performance** - Quorum offers higher performance than public Geth.

## Block explorers

Block explorers are online blockchain browsers that display individual block content, transaction address data, and history. Basic block information is available through Azure Monitor in Azure Blockchain Service. However, if you need more detail information during development, block explorers can be useful.  The following block explorers work with Azure Blockchain Service:

* [Epirus Azure Blockchain Service Explorer](https://azuremarketplace.microsoft.com/marketplace/apps/blk-technologies.azure-blockchain-explorer-template?tab=Overview) from Web3 Labs
* [BlockScout](https://github.com/Azure-Samples/blockchain/blob/master/ledger/template/ethereum-on-azure/technology-samples/blockscout/README.md)

You can also build your own block explorer by using Blockchain Data Manager and Azure Cosmos DB, see [Tutorial: Use Blockchain Data Manager to send data to Azure Cosmos DB](data-manager-cosmosdb.md).

## TPS measurement

As blockchain is used in more enterprise scenarios, transactions per second (TPS) speed is important to avoid bottlenecks and system inefficiencies. High transaction rates can be difficult to maintain within a decentralized blockchain. An accurate TPS measurement may be affected by different factors such as server thread, transaction queue size, network latency, and security. If you need to measure TPS speed during development, a popular open-source tool is [ChainHammer](https://github.com/drandreaskrueger/chainhammer).

## Next steps

Try a quickstart using Azure Blockchain Development Kit for Ethereum to attach to a consortium on Azure Blockchain Service.

> [!div class="nextstepaction"]
> [Use Visual Studio Code to connect to Azure Blockchain Service](connect-vscode.md)