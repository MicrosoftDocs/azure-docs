---
title: Azure Blob Storage features supported with NFS 3.0 | Microsoft Docs
description: Learn about which Blob storage features you can use when you enable NFS 3.0 support in your Azure Storage account. 
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 06/17/2021
ms.author: normesta
---

# Blob storage features available in Azure Storage accounts that have the NFS 3.0 protocol enabled

Many Blob Storage features such as [access tiers](storage-blob-storage-tiers.md), and [Blob Storage lifecycle management policies](storage-lifecycle-management-concepts.md) will work with accounts that have the Network File System (NFS) 3.0 protocol feature enabled on them. However, some features are not yet supported.

This table lists the Blob storage features that you can use in accounts that have the NFS 3.0 feature enabled. The items that appear in these tables will change over time as support continues to expand. To learn more about specific issues associated with the preview status of a feature, see the [Known issues](network-file-system-protocol-known-issues.md) article.

## Supported Blob storage features

The following table shows the current level of support for Azure Storage features in accounts that have the NFS 3.0 feature enabled. 

The status of items that appear in this tables will change over time as support continues to expand.

| Feature | Premium | Standard |Storage Feature | Premium | Standard |
|-----------------|---------|----------|----------------|---------|----------|
| [Blob service REST API](/rest/api/storageservices/blob-service-rest-api)	| ✔️ | 	✔️ | [Azure Data Lake Store REST API](/rest/api/storageservices/data-lake-storage-gen2) | ✔️ | 	✔️ |
| [Access tiers for Azure Blob Storage](storage-blob-storage-tiers.md) |	✔️ | 	✔️ | [Blob index tags](storage-blob-index-how-to.md) |	⛔ | ⛔ |
| [Azure Blob Storage lifecycle management](storage-lifecycle-management-concepts.md) | ✔️  |	✔️ | [Azure Storage analytics logging](../common/storage-analytics-logging.md?toc=/azure/storage/blobs/toc.json) | ⛔ |	⛔ |
|  [Azure Storage blob inventory](blob-inventory.md) |	✔️  |	✔️ | [Change Feed](storage-blob-change-feed.md) |	⛔ |	⛔ |
| [Azure Monitor](monitor-blob-storage.md) |	✔️ |	✔️ | [Blob versioning](versioning-enable.md) | ⛔ |	⛔ |
| [Blob snapshots](snapshots-overview.md) |	✔️  |	✔️ | [Point-in-time restore for block blobs](point-in-time-restore-overview.md) | ⛔ |	⛔ |
| [Private endpoints](../common/storage-private-endpoints.md?toc=/azure/storage/blobs/toc.json) | ✔️  |	✔️ | [Azure Backup integration](../../backup/blob-backup-overview.md) | ⛔ |	⛔ |
| [Service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md) | ✔️  |	✔️ | [Soft delete for containers](soft-delete-container-overview.md) |	⛔ |	⛔ |
| [Firewall rules](../common/storage-network-security.md?toc=/azure/storage/blobs/toc.json) | ✔️  |	✔️ | [Soft delete for blobs](soft-delete-blob-overview.md) |	⛔ |	⛔ |
| [Disallow shared key authorization](../common/shared-key-authorization-prevent.md)  | ✔️ |	✔️ | [Last access time tracking for lifecycle management](storage-lifecycle-management-concepts.md#move-data-based-on-last-accessed-date-preview) |	⛔|	⛔ |
| [Customer-managed keys for Azure Storage encryption](../common/customer-managed-keys-overview.md) |	✔️ |	✔️ | [Customer-provided keys for Azure Storage encryption](encryption-customer-provided-keys.md)  |	⛔ |	⛔ |
| [Immutable Blob storage](storage-blob-immutable-storage.md) | ✔️    |	✔️ | [Static websites hosting](storage-blob-static-website.md) |	⛔  |	⛔ |
| [Append blobs](storage-blobs-introduction.md#blobs) | ✔️   |	✔️ | [Page blobs](storage-blobs-introduction.md#blobs) | ⛔ |	⛔ |
| [Azure Active Directory (AD) security](../common/storage-auth-aad.md?toc=/azure/storage/blobs/toc.json) | ⛔ |	⛔ | [Encryption scopes](encryption-scope-overview.md)  |	⛔ |	⛔ |
| [Object replication for block blobs](object-replication-overview.md) | ⛔  |	⛔ | [Customer-managed account failover](../common/storage-disaster-recovery-guidance.md?toc=/azure/storage/blobs/toc.json) | ⛔ |	⛔ |
| [Blob storage events](storage-blob-event-overview.md)| ⛔ |	⛔ |

## See also

- [Known issues with Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-known-issues.md)
- [Network File System (NFS) 3.0 protocol support in Azure Blob Storage](network-file-system-protocol-support.md)
- [Mount Blob storage by using the Network File System (NFS) 3.0 protocol](network-file-system-protocol-support-how-to.md).
