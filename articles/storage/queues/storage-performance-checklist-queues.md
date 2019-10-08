---
title: Performance and scalability checklist for Queue storage - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/04/2019
ms.author: tamram
ms.subservice: tables
---

# Performance and scalability checklist for Queue storage

Microsoft has developed a number of proven practices for developing high-performance applications with Queue storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your Queue storage application. For proven practices that are generally applicable to all of the Azure Storage services, see [Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md).

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; | Queues |Scalability Targets |[Are you approaching the scalability targets for messages per second?](#scalability-limits) |
| &nbsp; | Queues |Configuration |[Have you turned off the Nagle algorithm to improve the performance of small requests?](#disable-nagle) |
| &nbsp; | Queues |Message Size |[Are your messages compact to improve the performance of the queue?](#message-size) |
| &nbsp; | Queues |Bulk Retrieve |[Are you retrieving multiple messages in a single GET operation?](#batch-retrieval) |
| &nbsp; | Queues |Polling Frequency |[Are you polling frequently enough to reduce the perceived latency of your application?](#queue-polling-interval) |
| &nbsp; | Queues |Update Message |[Are you using the Update Message operation to store progress in processing messages, so that you can avoid having to reprocess the entire message if an error occurs?](#update-message) |
| &nbsp; | Queues |Architecture |[Are you using queues to make your entire application more scalable by keeping long-running workloads out of the critical path and scale then independently?](#application-architecture) |

## Scalability targets

Each of the Azure Storage services has scalability targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Azure Storage scalability and performance targets for storage accounts](storage-scalability-targets.md).

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes for some storage transactions. This section discusses how to design for scalability targets, and for bandwidth scalability targets in particular. Later sections that deal with individual storage services discuss scalability targets in the context of that specific service:  

- Queue messages per second  

### Approaching a scalability target

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

- Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks, as they handle VM disk scalability for you without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md)
- Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign role-based access control (RBAC) roles on a per-container basis. For more information, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).
- Are you using multiple storage accounts to shard to increase ingress, egress, IOPS, or capacity? In this scenario, Microsoft recommends that you take advantage of the increased limits for standard storage accounts to reduce the number of storage accounts required for your workload if possible. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/)

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](storage-account-overview.md).
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If an application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application hits the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have some negative impacts. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Also be aware that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
-If your application hits the scalability targets, then make sure that you are using an exponential backoff for retries.  It's best to avoid approaching the scalability targets by implementing the recommendations described in this article. However, using an exponential backoff for retries will prevent your application from retrying rapidly and making the throttling worse. For more information, see the section titled **Retries** in [Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md#content-distribution?toc=%2fazure%2fstorage%2fqueues%2ftoc.json).  


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

- You can use queues to create backlogs of work for processing and smooth out workloads in your application. For example, you could queue up requests from users to perform processor intensive work such as resizing uploaded images.
- You can use queues to decouple parts of your application so that you can scale them independently. For example, a web front end could place survey results from users into a queue for later analysis and storage. You could add more worker role instances to process the queue data as required.  

## Next steps

- [Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)
