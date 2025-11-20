---
title: GPv1 ZRS standard account retirement FAQ
titleSuffix: Azure Storage
description: Commonly asked questions regarding the retirement of Azure general-purpose v1 (GPv1) ZRS storage accounts and upgrading to GPv2.
Services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: faq
ms.date: 07/22/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#customer-intent: As a storage admin, I want to find answers to common questions about the retirement of general-purpose v1 (GPv1) standard ZRS accounts, so that I can plan my upgrade to general-purpose v2 (GPv2) and avoid service disruption.
---

# GPv1 standard ZRS account retirement FAQ

General-purpose v2 (GPv2) storage accounts are the recommended account type for most Azure storage scenarios. GPv2 provides access to the latest Azure Storage features, including modern ZRS replication, blob tiering, lifecycle management, and advanced redundancy options. It also offers the most cost-effective pricing model for a wide range of workloads.

This FAQ addresses common questions about upgrading from **GPv1 standard ZRS** to **GPv2**. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right redundancy option. Use this resource to plan your upgrade and ensure a smooth transition before GPv1 standard ZRS retirement.

> [!IMPORTANT]
> Microsoft will retire accounts that use **GPv1 standard ZRS** on **October 13, 2026**. All affected accounts must be upgraded to **GPv2** before this date to avoid service disruption.  
> See: [Upgrade storage account](storage-account-upgrade.md) [general purpose v1 (GPv1) with ZRS redundancy migration overview](general-purpose-version-1-zone-redundant-storage-migration-overview.md)


### What is GPv1 standard ZRS storage?

**GPv1 standard ZRS** refers to legacy `Standard_ZRS` redundancy used with GPv1 accounts (account kind `Storage`). It predates modern ZRS and does **not** provide synchronous replication across three availability zones.

### Can I still create a new account using ZRS standard redundancy?

No. Creation of new accounts using **standard ZRS on GPv1** is blocked starting **September 2025**.

### How does modern ZRS differ from GPv1 standard ZRS?

Modern **ZRS on GPv2** replicates data **synchronously across three availability zones** in the same region, helping ensure high availability during zonal outages. **GPv1 standard ZRS** uses an older replication model that may require platform failover to access secondary copies.

### Which redundancy options are available on GPv2 accounts?

General-purpose v2 supports:

- Local-redundant storage (**LRS**).
- Zone-redundant storage (**ZRS**).
- Geo-redundant storage (**GRS**).
- Read-access geo-redundant storage (**RA-GRS**).
- Geo-zone-redundant storage (**GZRS**).
- Read-access geo-zone-redundant storage (**RA-GZRS**).

### Does GPv1 standard ZRS support blob tiering or lifecycle management?

No. **GPv1 standard ZRS** does not support **per-blob tiering** or **lifecycle management policies**.

### How does pricing differ from GPv1 standard ZRS?

**GPv2** introduces **tier-based pricing** and **transaction meters**. While some operations may cost more, GPv2 offers **cost optimization** via **hot/cool/archive** tiers and lifecycle rules.

### Can I upgrade from GPv1 standard ZRS to GPv2 later? Will anything break?

Yes. You can upgrade **in place** via the Azure portal, CLI, or PowerShell. The upgrade is **non-disruptive** and keeps the **same endpoints**. Most workloads require **no code changes**.

> [!TIP]
> Validate SDK versions, redundancy assumptions, and any automation that references account kind or legacy standard_ZRS semantics before upgrading production.

### Will the upgrade require downtime?

No. The upgrade is **online** and does **not** interrupt data access.

### Will there be any data loss?

No. The upgrade process preserves all **data** and **metadata**.

### Will my existing application continue to work seamlessly after the upgrade?

In most cases, yes. **API endpoints remain unchanged**. Validate SDK compatibility and any **hardcoded** assumptions about pricing or redundancy.

### What happens if I haven’t upgraded by the retirement date?

Microsoft will **automatically upgrade** your account and your decision not to migrate an existing GPv1 account will be construed as consent for Microsoft to migrate the account on your behalf. Which means you risk **billing misalignment**. **Data is preserved**, but access could be temporarily impacted.

> [!WARNING]
> Auto-upgrade timing and outcomes can vary. Proactive upgrades let you choose redundancy, tiering, and feature configurations aligned to your workload.

### Is the upgrade permanent?

Yes. Once upgraded to **GPv2**, you **cannot** revert to **GPv1 standard ZRS**.

### Why is GPv1 standard ZRS being retired?

To standardize on **GPv2** for resiliency, feature parity, and consistent pricing. Modern **ZRS** provides **synchronous zone replication** and integrates with advanced features such as **Event Grid** and **Azure Data Lake Storage (hierarchical namespace)**.

### What if my region doesn’t support ZRS?

Your account will be upgraded to **GPv2** with the **closest available redundancy** (for example, **LRS** or **GRS**). You can later **migrate** to a region that supports **ZRS** if needed.

### How do I calculate the new billing amount?

Use the **Azure pricing calculator** and your current usage data to estimate costs under **GPv2** pricing.  
Calculator: https://azure.microsoft.com/pricing/calculator/  
Blobs pricing: https://azure.microsoft.com/pricing/details/storage/blobs/

### Can I enable geo-redundancy after upgrading?

Yes. **GPv2** supports **GRS**, **RA-GRS**, **GZRS**, and **RA-GZRS**.

### Why can I not upgrade my GPv1 account to GPv2 in the Azure portal?
The Azure portal may not allow you to upgrade your GPv1 account to GPv2 if the account is in a region that does not support GPv2, or if there are specific configurations or features in your GPv1 account that are incompatible with GPv2. In such cases, you may need to use Azure CLI or PowerShell to perform the upgrade, or consider creating a new GPv2 account and migrating your data.

### Why does PowerShell or CLI allow me to upgrade my GPv1 account to GPv2 but my account doesn't upgrade?
PowerShell and Azure CLI may bypass certain restrictions present in the Azure portal, allowing you to upgrade your GPv1 account to GPv2 even if the portal does not permit it. This could be due to differences in how the tools validate account configurations or regional support. However, using these tools may still require you to address any underlying compatibility issues before a successful upgrade can occur.

### What if I don't want LRS or GRS as my redundancy option after the upgrade?
If you prefer a different redundancy option and you are in a region that doesn't support ZRS, you can choose to upgrade to GPv2 with LRS or GRS initially and then later migrate your account to a region that supports ZRS. Alternatively, you can create a new GPv2 account in a supported region with your desired redundancy option and migrate your data there.

### What if I need help with the upgrade process?

Microsoft provides documentation, Q&A forums, and support channels. If you have a support plan, create a **support request** in the Azure portal.


## See also

- [GPv1 standard ZRS retirement overview](general-purpose-version-1-zone-redundant-storage-migration-overview.md)  
- [Storage account upgrade process](storage-account-upgrade.md)  
- [Storage account redundancy](storage-redundancy.md)
- [Learn more about GPv2 pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)