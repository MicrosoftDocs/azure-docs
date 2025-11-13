---
title: Reliability in Azure App Service
description: Learn how to make Azure App Service resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 10/31/2025

#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure App Service works from a reliability perspective and plan both resiliency and recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure App Service

[Azure App Service](../app-service/overview.md) is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. App Service integrates with Microsoft Azure to provide security, load balancing, autoscaling, and automated management for applications. As an Azure service, App Service provides a range of capabilities to support your reliability requirements.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make App Service resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the App Service service level agreement (SLA).

>[!NOTE]
>If you are looking for information about reliability support in App Service Environment, see [Reliability in App Service Environment](./reliability-app-service-environment.md).

## Production deployment recommendations

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable App Service solution, see [Architecture best practices for App Service (Web Apps) in the Azure Well-Architected Framework](/azure/well-architected/service-guides/app-service-web-apps).

## Reliability architecture overview

When you create an App Service web app, you specify the [App Service plan](../app-service/overview-hosting-plans.md) that runs the app.

[!INCLUDE [App Service reliability architecture - plan description](includes/app-service/reliability-architecture-plans-include.md)]

[!INCLUDE [App Service reliability architecture overview](includes/app-service/reliability-architecture-overview-include.md)]

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

[!INCLUDE [Resilience to transient faults - App Service](includes/app-service/reliability-transient-fault-include.md)]

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

For **Premium v2 to v4 tiers**, you can configure App Service as *zone redundant*, which means that your resources are distributed across multiple availability zones. Distribution across multiple zones helps your production workloads achieve resiliency and reliability. When you configure zone redundancy on App Service plans, all apps that use the plan become zone redundant.

### Requirements

To enable zone redundancy, you must meet the following requirements:

- **Region support:** For App Service **Premium v2 and v3** plans, zone redundancy is supported in [any region that supports availability zones](./regions-list.md).

- **Plan type:** Use [Premium v2 to v4 plan types](/azure/app-service/overview-hosting-plans). 

    >[!IMPORTANT]
    >To enable zone redundancy for **App Service Premium v4** plans, you must [confirm that your desired region supports v4 plans](/azure/app-service/app-service-configure-premium-v4-tier#regions) and that it [supports availability zones](./regions-list.md).

- **Minimum number of instances:** Deploy a minimum of two instances in your plan.

- **Scale unit:** Your app must be deployed to a scale unit that supports availability zones. You don't directly control the scale unit that your plan uses. Instead, when you create an App Service plan, the plan is assigned to a scale unit based on the plan's resource group. To determine whether the scale unit for your App Service plan supports zone redundancy, see [Check for zone redundancy support for an App Service plan](../app-service/configure-zone-redundancy.md#check-for-zone-redundancy-support-on-an-app-service-plan).

    If your App Service plan is on a scale unit that doesn't support zone redundancy, you can't enable zone redundancy on your plan. Instead, you need to [redeploy your apps to a new plan on a different scale unit](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md#scale-units-and-zone-redundancy).

### Instance distribution across zones

[!INCLUDE [Instance distribution across zones description](includes/app-service/reliability-instance-distribution-across-zones-include.md)]

### Considerations

For **Premium v2 to v4** plans, an availability zone outage might affect some aspects of Azure App Service, even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

When you enable zone redundancy on your App Service **Premium v2 to v4** plan, you also improve resiliency during platform updates. For more information, see [Resilience to service maintenance](#resilience-to-service-maintenance).

For App Service plans that aren't configured as zone redundant, the underlying virtual machine (VM) instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Cost

When you use App Service **Premium v2 to v4 plans**, enabling availability zones doesn't add cost if you have two or more instances. Charges are based on your App Service plan SKU, the capacity that you specify, and any instances that you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity of less than two, the platform enforces a minimum instance count of two. The platform charges you for those two instances.

### Configure availability zone support

- **Create a new zone-redundant App Service plan.** For more information, see [Create a new App Service plan that includes zone redundancy](../app-service/configure-zone-redundancy.md#create-a-new-zone-redundant-app-service-plan).

- **Enable or disable zone redundancy on an existing App Service plan.** For more information, see [Set zone redundancy for an existing App Service plan](../app-service/configure-zone-redundancy.md#set-zone-redundancy-for-an-existing-app-service-plan).

### Capacity planning and management

[!INCLUDE [Capacity planning and management description](includes/app-service/reliability-capacity-planning-management-include.md)]

### Behavior when all zones are healthy

[!INCLUDE [Behavior when all zones are healthy](includes/app-service/reliability-behavior-zones-healthy-include.md)]

### Behavior during a zone failure

[!INCLUDE [Behavior during a zone failure](includes/app-service/reliability-behavior-zone-down-failure-include.md)]

### Zone recovery

[!INCLUDE [Zone recovery](includes/app-service/reliability-zone-recovery-include.md)]

### Test for zone failures

[!INCLUDE [Test for zone failures description](includes/app-service/reliability-test-for-zone-failures-include.md)]

## Resilience to region-wide failures

App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Custom multi-region solutions for resiliency

To reduce the risk of a single-region failure affecting your application, you can deploy plans across multiple regions. The following steps help strengthen resilience:

- Deploy your application to the plans in each region.
- Configure load balancing and failover policies.
- Replicate your data across regions so that you can recover your last application state.

Consider the following related resources: 

- [Reference architecture: Highly available multiple-region web application](/azure/architecture/web-apps/guides/enterprise-app-patterns/reliable-web-app/dotnet/guidance)
- [Approaches to consider](/azure/architecture/web-apps/guides/multi-region-app-service/multi-region-app-service?tabs=paired-regions#approaches-to-consider)
- [Tutorial: Create a highly available multiple-region app in App Service](/azure/app-service/tutorial-multi-region-app)

## Backup and restore

When you use the Basic tier or higher, you can back up your App Service apps to a file by using the App Service backup and restore capabilities.

[!INCLUDE [Backups description](includes/app-service/reliability-backups-include.md)]

## Resilience to service maintenance

[!INCLUDE [Resilience to service maintenance](includes/app-service/reliability-maintenance-include.md)]

For more information, see [Routine planned maintenance for App Service](/azure/app-service/routine-maintenance) and [Routine maintenance for App Service, restarts, and downtime](/azure/app-service/routine-maintenance-downtime).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

[!INCLUDE [SLA description for zone-redundant App Service plans](includes/app-service/reliability-app-service-service-level-agreement-include.md)]

## Related content

- [Reliability in Azure](./overview.md)
- [Reliability in App Service Environment](./reliability-app-service-environment.md)
