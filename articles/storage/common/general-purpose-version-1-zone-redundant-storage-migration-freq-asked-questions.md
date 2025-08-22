---
title: General Purpose v1 (GPv1) Standard Zone Redundant Storage account retirement frequently asked questions (faq)
titleSuffix: Azure Storage
description: FAQ page for the retirement of Azure General Purpose v1 (GPv1) Standard Zone Redundant Storage accounts.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: faq
ms.date: 08/19/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
# CustomerIntent: As a storage admin, I want to find answers to common questions about the retirement of General Purpose v1 (GPv1) Standard Zone Redundant Storage accounts, so that I can plan my upgrade to General Purpose v2 (GPv2) and avoid service disruption.
---

# Upgrade from GPv1 Standard ZRS FAQ

General-purpose v2 (GPv2) storage accounts are the recommended account type for most Azure Storage scenarios. GPv2 accounts provide access to the latest Azure Storage features, including modern ZRS replication, blob tiering, lifecycle management, and advanced redundancy options. They also offer the most cost-effective pricing model for a wide range of workloads.

This FAQ addresses common questions about upgrading from **GPv1 Standard ZRS** to GPv2. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right redundancy option. Use this resource to plan your upgrade and ensure a smooth transition before GPv1 Standard ZRS retirement.

> [!IMPORTANT]
> Microsoft will retire accounts that use GPv1 Standard ZRS on **September 1, 2026**. All accounts must be upgraded to GPv2 [Storage Account Upgrade](storage-account-upgrade.md) before this date to avoid service disruption. [Learn more about the retirement](general-purpose-version-1-zone-redundant-storage-migration-overview.md)

| Question | Answer |
|----------|--------|
| What is GPv1 Standard ZRS storage? | GPv1 Standard ZRS refers to legacy Standard_ZRS replication used with GPv1 accounts (account kind `Storage`). It predates modern ZRS and does not provide synchronous replication across three availability zones. |
| Can I still create a new account using ZRS standard redundancy? | No. Creation of new accounts is blocked starting September 2025. |
| How does modern ZRS differ from GPv1 Standard ZRS? | Modern ZRS (on GPv2) replicates data **synchronously across three availability zones** in the same region, ensuring high availability during zonal outages. GPv1 Standard ZRS uses an older replication model that may require platform failover to access secondary copies. |
| Which redundancy options are available on GPv2 accounts? | LRS, ZRS, GRS, RA-GRS, GZRS, and RA-GZRS. |
| Does GPv1 Standard ZRS support blob tiering or lifecycle management? | No. GPv1 Standard ZRS does not support per-blob tiering or lifecycle policies. |
| How does pricing differ from GPv1 Standard ZRS? | GPv2 introduces tier-based pricing and transaction meters. While some operations may cost more, GPv2 offers cost optimization through Hot/Cool/Archive tiers and lifecycle rules. |
| Can I upgrade from GPv1 Standard ZRS to GPv2 later? Will anything break? | Yes. You can upgrade in place via the portal, CLI, or PowerShell. The upgrade is non-disruptive and keeps the same endpoints. Most workloads require no code changes. |
| Will the upgrade require downtime? | No. The upgrade is online and does not interrupt data access. |
| Will there be any data loss? | No. The upgrade process preserves all data and metadata. |
| Will my existing application continue to work seamlessly after the upgrade? | In most cases, yes. API endpoints remain unchanged. Validate SDK versions and any hardcoded assumptions about pricing or redundancy. |
| What happens if I don’t upgrade by the retirement date? | Microsoft will automatically upgrade your GPv1 Standard ZRS account to GPv2 with the nearest supported redundancy option. This may result in billing changes. |
| Is the upgrade permanent? | Yes. Once upgraded to GPv2, you cannot revert to GPv1 Standard ZRS. |
| Why is GPv1 Standard ZRS being retired? | To standardize on GPv2 for resiliency, feature parity, and consistent pricing. Modern ZRS provides synchronous zone replication and integrates with advanced features like Event Grid and ADLS Gen2. |
| What if my region doesn’t support ZRS? | Your account will be upgraded to GPv2 with the closest available redundancy (LRS or GRS). You can later migrate to a ZRS-supported region if needed. |
| How do I calculate the new billing amount? | Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) and your current usage data to estimate costs under GPv2 pricing. |
| Can I enable geo-redundancy after upgrading? | Yes. GPv2 supports GRS, RA-GRS, GZRS, and RA-GZRS. |
| What if I need help with the upgrade process? | Microsoft provides documentation, Q&A forums, and support channels. If you have a support plan, create a support request in the Azure portal. |

## Related links
- [GPv1 standard ZRS retirement overview](general-purpose-version-1-zone-redundant-storage-migration-overview.md)
- [Storage account upgrade process](storage-account-upgrade.md)
- [Storage Account Redundancy](storage-redundancy.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)