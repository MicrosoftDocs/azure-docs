---
title: GPv1 storage account retirement FAQ
titleSuffix: Azure Storage
description: Commonly asked questions regarding the retirement of Azure General-purpose v1 (GPv1) storage accounts and upgrading to GPv2.
Services: storage
author: gtrossell-eng
ms.service: azure-storage
ms.topic: faq
ms.date: 12/15/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#customer-intent: As a storage admin, I want to find answers to common questions about the retirement of GPv1 storage accounts, so that I can plan my upgrade to GPv2 and avoid service disruption.
---

# General Purpose v1 (GPv1) storage account retirement FAQ

General purpose v2 (GPv2) storage accounts are the recommended account type for most Azure Storage scenarios. GPv2 provides access to the latest Azure Storage features including blob tiering, lifecycle management, and advanced redundancy options and offers the most cost effective pricing model for a wide range of workloads.

This FAQ addresses common questions about upgrading from general-purpose v1 (GPv1) storage accounts to GPv2. It covers upgrade procedures, billing considerations, feature differences, and guidance for selecting the right access tier. Use this resource to plan your upgrade and ensure a smooth transition before GPv1 retirement.

> [!IMPORTANT]
> Microsoft will retire GPv1 storage accounts on **October 13, 2026**. All GPv1 accounts must be upgraded to GPv2 before this date to avoid service disruption.  
> See: [storage account upgrade](storage-account-upgrade.md) and [general purpose v1 (GPv1) storage account retirement](general-purpose-version-1-account-migration-overview.md) for more information.

A GPv1 account is the original **general-purpose** Azure Storage account type. It supports all four core storage services (**Blobs**, **Files**, **Queues**, **Tables**) and the classic redundancy SKUs (**LRS**, **GRS**, **RA-GRS**). It predates blob tiering and many newer management features.

### Can I still create a new GPv1 account?

GPv1 Accounts are already blocked on the Azure portal. From March 3, 2026 all new GPv1 account creation will be blocked via the Azure Resource Manager (ARM) API.

### Which redundancy options are available on GPv2 accounts?
General-purpose v2 supports:

- Local-redundant storage (**LRS**).
- Zone-redundant storage (**ZRS**).
- Geo-redundant storage (**GRS**).
- Read-access geo-redundant storage (**RA-GRS**).
- Geo-zone-redundant storage (**GZRS**).
- Read-access geo-zone-redundant storage (**RA-GZRS**).

### Does GPv1 support hot, cool, or archive tiers or lifecycle management?

No.

### How does pricing differ from GPv2?

General-purpose v1 has **lower transaction prices** but **slightly higher capacity prices** than GPv2. For most workloads, **GPv2 is cheaper overall** once per-blob tiering and optimized capacity pricing are factored in.

### Does converting a storage account from GPv1 to GPv2 change pricing for files or disks?
**No.** Converting a storage account from GPv1 to GPv2 only affects Blob Storage pricing. Azure files and Azure disks each have their own independent pricing models, so their costs do not change when the underlying storage account is upgraded.

### Can I upgrade from GPv1 to GPv2 later? Will anything break?

You can switch to **general-purpose v2** with an **upgrade** operation in the Azure portal or via CLI/PowerShell. The change is **non-disruptive** you keep the **same endpoint names** and **data**.

> [!TIP]
> Validate application assumptions around pricing/tier behavior and any automation that references account kind. Test in a staging environment before upgrading production.

### Which features won’t I get in GPv1?

Many recent innovations **SMB Multichannel**, **NFS 3.0**, **premium file shares**, **Azure Data Lake Storage (hierarchical namespace)**, **point-in-time restore for blobs**, and other advanced features require **GPv2** or newer account kinds.

### What will my bill look like after the upgrade?

Your bill will reflect **GPv2** pricing, which differs slightly from GPv1. Key differences include:

- Charges for **read/write operations**  
- **tier based** pricing (hot, cool, cold, archive)  
- More **redundancy** flexibility

Use the **Azure Pricing Calculator** and your current invoice data to estimate new costs.  
**Pricing:** https://azure.microsoft.com/pricing/details/storage/blobs/  
**Calculator:** https://azure.microsoft.com/pricing/calculator/

### Is the upgrade permanent?

Yes. Once a storage account is upgraded from **GPv1** to **GPv2**, it **can't be reverted**. The upgrade enables newer features and pricing structures.

### I can't upgrade by the retirement date. Can I get an exception?

No. Microsoft won't grant exceptions. All GPv1 accounts must be upgraded by the announced deadline to avoid disruption.

### What happens if I haven’t upgraded by the retirement date?

Microsoft will **automatically upgrade** your account and your decision not to migrate an existing GPv1 account will be construed as consent for Microsoft to migrate the account on your behalf. Which means you risk **billing misalignment**. **data is preserved**, but access could be temporarily impacted.

> [!WARNING]
> Auto-upgrade timing and outcomes can vary. Proactive upgrades let you choose redundancy, tiering, and feature configurations aligned to your workload.

### Will the upgrade require downtime?

No. The upgrade is **non-disruptive** and doesn't require downtime. You can access data and services continuously.

### Will there be any data loss?

No. The upgrade process is safe and doesn't delete or move your data unexpectedly. All **blobs, containers, and metadata** remain intact.

### Will my existing application continue to work seamlessly?

In most cases, yes. **API endpoints remain unchanged**. However, review any hardcoded pricing assumptions or tier unaware logic to ensure compatibility with **GPv2** features.

### What if I need help with the upgrade process?

Microsoft provides various resources to assist with the upgrade, including **documentation**, **support forums**, and **direct support channels**.

### What happens if I don't upgrade by the deadline?

If you don't upgrade your GPv1 storage account to GPv2 by the deadline, **all existing GPv1 accounts are auto-migrated** to a GPv2 account, which may result in **higher billing costs**. Your decision not to upgrade an existing GPv1 account will be construed as **consent for Microsoft to upgrade the account on your behalf**.

### Why is GPv2 more expensive than GPv1?

GPv2 introduces new features and pricing models that may result in **higher costs for certain workloads**. However, it offers improved **performance**, **scalability**, and **management** capabilities that can lead to **overall cost savings**. Evaluate your **specific use case** and **access patterns** to understand the impact. 

### See also 
- [General purpose v1 (GPv1) storage account retirement](general-purpose-version-1-account-migration-overview.md)  
- [Storage account upgrade process](storage-account-upgrade.md)
- [Learn more about GPv2 pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Blobs pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)
