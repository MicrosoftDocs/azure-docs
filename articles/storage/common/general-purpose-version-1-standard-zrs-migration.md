---
title: ZRS Classic storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure ZRS Classic storage accounts means and how to prepare for a smooth migration to GPv2.
services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 08/19/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#CustomerIntent: As a storage admin, I want to understand the ZRS Classic retirement so that I can prepare for a smooth migration to GPv2.
---

# General Purpose v1 (GPv1) with ZRS redundancy retirement overview

Azure Storage is retiring the **ZRS Classic** storage account configuration. This article explains what the change means for workloads using ZRS Classic and how to prepare for a smooth transition to **General-purpose v2 (GPv2)** with modern ZRS.

## What is ZRS Classic?

**ZRS Classic** refers to legacy *Standard_ZRS* replication used with GPv1‑era accounts (account kind `Storage`, not `StorageV2`). Unlike modern ZRS on GPv2, which **replicates synchronously across three availability zones in the same region**, ZRS Classic does **not** provide that within‑region, three‑zone synchronous design and can rely on a different replication topology that may require a platform‑initiated failover to access secondary copies.

For a refresher on modern redundancy options and characteristics (LRS, ZRS, GRS, GZRS, and read‑access variants), see [Storage Redundancy Options](storage-redundancy.md)

## Why is ZRS Classic being retired?

Azure is standardizing on **GPv2** to deliver consistent resiliency, feature breadth, and management across all storage accounts. GPv2:

- Provides **modern ZRS** (synchronous replication across **three** availability zones) for higher availability in‑region.
- Enables **per‑blob access tiers** (Hot/Cool/Archive) and **lifecycle management** for cost optimization.
- Supports **ADLS Gen2**, immutable storage, object replication, and broad ecosystem integrations.
- Uses the **Azure Resource Manager (ARM)** control plane with Azure AD RBAC, tags, and policies for consistent governance.

Retiring ZRS Classic simplifies the platform and ensures customers benefit from modern capabilities and consistent pricing.

## Why migrate to GPv2?

The table below summarizes the key differences most customers care about:

| Area | ZRS Classic (legacy Standard_ZRS on GPv1) | GPv2 (StorageV2) with ZRS |
|---|---|---|
| Replication model | Legacy topology; not synchronous across 3 zones; may require platform failover | **Synchronous across three availability zones** in the region; no failover required during a single‑zone event |
| Availability during zonal outage | Access may be interrupted until failover | Remains online for reads/writes through a single‑zone outage |
| Access tiers & lifecycle | Limited; no per‑blob tiering | **Per‑blob tiering** (Hot/Cool/Archive) + **Lifecycle management** |
| Security & governance | Classic/GPv1 control plane | ARM‑based; Azure AD RBAC, tags, Azure Policy |
| Data services | Blobs, Files, Queues, Tables | Blobs, Files, Queues, Tables **+** ADLS Gen2 (hierarchical namespace) |
| Eventing & integrations | Limited | Event Grid and broader Azure integrations |
| Pricing meters | Legacy meters | **Consistent** GPv2 meters across account types |

> **Note**  
> For high availability in a single region, modern **ZRS** is recommended. Add **GZRS/RA‑GZRS** if you also need geo‑redundancy.

## Timeline and milestones

> [!WARNING]
> If you **do not** migrate your ZRS Classic accounts by the retirement date, Microsoft will **automatically upgrade** remaining accounts to **GPv2** with an equivalent or nearest redundancy setting available in the region. This may change your billing.

| Date | Milestone |
|---|---|
| **September 8, 2025** | Public announcement and documentation updates. |
| **September 2025** | Creation of new GPv1/Blob‑Only/**ZRS Classic** configurations blocked. |
| **September 1, 2026** | **Full retirement.** Any remaining ZRS Classic accounts are automatically upgraded to GPv2. |

## How should I prepare?

> [!TIP]
> Most ZRS Classic workloads can move to GPv2 **without code changes**. Plan for pricing differences (especially transaction meters) and take advantage of per‑blob tiering and lifecycle rules to optimize cost.

To minimize risk and ensure a smooth migration:

- **Inventory your ZRS Classic Storage accounts**: Use [Azure Resource Graph](../../governance/resource-graph/overview.md), CLI, [Azure Inventory](../blobs/blob-inventory-how-to.md), or the Portal to identify all ZRS Classic storage accounts.
- **Evaluate workloads**: To ensure compatibility with GPv2 (most ZRS Classic workloads require no code changes).
- **Plan for pricing changes**: Understand the new GPv2 pricing model, which includes per-blob tiering and transaction costs. Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your usage patterns.
- **Migrate to GPv2**: Use the Azure portal, CLI, or automation tools to upgrade from GPv1 to GPv2. [Learn more about the upgrade process](storage-account-upgrade.md).
- **Validate workloads**: Post-migration to ensure functionality and billing accuracy.
- **Monitor usage**: After migration, keep an eye on your storage account metrics to identify any unexpected changes in usage patterns or costs.

## Azure Resource Graph - Example Query 

Azure Resource Graph is a powerful tool that allows you to explore and query your Azure resources at scale. You can use it to identify all ZRS Classic storage accounts in your environment and assess their configurations. This can help you plan your migration to GPv2 more effectively.

Here is an example query to find all GPv1 storage accounts:

```
Resources
| where type == "microsoft.storage/storageaccounts"
| where sku.name in~ ("Standard_LRS", "Standard_GRS", "Standard_ZRS", "Standard_RAGRS", "Standard_RAGZRS")
| where kind != "StorageV2"
| extend Version = tostring(properties.siteProperties.propertiesid)
| project name, type, tenantId, kind, location, resourceGroup, subscriptionId, managedBy, sku, plan, properties, tags, identity, zones, extendedLocation, Version

```

## Regions that don't support Zone Redundant Storage
The following regions do not support Zone Redundant Storage (ZRS), if you have a ZRS Classic account in one or more of the following regions, please reach out to support to discuss moving to either LRS or GRS or migrating to a region that supports ZRS:

- Australia Southeast
- UK West
- Canada East
- US West Central
- Korea South
- South India
- Australia Central
- West India
- Austria East
- US West
- US East 3
- Finland Central
- India South Central

## What happens if I don’t migrate my accounts?
After **August 31, 2026**, you'll no longer be able to manage ZRS Classic Storage accounts. After **September 2026**, if you don't migrate your ZRS Classic storage account to General-purpose v2, all existing ZRS Classic accounts are auto migrated over to a General-purpose v2 account, which may result in higher billing costs. Your decision not to migrate an existing ZRS Classic account will be construed as consent for Microsoft to migrate the account on your behalf.

## How to get help
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
1. For **Resource**, select the resource you want to migrate.
1. For **Problem type**, select **Data Migration**.
1. For **Problem subtype**, select **Migrate account to new resource group/subscription/region/tenant**.
1. Select **Next**, then follow the instructions to submit your support request.


## Need help?
Learn more about related features and how to migrate:

- [Upgrade a storage account to GPv2](storage-account-upgrade.md)
- [Storage account overview](storage-account-overview.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)