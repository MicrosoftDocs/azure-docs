---
title: Reliability in Azure API Management
description: Find out about reliability in Azure API Management, including availability zones and multi-region deployments.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 06/05/2025
zone_pivot_groups: api-management-sku
---

# Reliability in Azure API Management

Azure API Management is a fully managed service that helps organizations publish, secure, transform, maintain, and monitor APIs. The service acts as a gateway that sits between API consumers and backend services, providing essential capabilities like authentication, rate limiting, response caching, and request/response transformations. API Management enables organizations to create a consistent and secure API experience while abstracting the complexity of underlying backend services.

Azure API Management provides several reliability features designed to ensure high availability and fault tolerance for your API infrastructure. The service offers built-in redundancy through multiple deployment units, automatic failover capabilities between availability zones, and multi-region deployment options for global API distribution. API Management includes intelligent traffic routing, health monitoring, and automatic retry mechanisms that help maintain service continuity even during infrastructure failures or high-traffic scenarios.

This article describes reliability and availability zones support in [Azure API Management](/azure/api-management/api-management-key-concepts). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Reliability architecture overview

Azure API Management uses a scale unit-based architecture to provide reliability and resiliency. When you deploy an API Management instance, you configure one or more *units*, also called *scale units*. Each unit is a logical representation of capacity that contains the necessary compute resources to handle API requests.

The service provides built-in redundancy within a single datacenter, automatically handling common failures such as individual server or network component issues. For higher levels of reliability, API Management supports distributing scale units across multiple availability zones within a region and across multiple regions.

The reliability model differs based on your service tier:

- **Premium tier (classic)**: Supports multiple units that can be distributed across availability zones and regions for maximum resilience.
- **Premium v2, Basic and Standard tiers**: Supports multiple units within a single datacenter. Doesn't support availability zone distribution.
- **Developer tier**: Supports only a single unit and provides no availability zone or multi-region support. This tier is designed for development and testing scenarios, and isn't suitable for production workloads.
- **Consumption tier**: The Consumption tier of Azure API Management has built-in resiliency capabilities, and is resilient to a range of faults within a single Azure datacenter. However, the Consumption tier doesn't provide support for availability zones or multi-region deployments. To understand the expected uptime of a consumption tier Azure API Management instance, review the [service level agreement](#service-level-agreement).

Scale units within an instance work together to process requests, with automatic load balancing between available units. If a unit becomes unavailable, remaining units continue to handle traffic, though with potentially reduced capacity.

## Production deployment recommendations

- Use Premium tier (classic) for production workloads that require high availability. The Premium tier (classic) provides zone redundancy and multi-region deployment capabilities.

- Configure multiple scale units to provide redundancy and adequate capacity for your expected load.

- [Enable zone redundancy](#availability-zone-support), to deploy at least one unit in each availability zone. This configuration ensures that your API Management instance is resilient to datacenter-level failures.

- If you use a multi-region deployment, use availability zones to improve the resilience of the primary region. You can also distribute units across availability zones and regions to enhance regional gateway performance.

## Transient faults

[!INCLUDE[introduction to transient faults](./includes/reliability-transient-fault-description-include.md)]

All applications should follow Azure's transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. To learn more about handling transient faults, see [Recommendations for handing transient faults](/azure/well-architected/reliability/handle-transient-faults).

When you use Azure API Management in front of an API, you might need to retry requests that fail due to transient faults. To protect your backend API from being overwhelmed by too many requests, API Management provides retry, rate-limit, and quota policies. Load balancing and circuit breaker capabilities can also be configured using [backend resources](../api-management/backends.md).

## Availability zone support

[!INCLUDE[introduction to AZ](includes/reliability-availability-zone-description-include.md)]

::: zone pivot="premium-classic"

Azure API Management supports availability zones in both zonal and zone-redundant configurations for the Premium (classic) and Premium v2 tiers.

- *Zone-redundant*: Enabling zone redundancy for an API Management instance in a supported region provides redundancy for all service components, including the gateway, management plane, and developer portal. When you select two or more availability zones to use, Azure automatically replicates the service components across the selected zones.

- *Zonal*: The API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone that you select within an Azure region.

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when cross-zone latency is too high for your needs, and when you have verified that the latency doesn't meet your requirements. By itself, a zonal instance doesn’t provide resiliency to an availability zone outage. To improve the resiliency of a zonal API Management deployment, you need to explicitly deploy separate instances into multiple availability zones and configure traffic routing and failover.

::: zone-end

::: zone pivot="developer,basic,standard, premium-v2, consumption"

Azure API Management doesn't support availability zones in the Premium v2, Developer, Basic, and Standard tiers. These tiers are designed for development, testing, and lower-scale production workloads, and don't provide the high availability features that availability zones offer.

To achieve high availability and zone redundancy, consider using the Premium (classic) tier, which supports availability zones and multi-region deployments. To learn more about the Premium (classic) tier, select it at the top of this page.

::: zone-end

::: zone pivot="premium-classic"

### Region support

To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](./regions-list.md).

