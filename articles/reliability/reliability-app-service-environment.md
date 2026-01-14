---
title: Reliability in Azure App Service Environment
description: Learn how to make Azure App Service Environment resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 10/31/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how an App Service Environment works from a reliability perspective and plan both resiliency and recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service Environment

[App Service Environment](../app-service/environment/overview.md) is an Azure App Service feature that provides a fully isolated and dedicated environment to run App Service apps securely at high scale. As an Azure service, App Service Environment provides a range of capabilities to support your reliability requirements.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes reliability support in App Service Environment, including resilience to transient faults, availability zone failures, and region-wide outages. It also describes backup strategies and resilience to service maintenance, and highlights some key information about the App Service Environment service level agreement (SLA).

>[!NOTE]
>Unlike the App Service public multitenant offering that shares supporting infrastructure, an App Service Environment provides dedicated compute resources and enhanced network isolation for a single customer.
>  
>An environment provides the following key reliability benefits:
>
>- Dedicated compute resources that aren't shared with other customers
>- Enhanced network isolation for improved security and stability
>- The ability to deploy in your own virtual network for greater control over traffic routing and security policies
>
>For more information about reliability support in App Service, see [Reliability in App Service](./reliability-app-service.md).

## Production deployment recommendations

We recommend that you [enable zone redundancy](#resilience-to-availability-zone-failures) on your environment and App Service plans, which requires that your plans use a minimum of two instances.

## Reliability architecture overview

When you implement an [App Service Environment](/azure/app-service/environment/overview), you deploy the environment as the container for your App Service plans and web apps. During setup, configure core networking settings and optional hardware isolation. Choose whether to support zone redundancy on the environment if the region supports availability zones.

After you create your environment, you can create one or more App Service plans.

[!INCLUDE [App Service reliability architecture - plan description](includes/app-service/reliability-architecture-plans-include.md)]

To use an App Service Environment, your plans must use the [Isolated v2 pricing tier](/azure/app-service/overview-hosting-plans). This tier supports zone redundancy and high-scale, mission-critical applications.

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview-include.md)]

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Resilience to transient faults - App Service](includes/app-service/reliability-transient-fault-include.md)]

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

You can configure your App Service Environment as *zone redundant*. You can also configure your App Service plans to be zone redundant, which distributes them across multiple availability zones.

However, you can enable or disable zone redundancy on each plan. This means that you can have some plans in your environment that are zone redundant and others that aren't.

When you create a zone-redundant App Service plan in your environment, the instances of your App Service plan are distributed across the availability zones in the region. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

### Requirements

To enable zone redundancy for your App Service Environment, you must meet the following requirements:

- **Region support:** To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

- **Plan type:** Use [Isolated v2 plan types](/azure/app-service/overview-hosting-plans).

- **Minimum number of instances:** Deploy a minimum of two instances in your plan.

- **Scale unit:** Your environment must be deployed to a scale unit that supports availability zones. You don't directly control the scale unit that your environment uses. Instead, when you create an App Service environment, the environment is assigned to a scale unit based on the environment's resource group. To determine whether the scale unit for your App Service Environment supports zone redundancy, [Check for zone redundancy support for an App Service Environment](../app-service/environment/configure-zone-redundancy-environment.md#check-for-zone-redundancy-support-for-an-app-service-environment).

    If your environment is on a scale unit doesn't support availability zones, you can't enable zone redundancy on your environment or plans. Instead, you need to create a new environment in a new resource group, and redeploy your apps to new plans within that environment.

- **Configuration requirements:** Configure both your App Service Environment and your plans to support zone redundancy. You can enable zone redundancy during the creation of the environment or by updating an existing environment.

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

An availability zone outage might affect some aspects of App Service, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service plan, you also improve resiliency during platform updates. For more information, see [Resilience to service maintenance](#resilience-to-service-maintenance).

For App Service plans that aren't zone redundant, the underlying VM instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

You can enable zone redundancy on an App Service Environment or its plans at no extra cost. However, zone redundancy for a plan requires that it has two or more instances. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of fewer than two instances, the platform enforces a minimum instance of two. The platform charges you for those two instances.

> [!IMPORTANT]
> When you enable availability zones for an App Service Environment, all App Service plans with fewer than 3 instances are scaled to 3 instances. Any plan with 3 or more instances remains unchanged. Once the operation to enable availability zones completes, you can scale your App Service plans as needed, including to fewer than 3 instances.

### Configure availability zone support

To learn how to create, enable, or disable a new zone-redundant App Service Environment and new zone-redundant App Service plans, see [Configure App Service Environments and Isolated v2 App Service plans for zone redundancy](../app-service/environment/configure-zone-redundancy-environment.md).

> [!NOTE]
> A change in the zone redundancy status of an App Service Environment takes 12 to 24 hours to complete. During the upgrade process, no downtime or performance problems occur.

### Capacity planning and management

[!INCLUDE [Capacity planning and management description](includes/app-service/reliability-capacity-planning-management-include.md)]

### Behavior when all zones are healthy

[!INCLUDE [Behavior when all zones are healthy](includes/app-service/reliability-behavior-zones-healthy-include.md)]

### Behavior during a zone failure

[!INCLUDE [Behavior during a zone failure](includes/app-service/reliability-behavior-zone-down-failure-include.md)]

### Zone recovery

[!INCLUDE [Zone recovery description](includes/app-service/reliability-zone-recovery-include.md)]

### Test for zone failures

[!INCLUDE [Test for zone failures description](includes/app-service/reliability-test-for-zone-failures-include.md)]

## Resilience to region-wide failures

App Service is a single-region service. If the region becomes unavailable, your environment and its plans and apps also become unavailable.

### Custom multi-region solutions for resiliency

To reduce the risk of a single-region failure affecting your application, deploy multiple App Service Environments across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the App Service Environments in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

For an example approach that illustrates this architecture, see [High availability enterprise deployment by using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

## Backup and restore

To back up your App Service apps to a file, use App Service backup and restore capabilities.

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Resilience to service maintenance

[!INCLUDE [Reliability during service maintenance description](includes/app-service/reliability-maintenance-include.md)]

**Customize the upgrade cycle.** You can customize the upgrade cycle for an App Service Environment. If you need to validate the effect of upgrades on your workload, enable manual upgrades. This approach allows you to perform validation and testing on a nonproduction instance before applying them to your production instance.

For more information about maintenance preferences, see [Upgrade preferences for App Service Environment planned maintenance](/azure/app-service/environment/how-to-upgrade-preference).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

[!INCLUDE [SLA description for App Service plans](includes/app-service/reliability-app-service-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in App Service](../reliability/reliability-app-service.md)
