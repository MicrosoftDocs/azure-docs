---
title: Reliability in Azure API Management
description: Learn about resiliency features in Azure API Management, including availability zones, multi-region deployments, transient fault handling, and service maintenance to achieve high availability and meet SLA requirements.
author: dlepow
ms.author: danlep
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-api-management
ai-usage: ai-assisted
ms.date: 01/09/2026
zone_pivot_groups: api-management-tiers
---

# Reliability in Azure API Management

[Azure API Management](/azure/api-management/api-management-key-concepts) is a fully managed service that helps organizations publish, secure, transform, maintain, and monitor APIs. As an Azure service, API Management provides a range of capabilities to support your reliability requirements.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make API Management resilient to a variety of potential outages and problems, including transient faults, availability zone outages, region outages, and service maintenance. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the API Management service level agreement (SLA).

## Reliability architecture overview

API Management uses a scale unit-based architecture to provide built-in redundancy and scalability. When you deploy an API Management instance, you configure one or more *scale units*, or *units*. Each unit is a logical representation of capacity that contains the necessary compute resources to handle API requests. 

### Units

Each unit consists of two compute resources (VMs or similar servers, depending on the service tier) that handle API requests together. You don't see these VMs or other servers. The platform automatically manages their creation and health monitoring. If one compute resource fails, the unit continues operating but at reduced capacity, providing some built-in reliability protection.

When you configure an instance with two or more units, the available units work together to process requests and provide automatic load balancing. If one of the units becomes unavailable, the remaining units continue to handle traffic, but with potentially reduced capacity.

To gain higher levels of reliability, API Management supports unit distribution across availability zones within a region and across multiple regions.

> [!NOTE]
> API Management uses units for the gateway components. Units aren't applicable for the developer portal or management plane.

### Service tiers

API Management service tiers provide different levels of reliability:

- **Premium (classic) tier:** Supports multiple units that can be distributed across availability zones and regions for maximum resilience.

- **Premium v2 tier**: Supports multiple units that can be distributed across availability zones. It doesn't currently support multi-region deployments. 

- **Basic v2, Standard, and Standard v2 tiers:** All support multiple units within a single datacenter. They don't support availability zones or multi-region deployments.

- **Developer tier:** Supports only a single unit and provides no availability zone or multi-region support. This tier is designed for development and testing scenarios. It isn't suitable for production workloads.

- **Consumption tier:** Has built-in resiliency capabilities and is resilient to a range of faults within a single Azure datacenter. However, the Consumption tier doesn't provide support for availability zones or multi-region deployments. To understand the expected uptime of a Consumption tier API Management instance, review the [service-level agreement (SLA)](#service-level-agreement).

> [!NOTE]
> The Developer and Premium tiers of API Management support [self-hosted gateways](../api-management/self-hosted-gateway-overview.md), which you can run on your own infrastructure. When you use self-hosted gateways, you're responsible for configuring them to meet your reliability requirements. Self-hosted gateways are outside the scope of this article.

## Production deployment recommendations

The Azure Well-Architected Framework provides recommendations across reliability, performance, security, cost, and operations. To understand how these areas influence each other and contribute to a reliable API Management solution, see [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management).

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

When you use API Management in front of an API, you might need to retry requests that fail because of transient faults. To protect your backend API from being overwhelmed by too many requests, API Management provides retry, rate-limit, and quota policies. You can also configure load balancing and circuit breaker capabilities by using [backend resources](../api-management/backends.md).

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

:::zone pivot="other-tiers"

To view information about availability zone support for the Premium and Premium v2 tiers, be sure to select the appropriate service tier at the beginning of this page.

:::zone-end


:::zone pivot="premium-classic"

API Management provides two types of availability zone support when you deploy a Premium (classic) API Management instance in a supported region:
	
- **Automatic** (Recommended): API Management provides automatic availability zone support when you don't specify which availability zones to use. 
    
- **Manual:** API Management provides manual availability zone support when you explicitly specify which availability zones to use. 

