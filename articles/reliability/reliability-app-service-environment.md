---
title: Reliability in Azure App Service Environment
description: Find out about reliability in Azure App Service Environment, including availability zones and multi-region deployments. 
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 07/17/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service Environment works from a reliability perspective and plan resiliency strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service Environment

Azure App Service Environment is an Azure App Service feature that provides a fully isolated and dedicated environment for running App Service apps securely at high scale. Unlike the App Service public multitenant offering where supporting infrastructure is shared, with App Service Environment, compute is dedicated to a single customer.

Key reliability benefits include dedicated compute resources that aren't shared with other customers, enhanced network isolation for improved security and stability, and the ability to deploy in your own virtual network for greater control over traffic routing and security policies.

This article describes reliability support in [Azure App Service Environment](../app-service/environment/overview.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

If you are not using App Service Environment, refer to [Reliability in Azure App Service](./reliability-app-service.md) for more information about reliability support in App Service.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

<!-- John: Do we point to WAF here too?-->
[Enable zone redundancy](#availability-zone-support) on your environment, which requires that your App Service plans use a minimum of two instances. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

## Reliability architecture overview

To use App Service Environment, you must use the [Isolated v2 pricing tier](/azure/app-service/overview-hosting-plans#isolated-v2). The Isolated v2 pricing tier supports zone redundancy and is designed for high-scale, mission-critical applications.

When you implement [Azure App Service Environment](/azure/app-service/environment/overview), you deploy the environment as the container for your App Service plans and web apps. During the set-up procedure for your environment, you configure core networking settings and optional hardware isolation. You also choose whether or not to support zone redundancy on the environment, if the region supports availability zones.

After you have created your environment, then you can create one or more [Isolated v2 App Service plans](../app-service/overview-hosting-plans.md).

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Transient fault handling app service description](includes/app-service/reliability-transient-fault-handling-include.md)]

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

Your App Service Environment can be configured as *zone redundant*. You can then configure your App Service plans to also be zone redundant, which means they're distributed across multiple availability zones.

However, you can enable or disable zone redundancy on each plan, regardless of the setting on the App Service Environment. This means that you can have some plans in your environment that are zone redundant and others that aren't.

When you create a zone-redundant App Service plan in your environment, the instances of your App Service plan are distributed across the availability zones in the region. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).


### Region support

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

### Requirements

To enable zone redundancy for your App Service Environment you must:

- Use [Isolated v2 plan types](/azure/app-service/overview-hosting-plans).

- Deploy a minimum of two instances in your plan.

- Be located on a scale unit that supports availability zones. When you create an App Service Environment, the environment is assigned to a scale unit. The scale unit that you're assigned to is based on the resource group that you deploy an App Service Environment to. If your scale unit doesn't support availability zones, you need to create a new environment in a new resource group.

- Configure your App Service Environment to support zone redundancy. You can do this during the creation of the App Service Environment or by updating an existing environment.

    To learn whether or not the App Service Environment is configured for zone redundancy, see [Check for zone redundancy support for an App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#check-for-zone-redundancy-support-for-an-app-service-environment).

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

During an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service plan, you also improve your resiliency to updates that the App Service platform rolls out. To learn more, see [Reliability during service maintenance](#reliability-during-service-maintenance).

For App Service plans that aren't configured as zone redundant, the underlying VM instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

There's no additional cost to enable zone redundancy on an App Service Environment or its plans. However, zone redundancy for a plan requires that it has two or more instances. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for  those two instances.

### Configure availability zone support

- **Create a zone-redundant App Service Environment.** 
    - To learn how to create a new zone-redundant App Service Environment, see [Create a new App Service Environment plan with zone redundancy](../app-service/environment/creation.md). Make sure to set **Zone redundancy** to *Enabled*. 
    - To create plans in your App Service Environment, you must use the Isolated v2 pricing tier. To learn how to create an Isolated v2 App Service plan with zone redundancy, see [Configure Isolated v2 App Service plans with zone redundancy](../app-service/environment/configure-zone-redundancy-isolated.md).

- **Enable or disable zone redundancy on an existing App Service Environment.** To learn how to enable or disable zone redundancy on App Service Environment, see [Set zone redundancy for an existing App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#set-zone-redundancy-for-an-existing-app-service-environment). To learn how to enable or disable zone redundancy on an existing App Service plan inside your environment, see [Set zone redundancy for an existing Isolated v2 App Service plan](../app-service/environment/configure-zone-redundancy-isolated.md#set-zone-redundancy-for-an-existing-isolated-v2-app-service-plan).

> [!NOTE]
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

### Capacity planning and management

[!INCLUDE [Capacity planning and management description](includes/app-service/reliability-capacity-planning-and-management-include.md)]


### Normal operations

[!INCLUDE [Normal operations description](includes/app-service/reliability-normal-operations-include.md)]

### Zone-down experience

[!INCLUDE [Zone-down experience description](includes/app-service/reliability-zone-down-experience-include.md)]


### Failback

[!INCLUDE [Failback description](includes/app-service/reliability-failback-include.md)]

### Testing for zone failures


[!INCLUDE [Testing for zone failures description](includes/app-service/reliability-testing-for-zone-failures-include.md)]

## Multi-region support

App Service is a single-region service. If the region becomes unavailable, your environment and its plans and apps are also unavailable.

### Alternative multi-region approaches

To reduce the risk of a single-region failure affecting your application, deploy multiple App Service Environments across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the App Service Environments in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

For an example approach that illustrates this architecture, see [High availability enterprise deployment by using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

## Backups

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Reliability during service maintenance

[!INCLUDE [Reliability during service maintenance description](includes/app-service/reliability-maintenance-include.md)]

## Service-level agreement (SLA)

[!INCLUDE [SLA description](includes/reliability-sla-include.md)]

[!INCLUDE [SLA description for App Service plans](includes/app-service/reliability-app-service-sla-include.md)]

When you deploy a zone-redundant App Service plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in Azure App Service](../reliability/reliability-app-service.md)
