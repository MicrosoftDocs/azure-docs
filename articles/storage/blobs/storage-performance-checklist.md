---
title: Performance checklist for Azure Blob Storage
titleSuffix: Azure Storage
description: Essential performance optimization checklist for Azure Blob Storage covering storage account configuration, data placement, transfer tools, block blob optimization, partition naming, and network throughput to reduce latency and maximize performance.
services: storage
author: normesta

ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 11/19/2025
ms.author: normesta

# Customer intent: As a developer or system administrator, I want a comprehensive checklist of performance optimization techniques for Azure Blob Storage, so that I can reduce latency, maximize throughput, choose the right storage options and tools, and align with Azure Storage targets to prevent throttling.
---

# Performance checklist for Blob Storage

Use this checklist to reduce latency, increase throughput, and align with [Azure Storage scale and performance targets](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits). Azure Storage uses the term _targets_ rather than _limits_ because some values can be increased upon request. When clients approach or exceed these targets, Azure Storage might throttle requests, which increases latency. Use the checklist in this article to align with targets without sacrificing performance.

> [!NOTE]
> This article applies to all clients. For recommendations that apply only to custom applications, review the [Performance checklist for developers](storage-performance-checklist-developers.md). 

## Performance checklist

> [!div class="checklist"]
>
> - **Consider premium storage**: For high transaction rates and low latency beyond standard targets, use premium block blob storage accounts. See [Premium block blob storage accounts](storage-blob-block-blob-premium.md). 
>
> - **Locate data near clients**: Reduce network latency by placing storage accounts in the same Azure region as clients. For non-Azure clients, use a region closer to them. For multiple regions with different data needs, consider using separate storage accounts per region. For shared data, use object replication policies to move data closer to clients. For web content distribution, consider [Azure Front Door](../../frontdoor/front-door-overview.md) CDN.
>
> - **Use performance-optimized data transfer tools**: Use AzCopy for bulk transfers with high transfer rates and parallel uploads. See [Get started with AzCopy](../common/storage-use-azcopy-v10.md). For large offline data imports when limited by time, network, or costs, use [Azure Data Box](../../databox/index.yml). 
>
> - **Activate high-throughput block blobs**: Configure clients to upload blob or block sizes greater than 256 KiB. Larger blob or block sizes automatically activate high-throughput block blobs, which provide high-performance ingest that isn't affected by partition naming. 
>
> - **Use hash prefixes when using small block sizes**: Improve load balancing by adding a hash sequence (three digits) or seconds value as early as possible in partition keys. This reduces time for listing, querying, and reading blobs in cases where block sizes are small. See [Optimize blob partitions](storage-performance-blob-partitions.md).
>
> - **Maximize network throughput** - Use larger VM sizes for higher network limits. For on-premises clients, review network capabilities and connectivity to the Azure Storage location. You can improve those capabilities or configure clients to work more efficiently with them. Monitor link quality with tools like WireShark or NetMon to identify errors and packet loss.

## Next steps

- [Performance checklist for developers (Azure Blob Storage)](storage-performance-checklist-developers.md)
- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/blobs/toc.json)
- [Latency in Blob Storage](storage-blobs-latency.md)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)

