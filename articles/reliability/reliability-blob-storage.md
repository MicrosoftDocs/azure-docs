---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 05/29/2025
ms.update-cycle: 180-days
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is a massively scalable and secure object storage service for cloud-native workloads, archives, data lakes, high-performance computing, and machine learning. The service provides built-in reliability features including multiple redundancy options, availability zone support, and cross-region disaster recovery capabilities to ensure your data remains highly available and durable.

Azure Blob Storage supports both regional resiliency through availability zones and cross-region resiliency through geo-redundant storage configurations. The service automatically handles data replication and provides options for both zone-redundant and geo-redundant deployments to meet various reliability requirements.

This article describes reliability and availability zones support in [Azure Blob Storage](/azure/storage/blobs/). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

For production workloads, deploy Azure Blob Storage with zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) to ensure high availability and data durability. Use Standard general-purpose v2 storage accounts, which provide the best balance of features, performance, and cost for most scenarios.

Enable geo-redundant configurations (GRS, GZRS, RA-GRS, or RA-GZRS) for business-critical applications that require protection against regional disasters. For maximum availability and durability, choose RA-GZRS, which combines zone redundancy in the primary region with geo-redundancy and read access to the secondary region.

Configure additional data protection features including blob versioning, soft delete, and point-in-time restore to protect against accidental deletion or corruption. Implement proper access controls using Azure Active Directory authentication and disable shared key access when possible.

## Reliability architecture overview

Azure Blob Storage provides multiple levels of redundancy to ensure data availability and durability. The service automatically maintains multiple copies of your data within the primary region and optionally across regions, depending on your chosen redundancy configuration.

Within the primary region, data can be replicated using locally redundant storage (LRS) across multiple availability zones with zone-redundant storage (ZRS). LRS stores three copies within a single datacenter, while ZRS synchronously replicates data across multiple availability zones within the region, providing protection against datacenter-level failures.

For cross-region protection, geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) asynchronously replicate data to a secondary region that is hundreds of miles away from the primary region. The secondary region is determined by Azure paired regions and cannot be changed by customers. Read-access variants (RA-GRS and RA-GZRS) provide read-only access to data in the secondary region during normal operations.

Azure Blob Storage handles all replication processes automatically without requiring customer intervention. The service manages instance counts, load balancing, and failover processes internally, ensuring consistent performance and availability across all redundancy configurations.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Blob Storage is designed to handle transient faults automatically through built-in retry mechanisms and robust error handling. The storage service includes automatic retry logic for most transient failures, including network timeouts, service throttling, and temporary service unavailability.

Implement exponential backoff retry policies in your applications when calling Azure Blob Storage APIs to handle transient errors gracefully. Configure appropriate timeout values and maximum retry attempts based on your application requirements and expected network conditions.

Use the Azure Storage client libraries, which include built-in retry policies optimized for storage operations. These libraries automatically handle common transient failures such as HTTP 500, 502, 503, and 504 status codes, as well as network connectivity issues.

Monitor storage operation latencies and error rates to identify potential issues before they impact your applications. Configure alerts for elevated error rates or unusual latency patterns that might indicate underlying problems.

For applications with strict latency requirements, consider implementing circuit breaker patterns to prevent cascading failures when storage operations are experiencing persistent issues. This approach helps maintain application responsiveness during extended outages.

Design your applications to gracefully degrade functionality when storage operations fail, such as using cached data or alternative data sources when primary blob storage is temporarily unavailable.

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Blob Storage supports availability zones through zone-redundant storage (ZRS), which provides a zone-redundant deployment model. With ZRS, Azure Blob Storage automatically replicates your data synchronously across multiple availability zones within the primary region, providing protection against datacenter-level failures while maintaining high availability and durability.

The service uses a zone-redundant architecture where data is distributed across multiple zones automatically by the Azure platform. You cannot pin Azure Blob Storage to a specific availability zone, as it only supports zone-redundant deployments. This ensures that your data remains available even if one availability zone experiences an outage.

