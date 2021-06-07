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

Azure Media Services uses [Availability Zones](../../availability-zones/az-overview.md), providing fault-isolated locations within the same Azure region. Media Services is zone-redundant by default in the [available locations](../../availability-zones/az-region.md#azure-regions-with-availability-zones) and no additional configuration on the Media Services account is required to enable this capability.  Media Services stores media data in the associated storage account(s).  These storage accounts need to be configured as zone-redundant storage (ZRS) or Geo-zone-redundant storage (GZRS) in order to provide the same level of redundancy as the Media Services account. For  details on how to configure replication on the associated storage account(s), see the article [Change how a storage account is replicated](../../storage/common/redundancy-migration.md).

## How Media Services components handle an Availability Zone fault

| Component             | Behavior on Availability Zone fault |
|-----------            |----------------------|
| Control Plane (ARM API) | Continue to work as normal |
| Key delivery            | Continue to work as normal |
| Jobs                    | Jobs are rescheduled in another Availability Zone. There will be a delay in processing time as in-flight processing jobs are rescheduled to start over in the Availability Zone |
| Live Events             | Continue to work as normal. Calling "reset" on a Live Event is currently not supported during an Availability Zone Fault. It is recommended to instead stop and re-start the live event in the case of an AZ fault as a replacement for the "reset" operation. If a live event was in the transition from starting to Running state during an Availability Zone fault, customers may see the live event stuck in the "starting" state. In this scenario, it is recommended to start a new live event and clean up the "starting" live events after the zone recovers.  |
| Streaming Endpoints     | Continue to work as normal |


## High Availability Streaming and Encoding for VOD

Availability Zones increase the fault-isolation in a single region, but to achieve a high availability deployment for on-demand streaming and encoding you can use Azure services to create an architecture to cover many design considerations such as redundancy, health monitoring, load balancing, and data backup and recovery. One such architecture is provided in the [High Availability with Media Services Video on Demand](architecture-high-availability-encoding-concept.md) article.
The article and sample code provides a solution for how individual regional Media Services accounts can be used to create a high availability architecture for your VOD application.

## Media Services support for Availability Zones by region

Availability Zones are currently only supported in certain Azure regions. To learn more about Availability Zones region support, see [Azure Regions with Availability Zones](../../availability-zones/az-region.md#azure-regions-with-availability-zones)

## Further reading

To learn more about Availability Zones, see [Regions and Availability Zones in Azure](../../availability-zones/az-overview.md).

To learn more about High Availability encoding and streaming, see [High Availability with Media Services Video on Demand](architecture-high-availability-encoding-concept.md).

To learn how to properly configure storage account replication to support Availability Zones, see [Change how a storage account is replicated](../../storage/common/redundancy-migration.md).
