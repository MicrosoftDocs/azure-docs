---
title: GPv1 storage account retirement overview
titleSuffix: Azure Storage
description: Learn what the retirement of Azure GPv1 storage accounts means and how to prepare for a smooth migration to GPv2.
Services: storage
author: gtrossell

ms.service: azure-storage
ms.topic: how-to
ms.date: 07/22/2025
ms.author: akashdubey
ms.subservice: storage-common-concepts
ms.custom: devx-track-arm-template

#CustomerIntent: As a storage admin, I want to understand the GPv1 retirement so that I can prepare for a smooth migration to GPv2.
---

# General-purpose v1 (GPv1) storage account retirement overview

Azure Storage is retiring the General-purpose v1 (GPv1) storage account type. This article explains why the change is occurring, what it means for your workloads, and how to prepare for the transition to General-purpose v2 (GPv2) accounts.

## Why is GPv1 being retired?

GPv1 was introduced to support early Azure storage scenarios across blobs, tables, queues, and files. However, GPv2 has since become the default standard for storage accounts, offering broader feature support, improved consistency, and better performance.

By retiring GPv1, Azure can simplify the platform, eliminate legacy metering inconsistencies, and ensure all customers benefit from modern capabilities and pricing models.

## What is changing?

Retirement of GPv1 storage accounts means:

- New GPv1 account creation will be disabled after a specified date.
- Existing GPv1 accounts must be upgraded to GPv2 before the retirement deadline.
- GPv1 account types will be fully decommissioned, and data access will be blocked after the retirement date.

The retirement will take effect globally across all Azure regions.

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

## Plan for pricing changes when upgrading GPv1 → GPv2

Upgrading from GPv1 to GPv2 enables modern features such as [accesss/access-tiers-overview.md, ../blobs/lifecycle-management-overview.md, and broader redundancy options. These features can reduce **storage per-GB** costs, but **transaction pricing differs** on GPv2. Workloads with high read, write, or list activity may see **higher operations charges** unless cost-optimization features are used.

### Model your costs before upgrading
1. Capture a baseline of monthly operations by type (**read, write, list/metadata**) and any **egress**.
1. Use the [Azure Pricing Page](../blobs/pricing.md) page to compare **per-GB** and **per-operation** rates for your region, redundancy (LRS/ZRS/GRS/GZRS), and intended access tier (hot/cool/cold/archive).
1. Map data to the right tiers and include **early-deletion** minimums for cool/cold/archive.
1. Plan [lifecycle policies](../blobs/lifecycle.md) (for example, move from hot → cool after 30 days of no access, then archive later) and factor in their transaction effects.
1. Compare your current GPv1 bill to the modeled GPv2 bill (with tiers and lifecycle rules).

>[!TIP]
>If your workload is **write- or list-heavy**, reduce transaction counts by batching operations, writing larger blocks, and scoping list operations. Ensure cold data is not left in the hot tier.

### Upgrade facts
- The upgrade is **in-place** and requires **no downtime**; it changes the account kind in Azure Resource Manager.
- Upgrading to GPv2 is **permanent**.
- Set your **default access tier** (hot or cool) during the upgrade to avoid unintended charges. For details, see [storage-account-upgrade.md](../blobs/storage-account-upgrade.md).
- The upgrade is **non-disruptive**; your data and endpoints remain the same.

## How should I prepare?

To minimize risk and ensure a smooth migration:

- **Inventory your accounts**: Use Azure Resource Graph, CLI, or the Portal to identify all GPv1 accounts.
- **Evaluate workloads**: Review applications using GPv1 and verify compatibility with GPv2.
- **Upgrade accounts**: Use the Azure Portal, CLI, or automation tools to upgrade from GPv1 to GPv2.
- **Validate behavior**: Confirm that workloads continue functioning and that billing reflects expected changes post-upgrade.

>[!TIP]
>Most workloads can migrate from GPv1 to GPv2 without code changes.

## Timeline and milestones

| Date | Milestone |
|------|-----------|
| September 2025 | GPv1 retirement announced |
| August 2025 | Creation of new GPv1 accounts disabled |
| September 2026 | Full retirement; GPv1 accounts decommissioned |

## What happens if I don't migrate my accounts?
 Starting on September 1, 2025, customers will no longer be able to manage GPv1  storage accounts. Any data still contained in these accounts will be preserved.

 If your applications are using GPv1 storage accounts, you must migrate to GPv2 before the retirement date to avoid service disruption.

>[!Warning]
>If you do not migrate your GPv1 storage account to GPv2 by August 31, 2025, you will no longer be able to use the GPv1 storage account. After this date, you will not be able to access data stored in GPv1 accounts, and any applications relying on these accounts will fail.

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



## Related content

Learn more about related features and how to migrate:

- [Upgrade a storage account to GPv2](storage-account-upgrade.md)
- [Storage account overview](storage-account-overview.md)
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/)