---
title: Reliability in Azure App Service
description: Learn how to improve reliability in Azure App Service by using zone redundancy, multiple-region deployments, and best practices for scaling and fault tolerance.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 07/17/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service works from a reliability perspective and plan resiliency strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. App Service integrates with Microsoft Azure to provide security, load balancing, autoscaling, and automated management for applications. This article describes reliability support in [App Service](../app-service/overview.md). It covers intra-regional resiliency via [availability zones](#availability-zone-support) and [multiple-region deployments](#multiple-region-support).

For more information about reliability support in App Service Environment, see [Reliability in App Service Environment](./reliability-app-service-environment.md).

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

To learn about how to deploy App Service to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for App Service (Web Apps) in the Azure Well-Architected Framework](/azure/well-architected/service-guides/app-service-web-apps).

## Reliability architecture overview

When you create an App Service web app, you specify the [App Service plan](../app-service/overview-hosting-plans.md) that runs the app.

[!INCLUDE [App Service reliability architecture - plan description](includes/app-service/reliability-architecture-plans.md)]

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Transient fault handling app service description](includes/app-service/reliability-transient-fault-handling-include.md)]

## Availability zone support

[!INCLUDE [Availability zone support description](includes/reliability-availability-zone-description-include.md)]

For **Premium v2 to v4 tiers**, you can configure App Service as *zone redundant*, which means that your resources are distributed across multiple availability zones. Distribution across multiple zones helps your production workloads achieve resiliency and reliability. When you configure zone redundancy on App Service plans, all apps that use the plan become zone redundant.

### Region support

You can deploy zone-redundant App Service **Premium v2 to v4** plans in [any region that supports availability zones](./regions-list.md).

### Requirements

To enable zone-redundancy, you must meet the following requirements:

- Use [Premium v2 to v4 plan types](/azure/app-service/overview-hosting-plans). 

- Deploy a minimum of two instances in your plan.

- Use a scale unit that supports availability zones. When you create an App Service plan, the plan is assigned to a scale unit based on the resource group where the plan resides. If your scale unit doesn't support availability zones, you need to create a new plan in a new resource group.

  To determine whether the scale unit for your App Service plan supports zone redundancy, see [Check for zone redundancy support for an App Service plan](../app-service/configure-zone-redundancy.md#check-for-zone-redundancy-support-on-an-app-service-plan).

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

For **Premium v2 to v4** plans, an availability zone outage might affect some aspects of Azure App Service, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service **Premium v2 to v4** plan, you also improve resiliency during platform updates. For more information, see [Reliability during service maintenance](#reliability-during-service-maintenance).

For App Service plans that aren't configured as zone redundant, the underlying virtual machine (VM) instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

When you use App Service **Premium v2 to v4 plans**, enabling availability zones doesn't add cost if you have two or more instances. Charges are based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

### Configure availability zone support

- **Create a new zone-redundant App Service plan.** For more information, see [Create a new App Service plan that includes zone redundancy](../app-service/configure-zone-redundancy.md#create-a-new-zone-redundant-app-service-plan).

- **Enable or disable zone redundancy on an existing App Service plan.** For more information, see [Set zone redundancy for an existing App Service plan](../app-service/configure-zone-redundancy.md#set-zone-redundancy-for-an-existing-app-service-plan).

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

## Multiple-region support

App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multiple-region approaches

To reduce the risk of a single-region failure affecting your application, you can deploy plans across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the plans in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

Consider the following related resources: 

- [Reference architecture: Highly available multiple-region web application](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)
- [Approaches to consider](/azure/architecture/web-apps/guides/multi-region-app-service/multi-region-app-service?tabs=paired-regions#approaches-to-consider)
- [Tutorial: Create a highly available multiple-region app in App Service](/azure/app-service/tutorial-multi-region-app)

## Backups

When you use the Basic tier or higher, you can back up your App Service apps to a file by using the App Service backup and restore capabilities.

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Reliability during service maintenance

[!INCLUDE [Reliability during service maintenance description](includes/app-service/reliability-maintenance-include.md)]

For more information, see [Routine planned maintenance for App Service](/azure/app-service/routine-maintenance) and [Routine maintenance for App Service, restarts, and downtime](/azure/app-service/routine-maintenance-downtime).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

[!INCLUDE [SLA description for zone-redundant App Service plans](includes/app-service/reliability-app-service-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in App Service Environment](./reliability-app-service-environment.md)
