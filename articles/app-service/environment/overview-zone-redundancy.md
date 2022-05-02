---
title: Zone redundancy in App Service Environment
description: Overview of zone redundancy in an App Service Environment.
author: madsd
ms.topic: overview
ms.date: 04/06/2022
ms.author: madsd
---

# Availability zone support for App Service Environment

You can deploy App Service Environment across [availability zones](../../availability-zones/az-overview.md). This architecture is also known as zone redundancy. When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across all three zones in the selected region. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

> [!NOTE]
> This article is about App Service Environment v3, which is used with isolated v2 App Service plans.

You configure zone redundancy when you create your App Service Environment, and all App Service plans created in that App Service Environment will be zone redundant. You can only specify zone redundancy when you're creating a new App Service Environment. Zone redundancy is only supported in a [subset of regions](./overview.md#regions).

When a zone goes down, the App Service platform detects lost instances and automatically attempts to find new, replacement instances. If you also have auto-scale configured, and if it determines that more instances are needed, auto-scale also issues a request to App Service to add more instances. Auto-scale behavior is independent of App Service platform behavior.

There's no guarantee that requests for instances in a zone-down scenario will succeed, because back-filling lost instances occurs on a best effort basis. It's a good idea to scale your App Service plans to account for losing a zone.

Applications deployed in a zone redundant App Service Environment continue to run and serve traffic, even if other zones in the same region suffer an outage. It's possible, however, that non-runtime behaviors might still be affected by an outage in other availability zones. These behaviors might include App Service plan scaling, application creation, application configuration, and application publishing. Zone redundancy for App Service Environment only ensures continued uptime for deployed applications.

When the App Service platform allocates instances to a zone redundant App Service plan, it uses [best effort zone balancing offered by the underlying Azure virtual machine scale sets](../../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). An App Service plan is considered balanced if each zone has either the same number of instances, or +/- one instance in all of the other zones used by the App Service plan.

## In-region data residency

A zone redundant App Service Environment will only store customer data within the region where it has been deployed. Both app content, settings and secrets stored in App Service remain within the region where the zone redundant App Service Environment is deployed.

## Pricing

 There's a minimum charge of nine App Service plan instances in a zone redundant App Service Environment. There's no added charge for availability zone support if you've nine or more instances. If you've fewer than nine instances (of any size) across App Service plans in the zone redundant App Service Environment, you're charged for the difference between nine and the running instance count. This difference is billed as Windows I1v2 instances.

## Next steps

* Read more about [availability zones](../../availability-zones/az-overview.md).
