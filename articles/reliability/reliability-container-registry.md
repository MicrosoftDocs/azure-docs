---
title: Reliability in Azure Container Registry
description: Learn about reliability in Azure Container Registry, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-registry
ms.date: 06/16/2025
ms.update-cycle: 180-days
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Registry works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Registry

This article describes reliability support in Azure Container Registry (ACR), zone redundancy using availablity zones within a region, and geo-replication to multiple regions without using Azure paired regions. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

Azure Container Registry is a managed container registry service used to store and manage your private Docker container images and related artifacts for your container deployments. For more information, see [What is Azure Container Registry?](/azure/container-registry/container-registry-intro).

## Production deployment recommendations

For production workloads, use the Premium tier of Azure Container Registry, which provides the most comprehensive reliability features. Enable zone redundancy to protect against zone-level failures within a region. For multi-region scenarios, configure geo-replication to distribute your registry across multiple regions based on your specific geographic and compliance requirements.

The Premium tier also provides higher performance limits, enhanced security features, and advanced capabilities that are essential for production container workloads. For complete information on service tiers and features, see [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus).

## Reliability architecture overview

Azure Container Registry is built on Azure's distributed infrastructure to provide high availability and data durability. The service consists of several key components that work together to ensure reliability:

- **Registry service**: The core registry service that handles container image storage, authentication, and API operations
- **Storage layer**: Uses Azure Storage to persist container images and artifacts with built-in encryption and redundancy
- **Control plane**: Manages registry configuration, geo-replication, and zone redundancy settings
- **Data plane**: Handles container image push and pull operations through regional endpoints

The service provides built-in resilency through zone redundancy within regions and geo-replication across regions. Zone redundancy automatically distributes data across multiple availability zones, while geo-replication creates independent registry replicas in customer-selected regions. Both features are available in the Premium tier and work together to provide comprehensive protection against infrastructure failures.

:::image type="content" source="./media/reliability-acr/acr-reliability-architecture-overview.png" alt-text="Diagram that shows Azure Container Registry architecture with control plane, data plane, storage layer, zone redundancy across availability zones, and geo-replication across regions." border="false" lightbox="./media/reliability-acr/acr-reliability-architecture-overview.png":::

### Regional storage

Azure Container Registry stores data in the region where the registry is created, to help customers meet data residency and compliance requirements. In all regions except Brazil South and Southeast Asia, Azure may also store registry data in a paired region in the same geography. In the Brazil South and Southeast Asia regions, registry data is always confined to the region, to accommodate data residency requirements for those regions.

If a regional outage occurs, the registry data may become unavailable and is not automatically recovered. Customers who wish to have their registry data stored in multiple regions for better performance across different geographies or who wish to have resiliency in the event of a regional outage should enable geo-replication.

For zone redundancy, Azure Container Registry automatically distributes registry data across multiple availability zones within a region. This provides protection against datacenter-level failures while maintaining high availability for registry operations including pushing, pulling, and managing container images and artifacts. For details on zone redundancy, see [Enable zone redundancy in Azure Container Registry](/azure/container-registry/zone-redundancy).

