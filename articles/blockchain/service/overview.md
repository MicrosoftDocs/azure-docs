---
title: Azure Blockchain Service
description: Overview of the Azure Blockchain Service
services: azure-blockchain
keywords: blockchain
author: PatAltimore
ms.author: patricka
ms.date: 03/06/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: janders
manager: femila
#Customer intent: As a network operator or developer, I want to understand how I can use Azure Blockchain Service to build and manage consortium blockchain networks on Azure
---

# What is Azure Blockchain Service?

Azure Blockchain Service is a fully managed ledger service that enables users the ability to grow and operate blockchain networks at scale in Azure.  By providing unified control for both infrastructure management as well as blockchain network governance, Azure Blockchain Service provides:

- Simple network deployment and operations
- Built-in consortium management
- Open and extensible design

Azure Blockchain Service is designed to support multiple ledger protocols, with currently providing support for the Ethereum [Quorum](https://www.jpmorgan.com/Quorum) ledger.

These capabilities require almost no administration and all are provided at no additional cost. You can focus on app development and business logic rather than allocating time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open-source tools and platform of your choice to deliver your solutions without having to learn new skills.

This article is an introduction to Azure Blockchain Service core concepts and features related to performance, scalability, and manageability.

## Simple network deployment and operations

The Azure Blockchain Service offers two service tiers: Basic and Standard. Each tier offers different performance and capabilities to support lightweight development and test workloads up to massively scaled production blockchain deployments. Both tiers include at least one transaction node, and one validator node (Basic) or two validator nodes (Standard).  After provisioning your first blockchain member, you have the ability to add additional transaction nodes to your member.  By default, transaction nodes are secured and will need to be configured for access. For more information, see [configure transaction nodes]().

As a managed service, Azure Blockchain Service will ensure that your blockchain member's nodes are patched with the latest host operating system and ledger software stack updates, configured for high-availability, eliminating much of the DevOps required for traditional IaaS blockchain nodes.  In addition, Azure Blockchain Service provides rich metrics through Azure Monitor Service providing insights into nodes' CPU, memory and storage usage, as well as helpful insights into blockchain network activity such as transactions and blocks mined, transaction queue depth, as well as active connections.

## Built-in consortium management

When deploying your first blockchain member, you will also either join, or create a new, consortium.  A consortium is a logical group used to manage the governance and connectivity between blockchain members who transact in a multi-party process.  Azure Blockchain Service provides built-in governance controls through pre-defined smart contracts, which determine what actions members in the consortium can take.  These governance controls can be customized as necessary by the administrator of the consortium. When you create a new consortium, your blockchain member is the default administrator of the consortium, enabling the ability to invite other parties to join your consortium.  You can join a consortium only if you have been previously invited to do so.  When joining a consortium, your blockchain member is subject to the governance controls put in place by the consortium's administrator.  For more information, see [Consortium Management]().

## Open and extensible design

Based on the open-sourced Quorum Ethereum ledger, you can develop applications for Azure Blockchain Service the same way as you do for existing Ethereum applications.  Support for tools such as Truffle and MetaMask work with Azure Blockchain Service, as well as the suite of tools already available from Microsoft for blockchain development, such as Azure Blockchain Workbench, the Azure Blockchain Developer Kit, and Visual Studio Code.

## Need help or have feedback?

- Visit the [Azure Blockchain blog](https://azure.microsoft.com/blog/topics/blockchain/), [Microsoft Tech Community](https://techcommunity.microsoft.com/t5/Blockchain/bd-p/AzureBlockchain), and [Azure Blockchain forum](https://aka.ms/workbenchforum).
- To provide feedback or to request new features, create an entry via [UserVoice](https://aka.ms/blockchainuservoice).

## Next steps

Now that you've read an introduction to Azure Blockchain Service, you're ready to:
- To get started [create a blockchain member using the Azure portal](create-member.md) or [create a blockchain member using Azure CLI]()
- Build your first app using the [Azure Blockchain Development Kit]()
- See the [pricing page](https://azure.microsoft.com/pricing/) for cost comparisons and calculators.
