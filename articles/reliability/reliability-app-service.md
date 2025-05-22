---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 04/04/2025
zone_pivot_groups: app-service-sku
#customer intent: As an engineer responsible for business continuity, I want to understand how Azure App Service works from a reliability perspective.
---

# Reliability in Azure App Service

This article describes reliability support in [Azure App Service](../app-service/overview.md), covering intra-regional resiliency with [availability zones](#availability-zone-support), [multi-region deployments](#multi-region-support), and transient fault handling.

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. Azure App Service adds the power of Microsoft Azure to your application, with capabilities for security, load balancing, autoscaling, and automated management. To explore how Azure App Service can bolster the reliability and resiliency of your application workload, see [App Service overview](../app-service/overview.md)

When you deploy Azure App Service, you can create multiple instances of an *App Service plan*, which represents the compute workers that run your application code. For more information, see [Azure App Service plan](/azure/app-service/overview-hosting-plans). Although the platform makes an effort to deploy the instances across different fault domains, it doesn't automatically spread the instances across availability zones.

## Production deployment recommendations

::: zone pivot="free-shared-basic"

- Use premium v3/v4 App Service plans.

- [Enable zone redundancy](#availability-zone-support), which requires that you use Premium v3, Premium v4 or Isolated v2 App Service plans and that you have at minimum three instances of the plan. To view more information, make sure that you select the appropriate tier at the top of this page.

::: zone-end

::: zone pivot="premium,isolated"

[Enable zone redundancy](#availability-zone-support), which requires your App Service plan to use a minimum of three instances.

::: zone-end

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Microsoft-provided SDKs usually handle transient faults. Because you host your own applications on Azure App Service, consider how to avoid causing transient faults by making sure that you:

- **Deploy multiple instances of your plan.**  Azure App Service performs automated updates and other forms of maintenance on instances of your plan. If an instance becomes unhealthy, the service can automatically replace that instance with a new healthy instance. During the replacement process, there can be a short period when the previous instance is unavailable and a new instance isn't yet ready to serve traffic. You can mitigate the impact of this behavior by deploying multiple instances of your App Service plan.

- **Use deployment slots.** Azure App Service [deployment slots](/azure/app-service/deploy-staging-slots) allow for zero-downtime deployments of your applications. Use deployment slots to minimize the impact of deployments and configuration changes for your users. Using deployment slots also reduces the likelihood that your application restarts. Restarting causes a transient fault.

- **Avoid scaling up or down.** Instead, select a tier and instance size that meet your performance requirements under typical load. Only scale out instances to handle changes in traffic volume. Scaling up and down can trigger an application restart.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure App Service can be configured as *zone redundant*, which means that your resources are spread across multiple [availability zones](../reliability/availability-zones-overview.md). Spreading across multiple zones helps your production workloads achieve resiliency and reliability. When you configure zone redundancy on App Service plans, all apps that use the plan are made zone redundant.

Instance spreading with a zone-redundant deployment is determined using the following rules. These rules apply even as the app scales in and out:

- The minimum App Service plan instance count is three.
- Instances are spread across multiple availability zones automatically. The number of availability zones used for your plan is determined by Azure.
- The instances spread evenly if you specify a capacity larger than three, and the number of instances is divisible by three.
- Any instance counts beyond 3*N are spread across the remaining one or two zones.

> [!NOTE]
> In some cases, your workload is hosted on a scale unit (also known as a stamp, or a compute cluster) that's deployed across two availability zones rather than three zones. For these cases, the instances are evenly spread across the two zones if the number of instances is divisible by two. Any instance count beyond 2*n is placed in one of the zones.

When the App Service platform allocates instances for a zone-redundant App Service plan, it uses best effort zone balancing offered by the underlying Azure virtual machine scale sets. An App Service plan is *balanced* if each zone has either the same number of virtual machines, or plus or minus one, in all of the other zones. For more information, see [Zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).

For App Service plans that aren't configured as zone redundant, virtual machine instances aren't resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Regions supported

::: zone pivot="free-shared-basic"

Zone-redundant App Service plans require that you use the Premium v2 or v3 tier and can be deployed in [any region that supports availability zones](./regions-list.md). To view more information, make sure that you select the appropriate tier at the top of this page.

::: zone-end

::: zone pivot="premium"

Zone-redundant App Service plans can be deployed in [any region that supports availability zones](./regions-list.md).

::: zone-end
 
::: zone pivot="isolated"

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

### Requirements

::: zone pivot="free-shared-basic,premium"

- You must use either the [Premium v2, Premium v3, or Premium v4 plan types](/azure/app-service/overview-hosting-plans).

::: zone-end

::: zone pivot="premium,isolated"

- You must use the [Premium v2, Premium v3, or Isolated v2 plan types](/azure/app-service/overview-hosting-plans).

- Availability zones are supported only on newer App Service scale units. Even if you're using one of the supported regions, if availability zones aren't supported for the scale unit you use then you receive an error when creating a zone-redundant App Service plan.

    The scale units you're assigned to is based on the resource group you deploy an App Service plan to. To ensure that your workloads land on a scale unit that supports availability zones, you might need to create a new resource group and then create a new App Service plan and App Service app within the new resource group.

- You must deploy a minimum of three instances of your plan.

::: zone-end

::: zone pivot="premium,isolated"

### Considerations

During an availability zone outage, some aspects of Azure App Service might be impacted even though the application continues to serve traffic. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

### Cost

::: zone-end

::: zone pivot="premium"

When you're using App Service Premium v2, Premium v3, or Premium v4 plans, there's no extra cost associated with enabling availability zones as long as you have three or more instances in your App Service plan. You're charged based on your App Service plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria.

If you enable availability zones but specify a capacity less than three, the platform enforces a minimum instance count of three. The platform charges you for those three instances.

::: zone-end

::: zone pivot="isolated"

App Service Environment v3 has a specific pricing model for zone redundancy. For pricing information for App Service Environment v3, see [Pricing](../app-service/environment/overview.md#pricing).

::: zone-end

### Configure availability zone support

::: zone pivot="free-shared-basic"

- **Create a new App Service plan with zone redundancy.** To deploy a new zone-redundant Azure App Service plan, you must use either the [Premium v2 or Premium v3 plan types](/azure/app-service/overview-hosting-plans). To view more information, make sure that you select the appropriate tier at the top of this page.

::: zone-end

::: zone pivot="premium"

- **Create a new App Service plan with zone redundancy.** To deploy a new zone-redundant Azure App Service plan, select the *Zone redundant* option when you deploy the plan.

::: zone-end

::: zone pivot="isolated"

- **Create a new App Service plan with zone redundancy.** To deploy a new zone-redundant Azure App Service Environment, see [Create an App Service Environment](/azure/app-service/environment/creation).

::: zone-end

- **Migration.** Zone redundancy can only be configured when you create a new App Service plan. If you have an existing App Service plan that isn't zone-redundant, replace it with a new zone-redundant plan. You can't convert an existing App Service plan to use availability zones.

- **Disable zone redundancy.** You can't disable zone redundancy after you create an App Service plan. Instead, you need to create a new plan with zone redundancy disabled and delete the old one.

::: zone pivot="premium,isolated"

### Capacity planning and management

To prepare for availability zone failure, consider *over-provisioning* the capacity of your App Service plan. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance. To learn more about over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

### Normal operations

This section describes what to expect when Azure App Service plans are configured for zone redundancy and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available App Service plan instances across all availability zones.

- **Data replication between zones:** During normal operations, any state stored in your application's file system is stored in zone-redundant storage, and is synchronously replicated between availability zones.

### Zone-down experience

This section describes what to expect when an Azure App Service plan is configured for zone redundancy and there's an availability zone outage:

- **Detection and response:** The App Service platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an App Service plan instance in the faulty availability zone are terminated. They need to be retried.

- **Traffic rerouting:** When a zone is unavailable, Azure App Service detects the lost instances from that zone. It automatically attempts to find new replacement instances. Then, it spreads traffic across the new instances as needed.

    If you have autoscale configured, and if it decides more instances are needed, autoscale also issues a request to App Service to add more instances. For more information, see [Scale up an app in Azure App Service](../app-service/manage-scale-up.md).

    > [!NOTE]
    > [Autoscale behavior is independent of App Service platform behavior](/azure/azure-monitor/autoscale/autoscale-overview). Your autoscale instance count specification doesn't need to be a multiple of three.

    > [!IMPORTANT]
    > There's no guarantee that requests for more instances in a zone-down scenario succeed. The back filling of lost instances occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your App Service plans to account for losing a zone. You can do that by [overprovisioning the capacity of your App Service plan](#capacity-planning-and-management).

- **Nonruntime behaviors:** Applications that are deployed in a zone-redundant App Service plan continue to run and serve traffic even if multiple zones in the region suffer an outage. However, nonruntime behaviors might still be impacted during an availability zone outage. These behaviors include App Service plan scaling, application creation, application configuration, and application publishing.

### Failback

When the availability zone recovers, Azure App Service automatically creates instances in the recovered availability zone, removes any temporary instances created in the other availability zones, and routes traffic between your instances as normal.

### Testing for zone failures

Azure App Service platform manages traffic routing, failover, and failback for zone-redundant App Service plans. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

::: zone-end

## Multi-region support

Azure App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multi-region solutions

To ensure that your application becomes less susceptible to a single-region failure, you need to deploy your application to multiple regions:

- Deploy your application to the instances in each region.
- Configure load balancing and failover policies.
- Replicate your data across the regions so that you can recover your last application state.

::: zone pivot="free-shared-basic,premium"

For example architectures that illustrates this approach, see:

- [Reference architecture: Highly available multi-region web application](/azure/architecture/web-apps/app-service/architectures/multi-region).
- [Multi-region App Service apps for disaster recovery](/azure/architecture/web-apps/guides/multi-region-app-service/multi-region-app-service)

To follow along with a tutorial that creates a multi-region app, see [Tutorial: Create a highly available multi-region app in Azure App Service](/azure/app-service/tutorial-multi-region-app).

::: zone-end

::: zone pivot="isolated"

For an example approach that illustrates this architecture, see [High availability enterprise deployment using App Service Environment](/azure/architecture/web-apps/app-service-environment/architectures/ase-high-availability-deployment).

::: zone-end

## Backups

When you use Basic tier or higher, you can back up your App Service app to a file by using the App Service backup and restore capabilities. For more information, see [Back up and restore your app in Azure App Service](../app-service/manage-backup.md).

This feature is useful if it's hard to redeploy your code, or if you store state on disk. For most solutions, you shouldn't rely on App Service backups. Use the other methods described in this article to support your resiliency requirements.

## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure App Service describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant App Service plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)
