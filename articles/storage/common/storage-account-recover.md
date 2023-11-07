---
title: Recover a deleted storage account
titleSuffix: Azure Storage
description: Learn how to recover a deleted storage account within the Azure portal.
services: storage
author: akashdubey-ms

ms.service: azure-storage
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: akashdubey
ms.subservice: storage-common-concepts
---

# Recover a deleted storage account

A deleted storage account may be recovered in some cases from within the Azure portal. To recover a storage account, the following conditions must be true:

- The storage account was deleted within the past 14 days.
- The storage account was created with the Azure Resource Manager deployment model.
- A new storage account with the same name has not been created since the original account was deleted.
- The user who is recovering the storage account must be assigned an Azure RBAC role that provides the **Microsoft.Storage/storageAccounts/write** permission. For information about built-in Azure RBAC roles that provide this permission, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

Before you attempt to recover a deleted storage account, make sure that the resource group for that account exists. If the resource group was deleted, you must recreate it. Recovering a resource group is not possible. For more information, see [Manage resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md).

If the deleted storage account used customer-managed keys with Azure Key Vault and the key vault has also been deleted, then you must restore the key vault before you restore the storage account. For more information, see [Azure Key Vault recovery overview](../../key-vault/general/key-vault-recovery.md).

> [!IMPORTANT]
> Recovery of a deleted storage account is not guaranteed. Recovery is a best-effort attempt. Microsoft recommends locking resources to prevent accidental account deletion. For more information about resource locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).
>
> Another best practice to avoid accidental account deletion is to limit the number of users who have permissions to delete an account via role-based access control (Azure RBAC). For more information, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

## Recover a deleted account from the Azure portal

To recover a deleted storage account from the Azure portal, follow these steps:

1. Navigate to the [list of your storage accounts](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts) in the Azure portal.
1. Select the **Restore** button to open the **Restore deleted account** pane.

    :::image type="content" source="media/storage-account-recover/restore-button-portal.png" alt-text="Screenshot showing the Restore button in the Azure portal.":::

1. Select the subscription for the account that you want to recover from the **Subscription** drop-down.
1. From the dropdown, select the account to recover, as shown in the following image. If the storage account that you want to recover is not in the dropdown, then it cannot be recovered.

    :::image type="content" source="media/storage-account-recover/recover-account-portal.png" alt-text="Screenshot showing how to recover storage account in Azure portal":::

1. Select the **Restore** button to recover the account. The portal displays a notification that the recovery is in progress.

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
