---
title: Reliability in Azure Table Storage
description: Learn about reliability in Azure Table Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-table-storage
ms.date:  07/2/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Table Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Table Storage

[Azure Table Storage](/azure/storage/tables/table-storage-overview) is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. A single table can contain entities that have different sets of properties, and properties can be of various data types. Table Storage is ideal for storing flexible datasets like user data for web applications, address books, device information, or other types of metadata your service requires.

Azure Table Storage provides several reliability features through the underlying Azure Storage platform. As part of Azure Storage, Table Storage inherits the same redundancy options, availability zone support, and geo-replication capabilities that ensure high availability and durability for your table data. The service automatically handles transient faults and provides built-in retry mechanisms through Azure Storage client libraries, making it well-suited for applications requiring reliable NoSQL data storage with high availability.

This article describes reliability and availability zones support in Azure Table Storage. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

For production environments:

- Enable zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) in paired regions for the storage accounts that contain Table Storage resources.

    - ZRS provides higher availability by replicating your data synchronously across three availability zones in the primary region, protecting against availability zone failures. 
    - GZRS provides protection against regional outages, using GZRS which combines zone redundancy in the primary region with geo-replication to a secondary region.

- Choose the Standard general-purpose v2 storage account type for Table Storage, as it provides the best balance of features, performance, and cost-effectiveness. Premium storage accounts don't support Table Storage.


## Reliability architecture overview

Azure Table Storage operates as a distributed NoSQL database within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your table data, with the specific redundancy model depending on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-reliability-architecture-include.md)]


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


## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]


Azure Table Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your table data synchronously across three separate availability zones. This configuration ensures that your tables remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Queue Storage resources within that account. You cannot configure individual queues for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

Zone-redundant Azure Queue Storage can be deployed [in any region that supports availability zones](./regions-list.md).

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Table Storage. Premium storage accounts don't support Table Storage. All storage account tiers and performance levels support ZRS configuration where availability zones are available.

**Source**: [Azure Storage redundancy](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy#summary-of-redundancy-options)

### Cost

When you enable ZRS, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Tables pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

**Source**: [Azure Storage redundancy](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy#summary-of-redundancy-options)

### Configure availability zone support

- **Create a queue storage with redundancy:** 

    1.  [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage(GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation

    1.  [Create a table](/azure/storage/tables/table-storage-quickstart-portal).

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-configure-availability-zone-support-include.md)]


### Normal operations

This section describes what to expect when a table storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]


### Zone-down experience

When an availability zone becomes unavailable, Azure Table Storage automatically handles the failover process with the following behavior:


[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]



### Failback

When the failed availability zone recovers, Azure Table Storage automatically begins using it again for new operations. The service gradually rebalances traffic and partitions across all three zones to restore optimal performance and redundancy.

During failback, the service ensures data consistency by synchronizing any operations that occurred during the outage period. Partition rebalancing occurs gradually to minimize performance impact, typically completing within minutes without requiring any customer intervention or configuration changes.

**Source**: [Azure storage disaster recovery planning and failover](https://learn.microsoft.com/en-us/azure/storage/common/storage-disaster-recovery-guidance)

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]


## Multi-region support

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-multi-region-support-include.md)]



### Region support

Azure Table Storage geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on your primary region selection and cannot be customized. For a complete list of Azure paired regions, see [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions).

### Requirements

[!INCLUDE [Storage - Multi Region Requirements](includes/storage/reliability-storage-multi-region-support-include.md)]

### Considerations

[!INCLUDE [Storage - Multi Region Considerations](includes/storage/reliability-storage-multi-region-considerations-include.md)]

### Cost

Multi-region Azure Table Storage configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/Table/).

### Configure multi-region support

[!INCLUDE [Storage - Multi Region Configure multi-region support](includes/storage/reliability-storage-multi-region-configure-include.md)]


### Normal operations


[!INCLUDE [Storage - Multi Region Normal operations](includes/storage/reliability-storage-multi-region-normal-operations-include.md)]


### Region-down experience

[!INCLUDE [Storage - Multi Region Down experience](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

### Failback

[!INCLUDE [Storage - Multi Region Failback](includes/storage/reliability-storage-multi-region-failback-include.md)]

### Testing for region failures

[!INCLUDE [Storage - Multi Region Testing](includes/storage/reliability-storage-multi-region-testing-include.md)]

### Alternative multi-region approaches

[!INCLUDE [Storage - Alternative multi-region approaches](includes/storage/reliability-storage-multi-region-alternative-include.md)]

This approach requires you to manage data distribution, handle synchronization between tables, and implement custom failover logic. Consider the following patterns:

- **Partition-aware distribution**: Distribute entities across regions based on partition key ranges to maintain query efficiency.
- **Read/write splitting**: Direct write operations to a primary region while allowing reads from multiple regions.
- **Conflict resolution**: Implement strategies to handle conflicting updates when using multi-master configurations.

**Source**: [Performance and scalability checklist for Table storage](https://learn.microsoft.com/en-us/azure/storage/tables/storage-performance-checklist)

## Backups

Azure Table Storage doesn't provide traditional backup capabilities like point-in-time restore, as the service is designed for operational NoSQL data storage with built-in redundancy rather than backup-based recovery. However, you can implement backup strategies for table data when needed.

For scenarios requiring table data backup, consider the following approaches:

- **Export to Azure Blob Storage**: Use AzCopy or custom applications to periodically export table data to Azure Blob Storage for long-term retention. This approach allows you to maintain historical snapshots of your table data.
- **Cross-region replication**: Leverage geo-redundant storage options (GRS/GZRS) which maintain copies of your table data in a secondary region, providing protection against regional disasters.
- **Application-level backup**: Implement custom backup logic within your applications to export critical table entities to other storage services like Azure SQL Database or Azure Cosmos DB for more robust backup and restore capabilities.

When designing backup strategies for Table Storage, consider the partitioned nature of the data and ensure your backup processes can handle large tables efficiently by processing multiple partitions in parallel.

The geo-redundant storage options (GRS/GZRS) serve as the primary disaster recovery mechanism for Table Storage by maintaining copies of your table data in a secondary region, providing protection against regional outages without requiring separate backup infrastructure.

**Source**: [Azure Storage redundancy](https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy#redundancy-in-a-secondary-region)

## Service-level agreement

The service-level agreement (SLA) for Azure Table Storage is included in the broader Azure Storage SLA, which guarantees different availability levels based on your redundancy configuration. Storage accounts with zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) receive higher availability guarantees compared to locally redundant storage (LRS).

For LRS configurations, Azure guarantees at least 99.9% availability for read and write requests to Table Storage. For ZRS configurations, the availability increases to at least 99.9% with improved resilience during availability zone failures. Read-access geo-redundant configurations provide at least 99.99% availability for read requests when configured properly.

The SLA covers table operations including entity queries, insertions, updates, deletions, and batch operations. Performance targets for Table Storage include up to 20,000 entities per second per storage account and up to 2,000 entities per second per partition, with 1KB entity size assumptions.

For complete SLA details and conditions, see [Service Level Agreement for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/).

**Source**: [Service Level Agreement for Storage Accounts](https://azure.microsoft.com/support/legal/sla/storage/v1_5/)

## Related content

- [What is Azure Table Storage?](/azure/storage/tables/table-storage-overview)
- [Design scalable and performant tables](/azure/storage/tables/table-storage-design)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Performance and scalability checklist for Table storage](/azure/storage/tables/storage-performance-checklist)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
