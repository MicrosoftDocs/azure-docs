---
title: Availability Zones
description: Media Services supports Availability Zones providing fault-isolation
services: media-services
author: johndeu
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 05/27/2021
ms.author: johndeu
---
# Availability Zones

Azure Media Services supports [Availability Zones](../../availability-zones/az-overview), providing fault-isolated locations within the same Azure region. Media Services is zone redundant by default and there are no additional settings or configuration changes required to be made to enable the capability. Support is limited to the [Azure regions that have Availability Zones](../../availability-zones/az-region#azure-regions-with-availability-zones.md).

## High Availability Streaming and Encoding for VOD

Availability Zones increase the fault-isolation in a single region, but to achieve a high availability deployment for on-demand streaming and encoding you can use Azure services to create an architecture to cover many design considerations such as redundancy, health monitoring, load balancing, and data backup and recovery. One such architecture is provided in the [High Availability with Media Services Video on Demand](architecture-high-availability-encoding-concept.md) article.
The article and sample code provides a solution for how individual regional Media Services accounts can be used to create a high availability architecture for your VOD application.

## Media Services support for Availability Zones by region

Availability Zones are currently only supported in certain Azure regions. To learn more about Availability Zones region support, see [Azure Regions with Availability Zones](../../availability-zones/az-region#azure-regions-with-availability-zones.md)

## Further reading

To learn more about Availability Zones, see [Regions and Availability Zones in Azure](../../availability-zones/az-overview).

To learn more about High Availability encoding and streaming, see [High Availability with Media Services Video on Demand](architecture-high-availability-encoding-concept.md).
