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

[Enable zone redundancy](#availability-zone-support) on your environment, which requires that your App Service plans use a minimum of two instances.

## Reliability architecture overview

When you implement [Azure App Service Environment](/azure/app-service/environment/overview), you deploy the environment as the container for your App Service plans and web apps. During the set-up procedure for your environment, you configure core networking settings and optional hardware isolation. You also choose whether or not to support zone redundancy on the environment, if the region supports availability zones.

After you have created your environment, then you can create one or more App Service plans.

[!INCLUDE [App Service reliability architecture - plan description](includes/app-service/reliability-architecture-plans.md)]

To use App Service Environment, your plans must use the [Isolated v2 pricing tier](/azure/app-service/overview-hosting-plans#isolated-v2). The Isolated v2 pricing tier supports zone redundancy and is designed for high-scale, mission-critical applications.

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Transient fault handling app service description](includes/app-service/reliability-transient-fault-handling-include.md)]

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

Your App Service Environment can be configured as *zone redundant*. You can then configure your App Service plans to also be zone redundant, which means they're distributed across multiple availability zones.

However, you can enable or disable zone redundancy on each plan. This means that you can have some plans in your environment that are zone redundant and others that aren't.

When you create a zone-redundant App Service plan in your environment, the instances of your App Service plan are distributed across the availability zones in the region. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

### Region support

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

### Requirements

To enable zone redundancy for your App Service Environment you must:

- Use [Isolated v2 plan types](/azure/app-service/overview-hosting-plans).

- Deploy a minimum of two instances in your plan.

- Be located on a scale unit that supports availability zones. When you create an App Service Environment, the environment is assigned to a scale unit. The scale unit that you're assigned to is based on the resource group that you deploy an App Service Environment to. If your scale unit doesn't support availability zones, you need to create a new environment in a new resource group.

- Configure your App Service Environment *and* your plans to support zone redundancy. You can enable zone redundancy during the creation of the App Service Environment or by updating an existing environment.

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

During an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service plan, you also improve your resiliency to updates that the App Service platform rolls out. To learn more, see [Reliability during service maintenance](#reliability-during-service-maintenance).

For App Service plans that aren't configured as zone redundant, the underlying VM instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

There's no additional cost to enable zone redundancy on an App Service Environment or its plans. However, zone redundancy for a plan requires that it has two or more instances. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

### Configure availability zone support

To learn how to create, enable, or disable a new zone-redundant App Service Environment and new zone redundant App Service Plans, see  [Configure App Service Environment and Isolated v2 App Service plan for zone redundancy](../app-service/environment/configure-zone-redundancy-environment.md).

> [!NOTE]
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

### Capacity planning and management

[!INCLUDE [Capacity planning and management description](includes/app-service/reliability-capacity-planning-management-include.md)]

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

You can back up your App Service apps to a file by using the App Service backup and restore capabilities.

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Reliability during service maintenance

[!INCLUDE [Reliability during service maintenance description](includes/app-service/reliability-maintenance-include.md)]

**Customize the upgrade cycle.** You to customize the upgrade cycle for an App Service Environment. If you need to validate the effect of upgrades on your workload, consider enabling manual upgrades so you can perform validation and testing on a nonproduction instance before the change rolls out to your production instance.

To learn more about maintenance preferences, see [Upgrade preference for App Service Environment planned maintenance](/azure/app-service/environment/how-to-upgrade-preference).

## Service-level agreement (SLA)

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

[!INCLUDE [SLA description for App Service plans](includes/app-service/reliability-app-service-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in Azure App Service](../reliability/reliability-app-service.md)
