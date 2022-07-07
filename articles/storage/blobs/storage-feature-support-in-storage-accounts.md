---
title: Blob Storage feature support in Azure storage accounts
description: Determine the level of support for each storage account feature given storage account type, and the settings that are enabled on the account.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 06/13/2022
ms.author: normesta
---

# Blob Storage feature support in Azure Storage accounts

This article shows whether a feature is fully supported, supported at the preview level, or is not yet supported. Support levels are impacted by storage account type, namespace type, and the combination of storage endpoints, APIs, and protocols used to interact with data. 

The items that appear in these tables will change over time as support continues to expand.

## General support

The following table shows the support level of each feature across the following account configurations:

- Standard general-purpose v2 account with a **flat** namespace
- Standard general-purpose v2 account with a **hierarchical** namespace
- Premium block blob account with a **flat** namespace
- Premium block blob account with a **hierarchical** namespace

If you plan to develop applications or use protocols such as the Network File System (NFS) 3.0 or SSH File Transfer Protocol (SFTP) to transfer files, see the blah section below to see a more granular view of feature support for different types of operations and endpoints.


| Storage feature | Standard (flat) | Standard (hierarchical)   | Premium (flat)  | Premium (hierarchical)  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - cool](access-tiers-overview.md)	| Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - hot](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported|
| [Anonymous public access](anonymous-read-access-configure.md) | Supported | Supported | Supported| Supported |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | Supported | Supported | Not yet supported | Not yet supported |
| [Blob inventory](blob-inventory.md) | Supported | Supported (preview) | Supported (preview) | Supported (preview) |
| [Blob index tags](storage-manage-find-blobs.md) | Supported | Not yet supported | Not yet supported | Not yet supported |
| [Blob snapshots](snapshots-overview.md) | Supported | Supported (preview) | Not yet supported | Not yet supported |
| [Blob Storage APIs](reference.md) | Supported | Supported | Supported | Supported |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | Supported | Supported | Supported | Supported |
| [Blob Storage events](storage-blob-event-overview.md) | Supported | Supported  | Not yet supported | Supported |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | Supported | Supported | Supported | Supported |
| [Blob versioning](versioning-overview.md) | Supported | Not yet supported |Supported | Not yet supported |
| [Blobfuse](storage-how-to-mount-container-linux.md) | Supported | Supported | Supported | Supported |
| [Change feed](storage-blob-change-feed.md) | Supported | Not yet supported | Supported | Not yet supported |
| [Custom domains](storage-custom-domain-name.md) | Supported | Supported (preview) | Supported (preview) | Supported (preview) |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | Supported | Not yet supported | Not yet supported | Not yet supported |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | Supported | Supported | Supported | Supported |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | Supported | Not yet supported | Supported | Not yet supported |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | Supported | Supported | Supported | Supported |
| [Encryption scopes](encryption-scope-overview.md) | Supported | Not yet supported | Supported | Not yet supported |
| [Immutable storage](immutable-storage-overview.md) | Supported | Supported (preview) | Supported (preview) | Supported (preview) |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | Supported | Supported | Not yet supported | Supported |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | Supported | Supported | Supported | Supported |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | Supported | Supported | Not yet supported | Not yet supported |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | Supported  | Supported  | Not yet supported | Supported (preview) |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | Supported | Supported | Supported | Supported |
| [Object replication for block blobs](object-replication-overview.md) | Supported | Not yet supported | Supported | Not yet supported |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | Supported |Not yet supported | Supported | Not yet supported |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | Supported | Not yet supported | Not yet supported | Not yet supported |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | Supported | Supported | Supported | Supported |
| [Soft delete for containers](soft-delete-container-overview.md) | Supported | Supported | Supported | Supported |
| [Static websites](storage-blob-static-website.md) | Supported | Supported | Supported (preview) | Supported |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | Supported | Supported | Supported | Supported |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | Supported | Supported | Supported | Supported |

## Granular support (endpoints and APIs)

Use these tables to assess support in your applications and workloads that consume Blob Storage or Data Lake Storage APIs or use protocols such as the Network File System (NFS) 3.0 or SSH File Transfer Protocol (SFTP) to transfer files. 

### Flat namespace

If you're account has a flat namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - cool](access-tiers-overview.md)	| Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - hot](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported|
| [Anonymous public access](anonymous-read-access-configure.md) | Supported | Supported | Supported| Supported |

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the **dfs.core.windows.net** endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - cool](access-tiers-overview.md)	| Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - hot](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported|
| [Anonymous public access](anonymous-read-access-configure.md) | Supported | Supported | Supported| Supported |

### Hierarchical namespace

If you're account has a hierarchical namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - cool](access-tiers-overview.md)	| Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - hot](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported|
| [Anonymous public access](anonymous-read-access-configure.md) | Supported | Supported | Supported| Supported |

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the  **dfs.core.windows.net** endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - cool](access-tiers-overview.md)	| Supported | Supported | Not yet supported| Not yet supported |
| [Access tier - hot](access-tiers-overview.md) | Supported | Supported | Not yet supported| Not yet supported|
| [Anonymous public access](anonymous-read-access-configure.md) | Supported | Supported | Supported| Supported |


## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
