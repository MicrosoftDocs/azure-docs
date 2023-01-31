---
title: Availability zones support in Azure  Service
description: Azure availability zones and zone redundancy in Azure Web PubSub Service
author: ArchangelSDY
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 07/06/2022
ms.author: dayshen
---

# Availability zones support in Azure Web PubSub Service

Azure Web PubSub Service uses [Azure availability zones](../availability-zones/az-overview.md#availability-zones) to provide high availability and fault tolerance within an Azure region.

> [!NOTE]
> Zone redundancy is a Premium tier feature. It is implicitly enabled when you create or upgrade to a Premium tier resource. Standard tier resources can be upgraded to Premium tier without downtime.

## Zone redundancy

Zone-enabled Azure regions (not all [regions support availability zones](../availability-zones/az-region.md)) have a minimum of three availability zones. A zone is one or more datacenters, each with its own independent power and network connections. All the zones in a region are connected by a dedicated low-latency regional network. If a zone fails, Azure Web PubSub Service traffic running on the affected zone is routed to other zones in the region.

Azure Web PubSub Service uses availability zones in a *zone-redundant* manner. Zone redundancy means the service isn't constrained to run in a specific zone. Instead, total service is evenly distributed across multiple zones in a region. Zone redundancy reduces the potential for data loss and service interruption if one of the zones fails.

## Next steps

* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about designing for [reliability](/azure/architecture/framework/resiliency/app-design) in Azure.
