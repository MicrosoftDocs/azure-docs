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

Azure App Service Environment offers enhanced reliability features through its dedicated, isolated infrastructure. This dedicated environment provides better control over scaling, security, and availability compared to the multitenant App Service offering. The isolated nature of App Service Environment allows for more predictable performance and reduces the impact of noisy neighbor scenarios that can affect reliability in shared environments.

Key reliability benefits include dedicated compute resources that aren't shared with other customers, enhanced network isolation for improved security and stability, and the ability to deploy in your own virtual network for greater control over traffic routing and security policies.

This article describes reliability support in [Azure App Service Environment](../app-service/environment/overview.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).


[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

[Enable zone redundancy](#availability-zone-support) on your environment, which requires that your App Service Isolated plans use a minimum of two instances. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

## Reliability architecture overview

When you implement [Azure App Service Environment](/azure/app-service/environment/overview), you deploy the environment as the container for your Isolated tier App Service plans and web apps. During the set-up procedure for your environment, you configure core networking settings and optional hardware isolation. You also choose whether or not to support zone redundancy on the environment, if the region supports availability zones.

After you have created your environment, then you can create one or more [Isolated App Service plans](../app-service/overview-hosting-plans.md).

For further information on reliability architecture in Azure App Service, see [Reliability in Azure App Service](./reliability-app-service.md#reliability-architecture-overview).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

For information on transient fault handling in Azure App Service, see [Reliability in Azure App Service](./reliability-app-service.md#transient-faults).

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]


Your App Service Environment can be configured as *zone redundant*, which means that your App Service Isolated plans are distributed across multiple availability zones. 

However, you can enable or disable zone redundancy on each plan, regardless of the setting on the App Service Environment. This means that you can have some plans in your environment that are zone redundant and others that aren't.

### Instance distribution across zones

When you create a zone-redundant App Service plan in your environment, the instances of your App Service Isolated plan are distributed across the availability zones in the region. For more information, see [Instance distribution across zones](../reliability/reliability-app-service.md#instance-distribution-across-zones).

### Region support

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).


### Requirements

To enable zone-redundancy for your App Service Environment you must:

- Use [Isolated v2 plan types](/azure/app-service/overview-hosting-plans) and have a minimum of two instances of the plan.

- Deploy a minimum of two instances in your plan.

- Configure your App Service Environment to support zone redundancy. You can do this during the creation of the App Service Environment or by updating an existing environment.

<!-- This section is muddy - not clear what we are doing here. That the scale unit is based on the resource group and that the user needs to check for zr after creating the environment, seems like a crap shoot that may or may not turn up the desired result. Can we clarify the process we want to communicate here?-->
>[!IMPORTANT]
>When you create an App Service Environment, the instance is assigned to a scale unit. The scale unit that you're assigned to is based on the resource group that you deploy an App Service Environment to. To ensure that your environment lands on a scale unit that supports availability zones, you might need to create a new resource group and create a new App Service Environment within a new resource group.
>
>To learn whether or not the App Service Environment supports zone redundancy, see [Check for zone redundancy support for an App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#check-for-zone-redundancy-support-for-an-app-service-environment).

### Cost

When you enable zone redundancy for your App Service Environment, you pay for the additional instances that are created in the availability zones. The cost is based on the App Service plan SKU and the capacity that you specify.
When you use the App Service Isolated v2 plan, there's no extra cost associated with enabling availability zones as long as you have two or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.


### Configure availability zone support

- **Create a zone-redundant App Service Environment.** To learn how to create a new zone-redundant App Service Environment, see [Create a new App Service Environment plan with zone redundancy](../app-service/environment/creation.md). Make sure to set **Zone redundancy** to *Enabled*. To create plans in your App Service Environment, you must use the Isolated v2 pricing tier. To learn how to create an Isolated v2 App Service plan with zone redundancy, see [Configure Isolated v2 App Service plans with zone redundancy](../app-service/environment/configure-zone-redundancy-isolated.md).

- **Enable or disable zone redundancy on an existing App Service Environment.** To learn how to enable or disable zone redundancy on App Service Environment, see [Set zone redundancy for an existing App Service Environment](../app-service/environment/configure-zone-redundancy-ase.md#set-zone-redundancy-for-an-existing-app-service-environment). To learn how to enable or disable zone redundancy on an existing Isolated v2 App Service plan inside your environment, see [Set zone redundancy for an existing Isolated v2 App Service plan](../app-service/environment/configure-zone-redundancy-isolated.md#set-zone-redundancy-for-an-existing-isolated-v2-app-service-plan).

> [NOTE]
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.


### Capacity planning and management

To prepare for availability zone failure, consider *over-provisioning* the capacity of your App Service plan. Over-provisioning allows the solution to tolerate some degree of capacity loss and continue to function without degraded performance. For more information, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

The following section describes what to expect when App Service plans are configured for zone redundancy and all availability zones are operational:

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available App Service plan instances across all availability zones.

- **Data replication between zones:** During normal operations, any state stored in your application's file system is stored in zone-redundant storage and synchronously replicated between availability zones.

### Zone-down experience

During an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

The following section describes what to expect when App Service plans are configured for zone redundancy and one or more availability zones are unavailable:

- **Detection and response:** The App Service platform automatically detects failures in an availability zone and initiates a response. No manual intervention is required to initiate a zone failover.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an App Service plan instance in the faulty availability zone are terminated. They need to be retried.

- **Traffic rerouting:** When a zone is unavailable, App Service detects the lost instances from that zone and automatically attempts to find new replacement instances.  Once it finds replacements, it then distributes traffic across the new instances as needed.

    If autoscale is configured and it determines that more instances are needed, it issues a request to App Service to add those instances. Autoscale behavior operates independently of App Service platform behavior, meaning that your instance count specification doesn't need to be a multiple of two. For more information, see [Scale up an app in App Service](/azure/app-service/manage-scale-up) and [Autoscale overview](/azure/azure-monitor/autoscale/autoscale-overview).

    > [!IMPORTANT]
    > There's no guarantee that requests for more instances in a zone-down scenario succeed. The backfilling of lost instances occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your App Service plans to account for the loss of a zone. You can achieve this by [over-provisioning the capacity of your App Service plan](#capacity-planning-and-management).

- **Nonruntime behaviors:** Applications that are deployed in a zone-redundant App Service plan continue to run and serve traffic even if an availability zone experiences an outage. However, nonruntime behaviors might be affected during an availability zone outage. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

### Failback

When the availability zone recovers, App Service automatically creates instances in the recovered availability zone, removes any temporary instances created in the other availability zones, and routes traffic between your instances as usual.

### Testing for zone failures

The App Service platform manages traffic routing, failover, and failback for zone-redundant App Service plans. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.


## Multi-region support

App Service Environment is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multi-region approaches

To reduce the risk of a single-region failure affecting your application, deploy across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the instances in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.


For an example approach that illustrates this architecture, see [High availability enterprise deployment by using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).


## Backups

For back information in App Service, see [Reliability in Azure App Service - Backups](../reliability/reliability-app-service.md#backups).


## Reliability during service maintenance

For service maintenance in Azure App Service, see [Reliability in Azure App Service - Service maintenance](../reliability/reliability-app-service.md#reliability-during-service-maintenance).

## Service-level agreement (SLA)

The service-level agreement (SLA) for App Service Environment describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant App Service Isolated plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)
