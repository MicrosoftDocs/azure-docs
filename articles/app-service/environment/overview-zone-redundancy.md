---
title: Zone-redundancy in App Service Environment
description: Overview of zone redundancy in an App Service Environment.
author: madsd
ms.topic: overview
ms.date: 11/15/2021
ms.author: madsd
---

# Availability Zone support for App Service Environments

> [!NOTE]
> This article is about the App Service Environment v3 which is used with Isolated v2 App Service plans
>

App Service Environment (ASE) can be deployed across [Availability Zones (AZ)](../../availability-zones/az-overview.md). This architecture is also known as zone redundancy. When an ASE is configured to be zone redundant, the platform automatically spreads the App Service plan instances in the ASE across all three zones in the selected region. If a capacity larger than three is specified and the number of instances is divisible by three, the instances will be spread evenly. Otherwise, instance counts beyond 3*N will get spread across the remaining one or two zones.

You configure zone redundancy when you create your ASE and all App Service plans created in that ASE will be zone redundant. Zone redundancy can only be specified when creating a *new* App Service Environment. Zone redundancy is only supported in a [subset of regions](./overview.md#regions).

In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances. If you also have autoscale configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances (autoscale behavior is independent of App Service platform behavior). It's important to note there's no guarantee that requests for instances in a zone-down scenario will succeed since back filling lost instances occur on a best-effort basis. The recommended solution is to scale your App Service plans to account for losing a zone.

Applications deployed in a zone redundant ASE will continue to run and serve traffic even if other zones in the same region suffer an outage. However it's possible that non-runtime behaviors including App Service plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other Availability Zones. Zone redundancy for App Service Environment only ensures continued uptime for deployed applications.

When the App Service platform allocates instances to a zone redundant App Service plan in an ASE, it uses [best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). An App Service plan will be "balanced" if each zone has either the same number of instances, or +/- 1 instance in all of the other zones used by the App Service plan.

## Pricing

 There is a minimum charge of nine App Service plan instances in a zone redundant ASE. There is no added charge for availability zone support if you have nine or more App Service plan instances. If you have less than nine instances (of any size) across App Service plans in the zone redundant ASE, the difference between nine and the running instance count is charged as additional Windows I1v2 instances.

## Next steps

* Read more about [Availability Zones](../../availability-zones/az-overview.md)

* Design [reliable Azure applications](../../architecture/framework/resiliency/app-design)