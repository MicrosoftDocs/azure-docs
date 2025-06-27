---
title: Reliability in Azure Queue Storage
description: Learn about reliability in Azure Queue Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-queue-storage
ms.date: 06/27/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Queue Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Queue Storage

Azure Queue Storage is a service for storing large numbers of messages that you can access from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size, and a queue may contain millions of messages, up to the total capacity limit of a storage account. Queue Storage is commonly used to create a backlog of work to process asynchronously and provides reliable message delivery for loosely coupled application architectures.

Azure Queue Storage provides several reliability features through the underlying Azure Storage platform. As part of Azure Storage, Queue Storage inherits the same redundancy options, availability zone support, and geo-replication capabilities that ensure high availability and durability for your message queues. The service automatically handles transient faults and provides built-in retry mechanisms through Azure Storage client libraries, making it well-suited for applications requiring reliable asynchronous message processing.

This article describes reliability and availability zones support in [Azure Queue Storage](/azure/storage/queues/storage-queues-introduction). For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

## Production deployment recommendations

For production environments, enable zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) for your storage accounts that contain Queue Storage resources. ZRS provides higher availability by replicating your data synchronously across three availability zones in the primary region, protecting against availability zone failures. For applications requiring protection against regional outages, use GZRS which combines zone redundancy in the primary region with geo-replication to a secondary region.

Choose the Standard general-purpose v2 storage account type for Queue Storage, as it provides the best balance of features, performance, and cost-effectiveness. Premium storage accounts don't support Queue Storage.

## Reliability architecture overview

Azure Queue Storage operates as a distributed messaging service within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your queue data, with the specific redundancy model depending on your storage account configuration.

When you configure zone-redundant storage (ZRS), Azure Queue Storage maintains three synchronous copies of your queue data across three separate availability zones within a region. Each write operation to a queue must be acknowledged by all three zones before the operation is considered complete, ensuring strong consistency and immediate availability of messages across zones.

For locally redundant storage (LRS), Azure maintains three synchronous copies within a single availability zone, providing protection against node and rack failures but not zone-level outages. The service automatically manages the replica count and placement - you don't need to configure individual queue instances as the storage platform handles redundancy transparently.

When using geo-redundant storage options (GRS/GZRS), Azure asynchronously replicates your queue data to a secondary region paired with your primary region. This replication provides protection against regional disasters while maintaining high performance for operations in the primary region.

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Queue Storage handles transient faults automatically through several mechanisms provided by the Azure Storage platform and client libraries. The service is designed to provide resilient message queuing capabilities even during temporary infrastructure issues.

Azure Queue Storage client libraries include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), and throttling responses (HTTP 429). When your application encounters these transient conditions, the client libraries automatically retry operations using exponential backoff strategies.

To manage transient faults effectively when using Azure Queue Storage:

- **Configure appropriate timeouts** in your Queue Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.
- **Implement circuit breaker patterns** in your application when processing messages from queues to prevent cascading failures when downstream services are experiencing issues.
- **Use visibility timeouts appropriately** when receiving messages to ensure messages become available for retry if your application encounters failures during processing.
- **Monitor for systematic patterns** in transient faults, as persistent throttling errors may indicate the need to implement message batching or distribute load across multiple queues.

For detailed retry policy configuration for different programming languages, see [Implement a retry policy with .NET](/azure/storage/blobs/storage-retry-policy) and [Implement a retry policy with Java](/azure/storage/blobs/storage-retry-policy-java).

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]


Azure Queue Storage supports availability zones through the zone-redundant storage (ZRS) redundancy option available at the storage account level. When you configure a storage account with ZRS, Azure Queue Storage automatically distributes your queue data across three availability zones within the region.

Azure Queue Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your queue data synchronously across three separate availability zones. This configuration ensures that your queues remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Queue Storage resources within that account. You cannot configure individual queues for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from your application.

Azure Queue Storage with ZRS provides automatic failover capabilities between availability zones. If one zone becomes unavailable, the service continues operating using the remaining healthy zones with no data loss, as all writes are synchronously replicated across zones before acknowledgment.

### Region support

Zone-redundant Azure Queue Storage can be deployed in any region that supports availability zones. For the complete list of regions that support availability zones, see [Azure regions with availability zones](./regions-list.md).

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Queue Storage. Premium storage accounts don't support Queue Storage. All storage account tiers and performance levels support ZRS configuration where availability zones are available.

## Considerations

During an availability zone outage, your Queue Storage operations continue normally through the remaining healthy zones. However, there may be brief periods of reduced performance as the service redistributes load across the available zones. Applications should be designed to handle potential message processing delays during zone failover scenarios.

When designing queue-based architectures with zone redundancy, consider implementing message deduplication logic in your consumers, as zone failover scenarios may occasionally result in duplicate message delivery during the transition period.

### Cost

Enabling zone-redundant storage (ZRS) for your storage account incurs additional costs compared to locally redundant storage (LRS). ZRS pricing is approximately 25% higher than LRS. For current pricing information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure availability zone support

