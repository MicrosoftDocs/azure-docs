---
title: Reliability in Azure Table Storage
description: Learn about reliability in Azure Table Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-table-storage
ms.date: 6/6/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Table Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Table Storage

Azure Table Storage is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. A single table can contain entities that have different sets of properties, and properties can be of various data types. Table Storage is ideal for storing flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires.

Azure Table Storage provides several reliability features through the underlying Azure Storage platform. As part of Azure Storage, Table Storage inherits the same redundancy options, availability zone support, and geo-replication capabilities that ensure high availability and durability for your table data. The service automatically handles transient faults and provides built-in retry mechanisms through Azure Storage client libraries, making it well-suited for applications requiring reliable NoSQL data storage with high availability.

This article describes reliability and availability zones support in [Azure Table Storage](/azure/storage/tables/table-storage-overview). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

<!-- John: There is no WAF here -->
For production environments, enable zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) for your storage accounts that contain Table Storage resources. ZRS provides higher availability by replicating your data synchronously across three availability zones in the primary region, protecting against availability zone failures. For applications requiring protection against regional outages, use GZRS which combines zone redundancy in the primary region with geo-replication to a secondary region.

Choose the Standard general-purpose v2 storage account type for Table Storage, as it provides the best balance of features, performance, and cost-effectiveness. Premium storage accounts don't support Table Storage.

Design your table partitioning strategy carefully to ensure optimal performance and scalability. Use PartitionKey values that distribute entities across multiple partitions to avoid hot partitions and achieve better load balancing across the Table Storage infrastructure.

## Reliability architecture overview

Azure Table Storage operates as a distributed NoSQL database within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your table data, with the specific redundancy model depending on your storage account configuration.

[Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy?branch=main#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter providing protection against node and rack failures but not zone-level outages. The service automatically manages the replica count and placement - you don't need to configure individual table instances as the storage platform handles redundancy transparently.

Zone-redundant storage and geo-redundant storage provide additional protections, and are described in detail below.

Azure Table Storage uses a partitioned storage model where entities with the same PartitionKey are stored together on the same partition servers. The service automatically manages partition placement across multiple servers to optimize performance and handle load balancing as your data grows.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Table Storage handles transient faults automatically through several mechanisms provided by the Azure Storage platform and client libraries. The service is designed to provide resilient NoSQL data storage capabilities even during temporary infrastructure issues.

Azure Table Storage client libraries include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), throttling responses (HTTP 429/500), and partition server overload conditions. When your application encounters these transient conditions, the client libraries automatically retry operations using exponential backoff strategies.

To manage transient faults effectively when using Azure Table Storage:

- **Configure appropriate timeouts** in your Table Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.
- **Implement exponential backoff** for retry policies, especially when encountering HTTP 503 Server Busy or HTTP 500 Operation Timeout errors. Table Storage may throttle requests when individual partitions become hot or when storage account limits are approached.
- **Design partition-aware retry logic** that considers Table Storage's partitioned architecture. Distribute operations across multiple partitions to reduce the likelihood of encountering throttling on individual partition servers.
- **Handle specific Table Storage error conditions** such as EntityTooLarge (413), RequestEntityTooLarge (413), and PayloadTooLarge (413) which indicate data size limitations rather than transient issues.


Common transient fault scenarios specific to Table Storage include:

- **Partition server unavailability**: Temporary failures of individual partition servers are handled automatically through partition redistribution to healthy servers.
- **Hot partition throttling**: When a partition receives disproportionate traffic, the service may temporarily throttle requests to that partition while load balancing occurs.
- **Entity Group Transaction failures**: Transient failures during batch operations affecting multiple entities within the same partition are automatically retried by client libraries.

For detailed retry policy configuration for different programming languages, see [Implement a retry policy with .NET](/azure/storage/blobs/storage-retry-policy) and [Implement a retry policy with Java](/azure/storage/blobs/storage-retry-policy-java).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]


Azure Table Storage supports availability zones through the zone-redundant storage (ZRS) redundancy option available at the storage account level. When you configure a storage account with ZRS, Azure Table Storage automatically distributes your table data across three availability zones within the region.

Azure Table Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your table data synchronously across three separate availability zones. This configuration ensures that your tables remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Table Storage resources within that account. You cannot configure individual tables for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from your application.

Azure Table Storage with ZRS provides automatic failover capabilities between availability zones. If one zone becomes unavailable, the service continues operating using the remaining healthy zones with no data loss, as all writes are synchronously replicated across zones before acknowledgment.

The partitioned nature of Table Storage provides additional resilience during zone failures, as partitions can be redistributed across available zones to maintain service continuity. The service automatically rebalances partition placement to optimize performance across the remaining healthy zones.

