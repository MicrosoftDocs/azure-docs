---
title: Synapse SQL recommendations
description: Learn about Synapse SQL recommendations and how they are generated
services: synapse-analytics
author: kevinvngo
manager: craigg-msft
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql-dw 
ms.date: 06/26/2020
ms.author: kevin
ms.reviewer: igorstan
ms.custom: azure-synapse
---

# Synapse SQL recommendations

This article describes the Synapse SQL recommendations served through Azure Advisor.  

Synapse SQL provides recommendations to ensure your data warehouse workload is consistently optimized for performance. Recommendations are tightly integrated with [Azure Advisor](../../advisor/advisor-performance-recommendations.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) to provide you with best practices directly within the [Azure portal](https://aka.ms/Azureadvisor). Synapse SQL collects telemetry and surfaces recommendations for your active workload on a daily cadence. The supported  recommendation scenarios are outlined below along with how to apply recommended actions.

You can [check your recommendations](https://aka.ms/Azureadvisor) today! 

## Data skew

Data skew can cause additional data movement or resource bottlenecks when running your workload. The following documentation describes show to identify data skew and prevent it from happening by selecting an optimal distribution key.

- [Identify and remove skew](sql-data-warehouse-tables-distribute.md#how-to-tell-if-your-distribution-column-is-a-good-choice)

## No or outdated statistics

Having suboptimal statistics can severely impact query performance as it can cause the SQL query optimizer to generate suboptimal query plans. The following documentation describes the best practices around creating and updating statistics:

- [Creating and updating table statistics](sql-data-warehouse-tables-statistics.md)

To see the list of impacted tables by these recommendations, run the following  [T-SQL script](https://github.com/Microsoft/sql-data-warehouse-samples/blob/master/samples/sqlops/MonitoringScripts/ImpactedTables). Advisor continuously runs the same T-SQL script to generate these recommendations.

## Replicate tables

For replicated table recommendations, Advisor detects table candidates based on the following
physical characteristics:

- Replicated table size
- Number of columns
- Table distribution type
- Number of partitions

Advisor continuously leverages workload-based heuristics such as table access frequency, rows returned on average, and thresholds around data warehouse size and activity to ensure high-quality recommendations are generated.

The following section describes workload-based heuristics you may find in the Azure portal for each replicated table recommendation:

- Scan avg- the average percent of rows that were returned from the table for each table access over the past seven days
- Frequent read, no update - indicates that the table has not been updated in the past seven days while showing access activity
- Read/update ratio - the ratio of how frequent the table was accessed relative to when it gets updated over the past seven days
- Activity - measures the usage based on access activity. This activity compares the table access activity relative to the average table access activity across the data warehouse over the past seven days.

Currently Advisor will only show at most four replicated table candidates at once with clustered columnstore indexes prioritizing the highest activity.

> [!IMPORTANT]
> The replicated table recommendation is not full proof and does not take into account data movement operations. We are working on adding this as a heuristic but in the meantime, you should always validate your workload after applying the recommendation. To learn more about replicated tables, visit the following [documentation](design-guidance-for-replicated-tables.md#what-is-a-replicated-table).


## Adaptive (Gen2) cache utilization
When you have a large working set, you can experience a low cache hit percentage and high cache utilization. For this scenario, you should scale up to increase cache capacity and rerun your workload. For more information visit the following [documentation](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-how-to-monitor-cache). 

## Tempdb contention

Query performance can degrade when there is high tempdb contention.  Tempdb contention can occur via user-defined temporary tables or when there is a large amount of data movement. For this scenario, you can scale for more tempdb allocation and [configure resource classes and workload management](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-workload-management) to provide more memory to your queries. 

## Data loading misconfiguration

You should always load data from a storage account in the same region as your SQL pool to minimize latency. Use the [COPY statement for high throughput data ingestion](https://docs.microsoft.com/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest) and split your staged files in your storage account to maximize throughput. If you can't use the COPY statement, you can use the SqlBulkCopy API or bcp with a high batch size for better throughput. For additional data loading guidance, visit the following [documentation](https://docs.microsoft.com/azure/synapse-analytics/sql-data-warehouse/guidance-for-loading-data). 
