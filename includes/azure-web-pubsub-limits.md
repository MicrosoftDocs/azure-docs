---
title: Azure Web PubSub limits table
description: Describes system limits for Azure Web PubSub Service.
services: azure-web-pubsub
author: jixin
manager: kenchen
ms.service: azure-web-pubsub
ms.topic: include
ms.date: 12/22/2023
ms.author: JialinXin

---

| Resource | Default limit | Maximum limit | 
| --- | --- | --- |
| Azure Web PubSub Service units per instance for Free tier |1 |1 |
| Azure Web PubSub Service units per instance for Standard/Premium_P1 tier |100 |100 |
| Azure Web PubSub Service units per instance for Premium_P2 tier |100 - 1,000 |100 - 1,000 |
| Azure Web PubSub Service units per subscription per region for Free tier|5 |5 |
| Total Azure Web PubSub Service unit counts per subscription per region |150 |Unlimited |
| Concurrent connections per unit for Free tier |20 |20 |
| Concurrent connections per unit for Standard/Premium tier |1,000 |1,000|
| Included messages per unit per day for Free tier|20,000 |20,000 |
| Additional messages per unit per day for Free tier|0 |0 |
| Included messages per unit per day for Standard/Premium tier|1,000,000 |1,000,000 |
| Additional messages per unit per day for Standard/Premium tier|Unlimited |Unlimited |

To request an update to your subscription's default limits, open a support ticket.

For more information about how connections and messages are counted in billing, see [Billing model in Azure Web PubSub Service](../articles/azure-web-pubsub/concept-billing-model.md).

If your requirements exceed the limits, scale up from Free tier to Standard/Premium tier or scale out units. For more information, see [How to scale an Azure Web PubSub Service instance](../articles/azure-web-pubsub/howto-scale-manual-scale.md).

If your requirements exceed the limits of a single instance, add instances. For more information, see [How to use Geo-Replication in Azure Web PubSub](../articles/azure-web-pubsub/howto-enable-geo-replication.md).
