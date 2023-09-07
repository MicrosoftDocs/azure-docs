---
title: Map each REST operation to a price - Azure Blob Storage
description: Find the operation type of each REST operation so that you can identify the price of an operation. 
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Map each REST operation to a price

This article maps each REST operation in the Blob Storage REST API and Data Lake Storage REST API with an operation type. With that information, you can identify the price of each operation. 

Your client interacts with the Azure Blob Storage service by using REST operations. All traffic which originates from a client tool such as AzCopy, Azure Storage Explorer, and even custom applications that use Azure Storage client libraries arrives to the service in the form of REST operations. Other than the cost of storage and the use of other capabilities such as Blob index tags or blob inventory, much of your bill will consist of charges as they relate to operations that are executed against the service. To get more complete picture of all the costs which can appear on your bill, see [Understand the full billing model for Azure Blob Storage](../common/storage-plan-manage-costs.md#understand-the-full-billing-model-for-azure-blob-storage)

Each pricing page lists prices by operation type. For example: a `write` operation is an operation type. You can use the tables in this article to determine the operation type of any given operation. Then, you can open the appropriate pricing page to determine the price of that operation type. 

There are two pricing pages for the Azure Blob Storage service. Use the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page to price requests that your client makes to the blob service endpoint by using [Blob Storage REST](https://learn.microsoft.com/rest/api/storageservices/blob-service-rest-api) operations. Use the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page to price requests that your client makes to the Data Lake Storage endpoint by using [Data Lake Storage Gen2](https://learn.microsoft.com/rest/api/storageservices/data-lake-storage-gen2) operations.

## Operation type of each Blob Storage REST operation

The following table maps each Blob Storage REST API operation to a operation type.

| Operation                                                                                 | Premium block blob        | Standard general-purpose v2 | Standard general-purpose v1 |
|-------------------------------------------------------------------------------------------|---------------------------|-----------------------------|-----------------------------|
| [List Containers](/rest/api/storageservices/list-containers2)                             | List and create container | List and create container   | List and create container   |
| [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties)      | Other                     | Other                       | Write                       |
| [Get Blob Service Properties](/rest/api/storageservices/get-blob-service-properties)      | Other                     | Other                       | Read                        |
| [Preflight Blob Request](/rest/api/storageservices/preflight-blob-request)                | Other                     | Other                       | Read                        |
| [Get Blob Service Stats](/rest/api/storageservices/get-blob-service-stats)                | Other                     | Other                       | Read                        |
| [Get Account Information](/rest/api/storageservices/get-account-information)              | Other                     | Other                       | Read                        |
| [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key)              | Other                     | Other                       | Read                        |
| [Create Container](/rest/api/storageservices/create-container)                            | List and create container | List and create container   | List and create container   |
| [Get Container Properties](/rest/api/storageservices/get-container-properties)            | Other                     | Other                       | Read                        |
| [Get Container Metadata](/rest/api/storageservices/get-container-metadata)                | Other                     | Other                       | Read                        |
| [Set Container Metadata](/rest/api/storageservices/set-container-metadata)                | Other                     | Other                       | Write                       |
| [Get Container ACL](/rest/api/storageservices/get-container-acl)                          | Other                     | Other                       | Read                        |
| [Set Container ACL](/rest/api/storageservices/set-container-acl)                          | Other                     | Other                       | Write                       |
| [Delete Container](/rest/api/storageservices/delete-container)                            | Free                      | Free                        | Free                        |
| [Lease Container](/rest/api/storageservices/lease-container) (acquire, lease, renew)      | Other                     | Other                       | Read                        |
| [Lease Container](/rest/api/storageservices/lease-container) (break, change)              | Other                     | Other                       | Write                       |
| [Restore Container](/rest/api/storageservices/restore-container)                          | Other                     | Other                       | Write                       |
| [List Blobs](/rest/api/storageservices/list-blobs)                                        | List and create container | List and create container   | List and create container   |
| [Find Blobs by Tags in Container](/rest/api/storageservices/find-blobs-by-tags-container) | List and create container | List and create container   | List and create container   |
| [Put Blob](/rest/api/storageservices/put-blob)                                            | Write                     | Write                       | Write                       |
| [Put Blob from URL](/rest/api/storageservices/put-blob-from-url)                          | Write                     | Write                       | Write                       |
| [Get Blob](/rest/api/storageservices/get-blob)                                            | Read                      | Read                        | Read                        |
| [Get Blob Properties](/rest/api/storageservices/get-blob-properties)                      | Other                     | Other                       | Read                        |
| [Set Blob Properties](/rest/api/storageservices/set-blob-properties)                      | Other                     | Other                       | Write                       |
| [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)                          | Other                     | Other                       | Read                        |
| [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)                          | Other                     | Other                       | Write                       |
| [Get Blob Tags](/rest/api/storageservices/get-blob-tags)                                  | Other                     | Other                       | Read                        |
| [Set Blob Tags](/rest/api/storageservices/set-blob-tags)                                  | Other                     | Other                       | Write                       |
| [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags)                        | List and create container | List and create container   | List and create container   |
| [Lease Blob](/rest/api/storageservices/find-blobs-by-tags) (acquire, release, renew)      | Other                     | Other                       | Read                        |
| [Lease Blob](/rest/api/storageservices/find-blobs-by-tags) (break, change)                | Other                     | Other                       | Write                       |
| [Snapshot Blob](/rest/api/storageservices/snapshot-blob)                                  | Other                     | Other                       | Read                        |
| [Copy Blob](/rest/api/storageservices/copy-blob)                                          | Write                     | Write                       | Write                       |
| [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url)                        | Write                     | Write                       | Write                       |
| [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)                              | Other                     | Other                       | Write                       |
| [Delete Blob](/rest/api/storageservices/delete-blob)                                      | Free                      | Free                        | Free                        |
| [Undelete Blob](/rest/api/storageservices/undelete-blob)                                  | Write                     | Write                       | Write                       |
| [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier down)                      | Write                     | Write                       | Write                       |
| [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier up)                        | Read                      | Read                        | Read                        |
| [Blob Batch](/rest/api/storageservices/blob-batch) (Set Blob Tier)                        | Other                     | Other                       | Other                       |
| [Set Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy)         | Other                     | Other                       | Other                       |
| [Delete Immutability Policy](/rest/api/storageservices/delete-blob-immutability-policy)   | Other                     | Other                       | Other                       |
| [Set Legal Hold](/rest/api/storageservices/set-blob-legal-hold)                           | Other                     | Other                       | Other                       |
| [Put Block](/rest/api/storageservices/put-block-list)                                     | Write                     | Write                       | Write                       |
| [Put Block from URL](/rest/api/storageservices/put-block-from-url)                        | Write                     | Write                       | Write                       |
| [Put Block List](/rest/api/storageservices/put-block-list)                                | Write                     | Write                       | Write                       |
| [Get Block List](/rest/api/storageservices/get-block-list)                                | Other                     | Other                       | Read                        |
| [Query Blob Contents](/rest/api/storageservices/query-blob-contents)                      | Read                      | Read                        | N/A                         |
| [Put Page](/rest/api/storageservices/put-page)                                            | Write<sup>2</sup>         | Write<sup>2</sup>           | Write                       |
| [Put Page from URL](/rest/api/storageservices/put-page-from-url)                          | ?                         | ?                           | ?                           |
| [Get Page Ranges](/rest/api/storageservices/get-page-ranges)                              | Read                      | Read                        | Read                        |
| [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)                  | Other                     | Other                       | Write                       |
| [Append Block](/rest/api/storageservices/append-block)                                    | Write                     | Write                       | Write                       |
| [Append Block from URL](/rest/api/storageservices/append-block-from-url)                  | Write                     | Write                       | Write                       |
| [Append Blob Seal](/rest/api/storageservices/append-blob-seal)                            | Write                     | Write                       | Write                       |
| [Set Blob Expiry](/rest/api/storageservices/set-blob-expiry)                              | Other                     | Other                       | Write                       |

<sup>2</sup>    In addition to a read charge, charges for incurred for the **Query Acceleration - Data Scanned**, and **Query Acceleration - Data Returned** transaction categories that appear on the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

## Operation type of each Data Lake Storage Gen2 REST operation

The following table maps each Data Lake Storage Gen2 REST operation to an operation type.

| Operation                                                                                              | Premium block blob | Standard general-purpose v2 |
|--------------------------------------------------------------------------------------------------------|--------------------|-----------------------------|
| [Filesystem - Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create)                 | Write              | Write                       | 
| [Filesystem - Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete)                 | Free               | Free                        |
| [Filesystem - Get Properties](/rest/api/storageservices/datalakestoragegen2/filesystem/get-properties) | Other              | Other                       |
| [Filesystem - List](/rest/api/storageservices/datalakestoragegen2/filesystem/list)                     | Iterative Read     | Iterative Read              |
| [Filesystem - Set Properties](/rest/api/storageservices/datalakestoragegen2/filesystem/set-properties) | Write              | Write                       |
| [Path - Create](/rest/api/storageservices/datalakestoragegen2/path/create)                             | Write              | Write                       |
| [Path - Delete](/rest/api/storageservices/datalakestoragegen2/path/delete)                             | Free               | Free                        |
| [Path - Get Properties](/rest/api/storageservices/datalakestoragegen2/path/get-properties)             | Read               | Read                        |
| [Path - Lease](/rest/api/storageservices/datalakestoragegen2/path/lease)                               | Other              | Other                       |
| [Path - List](/rest/api/storageservices/datalakestoragegen2/path/list)                                 | Iterative Read     | Iterative Read              |
| [Path - Read](/rest/api/storageservices/datalakestoragegen2/path/read)                                 | Read               | Read                        |
| [Path - Update](/rest/api/storageservices/datalakestoragegen2/path/update)                             | Write              | Write                       |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
