---
title: Performance recommendations in Azure Database for PostgreSQL - Single Server
description: This article describes the Performance Recommendation feature in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 5/6/2019
---
# Performance Recommendations in Azure Database for PostgreSQL - Single Server

**Applies to:** Azure Database for PostgreSQL - Single Server 9.6 and 10

The Performance Recommendations feature analyses your databases to create customized suggestions for improved performance. To produce the recommendations, the analysis looks at various database characteristics including schema. Enable [Query Store](concepts-query-store.md) on your server to fully utilize the Performance Recommendations feature. After implementing any performance recommendation, you should test performance to evaluate the impact of those changes. 

## Permissions
**Owner** or **Contributor** permissions required to run analysis using the Performance Recommendations feature.

## Performance recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature analyzes workloads across your server to identify indexes with the potential to improve performance.

Open **Performance Recommendations** from the **Intelligent Performance** section of the menu bar on the Azure portal page for your PostgreSQL server.

![Performance Recommendations landing page](./media/concepts-performance-recommendations/performance-recommendations-page.png)

Select **Analyze** and choose a database, which will begin the analysis. Depending on your workload, th analysis may take several minutes to complete. Once the analysis is done, there will be a notification in the portal. Analysis performs a deep examination of your database. We recommend you perform analysis during off-peak periods. 

The **Recommendations** window will show a list of recommendations if any were found.

![Performance Recommendations new page](./media/concepts-performance-recommendations/performance-recommendations-result.png)

Recommendations are not automatically applied. To apply the recommendation, copy the query text and run it from your client of choice. Remember to test and monitor to evaluate the recommendation. 

## Recommendation types

Currently, two types of recommendations are supported: *Create Index* and *Drop Index*.

### Create Index recommendations
*Create Index* recommendations suggest new indexes to speed up the most frequently run or time-consuming queries in the workload. This recommendation type requires [Query Store](concepts-query-store.md) to be enabled. Query Store collects query information and provides the detailed query runtime and frequency statistics that the analysis uses to make the recommendation.

### Drop Index recommendations
Besides detecting missing indexes, Azure Database for PostgreSQL analyzes the performance of existing indexes. If an index is either rarely used or redundant, the analyzer recommends dropping it.


## Next steps
- Learn more about [monitoring and tuning](concepts-monitoring.md) in Azure Database for PostgreSQL.

