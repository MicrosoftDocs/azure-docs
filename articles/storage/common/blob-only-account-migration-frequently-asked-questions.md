---
title: Blob Only storage account retirement FAQ
titleSuffix: Azure Storage
description: FAQ for the retirement of Azure Blob Only storage accounts.
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
# Upgrade to general-purpose v2 storage accounts FAQ for Blob-Only accounts

General-purpose v2 (GPv2) storage accounts are the recommended account type for all Azure Storage scenarios, including blob-only workloads. GPv2 accounts provide access to the latest Azure Storage features, including per-blob tiering, lifecycle management, and advanced redundancy options. They also offer the most cost-effective pricing model for a wide range of blob workloads.

This FAQ addresses common questions about migrating from Blob-Only accounts to GPv2. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right access tier. Use this resource to plan your upgrade and ensure a smooth transition before Blob-Only retirement.

>[!IMPORTANT]  
>Microsoft will retire BlobStorage accounts on September 1, 2026. All BlobStorage accounts must be migrated to GPv2 before this date to avoid service disruption.

## BlobStorage to GPv2 FAQs

| Question | Answer |
|----------|--------|
| What is a BlobStorage account? | A BlobStorage account is a legacy Azure Storage account type designed for blob-only workloads. It supports block blobs and append blobs with account-level access tiering (Hot, Cool, Archive). |
| Can I still create a new BlobStorage account? | No. Starting August 2026, creation of new BlobStorage accounts will be disabled. |
| Which redundancy options are available on GPv2 accounts? | GPv2 supports Local redundant storage (LRS), Geo-redundant storage (GRS), Zone-redundant storage (ZRS), Read-access geo-redundant storage (RA-GZRS), and Read-access geo-redundant storage (RA-GRS). |
| Does BlobStorage support lifecycle management policies? | No. Lifecycle management is only available in GPv2 accounts. |
| How does pricing differ from GPv2? | BlobStorage uses account-level tiering limiting pricing flexibility. GPv2 offers per-blob tiering and optimized pricing for different access patterns. |
| Can I migrate from BlobStorage to GPv2 later? Will anything break? | You must migrate to a new GPv2 account and move your data. The migration is non-disruptive if planned properly. Most applications will continue to work without changes. |
| Which blob features won’t I get in BlobStorage? | Features like lifecycle management, per-blob tiering, point-in-time restore, and Data Lake (Hierarchical Namespace) are only available in GPv2. |
| What would my bill look like after the migration? How do I calculate the new billing amount? | Your bill will reflect GPv2 pricing, which includes charges for read/write operations, tier-based storage pricing, and redundancy options. Use the Azure Pricing Calculator and your current invoice data to estimate new costs. |
| Is the migration permanent? | Yes. Once you migrate to GPv2, you can't revert to BlobStorage. GPv2 enables newer features and pricing structures. |
| I can't migrate by the retirement date. Can I get an exception? | No. Microsoft won't grant exceptions. All BlobStorage accounts must be migrated by the announced deadline to avoid disruption. |
| What happens if I haven’t migrated by the retirement date? Will I lose access to my data? | Microsoft may automatically migrate your account, but you risk access disruption and billing misalignment. Data will be preserved, but access could be temporarily impacted. |
| Will the migration require downtime? | No. The migration process can be planned to avoid downtime. You can access data and services continuously during the transition. |
| Will there be any data loss? | No. The migration process is safe and doesn't delete or move your data unexpectedly. All blobs, containers, and metadata remain intact. |
| Will my existing application continue to work seamlessly after the migration? | In most cases, yes. API endpoints remain unchanged. However, review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features. |
| What if I need help with the upgrade process? | Microsoft provides various resources to assist with the upgrade, including documentation, support forums, and direct support channels. |
| What happens if I don't upgrade by the deadline? | If you don't upgrade by the deadline, your GPv1 account will be automatically upgraded to GPv2. |