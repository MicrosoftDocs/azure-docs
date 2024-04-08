---
title: Log Analytics integration with Power BI and Excel
description: Learn how to send results from a query in Log Analytics to Power BI.
ms.topic: how-to
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 02/06/2023

---
# Integrate Log Analytics with Power BI

[Azure Monitor Logs](../logs/data-platform-logs.md) provides an end-to-end solution for ingesting logs. From [Log Analytics](../data-platform.md), Azure Monitor's user interface for querying logs, you can connect log data to Microsoft's [Power BI](https://powerbi.microsoft.com/) data visualization platform. 

This article explains how to feed data from Log Analytics into Power BI to produce reports and dashboards based on log data.

> [!NOTE]
> You can use free Power BI features to integrate and create reports and dashboards. More advanced features, such as sharing your work, scheduled refreshes, dataflows, and incremental refresh might require purchasing a Power BI Pro or Premium account. For more information, see [Learn more about Power BI pricing and features](https://powerbi.microsoft.com/pricing/).

## Prerequisites

- To export the query to a .txt file that you can use in Power BI Desktop, you need [Power BI Desktop](https://powerbi.microsoft.com/desktop/).
- To create a new dataset based on your query directly in the Power BI service:
  - You need a Power BI account.
  - You must give permission in Azure for the Power BI service to write logs. For more information, see [Prerequisites to configure Azure Log Analytics for Power BI](/power-bi/transform-model/log-analytics/desktop-log-analytics-configure#prerequisites).

## Permissions required

- To export the query to a .txt file that you can use in Power BI Desktop, you need `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example.
- To create a new dataset based on your query directly in the Power BI service, you need `Microsoft.OperationalInsights/workspaces/write` permissions to the Log Analytics workspaces you query, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Create Power BI datasets and reports from Log Analytics queries

From the **Export** menu in Log Analytics, select one of the two options for creating Power BI datasets and reports from your Log Analytics queries:

:::image type="content" source="media/log-powerbi/export-to-power-bi-log-analytics-option.png" alt-text="Screenshot showing Export to Power BI option in the Log Analytics Export menu." lightbox="media/log-powerbi/export-to-power-bi-log-analytics-option.png":::
 
- **Power BI (as an M query)**: This option exports the query (together with the connection string for the query) to a .txt file that you can use in Power BI Desktop. Use this option if you need to model or transform the data in ways that aren't available in the Power BI service. Otherwise, consider exporting the query as a new dataset.
- **Power BI (new Dataset)**: This option creates a new dataset based on your query directly in the Power BI service. After the dataset has been created, you can create reports, use Analyze in Excel, share it with others, and use other Power BI features. For more information, see [Create a Power BI dataset directly from Log Analytics](/power-bi/connect-data/create-dataset-log-analytics).

> [!NOTE]
> The export operation is subject to the [Log Analytics Query API limits](../service-limits.md#la-query-api). If your query results exceed the maximum size of data returned by the Query API, the operation exports partial results.

## Collect data with Power BI dataflows

[Power BI dataflows](/power-bi/service-dataflows-overview) also allow you to collect and store data. A dataflow is a type of cloud ETL (extract, transform, and load) process that helps you collect and prepare your data. A dataset is the "model" designed to help you connect different entities and model them for your needs.

## Incremental refresh

Both Power BI datasets and Power BI dataflows have an incremental refresh option. Power BI dataflows and Power BI datasets support this feature. To use incremental refresh on dataflows, you need Power BI Premium.

Incremental refresh runs small queries and updates smaller amounts of data per run instead of ingesting all the data again and again when you run the query. You can save large amounts of data but add a new increment of data every time the query is run. This behavior is ideal for longer-running reports.

Power BI incremental refresh relies on the existence of a **datetime** field in the result set. Before you configure incremental refresh, make sure your Log Analytics query result set includes at least one **datetime** field.

To learn more and how to configure incremental refresh, see [Power BI datasets and incremental refresh](/power-bi/service-premium-incremental-refresh) and [Power BI dataflows and incremental refresh](/power-bi/service-dataflows-incremental-refresh).

## Reports and dashboards

After your data is sent to Power BI, you can continue to use Power BI to create reports and dashboards.

For more information, see [Create and share your first Power BI report](/training/modules/build-your-first-power-bi-report/).

## Next steps

Learn how to:
- [Get started with Log Analytics queries](./log-query-overview.md).
- [Integrate Log Analytics and Excel](log-excel.md).