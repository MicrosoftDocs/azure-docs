---
title: Performance recommendations - Azure Database for MySQL
description: This article describes the Performance Recommendation feature in Azure Database for MySQL
ms.service: mysql
ms.subservice: single-server
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Performance Recommendations in Azure Database for MySQL

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

**Applies to:** Azure Database for MySQL 5.7, 8.0

The Performance Recommendations feature analyzes your databases to create customized suggestions for improved performance. To produce the recommendations, the analysis looks at various database characteristics including schema. Enable [Query Store](concepts-query-store.md) on your server to fully utilize the Performance Recommendations feature. If performance schema is OFF, turning on Query Store enables performance_schema and a subset of performance schema instruments required for the feature. After implementing any performance recommendation, you should test performance to evaluate the impact of those changes.

## Permissions

**Owner** or **Contributor** permissions required to run analysis using the Performance Recommendations feature.

## Performance recommendations

The [Performance Recommendations](concepts-performance-recommendations.md) feature analyzes workloads across your server to identify indexes with the potential to improve performance.

Open **Performance Recommendations** from the **Intelligent Performance** section of the menu bar on the Azure portal page for your MySQL server.

:::image type="content" source="./media/concepts-performance-recommendations/performance-recommendations-page.png" alt-text="Performance Recommendations landing page":::

Select **Analyze** and choose a database, which will begin the analysis. Depending on your workload, the analysis may take several minutes to complete. Once the analysis is done, there will be a notification in the portal. Analysis performs a deep examination of your database. We recommend you perform analysis during off-peak periods.

The **Recommendations** window will show a list of recommendations if any were found and the related query ID that generated this recommendation. With the query ID, you can use the [mysql.query_store](concepts-query-store.md#mysqlquery_store) view to learn more about the query.

:::image type="content" source="./media/concepts-performance-recommendations/performance-recommendations-result.png" alt-text="Performance Recommendations new page":::

Recommendations are not automatically applied. To apply the recommendation, copy the query text and run it from your client of choice. Remember to test and monitor to evaluate the recommendation.

## Recommendation types

### Index recommendations

*Create Index* recommendations suggest new indexes to speed up the most frequently run or time-consuming queries in the workload. This recommendation type requires [Query Store](concepts-query-store.md) to be enabled. Query Store collects query information and provides the detailed query runtime and frequency statistics that the analysis uses to make the recommendation.

### Query recommendations

Query recommendations suggest optimizations and rewrites for queries in the workload. By identifying MySQL query anti-patterns and fixing them syntactically, the performance of time-consuming queries can be improved. This recommendation type requires Query Store to be enabled. Query Store collects query information and provides the detailed query runtime and frequency statistics that the analysis uses to make the recommendation.

## Next steps
- Learn more about [monitoring and tuning](concepts-monitoring.md) in Azure Database for MySQL.