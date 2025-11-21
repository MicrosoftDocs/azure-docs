---
title: Performance checklist for developers (Azure Blob Storage)
titleSuffix: Azure Storage
description: Essential performance optimization checklist for developers building custom applications with Azure Blob Storage. Learn proven practices for parallel transfers, retry policies, server-side operations, caching, and batch uploads to maximize throughput and reduce latency.
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: concept-article
ms.date: 11/19/2025
ms.author: normesta

# Customer intent: As a developer, I want a checklist of proven practices for optimizing Blob storage performance, so that I can ensure my application scales efficiently and meets performance targets while avoiding throttling and errors.
---

# Performance checklist for Blob Storage developers

Use this checklist to reduce latency, increase throughput, and align with [Azure Storage scale and performance targets](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-storage-limits). Azure Storage uses the term _targets_ rather than _limits_ because some values can be increased upon request. When clients approach or exceed these targets, Azure Storage might throttle requests, which increases latency. Use the checklist in this article to align with targets without sacrificing performance.

> [!NOTE]
> This article applies only to custom applications. For recommendations that apply to all clients, review the [Performance checklist for Blob Storage](storage-performance-checklist.md). 

## Performance checklist

> [!div class="checklist"]
>
> - **Use Azure Storage client libraries**: For best performance, use Microsoft client libraries. These libraries are optimized for performance, kept current with service versions, and handle proven performance practices internally.
>
> - **Optimize parallel block transfers**: Increase parallel transfers with smaller block sizes, but maintain sizes above 4 MiB (standard) or 256 KiB (premium) to activate high-throughput block blobs. Balance parallelism to avoid exceeding device capabilities or storage targets, which causes throttling. Set appropriate limits on concurrent requests. See performance guidance for [.NET](storage-blobs-tune-upload-download.md), [Java](storage-blobs-tune-upload-download-java.md), [JavaScript](storage-blobs-tune-upload-download-javascript.md), [Python](storage-blobs-tune-upload-download-python.md), and [Go](storage-blobs-tune-upload-download-go.md).  
>
> - **Use an exponential backoff retry policy**: Handle transient errors with exponential backoff policies. For example, retry after 2, 4, 10, 30 seconds, then stop. This policy prevents excessive retries for non-transient errors such as those that occur when your application approaches or exceeds performance and scale targets. Client libraries know which errors to retry and which ones not to retry. To apply a retry policy, see the retry guidance for [.NET](storage-retry-policy.md), [Java](storage-retry-policy-java.md), [JavaScript](storage-blobs-tune-upload-download-javascript.md), [Python](storage-blobs-tune-upload-download-python.md), and [Go](storage-blobs-tune-upload-download-go.md).
>
> - **Use server-to-server APIs to copy between containers and accounts**: Use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to copy data between accounts and to copy data within an account. Server-side operations reduce bandwidth since you don't need to download and then upload data. See the copy guidance for [.NET](storage-blob-copy.md), [Java](storage-blob-copy-java.md), [JavaScript](storage-blob-copy-javascript.md), [Python](storage-blob-copy-python.md), and [Go](storage-blob-copy-go.md).
>
> - **Cache data to improve performance**: Cache frequently accessed or rarely changed data such as configuration and lookup data. Use conditional headers with GET operations to retrieve blobs only if modified since last cached. For more information, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).
>
> - **Upload data in batches**: Aggregate data before uploading instead of uploading immediately. For example, save log entries locally and upload periodically as a single blob rather than uploading each entry individually.  

## Next steps

- [Performance checklist for Blob Storage](storage-performance-checklist.md)
- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/blobs/toc.json)
- [Latency in Blob Storage](storage-blobs-latency.md)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)

