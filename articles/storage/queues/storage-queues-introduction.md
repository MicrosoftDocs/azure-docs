---
title: Introduction to Azure Queue Storage
titleSuffix: Azure Storage
description: See an introduction to Azure Queue Storage, a service for storing large numbers of messages. A Queue Storage service contains a URL format, storage account, queue, and message.
author: normesta
ms.author: normesta
ms.reviewer: dineshm
ms.date: 03/18/2020
ms.topic: overview
ms.service: azure-queue-storage
---

# What is Azure Queue Storage?

Azure Queue Storage is a service for storing large numbers of messages. You access messages from anywhere in the world via authenticated calls using HTTP or HTTPS. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously, like in the [Web-Queue-Worker architectural style](/azure/architecture/guide/architecture-styles/web-queue-worker).

## Queue Storage concepts

Queue Storage contains the following components:

![Diagram showing the relationship between a storage account, queues, and messages.](./media/storage-queues-introduction/queue1.png)

- **URL format:** Queues are addressable using the following URL format:

  `https://<storage account>.queue.core.windows.net/<queue>`

  The following URL addresses a queue in the diagram:

  `https://myaccount.queue.core.windows.net/images-to-download`

- **Storage account:** All access to Azure Storage is done through a storage account. For information about storage account capacity, see [Scalability and performance targets for standard storage accounts](../common/scalability-targets-standard-account.md?toc=/azure/storage/queues/toc.json).

- **Queue:** A queue contains a set of messages. The queue name **must** be all lowercase. For information on naming queues, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

- **Message:** A message, in any format, of up to 64 KB. Before version 2017-07-29, the maximum time-to-live allowed is seven days. For version 2017-07-29 or later, the maximum time-to-live can be any positive number, or -1 indicating that the message doesn't expire. If this parameter is omitted, the default time-to-live is seven days.

## Next steps

- [Create a storage account](../common/storage-account-create.md?toc=/azure/storage/queues/toc.json)
- [Get started with Queue Storage using .NET](/azure/storage/queues/storage-quickstart-queues-dotnet?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli)
- [Get started with Queue Storage using Java](/azure/storage/queues/storage-quickstart-queues-java?tabs=powershell%2Cpasswordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli)
- [Get started with Queue Storage using Python](/azure/storage/queues/storage-quickstart-queues-python?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli)
- [Get started with Queue Storage using Node.js](/azure/storage/queues/storage-quickstart-queues-nodejs?tabs=passwordless%2Croles-azure-portal%2Cenvironment-variable-windows%2Csign-in-azure-cli)
