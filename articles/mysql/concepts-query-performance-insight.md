---
title: Query Performance Insight - Azure Database for MySQL
description: This article describes the Query Performance Insight feature in Azure Database for MySQL
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 5/12/2020
---
# Query Performance Insight in Azure Database for MySQL

**Applies to:** Azure Database for MySQL 5.7, 8.0

Query Performance Insight helps you to quickly identify what your longest running queries are, how they change over time, and what waits are affecting them.

## Common scenarios

### Long running queries

- Identifying longest running queries in the past X hours
- Identifying top N queries that are waiting on resources
 
### Wait statistics

- Understanding wait nature for a query
- Understanding trends for resource waits and where resource contention exists

## Permissions

**Owner** or **Contributor** permissions required to view the text of the queries in Query Performance Insight. **Reader** can view charts and tables but not query text.

## Prerequisites

For Query Performance Insight to function, data must exist in the [Query Store](concepts-query-store.md).

## Viewing performance insights

The [Query Performance Insight](concepts-query-performance-insight.md) view in the Azure portal will surface visualizations on key information from Query Store.

In the portal page of your Azure Database for MySQL server, select **Query Performance Insight** under the **Intelligent Performance** section of the menu bar.

### Long running queries

The **Long running queries** tab shows the top 5 queries by average duration per execution, aggregated in 15-minute intervals. You can view more queries by selecting from  the **Number of Queries** drop down. The chart colors may change for a specific Query ID when you do this.

You can click and drag in the chart to narrow down to a specific time window. Alternatively, use the zoom in and out icons to view a smaller or larger time period respectively.

![Query Performance Insight long running queries](./media/concepts-query-performance-insight/query-performance-insight-landing-page.png) 

### Wait statistics

> [!NOTE]
> Wait statistics are meant for troubleshooting query performance issues. It is recommended to be turned on only for troubleshooting purposes. <br>If you receive the error message in the Azure portal "*The issue encountered for 'Microsoft.DBforMySQL'; cannot fulfill the request. If this issue continues or is unexpected, please contact support with this information.*" while viewing wait statistics, use a smaller time period.

Wait statistics provides a view of the wait events that occur during the execution of a specific query. Learn more about the wait event types in the [MySQL engine documentation](https://go.microsoft.com/fwlink/?linkid=2098206).

Select the **Wait Statistics** tab to view the corresponding visualizations on waits in the server.

Queries displayed in the wait statistics view are grouped by the queries that exhibit the largest waits during the specified time interval.

![Query Performance Insight waits statistics](./media/concepts-query-performance-insight/query-performance-insight-wait-statistics.png)

## Next steps

- Learn more about [monitoring and tuning](concepts-monitoring.md) in Azure Database for MySQL.