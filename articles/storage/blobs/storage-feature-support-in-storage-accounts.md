---
title: Blob Storage feature support in Azure storage accounts
description: Determine the level of support for each storage account feature given storage account type, and the settings that are enabled on the account.
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 07/28/2023
ms.author: normesta
---

# Blob Storage feature support in Azure Storage accounts

Feature support is impacted by the type of account that you create and the settings that enable on that account. You can use the tables in this article to assess feature support based on these factors. The items that appear in these tables will change over time as support continues to expand.

## How to use these tables  

Each table uses the following icons to indicate support level:

| Icon | Description |
|---------------|-------------------|
| &#x2705; | Fully supported |
| &#x1F7E6; | Supported at the preview level |
| &nbsp;&#x2B24; | Not _yet_ supported |

This table describes the impact of **enabling** the capability and not the specific use of that capability. For example, if you enable the Network File System (NFS) 3.0 protocol but never use the NFS 3.0 protocol to upload a blob, a check mark in the **NFS 3.0 enabled** column indicates that feature support is not negatively impacted by merely enabling NFS 3.0 support.

Even though a feature is not be negatively impacted, it might not be compatible when used with a specific capability. For example, enabling NFS 3.0 has no impact on Azure Active Directory (Azure AD) authorization. However, you can't use Azure AD to authorize an NFS 3.0 request. See any of these articles for information about known limitations:

- [Known issues: Hierarchical namespace capability](data-lake-storage-known-issues.md)

- [Known issues: Network File System (NFS) 3.0 protocol](network-file-system-protocol-known-issues.md)

- [Known issues: SSH File Transfer Protocol (SFTP)](secure-file-transfer-protocol-known-issues.md)

## Standard general-purpose v2 accounts

The following table describes whether a feature is supported in a standard general-purpose v2 account when you enable a hierarchical namespace (HNS), NFS 3.0 protocol, or SFTP.

> [!IMPORTANT]
> This table describes the impact of **enabling** HNS, NFS, or SFTP and not the specific use of those capabilities.

