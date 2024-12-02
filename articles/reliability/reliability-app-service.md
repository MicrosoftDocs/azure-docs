---
title: Reliability in Azure App Service
description: Find out about reliability in Azure App Service, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-app-service
ms.date: 11/12/2024
zone_pivot_groups: app-service-sku
---

# Reliability in Azure App Service

This article describes reliability support in [Azure App Service](../app-service/overview.md), covering both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [multi-region deployments](#multi-region-support). 

Resiliency is a shared responsibility between you and Microsoft, and so article also covers ways for you to build a resilient solution that meets your needs.

Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. Azure App Service adds the power of Microsoft Azure to your application, with capabilities for security, load balancing, autoscaling, and automated management. To explore how Azure App Service can bolster the reliability and resiliency of your application workload, see [Why use App Service?](../app-service/overview.md#why-use-app-service)

When you deploy Azure App Service, you can create multiple instances of an [App Service plan](/azure/app-service/overview-hosting-plans), which represents the compute workers that run your application code. Although the platform makes an effort to deploy the instances across different fault domains, it doesn't automatically spread the instances across availability zones.

## Production deployment recommendations

For production deployments, you should:

::: zone pivot="free-shared-basic"

- Use premium v3 App Service plans.
- [Enable zone redundancy](#availability-zone-support), which requires your App Service plan to use a minimum of three instances.

::: zone-end

::: zone pivot="premium,isolated"

- [Enable zone redundancy](#availability-zone-support), which requires your App Service plan to use a minimum of three instances.

::: zone-end

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Although Microsoft-provided SDKs usually handle transient faults, because you host your own applications on Azure App Service, you need to consider how to avoid causing transient faults by making sure that you:

- **Deploy multiple instances of your plan.**  Azure App Service performs automated updates and other forms of maintenance on instances of your plan. If an instance becomes unhealthy, the service can automatically replace that instance with a new healthy instance.  During the replacement process, there can be a short period of time where the previous instance is unavailable and a new instance isn't yet ready to serve traffic. You can mitigate the impact of this behavior by deploying multiple instances of your App Service plan.

- **Use deployment slots.** Azure App Service [deployment slots](/azure/app-service/deploy-staging-slots) allow for zero-downtime deployments of your applications. Use deployment slots to minimize the impact of deployments and configuration changes on your users. Using deployment slots also reduces the likelihood that your application restarts, which causes a transient fault.

- **Avoid scaling up or down.** Instead, select a tier and instance size that meet your performance requirements under typical load. Only scale out instances to handle changes in traffic volume. Consider that scaling up and down may trigger an application restart.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure App Service can be configured as *zone redundant*, which means that your resources are spread across multiple [availability zones](../reliability/availability-zones-overview.md). Spreading across multiple zones helps your production workloads achieve resiliency and reliability. <!-- Not sure what this means --> Availability zone support is a property of the App Service plan.

Instance spreading with a zone-redundant deployment is determined inside the following rules, even as the app scales in and out:

- The minimum App Service plan instance count is three. 
- If you specify a capacity larger than three, and the number of instances is divisible by three, the instances are spread evenly. 
- Any instance counts beyond 3*N are spread across the remaining one or two zones.

When the App Service platform allocates instances for a zone-redundant App Service plan, it uses [best effort zone balancing offered by the underlying Azure virtual machine scale sets](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing). An App Service plan is "balanced" if each zone has either the same number of VMs, or +/- one VM, in all of the other zones used by the App Service plan.

For App Service plans that aren't configured as zone redundant, VM instances are not resilient to availability zone failures. They can experience downtime during an outage in any zone in that region.

### Regions supported

::: zone pivot="free-shared-basic,premium"

Zone-redundant App Service plans can be deployed in [any region that supports availability zones](./availability-zones-region-support.md).

::: zone-end

::: zone pivot="isolated"

To see which regions support availability zones for App Service Environment v3, see [Regions](../app-service/environment/overview.md#regions).

::: zone-end

### Requirements

::: zone pivot="free-shared-basic,premium"

- You must use either the [Premium v2 or Premium v3 plan types](/azure/app-service/overview-hosting-plans).

- Availability zones are only supported on the newer App Service footprint. Even if you're using one of the supported regions, you'll receive an error if availability zones aren't supported for your resource group. To ensure your workloads land on a stamp that supports availability zones, you may need to create a new resource group, App Service plan, and App Service.

::: zone-end

::: zone pivot="premium,isolated"

- You must deploy a minimum of three instances of your plan.

### Considerations

Applications that are deployed in a zone-redundant App Service plan continue to run and serve traffic even if multiple zones in the region suffer an outage. However it's possible that non-runtime behaviors including App Service plan scaling, application creation, application configuration, and application publishing may still be impacted during an availability zone outage. Zone redundancy for App Service plans only ensures continued uptime for deployed applications.

### Cost

::: zone-end

::: zone pivot="premium"

When you're using App Service Premium v2 or Premium v3 plans, there's no additional cost associated with enabling availability zones as long as you have three or more instances in your App Service plan. You'll be charged based on your App Service plan SKU, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones but specify a capacity less than three, the platform enforces a minimum instance count of three and charges you for those three instances.

::: zone-end

::: zone pivot="isolated"

App Service Environment v3 has a specific pricing model for zone redundancy. For pricing information for App Service Environment v3, see [Pricing](../app-service/environment/overview.md#pricing).

::: zone-end

::: zone pivot="premium,isolated"

### Configure availability zone support

::: zone-end

::: zone pivot="premium"

To deploy a new zone-redundant Azure App Service plan, select the *Zone redundant* option when you deploy the plan.

::: zone-end

::: zone pivot="isolated"

To deploy a new zone-redundant Azure App Service Environment, see [Create an App Service Environment](/azure/app-service/environment/creation).

::: zone-end

::: zone pivot="premium,isolated"

Zone redundancy can only be configured when creating a new App Service plan. If you have an existing App Service plan that isn't zone-redundant, you need to replace it with a new zone-redundant plan. You can't convert an existing App Service plan to use availability zones. Similarly, you can't disable zone redundancy on an existing App Service plan.

::: zone-end

::: zone pivot="premium,isolated"

### Capacity planning and management

To prepare for availability zone failure, you should over-provision capacity of service to ensure that the solution can tolerate 1/3 loss of capacity and continue to function without degraded performance during zone-wide outages. Since the platform spreads VMs across three zones and you need to account for at least the failure of one zone, multiply peak workload instance count by a factor of zones/(zones-1), or 3/2. For example, if your typical peak workload requires four instances, you should provision six instances: (2/3 * 6 instances) = 4 instances.

### Traffic routing between zones

During normal operations, traffic is routed between all of your available App Service plan instances across all availability zones.

### Zone-down experience

**Detection and response:** The App Service platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

**Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an App Service plan instance in the faulty availability zone are terminated and need to be retried.

**Traffic rerouting:** When a zone is unavailable, Azure App Service detects the lost instances from that zone. It automatically attempts to find new replacement instances. Then, it spreads traffic across the new instances as needed.

If you have [autoscale](../app-service/manage-scale-up.md) configured, and if it decides more instances are needed, autoscale also issues a request to App Service to add more instances. 

>[!NOTE] 
> [Autoscale behavior is independent of App Service platform behavior](/azure/azure-monitor/autoscale/autoscale-overview). Your autoscale instance count specification doesn't need to be a multiple of three. 

> [!IMPORTANT] 
> There's no guarantee that requests for additional instances in a zone-down scenario succeed. The back filling of lost instances occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your App Service plans to account for losing a zone. You can do that by [overprovisioning the capacity of your App Service plan](#capacity-planning-and-management).

### Failback

When the availability zone recovers, Azure App Service automatically creates instances in the recovered availability zone, removes any temporary instances created in the other availability zones, and routes traffic between your instances as normal.

### Testing for zone failures

Azure App Service platform manages traffic routing, failover, and failback for zone-redundant App Service plans. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

::: zone-end

## Multi-region support

Azure App Service is a single-region service. If the region becomes unavailable, your application is also unavailable.

### Alternative multi-region solutions

To ensure that your application becomes less susceptible to a single-region failure, you'll need to deploy your application to multiple regions. To do this, you should:

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

When you use Basic tier or higher, you can back up your App Service app to a file by using the [App Service backup and restore capabilities](../app-service/manage-backup.md). This feature is useful if it's hard to redeploy your code, or if you store state on disk. However, for most solutions, you shouldn't rely on App Service backups, and should instead use the other methods described in this article to support your resiliency requirements.

## Service-level agreement (SLA)

The service-level agreement (SLA) for Azure App Service describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy a zone-redundant App Service plan, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](./overview.md)
