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

Feature support is impacted by the type of account that you create and the settings that enable on that account. Support is also impacted by the use of some APIs and protocols. You can use the tables in this article to assess feature support based on these factors. The items that appear in these tables will change over time as support continues to expand.  

Each table uses the following icons to indicate support level:

| Icon | Description | 
|---------------|-------------------|
| &#x2705; | Fully supported |
| _&#x2705;_ | Supported at the preview level |
| &nbsp;&#x2716; | Not supported |
| &#x1f7e1;	 | Not _yet_ supported (Investigating support _or_ working towards support) |

## Standard general-purpose v2 accounts

The following table describes whether a feature is supported in a standard general-purpose v2 account when you enable a hierarchical namespace, Network File System (NFS) 3.0 protocol, or the SSH File Transfer Protocol (SFTP). 

This table describes the impact of **enabling** the capability and not the specific use of that capability. For example, if you enable NFS 3.0 but never use the NFS protocol to upload a blob, a check mark in the **NFS 3.0 enabled** column indicates that feature support is not negatively impacted by merely enabling NFS 3.0 support. 

To assess whether a feature is compatible with blobs that you upload by using the NFS 3.0 protocol, see the [Support by API and protocol](#support-by-api-and-protocol) section of this article.

| Storage feature | Default support | Hierarchical namespace enabled   | NFS 3.0 enabled  | SFTP enabled |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &#x2705;| &#x2705; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob inventory](blob-inventory.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Blob index tags](storage-manage-find-blobs.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Blob snapshots](snapshots-overview.md) | &#x2705; | _&#x2705;_ | &nbsp;&#x2716; | _&#x2705;_ |
| [Blob Storage APIs](reference.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705;  |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage events](storage-blob-event-overview.md) | &#x2705; | &#x2705;    | &nbsp;&#x2716; | &#x2705; |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob versioning](versioning-overview.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Blobfuse](storage-how-to-mount-container-linux.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Change feed](storage-blob-change-feed.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Custom domains](storage-custom-domain-name.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Encryption scopes](encryption-scope-overview.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Immutable storage](immutable-storage-overview.md) | &#x2705; | _&#x2705;_ | &nbsp;&#x2716;  | _&#x2705;_ |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | &#x2705; | &#x2705; | &nbsp;&#x2716; | &#x2705; |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | &#x2705;  | &#x2705;  | &nbsp;&#x2716; | _&#x2705;_ |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Object replication for block blobs](object-replication-overview.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | &#x2705; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705; |
| [Soft delete for containers](soft-delete-container-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Static websites](storage-blob-static-website.md) | &#x2705; | &#x2705; | _&#x2705;_ | &#x2705; |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705;   | &nbsp;&#x2716; | &#x2705; |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

## Premium block blob accounts

The following table describes whether a feature is supported in a premium block blob account when you enable a hierarchical namespace, Network File System (NFS) 3.0 protocol, or the SSH File Transfer Protocol (SFTP). 

This table describes the impact of **enabling** the capability and not the specific use of that capability. For example, if you enable NFS 3.0 but never use the NFS protocol to upload a blob, a check mark in the **NFS 3.0 enabled** column indicates that feature support is not negatively impacted by merely enabling NFS 3.0 support. 

To assess whether a feature is compatible with blobs that you upload by using the NFS 3.0 protocol, see the [Support by API and protocol](#support-by-api-and-protocol) section of this article.

| Storage feature | Default support | Hierarchical namespace enabled   | NFS 3.0 enabled  | SFTP enabled |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md)  | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Access tier - cool](access-tiers-overview.md) | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Access tier - hot](access-tiers-overview.md) | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob inventory](blob-inventory.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Blob index tags](storage-manage-find-blobs.md) | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; | &#x1f7e1; |
| [Blob snapshots](snapshots-overview.md) | &#x2705; | _&#x2705;_ | &nbsp;&#x2716; | _&#x2705;_ |
| [Blob Storage APIs](reference.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705;  |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage events](storage-blob-event-overview.md) | &#x2705;    | &#x2705; | &nbsp;&#x2716; | &#x2705; |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob versioning](versioning-overview.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Blobfuse](storage-how-to-mount-container-linux.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Change feed](storage-blob-change-feed.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Custom domains](storage-custom-domain-name.md) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x1f7e1; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Customer-managed keys (encryption)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json)  | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Customer-provided keys (encryption)](encryption-customer-provided-keys.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Encryption scopes](encryption-scope-overview.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Immutable storage](immutable-storage-overview.md) | &#x2705; | _&#x2705;_ | &nbsp;&#x2716; | _&#x2705;_ |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | &#x2705; | &#x2705; | &nbsp;&#x2716; | &#x2705; |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; | &nbsp;&#x2716; |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | &#x2705;  | &#x2705; | &nbsp;&#x2716; | _&#x2705;_ |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | _&#x2705;_ | _&#x2705;_ | _&#x2705;_ |
| [Object replication for block blobs](object-replication-overview.md) | &#x2705; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | &#x1f7e1; | &#x1f7e1; | &nbsp;&#x2716; | &#x1f7e1; |
| [Soft delete for blobs](./soft-delete-blob-overview.md)	| &#x2705; | &#x2705;  | &#x2705; | &#x2705; |
| [Soft delete for containers](soft-delete-container-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Static websites](storage-blob-static-website.md) | &#x2705; | &#x2705; | _&#x2705;_ | &#x2705; |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | _&#x2705;_   | &nbsp;&#x2716;| &#x2705; |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

<sup>1</sup>    Network File System (NFS) 3.0 protocol and SSH File Transfer Protocol (SFTP) support require a storage account with a hierarchical namespace enabled.


## Support by API and protocol


| Storage feature | Blob APIs (blob.core.windows.net) | Data Lake Storage Gen2 APIs (dfs.core.windows.net)  | NFS 3.0  (blob.core.windows.net) | SFTP (blob.core.windows.net)  |
|---------------|-------------------|---|---|--|
| [Access tier - archive](access-tiers-overview.md) | &#x2705; | &#x2705; | &nbsp;&#x2716;| &nbsp;&#x2716; |
| [Access tier - cool](access-tiers-overview.md)	| &#x2705; | &#x2705; | &nbsp;&#x2716;| &nbsp;&#x2716; |
| [Access tier - hot](access-tiers-overview.md) | &#x2705; | &#x2705; | &nbsp;&#x2716;| &nbsp;&#x2716;|
| [Anonymous public access](anonymous-read-access-configure.md) | &#x2705; | &#x2705; | &nbsp;&#x2716;| &nbsp;&#x2716; |


## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage (preview)](secure-file-transfer-protocol-known-issues.md)
