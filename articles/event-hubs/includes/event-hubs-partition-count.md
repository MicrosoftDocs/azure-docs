---
title: Event Hubs partition overview
description: Provides a description of a partition in Azure Event Hubs. 
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 11/27/2023
ms.author: spelluru
ms.custom: "include file"

---

A [partition](../event-hubs-features.md#partitions) is a data organization mechanism that enables parallel publishing and consumption. While it supports parallel processing and scaling, total capacity remains limited by the namespace's scaling allocation. Balance scaling units (throughput units for the standard tier, processing units for the premium tier, or capacity units for the dedicated tier) and partitions to achieve optimal scale.

Start with your workload profile: average payload size, events per second, and sensitivity to throughput drops or latency spikes. Use the per-partition throughput below as a starting point, then validate with load tests:

- **Standard tier**: ~1 MB/s ingress and ~2 MB/s egress per partition.
- **Premium and Dedicated tiers**: ~1-2 MB/s ingress and ~2-5 MB/s egress per partition.

Estimate partitions by dividing your expected ingress and egress by the applicable per-partition rates and taking the larger result. If observed throughput or latency doesn't meet expectations, increase partitions (Premium and Dedicated tiers only) and retest.

Partitions also set the ceiling for consumer parallelism. How that ceiling works depends on the consumer type:

- **Epoch (exclusive) consumers** — Used by `EventProcessorClient` (.NET, Java) and `EventHubConsumerClient` (Python, JavaScript), which is the recommended pattern for production AMQP workloads. Only one epoch consumer can own a given partition in a consumer group at a time. If you deploy more processor instances than partitions, the extra instances aren't assigned any partitions and sit idle until an existing owner releases one. If a new epoch consumer connects with a higher owner level, the service disconnects the current owner with a `ConsumerDisconnected` error, and the new consumer takes over.
- **Non-epoch consumers** — Up to 5 non-epoch receivers can read the same partition concurrently within a consumer group. Each receiver sees the same events (fan-out), so this mode doesn't increase processing throughput per partition. Connecting an epoch consumer to a partition disconnects all non-epoch consumers on that partition.
- **Kafka consumers** — Kafka consumers use the group coordination protocol (`group.id`) instead of AMQP epochs, but the partition-ownership model is equivalent: each partition is assigned to exactly one consumer member within a consumer group at a time. When a new member joins or an existing member leaves, the group rebalances and redistributes partition assignments. If there are more consumer members than partitions, the excess members receive no assignments and remain idle until a future rebalance frees up a partition. To reduce unnecessary rebalancing from transient disconnections, set a unique `group.instance.id` per consumer instance (static membership).

In practice, **the number of partitions equals the maximum number of parallel consumers per consumer group** regardless of whether you use AMQP epoch consumers or Kafka consumers. Factor this into your partition count when you plan for scale-out.

If your application has an affinity to a particular partition, increasing the number of partitions isn't beneficial. For more information, see [availability and consistency](../event-hubs-availability-and-consistency.md).
