---
title: Migrate a classic storage account
titleSuffix: Azure Storage
description: Learn how to migrate your classic storage accounts to the Azure Resource Manager deployment model. All classic accounts must be migrated by August 1, 2024.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 01/20/2023
ms.author: tamram
ms.subservice: common
---

# Migrate a classic storage account to Azure Resource Manager

Microsoft will retire classic storage accounts on August 1, 2024. To preserve the data in any classic storage accounts, you must migrate them to the Azure Resource Manager deployment model by that date. After you migrate your account, all of the benefits of the Azure Resource Manager deployment model will be available for that account. For more information about the deployment models, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

This article describes how to migrate your classic storage accounts to the Azure Resource Manager deployment model.

## Migrate a classic storage account

# [Portal](#tab/azure-portal)

To migrate a classic storage account to the Azure Resource Manager deployment model with the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to your classic storage account.
1. In the **Settings** section, click **Migrate to ARM**.
1. Click on **Validate** to determine migration feasibility.

   :::image type="content" source="./media/storage-account-migrate-classic/validate-storage-account.png" alt-text="Screenshot showing how to migrate your classic storage account to Azure Resource Manager.":::

1. After a successful validation, click on **Prepare** to begin the migration.
1. Type **yes** to confirm, then select **Commit** to complete the migration.

# [PowerShell](#tab/azure-powershell)

To migrate a classic storage account to the Azure Resource Manager deployment model with PowerShell, first validate that the account is ready for migration by running the following command. Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
$storageAccountName = "<storage-account>"
Move-AzureStorageAccount -Validate -StorageAccountName $storageAccountName
```

Next, prepare the account for migration:

```azurepowershell
Move-AzureStorageAccount -Prepare -StorageAccountName $storageAccountName
```

Check the configuration for the prepared storage account with either Azure PowerShell or the Azure portal. If you're not ready for migration, use the following command to revert your account to its previous state:

```azurepowershell
Move-AzureStorageAccount -Abort -StorageAccountName $storageAccountName
```

Finally, when you are satisfied with the prepared configuration, move forward with the migration and commit the resources with the following command:

```azurepowershell
Move-AzureStorageAccount -Commit -StorageAccountName $storageAccountName
```

# [Azure CLI](#tab/azure-cli)

To migrate a classic storage account to the Azure Resource Manager deployment model with the Azure CLI, first prepare the account for migration by running the following command. Remember to replace the placeholder values in brackets with your own values:

```azurecli
azure storage account prepare-migration <storage-account>
```

Check the configuration for the prepared storage account with either Azure CLI or the Azure portal. If you're not ready for migration, use the following command to revert your account to its previous state:

```azurecli
azure storage account abort-migration <storage-account>
```

Finally, when you are satisfied with the prepared configuration, move forward with the migration and commit the resources with the following command:

```azurecli
azure storage account commit-migration <storage-account>
```

---

## See also

- [Create a storage account](storage-account-create.md)
- [Move an Azure Storage account to another region](storage-account-move.md)
- [Upgrade to a general-purpose v2 storage account](storage-account-upgrade.md)
- [Get storage account configuration information](storage-account-get-info.md)
