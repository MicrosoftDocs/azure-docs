---
title: Migrate Azure App Service Environment to availability zone support
description: Learn how to migrate an Azure App Service Environment to availability zone support.
author: anaharris-ms
ms.service: app-service
ms.topic: conceptual
ms.date: 06/08/2022
ms.author: anaharris
ms.reviewer: jordanselig
ms.custom: references_regions
---

# Migrate App Service Environment to availability zone support

This guide describes how to migrate an App Service Environment from non-availability zone support to availability support. We'll take you through the different options for migration.

> [!NOTE]
> This article is about App Service Environment v3, which is used with Isolated v2 App Service plans. Availability zones are only supported on App Service Environment v3. If you're using App Service Environment v1 or v2 and want to use availability zones, you'll need to migrate to App Service Environment v3.

Azure App Service Environment can be deployed across [Availability Zones (AZ)](../availability-zones/az-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across all three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

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

### Important considerations when using availability zones

Traffic is routed to all of your available App Service instances. In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances and spread traffic as needed. If you have [autoscale](../app-service/manage-scale-up.md) configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances. Note that [autoscale behavior is independent of App Service platform behavior](../azure-monitor/autoscale/autoscale-overview.md) and that your autoscale instance count specification doesn't need to be a multiple of three. It's also important to note there's no guarantee that requests for additional instances in a zone-down scenario will succeed since back filling lost instances occurs on a best-effort basis. The recommended solution is to create and configure your App Service plans to account for losing a zone as described in the next section.

Applications that are deployed in an App Service Environment that has availability zones enabled will continue to run and serve traffic even if other zones in the same region suffer an outage. However it's possible that non-runtime behaviors including App Service plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other Availability Zones. Zone redundancy for App Service Environments only ensures continued uptime for deployed applications.

When the App Service platform allocates instances to a zone redundant App Service plan, it uses [best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). An App Service plan will be "balanced" if each zone has either the same number of VMs, or +/- one VM in all of the other zones used by the App Service plan.

## In-region data residency

A zone redundant App Service Environment will only store customer data within the region where it has been deployed. App content, settings, and secrets stored in App Service remain within the region where the zone redundant App Service Environment is deployed.

### How to redeploy

The following steps describe how to enable availability zones.

1. To redeploy and ensure you'll be able to use availability zones, you'll need to be on the App Service footprint that supports availability zones. Create your new App Service Environment in one of the [supported regions](../app-service/environment/overview.md#regions).
1. Ensure the zoneRedundant property (described below) is set to true when creating the new App Service Environment.
1. Create your new App Service plans and apps in the new App Service Environment using your desired deployment method.

You can create an App Service Environment with availability zones using the [Azure CLI](/cli/azure/install-azure-cli), [Azure portal](https://portal.azure.com), or an [Azure Resource Manager (ARM) template](../azure-resource-manager/templates/overview.md).

To enable availability zones using the Azure CLI, include the `--zone-redundant` parameter when you create your App Service Environment.

```azurecli
az appservice ase create --resource-group MyResourceGroup --name MyAseName --zone-redundant --vnet-name MyVNet --subnet MySubnet --kind asev3 --virtual-ip-type Internal
```

To create an App Service Environment with availability zones using the Azure portal, enable the zone redundancy option during the "Create App Service Environment v3" experience on the Hosting tab.

The only change needed in an Azure Resource Manager template to specify an App Service Environment with availability zones is the ***zoneRedundant*** property on the [Microsoft.Web/hostingEnvironments](/azure/templates/microsoft.web/hostingEnvironments?tabs=json) resource. The ***zoneRedundant*** property should be set to ***true***.

```json
"resources": [
  {
    "apiVersion": "2019-08-01",
    "type": "Microsoft.Web/hostingEnvironments",
    "name": "MyAppServiceEnvironment",
    "kind": "ASEV3",
    "location": "West US 3",
    "properties": {
      "name": "MyAppServiceEnvironment",
      "location": "West US 3",
      "dedicatedHostCount": "0",
      "zoneRedundant": true,
      "InternalLoadBalancingMode": 0,
      "virtualNetwork": {
        "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/MyResourceGroup/providers/Microsoft.Network/virtualNetworks/MyVNet/subnets/MySubnet"
      }
    }
  }
]
```

## Pricing

There's a minimum charge of nine App Service plan instances in a zone redundant App Service Environment. There's no added charge for availability zone support if you have nine or more instances. If you have fewer than nine instances (of any size) across App Service plans in the zone redundant App Service Environment, you're charged for the difference between nine and the running instance count. This difference is billed as Windows I1v2 instances.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about availability zones](az-overview.md)