---
title: Recover a deleted storage account
titleSuffix: Azure Storage
description: Learn how to recover a deleted storage account within the Azure portal.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/11/2020
ms.author: tamram
ms.subservice: common
---

# Recover a deleted storage account

A deleted storage account may be recovered in some cases from within the Azure portal. To recover a storage account, the following conditions must be true:

- The storage account was deleted within the past 14 days.
- The storage account was created with the Azure Resource Manager deployment model.
- A new storage account with the same name has not been created since the original account was deleted.

Before you attempt to recover a deleted storage account, make sure that the resource group for that account exists. If the resource group was deleted, you must recreate it. Recovering a resource group is not possible. For more information, see [Manage resource groups](../../azure-resource-manager/management/manage-resource-groups-portal.md).

If the deleted storage account used customer-managed keys with Azure Key Vault and the key vault has also been deleted, then you must restore the key vault before you restore the storage account. For more information, see [Azure Key Vault recovery overview](../../key-vault/general/key-vault-recovery.md).

> [!IMPORTANT]
> Recovery of a deleted storage account is not guaranteed. Recovery is a best-effort attempt. Microsoft recommends locking resources to prevent accidental account deletion. For more information about resource locks, see [Lock resources to prevent changes](../../azure-resource-manager/management/lock-resources.md).
>
> Another best practice to avoid accidental account deletion is to limit the number of users who have permissions to delete an account via role-based access control (Azure RBAC). For more information, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

## Recover a deleted account from the Azure portal

To recover a deleted storage account from within another storage account, follow these steps:

1. Navigate to the overview page for an existing storage account in the Azure portal.
1. In the **Support + troubleshooting** section, select **Recover deleted account**.
1. From the dropdown, select the account to recover, as shown in the following image. If the storage account that you want to recover is not in the dropdown, then it cannot be recovered.

    :::image type="content" source="media/storage-account-recover/recover-account-portal.png" alt-text="Screenshot showing how to recover storage account in Azure portal":::

1. Select the **Recover** button to restore the account. The portal displays a notification that the recovery is in progress.

## Recover a deleted account via a support ticket

1. In the Azure portal, navigate to **Help + support**.
1. Select **New support request**.
1. On the **Basics** tab, in the **Issue type** field, select **Technical**.
1. In the **Subscription** field, select the subscription that contained the deleted storage account.
1. In the **Service** field, select **Storage Account Management**.
1. In the **Resource** field, select any storage account resource. The deleted storage account will not appear in the list.
1. Add a brief summary of the issue.
1. In the **Problem type** field, select **Deletion and Recovery**.
1. In the **Problem subtype** field, select **Recover deleted storage account**. The following image shows an example of the **Basics** tab being filled out:

    :::image type="content" source="media/storage-account-recover/recover-account-support-basics.png" alt-text="Screenshot showing how to recover a storage account through support ticket - Basics tab":::

1. Next, navigate to the **Solutions** tab, and select **Customer-Controlled Storage Account Recovery**, as shown in the following image:

    :::image type="content" source="media/storage-account-recover/recover-account-support-solutions.png" alt-text="Screenshot showing how to recover a storage account through support ticket - Solutions tab":::

1. From the dropdown, select the account to recover, as shown in the following image. If the storage account that you want to recover is not in the dropdown, then it cannot be recovered.

    :::image type="content" source="media/storage-account-recover/recover-account-support.png" alt-text="Screenshot showing how to recover a storage account through support ticket":::

1. Select the **Recover** button to restore the account. The portal displays a notification that the recovery is in progress.

## Next steps

- [Storage account overview](storage-account-overview.md)
- [Create a storage account](storage-account-create.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
