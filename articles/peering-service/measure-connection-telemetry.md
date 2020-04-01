---
title: Measure Azure Peering Service Preview connection telemetry
description: Learn how to measure Azure Peering Service connection telemetry
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: ypitsch
---

# Measure Peering Service Preview connection telemetry

 Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network. In this article, you'll learn how to view the latency report for a specific Azure Peering Service connection. 

To measure Peering Service connection telemetry, you must register a Peering Service connection in the Azure portal. To learn how to register a connection, see [Register a Peering Service connection - Azure portal](azure-portal.md).

> [!IMPORTANT]
> Peering Service is currently in public preview.
> This preview version is provided without a service level agreement. We don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental terms of use for Microsoft Azure previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## View a latency report

To view a latency report for a specific Peering Service connection, follow these steps.

1. Select **All resources** in the left pane, and select the Peering Service connection. Then select **Open** under **Prefixes**. 

   > [!div class="mx-imgBorder"]
   > ![Select the Peering Service connection](./media/peering-service-measure/peering-service-measure-menu.png)

2. A latency report page for all the prefixes associated with that Peering Service connection appears. 

   > [!div class="mx-imgBorder"]
   > ![Latency report page](./media/peering-service-measure/peering-service-latency-report.png)

3. By default, the report is updated for every hour that's displayed on this page. To view the report for different timelines, choose the appropriate option from **Show data for last**. 

4. To view events for a specific prefix, select the prefix name and select **Prefix Events** in the left pane. The events that are captured are displayed.

   > [!div class="mx-imgBorder"]
   > ![Prefix Events](./media/peering-service-measure/peering-service-prefix-event.png)

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