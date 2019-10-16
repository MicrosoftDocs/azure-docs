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

Connection telemetry is the insights collected for a Peering Service connection. Customers can obtain the telemetry for the Peering Service connection by registering the connection into the Azure portal. Connection telemetry feature provides prefix security, and insights into the network latency. 

## Preview Scope

Connection telemetry comprises of the following scopes:  

**Latency measurement**

Measures the latency from the client to the Microsoft edge for the registered prefixes.

**Route (prefix) monitoring and protection** 

Monitors routing path for any suspicious activity and captures the same in the event logs. For instance, event logs are created for some of the factors specified below: 

   - Prefix hijacks

   - Prefix withdrawal

   - Route leak

## Next steps

To learn about connection, see [Peering Service connection](peering-service-connection.md).

To measure the telemetry, see [Measure connection telemetry](peering-service-measure-connection-telemetry.md).
