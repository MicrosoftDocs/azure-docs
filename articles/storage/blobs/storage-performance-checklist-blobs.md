---
title: Azure Blob storage performance and scalability checklist - Azure Storage
description: A checklist of proven practices for use with Azure Storage in developing high-performance applications.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: common
---

# Azure Blob storage performance and scalability checklist

Microsoft has developed a number of proven practices for developing high-performance applications. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your application. Proven practices applicable to:  

* All Azure Storage services (blobs, tables, queues, and files)
* Blobs
* Tables
* Queues  

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; | All Services |Scalability Targets |[Is your application designed to avoid approaching the scalability targets?](#scalability-targets) |
| &nbsp; | All Services |Scalability Targets |[Is your naming convention designed to enable better load-balancing?](#partition-naming-convention) |
| &nbsp; | All Services |Networking |[Do client side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; | All Services |Networking |[Do client side devices have a high enough quality link?](#link-quality) |
| &nbsp; | All Services |Networking |[Is the client application located "near" the storage account?](#location) |
| &nbsp; | All Services |Content Distribution |[Are you using a CDN for content distribution?](#content-distribution) |
| &nbsp; | All Services |Direct Client Access |[Are you using SAS and CORS to allow direct access to storage instead of proxy?](#sas-and-cors) |
| &nbsp; | All Services |Caching |[Is your application caching data that is repeatedly used and changes rarely?](#reading-data) |
| &nbsp; | All Services |Caching |[Is your application batching updates (caching them client side and then uploading in larger sets)?](#uploading-data-in-batches) |
| &nbsp; | All Services |.NET Configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; | All Services |.NET Configuration |[Have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; | All Services |.NET Configuration |[Are you using .NET 4.5 or later, which has improved garbage collection?](#subheading11) |
| &nbsp; | All Services |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload either your client capabilities or the scalability targets?](#subheading12) |
| &nbsp; | All Services |Tools |[Are you using the latest version of Microsoft provided client libraries and tools?](#subheading13) |
| &nbsp; | All Services |Retries |[Are you using an exponential backoff retry policy for throttling errors and timeouts?](#subheading14) |
| &nbsp; | All Services |Retries |[Is your application avoiding retries for non-retryable errors?](#subheading15) |
| &nbsp; | Blobs |Scalability Targets |[Do you have a large number of clients accessing a single object concurrently?](#subheading46) |
| &nbsp; | Blobs |Scalability Targets |[Is your application staying within the bandwidth or operations scalability target for a single blob?](#subheading16) |
| &nbsp; | Blobs |Copying Blobs |[Are you copying blobs in an efficient manner?](#subheading17) |
| &nbsp; | Blobs |Copying Blobs |[Are you using AzCopy for bulk copies of blobs?](#subheading18) |
| &nbsp; | Blobs |Copying Blobs |[Are you using Azure Import/Export to transfer large volumes of data?](#subheading19) |
| &nbsp; | Blobs |Use Metadata |[Are you storing frequently used metadata about blobs in their metadata?](#subheading20) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload one blob quickly, are you uploading blocks in parallel?](#subheading21) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload many blobs quickly, are you uploading blobs in parallel?](#subheading22) |
| &nbsp; | Blobs |Correct Blob Type |[Are you using page blobs or block blobs when appropriate?](#subheading23) |
| &nbsp; | Tables |Scalability Targets |[Are you approaching the scalability targets for entities per second?](#subheading24) |
| &nbsp; | Tables |Configuration |[Are you using JSON for your table requests?](#subheading25) |
| &nbsp; | Tables |Configuration |[Have you turned Nagle off to improve the performance of small requests?](#subheading26) |
| &nbsp; | Tables |Tables and Partitions |[Have you properly partitioned your data?](#subheading27) |
| &nbsp; | Tables |Hot Partitions |[Are you avoiding append-only and prepend-only patterns?](#subheading28) |
| &nbsp; | Tables |Hot Partitions |[Are your inserts/updates spread across many partitions?](#subheading29) |
| &nbsp; | Tables |Query Scope |[Have you designed your schema to allow for point queries to be used in most cases, and table queries to be used sparingly?](#subheading30) |
| &nbsp; | Tables |Query Density |[Do your queries typically only scan and return rows that your application will use?](#subheading31) |
| &nbsp; | Tables |Limiting Returned Data |[Are you using filtering to avoid returning entities that are not needed?](#subheading32) |
| &nbsp; | Tables |Limiting Returned Data |[Are you using projection to avoid returning properties that are not needed?](#subheading33) |
| &nbsp; | Tables |Denormalization |[Have you denormalized your data such that you avoid inefficient queries or multiple read requests when trying to get data?](#subheading34) |
| &nbsp; | Tables |Insert/Update/Delete |[Are you batching requests that need to be transactional or can be done at the same time to reduce round-trips?](#subheading35) |
| &nbsp; | Tables |Insert/Update/Delete |[Are you avoiding retrieving an entity just to determine whether to call insert or update?](#subheading36) |
| &nbsp; | Tables |Insert/Update/Delete |[Have you considered storing series of data that will frequently be retrieved together in a single entity as properties instead of multiple entities?](#subheading37) |
| &nbsp; | Tables |Insert/Update/Delete |[For entities that will always be retrieved together and can be written in batches (for example, time series data), have you considered using blobs instead of tables?](#subheading38) |
| &nbsp; | Queues |Scalability Targets |[Are you approaching the scalability targets for messages per second?](#subheading39) |
| &nbsp; | Queues |Configuration |[Have you turned Nagle off to improve the performance of small requests?](#subheading40) |
| &nbsp; | Queues |Message Size |[Are your messages compact to improve the performance of the queue?](#subheading41) |
| &nbsp; | Queues |Bulk Retrieve |[Are you retrieving multiple messages in a single "Get" operation?](#subheading42) |
| &nbsp; | Queues |Polling Frequency |[Are you polling frequently enough to reduce the perceived latency of your application?](#subheading43) |
| &nbsp; | Queues |Update Message |[Are you using UpdateMessage to store progress in processing messages, avoiding having to reprocess the entire message if an error occurs?](#subheading44) |
| &nbsp; | Queues |Architecture |[Are you using queues to make your entire application more scalable by keeping long-running workloads out of the critical path and scale then independently?](#subheading45) |

## <a name="allservices"></a>All services

This section lists proven practices that are applicable to the use of any of the Azure Storage services (blobs, tables, queues, or files).  

### Scalability targets

Each of the Azure Storage services has scalability targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Azure Storage scalability and performance targets for storage accounts](storage-scalability-targets.md).

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes for some storage transactions. This section discusses how to design for scalability targets, and for bandwidth scalability targets in particular. Later sections that deal with individual storage services discuss scalability targets in the context of that specific service:  

* [Blob bandwidth and requests per second](#subheading16)
* [Table entities per second](#subheading24)
* [Queue messages per second](#subheading39)  

#### Approaching a scalability target

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

* Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks, as they handle VM disk scalability for you without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md)
* Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign role-based access control (RBAC) roles on a per-container basis. For more information, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).
* Are you using multiple storage accounts to shard to increase ingress, egress, IOPS, or capacity? In this scenario, Microsoft recommends that you take advantage of the increased limits for standard storage accounts to reduce the number of storage accounts required for your workload if possible. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/)

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

* If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](storage-account-overview.md).
* Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
* If an application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts have no cost other than your usage in terms of data stored, transactions made, or data transferred.
* If your application hits the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have some negative impacts. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Also be aware that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
* If your application hits the scalability targets, then make sure that you are using an exponential backoff for retries (see [Retries](#subheading14)).  It's best to avoid approaching the scalability targets by implementing the recommendations described in this article. Howver, using an exponential backoff for retries will prevent your application from retrying rapidly and making the throttling worse.  

### Partition naming convention

Azure Storage uses a range-based partitioning scheme to scale and load balance the system. The partition key (account+container+blob) is used to partition data into ranges and these ranges are load-balanced across the system. This means naming conventions such as lexical ordering (for example, *mypayroll*, *myperformance*, *myemployees*, etc.) or using timestamps (*log20160101*, *log20160102*, *log20160102*, etc.) will lend itself to the partitions being potentially co-located on the same partition server, until a load-balancing operation splits them out into smaller ranges. For example, all blobs within a container can be served by a single server until the load on these blobs requires further re-balancing of the partition ranges. Similarly, a group of lightly loaded accounts with their names arranged in lexical order may be served by a single server until the load on one or all of these accounts require them to be split across multiple partitions servers. Each load-balancing operation may impact the latency of storage calls during the operation. The system's ability to handle a sudden burst of traffic to a partition is limited by the scalability of a single partition server until the load-balancing operation kicks-in and re-balances the partition key range.

You can follow some best practices to reduce the frequency of such operations.  

* If possible, use larger Put Blob or Put Block sizes (greater than 4 MiB for standard accounts and greater than 256 KiB for premium accounts) to activate High-Throughput Block Blob (HTBB). HTBB provides high performance ingest that is not affected by partition naming.
* Examine the naming convention you use for accounts, containers, blobs, tables, and queues, closely. Consider prefixing account, container, or blob names with a 3-digit hash using a hashing function that best suits your needs.  
* If you organize your data using timestamps or numerical identifiers, you have to ensure you are not using an append-only (or prepend-only) traffic patterns. These patterns are not suitable for a range -based partitioning system, and could lead to all the traffic going to a single partition and limiting the system from effectively load balancing. For instance, if you have daily operations that use a blob object with a timestamp such as *yyyymmdd*, then all the traffic for that daily operation is directed to a single object, which is served by a single partition server. Look at whether the per blob limits and per partition limits meet your needs, and consider breaking this operation into multiple blobs if needed. Similarly, if you store time series data in your tables, all the traffic could be directed to the last part of the key namespace. If you must use timestamps or numerical IDs, prefix the ID with a 3-digit hash, or in the case of timestamps prefix the seconds part of the time such as *ssyyyymmdd*. If listing and querying operations are routinely performed, choose a hashing function that will limit your number of queries. In other cases, a random prefix may be sufficient.  
* For additional information on the partitioning scheme used in Azure Storage, see [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](https://sigops.org/sosp/sosp11/current/2011-Cascais/printable/11-calder.pdf).

### Networking

While the API calls matter, often the physical network constraints of the application have a significant impact on performance. The following describe some of limitations users may encounter.  

#### Client network capability

##### Throughput

For bandwidth, the problem is often the capabilities of the client. For example, while a single storage account can handle 10 Gbps or more of ingress (see [bandwidth scalability targets](#sub1bandwidth)), the network speed in a "Small" Azure Worker Role instance is only capable of approximately 100 Mbps. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VMs if you need higher network limits from a single machine. If you are accessing a Storage service from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.  

##### Link quality

As with any network usage, be aware that network conditions resulting in errors and packet loss will slow effective throughput.  Using WireShark or NetMon may help in diagnosing this issue.  

##### Useful resources

For more information about virtual machine sizes and allocated bandwidth, see [Windows VM sizes](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [Linux VM sizes](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

#### Location

In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure Web Site that uses Azure Storage, you should locate them both within a single region (for example, US West or Asia Southeast). This reduces the latency and the cost — at the time of writing, bandwidth usage within a single region is free.  

If your client applications are not hosted within Azure (such as mobile device apps or on premises enterprise services), then again placing the storage account in a region near to the devices that will access it, will generally reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then you should consider using multiple storage accounts: one located in a North American region and one in a European region. This will help to reduce latency for users in both regions. This approach is easier to implement if the data the application stores is specific to individual users, and does not require replicating data between storage accounts.  For broad content distribution, a CDN is recommended – see the next section for more details.  

### Content distribution

Sometimes, an application needs to serve the same content to many users (for example, a product demo video used in the home page of a website), located in either the same or multiple regions. In this scenario, you should use a Content Delivery Network (CDN) such as Azure CDN, and the CDN would use Azure storage as the origin of the data. Unlike an Azure Storage account that exists in a single region and that cannot deliver content with low latency to other regions, Azure CDN uses servers in multiple data centers around the world. Additionally, a CDN can typically support much higher egress limits than a single storage account.  

For more information about Azure CDN, see [Azure CDN](https://azure.microsoft.com/services/cdn/).  

### SAS and CORS

When you need to authorize code such as JavaScript in a user's web browser or a mobile phone app to access data in Azure Storage, one approach is to use an application in web role as a proxy: the user's device authenticates with the web role, which in turn authorizes access to storage resources. In this way, you can avoid exposing your storage account keys on insecure devices. However, this places a significant overhead on the web role because all the data transferred between the user's device and the storage service must pass through the web role. You can avoid using a web role as a proxy for the storage service by using Shared Access Signatures (SAS), sometimes in conjunction with Cross-Origin Resource Sharing headers (CORS). Using SAS, you can allow your user's device to make requests directly to a storage service by means of a limited access token. For example, if a user wants to upload a photo to your application, your web role can generate and send to the user's device a SAS token that grants permission to write to a specific blob or container for the next 30 minutes (after which the SAS token expires).

Normally, a browser will not allow JavaScript in a page hosted by a website on one domain to perform specific operations such as a "PUT" to another domain. For example, if you host a web role at "contosomarketing.cloudapp.net," and want to use client-side JavaScript to upload a blob to your storage account at "contosoproducts.blob.core.windows.net," the browsers "same origin policy" will forbid this operation. CORS is a browser feature that allows the target domain (in this case the storage account) to communicate to the browser that it trusts requests originating in the source domain (in this case the web role).  

Both of these technologies can help you avoid unnecessary load (and bottlenecks) on your web application.  

#### Useful resources

For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).  

For more information about CORS, see [Cross-Origin Resource Sharing (CORS) Support for the Azure Storage Services](https://msdn.microsoft.com/library/azure/dn535601.aspx).  

### Caching

#### Reading data

In general, reading data from a service once is better than getting it twice. Consider the example of an MVC web application running in a web role that has already retrieved a 50-MB blob from the storage service to serve as content to a user. The application could then retrieve that same blob every time a user requests it, or it could cache it locally to disk and reuse the cached version for subsequent user requests. Furthermore, whenever a user requests the data, the application could issue GET with a conditional header for modification time, which would avoid getting the entire blob if it hasn't been modified. You can apply this same pattern to working with table entities.  

In some cases, you may decide that your application can assume that the blob remains valid for a short period after retrieving it, and that during this period the application does not need to check if the blob was modified.

Configuration, lookup, and other data that are always used by the application are great candidates for caching.  

For more information about conditional downloads, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).  

#### Uploading data in batches

In some application scenarios, you can aggregate data locally, and then periodically upload it in a batch instead of uploading each piece of data immediately. For example, a web application might keep a log file of activities: the application could either upload details of every activity as it happens as a table entity (which requires many storage operations), or it could save activity details to a local log file, and then periodically upload all activity details as a delimited file to a blob. If each log entry is 1 KB in size, you can upload thousands in a single "Put Blob" transaction (you can upload a blob of up to 64 MB in size in a single transaction). If the local machine crashes prior to the upload, you will potentially lose some log data: the application developer must design for the possibility of client device or upload failures.  If the activity data needs to be downloaded for timespans (not just single activity), then blobs are recommended over tables.

### .NET configuration

If using the .NET Framework, this section lists several quick configuration settings that you can use to make significant performance improvements.  If using other languages, check to see if similar concepts apply in your chosen language.  

#### Increase default connection limit

In .NET, the following code increases the default connection limit (which is usually 2 in a client environment or 10 in a server environment) to 100. Typically, you should set the value to approximately the number of threads used by your application.  

```csharp
ServicePointManager.DefaultConnectionLimit = 100; //(Or More)  
```

You must set the connection limit before opening any connections.  

For other programming languages, see that language's documentation to determine how to set the connection limit.  

For more information, see the blog post [Web Services: Concurrent Connections](https://blogs.msdn.com/b/darrenj/archive/2005/03/07/386655.aspx).  

#### Increase minimum number of threads

If you are using synchronous calls together with asynchronous tasks, you may want to increase the number of threads in the thread pool:

```csharp
ThreadPool.SetMinThreads(100,100); //(Determine the right number for your application)  
```

For more information, see the [ThreadPool.SetMinThreads](/dotnet/api/system.threading.threadpool.setminthreads) method.  

#### <a name="subheading11"></a>Take advantage of .NET 4.5 and higher garbage collection

Use .NET 4.5 or later for the client application to take advantage of performance improvements in server garbage collection.

For more information, see the article [An Overview of Performance Improvements in .NET 4.5](https://msdn.microsoft.com/magazine/hh882452.aspx).  

### <a name="subheading12"></a>Unbounded parallelism

While parallelism can be great for performance, be careful about using unbounded parallelism (no limit on the number of threads and/or parallel requests) to upload or download data, using multiple workers to access multiple partitions (containers, queues, or table partitions) in the same storage account or to access multiple items in the same partition. If the parallelism is unbounded, your application can exceed the client device's capabilities or the storage account's scalability targets resulting in longer latencies and throttling.  

### <a name="subheading13"></a>Storage Client libraries and tools

Always use the latest Microsoft provided client libraries and tools. At the time of writing, there are client libraries available for .NET, Windows Phone, Windows Runtime, Java, and C++, as well as preview libraries for other languages. In addition, Microsoft has released PowerShell cmdlets and Azure CLI commands for working with Azure Storage. Microsoft actively develops these tools with performance in mind, keeps them up-to-date with the latest service versions, and ensures they handle many of the proven performance practices internally.  

### Retries

#### <a name="subheading14"></a>Throttling and server busy errors

In some cases, the storage service may throttle your application or may simply be unable to serve the request due to some transient condition and return a "503 Server busy" message or "500 Timeout".  This can happen if your application is approaching any of the scalability targets, or if the system is rebalancing your partitioned data to allow for higher throughput.  The client application should typically retry the operation that causes such an error: attempting the same request later can succeed. However, if the storage service is throttling your application because it is exceeding scalability targets, or even if the service was unable to serve the request for some other reason, aggressive retries usually make the problem worse. For this reason, you should use an exponential back off (the client libraries default to this behavior). For example, your application may retry after 2 seconds, then 4 seconds, then 10 seconds, then 30 seconds, and then give up completely. This behavior results in your application significantly reducing its load on the service rather than exacerbating any problems.  

Connectivity errors can be retried immediately, because they are not the result of throttling and are expected to be transient.  

#### <a name="subheading15"></a>Non-retryable errors

The client libraries are aware of which errors are retry-able and which are not. However, if you are writing your own code against the storage REST API, remember there are some errors that you should not retry: for example, a 400 (Bad Request) response indicates that the client application sent a request that could not be processed because it was not in an expected form. Resending this request will result the same response every time, so there is no point in retrying it. If you are writing your own code against the storage REST API, be aware of what the error codes mean and the proper way to retry (or not) for each of them.  

#### Useful resources

For more information about storage error codes, see [Status and Error Codes](https://msdn.microsoft.com/library/azure/dd179382.aspx) on the Microsoft Azure web site.  

## Blobs

In addition to the proven practices for [All Services](#allservices) described previously, the following proven practices apply specifically to the Blob service.  

### Blob-specific scalability targets

#### <a name="subheading46"></a>Multiple clients accessing a single object concurrently

If you have a large number of clients accessing a single object concurrently, you will need to consider per object and storage account scalability targets. The exact number of clients that can access a single object will vary depending on factors such as the number of clients requesting the object simultaneously, the size of the object, network conditions etc.

If the object can be distributed through a CDN such as images or videos served from a website, then you should use a CDN. See [here](#content-distribution).

In other scenarios such as scientific simulations where the data is confidential you have two options. The first is to stagger your workload's access such that the object is accessed over a period of time vs being accessed simultaneously. Alternatively, you can temporarily copy the object to multiple storage accounts thus increasing the total IOPS per object and across storage accounts. In limited testing, we found that around 25 VMs could simultaneously download a 100-GB blob in parallel (each VM was parallelizing the download using 32 threads). If you had 100 clients needing to access the object, first copy it to a second storage account and then have the first 50 VMs access the first blob and the second 50 VMs access the second blob. Results will vary depending on your applications behavior so you should test this during design. 

#### <a name="subheading16"></a>Bandwidth and operations per blob

You can read or write to a single blob at up to a maximum of 60 MB/second (this is approximately 480 Mbps, which exceeds the capabilities of many client-side networks (including the physical NIC on the client device). In addition, a single blob supports up to 500 requests per second. If you have multiple clients that need to read the same blob and you might exceed these limits, you should consider using a CDN for distributing the blob.  

For more information about target throughput for blobs, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).  

### Transferring blobs to and from Azure Storage

For information about efficiently transferring blobs to and from Azure Storage or between storage accounts, see [Choose an Azure solution for data transfer](../common/storage-choose-data-transfer-solution.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

### <a name="subheading20"></a>Use metadata

The Blob service supports head requests, which can include metadata about the blob. For example, if your application needed the EXIF data out of a photo, it could retrieve the photo and extract it. To save bandwidth and improve performance, your application could store the EXIF data in the blob's metadata when the application uploaded the photo: you can then retrieve the EXIF data in metadata using only a HEAD request, saving significant bandwidth, and the processing time needed to extract the EXIF data each time the blob is read. This would be useful in scenarios where you only need the metadata, and not the full content of a blob.  Only 8 KB of metadata can be stored per blob (the service will not accept a request to store more than that), so if the data does not fit in that size, you may not be able to use this approach.  

### Rapid uploading

To upload blobs quickly, the first question to answer is: are you uploading one blob or many?  Use the below guidance to determine the correct method to use depending on your scenario.  

#### <a name="subheading21"></a>Uploading one large blob quickly

To upload a single large blob quickly, your client application should upload its blocks or pages in parallel (being mindful of the scalability targets for individual blobs and the storage account as a whole).  The official Microsoft-provided RTM Storage Client libraries (.NET, Java) have the ability to do this.  For each of the libraries, use the below specified object/property to set the level of concurrency:  

* .NET: Set ParallelOperationThreadCount on a BlobRequestOptions object to be used.
* Java/Android: Use BlobRequestOptions.setConcurrentRequestCount()
* Node.js: Use parallelOperationThreadCount on either the request options or on the Blob service.
* C++: Use the blob_request_options::set_parallelism_factor method.

#### <a name="subheading22"></a>Uploading many blobs quickly

To upload many blobs quickly, upload blobs in parallel. This is faster than uploading single blobs at a time with parallel block uploads because it spreads the upload across multiple partitions of the storage service. A single blob only supports a throughput of 60 MB/second (approximately 480 Mbps). At the time of writing, a US-based LRS account supports up to 20-Gbps ingress, which is far more than the throughput supported by an individual blob.  [AzCopy](#subheading18) performs uploads in parallel by default, and is recommended for this scenario.  

### <a name="subheading23"></a>Choosing the correct type of blob

Azure Storage supports two types of blob: *page* blobs and *block* blobs. For a given usage scenario, your choice of blob type will affect the performance and scalability of your solution. Block blobs are appropriate when you want to upload large amounts of data efficiently: for example, a client application may need to upload photos or video to blob storage. Page blobs are appropriate if the application needs to perform random writes on the data: for example, Azure VHDs are stored as page blobs.  

For more information, see [Understanding Block Blobs, Append Blobs, and Page Blobs](https://msdn.microsoft.com/library/azure/ee691964.aspx).  


## Conclusion

This article discussed some of the most common, proven practices for optimizing performance when using Azure Storage. We encourage every application developer to assess their application against each of the above practices and consider acting on the recommendations to get great performance for their applications that use Azure Storage.
