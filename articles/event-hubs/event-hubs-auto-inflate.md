---
title: Auto inflate in Azure Event Hubs
description: Auto inflate in Azure Event Hubs automatically scales throughput units as traffic increases. Learn how it works and when to use it.
ms.topic: concept-article
ms.date: 05/04/2026
#customer intent: As an architect or developer, I want to understand how Auto inflate works so that I can decide whether to use automatic scaling for my Event Hubs namespace.
---

# Auto inflate in Azure Event Hubs (standard tier)

The Auto inflate feature of Azure Event Hubs automatically scales up throughput units (TUs) based on your workload, so you don't have to manually adjust capacity as traffic increases. If your workload has variable traffic patterns, Auto inflate eliminates the need to monitor and manually adjust throughput capacity.

> [!NOTE]
> The Auto inflate feature is currently supported only in the standard tier.

## How Auto inflate works

Event Hubs traffic is controlled by TUs (standard tier). For the limits such as ingress and egress rates per TU, see [Event Hubs quotas and limits](event-hubs-quotas.md). Auto inflate enables you to start small with the minimum required TUs you choose. The feature then scales automatically to the maximum limit of TUs you need, depending on the increase in your traffic. Auto inflate provides the following benefits:

- An efficient scaling mechanism to start small and scale up as you grow.
- Automatically scale to the specified upper limit without throttling issues.
- More control over scaling, because you control when and how much to scale.

> [!NOTE]
> Auto inflate doesn't **automatically scale down** the number of TUs when ingress or egress rates drop below the limits.

## Pricing considerations

With Auto inflate enabled, you can start small with your TUs and scale up as your usage needs increase. The upper limit for inflation doesn't immediately affect pricing, which depends on the number of TUs used per hour.

## Related content

- [Enable Auto inflate for an Event Hubs namespace](enable-auto-inflate.md)
- [Event Hubs quotas and limits](event-hubs-quotas.md)
- [Event Hubs overview](event-hubs-about.md)
