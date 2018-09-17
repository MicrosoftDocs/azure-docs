---
title: Performance recommendations in Azure Database for PostgreSQL
description: This article describes the performance recommendations one can get in Azure Database for PostgreSQL.
services: postgresql
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 09/24/2018
---

The Performance Recommendations feature is in public preview.

## Permissions
**Owner** or **Contributor** permissions are required to run analysis using the Performance Recommendations feature.


## Performance recommendations
The [Performance Recommendations](concepts-performance-recommendations.md) feature analyzes workloads across your server to identify indexes with the potential to improve performance.

1. Open **Performance Recommendations** from the **Support + troubleshooting** section of the menu bar on the Azure portal page for your PostgreSQL server.
2. Select **Analyze** and choose a database. This will begin the analysis.
3. Depending on your workload this may take many minutes to complete. Once the analysis is done, there will be a notification in the portal.
4. The **Performance Recommendations** window will show a list of recommendations if any were found. If it concludes that your workload needs no additional indexes, there will be no recommendation. 
5. A recommendation will show information about the relevant **Database**, **Table**, **Column**, and **Index Size**.
6. To implement the recommendation, copy the query text and run it from your client of choice.

