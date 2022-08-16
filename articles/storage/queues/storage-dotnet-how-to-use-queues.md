---
title: Get started with Azure Queue Storage using .NET - Azure Storage
description: Azure Queue Storage provide reliable, asynchronous messaging between application components. Cloud messaging enables your application components to scale independently.
author: normesta
ms.author: normesta
ms.reviewer: dineshm
ms.date: 10/08/2020
ms.topic: how-to
ms.service: storage
ms.subservice: queues
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Get started with Azure Queue Storage using .NET

[!INCLUDE [storage-selector-queue-include](../../../includes/storage-selector-queue-include.md)]

## Overview

Azure Queue Storage provides cloud messaging between application components. In designing applications for scale, application components are often decoupled so they can scale independently. Queue Storage delivers asynchronous messaging between application components, whether they are running in the cloud, on the desktop, on an on-premises server, or on a mobile device. Queue Storage also supports managing asynchronous tasks and building process work flows.

### About this tutorial

This tutorial shows how to write .NET code for some common scenarios using Azure Queue Storage. Scenarios covered include creating and deleting queues and adding, reading, and deleting queue messages.

**Estimated time to complete:** 45 minutes

### Prerequisites

- [Microsoft Visual Studio](https://www.visualstudio.com/downloads/)
- An [Azure Storage account](../common/storage-account-create.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json)

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

All code examples in this tutorial can be added to the `Main()` method of your console application's `Program.cs` file.

You can use the Azure Storage client libraries in any type of .NET application, including an Azure cloud service or web app, and desktop and mobile applications. In this guide, we use a console application for simplicity.

### Use NuGet to install the required packages

# [.NET v12 SDK](#tab/dotnet)

You need to reference the following four packages in your project to complete this tutorial:

- [Azure.Core library for .NET](https://www.nuget.org/packages/azure.core/): This package provides shared primitives, abstractions, and helpers for modern .NET Azure SDK client libraries.
- [Azure.Storage.Common client library for .NET](https://www.nuget.org/packages/azure.storage.common/): This package provides infrastructure shared by the other Azure Storage client libraries.
- [Azure.Storage.Queues client library for .NET](https://www.nuget.org/packages/azure.storage.queues/): This package enables working with Azure Queue Storage for storing messages that may be accessed by a client.
- [System.Configuration.ConfigurationManager library for .NET](https://www.nuget.org/packages/system.configuration.configurationmanager/): This package provides access to configuration files for client applications.

You can use NuGet to obtain these packages. Follow these steps:

1. Right-click your project in **Solution Explorer**, and choose **Manage NuGet Packages**.
1. Select **Browse**
1. Search online for `Azure.Storage.Queues`, and select **Install** to install the Azure Storage client library and its dependencies. This will also install the Azure.Storage.Common and Azure.Core libraries, which are dependencies of the queue library.
1. Search online for `System.Configuration.ConfigurationManager`, and select **Install** to install the Configuration Manager.

# [.NET v11 SDK](#tab/dotnetv11)

You need to reference the following three packages in your project to complete this tutorial:

- [Microsoft.Azure.Storage.Common client library for .NET](https://www.nuget.org/packages/microsoft.azure.storage.common/): This package provides programmatic access to data resources in your storage account.
- [Microsoft Azure Queue Storage client library for .NET](https://www.nuget.org/packages/microsoft.azure.storage.queue/): This client library enables working with Azure Queue Storage for storing messages that may be accessed by a client.
- [Microsoft Azure Configuration Manager library for .NET](https://www.nuget.org/packages/microsoft.azure.configurationmanager/): This package provides a class for parsing a connection string in a configuration file, regardless of where your application is running.

You can use NuGet to obtain these packages. Follow these steps:

1. Right-click your project in **Solution Explorer**, and choose **Manage NuGet Packages**.
1. Select **Browse**
1. Search online for `Microsoft.Azure.Storage.Queue`, and select **Install** to install the Azure Storage client library and its dependencies. This will also install the Microsoft.Azure.Storage.Common library, which is a dependency of the queue library.
1. Search online for `Microsoft.Azure.ConfigurationManager`, and select **Install** to install the Azure Configuration Manager.

---

### Determine your target environment

You have two environment options for running the examples in this guide:

- You can run your code against an Azure Storage account in the cloud.
- You can run your code against the Azurite storage emulator. Azurite is a local environment that emulates an Azure Storage account in the cloud. Azurite is a free option for testing and debugging your code while your application is under development. The emulator uses a well-known account and key. For more information, see [Use the Azurite emulator for local Azure Storage development and testing](../common/storage-use-azurite.md).

> [!NOTE]
> You can target the storage emulator to avoid incurring any costs associated with Azure Storage. However, if you do choose to target an Azure Storage account in the cloud, costs for performing this tutorial will be negligible.

## Get your storage connection string

The Azure Storage client libraries for .NET support using a storage connection string to configure endpoints and credentials for accessing storage services. For more information, see [Manage storage account access keys](../common/storage-account-keys-manage.md).

### Copy your credentials from the Azure portal

The sample code needs to authorize access to your storage account. To authorize, you provide the application with your storage account credentials in the form of a connection string. To view your storage account credentials:

1. Navigate to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the **Settings** section of the storage account overview, select **Access keys**. Your account access keys appear, as well as the complete connection string for each key.
4. Find the **Connection string** value under **key1**, and click the **Copy** button to copy the connection string. You will add the connection string value to an environment variable in the next step.

    ![Screenshot showing how to copy a connection string from the Azure portal](media/storage-dotnet-how-to-use-queues/portal-connection-string.png)

For more information about connection strings, see [Configure a connection string to Azure Storage](../common/storage-configure-connection-string.md).

> [!NOTE]
> Your storage account key is similar to the root password for your storage account. Always be careful to protect your storage account key. Avoid distributing it to other users, hard-coding it, or saving it in a plain-text file that is accessible to others. Regenerate your key by using the Azure portal if you believe it may have been compromised.

The best way to maintain your storage connection string is in a configuration file. To configure your connection string, open the `app.config` file from Solution Explorer in Visual Studio. Add the contents of the `<appSettings>` element shown here. Replace `connection-string` with the value you copied from your storage account in the portal:

```xml
<configuration>
    <startup>
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.2" />
    </startup>
    <appSettings>
        <add key="StorageConnectionString" value="connection-string" />
    </appSettings>
</configuration>
```

For example, your configuration setting appears similar to:

```xml
<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=storagesample;AccountKey=GMuzNHjlB3S9itqZJHHCnRkrokLkcSyW7yK9BRbGp0ENePunLPwBgpxV1Z/pVo9zpem/2xSHXkMqTHHLcx8XRA==EndpointSuffix=core.windows.net" />
```

To target the Azurite storage emulator, you can use a shortcut that maps to the well-known account name and key. In that case, your connection string setting is:

```xml
<add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
```

### Add using directives

Add the following `using` directives to the top of the `Program.cs` file:

# [.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_UsingStatements":::

# [.NET v11 SDK](#tab/dotnetv11)

```csharp
using System; // Namespace for Console output
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.Azure.Storage; // Namespace for CloudStorageAccount
using Microsoft.Azure.Storage.Queue; // Namespace for Queue storage types
```

---

### Create the Queue Storage client

# [.NET v12 SDK](#tab/dotnet)

The [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient) class enables you to retrieve queues stored in Queue Storage. Here's one way to create the service client:

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_CreateClient":::

> [!TIP]
> Messages that you send by using the [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient) class, must be in a format that can be included in an XML request with UTF-8 encoding. Optionally, you can set the [MessageEncoding](/dotnet/api/azure.storage.queues.queueclientoptions.messageencoding) option to [Base64](/dotnet/api/azure.storage.queues.queuemessageencoding) to handle non-compliant messages.

# [.NET v11 SDK](#tab/dotnetv11)

The [`CloudQueueClient`](/dotnet/api/microsoft.azure.storage.queue.cloudqueueclient?view=azure-dotnet-legacy&preserve-view=true) class enables you to retrieve queues stored in Queue Storage. Here's one way to create the service client:

```csharp
// Retrieve storage account from connection string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
```

---

Now you are ready to write code that reads data from and writes data to Queue Storage.

## Create a queue

This example shows how to create a queue:

# [.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_CreateQueue":::

# [.NET v11 SDK](#tab/dotnetv11)

```csharp
// Retrieve storage account from connection string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.CreateIfNotExists();
```

---

## Insert a message into a queue

# [.NET v12 SDK](#tab/dotnet)

To insert a message into an existing queue, call the [`SendMessage`](/dotnet/api/azure.storage.queues.queueclient.sendmessage) method. A message can be either a string (in UTF-8 format) or a byte array. The following code creates a queue (if it doesn't exist) and inserts a message:

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_InsertMessage":::

# [.NET v11 SDK](#tab/dotnetv11)

To insert a message into an existing queue, first create a new [`CloudQueueMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage?view=azure-dotnet-legacy&preserve-view=true). Next, call the [`AddMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.addmessage?view=azure-dotnet-legacy&preserve-view=true) method. A `CloudQueueMessage` can be created from either a string (in UTF-8 format) or a byte array. Here is code which creates a queue (if it doesn't exist) and inserts the message `Hello, World`:
To insert a message into an existing queue, first create a new [`CloudQueueMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueuemessage?view=azure-dotnet-legacy&preserve-view=true). Next, call the [`AddMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.addmessage?view=azure-dotnet-legacy&preserve-view=true) method. A `CloudQueueMessage` can be created from either a string (in UTF-8 format) or a byte array. Here is code which creates a queue (if it doesn't exist) and inserts the message `Hello, World`:

```csharp
// Retrieve storage account from connection string
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create the queue client
CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();

// Retrieve a reference to a queue
CloudQueue queue = queueClient.GetQueueReference("myqueue");

// Create the queue if it doesn't already exist
queue.CreateIfNotExists();

// Create a message and add it to the queue
CloudQueueMessage message = new CloudQueueMessage("Hello, World");
queue.AddMessage(message);
```

---

## Peek at the next message

# [.NET v12 SDK](#tab/dotnet)

You can peek at the messages in the queue without removing them from the queue by calling the [`PeekMessages`](/dotnet/api/azure.storage.queues.queueclient.peekmessages) method. If you don't pass a value for the `maxMessages` parameter, the default is to peek at one message.

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_PeekMessage":::

# [.NET v11 SDK](#tab/dotnetv11)

You can peek at the message in the front of a queue without removing it from the queue by calling the [`PeekMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.peekmessage?view=azure-dotnet-legacy&preserve-view=true) method.

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

---

## Change the contents of a queued message

You can change the contents of a message in-place in the queue. If the message represents a work task, you could use this feature to update the status of the work task. The following code updates the queue message with new contents, and sets the visibility timeout to extend another 60 seconds. This saves the state of work associated with the message, and gives the client another minute to continue working on the message. You could use this technique to track multistep workflows on queue messages, without having to start over from the beginning if a processing step fails due to hardware or software failure. Typically, you would keep a retry count as well, and if the message is retried more than *n* times, you would delete it. This protects against a message that triggers an application error each time it is processed.

# [.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_UpdateMessage":::

# [.NET v11 SDK](#tab/dotnetv11)

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

---

## Dequeue the next message

# [.NET v12 SDK](#tab/dotnet)

Dequeue a message from a queue in two steps. When you call [`ReceiveMessages`](/dotnet/api/azure.storage.queues.queueclient.receivemessages), you get the next message in a queue. A message returned from `ReceiveMessages` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [`DeleteMessage`](/dotnet/api/azure.storage.queues.queueclient.deletemessage). This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls `DeleteMessage` right after the message has been processed.

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_DequeueMessage":::

# [.NET v11 SDK](#tab/dotnetv11)

Your code dequeues a message from a queue in two steps. When you call [`GetMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessage?view=azure-dotnet-legacy&preserve-view=true), you get the next message in a queue. A message returned from `GetMessage` becomes invisible to any other code reading messages from this queue. By default, this message stays invisible for 30 seconds. To finish removing the message from the queue, you must also call [`DeleteMessage`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.deletemessage?view=azure-dotnet-legacy&preserve-view=true). This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls `DeleteMessage` right after the message has been processed.

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

---

<!-- docutune:casing "Async-Await pattern" "Async and Await" -->

## Use the Async-Await pattern with common Queue Storage APIs

This example shows how to use the Async-Await pattern with common Queue Storage APIs. The sample calls the asynchronous version of each of the given methods, as indicated by the `Async` suffix of each method. When an async method is used, the Async-Await pattern suspends local execution until the call completes. This behavior allows the current thread to do other work, which helps avoid performance bottlenecks and improves the overall responsiveness of your application. For more details on using the Async-Await pattern in .NET, see [Async and Await (C# and Visual Basic)](/previous-versions/hh191443(v=vs.140))

# [.NET v12 SDK](#tab/dotnet)

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_AsyncQueue":::

# [.NET v11 SDK](#tab/dotnetv11)

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

---

## Use additional options for dequeuing messages

There are two ways you can customize message retrieval from a queue. First, you can get a batch of messages (up to 32). Second, you can set a longer or shorter invisibility timeout, allowing your code more or less time to fully process each message.

# [.NET v12 SDK](#tab/dotnet)

The following code example uses the [`ReceiveMessages`](/dotnet/api/azure.storage.queues.queueclient.receivemessages) method to get 20 messages in one call. Then it processes each message using a `foreach` loop. It also sets the invisibility timeout to five minutes for each message. Note that the five minutes starts for all messages at the same time, so after five minutes have passed since the call to `ReceiveMessages`, any messages which have not been deleted will become visible again.

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_DequeueMessages":::

# [.NET v11 SDK](#tab/dotnetv11)

The following code example uses the [`GetMessages`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessages?view=azure-dotnet-legacy&preserve-view=true) method to get 20 messages in one call. Then it processes each message using a `foreach` loop. It also sets the invisibility timeout to five minutes for each message. Note that the five minutes starts for all messages at the same time, so after five minutes have passed since the call to `GetMessages`, any messages which have not been deleted will become visible again.

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

---

## Get the queue length

# [.NET v12 SDK](#tab/dotnet)

You can get an estimate of the number of messages in a queue. The [`GetProperties`](/dotnet/api/azure.storage.queues.queueclient.getproperties) method returns queue properties including the message count. The [`ApproximateMessagesCount`](/dotnet/api/azure.storage.queues.models.queueproperties.approximatemessagescount) property contains the approximate number of messages in the queue. This number is not lower than the actual number of messages in the queue, but could be higher.

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_GetQueueLength":::

# [.NET v11 SDK](#tab/dotnetv11)

You can get an estimate of the number of messages in a queue. The [`FetchAttributes`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.fetchattributes?view=azure-dotnet-legacy&preserve-view=true) method returns queue attributes including the message count. The [`ApproximateMessageCount`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.approximatemessagecount?view=azure-dotnet-legacy&preserve-view=true) property returns the last value retrieved by the `FetchAttributes` method, without calling Queue Storage.

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
int cachedMessageCount = queue.ApproximateMessageCount;

// Display number of messages.
Console.WriteLine("Number of messages in queue: " + cachedMessageCount);
```

---

## Delete a queue

# [.NET v12 SDK](#tab/dotnet)

To delete a queue and all the messages contained in it, call the [`Delete`](/dotnet/api/azure.storage.queues.queueclient.delete) method on the queue object.

:::code language="csharp" source="~/azure-storage-snippets/queues/howto/dotnet/dotnet-v12/QueueBasics.cs" id="snippet_DeleteQueue":::

# [.NET v11 SDK](#tab/dotnetv11)

To delete a queue and all the messages contained in it, call the [`Delete`](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.delete?view=azure-dotnet-legacy&preserve-view=true) method on the queue object.

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

---

## Next steps

Now that you've learned the basics of Queue Storage, follow these links to learn about more complex storage tasks.

- View the Queue Storage reference documentation for complete details about available APIs:
  - [Azure Storage client library for .NET reference](/dotnet/api/overview/azure/storage)
  - [Azure Storage REST API reference](/rest/api/storageservices/)
- View more feature guides to learn about additional options for storing data in Azure.
  - [Get started with Azure Table Storage using .NET](../../cosmos-db/tutorial-develop-table-dotnet.md) to store structured data.
  - [Get started with Azure Blob Storage using .NET](../blobs/storage-quickstart-blobs-dotnet.md) to store unstructured data.
  - [Connect to SQL Database by using .NET (C#)](/azure/azure-sql/database/connect-query-dotnet-core) to store relational data.
- Learn how to simplify the code you write to work with Azure Storage by using the [Azure WebJobs SDK](https://github.com/Azure/azure-webjobs-sdk/wiki).
