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

Before you enable and configure point-in-time restore, enable the other required features: soft delete, change feed, and blob versioning. For more information about each of these features, see these articles:

- [Soft delete](soft-delete-overview.md).
- [Change feed (preview)](storage-blob-change-feed.md). You must register for the change feed preview before you can enable it.
- [Blob versioning (preview)](versioning-overview.md). To learn how to enable blob versioning in the Azure portal, see [Enable and manage blob versioning](versioning-enable.md).

To configure Azure point-in-time restore with PowerShell, call the Enable-AzStorageBlobRestorePolicy command. The following example enables soft delete and sets the soft-delete retention period, enables change feed, and enables point-in-time restore. Note that the retention period for point-in-time restore must be one or more days less than that set for soft delete.

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

To restore all containers in the storage account, call the Restore-AzStorageBlobRange command, specifying a UTC **DateTime** value that indicates the restore point. The following example restores containers in the storage account to their state 12 hours before the present moment:

```powershell
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)
```

## Restore a range of containers

To restore a range of containers, call the Restore-AzStorageBlobRange command and specify a lexicographical range of container names for the **-BlobRestoreRange** parameter. The start of the range is in inclusive, and the end of the range is exclusive. A container prefix specified as part of a range must include a minimum of three characters. Wildcards are not supported.

For example, to restore a single container named *sample-container*, you can specify a range that starts with *sample-container* and ends with *sample-container1*. There is no requirement for the container named in the end range to exist. Because the end of the range is exclusive, even if the storage account includes a container named *sample-container1*, only the container named *sample-container* will be restored by the restore operation:

```powershell
$range1 = New-AzStorageBlobRangeToRestore -StartRange sample-container -EndRange sample-container1
```



, specifying a **DateTime** value that indicates the restore point. The following example restores containers in the storage account to their state 12 hours before the present moment:

```powershell
Restore-AzStorageBlobRange -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -TimeToRestore (Get-Date).AddHours(-12)
```


## Restore block blob data with point-in-time restore - storage account


## Restore block blob data with point-in-time restore


```powershell
# Set the range(s) that you want to restore (specific containers e.g. a container called “one”):
$range1 = New-AzStorageBlobRangeToRestore -StartRange one/a -EndRange one/z

# Call the restore
Restore-AzStorageBlobRange -ResourceGroupName $rgName -StorageAccountName $accountName -BlobRestoreRange $range1 -TimeToRestore (Get-Date).AddSeconds(-3600)
```

