---
title: Azure Functions availability zone support on Elastic Premium plans
description: Learn how to use availability zone redundancy with Azure Functions for high-availability function applications on Elastic Premium plans.
ms.topic: conceptual
ms.author: johnguo, thalme
ms.date: 08/29/2022
ms.custom: references_regions
# Goal: Introduce AZ Redundancy in Azure Functions Elastic Premium plans to customers + a tutorial on how to get started with ARM templates
---

# Azure Functions support for availability zone redundancy

Azure function apps in the Premium plan can be deployed into availability zones to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

Availability zones (AZ) support for Azure Functions is available on Premium (Elastic Premium) and Dedicated (App Service) plans. A zone-redundant function app plan automatically balances its instances between availability zones for higher availability. This article focuses on zone redundancy support for Premium plans. For zone redundancy on Dedicated plans, refer [here](../availability-zones/migrate-app-service.md).

[!INCLUDE [functions-premium-plan-note](../../includes/functions-premium-plan-note.md)]

## Overview

An [availability zone](../availability-zones/az-overview.md#availability-zones) is a high-availability offering that protects your applications and data from datacenter failures. Availability zones are unique physical locations within an Azure region. Each zone comprises one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there's a minimum of three separate zones in all enabled regions. You can build high-availability into your application architecture by co-locating your compute, storage, networking, and data resources within a zone and replicating into other zones.

A zone redundant function app automatically distributes the instances your app runs on between the availability zones in the region. For apps running in a zone-redundant Premium plan, even as the app scales in and out, the instances the app is running on are still evenly distributed between availability zones.

A Premium plan exists in a single scale unit. Function apps are zonal services, which means that function apps can be deployed using one of the following methods:

- For function apps that aren't configured to be zone redundant, the instances are placed in a single zone that is selected by the platform in the selected region.
- For function apps that are configured to be zone redundant, the platform automatically spreads the instances in the Premium plan across all three zones in the selected region. If an instance count is larger than three and the number of instances is divisible by three, the instances will be spread evenly. Otherwise, instance counts beyond 3*N will get spread across the remaining one or two zones.

## Important considerations when using availability zones

All of your available function app instances are enabled and processing events. In the case when a zone goes down, the functions platform will detect lost instances and automatically attempt to find new replacement instances as needed. [Elastic scale behavior](functions-premium-plan.md#rapid-elastic-scale) still applies but it's important to note there's no guarantee that requests for additional instances in a zone-down scenario will succeed since back filling lost instances occurs on a best-effort basis.

Applications that are deployed in an Premium plan that has availability zones enabled will continue to run even if other zones in the same region suffer an outage. However it's possible that non-runtime behaviors including Premium plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other Availability Zones. Zone redundancy for Premium plans only ensures continued uptime for deployed applications.

When the function app platform allocates instances to a zone redundant Premium plan, it uses [best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). A Premium plan will be "balanced" if each zone has either the same number of VMs, or +/- one VM in all of the other zones used by the Premium plan.

## Requirements

Availability zone support is a property of the Premium plan. The following are the current requirements/limitations for enabling availability zones:

- Availability zones can only be specified when creating a **new** Premium plan. A pre-existing Premium plan can't be converted to use availability zones.
- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [storage account](storage-considerations.md#storage-account-requirements). If you use a different type of storage account, Functions may show unexpected behavior during a zonal outage.
- Both Windows and Linux are supported.
- Must be hosted on an [Elastic Premium](functions-premium-plan.md) or Dedicated hosting plan. Instructions on zone redundancy with Dedicated hosting plan can be found [in this article](../availability-zones/migrate-app-service.md).
  - Availability zone (AZ) support isn't currently available for function apps on [Consumption](consumption-plan.md) plans.
- Function apps hosted on a Premium plan must have a minimum [always ready instances](functions-premium-plan.md#always-ready-instances) count of three.
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three.
- If you aren't using Premium plan or a scale unit that supports availability zones, are in an unsupported region, or are unsure, see the [migration guidance](#migration-guidance-redeployment).

## Regional availability

Zone-redundant Premium plans can currently be enabled in any of the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| Brazil South     | France Central       | Qatar Central |                    | Australia East |
| Canada Central   | Germany West Central |               |                    | Central India  |
| Central US       | North Europe         |               |                    | China North 3  |
| East US          | Sweden Central       |               |                    | Japan East     |
| East US 2        | UK South             |               |                    | Southeast Asia |
| South Central US | West Europe          |               |                    | East Asia      |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                |

## How to deploy a function app on a zone redundant Premium plan

There are currently two ways to deploy a zone-redundant Premium plan and function app. You can use either the [Azure portal](https://portal.azure.com) or an ARM template.

# [Azure portal](#tab/azure-portal)

1. Open the Azure portal and navigate to the **Create Function App** page. Information on creating a function app in the portal can be found [here](functions-create-function-app-portal.md#create-a-function-app).

1. In the **Basics** page, fill out the fields for your function app. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Region** | Preferred region | The subscription under which this new function app is created. You must pick a region that is AZ enabled from the [list above](#requirements). |

    ![Screenshot of Basics tab of function app create page.](./media/functions-az-redundancy\azure-functions-basics-az.png)

1. In the **Hosting** page, fill out the fields for your function app hosting plan. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Storage Account** | A [zone-redundant storage account](storage-considerations.md#storage-account-requirements) | As mentioned above in the [requirements](#requirements) section, we strongly recommend using a zone-redundant storage account for your zone redundant function app. |
    | **Plan Type** | Functions Premium | This article details how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. Information on zone redundancy on app service plans can be found [in this article](../availability-zones/migrate-app-service.md). |
    | **Zone Redundancy** | Enabled | This field populates the flag that determines if your app is zone redundant or not. You won't be able to select `Enabled` unless you have chosen a region supporting zone redundancy, as mentioned in step 2. |

    ![Screenshot of Hosting tab of function app create page.](./media/functions-az-redundancy\azure-functions-hosting-az.png)

1. For the rest of the function app creation process, create your function app as normal. There are no fields in the rest of the creation process that affect zone redundancy.

# [ARM template](#tab/arm-template)

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. A guide to hosting Functions on Premium plans can be found [here](functions-infrastructure-as-code.md#deploy-on-premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the new `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability/fault tolerance strategies. A good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an elastic premium, zone-redundant plan must have a minimum [always ready instance](functions-premium-plan.md#always-ready-instances) count of 3. This make sure that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Below is an ARM template snippet for a zone-redundant, Premium plan showing the `zoneRedundant` field and the `capacity` specification.

```json
"resources": [
    {
        "type": "Microsoft.Web/serverfarms",
        "apiVersion": "2021-01-15",
        "name": "your_plan_name_here",
        "location": "your_region_name_here",
        "sku": {
            "name": "EP1",
            "tier": "ElasticPremium",
            "size": "EP1",
            "family": "EP", 
            "capacity": 3
        },
        "kind": "elastic",
        "properties": {
            "perSiteScaling": false,
            "elasticScaleEnabled": true,
            "maximumElasticWorkerCount": 20,
            "isSpot": false,
            "reserved": false,
            "isXenon": false,
            "hyperV": false,
            "targetWorkerCount": 0,
            "targetWorkerSizeId": 0, 
            "zoneRedundant": true
        }
    }
]
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](functions-infrastructure-as-code.md).

---

After the zone-redundant plan is created and deployed, any function app hosted on your new plan is considered zone-redundant.

## Migrate your function app to a zone-redundant plan

This section describes how to migrate the public multi-tenant Premium plan from non-availability zone to availability zone support. We'll take you through the different considerations for migration.

### Downtime requirements

Downtime will be dependent on how you decide to carry out the migration. Since you can't convert pre-existing Premium plans to use availability zones, migration will consist of a side-by-side deployment where you'll create new Premium plans. Downtime will depend on how you choose to redirect traffic from your old to your new availability zone enabled function app. For example, for HTTP based functions if you're using an [Application Gateway](../app-service/networking/app-gateway-with-service-endpoints.md), a [custom domain](../app-service/app-service-web-tutorial-custom-domain.md), or [Azure Front Door](../frontdoor/front-door-overview.md), downtime will be dependent on the time it takes to update those respective services with your new app's information. Alternatively, you can route traffic to multiple apps at the same time using a service such as [Azure Traffic Manager](../app-service/web-sites-traffic-manager.md) and only fully cutover to your new availability zone enabled apps when everything is deployed and fully tested. You can also [write defensive functions](performance-reliability.md#write-defensive-functions) to ensure messages are not lost during the migration for non-HTTP functions.

### Migration guidance: Redeployment

If you want your function app to use availability zones, redeploy your apps into newly created availability zone enabled function app plans.

### How to redeploy

The following steps describe how to enable availability zones.

1. To redeploy and ensure you'll be able to use availability zones, you'll need to be on the function app footprint that supports availability zones. If you're already using the Premium SKU and are in one of the [supported regions](#regional-availability), you can move on to the next step. Otherwise, you should create a new resource group in one of the supported regions to ensure the function app control plane can find a scale unit in the selected region that supports availability zones.
1. Create a new Premium plan in one of the supported regions using the **new** resource group. Ensure the [new Premium plan has zone redundancy enabled](#how-to-deploy-a-function-app-on-a-zone-redundant-premium-plan).
1. Create and deploy your apps into the new Premium plan using your desired [deployment method](functions-deployment-technologies.md).
1. After testing and enabling the new apps, you can optionally disable or delete your non availability zone apps.

## Pricing

There's no additional cost associated with enabling availability zones. Pricing for a zone redundant Premium plan is the same as a single zone Premium plan. You'll be charged based on your Premium plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform will enforce a minimum instance count of three and charge you for those three instances.

## Next steps

> [!div class="nextstepaction"]
> [Learn about the Azure Functions Premium plan](functions-premium-plan.md)

> [!div class="nextstepaction"]
> [Improve the performance and reliability of Azure Functions](performance-reliability.md)

> [!div class="nextstepaction"]
> [Learn how to deploy Azure Functions](functions-deployment-technologies.md)

> [!div class="nextstepaction"]
> [ARM Quickstart Templates](https://azure.microsoft.com/resources/templates/)

> [!div class="nextstepaction"]
> [Azure Functions geo-disaster recovery](functions-geo-disaster-recovery.md)