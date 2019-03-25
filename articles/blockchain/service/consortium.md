---
title: Azure Blockchain Service Consortium
description: 
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/19/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#Customer intent: As a network operator, I want to understand how a consortium works in Azure Blockchain Service so I can manage participants in the consortium.
---

# Azure Blockchain Service consortium

Azure Blockchain Service uses an Ethereum-based consortium blockchain. Using a consortium, You can secure your blockchain networks by limiting members participating in the network. Consortium members can be individuals or organizations participating in the blockchain.

Consortium management in Azure Blockchain Service is a centralized decision model. There is no consensus in the centralized model. Any participant with an administrator role can manage consortium participants and roles.

## Roles

Azure Blockchain Service supports two consortium participant roles.

### Member

Members are consortium participants with no administrator capabilities. They cannot participate in managing members related to the consortium. The default role for new participants is member.

### Administrator

An administrator can manage members within the consortium. An administrator can invite members, remove members, or update members roles within the consortium.

Consortium founders will automatically be assigned the administrator role.

There must always be at least one administrator within a consortium. The last administrator must specify another participant as an administrator role or must delete the entire blockchain consortium in order to leave the consortium.

## Managing members

Only administrators can invite other participants to the consortium. Administrators invite participants using their Azure subscription ID.

Once invited, participants can join the blockchain consortium by deploying a new member in Azure Blockchain Service.

Administrators can remove any participant from the consortium.  Members can only remove themselves from a consortium.

## Nodes

Azure Blockchain Service has transaction and validation nodes.

## Ethereum account

When a member is created, an Ethereum account key is created. Azure Blockchain uses the key to create transactions related to consortium management. The Ethereum account key is managed by Azure Blockchain Service automatically.

## Next steps

[How to manage members in Azure Blockchain Service](manage-consortium.md)