With availability zone support, API Management replicates service components across zones for high availability. In the primary region, these components include the gateway (scale units), management plane, and developer portal. In secondary regions, only the gateway units are replicated. For more information about secondary regions, see [resilience to region-wide failures](#resilience-to-region-wide-failures).

### Automatic availability zone support

You can use automatic availability zone support to choose either a single unit or multiunit instance configuration to achieve zone redundancy:

- **Multi-unit configuration** (Recommended): If your instance has two or more units, API Management makes a best-effort attempt to spread your instance's units among the region's availability zones. You can't determine which availability zones your units are placed into. Deploy a minimum of two units, which can be distributed across two zones.

    The following diagram shows an API Management instance with three units that's configured for automatic availability zone support:

    :::image type="complex" border="false" source="./media/reliability-api-management/zone-redundant-automatic-multi-unit.svg" alt-text="Diagram that shows three API Management units distributed across availability zones for automatic availability zone support.":::
       The diagram shows three boxes labeled Unit 1, Unit 2, and Unit 3 deployed in an API Management instance. Each unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains unit 1, zone 2 contains unit 2, and zone 3 contains unit 3.
    :::image-end:::

- **Single-unit configuration:** If your instance has a single unit, the unit's underlying compute resources are distributed to two availability zones. You can't determine which availability zones the unit's compute resources are placed into.

    :::image type="complex" border="false" source="./media/reliability-api-management/automatic-single-unit.svg" alt-text="Diagram that shows a single API Management unit distributed across two availability zones for automatic availability zone support.":::
       The diagram shows one box that's labeled Unit 1 deployed in an API Management instance. The unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. The Unit 1 box spans zones 1 and 2. Zone 3 is empty.
    :::image-end:::

### Manual availability zone support

If you want to explicitly select the availability zones to use, you can choose between zone-redundant and zonal configurations:

- **Zone-redundant:** Manually configure zone redundancy for an API Management instance in a supported region to provide redundancy for service components. When you select two or more availability zones to use, Azure automatically replicates the service components across the selected zones.

    :::image type="complex" border="false" source="./media/reliability-api-management/zone-redundant-automatic-multi-unit.svg" alt-text="Diagram that shows three API Management units distributed across availability zones for manual zone redundancy.":::
       The diagram shows three boxes labeled Unit 1, Unit 2, and Unit 3 deployed in an API Management instance. Each unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains unit 1, zone 2 contains unit 2, and zone 3 contains unit 3.
    :::image-end:::

- **Zonal:** The API Management service components are deployed in a single zone that you select within an Azure region. All of the units are placed into the same availability zone.

    :::image type="complex" border="false" source="./media/reliability-api-management/zonal.svg" alt-text="Diagram that shows a zonal API Management deployment that has two units, in a single availability zone.":::
       The diagram shows two boxes labeled Unit 1 and Unit 2 deployed in an API Management instance. Each unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains both Unit 1 and Unit 2 boxes. Zone 2 and Zone 3 don't contain any units.
    :::image-end:::

    > [!IMPORTANT]
    > Pin to a single availability zone only if [cross-zone latency](./availability-zones-overview.md#inter-zone-latency) is too high for your needs and after you verify that the latency doesn't meet your requirements. By itself, a zonal instance doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal API Management deployment, you need to explicitly deploy separate instances into multiple availability zones and configure traffic routing and failover.

:::zone-end

:::zone pivot="premium-v2"

In the Premium v2 tier, you can enable zone redundancy for an API Management instance in a supported region.
	
With availability zone support, API Management replicates the gateway (scale units), management plane, and developer portal. You can choose either a single unit or multiunit instance configuration to achieve zone redundancy:

- **Multi-unit configuration** (Recommended): If your instance has two or more units, API Management makes a best-effort attempt to spread your instance's units among the region's availability zones. You can't determine which availability zones your units are placed into. Deploy a minimum of two units, which can be distributed across two zones.

    The following diagram shows an API Management instance with three units that's configured for availability zone support:

    :::image type="complex" border="false" source="./media/reliability-api-management/zone-redundant-automatic-multi-unit.svg" alt-text="Diagram that shows three API Management units distributed across availability zones.":::
       The diagram shows three boxes labeled Unit 1, Unit 2, and Unit 3 deployed in an API Management instance. Each unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. Zone 1 contains unit 1, zone 2 contains unit 2, and zone 3 contains unit 3.
    :::image-end:::

- **Single-unit configuration:** If your instance has a single unit, the unit's underlying compute resources are distributed to two availability zones. You can't determine which availability zones the unit's compute resources are placed into.

    :::image type="complex" border="false" source="./media/reliability-api-management/automatic-single-unit.svg" alt-text="Diagram that shows a single API Management unit distributed across two availability zones.":::
       The diagram shows one box that's labeled Unit 1 deployed in an API Management instance. The unit box contains two VM icons that represent compute resources. Three larger boxes are labeled Availability Zone 1, Availability Zone 2, and Availability Zone 3. The Unit 1 box spans zones 1 and 2. Zone 3 is empty.
    :::image-end:::

:::zone-end

### Requirements

- **Region support:** API Management supports availability zones for the Premium (classic) and Premium v2 tiers in regions where the API Management tier is available and the region [supports availability zones](./regions-list.md).

- **Tier requirement:** You must use the Premium (classic) or Premium v2 tier to configure availability zone support. API Management doesn't currently support availability zones in the classic Consumption, Developer, Basic, and Standard tiers or in the Basic v2 and Standard v2 tiers. For upgrade options, see [Upgrade and scale an API Management instance](../api-management/upgrade-and-scale.md).

:::zone pivot="premium-classic"

### Considerations

- **Number of units for zone-redundant instances:** If you manually configure zone redundancy for an instance, you also need to configure a number of API Management units that can be distributed evenly across all of your selected availability zones. For example, if you select two zones, you must configure at least two units. You can instead configure four units, or another multiple of two units. If you select three availability zones, you must configure three units, six units, or another multiple of three units.

    If you use the automatic availability zone support, there's no requirement to use a specific number of units. The units that you deploy are distributed among the availability zones in a best-effort manner. For maximum zone redundancy, use at least two units so that an availability zone outage doesn't affect your gateway performance. 
    
    To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an API Management instance](/azure/api-management/upgrade-and-scale).

- **Autoscaling:** If you manually configure availability zones on an API Management instance that's configured with autoscaling, you might need to adjust your autoscale settings after configuration. In this case, the number of API Management units in autoscale rules and limits must be a multiple of the number of zones. If you use the automatic availability zone support, you don't need to adjust your autoscale settings. 

- **IP address requirements:** When you enable availability zone support on an API Management instance that's deployed in an external or internal virtual network, you must specify a public IP address resource for the instance to use. In an internal virtual network, the public IP address is used only for management operations, not for API requests. For more information, see [IP addresses in API Management](../api-management/api-management-howto-ip-addresses.md). 

:::zone-end

:::zone pivot="premium-v2"

### Considerations

- **Number of units for zone-redundant instances:** In the Premium v2 tier, there's no requirement to use a specific number of units. The units that you deploy are distributed among the availability zones in a best-effort manner. For maximum zone redundancy, use at least two units to provide sufficient capacity so that an availability zone outage doesn't affect your gateway performance. 
    
    To determine the number of units that provide your required gateway performance, use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing. For more information about scaling and upgrading your service instance, see [Upgrade and scale an API Management instance](/azure/api-management/upgrade-and-scale).

- **Autoscaling:** In the Premium v2 tier, you don't need to adjust your autoscale settings when you enable availability zone support. 

:::zone-end

:::zone pivot="premium-classic,premium-v2"

### Cost

Regardless of your availability zone configuration, if you add more units, you incur more costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

::: zone-end

:::zone pivot="premium-classic"

### Configure availability zone support

This section explains how to configure availability zone support for your API Management instance. For more information, see [Enable availability zone support on API Management instances](../api-management/enable-availability-zone-support.md).

- **Create an API Management instance that supports availability zones:** When you create a Premium (classic) API Management instance in a region that supports availability zones, the instance supports availability zones by default. You can select automatic availability zone support or manually configure zonal or zone-redundant support.

    > [!NOTE]
    > [!INCLUDE [Availability zone numbering](./includes/reliability-availability-zone-numbering-include.md)]

- **Enable or reconfigure availability zone support:** You can change the availability zone configuration for an API Management instance, including adding availability zones and moving a zonal instance between availability zones. To learn how to configure availability zone support on an API Management instance, see [Enable availability zone support on API Management instances](../api-management/enable-availability-zone-support.md). None of the configuration options require downtime.

    When you change availability zone configuration, the changes can take 15 to 45 minutes or more to apply. The API Management gateway can continue to handle API requests during this time.

    Changing the availability zone configuration triggers a public and private [IP address change](../api-management/api-management-howto-ip-addresses.md#changes-to-ip-addresses).

:::zone-end

:::zone pivot="premium-v2"

### Configure availability zone support

This section explains how to configure availability zone support for your API Management instance. For more information, see [Enable availability zone support on API Management instances](../api-management/enable-availability-zone-support.md).


- **Create an API Management instance that supports availability zones:** In the Premium v2 tier, optionally enable zone redundancy when you create an API Management instance in a region that supports availability zones. If zone redundancy can't be enabled because of capacity constraints or other issues, the service deployment fails.

- **Enable or reconfigure availability zone support:** You can't change the availability zone configuration after the instance is created.

:::zone-end

:::zone pivot="premium-classic, premium-v2"

### Capacity planning and management

In a zone-down scenario, there's no guarantee that requests for more capacity in another availability zone succeed. The backfilling of lost units occurs on a best-effort basis. If you need guaranteed capacity when an availability zone fails, create and configure your API Management instance to account for losing a zone by taking all of the following actions:

- Over-provision the units of your API Management instance.

- Use automatic or zone-redundant availability zone configuration.

For more information, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

Use [capacity metrics](/azure/api-management/api-management-capacity) and your own testing to determine the number of units that provide your required gateway performance. For more information about how to scale and upgrade your service instance, see [Upgrade and scale an API Management instance](/azure/api-management/upgrade-and-scale).

### Behavior when all zones are healthy

This section describes what to expect when API Management instances are configured with availability zone support and all availability zones are operational.

- **Traffic routing between zones:** During normal operations, traffic is routed between all of your available API Management units across all selected availability zones.

- **Data replication between zones:** API Management stores and replicates the following data.

    - *Gateway configuration*, such as APIs and policy definitions, regularly synchronizes between the availability zones that you select for the instance. Propagation of updates between the availability zones normally takes less than 10 seconds.

    - *Data in the internal cache*, if you use the internal cache that API Management provides. Cache entries are distributed among availability zones. The internal cache is volatile and data isn't guaranteed to be persisted. Consider using an external cache if you need to persist cached data.

    - *Rate limit counters*, if you use the rate limiting capabilities that API Management provides. Rate limit counters are asynchronously replicated between the availability zones that you select for the instance.

:::zone-end

:::zone pivot="premium-classic"

### Behavior during a zone failure

This section describes what to expect when API Management instances are configured with availability zone support and there's an availability zone outage.


- **Detection and response:** Responsibility for detection and response depends on the availability zone configuration that your instance uses.

    - *Automatic and zone-redundant:* For instances that are configured to use automatic availability zone support or manually configured to use zone redundancy, the API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

    - *Zonal:* For instances that are configured to be zonal, you need to detect the loss of an availability zone and initiate a failover to a secondary instance that you create in another availability zone.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Expected data loss:** API Management stores the following data.

    - *Gateway configuration changes*, which are replicated to each selected availability zone within approximately 10 seconds. If an outage of an availability zone occurs, you might lose configuration changes that aren't replicated.

    - *Data in the internal cache*, if you use the internal cache feature. The internal cache is volatile and data isn't guaranteed to be persisted. During an availability zone outage, you might lose some or all cached data. Consider using an external cache if you need to persist cached data.

    - *Rate limit counters*, if you use the rate limit feature. During an availability zone outage, rate limit counters might not be up-to-date in the surviving zones.

- **Expected downtime:** The expected downtime depends on the availability zone configuration that your instance uses.

    - *Automatic:* You can expect instances that use automatic availability zone support to have no downtime during an availability zone outage. Units in the unaffected zone or zones continue to work.
        
        You can also expect instances that use automatic availability zone support, but have a single unit, to have no downtime. In this case, API Management distributes the unit's underlying compute resources to two zones. The resource in the unaffected zone continues to work.

    - *Zone-redundant:* You can expect zone-redundant instances to have no downtime during an availability zone outage.

    - *Zonal:* For zonal instances, when a zone is unavailable, your instance is unavailable until the availability zone recovers.

- **Traffic rerouting:** The traffic rerouting behavior depends on the availability zone configuration that your instance uses. 

    - *Automatic and zone-redundant:*  For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, when a zone is unavailable, any units in the affected zone are also unavailable. You can choose to scale your instance to add more units.
    
    - *Zonal:* For zonal instances, when a zone is unavailable, your instance is unavailable. If you have a secondary instance in another availability zone, you're responsible for rerouting traffic to that secondary instance.

:::zone-end

:::zone pivot="premium-v2"

### Behavior during a zone failure

This section describes what to expect when API Management instances are configured with availability zone support and there's an availability zone outage.


- **Detection and response:** In the Premium v2 tier, the API Management platform is responsible for detecting a failure in an availability zone and responding. You don't need to do anything to initiate a zone failover.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to an API Management unit in the faulty availability zone are terminated and need to be retried.

[!INCLUDE [Availability zone down notification (Service Health and Resource Health)](./includes/reliability-availability-zone-down-notification-service-resource-include.md)]

- **Expected data loss:** API Management stores the following data.

    - *Gateway configuration changes*, which are replicated to each selected availability zone within approximately 10 seconds. If an outage of an availability zone occurs, you might lose configuration changes that aren't replicated.

    - *Data in the internal cache*, if you use the internal cache feature. The internal cache is volatile and data isn't guaranteed to be persisted. During an availability zone outage, you might lose some or all cached data. Consider using an external cache if you need to persist cached data.

    - *Rate limit counters*, if you use the rate limit feature. During an availability zone outage, rate limit counters might not be up-to-date in the surviving zones.

- **Expected downtime:** You can expect instances to have no downtime during an availability zone outage. Units in the unaffected zone or zones continue to work.
        
    You can also expect instances that have a single unit to have no downtime. In this configuration, API Management distributes the unit's underlying compute resources to two zones. The resource in the unaffected zone continues to work.

- **Traffic rerouting:** When a zone is unavailable, any units in the affected zone are also unavailable. You can scale your instance to add more units.

:::zone-end

:::zone pivot="premium-classic"

### Zone recovery

- **Automatic and zone-redundant:** For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, when the availability zone recovers, API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

- **Zonal:** For zonal instances, you're responsible for rerouting traffic to the instance in the original availability zone after the availability zone recovers.

:::zone-end

:::zone pivot="premium-v2"

### Zone recovery

In the Premium v2 tier, when the availability zone recovers, API Management automatically restores units in the availability zone and reroutes traffic between your units as normal.

:::zone-end

:::zone pivot="premium-classic"

### Test for zone failures

- **Automatic and zone-redundant:** For instances that are configured to use automatic availability zone support or are manually configured to use zone redundancy, the API Management platform manages traffic routing, failover, and failback. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

- **Zonal:** For zonal instances, you can't simulate an outage of the availability zone that contains your API Management instance. However, you can manually configure upstream gateways or load balancers to redirect traffic to a different instance in a different availability zone.

:::zone-end

:::zone pivot="premium-v2"

### Test for zone failures

In the Premium v2 tier, the API Management platform manages traffic routing, failover, and failback. This feature is fully managed, so you don't need to initiate or validate availability zone failure processes.

:::zone-end

## Resilience to region-wide failures 

By using a multi-region deployment, you can add regional API gateways to an existing API Management instance in one or more supported Azure regions. Multi-region deployment helps reduce any request latency that's perceived by geographically distributed API consumers. A multi-region deployment also improves service availability if one region goes offline.

> [!IMPORTANT]
> Multi-region deployments are supported only in the Premium (classic) tier of API Management. 

:::zone pivot="other-tiers,premium-v2"

To view information about multi-region support, be sure to select the Premium (classic) tier at the beginning of this page.

:::zone-end

:::zone pivot="premium-classic"

### Microsoft-managed multi-region deployment

When you add a region, you configure:

- The number of units that region hosts.

- [Resilience to availability zone failures](#resilience-to-availability-zone-failures), if that region provides availability zones.

- [Virtual network settings](/azure/api-management/virtual-network-concepts) in the added region, if networking is configured in the existing region or regions.

#### Requirements

- **Region support:** You can create multi-region deployments in the Premium (classic) tier with any Azure region that supports API Management. To see which regions support multi-region deployments, see [Product availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

- **Tier requirement:** You must use the Premium (classic) tier to configure multi-region support. To upgrade your instance to the Premium (classic) tier, see [Upgrade to the Premium tier](../api-management/upgrade-and-scale.md#change-your-api-management-service-tier).

#### Considerations

- **Gateway only:** Only the gateway component of your API Management instance is replicated to multiple regions. The instance's management plane and developer portal remain hosted only in the primary region where you originally deployed the service.

- **Network requirements:** If you want to configure a secondary location for your API Management instance when it's deployed (injected) in a virtual network, the virtual network and subnet region should match the secondary location that you configure. If you add, remove, or enable the availability zone in the primary region, or if you change the subnet of the primary region, the virtual IP (VIP) address of your API Management instance changes. For more information, see [Changes to IP addresses](/azure/api-management/api-management-howto-ip-addresses#changes-to-ip-addresses). However, if you add a secondary region, the primary region's VIP doesn't change because every region has its own private VIP.

- **Domain Name System (DNS) names:** The gateway in each region, including the primary region, has a regional DNS name that follows the URL pattern of `https://<service-name>-<region>-01.regional.azure-api.net`, for example `https://contoso-westus2-01.regional.azure-api.net`.

#### Cost

Adding regions incurs costs. For information, see [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/).

#### Configure multi-region support

To configure multi-region support on an API Management instance, see [Deploy an API Management instance to multiple Azure regions](/azure/api-management/api-management-howto-deploy-multi-region#deploy-api-management-service-to-an-additional-region).

To remove a region from an API Management instance, see [Remove an API Management service region](/azure/api-management/api-management-howto-deploy-multi-region#remove-an-api-management-service-region).

#### Capacity planning and management

In a region-down scenario, there's no guarantee that requests for more capacity in another region succeed. If you need guaranteed capacity when a region fails, you should create and configure your API Management instance to account for losing a region. You can do that by over-provisioning the capacity of your API Management instance. To learn more about the principle of over-provisioning, see [Manage capacity with over-provisioning](./concept-redundancy-replication-backup.md#manage-capacity-with-over-provisioning).

In multi-region deployments, autoscaling applies only to the primary region. Secondary regions require manual scaling adjustments or custom tools that you control.

#### Behavior when all regions are healthy

This section describes what to expect when API Management instances are configured with multi-region support and all regions are operational.

- **Traffic routing between regions:** API Management automatically routes incoming requests to a regional gateway. A request is routed to the regional gateway with the lowest latency from the client. If you need to use a different routing approach, you can configure your own Traffic Manager with custom routing rules. For more information, see [Use custom routing to API Management regional gateways](../api-management/api-management-howto-deploy-multi-region.md#use-custom-routing-to-api-management-regional-gateways).

    When a request reaches an API Management regional gateway, it's routed to the backend API unless a policy returns a response directly from the gateway, such as a cached response or an error code. In a multi-region solution, you need to take care to route to an instance of the backend API that meets your performance requirements. For more information, see [Route API calls to regional backend services](../api-management/api-management-howto-deploy-multi-region.md#route-api-calls-to-regional-backend-services).

- **Data replication between regions:** Gateway configuration, such as APIs and policy definitions, are regularly synchronized between the primary and secondary regions you add. Propagation of updates to the regional gateways normally takes less than 10 seconds.

    Rate limit counters and data in the internal cache are region-specific, so they're not replicated between regions.

#### Behavior during a region failure

This section describes what to expect when API Management instances are configured with multi-region support and there's an outage in one of the regions that you use.

- **Detection and response:** API Management is responsible for detecting a failure in a region and automatically failing over to a gateway in one of the other regions that you configure.

- **Active requests:** Any active requests that are being processed in the faulty region might be dropped and the client should retry them.

- **Expected data loss:** API Management doesn't store data, except for configuration, a cache, and rate limit counters.

    Configuration changes are replicated to each region within approximately 10 seconds. If an outage of your primary region occurs, you might lose configuration changes that aren't replicated.

    Rate limit counters and data in the internal cache are region-specific, so they're not replicated between regions.

- **Expected downtime:** No gateway downtime is expected.

    If the primary region goes offline, the API Management management plane and developer portal become unavailable. However, secondary regions continue to serve API requests by using the most recent gateway configuration.

- **Traffic rerouting:** If a region goes offline, API requests are automatically routed around the failed region to the next closest gateway.

#### Region recovery

When the primary region recovers, API Management automatically restores units in the region and reroutes traffic between your units.

#### Test for region failures

To be ready for unexpected region outages, regularly test your responses to region failures. You can simulate some aspects of a region failure by [disabling routing to a regional gateway](../api-management/api-management-howto-deploy-multi-region.md#disable-routing-to-a-regional-gateway).

:::zone-end


## Backup and restore

API Management doesn't store most runtime data. However, you can back up your API Management service configuration. You can also use backup and restore operations to replicate API Management service configurations between operational environments, such as development and staging.

> [!IMPORTANT]
> In a backup procedure, runtime data such as users and subscriptions are included, which might not always be desirable.

Backup is supported in Developer, Basic, Standard, and Premium tiers.

For more information, see [How to implement disaster recovery by using service backup and restore in API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore).

For backup or restoration of some service components or resources, you can also consider customer-managed options such as [APIOps tooling](/azure/architecture/example-scenario/devops/automated-api-deployments-apiops) and infrastructure as code (IaC) solutions. 

## Resilience to service maintenance

API Management performs regular service upgrades and other forms of maintenance.

In the Basic, Standard, and Premium (classic) tiers, you can customize when in the update process your instance receives an update. If you need to validate the effect of upgrades on your workload, consider configuring a test instance to receive updates early in an update cycle, and set your production instance to receive updates late in the cycle. You can also specify a maintenance window, which is the time of the day that you want the instance to apply service updates.

For more information, see [Configure service update settings for your API Management instances](../api-management/configure-service-update-settings.md).

## Service-level agreement

[!INCLUDE [SLA description](includes/reliability-service-level-agreement-include.md)]

When you deploy an API Management instance in multiple availability zones or regions, the uptime percentage defined in the SLA increases.

The service provides its own SLA, but you also need to account for the anticipated reliability of other workload components, such as the API backends.

## Related content

- [Disaster recovery and business continuity for API Management](/azure/api-management/api-management-howto-disaster-recovery-backup-restore)
- [Use availability zones in API Management](/azure/api-management/enable-availability-zone-support)
- [Multi-region deployment of API Management](/azure/api-management/api-management-howto-deploy-multi-region)
- [Monitor API Management](/azure/api-management/api-management-howto-use-azure-monitor)
- [API Management capacity planning](/azure/api-management/api-management-capacity)
- [Architecture best practices for API Management](/azure/well-architected/service-guides/azure-api-management)