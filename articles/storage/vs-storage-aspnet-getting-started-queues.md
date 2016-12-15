---
title: Get started with Azure queue storage and Visual Studio Connected Services (ASP.NET) | Microsoft Docs
description: How to get started using Azure queue storage in an ASP.NET project in Visual Studio after connecting to a storage account using Visual Studio Connected Services
services: storage
documentationcenter: ''
author: TomArcher
manager: douge
editor: ''

ms.assetid: 94ca3413-5497-433f-abbe-836f83a9de72
ms.service: storage
ms.workload: web
ms.tgt_pltfrm: vs-getting-started
ms.devlang: na
ms.topic: article
ms.date: 12/05/2016
ms.author: tarcher

---
# Get started with Azure queue storage and Visual Studio Connected Services (ASP.NET)
[!INCLUDE [storage-try-azure-tools-queues](../../includes/storage-try-azure-tools-queues.md)]

## Overview

Azure queue storage is a service for storing large amounts of unstructured data that can be accessed via HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain an unlimited number of messages, up to the total capacity limit of a storage account.

This article describes how to programmatically manage Azure queue storage entities, performing
common tasks such as creating an Azure queue, and adding, modifying, reading and removing queue messages.

> [!NOTE]
> 
> The code sections in this article assume that you have already connected to an Azure storage account using Connected Services. Connected Services is configured by opening the Visual Studio Solution Explorer, right-clicking the project, and from the context menu, selecting the **Add->Connected Service** option. From there, follow the dialog's instructions to connect to the desired Azure storage account.      

## Create a queue

The following steps illustrate how to programmatically create a queue. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the desired queue name. (Change *<queue-name>* to the name of the queue you want to create.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Call the **CloudQueue.CreateIfNotExists** method to create the queue if it does not yet exist. 

	    queue.CreateIfNotExists();


## Add a message to a queue

The following steps illustrate how to programmatically add a message to a queue. In an ASP.NET MVC app, the code would go in a controller.

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the desired queue name. (Change *<queue-name>* to the name of the queue to which you want to add the message.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Create the **CloudQueueMessage** object representing the message you want to add to the queue. A **CloudQueueMessage** object can be created from either a string (in UTF-8 format) or a byte array. (Change *<queue-message>* to the message you want to add.

		CloudQueueMessage message = new CloudQueueMessage(<queue-message>);

6. Call the **CloudQueue.AddMessage** method to add the messaged to the queue.

    	queue.AddMessage(message);

## Read a message from a queue without removing it

The following steps illustrate how to programmatically peek at a queued message (read the first message without removing it). In an ASP.NET MVC app, the code would go in a controller. 

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the queue. (Change *<queue-name>* to the name of the queue from which you want to read a message.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Call the **CloudQueue.PeekMessage** method to read the message at the front of a queue without removing it from the queue.

    	CloudQueueMessage message = queue.PeekMessage();

6. Access the **CloudQueueMessage** object's value using either the **CloudQueueMessage.AsBytes** or **CloudQueueMessage.AsString** property.

		string messageAsString = message.AsString;
		byte[] messageAsBytes = message.AsBytes;

## Read and remove a message from a queue

The following steps illustrate how to programmatically read a queued message, and then delete it. In an ASP.NET MVC app, the code would go in a controller. 

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the queue. (Change *<queue-name>* to the name of the queue from which you want to read a message.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Call the **CloudQueue.GetMessage** method to read the first message in the queue. The **CloudQueue.GetMessage** method makes the message invisible for 30 seconds (by default) to any other code reading messages so that no other code can modify or delete the message while your processing it. To change the amount of time the message is invisible, modify the **visibilityTimeout** parameter being passed to the **CloudQueue.GetMessage** method.

		// This message will be invisible to other code for 30 seconds.
		CloudQueueMessage message = queue.GetMessage();     

6. Call the **CloudQueueMessage.Delete** method to delete the message from the queue.

	    queue.DeleteMessage(message);

## Get the queue length

The following steps illustrate how to programmatically get the queue length (number of messages). In an ASP.NET MVC app, the code would go in a controller. 

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the queue. (Change *<queue-name>* to the name of the queue whose length you are querying.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Call the **CloudQueue.FetchAttributes** method to retrieve the queue's attributes (including its length). 

		queue.FetchAttributes();

6. Access the **CloudQueue.ApproximateMessageCount** property to get the queue's length.
 
		int? nMessages = queue.ApproximateMessageCount;

## Delete a queue
The following steps illustrate how to programmatically delete a queue. 

1. Add the following *using* directives:
   
        using Microsoft.Azure;
        using Microsoft.WindowsAzure.Storage;
        using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the storage connection string and storage account information from the Azure service configuration. (Change  *<storage-account-name>* to the name of the Azure storage account you're accessing.)

         CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
           CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object represents a queue service client.

        CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object that represents a reference to the queue. (Change *<queue-name>* to the name of the queue whose length you are querying.)

        CloudQueue queue = queueClient.GetQueueReference(<queue-name>);

5. Call the **CloudQueue.Delete** method to delete the queue represented by the **CloudQueue** object.

	    messageQueue.Delete();

## Next steps
[!INCLUDE [vs-storage-dotnet-queues-next-steps](../../includes/vs-storage-dotnet-queues-next-steps.md)]

