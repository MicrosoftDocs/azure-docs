---
title: Measure Azure Peering Service (Preview) connection telemetry
description: Learn about on how to measure Azure Peering Service connection telemetry
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 11/04/2019
ms.author: v-meravi
---

# Measure Peering Service (Preview) connection telemetry

 Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network. In this article you will learn how to view the latency report for specific Peering Service connection.  

To measure Peering Service connection telemetry, you must register Peering Service connection into the Azure portal. To learn how to register connection, refer to the [Register Peering Service connection - Azure portal](azure-portal.md).

> [!IMPORTANT]
> "Peering Service” is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## View Latency Report

To view the latency report for specific Peering Service connection, do the following:

1. Click on **ALL resources** from the left pane and click on the Peering Service connection. Following that, click on the **Open** below the **Prefixes** as depicted below:  

   > [!div class="mx-imgBorder"]
   > ![Register Peering Service](./media/peering-service-measure/peering-service-measure-menu.png)

2. A latency report page for all the prefixes associated with that Peering Service connection appears as shown below:  

   > [!div class="mx-imgBorder"]
   > ![Register Peering Service](./media/peering-service-measure/peering-service-latency-report.png)

3. By default, the report is updated for every 1 hour that is displayed on this page. However, to view the report for different timelines choose the appropriate option from the **Show data for last**.  

4. **Prefix Events** - To view events for a specific prefix, click on the prefix name and click on the **Prefix Events** on the left pane. The events that are captured will be displayed as depicted below:

   > [!div class="mx-imgBorder"]
   > ![Register Peering Service](./media/peering-service-measure/peering-service-prefix-event.png)

 Some of the possible events that are captured in the **Prefix Events** are as follows: 

| **Prefix Events** | **Event Type**|**Reasoning**|
|-----------|---------|---------|
| PrefixAnnouncementEvent |Information|Prefix announcement was received|
| PrefixWithdrawalEvent|Warning| Prefix withdrawal was received |
| PrefixBackupRouteAnnouncementEvent |Information|Prefix backup route announcement was received |
| PrefixBackupRouteWithdrawalEvent|Warning|Prefix backup route withdrawal was received |
| PrefixActivePath |Information| Current prefix active route   |
| PrefixBackupPath | Information|Current prefix backup route   |
| PrefixOriginAsChangeEvent|Critical| Exact prefix received with different origin Autonomous System Number (for active route)| 
| PrefixBackupRouteOriginAsChangeEvent  | Error|Prefix received with different origin Autonomous System Number (for backup route)  |

## Next steps

To learn about Peering Service connection, see [Peering Service connection](connection.md).

To learn about Peering Service connection telemetry, see [Peering Service connection](connection-telemetry.md).