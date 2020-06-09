---
title: Enable and manage point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: Learn how to use point-in-time restore (preview) to restore block blobs to a state at an earlier point in time.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/28/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage point-in-time restore for block blobs (preview)

You can use point-in-time restore (preview) to restore block blobs to their state at an earlier point in time. This article describes how to enable point-in-time restore for a storage account with PowerShell. It also shows how to perform a restore operation with PowerShell.

For more information and to learn how to register for the preview, see [Point-in-time restore for block blobs (preview)](point-in-time-restore-overview.md).

> [!CAUTION]
> Point-in-time restore supports restoring operations on block blobs only. Operations on containers cannot be restored. If you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation during the point-in-time restore preview, that container cannot be restored with a restore operation. During the preview, instead of deleting a container, delete individual blobs if you may want to restore them.

> [!IMPORTANT]
> The point-in-time restore preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

## Install the preview module

To configure Azure point-in-time restore with PowerShell, first install version [1.14.1-preview](https://www.powershellgallery.com/packages/Az.Storage/1.14.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the preview module:

1. Uninstall any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.

1. Make sure that you have the latest version of PowerShellGet installed. Open a Windows PowerShell window, and run the following command to install the latest version:

    ```powershell
    Install-Module PowerShellGet –Repository PSGallery –Force
    ```

1. Close and reopen the PowerShell window after installing PowerShellGet.

1. Install the latest version of Azure PowerShell:

    ```powershell
    Install-Module Az –Repository PSGallery –AllowClobber
    ```

1. Install the Az.Storage preview module:

    ```powershell
    Install-Module Az.Storage -Repository PSGallery -RequiredVersion 1.14.1-preview -AllowPrerelease -AllowClobber -Force
    ```

For more information about installing Azure PowerShell, see [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

## Enable and configure point-in-time restore

Before you enable and configure point-in-time restore, enable its prerequisites: soft delete, change feed, and blob versioning. For more information about enabling each of these features, see these articles:

- [Enable soft delete for blobs](soft-delete-enable.md)
- [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed)
- [Enable and manage blob versioning](versioning-enable.md)

To configure Azure point-in-time restore with PowerShell, call the Enable-AzStorageBlobRestorePolicy command. The following example enables soft delete and sets the soft-delete retention period, enables change feed, and then enables point-in-time restore. Before running the example, use the Azure portal or an Azure Resource Manager template to also enable blob versioning.

When running the example, remember to replace the values in angle brackets with your own values:

```powershell
# Sign in to your Azure account.
Connect-AzAccount

# Set resource group and account variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Enable soft delete with a retention of 6 days.
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RetentionDays 6

# Enable change feed.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EnableChangeFeed $true

# Enable point-in-time restore with a retention period of 5 days.
# The retention period for point-in-time restore must be at least one day less than that set for soft delete.
Enable-AzStorageBlobRestorePolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RestoreDays 5

# View the service settings.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName
```

## Perform a restore operation

To initiate a restore operation, call the Restore-AzStorageBlobRange command, specifying the restore point as a UTC **DateTime** value. You can specify lexicographical ranges of blobs to restore, or omit a range to restore all blobs in all containers in the storage account. Up to 10 lexicographical ranges are supported per restore operation. The restore operation may take several minutes to complete.

Keep in mind the following rules when specifying a range of blobs to restore:

- The container pattern specified for the start range and end range must include a minimum of three characters. The forward slash (/) that is used to separate a container name from a blob name does not count toward this minimum.
- Up to 10 ranges can be specified per restore operation.
- Wildcard characters are not supported. They are treated as standard characters.
- You can restore blobs in the `$root` and `$web` containers by explicitly specifying them in a range passed to a restore operation. The `$root` and `$web` containers are restored only if they are explicitly specified. Other system containers cannot restored.

> [!IMPORTANT]
> When you perform a restore operation, Azure Storage blocks data operations on the blobs in the ranges being restored for the duration of the operation. Read, write, and delete operations are blocked in the primary location. For this reason, operations such as listing containers in the Azure portal may not perform as expected while the restore operation is underway.
>
> Read operations from the secondary location may proceed during the restore operation if the storage account is geo-replicated.

### Restore all containers in the account

To restore all containers and blobs in the storage account, call the Restore-AzStorageBlobRange command, omitting the `-BlobRestoreRange` parameter. The following example restores containers in the storage account to their state 12 hours before the present moment:

```powershell
# Specify -TimeToRestore as a UTC value
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)
```

### Restore a single range of block blobs

To restore a range of blobs, call the Restore-AzStorageBlobRange command and specify a lexicographical range of container and blob names for the `-BlobRestoreRange` parameter. The start of the range is in inclusive, and the end of the range is exclusive.

For example, to restore the blobs in a single container named *sample-container*, you can specify a range that starts with *sample-container* and ends with *sample-container1*. There is no requirement for the containers named in the start and end ranges to exist. Because the end of the range is exclusive, even if the storage account includes a container named *sample-container1*, only the container named *sample-container* will be restored:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container -EndRange sample-container1
```

To specify a subset of blobs in a container to restore, use a forward slash (/) to separate the container name from the blob pattern. For example, the following range selects blobs in a single container whose names begin with the letters *d* through *f*:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container/d -EndRange sample-container/g
```

Next, provide the range to the Restore-AzStorageBlobRange command. Specify the restore point by providing a UTC **DateTime** value for the `-TimeToRestore` parameter. The following example restores blobs in the specified range to their state 3 days before the present moment:

```powershell
# Specify -TimeToRestore as a UTC value
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -BlobRestoreRange $range `
    -TimeToRestore (Get-Date).AddDays(-3)
```

### Restore multiple ranges of block blobs

To restore multiple ranges of block blobs, specify an array of ranges for the `-BlobRestoreRange` parameter. Up to 10 ranges are supported per restore operation. The following example specifies two ranges to restore the complete contents of *container1* and *container4*:

```powershell
$range1 = New-AzStorageBlobRangeToRestore -StartRange container1 -EndRange container2
$range2 = New-AzStorageBlobRangeToRestore -StartRange container4 -EndRange container5

Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddMinutes(-30) `
    -BlobRestoreRange @($range1, $range2)
```

## Next steps

- [Point-in-time restore for block blobs (preview)](point-in-time-restore-overview.md)
- [Soft delete](soft-delete-overview.md)
- [Change feed (preview)](storage-blob-change-feed.md)
- [Blob versioning (preview)](versioning-overview.md)
