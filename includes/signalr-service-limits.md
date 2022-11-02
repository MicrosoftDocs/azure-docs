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
| Units per subscription per region for Free tier|5 |5 |
| Total units per subscription per region |150 |Unlimited |
| Units per instance for Free tier |1 |1 |
| Units per instance for Standard tier |100 |100 |
| Units per instance for Premium tier |100 |100 |
| Concurrent connections per unit for Free tier |20 |20 |
| Concurrent connections per unit for Standard tier |1,000 |1,000|
| Concurrent connections per unit for Premium tier |1,000 |1,000|
| Included messages per unit per day for Free tier|20,000 |20,000 |
| Included messages per unit per day for Standard tier|1,000,000 |1,000,000 |
| Included messages per unit per day for Premium tier|1,000,000 |1,000,000 |
| Additional messages per unit per day for Free tier|0 |0 |
| Additional messages per unit per day for Standard tier|Unlimited |Unlimited |
| Additional messages per unit per day for Premium tier|Unlimited |Unlimited |

For more information about how connections and messages are counted, see [Messages and connections in Azure SignalR Service](../articles/azure-signalr/signalr-concept-messages-and-connections.md).

If your requirements exceed the limits of Free tier, consider switching to Standard tier and adding more units. For more information, see [How to scale an Azure SignalR Service instance?](../articles/azure-signalr/signalr-howto-scale-signalr.md). 

If your requirements exceed the limits of a single instance, consider adding more instances. For more information, see [How to scale SignalR Service with multiple instances?](../articles/azure-signalr/signalr-howto-scale-multi-instances.md).

If you need more than 150 units per subscription per region, which is the default limit, please open a support ticket.
