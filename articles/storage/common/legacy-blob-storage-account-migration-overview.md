---
title: Legacy Blob Storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure legacy blob storage accounts means and how to prepare for a smooth migration to GPv2.
Services: storage
author: gtrossell-eng
ms.service: azure-storage
ms.topic: how-to
ms.date: 12/15/2025
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template
#CustomerIntent: As a storage admin, I want to understand the legacy blob storage retirement so that I can prepare for a smooth migration to GPv2.
---

# Overview of legacy blob storage account retirement
Azure Storage is retiring the **legacy blob storage account** storage account type. This article explains what this change means for your legacy blob storage workloads and how to prepare for the transition to **general-purpose v2 (GPv2)** storage accounts.

## Why legacy blob storage accounts are being retired
Legacy blob storage accounts were introduced to support legacy blob storage scenarios with account-level access tiering. However, **GPv2** has since become the standard for all new storage accounts, offering:
- **Per-blob tiering** (Hot, Cool, Archive)
- **Lifecycle management**
- **Immutable blob storage**
- **Event Grid integration**
- **Advanced redundancy options**
- **Support for all storage services** (Blobs, Tables, Queues, Files)

By retiring legacy blob storage accounts, Azure simplifies the platform and ensures all customers benefit from modern capabilities and consistent pricing.

## Benefits of migrating to GPv2
| Feature                          | Legacy blob storage | GPv2           |
|----------------------------------|------------------|----------------|
| Blob tiering                     | ✅ Account-level | ✅ Per-blob     |
| Lifecycle management             | ❌               | ✅              |
| Immutable blob storage           | ✅               | ✅              |
| Event Grid integration           | ✅               | ✅              |
| Support for other services       | ❌               | ✅              |
| Redundancy options (ZRS, GRS, RA-GRS) | ✅         | ✅              |
| Consistent pricing meters        | ❌               | ✅              |

>[!NOTE] 
>GPv2 supports all blob features available in legacy blob storage accounts.

## Retirement timeline and key milestones

>[!Warning]
>If you do not migrate your legacy blob storage account to GPv2 by October, 2026, all existing legacy blob storage accounts will be auto migrated over to a GPv2 account, which may result in higher billing costs. Your decision not to migrate an existing legacy blob storage account will be construed as consent for Microsoft to migrate the account on your behalf.

| Date           | Milestone                                      |
|----------------|------------------------------------------------|
| **September 2025** | Retirement announced                          |
| **March 3 2026**    | Creation of new legacy blob storage accounts disabled                         |
| **October 2026** | Full retirement; Any remaining legacy blob storage accounts automigrated to GPv2. Your decision not to migrate an existing legacy blob storage account will be construed as consent for Microsoft to migrate the account on your behalf. |

After the retirement date, **data access will be blocked** for all legacy blob storage accounts. This change takes effect globally across all Azure regions.

## Preparing for migration
>[!Tip]
>Most blob-only workloads can migrate from legacy blob storage to GPv2 without code changes. Review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features.
>GPv2 enables per-blob tiering and lifecycle rules, offering better cost optimization and automation.

To minimize risk and ensure a smooth migration:

- **Inventory your legacy blob storage accounts**: Use [Azure Resource Graph](../../governance/resource-graph/overview.md), CLI, [Azure Inventory](../blobs/blob-inventory-how-to.md), or the Portal to identify all legacy blob storage accounts.
- **Evaluate workloads**: To ensure compatibility with GPv2 (most blob-only workloads require no code changes).
- **Plan for pricing changes**: Understand the new GPv2 pricing model, which includes per-blob tiering and transaction costs. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your usage patterns.
- **Migrate to GPv2**: Use the Azure portal, CLI, or automation tools to upgrade from GPv1 to GPv2. [Learn more about the upgrade process](storage-account-upgrade.md).
- **Validate workloads**: Post-migration to ensure functionality and billing accuracy.
- **Monitor usage**: After migration, keep an eye on your storage account metrics to identify any unexpected changes in usage patterns or costs.


## Identify legacy blob storage accounts using Azure Resource Graph

Azure Resource Graph is a powerful tool for exploring and querying your Azure resources at scale. You can use it to identify all legacy Blob storage and General Purpose v1 (GPv1) accounts in your environment and assess their configurations. This helps you plan your migration to GPv2 more effectively.

Here’s an example Azure Resource Graph query to identify all legacy Blob storage accounts (kind `BlobStorage`) and General Purpose v1 (GPv1) storage accounts (kind `Storage`) within your subscription that are impacted by the retirement:

```
resources
| where type == "microsoft.storage/storageaccounts"
| where sku.name in~ ("Standard_LRS", "Standard_GRS", "Standard_ZRS", "Standard_RAGRS", "Standard_RAGZRS")
| where kind != "StorageV2"
| extend Version = tostring(properties.siteProperties.propertiesid)
| project name, type, tenantId, kind, location, resourceGroup, subscriptionId, managedBy, sku, plan, properties, tags, identity, zones, extendedLocation, Version

```
>[!NOTE] 
>This query identifies both legacy blob storage accounts (kind `BlobStorage`) and GPv1 accounts (kind `Storage`) regardless of redundancy, which are also being retired. Review both account types to ensure all impacted accounts are included in your migration plan.

## Special Cases: Databricks DBFS Accounts

If you see a storage account that is part of a **Databricks-managed resource group** in your subscription, **no action is required**. These accounts are read-only for you and are used by Databricks for workspace operations. Microsoft will migrate these DBFS accounts to **GPv2 automatically** ahead of the October 13, 2026 retirement.

### How to identify DBFS accounts
- Most DBFS accounts start with the prefix `dbstorage`.  
Examples:  
   - `dbstoragezeoppf6waviqm`
   -`dbstorageb3qvu2dqsbsrg`
   - `dbstorageolaatsgryngy6`

- These accounts are typically found under resource groups named like:
   - `databricks-rg---`

> [!IMPORTANT]
> Although dbstorage* is a common naming pattern, it’s not a reserved name, so exceptions may exist.
To confirm reliably:
> - The account is in a **Databricks Managed Resource Group**.
> - You have **read-only permissions** (cannot modify or delete the account).

### What about other accounts?
All other storage accounts including any **general-purpose v1 (GPv1)** or **legacy blob storage accounts** that you manage for your workloads must be migrated to general-purpose v2 (GPv2) by following the instructions provided earlier in this article.

## What happens if you don’t migrate by the deadline
After **October 13 2026**, if you don't migrate your legacy blob storage account to general-purpose v2, all existing legacy blob storage accounts are auto migrated over to a general-purpose v2 account, which may result in higher billing costs. Your decision not to migrate an existing legacy blob storage account will be construed as consent for Microsoft to migrate the account on your behalf.

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
- [Azure storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)
