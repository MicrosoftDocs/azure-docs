---
title: Reliability in Azure Table Storage
description: Learn about resiliency in Azure Table Storage, including resilience to transient faults, availability zone failures, and region failures.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-table-storage
ms.date: 08/18/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Table Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Table Storage

[Azure Table Storage](/azure/storage/tables/table-storage-overview) is a service that stores structured NoSQL data in the cloud. It provides a schemaless store where each entity is accessed via a key and contains a set of attributes. A single table can contain entities that have different sets of properties, and properties can consist of various data types.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Table Storage resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the Table Storage service level agreement (SLA).

> [!NOTE]
> Table Storage is part of the Azure Storage platform. Some of the capabilities of Table Storage are common across many Azure Storage services. In this article, we use *Azure Storage* or *Storage* to refer to these common capabilities.

## Production deployment recommendations for reliability

For production environments, take the following actions:

- Enable zone-redundant storage (ZRS) for the storage accounts that contain Table Storage resources. ZRS provides higher availability by replicating your data synchronously across multiple availability zones in the primary region. This replication protects against availability zone failures. 

- If you need resilience to region outages and your storage account's primary region is paired, consider enabling geo-redundant storage (GRS) to replicate data asynchronously to the paired region. In supported regions, you can combine geo-redundancy with zone redundancy by using geo-zone-redundant storage (GZRS).

- For high-scale production workloads, or if you have high resiliency requirements, consider using [Azure Cosmos DB for Table](/azure/cosmos-db/table/overview). Azure Cosmos DB for Table is compatible with applications that are written for Table Storage. It supports low-latency read and write operations at high scale and provides strong global distribution across multiple regions with flexible consistency models.  It also provides built-in backup and other capabilities that enhance your application's resiliency and performance.

## Reliability architecture overview

Table Storage operates as a distributed NoSQL database within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your table data, and the specific redundancy model depends on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

