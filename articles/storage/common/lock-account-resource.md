---
title: Apply an Azure Resource Manager lock to a storage account
titleSuffix: Azure Storage
description: Learn how to apply an Azure Resource Manager lock to a storage account.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: how-to
ms.date: 03/09/2021
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
---

# Apply an Azure Resource Manager lock to a storage account

Microsoft recommends locking all of your storage accounts with an Azure Resource Manager lock to prevent accidental or malicious deletion of the storage account. There are two types of Azure Resource Manager resource locks:

- A **CannotDelete** lock prevents users from deleting a storage account, but permits reading and modifying its configuration.
- A **ReadOnly** lock prevents users from deleting a storage account or modifying its configuration, but permits reading the configuration.

For more information about Azure Resource Manager locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).

> [!CAUTION]
> Locking a storage account does not protect containers or blobs within that account from being deleted or overwritten. For more information about how to protect blob data, see [Data protection overview](../blobs/data-protection-overview.md).

## Configure an Azure Resource Manager lock

# [Azure portal](#tab/portal)

To configure a lock on a storage account with the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under the **Settings** section, select **Locks**.
1. Select **Add**.
1. Provide a name for the resource lock, and specify the type of lock. Add a note about the lock if desired.

    :::image type="content" source="media/lock-account-resource/lock-storage-account.png" alt-text="Screenshot showing how to lock a storage account with a CannotDelete lock":::

# [PowerShell](#tab/azure-powershell)

To configure a lock on a storage account with PowerShell, first make sure that you have installed the [Az PowerShell module](https://www.powershellgallery.com/packages/Az). Next, call the [New-AzResourceLock](/powershell/module/az.resources/new-azresourcelock) command and specify the type of lock that you want to create, as shown in the following example:

```azurepowershell
New-AzResourceLock -LockLevel CanNotDelete `
    -LockName <lock> `
    -ResourceName <storage-account> `
    -ResourceType Microsoft.Storage/storageAccounts `
    -ResourceGroupName <resource-group>
```

# [Azure CLI](#tab/azure-cli)

To configure a lock on a storage account with Azure CLI, call the [az lock create](/cli/azure/lock#az-lock-create) command and specify the type of lock that you want to create, as shown in the following example:

```azurecli
az lock create \
    --name <lock> \
    --resource-group <resource-group> \
    --resource <storage-account> \
    --lock-type CanNotDelete \
    --resource-type Microsoft.Storage/storageAccounts
```

---

## Authorizing data operations when a ReadOnly lock is in effect

When a **ReadOnly** lock is applied to a storage account, the [List Keys](/rest/api/storagerp/storageaccounts/listkeys) operation is blocked for that storage account. The **List Keys** operation is an HTTPS POST operation, and all POST operations are prevented when a **ReadOnly** lock is configured for the account. The **List Keys** operation returns the account access keys, which can then be used to read and write to any data in the storage account.

If a client is in possession of the account access keys at the time that the lock is applied to the storage account, then that client can continue to use the keys to access data. However, clients who do not have access to the keys will need to use Azure Active Directory (Azure AD) credentials to access blob or queue data in the storage account.

Users of the Azure portal may be affected when a **ReadOnly** lock is applied, if they have previously accessed blob or queue data in the portal with the account access keys. After the lock is applied, portal users will need to use Azure AD credentials to access blob or queue data in the portal. To do so, a user must have at least two RBAC roles assigned to them: the Azure Resource Manager Reader role at a minimum, and one of the Azure Storage data access roles. For more information, see one of the following articles:

- [Choose how to authorize access to blob data in the Azure portal](../blobs/authorize-data-operations-portal.md)
- [Choose how to authorize access to queue data in the Azure portal](../queues/authorize-data-operations-portal.md)

Data in Azure Files or the Table service may become unaccessible to clients who have previously been accessing it with the account keys. As a best practice, if you must apply a **ReadOnly** lock to a storage account, then move your Azure Files and Table service workloads to a storage account that is not locked with a **ReadOnly** lock.

## Next steps

- [Data protection overview](../blobs/data-protection-overview.md)
- [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md)
