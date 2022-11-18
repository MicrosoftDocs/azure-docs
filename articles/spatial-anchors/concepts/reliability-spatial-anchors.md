---
title: Resiliency in Azure Spatial Anchors #Required; Must be "Resiliency in *your official service name*"
description: Find out about reliability in Azure Spatial Anchors #Required; 
author: RamonArguelles #Required; your GitHub user alias, with correct capitalization.
ms.author: rgarcia #Required; Microsoft alias of author; optional team alias.
ms.topic: conceptual
ms.custom: subject-reliability
ms.date: 11/17/2022 #Required; mm/dd/yyyy format.
#Customer intent: As a customer, I want to understand reliability support for Azure Spatial Anchors so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# What is reliability in Azure Spatial Anchors?

This article describes reliability support in Azure Spatial Anchors, and covers both regional resiliency with [availability zones](#availability-zones) and cross-region resiliency with disaster recovery. For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

## Azure Spatial Anchors

[Azure Spatial Anchors](overview.md) empowers developers with essential capabilities to build spatially aware
mixed reality applications. It enables developers to work with mixed reality platforms to
perceive spaces, designate precise points of interest, and to recall those points of interest from supported devices.
These precise points of interest are referred to as Spatial Anchors.

## Availability zones

For more information about availability zones, see [Regions and availability zones](../availability-zones/az-overview.md).

Within a given region, all Azure Spatial Anchors accounts run as Active-Active. Failure of even an entire cluster within any given region is not expected to impact overall service availability, provided the incoming load does not exceed the capacity of the remaining cluster.

In the event of an Azure regional outage, recovery of Azure Spatial Anchors account will rely on the Azure Paired Regions relationships for failover of resource dependencies, plus manual failover of resource dependencies which is the responsibility of Microsoft and not customers.

## Availability zone support

SouthEastAsia region does not rely on Azure Paired Regions in order to be compliant with data privacy regulations. A failure of this entire region will impact overall service availability, since there is no other region to redirect traffic to.

### Prerequisites

For a list of regions that support availability zones, see [Azure regions with availability zones](../availability-zones/az-region.md#azure-regions-with-availability-zones). If your Azure Spatial Anchors account is located in one of the regions listed, you don't need to take any other action beyond provisioning the service.

#### Create a resource with availability zone enabled

To enable AZ support for Azure Spatial Anchors, you do not need to take further steps beyond provisioning the account. Just create the resource in the region with AZ support, and it will be available across all AZs.

For detailed steps on how to provision the account, see [Create an Azure Spatial Anchors account](..\how-tos\create-asa-account.md).

### Fault tolerance

During a zone-wide outage, no action is required during zone recovery. The service will self-heal and rebalance to take advantage of the healthy zone automatically.

## Disaster recovery: cross-region failover

In the event of an Azure regional outage, recovery of Azure Spatial Anchors account will rely on the Azure Paired Regions relationships for failover of resource dependencies, plus manual failover of resource dependencies which is the responsibility of Microsoft and not customers.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency in Azure](/azure/availability-zones/overview.md)