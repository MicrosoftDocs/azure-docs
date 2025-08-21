---
title: Blob Only storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure Blob Only storage accounts means and how to prepare for a smooth migration to GPv2.
Services: storage
author: gtrossell
ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: padmalathas
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#CustomerIntent: As a storage admin, I want to understand the Blob-Only retirement so that I can prepare for a smooth migration to GPv2.
---

# Blob-Only storage account retirement overview
Azure Storage is retiring the **Blob-Only** storage account type. This article explains what this change means for your blob-only workloads and how to prepare for the transition to **General-purpose v2 (GPv2)** storage accounts.

## Why is Blob-Only being retired?
Blob-Only accounts were introduced to support blob-only scenarios with account-level access tiering. However, **GPv2** has since become the standard for all new storage accounts, offering:
- **Per-blob tiering** (Hot, Cool, Archive)
- **Lifecycle management**
- **Immutable blob storage**
- **Event Grid integration**
- **Advanced redundancy options**
- **Support for all storage services** (blobs, tables, queues, files)

By retiring Blob-Only accounts, Azure simplifies the platform and ensures all customers benefit from modern capabilities and consistent pricing.

## Why migrate to GPv2?
| Feature                          | Blob-Only     | GPv2           |
|----------------------------------|------------------|----------------|
| Blob tiering                     | ✅ Account-level | ✅ Per-blob     |
| Lifecycle management             | ❌               | ✅              |
| Immutable blob storage           | ✅               | ✅              |
| Event Grid integration           | ✅               | ✅              |
| Support for other services       | ❌               | ✅              |
| Redundancy options (ZRS, GRS, RA-GRS) | ✅         | ✅              |
| Consistent pricing meters        | ❌               | ✅              |

**Note**  
GPv2 supports all blob features available in BlobStorage accounts—and more—while enabling finer control and broader service integration.

## Timeline and milestones

>[!Warning]
>If you do not migrate your Blob-Only storage account to GPv2 by August 31, 2025, all existing Blob-Only accounts will be auto migrated over to a GPv2 account, which may result in higher billing costs. Your decision not to migrate an existing Blob-Only account will be construed as consent for Microsoft to migrate the account on your behalf.

| Date           | Milestone                                      |
|----------------|------------------------------------------------|
| September 2025 | Retirement announced                          |
| August 2026    | Creation of new Blob-Only accounts disabled                         |
| September 2026 | Full retirement; Any remaining Blob-Only Storage accounts automigrated to GPv2. Your decision not to migrate an existing Blob-Only account will be construed as consent for Microsoft to migrate the account on your behalf. |

After the retirement date, **data access will be blocked** for all Blob-Only accounts. This change takes effect globally across all Azure regions.

## How should I prepare?
>[!Tip]
>Most blob-only workloads can migrate from Blob-Only Storage to GPv2 without code changes. Review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features.
>GPv2 enables per-blob tiering and lifecycle rules, offering better cost optimization and automation.

To minimize risk and ensure a smooth migration:

- **Inventory your Blob-Only Storage accounts**: Use [Azure Resource Graph](../../governance/resource-graph/overview.md), CLI, [Azure Inventory](../blobs/blob-inventory-how-to.md), or the Portal to identify all Blob-only storage accounts.
- **Evaluate workloads**: To ensure compatibility with GPv2 (most blob-only workloads require no code changes).
- **Plan for pricing changes**: Understand the new GPv2 pricing model, which includes per-blob tiering and transaction costs. Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your usage patterns.
- **Migrate to GPv2**: Use the Azure portal, CLI, or automation tools to upgrade from GPv1 to GPv2. [Learn more about the upgrade process](storage-account-upgrade.md).
- **Validate workloads**: Post-migration to ensure functionality and billing accuracy.
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

## What happens if I don’t migrate my accounts?
After **August 31, 2026**, you'll no longer be able to manage Blob-Only Storage accounts. After **September 2026**, if you don't migrate your Blob-Only storage account to General-purpose v2, all existing Blob-Only accounts are auto migrated over to a General-purpose v2 account, which may result in higher billing costs. Your decision not to migrate an existing Blob-Only account will be construed as consent for Microsoft to migrate the account on your behalf.

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
