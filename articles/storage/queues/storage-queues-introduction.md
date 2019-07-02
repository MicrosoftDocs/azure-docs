---
title: Introduction to Azure Queues - Azure Storage
description: Introduction to Azure Queues
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: overview
ms.date: 06/07/2019
ms.author: mhopkins
ms.reviewer: cbrooks
ms.subservice: queues
---

# What are Azure Queues?

Azure Queue storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account.

## Common uses

Common uses of Queue storage include:

* Creating a backlog of work to process asynchronously
* Passing messages from an Azure web role to an Azure worker role

## Queue service concepts

The Queue service contains the following components:

![Queue Concepts](./media/storage-queues-introduction/queue1.png)

* **URL format:** Queues are addressable using the following URL format:

    `https://<storage account>.queue.core.windows.net/<queue>`
  
    The following URL addresses a queue in the diagram:  
  
    `https://myaccount.queue.core.windows.net/images-to-download`

* **Storage account:** All access to Azure Storage is done through a storage account. See [Azure Storage Scalability and Performance Targets](../common/storage-scalability-targets.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) for details about storage account capacity.

* **Queue:** A queue contains a set of messages. The queue name **must** be all lowercase. For information on naming queues, see [Naming Queues and Metadata](https://msdn.microsoft.com/library/azure/dd179349.aspx).

* **Message:** A message, in any format, of up to 64 KB. Before version 2017-07-29, the maximum time-to-live allowed is seven days. For version 2017-07-29 or later, the maximum time-to-live can be any positive number, or -1 indicating that the message doesn't expire. If this parameter is omitted, the default time-to-live is seven days.

## Next steps

* [Create a storage account](../storage-create-storage-account.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)
* [Getting started with Queues using .NET](storage-dotnet-how-to-use-queues.md)
