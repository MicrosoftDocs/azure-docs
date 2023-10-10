---
title: Use scan statistics
description: How to enable, understand and query scan statistics using  query log tables for Trino clusters for HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Enable scan statistics for queries

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Often data teams are required to investigate performance or optimize queries to improve resource utilization or meet business requirements. 

A new capability has been added in HDInsight on AKS Trino that allows user to capture Scan statistics for any connector. This capability provides deeper insights into query performance profile beyond what is available in statistics produced by Trino.

You can enable this feature using [session property](https://trino.io/docs/current/sql/set-session.html#session-properties.) `collect_raw_scan_statistics`, and by following Trino command:
```
SET SESSION collect_raw_scan_statistics=true
```

Once enabled, source operators in the query like `TableScanOperator`, `ScanFilterAndProject` etc. have statistics on data scans, the granularity is per operator instance in a pipeline.

> [!TIP]
> Scan stats are helpful in identifying bottlenecks when the cluster or query is not CPU constrained, and read performance of the query needs investigation. It also helps to understand the execution profile of the query from a split level perspective.

> [!NOTE]
> Currently, captured number of splits per worker is limited to 1000 due to size constraints of produced data. If the number of splits per worker for the query exceeds this limit, top 1000 longest running splits are returned.

## How to access scan statistics

Once the session property is set, subsequent queries in the session start capturing statistics from source operators whenever they're available. There are multiple ways users can consume and analyze scan statistics generated for a query.

**Query Json**

The Json tab on Query details page provides the JSON representation of query, which included statistics on every stage, pipeline of the query. When the session property is set, the json includes a new field called `scanStats` in `queryStats.operatorSummaries[*]`. The array contains one object per instance of operator.

The following example shows a json for a query using `hive connector` and scan statistics enabled.
> [!NOTE]
> The scan statistics summary includes splitInfo which is populated by the connector. This allows users to control what information about the store they would like to include in their custom connectors.

:::image type="content" source="./media/trino-scan-stats/operator-summaries.png" alt-text="Screenshot showing query performance summary." border="true" lightbox="./media/trino-scan-stats/operator-summaries.png":::

**Scan Statistics UI**

You can find a new tab called `Scan Stats` in Query details page that visualizes the statistics produced by this feature and provides insights in split grain performance of each worker. The page allows users to view trino's execution profile for the query with information like, concurrent reads over time and throughput.

:::image type="content" source="./media/trino-scan-stats/scan-stats-tab-show.png" alt-text="Screenshot showing scan status addition." border="true" lightbox="./media/trino-scan-stats/scan-stats-tab-show.png":::

The following example shows a page for a query with scan statistics enabled.

:::image type="content" source="./media/trino-scan-stats/scan-stats-tab-query-details.png" alt-text="Screenshot showing scan status tab." border="true" lightbox="./media/trino-scan-stats/scan-stats-tab-query-details.png":::

## Using Microsoft Query logger**

Microsoft [Query logger](./trino-query-logging.md) has builtin support for this feature. When enabled with this feature, the query logger plugin populates a table called `operatorstats` along with the query events table, this table is denormalized so that every operator instance is one row for each query.
