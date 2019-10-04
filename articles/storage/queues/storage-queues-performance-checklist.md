---
title: Azure Queues performance and scalability checklist - Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.topic: overview
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: tables
---

# Azure Queues performance and scalability checklist

In addition to the proven practices for [All Services](#allservices) described previously, the following proven practices apply specifically to the queue service.  

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
