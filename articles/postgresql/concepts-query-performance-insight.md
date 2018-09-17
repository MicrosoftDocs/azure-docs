---
title: Query Performance Insight in Azure Database for PostgreSQL
description: This article describes the Query Performance Insight feature in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---

## Query Performance Insight 

The Query performance Insight feature is in public preview. 

## Permissions
**Owner** or **Contributor** permissions are required to view the text of the queries in Query Performance Insight. **Reader** can view charts and tables but not query text.

## Performance insights
The [Query Performance Insight](concepts-query-performance-insight.md) view in the Azure portal will surface visualizations on key information from Query Store. 

1. In the portal page of your Azure Database for PostgreSQL server, select **Query performance Insight** under the **Support + troubleshooting** section of the menu bar.
2. The **Long running queries** tab shows the top 5 queries by average duration per execution, aggregated in 15 minute intervals. You can view more queries by selecting from the **Number of Queries** drop down.
3. You can click and drag in the chart to narrow down to a specific time window.
4. The zoom in and out icons to view a smaller or larger period of time respectively.
5. View the table below the chart to learn more details about the top queries in that time window.
6. Select the **Wait Statistics** tab to view the corresponding visualizations on waits in the server.




