---
title: Performance recommendations in Azure Database for PostgreSQL
description: This article describes the performance recommendations one can get in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/26/2018
---
# Performance Recommendations in Azure Database for PostgreSQL

**Applies to:** Azure Database for PostgreSQL 9.6 and 10

> [!IMPORTANT]
> Performance Recommendations is in Public Preview in a limited number of regions.

The Performance Recommendations feature identifies the top indexes which can be created in your Azure Database for PostgreSQL server to improve performance. To produce index recommendations, the feature takes into consideration various database characteristics, including its schema and the workload as reported by Query Store. After implementing any performance recommendation, customers should test performance to evaluate the impact of those changes. 

## Permissions
**Owner** or **Contributor** permissions required to run analysis using the Performance Recommendations feature.

## Performance recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature analyzes workloads across your server to identify indexes with the potential to improve performance.

Open **Performance Recommendations** from the **Support + troubleshooting** section of the menu bar on the Azure portal page for your PostgreSQL server.

![Performance Recommendations landing page](./media/concepts-performance-recommendations/performance-recommendations-landing-page.png)

Select **Analyze** and choose a database. This will begin the analysis. Depending on your workload this may take several minutes to complete. Once the analysis is done, there will be a notification in the portal.

The **Performance Recommendations** window will show a list of recommendations if any were found. A recommendation will show information about the relevant **Database**, **Table**, **Column**, and **Index Size**.

![Performance Recommendations new page](./media/concepts-performance-recommendations/performance-recommendations-result.png)

To implement the recommendation, copy the query text and run it from your client of choice.

## Next steps
- Learn more about [monitoring and tuning](concepts-monitoring.md) in Azure Database for PostgreSQL.

