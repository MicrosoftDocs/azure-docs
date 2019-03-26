---
title: Azure Blockchain Service Consortium
description: 
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/25/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#Customer intent: As a network operator, I want to understand how a consortium works in Azure Blockchain Service so I can manage participants in the consortium.
---

# Azure Blockchain Service Consortium

Using Azure Blockchain Service, you can create private consortium blockchain networks where each blockchain network can be limited to specific participants in the network. Management of the consortium is based on the consensus model of the network. In the current preview release, Azure Blockchain Service provides a centralized consensus model for consortium management. Any privileged participant with an administer role can take consortium management actions, such as adding or removing participants from a network.

## Roles

Participants in a consortium can be individuals or organizations and can be assigned a member or administrator role.

### Member

Members are consortium participants with no administrator capabilities. They cannot participate in managing members related to the consortium. The default role for new participants is member. Members can change their member display name and can remove themselves from a consortium.

### Administrator

An administrator can manage members within the consortium. An administrator can invite members, remove members, or update members roles within the consortium.

There must always be at least one administrator within a consortium. The last administrator must specify another participant as an administrator role before leaving a consortium.

## Managing members

Only administrators can invite other participants to the consortium. Administrators invite participants using their Azure subscription ID.

Once invited, participants can join the blockchain consortium by deploying a new member in Azure Blockchain Service. Note, to view and join the invited consortium, you must specify the same Azure subscription ID used in the invite by the network administrator.

Administrators can remove any participant from the consortium, including other administrators. Members can only remove themselves from a consortium.

## Ethereum account

When a member is created, an Ethereum account key is created. Azure Blockchain Service uses the key to create transactions related to consortium management. The Ethereum account key is managed by Azure Blockchain Service automatically.

## Next steps

[How to manage members in Azure Blockchain Service](manage-consortium.md)
