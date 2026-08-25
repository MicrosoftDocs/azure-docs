---
title: Compare Azure Event Hubs tiers
description: Compare the Basic, Standard, Premium, and Dedicated tiers of Azure Event Hubs to choose the right tier for your workload.
ms.topic: product-comparison
ms.date: 08/25/2026
ai-usage: ai-assisted

#customer intent: As an architect evaluating Azure Event Hubs, I want to compare the features and quotas of each tier so that I can choose the tier that best fits my throughput, scale, and isolation needs.
---

# Compare Azure Event Hubs tiers

Azure Event Hubs is a big data streaming platform and event ingestion service. It offers four tiers that differ in features, performance, capacity, and isolation. This article compares those tiers so you can choose the one that best fits your workload.

This article compares the following tiers:

- **Basic**: A low-cost entry point for simple streaming scenarios that need only basic features.
- **Standard**: A general-purpose tier for most streaming workloads, with support for Event Hubs Capture, Apache Kafka, and geo-disaster recovery.
- **Premium**: A tier that provides resource isolation, higher performance, and enhanced security for mission-critical workloads. For more information, see [Overview of Event Hubs Premium](event-hubs-premium-overview.md).
- **Dedicated**: A single-tenant offering for the largest streaming workloads that need guaranteed capacity and the highest limits. For more information, see [Overview of Event Hubs Dedicated](event-hubs-dedicated-overview.md).

> [!NOTE]
> This article compares only the features and quotas of each tier. For pricing, see [Azure Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/).

## Choose a tier

This section helps you narrow down the most likely tiers for your needs:

- Choose **Basic** for simple, low-volume streaming where you need a single consumer group and short retention.
- Choose **Standard** for most production workloads that need multiple consumer groups, Event Hubs Capture, Apache Kafka support, and geo-disaster recovery.
- Choose **Premium** when you need predictable performance through resource isolation, longer retention, customer-managed keys, or dynamic partition scale-out, without managing a dedicated cluster.
- Choose **Dedicated** for the largest, most demanding workloads that need a single-tenant cluster, the highest quotas, and the longest retention.

Use this list as a starting point, then use the following sections to compare the tiers in detail.

## Features

[!INCLUDE [event-hubs-tier-features](./includes/event-hubs-tier-features.md)]

## Quotas

[!INCLUDE [event-hubs-tier-limits](./includes/event-hubs-tier-limits.md)]

## Related content

- [Azure Event Hubs pricing](https://azure.microsoft.com/pricing/details/event-hubs/)
- [Overview of Event Hubs Premium](event-hubs-premium-overview.md)
- [Overview of Event Hubs Dedicated](event-hubs-dedicated-overview.md)
- [Scalability with Event Hubs](event-hubs-scalability.md)
