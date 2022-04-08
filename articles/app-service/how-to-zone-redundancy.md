---
title: Availability Zone support for public multi-tenant App Service
description: Learn how to deploy your App Service so that your apps are zone redundant.
author: seligj95
ms.topic: article
ms.date: 2/8/2022
ms.author: jordanselig
ms.custom: references_regions
---
# Availability Zone support for public multi-tenant App Service

Microsoft Azure App Service can be deployed into [Availability Zones (AZ)](../availability-zones/az-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

An app lives in an App Service plan (ASP), and the App Service plan exists in a single scale unit. When an App Service is configured to be zone redundant, the platform automatically spreads the VM instances in the App Service plan across all three zones in the selected region. If a capacity larger than three is specified and the number of instances is divisible by three, the instances will be spread evenly. Otherwise, instance counts beyond 3*N will get spread across the remaining one or two zones. For App Services that aren't configured to be zone redundant, the VM instances are placed in a single zone in the selected region.

## Requirements

Zone redundancy is a property of the App Service plan. The following are the current requirements/limitations for enabling zone redundancy:

- Both Windows and Linux are supported
- Requires either **Premium v2** or **Premium v3** App Service plans
- Minimum instance count of three
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three
- Can be enabled in any of the following regions:
  - West US 2
  - West US 3
  - Central US
  - East US
  - East US 2
  - Canada Central
  - Brazil South
  - North Europe
  - West Europe
  - Germany West Central
  - France Central
  - UK South
  - Japan East
  - Southeast Asia
  - Australia East
- Zone redundancy can only be specified when creating a **new** App Service plan
  - Currently you can't convert a pre-existing App Service plan. See next bullet for details on how to create a new App Service plan that supports zone redundancy.
- Zone redundancy is only supported in the newer portion of the App Service footprint
  - Currently if you're running on Pv3, then it's possible that you're already on a footprint that supports zone redundancy. In this scenario, you can create a new App Service plan and specify zone redundancy when creating the new App Service plan.
  - If you aren't using Pv3 or a scale unit that supports zone redundancy, are in an unsupported region, or are unsure, follow the steps below:
    - Create a new resource group in a region that is supported
      - This ensures the App Service control plane can find a scale unit in the selected region that supports zone redundancy
    - Create a new App Service plan (and app) in a region of your choice using the **new** resource group
    - Ensure the zoneRedundant property (described below) is set to true when creating the new App Service plan

Traffic is routed to all of your available App Service instances. In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances and spread traffic as needed. If you have [autoscale](manage-scale-up.md) configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances. Note that [autoscale behavior is independent of App Service platform behavior](../azure-monitor/autoscale/autoscale-overview.md) and that your autoscale instance count specification doesn't need to be a multiple of three. It's also important to note there's no guarantee that requests for additional instances in a zone-down scenario will succeed since back filling lost instances occurs on a best-effort basis. The recommended solution is to create and configure your App Service plans to account for losing a zone as described in the next section of this article.

Applications that are deployed in an App Service plan that has zone redundancy enabled will continue to run and serve traffic even if other zones in the same region suffer an outage. However it's possible that non-runtime behaviors including App Service plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other Availability Zones. Zone redundancy for App Service plans only ensures continued uptime for deployed applications.

When the App Service platform allocates instances to a zone redundant App Service plan, it uses [best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). An App Service plan will be "balanced" if each zone has either the same number of VMs, or +/- one VM in all of the other zones used by the App Service plan.

## How to Deploy a Zone Redundant App Service

You can create a zone redundant App Service using the [Azure CLI](/cli/azure/install-azure-cli), [Azure portal](https://portal.azure.com), or an [Azure Resource Manager (ARM) template](../azure-resource-manager/templates/overview.md).

To enable zone redundancy using the Azure CLI, include the `--zone-redundant` parameter when you create your App Service plan. You can also include the `--number-of-workers` parameter to specify capacity. If you don't specify a capacity, the platform defaults to three. Capacity should be set based on the workload requirement, but no less than three. A good rule of thumb to choose capacity is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

```azurecli
az appservice plan create --resource-group MyResourceGroup --name MyPlan --zone-redundant --number-of-workers 6
```

> [!TIP]
> To decide instance capacity, you can use the following calculation:
>
> Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.
>

To create a zone redundant App Service using the Azure portal, enable the zone redundancy option during the "Create Web App" or "Create App Service Plan" experiences.

:::image type="content" source="./media/how-to-zone-redundancy/zone-redundancy-portal.png" alt-text="Image of zone redundancy enablement using the portal.":::

The capacity/number of workers/instance count can be changed once the App Service Plan is created by navigating to the **Scale out (App Service plan)** settings.

:::image type="content" source="./media/how-to-zone-redundancy/capacity-portal.png" alt-text="Image of a capacity update using the portal.":::

The only changes needed in an Azure Resource Manager template to specify a zone redundant App Service are the ***zoneRedundant*** property (required) and optionally the App Service plan instance count (***capacity***) on the [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms?tabs=json) resource. The ***zoneRedundant*** property should be set to ***true*** and ***capacity*** should be set based on the same conditions described previously.

The Azure Resource Manager template snippet below shows the new ***zoneRedundant*** property and ***capacity*** specification.

```json
"resources": [
  {
    "type": "Microsoft.Web/serverfarms",
    "apiVersion": "2018-02-01",
    "name": "your-appserviceplan-name-here",
    "location": "West US 3",
    "sku": {
        "name": "P1v3",
        "tier": "PremiumV3",
        "size": "P1v3",
        "family": "Pv3",
        "capacity": 3
    },
    "kind": "app",
    "properties": {
        "zoneRedundant": true
    }
  }
]
```

## Pricing

There's no additional cost associated with enabling the zone redundancy feature. Pricing for a zone redundant App Service is the same as a single zone App Service. You'll be charged based on your App Service plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable zone redundancy but specify a capacity less than three, the platform will enforce a minimum instance count of three and charge you for those three instances.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to create and deploy ARM templates](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)

> [!div class="nextstepaction"]
> [Learn how to scale up an app in Azure App Service](manage-scale-up.md)

> [!div class="nextstepaction"]
> [Overview of autoscale in Microsoft Azure](../azure-monitor/autoscale/autoscale-overview.md)

> [!div class="nextstepaction"]
> [Manage disaster recovery](manage-disaster-recovery.md)