- **Create**. Configure zone-redundant storage when creating a new storage account through the [Azure portal](/azure/storage/common/storage-account-create), [Azure CLI](/azure/storage/common/storage-account-create), [Azure PowerShell](/azure/storage/common/storage-account-create), or [Bicep/ARM templates](/azure/storage/common/storage-account-create).
- **Migrate**. Convert existing storage accounts from LRS to ZRS using [Azure Storage live migration](/azure/storage/common/redundancy-migration) or by recreating the storage account with ZRS configuration.
- **Disable**. You cannot disable zone redundancy for a storage account after it's enabled. To move from ZRS to LRS, you must recreate the storage account and migrate your data.

### Normal operations

This section describes what to expect when a queue storage account is configured for zone redundancy and all availability zones are operational.

**Traffic routing between zones**: Azure Queue Storage with ZRS uses an active/active configuration where queue operations are automatically distributed across all available zones. The service routes requests to the zone that can provide the fastest response while maintaining strong consistency across all replicas.

**Data replication between zones**: Queue data is replicated synchronously across all three availability zones. When you send a message to a queue, the operation completes only after all three zone replicas have successfully acknowledged the write. This synchronous replication ensures no data loss during zone failures but may introduce slight latency compared to single-zone deployments.

### Zone-down experience

When an availability zone becomes unavailable, Azure Queue Storage automatically handles the failover process with the following behavior:

- **Detection and response**: Microsoft automatically detects zone failures and initiates failover to remaining healthy zones. No customer action is required for zone-level failover as the service handles this transparently.
- **Notification**: Zone-level failures don't generate specific customer notifications, as the service continues operating normally. You can monitor Azure Service Health and Azure Monitor for any impact notifications.
- **Active requests**: In-flight queue operations are automatically retried against healthy zones. Most requests complete successfully with minimal delay, though some may experience increased latency during the transition.
- **Expected data loss**: No data loss occurs during zone failures because Azure Queue Storage uses synchronous replication across zones. All acknowledged write operations are guaranteed to be available in the remaining zones.
- **Expected downtime**: Typically no downtime occurs as the service automatically routes traffic to healthy zones. Applications may experience brief increases in latency (typically seconds) as the service adjusts load distribution.
- **Traffic rerouting**: Azure automatically routes all queue operations to the remaining healthy availability zones. The service balances requests across the available zones to maintain optimal performance.

### Failback

When the failed availability zone recovers, Azure Queue Storage automatically begins using it again for new operations. The service gradually rebalances traffic across all three zones to restore optimal performance and redundancy.

During failback, the service ensures data consistency by synchronizing any operations that occurred during the outage period. This process is typically completed within minutes and doesn't require any customer intervention or configuration changes.

### Testing for zone failures

Azure Queue Storage is a fully managed service where zone redundancy is handled automatically by the Azure platform. You don't need to initiate manual tests for zone failures, as Microsoft continuously validates the service's resilience through internal testing and monitoring.

You can verify your application's resilience to increased latency by implementing load testing that simulates varying response times from Queue Storage operations. This helps ensure your queue consumers can handle the brief performance impacts that may occur during zone transitions.

## Multi-region support

Azure Queue Storage supports multi-region deployments through geo-redundant storage configurations at the storage account level. The service provides both geo-redundant storage (GRS) and geo-zone-redundant storage (GZRS) options, which automatically replicate your queue data to a secondary region using Azure paired regions.

With geo-redundant configurations, Azure Queue Storage asynchronously replicates your queue data to a secondary region that is hundreds of miles away from the primary region. GRS uses locally redundant storage in both regions, while GZRS combines zone-redundant storage in the primary region with locally redundant storage in the secondary region. Both configurations provide read-access options (RA-GRS and RA-GZRS) that allow read operations from the secondary region during primary region outages.

The geo-replication process is automatic and managed entirely by Microsoft. Queue data is first committed in the primary region, then asynchronously replicated to the secondary region. The replication typically occurs within 15 minutes, though Azure doesn't provide an SLA for replication timing.

### Region support

