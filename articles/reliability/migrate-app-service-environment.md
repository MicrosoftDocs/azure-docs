---
title: Migrate Azure App Service Environment to availability zone support
description: Learn how to migrate an Azure App Service Environment to availability zone support.
author: anaharris-ms
ms.service: app-service
ms.topic: conceptual
ms.date: 06/08/2022
ms.author: anaharris
ms.reviewer: jordanselig
ms.custom: references_regions, subject-reliability
---

# Migrate App Service Environment to availability zone support

This guide describes how to migrate an App Service Environment from non-availability zone support to availability support. We'll take you through the different options for migration.

> [!NOTE]
> This article is about App Service Environment v3, which is used with Isolated v2 App Service plans. Availability zones are only supported on App Service Environment v3. If you're using App Service Environment v1 or v2 and want to use availability zones, you'll need to migrate to App Service Environment v3.

Azure App Service Environment can be deployed across [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

## Prerequisites

- You configure availability zones when you create your App Service Environment.
  - All App Service plans created in that App Service Environment will need a minimum of 3 instances and those will automatically be zone redundant.
- You can only specify availability zones when creating a **new** App Service Environment. A pre-existing App Service Environment can't be converted to use availability zones.
- Availability zones are only supported in a [subset of regions](../app-service/environment/overview.md#regions).

## Downtime requirements

Downtime will be dependent on how you decide to carry out the migration. Since you can't convert pre-existing App Service Environments to use availability zones, migration will consist of a side-by-side deployment where you'll create a new App Service Environment with availability zones enabled.

Downtime will depend on how you choose to redirect traffic from your old to your new availability zone enabled App Service Environment. For example, if you're using an [Application Gateway](../app-service/networking/app-gateway-with-service-endpoints.md), a [custom domain](../app-service/app-service-web-tutorial-custom-domain.md), or [Azure Front Door](../frontdoor/front-door-overview.md), downtime will be dependent on the time it takes to update those respective services with your new app's information. Alternatively, you can route traffic to multiple apps at the same time using a service such as [Azure Traffic Manager](../app-service/web-sites-traffic-manager.md) and only fully cutover to your new availability zone enabled apps when everything is deployed and fully tested. For more information on App Service Environment migration options, see [App Service Environment migration](../app-service/environment/migration-alternatives.md). If you're already using App Service Environment v3, disregard the information about migration from previous versions and focus on the app migration strategies.

## Migration guidance: Redeployment

### When to use redeployment

If you want your App Service Environment to use availability zones, redeploy your apps into a newly created availability zone enabled App Service Environment.

### In-region data residency

A zone redundant App Service Environment will only store customer data within the region where it has been deployed. App content, settings, and secrets stored in App Service remain within the region where the zone redundant App Service Environment is deployed.

### How to redeploy

To redeploy your new App Service Environment, you'll need to create the App Service Environment v3 on Isolated v2 plan. For instructions on how to create your App Service Environment, see [Create an App Service Environment](../app-service/environment/creation.md).

## Pricing

There's a minimum charge of nine App Service plan instances in a zone redundant App Service Environment. There's no added charge for availability zone support if you have nine or more instances. If you have fewer than nine instances (of any size) across App Service plans in the zone redundant App Service Environment, you're charged for the difference between nine and the running instance count. This difference is billed as Windows I1v2 instances.

## Next steps

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)

> [!div class="nextstepaction"]
> [Reliability in Azure App Service](reliability-app-service.md)