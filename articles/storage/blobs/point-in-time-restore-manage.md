---
title: Perform a point-in-time restore on block blob data
titleSuffix: Azure Storage
description: Learn how to use point-in-time restore to restore a set of block blobs to their previous state at a given point in time.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 09/23/2020
ms.author: tamram
ms.subservice: blobs
---

# Perform a point-in-time restore on block blob data

You can use point-in-time restore to restore one or more sets of block blobs to a previous state. This article describes how to enable point-in-time restore for a storage account and how to perform a restore operation.

To learn more about point-in-time restore, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

> [!CAUTION]
> Point-in-time restore supports restoring operations on block blobs only. Operations on containers cannot be restored. If you delete a container from the storage account by calling the [Delete Container](/rest/api/storageservices/delete-container) operation, that container cannot be restored with a restore operation. Instead of deleting a container, delete individual blobs if you may want to restore them.

## Enable and configure point-in-time restore

Before you enable and configure point-in-time restore, enable its prerequisites for the storage account: soft delete, change feed, and blob versioning. For more information about enabling each of these features, see these articles:

- [Enable soft delete for blobs](soft-delete-enable.md)
- [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed)
- [Enable and manage blob versioning](versioning-enable.md)

> [!IMPORTANT]
> Enabling soft delete, change feed, and blob versioning may result in additional charges. For more information, see [Soft delete for blobs](soft-delete-blob-overview.md), [Change feed support in Azure Blob Storage](storage-blob-change-feed.md), and [Blob versioning](versioning-overview.md).

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

To configure point-in-time restore with PowerShell, first install the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module version 2.6.0 or later. Then call the Enable-AzStorageBlobRestorePolicy command to enable point-in-time restore for the storage account.

The following example enables soft delete and sets the soft-delete retention period, enables change feed and versioning, and then enables point-in-time restore.    When running the example, remember to replace the values in angle brackets with your own values:

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

# Enable change feed and versioning.
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EnableChangeFeed $true `
    -IsVersioningEnabled $true

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

Only block blobs are restored. Page blobs and append blobs are not included in a restore operation. For more information about limitations related to append blobs, see [Point-in-time restore for block blobs](point-in-time-restore-overview.md).

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

To restore all containers and blobs in the storage account with PowerShell, call the **Restore-AzStorageBlobRange** command. By default, the **Restore-AzStorageBlobRange** command runs asynchronously, and returns an object of type **PSBlobRestoreStatus** that you can use to check the status of the restore operation.

The following example asynchronously restores containers in the storage account to their state 12 hours before the present moment, and checks some of the properties of the restore operation:

```powershell
# Specify -TimeToRestore as a UTC value
$restoreOperation = Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)

# Get the status of the restore operation.
$restoreOperation.Status
# Get the ID for the restore operation.
$restoreOperation.RestoreId
# Get the restore point in UTC time.
$restoreOperation.Parameters.TimeToRestore
```

To run the restore operation synchronously, include the **-WaitForComplete** parameter on the command. When the **-WaitForComplete** parameter is present, PowerShell displays a message that includes the restore ID for the operation and then blocks on execution until the restore operation is complete. Keep in mind that the length of time required by a restore operation depends on the amount of data to be restored, and a large restore operation may take up to an hour to complete.

```powershell
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12) -WaitForComplete
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

To restore a single range of blobs, call the **Restore-AzStorageBlobRange** command and specify a lexicographical range of container and blob names for the `-BlobRestoreRange` parameter. For example, to restore the blobs in a single container named *container1*, you can specify a range that starts with *container1* and ends with *container2*. There is no requirement for the containers named in the start and end ranges to exist. Because the end of the range is exclusive, even if the storage account includes a container named *container2*, only the container named *container1* will be restored:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange container1 `
    -EndRange container2
```

To specify a subset of blobs in a container to restore, use a forward slash (/) to separate the container name from the blob prefix pattern. For example, the following range selects blobs in a single container whose names begin with the letters *d* through *f*:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange container1/d `
    -EndRange container1/g
```

Next, provide the range to the **Restore-AzStorageBlobRange** command. Specify the restore point by providing a UTC **DateTime** value for the `-TimeToRestore` parameter. The following example restores blobs in the specified range to their state 3 days before the present moment:

```powershell
# Specify -TimeToRestore as a UTC value
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -BlobRestoreRange $range `
    -TimeToRestore (Get-Date).AddDays(-3)
```

By default, the **Restore-AzStorageBlobRange** command runs asynchronously. When you initiate a restore operation asynchronously, PowerShell immediately displays a table of properties for the operation:  

```powershell
Status     RestoreId                            FailureReason Parameters.TimeToRestore     Parameters.BlobRanges
------     ---------                            ------------- ------------------------     ---------------------
InProgress 459c2305-d14a-4394-b02c-48300b368c63               2020-09-15T23:23:07.1490859Z ["container1/d" -> "container1/g"]
```

To restore multiple ranges of block blobs, specify an array of ranges for the `-BlobRestoreRange` parameter. The following example specifies two ranges to restore the complete contents of *container1* and *container4* to their state 24 hours ago, and saves the result to a variable:

```powershell
# Specify a range that includes the complete contents of container1.
$range1 = New-AzStorageBlobRangeToRestore -StartRange container1 `
    -EndRange container2
# Specify a range that includes the complete contents of container4.
$range2 = New-AzStorageBlobRangeToRestore -StartRange container4 `
    -EndRange container5

$restoreOperation = Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-24) `
    -BlobRestoreRange @($range1, $range2)

# Get the status of the restore operation.
$restoreOperation.Status
# Get the ID for the restore operation.
$restoreOperation.RestoreId
# Get the blob ranges specified for the operation.
$restoreOperation.Parameters.BlobRanges
```

To run the restore operation synchronously and block on execution until it is complete, include the **-WaitForComplete** parameter on the command.

---

## Next steps

- [Point-in-time restore for block blobs](point-in-time-restore-overview.md)
- [Soft delete](soft-delete-overview.md)
- [Change feed](storage-blob-change-feed.md)
- [Blob versioning](versioning-overview.md)
