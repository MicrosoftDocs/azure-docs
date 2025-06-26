---
title: Reliability in Azure API Management
description: Find out about reliability in Azure API Management, including availability zones and multi-region deployments.
author: dlepow
ms.author: danlep
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 06/26/2025
---

# Reliability in Azure API Management

Azure API Management is a fully managed service that helps organizations publish, secure, transform, maintain, and monitor APIs. The service acts as a gateway that sits between API consumers and backend services, providing essential capabilities like authentication, rate limiting, response caching, and request/response transformations. API Management enables organizations to create a consistent and secure API experience while abstracting the complexity of underlying backend services.

Azure API Management provides several reliability features designed to ensure high availability and fault tolerance for your API infrastructure. The service offers built-in redundancy through multiple deployment units, automatic failover capabilities between availability zones, and multi-region deployment options for global API distribution. API Management includes intelligent traffic routing, health monitoring, and automatic retry mechanisms that help maintain service continuity even during infrastructure failures or high-traffic scenarios.

This article describes reliability and availability zones support in [Azure API Management](/azure/api-management/api-management-key-concepts). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Reliability architecture overview

Azure API Management uses a scale unit-based architecture to provide reliability and resiliency. When you deploy an API Management instance, you configure one or more *units*, also called *scale units*. Each unit is a logical representation of capacity that contains the necessary compute resources to handle API requests.

The service provides built-in redundancy within a single datacenter, automatically handling common failures such as individual server or network component issues. For higher levels of reliability, API Management supports distributing units across multiple availability zones within a region and across multiple regions.

The reliability model differs based on your service tier:

- **Premium tier (classic)**: Supports multiple units that can be distributed across availability zones and regions for maximum resilience.
- **Basic v2, Standard, Standard v2, and Premium v2 (preview)** tiers: Support multiple units within a single datacenter. Currently don't support availability zone or multi-region deployments.
- **Developer tier**: Supports only a single unit and provides no availability zone or multi-region support. This tier is designed for development and testing scenarios, and isn't suitable for production workloads.
- **Consumption tier**: The Consumption tier of Azure API Management has built-in resiliency capabilities, and is resilient to a range of faults within a single Azure datacenter. However, the Consumption tier doesn't provide support for availability zones or multi-region deployments. To understand the expected uptime of a consumption tier Azure API Management instance, review the [service level agreement](#service-level-agreement).

Units within an instance work together to process requests, with automatic load balancing between available units. If a unit becomes unavailable, remaining units continue to handle traffic, but with potentially reduced capacity.

> [!NOTE]
> Some tiers of Azure API Management support [self-hosted gateways](../api-management/self-hosted-gateway-overview.md), which you can run on your own infrastructure. When you use self-hosted gateways, you're responsible for configuring them to meet your reliability requirements. Self-hosted gateways are beyond the scope of this article.

## Production deployment recommendations

To learn about how to deploy Azure API Management to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Azure API Management in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-api-management).

## Transient faults

[!INCLUDE[introduction to transient faults](./includes/reliability-transient-fault-description-include.md)]

All applications should follow Azure's transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. To learn more about handling transient faults, see [Recommendations for handing transient faults](/azure/well-architected/reliability/handle-transient-faults).

When you use Azure API Management in front of an API, you might need to retry requests that fail due to transient faults. To protect your backend API from being overwhelmed by too many requests, API Management provides retry, rate-limit, and quota policies. Load balancing and circuit breaker capabilities can also be configured using [backend resources](../api-management/backends.md).

## Availability zone support

[!INCLUDE[introduction to AZ](includes/reliability-availability-zone-description-include.md)]

Azure API Management provides *automatic* availability zone support when you:

- Deploy a Premium (classic) API Management instance in a supported region.
- Don't specify which availability zones to use. 

With automatic availability zone support, the Azure API Management platform makes a best-effort attempt to spread your instance's units among the region's availability zones. There's no way to determine which availability zones your units are placed into. 

> [!NOTE]
> If your instance uses automatic availability zone support and has a single instance, the unit could be placed into any availability zone. If that zone has an outage your API Management service could be unavailable. We recommend that you deploy a minimum of three units to ensure zone resiliency.

If you want to explicitly select the availability zones to use, you can choose between zone-redundant and zonal configurations:

- *Zone-redundant*: Manually configure zone redundancy for an API Management instance in a supported region to provide redundancy for all service components, including the gateway, management plane, and developer portal. When you select two or more availability zones to use, Azure automatically replicates the service components across the selected zones.

