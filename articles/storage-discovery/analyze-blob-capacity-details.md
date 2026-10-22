---
title: Analyze Blob capacity details
titleSuffix: Azure Storage Discovery
description: Learn how to analyze tiering, recency, retention, storage composition, and growth for Azure Blob Storage with advanced capacity insights.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: how-to
ms.date: 09/24/2026
ms.author: pthippeswamy
---

# Analyze Blob capacity details

Advanced capacity insights help you investigate how Blob Storage data is tiered, retained, distributed, and changing across your storage estate. Azure Storage Discovery presents these insights in the **Capacity details** report.

[!INCLUDE [advanced-capacity-insights-regional-availability](includes/advanced-capacity-insights-regional-availability.md)]

This article explains how to use the report to:

- Find data that might not be in the appropriate access tier.
- Understand how object sizes are distributed.
- Evaluate potential early-deletion exposure.
- Compare current data with versions, snapshots, and soft-deleted data.
- Identify resources that are large or changing rapidly.
- Investigate and export the resources behind a chart.

Before you begin, [enable advanced capacity insights](create-workspace.md#enable-advanced-capacity-insights) and allow up to 48 hours for initial data to populate.

The **Capacity details** report complements **Capacity overview**: the overview shows how much storage you have, while the details show how you're consuming it. Advanced capacity insights aggregate object metadata at the storage account, container, and configured-prefix levels; they don't provide an inventory of individual blobs.

## Open and filter the report

1. Open the [Azure portal](https://portal.azure.com).
1. Go to your Storage Discovery workspace.
1. In the workspace menu, select **Reports**.
1. Select **Capacity details**.
1. Select the Discovery scope that you want to analyze.
1. Apply report filters to focus on specific subscriptions, storage accounts, containers, or configured prefixes.

Other available filters can include region, performance type, encryption type, redundancy type, tags, and time range. A chart can provide more filters based on the metadata that it presents.

:::image source="media/create-workspace/preview-messaging.png" alt-text="Screenshot that shows preview messaging."  lightbox="media/create-workspace/preview-messaging.png":::

## Optimize access tiers

Use **Size by tier and recency** to compare capacity or object count across the Hot, Cool, Cold, and Archive tiers.

1. In **View**, select the time dimension that supports your investigation:
   - **Creation time**
   - **Last accessed time**
   - **Last modified time**
1. In **By**, select **Size** or **Count**.
1. Review the distribution across the following time ranges:
   - 0-3 days
   - 3-7 days
   - 7-30 days
   - 30-90 days
   - 90-180 days
   - 180-365 days
   - More than 365 days
1. Select **View resources** to identify the accounts, containers, or prefixes represented by a segment.

This view can help you find:

- Older or inactive data in a hotter tier.
- Frequently accessed data in a colder tier.
- Data that might require further lifecycle-management review.

> [!NOTE]
> Last-access analysis is available only for storage accounts that have last access time tracking enabled. If tracking isn't enabled for all accounts, results based on **Last accessed time** can be incomplete. Use the Storage Discovery **Configurations** report to review the configuration of your accounts.

## Understand object-size distribution

Use **Size-bucket distribution** to compare the percentage of total capacity and object count in these ranges:

- 0-1 KB
- 1 KB-1 MB
- 1 MB-1 GB
- 1 GB-1 TB
- More than 1 TB

Filter the chart to all access tiers or to the Hot, Cool, Cold, or Archive tier. You can analyze the distribution at the storage account, container, or configured-prefix level.

For example, a high concentration of small objects can identify a workload that needs further cost or operational analysis. A high percentage of capacity in the largest size buckets can help you locate the resources that dominate storage consumption.

## Evaluate minimum-retention exposure

Use **Minimum retention analysis** to find Cool, Cold, or Archive data that is still within the tier's minimum-retention period.

| Access tier | Minimum retention period |
|---|---:|
| Cool | 30 days |
| Cold | 90 days |
| Archive | 180 days |

Deleting, overwriting, moving, or changing the tier of data before the minimum period expires can result in a prorated early-deletion charge. Use the chart to understand exposure before you make changes, and then select **View resources** to identify the contributing resources.

> [!IMPORTANT]
> This report provides information for investigation. Review your workload requirements, lifecycle policies, and current Azure Storage pricing before changing or deleting data.

## Review storage composition

Use **Storage composition** to compare:

- Live or current data.
- Previous blob versions.
- Blob snapshots.
- Soft-deleted data.

View the results by blob category or blob access tier. This comparison can help you understand how much capacity comes from noncurrent or retained data and where to investigate lifecycle or retention settings.

The standard Storage Discovery Capacity report includes soft-deleted blobs, versions, and snapshots in size and count totals. For information about comparing those results with Blob Inventory, see [Compare with Blob Inventory reports](get-started-reports.md#compare-with-blob-inventory-reports).

## Review soft-deleted data

Use **Soft-deleted retention** to compare the size or count of soft-deleted data by its remaining retention duration.

The chart helps you understand:

- How long deleted data remains recoverable.
- How long soft-deleted data can continue to contribute to billable capacity.
- Which accounts or containers contribute the most soft-deleted data.

Select **View resources** to investigate the associated account and container totals.

## Find the largest or fastest-changing resources

Use **Top 10 items** to rank storage accounts, containers, or configured prefixes by size or object count. Depending on the options available in the report, you can use rankings such as top, bottom, fastest growing, or fastest shrinking.

Use these rankings to prioritize investigation. For growth-based rankings, ensure the resource has sufficient report history before drawing conclusions.

## Investigate resources behind a chart

Select **View resources** from a chart to open the resource-level results behind the selected insight. The available fields and filters depend on the chart and can include:

- Storage account, container, or configured prefix.
- Capacity and object count.
- Access tier and selected time dimension.
- Subscription and resource group.
- Chart-specific totals or percentages.

In **View resources**, you can:

1. Apply chart-specific filters.
1. Sort or group the results.
1. Use **Edit columns** to choose the fields to display.
1. Follow a resource link to continue investigating it in the Azure portal.
1. Select **Download as CSV** to export the results.

Grouping in the portal might be represented differently in the downloaded CSV. Review the exported columns before using the file in automation.

## Preview coverage

During preview, advanced capacity insights have the following coverage limits.

| Area | Coverage |
|---|---|
| Storage accounts | Up to 50,000 per Discovery scope, prioritized by storage size. Up to 10 billion objects per flat namespace account and 5 billion per hierarchical namespace account. |
| Account-level insights | Complete account-level aggregation for included accounts that are within the supported object-count limits. |
| Container-level insights | The top 100 containers by size in each included storage account. |
| Configured prefixes | Up to 100 prefixes per workspace. |

> [!NOTE]
> Accounts that exceed the object-count limits might not be included in the report. These preview limits might change as coverage expands.

### Interpret partial coverage

The report displays coverage information when advanced capacity insights don't include the entire storage estate. During preview, container-level insights are limited to the top 100 containers by size in each included account, and accounts that exceed the supported object-count limits can be excluded.

Account-level aggregation for an included account uses the complete account-level data available within the supported limits. Container-level totals can represent only the covered containers. Always review the coverage message before comparing totals across analysis levels.

## Next steps

- [Configure Blob prefixes for analysis](configure-blob-storage-prefixes.md)
- [Understand the common structure of Storage Discovery reports](get-started-reports.md)
- [Understand egress insights](egress-insights.md)
