---
title: Understand egress insights in Azure Storage Discovery
titleSuffix: Azure Storage Discovery
description: Learn how to use Azure Storage Discovery to gain visibility into egress patterns across your Azure Blob Storage estate.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: conceptual
ms.date: 03/20/2026
ms.author: pthippeswamy
---

# Understand egress insights in Azure Storage Discovery

Understanding the data egress - the transfer of data out of your storage accounts - can reveal cost and safety insights. Understanding where egress occurs, how it trends over time, and which storage accounts contribute the most helps you make informed decisions about cost optimization and architecture improvements.

Azure Storage Discovery surfaces egress insights as part of the **Activity** report in your Discovery workspace. These insights give you enterprise-wide visibility into egress patterns without requiring custom queries, log analytics, or additional tooling.

> [!NOTE]
> Egress insights are available only with the **Standard** pricing plan. The Free plan doesn't include Activity insights. See [Azure Storage Discovery pricing](pricing.md) for details on available plans.

## Where to find egress insights

Egress insights are available in the **Activity** report of your Storage Discovery workspace.

1. Open the [Azure portal](https://portal.azure.com) and navigate to your **Storage Discovery workspace** resource.
2. In the left menu, select **Reports**.
3. Select the **Activity** report.
4. Use the metric picker to focus on **Egress** to view egress-specific data across your storage estate.

The Activity report organizes egress data using the same consistent structure as other Storage Discovery reports - overview tiles, trends charts, and top items - making it easy to explore patterns and drill down into details.

## Egress overview tiles

At the top of the Activity report, overview tiles show aggregate metrics for your selected [scope](management-components.md#scope). When you focus on egress, the overview tiles display the total egress volume and total billable egress volume across all storage accounts in the scope, giving you a quick snapshot of the outbound data transfers from your storage estate.

## Egress trends

The **Trends** chart in the Activity report shows how egress volume changes over time:

- **Identify spikes**: Spot sudden increases in egress that might indicate unexpected data transfers or workload changes.
- **Track patterns**: Observe recurring egress patterns tied to business cycles, batch processing, or scheduled data pipelines.
- **Monitor optimization efforts**: After making changes like moving workloads closer to data or adjusting caching, you can track how your actions change egress over time.

You can group egress trends by dimensions such as:

- **Region**: See which Azure regions generate the most outbound data transfers.
- **Performance type**: Compare egress between Standard and Premium storage accounts.
- **Redundancy type**: Understand egress across different redundancy configurations (LRS, GRS, ZRS, and others).

## Top 10 egress details

The **Top 10 egress details** chart provides a ranked list of the storage accounts with the highest egress in your selected scope. Each row in the chart displays:

| Column              | Description                                                                                           |
|---------------------|-------------------------------------------------------------------------------------------------------|
| **Storage resources** | The name of the storage account, linked directly to the resource in the Azure portal.               |
| **Billable egress** | The total billable egress volume for the storage account.                                             |
| **Trend**           | A sparkline showing the egress trend, along with the percentage change over the selected time range.          |
| **Subscription**    | The Azure subscription the storage account belongs to.                                                |
| **Resource group**  | The resource group containing the storage account.                                                    |
| **Egress details**  | A **More details** link that opens a detailed egress breakdown for the storage account.               |

Use the **By** dropdown to switch between metrics such as **Billable egress**, and use the **In** dropdown to filter the list to a specific Azure region.

:::image source="media/insights/egress/top-10-egress.jpg" alt-text="Screenshot of top 10 egress details."  lightbox="media/insights/egress/top-10-egress.jpg":::

## Egress details for a storage account

Selecting **More details** on any storage account in the Top 10 egress details chart opens the **Egress details** panel. This panel provides a breakdown of where data from that storage account is being transferred, helping you understand the destinations and cost implications of outbound traffic.

The panel displays the following summary information:

| Field                    | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Total egress**         | The total volume of data transferred out of the storage account.            |
| **Total billable egress**| The portion of egress that incurs charges.                                  |
| **Source region**        | The Azure region where the storage account is located.                      |

### Billable egress by destination

Below the summary, the panel breaks down billable egress by destination category.

The breakdown follows the same pattern as shown in [Bandwidth pricing](https://azure.microsoft.com/pricing/details/bandwidth/) is organized into the following categories:

- **Inter-region - Billable egress**: Data transferred to other Azure regions. This category is further broken down by geography (for example, Asia Pacific, Europe, Middle East, United States).
- **External - Billable egress**: Data transferred out of Azure entirely, shown as **Leaving Azure**.

This destination-level breakdown helps you:

- **Identify costly cross-region transfers**: See exactly which regions and geographies receive the most data from a storage account.
- **Spot external egress**: Understand how much data leaves Azure, which typically carries the highest egress charges.
- **Target optimization efforts**: Focus on the largest destination categories first when planning architecture changes to reduce egress costs.

:::image source="media/insights/egress/egress-breakdown.png" alt-text="Screenshot of egress details."  lightbox="media/insights/egress/egress-breakdown.png":::

## Navigate from egress charts to individual resources

Like all Storage Discovery charts, egress visualizations support the **View Resources** action. Select this option on any chart to see the list of storage accounts behind the data. From the resource list, you can:

- Navigate directly to an individual storage account to review its configuration or make changes.
- Export the resource list as a `.csv` file for use in scripts, automation, or bulk operations.

## Common scenarios for egress insights

### Identify unexpected egress costs

Review the egress trends chart to spot unexpected spikes. Combine with the Top items view to identify which storage accounts are responsible. Use filters to narrow down by region or subscription for faster root cause analysis.

### Optimize cross-region data transfers

Use the region grouping on the trends chart to understand which regions have the highest egress. Consider colocating compute resources with high-egress storage accounts to reduce cross-region data transfer costs.

### Monitor egress by department or workload (based on 'Scope')

If you configured [scopes](management-components.md#scope) based on ARM resource tags for departments or workloads, switch between scopes to compare egress across organizational units. This helps allocate data transfer costs and identify teams that might benefit from optimizations.

### Track egress over time after optimization

After implementing changes to reduce egress - such as enabling CDN caching, moving compute resources, or adjusting data pipeline architectures - use the trends chart to verify that egress volumes decrease as expected.

## Next steps

- [Understand the common structure of Storage Discovery reports](get-started-reports.md)  
- [Understand Azure Storage Discovery pricing](pricing.md)
- [Frequently asked questions](frequently-asked-questions.md)