Azure Queue Storage geo-redundant configurations use Azure paired regions for secondary region replication. The secondary region is automatically determined based on your primary region selection and cannot be customized. For a complete list of Azure paired regions, see [Azure paired regions](/azure/reliability/cross-region-replication-azure#azure-paired-regions).

### Requirements

All storage account types that support Queue Storage (Standard general-purpose v2) support geo-redundant configurations. No special SKU or configuration is required beyond selecting GRS, RA-GRS, GZRS, or RA-GZRS as your redundancy option.

### Considerations

During normal operations, all queue write operations occur in the primary region. Read-access geo-redundant configurations (RA-GRS/RA-GZRS) allow read operations from queues in the secondary region, but you cannot write messages to queues in the secondary region until a failover occurs.

Applications using read-access configurations should be designed to handle eventual consistency between regions, as there may be a delay between when messages are written in the primary region and when they become available for reading in the secondary region.

### Cost

Geo-redundant storage configurations incur additional costs for data replication and storage in the secondary region. GRS and GZRS typically cost approximately twice as much as their single-region equivalents (LRS and ZRS). For current pricing information, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

### Configure multi-region support

- **Create**: Configure geo-redundant storage when creating a new storage account through the [Azure portal](/azure/storage/common/storage-account-create), specifying GRS, RA-GRS, GZRS, or RA-GZRS as your redundancy option.
- **Migrate**: Convert existing storage accounts to geo-redundant configurations using [Azure Storage live migration](/azure/storage/common/redundancy-migration) for supported conversion paths.

Note: Some redundancy conversions may require recreating the storage account and migrating data if live migration isn't supported for your specific conversion path.

### Normal operations

**Traffic routing between regions**: Azure Queue Storage geo-redundant configurations use an active/passive model where all write operations are directed to the primary region. With read-access configurations, applications can read from either region, but writes are always processed in the primary region.

**Data replication between regions**: Queue data is replicated asynchronously from the primary to secondary region. Write operations are acknowledged after being committed in the primary region, then the data is replicated to the secondary region in the background. This asynchronous approach minimizes latency for primary region operations while providing regional protection.

### Region-down experience

Azure Queue Storage supports both Microsoft-managed and customer-managed failover scenarios for regional outages:

**Microsoft-managed failover**: In rare cases of prolonged primary region outages, Microsoft may initiate automatic failover to the secondary region. This process typically occurs only when the primary region is expected to be unavailable for an extended period.

- **Detection and response**: Microsoft monitors regional health and initiates automatic failover based on predefined criteria for service restoration time.
- **Notification**: Microsoft provides advance notification when possible through Azure Service Health and direct customer communications.
- **Active requests**: In-flight operations to the primary region fail and must be retried. Applications should implement retry logic to handle these scenarios.
- **Expected data loss**: Data loss may occur up to the Recovery Point Objective (RPO), typically less than 15 minutes, as replication is asynchronous.
- **Expected downtime**: Downtime varies but typically lasts several hours during the failover process and DNS propagation.
- **Traffic rerouting**: Microsoft updates DNS entries to redirect traffic to the secondary region, which becomes the new primary region.

**Customer-managed failover**: You can initiate manual failover to the secondary region using Azure management tools when the primary region is unavailable.

- **Detection and response**: You must monitor primary region availability and decide when to initiate failover based on your business requirements.
- **Notification**: You control the timing and communication of failover to your organization and users.
- **Active requests**: Operations in progress during failover initiation will fail and require retry to the new primary region.
- **Expected data loss**: Potential data loss up to the RPO, as any data not yet replicated to the secondary region will be lost.
- **Expected downtime**: Failover process typically takes 15-60 minutes to complete, depending on the size of your data and current service load.
- **Traffic rerouting**: You must update your applications to use new storage endpoints after failover completes.

### Failback

**Microsoft-managed failover failback**: When the original primary region recovers, Microsoft may choose to fail back to restore the original configuration. This process is managed automatically with advance notification to customers.

**Customer-managed failover failback**: You can initiate failback to the original primary region after it recovers by performing another customer-managed failover. Consider the following:

- **Data synchronization**: Ensure you understand any data created in the secondary region during the outage period before initiating failback.
- **Application updates**: Update application configurations to use the original primary region endpoints.
- **Timing considerations**: Plan failback during maintenance windows to minimize impact on applications and users.
- **Testing requirements**: Verify application functionality and data integrity after completing failback operations.

### Testing for region failures

You can simulate regional outages by using Azure Chaos Studio to inject storage account unavailability faults. This allows you to test your application's ability to handle primary region failures and failover scenarios.

Regularly test your disaster recovery procedures by performing customer-managed failover operations in non-production environments to ensure your applications and operational procedures work correctly during actual outages.

### Alternative multi-region approaches

If you need more control over regional deployment or want to implement active/active patterns, you can deploy separate Azure Queue Storage resources in multiple regions and implement application-level logic to distribute messages across regions.

This approach requires you to manage message distribution, handle data synchronization, and implement custom failover logic. Consider the following patterns from the Azure Architecture Center:

- [Multi-region load balancing with Traffic Manager](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Highly available multi-region web application](/azure/architecture/web-apps/app-service/architectures/multi-region)

## Backups

Azure Queue Storage doesn't provide traditional backup capabilities like point-in-time restore, as queues are designed for transient message storage rather than long-term data persistence. Messages are typically processed and removed from queues during normal application operations.

For scenarios requiring message durability beyond the built-in redundancy options, consider implementing application-level message logging or persistence to Azure Blob Storage or Azure SQL Database. This approach allows you to maintain message history while using Queue Storage for its intended purpose of temporary message buffering and processing coordination.

The geo-redundant storage options (GRS/GZRS) provide protection against regional disasters and serve as the primary backup mechanism for Queue Storage by maintaining copies of your queue data in a secondary region.

## Service-level agreement

The service-level agreement (SLA) for Azure Queue Storage describes the expected availability of the service and the conditions that must be met to achieve that availability expectation. The availability SLA you'll be eligible for depends on the storage tier and the replication type you use. For more information, review the [Service Level Agreements (SLA) for Online Services](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services).

## Related content

- [What is Azure Queue Storage?](/azure/storage/queues/storage-queues-introduction)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
