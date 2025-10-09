---
title: Reliability in Azure API Management
description: Learn how to configure availability zones and multi-region deployments in Azure API Management to achieve high availability and meet SLA requirements.
author: dlepow
ms.author: danlep
ms.topic: reliability-article
ms.custom: subject-reliability, references_regions
ms.service: azure-api-management
ms.date: 07/17/2025
---

# Reliability in Azure API Management

Azure API Management is a fully managed service that helps organizations publish, secure, transform, maintain, and monitor APIs. This article describes reliability features in [API Management](/azure/api-management/api-management-key-concepts), including intra-regional resiliency via [availability zones](#availability-zone-support), [multi-region deployments](#multi-region-support), gateway zone redundancy, and automatic failover. Learn how to configure these features to achieve high availability and meet SLA requirements. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

API Management provides several reliability features designed to ensure high availability and fault tolerance for your API infrastructure. The service provides built-in redundancy through multiple deployment units, automatic failover capabilities between availability zones, and multi-region deployment options for global API distribution. API Management includes intelligent traffic routing, health monitoring, and automatic retry mechanisms that help maintain service continuity even during infrastructure failures or high-traffic scenarios.

[!INCLUDE [Shared responsibility description](includes/reliability-shared-responsibility-include.md)]

## Reliability architecture overview

API Management uses a scale unit-based architecture to provide built-in redundancy and scalability. When you deploy an API Management instance, you configure one or more *scale units*, or *units*. Each unit is a logical representation of capacity that contains the necessary compute resources to handle API requests. 
 
When you configure an instance with two or more units, the available units work together to process requests and provide automatic load balancing. If one of the units becomes unavailable, the remaining units continue to handle traffic, but with potentially reduced capacity.
  
To gain higher levels of reliability, API Management supports unit distribution across availability zones within a region and across multiple regions.

API Management service tiers provide different levels of reliability:

- **Premium (classic) tier:** Supports multiple units that can be distributed across availability zones and regions for maximum resilience. In the Premium tier, each unit consists of two virtual machines (VMs) that provide the compute resources to handle API requests.

- **Basic v2, Standard, Standard v2, and Premium v2 (preview) tiers:** All support multiple units within a single datacenter. They don't support availability zones or multi-region deployments.

- **Developer tier:** Supports only a single unit and provides no availability zone or multi-region support. This tier is designed for development and testing scenarios. It isn't suitable for production workloads.

- **Consumption tier:** Has built-in resiliency capabilities and is resilient to a range of faults within a single Azure datacenter. However, the Consumption tier doesn't provide support for availability zones or multi-region deployments. To understand the expected uptime of a Consumption tier API Management instance, review the [service-level agreement (SLA)](#service-level-agreement).

Units within an instance work together to process requests and automatically load balance between available units. If a unit becomes unavailable, remaining units continue to handle traffic, but with potentially reduced capacity.

> [!NOTE]
> The Developer and Premium tiers of API Management support [self-hosted gateways](../api-management/self-hosted-gateway-overview.md), which you can run on your own infrastructure. When you use self-hosted gateways, you're responsible for configuring them to meet your reliability requirements. Self-hosted gateways are outside the scope of this article.

## Production deployment recommendations

To learn about how to deploy API Management to support your solution's reliability requirements and how reliability affects other aspects of your architecture, see [Architecture best practices for API Management in the Azure Well-Architected Framework](/azure/well-architected/service-guides/azure-api-management).

## Transient faults and retry policies

[!INCLUDE[introduction to transient faults](./includes/reliability-transient-fault-description-include.md)]

When you use API Management in front of an API, you might need to retry requests that fail because of transient faults. To protect your backend API from being overwhelmed by too many requests, API Management provides retry, rate-limit, and quota policies. You can also configure load balancing and circuit breaker capabilities by using [backend resources](../api-management/backends.md).

## Availability zone support

[!INCLUDE[introduction to AZ](includes/reliability-availability-zone-description-include.md)]

API Management provides two types of availability zone support when you deploy a Premium (classic) API Management instance in a supported region:
	
- **Automatic:** API Management provides automatic availability zone support when you don't specify which availability zones to use. 
    
- **Manual:** API Management provides manual availability zone support when you explicitly specify which availability zones to use. 

With availability zone support, API Management replicates service components across zones for high availability. In the primary region, these components include the gateway (scale units), management plane, and developer portal. In secondary regions, only the gateway units are replicated. For more information about secondary regions, see [multi-region support](#multi-region-support).

### Automatic availability zone support

You can use automatic availability zone support to choose either a single unit or multiunit instance configuration to achieve zone redundancy:

- **Multiunit configuration** (Recommended): If your instance has two or more units, API Management makes a best-effort attempt to spread your instance's units among the region's availability zones. There's no way to determine which availability zones your units are placed into. We recommend that you deploy a minimum of two units, which can be distributed across two zones.

    The following diagram shows an API Management instance with three units that's configured for automatic availability zone support:

    :::image type="complex" border="false" source="./media/reliability-api-management/zone-redundant-automatic-multi-unit.svg" alt-text="Diagram that shows three API Management units distributed across availability zones for automatic availability zone support.":::
       The diagram shows three boxes labeled Unit 1, Unit 2, and Unit 3 deployed in an API Management instance. Each unit box contains two icons that represent VMs. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains unit 1, zone 2 contains unit 2, and zone 3 contains unit 3.
    :::image-end:::

- **Single-unit configuration:** If your instance has a single unit, the unit's underlying VMs are distributed to two availability zones. There's no way to determine which availability zones the unit's VMs are placed into.

    :::image type="complex" border="false" source="./media/reliability-api-management/automatic-single-unit.svg" alt-text="Diagram that shows a single API Management unit distributed across two availability zones for automatic availability zone support.":::
       The diagram shows one box that's labeled Unit 1 deployed in an API Management instance. The unit box contains two icons that represent VMs. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. The Unit 1 box spans zones 1 and 2. Zone 3 is empty.
    :::image-end:::

### Manual availability zone support

If you want to explicitly select the availability zones to use, you can choose between zone-redundant and zonal configurations:

- **Zone-redundant:** Manually configure zone redundancy for an API Management instance in a supported region to provide redundancy for service components. When you select two or more availability zones to use, Azure automatically replicates the service components across the selected zones.

    :::image type="complex" border="false" source="./media/reliability-api-management/zone-redundant-automatic-multi-unit.svg" alt-text="Diagram that shows three API Management units distributed across availability zones for manual zone redundancy.":::
       The diagram shows three boxes labeled Unit 1, Unit 2, and Unit 3 deployed in an API Management instance. Each unit box contains two icons that represent VMs. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains unit 1, zone 2 contains unit 2, and zone 3 contains unit 3.
    :::image-end:::

- **Zonal:** The API Management service components are deployed in a single zone that you select within an Azure region. All of the units are placed into the same availability zone.

    :::image type="complex" border="false" source="./media/reliability-api-management/zonal.svg" alt-text="Diagram that shows a zonal API Management deployment that has two units, in a single availability zone.":::
       The diagram shows two boxes labeled Unit 1 and Unit 2 deployed in an API Management instance. Each unit box contains two icons that represent VMs. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains both Unit 1 and Unit 2 boxes. Zone 2 and Zone 3 don't contain any units.
    :::image-end:::

    > [!IMPORTANT]
    > Pin to a single availability zone only if [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs and after you verify that the latency doesn't meet your requirements. By itself, a zonal instance doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal API Management deployment, you need to explicitly deploy separate instances into multiple availability zones and configure traffic routing and failover.

### Region support

API Management supports availability zones for the Premium (classic) tier in all of the [Azure regions that support availability zones](./regions-list.md).

### Requirements

You must use the Premium (classic) tier to configure availability zone support. API Management doesn't currently support availability zones in the classic Consumption, Developer, Basic, and Standard tiers or in the Basic v2, Standard v2, and Premium v2 tiers. To upgrade your instance to the Premium (classic) tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

> [!NOTE]
> The Premium v2 tier with enterprise capabilities is in preview. To determine whether your design should rely on early access features or generally available capabilities, evaluate your design and implementation timelines in relation to the available information about Premium v2's release and migration paths.

### Considerations

- **Number of units for zone-redundant instances:** If you manually configure zone redundancy for an instance, you also need to configure a number of API Management units that can be distributed evenly across all of your selected availability zones. For example, if you select two zones, you must configure at least two units. You can instead configure four units, or another multiple of two units. If you select three availability zones, you must configure three units, six units, or another multiple of three units.

    If you use the automatic availability zone support, there's no requirement to use a specific number of units. The units that you deploy are distributed among the availability zones in a best-effort manner. For maximum zone redundancy, we recommend that you use at least two units to ensure that an availability zone outage doesn't affect your instance. 
    
    To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an API Management instance](/azure/api-management/upgrade-and-scale).

- **Autoscaling:** If you manually configure availability zones on an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. In this case, the number of API Management units in autoscale rules and limits must be a multiple of the number of zones. If you use the automatic availability zone support, you don't need to adjust your autoscale settings. 

- **IP address requirements:** When you enable availability zone support on an API Management instance that's deployed in an external or internal virtual network, you must specify a public IP address resource for the instance to use. In an internal virtual network, the public IP address is used only for management operations, not for API requests. For more information, see [IP addresses in API Management](../api-management/api-management-howto-ip-addresses.md). 

### Cost

Regardless of your availability zone configuration, if you add more units, you incur more costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure availability zone support

This section explains how to configure availability zone support for your API Management instance.

> [!NOTE]
> [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Create an API Management instance that supports availability zones:** When you create a Premium (classic) API Management instance in a region that supports availability zones, the instance supports availability zones by default. You can select automatic availability zone support or manually configure zonal or zone-redundant support.

- **Enable or reconfigure availability zone support:** You can change the availability zone configuration for an API Management instance, including adding availability zones and moving a zonal instance between availability zones. To learn how to configure availability zone support on an API Management instance, see [Enable availability zone support on API Management instances](../api-management/enable-availability-zone-support.md). There are no downtime requirements for any of the configuration options.

    When you change availability zone configuration, the changes can take 15 to 45 minutes or more to apply. The API Management gateway can continue to handle API requests during this time.

    Changing the availability zone configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses).

### Capacity planning and management

In a zone-down scenario, there's no guarantee that requests for more capacity in another availability zone will succeed. The backfilling of lost units occurs on a best-effort basis. If you need guaranteed capacity when an availability zone fails, you should create and configure your API Management instance to account for losing a zone by taking all of the following actions:

- Over-provision the units of your API Management instance.

- Use automatic or zone-redundant availability zone configuration.

For more information, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to determine the number of units that provide your required gateway performance. For more information about how to scale and upgrade your service instance, see [Upgrade and scale an API Management instance](/azure/api-management/upgrade-and-scale).

### Normal operations

This section describes what to expect when API Management instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available API Management units across all selected availability zones.

- **Data replication between zones:** API Management stores and replicates the following data.

    - *Gateway configuration*, such as APIs and policy definitions, are regularly synchronized between the availability zones that you select for the instance. Propagation of updates between the availability zones normally takes less than 10 seconds.

    - *Data in the internal cache*, if you use the internal cache that API Management provides. Cache entries are distributed among availability zones. The internal cache is volatile and data isn't guaranteed to be persisted. Consider using an external cache if you need to persist cached data.

    - *Rate limit counters*, if you use the rate limiting capabilities that API Management provides. Rate limit counters are asynchronously replicated between the availability zones that you select for the instance.

### Zone-down experience

This section describes what to expect when API Management instances are configured with availability zone support and there's an availability zone outage.

- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration that your instance uses.

    - *Automatic and zone-redundant:* For instances that are configured to use automatic availability zone support or manually configured to use zone redundancy, the API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    - *Zonal:* For instances that are configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary instance that you create in another availability zone.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

- **Notification**: Azure API Management doesn't notify you when a zone is down. However, you can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of your gateway. You can also use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Azure API Management service, including any zone failures.

  Set up alerts on these services to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Expected data loss:** API Management stores the following data.

    - *Gateway configuration changes*, which are replicated to each selected availability zone within approximately 10 seconds. If an outage of an availability zone occurs, you might lose configuration changes that aren't replicated.

    - *Data in the internal cache*, if you use the internal cache feature. The internal cache is volatile and data isn't guaranteed to be persisted. During an availability zone outage, you might lose some or all cached data. Consider using an external cache if you need to persist cached data.

    - *Rate limit counters*, if you use the rate limit feature. During an availability zone outage, rate limit counters might not be up-to-date in the surviving zones.

- **Expected downtime:** The expected downtime depends on the availability zone configuration that your instance uses.

    - *Automatic:* You can expect instances that use automatic availability zone support to have no downtime during an availability zone outage. Units in the unaffected zone or zones continue to work.
        
        You can also expect instances that use automatic availability zone support, but have a single unit, to have no downtime. In this case, API Management distributes the unit's underlying VMs to two zones. The VM in the unaffected zone continues to work.

    - *Zone-redundant:* You can expect zone-redundant instances to have no downtime during an availability zone outage.

    - *Zonal:* For zonal instances, when a zone is unavailable, your instance is unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your instance uses. 

    - *Automatic and zone-redundant:*  For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, when a zone is unavailable, any units in the affected zone are also unavailable. You can choose to scale your instance to add more units.
    
    - *Zonal:* For zonal instances, when a zone is unavailable, your instance is unavailable. If you have a secondary instance in another availability zone, you're responsible for rerouting traffic to that secondary instance.

### Zone recovery

The zone recovery behavior depends on the availability zone configuration that your instance uses.

- **Automatic and zone-redundant:** For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, when the availability zone recovers, API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

- **Zonal:** For zonal instances, you're responsible for rerouting traffic to the instance in the original availability zone after the availability zone recovers.

### Testing for zone failures

The options for testing for zone failures depend on the availability zone configuration that your instance uses.

- **Automatic and zone-redundant:** For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, the API Management platform manages traffic routing, failover, and failback. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

- **Zonal:** For zonal instances, there's no way to simulate an outage of the availability zone that contains your API Management instance. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different instance in a different availability zone.

## Multi-region support

With a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps to reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

API Management only supports multi-region deployments in the Premium (classic) tier. It doesn't support multi-region deployments in the Consumption, Developer, Basic, Basic v2, Standard, Standard v2, and Premium v2 (preview) tiers. For more information, see [Requirements](#requirements).

When you add a region, you configure:

- The number of units that region hosts.

- [Availability zone support](#availability-zone-support), if that region provides availability zones.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.

### Region support

You can create multi-region deployments in the Premium (classic) tier with any Azure region that supports API Management. To see which regions support multi-region deployments, see [Product availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

### Requirements

You must use the Premium (classic) tier to configure multi-region support. To upgrade your instance to the Premium (classic) tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

> [!NOTE]
> **The Premium v2 tier** with enterprise capabilities is in preview. To determine whether your design should rely on early access features or generally available capabilities, evaluate your design and implementation timelines in relation to the available information about Premium v2's release and migration paths.

### Considerations

- **Gateway only:** Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region where you originally deployed the service.

- **Network requirements:** If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the virtual network and subnet region should match the secondary location that you configure. If you add, remove, or enable the availability zone in the primary region, or if you change the subnet of the primary region, then the virtual IP (VIP) address of your API Management instance changes. For more information, see [Changes to IP addresses](/azure/api-management/api-management-howto-ip-addresses#changes-to-ip-addresses). However, if you add a secondary region, the primary region's VIP doesn't change because every region has its own private VIP.

- **Domain Name System (DNS) names:** The gateway in each region, including the primary region, has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.

### Cost

Adding regions incurs costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

### Configure multi-region support

To configure multi-region support on an API Management instance, see [Deploy an API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#deploy-api-management-service-to-an-additional-region).

To remove a region from an API Management instance, see [Remove an API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#remove-an-api-management-service-region).

### Capacity planning and management

In a region-down scenario, there's no guarantee that requests for more capacity in another region will succeed. If you need guaranteed capacity when a region fails, you should create and configure your API Management instance to account for losing a region. You can do that by over-provisioning the capacity of your API Management instance. To learn more about the principle of over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

In multi-region deployments, autoscaling applies only to the primary region. Secondary regions require manual scaling adjustments or custom tools that you control.

### Normal operations

This section describes what to expect when API Management instances are configured with multi-region support and all regions are operational.

- **Traffic routing between regions:** API Management automatically routes incoming requests to a regional gateway. A request is routed to the regional gateway with the lowest latency from the client. If you need to use a different routing approach, you can configure your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](../api-management/api-management-howto-deploy-multi-region.md#use-custom-routing-to-api-management-regional-gateways).

    When a request reaches an API Management regional gateway, it's routed to the backend API unless a policy returns a response directly from the gateway, such as a cached response or an error code. In a multi-region solution, you need to take care to route to an instance of the backend API that meets your performance requirements. For more information, see [Route API calls to regional backend services](../api-management/api-management-howto-deploy-multi-region.md#route-api-calls-to-regional-backend-services).

- **Data replication between regions:** Gateway configuration, such as APIs and policy definitions, are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds.

    Rate limit counters and data in the internal cache are region-specific, so they aren't replicated between regions.

### Region-down experience

This section describes what to expect when API Management instances are configured with multi-region support and there's an outage in one of the regions that you use.

- **Detection and response:** API Management is responsible for detecting a failure in a region and automatically failing over to a gateway in one of the other regions that you configure.

- **Active requests:** Any active requests that are being processed in the faulty region might be dropped and should be retried by the client.

- **Expected data loss:** API Management doesn't store data, except for configuration, a cache, and rate limit counters.

    Configuration changes are replicated to each region within approximately 10 seconds. If an outage of your primary region occurs, you might lose configuration changes that aren't replicated.

    Rate limit counters and data in the internal cache are region-specific, so they aren't replicated between regions.

- **Expected downtime:** No gateway downtime is expected.

    If the primary region goes offline, the API Management management plane and developer portal become unavailable, but secondary regions continue to serve API requests by using the most recent gateway configuration.

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

### Region recovery

When the primary region recovers, API Management automatically restores units in the region and reroutes traffic between your units.

### Testing for region failures

To be ready for unexpected region outages, we recommend that you regularly test your responses to region failures. You can simulate some aspects of a region failure by [disabling routing to a regional gateway](../api-management/api-management-howto-deploy-multi-region.md#disable-routing-to-a-regional-gateway).

## Backups

API Management doesn't store most runtime data. However, you can back up your API Management service configuration. You can also use backup and restore operations to replicate API Management service configurations between operational environments, for example, development and staging.

> [!IMPORTANT]
> In a backup procedure, runtime data such as users and subscriptions are included, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information, see [How to implement disaster recovery by using service backup and restore in API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

For backup or restoration of some service components or resources, you can also consider customer-managed options such as [APIOps tooling](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops) and infrastructure as code (IaC) solutions. 

## Reliability during service maintenance

API Management performs regular service upgrades and other forms of maintenance.

In the Basic, Standard, and Premium (classic) tiers, you can customize when in the update process your instance receives an update. If you need to validate the effect of upgrades on your workload, consider configuring a test instance to receive updates early in an update cycle, and set your production instance to receive updates late in the cycle. You can also specify a maintenance window, which is the time of the day that you want the instance to apply service updates.

For more information, see [Configure service update settings for your API Management instances](../api-management/configure-service-update-settings.md).

## Service-level agreement

The SLA for API Management describes the expected availability of the service. It also describes the conditions that must be met to achieve that availability expectation. To understand these conditions, it's important that you review the [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

When you deploy an API Management instance in multiple availability zones or regions, the uptime percentage defined in the SLA increases.

The service provides its own SLA, but you also need to account for the anticipated reliability of other workload components, such as the API backends.

## Related content

- [Disaster recovery and business continuity for API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore)
- [Use availability zones in API Management](/azure/api-management/enable-availability-zone-support)
- [Multi-region deployment of API Management](/azure/api-management/api-management-howto-deploy-multi-region)
- [Monitor API Management](/azure/api-management/api-management-howto-use-azure-monitor)
- [API Management capacity planning](/azure/api-management/api-management-capacity)
- [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management)