---
title: Understand the common structure of Azure Storage Discovery reports.
titleSuffix: Azure Storage Discovery
description: Learn how insights are presented in Azure Storage Discovery reports.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: overview
ms.date: 08/13/2025
ms.author: fauhse
---

# Understand the common structure of Azure Storage Discovery reports

Azure Storage Discovery reports organize insights into distinct categories that help you understand and manage your Azure Blob Storage estate:

- **Capacity**: Includes insights for size and count (blobs, containers, subscriptions, regions, and resource groups count) for each scope.
- **Activity** Includes metrics for transactions, ingress, and egress to understand how your storage is accessed and utilized.
- **Errors**: Highlights failed operations and error codes to help identify patterns of issues.
- **Configurations**: Surfaces configuration patterns across your storage accounts.
- **Security**: Provides visibility into access controls and encryption settings.
- **Consumption**: Shows storage resources capacity and activity insights that help you understand how your usage corresponds to the cost incurred.

:::image source="media/insights/workspace-reports.png" alt-text="Screenshot of Reports."  lightbox="media/insights/workspace-reports.png":::

`Capacity`, `Activity`, and `Errors` reports use interactive charts to present data in a unified format, making it easier to explore trends, derive insights, and take action to optimize your storage estate.

Storage Discovery reports include top-level filters that help you focus on specific aspects of your storage estate. These filters apply across all reports and charts, allowing you to tailor the insights to your business context.

Each chart also offers other options to drill down or pivot into detailed views of your storage estate. These interactive features enhance your ability to explore trends, identify patterns, and take informed actions. Top-level filters include:
- Time range
- Subscriptions
- Storage accounts
- Region
- Performance type
- Encryption type
- Redundancy type
- Tags

## Common information patterns across reports
Azure Storage Discovery reports - Capacity, Activity, Errors, and Consumption - follow a consistent information pattern that guides users from a high-level overview to actionable insights.

Each report begins with overview tiles that display aggregate metrics for the selected [scope](management-components.md#scope). These tiles provide a snapshot of the current state of your storage estate. Next, the Trends chart shows how each metric evolves over time, helping you identify shifts and patterns. Finally, the Top items chart lists the specific storage resources that contribute to the metrics, enabling deeper analysis.

This layered structure allows you to start with a broad view and progressively drill down into the details. Each chart supports exploration and decision-making, helping you uncover optimization opportunities or adjust configurations to improve security and compliance.

## High-level aggregates
The Capacity, Activity, Errors, and Consumption reports in Azure Storage Discovery provide a high-level overview of the selected scope within your workspace. These reports offer a bird’s-eye view of your storage estate, helping you quickly assess its scale and identify changes over time.

Users who regularly review these reports can monitor the breadth of their storage estate and detect shifts - such as changes in the number of regions included in the scope.

> [!TIP] 
> The overview tiles display aggregate metrics based on the latest available data. These values remain unchanged when you adjust the time range.

## Trends charts
The Trends chart illustrates how metrics change over time, helping you track usage patterns and shifts in your storage estate.
Trends charts are available in the Capacity, Activity, Errors, and Consumption reports. For example, in the Capacity report, you can visualize trends for metrics such as:
- Size
- Storage account count
- Container count
- Blob count

These metrics can be grouped by dimensions like region, performance type, and redundancy type.

## Top items
The Top items chart in the Capacity, Activity, and Errors reports provide a ranked view of storage resources within your selected scope. Depending on the report, this chart highlights either the largest or smallest contributors to key metrics, helping you identify which resources have the most impact on your storage estate.

Each report includes multiple pivot options that allow you to slice and analyze the data from different perspectives. For example, in the Activity report, you can view storage accounts or resource groups with the highest read operations. You can also pivot by dimensions such as performance type, redundancy type, or operation type to drill into specific insights—like write operations grouped by performance tier.

These flexible pivots support deeper analysis and help you uncover opportunities for optimization, performance tuning, or configuration adjustments to improve security and compliance.

:::image source="media/insights/transactions-top-items-chart.png" alt-text="Screenshot that shows Top items on Activity report."  lightbox="media/insights/transactions-top-items-chart.png":::

## Regional distribution
The Regional distribution chart visualizes how your storage resources are geographically distributed across Azure regions. For example, in the Capacity report, this chart plots key metrics - such as size, container count, and blob count - on a world map.
This visualization provides a quick, intuitive view of regional concentration, helping you identify imbalances and understand how storage usage varies by location. It’s especially useful for evaluating data residency, optimizing performance, and ensuring alignment with compliance requirements.

:::image source="media/insights/regional-distribution-chart.png" alt-text="Screenshot that shows Regional distribution chart."  lightbox="media/insights/regional-distribution-chart.png":::

## Next steps

Now that you understand the common structure and patterns of Azure Storage Discovery reports, explore these other resources to get the most out of your Discovery workspace:

- [Frequently asked questions](frequently-asked-questions.md)
