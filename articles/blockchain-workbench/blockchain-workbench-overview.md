---
title: Azure Blockchain Workbench overview
description: Overview of Azure Blockchain Workbench and its capabilities.
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 3/21/2018
ms.topic: overview
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
---
# What is Azure Blockchain Workbench?

Azure Blockchain Workbench is a collection of Azure services and capabilities designed to help you create and deploy blockchain applications to share business processes and data with other organizations. Azure Blockchain Workbench provides the infrastructure scaffolding for building blockchain applications enabling developers to focus on creating business logic and smart contracts. It also makes it easier to create blockchain applications by integrating several Azure services and capabilities to help automate common development tasks.

## Create blockchain applications

With Azure Blockchain Workbench, you can define blockchain applications by defining configuration and writing smart contract code. This allows you to jumpstart blockchain application development and focus on defining your contract and writing business logic instead of building scaffolding and setting up supporting services.

## Manage applications and users

Azure Blockchain Workbench provides a web application and REST APIs for managing applications and users. As an administrator on an Azure Blockchain Workbench instance, you are provided an out of the box experience which makes it easy to manage application access and assign your users to application roles.  Azure AD users are automatically mapped to members in the application.

## Integrate blockchain with applications

Azure Blockchain Workbench is designed so users can customize and develop specific to their requirements. The REST API and message-based API makes it easily extensible and provides a pluggable model to allow for replacing or using multiple distributed ledger technologies, storage, and database offerings.

## Deploy a blockchain network

Azure Blockchain Workbench simplifies consortium blockchain network setup as a preconfigured solution with an Azure Resource Manager (ARM) solution template. The ARM solution template provides a clickthrough deployment experience which will deploy all components needed to run a consortium 

## Use Active Directory login

With existing blockchain protocols, blockchain identities are represented as an address on the network. Azure Blockchain Workbench abstracts away the blockchain identity by associating it with an Active Directory identity, making it simpler to build enterprise applications with Active Directory identities.

## Synchronize on-chain data with off-chain storage

Azure Blockchain Workbench makes it easier to analyze blockchain events and data by automatically synchronizing data on the blockchain to off-chain storage. Instead of extracting data directly from the blockchain, users can directly query off-chain systems (such as a more traditional database system), so blockchain specific expertise is not required for end users who are purely doing data analysis work. 

## Capabilities

### Federated identity

Workbench provides the capability for a consortium to federate their Enterprise identities using Azure Active Directory (Azure AD). Workbench generates new user accounts for on-chain identities with the enterprise identities stored in Azure AD. The identity mapping facilitates authenticated login to client APIs and applications and leverages the authentication policies of organizations. Workbench also provides the ability to associate enterprise identities to specific roles within a given smart contract. In addition, Workbench also provides a mechanism to identify the actions those roles can take and at what time.

### Client applications

Workbench provides automatically generated client applications for web and mobile (iOS, Android), which can be used to validate, test, and view blockchain applications. The application interface is dynamically generated based on smart contract metadata (Workbench configuration) and can accommodate any use case. The clients enable rapid iteration and testing of smart contracts by developers.

### Blockchain transactions

Workbench can be used to deploy a blockchain network. Once deployed, Workbench can transform messages sent to its message-based API to build transactions in a format expected by that blockchain’s native API.  Workbench can sign and route transactions to the appropriate blockchain. 

Workbench currently supports Ethereum and Hyperledger Fabric (private preview).

### Robust integration

Workbench provides a REST-based API for client development, a message-based API for system-to-system integration, and an off-chain data store providing access to data using SQL. Workbench also provides a client library and samples developers can use to create a diversity of client types, such as bots or integration with IoT devices.

### Off-chain data and storage

Workbench automatically synchronizes data stored on the blockchain with an off-chain storage, such as a SQL database. In addition, Workbench relies on Azure Storage to store documents and other media associated with blockchain workflows. The database can be used to extend the system to leverage data visualization and intelligence as well as integration with other clients, services, or systems.

### Key management

Workbench uses Azure Key Vault to store keys and secrets for client applications and establishment of on-chain identities.

### Event Publishing

Workbench automatically delivers events to Service Bus and Event Grid to send messages to downstream consumers. Developers can integrate with either of these messaging systems to drive transactions and to look at results. Capabilities for off-chain data and storage are built using this functionality.

### Monitoring

Workbench provides end to end application logging using Application Insights and Azure Monitor. Logging including warnings, errors, and successes.

## Next steps

Try out a tutorial.

> [!div class="checklist"]
> * Create your first blockchain app

