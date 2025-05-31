---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 01/03/2025
ms.update-cycle: 180-days
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud, designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure your data remains available and durable in the face of both planned and unplanned events.

Azure Blob Storage supports comprehensive redundancy options including availability zone deployment with zone-redundant storage (ZRS), multi-region protection through geo-redundant configurations, and sophisticated failover capabilities. The service automatically handles transient faults and provides configurable retry policies to maintain consistent access to your data. With built-in redundancy mechanisms that store multiple copies of your data across different fault domains, Azure Blob Storage is engineered to deliver exceptional durability and availability for mission-critical workloads.


This article describes reliability support in [Azure Blob Storage](/azure/storage/blobs/storage-blobs-overview), and covers both regional resiliency with availability zones and cross-region resiliency with disaster recovery. 

For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

For production workloads in regions that support it, we recommend using **Standard general-purpose v2** storage accounts with **Zone-redundant storage (ZRS)** redundancy configurations. ZRS provides automatic replication across multiple availability zones within a region.

In paired regions or for applications requiring the highest level of availability and disaster recovery capabilities, choose **Read-access geo-zone-redundant storage (RA-GZRS)**, which provides read access to data in the secondary region even when the primary region is available. Consider **Premium Block Blob** storage accounts with ZRS for workloads requiring ultra-low latency and high transaction rates, though these accounts have higher storage costs.

Avoid **Locally redundant storage (LRS)** for production unless data can be easily reconstructed or when regulatory requirements restrict replication to a single region. Enable **soft delete** for both blobs and containers, implement **versioning** for critical data, and configure **lifecycle management policies** to optimize costs while maintaining data protection.

## Reliability architecture overview

Azure Storage maintains multiple copies of your storage account to ensure that availability and durability targets are met, even in the face of failures. The way in which data is replicated provides differing levels of protection. Each option offers its own benefits, so the option you choose depends upon the degree of resiliency your applications require.

