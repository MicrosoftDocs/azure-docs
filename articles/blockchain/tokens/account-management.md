---
title: Azure Blockchain Tokens account management
description: Using Azure Blockchain Tokens account management, you can create groups and link blockchain accounts to control access to blockchain actions.
services: azure-blockchain
author: PatAltimore
ms.author: patricka
ms.date: 11/04/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: brendal
#Customer intent: As an administrator, I want to use Azure Blockchain Tokens account management to control access to tokens.
---

# Azure Blockchain Tokens account management

[!INCLUDE [Preview note](./includes/preview.md)]

For a blockchain solution, users may require different levels of access to the tokens that are created with the Azure Blockchain Tokens service. In most blockchain scenarios, you need to plan and deploy different blockchain accounts that exist on the ledger. You also need to manage access across participants. Using Azure Blockchain Tokens account management, you can create groups and link blockchain accounts to control access to blockchain actions.

## Blockchain networks

Azure Blockchain Tokens enables deployment and management of tokens across a set of blockchain networks. You can connect a single blockchain ledger or several blockchain ledgers to the service.

## Accounts

For blockchain networks connected to Azure Blockchain Tokens, the service creates and manages the account private-public key pairs and performs transaction signing and submission. Azure Blockchain Tokens also provides identity mapping to match accounts with the public key identity on the ledger.

## Groups

Groups lets you manage a large number of blockchain accounts across connected networks. You can track and audit which applications and users in the directory have the ability to use accounts through Azure Blockchain Tokens APIs. For example, you could group a set of accounts that represent different lines of business or different roles and access to blockchain tokens.

You can also associate a group to an Azure Active Directory user or service principal and this principal has permissions to the group and its associated accounts.  

## Next steps

Learn more about available [Azure Blockchain Tokens templates](templates.md).
