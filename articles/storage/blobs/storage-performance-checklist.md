---
title: Performance and scalability checklist for Blob storage
titleSuffix: Azure Storage
description: A checklist of proven practices for use with Blob storage in developing high-performance applications.
services: storage
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 06/01/2023
ms.author: akashdubey
ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-dotnet
---

# Performance and scalability checklist for Blob storage

Microsoft has developed a number of proven practices for developing high-performance applications with Blob storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you're designing your application and throughout the process.

Azure Storage has scalability and performance targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/blobs/toc.json) and [Scalability and performance targets for Blob storage](scalability-targets.md).

## Checklist

This article organizes proven practices for performance into a checklist you can follow while developing your Blob storage application.

| Done | Category | Design consideration |
| --- | --- | --- |
| &nbsp; |Scalability targets |[Can you design your application to use no more than the maximum number of storage accounts?](#maximum-number-of-storage-accounts) |
| &nbsp; |Scalability targets |[Are you avoiding approaching capacity and transaction limits?](#capacity-and-transaction-targets) |
| &nbsp; |Scalability targets |[Are a large number of clients accessing a single blob concurrently?](#multiple-clients-accessing-a-single-blob-concurrently) |
| &nbsp; |Scalability targets |[Is your application staying within the scalability targets for a single blob?](#bandwidth-and-operations-per-blob) |
| &nbsp; |Partitioning |[Is your naming convention designed to enable better load-balancing?](#partitioning) |
| &nbsp; |Networking |[Do client-side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; |Networking |[Do client-side devices have a high quality network link?](#link-quality) |
| &nbsp; |Networking |[Is the client application in the same region as the storage account?](#location) |
| &nbsp; |Direct client access |[Are you using shared access signatures (SAS) and cross-origin resource sharing (CORS) to enable direct access to Azure Storage?](#sas-and-cors) |
| &nbsp; |Caching |[Is your application caching data that is frequently accessed and rarely changed?](#reading-data) |
| &nbsp; |Caching |[Is your application batching updates by caching them on the client and then uploading them in larger sets?](#uploading-data-in-batches) |
| &nbsp; |.NET configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; |.NET configuration |[For .NET applications, have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload your client's capabilities or approach the scalability targets?](#unbounded-parallelism) |
| &nbsp; |Tools |[Are you using the latest versions of Microsoft-provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; |Retries |[Are you using a retry policy with an exponential backoff for throttling errors and timeouts?](#timeout-and-server-busy-errors) |
| &nbsp; |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |
| &nbsp; |Copying blobs |[Are you copying blobs in the most efficient manner?](#blob-copy-apis) |
| &nbsp; |Copying blobs |[Are you using the latest version of AzCopy for bulk copy operations?](#use-azcopy) |
| &nbsp; |Copying blobs |[Are you using the Azure Data Box family for importing large volumes of data?](#use-azure-data-box) |
| &nbsp; |Content distribution |[Are you using a CDN for content distribution?](#content-distribution) |
| &nbsp; |Use metadata |[Are you storing frequently used metadata about blobs in their metadata?](#use-metadata) |
| &nbsp; |Service metadata | [Allow time for account and container metadata propagation](#account-and-container-metadata-updates) |
| &nbsp; |Performance tuning |[Are you proactively tuning client library options to optimize data transfer performance?](#performance-tuning-for-data-transfers) |
| &nbsp; |Uploading quickly |[When trying to upload one blob quickly, are you uploading blocks in parallel?](#upload-one-large-blob-quickly) |
| &nbsp; |Uploading quickly |[When trying to upload many blobs quickly, are you uploading blobs in parallel?](#upload-many-blobs-quickly) |
| &nbsp; |Blob type |[Are you using page blobs or block blobs when appropriate?](#choose-the-correct-type-of-blob) |

## Scalability targets

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes. Avoiding these errors by staying within the limits of the scalability targets is an important part of enhancing your application's performance.

For more information about scalability targets for the Queue service, see [Azure Storage scalability and performance targets](../queues/scalability-targets.md#scale-targets-for-queue-storage).

### Maximum number of storage accounts

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

- Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks. Managed disks scale for you automatically and without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/managed-disks-overview.md)
- Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign Azure roles on a per-container basis. For more information, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).
- Are you using multiple storage accounts to shard to increase ingress, egress, I/O operations per second (IOPS), or capacity? In this scenario, Microsoft recommends that you take advantage of increased limits for storage accounts to reduce the number of storage accounts required for your workload if possible. Contact [Azure Support](https://azure.microsoft.com/support/options/) to request increased limits for your storage account.

### Capacity and transaction targets

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:

- If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](../common/storage-account-overview.md).
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If your application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts themselves have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application is approaching the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have negative effects on performance. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Keep in mind that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application is approaching the scalability targets, then make sure that you're using an exponential backoff for retries. It's best to try to avoid reaching the scalability targets by implementing the recommendations described in this article. However, using an exponential backoff for retries prevents your application from retrying rapidly, which could make throttling worse. For more information, see the section titled [Timeout and Server Busy errors](#timeout-and-server-busy-errors).

### Multiple clients accessing a single blob concurrently

If you have a large number of clients accessing a single blob concurrently, you need to consider both per blob and per storage account scalability targets. The exact number of clients that can access a single blob varies depending on factors such as the number of clients requesting the blob simultaneously, the size of the blob, and network conditions.

If the blob can be distributed through a CDN such as images or videos served from a website, then you can use a CDN. For more information, see the section titled [Content distribution](#content-distribution).

In other scenarios, such as scientific simulations where the data is confidential, you have two options. The first is to stagger your workload's access such that the blob is accessed over a period of time vs being accessed simultaneously. Alternatively, you can temporarily copy the blob to multiple storage accounts to increase the total IOPS per blob and across storage accounts. Results vary depending on your application's behavior, so be sure to test concurrency patterns during design.

### Bandwidth and operations per blob

A single blob supports up to 500 requests per second. If you have multiple clients that need to read the same blob and you might exceed this limit, then consider using a block blob storage account. A block blob storage account provides a higher request rate, or I/O operations per second (IOPS).

You can also use a content delivery network (CDN) such as Azure CDN to distribute operations on the blob. For more information about Azure CDN, see [Azure CDN overview](../../cdn/cdn-overview.md).

## Partitioning

Understanding how Azure Storage partitions your blob data is useful for enhancing performance. Azure Storage can serve data in a single partition more quickly than data that spans multiple partitions. By naming your blobs appropriately, you can improve the efficiency of read requests.

Blob storage uses a range-based partitioning scheme for scaling and load balancing. Each blob has a partition key comprised of the full blob name (account+container+blob). The partition key is used to partition blob data into ranges. The ranges are then load-balanced across Blob storage.

Range-based partitioning means that naming conventions that use  lexical ordering (for example, *mypayroll*, *myperformance*, *myemployees*, etc.) or timestamps (*log20160101*, *log20160102*, *log20160102*, etc.) are more likely to result in the partitions being co-located on the same partition server until increased load requires that they're split into smaller ranges. Co-locating blobs on the same partition server enhances performance, so an important part of performance enhancement involves naming blobs in a way that organizes them most effectively.

For example, all blobs within a container can be served by a single server until the load on these blobs requires further rebalancing of the partition ranges. Similarly, a group of lightly loaded accounts with their names arranged in lexical order may be served by a single server until the load on one or all of these accounts require them to be split across multiple partition servers.

Each load-balancing operation may impact the latency of storage calls during the operation. The service's ability to handle a sudden burst of traffic to a partition is limited by the scalability of a single partition server until the load-balancing operation kicks in and rebalances the partition key range.

You can follow some best practices to reduce the frequency of such operations.

- If possible, use blob or block sizes greater than 256 KiB for standard and premium storage accounts. Larger blob or block sizes automatically activate high-throughput block blobs. High-throughput block blobs provide high-performance ingest that isn't affected by partition naming.
- Examine the naming convention you use for accounts, containers, blobs, tables, and queues. Consider prefixing account, container, or blob names with a three-digit hash using a hashing function that best suits your needs.
- If you organize your data using timestamps or numerical identifiers, make sure that you aren't using an append-only (or prepend-only) traffic pattern. These patterns aren't suitable for a range-based partitioning system. These patterns may lead to all traffic going to a single partition and limiting the system from effectively load balancing.

    For example, if you have daily operations that use a blob with a timestamp such as *yyyymmdd*, then all traffic for that daily operation is directed to a single blob, which is served by a single partition server. Consider whether the per-blob limits and per-partition limits meet your needs, and consider breaking this operation into multiple blobs if needed. Similarly, if you store time series data in your tables, all traffic may be directed to the last part of the key namespace. If you're using numerical IDs, prefix the ID with a three-digit hash. If you're using timestamps, prefix the timestamp with the seconds value, for example, *ssyyyymmdd*. If your application routinely performs listing and querying operations, choose a hashing function that limits your number of queries. In some cases, a random prefix may be sufficient.

- For more information on the partitioning scheme used in Azure Storage, see [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](https://sigops.org/sosp/sosp11/current/2011-Cascais/printable/11-calder.pdf).

## Networking

The physical network constraints of the application may have a significant impact on performance. The following sections describe some of limitations users may encounter.

### Client network capability

Bandwidth and the quality of the network link play important roles in application performance, as described in the following sections.

#### Throughput

For bandwidth, the problem is often the capabilities of the client. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VMs if you need higher network limits from a single machine. If you're accessing Azure Storage from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.

#### Link quality

As with any network usage, keep in mind that network conditions resulting in errors and packet loss slows effective throughput.  Using WireShark or NetMon may help in diagnosing this issue.

### Location

In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure web app that uses Azure Storage, then locate them both within a single region, such as US West or Asia Southeast. Co-locating resources reduces the latency and the cost, as bandwidth usage within a single region is free.

If client applications access Azure Storage but aren't hosted within Azure, such as mobile device apps or on premises enterprise services, then locating the storage account in a region near to those clients may reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then consider using one storage account per region. This approach is easier to implement if the data the application stores is specific to individual users, and doesn't require replicating data between storage accounts.

For broad distribution of blob content, use a content deliver network such as Azure CDN. For more information about Azure CDN, see [Azure CDN](../../cdn/cdn-overview.md).

## SAS and CORS

Suppose that you need to authorize code such as JavaScript that is running in a user's web browser or in a mobile phone app to access data in Azure Storage. One approach is to build a service application that acts as a proxy. The user's device authenticates with the service, which in turn authorizes access to Azure Storage resources. In this way, you can avoid exposing your storage account keys on insecure devices. However, this approach places a significant overhead on the service application, because all of the data transferred between the user's device and Azure Storage must pass through the service application.

You can avoid using a service application as a proxy for Azure Storage by using shared access signatures (SAS). Using SAS, you can enable your user's device to make requests directly to Azure Storage by using a limited access token. For example, if a user wants to upload a photo to your application, then your service application can generate a SAS and send it to the user's device. The SAS token can grant permission to write to an Azure Storage resource for a specified interval of time, after which the SAS token expires. For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).

Typically, a web browser doesn't allow JavaScript in a page that is hosted by a website on one domain to perform certain operations, such as write operations, to another domain. Known as the same-origin policy, this policy prevents a malicious script on one page from obtaining access to data on another web page. However, the same-origin policy can be a limitation when building a solution in the cloud. Cross-origin resource sharing (CORS) is a browser feature that enables the target domain to communicate to the browser that it trusts requests originating in the source domain.

For example, suppose a web application running in Azure makes a request for a resource to an Azure Storage account. The web application is the source domain, and the storage account is the target domain. You can configure CORS for any of the Azure Storage services to communicate to the web browser that requests from the source domain are trusted by Azure Storage. For more information about CORS, see [Cross-origin resource sharing (CORS) support for Azure Storage](/rest/api/storageservices/Cross-Origin-Resource-Sharing--CORS--Support-for-the-Azure-Storage-Services).

Both SAS and CORS can help you avoid unnecessary load on your web application.

## Caching

Caching plays an important role in performance. The following sections discuss caching best practices.

### Reading data

In general, reading data once is preferable to reading it twice. Consider the example of a web application that has retrieved a 50 MiB blob from the Azure Storage to serve as content to a user. Ideally, the application caches the blob locally to disk and then retrieves the cached version for subsequent user requests.

One way to avoid retrieving a blob if it hasn't been modified since it was cached is to qualify the GET operation with a conditional header for modification time. If the last modified time is after the time that the blob was cached, then the blob is retrieved and re-cached. Otherwise, the cached blob is retrieved for optimal performance.

You may also decide to design your application to assume that the blob remains unchanged for a short period after retrieving it. In this case, the application doesn't need to check whether the blob was modified during that interval.

Configuration data, lookup data, and other data that is frequently used by the application are good candidates for caching.

For more information about using conditional headers, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).

### Uploading data in batches

In some scenarios, you can aggregate data locally, and then periodically upload it in a batch instead of uploading each piece of data immediately. For example, suppose a web application keeps a log file of activities. The application can either upload details of every activity as it happens to a table (which requires many storage operations), or it can save activity details to a local log file and then periodically upload all activity details as a delimited file to a blob. If each log entry is 1 KB in size, you can upload thousands of entries in a single transaction. A single transaction supports uploading a blob of up to 64 MiB in size. The application developer must design for the possibility of client device or upload failures. If the activity data needs to be downloaded for an interval of time rather than for a single activity, then using Blob storage is recommended over Table storage.

## .NET configuration

For projects using .NET Framework, this section lists some quick configuration settings that you can use to make significant performance improvements. If you're using a language other than .NET, check to see if similar concepts apply in your chosen language.

### Increase default connection limit

> [!NOTE]
> This section applies to projects using .NET Framework, as connection pooling is controlled by the ServicePointManager class. .NET Core introduced a significant change around connection pool management, where connection pooling happens at the HttpClient level and the pool size is not limited by default. This means that HTTP connections are automatically scaled to satisfy your workload. Using the latest version of .NET is recommended, when possible, to take advantage of performance enhancements.

For projects using .NET Framework, you can use the following code to increase the default connection limit (which is usually two in a client environment or ten in a server environment) to 100. Typically, you should set the value to approximately the number of threads used by your application. Set the connection limit before opening any connections.

```csharp
ServicePointManager.DefaultConnectionLimit = 100; //(Or More)  
```

To learn more about connection pool limits in .NET Framework, see [.NET Framework Connection Pool Limits and the new Azure SDK for .NET](https://devblogs.microsoft.com/azure-sdk/net-framework-connection-pool-limits/).

For other programming languages, see the documentation to determine how to set the connection limit.

### Increase minimum number of threads

If you're using synchronous calls together with asynchronous tasks, you may want to increase the number of threads in the thread pool:

```csharp
ThreadPool.SetMinThreads(100,100); //(Determine the right number for your application)  
```

For more information, see the [ThreadPool.SetMinThreads](/dotnet/api/system.threading.threadpool.setminthreads) method.

## Unbounded parallelism

While parallelism can be great for performance, be careful about using unbounded parallelism, meaning that there's no limit enforced on the number of threads or parallel requests. Be sure to limit parallel requests to upload or download data, to access multiple partitions in the same storage account, or to access multiple items in the same partition. If parallelism is unbounded, your application can exceed the client device's capabilities or the storage account's scalability targets, resulting in longer latencies and throttling.

## Client libraries and tools

For best performance, always use the latest client libraries and tools provided by Microsoft. Azure Storage client libraries are available for a variety of languages. Azure Storage also supports PowerShell and Azure CLI. Microsoft actively develops these client libraries and tools with performance in mind, keeps them up-to-date with the latest service versions, and ensures that they handle many of the proven performance practices internally.

> [!TIP]
> The [ABFS driver](data-lake-storage-abfs-driver.md) was designed to overcome the inherent deficiencies of WASB. Microsoft recommends using the ABFS driver over the WASB driver, as the ABFS driver is optimized specifically for big data analytics.

## Handle service errors

Azure Storage returns an error when the service can't process a request. Understanding the errors that may be returned by Azure Storage in a given scenario is helpful for optimizing performance. For a list of common error codes, see [Common REST API error codes](/rest/api/storageservices/common-rest-api-error-codes).

### Timeout and Server Busy errors

Azure Storage may throttle your application if it approaches the scalability limits. In some cases, Azure Storage may be unable to handle a request due to some transient condition. In both cases, the service may return a 503 (Server Busy) or 500 (Timeout) error. These errors can also occur if the service is rebalancing data partitions to allow for higher throughput. The client application should typically retry the operation that causes one of these errors. However, if Azure Storage is throttling your application because it's exceeding scalability targets, or even if the service was unable to serve the request for some other reason, aggressive retries may make the problem worse. Using an exponential back off retry policy is recommended, and the client libraries default to this behavior. For example, your application may retry after 2 seconds, then 4 seconds, then 10 seconds, then 30 seconds, and then give up completely. In this way, your application significantly reduces its load on the service, rather than exacerbating behavior that could lead to throttling.

Connectivity errors can be retried immediately, because they aren't the result of throttling and are expected to be transient.

### Non-retryable errors

The client libraries handle retries with an awareness of which errors can be retried and which can't be retried. However, if you're calling the Azure Storage REST API directly, there are some errors that you shouldn't retry. For example, a 400 (Bad Request) error indicates that the client application sent a request that couldn't be processed because it wasn't in the expected form. Resending this request results the same response every time, so there's no point in retrying it. If you're calling the Azure Storage REST API directly, be aware of potential errors and whether they should be retried.

For more information on Azure Storage error codes, see [Status and error codes](/rest/api/storageservices/status-and-error-codes2).

## Copying and moving blobs

Azure Storage provides a number of solutions for copying and moving blobs within a storage account, between storage accounts, and between on-premises systems and the cloud. This section describes some of these options in terms of their effects on performance. For information about efficiently transferring data to or from Blob storage, see [Choose an Azure solution for data transfer](../common/storage-choose-data-transfer-solution.md?toc=/azure/storage/blobs/toc.json).

### Blob copy APIs

To copy blobs across storage accounts, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) operation. This operation copies data synchronously from any URL source into a block blob. Using the `Put Block from URL` operation can significantly reduce required bandwidth when you're migrating data across storage accounts. Because the copy operation takes place on the service side, you don't need to download and re-upload the data.

To copy data within the same storage account, use the [Copy Blob](/rest/api/storageservices/Copy-Blob) operation. Copying data within the same storage account is typically completed quickly.

### Use AzCopy

The AzCopy command-line utility is a simple and efficient option for bulk transfer of blobs to, from, and across storage accounts. AzCopy is optimized for this scenario, and can achieve high transfer rates. AzCopy version 10 uses the `Put Block From URL` operation to copy blob data across storage accounts. For more information, see [Copy or move data to Azure Storage by using AzCopy v10](../common/storage-use-azcopy-v10.md).

### Use Azure Data Box

For importing large volumes of data into Blob storage, consider using the Azure Data Box family for offline transfers. Microsoft-supplied Data Box devices are a good choice for moving large amounts of data to Azure when you're limited by time, network availability, or costs. For more information, see the [Azure DataBox Documentation](../../databox/index.yml).

## Content distribution

Sometimes an application needs to serve the same content to many users (for example, a product demo video used in the home page of a website), located in either the same or multiple regions. In this scenario, use a Content Delivery Network (CDN) such as Azure Front Door. Azure Front Door is Microsoft’s modern cloud CDN that provides fast, reliable, and secure access between your users and your applications’ static and dynamic web content across the globe. Azure Front Door delivers your Blob Storage content using Microsoft’s global edge network with hundreds of [global and local points of presence (PoPs)](../../frontdoor/edge-locations-by-region.md). A CDN can typically support much higher egress limits than a single storage account and offers improved latency for content delivery to other regoins. 

For more information about Azure Front Door, see [Azure Front Door](../../frontdoor/front-door-overview.md).

## Use metadata

The Blob service supports HEAD requests, which can include blob properties or metadata. For example, if your application needs the Exif (exchangeable image format) data from a photo, it can retrieve the photo and extract it. To save bandwidth and improve performance, your application can store the Exif data in the blob's metadata when the application uploads the photo. You can then retrieve the Exif data in metadata using only a HEAD request. Retrieving only metadata and not the full contents of the blob saves significant bandwidth and reduces the processing time required to extract the Exif data. Keep in mind that 8 KiB of metadata can be stored per blob.

## Account and container metadata updates

Account and container metadata is propagated across the storage service in the region where the account resides. Full propagation of this metadata can take up to 60 seconds depending on the operation. For example:

- If you are rapidly creating, deleting, and recreating accounts with the same account name in the same region ensure that you are waiting 60 seconds for the account state to fully propagate, or your requests may fail.
- When you establish a stored access policy on a container, the policy might take up to 30 seconds to take effect.

## Performance tuning for data transfers

When an application transfers data using the Azure Storage client library, there are several factors that can affect speed, memory usage, and even the success or failure of the request. To maximize performance and reliability for data transfers, it's important to be proactive in configuring client library transfer options based on the environment your app runs in. To learn more, see [Performance tuning for uploads and downloads](storage-blobs-tune-upload-download.md).

## Upload blobs quickly

To upload blobs quickly, first determine whether you're uploading one blob or many. Use the below guidance to determine the correct method to use depending on your scenario. If you're using the Azure Storage client library for data transfers, see [Performance tuning for data transfers](#performance-tuning-for-data-transfers) for further guidance.

### Upload one large blob quickly

To upload a single large blob quickly, a client application can upload its blocks or pages in parallel, being mindful of the scalability targets for individual blobs and the storage account as a whole. The Azure Storage client libraries support uploading in parallel. Client libraries for other supported languages provide similar options.

### Upload many blobs quickly

To upload many blobs quickly, upload blobs in parallel. Uploading in parallel is faster than uploading single blobs at a time with parallel block uploads because it spreads the upload across multiple partitions of the storage service. AzCopy performs uploads in parallel by default, and is recommended for this scenario. For more information, see [Get started with AzCopy](../common/storage-use-azcopy-v10.md).

## Choose the correct type of blob

Azure Storage supports block blobs, append blobs, and page blobs. For a given usage scenario, your choice of blob type affects the performance and scalability of your solution.

Block blobs are appropriate when you want to upload large amounts of data efficiently. For example, a client application that uploads photos or video to Blob storage would target block blobs.

Append blobs are similar to block blobs in that they're composed of blocks. When you modify an append blob, blocks are added to the end of the blob only. Append blobs are useful for scenarios such as logging, when an application needs to add data to an existing blob.

Page blobs are appropriate if the application needs to perform random writes on the data. For example, Azure virtual machine disks are stored as page blobs. For more information, see [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

## Next steps

- [Scalability and performance targets for Blob storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/blobs/toc.json)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)