When you configure a storage account with ZRS, the service automatically spreads your data across multiple availability zones in the region without requiring any additional configuration. All write operations are committed synchronously across multiple zones before being acknowledged as successful, ensuring data consistency and durability.

### Region support

Zone-redundant storage for Azure Blob Storage is available in all regions that support availability zones. For the complete list of regions that support availability zones, see [Azure regions with availability zones](/azure/reliability/availability-zones-region-support).

Storage accounts configured with ZRS can be deployed in any region that supports availability zones without restrictions. The service automatically uses all available zones in the region for data replication.

### Requirements

Zone-redundant storage is available for Standard general-purpose v2 storage accounts and requires the following:

- A supported Azure region with multiple availability zones
- Standard performance tier (ZRS is not available for premium block blob storage accounts)
- General-purpose v2 storage account type

All Azure Storage services (Blob, File, Table, and Queue) within a ZRS-configured storage account benefit from zone redundancy. The redundancy setting applies to the entire storage account and cannot be configured per service.

### Considerations

Zone-redundant storage provides enhanced durability and availability compared to locally redundant storage, but at a higher cost. Consider ZRS for production workloads that require high availability and can tolerate the additional storage costs.

Data transfer charges may apply when accessing ZRS storage accounts, as requests might be served from different availability zones. However, this typically has minimal impact on overall costs for most workloads.

ZRS provides protection against zone-level failures but does not protect against regional disasters. For regional disaster protection, consider geo-zone-redundant storage (GZRS) or read-access geo-zone-redundant storage (RA-GZRS).

### Cost

Zone-redundant storage is priced higher than locally redundant storage due to the additional replication across multiple availability zones. The exact pricing varies by region and service tier. For current pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

There are no additional charges for data replication between availability zones within the same region. However, requests served from different zones than your application may incur minimal additional latency.

### Configure availability zone support

To deploy a new storage account with zone-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select Zone-redundant storage (ZRS) as the redundancy option.

To migrate an existing storage account to zone-redundant storage, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration). Note that live migration from LRS to ZRS is available through Microsoft support, while manual migration requires creating a new ZRS storage account and copying data.

You cannot disable zone redundancy after enabling it on a storage account. To change from ZRS to another redundancy option, you must create a new storage account and migrate your data.

### Capacity planning and management

Zone-redundant storage automatically handles capacity distribution across multiple availability zones without requiring additional planning. The service manages capacity allocation internally to ensure optimal performance and availability across all zones.

Consider implementing monitoring for storage capacity and performance metrics to ensure adequate capacity during zone failures when traffic might be concentrated on fewer zones. While Azure automatically handles zone distribution, monitoring helps identify potential capacity constraints.

### Normal operations

**Traffic routing between zones**: Azure Blob Storage with ZRS uses an active/active configuration where requests are automatically distributed across instances in multiple availability zones. The service load balances requests across healthy zones to optimize performance and ensure even utilization.

**Data replication between zones**: All write operations to ZRS storage accounts are replicated synchronously across multiple availability zones in the primary region. A write operation is only acknowledged as successful after the data is committed to storage in multiple zones, ensuring immediate consistency and durability across zones.

### Zone-down experience

During an availability zone outage, Azure Blob Storage with ZRS continues to operate without intervention:

| Aspect | Details |
|--------|---------|
| **Detection and response** | Microsoft automatically detects zone failures and reroutes traffic to healthy zones without customer intervention |
| **Notification** | Azure Service Health provides notifications about zone outages. Configure alerts through Azure Monitor for proactive monitoring |
| **Active requests** | In-flight requests may experience brief delays as traffic is rerouted to healthy zones. Most requests complete successfully |
| **Expected data loss** | No data loss occurs due to synchronous replication across multiple zones |
| **Expected downtime** | No downtime expected. Service continues operating normally using healthy zones |
| **Traffic rerouting** | Azure automatically reroutes all traffic to healthy availability zones within seconds of detecting a zone failure |

