---
title: Performance and scalability checklist for Queue storage - Azure Storage
description: A checklist of proven practices for use with Queue storage in developing high-performance applications.
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/10/2019
ms.author: tamram
ms.subservice: queues
---

# Performance and scalability checklist for Queue storage

Microsoft has developed a number of proven practices for developing high-performance applications with Queue storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

Azure Storage has scalability and performance targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) and [Scalability and performance targets for Queue storage](scalability-targets.md).

## Checklist

This article organizes proven practices for performance into a checklist you can follow while developing your Queue storage application.

| Done | Category | Design consideration |
| --- | --- | --- |
| &nbsp; |Scalability targets |[Can you design your application to use no more than the maximum number of storage accounts?](#maximum-number-of-storage-accounts) |
| &nbsp; |Scalability targets |[Are you avoiding approaching capacity and transaction limits?](#capacity-and-transaction-targets) |
| &nbsp; |Networking |[Do client-side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#throughput) |
| &nbsp; |Networking |[Do client-side devices have a high quality network link?](#link-quality) |
| &nbsp; |Networking |[Is the client application in the same region as the storage account?](#location) |
| &nbsp; |Direct Client Access |[Are you using shared access signatures (SAS) and cross-origin resource sharing (CORS) to enable direct access to Azure Storage?](#sas-and-cors) |
| &nbsp; |.NET configuration |[Are you using .NET Core 2.1 or later for optimum performance?](#use-net-core) |
| &nbsp; |.NET configuration |[Have you configured your client to use a sufficient number of concurrent connections?](#increase-default-connection-limit) |
| &nbsp; |.NET configuration |[For .NET applications, have you configured .NET to use a sufficient number of threads?](#increase-minimum-number-of-threads) |
| &nbsp; |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload your client's capabilities or approach the scalability targets?](#unbounded-parallelism) |
| &nbsp; |Tools |[Are you using the latest versions of Microsoft-provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; |Retries |[Are you using a retry policy with an exponential backoff for throttling errors and timeouts?](#timeout-and-server-busy-errors) |
| &nbsp; |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |
| &nbsp; |Configuration |[Have you turned off the Nagle algorithm to improve the performance of small requests?](#disable-nagle) |
| &nbsp; |Message size |[Are your messages compact to improve the performance of the queue?](#message-size) |
| &nbsp; |Bulk retrieval |[Are you retrieving multiple messages in a single GET operation?](#batch-retrieval) |
| &nbsp; |Polling frequency |[Are you polling frequently enough to reduce the perceived latency of your application?](#queue-polling-interval) |
| &nbsp; |Update Message |[Are you using the Update Message operation to store progress in processing messages, so that you can avoid having to reprocess the entire message if an error occurs?](#use-update-message) |
| &nbsp; |Architecture |[Are you using queues to make your entire application more scalable by keeping long-running workloads out of the critical path and scale then independently?](#application-architecture) |

## Scalability targets

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes. Avoiding these errors by staying within the limits of the scalability targets is an important part of enhancing your application's performance.

For more information about scalability targets for the Queue service, see [Azure Storage scalability and performance targets](/azure/storage/queues/scalability-targets#scale-targets-for-queue-storage).

### Maximum number of storage accounts

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, are you using multiple storage accounts to shard to increase ingress, egress, I/O operations per second (IOPS), or capacity? In this scenario, Microsoft recommends that you take advantage of increased limits for storage accounts to reduce the number of storage accounts required for your workload if possible. Contact [Azure Support](https://azure.microsoft.com/support/options/) to request increased limits for your storage account. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/).

### Capacity and transaction targets

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- If the scalability targets for queues are insufficient for your application, then use multiple queues and distribute messages across them.
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If your application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts themselves have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application is approaching the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have negative effects on performance. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Keep in mind that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application is approaching the scalability targets, then make sure that you are using an exponential backoff for retries. It's best to try to avoid reaching the scalability targets by implementing the recommendations described in this article. However, using an exponential backoff for retries will prevent your application from retrying rapidly, which could make throttling worse. For more information, see the section titled [Timeout and Server Busy errors](#timeout-and-server-busy-errors).

## Networking

The physical network constraints of the application may have a significant impact on performance. The following sections describe some of limitations users may encounter.  

### Client network capability

Bandwidth and the quality of the network link play important roles in application performance, as described in the following sections.

#### Throughput

For bandwidth, the problem is often the capabilities of the client. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VMs if you need higher network limits from a single machine. If you are accessing Azure Storage from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.

#### Link quality

As with any network usage, keep in mind that network conditions resulting in errors and packet loss will slow effective throughput.  Using WireShark or NetMon may help in diagnosing this issue.  

### Location

In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure web app that uses Azure Storage, then locate them both within a single region, such as US West or Asia Southeast. Co-locating resources reduces the latency and the cost, as bandwidth usage within a single region is free.  

If client applications will access Azure Storage but are not hosted within Azure, such as mobile device apps or on premises enterprise services, then locating the storage account in a region near to those clients may reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then consider using one storage account per region. This approach is easier to implement if the data the application stores is specific to individual users, and does not require replicating data between storage accounts.

## SAS and CORS

Suppose that you need to authorize code such as JavaScript that is running in a user's web browser or in a mobile phone app to access data in Azure Storage. One approach is to build a service application that acts as a proxy. The user's device authenticates with the service, which in turn authorizes access to Azure Storage resources. In this way, you can avoid exposing your storage account keys on insecure devices. However, this approach places a significant overhead on the service application, because all of the data transferred between the user's device and Azure Storage must pass through the service application.

You can avoid using a service application as a proxy for Azure Storage by using shared access signatures (SAS). Using SAS, you can enable your user's device to make requests directly to Azure Storage by using a limited access token. For example, if a user wants to upload a photo to your application, then your service application can generate a SAS and send it to the user's device. The SAS token can grant permission to write to an Azure Storage resource for a specified interval of time, after which the SAS token expires. For more information about SAS, see [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md).  

Typically, a web browser will not allow JavaScript in a page that is hosted by a website on one domain to perform certain operations, such as write operations, to another domain. Known as the same-origin policy, this policy prevents a malicious script on one page from obtaining access to data on another web page. However, the same-origin policy can be a limitation when building a solution in the cloud. Cross-origin resource sharing (CORS) is a browser feature that enables the target domain to communicate to the browser that it trusts requests originating in the source domain.

For example, suppose a web application running in Azure makes a request for a resource to an Azure Storage account. The web application is the source domain, and the storage account is the target domain. You can configure CORS for any of the Azure Storage services to communicate to the web browser that requests from the source domain are trusted by Azure Storage. For more information about CORS, see [Cross-origin resource sharing (CORS) support for Azure Storage](/rest/api/storageservices/Cross-Origin-Resource-Sharing--CORS--Support-for-the-Azure-Storage-Services).  
  
Both SAS and CORS can help you avoid unnecessary load on your web application.  

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

Set the connection limit before opening any connections.  

For other programming languages, see that language's documentation to determine how to set the connection limit.  

For more information, see the blog post [Web Services: Concurrent Connections](https://blogs.msdn.microsoft.com/darrenj/2005/03/07/web-services-concurrent-connections/).  

### Increase minimum number of threads

If you are using synchronous calls together with asynchronous tasks, you may want to increase the number of threads in the thread pool:

```csharp
ThreadPool.SetMinThreads(100,100); //(Determine the right number for your application)  
```

For more information, see the [ThreadPool.SetMinThreads](/dotnet/api/system.threading.threadpool.setminthreads) method.  

## Unbounded parallelism

While parallelism can be great for performance, be careful about using unbounded parallelism, meaning that there is no limit enforced on the number of threads or parallel requests. Be sure to limit parallel requests to upload or download data, to access multiple partitions in the same storage account, or to access multiple items in the same partition. If parallelism is unbounded, your application can exceed the client device's capabilities or the storage account's scalability targets, resulting in longer latencies and throttling.  

## Client libraries and tools

For best performance, always use the latest client libraries and tools provided by Microsoft. Azure Storage client libraries are available for a variety of languages. Azure Storage also supports PowerShell and Azure CLI. Microsoft actively develops these client libraries and tools with performance in mind, keeps them up-to-date with the latest service versions, and ensures that they handle many of the proven performance practices internally. For more information, see the [Azure Storage reference documentation](/azure/storage/#reference).

## Handle service errors

Azure Storage returns an error when the service cannot process a request. Understanding the errors that may be returned by Azure Storage in a given scenario is helpful for optimizing performance.

### Timeout and Server Busy errors

Azure Storage may throttle your application if it approaches the scalability limits. In some cases, Azure Storage may be unable to handle a request due to some transient condition. In both cases, the service may return a 503 (Server Busy) or 500 (Timeout) error. These errors can also occur if the service is rebalancing data partitions to allow for higher throughput. The client application should typically retry the operation that causes one of these errors. However, if Azure Storage is throttling your application because it is exceeding scalability targets, or even if the service was unable to serve the request for some other reason, aggressive retries may make the problem worse. Using an exponential back off retry policy is recommended, and the client libraries default to this behavior. For example, your application may retry after 2 seconds, then 4 seconds, then 10 seconds, then 30 seconds, and then give up completely. In this way, your application significantly reduces its load on the service, rather than exacerbating behavior that could lead to throttling.  

Connectivity errors can be retried immediately, because they are not the result of throttling and are expected to be transient.  

### Non-retryable errors

The client libraries handle retries with an awareness of which errors can be retried and which cannot. However, if you are calling the Azure Storage REST API directly, there are some errors that you should not retry. For example, a 400 (Bad Request) error indicates that the client application sent a request that could not be processed because it was not in the expected form. Resending this request results the same response every time, so there is no point in retrying it. If you are calling the Azure Storage REST API directly, be aware of potential errors and whether they should be retried.

For more information on Azure Storage error codes, see [Status and error codes](/rest/api/storageservices/status-and-error-codes2).

## Disable Nagle

Nagle's algorithm is widely implemented across TCP/IP networks as a means to improve network performance. However, it is not optimal in all circumstances (such as highly interactive environments). Nagle's algorithm has a negative impact on the performance of requests to the Azure Table service, and you should disable it if possible.

## Message size

Queue performance and scalability decrease as message size increases. Put only the information the receiver needs in a message.  

## Batch retrieval

You can retrieve up to 32 messages from a queue in a single operation. Batch retrieval can reduce the number of roundtrips from the client application, which is especially useful for environments, such as mobile devices, with high latency.  

## Queue polling interval

Most applications poll for messages from a queue, which can be one of the largest sources of transactions for that application. Select your polling interval wisely: polling too frequently could cause your application to approach the scalability targets for the queue. However, at 200,000 transactions for $0.01 (at the time of writing), a single processor polling once every second for a month would cost less than 15 cents so cost is not typically a factor that affects your choice of polling interval.  

For up-to-date cost information, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).  

## Use Update Message

You can use the **Update Message** operation to increase the invisibility timeout or to update the state information of a message. Using **Update Message** can be a more efficient approach than having a workflow that passes a job from one queue to the next, as each step of the job is completed. Your application can save the job state to the message and then continue working, instead of requeuing the message for the next step of the job every time a step completes. Keep in mind that each **Update Message** operation counts towards the scalability target.

## Application architecture

Use queues to make your application architecture scalable. The following lists some ways you can use queues to make your application more scalable:  

- You can use queues to create backlogs of work for processing and smooth out workloads in your application. For example, you could queue up requests from users to perform processor intensive work such as resizing uploaded images.
- You can use queues to decouple parts of your application so that you can scale them independently. For example, a web front end could place survey results from users into a queue for later analysis and storage. You could add more worker role instances to process the queue data as required.  

## Next steps

- [Scalability and performance targets for Queue storage](scalability-targets.md)
- [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)
