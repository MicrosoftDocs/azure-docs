---
title: Legacy Blob Storage account retirement FAQ
titleSuffix: Azure Storage
description: FAQ for the retirement of Azure legacy blob storage accounts.
Services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: padmalathas
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#CustomerIntent: As a storage admin, I want to understand the Legacy Blob Storage retirement so that I can prepare for a smooth migration to GPv2.
---
# Upgrade to General Purpose v2 storage accounts FAQ for Legacy Blob Storage accounts

General Purpose v2 (GPv2) storage accounts are the recommended account type for all Azure Storage scenarios, including blob-only workloads. General-purpose v2 accounts provide access to the latest Azure Storage features, including per-blob tiering, lifecycle management, and advanced redundancy options. They also offer the most cost-effective pricing model for a wide range of blob workloads.

This FAQ addresses common questions about migrating from Legacy Blob Storage accounts to General-purpose v2. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right access tier. Use this resource to plan your upgrade and ensure a smooth transition before Legacy Blob Storage retirement.

>[!IMPORTANT]  
>Microsoft will retire Legacy Blob Storage accounts on September 1, 2026. All Legacy Blob Storage accounts must be migrated to General-purpose v2 before this date to avoid service disruption. [Learn more about the upgrade process](storage-account-upgrade.md). [Learn more about the retirement](general-purpose-version-1-account-migration-overview.md).

## Legacy Blob Storage to General-purpose v2 FAQs

| Question | Answer |
|----------|--------|
| What is a Legacy Blob Storage account? | A Legacy Blob Storage account is a legacy Azure Storage account type designed for blob-only workloads. It supports block blobs and append blobs with account-level access tiering (hot, cool, archive). |
| Can I still create a new Legacy Blob Storage account? | No. Starting August 2026, creation of new Legacy Blob Storage accounts will be disabled. |
| Which redundancy options are available on General-purpose v2 accounts? | General-purpose v2 supports Local redundant storage (LRS), Geo-redundant storage (GRS), Zone-redundant storage (ZRS), Read-access geo-redundant storage (RA-GZRS), and Read-access geo-redundant storage (RA-GRS). |
| Does Legacy Blob Storage support lifecycle management policies? | No. Lifecycle management is only available in General-purpose v2 accounts. |
| How does pricing differ from GPv2? | Legacy Blob Storage uses account-level tiering limiting pricing flexibility. General-purpose v2 offers per-blob tiering and optimized pricing for different access patterns. [Learn more about GPv2 pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) |
| Can I migrate from Legacy Blob Storage to GPv2 later? Will anything break? | You must migrate to a new General-purpose v2 account and move your data. The migration is nondisruptive if planned properly. Most applications continue to work without changes. |
| Which blob features won’t I get in Legacy Blob Storage? | Features like lifecycle management, per-blob tiering, point-in-time restore, and Data Lake (Hierarchical Namespace) are only available in GPv2. |
| What would my bill look like after the migration? How do I calculate the new billing amount? | Your bill reflects General-purpose v2 pricing, which includes charges for read/write operations, tier-based storage pricing, and redundancy options. Use the Azure Pricing Calculator and your current invoice data to estimate new costs. |
| Is the migration permanent? | Yes. Once you migrate to General-purpose v2, you can't revert to Legacy Blob Storage. General-purpose v2 enables newer features and pricing structures. |
| I can't migrate by the retirement date. Can I get an exception? | No. Microsoft won't grant exceptions. All Legacy Blob Storage accounts must be migrated by the announced deadline to avoid disruption. |
| What happens if I haven’t migrated by the retirement date? Will I lose access to my data? | Microsoft may automatically migrate your account, but you risk access disruption and billing misalignment. Data is preserved, but access could be temporarily impacted. |
| Will the migration require downtime? | No. The migration process can be planned to avoid downtime. You can access data and services continuously during the transition. |
| Will there be any data loss? | No. The migration process is safe and doesn't delete or move your data unexpectedly. All blobs, containers, and metadata remain intact. |
| Will my existing application continue to work seamlessly after the migration? | In most cases, yes. API endpoints remain unchanged. However, review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with General-purpose v2 features. |
| What if I need help with the upgrade process? | Microsoft provides various resources to assist with the upgrade, including documentation, support forums, and direct support channels. |
| What happens if I don't upgrade by the deadline? | If you don't migrate your Legacy Blob Storage account to General-purpose v2 by the deadline, all existing Legacy Blob Storage accounts are auto migrated over to a General-purpose v2 account, which may result in higher billing costs. Your decision not to migrate an existing Legacy Blob Storage account will be construed as consent for Microsoft to migrate the account on your behalf. |