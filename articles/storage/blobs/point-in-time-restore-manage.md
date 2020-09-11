---
title: Enable and manage point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: Learn how to use point-in-time restore (preview) to restore a set of block blobs to a previous state.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/11/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage point-in-time restore for block blobs (preview)

You can use point-in-time restore (preview) to restore a set of block blobs to a previous state. This article describes how to enable point-in-time restore for a storage account with PowerShell. It also shows how to perform a restore operation with PowerShell.

For more information and to learn how to register for the preview, see [Point-in-time restore for block blobs (preview)](point-in-time-restore-overview.md).

> [!CAUTION]
> Point-in-time restore supports restoring operations on block blobs only. Operations on containers cannot be restored. If you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation during the point-in-time restore preview, that container cannot be restored with a restore operation. During the preview, instead of deleting a container, delete individual blobs if you may want to restore them.

> [!IMPORTANT]
> The point-in-time restore preview is intended for non-production use only.

## Enable and configure point-in-time restore

Before you enable and configure point-in-time restore, enable its prerequisites for the storage account: soft delete, change feed, and blob versioning. For more information about enabling each of these features, see these articles:

- [Enable soft delete for blobs](soft-delete-enable.md)
- [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed)
- [Enable and manage blob versioning](versioning-enable.md)

# [Azure portal](#tab/portal)

To configure point-in-time restore with the Azure portal, follow these steps:

1. Navigate to your storage account in the Azure portal.
1. Under **Settings**, choose **Data Protection**.
1. Select **Turn on point-in-time** restore. When you select this option, soft delete for blobs, versioning, and change feed are also enabled.
1. Set the maximum restore point for point-in-time restore, in days. This number must be at least one day less than the retention period specified for blob soft delete.
1. Save your changes.

The following image shows a storage account configured for point-in-time restore with a restore point of seven days ago, and a retention period for blob soft delete of 14 days.

:::image type="content" source="media/point-in-time-restore-manage/configure-point-in-time-restore-portal.png" alt-text="Screenshot showing how to configure point-in-time restore in the Azure portal":::

# [PowerShell](#tab/powershell)

To configure point-in-time restore with PowerShell, first install the Az.Storage preview module version 1.14.1-preview or a later version of the preview module. Remove any other versions of the Az.Storage module.

Verify that you have installed version 2.2.4.1 or later of PowerShellGet. To determine what version you currently have installed, run the following command:

```powershell
Get-InstalledModule PowerShellGet
```

