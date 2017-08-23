---
title: Troubleshoot performance issues and optimize your database | Microsoft Docs
description:  Apply performance recommendations to your SQL Database as well as lear how to gain insights about the performance of the queries running against your database
metakeywords: azure sql database performance monitoring recommendation
services: sql-database
documentationcenter: ''
manager: jhubbard
author: jan-eng

ms.assetid: 
ms.service: sql-database
ms.custom: mvc,monitor & tune
ms.workload: sql-database
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2017
ms.author: janeng

---
# Troubleshoot performance issues and optimize your database

Missing indexes and poorly optimized queries are common reasons for poor database performance. In this tutorial you learn to:
> [!div class="checklist"]
> * Review, apply and revert performance improvement recommendations
> * Find queries with high resource utilization
> * Find long running queries

> You need a continuous workload on a database with performance issues – missing an index for example to receive a recommendation.
>

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Review and apply a recommendation

Follow these steps to apply a recommendation from the system for your database:

1. Click the **Performance recommendations** menu in the database blade.

    ![performance recommendation](./media/sql-database-performance-tutorial/perf_recommendations.png)

2. From the list of recommendations, select an active recommendation. In this example, Create Index.

    ![select recommendation](./media/sql-database-performance-tutorial/create_index.png)

3. Apply the recommendation by clicking the **Apply** button. Optionally, review the recommendation details and see the T-SQL script to  be executed by clicking on **View Script** button.

    ![apply recommendation](./media/sql-database-performance-tutorial/apply.png)

4. [Optional] Enable automatic tuning for recommendations to be applied automatically.

    ![auto tuning](./media/sql-database-performance-tutorial/auto_tuning.png)

## Revert a recommendation

The Database Advisor monitors every recommendation implemented. If a recommendation doesn't improve the workload it will be automatically reverted. Manually reverting a recommendation is possible, but not necessary in most cases. To revert a recommendation:

1. Go to the performance recommendations menu and select one of the applied recommendations.

    ![select recommendation](./media/sql-database-performance-tutorial/select.png)

2. In the details view, click **Revert**.

    ![revert recommendation](./media/sql-database-performance-tutorial/revert.png)

## Find the query that consumes the most resources

Follow these steps to find the query consuming the most resources:

1. Click on the **Query Performance Insight** menu in the database blade.

    ![query insights](./media/sql-database-performance-tutorial/query_perf_insights.png)

2. Select a resource type.

    ![query insights](./media/sql-database-performance-tutorial/select_resource_type.png)

3. Select the first query in the table.

    ![query insights](./media/sql-database-performance-tutorial/select_query.png)

4. Review the query details.

    ![query insights](./media/sql-database-performance-tutorial/query_details.png)

## Find the longest running query

1. Go to Query Performance Insight and select the **Long running queries** tab.

    ![query insights](./media/sql-database-performance-tutorial/long_running.png)

3. Select the first query in the table.

    ![query insights](./media/sql-database-performance-tutorial/select_first_query.png)

4. Review the query details.

    ![query insights](./media/sql-database-performance-tutorial/review_query_details.png)



## Next steps 
Missing indexes and poorly optimized queries are common reasons for poor database performance. In this tutorial you learned to:
> [!div class="checklist"]
> * Review, apply and revert performance improvement recommendations
> * Find queries with high resource utilization
> * Find long running queries

[SQL Database performance tuning tips](https://docs.microsoft.com/azure/sql-database/sql-database-troubleshoot-performance)
