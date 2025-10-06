---
title: General Purpose v1 (GPv1) with ZRS redundancy retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure General Purpose v1 (GPv1) with ZRS redundancy accounts means and how to prepare for a smooth migration to GPv2.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/19/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: references_regions
#CustomerIntent: As a storage admin, I want to understand the General Purpose v1 (GPv1) with ZRS redundancy retirement so that I can prepare for a smooth migration to GPv2.
---

# Overview of general purpose (GPv1) with zone redundant storage (ZRS) redundancy retirement

Azure Storage is retiring the **general purpose v1 (GPv1) with ZRS redundancy** storage account configuration. This article explains what the change means for workloads using general purpose v1 (GPv1) with ZRS redundancy and how to prepare for a smooth transition to **general-purpose v2 (GPv2)** with modern ZRS.

## About GPv1 with ZRS redundancy

**General purpose v1 (GPv1) with ZRS redundancy** refers to legacy **Standard_ZRS** replication used with GPv1‑era accounts (account kind `Storage`, not `StorageV2`). Unlike modern ZRS on GPv2, which **replicates synchronously across three availability zones in the same region**, GPv1 with ZRS redundancy does **not** provide that within‑region, three‑zone synchronous design and can rely on different replication topology that may require a platform‑initiated failover to access secondary copies.

For a refresher on modern redundancy options and characteristics (LRS, ZRS, GRS, GZRS, and read‑access variants), see [storage redundancy options](storage-redundancy.md)

## Why GPv1 with ZRS redundancy is being retired

Azure is standardizing on **GPv2** to deliver consistent resiliency, feature breadth, and management across all storage accounts. GPv2:

- Provides **modern ZRS** (synchronous replication across **three** availability zones) for higher availability in‑region.
- Enables **per‑blob access tiers** (hot/cool/archive) and **lifecycle management** for cost optimization.
- Supports **ADLS Gen2**, immutable storage, object replication, and broad ecosystem integrations.
- Uses the **Azure Resource Manager (ARM)** control plane with Azure AD RBAC, tags, and policies for consistent governance.

Retiring GPv1 with ZRS redundancy simplifies the platform and ensures customers benefit from modern capabilities and consistent pricing.

## Benefits of migrating to GPv2

The table below summarizes the key differences most customers care about:

| Area | General purpose v1 (GPv1) with ZRS redundancy | GPv2 (StorageV2) with ZRS |
|---|---|---|
| Replication model | Legacy topology; not synchronous across 3 zones; may require platform failover | **Synchronous across three availability zones** in the region; no failover required during a single‑zone event |
| Availability during zonal outage | Access may be interrupted until failover | Remains online for reads/writes through a single‑zone outage |
| Access tiers & lifecycle | Limited; no per‑blob tiering | **per‑blob tiering** (hot/cool/archive) + **lifecycle management** |
| Security & governance | General purpose v1 (GPv1) with ZRS redundancy/GPv1 control plane | ARM‑based; Azure AD RBAC, tags, Azure Policy |
| Data services | Blobs, Files, Queues, Tables | Blobs, Files, Queues, Tables **+** ADLS Gen2 (hierarchical namespace) |
| Eventing & integrations | Limited | Event Grid and broader Azure integrations |
| Pricing meters | Legacy meters | **Consistent** GPv2 meters across account types |

> [!NOTE]
> For high availability in a single region, modern **ZRS** is recommended. Add **GZRS/RA‑GZRS** if you also need geo‑redundancy.

## Retirement timeline and key milestones

> [!WARNING]
> If you **do not** migrate your general purpose v1 (GPv1) with ZRS redundancy accounts by the retirement date, Microsoft will **automatically upgrade** remaining accounts to **GPv2** with an equivalent or nearest redundancy setting available in the region. This may change your billing.

