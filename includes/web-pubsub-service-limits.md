---
title: Azure Web PubSub Service limits table
description: Describes system limits for Azure Web PubSub.
services: Azure Web PubSub

ms.service: web-pubsub
ms.date: 11/02/2022
ms.author: Kevin Guo
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
| Included message size per unit per day for Free tier|40,000 KB |40,000 KB |
| Included messages per unit per day for Standard tier|2,000,000 KB |2,000,000 KB |
| Included messages per unit per day for Premium tier|2,000,000 KB |2,000,000 KB |
| Additional messages per unit per day for Free tier|0 |0 |
| Additional messages per unit per day for Standard tier|Unlimited |Unlimited |
| Additional messages per unit per day for Premium tier|Unlimited |Unlimited |

For more information about how connections and messages are counted, see [Billing model of Azure Web PubSub](../articles/azure-web-pubsub/concept-billing-model.md).

If your requirements exceed the limits of Free tier, consider switching to Standard tier and adding more units. 

If your requirements exceed the limits of a single instance, consider adding more instances.

If you need more than 150 units per subscription per region, which is the default limit, please open a support ticket.
