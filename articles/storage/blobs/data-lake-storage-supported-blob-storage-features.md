---
title: Blob storage features available in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about which Blob storage features you can use with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 05/10/2020
ms.author: normesta
ms.reviewer: stewu
---

# Blob storage features available in Azure Data Lake Storage Gen2

Blob Storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob Storage lifecycle management policies](storage-lifecycle-management-concepts.md) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your Blob storage accounts without losing access to these features.

This table lists the Blob storage features that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand. To learn more about specific issues associated with the preview status of a feature, see the [Known issues](data-lake-storage-known-issues.md) article.

## Supported Blob storage features

> [!NOTE]
> Support level refers only to how the feature is supported with Data Lake Storage Gen2. 
>
> [Premium-performance BlockBlobStorage accounts](storage-blob-create-account-block-blob.md) for Data Lake Storage Gen2 are currently in public preview. Support-levels for these types of accounts appear in the **BlockBlobStorage (Premium)** column.

|Blob Storage feature |General-purpose V2 |BlockBlobStorage (Premium) |Related articles |
|---------------|-------------------|---|
|Hot access tier|Generally available|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Cool access tier|Generally available|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Events|Generally available|Preview|[Reacting to Blob storage events](storage-blob-event-overview.md)|
|Metrics (Classic)|Generally available|Not supported|[Azure Storage analytics metrics (Classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Metrics in Azure Monitor|Generally available|Preview|[Azure Storage metrics in Azure Monitor](../common/storage-metrics-in-azure-monitor.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob storage PowerShell commands|Generally available|Preview|[Quickstart: Upload, download, and list blobs with PowerShell](storage-quickstart-blobs-powershell.md)|
|Blob storage Azure CLI commands|Generally available|Preview|[Quickstart: Create, download, and list blobs with Azure CLI](storage-quickstart-blobs-cli.md)|
|Blob storage APIs|Generally available|Preview|[Quickstart: Azure Blob storage client library v12 for .NET](storage-quickstart-blobs-dotnet.md)<br>[Quickstart: Manage blobs with Java v12 SDK](storage-quickstart-blobs-java.md)<br>[Quickstart: Manage blobs with Python v12 SDK](storage-quickstart-blobs-python.md)<br>[Quickstart: Manage blobs with JavaScript v12 SDK in Node.js](storage-quickstart-blobs-nodejs.md)|
|Diagnostic logs|Generally available|Preview <div role="complementary" aria-labelledby="diagnostic-logging"><sup>1</sup></div> |[Azure Storage analytics logging](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Logging in Azure Monitor|Preview |Not yet supported|[Monitoring Azure Storage](../common/monitor-storage.md)|
|Archive Access Tier|Preview|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Lifecycle management policies|Preview|Not yet supported|[Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)|
|Change feed|Not yet supported|Not yet supported|[Change feed support in Azure Blob storage](storage-blob-change-feed.md)|
|Account failover|Not yet supported|Not yet supported|[Disaster recovery and account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob container ACL|Not yet supported|Not yet supported|[Set Container ACL](https://docs.microsoft.com/rest/api/storageservices/set-container-acl)|
|Custom domains|Not yet supported|Not yet supported|[Map a custom domain to an Azure Blob storage endpoint](storage-custom-domain-name.md)|
|Immutable storage|Not yet supported|Not yet supported|[Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md)|
|Snapshots|Not yet supported|Not yet supported|[Create and manage a blob snapshot in .NET](storage-blob-snapshots.md)|
|Soft Delete|Not yet supported|Not yet supported|[Soft delete for Azure Storage blobs](storage-blob-soft-delete.md)|
|Static websites|Not yet supported|Not yet supported|[Static website hosting in Azure Storage](storage-blob-static-website.md)|

<div id="diagnostic-logging"><sup>1</sup>For premium block blob storage accounts, diagnostic logs (classic) can't be enabled by using the Azure portal. Enable them by using PowerShell.</div>

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md)
- [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)