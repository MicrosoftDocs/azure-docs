---
title: Azure Blockchain Service Consortium Management
description: How to manage Azure Blockchain Service consortium members
services: azure-blockchain
keywords: 
author: PatAltimore
ms.author: patricka
ms.date: 03/21/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: zeyadr
manager: femila
#Customer intent: As a network operator, I want to manage members in the consortium so that I can control access to a private blockchain.
---

# Manage members in Azure Blockchain Service

As a consortium administrator, you can invite, add, remove, and change roles for all participants in the blockchain consortium.

## Prerequisites

* [Create a blockchain member using Azure portal](create-member-portal.md)
* For more information about consortiums, members, and nodes, see [Azure Blockchain Service consortium](consortium.md)

## Blockchain members

To view all the members of the consortium:

1. Sign in to the Azure portal.
1. Select the resource group containing the Azure Blockchain service member.
1. Select your managed ledger service member.

    In the overview, you can view details and monitoring information about your service.


1. Select the **Consortium** link to view the blockchain members in the consortium.

    In the consortium member list, you are listed first. A description about subscription ID, role, status: Invited or Active (joined), join date, modified date.

## Manage members

If you are an administrator of the consortium, you get a link to the management view.

Actions include invite, remove, change role

### Invite new member

You start with no members. You need to invite members.

Select Invite.

Enter Azure subscription ID and choose role.

The member has been invited. They can join using the invite.  There's a create experience.

### Remove member

Select remove.

Transactions remain on the blockchain.

Resources remain. Your node is no longer associated with a consortium.

Removed members need to be re-invited. You need to create a new member.

### Edit member

You can change the role. You can change the friendly member name.

If non-administrator, you can change your friendly member name only.

## Next steps

[Azure Blockchain Service consortium](consortium.md)