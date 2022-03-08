---
title: Availability zones support in Azure SignalR Service
description: Availability zones support in Azure SignalR Service
author: ArchangelSDY
ms.service: signalr
ms.topic: conceptual
ms.date: 02/15/2022
ms.author: dayshen
---
# Availability zones support in Azure SignalR Service

[Availability zones](../availability-zones/az-overview.md#availability-zones) are unique physical locations within an Azure region. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. Each zone has one or more datacenters equipped with independent power, cooling, and networking.

## Zone redundancy

Azure SignalR Service leverages availability zones in a Zone Redundant manner. That means, the service doesn't spin to a specific zone. Instead workloads are evenly distributed across multiple zones in a region. When a single zone fails, traffic are automatically routed to other zones, keeping the service available.

## Region support

Not all Azure regions support availability zones. For the regions list, see [regions that support availability zones](../availability-zones/az-region.md).

## Tier support

Zone redundancy is a Premium tier feature. It is implicitly enabled when you create or upgrade to a Premium tier resource. Standard tier resources can be upgraded to Premium tier without downtime.

## Next steps

* Learn more about [regions that support availability zones](../availability-zones/az-region.md).
* Learn more about building for [reliability](/azure/architecture/framework/resiliency/app-design) in Azure.