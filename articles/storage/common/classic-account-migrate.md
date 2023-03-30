---
title: How to migrate your classic storage accounts to Azure Resource Manager
titleSuffix: Azure Storage
description: Learn how to migrate your classic storage accounts to the Azure Resource Manager deployment model. All classic accounts must be migrated by August 31, 2024.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/27/2023
ms.author: tamram
ms.subservice: common
---

# How to migrate your classic storage accounts to Azure Resource Manager

Microsoft will retire classic storage accounts on August 31, 2024. To preserve the data in any classic storage accounts, you must migrate them to the Azure Resource Manager deployment model by that date. After you migrate your account, all of the benefits of the Azure Resource Manager deployment model will be available for that account. For more information about the deployment models, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

This article describes how to migrate your classic storage accounts to the Azure Resource Manager deployment model. For more information, see [Migrate your classic storage accounts to Azure Resource Manager by August 31, 2024](classic-account-migration-overview.md).

## Identify classic storage accounts in your subscription

# [Portal](#tab/azure-portal)

To list classic storage accounts in your subscription with the Azure portal:

1. Navigate to the list of your storage accounts in the Azure portal.
1. Select **Add filter**. In the **Filter** dialog, set the **Filter** field to **Type** and the **Operator** field to **Equals**. Then set the **Value** field to **microsoft.classicstorage/storageaccounts**.

    :::image type="content" source="media/classic-account-migrate/classic-accounts-list-portal.png" alt-text="Screenshot showing how to list classic storage accounts in Azure portal." lightbox="media/classic-account-migrate/classic-accounts-list-portal.png":::

# [PowerShell](#tab/azure-powershell)

To list classic storage accounts in your subscription with PowerShell, run the following command:

```azurepowershell
Get-AzResource -ResourceType Microsoft.ClassicStorage/storageAccounts
```

# [Azure CLI](#tab/azure-cli)

To list classic storage accounts in your subscription with Azure CLI, run the following command:

```azurecli
$ az resource list \
  --resource-type Microsoft.ClassicStorage/storageAccounts \
  --query "[].{resource_type:type, name:name}" \
  --output table 
```

---

## Migrate a classic storage account

To migrate a classic storage account to the Azure Resource Manager deployment model with the Azure portal:

1. Navigate to your classic storage account in the Azure portal.
1. In the **Settings** section, click **Migrate to ARM**.
1. Click on **Validate** to determine migration feasibility.

   :::image type="content" source="./media/classic-account-migrate/validate-storage-account.png" alt-text="Screenshot showing how to migrate your classic storage account to Azure Resource Manager." lightbox="./media/classic-account-migrate/validate-storage-account.png":::

1. After a successful validation, click on **Prepare** button to simulate the migration.

  > [!IMPORTANT]
  > There may be a delay of a few minutes after validation is complete before the Prepare button is enabled.

1. If the Prepare step completes successfully, you'll see a link to the new resource group. Select that link to navigate to the new resource group. The migrated storage account appears under the **Resources** tab in the **Overview** page for the new resource group.

    At this point you can compare the configuration and data in the classic storage account to the newly migrated storage account. You'll see both in the list of storage accounts in the portal. Both the classic account and the migrated account have the same name.

    :::image type="content" source="media/classic-account-migrate/compare-classic-migrated-accounts.png" alt-text="Screenshot showing the results of the Prepare step in the Azure portal." lightbox="media/classic-account-migrate/compare-classic-migrated-accounts.png":::

1. If you're not satisfied with the results of the migration, select **Abort** to delete the new storage account and resource group. You can then address any problems and try again.
1. When you're ready to commit, type **yes** to confirm, then select **Commit** to complete the migration.

### Locate and delete disk artifacts in a classic account

Classic storage accounts may contain classic (unmanaged) disks, virtual machine images, and operating system (OS) images. To migrate the account, you may need to delete these artifacts first.

To delete disk artifacts from the Azure portal, follow these steps:

1. Navigate to the Azure portal.
1. In the **Search** bar at the top, search for **Disks (classic)**, **OS Images (classic)**, or **VM Images (classic)** to display classic disk artifacts.
1. Locate the classic disk artifact to delete, and select it to view its properties.
1. Select the **Delete** button to delete the disk artifact.

    :::image type="content" source="media/classic-account-migrate/delete-disk-artifacts-portal.png" alt-text="Screenshot showing how to delete classic disk artifacts in Azure portal." lightbox="media/classic-account-migrate/delete-disk-artifacts-portal.png":::

## See also

- [Migrate your classic storage accounts to Azure Resource Manager by August 31, 2024](classic-account-migration-overview.md)
- [Understand storage account migration from the classic deployment model to Azure Resource Manager](classic-account-migration-process.md)