[Table Storage client libraries and SDKs](https://devblogs.microsoft.com/azure-sdk/announcing-the-new-azure-data-tables-libraries/) include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), throttling responses (HTTP 429), and partition server overload conditions. When your application experiences these transient conditions, the client libraries automatically retry operations by using exponential backoff strategies.

To manage transient faults effectively when you use Table Storage, take the following actions:

- **Configure appropriate timeouts** in your Table Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.

- **Implement exponential backoff** for retry policies, especially when your application encounters HTTP 503 server busy or HTTP 500 operation timeout errors. Table Storage might throttle requests when individual partitions become hot or when storage account limits are approached.

- **Design partition-aware retry logic** in high-scale applications. Partition-aware retry logic is a more advanced approach that considers partitioned architecture in Table Storage and distributes operations across multiple partitions to reduce the likelihood of encountering throttling on individual partition servers.

To learn more about the Table Storage architecture and how to design resilient and high-scale applications, see [Performance and scalability checklist for Table Storage](/azure/storage/tables/storage-performance-checklist).

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Table Storage is zone-redundant when you deploy it with ZRS configuration. Unlike locally redundant storage (LRS), ZRS guarantees that Azure synchronously replicates your table data across multiple availability zones. This configuration ensures that your tables remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before the service completes the write, which provides strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Table Storage resources within that account. Because the setting applies to the entire storage account, you can't configure individual entities for different redundancy levels. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from you or your application.

[!INCLUDE [Storage - Resilience to availability zone failures - Support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Requirements

[!INCLUDE [Storage - Supported regions](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

- **Storage account types:** You must use a Standard general-purpose v2 storage account to enable ZRS for Table Storage. Premium storage accounts don't support Table Storage.

### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For detailed pricing information, see [Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

### Configure availability zone support

- **Create a zone-redundant storage account and table:**

    1. [Create a storage account](/azure/storage/common/storage-account-create). Make sure to select ZRS, GZRS, or read-access geo-redundant storage (RA-GZRS) as the redundancy option.

    1. [Create a table](/azure/storage/tables/table-storage-quickstart-portal).

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Behavior when all zones are healthy
    
This section describes what to expect when a Table Storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Behavior when all zones are healthy](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Behavior during a zone failure

When an availability zone becomes unavailable, Table Storage automatically handles the failover process by responding with the following behaviors:

[!INCLUDE [Storage - Behavior during a zone failure](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting:** If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing so that requests are directed to the remaining healthy availability zones. The service maintains full functionality by using the healthy zones and doesn't require customer intervention.

### Zone recovery

[!INCLUDE [Storage - Zone recovery](includes/storage/reliability-storage-availability-zone-failback-include.md)]

### Test for zone failures

[!INCLUDE [Storage - Test for zone failures](includes/storage/reliability-storage-availability-zone-testing-include.md)]

## Resilience to region-wide failures

[!INCLUDE [Storage - Resilience to region-wide failures](includes/storage/reliability-storage-multi-region-support-include.md)]

### Geo-redundant storage

[!INCLUDE [Storage - Resilience to region-wide failures - RA-GRS addendum](includes/storage/reliability-storage-multi-region-support-read-access-include.md)]

[!INCLUDE [Storage - Resilience to region-wide failures - failover types](includes/storage/reliability-storage-multi-region-support-failover-types-include.md)]

#### Requirements

[!INCLUDE [Storage - Supported regions](includes/storage/reliability-storage-multi-region-region-support-include.md)]

[!INCLUDE [Storage - Requirements](includes/storage/reliability-storage-multi-region-requirements-include.md)]

#### Considerations

When you implement multi-region Table Storage, consider the following important factors:

[!INCLUDE [Storage - Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Considerations - Secondary region access](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

#### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Table Storage pricing](https://azure.microsoft.com/pricing/details/storage/tables/).

#### Configure multi-region support

[!INCLUDE [Storage - Configure multi-region support - Create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

[!INCLUDE [Storage - Configure multi-region support - Enable/disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

#### Behavior when all regions are healthy

[!INCLUDE [Storage - Behavior when all regions are healthy](includes/storage/reliability-storage-multi-region-normal-operations-include.md)]

#### Behavior during a region failure

[!INCLUDE [Storage - Behavior during a region failure](includes/storage/reliability-storage-multi-region-down-experience-include.md)]

#### Region recovery

[!INCLUDE [Storage - Region recovery](includes/storage/reliability-storage-multi-region-failback-include.md)]

#### Test for region failures

[!INCLUDE [Storage - Test for region failures](includes/storage/reliability-storage-multi-region-testing-include.md)]

### Custom multi-region solutions for resiliency

[!INCLUDE [Storage - Custom multi-region solutions - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

[!INCLUDE [Storage - Custom multi-region solutions - introduction](includes/storage/reliability-storage-multi-region-alternative-introduction-include.md)]

> [!NOTE]
> For applications built to use Table Storage, consider using [Azure Cosmos DB for Table](/azure/cosmos-db/table/overview). Azure Cosmos DB for Table supports advanced multi-region requirements, including support for nonpaired regions. It's also designed for compatibility with applications built for Table Storage.

[!INCLUDE [Storage - Custom multi-region solutions - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

For Table Storage, a multiple-account approach requires you to manage data distribution, handle synchronization between tables across regions including conflict resolution, and implement custom failover logic.

## Backup and restore

Table Storage doesn't provide traditional backup capabilities like point-in-time restore (PITR). However, you can implement custom backup strategies for table data. 

If you require built-in backup capabilities, consider moving to [Azure Cosmos DB for Table](/azure/cosmos-db/table/overview), which provides support for both periodic and continuous backups. For more information, see [Online backup and on-demand data restore in Azure Cosmos DB](/azure/cosmos-db/online-backup-and-restore).

For scenarios that require data backup from Table Storage, consider the following approaches:

- **Export by using Azure Data Factory.** Use the [Azure Data Factory connector for Table Storage](/azure/data-factory/connector-azure-table-storage) to export your entities to another location. For example, you can back up each entity to a JSON file that's stored in Azure Blob Storage.

- **Perform application-level backup.** Implement custom backup logic within your applications to export critical table entities to other storage services like Azure SQL Database or Azure Cosmos DB for more robust backup and restore capabilities.

When you design backup strategies for Table Storage, consider the partitioned nature of the data and ensure that your backup processes can handle large tables efficiently by processing multiple partitions in parallel.

[!INCLUDE [Backups include ](includes/reliability-backups-include.md)] 

## Service-level agreement

[!INCLUDE [Storage - Service-level agreement](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [What is Table Storage?](../storage/tables/table-storage-overview.md)
- [Design scalable and performant tables](../storage/tables/table-storage-design.md)
- [Azure Storage redundancy](../storage/common/storage-redundancy.md)
- [Azure storage disaster recovery planning and failover](../storage/common/storage-disaster-recovery-guidance.md)
- [Performance and scalability checklist for Table Storage](../storage/tables/storage-performance-checklist.md)
- [Azure reliability](overview.md)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