### Requirements

You must use the Premium (classic) tier to enable availability zone support. To upgrade your instance to Premium tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

### Considerations

- **Number of units:** If you enable zone redundancy in a region, you need to configure a number of API Management units that can be distributed evenly across all of your selected availability zones.

    For example, if you configure two zones, you can configure two units, four units, or another multiple of two units. To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).

- **Autoscaling:** If you enable availability zones on an an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

- When you're enabling zone redundancy on an API Management instance that's deployed in an external or internal virtual network, you can optionally specify a new public IP address resource. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md).

### Cost

Zone redundancy means that you need to add more units. Adding units incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure availability zone support

<!-- Any migration directions or disabling AZ?-->
To enable availability zone support on an API Management instance, see [Enable availability zone support on Azure API Management instances](../api-management/enable-availability-zone-support.md). There are no downtime requirements for any of the configuration options.

[!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

When enabling zone redundancy, changes can take 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

Enabling zone redundancy or changing the availability zone configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses).

### Capacity planning and management

In a zone-down scenario, there's no guarantee that requests for additional capacity in another availability zone will succeed. The back filling of lost units occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your API Management instance to account for losing a zone. You can do that by over-provisioning the capacity of your API Management instance. To learn more about the principle of over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning)

### Normal operations

This section describes what to expect when Azure API Management instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available API Management units across all selected availability zones.

<!-- Add 'data replication between zones', which should mention caches, rate limits, and whether config changes are applied sync or async -->

### Zone-down experience

This section describes what to expect when Azure API Management instances are configured with availability zone support and there's an availability zone outage.

- **Detection and response:** For zone-redundant instances, The Azure API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    For zonal instances, you need to detect the loss of an availability zone and initiate a failover to a secondary instance that you create in another availability zone.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

- **Traffic rerouting:** For zone-redundant instances, when a zone is unavailable, Azure API Management detects the lost units from that zone. It automatically attempts to find new replacement units. Then, it spreads traffic across the new units as needed.

    For zonal instances, when a zone is unavailable, your instance is unavailable. If you have a secondary instance in another availability zone, you're responsible for rerouting traffic to that secondary instance.

### Failback

For zone-redundant instances, when the availability zone recovers, Azure API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

For zonal instances, you're responsible for rerouting traffic to the instance in the original availability zone after the availability zone recovers.

### Testing for zone failures

For zone-redundant instances, the Azure API Management platform manages traffic routing, failover, and failback. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For zonal instances, there's no way to simulate an outage of the availability zone that contains your Azure API Management instance. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different instance in a different availability zone.

::: zone-end

## Multi-region support

::: zone pivot="premium-v2,developer,basic,standard,consumption"

Azure API Management doesn't support multi-region deployments in the Premium v2, Developer, Basic, and Standard tiers. These tiers are designed for development, testing, and lower-scale production workloads, and don't provide the high availability features that availability zones offer.

To achieve high availability and multi-region support, consider using the Premium (classic) tier, which supports availability zones and multi-region deployments. To learn more about the Premium (classic) tier, select it at the top of this page.

::: zone-end

::: zone pivot="premium-classic"

With a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps to reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

When adding a region, you configure:

- The number of units that region is to host.

