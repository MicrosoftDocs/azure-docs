---
title: Limitations and known issues with blob access points
titleSuffix: Azure Blob Storage
description: Learn which operations, endpoints, and Blob Storage features work with blob access points, and the current limits and known issues.
author: cmuppala4746
ms.author: cmuppala
ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 11/06/2026
# Customer intent: As a cloud architect, I want to know the limits of blob access points, so that I can plan workloads that work within them.
---

# Limitations and known issues with blob access points

This article describes the limitations and known issues of blob access points. To learn how blob access points work, see [Blob access points overview](blob-access-points-overview.md).

## Supported and unsupported operations

Blobs in a blob access point are read-only. The following table shows which operations are supported.

| Operation | Result on a blob access point |
|---|---|
| [List Blobs](/rest/api/storageservices/list-blobs), [Get Blob Properties](/rest/api/storageservices/get-blob-properties), [Get Blob](/rest/api/storageservices/get-blob) | Supported. The data comes from your data source. |
| [Get Container Properties](/rest/api/storageservices/get-container-properties), [List Containers](/rest/api/storageservices/list-containers2) | Supported. The response identifies blob access points. |
| Operations on the container, such as [Set Container Metadata](/rest/api/storageservices/set-container-metadata) or [Delete Container](/rest/api/storageservices/delete-container) | Supported. They work as they do on any container. |
| Write, update, or delete a blob, such as [Put Blob](/rest/api/storageservices/put-blob), [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata), or [Delete Blob](/rest/api/storageservices/delete-blob) | Not supported. The request fails with status code `409` and error code `OperationNotSupportedForBlobAccessPoints`. |
| Change the configuration that a blob access point uses | Not supported. Create a new blob access point instead. |

## Apache Arrow listings

Storage accounts that allow blob access point creation don't return [List Blobs](/rest/api/storageservices/list-blobs) results in [Apache Arrow format](storage-blobs-list.md). In these accounts:

- A List Blobs request that accepts only Apache Arrow (`Accept: application/vnd.apache.arrow.stream`) isn't supported.
- A List Blobs request that accepts Apache Arrow with XML fallback (`Accept: application/vnd.apache.arrow.stream,application/xml`) returns XML. Ensure that your client handles XML responses.
- A List Blobs request without an `Accept` header returns XML, which is the default.

## Endpoints

Blob access points work only through the Blob Storage endpoint (`<storage-account>.blob.core.windows.net`). This limitation applies to accounts with or without a hierarchical namespace.

- Requests through the Data Lake Storage endpoint (`<storage-account>.dfs.core.windows.net`) fail with status code `409`.
- SFTP and NFS 3.0 clients can't access blob access points. They receive errors from their own protocol, not HTTP status codes.

## Blob properties

For blob access points, your data source provides the `ETag`, `Last-Modified`, and size (`Content-Length`) of each blob. [Get Blob Properties](/rest/api/storageservices/get-blob-properties) and [Get Blob](/rest/api/storageservices/get-blob) also return supported content headers when your data source provides them. The access tier is always reported as Hot. It doesn't reflect the storage class of the object in your data source. Other Blob Storage properties might be missing or show default values.

## Data freshness and performance

Azure Storage reads data directly from your data source for every request. It doesn't cache the data, so reads always return the current data. Latency is higher than when you read data that's stored in Azure Storage.

## Blob Storage features

Features and operations that write data, or that depend on written data, don't work on blob access points. Container settings, such as container properties, still work.

| Feature | Behavior with blob access points |
|---|---|
| Lifecycle management | Has no effect on blob access points. |
| Azure Storage Actions | Has no effect on blob access points. |
| Blob inventory | Returns no results for blob access points. |
| Change tracking and blob events | Not available, because data in a blob access point doesn't change through Azure Storage. Services that rely on change tracking might not detect new or deleted objects. |

## Topology and account limits

- Each configuration connects to one data source.
- Each configuration serves one blob access point.
- A blob access point and its configuration must be in the same storage account.
- The link between a blob access point and its configuration is set when you create the blob access point. You can't add, remove, or change it later.
- Supported account types are standard general-purpose v2 and premium block blob, with or without a hierarchical namespace.
- Blob access points are available only in the [supported regions](blob-access-points-overview.md#supported-regions). The Azure portal experience isn't available in every supported region yet. In those regions, use the REST API.
- Supported redundancy options are LRS, ZRS, GRS, and RA-GRS.
- On an RA-GRS account, you can't read a blob access point through the secondary endpoint.
- After an account failover, blob access points don't work in the secondary region.
- Azure Storage doesn't limit the number of configurations per storage account, resource group, or subscription.

## Networking

- The network rules of the storage account apply to blob access points the same way that they apply to other containers. You can create configurations, test connections, and create blob access points in the Azure portal with any public network access setting. Creating a blob access point by using the Create Container operation, and reading data through a blob access point, fail if the network rules block the client. For more information, see [Networking considerations](blob-access-points-overview.md#networking-considerations).
- You can't change the connection type or the source endpoint after you create a configuration.
- For a private connection, the storage account and the Private Link resource must be in the same region. A request for a resource in another region is accepted, but configuration creation never completes and eventually fails.

## Related content

- [Troubleshoot blob access points](blob-access-points-troubleshoot.md)
- [Blob access points overview](blob-access-points-overview.md)
- [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md)
