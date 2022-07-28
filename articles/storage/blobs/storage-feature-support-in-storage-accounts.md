---
title: Blob Storage feature support in Azure storage accounts
description: Determine the level of support for each storage account feature given storage account type, and the settings that are enabled on the account.
author: normesta
ms.subservice: blobs
ms.service: storage
ms.topic: conceptual
ms.date: 07/28/2022
ms.author: normesta
---

# Blob Storage feature support in Azure Storage accounts

Feature support can vary between storage account types, and can be impacted by the use of certain endpoints, APIs, and protocols. You can use the tables in this article to assess feature support based on these factors. The items that appear in these tables will change over time as support continues to expand.  

Each table uses the following icons to indicate support level:

| Icon | Description | 
|---------------|-------------------|
| &#x2705; | Fully supported |
| _&#x2705;_ | Supported at the preview level |
| &#x274c; | Not supported |
| &#x1f7e1;	 | Not _yet_ supported (Investigating support _or_ working towards support) |

## General support

This table indicates whether a feature is supported in your account. To assess which endpoints, APIs, or protocols are compatible with a supported feature, see the [Support by endpoint, API, and protocol](#support-by-endpoint-api-and-protocol) section of this article.

Columns are defined as follows:

| Column name | Description | 
|---------------|-------------------|
| Standard (flat) | Standard general-purpose v2 account with a **flat** namespace |
| Standard (hierarchical) | Standard general-purpose v2 account with a **hierarchical** namespace |
| Premium (flat) | Premium block blob account with a **flat** namespace |
| Premium (hierarchical) | Premium block blob account with a **hierarchical** namespace |

| Storage feature | Standard (flat) | Standard (hierarchical)   | Premium (flat)  | Premium (hierarchical)  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x1f7e1;| &#x1f7e1; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x274c;| &#x1f7e1; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x1f7e1;| &#x1f7e1;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | &#x2705; | &#x2705; | &#x274c; | &#x1f7e1; |
| [Blob inventory](blob-inventory.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Blob index tags](storage-manage-find-blobs.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Blob snapshots](snapshots-overview.md) | &#x2705; | _&#x2705;_ | &#x274c; | &#x274c; |
| [Blob Storage APIs](reference.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage events](storage-blob-event-overview.md) | &#x2705; | &#x2705;  | &#x1f7e1; | &#x2705; |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob versioning](versioning-overview.md) | &#x2705; | &#x1f7e1; |&#x2705; | &#x274c; |
| [Blobfuse](storage-how-to-mount-container-linux.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Change feed](storage-blob-change-feed.md) | &#x2705; | &#x274c; | &#x2705; | &#x1f7e1; |
| [Custom domains](storage-custom-domain-name.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | &#x2705; | &#x1f7e1; | &#x2705; | &#x274c; |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Encryption scopes](encryption-scope-overview.md) | &#x2705; | &#x274c; | &#x274c; | &#x274c; |
| [Immutable storage](immutable-storage-overview.md) | &#x2705; | _&#x2705;_ | &#x274c;  | _&#x2705;_ |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | &#x2705; | &#x2705; | &#x274c; | &#x2705; |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x1f7e1; | &#x274c; |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | &#x2705;  | &#x2705;  | &#x1f7e1; | _&#x2705;_ |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Object replication for block blobs](object-replication-overview.md) | &#x2705; | &#x1f7e1; | &#x2705; | &#x1f7e1; |
| [Page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs#about-page-blobs) | &#x2705; |&#x274c; | &#x2705; | &#x1f7e1; |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Soft delete for containers](soft-delete-container-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Static websites](storage-blob-static-website.md) | &#x2705; | &#x2705; | _&#x2705;_ | &#x2705; |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705;  <sup>3</sup> | &#x274c; | &#x2705; |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

## Support by endpoint, API, and protocol

Use the tables in this section to assess which endpoints, APIs, or protocols are compatible with each feature.

### Flat namespace

If you're account has a flat namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint in an account that has a **flat** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup>  | SFTP <sup>1</sup>  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c; |

<sup>1</sup>    NFS 3.0 and SFTP aren't supported in accounts that have a flat namespace.

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the **dfs.core.windows.net** endpoint in an account that has a **hierarchical** namespace.

> [!NOTE]
> All features are unsupported for NFS 3.0 and SFTP as these protocols can't be used to connect to the Data Lake Storage endpoint.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup> | SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c; |

<sup>1</sup>    NFS 3.0 and SFTP aren't supported in accounts that have a flat namespace.

### Hierarchical namespace

If you're account has a hierarchical namespace, you can connect to either the Blob service or Data Lake Storage endpoint. These sections help you assess support for each feature across endpoints, APIs, and protocols.

#### Blob service endpoint

Use this table to assess support for applications and workloads that connect to the **blob.core.windows.net** endpoint in an account that has a **flat** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0  | SFTP  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x1f7e1;| &#x1f7e1; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x1f7e1;| &#x1f7e1; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x1f7e1;| &#x1f7e1;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; |

#### Data Lake Storage endpoint

Use this table to assess support for applications and workloads that connect to the  **dfs.core.windows.net** endpoint in an account that has a **hierarchical** namespace.

| Storage feature | Blob APIs | Data Lake Storage APIs   | NFS 3.0 <sup>1</sup>| SFTP <sup>1</sup> |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x274c;| &#x274c; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x274c;| &#x274c;|

<sup>1</sup>    NFS 3.0 and SFTP can't be used to connect to the Data Lake Storage endpoint.


## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
