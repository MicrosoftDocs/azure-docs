---
title: What is Azure Blockchain Tokens
description: Azure Blockchain Tokens is a platform as a service (PaaS) for token issuance and management.
services: azure-blockchain
author: PatAltimore
ms.author: patricka
ms.date: 11/04/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
#Customer intent: As a developer, I want to use Azure Blockchain Tokens to issue and manage blockchain tokens across blockchain ledgers.
---

# What is Azure Blockchain Tokens?

[!INCLUDE [Preview note](./includes/preview.md)]

Azure Blockchain Tokens is a platform as a service (PaaS) for standardized token issuance and management across blockchain ledgers in Azure.

Using Azure Blockchain Tokens you can create standardized tokens for your blockchain solution using a pre-built token template. You can also compose your own token template using the service. Once created, use Azure Blockchain Tokens to connect and issue the tokens on a blockchain. Once issued, you can then manage the tokens across multiple blockchain networks.

## Templates

Use Azure Blockchain Tokens to select a pre-built token template or create your own token template. Azure Blockchain Tokens supports token template composability that allows you to create your own token template based on supported behaviors. Token templates can be used for most blockchain solutions since they map to the most commonly utilized tokens. You can start with a template, personalize it, and deploy the tokens for your solution.

For more information on Azure Blockchain Tokens templates, see [Azure Blockchain Tokens templates](templates.md).

## Management

Azure Blockchain Tokens provides Azure portal management and APIs to connect to an existing blockchain network. Currently, you can connect to [Azure Blockchain Service](../service/overview.md) or another Ethereum family blockchain.

Once connected to one or multiple blockchain networks, you can use Azure Blockchain Tokens APIs to issue and manage tokens for use in your blockchain solution. Using APIs, you can integrate token management in your business applications and logic. For example, you can use the REST API to  manage tokens instead of managing tokens directly on the blockchain.

## Blockchains and accounts

Azure Blockchain Tokens provides Azure portal management and APIs to create new groups and new blockchain accounts on connected blockchain networks. You can create new accounts directly on your connected networks, and Azure Blockchain Tokens manages your account private keys on your behalf. Using groups, you can group together different blockchain accounts from multiple networks and manage access control via the groups.

For more information on Azure Blockchain Tokens account management, see [Azure Blockchain Tokens account management](account-management.md).

## Token Taxonomy Framework

Azure Blockchain Tokens is built on a standards-based foundation named the Token Taxonomy Framework (TTF). TTF is a set of deliverables created from the [Token Taxonomy Initiative](https://entethalliance.org/participate/token-taxonomy-initiative/) (TTI) token working group. The TTI working group defines a business taxonomy for tokens and their behaviors that can be applied across all major ledgers including Ethereum, Quorum, Corda, and Hyperledger Fabric. The working group's goal is to create a framework that standardizes the use of tokens from a business perspective to drive simplification and democratize token based development. By letting the industry define these tokens and their behavior at the business level, the detailed implementation of the tokens are abstracted away from the business logic that manipulates the tokens.

## Next steps

Learn more about available [Azure Blockchain Tokens templates](templates.md).
