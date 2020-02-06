---
title: Multi-protocol access on Azure Data Lake Storage | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with Azure Data Lake Storage Gen2.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/01/2019
ms.author: normesta
ms.reviewer: stewu
---
# Multi-protocol access on Azure Data Lake Storage

Blob APIs now work with accounts that have a hierarchical namespace. This unlocks the ecosystem of tools, applications, and services, as well as several Blob storage features to accounts that have a hierarchical namespace.

Until recently, you might have had to maintain separate storage solutions for object storage and analytics storage. That's because Azure Data Lake Storage Gen2 had limited ecosystem support. It also had limited access to Blob service features such as diagnostic logging. A fragmented storage solution is hard to maintain because you have to move data between accounts to accomplish various scenarios. You no longer have to do that.

With multi-protocol access on Data Lake Storage, you can work with your data by using the ecosystem of tools, applications, and services. This also includes third-party tools and applications. You can point them to accounts that have a hierarchical namespace without having to modify them. These applications work *as is* even if they call Blob APIs, because Blob APIs can now operate on data in accounts that have a hierarchical namespace.

Blob storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob storage lifecycle management policies](storage-lifecycle-management-concepts.md) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your blob storage accounts without losing access to these important features. 

> [!NOTE]
> Multi-protocol access on Data Lake Storage is generally available and is available in all regions. Some Azure services or blob storage features enabled by multi-protocol access remain in preview. See the tables in each section of this article for more information. 

## How multi-protocol access on data lake storage works

Blob APIs and Data Lake Storage Gen2 APIs can operate on the same data in storage accounts that have a hierarchical namespace. Data Lake Storage Gen2 routes Blob APIs through the hierarchical namespace so that you can get the benefits of first class directory operations and POSIX-compliant access control lists (ACLs). 

![Multi-protocol access on Data Lake Storage conceptual](./media/data-lake-storage-interop/interop-concept.png) 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. Data Lake Storage Gen2 consistently applies directory and file-level ACLs regardless of the protocol that tools and applications use to access the data. 

## Blob storage feature support

Multi-protocol access on Data Lake Storage enables you to use more Blob storage features with your Data Lake Storage. This table lists the  features that are enabled by multi-protocol access on Data Lake Storage. 

The items that appear in this table will change over time as support for Blob storage features continues to expand. 

> [!NOTE]
> Even though multi-protocol access on Data Lake Storage is generally available, support for some of these features remain in preview. 

|Blob storage feature | Support level |
|---|---|
|[Cool access tier](storage-blob-storage-tiers.md)|Generally available|
|Blob REST APIs|Generally available|
|Blob SDKs |Generally available|
|[PowerShell (Blob)](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-powershell) |Generally available|
|[CLI (Blob)](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-cli) |Generally available|
|[Notifications via Azure Event Grid](data-lake-storage-events.md)|Generally available|
|Blob SDKs with file system semantics ([.NET](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-directory-file-acl-dotnet) &vert; [Python](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-directory-file-acl-python) &vert; [Java](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-directory-file-acl-java))|Preview|
|[PowerShell with file system semantics](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-directory-file-acl-powershell)|Preview|
|[CLI with file system semantics](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-directory-file-acl-cli)|Preview|
|[Diagnostic logs](../common/storage-analytics-logging.md)| Preview|
|[Lifecycle management policies](storage-lifecycle-management-concepts.md)| Preview|
|[Archive access tier](storage-blob-storage-tiers.md)| Preview|
|[blobfuse](storage-how-to-mount-container-linux.md)|Not yet supported|
|[Immutable storage](storage-blob-immutable-storage.md)|Not yet supported|
|[Snapshots](storage-blob-snapshots.md)|Not yet supported|
|[Soft delete](storage-blob-soft-delete.md)|Not yet supported|
|[Static websites](storage-blob-static-website.md)|Not yet supported|

To learn more about general known issues and limitations with Azure Data Lake Storage Gen2, see [Known issues](data-lake-storage-known-issues.md).

## Azure ecosystem support

Multi-protocol access on Data Lake Storage also enables you to connect more Azure services with your Data Lake Storage. This table lists the services that are enabled by multi-protocol access on Data Lake Storage. 

Just like the list of supported Blob storage features, the items that appear in this table will change over time as support for Azure services continues to expand. 

> [!NOTE]
> Even though multi-protocol access on Data Lake Storage is generally available, support for some of these services remain in preview. 

|Azure service | Support level |
|---|---|
|[Azure Data Box](data-lake-storage-migrate-on-premises-hdfs-cluster.md)|Generally available|
|[Azure Event Hubs capture](https://docs.microsoft.com/azure/event-hubs/event-hubs-capture-overview)|Generally available|
|[Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-quick-create-portal)|Generally available|
|[IoT Hub](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-d2c)|Generally available|
|[Logic apps](https://azure.microsoft.com/services/logic-apps/)|Generally available|
|[Azure Cognitive Search](https://docs.microsoft.com/azure/search/search-howto-index-azure-data-lake-storage)|Preview|

For the complete list of Azure ecosystem support for Data Lake Storage Gen2, see [Integrate Azure Data Lake Storage with Azure services](data-lake-storage-integrate-with-azure-services.md).

To learn more about general known issues and limitations with Azure Data Lake Storage Gen2, see [Known issues](data-lake-storage-known-issues.md).

## Next steps

See [Known issues](data-lake-storage-known-issues.md)




