---
title: Reliability in Azure Queue Storage
description: Learn about reliability in Azure Queue Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-queue-storage
ms.date: 07/01/2025
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Queue Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Queue Storage

[Azure Queue Storage](/azure/storage/queues/storage-queues-introduction) is a service for storing large numbers of messages that you can access from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size, and a queue may contain millions of messages, up to the total capacity limit of a storage account. Queue Storage is commonly used to create a backlog of work to process asynchronously and provides reliable message delivery for loosely coupled application architectures.

Azure Queue Storage provides several reliability features through the underlying Azure Storage platform. As part of Azure Storage, Queue Storage inherits the same redundancy options, availability zone support, and geo-replication capabilities that ensure high availability and durability for your message queues. 

This article describes reliability and availability zones support in Azure Queue Storage For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/reliability/overview).

<!-- Anastasia - I think we should add something like this to each of the Azure Storage guides that use the include files: -->
> [!NOTE]
> Azure Queue Storage is part of the Azure Storage platform. Some of the capabilities of Queue Storage are common across many Azure Storage services. In this document, we use "Azure Storage" to indicate these common capabilities.

## Production deployment recommendations

For production environments:

- Enable zone-redundant storage (ZRS) or geo-zone-redundant storage (GZRS) in paired regions for the storage accounts that contain Queue Storage resources. 

    - ZRS provides higher availability by replicating your data synchronously across three availability zones in the primary region, protecting against availability zone failures. 
    - GZRS provides protection against regional outages, using GZRS which combines zone redundancy in the primary region with geo-replication to a secondary region.

- Choose the Standard general-purpose v2 storage account type for Queue Storage, as it provides the best balance of features, performance, and cost-effectiveness. Premium storage accounts don't support Queue Storage.

**Source:** [Azure Storage redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy) and [Resiliency checklist for specific Azure services](https://learn.microsoft.com/azure/architecture/checklist/resiliency-per-service#storage)

## Reliability architecture overview

Azure Queue Storage operates as a distributed messaging service within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your queue data, with the specific redundancy model depending on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

Azure Queue Storage handles transient faults automatically through several mechanisms provided by the Azure Storage platform and client libraries. The service is designed to provide resilient message queuing capabilities even during temporary infrastructure issues.

Azure Queue Storage client libraries include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), and throttling responses (HTTP 429). When your application encounters these transient conditions, the client libraries automatically retry operations using exponential backoff strategies.

To manage transient faults effectively when using Azure Queue Storage:

- **Configure appropriate timeouts** in your Queue Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.
- **Implement circuit breaker patterns** in your application when processing messages from queues to prevent cascading failures when downstream services are experiencing issues.
- **Use visibility timeouts appropriately** when receiving messages to ensure messages become available for retry if your application encounters failures during processing.

**Source:** [Performance and scalability checklist for Queue Storage](https://learn.microsoft.com/azure/storage/queues/storage-performance-checklist) and [Transient fault handling](https://learn.microsoft.com/azure/architecture/best-practices/transient-faults)

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Azure Queue Storage is zone-redundant when deployed with ZRS configuration, meaning the service spreads replicas of your queue data synchronously across three separate availability zones. This configuration ensures that your queues remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before completing, providing strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Queue Storage resources within that account. You cannot configure individual queues for different redundancy levels - the setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

Zone-redundant Azure Queue Storage can be deployed [in any region that supports availability zones](./regions-list.md).

### Requirements

You must use a Standard general-purpose v2 storage account to enable zone-redundant storage for Queue Storage. Premium storage accounts don't support Queue Storage. All storage account tiers and performance levels support ZRS configuration where availability zones are available.

**Source:** [Azure Storage redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy)

### Cost

When you enable ZRS, you're charged at a different rate than locally redundant storage due to the additional replication and storage overhead. For detailed pricing information, see [Azure Queues pricing](https://azure.microsoft.com/pricing/details/storage/queues/).

### Configure availability zone support

- **Create a storage account and queue with zone redundancy:**

    1. [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage(GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation

    1. [Create an Azure queue storage](/azure/storage/queues/storage-quickstart-queues-portal).

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Normal operations

This section describes what to expect when a queue storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Zone-down experience

When an availability zone becomes unavailable, Azure Queue Storage automatically handles the failover process with the following behavior:

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

### Failback

When the failed availability zone recovers, Azure Queue Storage automatically begins using it again for new operations. The service gradually rebalances traffic across all three zones to restore optimal performance and redundancy.

During failback, the service ensures data consistency by synchronizing any operations that occurred during the outage period. This process is typically completed within minutes and doesn't require any customer intervention or configuration changes.

<!-- John: There is a bit more info here than in the Storage Blob page. Do we want to remove it or add to storage blob?--> TODO

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
<!-- TODO verify this is true for queues -->

### Considerations

<!-- TODO verify this is true for queues -->

When implementing multi-region Azure Queue Storage, consider the following important factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Secondary region access (read access)](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

### Cost

Multi-region Azure Queue Storage configurations incur additional costs for cross-region replication and storage in the secondary region. Data transfer between Azure regions is charged based on standard inter-region bandwidth rates. For detailed pricing information, see [Azure Queue Storage pricing](https://azure.microsoft.com/pricing/details/storage/Queue/).

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

[!INCLUDE [Storage - Alternative multi-region approaches - reasons](includes/storage/reliability-storage-multi-region-alternative-reasons-include.md)]

<!-- TODO mention Service Bus? -->

[!INCLUDE [Storage - Alternative multi-region approaches - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

This approach requires you to manage message distribution, handle data synchronization, and implement custom failover logic. Consider the following patterns from the Azure Architecture Center:

<!-- John - these may be useful - but they aren't specific to Azure Queue Storage --> 
- [Multi-region load balancing with Traffic Manager](/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway)
- [Highly available multi-region web application](/azure/architecture/web-apps/app-service/architectures/multi-region)

**Source:** [Multi-region load balancing with Traffic Manager](https://learn.microsoft.com/azure/architecture/high-availability/reference-architecture-traffic-manager-application-gateway) and [Highly available multi-region web application](https://learn.microsoft.com/azure/architecture/web-apps/app-service/architectures/multi-region)

## Backups

Azure Queue Storage doesn't provide traditional backup capabilities like point-in-time restore, as queues are designed for transient message storage rather than long-term data persistence. Messages are typically processed and removed from queues during normal application operations.

For scenarios requiring message durability beyond the built-in redundancy options, consider implementing application-level message logging or persistence to Azure Blob Storage or Azure SQL Database. This approach allows you to maintain message history while using Queue Storage for its intended purpose of temporary message buffering and processing coordination.

The geo-redundant storage options (GRS/GZRS) provide protection against regional disasters and serve as the primary backup mechanism for Queue Storage by maintaining copies of your queue data in a secondary region.

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [What is Azure Queue Storage?](/azure/storage/queues/storage-queues-introduction)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
