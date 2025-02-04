---
title: Map each REST operation to a price - Azure Blob Storage
description: Find the operation type of each REST operation so that you can identify the price of an operation. 
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 05/03/2024
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Map each REST operation to a price

This article helps you find the price of each REST operation that clients can execute against the Azure Blob Storage service.

Each request made by tools such as AzCopy or Azure Storage Explorer arrives to the service in the form of a REST operation. This is also true for a custom application that leverages an Azure Storage Client library. REST operations are not billed for requests with unsuccessful authentication. After an identity is authenticated, all operations and requests made by that identity are billed, including those that don’t succeed.

To determine the price of each operation, you must first determine how that operation is classified in terms of its _type_. That's because the pricing pages list prices only by operation type and not by each individual operation. Use the tables in this article as a guide.

## Operation type of each Blob Storage REST operation

The following table maps each Blob Storage REST operation to an operation type.

The price of each type appears in the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

| Logged operation            | REST API                                                                                  | Premium block blob        | Standard general purpose v2 | Standard general purpose v1 |
|-----------------------------|-------------------------------------------------------------------------------------------|---------------------------|-----------------------------|-----------------------------|
| AbortCopyBlob               | [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)                              | Other                     | Other                       | Write                       |
| SealBlob                    | [Append Blob Seal](/rest/api/storageservices/append-blob-seal)                            | Write                     | Write                       | Write                       |
| AppendBlockThroughCopy      | [Append Block from URL](/rest/api/storageservices/append-block-from-url)                  | Write                     | Write                       | Write                       |
| AppendBlock                 | [Append Block](/rest/api/storageservices/append-block)                                    | Write                     | Write                       | Write                       |
| CopyBlobFromURL             | [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url)                        | Write                     | Write                       | Write                       |
| CopyBlob                    | [Copy Blob](/rest/api/storageservices/copy-blob)                                          | Write<sup>2</sup>         | Write<sup>2</sup>           | Write<sup>2</sup>           |
| CreateContainer             | [Create Container](/rest/api/storageservices/create-container)                            | List and create container | List and create container   | List and create container   |
| DeleteBlob                  | [Delete Blob](/rest/api/storageservices/delete-blob)                                      | Free                      | Free                        | Other                        |
| DeleteContainer             | [Delete Container](/rest/api/storageservices/delete-container)                            | Free                      | Free                        | Other                        |
| SetContainerServiceMetadata | [Delete Immutability Policy](/rest/api/storageservices/delete-blob-immutability-policy)   | Other                     | Other                       | Other                       |
| FindBlobsByTags             | [Find Blobs by Tags in Container](/rest/api/storageservices/find-blobs-by-tags-container) | List and create container | List and create container   | List and create container   |
| FindBlobsByTags             | [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags)                        | List and create container | List and create container   | List and create container   |
| GetAccountInformation       | [Get Account Information](/rest/api/storageservices/get-account-information)              | Other                     | Other                       | Read                        |
| GetBlobMetadata             | [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)                          | Other                     | Other                       | Read                        |
| GetBlobProperties           | [Get Blob Properties](/rest/api/storageservices/get-blob-properties)                      | Other                     | Other                       | Read                        |
| GetBlobServiceProperties    | [Get Blob Service Properties](/rest/api/storageservices/get-blob-service-properties)      | Other                     | Other                       | Read                        |
| GetBlobServiceStats         | [Get Blob Service Stats](/rest/api/storageservices/get-blob-service-stats)                | Other                     | Other                       | Read                        |
| GetBlobTags                 | [Get Blob Tags](/rest/api/storageservices/get-blob-tags)                                  | Other                     | Other                       | Read                        |
| GetBlob                     | [Get Blob](/rest/api/storageservices/get-blob)                                            | Read                      | Read                        | Read                        |
| GetBlockList                | [Get Block List](/rest/api/storageservices/get-block-list)                                | Other                     | Other                       | Read                        |
| GetContainerACL             | [Get Container ACL](/rest/api/storageservices/get-container-acl)                          | Other                     | Other                       | Read                        |
| GetContainerMetadata        | [Get Container Metadata](/rest/api/storageservices/get-container-metadata)                | Other                     | Other                       | Read                        |
| GetContainerProperties      | [Get Container Properties](/rest/api/storageservices/get-container-properties)            | Other                     | Other                       | Read                        |
| GetUserDelegationKey        | [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key)              | Other                     | Other                       | Read                        |
| IncrementalCopyBlob         | [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)                  | Other                     | Other                       | Write                       |
| AcquireBlobLease            | [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)                                | Other                     | Other                       | Read                        |
| ReleaseBlobLease            | [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)                                | Other                     | Other                       | Read                        |
| RenewBlobLease              | [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)                                | Other                     | Other                       | Read                        |
| BreakBlobLease              | [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)                                | Other                     | Other                       | Write                       |
| ChangeBlobLease             | [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)                                | Other                     | Other                       | Write                       |
| AcquireContainerLease       | [Lease Container](/rest/api/storageservices/lease-container)                              | Other                     | Other                       | Read                        |
| ReleaseContainerLease       | [Lease Container](/rest/api/storageservices/lease-container)                              | Other                     | Other                       | Read                        |
| RenewContainerLease         | [Lease Container](/rest/api/storageservices/lease-container)                              | Other                     | Other                       | Read                        |
| BreakContainerLease         | [Lease Container](/rest/api/storageservices/lease-container)                              | Other                     | Other                       | Write                       |
| ChangeContainerLease        | [Lease Container](/rest/api/storageservices/lease-container)                              | Other                     | Other                       | Write                       |
| ListBlobs                   | [List Blobs](/rest/api/storageservices/list-blobs)                                        | List and create container | List and create container   | List and create container   |
| ListContainers              | [List Containers](/rest/api/storageservices/list-containers2)                             | List and create container | List and create container   | List and create container   |
| BlobPreflightRequest        | [Preflight Blob Request](/rest/api/storageservices/preflight-blob-request)                | Other                     | Other                       | Read                        |
| PutBlobFromURL              | [Put Blob from URL](/rest/api/storageservices/put-blob-from-url)                          | Write                     | Write                       | Write                       |
| PutBlob                     | [Put Blob](/rest/api/storageservices/put-blob)                                            | Write                     | Write                       | Write                       |
| PutBlockFromURL             | [Put Block from URL](/rest/api/storageservices/put-block-from-url)                        | Write                     | Write                       | Write                       |
| PutBlockList                | [Put Block List](/rest/api/storageservices/put-block-list)                                | Write                     | Write                       | Write                       |
| PutBlock                    | [Put Block](/rest/api/storageservices/put-block-list)                                     | Write                     | Write                       | Write                       |
| QueryBlobContents           | [Query Blob Contents](/rest/api/storageservices/query-blob-contents)                      | Read<sup>1</sup>          | Read<sup>1</sup>            | N/A                         |
| RestoreContainer            | [Restore Container](/rest/api/storageservices/restore-container)                          | List and create container | List and create container   | List and create container   |
| SetBlobExpiry               | [Set Blob Expiry](/rest/api/storageservices/set-blob-expiry)                              | Other                     | Other                       | Write                       |
| SetBlobMetadata             | [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)                          | Other                     | Other                       | Write                       |
| SetBlobProperties           | [Set Blob Properties](/rest/api/storageservices/set-blob-properties)                      | Other                     | Other                       | Write                       |
| SetBlobServiceProperties    | [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties)      | Other                     | Other                       | Write                       |
| SetBlobTags                 | [Set Blob Tags](/rest/api/storageservices/set-blob-tags)                                  | Other                     | Other                       | Write                       |
| SetBlobTier                 | [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier down)                      | Write                     | Write                       | N/A                         |
| SetBlobTier                 | [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier up)                        | Read                      | Read                        | N/A                         |
| SetBlobTier                 | [Blob Batch](/rest/api/storageservices/blob-batch) (Set Blob Tier)                        | Other                     | Other                       | N/A                         |
| SetContainerACL             | [Set Container ACL](/rest/api/storageservices/set-container-acl)                          | Other                     | Other                       | Write                       |
| SetContainerMetadata        | [Set Container Metadata](/rest/api/storageservices/set-container-metadata)                | Other                     | Other                       | Write                       |
| SetContainerServiceMetadata | [Set Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy)         | Other                     | Other                       | Other                       |
| SetContainerServiceMetadata | [Set Legal Hold](/rest/api/storageservices/set-blob-legal-hold)                           | Other                     | Other                       | Other                       |
| SnapshotBlob                | [Snapshot Blob](/rest/api/storageservices/snapshot-blob)                                  | Other                     | Other                       | Read                        |
| UndeleteBlob                | [Undelete Blob](/rest/api/storageservices/undelete-blob)                                  | Write                     | Write                       | Write                       |

