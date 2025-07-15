---
title: Reliability in Azure Container Registry
description: Learn about reliability in Azure Container Registry.
ms.author: doveychase
author: chasedmicrosoft
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-registry
ms.date: 06/16/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Registry works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Registry

This article describes reliability support in Azure Container Registry (ACR), covering intra-regional resiliency via [availability zones](#availability-zone-support) and cross-region resiliency via [geo-replication](#multi-region-support).

Azure Container Registry is a managed container registry service used to store and manage your private Docker container images and related artifacts for your container deployments. For more information, see [What is Azure Container Registry?](/azure/container-registry/container-registry-intro).

## Shared responsibility
<!-- Anastasia: What do you think about this section? It's not in our template. Leaving it to you to work out what to do with it. -->

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

Microsoft manages the underlying Azure Container Registry infrastructure, including maintaining the control plane for registry management and the data plane for container image operations across regions and availability zones.

As a customer, you're responsible for:

- **Application-level resilience**: Implementing appropriate retry logic and failover handling in your container applications and orchestration platforms
- **Zone redundancy configuration**: Selecting to enable zone redundancy for regions where your container registry is deployed.
- **Geo-replication configuration**: Selecting appropriate regions for geo-replication based on your geographic distribution, compliance, and performance requirements

## Production deployment recommendations

For production workloads, we recommend that you:
- Use the Premium tier of Azure Container Registry, which provides the most comprehensive reliability features. The Premium tier also provides higher performance limits, enhanced security features, and advanced capabilities that are essential for production container workloads. For complete information on service tiers and features, see [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus).
- Enable zone redundancy to protect against zone-level failures within a region.
- For multi-region scenarios, configure geo-replication to distribute your registry across multiple regions based on your specific geographic and compliance requirements.

## Reliability architecture overview

Azure Container Registry is built on Azure's distributed infrastructure to provide high availability and data durability. The service consists of several key components that work together to ensure reliability. The following diagram illustrates the core service architecture:

:::image type="content" source="./media/reliability-acr/acr-service-architecture.png" alt-text="Diagram showing Azure Container Registry service architecture with client access, control plane, data plane, and storage layer components." lightbox="./media/reliability-acr/acr-service-architecture.png":::

- **Control plane**: Centralized management in the home region for registry configuration, authentication configuration, and replication policies
- **Data plane**: Distributed service that handles container image push and pull operations across regions and availability zones
- **Storage layer**: Content-addressable Azure Storage to persist container images and artifacts, with automatic deduplication, encryption at rest, and built-in replication

Azure Container Registry also supports *tasks*, which can help you to automate your container builds and maintenance operations. Tasks run on compute infrastructure managed by Microsoft, and can be triggered to run manually, based on events, or based on a schedule. To learn more, see [Automate container image builds and maintenance with Azure Container Registry tasks](/azure/container-registry/container-registry-tasks-overview).

> [!NOTE]
> Azure Container Registry supports [connected registries](/azure/container-registry/intro-connected-registry), which are on-premises or remote replicas that synchronize with your cloud-based Azure container registry. When you use connected registries, you're responsible for configuring them to meet your reliability requirements. Connected registries are beyond the scope of this article.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Container Registry handles transient faults internally through several mechanisms. The service implements automatic retry logic for registry operations and maintains connection pooling for efficient resource utilization. Container Registry operations are designed to be idempotent, allowing safe retries of push and pull operations.

For client applications using Azure Container Registry, implement appropriate retry policies with exponential backoff when performing registry operations. Use the official Docker client or Azure Container Registry SDKs which include built-in retry mechanisms for common transient failures.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Zone redundancy in Azure Container Registry provides protection against single zone failures. Zone redundancy allows for the distributing of registry data and operations across multiple availability zones within the region. Container image pulls and pushes continue to function during zone outages with automatic failover to healthy zones.

Azure Container Registry only supports zone-redundant deployments using the Premium tier. When you create a Premium registry in a region that supports availability zones the zone redundancy feature is enabled by default. 

Zone redundancy provides higher availability compared to single-zone deployments without requiring configuration changes to your container workloads.

### Region support

Zone-redundant Premium registries can be deployed into [any region that supports availability zones](./regions-list.md).

If availability zones are added to an existing region, any previously created registries aren't automatically made zone-redundant. You need to create a new Premium registry to make it zone-redundant.

### Requirements

You must use the Premium tier to enable zone redundancy. Zone redundancy is automatically enabled when you create a Premium registry in a region that supports availability zones - no configuration is required.

### Considerations

Azure Container Registry tasks don't currently support availability zones. Zone redundancy applies to the registry service itself but not to tasks or their operations.

### Cost

Zone redundancy is included with Premium tier registries at no additional cost. The Premium tier is priced higher than Basic and Standard tiers, but zone redundancy itself doesn't incur additional charges beyond the Premium tier pricing.

### Configure availability zone support

- **Create zone-redundant registry**. To create a new zone-redundant registry, see the following resources;
    - Azure portal: [Create a container registry using the Azure portal](/azure/container-registry/container-registry-get-started-portal)
    - Azure CLI: [Create zone-enabled registry](https://learn.microsoft.com/azure/container-registry/zone-redundancy#create-zone-enabled-registry).

- **Enable zone redundancy on an existing registry**. You can only configure zone redundancy when a registry is created. To get zone redundancy, you must create a new Premium registry in a supported region and migrate your container images.

    Existing Basic or Standard tier registries can be upgraded to Premium tier, however upgrading alone does not enable zone redundancy for existing registries, and you need to create a new registry.

    To migrate your artifacts between registries, you can [create a transfer pipeline](/azure/container-registry/container-registry-transfer-prerequisites). Alternatively, you can [import container images to a container registry](/azure/container-registry/container-registry-import-images).

- **Disable zone redundancy**. Zone redundancy can't be disabled after it's enabled for a registry. If you need a non-zone-redundant registry, you must create a new registry and migrate your container images.

If your registry uses [geo-replication](#multi-region-support) and zone redundancy together, you configure zone redundancy on each regional replica. You can't change the zone redundancy setting after a replication is created, except by deleting and re-creating the replication.

### Normal operations

This section describes what to expect when Azure Container Registry resources are configured for zone redundancy and all availability zones are operational.

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-normal-operations.png" alt-text="Diagram showing Azure Container Registry zone redundancy during normal operations with clients connecting to registry endpoint and automatic load balancing across three availability zones with asynchronous replication between zones." lightbox="./media/reliability-acr/acr-zone-redundancy-normal-operations.png":::

**Traffic routing between zones**. Container Registry uses internal routing functionality to automatically distribute data plane operations across all availability zones within a region. The registry service automatically routes requests to healthy zones without requiring external load balancers.

**Data replication between zones**. Registry data including container images, manifests, and metadata are asynchronously replicated across multiple availability zones in both directions. Changes are replicated quickly across zones to maintain high availability and data durability. While replication is asynchronous, it typically completes within minutes, and all zones remain available for read and write operations during replication.

### Zone-down experience

This section describes what to expect when Azure Container Registry resources are configured for zone redundancy and there's an availability zone outage.

When a zone becomes unavailable, Azure Container Registry automatically handles the failover process with minimal impact to registry operations:

:::image type="content" source="./media/reliability-acr/acr-zone-redundancy-zone-failure.png" alt-text="Diagram showing Azure Container Registry behavior during zone failure with automatic failover routing to healthy zones while one zone is marked as failed and unavailable." lightbox="./media/reliability-acr/acr-zone-redundancy-zone-failure.png":::

- **Detection and response**. Microsoft-managed automatic detection and failover occur when a zone becomes unavailable. The service automatically routes traffic to remaining healthy zones.

- **Notification**. Zone-level outages are reflected in Azure Service Health and Azure Monitor metrics. Configure alerts on registry availability metrics to monitor zone health.

- **Active requests**. Active registry operations are automatically retried against healthy zones. Most operations complete successfully with minimal delay.

- **Expected data loss**. Any recent writes that were made in the faulty zone may not have been replicated to other regions, which means they might be lost until the zone recovers. Typically the data loss is expected to be less than 15 minutes, but that's not guaranteed.

- **Expected downtime**. A small amount of downtime - typically, a few seconds for most registry operations - may occur during automatic failover as traffic is redirected to healthy zones. We recommend following [transient fault handling best practices](#transient-faults) to minimize the effect of zone failover on your applications.

- **Traffic rerouting**. The platform automatically reroutes traffic to healthy zones without requiring configuration changes.

### Failback

When the affected availability zone recovers, Azure Container Registry automatically distributes operations across all available zones, including the recovered zone. The service rebalances traffic and data distribution without requiring manual intervention or causing service disruption.

### Testing for zone failures

Zone failover is fully automated and managed by Microsoft. Customers can't simulate zone failures, but the service is designed to automatically handle zone failures without impacting registry availability or data integrity for data plane operations.

## Multi-region support

Azure Container Registry provides native multi-region support through geo-replication in the Premium tier. Geo-replication creates registry replicas in multiple regions of your choice, enabling local access to container images and reducing latency for globally distributed applications. Geo-replication enables resiliency to regional outages. If your registry is geo-replicated and a regional outage occurs, the registry data continues to be available from the other regions you selected. You can also enable geo-replication if you want your registry data to be stored in multiple regions for better performance across different geographies.

If you don't enable geo-replication, then during a region outage your data might become unavailable.

When you deploy Azure Container Registry and enable geo-replication, Microsoft uses Azure Traffic Manager to distribute data plane requests between your replicas, and to automatically fail over between replicas if a regional replica is unavailable.

Azure Container Registry geo-replication does not rely on Azure paired regions. You have flexibility to select any combination of Azure regions for replication based on your specific geographic, performance, and compliance requirements. Each geo-replicated registry functions as a registry endpoint, supporting most registry operations including image pushes, pulls, and management tasks.

This section summarizes information about geo-replication as it relates to reliability. For comprehensive details, see [Geo-replication in Azure Container Registry](/azure/container-registry/container-registry-geo-replication).

### Region support

Geo-replication is available in all Azure regions where the Premium tier is supported. You can replicate to any combination of regions, whether those regions are paired or not.

### Requirements

You must use the Premium tier to enable geo-replication.

### Considerations

- **Zone redundant registries:** When using geo-replication with zone-redundant registries, each replicated registry inherits the zone redundancy configuration of its deployment region, providing both zone-level and region-level protection.

- **Tasks:** Azure Container Registry tasks don't currently support geo-replicas. Tasks always run in the home region. If the home region is unavailable, the task doesn't run.

### Cost

Each geo-replicated region is billed separately according to Premium tier pricing for the respective region. Additionally, egress charges apply for data transfer between regions during initial replication and ongoing synchronization.

### Configure multi-region support

Geo-replication can be configured during registry creation or added to existing Premium registries. Geo-replication can be configured through the Azure portal, Azure CLI, Azure PowerShell, or ARM templates.

- **Create geo-replicated registry**. Configure geo-replication after registry creation by specifying additional regions.

- **Enable geo-replication on an existing registry**. Upgrade existing Basic or Standard tier registries to Premium tier to enable geo-replication capabilities. You can change the replication regions at any time. For detailed instructions, see [Configure geo-replication](/azure/container-registry/container-registry-geo-replication#configure-geo-replication).

- **Disable geo-replication**. Remove individual regional replicas through the Azure portal or command-line tools. The home region registry can't be removed.

### Normal operations

This section describes what to expect when a registry is configured for geo-replication and all regions are operational.

- **Traffic routing between regions**. Container Registry operates in an active-active configuration where each regional endpoint can serve all data plane operations independently, including reads and writes. Data plane operations (push and pull) are automatically routed using Traffic Manager with performance-based criteria to determine the optimal regional endpoint for performance. Requests are routed through the Microsoft-managed Traffic Manager to any geo-replica for read and write operations.

- **Data replication between regions**. Geo-replication automatically synchronizes container images and artifacts across all configured regions by using asynchronous replication with eventual consistency. The service uses content-addressable storage to efficiently replicate only the unique image layers, minimizing bandwidth usage and replication time. Read and write operations work on all geo-replicated regions, and changes made in any region are replicated to all other regions.

    Replication typically completes within minutes of changes, although there's no guarantee on data replication timing. Large container images or high-frequency updates may take longer to replicate across all regions.

:::image type="content" source="./media/reliability-acr/acr-multi-region-normal-operations.png" alt-text="Diagram showing Azure Container Registry multi-region operations with global clients connecting through Traffic Manager to registry endpoints across multiple regions including East US home region, West Europe, and East Asia, with bidirectional asynchronous replication between all regions." lightbox="./media/reliability-acr/acr-multi-region-normal-operations.png":::

### Region-down experience

This section describes what to expect when a registry is configured for geo-replication and there's an outage in the primary region.

When a region becomes unavailable, container operations can continue using alternative regional endpoints:

:::image type="content" source="./media/reliability-acr/acr-multi-region-region-failure.png" alt-text="Diagram showing Azure Container Registry behavior during regional failure with automatic Traffic Manager failover routing clients to healthy regions while West Europe is marked as failed, and continued bidirectional replication between operational regions." lightbox="./media/reliability-acr/acr-multi-region-region-failure.png":::

- **Detection and response**. Azure Container Registry monitors the health of each regional replica and is responsible for redirecting traffic to another region.

- **Notification**. Regional outages are reported through Azure Service Health. Monitor registry availability metrics for each regional endpoint to detect issues. For service health information, see [Azure Service Health](/azure/service-health/).

- **Active requests**. Any active requests currently in flight to an unavailable region will fail and must be retried so they can be directed to a healthy region.

- **Expected data loss**. Any recent writes that were made in the faulty region may not have been replicated to other regions, which means they might be lost until the region recovers. Typically the data loss is expected to be less than 15 minutes, but that's not guaranteed.

- **Expected downtime**. A small amount of downtime is expected for data plane operations while failover completes, which typically takes 1-2 minutes. Applications benefit from automatic Traffic Manager routing to available regions.

- **Traffic rerouting:** When a region becomes unavailable, container operations are automatically routed to another replica in a healthy region. Clients do not need to change the endpoint in which they interact with the registry, with routing, failover, and failback automatically handled by Microsoft.

### Failback

When a region recovers, data plane operations automatically resume for that regional endpoint through Traffic Manager routing. The service synchronizes any changes that occurred during the outage using asynchronous replication with eventual consistency.

### Testing for region failures

While you can't simulate the failure of one of the regions associated with your registry, you can test your applications' ability to fail over between regions. Regional failover can be simulated by temporarily disabling geo-replicas, which removes them from Traffic Manager routing. Then, you can verify that container operations successfully fail over to alternative regions without actually experiencing a regional outage. To learn more, see [Temporarily disable routing to replication](/azure/container-registry/container-registry-geo-replication#temporarily-disable-routing-to-replication).

When you re-enable the replica, Traffic Manager resumes routing traffic to the re-enabled replica. Additionally, metadata and images are synchronized with eventual consistency to the re-enabled replica to ensure data consistency across all regions.

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](./concept-redundancy-replication-backup.md).

Azure Container Registry supports exporting container images and artifacts from your registry to external storage or alternative registries. Use Azure Container Registry import/export capabilities or standard Docker commands to create copies of critical container images for disaster recovery scenarios.

## Service-level agreement

The service-level agreement (SLA) for Container Registry describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. To understand those conditions, it's important that you review the [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

### Related content

- [Azure reliability](/azure/reliability/overview)
- [Azure Container Registry service tiers](/azure/container-registry/container-registry-skus)
- [Azure Container Registry best practices](/azure/container-registry/container-registry-best-practices)
- [Monitor Azure Container Registry](/azure/container-registry/monitor-service)
- [Azure Container Registry pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [Import container images to a container registry](/azure/container-registry/container-registry-import-images)
