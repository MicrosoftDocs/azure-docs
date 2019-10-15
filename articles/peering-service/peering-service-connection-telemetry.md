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
# Peering Service connection telemetry

Connection telemetry is the insights collected for a specific connection. Customers can opt to obtain monitoring reports by defining the connection telemetry metrics. 

## Preview Scope

Telemetry scope is comprised of the following:  

**Latency Measurement**

Measures the latency from the client to the Microsoft Edge and based on which visual reports are generated. 

Preferences are provided for those prefixes registered with Peering Service. 

**Prefix Monitoring** 

Monitors routing path for any suspicious activity and captures the same in the event logs. For instance, event logs are created for some of the factors specified below: 

   - Origin autonomous exchange 

   - BJP Withdrawal 

   - Route leak 

## Benefits 

 - Identify the root cause analysis. 

 - Avert the risk of service outages. 

 - Control over the routing traffic. 

##	Preview Limitations
**Latency telemetry** 

- At the granular level, latency reports are generated for every 1 hour.  

- Reports can be viewed in the Azure dashboard and not sent as notifications. 

## Next steps

To learn about connection, see [Peering Service connection](peering-service-connection.md).

To measure the telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
