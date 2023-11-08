---
title: Reliability in Azure Functions
description: Find out about reliability in Azure Functions
author: anaharris-ms
ms.author: anaharris
ms.topic: conceptual
ms.service: azure-functions
ms.custom: references_regions, subject-reliability
ms.date: 08/24/2023
#Customer intent: I want to understand reliability support in Azure Functions so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Functions

This article describes reliability support in [Azure Functions](../azure-functions/functions-overview.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Availability zone support for Azure Functions is available on both Premium (Elastic Premium) and Dedicated (App Service) plans.  This article focuses on zone redundancy support for Premium plans. For zone redundancy on Dedicated plans, see [Migrate App Service to availability zone support](migrate-app-service.md).


## Availability zone support


[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Functions supports both [zone-redundant and zonal instances](availability-zones-service-support.md#azure-services-with-availability-zone-support). 

- **Zonal**. Function app instances are placed in a single zone that's selected by the platform in the selected region. A zonal function app is isolated from any outages that occur in other zones. However, if an outage impacts the specific zone chosen for the function app, the function app won't be available. 

- **Zone-redundant**.  The function app platform automatically spreads the instances in the plan across all zones of the selected region. For example, in a region with three zones, if an instance count is larger than three and the number of instances is divisible by three, the instances are distributed evenly. Otherwise, instance counts beyond 3 * N are distributed across the remaining one or two zones. A zone redundant function app automatically distributes the instances your app runs on between the availability zones in the region. For apps running in a zone-redundant Premium plan, even as the app scales in and out, the instances the app is running on are still evenly distributed between availability zones.

>[!IMPORTANT]
>Azure Functions can run on the Azure App Service platform. In the App Service platform, plans that host Premium plan function apps are referred to as Elastic Premium plans, with SKU names like EP1. If you choose to run your function app on a Premium plan, make sure to create a plan with an SKU name that starts with "E", such as EP1. App Service plan SKU names that start with "P", such as P1V2 (Premium V2 Small plan), are actually [Dedicated hosting plans](../azure-functions/dedicated-plan.md). Because they are Dedicated and not Elastic Premium, plans with SKU names starting with "P" won't scale dynamically and may increase your costs.

<!-- EDITORIAL COMMENT: Function Apps team to list other SKUs that don’t support availability zones -->

### Regional availability

Zone-redundant Premium plans are available in the following regions:

| Americas         | Europe               | Middle East    | Africa             | Asia Pacific   |
|------------------|----------------------|----------------|--------------------|----------------|
| Brazil South     | France Central       | Israel Central | South Africa North | Australia East |
| Canada Central   | Germany West Central | Qatar Central  |                    | Central India  |
| Central US       | Italy North          | UAE North      |                    | China North 3  |
| East US          | North Europe         |                |                    | East Asia      |
| East US 2        | Norway East          |                |                    | Japan East     |
| South Central US | Sweden Central       |                |                    | Southeast Asia |
| West US 2        | Switzerland North    |                |                    |                |
| West US 3        | UK South             |                |                    |                |
|                  | West Europe          |                |                    |                |

### Prerequisites

Availability zone support is a property of the Premium plan. The following are the current requirements/limitations for enabling availability zones:

- You can only enable availability zones when creating a Premium plan for your function app. You can't convert an existing Premium plan to use availability zones.
- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [storage account](../azure-functions/storage-considerations.md#storage-account-requirements). If you use a different type of storage account, Functions can show unexpected behavior during a zonal outage.
- Both Windows and Linux are supported.
- Must be hosted on an [Elastic Premium](../azure-functions/functions-premium-plan.md) or Dedicated hosting plan. To learn how to use zone redundancy with a Dedicated plan, see [Migrate App Service to availability zone support](../availability-zones/migrate-app-service.md).
  - Availability zone support isn't currently available for function apps on [Consumption](../azure-functions/consumption-plan.md) plans.
- Function apps hosted on a Premium plan must have a minimum [always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances) count of three.
  - The platform enforces this minimum count behind the scenes if you specify an instance count fewer than three.
- If you aren't using Premium plan or a scale unit that supports availability zones, are in an unsupported region, or are unsure, see the [migration guidance](../reliability/migrate-functions.md).

### Pricing

There's no extra cost associated with enabling availability zones. Pricing for a zone redundant Premium plan is the same as a single zone Premium plan. You are charged based on your Premium plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform enforces a minimum instance count of three and charge you for those three instances.

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

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. To learn how to deploy function apps to a Premium plan, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md?pivots=premium-plan).

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

Azure Function Apps currently doesn't support in-place migration of existing function apps instances. For information on how to migrate the public multitenant Premium plan from non-availability zone to availability zone support, see [Migrate App Service to availability zone support](../reliability/migrate-functions.md).

### Zone down experience

All available function app instances of zone-redundant function apps are enabled and processing events. When a zone goes down, Functions detect lost instances and automatically attempts to find new replacement instances if needed. Elastic scale behavior still applies. However, in a zone-down scenario there's no guarantee that requests for additional instances can succeed, since back-filling lost instances occurs on a best-effort basis.
Applications that are deployed in an availability zone enabled Premium plan continue to run even when other zones in the same region suffer an outage. However, it's possible that non-runtime behaviors could still be impacted from an outage in other availability zones. These impacted behaviors can include Premium plan scaling, application creation, application configuration, and application publishing. Zone redundancy for Premium plans only guarantees continued uptime for deployed applications.

When Functions allocates instances to a zone redundant Premium plan, it uses best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets. A Premium plan is considered balanced when each zone has either the same number of VMs (± 1 VM) in all of the other zones used by the Premium plan.

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

This section explains some of the strategies that you can use to deploy Functions to allow for disaster recovery.

### Multi-region disaster recovery

Because there is no built-in redundancy available, functions run in a function app in a specific Azure region. To avoid loss of execution during outages, you can redundantly deploy the same functions to function apps in multiple regions.  To learn more about multi-region deployments, see the guidance in [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).
 
When you run the same function code in multiple regions, there are two patterns to consider, [active-active](#active-active-pattern-for-http-trigger-functions) and [active-passive](#active-passive-pattern-for-non-https-trigger-functions).

#### Active-active pattern for HTTP trigger functions

With an active-active pattern, functions in both regions are actively running and processing events, either in a duplicate manner or in rotation. It's recommended that you use an active-active pattern in combination with [Azure Front Door](../frontdoor/front-door-overview.md) for your critical HTTP triggered functions, which can route and round-robin HTTP requests between functions running in multiple regions. Front door can also periodically check the health of each endpoint. When a function in one region stops responding to health checks, Azure Front Door takes it out of rotation, and only forwards traffic to the remaining healthy functions.  

![Architecture for Azure Front Door and Function](../azure-functions/media/functions-geo-dr/front-door.png)  


>[!IMPORTANT]
>Although, it's highly recommended that you use the [active-passive pattern](#active-passive-pattern-for-non-https-trigger-functions) for non-HTTPS trigger functions. You can create active-active deployments for non-HTTP triggered functions. However, you need to consider how the two active regions interact or coordinate with one another. When you deploy the same function app to two regions with each triggering on the same Service Bus queue, they would act as competing consumers on de-queueing that queue. While this means each message is only being processed by either one of the instances, it also means there's still a single point of failure on the single Service Bus instance. 
>
>You could instead deploy two Service Bus queues, with one in a primary region, one in a secondary region. In this case, you could have two function apps, with each pointed to the Service Bus queue active in their region. The challenge with this topology is how the queue messages are distributed between the two regions.  Often, this means that each publisher attempts to publish a message to *both* regions, and each message is processed by both active function apps. While this creates the desired active/active pattern, it also creates other challenges around duplication of compute and when or how data is consolidated. 


### Active-passive pattern for non-HTTPS trigger functions

It's recommended that you use active-passive pattern for your event-driven, non-HTTP triggered functions, such as Service Bus and Event Hubs triggered functions.

To create redundancy for non-HTTP trigger functions, use an active-passive pattern. With an active-passive pattern, functions run actively in the region that's receiving events; while the same functions in a second region remain idle. The active-passive pattern provides a way for only a single function to process each message while providing a mechanism to fail over to the secondary region in a disaster. Function apps work with the failover behaviors of the partner services, such as [Azure Service Bus geo-recovery](../service-bus-messaging/service-bus-geo-dr.md) and [Azure Event Hubs geo-recovery](../event-hubs/event-hubs-geo-dr.md). 

Consider an example topology using an Azure Event Hubs trigger. In this case, the active/passive pattern requires involve the following components:

* Azure Event Hubs deployed to both a primary and secondary region.
* [Geo-disaster enabled](../service-bus-messaging/service-bus-geo-dr.md) to pair the primary and secondary event hubs. This also creates an _alias_ you can use to connect to event hubs and switch from primary to secondary without changing the connection info.
* Function apps are deployed to both the primary and secondary (failover) region, with the app in the secondary region essentially being idle because messages aren't being sent there.
* Function app triggers on the *direct* (non-alias) connection string for its respective event hub. 
* Publishers to the event hub should publish to the alias connection string. 

![Active-passive example architecture](../azure-functions/media/functions-geo-dr/active-passive.png)

Before failover, publishers sending to the shared alias route to the primary event hub. The primary function app is listening exclusively to the primary event hub. The secondary function app is passive and idle. As soon as failover is initiated, publishers sending to the shared alias are routed to the secondary event hub. The secondary function app now becomes active and starts triggering automatically.  Effective failover to a secondary region can be driven entirely from the event hub, with the functions becoming active only when the respective event hub is active.

Read more on information and considerations for failover with [Service Bus](../service-bus-messaging/service-bus-geo-dr.md) and [Event Hubs](../event-hubs/event-hubs-geo-dr.md).


## Next steps

- [Create Azure Front Door](../frontdoor/quickstart-create-front-door.md)
- [Event Hubs failover considerations](../event-hubs/event-hubs-geo-dr.md#considerations)
- [Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
- [Reliability in Azure](./overview.md)