- *Zonal*: The API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone that you select within an Azure region. All of the units are placed into the same availability zone.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs, and when you have verified that the latency doesn't meet your requirements. By itself, a zonal instance doesn’t provide resiliency to an availability zone outage. To improve the resiliency of a zonal API Management deployment, you need to explicitly deploy separate instances into multiple availability zones and configure traffic routing and failover.

### Region support

Azure API Management supports availability zones for Premium (classic) tier in all of the [Azure regions that support availability zones](./regions-list.md).

### Requirements

You must use the Premium (classic) tier to configure availability zone support. Azure API Management doesn't support availability zones in the classic Consumption, Developer, Basic, and Standard tiers, nor in the Basic v2, Standard v2, or Premium v2 tiers. To upgrade your instance to the Premium (classic) tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

>[!NOTE]
> - **The Premium v2 tier** with enterprise capabilities is in preview. To determine whether your design should rely on early access features or generally available capabilities, evaluate your design and implementation timelines in relation to the available information about Premium v2's release and migration paths.

### Considerations

- **Number of units for zone-redundant instances:** If you manually configure zone redundancy for an instance, you also need to configure a number of API Management units that can be distributed evenly across all of your selected availability zones. For example, if you configure two zones, you must configure at least two units. You can instead configure four units, or another multiple of two units. If you configure three availability zones, you must configure three units, six units, or another multiple of three units.

    If you simply default to the automatic availability zone support, there's no requirement to use a specific number of units. The units you deploy are distributed among the availability zones in a best-effort manner. However, you should use at least two units to ensure that an availability zone outage doesn't affect your instance. 
    
    To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).

- **Autoscaling:** If you manually configure availability zones on an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. In this case, the number of API Management units in autoscale rules and limits must be a multiple of the number of zones. U you simply default to the automatic availability zone support, you don't need to adjust your autoscale settings. 

- **IP address requirements:** When you're enabling availability zone support on an API Management instance that's deployed in an external or internal virtual network, you must specify a public IP address resource for the instance to use. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md). 

### Cost

Regardless of your availability zone configuration, if you add more units, it incurs greater costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure availability zone support

- **Create an API Management instance with availability zone support:** When you create a premium (classic) API Management instance in a region that supports availability zones, by default it's created with automatic availability zone support. You can optionally select whether the instance is zonal or zone-redundant.

    [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Enable or reconfigure availability zone support:** You can change the availability zone configuration for an API Management instance, including adding availability zones and moving a zonal instance between availability zones. To configure availability zone support on an API Management instance, see [Enable availability zone support on Azure API Management instances](../api-management/enable-availability-zone-support.md). There are no downtime requirements for any of the configuration options.

    [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

    When you change availability zone configuration, changes can take 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

    Changing the availability zone configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses).

### Capacity planning and management

In a zone-down scenario, there's no guarantee that requests for additional capacity in another availability zone will succeed. The back-filling of lost units occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your API Management instance to account for losing a zone. You can do that by:

- Over-provisioning the units of your API Management instance
- Using automatic or zone redundant availability zone configuration

To learn more about the principle of over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to decide the number of units that provide your required gateway performance. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).

### Normal operations

This section describes what to expect when Azure API Management instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available API Management units across all selected availability zones.

- **Data replication between zones:** The following data is stored and replicated by Azure API Management:
    - *Gateway configuration*, such as APIs and policy definitions, are regularly synchronized between the availability zones you select for the instance. Propagation of updates between the availability zones normally takes less than 10 seconds.
    - *Data in the internal cache*, if you use the internal cache provided by Azure API Management. Cache entries are distributed among availability zones. The internal cache is volatile and data isn't guaranteed to be persisted. Consider using an external cache if you need to persist cached data.
    - *Rate limit counters*, if you use rate limiting capabilities provided by Azure API Management. Rate limit counters are asynchronously replicated between the availability zones you select for the instance.

### Zone-down experience

This section describes what to expect when Azure API Management instances are configured with availability zone support and there's an availability zone outage.

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration your instance uses.

    - *Automatic:* For instances that use automatic availability zone support and have multiple units, the Azure API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

        For instances that use automatic availability zone support and have only a single unit, you need to detect the loss of an availability zone. You can respond by scaling to add extra units, which will be placed in another zone. Alternatively, if you have another instance in an unaffected zone, you can manually fail over to that instance.

    - *Zone-redundant:* For instances that are configured to be zone-redundant, the Azure API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    - *Zonal:* For instances that are configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary instance that you create in another availability zone.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

