---
title: Resiliency in Azure Spatial Anchors
description: Find out about reliability in Azure Spatial Anchors
author: RamonArguelles
ms.author: rgarcia
ms.topic: conceptual
ms.custom: subject-reliability
ms.service: azure-spatial-anchors
ms.date: 11/18/2022
#Customer intent: As a customer, I want to understand reliability support for Azure Spatial Anchors so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# What is reliability in Azure Spatial Anchors?

This article describes reliability support in Azure Spatial Anchors, and covers both regional resiliency with [availability zones](#availability-zones) and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](../../reliability/overview.md).

## Azure Spatial Anchors

[Azure Spatial Anchors](../overview.md) empowers developers with essential capabilities to build spatially aware
mixed reality applications. It enables developers to work with mixed reality platforms to
perceive spaces, designate precise points of interest, and to recall those points of interest from supported devices.
These precise points of interest are referred to as Spatial Anchors.

## Availability zones

For more information about availability zones, see [Regions and availability zones](../../reliability/availability-zones-overview.md).

Within a given region, all Azure Spatial Anchors accounts run as Active-Active. Failure of even an entire cluster within any given region isn't expected to impact overall service availability, provided the incoming load doesn't exceed the capacity of the remaining cluster.

During an Azure regional outage, recovery of Azure Spatial Anchors account will rely on the Azure Paired Regions relationships for failover of resource dependencies, plus manual failover of resource dependencies, which is the responsibility of Microsoft and not customers.

## Availability zone support

SouthEastAsia region doesn't rely on Azure Paired Regions in order to be compliant with data privacy regulations. A failure of this entire region will impact overall service availability, since there's no other region to redirect traffic to.

### Prerequisites

For a list of regions that support availability zones, see [Azure regions with availability zones](../../reliability/availability-zones-service-support.md#azure-regions-with-availability-zone-support). If your Azure Spatial Anchors account is located in one of the regions listed, you don't need to take any other action beyond provisioning the service.

#### Create a resource with availability zone enabled

To enable AZ support for Azure Spatial Anchors, you don't need to take further steps beyond provisioning the account. Just create the resource in the region with AZ support, and it will be available across all AZs.

For detailed steps on how to provision the account, see [Create an Azure Spatial Anchors account](../how-tos/create-asa-account.md).

### Fault tolerance

During a zone-wide outage, the customer should expect brief degradation of performance, until the service self-healing rebalances underlying capacity to adjust to healthy zones. This isn't dependent on zone restoration; it's expected that the Microsoft-managed service self-healing state will compensate for a lost zone, leveraging capacity from other zones.

## Disaster recovery: cross-region failover

During an Azure regional outage, recovery of Azure Spatial Anchors account will rely on the Azure Paired Regions relationships for failover of resource dependencies, plus manual failover of resource dependencies, which is the responsibility of Microsoft and not customers.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](../../reliability/overview.md)