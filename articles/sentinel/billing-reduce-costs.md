---
title: Reduce costs for Microsoft Sentinel
description: Learn how to reduce costs for Microsoft Sentinel by using different methods in the Azure portal.
author: austinmccollum
ms.author: austinmc
ms.custom: subject-cost-optimization
ms.topic: conceptual
ms.date: 06/14/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security


#Customer intent: As a cloud security administrator, I want to optimize the cost of using Microsoft Sentinel so that I can manage my organization's security operations within budget constraints.

---

# Reduce costs for Microsoft Sentinel

Costs for Microsoft Sentinel are only a portion of the monthly costs in your Azure bill. Although this article explains how to reduce costs for Microsoft Sentinel, you're billed for all Azure services and resources your Azure subscription uses, including Partner services.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Set or change pricing tier
To optimize for highest savings, monitor your ingestion volume to ensure you have the Commitment Tier that aligns most closely with your ingestion volume patterns. Consider increasing or decreasing your Commitment Tier to align with changing data volumes.

You can increase your Commitment Tier anytime, which restarts the 31-day commitment period. However, to move back to pay-as-you-go or to a lower Commitment Tier, you must wait until after the 31-day commitment period finishes. Billing for Commitment Tiers is on a daily basis.

To see your current Microsoft Sentinel pricing tier, select **Settings** in the Microsoft Sentinel left navigation, and then select the **Pricing** tab. Your current pricing tier is marked **Current tier**.

To change your pricing tier commitment, select one of the other tiers on the pricing page, and then select **Apply**. You must have **Contributor** or **Owner** for the Microsoft Sentinel workspace to change the pricing tier.

:::image type="content" source="media/billing-reduce-costs/simplified-pricing-tier.png" alt-text="Screenshot of pricing page in Microsoft Sentinel settings, with pay-as-you-go selected as current pricing tier." lightbox="media/billing-reduce-costs/simplified-pricing-tier.png":::

To learn more about how to monitor your costs, see [Manage and monitor costs for Microsoft Sentinel](billing-monitor-costs.md).

For workspaces still using classic pricing tiers, the Microsoft Sentinel pricing tiers don't include Log Analytics charges. For more information, see [Simplified pricing tiers](billing.md#simplified-pricing-tiers).

## Buy a pre-purchase plan

Save on your Microsoft Sentinel analytics tier costs when you pre-purchase Microsoft Sentinel commit units (CUs). Use the pre-purchased CUs at any time during the one year purchase term.

Any eligible Microsoft Sentinel costs deduct first from the pre-purchased CUs automatically. You don't need to redeploy or assign a pre-purchased plan to your Microsoft Sentinel workspaces for the CU usage to get the pre-purchase discounts.

For more information, see [Optimize Microsoft Sentinel costs with a pre-purchase plan](billing-pre-purchase-plan.md).

## Separate non-security data in a different workspace

Microsoft Sentinel analyzes all the data ingested into Microsoft Sentinel-enabled Log Analytics workspaces. It's best to have a separate workspace for non-security operations data, to ensure it doesn't incur Microsoft Sentinel costs.

## Use the Microsoft Sentinel data lake for secondary security data

While the Analytics tier is most appropriate for continuous, real-time threat detection, the Microsoft Sentinel data lake is well-suited for ad-hoc querying and search of secondary security data that isn't frequently needed or accessed on demand. Microsoft Sentinel data lake offers ingestion and storage at a significantly reduced cost. For more information, see [Microsoft Sentinel Pricing](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).

>[!NOTE]
>The Microsoft Sentinel data lake is currently in Public Preview.

## Optimize Log Analytics costs with dedicated clusters

If you ingest at least 100 GB into your Microsoft Sentinel workspace or workspaces in the same region, consider moving to a Log Analytics dedicated cluster to decrease costs. A Log Analytics dedicated cluster Commitment Tier aggregates data volume across workspaces that collectively ingest a total of 100 GB or more. For more information, see [Simplified pricing tier for dedicated cluster](enroll-simplified-pricing-tier.md#simplified-pricing-tiers-for-dedicated-clusters).

You can add multiple Microsoft Sentinel workspaces to a Log Analytics dedicated cluster. There are a couple of advantages to using a Log Analytics dedicated cluster for Microsoft Sentinel:

- Cross-workspace queries run faster if all the workspaces involved in the query are in the dedicated cluster. It's still best to have as few workspaces as possible in your environment, and a dedicated cluster still retains the [100 workspace limit](/azure/azure-monitor/logs/cross-workspace-query) for inclusion in a single cross-workspace query.

- All workspaces in the dedicated cluster can share the Log Analytics Commitment Tier set on the cluster. Not having to commit to separate Log Analytics Commitment Tiers for each workspace can allow for cost savings and efficiencies. By enabling a dedicated cluster, you commit to a minimum Log Analytics Commitment Tier of 100-GB ingestion per day.

Here are some other considerations for moving to a dedicated cluster for cost optimization:

- The maximum number of clusters per region and subscription is two.
- All workspaces linked to a cluster must be in the same region.
- The maximum of workspaces linked to a cluster is 1000.
- You can unlink a linked workspace from your cluster. The number of link operations on a particular workspace is limited to two in a period of 30 days.
- You can't move an existing workspace to a customer managed key (CMK) cluster. You must create the workspace in the cluster.
- Moving a cluster to another resource group or subscription isn't currently supported.
- A workspace link to a cluster fails if the workspace is linked to another cluster.

For more information about dedicated clusters, see [Log Analytics dedicated clusters](/azure/azure-monitor/logs/cost-logs#dedicated-clusters).

## Reduce data retention costs with total retention

Microsoft Sentinel retains Analytics tier data by default for the first 90 days in Analytics retention. As data ages, it loses its value for real-time analytics and investigation. Security operations center (SOC) users might not need to access older data as frequently as newer data, but still need to access the data for wider historical investigations or audit purposes. To help you reduce Microsoft Sentinel data retention costs, total retention is available. Data that ages out of its analytics retention state can still be retained, at a much-reduced cost, and access using Lake exploration capabilities. For more information, see [Lake exploration](graph/kql-overview.md).

Use **Data management > Tables** to adjust the Analytics and Total retention period.

## Use data collection rules for your Windows Security Events

The [Windows Security Events connector](connect-windows-security-events.md?tabs=LAA) enables you to stream security events from any computer running Windows Server that's connected to your Microsoft Sentinel workspace, including physical, virtual, or on-premises servers, or in any cloud. This connector includes support for the Azure Monitor Agent, which uses data collection rules to define the data to collect from each agent.

Data collection rules enable you to manage collection settings at scale, while still allowing unique, scoped configurations for subsets of machines. For more information, see [Configure data collection for the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-data-collection).

Besides for the predefined sets of events that you can select to ingest, such as All events, Minimal, or Common, data collection rules enable you to build custom filters and select specific events to ingest. The Azure Monitor Agent uses these rules to filter the data at the source, and then ingest only the events you selected, while leaving everything else behind. Selecting specific events to ingest can help you optimize your costs and save more.

## Next steps

- Learn [how to optimize your cloud investment with Microsoft Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- For more tips on reducing Log Analytics data volume, see [Azure Monitor best practices - Cost management](/azure/azure-monitor/best-practices-cost).
