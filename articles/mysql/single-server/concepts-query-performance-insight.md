---
title: Query Performance Insight - Azure Database for MySQL
description: This article describes the Query Performance Insight feature in Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Query Performance Insight in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

**Applies to:** Azure Database for MySQL 5.7, 8.0

Query Performance Insight helps you to quickly identify what your longest running queries are, how they change over time, and what waits are affecting them.

## Common scenarios

### Long running queries

- Identifying longest running queries in the past X hours
- Identifying top N queries that are waiting on resources
 
### Wait statistics

- Understanding wait nature for a query
- Understanding trends for resource waits and where resource contention exists

## Prerequisites

For Query Performance Insight to function, data must exist in the [Query Store](concepts-query-store.md).

## Viewing performance insights

The [Query Performance Insight](concepts-query-performance-insight.md) view in the Azure portal will surface visualizations on key information from Query Store.

In the portal page of your Azure Database for MySQL server, select **Query Performance Insight** under the **Intelligent Performance** section of the menu bar.

### Long running queries

The **Long running queries** tab shows the top 5 Query IDs by average duration per execution, aggregated in 15-minute intervals. You can view more Query IDs by selecting from the **Number of Queries** drop down. The chart colors may change for a specific Query ID when you do this.

> [!NOTE]
>  Displaying the Query Text is no longer supported and will show as empty. The query text is removed to avoid unauthorized access to the query text or underlying schema which can pose a security risk.

The recommended steps to view the query text is shared below:
 1. Identify the query_id of the top queries from the Query Performance Insight blade in the Azure portal.
1. Log in to your Azure Database for MySQL server from MySQL Workbench or mysql.exe client or your preferred query tool and execute the following queries.
 
```sql
    SELECT * FROM mysql.query_store where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for queries in Query Store
    SELECT * FROM mysql.query_store_wait_stats where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for wait statistics
```

You can click and drag in the chart to narrow down to a specific time window. Alternatively, use the zoom in and out icons to view a smaller or larger time period respectively.

:::image type="content" source="./media/concepts-query-performance-insight/query-performance-insight-landing-page.png" alt-text="Query Performance Insight long running queries"::: 

### Wait statistics

> [!NOTE]
> Wait statistics are meant for troubleshooting query performance issues. It is recommended to be turned on only for troubleshooting purposes. <br>If you receive the error message in the Azure portal "*The issue encountered for 'Microsoft.DBforMySQL'; cannot fulfill the request. If this issue continues or is unexpected, please contact support with this information.*" while viewing wait statistics, use a smaller time period.

Wait statistics provides a view of the wait events that occur during the execution of a specific query. Learn more about the wait event types in the [MySQL engine documentation](https://go.microsoft.com/fwlink/?linkid=2098206).

Select the **Wait Statistics** tab to view the corresponding visualizations on waits in the server.

Queries displayed in the wait statistics view are grouped by the queries that exhibit the largest waits during the specified time interval.

> [!NOTE]
>  Displaying the Query Text is no longer supported and will show as empty. The query text is removed to avoid unauthorized access to the query text or underlying schema which can pose a security risk.

The recommended steps to view the query text is shared below:
 1. Identify the query_id of the top queries from the Query Performance Insight blade in the Azure portal.
1. Log in to your Azure Database for MySQL server from MySQL Workbench or mysql.exe client or your preferred query tool and execute the following queries.
 
```sql
    SELECT * FROM mysql.query_store where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for queries in Query Store
    SELECT * FROM mysql.query_store_wait_stats where query_id = '<insert query id from Query performance insight blade in Azure portal';  // for wait statistics
```

:::image type="content" source="./media/concepts-query-performance-insight/query-performance-insight-wait-statistics.png" alt-text="Query Performance Insight waits statistics":::

## Next steps

- Learn more about [monitoring and tuning](concepts-monitoring.md) in Azure Database for MySQL.