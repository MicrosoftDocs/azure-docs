---
title: Managing concurrency
titleSuffix: Azure Storage
description: Learn how to manage concurrency in Azure Storage for the Blob, Queue, Table, and File services. Understand the three main data concurrency strategies used.
services: storage
author: tamram

ms.service: storage
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 09/24/2020
ms.author: tamram
ms.subservice: common
ms.custom: devx-track-csharp
---

# Managing Concurrency in Microsoft Azure Storage

Modern Internet-based applications typically have multiple users viewing and updating data simultaneously. This requires application developers to think carefully about how to provide a predictable experience to their end users, particularly for scenarios where multiple users can update the same data. There are three main data concurrency strategies that developers typically consider:  

1. Optimistic concurrency – An application performing an update will as part of its update verify if the data has changed since the application last read that data. For example, if two users viewing a wiki page make an update to the same page then the wiki platform must ensure that the second update does not overwrite the first update – and that both users understand whether their update was successful or not. This strategy is most often used in web applications.
2. Pessimistic concurrency – An application looking to perform an update will take a lock on an object preventing other users from updating the data until the lock is released. For example, in a master/subordinate data replication scenario where only the master will perform updates the master will typically hold an exclusive lock for an extended period of time on the data to ensure no one else can update it.
3. Last writer wins – An approach that allows any update operations to proceed without verifying if any other application has updated the data since the application first read the data. This strategy (or lack of a formal strategy) is usually used where data is partitioned in such a way that there is no likelihood that multiple users will access the same data. It can also be useful where short-lived data streams are being processed.  

This article provides an overview of how the Azure Storage platform simplifies development by providing first class support for all three of these concurrency strategies.  

## Azure Storage simplifies cloud development

The Azure storage service supports all three strategies, although it is distinctive in its ability to provide full support for optimistic and pessimistic concurrency because it was designed to embrace a strong consistency model which guarantees that when the Storage service commits a data insert or update operation all further accesses to that data will see the latest update. Storage platforms that use an eventual consistency model have a lag between when a write is performed by one user and when the updated data can be seen by other users thus complicating development of client applications in order to prevent inconsistencies from affecting end users.  

In addition to selecting an appropriate concurrency strategy developers should also be aware of how a storage platform isolates changes – particularly changes to the same object across transactions. The Azure storage service uses snapshot isolation to allow read operations to happen concurrently with write operations within a single partition. Unlike other isolation levels, snapshot isolation guarantees that all reads see a consistent snapshot of the data even while updates are occurring – essentially by returning the last committed values while an update transaction is being processed.  

## Managing Concurrency in the Queue Service

One scenario in which concurrency is a concern in the queueing service is where multiple clients are retrieving messages from a queue. When a message is retrieved from the queue, the response includes the message and a pop receipt value, which is required to delete the message. The message is not automatically deleted from the queue, but after it has been retrieved, it is not visible to other clients for the time interval specified by the visibilitytimeout parameter. The client that retrieves the message is expected to delete the message after it has been processed, and before the time specified by the TimeNextVisible element of the response, which is calculated based on the value of the visibilitytimeout parameter. The value of visibilitytimeout is added to the time at which the message is retrieved to determine the value of TimeNextVisible.  

The queue service does not have support for either optimistic or pessimistic concurrency and for this reason clients processing messages retrieved from a queue should ensure messages are processed in an idempotent manner. A last writer wins strategy is used for update operations such as SetQueueServiceProperties, SetQueueMetaData, SetQueueACL and UpdateMessage.  

For more information, see:  

* [Queue Service REST API](https://msdn.microsoft.com/library/azure/dd179363.aspx)
* [Get Messages](https://msdn.microsoft.com/library/azure/dd179474.aspx)  

## Next steps

For the complete sample application referenced in this blog:  

* [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114)  

For more information on Azure Storage see:  

* [Microsoft Azure Storage Home Page](https://azure.microsoft.com/services/storage/)
* [Introduction to Azure Storage](storage-introduction.md)
* Storage Getting Started for [Blob](../blobs/storage-dotnet-how-to-use-blobs.md), [Table](../../cosmos-db/table-storage-how-to-use-dotnet.md),  [Queues](../storage-dotnet-how-to-use-queues.md), and [Files](../storage-dotnet-how-to-use-files.md)
* Storage Architecture – [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](https://docs.microsoft.com/archive/blogs/windowsazurestorage/sosp-paper-windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency)

