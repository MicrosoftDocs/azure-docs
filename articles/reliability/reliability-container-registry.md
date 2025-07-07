---
title: Reliability in Azure Container Registry
description: Learn about reliability in Azure Container Registry.
ms.author: doveychase
author: chasedmicrosoft
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-registry
ms.date: 06/16/2025
ms.update-cycle: 180-days
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Registry works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Registry

This article describes reliability support in Azure Container Registry (ACR), covering intra-regional resiliency via [availability zones](#zone-redundancy-reliability) and cross-region resiliency via [geo-replication](#multi-region-reliability).

Azure Container Registry is a managed container registry service used to store and manage your private Docker container images and related artifacts for your container deployments. For more information, see [What is Azure Container Registry?](/azure/container-registry/container-registry-intro).

## Shared responsibility

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

Microsoft manages the underlying Azure Container Registry infrastructure, including maintaining the control plane for registry management and the data plane for container image operations across regions and availability zones.

As a customer, you're responsible for:

- **Application-level resilience**: Implementing appropriate retry logic and failover handling in your container applications and orchestration platforms
- **Zonal-resiliency configuration**: Selecting to enable zone redundancy for regions where your container registry is deployed.
- **Geo-replication configuration**: Selecting appropriate regions for geo-replication based on your geographic distribution, compliance, and performance requirements

## Azure Container Registry service architecture

Azure Container Registry is built as a distributed service with distinct control and data plane operations. The following diagram illustrates the core service architecture:

:::image type="content" source="./media/reliability-acr/acr-service-architecture.png" alt-text="Diagram showing Azure Container Registry service architecture with client access, control plane, data plane, and storage layer components." lightbox="./media/reliability-acr/acr-service-architecture.png":::

**Key Architecture Components:**

- **Control Plane**: Centralized management in the home region for registry configuration, authentication configuration, and replication policies
- **Data Plane**: Distributed service that handles container image push and pull operations across regions and availability zones
- **Storage Layer**: Content-addressable Azure Storage with automatic deduplication, encryption at rest, and built-in replication

## Zone redundancy reliability

Azure Container Registry provides zone redundancy within regions to protect against zone-level failures. This section provides an overview of zone redundancy capabilities, with detailed configuration and operational information in the [Availability zone support](#availability-zone-support) section.

## Production deployment recommendations

For production workloads, use the Premium tier of Azure Container Registry, which provides the most comprehensive reliability features. Enable zone redundancy to protect against zone-level failures within a region. For multi-region scenarios, configure geo-replication to distribute your registry across multiple regions based on your specific geographic and compliance requirements.

The Premium tier also provides higher performance limits, enhanced security features, and advanced capabilities that are essential for production container workloads. For complete information on service tiers and features, see [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus).

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Container Registry handles transient faults internally through several mechanisms. The service implements automatic retry logic for registry operations and maintains connection pooling for efficient resource utilization. Container Registry operations are designed to be idempotent, allowing safe retries of push and pull operations.

For client applications using Azure Container Registry, implement appropriate retry policies with exponential backoff when performing registry operations. Use the official Docker client or Azure Container Registry SDKs which include built-in retry mechanisms for common transient failures.

When using geo-replicated registries, implement failover logic in your applications to automatically switch to alternative registry endpoints if the primary endpoint becomes temporarily unavailable. Geo-replication provides resilience against transient faults that might affect a specific regional endpoint.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Container Registry only supports zone-redundant deployments using the Premium tier. When you create a Premium registry in a region that supports availability zones the zone redundancy feature is enabled by default. Zone redundancy allows for the distributing of registry data and operations across multiple availability zones within the region.

Zone redundancy in Azure Container Registry protects your container images and artifacts against zone-level failures. The service automatically replicates data across multiple zones and can continue operating even if one availability zone becomes unavailable. Zone redundancy provides higher availability compared to single-zone deployments without requiring configuration changes to your container workloads.

### Zone redundancy region support
For the most current list of regions with availability zone support, see [Azure regions with availability zones](/azure/container-registry/zone-redundancy#regional-support).

### Requirements

You must use the Premium tier to enable zone redundancy. Zone redundancy is automatically enabled when you create a Premium registry in a region that supports availability zones - no configuration is required.

### Considerations

Zone redundancy in Azure Container Registry provides protection against single zone failures. Container image pulls and pushes continue to function during zone outages with automatic failover to healthy zones.

When you use geo-replication, each geo-replicated region can independently have zone redundancy enabled at the time of creation if the region supports availability zones, providing both zone-level and region-level protection.

### Cost

Zone redundancy is included with Premium tier registries at no additional cost. The Premium tier is priced higher than Basic and Standard tiers, but zone redundancy itself doesn't incur additional charges beyond the Premium tier pricing.

### Configure availability zone support

Zone redundancy is automatically enabled when you create a Premium registry in a region that supports availability zones, as mentioned in the Requirements section above.

- **Create**. Use the Azure portal, Azure CLI, Azure PowerShell, or ARM templates to create Premium registries. For configuration details, see [Create a container registry using the Azure portal](/azure/container-registry/container-registry-get-started-portal).
- **Disable**. Zone redundancy can't be disabled once enabled for a registry. If you need a non-zone-redundant registry, you must create a new registry and migrate your container images.
- **Migrate**. Existing Basic or Standard tier registries can be upgraded to Premium tier, however upgrading alone doesn't enable zone redundancy for existing registries. To get zone redundancy, you must create a new Premium registry in a supported region and migrate your container images. Migrating SKUs requires migrating registry artifacts, which you can do by following [creating a transfer pipeline](/azure/container-registry/container-registry-transfer-prerequisites) or via [importing](/azure/container-registry/container-registry-import-images).

**Important limitations**:
- Converting to zone redundancy isn't currently supported
- Zone redundancy can't be disabled once enabled in a region
- The availability zone property is per region and can't be changed once replications are created, except by deleting and re-creating the replications

### Normal operations

During normal operations with zone redundancy enabled, Azure Container Registry automatically distributes registry operations across multiple availability zones. Container image pushes and pulls are load-balanced across zones to optimize performance and ensure high availability.

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-normal-operations.png" alt-text="Diagram showing Azure Container Registry zone redundancy during normal operations with clients connecting to registry endpoint and automatic load balancing across three availability zones with asynchronous replication between zones." lightbox="./media/reliability-acr/acr-zone-redundancy-normal-operations.png":::

**Traffic routing between zones**. Container Registry uses internal routing functionality to automatically distribute data plane operations across all available zones within a region. The registry service automatically routes requests to healthy zones without requiring external load balancers.

**Data replication between zones**. Registry data including container images, manifests, and metadata are asynchronously replicated across multiple availability zones in both directions. Changes are replicated quickly across zones to maintain high availability and data durability. While replication is asynchronous, it typically completes within minutes, and all zones remain available for read and write operations during replication.

### Zone-down experience

When a zone becomes unavailable, Azure Container Registry automatically handles the failover process with minimal impact to registry operations.

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-zone-failure.png" alt-text="Diagram showing Azure Container Registry behavior during zone failure with automatic failover routing to healthy zones while one zone is marked as failed and unavailable." lightbox="./media/reliability-acr/acr-zone-redundancy-zone-failure.png":::

- **Detection and response**. Microsoft-managed automatic detection and failover occur when a zone becomes unavailable. The service automatically routes traffic to remaining healthy zones.
- **Active requests**. Active registry operations are automatically retried against healthy zones. Most operations complete successfully with minimal delay.
- **Expected data loss**. Minimal risk of data loss during zone failover due to fast asynchronous replication across zones.
- **Expected downtime**. Minimal downtime during automatic failover, typically seconds for most registry operations.
- **Traffic rerouting**. The platform automatically reroutes traffic to healthy zones without requiring configuration changes.

### Failback

When the affected availability zone recovers, Azure Container Registry automatically distributes operations across all available zones, including the recovered zone. The service rebalances traffic and data distribution without requiring manual intervention or causing service disruption.

### Testing for zone failures

Zone failover is fully automated and managed by Microsoft. Customers can't simulate zone failures, but the service is designed to automatically handle zone failures without impacting registry availability or data integrity for data plane operations.

## Multi-region reliability

Azure Container Registry provides native multi-region support through geo-replication in the Premium tier. Geo-replication creates registry replicas in multiple regions of your choice, enabling local access to container images and reducing latency for globally distributed applications. For comprehensive details, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication).

Unlike many Azure services, Container Registry geo-replication doesn't use Azure paired regions. You have complete flexibility to select any combination of Azure regions for replication based on your specific geographic, performance, and compliance requirements. Each geo-replicated registry functions as a complete registry endpoint, supporting all registry operations including image pushes, pulls, and management tasks.

Geo-replication automatically synchronizes container images and artifacts across all configured regions using asynchronous replication with eventual consistency. The service uses content-addressable storage to efficiently replicate only the unique image layers, minimizing bandwidth usage and replication time. Data plane operations (push and pull) are automatically routed using Traffic Manager with performance-based criteria to determine the optimal regional endpoint for performance.

### Normal multi-region operations

During normal multi-region operations, Azure Container Registry synchronizes data across all configured regions automatically:

:::image type="content" source="./media/reliability-acr/acr-multi-region-normal-operations.png" alt-text="Diagram showing Azure Container Registry multi-region operations with global clients connecting through Traffic Manager to registry endpoints across multiple regions including East US home region, West Europe, and East Asia, with bidirectional asynchronous replication between all regions." lightbox="./media/reliability-acr/acr-multi-region-normal-operations.png":::

### Region failure operations

When a region becomes unavailable, container operations are automatically routed to another replica in a healthy region. Clients do not need to change the endpoint in which they interact with the registry, with routing, failover, and failback automatically handled by Microsoft.

:::image type="content" source="./media/reliability-acr/acr-multi-region-region-failure.png" alt-text="Diagram showing Azure Container Registry behavior during regional failure with automatic Traffic Manager failover routing clients to healthy regions while West Europe is marked as failed, and continued bidirectional replication between operational regions." lightbox="./media/reliability-acr/acr-multi-region-region-failure.png":::

### Region support

Geo-replication is available in all Azure regions where the Premium tier is supported. You can replicate to any combination of regions without restrictions based on paired regions.

### Requirements

You must use the Premium tier to enable geo-replication. Geo-replication can be configured after registry creation, or after upgrading an existing registry to the Premium SKU.

### Considerations

Each geo-replicated region functions as an independent registry endpoint that supports read and write operations. Container clients can be routed by Microsoft-managed Traffic Manager to any geo-replica for read and write operations.

Geo-replication provides eventual consistency across regions using asynchronous replication. There's no SLA on data replication timing, and replication typically completes within minutes of changes. Large container images or high-frequency updates may take longer to replicate across all regions.

### Cost

Each geo-replicated region is billed separately according to Premium tier pricing for the respective region. Additionally, egress charges apply for data transfer between regions during initial replication and ongoing synchronization.

### Configure multi-region support

Geo-replication can be configured through the Azure portal, Azure CLI, Azure PowerShell, or ARM templates.

- **Enable**. Configure geo-replication after registry creation by specifying additional regions on container registries using the Premium SKU.
- **Disable**. Remove individual regional replicas through the Azure portal or command-line tools. The home region registry can't be removed.
- **Migrate**. To enable geo-replication you need to upgrade existing Basic or Standard tier registries to Premium tier.

### Normal operations

Container Registry operates in an active-active configuration where each regional endpoint can serve all data plane operations independently. Container image pushes to any regional endpoint are replicated to all other regions based on the configured replication scope.

**Traffic routing between regions**. Traffic Manager uses performance-based routing criteria to automatically direct clients to the optimal regional endpoint for performance.

**Data replication between regions**. Registry data is replicated asynchronously between regions with eventual consistency in both directions. Container image layers are synchronized efficiently using content-addressable storage, with only unique layers transferred between regions. Read and write operations work on all geo-replicated regions, and changes made in any region are replicated to all other regions.

### Region-down experience

Data plane operations automatically route to available regions using Traffic Manager. Configure health checks and failover logic in your container orchestration platforms for application-level resilience.
- **Active requests**. Active requests to an unavailable region are automatically rerouted to alternative regional endpoints via automatic Traffic Manager routing.
- **Expected data loss**. No data loss occurs as registry data is replicated across multiple regions. Recent changes that haven't yet replicated may be temporarily unavailable due to eventual consistency.
- **Expected downtime**. No downtime for data plane operations when using alternative regional endpoints. Applications benefit from automatic Traffic Manager routing to available regions.
- **Traffic rerouting**. Traffic Manager automatically reroutes data plane traffic to available regional endpoints when a region becomes unavailable.

### Failback

When a region recovers, data plane operations automatically resume for that regional endpoint through Traffic Manager routing. The service synchronizes any changes that occurred during the outage using asynchronous replication with eventual consistency.

### Testing for region failures

Regional failover can be simulated by temporarily disabling geo-replicas, which removes them from Traffic Manager routing. This allows for testing failover scenarios without actually experiencing a regional outage. For details on this process, see [Temporarily disable routing to replication](/azure/container-registry/container-registry-geo-replication#temporarily-disable-routing-to-replication).

When customers re-enable the replica, Traffic Manager routing to the re-enabled replica resumes automatically. Additionally, metadata and images are synchronized with eventual consistency to the re-enabled replica to ensure data consistency across all regions.

## Backups

Azure Container Registry doesn't provide traditional backup and restore capabilities because the service is designed with built-in data durability and redundancy mechanisms. Instead of point-in-time backups, the service ensures data protection through:

- **Zone redundancy**: Asynchronous replication across availability zones within a region
- **Geo-replication**: Asynchronous replication across multiple regions with eventual consistency
- **Azure Storage redundancy**: Built-in storage-level redundancy for container images and artifacts

This architecture approach provides continuous data protection without the need for traditional backup operations.

For additional data protection, you can export container images and artifacts from your registry to external storage or alternative registries. Use Azure Container Registry import/export capabilities or standard Docker commands to create copies of critical container images for disaster recovery scenarios.

## Reliability during service maintenance

Azure Container Registry is designed to minimize service disruption during planned maintenance activities. The service uses rolling updates and maintenance windows to ensure continued availability of your container registry operations.

### Planned maintenance

Microsoft performs regular maintenance on Azure Container Registry infrastructure to ensure security, performance, and reliability. Planned maintenance activities include:

- **Infrastructure updates**: Operating system patches, security updates, and infrastructure improvements
- **Service updates**: Azure Container Registry service improvements and feature updates
- **Hardware maintenance**: Planned hardware replacement and datacenter maintenance

### Maintenance impact and mitigation

During planned maintenance, Azure Container Registry implements several strategies to minimize service impact:

- **Zone redundancy**: In regions with availability zones, maintenance is performed on a zone-by-zone basis to maintain service availability
- **Geo-replication**: For geo-replicated registries, maintenance is coordinated across regions to ensure at least one region remains fully operational
- **Rolling updates**: Service updates are deployed gradually to minimize the impact on registry operations
- **Advance notification**: Critical maintenance activities are communicated through Azure Service Health with advance notice

### Customer responsibilities during maintenance

While Azure Container Registry handles most maintenance activities transparently, consider these recommendations:

- **Monitor service health**: Subscribe to Azure Service Health notifications for your registry regions
- **Implement retry logic**: Ensure your applications have appropriate retry mechanisms for transient failures
- **Use geo-replication**: Configure geo-replication for critical workloads to provide redundancy during regional maintenance
- **Plan deployments**: Avoid critical deployment activities during announced maintenance windows when possible

For zone-redundant and geo-replicated registries, planned maintenance rarely causes service interruption for data plane operations. Control plane operations may experience brief periods of reduced availability during maintenance windows.

## Service-level agreement

The service-level agreement (SLA) for Azure Container Registry describes the expected availability of the service and the conditions that must be met to achieve that availability expectation.

Azure Container Registry provides a 99.9% uptime SLA for all service tiers (Basic, Standard, and Premium). The SLA is calculated based on registry endpoint availability for container registry transactions, with specific maximum processing times:

- **List operations** (Repository, Manifests, Tags): 8 minutes maximum processing time
- **All other operations**: 1 minute maximum processing time

Key SLA considerations:

- **Coverage**: The SLA applies to all Basic, Standard, and Premium tier registries
- **Zone redundancy**: Premium tier with zone redundancy provides enhanced availability but follows the same SLA percentage
- **Geo-replication**: Each regional replica is covered by the SLA independently for registry availability
- **Data replication**: There's no SLA on data replication timing between regions or zones
- **Service credits**: Available when uptime falls below 99.9% (10% credit) or 99% (25% credit)

The specific availability percentages, downtime calculations, and conditions that must be met to achieve the SLA guarantees are detailed in the official service-level agreement documentation. For complete SLA terms and conditions, see [SLA for Azure Container Registry](https://azure.microsoft.com/support/legal/sla/container-registry/).

### Related content

- [Azure reliability](/azure/reliability/overview)
- [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus)
- [Azure Container Registry best practices](/azure/container-registry/container-registry-best-practices)
- [Monitor Azure Container Registry](/azure/container-registry/monitor-service)
- [Azure Container Registry pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [Import container images to a container registry](/azure/container-registry/container-registry-import-images)
- [Multi-region solutions in nonpaired regions](/azure/reliability/regions-multi-region-nonpaired)