| Storage feature | Default | HNS   | NFS  | SFTP |
|---------------|-------------------|---|---|--|
| [Access tiers (hot, cool, cold, and archive)](access-tiers-overview.md) | &#x2705; | &#x2705;<sup>3</sup> | &#x2705;<sup>3</sup> | &#x2705;<sup>3</sup> |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | &#x2705; | &#x2705; | &#x2705;<sup>1</sup>  | &#x2705;<sup>1</sup>  |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md?toc=/azure/storage/blobs/toc.json#storage-account-endpoints) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob inventory](blob-inventory.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob index tags](storage-manage-find-blobs.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Blob snapshots](snapshots-overview.md) | &#x2705; | &#x1F7E6; | &nbsp;&#x2B24; | &#x1F7E6; |
| [Blob Storage APIs](reference.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705;  |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage events](storage-blob-event-overview.md) | &#x2705; | &#x2705;    | &nbsp;&#x2B24; | &#x2705; |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob versioning](versioning-overview.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Blobfuse](storage-how-to-mount-container-linux.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Change feed](storage-blob-change-feed.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Custom domains](storage-custom-domain-name.md) | &#x2705; | &#x1F7E6; | &#x1F7E6; | &#x1F7E6; |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x1F7E6; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Customer-managed keys with key vault in the same tenant](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Customer-managed keys with key vault in a different tenant (cross-tenant)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Customer-provided keys](encryption-customer-provided-keys.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705;<sup>2</sup> | &#x2705; |
| [Encryption scopes](encryption-scope-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Immutable storage](immutable-storage-overview.md) | &#x2705; | &#x2705; | &nbsp;&#x2B24;  | &nbsp;&#x2B24; |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | &#x2705; | &#x2705; | &nbsp;&#x2B24; | &#x2705; |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | &#x2705;  | &#x2705;  | &nbsp;&#x2B24; | &#x2705; |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Object replication for block blobs](object-replication-overview.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Prevent anonymous public access](anonymous-read-access-prevent.md) | &#x2705; | &#x2705; | &#x2705;| &#x2705; |
| [Soft delete for blobs](./soft-delete-blob-overview.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705; |
| [Soft delete for containers](soft-delete-container-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Static websites](storage-blob-static-website.md) | &#x2705; | &#x2705; | &#x1F7E6; | &#x2705; |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705;   | &nbsp;&#x2B24; | &#x2705; |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

<sup>1</sup>    Requests that clients make by using NFS 3.0 or SFTP can't be authorized by using Azure Active Directory (AD) security.

<sup>2</sup>    Only locally redundant storage (LRS) and zone-redundant storage (ZRS) are supported.

<sup>3</sup>    Setting the tier of a blob by using the [Blob Batch](/rest/api/storageservices/blob-batch) operation is not yet supported in accounts that have a hierarchical namespace.

## Premium block blob accounts

The following table describes whether a feature is supported in a premium block blob account when you enable a hierarchical namespace (HNS), NFS 3.0 protocol, or SFTP.

> [!IMPORTANT]
> This table describes the impact of **enabling** HNS, NFS, or SFTP and not the specific use of those capabilities.

| Storage feature | Default | HNS   | NFS  | SFTP |
|---------------|-------------------|---|---|--|
| [Access tiers (hot, cool, cold, and archive)](access-tiers-overview.md)  | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Azure Active Directory security](authorize-access-azure-active-directory.md) | &#x2705; | &#x2705; | &#x2705;<sup>1</sup>  | &#x2705;<sup>1</sup> |
| [Azure DNS Zone endpoints (preview)](../common/storage-account-overview.md?toc=/azure/storage/blobs/toc.json#storage-account-endpoints) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob inventory](blob-inventory.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob index tags](storage-manage-find-blobs.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Blob snapshots](snapshots-overview.md) | &#x2705; | &#x1F7E6; | &nbsp;&#x2B24; | &#x1F7E6; |
| [Blob Storage APIs](reference.md) | &#x2705; | &#x2705;   | &#x2705; | &#x2705;  |
| [Blob Storage Azure CLI commands](storage-quickstart-blobs-cli.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob Storage events](storage-blob-event-overview.md) | &#x2705;    | &#x2705; | &nbsp;&#x2B24; | &#x2705; |
| [Blob Storage PowerShell commands](storage-quickstart-blobs-powershell.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Blob versioning](versioning-overview.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Blobfuse](storage-how-to-mount-container-linux.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Change feed](storage-blob-change-feed.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Custom domains](storage-custom-domain-name.md) | &#x2705; | &#x1F7E6; | &#x1F7E6; | &#x1F7E6; |
| [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=/azure/storage/blobs/toc.json) | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Customer-managed keys with key vault in the same tenant](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Customer-managed keys with key vault in a different tenant (cross-tenant)](../common/customer-managed-keys-overview.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Customer-provided keys](encryption-customer-provided-keys.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Data redundancy options](../common/storage-redundancy.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705;<sup>2</sup> | &#x2705; |
| [Encryption scopes](encryption-scope-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Immutable storage](immutable-storage-overview.md) | &#x2705; | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Last access time tracking for lifecycle management](lifecycle-management-overview.md#move-data-based-on-last-accessed-time) | &#x2705; | &#x2705; | &nbsp;&#x2B24; | &#x2705; |
| [Lifecycle management policies (delete blob)](./lifecycle-management-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Lifecycle management policies (tiering)](./lifecycle-management-overview.md) | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Logging in Azure Monitor](./monitor-blob-storage.md) | &#x2705;  | &#x2705; | &nbsp;&#x2B24; | &#x2705; |
| [Metrics in Azure Monitor](./monitor-blob-storage.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x1F7E6; | &#x1F7E6; | &#x1F7E6; |
| [Object replication for block blobs](object-replication-overview.md) | &#x2705; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; | &nbsp;&#x2B24; |
| [Prevent anonymous public access](anonymous-read-access-prevent.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Soft delete for blobs](./soft-delete-blob-overview.md)	| &#x2705; | &#x2705;  | &#x2705; | &#x2705; |
| [Soft delete for containers](soft-delete-container-overview.md) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |
| [Static websites](storage-blob-static-website.md) | &#x2705; | &#x2705; | &#x1F7E6; | &#x2705; |
| [Storage Analytics logs (classic)](../common/storage-analytics-logging.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x1F7E6;   | &nbsp;&#x2B24;| &#x2705; |
| [Storage Analytics metrics (classic)](../common/storage-analytics-metrics.md?toc=/azure/storage/blobs/toc.json) | &#x2705; | &#x2705; | &#x2705; | &#x2705; |

<sup>1</sup>    Requests that clients make by using NFS 3.0 or SFTP can't be authorized by using Azure Active Directory (AD) security.

<sup>2</sup>    Only locally redundant storage (LRS) and zone-redundant storage (ZRS) are supported.

## See also

- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)

- [Known issues with SSH File Transfer Protocol (SFTP) support in Azure Blob Storage](secure-file-transfer-protocol-known-issues.md)
