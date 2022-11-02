---
title: Reliability in Azure Functions
description: Find out about reliability in Azure Functions
author: anaharris-ms
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.prod: non-product-specific
ms.date: 10/07/2022
---

<!--#Customer intent:  I want to understand reliability support in Azure Functions so that I can respond to and/or avoid failures in order to minimize downtime and data loss. -->


# What is reliability in Azure Functions?

This article describes reliability support in Azure Functions and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and links to information on [cross-region resiliency with disaster recovery](#disaster-recovery-cross-region-failover). For a more detailed overview of reliability in Azure, see [Azure reliability](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview.md).

Availability zone support for Azure Functions is available on both Premium (Elastic Premium) and Dedicated (App Service) plans.  This article focuses on zone redundancy support for Premium plans. For zone redundancy on Dedicated plans, see [Migrate App Service to availability zone support](migrate-app-service.md).


## Availability zone support

Azure availability zones are at least three physically separate groups of datacenters within each Azure region. Datacenters within each zone are equipped with independent power, cooling, and networking infrastructure. In the case of a local zone failure, availability zones are designed so that if one zone is affected, regional services, capacity, and high availability are supported by the remaining two zones.  Failures can range from software and hardware failures to events such as earthquakes, floods, and fires. Tolerance to failures is achieved with redundancy and logical isolation of Azure services. For more detailed information on availability zones in Azure, see [Availability zone service and regional support](az-service-support.md).

There are three types of Azure services that support availability zones: zonal, zone-redundant, and always-available services. You can learn more about these types of services and how they promote resiliency in the [Azure services with availability zone support](az-service-support.md#azure-services-with-availability-zone-support).

Azure Functions supports both [zone-redundant and zonal instances](az-service-support.md#azure-services-with-availability-zone-support). 

- **Zonal**. Function app instances are placed in a single zone that's selected by the platform in the selected region. A zonal function app is isolated from any outages that occur in other zones. However, if an outage impacts the specific zone chosen for the function app, the function app won't be available. 

- **Zone-redundant**.  The function app platform automatically spreads the instances in the plan across all zones of the selected region. For example, in a region with three zones, if an instance count is larger than three and the number of instances is divisible by three, the instances are distributed evenly. Otherwise, instance counts beyond 3 * N are distributed across the remaining one or two zones. A zone redundant function app automatically distributes the instances your app runs on between the availability zones in the region. For apps running in a zone-redundant Premium plan, even as the app scales in and out, the instances the app is running on are still evenly distributed between availability zones.

>[!IMPORTANT]
>Azure Functions can run on the Azure App Service platform. In the App Service platform, plans that host Premium plan function apps are referred to as Elastic Premium plans, with SKU names like EP1. If you choose to run your function app on a Premium plan, make sure to create a plan with an SKU name that starts with "E", such as EP1. App Service plan SKU names that start with "P", such as P1V2 (Premium V2 Small plan), are actually [Dedicated hosting plans](../azure-functions/dedicated-plan.md). Because they are Dedicated and not Elastic Premium, plans with SKU names starting with "P" won't scale dynamically and may increase your costs.

<!-- EDITORIAL COMMENT: Function Apps team to list other SKUs that don’t support availability zones -->

### Regional availability

Zone-redundant Premium plans are available in the following regions:

| Americas         | Europe               | Middle East   | Africa             | Asia Pacific   |
|------------------|----------------------|---------------|--------------------|----------------|
| Brazil South     | France Central       | Qatar Central |                    | Australia East |
| Canada Central   | Germany West Central |               |                    | Central India  |
| Central US       | North Europe         |               |                    | China North 3  |
| East US          | Sweden Central       |               |                    | East Asia      |
| East US 2        | UK South             |               |                    | Japan East     |
| South Central US | West Europe          |               |                    | Southeast Asia |
| West US 2        |                      |               |                    |                |
| West US 3        |                      |               |                    |                |

### Prerequisites

Availability zone support is a property of the Premium plan. The following are the current requirements/limitations for enabling availability zones:

- You can only enable availability zones when creating a Premium plan for your function app. You can't convert an existing Premium plan to use availability zones.
- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [storage account](../azure-functions/storage-considerations.md#storage-account-requirements). If you use a different type of storage account, Functions may show unexpected behavior during a zonal outage.
- Both Windows and Linux are supported.
- Must be hosted on an [Elastic Premium](../azure-functions/functions-premium-plan.md) or Dedicated hosting plan. To learn how to use zone redundancy with a Dedicated plan, see [Migrate App Service to availability zone support](../availability-zones/migrate-app-service.md).
  - Availability zone support isn't currently available for function apps on [Consumption](../azure-functions/consumption-plan.md) plans.
- Function apps hosted on a Premium plan must have a minimum [always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances) count of three.
  - The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three.
- If you aren't using Premium plan or a scale unit that supports availability zones, are in an unsupported region, or are unsure, see the [migration guidance](../reliability/migrate-functions.md).

### Pricing

There's no additional cost associated with enabling availability zones. Pricing for a zone redundant Premium plan is the same as a single zone Premium plan. You'll be charged based on your Premium plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform will enforce a minimum instance count of three and charge you for those three instances.

### Create a zone-redundant Premium plan and function app

There are currently two ways to deploy a zone-redundant Premium plan and function app. You can use either the [Azure portal](https://portal.azure.com) or an ARM template.

# [Azure portal](#tab/azure-portal)

1. Open the Azure portal and navigate to the **Create Function App** page. Information on creating a function app in the portal can be found [here](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).

1. In the **Basics** page, fill out the fields for your function app. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Region** | Preferred region | The subscription under which this new function app is created. You must pick a region that is availability zone enabled from the [list above](#prerequisites). |

    ![Screenshot of Basics tab of function app create page.](../azure-functions/media/functions-az-redundancy\azure-functions-basics-az.png)

1. In the **Hosting** page, fill out the fields for your function app hosting plan. Pay special attention to the fields in the table below (also highlighted in the screenshot below), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for Zone Redundancy |
    | ------------ | ---------------- | ----------- |
    | **Storage Account** | A [zone-redundant storage account](../azure-functions/storage-considerations.md#storage-account-requirements) | As mentioned above in the [prerequisites](#prerequisites) section, we strongly recommend using a zone-redundant storage account for your zone redundant function app. |
    | **Plan Type** | Functions Premium | This article details how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. Information on zone redundancy on app service plans can be found [in this article](../reliability/migrate-app-service.md). |
    | **Zone Redundancy** | Enabled | This field populates the flag that determines if your app is zone redundant or not. You won't be able to select `Enabled` unless you have chosen a region supporting zone redundancy, as mentioned in step 2. |

    ![Screenshot of Hosting tab of function app create page.](../azure-functions/media/functions-az-redundancy\azure-functions-hosting-az.png)

1. For the rest of the function app creation process, create your function app as normal. There are no fields in the rest of the creation process that affect zone redundancy.

# [ARM template](#tab/arm-template)

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. A guide to hosting Functions on Premium plans can be found [here](../azure-functions/functions-infrastructure-as-code.md#deploy-on-premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the new `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability/fault tolerance strategies. A good rule of thumb is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an elastic premium, zone-redundant plan must have a minimum [always ready instance](../azure-functions/functions-premium-plan.md#always-ready-instances) count of 3. This make sure that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Below is an ARM template snippet for a zone-redundant, Premium plan showing the `zoneRedundant` field and the `capacity` specification.

```json
"resources": [
    {
        "type": "Microsoft.Web/serverfarms",
        "apiVersion": "2021-01-15",
        "name": "<YOUR_PLAN_NAME>",
        "location": "<YOUR_REGION_NAME>",
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

To learn more about these templates, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

---

After the zone-redundant plan is created and deployed, any function app hosted on your new plan is considered zone-redundant.

### Migrate your function app to a zone-redundant plan

Azure Function Apps currently doesn't support in-place migration of existing function apps instances. For information on how to migrate the public multi-tenant Premium plan from non-availability zone to availability zone support, see [Migrate App Service to availability zone support](../reliability/migrate-functions.md).

### Zone down experience

All available function app instances of zone-redundant function apps are enabled and processing events. When a zone goes down, Functions detect lost instances and automatically attempts to find new replacement instances if needed. Elastic scale behavior still applies. However, in a zone-down scenario there's no guarantee that requests for additional instances can succeed, since back-filling lost instances occurs on a best-effort basis.
Applications that are deployed in an availability zone enabled Premium plan continue to run even when other zones in the same region suffer an outage. However, it's possible that non-runtime behaviors could still be impacted from an outage in other availability zones. These impacted behaviors can include Premium plan scaling, application creation, application configuration, and application publishing. Zone redundancy for Premium plans only guarantees continued uptime for deployed applications.

When Functions allocates instances to a zone redundant Premium plan, it uses best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets. A Premium plan is considered balanced when each zone has either the same number of VMs (± 1 VM) in all of the other zones used by the Premium plan.

## Disaster recovery: cross region failover

When entire Azure regions or datacenters experience downtime, your mission-critical code needs to continue processing in a different region. See [Azure Functions geo-disaster recovery and high availability](../azure-functions/functions-geo-disaster-recovery.md) for guidance on how to setup a cross region failover