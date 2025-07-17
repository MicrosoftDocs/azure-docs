---
title: Reliability in Azure App Service Environment
description: Find out about reliability in Azure App Service Environment, including availability zones and multi-region deployments. 
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 07/16/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service Environment works from a reliability perspective and plan resiliency strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service Environment

Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Unlike the App Service public multitenant offering where supporting infrastructure is shared, with App Service Environment, compute is dedicated to a single customer.

Key reliability benefits include dedicated compute resources that aren't shared with other customers, enhanced network isolation for improved security and stability, and the ability to deploy in your own virtual network for greater control over traffic routing and security policies.

This article describes reliability support in [Azure App Service Environment](../app-service/environment/overview.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).


[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

[Enable zone redundancy](#availability-zone-support) on your environment, which requires that your App Service Isolated v2 plans use a minimum of two instances. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

## Reliability architecture overview

To use App Service Environment, you must use the [Isolated v2 pricing tier](/azure/app-service/overview-hosting-plans#isolated-v2). The Isolated v2 pricing tier supports zone redundancy and is designed for high-scale, mission-critical applications.

When you implement [Azure App Service Environment](/azure/app-service/environment/overview), you deploy the environment as the container for your Isolated v2 tier App Service plans and web apps. During the set-up procedure for your environment, you configure core networking settings and optional hardware isolation. You also choose whether or not to support zone redundancy on the environment, if the region supports availability zones.

After you have created your environment, then you can create one or more [Isolated v2 App Service plans](../app-service/overview-hosting-plans.md).

For further information on reliability architecture in Azure App Service, see [Reliability in Azure App Service](./reliability-app-service.md#reliability-architecture-overview).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For information on transient fault handling in Azure App Service, see [Reliability in Azure App Service](./reliability-app-service.md#transient-faults).

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]


Your App Service Environment can be configured as *zone redundant*, which means that your App Service Isolated v2 plans are distributed across multiple availability zones. 

However, you can enable or disable zone redundancy on each plan, regardless of the setting on the App Service Environment. This means that you can have some plans in your environment that are zone redundant and others that aren't.

When you create a zone-redundant Isolated v2 App Service plan in your environment, the instances of your App Service Isolated v2 plan are distributed across the availability zones in the region. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

See [Reliability in Azure App Service](../reliability/reliability-app-service.md#capacity-planning-and-management) for detailed information on zone redundancy in App Service, including:

- [Capacity planning and management](../reliability/reliability-app-service.md#capacity-planning-and-management)
- [Normal operations](../reliability/reliability-app-service.md#normal-operations)
- [Zone-down experience](../reliability/reliability-app-service.md#zone-down-experience) 
- [Failback](../reliability/reliability-app-service.md#failback)
- [Testing for zone failures](../reliability/reliability-app-service.md#testing-for-zone-failures)


### Region support

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).


### Requirements

To enable zone-redundancy for your App Service Environment you must:

- Use [Isolated v2 v2 plan types](/azure/app-service/overview-hosting-plans) and have a minimum of two instances of the plan.

- Deploy a minimum of two instances in your plan.

- Configure your App Service Environment to support zone redundancy. You can do this during the creation of the App Service Environment or by updating an existing environment.

<!-- This section is muddy - not clear what we are doing here. That the scale unit is based on the resource group and that the user needs to check for zr after creating the environment, seems like a crap shoot that may or may not turn up the desired result. Can we clarify the process we want to communicate here?-->
>[!IMPORTANT]
>When you create an App Service Environment, the instance is assigned to a scale unit. The scale unit that you're assigned to is based on the resource group that you deploy an App Service Environment to. To ensure that your environment lands on a scale unit that supports availability zones, you might need to create a new resource group and create a new App Service Environment within a new resource group.
>
>To learn whether or not the App Service Environment supports zone redundancy, see [Check for zone redundancy support for an App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#check-for-zone-redundancy-support-for-an-app-service-environment).

### Cost

When you enable zone redundancy for your App Service Environment, you pay for the additional instances that are created in the availability zones.When you use the App Service Isolated v2 plan, there's no extra cost associated with enabling availability zones as long as you have two or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.


### Configure availability zone support

- **Create a zone-redundant App Service Environment.** 
    - To learn how to create a new zone-redundant App Service Environment, see [Create a new App Service Environment plan with zone redundancy](../app-service/environment/creation.md). Make sure to set **Zone redundancy** to *Enabled*. 
    - To create plans in your App Service Environment, you must use the Isolated v2 pricing tier. To learn how to create an Isolated v2 App Service plan with zone redundancy, see [Configure Isolated v2 App Service plans with zone redundancy](../app-service/environment/configure-zone-redundancy-isolated.md).

- **Enable or disable zone redundancy on an existing App Service Environment.** To learn how to enable or disable zone redundancy on App Service Environment, see [Set zone redundancy for an existing App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#set-zone-redundancy-for-an-existing-app-service-environment). To learn how to enable or disable zone redundancy on an existing Isolated v2 App Service plan inside your environment, see [Set zone redundancy for an existing Isolated v2 App Service plan](../app-service/environment/configure-zone-redundancy-isolated.md#set-zone-redundancy-for-an-existing-isolated-v2-app-service-plan).

> [!NOTE]
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.


## Multi-region support

App Service Environment is a single-region service. If the region becomes unavailable, your application is also unavailable. However, to reduce the risk of a single-region failure affecting your application, deploy across multiple regions. The following steps help strengthen resilience:

- Deploy your environment to the instances in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.


For an example approach that illustrates this architecture, see [High availability enterprise deployment by using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).



## Service-level agreement (SLA)

The service-level agreement (SLA) for App Service Environment describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant App Service Isolated v2 plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)
- For information on Backups in App Service, see [Reliability in Azure App Service - Backups](../reliability/reliability-app-service.md#backups).
- For service maintenance in Azure App Service, see [Reliability in Azure App Service - Service maintenance](../reliability/reliability-app-service.md#reliability-during-service-maintenance).
