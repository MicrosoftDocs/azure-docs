---
title: Azure Advisor for PostgreSQL - Flexible Server
description: Learn about Azure Advisor recommendations for PostgreSQL - Flexible Server.
ms.service: postgresql
ms.subservice: flexible-server
ms.custom: ignite-2022
ms.topic: conceptual
author: nathan-wisner-ms
ms.author: nathanwisner
ms.date: 11/16/2021
---

# Azure Advisor for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Learn about how Azure Advisor is applied to Azure Database for PostgreSQL and get answers to common questions.
## What is Azure Advisor for PostgreSQL?
The Azure Advisor system uses telemetry to issue performance and reliability recommendations for your PostgreSQL database. 
Advisor recommendations are split among our PostgreSQL database offerings:
* Azure Database for PostgreSQL - Single Server
* Azure Database for PostgreSQL - Flexible Server

Some recommendations are common to multiple product offerings, while other recommendations are based on product-specific optimizations.
## Where can I view my recommendations?
Recommendations are available from the **Overview** navigation sidebar in the Azure portal. A preview will appear as a banner notification, and details can be viewed in the **Notifications** section located just below the resource usage graphs.

:::image type="content" source="../media/concepts-azure-advisor-recommendations/advisor-example.png" alt-text="Screenshot of the Azure portal showing an Azure Advisor recommendation.":::
## Recommendation types
Azure Database for PostgreSQL prioritize the following types of recommendations:
* **Performance**: To improve the speed of your PostgreSQL server. This includes CPU usage, memory pressure, connection pooling, disk utilization, and product-specific server parameters. For more information, see [Advisor Performance recommendations](../../advisor/advisor-performance-recommendations.md).
* **Reliability**: To ensure and improve the continuity of your business-critical databases. This includes storage limits, and connection limits. For more information, see [Advisor Reliability recommendations](../../advisor/advisor-high-availability-recommendations.md).
* **Cost**: To optimize and reduce your overall Azure spending. This includes server right-sizing recommendations. For more information, see [Advisor Cost recommendations](../../advisor/advisor-cost-recommendations.md).

## Understanding your recommendations
* **Daily schedule**: For Azure PostgreSQL databases, we check server telemetry and issue recommendations on a twice a day schedule. If you make a change to your server configuration, existing recommendations will remain visible until we re-examine telemetry at either 7PM or 7AM according to PST. 
* **Performance history**: Some of our recommendations are based on performance history. These recommendations will only appear after a server has been operating with the same configuration for 7 days. This allows us to detect patterns of heavy usage (e.g. high CPU activity or high connection volume) over a sustained time period. If you provision a new server or change to a new vCore configuration, these recommendations will be paused temporarily. This prevents legacy telemetry from triggering recommendations on a newly reconfigured server. However, this also means that performance history-based recommendations may not be identified immediately.

## Next steps
For more information, see [Azure Advisor Overview](../../advisor/advisor-overview.md).
