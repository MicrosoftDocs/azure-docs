---
title: Enable and manage point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 05/01/2020
ms.author: tamram
ms.subservice: blobs
---

# Enable and manage point-in-time restore for block blobs (preview)

You can use point-in-time restore (preview) to restore block blobs to their state at a given point in time. This article describes how to enable point-in-time restore and how to restore one or more containers to a previous state.

## Install the preview module

To configure Azure point-in-time restore with PowerShell, first install version [1.14.1-preview](https://www.powershellgallery.com/packages/Az.Storage/1.14.1-preview) of the Az.Storage PowerShell module. Follow these steps to install the module:

1. Uninstall any previous installations of Azure PowerShell:

    - Remove any previous installations of Azure PowerShell from Windows using the **Apps & features** setting under **Settings**.
    - Remove all **Azure** modules from `%Program Files%\WindowsPowerShell\Modules`.

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

Before you enable and configure point-in-time restore, enable the other required features: soft delete, change feed, and blob versioning. For more information about enabling each of these features, see these articles:

- [Enable soft delete for blobs](soft-delete-enable.md)
- [Enable and disable the change feed](storage-blob-change-feed.md#enable-and-disable-the-change-feed)
- [Enable and manage blob versioning](versioning-enable.md)

To configure Azure point-in-time restore with PowerShell, call the Enable-AzStorageBlobRestorePolicy command. The following example enables soft delete and sets the soft-delete retention period, enables change feed, and then enables point-in-time restore. Note that the retention period for point-in-time restore must be less than that set for soft delete.

When running the example, remember to replace the values in angle brackets with your own values:

```powershell
# Sign in to your Azure account
Connect-AzAccount

# Set resource group and account variables
$rgName = "<resource-group>"
$accountName = "<storage-account>"

# Enable soft delete with a retention of 6 days
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RetentionDays 6

# Enable change feed
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -EnableChangeFeed $true

# Enable point-in-time restore with a retention period of 5 days
Enable-AzStorageBlobRestorePolicy -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -RestoreDays 5

# View the service settings
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName `
    -StorageAccountName $accountName
```

## Restore all containers in the account

To restore all containers and blobs in the storage account, call the Restore-AzStorageBlobRange command, specifying a UTC **DateTime** value that indicates the restore point. The following example restores containers in the storage account to their state 12 hours before the present moment:

```powershell
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)
```

## Restore a range of containers

To restore a range of containers and blobs, call the Restore-AzStorageBlobRange command and specify a lexicographical range of container and blob names for the **-BlobRestoreRange** parameter. The start of the range is in inclusive, and the end of the range is exclusive.

For example, to restore a single container named *sample-container*, you can specify a range that starts with *sample-container* and ends with *sample-container1*. There is no requirement for the containers named in the start and end range to exist. Because the end of the range is exclusive, even if the storage account includes a container named *sample-container1*, only the container named *sample-container* will be restored by the restore operation:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container -EndRange sample-container1
```

To specify a subset of blobs in a container to restore, use a forward slash (/) to separate the container name from the blob pattern. For example, the following range selects blobs in the container whose names begin with the letters d through f:

```powershell
$range = New-AzStorageBlobRangeToRestore -StartRange sample-container/d -EndRange sample-container/g
```

The following example restores blobs in the specified range to their state 3 days before the present moment:

```powershell
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -BlobRestoreRange $range `
    -TimeToRestore (Get-Date).AddDays(-3)
```

Keep in mind the following rules when specifying a range of containers to restore:

- The container pattern specified for the start range and end range must include a minimum of three characters. The forward slash (/) does not count toward this minimum.
- Only one container range can be specified per restore operation.
- Wildcard characters are not supported.
- You can restore the `$root` and `$web` containers by explicitly specifying them in a range pass to a restore operation. The `$root` and `$web` containers are not restored unless they are explicitly specified, so they are not restored when a restore operation is called without a range. Other system containers cannot restored.

## Next steps

- [Point-in-time restore for block blobs (preview)](point-in-time-restore-overview.md)
- [Soft delete](soft-delete-overview.md)
- [Change feed (preview)](storage-blob-change-feed.md)
- [Blob versioning (preview)](versioning-overview.md)
