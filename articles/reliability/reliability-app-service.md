---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service
author: anaharris-ms 
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: app-service
ms.date: 07/26/2023 
---


# Reliability in Azure App Service

This article describes reliability support in [Azure App Service](../app-service/overview.md), and covers intra-regional resiliency with [availability zones](#availability-zone-support). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends; and adds the power of Microsoft Azure to your application, such as:

- Security
- Load balancing
- Autoscaling
- Automated management

To explore how Azure App Service can bolster the resiliency of your application workload, see [Why use App Service?](../app-service/overview.md#why-use-app-service)

## Reliability recommendations

[!INCLUDE [Reliability recommendations](includes/reliability-recommendations-include.md)]
 
### Reliability recommendations summary

| Category | Priority |Recommendation |  
|---------------|--------|---|
| [**High Availability**](#high-availability) |:::image type="icon" source="media/icon-recommendation-high.svg":::| [ASP-1 - Deploy zone-redundant App Service plans](#-asp-1---deploy-zone-redundant-app-service-plans) |
|[**Resiliency**](#resiliency)|:::image type="icon" source="media/icon-recommendation-high.svg"::: |[ASP-2 -Use an App Service plan that supports availability zones](#-asp-2--use-an-app-service-plan-that-supports-availability-zones) | 
||:::image type="icon" source="media/icon-recommendation-high.svg"::: |[ASP-4 - Create separate App Service plans for production and test](#-asp-4---create-separate-app-service-plans-for-production-and-test) | 
|[**Scalability**](#scalability)|:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[ASP-3 - Avoid frequently scaling up or down](#-asp-3---avoid-frequently-scaling-up-or-down) | 
||:::image type="icon" source="media/icon-recommendation-medium.svg"::: |[ASP-5 - Enable Autoscale/Automatic scaling to ensure adequate resources are available to service requests](#-asp-5---enable-autoscaleautomatic-scaling-to-ensure-that-adequate-resources-are-available-to-service-requests) | 


### High availability
 
#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **ASP-1 - Deploy zone-redundant App Service plans** 
as zone-redundant. Follow the steps to [redeploy to availability zone support](#create-a-resource-with-availability-zone-enabled), configure your pipelines to redeploy your WebApp on the new App Services Plan, and then use a [Blue-Green deployment](/azure/spring-apps/concepts-blue-green-deployment-strategies) approach to failover to the new site.

By distributing your applications across multiple availability zones, you can ensure their continued operation even in the event of a datacenter-level failure. For more information on availability zone support in Azure App Service, see [Availability zone support](#availability-zone-support).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app service plan/code/asp-1/asp-1.kql":::

----

### Resiliency
 
#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **ASP-2 -Use an App Service plan that supports availability zones**

Availability zone support is only available on certain App Service plans. To see which plan you need in order to use availability zones, see [Availability zone prerequisites](#prerequisites).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app service plan/code/asp-2/asp-2.kql":::

----

#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **ASP-4 - Create separate App Service plans for production and test** 

To enhance the resiliency and reliability of your business-critical workloads, you should migrate your existing App Service plans and App Service Environments to availability zone support. By distributing your applications across multiple availability zones, you can ensure their continued operation even in the event of a datacenter-level failure. For more information on availability zone support in Azure App Service, see [Availability zone support](#availability-zone-support).


### Scalability
 
#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **ASP-3 - Avoid frequently scaling up or down** 

It's recommended that you avoid frequently scaling up or down your Azure App Service instances. Instead, choose an appropriate tier and instance size that can handle your typical workload, and scale out the instances to accommodate changes in traffic volume. Scaling up or down can potentially trigger an application restart, which may result in service disruptions.


#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **ASP-5 - Enable Autoscale/Automatic scaling to ensure that adequate resources are available to service requests** 

It's recommended that you enable autoscale/automatic scaling for your Azure App Service to ensure that sufficient resources are available to handle incoming requests. Autoscaling is rule based scaling, while automatic scaling performs automatic in and out scaling based on HTTP traffic. For more information see, [automatic scaling in Azure App Service](/azure/app-service/manage-automatic-scaling) or [get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app service plan/code/asp-5/asp-5.kql":::

----

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure App Service can be deployed across [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

Availability zone support is a property of the App Service plan. App Service plans can be created on managed multi-tenant environment or dedicated environment using App Service Environment. To Learn more regarding App Service Environment, see [App Service Environment v3 overview](../app-service/environment/overview.md).

For App Services that aren't configured to be zone redundant, VM instances are not zone resilient and can experience downtime during an outage in any zone in that region.

For information on enterprise deployment architecture, see [High availability enterprise deployment using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

### Prerequisites

The current requirements/limitations for enabling availability zones are:

- Both Windows and Linux are supported.

- Your App Services plan must be one of the following plans that support availability zones:

    - In a multi-tenant environment using App Service Premium v2 or Premium v3 plans.
    - In a dedicated environment using App Service Environment v3, which is used with Isolated v2 App Service plans.

- For dedicated environments, your App Service Environment must be v3. 

    >[!IMPORTANT]
    >[App Service Environment v2 and v1 will be retired on 31 August 2024](https://azure.microsoft.com/updates/app-service-environment-v1-and-v2-retirement-announcement/). App Service Environment v3 is easier to use and runs on more powerful infrastructure. To learn more about App Service Environment v3, see [App Service Environment overview](../app-service/environment/overview.md). If you're currently using App Service Environment v2 or v1 and you want to upgrade to v3, please follow the [steps in this article](../app-service/environment/migration-alternatives.md) to migrate to the new version.
     
- Minimum instance count of three zones is enforced. The platform will enforce this minimum count behind the scenes if you specify an instance count fewer than three.

- Availability zones can only be specified when creating a **new** App Service plan. A pre-existing App Service plan can't be converted to use availability zones.
    
- The following regions support Azure App Services running on multi-tenant environments:

    - Australia East
    - Brazil South
    - Canada Central
    - Central India
    - Central US
    - East Asia
    - East US
    - East US 2
    - France Central
    - Germany West Central
    - Japan East
    - Korea Central
    - North Europe
    - Norway East
    - Poland Central
    - Qatar Central
    - South Africa North
    - South Central US
    - Southeast Asia
    - Sweden Central
    - Switzerland North
    - UAE North
    - UK South
    - West Europe
    - West US 2
    - West US 3
    - Microsoft Azure operated by 21Vianet - China North 3
    - Azure Government - US Gov Virginia


- To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

### Create a resource with availability zone enabled

#### To deploy a multi-tenant zone-redundant App Service

# [Azure CLI](#tab/cli)

To enable availability zones using the Azure CLI, include the `--zone-redundant` parameter when you create your App Service plan. You can also include the `--number-of-workers` parameter to specify capacity. If you don't specify a capacity, the platform defaults to three. Capacity should be set based on the workload requirement, but no less than three. A good rule of thumb to choose capacity is to ensure sufficient instances for the application such that losing one zone of instances leaves sufficient capacity to handle expected load.

```azurecli
az appservice plan create --resource-group MyResourceGroup --name MyPlan --sku P1v2 --zone-redundant --number-of-workers 6
```    

> [!TIP]
> To decide instance capacity, you can use the following calculation:
>
> Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.
>

# [Azure portal](#tab/portal)


To create an App Service with availability zones using the Azure portal, enable the zone redundancy option during the "Create Web App" or "Create App Service Plan" experiences.

:::image type="content" source="../app-service/media/how-to-zone-redundancy/zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy enablement using the portal.":::

The capacity/number of workers/instance count can be changed once the App Service Plan is created by navigating to the **Scale out (App Service plan)** settings.

:::image type="content" source="../app-service/media/how-to-zone-redundancy/capacity-portal.png" alt-text="Screenshot of a capacity update using the portal.":::


# [Azure Resource Manager (ARM)](#tab/arm)


The only changes needed in an Azure Resource Manager template to specify an App Service with availability zones are the ***zoneRedundant*** property (required) and optionally the App Service plan instance count (***capacity***) on the [Microsoft.Web/serverfarms](/azure/templates/microsoft.web/serverfarms?tabs=json) resource. The ***zoneRedundant*** property should be set to ***true*** and ***capacity*** should be set based on the same conditions described previously.

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
---

#### To deploy a zone-redundant App Service using a dedicated environment

To learn how to create an App Service Environment v3 on the Isolated v2 plan, see [Create an App Service Environment](../app-service/environment/creation.md).

### Fault tolerance

To prepare for availability zone failure, you should over-provision capacity of service to ensure that the solution can tolerate 1/3 loss of capacity and continue to function without degraded performance during zone-wide outages. Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.

### Zone down experience

Traffic is routed to all of your available App Service instances. In the case when a zone goes down, the App Service platform will detect lost instances and automatically attempt to find new replacement instances and spread traffic as needed. If you have [autoscale](../app-service/manage-scale-up.md) configured, and if it decides more instances are needed, autoscale will also issue a request to App Service to add more instances. Note that [autoscale behavior is independent of App Service platform behavior](../azure-monitor/autoscale/autoscale-overview.md) and that your autoscale instance count specification doesn't need to be a multiple of three. 

>[!NOTE] 
>There's no guarantee that requests for additional instances in a zone-down scenario will succeed. The back filling of lost instances occurs on a best-effort basis. The recommended solution is to create and configure your App Service plans to account for losing a zone as described in the next section.

Applications that are deployed in an App Service plan that has availability zones enabled will continue to run and serve traffic even if other zones in the same region suffer an outage. However it's possible that non-runtime behaviors including App Service plan scaling, application creation, application configuration, and application publishing may still be impacted from an outage in other Availability Zones. Zone redundancy for App Service plans only ensures continued uptime for deployed applications.

When the App Service platform allocates instances to a zone redundant App Service plan, it uses [best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones.md#zone-balancing). An App Service plan will be "balanced" if each zone has either the same number of VMs, or +/- one VM in all of the other zones used by the App Service plan.

### Availability zone migration

You cannot migrate existing App Service instances or environment resources from non-availability zone support to availability zone support. To get support for availability zones, you'll need to [create your resources with availability zones enabled](#create-a-resource-with-availability-zone-enabled).

### Pricing

There's no additional cost associated with enabling availability zones. Pricing for a zone redundant App Service is the same as a single zone App Service. You'll be charged based on your App Service plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform will enforce a minimum instance count of three and charge you for those three instances. For pricing information for App Service Environment v3, see [Pricing](../app-service/environment/overview.md#pricing).


## Next steps

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)


