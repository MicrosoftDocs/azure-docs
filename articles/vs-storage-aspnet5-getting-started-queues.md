<properties 
	pageTitle="Getting Started with Azure Storage" 
	description="How to get started using Azure queue storage in an ASP.NET 5 project in Visual Studio" 
	services="storage" 
	documentationCenter="" 
	authors="kempb" 
	manager="douge" 
	editor="tglee"/>

<tags 
	ms.service="storage" 
	ms.workload="web" 
	ms.tgt_pltfrm="vs-getting-started" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/20/2015" 
	ms.author="kempb"/>

# Getting Started with Azure Storage (ASP.NET 5 Projects)

> [AZURE.SELECTOR]
> - [Getting Started](vs-storage-aspnet5-getting-started-queues.md)
> - [What Happened](vs-storage-aspnet5-what-happened.md)

> [AZURE.SELECTOR]
> - [Blobs](vs-storage-aspnet5-getting-started-blobs.md)
> - [Queues](vs-storage-aspnet5-getting-started-queues.md)
> - [Tables](vs-storage-aspnet5-getting-started-tables.md)

Azure queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. A single queue message can be up to 64 KB in size, and a queue can contain millions of messages, up to the total capacity limit of a storage account. See [How to use Queue Storage from .NET](storage-dotnet-how-to-use-queues.md/ "How to use Queue Storage from .NET") for more information.

To programmatically access queues in ASP.NET 5 projects, you need to add the following items, if they're not already present.

1. Add the following code namespace declarations to the top of any C# file in which you wish to programmatically access Azure Storage.

		using Microsoft.Framework.ConfigurationModel;
		using Microsoft.WindowsAzure.Storage;
		using Microsoft.WindowsAzure.Storage.Queue;
		using System.Threading.Tasks;

2. Use the following code to get the configuration setting.

		 IConfigurationSourceRoot config = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

#####Get the storage connection string
Before you can do anything with a queue, you need to get the connection string for the storage account the queues will live in. You can use the **CloudStorageAccount** type to represent your storage account information. If you’re using an ASP.NET 5 project, you can you call the get method of the Configuration object to get your storage connection string and storage account information from the Azure service configuration, as shown in the following code.

**NOTE:** The APIs that perform calls out to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous Programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

	CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
      config.Get("MicrosoftAzureStorage:<storageAccountName>_AzureStorageConnectionString"));

#####Create a Queue
A **CloudQueueClient** object lets you get reference objects for queues. The following code creates a **CloudQueueClient** object. All code in this topic uses a storage connection string stored in the Azure application's service configuration. There are also other ways to create a **CloudStorageAccount** object. See the [CloudStorageAccount](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.cloudstorageaccount_methods.aspx "CloudStorageAccount") documentation for details.

**NOTE:** The APIs that perform calls out to Azure storage in ASP.NET 5 are asynchronous. See [Asynchronous Programming with Async and Await](http://msdn.microsoft.com/library/hh191443.aspx) for more information. The code below assumes async programming methods are being used.

	// Create the queue client.
	CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

Use the **queueClient** object to get a reference to the queue you want to use. The code tries to reference a queue named “myqueue.” If it can’t find a queue with that name, it creates one.

	// Get a reference to a queue named “myqueue”.
	CloudQueue queue = queueClient.GetQueueReference("myqueue");

	// If the queue isn’t already there, then create it.
	await queue.CreateIfNotExistsAsync();

**NOTE:** Use all of this code in front of the code in the following sections.

#####Insert a Message into a Queue
To insert a message into an existing queue, first create a new **CloudQueueMessage** object. Next, call the AddMessageAsync() method. A **CloudQueueMessage** object can be created from either a string (in UTF-8 format) or a byte array. Here is code which creates a queue (if it doesn't exist) and inserts the message 'Hello, World'.

	// Create a message and add it to the queue.
	CloudQueueMessage message = new CloudQueueMessage("Hello, World");
	await queue.AddMessageAsync(message);

#####Peek at the Next Message
You can peek at the message in the front of a queue without removing it from the queue by calling the PeekMessageAsync() method.

	// Peek at the next message in the queue.
	CloudQueueMessage peekedMessage = queue.PeekMessage();

	// Display the message.
	CloudQueueMessage peekedMessage = await queue.PeekMessageAsync();

#####Remove the Next Message
Your code can remove (de-queue) a message from a queue in two steps. 


1. Call GetMessageAsync() to get the next message in a queue. A message returned from GetMessageAsync() becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. 
2.	To finish removing the message from the queue, call DeleteMessageAsync(). 

This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. The following code calls DeleteMessageAsync() right after the message has been processed.

	// Get the next message in the queue.
	CloudQueueMessage retrievedMessage = await queue.GetMessageAsync();

	// Process the message in less than 30 seconds, and then delete the message.
	await queue.DeleteMessageAsync(retrievedMessage);

[Learn more about Azure Storage](http://azure.microsoft.com/documentation/services/storage/)
See also [Browsing Storage Resources in Server Explorer](http://msdn.microsoft.com/library/azure/ff683677.aspx) and [ASP.NET 5](http://www.asp.net/vnext).