<sup>1</sup>    In addition to a read charge, charges are incurred for the **Query Acceleration - Data Scanned**, and **Query Acceleration - Data Returned** transaction categories that appear on the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

<sup>2</sup> When the source object is in a different account, the source account incurs one transaction for each read request to the source object.

## Operation type of each Data Lake Storage REST operation

The following table maps each Data Lake Storage REST operation to an operation type. 

The price of each type appears in the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

| Logged Operation         | REST API                                                                                             | Premium block blob | Standard general purpose v2 |
|--------------------------|------------------------------------------------------------------------------------------------------|--------------------|-----------------------------|
|  CreateFilesystem        | [Filesystem  Create](/rest/api/storageservices/datalakestoragegen2/filesystem/create)                | Write              | Write                       |
|  DeleteFilesystem        | [Filesystem  Delete](/rest/api/storageservices/datalakestoragegen2/filesystem/delete)                | Free               | Free                        |
|  GetFilesystemProperties | [Filesystem  Get Properties](/rest/api/storageservices/datalakestoragegen2/filesystem/getproperties) | Other              | Other                       |
|  ListFilesystems         | [Filesystem  List](/rest/api/storageservices/datalakestoragegen2/filesystem/list)                    | Iterative Read     | Iterative Read              |
|  SetFilesystemProperties | [Filesystem  Set Properties](/rest/api/storageservices/datalakestoragegen2/filesystem/setproperties) | Write              | Write                       |
|  CreatePathDir           | [Path  Create](/rest/api/storageservices/datalakestoragegen2/path/create)                            | Write              | Write                       |
|  CreatePathFile          | [Path  Create](/rest/api/storageservices/datalakestoragegen2/path/create)                            | Write              | Write                       |
|  RenamePathDir           | [Path  Create](/rest/api/storageservices/datalakestoragegen2/path/create)                            | Write              | Write                       |
|  RenamePathFile          | [Path  Create](/rest/api/storageservices/datalakestoragegen2/path/create)                            | Write              | Write                       |
|  DeleteDirectory         | [Path  Delete](/rest/api/storageservices/datalakestoragegen2/path/delete)                            | Free               | Free                        |
|  DeleteFile              | [Path  Delete](/rest/api/storageservices/datalakestoragegen2/path/delete)                            | Free               | Free                        |
|  GetFileProperties       | [Path  Get Properties](/rest/api/storageservices/datalakestoragegen2/path/getproperties)             | Read               | Read                        |
|  GetPathAccessControl    | [Path  Get Properties](/rest/api/storageservices/datalakestoragegen2/path/getproperties)             | Read               | Read                        |
|  GetPathStatus           | [Path  Get Properties](/rest/api/storageservices/datalakestoragegen2/path/getproperties)             | Read               | Read                        |
|  LeaseFile               | [Path  Lease](/rest/api/storageservices/datalakestoragegen2/path/lease)                              | Other              | Other                       |
|  ListFilesystemDir       | [Path  List](/rest/api/storageservices/datalakestoragegen2/path/list)                                | Iterative Read     | Iterative Read              |
|  ListFilesystemFile      | [Path  List](/rest/api/storageservices/datalakestoragegen2/path/list)                                | Iterative Read     | Iterative Read              |
|  ReadFile                | [Path  Read](/rest/api/storageservices/datalakestoragegen2/path/read)                                | Read               | Read                        |
|  AppendFile              | [Path  Update](/rest/api/storageservices/datalakestoragegen2/path/update)                            | Write              | Write                       |
|  FlushFile               | [Path  Update](/rest/api/storageservices/datalakestoragegen2/path/update)                            | Write              | Write                       |
|  SetFileProperties       | [Path  Update](/rest/api/storageservices/datalakestoragegen2/path/update)                            | Write              | Write                       |
|  SetPathAccessControl    | [Path  Update](/rest/api/storageservices/datalakestoragegen2/path/update)                            | Write              | Write                       |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
