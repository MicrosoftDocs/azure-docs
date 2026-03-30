---
title: Legacy Blob Storage account retirement FAQ
titleSuffix: Azure Storage
description: Commonly asked questions regarding the retirement of Azure General-purpose v1 (GPv1) legacy blob storage accounts and upgrading to GPv2.
Services: storage
author: gtrossell-eng
ms.service: azure-storage
ms.topic: faq
ms.date: 12/15/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#customer-intent: As a storage admin, I want to understand the Legacy Blob Storage retirement so that I can prepare for a smooth migration to GPv2.
---

# Legacy blob storage account retirement FAQ

General-purpose v2 (GPv2) storage accounts are the recommended account type for all Azure Storage scenarios, including blob only workloads. GPv2 provides access to the latest Azure Storage features such as per-blob tiering, lifecycle management, and advanced redundancy options and offers the most cost-effective pricing model for a wide range of blob workloads.

This FAQ addresses common questions about migrating from legacy blob storage (blob only) accounts to GPv2. It covers migration procedures, billing considerations, feature differences, and guidance for selecting the right access tier. Use this resource to plan your upgrade and ensure a smooth transition before legacy blob storage retirement.

> [!IMPORTANT]
> Microsoft will retire legacy blob storage accounts on **October 2026**. All legacy blob storage must be migrated to general-purpose v2 before this date to avoid service disruption.  
> See: [Migrate to GPv2](storage-account-upgrade.md) and [general purpose v1 (GPv1) account migration overview](general-purpose-version-1-account-migration-overview.md) for more details.


A legacy blob storage account is a legacy Azure storage account type designed for blob workloads. It supports **block blobs** and **append blobs** with **account-level access tiering** (hot, cool, archive). It does not support File Shares, Tables, Queues or other Azure Storage features.

### Can I still create a new legacy blob storage account?

No. Starting **March 3 2026**, creation of new legacy blob storage accounts will be disabled.

> [!IMPORTANT]
> Plan migrations ahead of this date to ensure policy compliance and avoid deployment blocks for new storage needs.

### Which redundancy options are available on general-purpose v2 accounts?

General-purpose v2 supports:

- Local-redundant storage (**LRS**).
- Zone-redundant storage (**ZRS**).
- Geo-redundant storage (**GRS**).
- Read-access geo-redundant storage (**RA-GRS**).
- Geo-zone-redundant storage (**GZRS**).
- Read-access geo-zone-redundant storage (**RA-GZRS**).

### Does legacy blob storage support lifecycle management policies?

No. **Lifecycle management** is only available in **general-purpose v2** accounts.

### How does pricing differ from general-purpose v2?

Legacy blob storage uses **account-level tiering**, limiting pricing flexibility. **general-purpose v2** offers **per-blob tiering** and optimized pricing for different access patterns.  
See [Blob storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) for details.

### If I migrate from legacy blob storage to general-purpose v2 later, will anything break?

You must migrate to a **new general-purpose v2 account** and move your data. The migration is **nondisruptive if planned properly**. Most applications continue to work without changes.

> [!TIP]
> Validate app assumptions about tiers, lifecycle policies, and any code that relies on account-level tiering semantics.

### Which blob features won’t I get in legacy blob storage?

Features like **lifecycle management**, **per-blob tiering**, **point-in-time restore**, and **Azure Data Lake Storage (hierarchical namespace)** are only available in **GPv2**.

### What would my bill look like after the migration? How do I calculate the new billing amount?

Your bill reflects **general-purpose v2** pricing, which includes charges for **read/write operations**, **tier-based storage pricing**, and **redundancy options**. Use the **Azure pricing calculator** and your current invoice data to estimate new costs.

- Azure pricing calculator: https://azure.microsoft.com/pricing/calculator/

### Is the migration permanent?

Yes. Once you migrate to **general-purpose v2**, you **can't revert** to legacy blob storage. GPv2 enables newer features and pricing structures.

### I can't migrate by the retirement date. Can I get an exception?

No. Microsoft won't grant exceptions. All legacy blob storage accounts must be migrated by the announced deadline to avoid disruption.

### What happens if I haven’t upgraded by the retirement date?

Microsoft will **automatically upgrade** your account and your decision not to migrate an existing GPv1 account will be construed as consent for Microsoft to migrate the account on your behalf. Which means you risk **billing misalignment**. **Data is preserved**, but access could be temporarily impacted.

> [!WARNING]
> Auto-upgrade timing and outcomes can vary. Proactive upgrades let you choose redundancy, tiering, and feature configurations aligned to your workload.

### Will the migration require downtime?

No. The migration process can be planned to **avoid downtime**. You can access data and services continuously during the transition.

### Will there be any data loss?

No. The migration process is safe and doesn't delete or move your data unexpectedly. All **blobs, containers, and metadata** remain intact.

### Will my existing application continue to work seamlessly after the migration?

In most cases, yes. **API endpoints remain unchanged**. However, review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with **general-purpose v2** features.

### What if I need help with the upgrade process?

Microsoft provides various resources to assist with the upgrade, including **documentation**, **support forums**, and **direct support channels**.

### What happens if I don't upgrade by the deadline?

If you don't migrate your legacy blob storage account to general-purpose v2 by the deadline, **all existing legacy blob storage accounts are auto-migrated** to a general-purpose v2 account, which may result in **higher billing costs**. Your decision not to migrate an existing legacy blob storage account will be construed as **consent for Microsoft to migrate the account on your behalf**.

### Why is general-purpose v2 more expensive than legacy blob storage?
General-purpose v2 introduces **tier-based pricing** and **transaction meters**. While some operations may cost more, general-purpose v2 offers **cost optimization** via **hot/cool/archive** tiers and lifecycle rules.

## See also

- [legacy blob storage retirement overview](legacy-blob-storage-account-migration-overview.md)  
- [Storage account upgrade process](storage-account-upgrade.md)  
- [Learn more about GPv2 pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).
- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)
