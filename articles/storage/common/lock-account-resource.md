---
title: Apply an Azure Resource Manager lock to a storage account
titleSuffix: Azure Storage
description: Learn how to apply an Azure Resource Manager lock to a storage account.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 02/25/2021
ms.author: tamram
ms.subservice: common 
---

# Apply an Azure Resource Manager lock to a storage account

To prevent users from deleting a storage account or modifying its configuration, you can apply an Azure Resource Manager lock. There are two types of Azure Resource Manager resource locks:

- A **CannotDelete** lock prevents users from deleting a storage account, but permits reading and modifying its configuration.
- A **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration, but permits reading the configuration.

For more information about Azure Resource Manager locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).

- Lock all of your storage accounts with an Azure Resource Manager lock to prevent accidental or malicious deletion of the storage account.
- Locking a storage account does not protect the data within that account from being updated or deleted. Use the other data protection features described in this guide to protect your data.
- When a **ReadOnly** lock is applied to a storage account, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is blocked for that storage account. Clients must therefore use Azure AD credentials to access blob data in the storage account, unless they are already in possession of the storage account access keys. For more information, see [Choose how to authorize access to blob data in the Azure portal](authorize-data-operations-portal.md).

## Configure a lock for a storage account

# [Azure portal](#tab/portal)

To configure a lock on a storage account with the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under the **Settings** section, select **Locks**.
1. Select **Add**.
1. Provide a name for the resource lock, and specify the type of lock. Add a note about the lock if desired.

# [PowerShell](#tab/azure-powershell)




# [Azure CLI](#tab/azure-cli)


---