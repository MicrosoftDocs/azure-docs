<properties
	pageTitle="Get started with queue storage and Visual Studio connected services (ASP.NET 5) | Microsoft Azure"
	description="How to get started using Azure queue storage in an ASP.NET 5 project in Visual Studio"
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
	ms.date="07/18/2016"
	ms.author="tarcher"/>

# Get started with queue storage and Visual Studio connected services (ASP.NET 5)

[AZURE.INCLUDE [storage-try-azure-tools-queues](../../includes/storage-try-azure-tools-queues.md)]

##Overview

This article describes how to get started using Azure Queue storage in Visual Studio after you have created or referenced an Azure storage account in an ASP.NET 5 project by using the Visual Studio **Add Connected Services** dialog. The **Add Connected Services** operation installs the appropriate NuGet packages to access Azure storage in your project and adds the connection string for the storage account to your project configuration files.

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 kilobytes (KB) in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account.

To get started, you first need to create an Azure queue in your storage account. We'll show you how to create a queue in code. We'll also show you how to perform basic queue operations, such as adding, modifying, reading, and removing queue messages. The samples are written in C\# code and use the Azure Storage Client Library for .NET. For more information about ASP.NET, see [ASP.NET](http://www.asp.net).

**NOTE:** Some of the APIs that perform calls to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

- See [Get started with Azure Queue storage using .NET](storage-dotnet-how-to-use-queues.md) for more information on programmatically manipulating queues.
- See [Storage documentation](https://azure.microsoft.com/documentation/services/storage/) for general information about Azure Storage.
- See [Cloud Services documentation](https://azure.microsoft.com/documentation/services/cloud-services/) for general information about Azure cloud services.
- See [ASP.NET](http://www.asp.net) for more information about programming ASP.NET applications.





##Access queues in code

To access queues in ASP.NET 5 projects, you need to include the following items to any C# source file that accesses Azure queue storage.

1. Make sure the namespace declarations at the top of the C# file include these **using** statements.

		using Microsoft.Framework.Configuration;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Queue;
		using System.Threading.Tasks;
		using LogLevel = Microsoft.Framework.Logging.LogLevel;

2. Get a **CloudStorageAccount** object that represents your storage account information. Use the following code to get the your storage connection string and storage account information from the Azure service configuration.

		 CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
		   CloudConfigurationManager.GetSetting("<storage-account-name>_AzureStorageConnectionString"));

3. Get a **CloudQueueClient** object to reference the queue objects in your storage account.  

	    // Create the CloudQueueClient object for the storage account.
    	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

4. Get a **CloudQueue** object to reference a specific queue.

    	// Get a reference to the CloudQueue named "messageQueue"
	    CloudQueue messageQueue = queueClient.GetQueueReference("messageQueue");


**NOTE:** Use all of the above code in front of the code in the following samples.

###Create a queue in code

To create the Azure queue in code, just add a call to **CreateIfNotExistsAsync**.

	// Create the CloudQueue if it does not exist.
	await messageQueue.CreateIfNotExistsAsync();

##Add a message to a queue

To insert a message into an existing queue, create a new **CloudQueueMessage** object, then call the **AddMessageAsync** method.

A **CloudQueueMessage** object can be created from either a string (in UTF-8 format) or a byte array.

Here is an example which inserts the message 'Hello, World'.

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	await messageQueue.AddMessageAsync(message);

##Read a message in a queue

You can peek at the message in the front of a queue without removing it from the queue by calling the **PeekMessageAsync** method.

	// Peek the next message in the queue. 
	CloudQueueMessage peekedMessage = await messageQueue.PeekMessageAsync();


##Read and remove a message in a queue

Your code can remove (dequeue) a message from a queue in two steps.
1. Call **GetMessageAsync** to get the next message in a queue. A message returned from **GetMessageAsync** becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds.
2.	To finish removing the message from the queue, call **DeleteMessageAsync**.

This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. The following code calls **DeleteMessageAsync** right after the message has been processed.

	// Get the next message in the queue.
	CloudQueueMessage retrievedMessage = await messageQueue.GetMessageAsync();

	// Process the message in less than 30 seconds.

    // Then delete the message.
	await messageQueue.DeleteMessageAsync(retrievedMessage);

## Leverage additional options for dequeuing messages

There are two ways you can customize message retrieval from a queue.
First, you can get a batch of messages (up to 32). Second, you can set a
longer or shorter invisibility timeout, allowing your code more or less
time to fully process each message. The following code example uses the
**GetMessages** method to get 20 messages in one call. Then it processes
each message using a **foreach** loop. It also sets the invisibility
timeout to 5 minutes for each message. Note that the 5 minutes start
for all messages at the same time, so after 5 minutes have passed after
the call to **GetMessages**, any messages which have not been deleted
become visible again.

    // Retrieve 20 messages at a time, keeping those messages invisible for 5 minutes, 
    //   delete each message after processing.

    foreach (CloudQueueMessage message in messageQueue.GetMessages(20, TimeSpan.FromMinutes(5)))
    {
        // Process all messages in less than 5 minutes, deleting each message after processing.
        queue.DeleteMessage(message);
    }

## Get the queue length

You can get an estimate of the number of messages in a queue. The
**FetchAttributes** method asks the queue service to
retrieve the queue attributes, including the message count. The **ApproximateMethodCount**
property returns the last value retrieved by the
**FetchAttributes** method, without calling the queue service.

	// Fetch the queue attributes.
	messageQueue.FetchAttributes();

    // Retrieve the cached approximate message count.
    int? cachedMessageCount = messageQueue.ApproximateMessageCount;

	// Display the number of messages.
	Console.WriteLine("Number of messages in queue: " + cachedMessageCount);

## Use the Async-Await pattern with common queue APIs

This example shows how to use the Async-Await pattern with common queue APIs. The sample calls the async version of each of the given methods. This can be seen by the Async post-fix of each method. When an async method is used, the Async-Await pattern suspends local execution until the call is completed. This behavior allows the current thread to do other work which helps avoid performance bottlenecks and improves the overall responsiveness of your application. For more details on using the Async-Await pattern in .NET, see [Async and Await (C# and Visual Basic)] (https://msdn.microsoft.com/library/hh191443.aspx)

    // Create a message to add to the queue.
    CloudQueueMessage cloudQueueMessage = new CloudQueueMessage("My message");

    // Async enqueue the message.
    await messageQueue.AddMessageAsync(cloudQueueMessage);
    Console.WriteLine("Message added");

    // Async dequeue the message.
    CloudQueueMessage retrievedMessage = await messageQueue.GetMessageAsync();
    Console.WriteLine("Retrieved message with content '{0}'", retrievedMessage.AsString);

    // Async delete the message.
    await messageQueue.DeleteMessageAsync(retrievedMessage);
    Console.WriteLine("Deleted message");
## Delete a queue

To delete a queue and all the messages contained in it, call the
**Delete** method on the queue object.

    // Delete the queue.
    messageQueue.Delete();


##Next steps

[AZURE.INCLUDE [vs-storage-dotnet-queues-next-steps](../../includes/vs-storage-dotnet-queues-next-steps.md)]
