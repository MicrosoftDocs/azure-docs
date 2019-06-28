---
title: Azure Blockchain Service development overview
description: Introduction on developing solutions on Azure Blockchain Service.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 05/02/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a blockchain developer, I want to understand common development tools I can use with Azure Blockchain Service, so that I can get started developing blockchain applications using Azure.
---

# Azure Blockchain Service development overview

With Azure Blockchain Service, you can create consortium blockchain networks to enable enterprise scenarios like asset tracking, digital token, loyalty and reward, supply chain financial, and provenance. This article is an introduction to Azure Blockchain Service development overview and key topics to implement blockchain for enterprise.

## Client connection to Azure Blockchain Service

There are different types of clients for blockchain networks including full nodes, light nodes, and remote clients. Azure Blockchain Service builds a blockchain network that includes nodes. You can use different clients as your gateway to Azure Blockchain Service for blockchain development. Azure Blockchain Service offers basic authentication or access key as a development endpoint. The following are popular clients you can use connect.

### MetaMask

MetaMask is a browser-based wallet (remote client), RPC client, and basic contract explorer. Unlike other browser wallets, MetaMask injects a web3 instance into the browser JavaScript context, acting as an RPC client that connects to a variety of Ethereum blockchains (*mainnet*, *Ropsten testnet*, *Kovan testnet*, local RPC node, etc.). You can set up custom RPC easily to connect to Azure Blockchain Service and start blockchain development using Remix.

### Geth

Geth is the command-line interface for running a full Ethereum node implemented in Go. You don't need to run full node but can launch its interactive console that provides a JavaScript runtime environment exposing a JavaScript API to interact with Azure Blockchain Service.

## Development framework configuration

To develop sophisticated enterprise blockchain solutions, a development framework is needed to connect to different blockchain networks, manage smart contract lifecycle, automate testing, deploy smart contract with scripts, and equip an interactive console.

Truffle is a popular blockchain development framework to write, compile, deploy, and test decentralized applications on Ethereum blockchains. You can also think of Truffle as a framework that attempts to seamlessly integrate smart contract development and traditional web development.

Even the smallest project interacts with at least two blockchain nodes: One on the developer's machine, and the other representing the network where the developer deploys their application. For example, the main public Ethereum network or Azure Blockchain Service. Truffle provides a system for managing the compilation and deployment artifacts for each network and does so in a way that simplifies final application deployment. For more information, see [Quickstart: Use Truffle to connect to a an Azure Blockchain Service network](connect-truffle.md).

## Ethereum Quorum private transaction

Quorum is an Ethereum-based distributed ledger protocol with transaction plus contract privacy and new consensus mechanisms. Key
enhancements over Go-Ethereum include:

* Privacy - Quorum supports private transactions and private contracts through public and private state separation and utilizes peer-to-peer encrypted message exchanges for directed transfer of private data to network participants.
* Alternative Consensus Mechanisms - with no need for proof-of-work or proof-of-stake consensus in a permissioned network. Quorum offers multiple consensus mechanisms that are designed for consortium chains such as RAFT and IBFT.  Azure Blockchain Services uses the IBFT consensus mechanism.

* Peer Permissioning - node and peer permissioning using smart contracts, ensuring only known parties can join the network
* Higher Performance - Quorum offers higher performance than public Geth

See [Tutorial: Send a transaction using Azure Blockchain Service](send-transaction.md) for an example of private transaction.

## Block explorers

Block explorers are online blockchain browsers that display individual block content, transaction address data, and history. Basic block information is available through Azure Monitor in Azure Blockchain Service, however, if you need more detail information during development, block explorers can be useful.  There are popular open-source block explorers you can use. The following is a list of block explorers that work with Azure Blockchain Service:

* [Azure Blockchain Service Explorer](https://web3labs.com/azure-offer) from Web3 Labs
* [BlockScout](https://github.com/Azure-Samples/blockchain/blob/master/ledger/template/ethereum-on-azure/technology-samples/blockscout/README.md)

## TPS measurement

As blockchain is used in more enterprise scenarios, transactions per second (TPS) speed is important to avoid bottlenecks and system inefficiencies. High transaction rates can be difficult to maintain within a decentralized blockchain. An accurate TPS measurement may be affected by different factors such as server thread, transaction queue size, network latency, and security. If you need to measure TPS speed during development, a popular open-source tool is [ChainHammer](https://github.com/drandreaskrueger/chainhammer).

## Next steps

[Quickstart: Use Truffle to connect to a an Azure Blockchain Service network](connect-truffle.md)
