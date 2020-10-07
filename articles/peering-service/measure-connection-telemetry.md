---
title: 'Azure Peering Service: How to measure connection telemetry '
description: In this tutorial learn how to measure connection telemetry.
services: peering-service
author: derekolo
ms.service: peering-service
ms.topic: tutorial
ms.date: 05/18/2020
ms.author: derekol
Customer intent: Customer wants to measure their connection telemetry per prefix to Microsoft services with Azure Peering Service.
---
# Tutorial: Measure Peering Service connection telemetry

 In this tutorial, you'll learn how to measure telemetry for your Peering Service connections.
 
 Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network. In this article, you'll learn how to view the latency report for a specific Azure Peering Service connection. 

To measure Peering Service connection telemetry, you must register a Peering Service connection in the Azure portal. To learn how to register a connection, see [Register a Peering Service connection - Azure portal](azure-portal.md).


## View a latency report

To view a latency report for a specific Peering Service connection, follow these steps.

1. Select **All resources** in the left pane, and select the Peering Service connection. Then select **Open** under **Prefixes**. 

   ![Select the Peering Service connection](./media/peering-service-measure/peering-service-measure-menu.png)

2. A latency report page for all the prefixes associated with that Peering Service connection appears. 

      ![Latency report page](./media/peering-service-measure/peering-service-latency-report.png)

3. By default, the report is updated for every hour that's displayed on this page. To view the report for different timelines, choose the appropriate option from **Show data for last**. 

4. To view events for a specific prefix, select the prefix name and select **Prefix Events** in the left pane. The events that are captured are displayed.


   ![Prefix Events](./media/peering-service-measure/peering-service-prefix-event.png)

 Some of the possible events that are captured in the **Prefix Events** list are shown here.

| **Prefix events** | **Event type**|**Reasoning**|
|-----------|---------|---------|
| PrefixAnnouncementEvent |Information|Prefix announcement was received|
| PrefixWithdrawalEvent|Warning| Prefix withdrawal was received |
| PrefixBackupRouteAnnouncementEvent |Information|Prefix backup route announcement was received |
| PrefixBackupRouteWithdrawalEvent|Warning|Prefix backup route withdrawal was received |
| PrefixActivePath |Information| Current prefix active route   |
| PrefixBackupPath | Information|Current prefix backup route   |
| PrefixOriginAsChangeEvent|Critical| Exact prefix received with different origin autonomous system number (for active route)| 
| PrefixBackupRouteOriginAsChangeEvent  | Error|Prefix received with different origin autonomous system number (for backup route)  |

## Next steps

- To learn about Peering Service connection, see [Peering Service connection](connection.md).
- To learn about Peering Service connection telemetry, see [Peering Service connection telemetry](connection-telemetry.md).