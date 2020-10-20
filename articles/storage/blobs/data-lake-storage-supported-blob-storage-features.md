---
title: Blob storage features available in Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about which Blob storage features you can use with Azure Data Lake Storage Gen2
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 09/30/2020
ms.author: normesta
ms.reviewer: stewu
---

# Blob storage features available in Azure Data Lake Storage Gen2

Blob Storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob Storage lifecycle management policies](storage-lifecycle-management-concepts.md) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your Blob storage accounts without losing access to these features.

This table lists the Blob storage features that you can use with Azure Data Lake Storage Gen2. The items that appear in these tables will change over time as support continues to expand. To learn more about specific issues associated with the preview status of a feature, see the [Known issues](data-lake-storage-known-issues.md) article.

## Supported Blob storage features

The following table shows how each Blob storage feature is supported with Data Lake Storage Gen2. There's a column for standard and premium performance tiers. 

> [!NOTE] 
> [Premium tier for Data Lake Storage](premium-tier-for-data-lake-storage.md) is generally available. 

|Blob Storage feature |Standard performance tier |Premium performance tier |Related articles |
|---------------|-------------------|---|
|Hot access tier|Generally available|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Cool access tier|Generally available|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Events|Generally available|Generally available|[Reacting to Blob storage events](storage-blob-event-overview.md)|
|Metrics (Classic)|Generally available|Generally available|[Azure Storage analytics metrics (Classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Metrics in Azure Monitor|Generally available|Preview|[Azure Storage metrics in Azure Monitor](../common/storage-metrics-in-azure-monitor.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob storage PowerShell commands|Generally available|Generally available|[Quickstart: Upload, download, and list blobs with PowerShell](storage-quickstart-blobs-powershell.md)|
|Blob storage Azure CLI commands|Generally available|Generally available|[Quickstart: Create, download, and list blobs with Azure CLI](storage-quickstart-blobs-cli.md)|
|Blob storage APIs|Generally available|Generally available|[Quickstart: Azure Blob storage client library v12 for .NET](storage-quickstart-blobs-dotnet.md)<br>[Quickstart: Manage blobs with Java v12 SDK](storage-quickstart-blobs-java.md)<br>[Quickstart: Manage blobs with Python v12 SDK](storage-quickstart-blobs-python.md)<br>[Quickstart: Manage blobs with JavaScript v12 SDK in Node.js](storage-quickstart-blobs-nodejs.md)|
|Diagnostic logs|Generally available|Preview |[Azure Storage analytics logging](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Archive Access Tier|Generally available|Not supported|[Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
|Lifecycle management policies|Generally available|Not yet supported|[Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md)|
|Logging in Azure Monitor|Preview |Preview|[Monitoring Azure Storage](../common/monitor-storage.md)|
|Snapshots|Preview|Not yet supported|[Blob snapshots](snapshots-overview.md)|
|Static websites|Preview|Preview|[Static website hosting in Azure Storage](storage-blob-static-website.md)|
|Immutable storage|Preview|Not yet supported|[Store business-critical blob data with immutable storage](storage-blob-immutable-storage.md)|
|Container soft delete|Preview|Preview|[Soft delete for containers (preview)](soft-delete-container-overview.md)|
|Blob soft delete|Not yet supported|Not yet supported|[Soft delete for blobs](storage-blob-soft-delete.md)|
|Blobfuse|Preview|Not yet supported|[How to mount Blob storage as a file system with blobfuse](storage-how-to-mount-container-linux.md)|
|Account failover|Not yet supported|Not yet supported|[Disaster recovery and account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)|
|Blob container ACL|Not supported<div role="complementary" aria-labelledby="blob-container-ACL"><sup>1</sup></div>|Not supported<div role="complementary" aria-labelledby="blob-container-ACL"><sup>2</sup></div>|See the related note below this table.|
|Customer-provided keys|Not yet supported|Not yet supported|[Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md)|
|Custom domains|Not yet supported|Not yet supported|[Map a custom domain to an Azure Blob storage endpoint](storage-custom-domain-name.md)|
|Encryption scopes|Not yet supported|Not yet supported|[Create and manage encryption scopes (preview)](encryption-scope-manage.md)|
|Change feed|Not yet supported|Not yet supported|[Change feed support in Azure Blob storage](storage-blob-change-feed.md)|
|Object replication|Not yet supported|Not yet supported|[Configure object replication for block blobs (preview)](object-replication-configure.md)|
|Blob versioning|Not yet supported|Not yet supported|[Enable and manage blob versioning (preview)](versioning-enable.md)|

<div id="blob-container-ACL"><sup>1</sup> You can set ACLs on the root folder of the container but not the container itself.</div><br>

<div id="preview-form"><sup>2</sup>To use snapshots, immutable storage, or static websites with Data Lake Storage Gen2, you need to enroll in the preview by completing this <a href=https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR2EUNXd_ZNJCq_eDwZGaF5VUOUc3NTNQSUdOTjgzVUlVT1pDTzU4WlRKRy4u>form</a>.  </div>

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md)
- [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)