| Date               | Milestone |
|--------------------|---|
| **September 2025** | Public announcement and documentation updates. |
| **Q1 2026** | Creation of new GPv1/Blob‑Only/**general purpose v1 (GPv1) with ZRS redundancy** configurations blocked. |
| **October 2026** | **Full retirement.** Any remaining general purpose v1 (GPv1) with ZRS redundancy accounts are automatically upgraded to GPv2. |

## Preparing for migration

> [!TIP]
> Most general purpose v1 (GPv1) with ZRS redundancy workloads can move to GPv2 **without code changes**. Plan for pricing differences (especially transaction meters) and take advantage of per‑blob tiering and lifecycle rules to optimize cost.

To minimize risk and ensure a smooth migration:

1. **Inventory your general purpose v1 (GPv1) with ZRS redundancy accounts**: Use [Azure Resource Graph](../../governance/resource-graph/overview.md), CLI, [Azure Inventory](../blobs/blob-inventory-how-to.md), or the Portal to identify all general purpose v1 (GPv1) with ZRS redundancy storage accounts.
1. **Evaluate workloads**: To ensure compatibility with GPv2 (most general purpose v1 (GPv1) with ZRS redundancy workloads require no code changes).
1. **Plan for pricing changes**: Understand the new GPv2 pricing model, which includes per-blob tiering and transaction costs. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your usage patterns.
1. **Migrate to GPv2**: Use the Azure portal, CLI, or automation tools to upgrade from GPv1 to GPv2. [Learn more about the upgrade process](storage-account-upgrade.md).
1. **Validate workloads**: Post-migration to ensure functionality and billing accuracy.
1. **Monitor usage**: After migration, keep an eye on your storage account metrics to identify any unexpected changes in usage patterns or costs.

## Identify GPv1 with ZRS accounts using Azure Resource Graph

Azure Resource Graph is a powerful tool for exploring and querying your Azure resources at scale. You can use it to identify all General Purpose v1 (GPv1) and legacy Blob storage accounts in your environment and assess their configurations. This helps you plan your migration to GPv2 more effectively.

Here’s an example Azure Resource Graph query to identify all General Purpose v1 (GPv1) storage accounts (kind `Storage`) and legacy Blob storage accounts (kind `BlobStorage`) within your subscription that are impacted by the retirement:

```
Resources
| where type == "microsoft.storage/storageaccounts"
| where sku.name in~ ("Standard_LRS", "Standard_GRS", "Standard_ZRS", "Standard_RAGRS", "Standard_RAGZRS")
| where kind != "StorageV2"
| extend Version = tostring(properties.siteProperties.propertiesid)
| project name, type, tenantId, kind, location, resourceGroup, subscriptionId, managedBy, sku, plan, properties, tags, identity, zones, extendedLocation, Version

```
>[!NOTE] 
> This query identifies both GPv1 accounts (kind `Storage`) and legacy blob storage accounts (kind `BlobStorage`) regardless of redundancy. Since both account types are being retired, be sure to review and include all affected accounts in your migration plan.

## Regions without ZRS support
The following regions do not support Zone Redundant Storage (ZRS), if you have a general purpose v1 (GPv1) with ZRS redundancy account in one or more of the following regions, you will need to convert to GPv2 with GPv2 LRS and before finally converting to GPv2 GRS or migrate to a region that supports GPv2 ZRS.

### Azure global cloud
- Australia Central.
- Australia Southeast.
- Canada East.
- Korea South.
- North Central US.
- South India.
- Sweden South.
- UK West.
- West Central US.
- West India.
- West US.

### Access-restricted regions
- Australia Central 2.
- Brazil Southeast.
- France South.
- Germany North.
- Norway West.
- South Africa West.
- Switzerland West.
- UAE Central.

### Azure operated by 21Vianet
- China East.
- China East 2.
- China East 3.
- China North.
- China North 2.

### Information required for support request
When contacting support, please provide the following information to help facilitate the migration process:
- Subscription ID
- Resource Group Name
- Name of all Storage Account Names that need to be migrated
- List of all regions where the accounts are located
- Preferred redundancy option for each account (LRS or GRS)

### What if I don't want LRS or GRS as my redundancy option after the upgrade?
If you prefer a different redundancy option and you are in a region that doesn't support ZRS, you can choose to upgrade to GPv2 with LRS or GRS initially and then later migrate your account to a region that supports ZRS. Alternatively, you can create a new GPv2 account in a supported region with your desired redundancy option and migrate your data there.


## What happens if you don’t migrate by the deadline
After **October 2026**, if you don't migrate your GPv1 with ZRS redundancy storage account to general-purpose v2, all existing GPv1 with ZRS redundancy accounts are auto migrated over to a general-purpose v2 account, which may result in higher billing costs. Your decision not to migrate an existing GPv1 with ZRS redundancy account will be construed as consent for Microsoft to migrate the account on your behalf.

## Where to get help and support
If you have questions, get answers from community experts in Microsoft Q&A.

If your organization or company has partnered with Microsoft or works with Microsoft representatives, such as cloud solution architects (CSAs) or customer success account managers (CSAMs), contact them for additional resources for migration.

If you have a support plan and you need technical help, create a support request in the Azure portal:

1. Search for **Help + support** in the [Azure portal](https://portal.azure.com#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).
1. Select **Create a support request**.
1. For **Summary**, type a description of your issue.
1. For **Issue type**, select **Technical**.
1. For **Subscription**, select your subscription.
1. For **Service**, select **My services**.
1. For **Service type**, select **Storage Account Management**.
1. For **Resource**, select **the resource you want to migrate**.
1. For **Problem type**, select **Upgrade or change account type, tier or replication**.
1. For **Problem subtype**, select **Upgrade to general purpose v2 storage account.**.
1. Select **Next**, then follow the instructions to submit your support request.


## Need help?
Learn more about related features and how to migrate:

- [Upgrade a storage account to GPv2](storage-account-upgrade.md)
- [Storage account overview](storage-account-overview.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)