- **Expected data loss:** The following data is stored by API Management:

    - *Gateway configuration changes*, which are replicated to each selected availability zone within approximately 10 seconds. If an outage of an availability zone occurs, you might lose configuration changes that haven't been replicated.
    - *Data in the internal cache*, if you use the internal cache feature. The internal cache is volatile and data isn't guaranteed to be persisted. During an availability zone outage, some or all cached data might be lost. Consider using an external cache if you need to persist cached data.
    - *Rate limit counters*, if you use the rate limit feature. During an availability zone outage, rate limit counters might not be up-to-date in the surviving zones.

- **Expected downtime:** The downtime you can expect depends on the availability zone configuration your instance uses: <!-- Dan: please confirm everything in this section is accurate. -->

    - *Automatic:* Instances that use automatic availability zone support, and that have two or more units, are expected to have no downtime during an availability zone outage. Units in the unaffected zone continue to work.
        
        Instances that use automatic availability zone support, but have a single unit that was placed into the affected zone, are unavailable until the availability zone recovers. You can respond by scaling to additional instances in another zone, or by failing over to another instance.

    - *Zone-redundant:* Zone-redundant instances are expected to have no downtime during an availability zone outage.

    - *Zonal:* For zonal instances, when a zone is unavailable, your instance is unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your instance uses.
<!-- Not sure about these points -->

    - *Automatic:* Instances that use automatic availability zone support don't automatically recover into another zone. Any units in the affected zone will be unavailable. You can choose to scale your instance to add more units 

    - *Zone-redundant:* For instances that are configured to be zone-redundant, when a zone is unavailable, Azure API Management detects the lost units from that zone. It automatically attempts to find new replacement units. Then, it spreads traffic across the new units as needed. <!-- Dan: Please confirm this is accurate -->

    - *Zonal*: For zonal instances, when a zone is unavailable, your instance is unavailable. If you have a secondary instance in another availability zone, you're responsible for rerouting traffic to that secondary instance.

### Failback

The failback behavior depends on the availability zone configuration that your instance uses:

- *Automatic and zone-redundant:* For instances that are configured to use automatic availability zone support or manually configured to use zone redundancy, when the availability zone recovers, Azure API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

- *Zonal:* For zonal instances, you're responsible for rerouting traffic to the instance in the original availability zone after the availability zone recovers.

### Testing for zone failures

The options for testing for zone failures depend on the availability zone configuration that your instance uses:

- *Automatic:* For instances that use automatic availability zone support with more than one unit, the Azure API Management platform manages traffic routing, failover, and failback. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

   For instances that use automatic availability zone support and have a single unit, there's no way to simulate the outage of the availability zone that contains your Azure API Management instance.

- *Zone-redundant:* For zone-redundant instances, the Azure API Management platform manages traffic routing, failover, and failback. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

- *Zonal:* For zonal instances, there's no way to simulate an outage of the availability zone that contains your Azure API Management instance. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different instance in a different availability zone.

## Multi-region support

Azure API Management only supports multi-region deployments in the Premium (classic) tier. It doesn't support multi-region deployments in the Consumption, Developer, Basic, Basic v2, Standard, Standard v2, and Premium v2 (preview) tiers. For more information, see [Requirements](#requirements).

With a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps to reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

When adding a region, you configure:

- The number of units that region is to host.