- Optional [availability zones](#availability-zone-support), if that region supports it.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.

### Region support

You can create multi-region deployments with any Azure region that supports Azure API Management. To see which regions support multi-region deployments, see [Product Availability by Region](/explore/global-infrastructure/products-by-region/table).

### Requirements

You must use the Premium (classic) tier to enable multi-region support. To upgrade your instance to Premium tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

### Considerations

- Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region where you originally deployed the service.

- If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the VNet and subnet region should match with the secondary location you're configuring. If you're adding, removing, or enabling the availability zone in the primary region, or if you're changing the subnet of the primary region, then the VIP address of your API Management instance will change. For more information, see [IP addresses of Azure API Management service](/azure/api-management/api-management-howto-ip-addresses#changes-to-ip-addresses). However, if you're adding a secondary region, the primary region's VIP won't change because every region has its own private VIP.

- The gateway in each region (including the primary region) has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.

### Cost

Adding regions incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure multi-region support

To configure multi-region support on an API Management instance, see [Deploy an Azure API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#-deploy-api-management-service-to-an-additional-region).

To remove a region from an API Management instance, see [Remove an Azure API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#-remove-an-api-management-service-region).

### Capacity planning and management

In a region-down scenario, there's no guarantee that requests for additional capacity in another region will succeed. If you need guaranteed capacity when a region is lost, you should create and configure your API Management instance to account for losing a region. You can do that by overprovisioning the capacity of your API Management instance.

In multi-region deployments, automatic scaling applies only to the primary region. Secondary regions require manual scaling adjustments.

### Normal operations

This section describes what to expect when Azure API Management instances are configured with multi-region support and all regions are operational.

- **Traffic routing between regions:** Azure API Management automatically routes incoming requests to a regional gateway. A request is routed to the regional gateway with the lowest latency from the client. If you need to use a different routing approach, you can configure your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](../api-management/api-management-howto-deploy-multi-region.md#-use-custom-routing-to-api-management-regional-gateways).

    When a request reaches an Azure API Management regional gateway, it's usually routed to the backend API (unless a policy returns a response directly from the gateway, such as a cached response or an error code). In a multi-region solution, you need to take care to route to an instance of the backend API that meets your performance requirements. For more information, see [Route API calls to regional backend services](../api-management/api-management-howto-deploy-multi-region.md#-route-api-calls-to-regional-backend-services).

- **Data replication between regions:** Gateway configuration, such as APIs and policy definitions, are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds.

### Region-down experience

This section describes what to expect when Azure API Management instances are configured with multi-region support and there's a region outage.

- **Detection and response**: API Management is responsible for detecting a failure in a region and automatically failing over to a gateway in the secondary region.

- **Active requests**: Any active requests are dropped and should be retried by the client.

- **Expected data loss**: Azure API Management doesn't store data.

    Configuration changes are replicated to each region within approximately 10 seconds. If an outage of your primary region occurs, you might lose configuration changes that haven't been replicated.

- **Expected downtime**: If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. No gateway downtime is expected during a regional failover.

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

### Failback

When the primary region recovers, Azure API Management automatically restores units in the region and reroutes traffic between your units.

### Testing for region failures

To be ready for unexpected region outages, it's recommended that you regularly test your responses to region failures. You can simulate some aspects of a region failure by [disabling routing to a regional gateway](../api-management/api-management-howto-deploy-multi-region.md#disable-routing-to-a-regional-gateway).

::: zone-end

## Backups

Azure API Management doesn't store data. However, you can back up your Azure API Management service configuration. Backup and restore operations can also be used for replicating API Management service configuration between operational environments, for example, development and staging.

> [!IMPORTANT]
> In a backup procedure, runtime data such as users and subscriptions are included, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information on backup in Azure API Management, see [How to implement disaster recovery using service backup and restore in Azure API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

## Reliability during service maintenance

Azure API Management performs regular service upgrades, as well as other forms of maintenance.

In the Basic, Standard, and Premium (classic) tiers, you can customize when in the update process your instance receives an update. If you need to validate the effect of upgrades on your workload, consider configuring a test instance to receive updates early in the cycle, and set your production instance to receive updates late in the cycle. You can also specify a maintenance window, which is the time of the day you want the instance to apply service updates.

To learn more about maintenance preferences, see [Configure service update settings for your API Management instances](../api-management/configure-service-update-settings.md).

## Service-level agreement

The service-level agreement (SLA) for Azure API Management describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy an API Management instance in multiple availability zones or regions, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](/azure/availability-zones/overview)
- [Disaster recovery and business continuity for API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore)
- [Use availability zones in Azure API Management](/azure/api-management/zone-redundancy)
- [Multi-region deployment of API Management](/azure/api-management/api-management-howto-deploy-multi-region)
- [Azure API Management networking options](/azure/api-management/api-management-using-with-vnet)
- [Monitoring Azure API Management](/azure/api-management/api-management-howto-use-azure-monitor)
- [Azure API Management capacity planning](/azure/api-management/api-management-capacity)
- [Self-hosted gateway overview](/azure/api-management/self-hosted-gateway-overview)
- [Azure API Management security controls](/azure/api-management/security-controls-policy)
- [Azure Well-Architected Framework - Reliability pillar](/azure/well-architected/reliability/)
- [Business continuity and disaster recovery (BCDR): Azure Paired Regions](/azure/availability-zones/cross-region-replication-azure)