Applications should implement retry logic with exponential backoff to handle any temporary network issues during zone transitions.

### Failback

When an availability zone recovers, Azure Blob Storage automatically restores normal operations across all zones. The service gradually redistributes traffic to include the recovered zone, ensuring balanced load distribution.

No customer action is required during failback. The process is transparent to applications, and data consistency is maintained throughout the recovery process. Azure manages the reintegration of the recovered zone automatically.

### Testing for zone failures

Azure Blob Storage is a fully managed service where zone-level redundancy and failover are handled automatically by the Azure platform. You don't need to initiate zone failover tests as the service is designed to operate transparently during zone outages.

For comprehensive disaster recovery testing, focus on application-level resilience by testing retry logic, timeout handling, and error recovery mechanisms in your applications that use Blob Storage. Use Azure Chaos Studio to test application behavior during simulated storage service disruptions.

## Multi-region support

Azure Blob Storage provides native multi-region support through geo-redundant storage configurations that use Azure paired regions. The service offers several geo-redundant options including geo-redundant storage (GRS), read-access geo-redundant storage (RA-GRS), geo-zone-redundant storage (GZRS), and read-access geo-zone-redundant storage (RA-GZRS).

All geo-redundant configurations automatically replicate data to a secondary region determined by Azure paired regions. You cannot select a custom secondary region - the secondary region is automatically assigned based on the primary region selection according to Azure's regional pairing strategy.

Geo-redundant storage provides protection against regional disasters by maintaining copies of your data in a secondary region that is hundreds of miles away from the primary region. Data is replicated asynchronously to the secondary region, providing durability against complete regional outages.

### Region support

Geo-redundant storage configurations are available in all Azure regions that support paired regions. The secondary region for geo-redundant replication is automatically determined based on the primary region selection.

For a complete list of Azure paired regions and their geographic relationships, see [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions). Storage accounts with geo-redundant configurations cannot change their paired secondary region.

### Requirements

Geo-redundant storage is available for Standard general-purpose v2 storage accounts and supports the following configurations:

- **GRS**: Geo-redundant storage with locally redundant storage in both primary and secondary regions
- **RA-GRS**: Read-access geo-redundant storage providing read access to the secondary region
- **GZRS**: Geo-zone-redundant storage combining ZRS in primary region with LRS in secondary region  
- **RA-GZRS**: Read-access geo-zone-redundant storage with read access to secondary region

All storage services (Blob, File, Table, and Queue) within a geo-redundant storage account are replicated to the secondary region. Premium storage account types do not support geo-redundant configurations.

### Considerations

Geo-redundant storage replicates data asynchronously to the secondary region, which means there may be a recovery point objective (RPO) of up to 15 minutes in case of primary region failure. Applications must be designed to handle potential data loss during regional disasters.

Read-access variants (RA-GRS and RA-GZRS) provide read-only access to data in the secondary region during normal operations. This allows applications to implement disaster recovery patterns by reading from the secondary region when the primary region is unavailable.

Customer-managed failover is available for geo-redundant storage accounts, allowing you to initiate failover to the secondary region during outages. However, failover changes the endpoints for your storage account and may require application updates.

### Cost

Geo-redundant storage configurations are priced higher than single-region options due to cross-region data replication and storage in multiple regions. You are charged for storage capacity in both the primary and secondary regions.

Data egress charges may apply for read operations from the secondary region, especially for RA-GRS and RA-GZRS configurations. For current pricing information, see [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure multi-region support

To deploy a new storage account with geo-redundant storage, see [Create a storage account](/azure/storage/common/storage-account-create) and select the appropriate geo-redundant redundancy option (GRS, RA-GRS, GZRS, or RA-GZRS).

To enable geo-redundant storage for an existing storage account, see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration). Note that migration to geo-redundant configurations may take time to complete initial synchronization to the secondary region.

