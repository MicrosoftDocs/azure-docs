---
title: Azure Advisor
description: Learn about Azure Advisor recommendations for Azure Database for PostgreSQL - Flexible Server.
author: nathan-wisner-ms
ms.author: nathanwisner
ms.reviewer: maghan
ms.date: 06/14/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Azure Advisor for Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

Learn about how Azure Advisor is applied to Azure Database for PostgreSQL flexible server and get answers to common questions.
## What is Azure Advisor for PostgreSQL?
The Azure Advisor system uses telemetry to issue performance and reliability recommendations for your Azure Database for PostgreSQL flexible server database. 

Some recommendations are common to multiple product offerings, while other recommendations are based on product-specific optimizations.
## Where can I view my recommendations?
Recommendations are available from the **Overview** navigation sidebar in the Azure portal. A preview will appear as a banner notification, and details can be viewed in the **Notifications** section located just below the resource usage graphs.

:::image type="content" source="../media/concepts-azure-advisor-recommendations/advisor-example.png" alt-text="Screenshot of the Azure portal showing an Azure Advisor recommendation.":::
## Recommendation types
Azure Database for PostgreSQL flexible server prioritizes the following type of recommendation:
* **Performance**: To enhance the performance of your Azure Database for PostgreSQL flexible server instance, the recommendations proactively identify servers experiencing scenarios which can impact performance. These scenarios include high CPU utilization, frequent checkpoint initiations, performance-impacting log parameter settings, inactive logical replication slots, long-running transactions, orphaned prepared transactions, a high bloat ratio, and transaction wraparound risks. For more information, see [Advisor Performance recommendations](../../advisor/advisor-performance-recommendations.md).

## Understanding your recommendations
* **Daily schedule**: For Azure Database for PostgreSQL flexible server databases, we review server telemetry and issue recommendations daily. If you make changes to your server configuration, the existing recommendations will remain visible until we re-evaluate the recommendation the following day, approximately 24 hours later.
* **Performance history**: Some of our recommendations are based on performance history. These recommendations will only appear after a server has been operating with the same configuration for 7 days. This allows us to detect patterns of heavy usage (e.g., high CPU activity or high connection volume) over a sustained period. If you provisioned a new server or change to a new vCore configuration, these recommendations are paused temporarily. This prevents legacy telemetry from triggering recommendations on a newly reconfigured server. However, this also means that performance history-based recommendations may not be identified immediately.

## Next steps
For more information, see [Azure Advisor Overview](../../advisor/advisor-overview.md).
