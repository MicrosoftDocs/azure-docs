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

Peering Service connection telemetry is the insights collected for a specific connection. Customers can opt to obtain monitoring reports by defining the connection telemetry metrics. In this article you will learn how to view the latency report for the registered prefix.  

To measure the Peering Service connection telemetry, you must register the Peering Service connection into the Azure portal. To learn how to register the connection please refer [register the connection](peering-service-azure-portal.md).

To view the latency report for the registered prefix, do the following:

1. Click on **ALL resources** from the left pane and click on the prefix that is registered for the Peering Service connection. Following that, click on the **Open** below the **Prefixes** as depicted below:  

![Register Peering Service](./media/peering-service-measure/peering-service-measure-menu.png)

2. Doing so, latency report page specific to that prefix appears as depicted below:  

![Register Peering Service](./media/peering-service-measure/peering-service-latency-report.png)

3. By default, the report is generated for every 1 hour that is displayed in this page. However, to view the report for different timelines choose the appropriate option from the **Show data for last**.  

4. You can view latency reports for multiple prefixes, by selecting those prefixes. 

5. **Prefix Events** - To view failover events, click on the prefix displayed in the **Prefixes** page and click on the **Prefix Events** on the left pane. Doing so, the failover events that are captured will be displayed as depicted below: 

> [!div class="mx-imgBorder"]
>![Register Peering Service](./media/peering-service-measure/peering-service-prefix-event.png)

## Next steps

To learn about connection. See [Peering Service connection](peering-service-connection.md).

To learn about connection telemetry. See [Peering Service connection](peering-service-connection-telemetry.md).