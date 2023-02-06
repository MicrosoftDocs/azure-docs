---
title: Log Analytics integration with Power BI and Excel
description: Learn how to send results from Log Analytics to Power BI.
ms.topic: conceptual
author: guywild
ms.author: guywild
ms.reviewer: roygal
ms.date: 02/06/2023

---
# Log Analytics integration with Power BI

This article focuses on ways to feed data from Log Analytics into Power BI to create more visually appealing reports and dashboards.

## Background

Azure Monitor Logs is a platform that provides an end-to-end solution for ingesting logs. [Azure Monitor Log Analytics](../data-platform.md) is the interface to query these logs. For more information on the entire Azure Monitor data platform including Log Analytics, see [Azure Monitor data platform](../data-platform.md).

Power BI is the Microsoft data visualization platform. For more information on how to get started, see the [Power BI home page](https://powerbi.microsoft.com/).

In general, you can use free Power BI features to integrate and create visually appealing reports and dashboards.

More advanced features might require purchasing a Power BI Pro or Premium account. These features include:

 - Sharing your work.
 - Scheduled refreshes.
 - Power BI apps.
 - Dataflows and incremental refresh.

For more information, see [Learn more about Power BI pricing and features](https://powerbi.microsoft.com/pricing/).

## Create Power BI datasets and reports from Log Analytics queries

You can create Power BI datasets and reports from your Log Analytics queries. Two options are available under the **Export** menu in Log Analytics:
- **Power BI (new Dataset)**: This option creates a new dataset based on your query directly in the Power BI service. After the dataset has been created, you can create reports, use Analyze in Excel, share it with others, and use other Power BI features. For more information, see [Create a Power BI dataset directly from Log Analytics](/power-bi/connect-data/create-dataset-log-analytics).
- **Power BI (as an M query)**: This option exports the query (together with the connection string for the query) to a .txt file that you can use in Power BI Desktop. Use this option if you need to model or transform the data in ways that aren't available in the Power BI service, otherwise, consider exporting the query as a new dataset.

:::image type="content" source="/power-bi/connect-data/media/create-dataset-log-analytics/export-to-power-bi-log-analytics-option.png" alt-text="Screenshot showing Export to Power BI option in the Log Analytics Export menu.":::

## Collect data with Power BI dataflows

Power BI dataflows also allow you to collect and store data. For more information, see [Power BI dataflows](/power-bi/service-dataflows-overview).

A dataflow is a type of "cloud ETL" designed to help you collect and prep your data. A dataset is the "model" designed to help you connect different entities and model them for your needs.

## Incremental refresh

Both Power BI datasets and Power BI dataflows have an incremental refresh option. Power BI dataflows and Power BI datasets support this feature. To use incremental refresh on dataflows, you need Power BI Premium.

Incremental refresh runs small queries and updates smaller amounts of data per run instead of ingesting all the data again and again when you run the query. You can save large amounts of data but add a new increment of data every time the query is run. This behavior is ideal for longer-running reports.

Power BI incremental refresh relies on the existence of a **datetime** field in the result set. Before you configure incremental refresh, make sure your Log Analytics query result set includes at least one **datetime** field.

To learn more and how to configure incremental refresh, see [Power BI datasets and incremental refresh](/power-bi/service-premium-incremental-refresh) and [Power BI dataflows and incremental refresh](/power-bi/service-dataflows-incremental-refresh).

## Reports and dashboards

After your data is sent to Power BI, you can continue to use Power BI to create reports and dashboards.

For more information, see [Create and share your first Power BI report](/training/modules/build-your-first-power-bi-report/).

## Excel integration

You can use the same M integration used in Power BI to integrate with an Excel spreadsheet. For more information, see [Import data from data sources (Power Query)](https://support.microsoft.com/office/import-data-from-external-data-sources-power-query-be4330b3-5356-486c-a168-b68e9e616f5a). Then paste the M query exported from Log Analytics.

For more information, see [Integrate Log Analytics and Excel](log-excel.md).

## Next steps

Get started with [Log Analytics queries](./log-query-overview.md).
