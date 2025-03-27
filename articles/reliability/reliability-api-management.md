---
title: Reliability in Azure API Management
description: Find out about reliability in Azure API Management, including availability zones and multi-region deployments.
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 02/27/2025
zone_pivot_groups: api-management-sku
---

# Reliability in Azure API Management

This article describes reliability support in [Azure API Management](/azure/api-management/api-management-key-concepts), covering resiliency of your backend APIs, intra-regional resiliency of the Azure API Management instance via [availability zones](#availability-zone-support), and [multi-region deployments](#multi-region-support).

Reliability is a shared responsibility between you and Microsoft and so this article also covers ways for you to create a resilient solution that meets your needs.

Azure API Management helps organization to:

- Provides a comprehensive API platform for different stakeholders and teams to produce and manage APIs.
- Decouple backend architecture diversity and complexity from API consumers.
- Securely expose services hosted on and outside of Azure as APIs.
- Protect, accelerate, and observe APIs.
- Enable API discovery and consumption by internal and external users.

## Reliability architecture overview

::: zone pivot="basic,standard,developer,premium-classic,premium-v2"

When you deploy an Azure API Management instance, you configure one or more *units*, also called *scale units*. A unit is a logical representation of capacity.

the Azure API Management platform provides resiliency to many types of failures even when you have a single unit. However, to be resilient to availability zone or region failures, you need to configure enough units so that they can be distributed across multiple zones or regions. To learn more about units, see [Upgrade and scale an Azure API Management instance](../api-management/upgrade-and-scale.md).

::: zone-end

::: zone pivot="consumption"

The consumption tier of Azure API Management has built-in resiliency capabilities, and is resilient to a range of faults within a single Azure datacenter. However, the consumption tier doesn't provide support for availability zones or multi-region deployments. To understand the expected uptime of a consumption tier Azure API Management instance, review the [service level agreement](#service-level-agreement).

If you need more resiliency than the consumption tier provides, use a tier that supports the resiliency capabilities you require.

::: zone-end

## Production deployment recommendations

- Use Premium (classic) tier with the `stv2` compute platform for your API Management instance. The Premium tier provides the features you need to ensure high availability and reliability for your production workloads.

<!-- Would we recommend using multiple scale units as a general best practice? -->

- [Enable zone redundancy](#availability-zone-support), to deploy at least one unit in each availability zone. This configuration ensures that your API Management instance is resilient to datacenter-level failures.

- If you use a multi-region deployment, use availability zones to improve the resilience of the primary region. You can also distribute units across availability zones and regions to enhance regional gateway performance.

::: zone pivot="basic,standard,developer,premium-classic,premium-v2"

## Capacity management

To avoid request failures, timeouts, and latency problems, you should proactively monitor the capacity of your gateway by using Azure API Management gateway [capacity metrics](/azure/api-management/api-management-capacity). With capacity metrics,  you can make scaling decisions when your instance is approaching its maximum capacity. 

::: zone-end

::: zone pivot="premium-classic"

If you use [workspaces](../api-management/workspaces-overview.md) to share a single Azure API Management instance between multiple teams, you should use [workspace gateways](../api-management/workspaces-overview.md#workspace-gateway) to isolate and limit the capacity allotted to each workspace. If you don't use workspace gateways, there's a possibility that a single workspace could consume all of the deployed capacity, causing outages or reliability issues for the other workspaces.

::: zone-end

## Transient faults 

[!INCLUDE[introduction to transient faults](./includes/reliability-transient-fault-description-include.md)]

All applications should follow Azure's transient fault handling guidance when communicating with any cloud-hosted APIs, databases, and other components. To learn more about handling transient faults, see [Recommendations for handing transient faults](/azure/well-architected/reliability/handle-transient-faults).

When you use Azure API Management in front of an API, you might need to retry requests that fail due to transient requests. To protect your backend API from being overwhelmed by too many requests, Use [Backends in API Management](../api-management/backends.md)  to create retry and circuit breaker logic that support your API's needs.

## Availability zone support

[!INCLUDE[introduction to AZ](includes/reliability-availability-zone-description-include.md)]

Azure API Management supports availability zones in both zonal and zone-redundant configurations:

- *Zone-redundant*: Enabling zone redundancy for an API Management instance in a supported region provides redundancy for all service components, including the gateway, management plane, and developer portal. Azure automatically replicates all service components across the zones that you select.

- *Zonal*: The API Management gateway and the control plane of your API Management instance (management API, developer portal, Git configuration) are deployed in a single zone that you select within an Azure region.  

    > [!IMPORTANT]
    > Pinning to a single availability zone is only recommended when cross-zone latency is too high for your needs, and when you have verified that the latency doesnt meet your requirements. By itself, a zonal instance doesn’t increase resiliency. To improve the resiliency of a zonal instance, you need to explicitly deploy separate instances into multiple availability zones and configure traffic routing and failover.

### Region support 

To configure availability zones for API Management, your instance must be in one of the [Azure regions that support availability zones](availability-zones-region-support.md).

### Requirements

* Your API Management instance must use the Premium (classic) tier. To upgrade your instance to Premium tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

* If your API Management instance is deployed (injected) in an [Azure virtual network](/azure/api-management/api-management-using-with-vnet), know which version of the [compute platform is being used - `stv` or `stv2`](/azure/api-management/compute-infrastructure).

::: zone pivot="premium-classic"

### Considerations 

- If you enable zone redundancy in a region, you need to distribute the number of API Management units evenly across all zones. For example, if you configure two zones, you can configure two units, four units, or another multiple of two units. To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).



- If you enable availability zones on an an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. The number of API Management units in autoscale rules and limits must be a multiple of the number of zones.

- When enabling zone redundancy, changes can take 15 to 45 minutes to apply. The API Management gateway can continue to handle API requests during this time.

- When you're enabling zone redundancy on an API Management instance that's deployed in an external or internal virtual network, you can optionally specify a new public IP address resource. In an internal virtual network, the public IP address is used only for management operations, not for API requests. [Learn more about IP addresses of API Management](../api-management/api-management-howto-ip-addresses.md).

- Enabling zone redundancy or changing the availability zone configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-the-ip-addresses).

### Cost

Adding units incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure availability zone support 

To enable availability zone support on an API Management instance, see [Enable availability zone support on Azure API Management instances](../api-management/enable-availability-zone-support.md). There are no downtime requirements for any of the configuration options.

[!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

### Capacity planning and management 

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to decide the number of units that provide your required gateway performance. For more information about scaling and upgrading your service instance, see [Upgrade and scale an Azure API Management instance](/azure/api-management/upgrade-and-scale).

In a zone-down scenario, there's no guarantee that requests for additional capacity in another availability zone will succeed. The back filling of lost units occurs on a best-effort basis. If you need guaranteed capacity when an availability zone is lost, you should create and configure your API Management instance to account for losing a zone. You can do that by over-provisioning the capacity of your API Management instance. To learn more about the principle of over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning)

### Normal operations

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available API Management units across all selected availability zones.

### Zone-down experience
<!-- Please verify all of this with the PG -->

- **Detection and response:** For zone-redundant instances, The Azure API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    For zonal instances, you need to detect the loss of an availability zone and initiate a failover to a secondary instance that you create in another availability zone.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

- **Traffic rerouting:** For zone-redundant instances, when a zone is unavailable, Azure API Management detects the lost units from that zone. It automatically attempts to find new replacement units. Then, it spreads traffic across the new units as needed.

    For zonal instances, when a zone is unavailable, your instance is unavailable. If you have a secondary instance in another availability zone, you're responsible for rerouting traffic to that secondary instance.

### Failback
<!-- Please confirm with PG -->

For zone-redundant instances, when the availability zone recovers, Azure API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

For zonal instances, you're responsible for rerouting traffic to the instance in the original availability zone after the availability zone recovers.

### Testing for zone failures
<!-- Please confirm with PG -->

For zone-redundant instances, the Azure API Management platform manages traffic routing, failover, and failback. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

For zonal instances, there's no way to simulate an outage of the availability zone that contains your Azure API Management instance. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different instance in a different availability zone.

::: zone-end

## Multi-region support

With a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps to reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

When adding a region, you configure:

- The number of units that region will host.

- Optional [availability zones](#availability-zone-support), if that region supports it.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.

### Region support 

You can create multi-region deployments with any Azure region that supports Azure API Management.

### Requirements

You must use the Premium (classic) tier to enable multi-region support.

::: zone pivot="premium-classic"

### Considerations

- Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region where you originally deployed the service.

- If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the VNet and subnet region should match with the secondary location you're configuring. If you're adding, removing, or enabling the availability zone in the primary region, or if you're changing the subnet of the primary region, then the VIP address of your API Management instance will change. For more information, see [IP addresses of Azure API Management service](/azure/api-management/api-management-howto-ip-addresses#changes-to-the-ip-addresses). However, if you're adding a secondary region, the primary region's VIP won't change because every region has its own private VIP.

- The gateway in each region (including the primary region) has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.

### Cost

Adding regions incurs additional costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure multi-region support 

To configure multi-region support on an API Management instance, see [Deploy an Azure API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#-deploy-api-management-service-to-an-additional-region).

To remove a region from an API Management instance, see [Remove an Azure API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#-remove-an-api-management-service-region).

### Capacity planning and management 

In a region-down scenario, there's no guarantee that requests for additional capacity in another region will succeed. If you need guaranteed capacity when a region is lost, you should create and configure your API Management instance to account for losing a region. You can do that by overprovisioning the capacity of your API Management instance.

### Traffic routing between regions 

Azure API Management automatically routes incoming requests to a regional gateway. A request is routed to the regional gateway with the lowest latency from the client. If you need to use a different routing approach, you can configure your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](../api-management/api-management-howto-deploy-multi-region.md#-use-custom-routing-to-api-management-regional-gateways).

When a request reaches an Azure API Management regional gateway, it's usually routed to the backend API (unless a policy returns a response directly from the gateway, such as a cached response or an error code). In a multi-region solution, you need to take care to route to an instance of the backend API that meets your performance requirements. For more information, see [Route API calls to regional backend services](../api-management/api-management-howto-deploy-multi-region.md#-route-api-calls-to-regional-backend-services).

### Data replication between regions 

Gateway configuration, such as APIs and policy definitions, are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds. Multi-region deployment provides availability of the API gateway in more than one region and provides service availability if one region goes offline.

### Region-down experience 

- **Detection and response**: is responsible for detecting a failure in a region and automatically failing over to a gateway in the secondary region.

- **Active requests**: Any active requests are dropped and should be retried by the client.

- **Expected data loss**: Azure API Management doesn't store data.

    Configuration changes are replicated to each region within approximately 10 seconds. If an outage of your primary region occurs, you might lose configuration changes that haven't been replicated.

- **Expected downtime**: If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests using the most recent gateway configuration. No gateway downtime is expected during a regional failover.

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

### Failback

When the primary region recovers, Azure API Management automatically restores units in the region and reroutes traffic between your units.

### Testing for region failures  

To be ready for unexpected region outages, it's recommended that you regularly test your responses to region failures. You can simulate a region failure by [disabling routing to a regional gateway](../api-management/api-management-howto-deploy-multi-region.md#disable-routing-to-a-regional-gateway).

::: zone-end

## Backups

Azure API Management doesn't store data. However, you can back up your Azure API Management service configuration. Backup and restore operations can also be used for replicating API Management service configuration between operational environments, for example, development and staging. 

>[!IMPORTANT]
>In a backup procedure, runtime data such as users and subscriptions are included, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information on backup in Azure API Management, see [How to implement disaster recovery using service backup and restore in Azure API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

## Service-level agreement

The service-level agreement (SLA) for Azure API Management describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy an API Management instance in multiple availability zones or regions, the uptime percentage defined in the SLA increases.

## Related content

- [Reliability in Azure](/azure/availability-zones/overview)
