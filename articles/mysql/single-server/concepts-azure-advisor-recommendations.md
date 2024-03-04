---
title: Azure Advisor for MySQL
description: Learn about Azure Advisor recommendations for MySQL.
ms.service: mysql
ms.topic: conceptual
author: SudheeshGH
ms.author: sunaray
ms.date: 06/20/2022
---

# Azure Advisor for MySQL

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Learn about how Azure Advisor is applied to Azure Database for MySQL and get answers to common questions.
## What is Azure Advisor for MySQL?
The Azure Advisor system uses telemetry to issue performance and reliability recommendations for your MySQL database. 
Advisor recommendations are split among our MySQL database offerings:
* Azure Database for MySQL - Single Server
* Azure Database for MySQL - Flexible Server

Some recommendations are common to multiple product offerings, while other recommendations are based on product-specific optimizations.
## Where can I view my recommendations?
Recommendations are available from the **Overview** navigation sidebar in the Azure portal. A preview will appear as a banner notification, and details can be viewed in the **Notifications** section located just below the resource usage graphs.

:::image type="content" source="./media/concepts-azure-advisor-recommendations/advisor-example.png" alt-text="Screenshot of the Azure portal showing an Azure Advisor recommendation.":::

## Recommendation types
Azure Database for MySQL prioritize the following types of recommendations:
* **Performance**: To improve the speed of your MySQL server. This includes CPU usage, memory pressure, connection pooling, disk utilization, and product-specific server parameters. For more information, see [Advisor Performance recommendations](../../advisor/advisor-performance-recommendations.md).
* **Reliability**: To ensure and improve the continuity of your business-critical databases. This includes storage limit and connection limit recommendations. For more information, see [Advisor Reliability recommendations](../../advisor/advisor-high-availability-recommendations.md).
* **Cost**: To optimize and reduce your overall Azure spending. This includes server right-sizing recommendations. For more information, see [Advisor Cost recommendations](../../advisor/advisor-cost-recommendations.md).

## Understanding your recommendations
* **Daily schedule**: For Azure MySQL databases, we check server telemetry and issue recommendations on a daily schedule. If you make a change to your server configuration, existing recommendations will remain visible until we re-examine telemetry on the following day. 
* **Performance history**: Some of our recommendations are based on performance history. These recommendations will only appear after a server has been operating with the same configuration for 7 days. This allows us to detect patterns of heavy usage (e.g. high CPU activity or high connection volume) over a sustained time period. If you provision a new server or change to a new vCore configuration, these recommendations will be paused temporarily. This prevents legacy telemetry from triggering recommendations on a newly reconfigured server. However, this also means that performance history-based recommendations may not be identified immediately.

## Next steps
For more information, see [Azure Advisor Overview](../../advisor/advisor-overview.md).
