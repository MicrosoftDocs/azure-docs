---
title: Azure Storage performance and scalability checklist - Azure Storage
description: A checklist of proven practices for use with all Azure Storage services in developing high-performance applications.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: common
---

# Azure Storage performance and scalability checklist

Microsoft has developed a number of proven practices for developing high-performance applications. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your application. The proven practices in this article are applicable to all of the Azure Storage services (blobs, tables, queues, and files).

For proven practices specific to each Azure Storage service, see:

- [Performance and scalability checklist for Blob storage](../blobs/storage-performance-checklist-blobs.md)
- [Performance and scalability checklist for Queue storage](../queues/storage-performance-checklist-queues.md)
- [Performance and scalability checklist for Table storage](../tables/storage-performance-checklist-tables.md)

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; |Scalability Targets |[Is your application designed to avoid approaching the scalability targets?](#scalability-targets) |
| &nbsp; |Networking |[Do client-side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; |Networking |[Do client-side devices have a high quality network link?](#link-quality) |
| &nbsp; |Networking |[Is the client application in the same region as the storage account?](#location) |
| &nbsp; |Direct Client Access |[Are you using shared access signatures (SAS) and cross-origin resource sharing (CORS) to enable direct access to Azure Storage?](#sas-and-cors) |
| &nbsp; |Caching |[Is your application caching data that is frequently accessed and rarely changed?](#reading-data) |
| &nbsp; |Caching |[Is your application batching updates by caching them on the client and then uploading them in larger sets?](#uploading-data-in-batches) |
| &nbsp; |.NET Configuration |[Are you using .NET Core 2.1 or later for optimum performance?](#use-net-core) |
| &nbsp; |.NET Configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; |.NET Configuration |[For .NET applications, have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload your client's capabilities or approach the scalability targets?](#unbounded-parallelism) |
| &nbsp; |Tools |[Are you using the latest versions of Microsoft-provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; |Retries |[Are you using a retry policy with an exponential backoff for throttling errors and timeouts?](#throttling-and-server-busy-errors) |
| &nbsp; |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |

## Scalability targets

Each of the Azure Storage services has scalability targets for capacity, transaction rate, and bandwidth. Scalability and performance targets varies by service and region. For more information about Azure Storage scalability targets, see [Azure Storage scalability and performance targets for storage accounts](storage-scalability-targets.md).

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes for some storage transactions. This section discusses how to design for scalability targets, and for bandwidth scalability targets in particular. Later sections that deal with individual storage services discuss scalability targets in the context of that specific service:  

- Blob bandwidth and requests per second
- Table entities per second
- Queue messages per second  

### Approaching the maximum number of storage accounts

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

- Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks. Managed disks scale for you automatically and without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md)
- Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign role-based access control (RBAC) roles on a per-container basis. For more information, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).
- Are you using multiple storage accounts to shard to increase ingress, egress, IOPS, or capacity? In this scenario, Microsoft recommends that you take advantage of increased limits for standard storage accounts to reduce the number of storage accounts required for your workload if possible. Contact [Azure Support](https://azure.microsoft.com/support/options/) to request increased limits for your storage account. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/).

### Approaching capacity or transaction targets

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](storage-account-overview.md).
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If your application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts themselves have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application is approaching the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have negative effects on performance. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Also be aware that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application is approaching the scalability targets, then make sure that you are using an exponential backoff for retries (see [Retries](#retries)).  It's best to try to avoid hitting the scalability targets by implementing the recommendations described in this article. However, using an exponential backoff for retries will prevent your application from retrying rapidly, which could make throttling worse.  

## Networking

The physical network constraints of the application may have a significant impact on performance. The following sections describe some of limitations users may encounter.  

### Client network capability

Bandwidth and the quality of the network link play important roles in application performance, as described in the following sections.

#### Throughput

For bandwidth, the problem is often the capabilities of the client. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VMs if you need higher network limits from a single machine. If you are accessing Azure Storage from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.

#### Link quality

As with any network usage, be aware that network conditions resulting in errors and packet loss will slow effective throughput.  Using WireShark or NetMon may help in diagnosing this issue.  

### Location

In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure web app that uses Azure Storage, then locate them both within a single region, such as US West or Asia Southeast. This reduces the latency and the cost — at the time of writing, bandwidth usage within a single region is free.  

If your client applications are not hosted within Azure (such as mobile device apps or on premises enterprise services), then again placing the storage account in a region near to the devices that will access it, will generally reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then you should consider using multiple storage accounts: one located in a North American region and one in a European region. This will help to reduce latency for users in both regions. This approach is easier to implement if the data the application stores is specific to individual users, and does not require replicating data between storage accounts.

For broad distribution of blob content, use a content deliver network such as Azure CDN. For more information about Azure CDN, see [Azure CDN](../../cdn/cdn-overview.md).  

## SAS and CORS

When you need to authorize code such as JavaScript in a user's web browser or a mobile phone app to access data in Azure Storage, one approach is to use a service application as a proxy. The user's device authenticates with the service, which in turn authorizes access to Azure Storage resources. In this way, you can avoid exposing your storage account keys on insecure devices. However, this approach places a significant overhead on the service application because all the data transferred between the user's device and Azure Storage must pass through the web role.

You can avoid using a service application as a proxy for Azure Storage by using Shared Access Signatures (SAS), sometimes in conjunction with Cross-Origin Resource Sharing headers (CORS). Using SAS, you can allow your user's device to make requests directly to Azure Storage by means of a limited access token. For example, if a user wants to upload a photo to your application, then your service application can generate and send to the user's device a SAS token that grants permission to write to a specific blob or container for a specified interval (after which the SAS token expires). For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](storage-sas-overview.md).  

Typically, a browser will not allow JavaScript in a page hosted by a website on one domain to perform certain operations, such as PUT operations, to another domain. Cross-origin resource sharing (CORS) is a browser feature that allows the target domain (in this case the storage account) to communicate to the browser that it trusts requests originating in the source domain (in this case the web role). For more information about CORS, see [Cross-origin resource sharing (CORS) support for Azure Storage](/rest/api/storageservices/Cross-Origin-Resource-Sharing--CORS--Support-for-the-Azure-Storage-Services).  
  
Both SAS and CORS can help you avoid unnecessary load (and bottlenecks) on your web application.  

## Caching

Caching plays an important role in performance. The following sections discuss caching best practices.

### Reading data

In general, reading data once is preferable to reading it twice. Consider the example of a web application that has retrieved a 50 MiB blob from the Azure Storage to serve as content to a user. Ideally, the application caches the blob locally to disk and retrieve the cached version for subsequent user requests.

One way to avoid retrieving a blob if it hasn't been modified since it was cached is to qualify the GET operation with a conditional header for modification time. If the last modified time is after the time that the blob was cached, then the blob is retrieved and re-cached. Otherwise, the cached blob is retrieved for optimal performance.

You may also decide to design your application to assume that the blob remains valid for a short period after retrieving it. In this case, the application does not need to check whether the blob was modified during that interval.

Configuration data, lookup data, and other data that is frequently used by the application are good candidates for caching.  

For more information about using conditional headers, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).  

### Uploading data in batches

In some scenarios, you can aggregate data locally, and then periodically upload it in a batch instead of uploading each piece of data immediately. For example, suppose a web application keeps a log file of activities. The application can either upload details of every activity as it happens to a table (which requires many storage operations), or it can save activity details to a local log file and then periodically upload all activity details as a delimited file to a blob. If each log entry is 1 KB in size, you can upload thousands of entries in a single transaction. A single transaction supports uploading a blob of up to 64 MiB in size. The application developer must design for the possibility of client device or upload failures. If the activity data needs to be downloaded for an interval of time rather than for a single activity, then using Blob storage is recommended over Table storage.

## .NET configuration

If using the .NET Framework, this section lists several quick configuration settings that you can use to make significant performance improvements.  If using other languages, check to see if similar concepts apply in your chosen language.  

### Use .NET Core

Develop your Azure Storage applications with .NET Core 2.1 or later to take advantage of performance enhancements. Using .NET Core 3.x is recommended when possible.

For more information on performance improvements in .NET Core, see the following blog posts:

- [Performance Improvements in .NET Core 3.0](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-core-3-0/)
- [Performance Improvements in .NET Core 2.1](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-core-2-1/)

### Increase default connection limit

In .NET, the following code increases the default connection limit (which is usually 2 in a client environment or 10 in a server environment) to 100. Typically, you should set the value to approximately the number of threads used by your application.  

```csharp
ServicePointManager.DefaultConnectionLimit = 100; //(Or More)  
```

You must set the connection limit before opening any connections.  

For other programming languages, see that language's documentation to determine how to set the connection limit.  

For more information, see the blog post [Web Services: Concurrent Connections](https://blogs.msdn.microsoft.com/darrenj/2005/03/07/web-services-concurrent-connections/).  

### Increase minimum number of threads

If you are using synchronous calls together with asynchronous tasks, you may want to increase the number of threads in the thread pool:

```csharp
ThreadPool.SetMinThreads(100,100); //(Determine the right number for your application)  
```

For more information, see the [ThreadPool.SetMinThreads](/dotnet/api/system.threading.threadpool.setminthreads) method.  

## Unbounded parallelism

While parallelism can be great for performance, be careful about using unbounded parallelism (no limit on the number of threads and/or parallel requests) to upload or download data, using multiple workers to access multiple partitions (containers, queues, or table partitions) in the same storage account or to access multiple items in the same partition. If the parallelism is unbounded, your application can exceed the client device's capabilities or the storage account's scalability targets resulting in longer latencies and throttling.  

## Client libraries and tools

For best performance, always use the latest client libraries and tools provided by Microsoft. Azure Storage client libraries are available for a variety of languages. Azure Storage also supports PowerShell and Azure CLI. Microsoft actively develops these client libraries and tools with performance in mind, keeps them up to date with the latest service versions, and ensures that they handle many of the proven performance practices internally. For more information, see the [Azure Storage reference documentation](/azure/storage/#reference).

## Handling service errors

Azure Storage returns an error when the service cannot process a request. Understanding the errors that may be returned by Azure Storage in a given scenario is helpful for optimizing performance.

### Timeout and Server Busy errors

Azure Storage may throttle your application if it approaches the scalability limits. In some cases, Azure Storage may be unable to handle a request due to some transient condition. In both cases, the service may return a 503 (Server Busy) or 500 (Timeout) error. These errors can also occur if the service is re-balancing data partitions to allow for higher throughput. The client application should typically retry the operation that causes one of these errors. However, if Azure Storage is throttling your application because it is exceeding scalability targets, or even if the service was unable to serve the request for some other reason, aggressive retries may make the problem worse. Using an exponential back off retry policy is recommended, and the client libraries default to this behavior. For example, your application may retry after 2 seconds, then 4 seconds, then 10 seconds, then 30 seconds, and then give up completely. In this way, your application significantly reduces its load on the service, rather than exacerbating behavior that could lead to throttling.  

Connectivity errors can be retried immediately, because they are not the result of throttling and are expected to be transient.  

### Non-retryable errors

The client libraries handle retries with an awareness of which errors can be retried and which can not. However, if you are calling the Azure Storage REST API directly, there are some errors that you should not retry. For example, a 400 (Bad Request) error indicates that the client application sent a request that could not be processed because it was not in the expected form. Resending this request results the same response every time, so there is no point in retrying it. If you are calling the Azure Storage REST API directly, be aware of potential errors and whether they should be retried.

For more information on Azure Storage error codes, see [Status and error codes](/rest/api/storageservices/status-and-error-codes2).

## Next steps

- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)
- [Performance and scalability checklist for Blob storage](../blobs/storage-performance-checklist-blobs.md)
- [Performance and scalability checklist for Queue storage](../queues/storage-performance-checklist-queues.md)
- [Performance and scalability checklist for Table storage](../tables/storage-performance-checklist-tables.md)
