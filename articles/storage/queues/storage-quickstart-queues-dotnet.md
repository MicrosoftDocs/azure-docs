---
title: "Quickstart: Azure Queue Storage client library v12 - .NET"
description: Learn how to use the Azure Queue Storage client library v12 for .NET to create a queue and add messages to the queue. Next, you learn how to read and delete messages from the queue. You'll also learn how to delete a queue.
author: twooley
ms.author: twooley
ms.date: 07/24/2020
ms.topic: quickstart
ms.service: storage
ms.subservice: queues
ms.custom: devx-track-csharp
---

# Quickstart: Azure Queue Storage client library v12 for .NET

Get started with the Azure Queue Storage client library version 12 for .NET. Azure Queue Storage is a service for storing large numbers of messages for later retrieval and processing. Follow these steps to install the package and try out example code for basic tasks.

Use the Azure Queue Storage client library v12 for .NET to:

- Create a queue
- Add messages to a queue
- Peek at messages in a queue
- Update a message in a queue
- Receive messages from a queue
- Delete messages from a queue
- Delete a queue

Additional resources:

- [API reference documentation](/dotnet/api/azure.storage.queues)
- [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Queues/12.0.0)
- [Samples](../common/storage-samples-dotnet.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json#queue-samples)

## Prerequisites

- Azure subscription - [create one for free](https://azure.microsoft.com/free/)
- Azure Storage account - [create a storage account](../common/storage-account-create.md)
- Current [.NET Core SDK](https://dotnet.microsoft.com/download/dotnet-core) for your operating system. Be sure to get the SDK and not the runtime.

## Setting up

This section walks you through preparing a project to work with the Azure Queue Storage client library v12 for .NET.

### Create the project

Create a .NET Core application named `QueuesQuickstartV12`.

1. In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `QueuesQuickstartV12`. This command creates a simple "hello world" C# project with a single source file named `Program.cs`.

   ```console
   dotnet new console -n QueuesQuickstartV12
   ```

1. Switch to the newly created `QueuesQuickstartV12` directory.

   ```console
   cd QueuesQuickstartV12
   ```

### Install the package

While still in the application directory, install the Azure Queue Storage client library for .NET package by using the `dotnet add package` command.

```console
dotnet add package Azure.Storage.Queues
```

### Set up the app framework

From the project directory:

1. Open the `Program.cs` file in your editor
1. Remove the `Console.WriteLine("Hello, World");` statement
1. Add `using` directives
1. Update the `Main` method declaration to [support async code](/dotnet/csharp/whats-new/csharp-7#async-main)

Here's the code:

```csharp
using Azure;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using System;
using System.Threading.Tasks;

namespace QueuesQuickstartV12
{
    class Program
    {
        static async Task Main(string[] args)
        {
        }
    }
}
```

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Queue Storage is a service for storing large numbers of messages. A queue message can be up to 64 KB in size. A queue may contain millions of messages, up to the total capacity limit of a storage account. Queues are commonly used to create a backlog of work to process asynchronously. Queue Storage offers three types of resources:

- The storage account
- A queue in the storage account
- Messages within the queue

The following diagram shows the relationship between these resources.

![Diagram of Queue storage architecture](./media/storage-queues-introduction/queue1.png)

Use the following .NET classes to interact with these resources:

- [`QueueServiceClient`](/dotnet/api/azure.storage.queues.queueserviceclient): The `QueueServiceClient` allows you to manage the all queues in your storage account.
- [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient): The `QueueClient` class allows you to manage and manipulate an individual queue and its messages.
- [`QueueMessage`](/dotnet/api/azure.storage.queues.models.queuemessage): The `QueueMessage` class represents the individual objects returned when calling [`ReceiveMessages`](/dotnet/api/azure.storage.queues.queueclient.receivemessages) on a queue.

## Code examples

These example code snippets show you how to perform the following actions with the Azure Queue Storage client library for .NET:

- [Get the connection string](#get-the-connection-string)
- [Create a queue](#create-a-queue)
- [Add messages to a queue](#add-messages-to-a-queue)
- [Peek at messages in a queue](#peek-at-messages-in-a-queue)
- [Update a message in a queue](#update-a-message-in-a-queue)
- [Receive messages from a queue](#receive-messages-from-a-queue)
- [Delete messages from a queue](#delete-messages-from-a-queue)
- [Delete a queue](#delete-a-queue)

### Get the connection string

The following code retrieves the connection string for the storage account. The connection string is stored in the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `Main` method:

```csharp
Console.WriteLine("Azure Queue Storage client library v12 - .NET quickstart sample\n");

// Retrieve the connection string for use with the application. The storage
// connection string is stored in an environment variable called
// AZURE_STORAGE_CONNECTION_STRING on the machine running the application.
// If the environment variable is created after the application is launched
// in a console or with Visual Studio, the shell or application needs to be
// closed and reloaded to take the environment variable into account.
string connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");
```

### Create a queue

Decide on a name for the new queue. The following code appends a GUID value to the queue name to ensure that it's unique.

> [!IMPORTANT]
> Queue names may only contain lowercase letters, numbers, and hyphens, and must begin with a letter or a number. Each hyphen must be preceded and followed by a non-hyphen character. The name must also be between 3 and 63 characters long. For more information, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

Create an instance of the [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient) class. Then, call the [`CreateAsync`](/dotnet/api/azure.storage.queues.queueclient.createasync) method to create the queue in your storage account.

Add this code to the end of the `Main` method:

```csharp
// Create a unique name for the queue
string queueName = "quickstartqueues-" + Guid.NewGuid().ToString();

Console.WriteLine($"Creating queue: {queueName}");

// Instantiate a QueueClient which will be
// used to create and manipulate the queue
QueueClient queueClient = new QueueClient(connectionString, queueName);

// Create the queue
await queueClient.CreateAsync();
```

### Add messages to a queue

The following code snippet asynchronously adds messages to queue by calling the [`SendMessageAsync`](/dotnet/api/azure.storage.queues.queueclient.sendmessageasync) method. It also saves a [`SendReceipt`](/dotnet/api/azure.storage.queues.models.sendreceipt) returned from a `SendMessageAsync` call. The receipt is used to update the message later in the program.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("\nAdding messages to the queue...");

// Send several messages to the queue
await queueClient.SendMessageAsync("First message");
await queueClient.SendMessageAsync("Second message");

// Save the receipt so we can update this message later
SendReceipt receipt = await queueClient.SendMessageAsync("Third message");
```

### Peek at messages in a queue

Peek at the messages in the queue by calling the [`PeekMessagesAsync`](/dotnet/api/azure.storage.queues.queueclient.peekmessagesasync) method. This method retrieves one or more messages from the front of the queue but doesn't alter the visibility of the message.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("\nPeek at the messages in the queue...");

// Peek at messages in the queue
PeekedMessage[] peekedMessages = await queueClient.PeekMessagesAsync(maxMessages: 10);

foreach (PeekedMessage peekedMessage in peekedMessages)
{
    // Display the message
    Console.WriteLine($"Message: {peekedMessage.MessageText}");
}
```

### Update a message in a queue

Update the contents of a message by calling the [`UpdateMessageAsync`](/dotnet/api/azure.storage.queues.queueclient.updatemessageasync) method. This method can change a message's visibility timeout and contents. The message content must be a UTF-8 encoded string that is up to 64 KB in size. Along with the new content for the message, pass in the values from the `SendReceipt` that was saved earlier in the code. The `SendReceipt` values identify which message to update.

```csharp
Console.WriteLine("\nUpdating the third message in the queue...");

// Update a message using the saved receipt from sending the message
await queueClient.UpdateMessageAsync(receipt.MessageId, receipt.PopReceipt, "Third message has been updated");
```

### Receive messages from a queue

Download previously added messages by calling the [`ReceiveMessagesAsync`](/dotnet/api/azure.storage.queues.queueclient.receivemessagesasync) method.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("\nReceiving messages from the queue...");

// Get messages from the queue
QueueMessage[] messages = await queueClient.ReceiveMessagesAsync(maxMessages: 10);
```

### Delete messages from a queue

Delete messages from the queue after they're been processed. In this case, processing is just displaying the message on the console.

The app pauses for user input by calling `Console.ReadLine` before it processes and deletes the messages. Verify in your [Azure portal](https://portal.azure.com) that the resources were created correctly, before they're deleted. Any messages not explicitly deleted will eventually become visible in the queue again for another chance to process them.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("\nPress Enter key to 'process' messages and delete them from the queue...");
Console.ReadLine();

// Process and delete messages from the queue
foreach (QueueMessage message in messages)
{
    // "Process" the message
    Console.WriteLine($"Message: {message.MessageText}");

    // Let the service know we're finished with
    // the message and it can be safely deleted.
    await queueClient.DeleteMessageAsync(message.MessageId, message.PopReceipt);
}
```

### Delete a queue

The following code cleans up the resources the app created by deleting the queue using the [`DeleteAsync`](/dotnet/api/azure.storage.queues.queueclient.deleteasync) method.

Add this code to the end of the `Main` method:

```csharp
Console.WriteLine("\nPress Enter key to delete the queue...");
Console.ReadLine();

// Clean up
Console.WriteLine($"Deleting queue: {queueClient.Name}");
await queueClient.DeleteAsync();

Console.WriteLine("Done");
```

## Run the code

This app creates and adds three messages to an Azure queue. The code lists the messages in the queue, then retrieves and deletes them, before finally deleting the queue.

In your console window, navigate to your application directory, then build and run the application.

```console
dotnet build
```

```console
dotnet run
```

The output of the app is similar to the following example:

```output
Azure Queue Storage client library v12 - .NET quickstart sample

Creating queue: quickstartqueues-5c72da2c-30cc-4f09-b05c-a95d9da52af2

Adding messages to the queue...

Peek at the messages in the queue...
Message: First message
Message: Second message
Message: Third message

Updating the third message in the queue...

Receiving messages from the queue...

Press Enter key to 'process' messages and delete them from the queue...

Message: First message
Message: Second message
Message: Third message has been updated

Press Enter key to delete the queue...

Deleting queue: quickstartqueues-5c72da2c-30cc-4f09-b05c-a95d9da52af2
Done
```

When the app pauses before receiving messages, check your storage account in the [Azure portal](https://portal.azure.com). Verify the messages are in the queue.

Press the `Enter` key to receive and delete the messages. When prompted, press the `Enter` key again to delete the queue and finish the demo.

## Next steps

In this quickstart, you learned how to create a queue and add messages to it using asynchronous .NET code. Then you learned to peek, retrieve, and delete messages. Finally, you learned how to delete a message queue.

For tutorials, samples, quick starts and other documentation, visit:

> [!div class="nextstepaction"]
> [Azure for .NET and .NET Core developers](/dotnet/azure/)

- To learn more, see the [Azure Storage libraries for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage).
- For more Azure Queue Storage sample apps, see [Azure Queue Storage client library for .NET samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Queues/samples).
- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).