### Region support

Zone-redundant Azure Table Storage can be deployed in any region that supports availability zones. For the complete list of regions that support availability zones, see [Azure regions with availability zones](./regions-list.md).

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Table Storage. Premium storage accounts don't support Table Storage. All storage account tiers and performance levels support ZRS configuration where availability zones are available.

## Considerations

During an availability zone outage, your Table Storage operations continue normally through the remaining healthy zones. However, there may be brief periods of reduced performance as the service redistributes partitions across the available zones. Applications should be designed to handle potential query latency increases during zone failover scenarios.

When designing table-based architectures with zone redundancy, consider the impact of partition redistribution during zone failures. Hot partitions may experience temporary performance impacts as the service rebalances load across fewer zones.

### Cost

Enabling zone-redundant storage (ZRS) for your storage account incurs additional costs compared to locally redundant storage (LRS). ZRS pricing is approximately 25% higher than LRS. For current pricing information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure availability zone support

- **Create**. Configure zone-redundant storage when creating a new storage account through the [Azure portal](/azure/storage/common/storage-account-create), [Azure CLI](/azure/storage/common/storage-account-create), [Azure PowerShell](/azure/storage/common/storage-account-create), or [Bicep/ARM templates](/azure/storage/common/storage-account-create).
- **Migrate**. Convert existing storage accounts from LRS to ZRS using [Azure Storage live migration](/azure/storage/common/redundancy-migration) or by recreating the storage account with ZRS configuration.
- **Disable**. You cannot disable zone redundancy for a storage account after it's enabled. To move from ZRS to LRS, you must recreate the storage account and migrate your data.

### Normal operations

**Traffic routing between zones**: Azure Table Storage with ZRS uses an active/active configuration where table operations are automatically distributed across all available zones. The service routes requests to the zone that can provide the fastest response while maintaining strong consistency across all replicas.

**Data replication between zones**: Table data is replicated synchronously across all three availability zones. When you perform write operations (insert, update, delete) on table entities, the operation completes only after all three zone replicas have successfully acknowledged the write. This synchronous replication ensures no data loss during zone failures but may introduce slight latency compared to single-zone deployments.

**Partition management across zones**: Azure Table Storage automatically distributes table partitions across availability zones to optimize performance and fault tolerance. The service dynamically rebalances partitions as needed to maintain optimal distribution and handle varying load patterns.

### Zone-down experience

When an availability zone becomes unavailable, Azure Table Storage automatically handles the failover process with the following behavior:

- **Detection and response**: Microsoft automatically detects zone failures and initiates failover to remaining healthy zones. No customer action is required for zone-level failover as the service handles this transparently.
- **Notification**: Zone-level failures don't generate specific customer notifications, as the service continues operating normally. You can monitor Azure Service Health and Azure Monitor for any impact notifications.
- **Active requests**: In-flight table operations are automatically retried against healthy zones. Most requests complete successfully with minimal delay, though some may experience increased latency during the transition.
- **Expected data loss**: No data loss occurs during zone failures because Azure Table Storage uses synchronous replication across zones. All acknowledged write operations are guaranteed to be available in the remaining zones.
- **Expected downtime**: Typically no downtime occurs as the service automatically routes traffic to healthy zones. Applications may experience brief increases in latency (typically seconds) as the service adjusts load distribution and rebalances partitions.
- **Traffic rerouting**: Azure automatically routes all table operations to the remaining healthy availability zones. The service balances requests across the available zones while redistributing partitions to maintain optimal performance.
- **Partition rebalancing**: The service automatically redistributes table partitions from the failed zone to healthy zones to maintain scalability targets and performance characteristics.

### Failback

When the failed availability zone recovers, Azure Table Storage automatically begins using it again for new operations. The service gradually rebalances traffic and partitions across all three zones to restore optimal performance and redundancy.

During failback, the service ensures data consistency by synchronizing any operations that occurred during the outage period. Partition rebalancing occurs gradually to minimize performance impact, typically completing within minutes without requiring any customer intervention or configuration changes.

### Testing for zone failures

Azure Table Storage is a fully managed service where zone redundancy is handled automatically by the Azure platform. You don't need to initiate manual tests for zone failures, as Microsoft continuously validates the service's resilience through internal testing and monitoring.

You can verify your application's resilience to increased latency by implementing load testing that simulates varying response times from Table Storage operations. This helps ensure your table queries and write operations can handle the brief performance impacts that may occur during zone transitions.

Consider testing partition-aware applications to ensure they handle partition redistribution gracefully, particularly for applications that depend on specific partition performance characteristics or entity co-location patterns.

## Multi-region support

