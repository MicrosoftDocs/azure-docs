---
title: Reliability in Azure Container Registry
description: Find out about reliability in Azure Container Registry, including availability zones and multi-region deployments.
ms.author: doveychase
author: chasedmicrosoft
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-container-registry
ms.date: 07/23/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Container Registry works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Container Registry

This article describes reliability support in Azure Container Registry, covering intra-regional resiliency via [availability zones](#availability-zone-support) and cross-region resiliency via [geo-replication](#multi-region-support).

Container Registry is a managed container registry service used to store and manage your private Docker container images and related artifacts for your container deployments. For more information, see [Introduction to Container Registry](/azure/container-registry/container-registry-intro).

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

## Production deployment recommendations

For production workloads, we recommend that you take the following actions:

- Use the Premium tier of Container Registry, which provides the most comprehensive reliability features. The Premium tier also provides higher performance limits, enhanced security features, and advanced capabilities that are essential for production container workloads. For more information about service tiers and features, see [Container Registry service tiers](/azure/container-registry/container-registry-skus).

- Provision your Container Registry in a region that supports availability zones.

- For multi-region scenarios, configure geo-replication to distribute your registry across multiple regions based on your specific geographic and compliance requirements.

## Reliability architecture overview

Container Registry is built on distributed Azure infrastructure to provide high availability and data durability. The service consists of several key components that work together to ensure reliability. The following diagram illustrates the core service architecture.

:::image type="content" source="./media/reliability-container-registry/service-architecture.png" alt-text="Diagram that shows Container Registry service architecture with client access, control plane, data plane, and storage layer components." border="false":::

- **The control plane** is a centralized management component in the home region for registry configuration, authentication configuration, and replication policies.

- **The data plane** is a distributed service that handles container image push and pull operations across regions and availability zones.

- **The storage layer** is a content-addressable Azure Storage solution that persists container images and artifacts. It includes automatic deduplication, encryption at rest, and built-in replication.

Microsoft is responsible for managing the underlying Container Registry infrastructure, which includes the following types of maintenance:

 - **Control plane maintenance** for registry management

 - **Data plane maintenance** for container image operations across regions and availability zones
 
As a customer, you're responsible for the following actions:
 
- **Application-level resilience:** Implement appropriate retry logic and failover handling in your container applications and orchestration platforms.

- **Zone resiliency configuration:** Ensure that your container registry is deployed in a [region that supports availability zones](regions-list.md).

- *Geo-replication configuration:* Choose appropriate regions for geo-replication based on your geographic distribution, compliance, and performance requirements.

Container Registry also supports *tasks*, which can help you automate your container builds and maintenance operations. Tasks run on Microsoft-managed compute infrastructure and support manual, event-based, or scheduled triggers. For more information, see [Automate container image builds and maintenance by using Container Registry tasks](/azure/container-registry/container-registry-tasks-overview).

> [!NOTE]
> Container Registry supports [connected registries](/azure/container-registry/intro-connected-registry), which are on-premises or remote replicas that synchronize with your cloud-based Container Registry. When you use connected registries, you're responsible for configuring them to meet your reliability requirements. Connected registries are out of scope for this article.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Container Registry handles transient faults internally through several mechanisms. The service implements automatic retry logic for registry operations and maintains connection pooling for efficient resource usage. Container Registry operations are designed to be idempotent, which allows safe retries of push and pull operations. Tasks automatically handle transient faults when they perform many types of operations.

For client applications that use Container Registry, implement appropriate retry policies with exponential backoff when performing registry operations. Use the official Docker client or Container Registry SDKs, which include built-in retry mechanisms for common transient failures.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Zone redundancy protects your container registry against single zone failures by distributing registry data and operations across multiple availability zones within the region. Container image pull and push operations continue to function during zone outages, with automatic failover to healthy zones.

Zone redundancy is enabled by default for all Azure Container Registries in regions that support availability zones, making your resources more resilient automatically and at no additional cost. This enhancement applies to all SKUs including Basic and Standard and has been rolled out to both new and existing registries in supported regions.

>[!IMPORTANT]
>The Azure portal and CLI may not yet reflect the zone redundancy update accurately. The `zoneRedundancy` property in your registry’s configuration might still show as false even though zone redundancy is active for all registries in supported regions. We’re actively updating the portal and API surfaces to reflect this default behavior more transparently. All previously enabled features will continue to function as expected.

### Region support

Zone-redundant registries can only be deployed into [a region that supports availability zones](./regions-list.md).

### Considerations

Container Registry tasks don't currently support availability zones. Zone redundancy applies to the registry service itself, but not to tasks or their operations.

### Cost

Zone redundancy is included with container registries at no extra cost.

### Configure availability zone support

- **Create a zone-redundant registry.** For more information, see [Create a zone-redundant registry in Container Registry](/azure/container-registry/zone-redundancy).

- **Enable zone redundancy on an existing registry.** You can only configure zone redundancy when a registry is created. To enable zone redundancy for currently existing registries, you must create a registry in a region that supports availability zones and then migrate your container images.

    - To migrate your artifacts between registries, you can [create a transfer pipeline](/azure/container-registry/container-registry-transfer-prerequisites). Alternatively, you can [import container images to a container registry](/azure/container-registry/container-registry-import-images).
    
- If your registry uses [geo-replication](#multi-region-support) in a region that supports Availablity Zones. Your replica will be zone redundant by default. For more information, see [Create a zone-redundant replica in Container Registry](/azure/container-registry/zone-redundancy-replica).  After a geo-replication is created, you can only change the zone redundancy setting by deleting and recreating the replication.

- **Disable zone redundancy.** Zone redundancy can't be disabled. 

### Normal operations

This section describes what to expect when Container Registry resources are configured for zone redundancy and all availability zones are operational.

:::image type="content" source="./media/reliability-container-registry/zone-redundancy-normal-operations.png" alt-text="Diagram that shows Container Registry zone redundancy during normal operations." border="false":::

- **Traffic routing between zones:** Container Registry uses internal routing functionality to automatically distribute data plane operations across all availability zones within a region. The registry service automatically routes requests to healthy zones without requiring external load balancers.

- **Data replication between zones:** Registry data, including container images, manifests, and metadata, are asynchronously replicated across multiple availability zones. Changes are replicated quickly across zones to maintain high availability and data durability. Replication is asynchronous, but it typically completes within minutes, and all zones remain available for read and write operations during replication.

### Zone-down experience

This section describes what to expect when Container Registry resources are configured for zone redundancy and there's an availability zone outage.

When a zone becomes unavailable, Container Registry automatically handles the failover process with minimal impact to registry operations.

:::image type="content" source="./media/reliability-container-registry/zone-redundancy-zone-failure.png" alt-text="Diagram that shows Container Registry behavior during zone failure. Automatic failover routes to healthy zones. One zone is marked as unavailable." border="false":::

- **Detection and response:** The Container Registry platform automatically detects failures in an availability zone and initiates a response. The service automatically routes traffic to the remaining healthy zones. No manual intervention is required to initiate a zone failover.

- **Notification:** Zone failure events can be monitored through Azure Service Health and through registry availability metrics in Azure Monitor. Set up alerts on these services to receive notifications about zone-level problems.

- **Active requests:** When an availability zone is unavailable, any requests in progress that are connected to resources in the faulty availability zone are terminated. They need to be retried.

- **Expected data loss:** Any recent writes made in the faulty zone might not be replicated to other regions, which means that they might be lost until the zone recovers. The data loss is typically expected to be less than 15 minutes, but that's not guaranteed.

- **Expected downtime:** A small amount of downtime might occur during automatic failover as traffic is redirected to healthy zones. This downtime is typically a few seconds for most registry operations. We recommend that you follow [transient fault handling best practices](#transient-faults) to minimize the effect of zone failover on your applications.

- **Traffic rerouting:** The platform automatically reroutes traffic to healthy zones without requiring you to make any configuration changes.

### Failback

When the affected availability zone recovers, Container Registry automatically distributes operations across all available zones, including the recovered zone. The service rebalances traffic and data distribution without requiring manual intervention or causing service disruption.

### Testing for zone failures

The Container Registry platform manages traffic routing, failover, and failback for zone-redundant registries. Because this feature is fully managed, you don't need to initiate or validate availability zone failure processes.

## Multi-region support

Container Registry provides native multi-region support through geo-replication when your registry uses the Premium tier. Geo-replication creates registry replicas in multiple regions of your choice. The region that you deploy the registry resource is known as the *home region*.

Geo-replication enables resiliency to regional outages. If your registry is geo-replicated and a regional outage occurs, the registry data continues to be available from the other regions that you selected. If you don't enable geo-replication, then your data might become unavailable during a region outage.

You can also use geo-replication to get local access to container images within those regions and to reduce latency for globally distributed applications.

When you deploy Container Registry and enable geo-replication, Microsoft uses Azure Traffic Manager to distribute data plane requests between your replicas and to automatically fail over between replicas if a regional replica is unavailable.

Container Registry geo-replication doesn't rely on Azure paired regions. You can select any combination of Azure regions for replication based on your specific geographic, performance, and compliance requirements. Each geo-replicated registry functions as a registry endpoint. It supports most registry operations, including image pushes, pulls, and management tasks.

This section summarizes information about geo-replication as it relates to reliability. For more information, see [Geo-replication in Container Registry](/azure/container-registry/container-registry-geo-replication).

### Region support

Geo-replication is available in all Azure regions where the Premium tier is supported. You can replicate to any combination of regions, regardless of whether Azure pairs those regions.

### Requirements

You must use the Premium tier to enable geo-replication.

### Considerations

- **Zone-redundant replicas:** When you use geo-replication in regions that support availability zones, the replicas are zone redundant by default.

- **Control plane:** The control plane runs in the home region. If the home region is unavailable, control plane operations are unavailable, and you might not be able to modify the registry's configuration.

- **Tasks:** Container Registry tasks don't currently support geo-replicas. Tasks always run in the home region. If the home region is unavailable, the task doesn't run.

### Cost

Each geo-replicated region is billed separately according to Premium tier pricing for the respective region. Egress charges also apply for data transfer between regions during initial replication and ongoing synchronization.

### Configure multi-region support

Geo-replication can be configured during registry creation or added to existing Premium registries. Geo-replication can be configured through the Azure portal, the Azure CLI, Azure PowerShell, or Azure Resource Manager templates.

- **Create a geo-replicated registry.** Configure geo-replication after registry creation by specifying extra regions.

- **Enable geo-replication on an existing registry.** To enable geo-replication capabilities, upgrade existing Basic or Standard tier registries to the Premium tier. You can change the replication regions at any time. For more information, see [Configure geo-replication](/azure/container-registry/container-registry-geo-replication#configure-geo-replication).

- **Disable geo-replication.** Remove individual regional replicas through the Azure portal or command-line tools. The home region registry can't be removed.

### Normal operations

This section describes what to expect when a registry is configured for geo-replication and all regions are operational.

:::image type="content" source="./media/reliability-container-registry/multi-region-normal-operations.png" alt-text="Diagram showing Container Registry multi-region operations. Global clients connect via Traffic Manager to registry endpoints across multiple regions." border="false":::

- **Traffic routing between regions:** Container Registry operates in an active-active configuration where each regional endpoint can serve all data plane operations independently, including reads and writes. Data plane operations, such as container push and pull operations, are automatically routed by using Traffic Manager with performance-based criteria to determine the optimal regional endpoint for performance.

- **Data replication between regions:** Geo-replication automatically synchronizes container images and artifacts across all configured regions by using asynchronous replication with eventual consistency. The service uses content-addressable storage to efficiently replicate only the unique image layers. This approach minimizes bandwidth usage and replication time. Read and write operations work on all geo-replicated regions. Changes made in any region are replicated to all other regions.

    Replication typically completes within minutes of changes. However, there's no guarantee on data replication timing. Large container images or high-frequency updates might take longer to replicate across all regions.

### Region-down experience

This section describes what to expect when a registry is configured for geo-replication and there's an outage in the primary region.

When a region becomes unavailable, container operations can continue to use alternative regional endpoints.

:::image type="content" source="./media/reliability-container-registry/multi-region-region-failure.png" alt-text="Diagram that shows Container Registry behavior during regional failure." border="false":::

- **Detection and response:** Container Registry monitors the health of each regional replica and is responsible for redirecting traffic to another region.

- **Notification:** Region health can be monitored through Azure Service Health. Set up alerts to receive notifications of region-level problems. You can also monitor registry availability metrics for each regional endpoint to detect problems.

- **Active requests:** Any active requests currently in flight to an unavailable region will fail and must be retried so that they can be directed to a healthy region.

- **Expected data loss:** Any recent writes made in the faulty region might not be replicated to other regions. This failure means that they might be lost until the region recovers. Typically, the data loss is expected to be less than 15 minutes, but that's not guaranteed.

- **Expected downtime:** For data plane operations, a small amount of downtime is expected for data plane operations while failover completes, which typically takes 1 to 2 minutes.

    If the home region is unavailable, control plane operations are unavailable until the region recovers.

- **Traffic rerouting:** When a region becomes unavailable, container operations are automatically routed to another replica in a healthy region. Clients don't need to change the endpoint in which they interact with the registry. Microsoft automatically handles routing, failover, and failback.

### Failback

When a region recovers, data plane operations automatically resume for that regional endpoint through Traffic Manager routing. The service synchronizes any changes that occur during the outage by using asynchronous replication with eventual consistency.

### Testing for region failures

You can't simulate the failure of one of the regions associated with your registry, but you can test your application's ability to fail over between regions. You can simulate regional failover by temporarily disabling geo-replicas, which removes them from Traffic Manager routing. Then you can verify that container operations successfully fail over to alternative regions without actually experiencing a regional outage. For more information, see [Temporarily disable routing to replication](/azure/container-registry/container-registry-geo-replication#temporarily-disable-routing-to-replication).

When you re-enable the replica, Traffic Manager resumes routing traffic to the re-enabled replica. Also, metadata and images are synchronized with eventual consistency to the re-enabled replica to ensure data consistency across all regions.

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](./concept-redundancy-replication-backup.md).

Container Registry supports exporting container images and artifacts from your registry to external storage or alternative registries. Use Container Registry import and export capabilities or standard Docker commands to create copies of critical container images for disaster recovery scenarios.

## Service-level agreement

The service-level agreement (SLA) for Container Registry describes the expected availability of the service, and the conditions that must be met to achieve that availability expectation. For more information, see [SLAs for online services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

### Related content

- [Azure reliability](overview.md)
- [Container Registry service tiers](/azure/container-registry/container-registry-skus)
- [Container Registry best practices](/azure/container-registry/container-registry-best-practices)
- [Monitor Container Registry](/azure/container-registry/monitor-service)
- [Container Registry pricing](https://azure.microsoft.com/pricing/details/container-registry/)
- [Import container images to a container registry](/azure/container-registry/container-registry-import-images)
