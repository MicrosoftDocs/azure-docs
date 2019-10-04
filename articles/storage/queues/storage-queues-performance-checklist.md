---
title: Azure Queues performance and scalability checklist - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/04/2019
ms.author: tamram
ms.subservice: tables
---

# Azure Queues performance and scalability checklist

In addition to the proven practices for [All Services](#allservices) described previously, the following proven practices apply specifically to the queue service.  

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your application. Proven practices applicable to:  

* All Azure Storage services (blobs, tables, queues, and files)
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
| &nbsp; | All Services |.NET Configuration |[Are you using .NET 4.5 or later, which has improved garbage collection?](##take-advantage-of-improved-garbage-collection) |
| &nbsp; | All Services |Parallelism |[Have you ensured that parallelism is bounded appropriately so that you don't overload either your client capabilities or the scalability targets?](#unbounded-parallelism) |
| &nbsp; | All Services |Tools |[Are you using the latest version of Microsoft provided client libraries and tools?](#client-libraries-and-tools) |
| &nbsp; | All Services |Retries |[Are you using an exponential backoff retry policy for throttling errors and timeouts?](#throttling-and-server-busy-errors) |
| &nbsp; | All Services |Retries |[Is your application avoiding retries for non-retryable errors?](#non-retryable-errors) |
| &nbsp; | Queues |Scalability Targets |[Are you approaching the scalability targets for messages per second?](#scalability-limits) |
| &nbsp; | Queues |Configuration |[Have you turned off the Nagle algorithm to improve the performance of small requests?](#disable-nagle) |
| &nbsp; | Queues |Message Size |[Are your messages compact to improve the performance of the queue?](#message-size) |
| &nbsp; | Queues |Bulk Retrieve |[Are you retrieving multiple messages in a single GET operation?](#batch-retrieval) |
| &nbsp; | Queues |Polling Frequency |[Are you polling frequently enough to reduce the perceived latency of your application?](#queue-polling-interval) |
| &nbsp; | Queues |Update Message |[Are you using the Update Message operation to store progress in processing messages, so that you can avoid having to reprocess the entire message if an error occurs?](#update-message) |
| &nbsp; | Queues |Architecture |[Are you using queues to make your entire application more scalable by keeping long-running workloads out of the critical path and scale then independently?](#application-architecture) |

## Scalability limits

A single queue can process approximately 2,000 messages (1 KB each) per second (each AddMessage, GetMessage, and DeleteMessage count as a message here). If this is insufficient for your application, you should use multiple queues and spread the messages across them.  

For more information about scalability targets, see [Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md).  

## Disable Nagle

Nagle's algorithm is widely implemented across TCP/IP networks as a means to improve network performance. However, it is not optimal in all circumstances (such as highly interactive environments). Nagle's algorithm has a negative impact on the performance of requests to the Azure Table service, and you should disable it if possible.

## Message size

Queue performance and scalability decrease as message size increases. You should place only the information the receiver needs in a message.  

## Batch retrieval

You can retrieve up to 32 messages from a queue in a single operation. This can reduce the number of roundtrips from the client application, which is especially useful for environments, such as mobile devices, with high latency.  

## Queue polling interval

Most applications poll for messages from a queue, which can be one of the largest sources of transactions for that application. Select your polling interval wisely: polling too frequently could cause your application to approach the scalability targets for the queue. However, at 200,000 transactions for $0.01 (at the time of writing), a single processor polling once every second for a month would cost less than 15 cents so cost is not typically a factor that affects your choice of polling interval.  

For up-to-date cost information, see [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/).  

## Update message

You can use the **Update Message** operation to increase the invisibility timeout or to update state information of a message. While this is powerful, remember that each **Update Message** operation counts towards the scalability target. However, this can be a much more efficient approach than having a workflow that passes a job from one queue to the next, as each step of the job is completed. Using the **Update Message** operation allows your application to save the job state to the message and then continue working, instead of requeuing the message for the next step of the job every time a step completes.  

For more information, see the article [How to: Change the contents of a queued message](../queues/storage-dotnet-how-to-use-queues.md#change-the-contents-of-a-queued-message).  

## Application architecture

Use queues to make your application architecture scalable. The following lists some ways you can use queues to make your application more scalable:  

* You can use queues to create backlogs of work for processing and smooth out workloads in your application. For example, you could queue up requests from users to perform processor intensive work such as resizing uploaded images.
* You can use queues to decouple parts of your application so that you can scale them independently. For example, a web front end could place survey results from users into a queue for later analysis and storage. You could add more worker role instances to process the queue data as required.  

## Next steps

[Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md)
