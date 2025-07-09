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

- If you need resilience to region outages and your storage account's primary region is paired, consider enabling geo-redundant storage, which replicates data asynchronously to the paired region. In supported regions, you can combine geo-redundancy with zone redundancy by using GZRS.

- For high-scale production workloads, or if you have high resiliency requirements, consider using [Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction). Azure Cosmos DB for Table is compatible with applications that are written for Azure Table Storage. It supports low latency read and write operations at high scale, strong global distribution across multiple regions with flexible consistency models, built-in backup, and a range of other capabilities that enhance your resiliency and performance.

## Reliability architecture overview

Azure Table Storage operates as a distributed NoSQL database within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your table data, with the specific redundancy model depending on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

[Azure Table Storage client libraries and SDKs](https://devblogs.microsoft.com/azure-sdk/announcing-the-new-azure-data-tables-libraries/) include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), throttling responses (HTTP 429), and partition server overload conditions. When your application encounters these transient conditions, the client libraries automatically retry operations using exponential backoff strategies.

To manage transient faults effectively when using Azure Table Storage:

- **Configure appropriate timeouts** in your Table Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.
- **Implement exponential backoff** for retry policies, especially when encountering HTTP 503 Server Busy or HTTP 500 Operation Timeout errors. Table Storage may throttle requests when individual partitions become hot or when storage account limits are approached.
- **Design partition-aware retry logic** in high-scale applications. Partition-aware retry logic is a more advanced approach that considers Table Storage's partitioned architecture and distributes operations across multiple partitions to reduce the likelihood of encountering throttling on individual partition servers.

To learn more about the Azure Table Storage architecture and how to design resilient and high-scale applications, see [Performance and scalability checklist for Table storage](/azure/storage/tables/storage-performance-checklist).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Table Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your table data synchronously across all of the availability zones in the region. This configuration ensures that your tables remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Table Storage resources within that account. You cannot configure individual entities for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from you or your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

[!INCLUDE [Storage - Availability zone region support](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Table Storage. Premium storage accounts don't support Table Storage.

### Cost

[!INCLUDE [Storage - Availability zone cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For detailed pricing information, see [Azure Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

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

[!INCLUDE [Storage - Zone failback](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Testing for zone failures

[!INCLUDE [Storage - Testing for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Multi-region support

[!INCLUDE [Storage - Multi-region support introduction](includes/storage/reliability-storage-multi-region-support-include.md)]

[!INCLUDE [Storage - Multi-region support introduction RA-GRS addendum](includes/storage/reliability-storage-multi-region-support-read-access-include.md)]

[!INCLUDE [Storage - Multi-region support introduction failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

### Region support

[!INCLUDE [Storage - Multi-region support region support](includes/storage/reliability-storage-multi-region-region-support-include.md)]

### Requirements

[!INCLUDE [Storage - Multi Region Requirements](includes/storage/reliability-storage-multi-region-requirements-include.md)]

### Considerations

When implementing multi-region Azure Table Storage, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Secondary region access (read access)](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

### Cost

[!INCLUDE [Storage - Multi Region cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Azure Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

### Configure multi-region support

[!INCLUDE [Storage - Multi Region Configure multi-region support - create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

[!INCLUDE [Storage - Multi Region Configure multi-region support - enable-disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

### Normal operations

[!INCLUDE [Storage - Multi Region Normal operations](includes/storage/reliability-storage-multi-region-normal-operations-include.md)]

### Region-down experience

[!INCLUDE [Storage - Multi Region Down experience](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

### Failback

[!INCLUDE [Storage - Multi Region Failback](includes/storage/reliability-storage-multi-region-failback-include.md)]

### Testing for region failures

[!INCLUDE [Storage - Multi Region Testing](includes/storage/reliability-storage-multi-region-testing-include.md)]

### Alternative multi-region approaches

[!INCLUDE [Storage - Alternative multi-region approaches - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

> [!NOTE]
> For applications built to use Azure Table Storage, consider using [Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction) instead, which supports advanced multi-region requirements, including support for nonpaired regions. Azure Cosmos DB for Table is designed to be compatible with applications built for Azure Table Storage.

[!INCLUDE [Storage - Alternative multi-region approaches - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

For Azure Table Storage, a multi-account approach requires you to manage data distribution, handle synchronization between tables across regions including conflict resolution, and implement custom failover logic.

## Backups

Azure Table Storage doesn't provide traditional backup capabilities like point-in-time restore. However, you can implement custom backup strategies for table data. For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](./concept-redundancy-replication-backup.md).

If you require built-in backup capabilities, consider moving to [Azure Cosmos DB for Table](/azure/cosmos-db/table/introduction), which provides support for both periodic and continuous backups. For more information, see [Online backup and on-demand data restore in Azure Cosmos DB](/azure/cosmos-db/online-backup-and-restore).

For scenarios requiring data backup from Azure Table Storage, consider the following approaches:

- **Export by using Azure Data Factory:** Use the [Azure Data Factory connector for Azure Table Storage](/azure/data-factory/connector-azure-table-storage) to export your entities to another location. For example, you could back up each entity to a JSON file that's stored in Azure Blob Storage.

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