For multi-region scenarios, geo-replication creates additional registry replicas in customer-selected regions. For comprehensive information on geo-replication capabilities, see the [Multi-region support](#multi-region-support) section below.

**Important**: ACR Tasks doesn't yet support availability zones. Zone redundancy applies to the registry service itself but not to ACR Tasks operations.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Container Registry handles transient faults internally through several mechanisms. The service implements automatic retry logic for registry operations and maintains connection pooling for efficient resource utilization. Container Registry operations are designed to be idempotent, allowing safe retries of push and pull operations.

For client applications using Azure Container Registry, implement appropriate retry policies with exponential backoff when performing registry operations. Use the official Docker client or Azure Container Registry SDKs which include built-in retry mechanisms for common transient failures.

Monitor registry operations through Azure Monitor metrics and logs to identify patterns of transient faults. Set up alerts for registry availability metrics to proactively detect issues that might impact your container workloads.

When using geo-replicated registries, implement failover logic in your applications to automatically switch to alternative registry endpoints if the primary endpoint becomes temporarily unavailable. This provides additional resilience against transient faults that might affect a specific regional endpoint.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Container Registry supports zone-redundant deployments in the Premium tier. When you create a Premium registry in a region that supports availability zones, the registry is automatically configured as zone-redundant, distributing registry data and operations across multiple availability zones within the region.

Zone redundancy in Azure Container Registry protects your container images and artifacts against zone-level failures. The service automatically replicates data across multiple zones and can continue operating even if one availability zone becomes unavailable. Zone redundancy provides higher availability compared to single-zone deployments without requiring configuration changes to your container workloads.

### Region support

Zone-redundant Azure Container Registry is supported in the following regions:

| Americas | Europe | Africa | Asia Pacific |
| --- | --- | --- | --- |
| Brazil South<br>Canada Central<br>Central US<br>East US<br>East US 2<br>East US 2 EUAP<br>South Central US<br>US Government Virginia<br>West US 2<br>West US 3 | France Central<br>Germany West Central<br>Italy North<br>North Europe<br>Norway East<br>Sweden Central<br>Switzerland North<br>UK South<br>West Europe | South Africa North | Australia East<br>Central India<br>China North 3<br>East Asia<br>Japan East<br>Korea Central<br>Qatar Central<br>Southeast Asia<br>UAE North |

For the most current list of regions with availability zone support, see [Azure regions with availability zones](/azure/reliability/availability-zones-region-support).

### Requirements

You must use the Premium tier to enable zone redundancy. Zone redundancy is automatically enabled when you create a Premium registry in a region that supports availability zones - no additional configuration is required.

### Considerations

Zone redundancy in Azure Container Registry provides protection against single zone failures, but registry operations may experience slightly higher latency during zone failover scenarios. Container image pulls and pushes continue to function during zone outages with automatic failover to healthy zones.

When using geo-replication with zone-redundant registries, each replicated registry inherits the zone redundancy configuration of its deployment region, providing both zone-level and region-level protection.

### Cost

Zone redundancy is included with Premium tier registries at no additional cost. The Premium tier is priced higher than Basic and Standard tiers, but zone redundancy itself does not incur additional charges beyond the Premium tier pricing.

### Configure availability zone support

Zone redundancy is automatically enabled when you create a Premium registry in a region that supports availability zones, as mentioned in the Requirements section above.

- **Create**. Use the Azure portal, Azure CLI, Azure PowerShell, or ARM templates to create Premium registries. For configuration details, see [Create a container registry using the Azure portal](/azure/container-registry/container-registry-get-started-portal).
- **Disable**. Zone redundancy cannot be disabled once enabled for a registry. If you need a non-zone-redundant registry, you must create a new registry and migrate your container images.
- **Migrate**. Existing Basic or Standard tier registries can be upgraded to Premium tier, however upgrading alone does not enable zone redundancy for existing registries. To get zone redundancy, you must create a new Premium registry in a supported region and migrate your container images.

**Important limitations**:
- Region conversions to availability zones are not currently supported
- Zone redundancy cannot be disabled once enabled in a region
- The availability zone property is per region and cannot be changed once replications are created, except by deleting and re-creating the replications

### Normal operations

During normal operations with zone redundancy enabled, Azure Container Registry automatically distributes registry operations across multiple availability zones. Container image pushes and pulls are load-balanced across zones to optimize performance and ensure high availability.

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-healthy-ops.png" alt-text="Diagram that shows normal zone redundancy operations with clients connecting to a single registry endpoint that automatically routes traffic across three availability zones." border="false" lightbox="./media/reliability-acr/acr-zone-redundancy-healthy-ops.png":::

**Traffic routing between zones**. Container Registry automatically distributes registry operations across all available zones through its built-in service architecture. The registry service automatically routes requests to healthy zones without requiring external load balancers.

**Data replication between zones**. Registry data including container images, manifests, and metadata are synchronously replicated across multiple availability zones. Changes are committed only after successful replication to multiple zones, ensuring data consistency and durability.

### Zone-down experience

When a zone becomes unavailable, Azure Container Registry automatically handles the failover process with minimal impact to registry operations:

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-failover.png" alt-text="Diagram that shows zone failover scenario where Zone 1 fails and Azure Container Registry automatically routes traffic to healthy zones 2 and 3." border="false" lightbox="./media/reliability-acr/acr-zone-redundancy-failover.png":::

- **Detection and response**. Microsoft-managed automatic detection and failover occur when a zone becomes unavailable. The service automatically routes traffic to remaining healthy zones.
- **Notification**. Zone-level outages are reflected in Azure Service Health and Azure Monitor metrics. Configure alerts on registry availability metrics to monitor zone health.
- **Active requests**. Active registry operations are automatically retried against healthy zones. Most operations complete successfully with minimal delay.
- **Expected data loss**. No data loss occurs during zone failover due to synchronous replication across zones.
- **Expected downtime**. Minimal downtime during automatic failover, typically seconds for most registry operations.
- **Traffic rerouting**. The platform automatically reroutes traffic to healthy zones without requiring configuration changes.

### Failback

When the affected availability zone recovers, Azure Container Registry automatically distributes operations across all available zones, including the recovered zone. The service rebalances traffic and data distribution without requiring manual intervention or causing service disruption.

### Testing for zone failures

Zone failover testing is managed by Microsoft and does not require customer-initiated testing. The service is designed to automatically handle zone failures without impacting registry availability or data integrity.

## Multi-region support

Azure Container Registry provides native multi-region support through geo-replication in the Premium tier. Geo-replication creates registry replicas in multiple regions of your choice, enabling local access to container images and reducing latency for globally distributed applications. For comprehensive details, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication).

