---
title: Resiliency in Azure Event Grid | Microsoft Docs
description: Describes how Azure Event Grid supports resiliency.
ms.topic: conceptual
ms.date: 06/21/2022
---

# Resiliency in Azure Event Grid

Azure availability zones are designed to help you achieve resiliency and reliability for your business-critical workloads. Azure maintains multiple geographies. These discrete demarcations define disaster recovery and data residency boundaries across one or multiple Azure regions. Maintaining many regions ensures customers are supported across the world.

## Availability zones

Azure Event Grid event subscription configurations and events are automatically replicated across data centers in the availability zone, and replicated in the three availability zones (when available) in the region specified to provide automatic in-region recovery of your data in case of a failure in the region. See [Azure regions with availability zones](../availability-zones/az-overview.md#azure-regions-with-availability-zones) to learn more about the supported regions with availability zones.

Azure availability zones are connected by a high-performance network with a round-trip latency of less than 2ms. They help your data stay synchronized and accessible when things go wrong. Each zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. Availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.

With availability zones, you can design and operate applications and databases that automatically transition between zones without interruption. Azure availability zones are highly available, fault tolerant, and more scalable than traditional single or multiple datacenter infrastructures.

If a region supports availability zones, the event data is replicated across availability zones though.

:::image type="content" source="../availability-zones/media/availability-zones-region-geography.png" alt-text="Diagram that shows availability zones that protect against localized disasters and regional or large geography disasters by using another region.":::

## Next steps

- If you want to understand the geo disaster recovery concepts, see [Server-side geo disaster recovery in Azure Event Grid](geo-disaster-recovery.md)

- If you want to implement your own disaster recovery plan, see [Build your own disaster recovery plan for Azure Event Grid topics and domains](custom-disaster-recovery.md)

- If you want to implement your own client-side failover logic, see [# Build your own disaster recovery for custom topics in Event Grid](custom-disaster-recovery-client-side.md)