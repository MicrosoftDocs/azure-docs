<properties
	pageTitle="Get started with queue storage and Visual Studio connected services (ASP.NET) | Microsoft Azure"
	description="How to get started using Azure Queue storage in an ASP.NET project in Visual Studio after connecting to a storage account using Visual Studio connected services"
	services="storage"
	documentationCenter=""
	authors="TomArcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="storage"
	ms.workload="web"
	ms.tgt_pltfrm="vs-getting-started"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/01/2016"
	ms.author="tarcher"/>

# Get started with Azure Queue storage and Visual Studio connected services

[AZURE.INCLUDE [storage-try-azure-tools](../../includes/storage-try-azure-tools-queues.md)]

## Overview

This article describes how get started using Azure Queue storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET project by using the  Visual Studio **Add Connected Services** dialog.

We'll show you how to create and access an Azure Queue in your storage account. We'll also show you how to perform basic queue operations, such as adding, modifying, reading and removing queue messages. The samples are written in C# code and use the [Microsoft Azure Storage Client Library for .NET](https://msdn.microsoft.com/library/azure/dn261237.aspx). For more information about ASP.NET, see [ASP.NET](http://www.asp.net).

Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account.

## Access queues in code

To access queues in ASP.NET projects, you need to include the following items to any C# source file that access Azure Queue storage.

1. Make sure the namespace declarations at the top of the C# file include these **using** statements.

		using Microsoft.Framework.Configuration;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Queue;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

		 CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object to reference the queue objects in your storage account.  

	    // Create the CloudQueueClient object for this storage account.
    	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object to reference a specific queue.

    	// Get a reference to a queue named "messageQueue"
	    CloudQueue messageQueue = queueClient.GetQueueReference("messageQueue");


**NOTE** Use all of the above code in front of the code in the following samples.

## Create a queue in code

To create an Azure queue in code, just add a call to **CreateIfNotExists** to the code above.

	// Create the messageQueue if it does not exist
	messageQueue.CreateIfNotExists();

## Add a message to a queue

To insert a message into an existing queue, create a new **CloudQueueMessage** object, then call the **AddMessage** method.

A **CloudQueueMessage** object can be created from either a string (in UTF-8 format) or a byte array.

Here is an example which inserts the message 'Hello, World'.

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	messageQueue.AddMessage(message);

## Read a message in a queue

You can peek at the message in the front of a queue without removing it from the queue by calling the PeekMessage() method.

	// Peek at the next message
    CloudQueueMessage peekedMessage = messageQueue.PeekMessage();

## Read and remove a message in a queue

Your code can remove (de-queue) a message from a queue in two steps.
1. Call GetMessage() to get the next message in a queue. A message returned from GetMessage() becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds.
2.	To finish removing the message from the queue, call **DeleteMessage**.

This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. The following code calls **DeleteMessage** right after the message has been processed.

	// Get the next message in the queue.
	CloudQueueMessage retrievedMessage = messageQueue.GetMessage();

	// Process the message in less than 30 seconds

	// Then delete the message.
	await messageQueue.DeleteMessage(retrievedMessage);


## Use additional options for de-queuing messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**GetMessages** method to get 20 messages in one call. Then it processes
each message using a **foreach** loop. It also sets the invisibility
timeout to five minutes for each message. Note that the 5 minutes starts
for all messages at the same time, so after 5 minutes have passed since
the call to **GetMessages**, any messages which have not been deleted
will become visible again.

    // Create the queue client.
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

    // Retrieve a reference to a queue.
    CloudQueue queue = queueClient.GetQueueReference("myqueue");

    foreach (CloudQueueMessage message in queue.GetMessages(20, TimeSpan.FromMinutes(5)))
    {
        // Process all messages in less than 5 minutes, deleting each message after processing.
        queue.DeleteMessage(message);
    }

## Get the queue length

You can get an estimate of the number of messages in a queue. The
**FetchAttributes** method asks the queueservice to
retrieve the queue attributes, including the message count. The **ApproximateMethodCount**
property returns the last value retrieved by the
**FetchAttributes** method, without calling the queueservice.

	// Fetch the queue attributes.
	messageQueue.FetchAttributes();

    // Retrieve the cached approximate message count.
    int? cachedMessageCount = messageQueue.ApproximateMessageCount;

	// Display number of messages.
	Console.WriteLine("Number of messages in queue: " + cachedMessageCount);

## Use Async-Await pattern with common queueAPIs

This example shows how to use the Async-Await pattern with common queueAPIs. The sample calls the async version of each of the given methods, this can be seen by the Async post-fix of each method. When an async method is used the async-await pattern suspends local execution until the call completes. This behavior allows the current thread to do other work which helps avoid performance bottlenecks and improves the overall responsiveness of your application. For more details on using the Async-Await pattern in .NET see [Async and Await (C# and Visual Basic)] (https://msdn.microsoft.com/library/hh191443.aspx)

    // Create a message to put in the queue
    CloudQueueMessage cloudQueueMessage = new CloudQueueMessage("My message");

    // Async enqueue the message
    await messageQueue.AddMessageAsync(cloudQueueMessage);
    Console.WriteLine("Message added");

    // Async dequeue the message
    CloudQueueMessage retrievedMessage = await messageQueue.GetMessageAsync();
    Console.WriteLine("Retrieved message with content '{0}'", retrievedMessage.AsString);

    // Async delete the message
    await messageQueue.DeleteMessageAsync(retrievedMessage);
    Console.WriteLine("Deleted message");

## Delete a queue

To delete a queue and all the messages contained in it, call the
**Delete** method on the queue object.

    // Delete the queue.
    messageQueue.Delete();

## Next steps

[AZURE.INCLUDE [vs-storage-dotnet-queues-next-steps](../../includes/vs-storage-dotnet-queues-next-steps.md)]