You cannot disable geo-redundancy instantly due to the data synchronization requirements. To change from geo-redundant to single-region storage, you must modify the redundancy configuration and wait for the change to complete.

### Capacity planning and management

Geo-redundant storage automatically manages capacity in both primary and secondary regions. Consider the additional storage costs when planning capacity, as you are charged for storage in both regions.

Monitor replication lag between primary and secondary regions using Azure Monitor metrics to ensure your RPO requirements are met. Plan for potential increased load on the secondary region during primary region outages for RA-GRS and RA-GZRS configurations.

### Normal operations

**Traffic routing between regions**: Geo-redundant storage operates in an active/passive configuration where all write operations are directed to the primary region. Read operations can be served from the secondary region only for RA-GRS and RA-GZRS configurations when explicitly accessing secondary endpoints.

**Data replication between regions**: Data is replicated asynchronously from the primary region to the secondary region. Write operations are committed in the primary region first, then replicated to the secondary region with typical replication lag of less than 15 minutes under normal conditions.

### Region-down experience

During a primary region outage, the behavior depends on your storage configuration and the type of failover that occurs:

**Microsoft-managed failover**: For widespread regional disasters, Microsoft may initiate a service-managed failover automatically:

| Aspect | Details |
|--------|---------|
| **Detection and response** | Microsoft automatically detects widespread regional failures and initiates service-managed failover when appropriate |
| **Notification** | Azure Service Health provides notifications about regional outages and Microsoft-managed failover actions |
| **Active requests** | Requests to primary region fail during outage. RA-GRS/RA-GZRS allow continued read access from secondary region |
| **Expected data loss** | Potential data loss up to 15 minutes (RPO) due to asynchronous replication |
| **Expected downtime** | Microsoft manages the failover process with minimal downtime once the decision is made |
| **Traffic rerouting** | Microsoft automatically updates DNS and endpoints to route traffic to the secondary region |
| **Customer action required** | No customer action required - Microsoft manages the entire process |

**Customer-managed failover**: Customers can also initiate failover manually through Azure management tools:

| Aspect | Details |
|--------|---------|
| **Detection and response** | Customer must detect the outage and decide to initiate failover through Azure portal, PowerShell, Azure CLI, or REST APIs |
| **Notification** | Azure Service Health provides notifications about regional outages. Customer monitors and decides when to failover |
| **Active requests** | Requests to primary region fail during outage. RA-GRS/RA-GZRS allow continued read access from secondary region |
| **Expected data loss** | Potential data loss up to 15 minutes (RPO) due to asynchronous replication, plus any additional delay if customer waits to initiate failover |
| **Expected downtime** | Downtime until customer initiates failover and the process completes (typically 1-2 hours for customer-managed failover) |
| **Traffic rerouting** | Customer must update application endpoints to use secondary region endpoints after failover completes |
| **Customer action required** | Customer must initiate failover, monitor completion, and update application configurations |

### Failback

The failback process differs depending on whether the original failover was Microsoft-managed or customer-managed:

**Microsoft-managed failover failback**: When Microsoft performs a service-managed failover due to a regional disaster, Microsoft also manages the failback process once the original region recovers. This process is automatic and transparent to customers, with no action required. Microsoft ensures data consistency and manages the transition back to the original primary region.

**Customer-managed failover failback**: When you initiate a customer-managed failover, you must also initiate the failback process when the original region recovers. This involves:

1. Verifying that the original primary region is fully operational
2. Ensuring data consistency between regions
3. Initiating failback through the Azure portal, PowerShell, Azure CLI, or REST APIs
4. Updating application endpoints to use the original primary region endpoints
5. Monitoring the failback completion and verifying service functionality

