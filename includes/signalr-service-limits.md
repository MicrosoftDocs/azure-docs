---
title: Azure SignalR Service limits table
description: Describes system limits for Azure SignalR Service.
services: signalr
documentationcenter: signalr
author: sffamily
manager: cfowler
editor: ''

ms.service: signalr
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 02/22/2022
ms.author: zhshang

---

| Resource | Default limit | Maximum limit | 
| --- | --- | --- |
| Azure SignalR Service units per instance for Free tier |1 |1 |
| Azure SignalR Service units per instance for Standard tier |100 |100 |
| Azure SignalR Service units per subscription per region for Free tier|5 |5 |
| Total Azure SignalR Service unit counts per subscription per region |150 |Unlimited |
| Concurrent connections per unit for Free tier |20 |20 |
| Concurrent connections per unit for Standard tier |1,000 |1,000|
| Included messages per unit per day for Free tier|20,000 |20,000 |
| Additional messages per unit per day for Free tier|0 |0 |
| Included messages per unit per day for Standard tier|1,000,000 |1,000,000 |
| Additional messages per unit per day for Standard tier|Unlimited |Unlimited |

To request an update to your subscription's default limits, open a support ticket.

For more information about how connections and messages are counted, see [Messages and connections in Azure SignalR Service](../articles/azure-signalr/signalr-concept-messages-and-connections.md).

If your requirements exceed the limits, switch from Free tier to Standard tier and add units. For more information, see [How to scale an Azure SignalR Service instance?](../articles/azure-signalr/signalr-howto-scale-signalr.md). 

If your requirements exceed the limits of a single instance, add instances. For more information, see [How to scale SignalR Service with multiple instances?](../articles/azure-signalr/signalr-howto-scale-multi-instances.md).
