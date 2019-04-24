---
title: Azure Blockchain Service Development Overview
description: Introduction on developing solutions on Azure Blockchain Service.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 04/24/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: jackyhsu
manager: femila
#Customer intent: As a blockchain developer, I want to understand common development tools I can use with Azure Blockchain Service, so that I can get started developing blockchain applications using Azure.
---

# Azure Blockchain Service development overview

With Azure Blockchain Service, you can create consortium blockchain networks to enable enterprise scenarios like asset tracking, digital token, loyalty and reward, supply chain financial, and provenance. This article is an introduction to Azure Blockchain Service development overview and key topics to implement blockchain for enterprise.

 To get started quickly, you should familiarize yourself with the following topics:

* Client connection to Azure Blockchain Service
* Development framework configuration
* Ethereum Quorum private transaction
* Block explorer

## Client connection to Azure Blockchain Service

There are different types of clients for blockchain network including full node, light node, and remote client. Azure Blockchain Service builds a blockchain network including nodes. You don't need to worry about infrastructure components. Instead you can use different clients as your gateway to Azure Blockchain Service for blockchain development. Azure Blockchain Service offers basic authentication or access key as a development endpoint and below are popular clients you can use connect:

MetaMask is a browser-based wallet (remote client), RPC client, and basic contract explorer. Unlike other browser wallets, MetaMask injects a web3 instance into the browser JavaScript context, acting as an RPC client that connects to a variety of Ethereum blockchains (*mainnet*, *Ropsten testnet*, *Kovan testnet*, local RPC node, etc.). You can set up custom RPC easily to connect to Azure Blockchain Service and start blockchain development using Remix.

Geth is the command-line interface for running a full Ethereum node implemented in Go. You don't need to run full node but can launch its interactive console that provides a JavaScript runtime environment exposing a JavaScript API to interact with Azure Blockchain Service.

## Development framework configuration

To develop sophisticated enterprise blockchain solutions, a development framework is needed to connect to different blockchain networks, manage smart contract lifecycle, automate testing, deploy smart contract with scripts, and equip an interactive console. 

Truffle is a popular blockchain development framework to write, compile, deploy, and test decentralized applications on
Ethereum blockchains. You can also think of Truffle as a framework that attempts to seamlessly integrate smart contract development and traditional web development.

Even the smallest project will interact with at least two blockchain nodes: One on the developer's machine, and the other
representing the network where the developer deploys their application. For example, the main public Ethereum network or Azure
Blockchain Service. Truffle provides a system for managing the compilation and deployment artifacts for each network and does so in a way that simplifies final application deployment. For more information, see xxxx.

## Ethereum Quorum private transaction

Quorum is an Ethereum-based distributed ledger protocol with transaction plus contract privacy and new consensus mechanisms. Key
enhancements over Go-Ethereum include:

* Privacy - Quorum supports private transactions and private contracts through public and private state separation and utilizes peer-to-peer encrypted message exchanges for directed transfer of private data to network participants.
* Alternative Consensus Mechanisms - with no need for proof-of-work or proof-of-stake consensus in a permissioned network. Quorum instead offers multiple consensus mechanisms that are more appropriate for consortium chains and what Azure Blockchain Service supports is Istanbul BFT.

* Peer Permissioning - node and peer permissioning using smart contracts, ensuring only known parties can join the network
* Higher Performance - Quorum offers higher performance than public Geth

See xxx for an example of private transaction example using Azure Blockchain. You can get started using the example to create more sophisticated enterprise blockchain solutions.

## Block explorer

Block explorer is an online blockchain browser that displays the contents of individual blocks, transactions address data, and the
transaction or smart contract histories. Block information is available from portal but if you need more details information during development, there are different open-source block explorers and below are popular ones and working with Azure Blockchain Service:

* [Azure Blockchain Service Explorer](https://web3labs.com/azure-offer) from Web3 Labs
* [BlockScout](https://github.com/Azure-Samples/blockchain/blob/master/ledger/template/ethereum-on-azure/technology-samples/blockscout/README.md)

## Next steps

[Quickstart: Use Truffle to connect to a an Azure Blockchain Service network](connect-truffle.md)