Unlike many Azure services, Container Registry geo-replication does not use Azure paired regions. You have complete flexibility to select any combination of Azure regions for replication based on your specific geographic, performance, and compliance requirements. Each geo-replicated registry functions as a complete registry endpoint, supporting all registry operations including image pushes, pulls, and management tasks.

Geo-replication automatically synchronizes container images and artifacts across all configured regions. The service uses content-addressable storage to efficiently replicate only the unique image layers, minimizing bandwidth usage and replication time. Registry operations are automatically routed to the nearest regional endpoint for optimal performance.

:::image type="content" source="./media/reliability-acr/acr-geo-replication-healthy-ops.png" alt-text="Diagram that shows geo-replication architecture with global clients connecting to primary and replica registries across multiple regions with asynchronous replication." border="false" lightbox="./media/reliability-acr/acr-geo-replication-healthy-ops.png":::

### Region support

Geo-replication is available in all Azure regions where the Premium tier is supported. You can replicate to any combination of regions without restrictions based on paired regions.

### Requirements

You must use the Premium tier to enable geo-replication. Geo-replication can be configured during registry creation or added to existing Premium registries.

### Considerations

Each geo-replicated region functions as an independent registry endpoint. Container clients can connect to any regional endpoint for registry operations. Consider configuring your container orchestration platforms to use the regional endpoint closest to their deployment location for optimal performance.

Geo-replication provides eventual consistency across regions, with replication typically completing within minutes of changes. Large container images or high-frequency updates may take longer to replicate across all regions.

### Cost

Each geo-replicated region is billed separately according to Premium tier pricing for the respective region. Additionally, egress charges apply for data transfer between regions during initial replication and ongoing synchronization.

### Configure multi-region support

Geo-replication can be configured through the Azure portal, Azure CLI, Azure PowerShell, or ARM templates.

- **Create**. Configure geo-replication during registry creation by specifying additional regions, or add geo-replication to existing Premium registries.
- **Disable**. Remove individual regional replicas through the Azure portal or command-line tools. The primary registry region cannot be removed.
- **Migrate**. Upgrade existing Basic or Standard tier registries to Premium tier to enable geo-replication capabilities.

### Normal operations

During normal multi-region operations, Azure Container Registry synchronizes data across all configured regions automatically. Container image pushes to any regional endpoint are replicated to all other regions based on the configured replication scope.

