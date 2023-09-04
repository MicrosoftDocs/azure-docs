---
title: Migrate from Defender for Storage (classic)
description: Learn about how to migrate from Defender for Storage (classic) to the new Defender for Storage plan to take advantage of its enhanced capabilities and pricing.
ms.date: 07/31/2023
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
---

# Migrate from Defender for Storage (classic) to the new plan

The new Defender for Storage plan was launched on March 28, 2023. If you're currently using Microsoft Defender for Storage (classic) with the per-transaction or the per-storage account pricing plan, consider upgrading to the new [Defender for Storage](defender-for-storage-introduction.md) plan, which offers several new benefits that aren't included in the classic plan. 

## Why move to the new plan?

The new plan includes advanced security capabilities to help protect against malicious file uploads, sensitive data exfiltration, and data corruption. 

The new plan also provides a more predictable and flexible pricing structure for better control over coverage and costs.

The new pricing plan charges based on the number of storage accounts you protect, which simplifies cost calculations and allows for easy scaling as your needs change. You can enable it at the subscription or resource level and can also exclude specific storage accounts from protected subscriptions, providing more granular control over your security coverage. Extra charges may apply to storage accounts with high-volume transactions that exceed a high monthly threshold.

## Deprecation of Defender for Storage (classic)

The classic plan will be deprecated in the future, and the deprecation will be announced three years in advance. All future capabilities will only be added to the new plan.

> [!NOTE]
> If you already have the legacy Defender for Storage (classic) enabled and want to access the new security features and pricing, you'll need to proactively migrate to the new plan. You can migrate to the new plan with one-click through the Azure Portal or use Azure Policy and IaC tools.

## Migration scenarios

Migrating from the classic Defender for Storage plan to the new Defender for Storage plan is a straightforward process, and there are several ways to do it. You'll need to proactively [enable the new plan](/azure/defender-for-cloud/tutorial-enable-storage-plan) to access its enhanced capabilities and pricing.

>[!NOTE]
> To enable the new plan, make sure to disable the old Defender for Storage policies. Look for and disable policies named "Configure Azure Defender for Storage to be enabled", "Azure Defender for Storage should be enabled", or "Configure Microsoft Defender for Storage to be enabled (per-storage account plan)".

### Migrating from the classic Defender for Storage plan enabled with per-transaction pricing

If the classic Defender for Storage plan is enabled with per-transaction pricing, you can switch to the new plan at either the subscription or resource level. You can also [exclude specific storage accounts](/azure/defender-for-cloud/advanced-configurations-for-malware-scanning) from protected subscriptions.

Storage accounts that were previously excluded from protected subscriptions in the per-transaction plan will not remain excluded when you switch to the new plan. However, the exclusion tags will remain on the resource and can be removed. In most cases, storage accounts that were previously excluded from protected subscriptions will benefit the most from the new pricing plan. 

### Migrating from the classic Defender for Storage plan enabled with per-storage account pricing

If the classic Defender for Storage plan is enabled with per-storage account pricing, you can switch to the new plan at either the subscription or resource level. The new Defender for Storage plan has the same pricing plan with the exception of malware scanning which may incur extra charges and is billed per GB scanned.

You can learn more about Defender for Storage's pricing model on the [Defender for Cloud pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h).

 You can also [exclude specific storage accounts](/azure/defender-for-cloud/advanced-configurations-for-malware-scanning) from protected subscriptions.

## Identify active Microsoft Defender for Storage pricing plans on your subscriptions

If you're looking to quickly identify which pricing plans are active on your subscriptions, utilizing this [Coverage workbook](https://portal.azure.com/#blade/AppInsightsExtension/UsageNotebookBlade/ComponentId/Azure%20Security%20Center/ConfigurationId/community-Workbooks%2FAzure%20Security%20Center%2FCoverage/Type/workbook/WorkbookTemplateName/Coverage) based on [Azure Resource Graph (ARG) Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade) (with the ‘**securityresources**’ table) data is a great solution. This tool allows you to simplify and analyze your enablement status easily.

>[!NOTE]
>The Coverage workbook and ARG Explorer query only provide enablement status when Defender for Storage is enabled at the subscription level. For storage accounts with Defender for Storage enabled at the resource level, the enablement status can be found within the Defender for Cloud blade of the storage accounts in the Azure portal. Additionally, the enablement status can be queried with a PowerShell script.


## Plan comparison

To help you better understand the differences between the classic plan and the new plan, here's a comparison table:

| Category | New Defender for Storage plan | Classic (per-transaction plan) | Classic (per-storage account plan) |
| --- | --- | --- | --- |
| Pricing structure | Cost is based on the number of storage accounts you protect\*. Add-on costs for GB scanned for malware, if enabled| Cost is based on the number of transactions processed | Cost is based on the number of storage accounts you protect* |
| Enablement options | Subscription and resource level | Subscription and resource level | Subscription only |
| Exclusion of storage accounts from protected subscriptions | Yes | Yes | No |
| Activity monitoring (security alerts) | Yes | Yes | Yes |
| Malware scanning in uploaded Blobs | Yes (add-on) | No (only hash-reputation analysis) | No (only hash-reputation analysis) |
| Sensitive data threat detection | Yes (add-on) | No | No |
| Detection of leaked/compromised SAS tokens (entities without identities) | Yes | No | No |

\* extra charges may apply to storage accounts with high-volume transactions.

The new plan offers a more comprehensive feature set designed to better protect your data. It also provides a more predictable pricing plan compared to the classic plan. We recommend you migrate to the new plan to take full advantage of its benefits.

Learn more about how to [enable and configure Defender for Storage](/azure/defender-for-cloud/tutorial-enable-storage-plan).

## Next steps

In this article, you learned about migrating to the new Microsoft Defender for Storage plan.

> [!div class="nextstepaction"]
> [Enable Defender for Storage](enable-enhanced-security.md)



