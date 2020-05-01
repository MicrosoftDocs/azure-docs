---
title: Point-in-time restore for block blobs (preview)
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 05/01/2020
ms.author: tamram
ms.subservice: blobs
---

# Point-in-time restore for block blobs (preview)


## Configure point-in-time restore

```powershell
# Login to your account if not already
Connect-AzAccount

# Set resource group and account parameters
$rgName = “<ResourceGroupName>”
$accountName = “<StorageAccountName>”

# Enable Soft Delete with 6 days retention
Enable-AzStorageBlobDeleteRetentionPolicy -ResourceGroupName $rgName -StorageAccountName $accountName -RetentionDays 6

# Enable Change Feed
Update-AzStorageBlobServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName -EnableChangeFeed $true

# Enable PITR with 5 days restoration
Enable-AzStorageBlobRestorePolicy -ResourceGroupName $rgName -StorageAccountName $accountName -RestoreDays 5

# Verify the settings:
Get-AzStorageBlobServiceProperty -ResourceGroupName $rgName -StorageAccountName $accountName
```

## Restore block blob data with point-in-time restore - storage account


## Restore block blob data with point-in-time restore


```powershell
# Set the range(s) that you want to restore (specific containers e.g. a container called “one”):
$range1 = New-AzStorageBlobRangeToRestore -StartRange one/a -EndRange one/z

# Call the restore
Restore-AzStorageBlobRange -ResourceGroupName $rgName -StorageAccountName $accountName -BlobRestoreRange $range1 -TimeToRestore (Get-Date).AddSeconds(-3600)
```

