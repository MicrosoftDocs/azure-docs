---
title: GPv1 storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure GPv1 storage accounts means and how to prepare for a smooth migration to GPv2.
Services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template

#CustomerIntent: As a storage admin, I want to understand the GPv1 retirement so that I can prepare for a smooth migration to GPv2.
---

# General-purpose v1 (GPv1) storage account retirement overview
Azure Storage is retiring the General-purpose v1 (GPv1) storage account type. This article explains why the change is occurring, what it means for your workloads, and how to prepare for the transition to General-purpose v2 (GPv2) accounts.

## Why is GPv1 being retired?
GPv1 was introduced to support early Azure storage scenarios across blobs, tables, queues, and files. However, GPv2 has since become the default standard for storage accounts, offering broader feature support, improved consistency, and better performance.

By retiring GPv1, Azure can simplify the platform, eliminate legacy metering inconsistencies, and ensure all customers benefit from modern capabilities and pricing models.

## Key differences between GPv1 and GPv2
| Feature | GPv1 | GPv2 |
|--------|------|------|
| Blob tiering (Hot/Cool/Archive) | ❌ | ✅ |
| Lifecycle management | ❌ | ✅ |
| Immutable blob storage | ❌ | ✅ |
| Event Grid integration | Limited | ✅ |
| Regionally consistent pricing meters | ❌ | ✅ |
| ZRS and advanced redundancy | Limited | ✅ |

GPv2 supports all capabilities of GPv1 and adds several enhancements, including cost optimization and richer management tools.

## Timeline and milestones
>[!Warning]
>If you do not migrate your General Purpose v1 storage account to GPv2 by August 31, 2026, all existing General Purpose v1 accounts will be auto migrated over to a GPv2 account, which may result in higher billing costs. Your decision not to migrate an existing General Purpose v1 account will be construed as consent for Microsoft to migrate the account on your behalf.

| Date           | Milestone                                                   |
|----------------|-------------------------------------------------------------|
| September 2025 | Retirement announced                                        |
| August 2026    | Creation of new GPv1 Storage accounts disabled              |
| September 2026 | Full retirement; Any remaining GPv1 Storage accounts will be automigrated to GPv2. Your decision not to migrate an existing GPv1 account will be construed as consent for Microsoft to migrate the account on your behalf. |

The retirement takes effect globally across all Azure regions.

## Plan for pricing changes when upgrading GPv1 → GPv2
> [!WARNING]
> Upgrading from General-purpose v1 (GPv1) to General-purpose v2 (GPv2) introduces a new pricing model that may increase costs for certain workloads especially those with high read, write, or list operations.
>
> However, GPv2 also unlocks modern features such as [access tiers](../blobs/access-tiers-overview.md) and expanded redundancy options, which can reduce **per-GB storage costs** and improve **performance, scalability, and manageability**.
>
> Be aware that **transaction pricing differs** in GPv2. Workloads with frequent operations may incur **higher charges** unless cost-optimization strategies are applied.


### Model your costs before upgrading
>[!TIP]
>If your workload is **write or list heavy**, reduce transaction counts by batching operations, writing larger blocks, and scoping list operations. GPv2 also provides better tools for optimizing costs, but allowing the tiering of data. Ensure cold data isn't left in the hot tier.

1. Capture a baseline of monthly operations by type (**read, write, list/metadata**) and any **egress**.
1. Use the [Azure Pricing Page](https://azure.microsoft.com/pricing/details/storage/blobs/) page to compare **per-GB** and **per-operation** rates for your region, redundancy (LRS/ZRS/GRS/GZRS), and intended access tier (hot/cool/cold/archive).
1. Map data to the right tiers and include **early-deletion** minimums for cool/cold/archive.
1. Plan [lifecycle policies](../blobs/lifecycle-management-overview.md) (for example, move from hot → cool after 30 days of no access, then archive later) and factor in their transaction effects.
1. Compare your current GPv1 bill to the modeled GPv2 bill (with tiers and lifecycle rules).



### Upgrade facts
- The upgrade is **in-place** and requires **no downtime**; it changes the account kind in Azure Resource Manager.
- Upgrading to GPv2 is **permanent**.
- Set your **default access tier** (hot or cool) during the upgrade to avoid unintended charges. For details, see [storage-account-upgrade](storage-account-upgrade.md).
- The upgrade is **non-disruptive**; your data and endpoints remain the same.

## How should I prepare?
>[!TIP]
>Most workloads can migrate from GPv1 to GPv2 without code changes.

To minimize risk and ensure a smooth migration:

- **Inventory your accounts**: Use [Azure Resource Graph](../../governance/resource-graph/overview.md), CLI, [Azure Inventory](../blobs/blob-inventory-how-to.md), or the Portal to identify all GPv1 accounts.
- **Evaluate workloads**: Review applications using GPv1 and verify compatibility with GPv2.
- **Plan for pricing changes**: Understand the new GPv2 pricing model, which includes per-blob tiering and transaction costs. Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your usage patterns.
- **Upgrade accounts**: Use the Azure portal, CLI, or automation tools to upgrade from GPv1 to GPv2. [Learn more about the upgrade process](storage-account-upgrade.md).
- **Validate behavior**: Confirm that workloads continue functioning and that billing reflects expected changes post-upgrade.
- **Monitor usage**: After migration, keep an eye on your storage account metrics to identify any unexpected changes in usage patterns or costs.

## Azure Resource Graph - Example Query 

Azure Resource Graph is a powerful tool that allows you to explore and query your Azure resources at scale. You can use it to identify all GPv1 storage accounts in your environment and assess their configurations. This can help you plan your migration to GPv2 more effectively.

Here is an example query to find all GPv1 storage accounts:

```
Resources
| where type == "microsoft.storage/storageaccounts"
| where sku.name in~ ("Standard_LRS", "Standard_GRS", "Standard_ZRS", "Standard_RAGRS", "Standard_RAGZRS")
| where kind != "StorageV2"
| extend Version = tostring(properties.siteProperties.propertiesid)
| project name, type, tenantId, kind, location, resourceGroup, subscriptionId, managedBy, sku, plan, properties, tags, identity, zones, extendedLocation, Version

```

## What happens if I don't migrate my accounts?
>[!Warning]
>If you do not migrate your GPv1 storage account to GPv2 by August 31, 2025, all existing GPv1 accounts will be auto migrated over to a GPv2 account, which may result in higher billing costs. Your decision not to migrate an existing GPv1 account will be construed as consent for Microsoft to migrate the account on your behalf.

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