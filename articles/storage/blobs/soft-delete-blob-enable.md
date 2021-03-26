---
title: Enable soft delete for blobs
titleSuffix: Azure Storage 
description: Enable soft delete for blobs to more easily recover your data when it is erroneously modified or deleted.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 03/26/2021
ms.author: tamram
ms.subservice: blobs 
ms.custom: "devx-track-azurecli, devx-track-csharp"
---

# Enable soft delete for blobs

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted.

Blob soft delete is part of a comprehensive data protection strategy for blob data. To learn more about Microsoft's recommendations for data protection, see [Data protection overview](data-protection-overview.md). For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

## Enable blob soft delete

Blob soft delete is disabled by default for a new storage account. You can enable or disable soft delete for a storage account at any time by using the Azure portal, PowerShell, or Azure CLI.

# [Portal](#tab/azure-portal)

To enable blob soft delete for your storage account by using the Azure portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), navigate to your storage account.
1. Locate the **Data Protection** option under **Blob service**.
1. In the **Recovery** section, select **Turn on soft delete for blobs**.
1. Specify a retention period between 1 and 365 days. Microsoft recommends a minimum retention period of seven days.
1. Save your changes.

![Screenshot showing how to enable soft delete in the Azure portal](media/soft-delete-blob-enable/storage-blob-soft-delete-portal-configuration.png)

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

To enable blob soft delete with PowerShell, call the [Enable-AzStorageDeleteRetentionPolicy](/powershell/module/az.storage/enable-azstoragedeleteretentionpolicy) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. This example uses an Azure Active Directory (Azure AD) account to authorize the operation, but you could also use the account access key; for more information, see [Run PowerShell commands with Azure AD credentials to access blob data](authorize-data-operations-powershell.md). Remember to replace the placeholder values in brackets with your own values:

```azurepowershell
$storageAccount = "<storage-account>"

$ctx = New-AzStorageContext -StorageAccountName $storageAccount -UseConnectedAccount
Enable-AzStorageDeleteRetentionPolicy -RetentionDays 7 -Context $ctx
```

To check the current settings for blob soft delete, call the [Get-AzStorageServiceProperty](/powershell/module/az.storage/get-azstorageserviceproperty) command:

```azurepowershell
$serviceProperties = Get-AzStorageServiceProperty -ServiceType Blob -Context $ctx
$serviceProperties.DeleteRetentionPolicy.Enabled
$serviceProperties.DeleteRetentionPolicy.RetentionDays
```

The following example enables blob soft delete for a subset of accounts in a subscription:

```azurepowershell
$MatchingAccounts = Get-AzStorageAccount | where-object{$_.StorageAccountName -match "<matching-regex>"}
$MatchingAccounts | Enable-AzStorageDeleteRetentionPolicy -RetentionDays 7
```

# [CLI](#tab/azure-CLI)

To enable blob soft delete with Azure CLI, call the [az storage blob service-properties delete-policy update](/cli/azure/storage/blob/service-properties/delete-policy#az_storage_blob_service_properties_delete_policy_update) command, specifying the retention period in days.

The following example enables blob soft delete and sets the retention period to seven days. This example uses an Azure Active Directory (Azure AD) account to authorize the operation, but you could also use the account access key; for more information, see [Choose how to authorize access to blob data with Azure CLI](authorize-data-operations-cli.md). Remember to replace the placeholder values in brackets with your own values:

```azurecli-interactive
az storage blob service-properties delete-policy update \
    --days-retained 15 \
    --account-name <storage-account> \
    --enable true \
    --auth-mode login
```

To check the current settings for blob soft delete, call the [az storage blob service-properties delete-policy show](/cli/azure/storage/blob/service-properties/delete-policy#az_storage_blob_service_properties_delete_policy_show) command:

```azurecli-interactive
az storage blob service-properties delete-policy show --account-name <storage-account> 
```

---

## View or list soft-deleted blobs

Soft deleted objects are invisible unless explicitly listed.

# [Portal](#tab/azure-portal)

To view soft-deleted blobs in the Azure portal, toggle the **Show deleted blobs** setting. Soft-deleted blobs are displayed with a status of **Deleted**.

![Screenshot showing how to view soft-deleted blobs in the Azure portal](media/soft-delete-blob-enable/storage-blob-soft-delete-portal-view-soft-deleted.png)

When you click on a soft deleted blob or snapshot, notice the new blob properties. They indicate when the object was deleted, and how many days are left until the blob or blob snapshot is permanently expired. If the soft deleted object is not a snapshot, you will also have the option to undelete it.

![Screenshot of the details of a soft deleted object.](media/soft-delete-blob-enable/storage-blob-soft-delete-portal-properties.png)

# [PowerShell](#tab/azure-powershell)


# [CLI](#tab/azure-CLI)



---


## Next steps

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Soft delete for containers (preview)](soft-delete-container-overview.md)
- [Blob versioning](versioning-overview.md)
