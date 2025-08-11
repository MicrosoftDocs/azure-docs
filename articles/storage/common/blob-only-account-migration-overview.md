---
title: Blob Only storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure Blob Only storage accounts means and how to prepare for a smooth migration to GPv2.
Services: storage
author: gtrossell

ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#CustomerIntent: As a storage admin, I want to understand the Blob-Only retirement so that I can prepare for a smooth migration to GPv2.
---

# Blob-Only storage account retirement overview

Azure Storage is retiring the **Blob-Only** storage account type. This article explains what this change means for your blob-only workloads and how to prepare for the transition to **General-purpose v2 (GPv2)** storage accounts.

## Why is Blob-Only being retired?

Blob-Only accounts were introduced to support blob-only scenarios with account-level access tiering. However, **GPv2** has since become the standard for all new storage accounts, offering:

- **Per-blob tiering** (Hot, Cool, Archive)
- **Lifecycle management**
- **Immutable blob storage**
- **Event Grid integration**
- **Advanced redundancy options**
- **Support for all storage services** (blobs, tables, queues, files)

By retiring BlobStorage, Azure simplifies the platform and ensures all customers benefit from modern capabilities and consistent pricing.

## What is changing?

| Date           | Milestone                                      |
|----------------|------------------------------------------------|
| September 2025 | Retirement announced                          |
| August 2026    | Creation of new BlobStorage accounts disabled                         |
| September 2026 | Full retirement; BlobStorage accounts decommissioned |

After the retirement date, **data access will be blocked** for all BlobStorage accounts.

## Why migrate to GPv2?

| Feature                          | BlobStorage     | GPv2           |
|----------------------------------|------------------|----------------|
| Blob tiering                     | ✅ Account-level | ✅ Per-blob     |
| Lifecycle management             | ❌               | ✅              |
| Immutable blob storage           | ✅               | ✅              |
| Event Grid integration           | ✅               | ✅              |
| Support for other services       | ❌               | ✅              |
| Redundancy options (ZRS, GRS, RA-GRS) | ✅         | ✅              |
| Consistent pricing meters        | ❌               | ✅              |

**Note**  
GPv2 supports all blob features available in BlobStorage accounts—and more—while enabling finer control and broader service integration.

## Migration guidance

1. **Inventory your BlobStorage accounts** using Azure CLI, Resource Graph, or the Portal.
2. **Evaluate workloads** to ensure compatibility with GPv2 (most blob-only workloads require no code changes).
3. **Migrate to GPv2**:
   - Create a new GPv2 account.
   - Use tools like AzCopy, Azure Data Factory, or Storage Explorer to move your data.
4. **Validate workloads** post-migration to ensure functionality and billing accuracy.

>[!Warning]
>If you do not migrate your Blob-Only storage account to GPv2 by August 31, 2025, all existing Blob-Only accounts will be auto migrated over to a GPv2 account, which may result in higher billing costs. Your decision not to migrate an existing Blob-Only account will be construed as consent for Microsoft to migrate the account on your behalf.

>[!NOTE]
>GPv2 uses a different transaction pricing model than legacy accounts. Review cost considerations before migrating.  
>See [general-purpose-version-1-account-migration-overview.md#plan-for-pricing-changes-when-upgrading-gpv1--gpv2](general-purpose-version-1-account-migration-overview.md#plan-for-pricing-changes-when-upgrading-gpv1--gpv2).

>[!Tip]
>Most blob-only workloads can migrate from BlobStorage to GPv2 without code changes. Review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features.
>GPv2 enables per-blob tiering and lifecycle rules, offering better cost optimization and automation.

## What happens if I don’t migrate?

After **August 31, 2026**, you'll no longer be able to manage BlobStorage accounts. After **September 2026**, data access will be blocked and applications relying on these accounts will fail.

## Need help?
For assistance with migration or to learn more about GPv2 features, refer to the following resources:


- [Upgrade a storage account to GPv2](storage-account-upgrade.md)
- [Storage account overview](storage-account-overview.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Azure Support Portal](https://portal.azure.com#view/Microsoft_AportBlade/~/overview)
