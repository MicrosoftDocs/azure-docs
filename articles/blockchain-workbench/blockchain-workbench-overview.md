---
title: Azure Blockchain Workbench Overview
description: What is Azure Blockchain Workbench?
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 3/21/2018
ms.topic: overview
# ms.custom: mvc
ms.reviewer: zeyadr
manager: femila
---
# What is Azure Blockchain Workbench?

The Azure Blockchain Workbench helps organizations write smart contracts to enable their business scenarios by generating an end-to-end blockchain application.

Using Azure Blockchain Workbench, you can configure and deploy blockchain proof of concept solutions complete with end to end business flows. 

1. deploy (you get a "shell" kind of an administrator experience.  create users, create apps.)
2. To create an app, create a configuration
3. Write the smart contract code for the app.
4. Upload the configuration and smart contract code into app builder.
5. App builder creates the entire UI
The Workbench uses Azure Resource 

Manager (ARM) template deployment to create the scaffolding for a blockchain application, which includes a web client, gateway API for integration, automatic off chain storage, hashing and signing services, and interaction with identity and secrets management services. This scaffold provides an easy extensible model, allowing developers to replace or add technology components for core system capabilities. Extensions to the Workbench include samples for key scenarios, such as IoT scenarios, which are able to utilize sensor data on the blockchain.

The generated application takes two main inputs from the user -- a smart contract to drive the business logic of the application and configuration metadata associated with the smart contracts to drive application interaction and visualization.

## Workbench Core Capabilities

### Federated Identity

 Workbench provides the capability for a consortium to federate their Enterprise identities using Azure Active Directory (Azure AD). Workbench also generates new user accounts for on a blockchain and associates these "on chain" identities with the enterprise identities stored in Azure AD. The identity mapping facilitates authenticated login to client APIs and applications and leverages the authentication policies of organizations. Workbench also provides the ability to associate enterprise identities to specific roles within a given smart contract. In addition, Workbench also provides a mechanism to identify the actions those roles can take and at what time.

### Automatically Generated Client Applications

Provides out of the box simulation clients for web and mobile (iOS, Android), which can be used to validate, test, and view blockchain applications. The application interface is dynamically generated based on metadata
about the smart contract and can accommodate any use case. This capability enables more rapid iteration and testing of smart
contracts by developers.

### Ledger, Transaction Builder, Transaction Signing, and Transaction Router

Workbench can deploy a blockchain network, transform messages sent to the API to build transactions in a format expected by that blockchain's native API, and then sign and route those transactions to the appropriate blockchain. Workbench currently supports Ethereum and Hyperledger Fabric.

### Robust Integration Capabilities

Workbenchprovides a REST-based API for client development, a message-based API for system-to-system integration, and an off-chain data store providing access to data using SQL. These provide integration points, which can accommodate any scenario. Workbenchalso provides a client library and samples, which showcase how to support a diversity of client types, e.g. bots, IoT, etc.

### Off-Chain Data and Storage

Workbench automatically synchronizes data stored on the blockchain with an off-chain storage, such as a SQL database. In addition, Workbench relies on Azure Storage to store documents and other media associated with blockchain workflows. The database can be used to extend the system to leverage data visualization and intelligence as well as integration with other clients, services, or systems.

### Key Management

As part of its automated deployment generation of applications and establishment of on chain identities, Workbench
leverages Key Vault for storage of keys and secrets today (and will use it eventually for signing of blockchain transactions).

### Document/Media Hashing and Storage

 Workbench supports the ability to add documents/media content to transactions by saving the hashed version of the document in blockchain and the actual content in off-chain storage.

### Event Publishing

Workbenchautomatically delivers events to Event Hub to send messages to downstream consumers. Developers can integrate with Event Hub to drive transactions and to look at results. Capabilities for off-chain data and storage are built using this functionality.

### Monitoring

Workbench provides end to end application logging using Application Insights. Logging including warnings, errors, and
successes.

## Next steps

Try out a tutorial.

> [!div class="checklist"]
> * Create your first blockchain app