- Optional [availability zone support](#availability-zone-support), if that region provides availability zones.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.

### Region support

You can create multi-region deployments in Premium (classic) tier with any Azure region that supports Azure API Management. To see which regions support multi-region deployments, see [Product Availability by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

### Requirements

You must use the Premium (classic) tier to configure multi-region support. To upgrade your instance to the Premium (classic) tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

> [!NOTE]
> **The Premium v2 tier** with enterprise capabilities is in preview. To determine whether your design should rely on early access features or generally available capabilities, evaluate your design and implementation timelines in relation to the available information about Premium v2's release and migration paths.

### Considerations

- **Gateway only:** Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region where you originally deployed the service.

- **Network requirements:** If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the virtual network and subnet region should match with the secondary location you're configuring. If you're adding, removing, or enabling the availability zone in the primary region, or if you're changing the subnet of the primary region, then the VIP address of your API Management instance will change. For more information, see [IP addresses of Azure API Management service](/azure/api-management/api-management-howto-ip-addresses#changes-to-ip-addresses). However, if you're adding a secondary region, the primary region's VIP won't change because every region has its own private VIP.

- **DNS names:** The gateway in each region (including the primary region) has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.

### Cost

Adding regions incurs greater costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure multi-region support

To configure multi-region support on an API Management instance, see [Deploy an Azure API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#-deploy-api-management-service-to-an-additional-region).

To remove a region from an API Management instance, see [Remove an Azure API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#-remove-an-api-management-service-region).

### Capacity planning and management

In a region-down scenario, there's no guarantee that requests for additional capacity in another region will succeed. If you need guaranteed capacity when a region is lost, you should create and configure your API Management instance to account for losing a region. You can do that by overprovisioning the capacity of your API Management instance.

In multi-region deployments, automatic scaling applies only to the primary region. Secondary regions require manual scaling adjustments or other techniques that you control.

### Normal operations

This section describes what to expect when Azure API Management instances are configured with multi-region support and all regions are operational.

- **Traffic routing between regions:** Azure API Management automatically routes incoming requests to a regional gateway. A request is routed to the regional gateway with the lowest latency from the client. If you need to use a different routing approach, you can configure your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](../api-management/api-management-howto-deploy-multi-region.md#-use-custom-routing-to-api-management-regional-gateways).

    When a request reaches an Azure API Management regional gateway, it's usually routed to the backend API (unless a policy returns a response directly from the gateway, such as a cached response or an error code). In a multi-region solution, you need to take care to route to an instance of the backend API that meets your performance requirements. For more information, see [Route API calls to regional backend services](../api-management/api-management-howto-deploy-multi-region.md#-route-api-calls-to-regional-backend-services).

- **Data replication between regions:** Gateway configuration, such as APIs and policy definitions, are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds.

    Data in the internal cache, and rate limit counters, are region-specific, and aren't replicated between regions.

### Region-down experience

This section describes what to expect when Azure API Management instances are configured with multi-region support and there's a region outage.

- **Detection and response**: API Management is responsible for detecting a failure in a region and automatically failing over to a gateway in the secondary region.

- **Active requests**: Any active requests are dropped and should be retried by the client.

- **Expected data loss**: Azure API Management doesn't store data, with the exception of configuration, a cache, and rate limit counters.

    Configuration changes are replicated to each region within approximately 10 seconds. If an outage of your primary region occurs, you might lose configuration changes that haven't been replicated.

    Data in the internal cache, and rate limit counters, are region-specific and aren't replicated between regions.

- **Expected downtime**: If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. No gateway downtime is expected during a regional failover.

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

### Failback

When the primary region recovers, Azure API Management automatically restores units in the region and reroutes traffic between your units.

### Testing for region failures

To be ready for unexpected region outages, it's recommended that you regularly test your responses to region failures. You can simulate some aspects of a region failure by [disabling routing to a regional gateway](../api-management/api-management-howto-deploy-multi-region.md#disable-routing-to-a-regional-gateway).

## Backups

Azure API Management doesn't store data. However, you can back up your Azure API Management service configuration. Backup and restore operations can also be used for replicating API Management service configuration between operational environments, for example, development and staging.

> [!IMPORTANT]
> In a backup procedure, runtime data such as users and subscriptions are included, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information on backup in Azure API Management, see [How to implement disaster recovery using service backup and restore in Azure API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

For backup or restore of some service components or resources, customer-managed options such as [APIOps tooling](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops) and infrastructure as code (IaC) solutions can also be considered. 

## Reliability during service maintenance

Azure API Management performs regular service upgrades and other forms of maintenance.

In the Basic, Standard, and Premium (classic) tiers, you can customize when in the update process your instance receives an update. If you need to validate the effect of upgrades on your workload, consider configuring a test instance to receive updates early in the cycle, and set your production instance to receive updates late in the cycle. You can also specify a maintenance window, which is the time of the day you want the instance to apply service updates.

To learn more about maintenance preferences, see [Configure service update settings for your API Management instances](../api-management/configure-service-update-settings.md).

## Service-level agreement

The service-level agreement (SLA) for Azure API Management describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy an API Management instance in multiple availability zones or regions, the uptime percentage defined in the SLA increases.

The service provides its own SLA, but you also need to account for the anticipated reliability of other workload components, such as the API backends.

## Related content

- [Disaster recovery and business continuity for API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore)
- [Use availability zones in Azure API Management](/azure/api-management/zone-redundancy)
- [Multi-region deployment of API Management](/azure/api-management/api-management-howto-deploy-multi-region)
- [Monitoring Azure API Management](/azure/api-management/api-management-howto-use-azure-monitor)
- [Azure API Management capacity planning](/azure/api-management/api-management-capacity)
