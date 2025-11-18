---
title: Reliability in Azure Queue Storage
description: Learn about resiliency in Azure Queue Storage, including resilience to transient faults, availability zone failures, and region failures.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-queue-storage
ms.date: 11/03/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Queue Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Queue Storage

[Azure Queue Storage](/azure/storage/queues/storage-queues-introduction) is a service for storing and distributing large numbers of messages. Queue Storage is commonly used to create a backlog of work to process asynchronously. It provides reliable message delivery for loosely coupled application architectures. A queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account.

[!INCLUDE [Shared responsibility](includes/reliability-shared-responsibility-include.md)]

This article describes how to make Queue Storage resilient to a variety of potential outages and problems, including transient faults, availability zone outages, and region outages. It also describes how you can use backups to recover from other types of problems, and highlights some key information about the Queue Storage service level agreement (SLA).

> [!NOTE]
> Queue Storage is part of the Azure Storage platform. Some of the capabilities of Queue Storage are common across many Azure Storage services.

## Production deployment recommendations

For production environments:

- Enable zone-redundant storage (ZRS) for the storage accounts that contain Queue Storage resources. ZRS provides higher availability by replicating your data synchronously across multiple availability zones in the primary region. Higher availability helps protect your storage accounts from availability zone failures.

- If you need resilience to region outages and your storage account's primary region is paired, consider enabling geo-redundant storage (GRS). GRS replicates data asynchronously to the paired region. In supported regions, you can combine geo-redundancy with zone redundancy by using geo-zone-redundant storage (GZRS).

For advanced messaging requirements, consider using Azure Service Bus. To learn about the differences between Queue Storage and Service Bus, see [Compare Azure Storage queues and Service Bus queues](/azure/service-bus-messaging/service-bus-azure-and-service-bus-queues-compared-contrasted).

## Reliability architecture overview

Queue Storage operates as a distributed messaging service within the Azure Storage platform infrastructure. The service provides redundancy through multiple copies of your queue and message data. The specific redundancy model depends on your storage account configuration.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Resilience to transient faults

[!INCLUDE [Resilience to transient faults](includes/reliability-transient-fault-description-include.md)]

Queue Storage is commonly used in applications to help them handle transient faults in other components. By using asynchronous messaging with a service like Queue Storage, applications can recover from transient faults by reprocessing messages at a later time. To learn more, see [Asynchronous Messaging Primer](/previous-versions/msp-n-p/dn589781(v=pandp.10)).

Within the service itself, Queue Storage handles transient faults automatically by using several mechanisms that the Azure Storage platform and client libraries provide. The service is designed to provide resilient message queuing capabilities even during temporary infrastructure problems.

Queue Storage client libraries include built-in retry policies that automatically handle common transient failures such as network timeouts, temporary service unavailability (HTTP 503), and throttling responses (HTTP 429). When your application encounters these transient conditions, the client libraries automatically retry operations by using exponential backoff strategies.

To manage transient faults effectively by using Queue Storage, you can take the following actions:

- **Configure appropriate timeouts** in your Queue Storage client to balance responsiveness with resilience to temporary slowdowns. The default timeouts in Azure Storage client libraries are typically suitable for most scenarios.

- **Implement circuit breaker patterns** in your application when it processes messages from queues. Circuit breaker patterns prevent cascading failures when downstream services experience problems.

- **Use visibility timeouts appropriately** when your application receives messages. Visibility timeouts ensure that messages become available for retry if your application encounters failures during processing.

To learn more about the Azure Table Storage architecture and how to design resilient and high-scale applications, see [Performance and scalability checklist for Queue Storage](/azure/storage/queues/storage-performance-checklist).

## Resilience to availability zone failures

[!INCLUDE [Resilience to availability zone failures](includes/reliability-availability-zone-description-include.md)]

Azure Queue Storage is zone-redundant when deployed with ZRS configuration. Unlike LRS, ZRS guarantees that Azure synchronously replicates your queue data across multiple availability zones. ZRS ensures that your data remains accessible even if one zone experiences an outage. ZRS ensures that your queues remain accessible even if an entire availability zone becomes unavailable. All write operations must be acknowledged across multiple zones before they complete, which provides strong consistency guarantees.

Zone redundancy is enabled at the storage account level and applies to all Queue Storage resources within that account. You can't configure individual queues for different redundancy levels. The setting applies to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring any intervention from your application.

[!INCLUDE [Storage - Resilience to availability zone failures - Support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Requirements

[!INCLUDE [Storage - Supported regions](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

- **Storage account types:** You must use a Standard general-purpose v2 storage account to enable ZRS for Queue Storage. Premium storage accounts don't support Queue Storage.

### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For detailed pricing information, see [Queue Storage pricing](https://azure.microsoft.com/pricing/details/storage/queues/).

### Configure availability zone support

- **Create a zone-redundant storage account and queue by taking the following steps.**

    1. [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, GZRS, or read-access geo-zone-redundant storage (RA-GZRS) as the redundancy option during account creation.

    1. [Create a queue](/azure/storage/queues/storage-quickstart-queues-portal).

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Behavior when all zones are healthy

This section describes what to expect when a queue storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Behavior when all zones are healthy](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

### Behavior during a zone failure

When an availability zone becomes unavailable, Queue Storage automatically handles the failover process by taking the following actions.

[!INCLUDE [Storage - Behavior during a zone failure](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting.** If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing, so that requests are directed to the remaining healthy availability zones. The service maintains full functionality using the surviving zones with no customer intervention required.

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

When you implement multi-region Queue Storage, consider the following important factors.

[!INCLUDE [Storage - Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Considerations - Secondary region access (read access)](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

#### Cost

[!INCLUDE [Storage - Cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For detailed pricing information, see [Queue Storage pricing](https://azure.microsoft.com/pricing/details/storage/queues/).

#### Configure multi-region support

[!INCLUDE [Storage - Configure multi-region support - create](includes/storage/reliability-storage-multi-region-configure-create-include.md)]

[!INCLUDE [Storage - Configure multi-region support - enable-disable](includes/storage/reliability-storage-multi-region-configure-enable-disable-include.md)]

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
> For advanced multi-region requirements, consider using Service Bus instead, which includes support for nonpaired regions.

[!INCLUDE [Storage - Custom multi-region solutions - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

This approach requires you to manage message distribution, handle data synchronization between queues in the different storage accounts, and implement custom failover logic.

## Backup and restore

Queue Storage doesn't provide traditional backup capabilities, like point-in-time restore (PITR). This is because queues are designed for transient message storage instead of long-term data persistence. Messages are typically processed and removed from queues during normal application operations.

For scenarios that require message durability beyond the built-in redundancy options, consider implementing your own application-level message logging or persistence to a permanent data store, like Blob Storage or Azure SQL Database. This approach allows you to maintain message history while using Queue Storage for its intended purpose of temporary message buffering and processing coordination.

## Service-level agreement

[!INCLUDE [Storage - Service-level agreement](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [What is Queue Storage?](/azure/storage/queues/storage-queues-introduction)
- [Azure Storage redundancy](/azure/storage/common/storage-redundancy)
- [Azure Storage disaster recovery planning and failover](/azure/storage/common/storage-disaster-recovery-guidance)
- [What are availability zones?](/azure/reliability/availability-zones-overview)
- [Azure reliability](/azure/reliability/overview)
- [Recommendations for handling transient faults](/azure/well-architected/reliability/handle-transient-faults)
