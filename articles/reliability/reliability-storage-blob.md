---
title: Reliability in Azure Blob Storage
description: Learn about reliability in Azure Blob Storage, including availability zones and multi-region deployments.
ms.author: anaharris
author: anaharris-ms
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-blob-storage
ms.date: 08/12/2025
ai-usage: ai-assisted
#Customer intent: As an engineer responsible for business continuity, I want to understand the details of how Azure Blob Storage works from a reliability perspective and plan disaster recovery strategies in alignment with the exact processes that Azure services follow during different kinds of situations.
---

# Reliability in Azure Blob Storage

Azure Blob Storage is Microsoft's object storage solution for the cloud. It's designed to store massive amounts of unstructured data such as text, binary data, documents, media files, and application backups. As a foundational Azure storage service, Blob Storage provides multiple reliability features to ensure that your data remains available and durable during both planned and unplanned events.

Blob Storage supports built-in redundancy mechanisms that store multiple copies of your data across different fault domains. It provides comprehensive redundancy options that include availability zone deployment with zone-redundant storage (ZRS), multi-region protection through geo-redundant configurations, and sophisticated failover capabilities.

This article describes reliability support in [Blob Storage](/azure/storage/blobs/storage-blobs-overview), covering intra-regional resiliency via [availability zones](#availability-zone-support) and [multi-region deployments](#multi-region-support).

> [!NOTE]
> Blob Storage is part of the Azure Storage platform. Some of the capabilities of Blob Storage are common across many Azure Storage services. In this article, we use *Azure Storage* to refer to these features.

## Production deployment recommendations

To learn about how to deploy Blob Storage to support your solution's reliability requirements, and how reliability affects other aspects of your architecture, see [Architecture best practices for Blob Storage](/azure/well-architected/service-guides/azure-blob-storage) in the Azure Well-Architected Framework.

## Reliability architecture overview

Azure Storage provides several redundancy options to help you protect your data against different types of failures. Each option provides a specific level of data redundancy, so you can choose the level that best matches your application's requirements.

[!INCLUDE [Storage - Reliability architecture overview](includes/storage/reliability-storage-architecture-include.md)]

## Transient faults

[!INCLUDE [Transient fault description](includes/reliability-transient-fault-description-include.md)]

To effectively manage transient faults when you use Blob Storage, implement the following recommendations:

- **Use the Azure Storage client libraries**, which include built-in retry policies with exponential backoff and jitter. The .NET, Java, Python, and JavaScript SDKs automatically handle retries for transient failures. For more information about retry configuration options, see [Azure Storage retry policy guidance](/azure/storage/blobs/storage-retry-policy).

- **Configure appropriate timeout values** for your blob operations based on blob size and network conditions. Larger blobs require longer timeouts, while smaller operations can use shorter values to detect failures quickly.

## Availability zone support

[!INCLUDE [AZ support description](includes/reliability-availability-zone-description-include.md)]

Blob Storage provides robust availability zone support through ZRS configurations that automatically distribute your data across multiple availability zones within a region. Unlike locally redundant storage (LRS), ZRS guarantees that Azure synchronously replicates your blob data across multiple availability zones. ZRS ensures that your data remains accessible even if one zone experiences an outage.

Zone redundancy is enabled at the storage account level and applies to all blob containers within that account. You can't set different redundancy levels for individual containers. The redundancy configuration is applied to the entire storage account. When an availability zone experiences an outage, Azure Storage automatically routes requests to healthy zones without requiring intervention from you or your application.

[!INCLUDE [Storage - Availability zone support](includes/storage/reliability-storage-availability-zone-support-include.md)]

### Region support

[!INCLUDE [Storage - Availability zone region support](includes/storage/reliability-storage-availability-zone-region-support-include.md)]

### Requirements

Zone redundancy is available for both Standard general-purpose v2 and Premium Block Blob storage account types. Block blobs, append blobs, and page blobs all support zone-redundant configurations, but the type of storage account that you use determines which capabilities are available. For more information, see [Supported storage account types](/azure/storage/common/storage-redundancy#supported-storage-account-types).

### Cost

[!INCLUDE [Storage - Availability zone cost](includes/storage/reliability-storage-availability-zone-cost-include.md)]

For more information, see [Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

### Configure availability zone support

- **Create a blob storage account with zone redundancy:** To create a new storage account with ZRS, see [Create a storage account](/azure/storage/common/storage-account-create) and select ZRS, geo-zone-redundant storage (GZRS) or read-access geo-redundant storage (RA-GZRS) as the redundancy option during account creation.

[!INCLUDE [Storage - Configure availability zone support](includes/storage/reliability-storage-availability-zone-configure-include.md)]

### Normal operations

This section describes what to expect when a blob storage account is configured for zone redundancy and all availability zones are operational.

[!INCLUDE [Storage - Normal operations](includes/storage/reliability-storage-availability-zone-normal-operations-include.md)]

> [!IMPORTANT]
> The data replication approach across zones is usually different to the approach used across regions.

### Zone-down experience

This section describes what to expect when a blob storage account is configured for ZRS and there's an availability zone outage.

[!INCLUDE [Storage - Zone down experience](includes/storage/reliability-storage-availability-zone-down-experience-include.md)]

- **Traffic rerouting.** If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing, so that requests are directed to the remaining healthy availability zones. The service maintains full functionality by using the surviving zones with no customer intervention required.

### Zone recovery

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

When you implement multi-region Blob Storage, consider the following key factors:

[!INCLUDE [Storage - Multi Region Considerations - Latency](includes/storage/reliability-storage-multi-region-considerations-latency-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Secondary region access (read access)](includes/storage/reliability-storage-multi-region-considerations-secondary-read-access-include.md)]

[!INCLUDE [Storage - Multi Region Considerations - Feature limitations](includes/storage/reliability-storage-multi-region-considerations-feature-limitations-include.md)]

### Cost

[!INCLUDE [Storage - Multi Region cost](includes/storage/reliability-storage-multi-region-cost-include.md)]

For more information, see [Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

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

[!INCLUDE [Storage - Alternative multi-region approaches - approach overview](includes/storage/reliability-storage-multi-region-alternative-approach-include.md)]

**Object replication** provides an extra option for cross-region data replication that provides asynchronous copying of block blobs between storage accounts. Unlike the built-in geo-redundant storage options that use fixed paired regions, object replication allows you to replicate data between storage accounts in any Azure region, including nonpaired regions. This approach gives you full control over source and destination regions, replication policies, and the specific containers and blob prefixes to replicate.

Object replication can be configured to replicate all blobs within a container, or specific subsets based on blob prefixes and tags. The replication is asynchronous and occurs in the background. You can configure multiple replication policies and even chain replication across multiple storage accounts to create sophisticated multi-region topologies.

Object replication isn't compatible with all storage accounts. For example, it doesn't work with storage accounts that use hierarchical namespaces (also called Azure Data Lake Gen2 accounts).

For more information, see [Object replication for block blobs](/azure/storage/blobs/object-replication-overview) and [Configure object replication](/azure/storage/blobs/object-replication-configure).

## Backups

Blob Storage provides multiple data protection mechanisms that complement redundancy for comprehensive backup strategies. The service's built-in redundancy protects against infrastructure failures, and extra backup capabilities protect against accidental deletion, corruption, and malicious activities.

**Point-in-time restore (PITR)** allows you to restore block blob data to a previous state within a configured retention period of up to 365 days. Microsoft fully manages this feature. It also provides granular recovery capabilities at the container or blob level. PITR data is stored in the same region as the source account and is accessible even during regional outages if you use geo-redundant configurations.

**Blob versioning** automatically maintains previous versions of blobs when they're modified or deleted. Each version is stored as a separate object and can be accessed independently. Versions are stored in the same region as the current blob and follow the same redundancy configuration as the storage account.

**Soft delete** provides a safety net for accidentally deleted blobs and containers by retaining deleted data for a configurable period. Soft-deleted data remains in the same storage account and region, making it immediately available for recovery. For geo-redundant accounts, soft-deleted data is also replicated to the secondary region.

**Blob snapshots** create read-only, point-in-time copies of blobs that you can use for backup and recovery scenarios. Snapshots are stored in the same storage account and follow the same redundancy and geo-replication settings as the base blob.

For cross-region backup requirements, consider using **Azure Backup for Blobs**, which provides centralized backup management and can store backup data in regions different from the source data. This service offers operational and vaulted backup options with configurable retention policies and restore capabilities. For more information, see [Azure Backup for Blobs overview](/azure/backup/blob-backup-overview).

For most solutions, you shouldn't rely exclusively on backups. Instead, use the other capabilities described in this guide to support your resiliency requirements. However, backups protect against some risks that other approaches don't. For more information, see [Redundancy, replication, and backup](concept-redundancy-replication-backup.md).

## Service-level agreement

[!INCLUDE [Storage - SLA](includes/storage/reliability-storage-sla-include.md)]

## Related content

- [Blob Storage overview](../storage/blobs/storage-blobs-overview.md)
- [Azure Storage redundancy](../storage/common/storage-redundancy.md)
- [Disaster recovery and storage account failover](../storage/common/storage-disaster-recovery-guidance.md)
- [Use geo-redundancy to design highly available applications](../storage/common/geo-redundant-design.md)
- [Change how a storage account is replicated](../storage/common/redundancy-migration)
