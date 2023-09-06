---
title: Map each REST operation to a price - Azure Blob Storage
description: Learn how to plan for and manage costs for Azure Blob Storage by using cost analysis in Azure portal.
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Map each REST operation to a price category

Put an opening paragraph here.

Clients make a request by using a REST operation from the Blob Storage REST API or the Data Lake Storage Gen2 REST API. Requests that originate from custom applications that use an Azure Storage client library or from tools such as Azure Storage Explorer and AzCopy arrive to the service in the form of a REST operation from either of these APIs. Each request incurs a cost per transaction. Each type of transaction is billed at a different rate. Use these tables as a guide.

## Transaction category of each Blob Storage REST operation

The following table maps each Blob Storage REST API operation to a transaction category that appears in the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

| Operation                                                                                 | Transaction category      |
|-------------------------------------------------------------------------------------------|---------------------------|
| [List Containers](/rest/api/storageservices/list-containers2)                             | List and create container |
| [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties)      | Other                     |
| [Get Blob Service Properties](/rest/api/storageservices/get-blob-service-properties)      | Other                     |
| [Preflight Blob Request](/rest/api/storageservices/preflight-blob-request)                | Other                     |
| [Get Blob Service Stats](/rest/api/storageservices/get-blob-service-stats)                | Other                     |
| [Get Account Information](/rest/api/storageservices/get-account-information)              | Other                     |
| [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key)              | Other                     |
| [Create Container](/rest/api/storageservices/create-container)                            | List and create container |
| [Get Container Properties](/rest/api/storageservices/get-container-properties)            | Other                     |
| [Get Container Metadata](/rest/api/storageservices/get-container-metadata)                | Other                     |
| [Set Container Metadata](/rest/api/storageservices/set-container-metadata)                | Other                     |
| [Get Container ACL](/rest/api/storageservices/get-container-acl)                          | Other                     |
| [Set Container ACL](/rest/api/storageservices/set-container-acl)                          | Other                     |
| [Delete Container](/rest/api/storageservices/delete-container)                            | Free                      |
| [Lease Container](/rest/api/storageservices/lease-container)<sup>1</sup>                  | Other                     |
| [Restore Container](/rest/api/storageservices/restore-container)                          | Other                     |
| [List Blobs](/rest/api/storageservices/list-blobs)                                        | List and create container |
| [Find Blobs by Tags in Container](/rest/api/storageservices/find-blobs-by-tags-container) | List and create container |
| [Put Blob](/rest/api/storageservices/put-blob)                                            | Write                     |
| [Put Blob from URL](/rest/api/storageservices/put-blob-from-url)                          | Write                     |
| [Get Blob](/rest/api/storageservices/get-blob)                                            | Read                      |
| [Get Blob Properties](/rest/api/storageservices/get-blob-properties)                      | Other                     |
| [Set Blob Properties](/rest/api/storageservices/set-blob-properties)                      | Other                     |
| [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)                          | Other                     |
| [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)                          | Other                     |
| [Get Blob Tags](/rest/api/storageservices/get-blob-tags)                                  | Other                     |
| [Set Blob Tags](/rest/api/storageservices/set-blob-tags)                                  | Other                     |
| [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags)                        | List and create container |
| [Lease Blob](/rest/api/storageservices/find-blobs-by-tags)<sup>1</sup>                    | Other                     |
| [Snapshot Blob](/rest/api/storageservices/snapshot-blob)                                  | Other                     |
| [Copy Blob](/rest/api/storageservices/copy-blob)                                          | Write                     |
| [Copy Blob from URL](/rest/api/storageservices/copy-blob-from-url)                        | Write                     |
| [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)                              | Other                     |
| [Delete Blob](/rest/api/storageservices/delete-blob)                                      | Free                      |
| [Undelete Blob](/rest/api/storageservices/undelete-blob)                                  | Write                     |
| [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier down)                      | Write                     |
| [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (tier up)                        | Read                      |
| [Blob Batch](/rest/api/storageservices/blob-batch) (Set Blob Tier)                        | Other                     |
| [Set Immutability Policy](/rest/api/storageservices/set-blob-immutability-policy)         | Other                     |
| [Delete Immutability Policy](/rest/api/storageservices/delete-blob-immutability-policy)   | Other                     |
| [Set Legal Hold](/rest/api/storageservices/set-blob-legal-hold)                           | Other                     |
| [Put Block](/rest/api/storageservices/put-block-list)                                     | Write                     |
| [Put Block from URL](/rest/api/storageservices/put-block-from-url)                        | Write                     |
| [Put Block List](/rest/api/storageservices/put-block-list)                                | Write                     |
| [Get Block List](/rest/api/storageservices/get-block-list)                                | Other                     |
| [Query Blob Contents](/rest/api/storageservices/query-blob-contents)                      | Read                      |
| [Put Page](/rest/api/storageservices/put-page)                                            | Write                     |
| [Put Page from URL](/rest/api/storageservices/put-page-from-url)                          | ?                         |
| [Get Page Ranges](/rest/api/storageservices/get-page-ranges)                              | Read                      |
| [Incremental Copy Blob](/rest/api/storageservices/incremental-copy-blob)                  | Other                     |
| [Append Block](/rest/api/storageservices/append-block)                                    | Write                     |
| [Append Block from URL](/rest/api/storageservices/append-block-from-url)                  | Write                     |
| [Append Blob Seal](/rest/api/storageservices/append-blob-seal)                            | Write                     |
| [Set Blob Expiry](/rest/api/storageservices/set-blob-expiry)                              | Other                     |

<sup>1</sup>    Acquire, release, renew, break, change

## Transaction category of each Data Lake Storage Gen2 REST operation

The following table maps each Blob Storage REST API operation to a transaction category that appears in the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

| Operation                                                                            | Transaction category      |
|--------------------------------------------------------------------------------------|---------------------------|
| [List Containers](/rest/api/storageservices/list-containers2)                        | List and create container |
| [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties) | Other                     |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