**Important considerations for customer-managed failback**:
- Data may be lost during failback if writes occurred in the temporary primary region that haven't replicated back to the original primary region
- The failback process can take time to complete depending on the amount of data that needs to be synchronized
- Applications should be tested thoroughly after failback to ensure proper functionality
- Consider the timing of failback operations to minimize impact on business operations

### Testing for region failures

You can test regional failover scenarios using customer-managed failover capabilities. Regularly test failover procedures to ensure your applications can handle regional disasters effectively.

For comprehensive testing, use Azure Chaos Studio to simulate regional outages and validate your application's disaster recovery capabilities. Focus on testing endpoint updates, data consistency validation, and failback procedures.

### Alternative multi-region approaches

If you need additional control over multi-region deployments beyond the paired region model, consider deploying separate storage accounts in different regions with application-level data synchronization.

For applications requiring active/active multi-region configurations, you can implement cross-region replication using Azure Data Factory, Azure Logic Apps, or custom replication solutions. This approach provides more flexibility in region selection but requires additional management overhead.

For reference architectures that illustrate multi-region storage patterns, see:

- [Multi-region web application](/azure/architecture/web-apps/app-service/architectures/multi-region)
- [Highly available multi-region applications](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)

## Backups

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [What are redundancy, replication, and backup?](/azure/reliability/concept-redundancy-replication-backup).

Azure Blob Storage provides several built-in data protection features that serve as backup mechanisms. These features are fully managed by Azure and provide protection against accidental deletion, corruption, and other data loss scenarios.

**Point-in-time restore** allows you to restore block blob data to a previous state within a specified time window (up to 365 days). This feature protects against accidental deletion or corruption of blob data and operates at the storage account level.

**Blob versioning** automatically maintains previous versions of blobs when they are modified or deleted. Versions are preserved according to your configured retention policy and can be accessed and restored as needed.

**Soft delete** for blobs and containers provides a configurable retention period during which deleted items can be recovered. Soft delete protects against accidental deletion and maintains deleted items in a recoverable state.

These backup features are stored within the same region as your primary data. For cross-region backup protection, combine these features with geo-redundant storage configurations or implement application-level backup solutions to separate regions.

## Reliability during service maintenance

Azure Blob Storage is designed to maintain high availability during planned maintenance activities. The service uses rolling updates and redundant infrastructure to ensure that maintenance operations do not impact data availability or durability.

During maintenance activities, Azure Blob Storage automatically distributes requests across healthy storage infrastructure. For zone-redundant and geo-redundant configurations, maintenance is performed in a rolling fashion across zones and regions to maintain service availability.

No special configuration is required to maintain reliability during service maintenance. The service automatically handles load balancing and ensures that sufficient capacity is available even during maintenance operations.

Azure provides advance notification of planned maintenance through Azure Service Health when maintenance might impact service availability. Configure Service Health alerts to stay informed about planned maintenance activities that might affect your storage accounts.

## Service-level agreement

The service-level agreement (SLA) for Azure Blob Storage describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. For more information, see [SLA for Azure Storage](https://azure.microsoft.com/support/legal/sla/storage/).

To meet the SLA requirements, storage accounts must be properly configured with appropriate redundancy levels and accessed using supported APIs and protocols. The SLA varies based on the redundancy configuration, with higher availability guarantees for zone-redundant and geo-redundant configurations.

Applications must implement proper retry logic and error handling to qualify for SLA coverage. The SLA covers storage service availability but does not cover application-level issues or network connectivity problems outside of Azure's control.

Monitor your storage account availability and performance metrics to ensure you are meeting the expected service levels. Use Azure Monitor to track availability metrics and configure alerts for any degradation in service performance.

## Related content

- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure Storage disaster recovery planning](/azure/storage/common/storage-disaster-recovery-guidance)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Change how a storage account is replicated](/azure/storage/common/redundancy-migration)
- [Azure paired regions](/azure/reliability/cross-region-replication-azure)
- [Transient fault guidance](/azure/well-architected/reliability/handle-transient-faults)