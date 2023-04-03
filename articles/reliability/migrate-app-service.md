---

title: Migrate Azure App Service to availability zone support
description: Learn how to migrate Azure App Service to availability zone support.
author: anaharris-ms
ms.service: app-service
ms.topic: conceptual
ms.date: 03/03/2023
ms.author: anaharris
ms.reviewer: jordanselig
ms.custom: references_regions, subject-reliability

---

# Migrate App Service to availability zone support

This guide describes how to migrate a multi-tenant App Service from non-availability zone support to availability support. We'll take you through the different options for migration.

> [!NOTE]
> This article is about availability zones support using multi-tenant environment with App Service Premium v2 or Premium v3 plans.

Your App Service plans can be deployed across [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone-redundancy.

When you configure to be zone-redundant, the platform automatically spreads the instances of the Azure App Service plan across three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

## Prerequisites

Availability zone support is a property of the App Service plan. The following are the current requirements/limitations for enabling availability zones:

- Both Windows and Linux are supported.

- Requires either **Premium v2** or **Premium v3** App Service plans.

- Availability zones can only be specified when creating a **new** App Service plan. A pre-existing App Service plan can't be converted to use availability zones.

- Availability zones are only supported in the newer portion of the App Service footprint.
  - Currently, if you're running on Pv2 or Pv3, then it's possible that you're already on a footprint that supports availability zones. In this scenario, you can create a new App Service plan and specify zone redundancy.
  - If you aren't using Pv2/Pv3 or a scale unit that supports availability zones, are in an unsupported region, or are unsure, see the [migration guidance](#migration-guidance-redeployment).

- Availability zones are only supported in a [subset of regions](./reliability-app-service.md#prerequisites).


## Downtime requirements

Downtime will be dependent on how you decide to carry out the migration. Since you can't convert pre-existing App Service plans to use availability zones, migration will consist of a side-by-side deployment where you'll create new App Service plans. Downtime will depend on how you choose to redirect traffic from your old to your new availability zone enabled App Service. For example, if you're using an [Application Gateway](../app-service/networking/app-gateway-with-service-endpoints.md), a [custom domain](../app-service/app-service-web-tutorial-custom-domain.md), or [Azure Front Door](../frontdoor/front-door-overview.md), downtime will be dependent on the time it takes to update those respective services with your new app's information. Alternatively, you can route traffic to multiple apps at the same time using a service such as [Azure Traffic Manager](../app-service/web-sites-traffic-manager.md) and only fully cutover to your new availability zone enabled apps when everything is deployed and fully tested.

## Migration guidance: Redeployment

### When to use redeployment

If you want your App Service to use availability zones, redeploy your apps into newly created availability zone enabled App Service plans.
### How to redeploy

To redeploy your new App Service, you'll need to create the App Service on either Premium v2 or Premium v3. For instructions on how to create your App Service, see [Create an App Service](./reliability-app-service.md#to-deploy-a-multi-tenant-zone-redundant-app-service).

## Pricing

There's no additional cost associated with enabling availability zones. Pricing for a zone redundant App Service is the same as a single zone App Service. You'll be charged based on your App Service plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform will enforce a minimum instance count of three and charge you for those three instances.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to create and deploy ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)

> [!div class="nextstepaction"]
> [Learn how to scale up an app in Azure App Service](../app-service/manage-scale-up.md)

> [!div class="nextstepaction"]
> [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md)

> [!div class="nextstepaction"]
> [Manage disaster recovery](../app-service/manage-disaster-recovery.md)
