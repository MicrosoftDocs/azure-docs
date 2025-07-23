---
title: GPv1 storage account retirement overview
description: Learn what the retirement of Azure GPv1 storage accounts means and how to prepare for the transition to GPv2.
author: gtrossell
ms.author: gtrossell
ms.service: storage
ms.topic: concept-article
ms.date: 07/22/2025

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

## How should I prepare?

To minimize risk and ensure a smooth migration:

- **Inventory your accounts**: Use Azure Resource Graph, CLI, or the Portal to identify all GPv1 accounts.
- **Evaluate workloads**: Review applications using GPv1 and verify compatibility with GPv2.
- **Upgrade accounts**: Use the Azure Portal, CLI, or automation tools to upgrade from GPv1 to GPv2.
- **Validate behavior**: Confirm that workloads continue functioning and that billing reflects expected changes post-upgrade.

> [!TIP]
> Most workloads can migrate from GPv1 to GPv2 without code changes.

## Timeline and milestones

| Date | Milestone |
|------|-----------|
| September 2025 | GPv1 retirement announced |
| September 2025 | Creation of new GPv1 accounts disabled |
| September 2026 | Full retirement; GPv1 accounts decommissioned |

## What happens if I don't migrate my accounts?
> Starting on September 1, 2025, customers will no longer be able to manage GPv1  storage accounts. Any data still contained in these accounts will be preserved.

> If your applications are using GPv1 storage accounts, you must migrate to GPv2 before the retirement date to avoid service disruption.

> [!Warning]
> If you do not migrate your GPv1 storage account to GPv2 by August 31, 2025, you will no longer be able to use the GPv1 storage account. After this date, you will not be able to access data stored in GPv1 accounts, and any applications relying on these accounts will fail.

## How to get help
> If you have questions, get answers from community experts in Microsoft Q&A.

> If your organization or company has partnered with Microsoft or works with Microsoft representatives, such as cloud solution architects (CSAs) or customer success account managers (CSAMs), contact them for additional resources for migration.

> If you have a support plan and you need technical help, create a support request in the Azure portal:

> * Search for Help + support in the Azure portal.
> * Select Create a support request.
> * For Summary, type a description of your issue.
> * For Issue type, select Technical.
> * For Subscription, select your subscription.
> * For Service, select My services.
> * For Service type, select Storage Account Management.
> * For Resource, select the resource you want to migrate.
> * For Problem type, select Data Migration.
> * For Problem subtype, select Migrate account to new resource group/subscription/region/tenant.
> * Select Next, then follow the instructions to submit your support request.

## GPv1 vs GPv2 FAQs
| Question | Answer |
|----------|--------|
| What is a GPv1 storage account? | A GPv1 account is the original “general-purpose” Azure Storage account type. It supports all four core storage services (Blobs, Files, Queues, Tables) and the classic redundancy SKUs (LRS, GRS, RA-GRS). It predates Blob tiering and many newer management features. |
| Can I still create a new GPv1 account? | From the retirement date onwards all new account creation will be blocked. |
| Which redundancy options are available on GPv2 accounts? | LRS, GRS, ZRS, RA-GZRS and RA-GRS are supported. |
| Does GPv1 support Hot, Cool, or Archive blob tiers or lifecycle management policies? | No. |
| How does pricing differ from GPv2? | GPv1 has lower transaction prices but slightly higher capacity prices than GPv2. For most workloads, GPv2 is cheaper overall once tiering and optimized capacity pricing are factored in. |
| Can I upgrade from GPv1 to GPv2 later? Will anything break? | You can switch to GPv2 with a one-click “Upgrade” in the portal or via CLI/PowerShell. The change is reversible during a short validation window and is non-disruptive—you keep the same endpoint names and data. |
| Which Azure Files and other new features won’t I get in GPv1? | Many recent innovations—SMB multichannel, NFS 3.0, premium file shares, Data Lake (HNS), point-in-time restore for blobs, and advanced Azure Files features—require GPv2 or newer account kinds. |
| What would my bill look like after the upgrade? How do I calculate the new billing amount? | Your bill will reflect GPv2 pricing, which differs slightly from GPv1. **Key differences:**<br>• GPv2 charges for both read/write operations<br>• Tier-based pricing applies (Hot, Cool, Cold, Archive)<br>• Redundancy flexibility<br>Use the Azure Pricing Calculator and your current invoice data to estimate the new costs. |
| Is the upgrade permanent? | Yes. Once a storage account is upgraded from GPv1 to GPv2, it cannot be reverted. The upgrade enables newer features and pricing structures. |
| I cannot upgrade by the retirement date. Can I get an exception? | No. Microsoft will not grant exceptions. All GPv1 accounts must be upgraded by the announced deadline to avoid disruption. |
| What happens if I haven’t upgraded by the retirement date? Will I lose access to my data? | Microsoft may automatically upgrade your account, but you risk access disruption and billing misalignment. Data will be preserved, but access could be temporarily impacted. |
| Will the upgrade require downtime? | No. The upgrade is non-disruptive and does not require downtime. You can access data and services continuously. |
| Will there be any data loss? | No. The upgrade process is safe and does not delete or move your data. All blobs, containers, and metadata remain intact. |
| Will my existing application continue to work seamlessly after the upgrade? | In most cases, yes. API endpoints remain unchanged. However, review any hardcoded pricing assumptions or tier-unaware logic to ensure compatibility with GPv2 features. |

## Related content

Learn more about related features and how to migrate:

- [Upgrade a storage account to GPv2](https://learn.microsoft.com/azure/storage/common/storage-account-upgrade)  
- [Storage account overview](https://learn.microsoft.com/azure/storage/common/storage-account-overview)  
- [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/)  
- [General Storage v1 (GPv1) account migration overview](https://learn.microsoft.com/azure/storage/common/gpv1-account-migrate)