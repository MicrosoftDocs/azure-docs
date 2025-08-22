---
title: GPv1 ZRS Standard account retirement FAQ
titleSuffix: Azure Storage
description: Commonly asked questions regarding the retirement of Azure General-purpose v1 (GPv1) ZRS storage accounts and upgrading to GPv2.
Services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: faq
ms.date: 07/22/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#customer-intent: As a storage admin, I want to find answers to common questions about the retirement of General-purpose v1 (GPv1) Standard ZRS accounts, so that I can plan my upgrade to General-purpose v2 (GPv2) and avoid service disruption.
---

# GPv1 Standard ZRS account retirement FAQ

General-purpose v2 (GPv2) storage accounts are the recommended account type for most Azure Storage scenarios. GPv2 provides access to the latest Azure Storage features, including modern ZRS replication, blob tiering, lifecycle management, and advanced redundancy options. It also offers the most cost-effective pricing model for a wide range of workloads.

This FAQ addresses common questions about upgrading from **GPv1 Standard ZRS** to **GPv2**. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right redundancy option. Use this resource to plan your upgrade and ensure a smooth transition before GPv1 Standard ZRS retirement.

> [!IMPORTANT]
> Microsoft will retire accounts that use **GPv1 Standard ZRS** on **September 1, 2026**. All affected accounts must be upgraded to **GPv2** before this date to avoid service disruption.  
> See: storage-account-upgrade.md · general-purpose-version-1-zone-redundant-storage-migration-overview.md


## What is GPv1 Standard ZRS storage?

**GPv1 Standard ZRS** refers to legacy `Standard_ZRS` redundancy used with GPv1 accounts (account kind `Storage`). It predates modern ZRS and does **not** provide synchronous replication across three availability zones.

## Can I still create a new account using ZRS standard redundancy?

No. Creation of new accounts using **Standard ZRS on GPv1** is blocked starting **September 2025**.

## How does modern ZRS differ from GPv1 Standard ZRS?

Modern **ZRS on GPv2** replicates data **synchronously across three availability zones** in the same region, helping ensure high availability during zonal outages. **GPv1 Standard ZRS** uses an older replication model that may require platform failover to access secondary copies.

## Which redundancy options are available on GPv2 accounts?

**GPv2 supports:** Local-redundant storage (**LRS**), Zone-redundant storage (**ZRS**), Geo-redundant storage (**GRS**), Read-access geo-redundant storage (**RA-GRS**), Geo-zone-redundant storage (**GZRS**), and Read-access geo-zone-redundant storage (**RA-GZRS**).

## Does GPv1 Standard ZRS support blob tiering or lifecycle management?

No. **GPv1 Standard ZRS** does not support **per-blob tiering** or **lifecycle management policies**.

## How does pricing differ from GPv1 Standard ZRS?

**GPv2** introduces **tier-based pricing** and **transaction meters**. While some operations may cost more, GPv2 offers **cost optimization** via **Hot/Cool/Archive** tiers and lifecycle rules.

## Can I upgrade from GPv1 Standard ZRS to GPv2 later? Will anything break?

Yes. You can upgrade **in place** via the Azure portal, CLI, or PowerShell. The upgrade is **non-disruptive** and keeps the **same endpoints**. Most workloads require **no code changes**.

> [!TIP]
> Validate SDK versions, redundancy assumptions, and any automation that references account kind or legacy Standard_ZRS semantics before upgrading production.

## Will the upgrade require downtime?

No. The upgrade is **online** and does **not** interrupt data access.

## Will there be any data loss?

No. The upgrade process preserves all **data** and **metadata**.

## Will my existing application continue to work seamlessly after the upgrade?

In most cases, yes. **API endpoints remain unchanged**. Validate SDK compatibility and any **hardcoded** assumptions about pricing or redundancy.

## What happens if I don’t upgrade by the retirement date?

Microsoft may **automatically upgrade** your GPv1 Standard ZRS account to GPv2 with the **nearest supported redundancy option**. This may result in **billing changes**.

> [!WARNING]
> Auto-upgrade timing and outcomes can vary. Proactive upgrades let you choose redundancy, tiering, and feature configurations aligned to your workload.

## Is the upgrade permanent?

Yes. Once upgraded to **GPv2**, you **cannot** revert to **GPv1 Standard ZRS**.

## Why is GPv1 Standard ZRS being retired?

To standardize on **GPv2** for resiliency, feature parity, and consistent pricing. Modern **ZRS** provides **synchronous zone replication** and integrates with advanced features such as **Event Grid** and **Azure Data Lake Storage (hierarchical namespace)**.

## What if my region doesn’t support ZRS?

Your account will be upgraded to **GPv2** with the **closest available redundancy** (for example, **LRS** or **GRS**). You can later **migrate** to a region that supports **ZRS** if needed.

## How do I calculate the new billing amount?

Use the **Azure Pricing Calculator** and your current usage data to estimate costs under **GPv2** pricing.  
Calculator: https://azure.microsoft.com/pricing/calculator/  
Blobs pricing: https://azure.microsoft.com/pricing/details/storage/blobs/

## Can I enable geo-redundancy after upgrading?

Yes. **GPv2** supports **GRS**, **RA-GRS**, **GZRS**, and **RA-GZRS**.

## What if I need help with the upgrade process?

Microsoft provides documentation, Q&A forums, and support channels. If you have a support plan, create a **support request** in the Azure portal.

---

## See also

- [GPv1 Standard ZRS retirement overview](general-purpose-version-1-zone-redundant-storage-migration-overview.md)  
- [Storage account upgrade process](storage-account-upgrade.md)  
- [Storage account redundancy](storage-redundancy.md)
- [Learn more about GPv2 pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)