Azure Table Storage supports multi-region deployments through geo-redundant storage configurations at the storage account level. The service provides both geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) options, which automatically replicate your table data to a secondary region using Azure paired regions.

With geo-redundant configurations, Azure Table Storage asynchronously replicates your table data to a secondary region that is hundreds of miles away from the primary region. GRS uses locally redundant storage in both regions, while GZRS combines zone-redundant storage in the primary region with locally redundant storage in the secondary region. Both configurations provide read-access options (RA-GRS and RA-GZRS) that allow read operations from the secondary region during primary region outages.

The geo-replication process is automatic and managed entirely by Microsoft. Table data is first committed in the primary region, then asynchronously replicated to the secondary region. The replication typically occurs within 15 minutes, though Azure doesn't provide an SLA for replication timing. The asynchronous nature means there may be a small RPO (Recovery Point Objective) during regional failures.

Table Storage's partitioned architecture affects geo-replication performance. The replication process can scale based on the number of partition keys in your tables, as different partitions can be replicated in parallel. However, the overall replication time depends on the volume of data and the rate of change across all partitions.

### Region support

Azure Table Storage geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on your primary region selection and cannot be customized. For a complete list of Azure paired regions, see [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions).

### Requirements

All storage account types that support Table Storage (Standard general-purpose v2) support geo-redundant configurations. No special SKU or configuration is required beyond selecting GRS, RA-GRS, GZRS, or RA-GZRS as your redundancy option.

### Considerations

During normal operations, all table write operations (insert, update, delete, merge) occur in the primary region. Read-access geo-redundant configurations (RA-GRS/RA-GZRS) allow read operations from tables in the secondary region, but you cannot write to tables in the secondary region until a failover occurs.

Applications using read-access configurations should be designed to handle eventual consistency between regions, as there may be a delay between when entities are written in the primary region and when they become available for reading in the secondary region. Consider implementing cache invalidation strategies that account for replication lag.

The partitioned nature of Table Storage means that different partitions may replicate at different rates depending on their activity levels. High-traffic partitions may experience longer replication delays compared to less active partitions.

### Cost

Geo-redundant storage configurations incur additional costs for data replication and storage in the secondary region. GRS and GZRS typically cost approximately twice as much as their single-region equivalents (LRS and ZRS). Data egress charges also apply for replication traffic between regions. For current pricing information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure multi-region support

- **Create**: Configure geo-redundant storage when creating a new storage account through the [Azure portal](/azure/storage/common/storage-account-create), specifying GRS, RA-GRS, GZRS, or RA-GZRS as your redundancy option.
- **Migrate**: Convert existing storage accounts to geo-redundant configurations using [Azure Storage live migration](/azure/storage/common/redundancy-migration) for supported conversion paths.

>[!NOTE]
> Some redundancy conversions may require recreating the storage account and migrating data if live migration isn't supported for your specific conversion path.

### Normal operations

**Traffic routing between regions**: Azure Table Storage geo-redundant configurations use an active/passive model where all write operations are directed to the primary region. With read-access configurations, applications can read from either region, but writes are always processed in the primary region.

**Data replication between regions**: Table data is replicated asynchronously from the primary to secondary region. Write operations are acknowledged after being committed in the primary region, then the data is replicated to the secondary region in the background. This asynchronous approach minimizes latency for primary region operations while providing regional protection.

**Partition-aware replication**: The replication process considers Table Storage's partitioned architecture, allowing different partitions to replicate independently. This parallel replication can improve overall replication performance for tables with well-distributed partition keys.

### Region-down experience

Azure Table Storage supports both Microsoft-managed and customer-managed failover scenarios for regional outages:

**Microsoft-managed failover**: In rare cases of prolonged primary region outages, Microsoft may initiate automatic failover to the secondary region. This process typically occurs only when the primary region is expected to be unavailable for an extended period.

- **Detection and response**: Microsoft monitors regional health and initiates automatic failover based on predefined criteria for service restoration time.
- **Notification**: Microsoft provides advance notification when possible through Azure Service Health and direct customer communications.
- **Active requests**: In-flight operations to the primary region fail and must be retried. Applications should implement retry logic to handle these scenarios.
- **Expected data loss**: Data loss may occur up to the Recovery Point Objective (RPO), typically less than 15 minutes, as replication is asynchronous. Entities written shortly before the outage may not be available in the secondary region.
- **Expected downtime**: Downtime varies but typically lasts several hours during the failover process and DNS propagation.
- **Traffic rerouting**: Microsoft updates DNS entries to redirect traffic to the secondary region, which becomes the new primary region.
- **Partition considerations**: Partition distribution and performance characteristics may differ in the secondary region until the service fully optimizes for the new configuration.

