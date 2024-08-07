---
title: Reduce costs for Microsoft Sentinel
description: Learn how to reduce costs for Microsoft Sentinel by using different methods in the Azure portal.
author: cwatson-cat
ms.author: cwatson
ms.custom: subject-cost-optimization
ms.topic: conceptual
ms.date: 03/07/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Reduce costs for Microsoft Sentinel

Costs for Microsoft Sentinel are only a portion of the monthly costs in your Azure bill. Although this article explains how to reduce costs for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Set or change pricing tier
To optimize for highest savings, monitor your ingestion volume to ensure you have the Commitment Tier that aligns most closely with your ingestion volume patterns. Consider increasing or decreasing your Commitment Tier to align with changing data volumes.

You can increase your Commitment Tier anytime, which restarts the 31-day commitment period. However, to move back to Pay-As-You-Go or to a lower Commitment Tier, you must wait until after the 31-day commitment period finishes. Billing for Commitment Tiers is on a daily basis.

To see your current Microsoft Sentinel pricing tier, select **Settings** in the Microsoft Sentinel left navigation, and then select the **Pricing** tab. Your current pricing tier is marked **Current tier**.

To change your pricing tier commitment, select one of the other tiers on the pricing page, and then select **Apply**. You must have **Contributor** or **Owner** for the Microsoft Sentinel workspace to change the pricing tier.

:::image type="content" source="media/billing-reduce-costs/simplified-pricing-tier.png" alt-text="Screenshot of pricing page in Microsoft Sentinel settings, with Pay-As-You-Go selected as current pricing tier." lightbox="media/billing-reduce-costs/simplified-pricing-tier.png":::

To learn more about how to monitor your costs, see [Manage and monitor costs for Microsoft Sentinel](billing-monitor-costs.md).

For workspaces still using classic pricing tiers, the Microsoft Sentinel pricing tiers don't include Log Analytics charges. For more information, see [Simplified pricing tiers](billing.md#simplified-pricing-tiers).

## Separate non-security data in a different workspace

Microsoft Sentinel analyzes all the data ingested into Microsoft Sentinel-enabled Log Analytics workspaces. It's best to have a separate workspace for non-security operations data, to ensure it doesn't incur Microsoft Sentinel costs.

When hunting or investigating threats in Microsoft Sentinel, you might need to access operational data stored in these standalone Azure Log Analytics workspaces. You can access this data by using cross-workspace querying in the log exploration experience and workbooks. However, you can't use cross-workspace analytics rules and hunting queries unless Microsoft Sentinel is enabled on all the workspaces.

## Select low-cost log types for high-volume, low-value data

While standard analytics logs are most appropriate for continuous, real-time threat detection, two other log types&mdash;[basic logs and auxiliary logs](../azure-monitor/logs/basic-logs-configure.md)&mdash;are more suited for ad-hoc querying and search of verbose, high-volume, low-value logs that aren't frequently needed or accessed on demand. Enable basic log data ingestion at a significantly reduced cost, or auxiliary log data ingestion (now in Preview) at an even lower cost, for eligible data tables. For more information, see [Microsoft Sentinel Pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).

- [Log retention plans in Microsoft Sentinel](log-plans.md)
- [Log sources to use for Auxiliary Logs ingestion](basic-logs-use-cases.md)

## Optimize Log Analytics costs with dedicated clusters

If you ingest at least 500 GB into your Microsoft Sentinel workspace or workspaces in the same region, consider moving to a Log Analytics dedicated cluster to decrease costs. A Log Analytics dedicated cluster Commitment Tier aggregates data volume across workspaces that collectively ingest a total of 500 GB or more. For more information, see [Simplified pricing tier for dedicated cluster](enroll-simplified-pricing-tier.md#simplified-pricing-tiers-for-dedicated-clusters).

You can add multiple Microsoft Sentinel workspaces to a Log Analytics dedicated cluster. There are a couple of advantages to using a Log Analytics dedicated cluster for Microsoft Sentinel:

- Cross-workspace queries run faster if all the workspaces involved in the query are in the dedicated cluster. It's still best to have as few workspaces as possible in your environment, and a dedicated cluster still retains the [100 workspace limit](../azure-monitor/logs/cross-workspace-query.md) for inclusion in a single cross-workspace query.

- All workspaces in the dedicated cluster can share the Log Analytics Commitment Tier set on the cluster. Not having to commit to separate Log Analytics Commitment Tiers for each workspace can allow for cost savings and efficiencies. By enabling a dedicated cluster, you commit to a minimum Log Analytics Commitment Tier of 500-GB ingestion per day.

Here are some other considerations for moving to a dedicated cluster for cost optimization:

- The maximum number of clusters per region and subscription is two.
- All workspaces linked to a cluster must be in the same region.
- The maximum of workspaces linked to a cluster is 1000.
- You can unlink a linked workspace from your cluster. The number of link operations on a particular workspace is limited to two in a period of 30 days.
- You can't move an existing workspace to a customer managed key (CMK) cluster. You must create the workspace in the cluster.
- Moving a cluster to another resource group or subscription isn't currently supported.
- A workspace link to a cluster fails if the workspace is linked to another cluster.

For more information about dedicated clusters, see [Log Analytics dedicated clusters](../azure-monitor/logs/cost-logs.md#dedicated-clusters).

## Reduce data retention costs with long-term retention

Microsoft Sentinel retains data by default in interactive form for the first 90 days. To adjust the data retention period in Log Analytics, select **Usage and estimated costs** in the left navigation, then select **Data retention**, and then adjust the slider.

Microsoft Sentinel security data might lose some of its value after a few months. Security operations center (SOC) users might not need to access older data as frequently as newer data, but still might need to access the data for sporadic investigations or audit purposes.

To help you reduce Microsoft Sentinel data retention costs, Azure Monitor now offers long-term retention. Data that ages out of its interactive retention state can still be retained for up to twelve years, at a much-reduced cost, and with limitations on its usage. For more information, see [Manage data retention in a Log Analytics workspace](../azure-monitor/logs/data-retention-configure.md).

You can reduce costs even further by enrolling tables that contain secondary security data in the **Auxiliary logs** plan (now in Preview). This plan allows you to store high-volume, low-value logs at a low price, with a lower-cost 30-day interactive retention period at the beginning to allow for summarization and basic querying. To learn more about the Auxiliary logs plan and other plans, see [Log retention plans in Microsoft Sentinel](log-plans.md). While the auxiliary logs plan remains in Preview, you also have the option of enrolling these tables in the **Basic logs** plan. Basic logs offers similar functionality to auxiliary logs, but with less of a cost savings.

## Use data collection rules for your Windows Security Events

The [Windows Security Events connector](connect-windows-security-events.md?tabs=LAA) enables you to stream security events from any computer running Windows Server that's connected to your Microsoft Sentinel workspace, including physical, virtual, or on-premises servers, or in any cloud. This connector includes support for the Azure Monitor agent, which uses data collection rules to define the data to collect from each agent.

Data collection rules enable you to manage collection settings at scale, while still allowing unique, scoped configurations for subsets of machines. For more information, see [Configure data collection for the Azure Monitor agent](../azure-monitor/agents/azure-monitor-agent-data-collection.md).

Besides for the predefined sets of events that you can select to ingest, such as All events, Minimal, or Common, data collection rules enable you to build custom filters and select specific events to ingest. The Azure Monitor Agent uses these rules to filter the data at the source, and then ingest only the events you selected, while leaving everything else behind. Selecting specific events to ingest can help you optimize your costs and save more.

## Next steps

- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](../azure-monitor/best-practices-cost.md).
