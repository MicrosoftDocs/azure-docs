---
title: #Required; page title is displayed in search results. Include the brand.
description: #Required; article description that is displayed in search results. 
author: #Required; your GitHub user alias, with correct capitalization.
ms.author: #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Getting started

## Register the feature

Register your subscription to the Microsoft.StoragePool provider in order to use the feature.

1. Sign in to the Azure portal
1. On the Azure portal menu, search for and select Subscriptions.
1. Select the subscription you want to use for disk pools.
1. On the left menu, under Settings, select Resource providers.
1. Find the resource provider Microsoft.StoragePool and select Register.

## Delete subnet permission

Once your subscription has been registered, you must delegate a subnet to your Azure disk pool. When creating a disk pool, you specify a virtual network and the delegated subnet. You may either create a new subnet or use an existing one and delegate to the Microsoft.StoragePool/diskPools resource provider.

1. Go to the virtual networks blade in the Azure portal and select the virtual network you will use for the disk pool.
1. Select Subnets from the virtual network blade and select +Subnet.
1. Create a new subnet by completing the following required fields in the Add Subnet page:
    - Name: Specify name.
    - Address range: Specify IP address range.
    - Subnet delegation: Select Microsoft.StoragePool/diskPools

## Provide StoragePool resource provider permission to the disks that will be in the disk pool.

You need to provide the StoragePool resource provider Read & Write permissions to any managed disk that is going to be in a disk pool, in order for the disk pool to work correctly.

1. Sign in to the Azure portal.
1. Search for and select either the resource group that contains the disks or each disk themselves.
1. Select Access control (IAM).
1. Select Add > Add role assignment, and select Azure Disk Contributor in the Role list.
1. Select User, group, or service principal in the Assign access to list.
1. In the Select section, search for StoragePool Resource Provider, select it, and save.

