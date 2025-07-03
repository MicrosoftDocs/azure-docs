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

[Azure Table Storage](/azure/storage/tables/table-storage-overview) is a service that stores structured NoSQL data in the cloud, providing a key/attribute store with a schemaless design. A single table can contain entities that have different sets of properties, and properties can be of various data types.

Azure Table Storage provides several reliability features through the underlying Azure Storage platform. As part of Azure Storage, Table Storage inherits the same redundancy options, availability zone support, and geo-replication capabilities that ensure high availability and durability for your table data.

This article describes reliability and availability zones support in Azure Table Storage. For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

<!-- Anastasia - I think we should add something like this to each of the Azure Storage guides that use the include files: -->
> [!NOTE]
> Azure Table Storage is part of the Azure Storage platform. Some of the capabilities of Table Storage are common across many Azure Storage services. In this document, we use "Azure Storage" to indicate these common capabilities.

## Production deployment recommendations

For production environments:

- Enable zone-redundant storage (ZRS) for the storage accounts that contain Table Storage resources. ZRS provides higher availability by replicating your data synchronously across multiple availability zones in the primary region, protecting against availability zone failures. 

- If your primary region is paired, consider enabling geo-redundant storage (GRS) or geo-zone-redundant storage (GZRS) for the storage accounts that contain Table Storage resources. GZRS provides protection against regional outages, using GZRS which combines zone redundancy in the primary region with geo-replication to a secondary region.

- For high-scale production workloads, consider using [Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction), which is compatible with applications that are written for Azure Table Storage. Azure Cosmos DB for Table supports low latency read and write operations at high scale, strong global distribution across multiple regions with flexible consistency models, and a range of other capabilities that enhance your resiliency and performance.

## Reliability architecture overview

Azure Table Storage operates as a distributed NoSQL database within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your table data, with the specific redundancy model depending on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[Azure Table Storage client libraries and SDKs](https://devblogs.microsoft.com/azure-sdk/announcing-the-new-azure-data-tables-libraries/) include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), throttling responses (HTTP 429), and partition server overload conditions. When your application encounters these transient conditions, the client libraries automatically retry operations using exponential backoff strategies.

To manage transient faults effectively when using Azure Table Storage:

- **Configure appropriate timeouts** in your Table Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.
- **Implement exponential backoff** for retry policies, especially when encountering HTTP 503 Server Busy or HTTP 500 Operation Timeout errors. Table Storage may throttle requests when individual partitions become hot or when storage account limits are approached.
- **Design partition-aware retry logic** that considers Table Storage's partitioned architecture. Distribute operations across multiple partitions to reduce the likelihood of encountering throttling on individual partition servers.

Common transient fault scenarios specific to Table Storage include:

- **Partition server unavailability**: Temporary failures of individual partition servers are handled automatically through partition redistribution to healthy servers.
- **Hot partition throttling**: When a partition receives disproportionate traffic, the service may temporarily throttle requests to that partition while load balancing occurs.
- **Entity Group Transaction failures**: Transient failures during batch operations affecting multiple entities within the same partition are automatically retried by client libraries.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Table Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your table data synchronously across all of the availability zones in the region. This configuration ensures that your tables remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Table Storage resources within that account. You cannot configure individual entities for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from you or your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

Zone-redundant Azure Storage accounts can be deployed [in any region that supports availability zones](./regions-list.md).

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Table Storage. Premium storage accounts don't support Table Storage. All storage account tiers and performance levels support ZRS configuration where availability zones are available.

### Cost

When you enable ZRS, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Tables pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

**Source**: [Azure Storage redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy#summary-of-redundancy-options)

### Configure availability zone support

- **Create a storage account and table with zone redundancy:**

    1. [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage (GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation.  

    1. [Create a table](/azure/storage/tables/table-storage-quickstart-portal).

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Normal operations
    
This section describes what to expect when a table storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Zone-down experience

When an availability zone becomes unavailable, Azure Table Storage automatically handles the failover process with the following behavior:

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

### Failback

When the failed availability zone recovers, Azure Table Storage automatically begins using it again for new operations. The service gradually rebalances traffic and partitions across all three zones to restore optimal performance and redundancy.

During failback, the service ensures data consistency by synchronizing any operations that occurred during the outage period. Partition rebalancing occurs gradually to minimize performance impact, typically completing within minutes without requiring any customer intervention or configuration changes.

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Multi-region support

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-multi-region-support-include.md)]

### Region support

Azure Table Storage geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on your primary region selection and cannot be customized. For a complete list of Azure paired regions, see [Azure regions list](./regions-list.md).

### Requirements

[!INCLUDE [Storage - Multi Region Requirements](includes/storage/reliability-storage-multi-region-requirements-include.md)]

### Considerations

When implementing multi-region Azure Table Storage, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Secondary region access (GRS)](includes/storage/reliability-storage-multi-region-considerations-secondary-grs-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

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

**Source**: [Performance and scalability checklist for Table storage](https://learn.microsoft.com/azure/storage/tables/storage-performance-checklist)

## Backups

Azure Table Storage doesn't provide traditional backup capabilities like point-in-time restore, as the service is designed for operational NoSQL data storage with built-in redundancy rather than backup-based recovery. However, you can implement backup strategies for table data when needed.

For scenarios requiring table data backup, consider the following approaches:

- **Export to Azure Blob Storage**: Use AzCopy or custom applications to periodically export table data to Azure Blob Storage for long-term retention. This approach allows you to maintain historical snapshots of your table data.
- **Application-level backup**: Implement custom backup logic within your applications to export critical table entities to other storage services like Azure SQL Database or Azure Cosmos DB for more robust backup and restore capabilities.

When designing backup strategies for Table Storage, consider the partitioned nature of the data and ensure your backup processes can handle large tables efficiently by processing multiple partitions in parallel.

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [What is Azure Table Storage?](/azure/storage/tables/table-storage-overview)
- [Design scalable and performant tables](/azure/storage/tables/table-storage-design)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Performance and scalability checklist for Table storage](/azure/storage/tables/storage-performance-checklist)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
