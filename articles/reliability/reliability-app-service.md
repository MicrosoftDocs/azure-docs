---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service, including availability zones and multi-region deployments. 
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 07/17/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service works from a reliability perspective and plan resiliency strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. App Service integrates with Microsoft Azure to provide security, load balancing, autoscaling, and automated management for applications. This article describes reliability support in [Azure App Service](../app-service/overview.md), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

If you are using App Service Environment, see [Reliability in Azure App Service Environment](./reliability-app-service-environment.md) for more information about reliability support in that environment.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

For production deployments, see the [Architecture best practices for Azure App Service (Web Apps)](/azure/well-architected/service-guides/app-service-web-apps#reliability) for guidance on building reliable applications.

## Reliability architecture overview

When you create an Azure App Service web app, you define which [App Service plan](../app-service/overview-hosting-plans.md) the app runs on. An App Service plan defines a set of compute resources that run your web apps. All web apps must run inside an App Service plan. You can scale an App Service plan to run on multiple virtual machine *instances* (workers). These instances are the compute resources that run your app code. A single App Service plan can host multiple apps, all running on the same shared set of VM instances.

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Transient fault handling app service description](includes/app-service/reliability-transient-fault-handling-include.md)]

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

For **Premium v2-v4 tiers**, App Service can be configured as *zone redundant*, which means that your resources are distributed across multiple availability zones. Distribution across multiple zones helps your production workloads achieve resiliency and reliability. When you configure zone redundancy on App Service plans, all apps that use the plan are made zone redundant.


### Region support

Zone-redundant App Service **Premium v2-v4** plans can be deployed in [any region that supports availability zones](./regions-list.md).

### Requirements

To enable zone-redundancy you must:

- Use [Premium v2-4 plan types](/azure/app-service/overview-hosting-plans). 

- Deploy a minimum of two instances in your plan.

- Availability zones are supported only on newer App Service scale units. Even if you use one of the supported regions, if availability zones aren't supported for the scale unit that you use, then you receive an error when you create a zone-redundant App Service plan.

    The scale unit that you're assigned to is based on the resource group that you deploy an App Service plan to. To ensure that your workloads land on a scale unit that supports availability zones, you might need to create a new resource group and create a new App Service plan and App Service app within the new resource group. 

    To learn whether or not the scale unit that your App Service plan is on supports zone redundancy, see [Check for zone redundancy support for an App Service plan](../app-service/configure-zone-redundancy.md#check-for-zone-redundancy-support-on-an-app-service-plan).

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

For **Premium v2-4** plans, during an availability zone outage, some aspects of Azure App Service might be affected, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service **Premium v2-4** plan, you also improve your resiliency to updates that the App Service platform rolls out. To learn more, see [Reliability during service maintenance](#reliability-during-service-maintenance).

For App Service plans that aren't configured as zone redundant, the underlying VM instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

When you use App Service **Premium v2-v4 plans**, there's no extra cost associated with enabling availability zones as long as you have two or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

### Configure availability zone support

- **Create a new zone-redundant App Service plan.** To learn how to create a new zone-redundant App Service plan, see [Create a new App Service plan with zone redundancy](../app-service/configure-zone-redundancy.md#create-a-new-app-service-plan-with-zone-redundancy).

- **Enable or disable zone redundancy on an existing App Service plan.** To learn how to enable or disable an existing App Service plan to zone redundancy, see [Enable or disable an existing App Service plan to zone redundancy](../app-service/configure-zone-redundancy.md#set-zone-redundancy-for-an-existing-app-service-plan).

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

App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multi-region approaches

To reduce the risk of a single-region failure affecting your application, you can deploy across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the instances in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

The following resources are related to this approach: 

- [Reference architecture: Highly available multi-region web application](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)

- [Approaches to consider](/azure/architecture/web-apps/guides/multi-region-app-service/multi-region-app-service?tabs=paired-regions#approaches-to-consider)

- [Tutorial: Create a highly available multi-region app in App Service](/azure/app-service/tutorial-multi-region-app)

## Backups

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Reliability during service maintenance

[!INCLUDE [Reliability during service maintenance description](includes/app-service/reliability-maintenance-include.md)]


## Service-level agreement (SLA)

[!INCLUDE [SLA description](includes/reliability-sla-include.md)]

[!INCLUDE [SLA description for zone-redundant App Service plans](includes/app-service/reliability-app-service-sla-include.md)]



## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in Azure App Service Environment](./reliability-app-service-environment.md)
