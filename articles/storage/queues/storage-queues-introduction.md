---
title: Introduction to Azure Queue storage | Microsoft Docs
description: Introduction to Azure Queue storage
services: storage
author: tamram
ms.service: storage
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/07/2017
ms.author: tamram
ms.component: queues
---
# Introduction to Queues

Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account.

## Common uses

Common uses of Queue storage include:

* Creating a backlog of work to process asynchronously
* Passing messages from an Azure web role to an Azure worker role

## Queue service concepts

The Queue service contains the following components:

![Queue Concepts](./media/storage-queues-introduction/queue1.png)

* **URL format:** Queues are addressable using the following URL format:   
    https://`<storage account>`.queue.core.windows.net/`<queue>` 
  
    The following URL addresses a queue in the diagram:  
  
    `https://myaccount.queue.core.windows.net/images-to-download`

* **Storage account:** All access to Azure Storage is done through a storage account. See [Azure Storage Scalability and Performance Targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) for details about storage account capacity.

* **Queue:** A queue contains a set of messages. All messages must be in a queue. Note that the queue name must be all lowercase. For information on naming queues, see [Naming Queues and Metadata](https://msdn.microsoft.com/library/azure/dd179349.aspx).

* **Message:** A message, in any format, of up to 64 KB. The maximum time that a message can remain in the queue is seven days.

## Next steps

* [Create a storage account](../storage-create-storage-account.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
* [Getting started with Queues using .NET](storage-dotnet-how-to-use-queues.md)