Next, install the Az.Storage preview module. The following command installs version [2.5.2-preview](https://www.powershellgallery.com/packages/Az.Storage/2.5.2-preview) of the Az.Storage module:

```powershell
Install-Module -Name Az.Storage -RequiredVersion 2.5.2-preview -AllowPrerelease
```

For more information about installing Azure PowerShell, see [Installing PowerShellGet](/powershell/scripting/gallery/installing-psget) and [Install Azure PowerShell with PowerShellGet](/powershell/azure/install-az-ps).

To configure Azure point-in-time restore with PowerShell, call the Enable-AzStorageBlobRestorePolicy command. The following example enables soft delete and sets the soft-delete retention period, enables change feed, and then enables point-in-time restore. Before running the example, use the Azure portal or an Azure Resource Manager template to also enable blob versioning.

When running the example, remember to replace the values in angle brackets with your own values:

```powershell
# Sign in to your Azure account.
Connect-AzAccount

# Set resource group and account variables.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Enable soft delete with a retention of 14 days.
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RetentionDays 14

# Enable change feed.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EnableChangeFeed $true

# Enable point-in-time restore with a retention period of 7 days.
# The retention period for point-in-time restore must be at least
# one day less than that set for soft delete.
Enable-AzStorageBlobRestorePolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RestoreDays 7

# View the service settings.
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName
```

---

## Perform a restore operation

When you perform a restore operation, you must specify the restore point as a UTC **DateTime** value. Containers and blobs will be restored to their state at that day and time. The restore operation may take several minutes to complete.

You can restore all containers in the storage account, or you can restore a range of blobs in one or more containers. A range of blobs is defined lexicographically, meaning in dictionary order. Up to ten lexicographical ranges are supported per restore operation. The start of the range is inclusive, and the end of the range is exclusive.

The container pattern specified for the start range and end range must include a minimum of three characters. The forward slash (/) that is used to separate a container name from a blob name does not count toward this minimum.

Wildcard characters are not supported in a lexicographical range. Any wildcard characters are treated as standard characters.

You can restore blobs in the `$root` and `$web` containers by explicitly specifying them in a range passed to a restore operation. The `$root` and `$web` containers are restored only if they are explicitly specified. Other system containers cannot restored.

Only block blobs are restored. Page blobs and append blobs are not included in a restore operation. For more information about limitations related to append blobs, see [Known issues](#known-issues).

> [!IMPORTANT]
> When you perform a restore operation, Azure Storage blocks data operations on the blobs in the ranges being restored for the duration of the operation. Read, write, and delete operations are blocked in the primary location. For this reason, operations such as listing containers in the Azure portal may not perform as expected while the restore operation is underway.
>
> Read operations from the secondary location may proceed during the restore operation if the storage account is geo-replicated.

### Restore all containers in the account

You can restore all containers in the storage account to return them to their previous state at a given point in time.

# [Azure portal](#tab/portal)

To restore all containers and blobs in the storage account with the Azure portal, follow these steps:

1. Navigate to the list of containers for your storage account.
1. On the toolbar, choose **Restore containers**, then **Restore all**.
1. In the **Restore all containers** pane, specify the restore point by providing a date and time.
1. Confirm that you want to proceed by checking the box.
1. Select **Restore** to begin the restore operation.

    :::image type="content" source="media/point-in-time-restore-manage/restore-all-containers-portal.png" alt-text="Screenshot showing how to restore all containers to a specified restore point":::

# [PowerShell](#tab/powershell)

To restore all containers and blobs in the storage account with PowerShell, call the **Restore-AzStorageBlobRange** command, omitting the `-BlobRestoreRange` parameter. The following example restores containers in the storage account to their state 12 hours before the present moment:

```powershell
# Specify -TimeToRestore as a UTC value
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)
```

---

### Restore ranges of block blobs

You can restore one or more lexicographical ranges of blobs within a single container or across multiple containers to return those blobs to their previous state at a given point in time.

# [Azure portal](#tab/portal)

To restore a range of blobs in one or more containers with the Azure portal, follow these steps:

1. Navigate to the list of containers for your storage account.
1. Select the container or containers to restore.
1. On the toolbar, choose **Restore containers**, then **Restore selected**.
1. In the **Restore selected containers** pane, specify the restore point by providing a date and time.
1. Specify the ranges to restore. Use a forward slash (/) to delineate the container name from the blob prefix.
1. By default the **Restore selected containers** pane specifies a range that includes all blobs in the container. Delete this range if you do not want to restore the entire container. The default range is shown in the following image.

    :::image type="content" source="media/point-in-time-restore-manage/delete-default-blob-range.png" alt-text="Screenshot showing the default blob range to delete before specifying custom range":::

1. Confirm that you want to proceed by checking the box.
1. Select **Restore** to begin the restore operation.

The following image shows a restore operation on a set of ranges.

:::image type="content" source="media/point-in-time-restore-manage/restore-multiple-container-ranges-portal.png" alt-text="Screenshot showing how to restore ranges of blobs in one or more containers":::

The restore operation shown in the image performs the following actions:

- Restores the complete contents of *container1*.
- Restores blobs in the lexicographical range *blob1* through *blob5* in *container2*. This range restores blobs with names such as *blob1*, *blob11*, *blob100*, *blob2*, and so on. Because the end of the range is exclusive, it restores blobs whose names begin with *blob4*, but does not restore blobs whose names begin with *blob5*.
- Restores all blobs in *container3* and *container4*. Because the end of the range is exclusive, this range does not restore *container5*.

# [PowerShell](#tab/powershell)

To restore a single range of blobs, call the **Restore-AzStorageBlobRange** command and specify a lexicographical range of container and blob names for the `-BlobRestoreRange` parameter. For example, to restore the blobs in a single container named *sample-container*, you can specify a range that starts with *sample-container* and ends with *sample-container1*. There is no requirement for the containers named in the start and end ranges to exist. Because the end of the range is exclusive, even if the storage account includes a container named *sample-container1*, only the container named *sample-container* will be restored:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container `
    -EndRange sample-container1
```

To specify a subset of blobs in a container to restore, use a forward slash (/) to separate the container name from the blob prefix pattern. For example, the following range selects blobs in a single container whose names begin with the letters *d* through *f*:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container/d `
    -EndRange sample-container/g
```

Next, provide the range to the **Restore-AzStorageBlobRange** command. Specify the restore point by providing a UTC **DateTime** value for the `-TimeToRestore` parameter. The following example restores blobs in the specified range to their state 3 days before the present moment:

```powershell
# Specify -TimeToRestore as a UTC value
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -BlobRestoreRange $range `
    -TimeToRestore (Get-Date).AddDays(-3)
```

To restore multiple ranges of block blobs, specify an array of ranges for the `-BlobRestoreRange` parameter. The following example specifies two ranges to restore the complete contents of *container1* and *container4*:

```powershell
# Specify a range that includes the complete contents of container1.
$range1 = New-AzStorageBlobRangeToRestore -StartRange container1 `
    -EndRange container2
# Specify a range that includes the complete contents of container4.
$range2 = New-AzStorageBlobRangeToRestore -StartRange container4 `
    -EndRange container5

Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddMinutes(-30) `
    -BlobRestoreRange @($range1, $range2)
```

---

### Restore block blobs asynchronously with PowerShell

To run a restore operation asynchronously, add the `-AsJob` parameter to the call to **Restore-AzStorageBlobRange** and store the result of the call in a variable. The **Restore-AzStorageBlobRange** command returns an object of type **AzureLongRunningJob**. You can check the **State** property of this object to determine whether the restore operation has completed. The value of the **State** property may be **Running** or **Completed**.

The following example shows how to call a restore operation asynchronously:

```powershell
$job = Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddMinutes(-5) `
    -AsJob

# Check the state of the job.
$job.State
```

To wait on the completion of the restore operation after it is running, call the [Wait-Job](/powershell/module/microsoft.powershell.core/wait-job) command, as shown in the following example:

```powershell
$job | Wait-Job
```

## Known issues

For a subset of restore operations where append blobs are present, the restore operation will fail. Microsoft recommends that you do not perform a point-in-time restore during the preview if append blobs are present in the account.

## Next steps

- [Point-in-time restore for block blobs (preview)](point-in-time-restore-overview.md)
- [Soft delete](soft-delete-overview.md)
- [Change feed (preview)](storage-blob-change-feed.md)
- [Blob versioning](versioning-overview.md)
