---
title: Blob Storage features available in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about which Blob Storage features you can use with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 02/26/2020
ms.author: normesta
ms.reviewer: stewu
---

# Blob Storage features available in Azure Data Lake Storage Gen2

Blob Storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob Storage lifecycle management policies](storage-lifecycle-management-concepts.md) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on you Blob storage accounts without losing access to these important features. 

This table lists the Blob storage features that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand.

## List of supported Blob Storage features

> [!NOTE]
> Support level refers only to how the feature is supported with Data Lake Storage Gen2.

|Blob Storage feature |Support level |Related articles |
|---------------|-------------------|---|
|Hot access tier |Generally available|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Cool access tier |Generally available|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Events|Generally available|[Reacting to Blob storage events](storage-blob-event-overview.md)|
|Metrics (Classic)|Generally available|[Azure Storage analytics metrics (Classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Metrics in Azure Monitor|Generally available|[Azure Storage metrics in Azure Monitor](../common/storage-metrics-in-azure-monitor.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob Storage PowerShell commands|Generally available|[Quickstart: Upload, download, and list blobs with PowerShell](storage-quickstart-blobs-powershell.md)|
|Blob Storage Azure CLI commands|Generally available|[Quickstart: Create, download, and list blobs with Azure CLI](storage-quickstart-blobs-cli.md)|
|Blob Storage APIs|Generally available|[Quickstart: Azure Blob storage client library v12 for .NET](storage-quickstart-blobs-dotnet.md)<br>[Quickstart: Manage blobs with Java v12 SDK](storage-quickstart-blobs-java.md)<br>[Quickstart: Manage blobs with Python v12 SDK](storage-quickstart-blobs-python.md)<br>[Quickstart: Manage blobs with JavaScript v12 SDK in Node.js](storage-quickstart-blobs-nodejs.md)|
|Archive Access Tier|Preview|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Lifecycle management policies|Preview|[Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)|
|Diagnostic logs|Preview|[Azure Storage analytics logging](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Change feed|Not yet supported|[Change feed support in Azure Blob Storage](storage-blob-change-feed.md)|
|Account failover|Not yet supported|[Disaster recovery and account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob container ACL|Not yet supported|[Set Container ACL](https://docs.microsoft.com/rest/api/storageservices/set-container-acl)|
|Custom domains|Not yet supported|[Map a custom domain to an Azure Blob Storage endpoint](storage-custom-domain-name.md)|
|Immutable storage|Not yet supported|[Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md)|
|Snapshots|Not yet supported|[Create and manage a blob snapshot in .NET](storage-blob-snapshots.md)|
|Soft Delete|Not yet supported|[Soft delete for Azure Storage blobs](storage-blob-soft-delete.md)|
|Static websites|Not yet supported|[Static website hosting in Azure Storage](storage-blob-static-website.md)|
|Logging in Azure Monitor|Not yet supported|Not yet available|
|Premium block blobs|Not yet supported|[Create a BlockBlobStorage account](storage-blob-create-account-block-blob.md)|

## Next steps

- Learn about limitations and known issues when using Blob Storage features with Data Lake Storage Gen2. 

  See [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md).

- Learn about which Azure services are compatible with Data Lake Storage Gen2. 

  See [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md).

- Learn about which open source platforms support Data Lake Storage Gen2. 

  See [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md).

- Learn how multi-protocol access on Data Lake Storage unlocks the ecosystem of tools, applications, and services, as well as several Blob storage features to accounts that have a hierarchical namespace. 

  See [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)