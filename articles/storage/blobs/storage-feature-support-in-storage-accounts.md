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

Feature support can be impacted by the type of storage account that you create and which endpoints, APIs, and protocols you use to upload and modify blobs.  Use the tables in this article to assess feature support. The items that appear in these tables will change over time as support continues to expand.  Each table uses the following icons to indicate support level:

![Yes](../media/icons/yes-icon.png) = Fully supported

![Yes at preview level](../media/icons/yes-preview-icon.png) = Supported at the preview level

![No](../media/icons/no-icon.png) = Not supported

![Not yet](../media/icons/no-yet-icon.png) = Not _yet_ supported

## General support

This table indicates whether a feature is supported in your account. Columns are defined as follows:

**Standard (flat)** = Standard general-purpose v2 account with a **flat** namespace

**Standard (hierarchical)** = Standard general-purpose v2 account with a **hierarchical** namespace

**Premium (flat)** = Premium block blob account with a **flat** namespace

**Premium (hierarchical)** = Premium block blob account with a **hierarchical** namespace

| Storage feature | Standard (flat) | Standard (hierarchical)   | Premium (flat)  | Premium (hierarchical)  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png)| ![Not yet](../media/icons/no-yet-icon.png) |
| [Access tier - cool](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![Not yet](../media/icons/no-yet-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png)| ![Not yet](../media/icons/no-yet-icon.png)|
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)| ![Yes](../media/icons/yes-icon.png) |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Blob inventory](blob-inventory.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) |
| [Blob index tags](storage-manage-find-blobs.md) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Blob snapshots](snapshots-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blob Storage APIs](reference.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage events](storage-blob-event-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)  | ![Not yet](../media/icons/no-yet-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Blob versioning](versioning-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Blobfuse](storage-how-to-mount-container-linux.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Change feed](storage-blob-change-feed.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Custom domains](storage-custom-domain-name.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Encryption scopes](encryption-scope-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Immutable storage](immutable-storage-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![No](../media/icons/no-icon.png) |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | ![Yes](../media/icons/yes-icon.png)  | ![Yes](../media/icons/yes-icon.png)  | ![Not yet](../media/icons/no-yet-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Object replication for block blobs](object-replication-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | ![Yes](../media/icons/yes-icon.png) |![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) | ![Not yet](../media/icons/no-yet-icon.png) |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Soft delete for containers](soft-delete-container-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Static websites](storage-blob-static-website.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes at preview level](../media/icons/yes-preview-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

> [!NOTE]
> Features might not be compatible with all storage endpoints, APIs or protocols. If you plan to write applications or use protocols such as the Network File System (NFS) 3.0 or SSH File Transfer Protocol (SFTP), see [Support by Endpoint, API, and protocol](#support-by-endpoint-api-and-protocol) section of this article. 

## Support by endpoint, API, and protocol

Features might not be compatible with all storage endpoints, APIs or protocols. If you plan to write applications or use protocols such as the Network File System (NFS) 3.0 or SSH File Transfer Protocol (SFTP), use the tables in this section to assess feature support.

### Flat namespace

If you're account has a flat namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint in an account that has a **flat** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup>  | SFTP <sup>1</sup>  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - cool](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png)|
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |

<sup>1</sup>    NFS 3.0 and SFTP aren't supported in accounts that have a flat namespace.

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the **dfs.core.windows.net** endpoint in an account that has a **hierarchical** namespace.

> [!NOTE]
> All features are unsupported for NFS 3.0 and SFTP as these protocols can't be used to connect to the Data Lake Storage endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - cool](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png)|
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |

<sup>1</sup>    NFS 3.0 and SFTP aren't supported in accounts that have a flat namespace.

### Hierarchical namespace

If you're account has a hierarchical namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint in an account that has a **flat** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png)| ![Not yet](../media/icons/no-yet-icon.png) |
| [Access tier - cool](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png)| ![Not yet](../media/icons/no-yet-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Not yet](../media/icons/no-yet-icon.png)| ![Not yet](../media/icons/no-yet-icon.png)|
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)| ![Yes](../media/icons/yes-icon.png) |

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the  **dfs.core.windows.net** endpoint in an account that has a **hierarchical** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup>| SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - cool](access-tiers-overview.md)	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png) |
| [Access tier - hot](access-tiers-overview.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png)|
| [Anonymous public access](anonymous-read-access-configure.md) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png)| ![No](../media/icons/no-icon.png)|

<sup>1</sup>    NFS 3.0 and SFTP can't be used to connect to the Data Lake Storage endpoint.


## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
