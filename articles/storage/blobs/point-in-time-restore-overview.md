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

Point-in-time restore for block blobs provides protection for your data against accidental deletion or corruption. After you enable point-in-time restore for a storage account, you can restore one or more storage account containers to their previous state at a specified point in time. Point-in-time restore is useful in scenarios where a user or application accidentally deletes data or where an application error corrupts data. Point-in-time restore also enables testing scenarios that require reverting a data set to a known state before running further tests.

## How point-in-time restore works



### Point-in-time restore works with change feed, soft delete, and blob versioning

Point-in-time restore relies on the following Azure Storage features:

- Change feed (preview): Change feed is required for point-in-time restore. You must register for the change feed preview if you have not already. After you are registered, change feed will automatically be enabled when you enable point-in-time restore if it is not already enabled. For more information about change feed, see [Change feed support in Azure Blob Storage (Preview)](blobs/storage-blob-change-feed.md).
- Soft delete: Soft delete is required for point-in-time restore. After you are registered, soft delete will automatically be enabled when you enable point-in-time restore if it is not already enabled. For more information about soft delete, see [Soft delete for Blob storage](blobs/soft-delete-overview.md).
- Blob versioning (preview): Enabling blob versioning is optional for the point-in-time restore preview. For more information about blob versioning, see [Blob versioning (preview)](blobs/versioning-overview.md).

### Retention period for point-in-time restore

When you enable point-in-time restore for a storage account, you specify a retention period. Block blobs in your storage account can be restored during the retention period.

The retention period begins when you enable point-in-time restore, and you cannot restore data to a state prior to the beginning of the retention period. For example, if you enabled point-in-time restore on May 1st with a retention of 30 days, then on May 15th you can restore to a maximum of 15 days. As of June 1st, you can restore data from between 1 and 30 days.





Point-in-time restore 

## About the preview

The point-in-time restore preview is available in the West Central US region. Point-in-time restore is supported for general-purpose v2 storage accounts configured for locally redundant storage (LRS) or geo-redundant storage (GRS) only???. Only data in the hot and cool access tiers can be restored with point-in-time restore.

Not supported:

- Premium block blobs are not supported.
- Restoring data in the archive tier is not supported.

> [!IMPORTANT]
> The point-in-time restore preview is intended for non-production use only. Production service-level agreements (SLAs) are not currently available.

### Register for the preview

To register for the preview, run the following commands from Azure PowerShell:

```powershell
# Register for the point-in-time restore preview
Register-AzProviderFeature -FeatureName RestoreBlobRanges -ProviderNamespace Microsoft.Storage

# Register for change feed (preview)
Register-AzProviderFeature -FeatureName Changefeed -ProviderNamespace Microsoft.Storage

# Refresh the Azure Storage provider namespace
Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

To check the status of your registration, run the following commands:

```powershell
Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName RestoreBlobRanges

Get-AzProviderFeature -ProviderNamespace Microsoft.Storage `
    -FeatureName Changefeed
```

## Next steps
