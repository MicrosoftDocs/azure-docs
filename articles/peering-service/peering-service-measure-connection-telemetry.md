---
title: Microsoft Azure Peering Service | Microsoft Docs
description: Learn about Microsoft Azure Peering Service
services: peering-service
author: ypitsch
ms.service: peering-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/25/2019
ms.author: v-meravi
---

# Measure the Peering Service connection telemetry

Peering Service connection telemetry is the insights collected for a Peering Service connection. Customers can opt to obtain monitoring reports by defining the connection telemetry metrics. In this article you will learn how to view the latency report for a specific Peering Service connection.  

To measure the Peering Service connection telemetry, you must register the Peering Service connection into the Azure portal. To learn how to register the connection refer [register the connection](peering-service-azure-portal.md).

To view the latency report for a specific Peering Service connection, do the following:

1. Click on **ALL resources** from the left pane and click on the Peering Service connection. Following that, click on the **Open** below the **Prefixes** as depicted below:  

![Register Peering Service](./media/peering-service-measure/peering-service-measure-menu.png)

2. A latency report page for all the prefixes associated with that Peering Service connection appears as shown below:  

![Register Peering Service](./media/peering-service-measure/peering-service-latency-report.png)

3. By default, the report is updated for every 1 hour that is displayed in this page. However, to view the report for different timelines choose the appropriate option from the **Show data for last**.  

4. **Prefix Events** - To view events for a specific prefix, click on the prefix name and click on the **Prefix Events** on the left pane. The events that are captured will be displayed as depicted below:

> [!div class="mx-imgBorder"]
>![Register Peering Service](./media/peering-service-measure/peering-service-prefix-event.png)

 Some of the possible events that are captured in the **Prefix Events** are as follows: 

| **Prefix Events** | **Reasoning**|
|-----------|---------|
| PrefixBackupRoutePath |Backup route is covering route if prefix mask is > 24 |
| PrefixBackupRouteAnnouncementEvent| Back Route is covering route if prefix mask is > 2 |
| PrefixBackupRouteWithdrawalEvent | Back Route is covering route if prefix mask is > 24   |
| PrefixOriginAsChangeEvent | Exact prefix origin as change   |
| PrefixBackupRouteOriginAsChangeEvent |Exact backup prefix origin as change  |
| PrefixCoveringRouteOriginAsChangeEvent |If covering route is /16, anything from /16 to /24 containing prefix |
| PrefixLeakEvent | Exact prefix leaked   |
| PrefixBackupRouteLeakEvent  | Exact backup route prefix  |

## Next steps

To learn about connection, see [Peering Service connection](peering-service-connection.md).

To learn about connection telemetry, see [Peering Service connection](peering-service-connection-telemetry.md).