- [Locally redundant storage (LRS)](/azure/storage/common/storage-redundancy#locally-redundant-storage), the lowest-cost redundancy option, automatically stores and replicates three copies of your storage account within a single datacenter. Although LRS protects your data against server rack and drive failures, it doesn't account for disasters such as fire or flooding within a datacenter. In the face of such disasters, all replicas of a storage account configured to use LRS might be lost or unrecoverable.

  :::image type="content" source="media/blob-storage/locally-redundant-storage.png" alt-text="Diagram showing how data is replicated in availability zones with LRS" lightbox="media/blob-storage/locally-redundant-storage.png":::

- [Zone-redundant storage (ZRS)](/azure/storage/common/storage-redundancy#zone-redundant-storage) retains a copy of a storage account and replicates it in each of the separate availability zones within the same region. 

  :::image type="content" source="media/blob-storage/zone-redundant-storage.png" alt-text="Diagram showing how data is replicated in the primary region with ZRS" lightbox="media/blob-storage/zone-redundant-storage.png":::

- [Geo-redundant storage (GRS)](/azure/storage/common/storage-redundancy#geo-redundant-storage), unlike LRS and ZRS, provides support for unplanned failovers to a secondary region when there's an outage in the primary region. During the failover process, DNS entries for your storage account service endpoints are automatically updated to make the secondary region's endpoints the new primary endpoints. Once the unplanned failover is complete, clients can begin writing to the new primary endpoints.

  :::image type="content" source="media/blob-storage/geo-redundant-storage.png" alt-text="Diagram showing how data is replicated with GRS or RA-GRS" lightbox="media/blob-storage/geo-redundant-storage.png":::

- [Read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS)](/azure/storage/common/storage-redundancy#read-access-to-data-in-the-secondary-region) also provide geo-redundant storage, but offer the added benefit of read access to the secondary endpoint. These options are ideal for applications designed for high availability business-critical applications. If the primary endpoint experiences an outage, applications configured for read access to the secondary region can continue to operate. Microsoft recommends RA-GZRS for maximum availability and durability of your storage accounts.

  :::image type="content" source="media/blob-storage/geo-zone-redundant-storage.png" alt-text="Diagram showing how data is replicated with GZRS or RA-GZRS" lightbox="media/blob-storage/geo-zone-redundant-storage.png":::

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Blob Storage handles transient faults through automatic retry mechanisms built into the storage service infrastructure. The service implements exponential backoff retry policies for operations that encounter temporary failures such as network timeouts, throttling responses, or temporary service unavailability.

To effectively manage transient faults when using Azure Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries** which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For detailed retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

- **Implement circuit breaker patterns** in your application code to temporarily stop making requests when the storage service is experiencing sustained issues. For comprehensive guidance on implementing circuit breakers, see [Circuit breaker pattern](/azure/well-architected/reliability/handle-transient-faults#circuit-breaker-pattern).

- **Design for geo-redundancy** by configuring read access to the secondary region (RA-GRS or RA-GZRS) and building your application to gracefully fallback to reading from secondary endpoints during primary region outages. For implementation details, see [Use geo-redundancy to design highly available applications](/azure/storage/common/geo-redundant-design).


## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Blob Storage provides robust availability zone support through zone-redundant storage configurations that automatically distribute your data across multiple availability zones within a region. When you configure a storage account for zone-redundant storage (ZRS), Azure synchronously replicates your blob data across multiple availability zones, ensuring that your data remains accessible even if one zone experiences an outage.

Azure Blob Storage supports **zone-redundant deployments only** - it cannot be pinned to a specific availability zone. This zone-redundant approach provides superior resilience compared to zonal deployments because your data is automatically protected against single zone failures without requiring you to manage multiple storage accounts or implement custom replication logic. The service automatically distributes data across multiple availability zones in the region and handles load balancing between zones transparently.

Zone-redundant storage ensures that write operations are not considered complete until data has been successfully committed to storage clusters in multiple availability zones. This synchronous replication approach guarantees data consistency across zones while maintaining high performance for most workloads. The service automatically handles zone failover scenarios by redirecting traffic to healthy zones without requiring customer intervention or application changes.

### Region support

Zone-redundant Azure Blob Storage can be deployed into any [region that supports availability zones](./regions-list.md). To determine whether a region supports GZRS, the region must support availability zones and have a paired region.

### Requirements

Zone-redundant storage is supported across all Azure Blob Storage tiers and access levels. You can enable zone redundancy with any of the following redundancy configurations:

- Zone-redundant storage (ZRS) for protection within a single region
- Geo-zone-redundant storage (GZRS) for zone redundancy plus geo-replication
- Read-access geo-zone-redundant storage (RA-GZRS) for zone redundancy, geo-replication, and read access to the secondary region

Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. All blob types (block blobs, append blobs, and page blobs) support zone-redundant configurations.

## Considerations

<!-- Considerations for zone-redundant storage -->


### Cost

When you enable zone-redundant storage, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. Zone-redundant storage typically costs approximately 25% more than locally redundant storage for the same amount of data. For geo-zone-redundant configurations, costs are higher due to cross-region replication. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

For comprehensive guidance on configuring zone-redundant storage for Azure Blob Storage:

- **Create**. To create a new storage account with zone-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, GZRS, or RA-GZRS as the redundancy option during account creation.

- **Migrate**. To convert an existing storage account to zone-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for detailed migration options and requirements.

- **Monitor**. To monitor the health and performance of zone-redundant storage accounts, see [Monitor Azure Blob Storage](/azure/storage/blobs/monitor-blob-storage) for guidance on setting up monitoring and alerts.

### Capacity planning and management

Zone-redundant Azure Blob Storage automatically distributes load across availability zones and doesn't require specific capacity planning for zone failures. The service maintains sufficient capacity in each zone to handle normal operations, and during a zone outage, the remaining zones automatically absorb the additional load.

However, consider implementing [lifecycle management policies](/azure/storage/blobs/lifecycle-management-overview) to automatically transition data between access tiers based on usage patterns, which can help optimize both performance and costs. 

### Normal operations

During normal operations with zone-redundant Azure Blob Storage configured across multiple availability zones:

**Traffic routing between zones**: Azure Blob Storage uses an active/active approach where client requests are automatically distributed across storage clusters in multiple availability zones. The service uses intelligent load balancing to optimize performance while maintaining data consistency. Traffic distribution is transparent to applications and requires no client-side configuration.

**Data replication between zones**: All write operations to zone-redundant storage are replicated synchronously across multiple availability zones. When you upload or modify blob data, the operation isn't considered complete until the data has been successfully written to storage clusters in multiple zones. This synchronous replication ensures strong consistency and zero data loss during zone failures, though it may result in slightly higher write latency compared to locally redundant storage.

### Zone-down experience

When an availability zone becomes unavailable, Azure Blob Storage continues operating with minimal impact:

| Aspect | Details |
|--------|---------|
| **Detection and response** | Microsoft automatically detects zone failures and initiates failover processes. No customer action is required for zone-redundant storage accounts. |
| **Notification** | You can configure alerts for availability and latency metrics in Azure Monitor to help detect potential issues with your storage account. |
| **Active requests** | In-flight requests may experience temporary failures or increased latency during the initial failover period. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions. |
| **Expected data loss** | No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete. |
| **Expected downtime** | Minimal downtime (typically seconds to minutes) may occur during automatic failover as traffic is redirected to healthy zones. |
| **Traffic rerouting** | Azure automatically reroutes traffic to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required. |

### Failback

When the failed availability zone recovers, Azure Blob Storage automatically restores normal operations across multiple zones:

**Microsoft-managed failover failback**: Azure automatically detects when the previously failed zone is healthy and begins redistributing traffic across all available zones. The service restores data to the recovered zone as needed and resumes normal load balancing. No customer action is required, and the process is transparent to applications.

The failback process typically completes within minutes to hours depending on the amount of data that needs to be synchronized to the recovered zone. During failback, you may experience slightly elevated latency as the service rebalances load across all zones.

### Testing for zone failures

You can test your application's resilience to zone failures using Azure Chaos Studio and other chaos engineering approaches:

- Implement automated testing scenarios that validate your application's ability to handle increased latency and temporary failures
- Monitor your application's behavior during simulated failures to ensure retry logic and error handling work correctly
- Test your application's response to storage service degradation scenarios

For detailed guidance on setting up chaos engineering experiments, see [Azure Chaos Studio documentation](/azure/chaos-studio/) and regularly test your disaster recovery procedures to ensure readiness for unexpected zone outages.

## Multi-region support

Azure Blob Storage provides native multi-region support through geo-redundant storage configurations that automatically replicate your data to a secondary region. The service supports both geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS), which use Azure paired regions to provide protection against regional disasters.

Geo-redundant configurations asynchronously replicate data from the primary region to a secondary region that is hundreds of miles away. The secondary region is automatically determined based on [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions), ensuring geographic separation for disaster recovery. Data in the secondary region is always replicated using locally redundant storage (LRS), providing protection against hardware failures within the secondary region.

Azure Blob Storage also supports read-access configurations (RA-GRS and RA-GZRS) that allow applications to read data from the secondary region even when the primary region is available. This capability enables applications to implement active-passive architectures where reads can be distributed between regions to improve performance and provide fallback options during outages.

### Region support

Azure Blob Storage geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on the primary region selection and cannot be customized. Each Azure region is paired with a specific region within the same geography, ensuring data residency requirements are met.

Geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) are available in most Azure regions that support general-purpose v2 storage accounts. For the complete list of Azure paired regions and their availability for geo-redundant storage, see [Azure paired regions](/azure/reliability/regions-paired) and [Azure Storage redundancy](/azure/storage/common/storage-redundancy).

### Requirements

Multi-region support requires:

- **Standard general-purpose v2 storage account** - Premium storage account types do not support geo-redundant configurations
- **Geo-redundant redundancy configuration** - Choose from GRS, RA-GRS, GZRS, or RA-GZRS
- **Paired region availability** - Both the primary and secondary regions must support the selected redundancy configuration

All blob types (block blobs, append blobs, and page blobs) support geo-redundant configurations. However, certain features may have limitations with geo-redundancy. For details about feature compatibility, see [Unsupported features and services](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services).

### Considerations

When implementing multi-region Azure Blob Storage, consider the following important factors:

**Asynchronous replication latency**: Data replication to the secondary region is asynchronous, which means there's a lag between when data is written to the primary region and when it becomes available in the secondary region. This lag can result in potential data loss (measured as Recovery Point Objective or RPO) if a primary region failure occurs before recent data is replicated.

**Secondary region access**: With standard GRS and GZRS configurations, the secondary region is not accessible for reads until a failover occurs. Only RA-GRS and RA-GZRS configurations provide read access to the secondary region during normal operations.

**Feature limitations**: Some Azure Blob Storage features are not supported or have limitations when using geo-redundant storage. These include certain blob types, access tiers, and management operations. Review [feature compatibility documentation](/azure/storage/common/storage-disaster-recovery-guidance#unsupported-features-and-services) before implementing geo-redundancy.

### Cost

Multi-region Azure Blob Storage configurations incur additional costs for cross-region replication and storage in the secondary region. Geo-redundant storage typically costs approximately 50% more than zone-redundant storage within a single region due to the additional storage overhead and bandwidth costs for replication.

Read-access configurations (RA-GRS and RA-GZRS) may incur additional egress charges when reading data from the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

To implement multi-region support for Azure Blob Storage:

- **Create**. To create a storage account with geo-redundant configuration, see [Create a storage account](/azure/storage/common/storage-account-create) and select GRS, RA-GRS, GZRS, or RA-GZRS during account creation.

- **Convert**. To convert an existing storage account to geo-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

- **Monitor**. To track replication status and monitor cross-region latency, see [Check the Last Sync Time property](/azure/storage/common/last-sync-time-get) and [Monitor Azure Blob Storage](/azure/storage/blobs/monitor-blob-storage).

### Capacity planning and management

Multi-region Azure Blob Storage automatically manages capacity in both primary and secondary regions. The service allocates sufficient resources in the secondary region to store replicated data and handle potential failover scenarios.

During a regional failover, the secondary region becomes the new primary and must handle all read and write operations. Consider the capacity and performance characteristics of the secondary region when designing your architecture, especially for write-heavy workloads that may experience performance changes after failover.

Implement data lifecycle policies to manage storage costs across both regions, as data stored in the secondary region contributes to overall storage costs. For guidance on optimizing multi-region storage costs, see [Optimize costs with lifecycle management](/azure/storage/blobs/lifecycle-management-overview).

### Normal operations

During normal multi-region operations when both primary and secondary regions are available:

**Traffic routing between regions**: Azure Blob Storage uses an active/passive approach where all write operations and most read operations are directed to the primary region. For RA-GRS and RA-GZRS configurations, applications can optionally read from the secondary region by accessing the secondary endpoint, but this requires explicit application configuration and is not automatic.

**Data replication between regions**: Write operations are first committed to the primary region using the configured redundancy type (LRS for GRS/RA-GRS, or ZRS for GZRS/RA-GZRS). After successful completion in the primary region, data is asynchronously replicated to the secondary region where it's stored using locally redundant storage (LRS). The asynchronous nature of cross-region replication means there's typically a lag time between when data is written to primary and when it's available in the secondary region.

### Region-down experience

When a primary region becomes unavailable, Azure Blob Storage supports both Microsoft-managed and customer-managed failover scenarios:

**Microsoft-managed failover**: In rare cases of major disasters where Microsoft determines the primary region is permanently unrecoverable, Microsoft will initiate automatic failover to the secondary region. This process is managed entirely by Microsoft and requires no customer action.

| Aspect | Microsoft-managed failover |
|--------|---------------------------|
| **Detection and response** | Microsoft detects regional disasters and initiates failover when primary region is deemed permanently unavailable |
| **Notification** | Customers are notified through Azure Service Health and support communications |
| **Active requests** | In-flight requests to the primary region will fail during the transition period |
| **Expected data loss** | Some data loss is possible due to asynchronous replication lag (RPO varies) |
| **Expected downtime** | Several hours of downtime expected during failover process (RTO varies) |
| **Traffic rerouting** | Microsoft automatically updates DNS entries to point to the new primary region |

**Customer-managed failover**: Customers can initiate manual failover for geo-redundant storage accounts when the primary region is unavailable but not necessarily permanently lost.

| Aspect | Customer-managed failover |
|--------|--------------------------|
| **Detection and response** | Customer detects primary region issues and manually initiates failover through Azure portal, PowerShell, or CLI |
| **Notification** | Customer controls when to initiate failover and can monitor progress through Azure portal |
| **Active requests** | In-flight requests fail during failover; applications must retry to new primary endpoint |
| **Expected data loss** | Potential data loss due to asynchronous replication lag; recent writes may not be replicated |
| **Expected downtime** | Typically 15-60 minutes depending on account size and complexity |
| **Traffic rerouting** | Azure automatically updates storage account endpoints; applications may need DNS cache clearing |

For detailed guidance on initiating customer-managed failover, see [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

### Failback

The failback process differs significantly between Microsoft-managed and customer-managed failover scenarios:

**Microsoft-managed failover failback**: After Microsoft-initiated failover, the failback process is also managed entirely by Microsoft. When the original primary region recovers, Microsoft evaluates the situation and may initiate failback to restore the original regional configuration. This process is automatic and requires no customer action, though customers are notified through Azure Service Health communications. The timeline for Microsoft-managed failback depends on the extent of the regional disaster and recovery efforts.

**Customer-managed failover failback**: After customer-initiated failover, customers must manually initiate the failback process when the original primary region is available again. The failback process involves:

1. **Verification**: Ensure the original primary region is fully operational and stable
2. **Initiation**: Manually trigger failback through Azure portal, PowerShell, or Azure CLI
3. **Data synchronization**: Azure re-establishes replication from the current primary (former secondary) back to the original primary region
4. **Endpoint restoration**: DNS entries are updated to point back to the original primary region
5. **Application testing**: Verify applications work correctly with the restored configuration

Important considerations for customer-managed failback:
- **Timing**: Plan failback during maintenance windows to minimize business impact
- **Data loss risk**: Ensure all critical data written during the failover period is properly synchronized
- **Application configuration**: Some applications may need endpoint updates or cache clearing
- **Geo-redundancy restoration**: After failback, you must manually reconfigure geo-redundancy as the account becomes locally redundant (LRS) after failover

For step-by-step failback procedures, see [Disaster recovery and storage account failover](/azure/storage/common/storage-disaster-recovery-guidance).

### Testing for region failures

You can simulate regional failures to test your disaster recovery procedures:

- **Chaos Studio**: Use Azure Chaos Studio to inject region-level faults and test your application's failover behavior. Configure experiments that simulate primary region unavailability and measure your application's response.

- **Planned failover testing**: For geo-redundant storage accounts, you can perform planned failover operations during maintenance windows to test the complete failover and failback process without data loss.

- **Secondary endpoint testing**: For RA-GRS and RA-GZRS configurations, regularly test read operations against the secondary endpoint to ensure your application can successfully access backup data.

Implement automated monitoring and alerting to track the success of failover tests and ensure your disaster recovery procedures remain effective as your application evolves.

### Alternative multi-region approaches

If your application requires more control over multi-region deployment than the native geo-redundant options provide, consider implementing custom multi-region architectures:

Azure Blob Storage can be deployed in multiple regions using separate storage accounts in each region. This approach provides flexibility in region selection, the ability to use non-paired regions, and more granular control over replication timing and data consistency.

When implementing multiple storage accounts across regions, you need to configure cross-region data replication, implement load balancing and failover policies, and ensure data consistency across regions. Consider using Azure services like Azure Data Factory for data orchestration, Azure Traffic Manager for DNS-based load balancing, or Azure Front Door for global load balancing.

For example approaches that illustrate multi-region architecture patterns, see:

- [Geo-distributed data using Azure Traffic Manager](/azure/architecture/web-apps/app-service/architectures/multi-region)
- [Multi-region load balancing with Traffic Manager and Application Gateway](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Globally distributed applications using Azure Front Door](/azure/architecture/guide/networking/global-web-applications/overview)

## Backups

Azure Blob Storage provides multiple data protection mechanisms that complement redundancy for comprehensive backup strategies. While the service's built-in redundancy protects against infrastructure failures, additional backup capabilities protect against accidental deletion, corruption, and malicious activities.

**Point-in-time restore** allows you to restore block blob data to a previous state within a configured retention period (up to 365 days). This feature is fully managed by Microsoft and provides granular recovery capabilities at the container or blob level. Point-in-time restore data is stored in the same region as the source account and is accessible even during regional outages if using geo-redundant configurations.

**Blob versioning** automatically maintains previous versions of blobs when they are modified or deleted. Each version is stored as a separate object and can be accessed independently. Versions are stored in the same region as the current blob and follow the same redundancy configuration as the storage account.

**Soft delete** provides a safety net for accidentally deleted blobs and containers by retaining deleted data for a configurable period. Soft-deleted data remains in the same storage account and region, making it immediately available for recovery. For geo-redundant accounts, soft-deleted data is also replicated to the secondary region.

**Blob snapshots** create read-only point-in-time copies of blobs that can be used for backup and recovery scenarios. Snapshots are stored in the same storage account and follow the same redundancy and geo-replication settings as the base blob.

For cross-region backup requirements, consider using **Azure Backup for Blobs**, which provides centralized backup management and can store backup data in different regions from the source data. This service provides operational and vaulted backup options with configurable retention policies and restore capabilities.

## Reliability during service maintenance

Azure Blob Storage is designed to maintain high availability during planned maintenance activities. Microsoft performs regular maintenance on the underlying storage infrastructure, including hardware updates, software patches, and capacity management operations.

During planned maintenance, Azure Blob Storage leverages its redundant architecture to maintain service availability. For zone-redundant storage configurations, maintenance is performed on one availability zone at a time, ensuring that your data remains accessible through the other zones. For geo-redundant configurations, maintenance in the primary region doesn't affect read access to the secondary region for RA-GRS and RA-GZRS accounts.

Most maintenance operations are transparent to applications and don't require any action from customers. However, you may experience slight increases in latency during maintenance windows as traffic is redistributed across available infrastructure. Applications with built-in retry logic and appropriate timeout configurations will handle these temporary variations automatically.

Microsoft provides advance notification of planned maintenance that may impact service availability through Azure Service Health notifications. For critical workloads, consider implementing monitoring and alerting to track storage account performance during maintenance windows and ensure your applications are performing as expected.

## Service-level agreement

The service-level agreement (SLA) for Azure Blob Storage describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLA for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/).

Azure Blob Storage SLAs vary based on the redundancy configuration and account type you choose. Zone-redundant storage configurations typically provide higher availability guarantees than locally redundant storage due to their resilience against zone-level failures. Geo-redundant configurations may have different SLA terms for read and write operations, especially for read-access configurations that allow reading from the secondary region.

To meet SLA requirements, ensure your storage account is configured with the appropriate redundancy level for your availability needs, implement proper retry logic in your applications to handle transient failures, and monitor storage account health using Azure Monitor metrics and alerts. Applications must also handle HTTP error codes appropriately and avoid patterns that could impact service availability, such as excessive request rates that trigger throttling.

The SLA coverage includes the availability of storage service endpoints but doesn't cover data durability, which is addressed separately through redundancy configurations. Review the specific SLA terms for your chosen redundancy configuration to understand the availability commitments and your responsibilities for maintaining optimal service performance.

### Related content

- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure Blob Storage overview](/azure/storage/blobs/storage-blobs-overview)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Disaster recovery and storage account failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [Use geo-redundancy to design highly available applications](/azure/storage/common/geo-redundant-design)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
- [Monitor Azure Blob Storage](/azure/storage/blobs/monitor-blob-storage)
- [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy)
- [Transient fault guidance](/azure/well-architected/reliability/handle-transient-faults)
- [Manage blob lifecycle](/azure/storage/blobs/lifecycle-management-overview)
- [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions)
