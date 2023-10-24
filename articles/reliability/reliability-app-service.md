---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service
author: anaharris-ms 
ms.author: anaharris
ms.topic: overview
ms.custom: subject-reliability
ms.service: app-service
ms.date: 09/26/2023
---

# Reliability in Azure App Service

This article describes reliability support in [Azure App Service](../app-service/overview.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region disaster recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends; and adds the power of Microsoft Azure to your application, such as:

- Security
- Load balancing
- Autoscaling
- Automated management

To explore how Azure App Service can bolster the reliability and resiliency of your application workload, see [Why use App Service?](../app-service/overview.md#why-use-app-service)

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
To enhance the resiliency and reliability of your business-critical workloads, it's recommended that you deploy your new App Service Plans with zone-redundancy. Follow the steps to [redeploy to availability zone support](#create-a-resource-with-availability-zone-enabled), configure your pipelines to redeploy your WebApp on the new App Services Plan, and then use a [Blue-Green deployment](/azure/spring-apps/concepts-blue-green-deployment-strategies) approach to failover to the new site.

By distributing your applications across multiple availability zones, you can ensure their continued operation even in the event of a datacenter-level failure. For more information on availability zone support in Azure App Service, see [Availability zone support](#availability-zone-support).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app-service-plan/code/asp-1/asp-1.kql":::

----

### Resiliency
 
#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **ASP-2 -Use an App Service plan that supports availability zones**

Availability zone support is only available on certain App Service plans. To see which plan you need in order to use availability zones, see [Availability zone prerequisites](#prerequisites).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app-service-plan/code/asp-2/asp-2.kql":::

----

#### :::image type="icon" source="media/icon-recommendation-high.svg"::: **ASP-4 - Create separate App Service plans for production and test** 

To enhance the resiliency and reliability of your business-critical workloads, you should migrate your existing App Service plans and App Service Environments to availability zone support. By distributing your applications across multiple availability zones, you can ensure their continued operation even in the event of a datacenter-level failure. For more information on availability zone support in Azure App Service, see [Availability zone support](#availability-zone-support).


### Scalability
 
#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **ASP-3 - Avoid frequently scaling up or down** 

It's recommended that you avoid frequently scaling up or down your Azure App Service instances. Instead, choose an appropriate tier and instance size that can handle your typical workload, and scale out the instances to accommodate changes in traffic volume. Scaling up or down can potentially trigger an application restart, which may result in service disruptions.


#### :::image type="icon" source="media/icon-recommendation-medium.svg"::: **ASP-5 - Enable Autoscale/Automatic scaling to ensure that adequate resources are available to service requests** 

It's recommended that you enable autoscale/automatic scaling for your Azure App Service to ensure that sufficient resources are available to handle incoming requests. Autoscaling is rule based scaling, while automatic scaling performs automatic in and out scaling based on HTTP traffic. For more information see, [automatic scaling in Azure App Service](/azure/app-service/manage-automatic-scaling) or [get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started).

# [Azure Resource Graph](#tab/graph)

:::code language="kusto" source="~/azure-proactive-resiliency-library/docs/content/services/web/app-service-plan/code/asp-5/asp-5.kql":::

----

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure App Service can be deployed across [availability zones (AZ)](../reliability/availability-zones-overview.md) to help you achieve resiliency and reliability for your business-critical workloads. This architecture is also known as zone redundancy.

When you configure to be zone redundant, the platform automatically spreads the instances of the Azure App Service plan across three zones in the selected region. This means that the minimum App Service Plan instance count will always be three. If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. Otherwise, instance counts beyond 3*N are spread across the remaining one or two zones.

Availability zone support is a property of the App Service plan. App Service plans can be created on managed multi-tenant environment or dedicated environment using App Service Environment v3. To Learn more regarding App Service Environment v3, see [App Service Environment v3 overview](../app-service/environment/overview.md).

For App Services that aren't configured to be zone redundant, VM instances are not zone resilient and can experience downtime during an outage in any zone in that region.

For information on enterprise deployment architecture, see [High availability enterprise deployment using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

### Prerequisites

The current requirements/limitations for enabling availability zones are:

- Both Windows and Linux are supported.

- Availability zones are only supported on the newer App Service footprint. Even if you're using one of the supported regions, you'll receive an error if availability zones aren't supported for your resource group. To ensure your workloads land on a stamp that supports availability zones, you may need to create a new resource group, App Service plan, and App Service.

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

#### Deploy a zone-redundant App Service using a dedicated environment

To learn how to create an App Service Environment v3 on the Isolated v2 plan, see [Create an App Service Environment](../app-service/environment/creation.md).

#### Troubleshooting

|Error message      |Description  |Recommendation  |
|---------|---------|----------|
|Zone redundancy is not available for resource group 'RG-NAME'. Please deploy app service plan 'ASP-NAME' to a new resource group.     |Availability zones are only supported on the newer App Service footprint. Even if you're using one of the supported regions, you'll receive an error if availability zones aren't supported for your resource group.      |To ensure your workloads land on a stamp that supports availability zones, create a new resource group, App Service plan, and App Service.  |

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

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

This section covers some common strategies for web apps deployed to App Service.

When you create a web app in App Service and choose an Azure region during resource creation, it's a single-region app. When the region becomes unavailable during a disaster, your application also becomes unavailable. If you create an identical deployment in a secondary Azure region using a multi-region geography architecture, your application becomes less susceptible to a single-region disaster, which guarantees business continuity. Any data replication across the regions lets you recover your last application state.

For IT, business continuity plans are largely driven by Recovery Time Objective (RTO) and Recovery Point Objective (RPO). For more information on RTO and RPO, see [Recovery objectives](./disaster-recovery-overview.md#recovery-objectives).

Normally, maintaining an SLA around RTO is impractical for regional disasters, and you would typically design your disaster recovery strategy around RPO alone (i.e. focus on recovering data and not on minimizing interruption). With Azure, however, it's not only practical but can even be straightforward to deploy App Service for automatic geo-failovers. This lets you disaster-proof your applications further by taking care of both RTO and RPO.

Depending on your desired RTO and RPO metrics, three disaster recovery architectures are commonly used for both App Service multitenant and App Service Environments.  Each architecture is described in the following table:
 
|Metric| [Active-Active](#active-active-architecture) | [Active-Passive](#active-passive-architecture) | [Passive/Cold](#passive-cold-architecture)|
|-|-|-|-|
|RTO| Real-time or seconds| Minutes| Hours |
|RPO| Real-time or seconds| Minutes| Hours |
|Cost | $$$| $$| $|
|Scenarios| Mission-critical apps| High-priority apps| Low-priority apps|
|Ability to serve multi-region user traffic| Yes| Yes/maybe| No|
|Code deployment | CI/CD pipelines preferred| CI/CD pipelines preferred| Backup and restore |
|Creation of new App Service resources during downtime | Not required | Not required| Required |


>[!NOTE]
>Your application most likely depends on other data services in Azure, such as Azure SQL Database and Azure Storage accounts. It's recommended that you develop disaster recovery strategies for each of these dependent Azure Services as well. For SQL Database, see [Active geo-replication for Azure SQL Database](/azure/azure-sql/database/active-geo-replication-overview). For Azure Storage, see [Azure Storage redundancy](../storage/common/storage-redundancy.md). 



### Disaster recovery in multi-region geography

There are multiple ways to replicate your web apps content and configurations across Azure regions in an active-active or active-passive architecture, such as using [App service backup and restore](../app-service/manage-backup.md). However, backup and restore create point-in-time snapshots and eventually lead to web app versioning challenges across regions.  See the following table below for a comparison between back and restore guidance vs. diaster recovery guidance:

[!INCLUDE [backup-restore-vs-disaster-recovery](../app-service/includes/backup-restore-disaster-recovery.md)]

To avoid the limitations of backup and restore methods, configure your CI/CD pipelines to deploy code to both Azure regions. Consider using [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) or [GitHub Actions](https://docs.github.com/actions). For more information, see [Continuous deployment to Azure App Service](../app-service/deploy-continuous-deployment.md).


#### Outage detection, notification, and management

- It's recommended that you set up monitoring and alerts for your web apps to for timely notifications during a disaster. For more information, see [Application Insights availability tests](../azure-monitor/app/availability-overview.md).

- To manage your application resources in Azure, use an infrastructure-as-Code (IaC) mechanism. In a complex deployment across multiple regions, to manage the regions independently and to keep the configuration synchronized across regions in a reliable manner requires a predictable, testable, and repeatable process. Consider an IaC tool such as [Azure Resource Manager templates](../azure-resource-manager/management/overview.md) or [Terraform](/azure/developer/terraform/overview).


#### Set up disaster recovery and outage detection 

To prepare for disaster recovery in a multi-region geography, you can use either an active-active or active-passive architecture. 

##### Active-Active architecture

In active-active disaster recovery architecture, identical web apps are deployed in two separate regions and Azure Front door is used to route traffic to both the active regions.

:::image type="content" source="../app-service/media/overview-disaster-recovery/active-active-architecture.png" alt-text="Diagram that shows an active-active deployment of App Service.":::

With this example architecture: 

- Identical App Service apps are deployed in two separate regions, including pricing tier and instance count. 
- Public traffic directly to the App Service apps is blocked. 
- Azure Front Door is used to route traffic to both the active regions.
- During a disaster, one of the regions becomes offline, and Azure Front Door routes traffic exclusively to the region that remains online. The RTO during such a geo-failover is near-zero.
- Application files should be deployed to both web apps with a CI/CD solution. This ensures that the RPO is practically zero. 
- If your application actively modifies the file system, the best way to minimize RPO is to only write to a [mounted Azure Storage share](../app-service/configure-connect-to-azure-storage.md) instead of writing directly to the web app's */home* content share. Then, use the Azure Storage redundancy features ([GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage)) for your mounted share, which has an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).


Steps to create an active-active architecture for your web app in App Service are summarized as follows: 

1. Create two App Service plans in two different Azure regions. Configure the two App Service plans identically.

1. Create two instances of your web app, with one in each App Service plan. 

1. Create an Azure Front Door profile with:
    - An endpoint.
    - Two origin groups, each with a priority of 1. The equal priority tells Azure Front Door to route traffic to both regions equally (thus active-active).
    - A route. 

1. [Limit network traffic to the web apps only from the Azure Front Door instance](../app-service/app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance). 

1. Setup and configure all other back-end Azure service, such as databases, storage accounts, and authentication providers. 

1. Deploy code to both the web apps with [continuous deployment](../app-service/deploy-continuous-deployment.md).

[Tutorial: Create a highly available multi-region app in Azure App Service](../app-service/tutorial-multi-region-app.md) shows you how to set up an *active-passive* architecture. The same steps with minimal changes (setting priority to “1” for both origin groups in Azure Front Door) give you an *active-active* architecture.


##### Active-passive architecture

In this disaster recovery approach, identical web apps are deployed in two separate regions and Azure Front door is used to route traffic to one region only (the *active* region).

:::image type="content" source="../app-service/media/overview-disaster-recovery/active-passive-architecture.png" alt-text="A diagram showing an active-passive architecture of Azure App Service.":::

With this example architecture:

- Identical App Service apps are deployed in two separate regions.

- Public traffic directly to the App Service apps is blocked.

- Azure Front Door is used to route traffic to the primary region. 

- To save cost, the secondary App Service plan is configured to have fewer instances and/or be in a lower pricing tier. There are three possible approaches:

    - **Preferred**  The secondary App Service plan has the same pricing tier as the primary, with the same number of instances or fewer. This approach ensures parity in both feature and VM sizing for the two App Service plans. The RTO during a geo-failover only depends on the time to scale out the instances.

    - **Less preferred**  The secondary App Service plan has the same pricing tier type (such as PremiumV3) but smaller VM sizing, with lesser instances. For example, the primary region may be in P3V3 tier while the secondary region is in P1V3 tier. This approach still ensures feature parity for the two App Service plans, but the lack of size parity may require a manual scale-up when the secondary region becomes the active region. The RTO during a geo-failover depends on the time to both scale up and scale out the instances.

    - **Least-preferred**  The secondary App Service plan has a different pricing tier than the primary and lesser instances. For example, the primary region may be in P3V3 tier while the secondary region is in S1 tier. Make sure that the secondary App Service plan has all the features your application needs in order to run. Differences in features availability between the two may cause delays to your web app recovery. The RTO during a geo-failover depends on the time to both scale up and scale out the instances.

- Autoscale is configured on the secondary region in the event the active region becomes inactive. It’s advisable to have similar autoscale rules in both active and passive regions.

- During a disaster, the primary region becomes inactive, and the secondary region starts receiving traffic and becomes the active region.

- Once the secondary region becomes active, the network load triggers preconfigured autoscale rules to scale out the secondary web app.

- You may need to scale up the pricing tier for the secondary region manually, if it doesn't already have the needed features to run as the active region. For example, [autoscaling requires Standard tier or higher](https://azure.microsoft.com/pricing/details/app-service/windows/).

- When the primary region is active again, Azure Front Door automatically directs traffic back to it, and the architecture is back to active-passive as before.

- Application files should be deployed to both web apps with a CI/CD solution. This ensures that the RPO is practically zero. 

- If your application actively modifies the file system, the best way to minimize RPO is to only write to a [mounted Azure Storage share](../app-service/configure-connect-to-azure-storage.md) instead of writing directly to the web app's */home* content share. Then, use the Azure Storage redundancy features ([GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) or [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage)) for your mounted share, which has an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).


Steps to create an active-passive architecture for your web app in App Service are summarized as follows: 

1. Create two App Service plans in two different Azure regions. The secondary App Service plan may be provisioned using one of the approaches mentioned previously.
1. Configure autoscaling rules for the secondary App Service plan so that it scales to the same instance count as the primary when the primary region becomes inactive.
1. Create two instances of your web app, with one in each App Service plan. 
1. Create an Azure Front Door profile with:
    - An endpoint.
    - An origin group with a priority of 1 for the primary region.
    - A second origin group with a priority of 2 for the secondary region. The difference in priority tells Azure Front Door to prefer the primary region when it's online (thus active-passive).
    - A route. 
1. [Limit network traffic to the web apps only from the Azure Front Door instance](../app-service/app-service-ip-restrictions.md#restrict-access-to-a-specific-azure-front-door-instance). 
1. Setup and configure all other back-end Azure service, such as databases, storage accounts, and authentication providers. 
1. Deploy code to both the web apps with [continuous deployment](../app-service/deploy-continuous-deployment.md).

[Tutorial: Create a highly available multi-region app in Azure App Service](../app-service/tutorial-multi-region-app.md) shows you how to set up an *active-passive* architecture.

##### Passive-cold architecture

Use a passive/cold architecture to create and maintain regular backups of your web apps in an Azure Storage account that's located in another region.

With this example architecture:

- A single web app is deployed to a single region.

- The web app is regularly backed up to an Azure Storage account in the same region.

- The cross-region replication of your backups depends on the data redundancy configuration in the Azure storage account. You should set your Azure Storage account as [GZRS](../storage/common/storage-redundancy.md#geo-zone-redundant-storage) if possible. GZRS offers both synchronous zone redundancy within a region and asynchronous in a secondary region. If GZRS isn't available, configure the account as [GRS](../storage/common/storage-redundancy.md#geo-redundant-storage). Both GZRS and GRS have an [RPO of about 15 minutes](../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).

- To ensure that you can retrieve backups when the storage account's primary region becomes unavailable, [**enable read only access to secondary region**](../storage/common/storage-redundancy.md#read-access-to-data-in-the-secondary-region) (making the storage account **RA-GZRS** or **RA-GRS**, respectively). For more information on designing your applications to take advantage of geo-redundancy, see [Use geo-redundancy to design highly available applications](../storage/common/geo-redundant-design.md).

- During a disaster in the web app's region, you must manually deploy all required App Service dependent resources by using the backups from the Azure Storage account, most likely from the secondary region with read access. The RTO may be hours or days.

- To minimize RTO, it's highly recommended that you have a comprehensive playbook outlining all the steps required to restore your web app backup to another Azure Region. 

Steps to create a passive-cold region for your web app in App Service are summarized as follows: 

1. Create an Azure storage account in the same region as your web app. Choose Standard performance tier and select redundancy as Geo-redundant storage (GRS) or Geo-Zone-redundant storage (GZRS).

1. Enable RA-GRS or RA-GZRS (read access for the secondary region). 

1. [Configure custom backup](../app-service/manage-backup.md) for your web app. You may decide to set a schedule for your web app backups, such as hourly.

1. Verify that the web app backup files can be retrieved the secondary region of your storage account.


>[!TIP]
>Aside from Azure Front Door, Azure provides other load balancing options, such as Azure Traffic Manager. For a comparison of the various options, see [Load-balancing options - Azure Architecture Center](/azure/architecture/guide/technology-choices/load-balancing-overview).


### Disaster recovery in single-region geography

If your web app's region doesn't have GZRS or GRS storage or if you are in an  [Azure region that isn't one of a regional pair](cross-region-replication-azure.md#regions-with-availability-zones-and-no-region-pair), you'll need to utilize zone-redundant storage (ZRS) or locally redundant storage (LRS) to create a similar architecture. For example, you can manually create a secondary region for the storage account as follows:

:::image type="content" source="../app-service/media/overview-disaster-recovery/alternative-no-grs-no-gzrs.png" alt-text="Diagram that shows how to create a passive or cold region without GRS or GZRS." lightbox="../app-service/media/overview-disaster-recovery/alternative-no-grs-no-gzrs.png":::

Steps to create a passive-cold region without GRS and GZRS are summarized as follows: 

1. Create an Azure storage account in the same region of your web app. Choose Standard performance tier and select redundancy as zone-redundant storage (ZRS).

1. [Configure custom backup](../app-service/manage-backup.md) for your web app. You may decide to set a schedule for your web app backups, such as hourly.

1. Verify that the web app backup files can be retrieved the secondary region of your storage account.

1. Create a second Azure storage account in a different region. Choose Standard performance tier and select redundancy as locally redundant storage (LRS).

1. By using a tool like [AzCopy](../storage/common/storage-use-azcopy-v10.md#use-in-a-script), replicate your custom backup (Zip, XML and log files) from primary region to the secondary storage. For example: 

    ```
    azcopy copy 'https://<source-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>' 'https://<destination-storage-account-name>.blob.core.windows.net/<container-name>/<blob-path>'
    ```
    You can use [Azure Automation with a PowerShell Workflow runbook](../automation/learn/automation-tutorial-runbook-textual.md) to run your replication script [on a schedule](../automation/shared-resources/schedules.md). Make sure that the replication schedule follows a similar schedule to the web app backups.

## Next steps
- [Tutorial: Create a highly available multi-region app in Azure App Service](/azure/app-service/tutorial-multi-region-app)
- [Reliability in Azure](/azure/availability-zones/overview)




