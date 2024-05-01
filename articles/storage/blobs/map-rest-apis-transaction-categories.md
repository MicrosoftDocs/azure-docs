---
title: Map each REST operation to a price - Azure Blob Storage
description: Find the operation type of each REST operation so that you can identify the price of an operation. 
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 05/01/2024
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Map each REST operation to a price

This article helps you find the price of each REST operation that clients can execute against the Azure Blob Storage service.

Each request made by tools such as AzCopy or Azure Storage Explorer arrives to the service in the form of a REST operation. This is also true for a custom application that leverages an Azure Storage Client library.

To determine the price of each operation, you must first determine how that operation is classified in terms of its _type_. That's because the pricing pages list prices only by operation type and not by each individual operation. Use the tables in this article as a guide.

## Operation type of each Blob Storage REST operation

The following table maps each Blob Storage REST operation to an operation type.

The price of each type appears in the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

| Logged operation         | REST API                                                                              | Premium block blob        | Standard general purpose v2 | Standard general purpose v1 |
|--------------------------|---------------------------------------------------------------------------------------|---------------------------|-----------------------------|-----------------------------|
| AbortCopyBlob            | [Abort Copy Blob](/rest/api/storageservices/abortcopyblob)                            | Other                     | Other                       | Write                       |
| None                     | [Append Blob Seal](/rest/api/storageservices/appendblobseal)                          | Write                     | Write                       | Write                       |
| None                     | [Append Block from URL](/rest/api/storageservices/appendblockfromurl)                 | Write                     | Write                       | Write                       |
| AppendBlock              | [Append Block](/rest/api/storageservices/appendblock)                                 | Write                     | Write                       | Write                       |
| Set Blob Tier            | [Blob Batch](/rest/api/storageservices/blobbatch) (Set Blob Tier)                     | Other                     | Other                       | N/A                         |
| None                     | [Copy Blob from URL](/rest/api/storageservices/copyblobfromurl)                       | Write                     | Write                       | Write                       |
| CopyBlob                 | [Copy Blob](/rest/api/storageservices/copyblob)                                       | Write<sup>2</sup>         | Write<sup>2</sup>           | Write<sup>2</sup>           |
| CreateContainer          | [Create Container](/rest/api/storageservices/createcontainer)                         | List and create container | List and create container   | List and create container   |
| DeleteBlob               | [Delete Blob](/rest/api/storageservices/deleteblob)                                   | Free                      | Free                        | Free                        |
| DeleteContainer          | [Delete Container](/rest/api/storageservices/deletecontainer)                         | Free                      | Free                        | Free                        |
| None                     | [Delete Immutability Policy](/rest/api/storageservices/deleteblobimmutabilitypolicy)  | Other                     | Other                       | Other                       |
| FindBlobsByTags          | [Find Blobs by Tags in Container](/rest/api/storageservices/findblobsbytagscontainer) | List and create container | List and create container   | List and create container   |
| FindBlobsByTags          | [Find Blobs by Tags](/rest/api/storageservices/findblobsbytags)                       | List and create container | List and create container   | List and create container   |
| GetAccountInformation    | [Get Account Information](/rest/api/storageservices/getaccountinformation)            | Other                     | Other                       | Read                        |
| GetBlobMetadata          | [Get Blob Metadata](/rest/api/storageservices/getblobmetadata)                        | Other                     | Other                       | Read                        |
| GetBlobProperties        | [Get Blob Properties](/rest/api/storageservices/getblobproperties)                    | Other                     | Other                       | Read                        |
| GetBlobServiceProperties | [Get Blob Service Properties](/rest/api/storageservices/getblobserviceproperties)     | Other                     | Other                       | Read                        |
| GetBlobServiceStats      | [Get Blob Service Stats](/rest/api/storageservices/getblobservicestats)               | Other                     | Other                       | Read                        |
| GetBlobTags              | [Get Blob Tags](/rest/api/storageservices/getblobtags)                                | Other                     | Other                       | Read                        |
| GetBlob                  | [Get Blob](/rest/api/storageservices/getblob)                                         | Read                      | Read                        | Read                        |
| GetBlockList             | [Get Block List](/rest/api/storageservices/getblocklist)                              | Other                     | Other                       | Read                        |
| GetContainerACL          | [Get Container ACL](/rest/api/storageservices/getcontaineracl)                        | Other                     | Other                       | Read                        |
| GetContainerMetadata     | [Get Container Metadata](/rest/api/storageservices/getcontainermetadata)              | Other                     | Other                       | Read                        |
| GetContainerProperties   | [Get Container Properties](/rest/api/storageservices/getcontainerproperties)          | Other                     | Other                       | Read                        |
| GetUserDelegationKey     | [Get User Delegation Key](/rest/api/storageservices/getuserdelegationkey)             | Other                     | Other                       | Read                        |
| IncrementalCopyBlob      | [Incremental Copy Blob](/rest/api/storageservices/incrementalcopyblob)                | Other                     | Other                       | Write                       |
| AcquireBlobLease         | [Lease Blob](/rest/api/storageservices/findblobsbytags)                               | Other                     | Other                       | Read                        |
| ReleaseBlobLease         | [Lease Blob](/rest/api/storageservices/findblobsbytags)                               | Other                     | Other                       | Read                        |
| RenewBlobLease           | [Lease Blob](/rest/api/storageservices/findblobsbytags)                               | Other                     | Other                       | Read                        |
| BreakBlobLease           | [Lease Blob](/rest/api/storageservices/findblobsbytags)                               | Other                     | Other                       | Write                       |
| ChangeBlobLease          | [Lease Blob](/rest/api/storageservices/findblobsbytags)                               | Other                     | Other                       | Write                       |
| AcquireContainerLease    | [Lease Container](/rest/api/storageservices/leasecontainer)                           | Other                     | Other                       | Read                        |
| ReleaseContainerLease    | [Lease Container](/rest/api/storageservices/leasecontainer)                           | Other                     | Other                       | Read                        |
| RenewContainerLease      | [Lease Container](/rest/api/storageservices/leasecontainer)                           | Other                     | Other                       | Read                        |
| BreakContainerLease      | [Lease Container](/rest/api/storageservices/leasecontainer)                           | Other                     | Other                       | Write                       |
| ChangeContainerLease     | [Lease Container](/rest/api/storageservices/leasecontainer)                           | Other                     | Other                       | Write                       |
| ListBlobs                | [List Blobs](/rest/api/storageservices/listblobs)                                     | List and create container | List and create container   | List and create container   |
| ListContainers           | [List Containers](/rest/api/storageservices/listcontainers2)                          | List and create container | List and create container   | List and create container   |
| BlobPreflightRequest     | [Preflight Blob Request](/rest/api/storageservices/preflightblobrequest)              | Other                     | Other                       | Read                        |
| None                     | [Put Blob from URL](/rest/api/storageservices/putblobfromurl)                         | Write                     | Write                       | Write                       |
| PutBlob                  | [Put Blob](/rest/api/storageservices/putblob)                                         | Write                     | Write                       | Write                       |
| PutBlockFromURL          | [Put Block from URL](/rest/api/storageservices/putblockfromurl)                       | Write                     | Write                       | Write                       |
| PutBlockList             | [Put Block List](/rest/api/storageservices/putblocklist)                              | Write                     | Write                       | Write                       |
| PutBlock                 | [Put Block](/rest/api/storageservices/putblocklist)                                   | Write                     | Write                       | Write                       |
| QueryBlobContents        | [Query Blob Contents](/rest/api/storageservices/queryblobcontents)                    | Read<sup>1</sup>          | Read<sup>1</sup>            | N/A                         |
| None                     | [Restore Container](/rest/api/storageservices/restorecontainer)                       | List and create container | List and create container   | List and create container   |
| SetBlobExpiry            | [Set Blob Expiry](/rest/api/storageservices/setblobexpiry)                            | Other                     | Other                       | Write                       |
| SetBlobMetadata          | [Set Blob Metadata](/rest/api/storageservices/setblobmetadata)                        | Other                     | Other                       | Write                       |
| SetBlobProperties        | [Set Blob Properties](/rest/api/storageservices/setblobproperties)                    | Other                     | Other                       | Write                       |
| SetBlobServiceProperties | [Set Blob Service Properties](/rest/api/storageservices/setblobserviceproperties)     | Other                     | Other                       | Write                       |
| SetBlobTags              | [Set Blob Tags](/rest/api/storageservices/setblobtags)                                | Other                     | Other                       | Write                       |
| SetBlobTier              | [Set Blob Tier](/rest/api/storageservices/setblobtier) (tier down)                    | Write                     | Write                       | N/A                         |
| SetBlobTier              | [Set Blob Tier](/rest/api/storageservices/setblobtier) (tier up)                      | Read                      | Read                        | N/A                         |
| SetContainerACL          | [Set Container ACL](/rest/api/storageservices/setcontaineracl)                        | Other                     | Other                       | Write                       |
| SetContainerMetadata     | [Set Container Metadata](/rest/api/storageservices/setcontainermetadata)              | Other                     | Other                       | Write                       |
| None                     | [Set Immutability Policy](/rest/api/storageservices/setblobimmutabilitypolicy)        | Other                     | Other                       | Other                       |
| None                     | [Set Legal Hold](/rest/api/storageservices/setbloblegalhold)                          | Other                     | Other                       | Other                       |
| SnapshotBlob             | [Snapshot Blob](/rest/api/storageservices/snapshotblob)                               | Other                     | Other                       | Read                        |
| UndeleteBlob             | [Undelete Blob](/rest/api/storageservices/undeleteblob)                               | Write                     | Write                       | Write                       |

<sup>1</sup>    In addition to a read charge, charges are incurred for the **Query Acceleration - Data Scanned**, and **Query Acceleration - Data Returned** transaction categories that appear on the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

<sup>2</sup> When the source object is in a different account, the source account incurs one transaction for each read request to the source object.

## Operation type of each Data Lake Storage Gen2 REST operation

The following table maps each Data Lake Storage Gen2 REST operation to an operation type. 

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