**Customer-managed failover**: You can initiate manual failover to the secondary region using Azure management tools when the primary region is unavailable.

- **Detection and response**: You must monitor primary region availability and decide when to initiate failover based on your business requirements and table access patterns.
- **Notification**: You control the timing and communication of failover to your organization and users.
- **Active requests**: Operations in progress during failover initiation will fail and require retry to the new primary region.
- **Expected data loss**: Potential data loss up to the RPO, as any entities not yet replicated to the secondary region will be lost.
- **Expected downtime**: Failover process typically takes 15-60 minutes to complete, depending on the size of your table data and current service load.
- **Traffic rerouting**: You must update your applications to use new storage endpoints after failover completes.

### Failback

**Microsoft-managed failover failback**: When the original primary region recovers, Microsoft may choose to fail back to restore the original configuration. This process is managed automatically with advance notification to customers.

**Customer-managed failover failback**: You can initiate failback to the original primary region after it recovers by performing another customer-managed failover. Consider the following:

- **Data synchronization**: Ensure you understand any table entities created in the secondary region during the outage period before initiating failback, as this data will be lost during failback.
- **Application updates**: Update application configurations to use the original primary region endpoints.
- **Partition optimization**: Allow time for the service to optimize partition distribution and performance after failback.
- **Timing considerations**: Plan failback during maintenance windows to minimize impact on applications and users.
- **Testing requirements**: Verify table query performance and data integrity after completing failback operations.

### Testing for region failures

You can simulate regional outages by using Azure Chaos Studio to inject storage account unavailability faults. This allows you to test your application's ability to handle primary region failures and failover scenarios specific to Table Storage operations.

Regularly test your disaster recovery procedures by performing customer-managed failover operations in non-production environments to ensure your applications and operational procedures work correctly during actual outages. Include testing of table query patterns and partition key distributions in your testing scenarios.

### Alternative multi-region approaches

If you need more control over regional deployment or want to implement active/active patterns, you can deploy separate Azure Table Storage resources in multiple regions and implement application-level logic to distribute entities across regions.

This approach requires you to manage data distribution, handle synchronization between tables, and implement custom failover logic. Consider the following patterns:

- **Partition-aware distribution**: Distribute entities across regions based on partition key ranges to maintain query efficiency.
- **Read/write splitting**: Direct write operations to a primary region while allowing reads from multiple regions.
- **Conflict resolution**: Implement strategies to handle conflicting updates when using multi-master configurations.

## Backups

Azure Table Storage doesn't provide traditional backup capabilities like point-in-time restore, as the service is designed for operational NoSQL data storage with built-in redundancy rather than backup-based recovery. However, you can implement backup strategies for table data when needed.

For scenarios requiring table data backup, consider the following approaches:

- **Export to Azure Blob Storage**: Use AzCopy or custom applications to periodically export table data to Azure Blob Storage for long-term retention. This approach allows you to maintain historical snapshots of your table data.
- **Cross-region replication**: Leverage geo-redundant storage options (GRS/GZRS) which maintain copies of your table data in a secondary region, providing protection against regional disasters.
- **Application-level backup**: Implement custom backup logic within your applications to export critical table entities to other storage services like Azure SQL Database or Azure Cosmos DB for more robust backup and restore capabilities.

When designing backup strategies for Table Storage, consider the partitioned nature of the data and ensure your backup processes can handle large tables efficiently by processing multiple partitions in parallel.

The geo-redundant storage options (GRS/GZRS) serve as the primary disaster recovery mechanism for Table Storage by maintaining copies of your table data in a secondary region, providing protection against regional outages without requiring separate backup infrastructure.

## Service-level agreement

The service-level agreement (SLA) for Azure Table Storage is included in the broader Azure Storage SLA, which guarantees different availability levels based on your redundancy configuration. Storage accounts with zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) receive higher availability guarantees compared to locally redundant storage (LRS).

For LRS configurations, Azure guarantees at least 99.9% availability for read and write requests to Table Storage. For ZRS configurations, the availability increases to at least 99.9% with improved resilience during availability zone failures. Read-access geo-redundant configurations provide at least 99.99% availability for read requests when configured properly.

The SLA covers table operations including entity queries, insertions, updates, deletions, and batch operations. Performance targets for Table Storage include up to 20,000 entities per second per storage account and up to 2,000 entities per second per partition, with 1KB entity size assumptions.

For complete SLA details and conditions, see [Service Level Agreement for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/).

## Related content

- [What is Azure Table Storage?](/azure/storage/tables/table-storage-overview)
- [Design scalable and performant tables](/azure/storage/tables/table-storage-design)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Performance and scalability checklist for Table storage](/azure/storage/tables/storage-performance-checklist)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