**Traffic routing between regions**. Container Registry operates in an active-active configuration where each regional endpoint can serve all registry operations independently. Clients typically connect to the regional endpoint closest to their location for optimal performance.

**Data replication between regions**. Registry data is replicated asynchronously between regions. Container image layers are synchronized efficiently using content-addressable storage, with only unique layers transferred between regions. For replication details, see [Container image storage in Azure Container Registry](/azure/container-registry/container-registry-storage).

### Region-down experience

When a region becomes unavailable, container operations can continue using alternative regional endpoints:

:::image type="content" source="./media/reliability-acr/acr-geo-replication-failover.png" alt-text="Diagram that shows regional failover scenario where primary region becomes unavailable and application health monitoring triggers failover to replica regions." border="false" lightbox="./media/reliability-acr/acr-geo-replication-failover.png":::

- **Detection and response**. Customer applications are responsible for detecting regional endpoint unavailability and switching to alternative regions. Configure health checks and failover logic in your container orchestration platforms.
- **Notification**. Regional outages are reported through Azure Service Health. Monitor registry availability metrics for each regional endpoint to detect issues. For service health information, see [Azure Service Health](/azure/service-health/).
- **Active requests**. Active requests to an unavailable region will fail and must be retried against alternative regional endpoints.
- **Expected data loss**. No data loss occurs as registry data is replicated across multiple regions. Recent changes that have not yet replicated may be temporarily unavailable.
- **Expected downtime**. No downtime for registry operations when using alternative regional endpoints. Applications must be configured to failover to available regions.
- **Traffic rerouting**. Applications must implement logic to route traffic to available regional endpoints when the primary region becomes unavailable.

### Failback

When a region recovers, registry operations automatically resume for that regional endpoint. The service synchronizes any changes that occurred during the outage. Applications can resume using the recovered regional endpoint, though this typically requires manual reconfiguration or automated failback logic.

### Testing for region failures

Test your applications' ability to handle regional failures by temporarily blocking access to a regional registry endpoint and verifying that container operations successfully failover to alternative regions. Use Azure Chaos Studio or manual testing procedures to validate your disaster recovery capabilities.

## Backups

Azure Container Registry doesn't provide traditional backup and restore capabilities because the service is designed with built-in data durability and redundancy mechanisms. Instead of point-in-time backups, the service ensures data protection through:

- **Zone redundancy**: Synchronous replication across availability zones within a region
- **Geo-replication**: Asynchronous replication across multiple regions
- **Azure Storage redundancy**: Built-in storage-level redundancy for container images and artifacts

This architecture approach provides continuous data protection without the need for traditional backup operations.

For additional data protection, you can export container images and artifacts from your registry to external storage or alternative registries. Use Azure Container Registry import/export capabilities or standard Docker commands to create copies of critical container images for disaster recovery scenarios.

Consider implementing container image promotion pipelines that automatically replicate critical images across multiple registries or storage systems as part of your overall backup strategy.

## Service-level agreement

Azure Container Registry provides different service-level agreements based on the configuration and tier:

- **Premium tier with zone redundancy**: Provides higher availability guarantees compared to single-zone deployments
- **Geo-replicated registries**: Each regional replica is covered by the SLA independently
- **Service tier requirements**: Only Premium tier configurations with zone redundancy receive the enhanced SLA

The specific availability percentages and conditions that must be met to achieve the SLA guarantees are detailed in the official service-level agreement documentation. For complete SLA terms and conditions, see [SLA for Azure Container Registry](https://azure.microsoft.com/support/legal/sla/container-registry/).

### Related content

- [Azure reliability](/azure/reliability/overview)
- [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus)
- [Azure Container Registry best practices](/azure/container-registry/container-registry-best-practices)
- [Monitor Azure Container Registry](/azure/container-registry/monitor-service)
- [Azure Container Registry pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [Import container images to a container registry](/azure/container-registry/container-registry-import-images)
- [Multi-region solutions in nonpaired regions](/azure/reliability/regions-multi-region-nonpaired)
