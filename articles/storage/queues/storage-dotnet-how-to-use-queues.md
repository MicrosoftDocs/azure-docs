---
title: Get started with Azure Queue storage using .NET - Azure Storage
description: Azure Queues provide reliable, asynchronous messaging between application components. Cloud messaging enables your application components to scale independently.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 05/21/2019
ms.service: storage
ms.subservice: queues
ms.topic: conceptual
ms.reviewer: cbrooks
---

# Get started with Azure Queue storage using .NET

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

[!INCLUDE [storage-check-out-samples-dotnet](../../../includes/storage-check-out-samples-dotnet.md)]

## Overview

Azure Queue storage provides cloud messaging between application components. In designing applications for scale, application components are often decoupled, so that they can scale independently. Queue storage delivers asynchronous messaging for communication between application components, whether they are running in the cloud, on the desktop, on an on-premises server, or on a mobile device. Queue storage also supports managing asynchronous tasks and building process work flows.

### About this tutorial

This tutorial shows how to write .NET code for some common scenarios using Azure Queue storage. Scenarios covered include creating and deleting queues and adding, reading, and deleting queue messages.

**Estimated time to complete:** 45 minutes

### Prerequisites

* [Microsoft Visual Studio](https://www.visualstudio.com/downloads/)
* [Azure Storage common client library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/)
* [Azure Storage Queue client library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Queue/)
* [Azure Configuration Manager for .NET](https://www.nuget.org/packages/Microsoft.Azure.ConfigurationManager/)
* An [Azure storage account](../common/storage-account-create.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)

[!INCLUDE [storage-queue-concepts-include](../../../includes/storage-queue-concepts-include.md)]

[!INCLUDE [storage-create-account-include](../../../includes/storage-create-account-include.md)]

## Set up your development environment

Next, set up your development environment in Visual Studio so you're ready to try the code examples in this guide.

### Create a Windows console application project

In Visual Studio, create a new Windows console application. The following steps show you how to create a console application in Visual Studio 2019. The steps are similar in other versions of Visual Studio.

1. Select **File** > **New** > **Project**
2. Select **Platform** > **Windows**
3. Select **Console App (.NET Framework)**
4. Select **Next**
5. In the **Project name** field, enter a name for your application
6. Select **Create**

All code examples in this tutorial can be added to the **Main()** method of your console application's **Program.cs** file.

You can use the Azure Storage client libraries in any type of .NET application, including an Azure cloud service or web app, and desktop and mobile applications. In this guide, we use a console application for simplicity.

### Use NuGet to install the required packages

You need to reference the following three packages in your project to complete this tutorial:

* [Microsoft Azure Storage Common Client Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/): This package provides programmatic access to data resources in your storage account.
* [Microsoft Azure Storage Queue Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Queue/): This client library enables working with the Microsoft Azure Storage Queue service for storing messages that may be accessed by a client.
* [Microsoft Azure Configuration Manager library for .NET](https://www.nuget.org/packages/Microsoft.Azure.ConfigurationManager/): This package provides a class for parsing a connection string in a configuration file, regardless of where your application is running.

You can use NuGet to obtain these packages. Follow these steps:

1. Right-click your project in **Solution Explorer**, and choose **Manage NuGet Packages**.
2. Select **Browse**
3. Search online for "Microsoft.Azure.Storage.Queue", and select **Install** to install the Storage client library and its dependencies. This will also install the Microsoft.Azure.Storage.Common library, which is a dependency of the queue library.
4. Search online for "Microsoft.Azure.ConfigurationManager", and select **Install** to install the Azure Configuration Manager.

> [!NOTE]
> The Storage client libraries packages are also included in the [Azure SDK for .NET](https://azure.microsoft.com/downloads/). However, we recommend that you also install the Storage client libraries from NuGet to ensure that you always have the latest versions.
>
> The ODataLib dependencies in the Storage client libraries for .NET are resolved by the ODataLib packages available on NuGet, not from WCF Data Services. The ODataLib libraries can be downloaded directly, or referenced by your code project through NuGet. The specific ODataLib packages used by the Storage client libraries are [OData](https://nuget.org/packages/Microsoft.Data.OData/), [Edm](https://nuget.org/packages/Microsoft.Data.Edm/), and [Spatial](https://nuget.org/packages/System.Spatial/). While these libraries are used by the Azure Table storage classes, they are required dependencies for programming with the Storage client libraries.

### Determine your target environment

You have two environment options for running the examples in this guide:

* You can run your code against an Azure Storage account in the cloud.
* You can run your code against the Azure storage emulator. The storage emulator is a local environment that emulates an Azure Storage account in the cloud. The emulator is a free option for testing and debugging your code while your application is under development. The emulator uses a well-known account and key. For more information, see [Use the Azure storage emulator for development and testing](../common/storage-use-emulator.md).

If you are targeting a storage account in the cloud, copy the primary access key for your storage account from the Azure portal. For more information, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

> [!NOTE]
> You can target the storage emulator to avoid incurring any costs associated with Azure Storage. However, if you do choose to target an Azure storage account in the cloud, costs for performing this tutorial will be negligible.

### Configure your storage connection string

The Azure Storage client libraries for .NET support using a storage connection string to configure endpoints and credentials for accessing storage services. The best way to maintain your storage connection string is in a configuration file.

For more information about connection strings, see [Configure a connection string to Azure Storage](../common/storage-configure-connection-string.md).

> [!NOTE]
> Your storage account key is similar to the root password for your storage account. Always be careful to protect your storage account key. Avoid distributing it to other users, hard-coding it, or saving it in a plain-text file that is accessible to others. Regenerate your key by using the Azure portal if you believe it may have been compromised.

To configure your connection string, open the **app.config** file from Solution Explorer in Visual Studio. Add the contents of the **\<appSettings\>** element shown below. Replace *account-name* with the name of your storage account, and *account-key* with your account access key:

```xml
<configuration>
    <startup>
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5.2" />
    </startup>
    <appSettings>
        <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=account-name;AccountKey=account-key" />
    </appSettings>
</configuration>
```

For example, your configuration setting appears similar to:

```xml
<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=GMuzNHjlB3S9itqZJHHCnRkrokLkcSyW7yK9BRbGp0ENePunLPwBgpxV1Z/pVo9zpem/2xSHXkMqTHHLcx8XRA==" />
```

To target the storage emulator, you can use a shortcut that maps to the well-known account name and key. In that case, your connection string setting is:

```xml
<add key="StorageConnectionString" value="UseDevelopmentStorage=true;" />
```

### Add using directives

Add the following `using` directives to the top of the `Program.cs` file:

```csharp
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.Azure.Storage; // Namespace for CloudStorageAccount
using Microsoft.Azure.Storage.Queue; // Namespace for Queue storage types
```

### Copy your credentials from the Azure portal

The sample code needs to authorize access to your storage account. To authorize, you provide the application with your storage account credentials in the form of a connection string. To view your storage account credentials:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Your account access keys appear, as well as the complete connection string for each key.
4. Find the **Connection string** value under **key1**, and click the **Copy** button to copy the connection string. You will add the connection string value to an environment variable in the next step.

    ![Screenshot showing how to copy a connection string from the Azure portal](media/storage-dotnet-how-to-use-queues/portal-connection-string.png)

### Parse the connection string

[!INCLUDE [storage-cloud-configuration-manager-include](../../../includes/storage-cloud-configuration-manager-include.md)]

### Create the Queue service client

The [CloudQueueClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueueclient?view=azure-dotnet) class enables you to retrieve queues stored in Queue storage. Here's one way to create the service client:

```csharp
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
```

Now you are ready to write code that reads data from and writes data to Queue storage.

## Create a queue

This example shows how to create a queue if it does not already exist:

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a container.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.CreateIfNotExists();
```

## Insert a message into a queue

To insert a message into an existing queue, first create a new [CloudQueueMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage?view=azure-dotnet). Next, call the [AddMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.addmessage?view=azure-dotnet) method. A
**CloudQueueMessage** can be created from either a string (in UTF-8
format) or a **byte** array. Here is code which creates a queue (if it
doesn't exist) and inserts the message 'Hello, World':

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist.
queue.CreateIfNotExists();

// Create a message and add it to the queue.
CloudQueueMessage message = new CloudQueueMessage("Hello, World");
queue.AddMessage(message);
```

## Peek at the next message

You can peek at the message in the front of a queue without removing it
from the queue by calling the [PeekMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.peekmessage?view=azure-dotnet) method.

```csharp
// Retrieve storage account from connection string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Peek at the next message
CloudQueueMessage peekedMessage = queue.PeekMessage();

// Display message.
Console.WriteLine(peekedMessage.AsString);
```

## Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multi-step workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than *n* times, you would delete it. This protects against a message that triggers an application error each time it is processed.

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Get the message from the queue and update the message contents.
CloudQueueMessage message = queue.GetMessage();
message.SetMessageContent2("Updated contents.", false);
queue.UpdateMessage(message,
    TimeSpan.FromSeconds(60.0),  // Make it invisible for another 60 seconds.
    MessageUpdateFields.Content | MessageUpdateFields.Visibility);
```

## De-queue the next message

Your code de-queues a message from a queue in two steps. When you call [GetMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessage?view=azure-dotnet), you get the next message in a queue. A message returned from **GetMessage** becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [DeleteMessage](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.deletemessage?view=azure-dotnet). This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **DeleteMessage** right after the message has been processed.

```csharp
// Retrieve storage account from connection string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Get the next message
CloudQueueMessage retrievedMessage = queue.GetMessage();

//Process the message in less than 30 seconds, and then delete the message
queue.DeleteMessage(retrievedMessage);
```

## Use Async-Await pattern with common Queue storage APIs

This example shows how to use the Async-Await pattern with common Queue storage APIs. The sample calls the asynchronous version of each of the given methods, as indicated by the *Async* suffix of each method. When an async method is used, the async-await pattern suspends local execution until the call completes. This behavior allows the current thread to do other work, which helps avoid performance bottlenecks and improves the overall responsiveness of your application. For more details on using the Async-Await pattern in .NET see [Async and Await (C# and Visual Basic)](https://msdn.microsoft.com/library/hh191443.aspx)

```csharp
// Create the queue if it doesn't already exist
if(await queue.CreateIfNotExistsAsync())
{
    Console.WriteLine("Queue '{0}' Created", queue.Name);
}
else
{
    Console.WriteLine("Queue '{0}' Exists", queue.Name);
}

// Create a message to put in the queue
CloudQueueMessage cloudQueueMessage = new CloudQueueMessage("My message");

// Async enqueue the message
await queue.AddMessageAsync(cloudQueueMessage);
Console.WriteLine("Message added");

// Async dequeue the message
CloudQueueMessage retrievedMessage = await queue.GetMessageAsync();
Console.WriteLine("Retrieved message with content '{0}'", retrievedMessage.AsString);

// Async delete the message
await queue.DeleteMessageAsync(retrievedMessage);
Console.WriteLine("Deleted message");
```

## Leverage additional options for de-queuing messages

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message. The following code example uses the [GetMessages](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessages?view=azure-dotnet) method to get 20 messages in one call. Then it processes each message using a **foreach** loop. It also sets the invisibility timeout to five minutes for each message. Note that the 5 minutes starts for all messages at the same time, so after 5 minutes have passed since
the call to **GetMessages**, any messages which have not been deleted will become visible again.

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

foreach (CloudQueueMessage message in queue.GetMessages(20, TimeSpan.FromMinutes(5)))
{
    // Process all messages in less than 5 minutes, deleting each message after processing.
    queue.DeleteMessage(message);
}
```

## Get the queue length

You can get an estimate of the number of messages in a queue. The [FetchAttributes](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.fetchattributes?view=azure-dotnet) method asks the Queue service to retrieve the queue attributes, including the message count. The [ApproximateMessageCount](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.approximatemessagecount?view=azure-dotnet) property returns the last value retrieved by the **FetchAttributes** method, without calling the Queue service.

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Fetch the queue attributes.
queue.FetchAttributes();

// Retrieve the cached approximate message count.
int? cachedMessageCount = queue.ApproximateMessageCount;

// Display number of messages.
Console.WriteLine("Number of messages in queue: " + cachedMessageCount);
```

## Delete a queue

To delete a queue and all the messages contained in it, call the [Delete](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.queue.cloudqueue.delete?view=azure-dotnet) method on the queue object.

```csharp
// Retrieve storage account from connection string.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client.
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue.
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Delete the queue.
queue.Delete();
```

## Next steps

Now that you've learned the basics of Queue storage, follow these links
to learn about more complex storage tasks.

* View the Queue service reference documentation for complete details about available APIs:
  * [Storage Client Library for .NET reference](https://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409)
  * [REST API reference](https://msdn.microsoft.com/library/azure/dd179355)
* Learn how to simplify the code you write to work with Azure Storage by using the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).
* View more feature guides to learn about additional options for storing data in Azure.
  * [Get started with Azure Table storage using .NET](../../cosmos-db/table-storage-how-to-use-dotnet.md) to store structured data.
  * [Get started with Azure Blob storage using .NET](../blobs/storage-dotnet-how-to-use-blobs.md) to store unstructured data.
  * [Connect to SQL Database by using .NET (C#)](../../sql-database/sql-database-connect-query-dotnet-core.md) to store relational data.

[Download and install the Azure SDK for .NET]: /develop/net/
[.NET client library reference]: https://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409
[Creating an Azure Project in Visual Studio]: https://msdn.microsoft.com/library/azure/ee405487.aspx
[Azure Storage Team Blog]: https://blogs.msdn.com/b/windowsazurestorage/
[OData]: https://nuget.org/packages/Microsoft.Data.OData/5.0.2
[Edm]: https://nuget.org/packages/Microsoft.Data.Edm/5.0.2
[Spatial]: https://nuget.org/packages/System.Spatial/5.0.2
