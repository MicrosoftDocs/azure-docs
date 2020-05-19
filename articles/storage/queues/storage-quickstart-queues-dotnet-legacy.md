---
title: "Quickstart: Use Azure Storage v11 for .NET to manage a queue"
description: In this quickstart, you learn how to use the Azure Storage client library for .NET to create a queue and add messages to it. Next, you learn how to read and process messages from the queue.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 02/06/2018
ms.service: storage
ms.subservice: queues
ms.topic: quickstart
ms.reviewer: cbrooks
---

# Quickstart: Use the Azure Storage SDK v11 for .NET to manage a queue

In this quickstart, you learn how to use the Azure Storage client library version 11 for .NET to create a queue and add messages to it. Next, you learn how to read and process messages from the queue. 

## Prerequisites

[!INCLUDE [storage-quickstart-prereq-include](../../../includes/storage-quickstart-prereq-include.md)]

Next, download and install .NET Core 2.0 for your operating system. If you are running Windows, you can install Visual Studio and use the .NET Framework if you prefer. You can also choose to install an editor to use with your operating system.

### Windows

- Install [.NET Core for Windows](https://www.microsoft.com/net/download/windows) or the [.NET Framework](https://www.microsoft.com/net/download/windows) (included with Visual Studio for Windows)
- Install [Visual Studio for Windows](https://www.visualstudio.com/). If you are using .NET Core, installing Visual Studio is optional.  

For information about choosing between .NET Core and the .NET Framework, see [Choose between .NET Core and .NET Framework for server apps](https://docs.microsoft.com/dotnet/standard/choosing-core-framework-server).

### Linux

- Install [.NET Core for Linux](https://www.microsoft.com/net/download/linux)
- Optionally install [Visual Studio Code](https://www.visualstudio.com/) and the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

### macOS

- Install [.NET Core for macOS](https://www.microsoft.com/net/download/macos).
- Optionally install [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac/)

## Download the sample application

The sample application used in this quickstart is a basic console application. You can explore the sample application on [GitHub](https://github.com/Azure-Samples/storage-queues-dotnet-quickstart).

Use [git](https://git-scm.com/) to download a copy of the application to your development environment. 

```bash
git clone https://github.com/Azure-Samples/storage-queues-dotnet-quickstart.git
```

This command clones the repository to your local git folder. To open the Visual Studio solution, look for the *storage-queues-dotnet-quickstart* folder, open it, and double-click on *storage-queues-dotnet-quickstart.sln*. 

[!INCLUDE [storage-copy-connection-string-portal](../../../includes/storage-copy-connection-string-portal.md)]

## Configure your storage connection string

To run the application, you must provide the connection string for your storage account. The sample application reads the connection string from an environment variable and uses it to authorize requests to Azure Storage.

After you have copied your connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string:

### Windows

```cmd
setx storageconnectionstring "<yourconnectionstring>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the sample. 

### Linux

```bash
export storageconnectionstring=<yourconnectionstring>
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

### macOS

Edit your .bash_profile, and add the environment variable:

```bash
export STORAGE_CONNECTION_STRING=<yourconnectionstring>
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.

## Run the sample

The sample application creates a queue and adds a message to it. The application first peeks at the message without removing it from the queue, then retrieves the message and deletes it from the queue.

### Windows

If you are using Visual Studio as your editor, you can press **F5** to run. 

Otherwise, navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

### Linux

Navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

### macOS

Navigate to your application directory and run the application with the `dotnet run` command.

```
dotnet run
```

The output of the sample application is similar to the following example:

```
Azure Queues - .NET Quickstart sample

Created queue 'quickstartqueues-3136fe9a-fa52-4b19-a447-8999a847da52'

Added message 'aa8fa95f-07ea-4df7-bf86-82b3f7debfb7' to queue 'quickstartqueues-3136fe9a-fa52-4b19-a447-8999a847da52'
Message insertion time: 2/7/2019 4:30:46 AM +00:00
Message expiration time: 2/14/2019 4:30:46 AM +00:00

Contents of peeked message 'aa8fa95f-07ea-4df7-bf86-82b3f7debfb7': Hello, World

Message 'aa8fa95f-07ea-4df7-bf86-82b3f7debfb7' becomes visible again at 2/7/2019 4:31:16 AM +00:00

Processed and deleted message 'aa8fa95f-07ea-4df7-bf86-82b3f7debfb7'

Press any key to delete the sample queue.
```

## Understand the sample code

Next, explore the sample code so that you can understand how it works.

### Try parsing the connection string

The sample first checks that the environment variable contains a connection string that can be parsed to create a [CloudStorageAccount](/dotnet/api/microsoft.azure.cosmos.table.cloudstorageaccount) object pointing to the storage account. To check that the connection string is valid, the sample uses the [TryParse](/dotnet/api/microsoft.azure.cosmos.table.cloudstorageaccount.tryparse) method. If **TryParse** is successful, it initializes the *storageAccount* variable and returns **true**.

```csharp
// Retrieve the connection string for use with the application. The storage connection string is stored
// in an environment variable called storageconnectionstring, on the machine where the application is running.
// If the environment variable is created after the application is launched in a console or with Visual
// Studio, the shell needs to be closed and reloaded to take the environment variable into account.
string storageConnectionString = Environment.GetEnvironmentVariable("storageconnectionstring");

// Check whether the connection string can be parsed.
if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
{
    // If the connection string is valid, proceed with calls to Azure Queues here.
    ...    
}
else
{
    Console.WriteLine(
        "A connection string has not been defined in the system environment variables. " +
        "Add an environment variable named 'storageconnectionstring' with your storage " +
        "connection string as a value.");
}
```

### Create the queue

First, the sample creates a queue and adds a message to it. 

```csharp
// Create a queue called 'quickstartqueues' and append a GUID value so that the queue name 
// is unique in your storage account. 
queue = cloudQueueClient.GetQueueReference("quickstartqueues-" + Guid.NewGuid().ToString());
await queue.CreateAsync();

Console.WriteLine("Created queue '{0}'", queue.Name);
Console.WriteLine();
```

### Add a message

Next, the sample adds a message to the back of the queue. 

A message must be in a format that can be included in an XML request with UTF-8 encoding, and may be up to 64 KB in size. If a message contains binary data, we recommend that you Base64-encode the message.

By default, the maximum time-to-live for a message is set to 7 days. You can specify any positive number for the message time-to-live.

```csharp
// Create a message and add it to the queue. Set expiration time to 14 days.
CloudQueueMessage message = new CloudQueueMessage("Hello, World");
await queue.AddMessageAsync(message, new TimeSpan(14,0,0,0), null, null, null);
Console.WriteLine("Added message '{0}' to queue '{1}'", message.Id, queue.Name);
Console.WriteLine("Message insertion time: {0}", message.InsertionTime.ToString());
Console.WriteLine("Message expiration time: {0}", message.ExpirationTime.ToString());
Console.WriteLine();
```

To add a message that does not expire, use `Timespan.FromSeconds(-1)` in your call to [AddMessageAsync](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.addmessageasync).

```csharp
await queue.AddMessageAsync(message, TimeSpan.FromSeconds(-1), null, null, null);
```

### Peek a message from the queue

The sample shows how to peek a message from a queue. When you peek a message, you can read the contents of the message. However, the message remains visible to other clients, so that another client can subsequently retrieve and process the message.

```csharp
// Peek at the message at the front of the queue. Peeking does not alter the message's 
// visibility, so that another client can still retrieve and process it. 
CloudQueueMessage peekedMessage = await queue.PeekMessageAsync();

// Display the ID and contents of the peeked message.
Console.WriteLine("Contents of peeked message '{0}': {1}", peekedMessage.Id, peekedMessage.AsString);
Console.WriteLine();
```

### Dequeue a message

The sample also shows how to dequeue a message. When you dequeue a message, you retrieve the message from the front of the queue and render it temporarily invisible to other clients. By default, a message remains invisible for 30 seconds. During this time, your code can process the message. To finish dequeueing the message, you delete the message immediately after processing, so that another client does not dequeue the same message.

If your code fails to process a message due to a hardware or software failure, then the message becomes visible again after the period of invisibility has lapsed. Another client can retrieve the same message and try again.

```csharp
// Retrieve the message at the front of the queue. The message becomes invisible for 
// a specified interval, during which the client attempts to process it.
CloudQueueMessage retrievedMessage = await queue.GetMessageAsync();

// Display the time at which the message will become visible again if it is not deleted.
Console.WriteLine("Message '{0}' becomes visible again at {1}", retrievedMessage.Id, retrievedMessage.NextVisibleTime);
Console.WriteLine();

//Process and delete the message within the period of invisibility.
await queue.DeleteMessageAsync(retrievedMessage);
Console.WriteLine("Processed and deleted message '{0}'", retrievedMessage.Id);
Console.WriteLine();
```

### Clean up resources

The sample cleans up the resources that it created by deleting the queue. Deleting the queue also deletes any messages it contains.

```csharp
Console.WriteLine("Press any key to delete the sample queue.");
Console.ReadLine();
Console.WriteLine("Deleting the queue and any messages it contains...");
Console.WriteLine();
if (queue != null)
{
    await queue.DeleteIfExistsAsync();
}
```

## Resources for developing .NET applications with queues

See these additional resources for .NET development with Azure Queues:

### Binaries and source code

- Download the NuGet packages for the latest version of the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage?view=azure-dotnet)
    - [Common](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/)
    - [Queues](https://www.nuget.org/packages/Azure.Storage.Queues/)
- View the [.NET client library source code](https://github.com/Azure/azure-storage-net) on GitHub.

### Client library reference and samples

- See the [.NET API reference](https://docs.microsoft.com/dotnet/api/overview/azure/storage) for more information about the .NET client library.
- Explore [Queue storage samples](https://azure.microsoft.com/resources/samples/?sort=0&service=storage&platform=dotnet&term=queues) written using the .NET client library.

## Next steps

In this quickstart, you learned how to add messages to a queue, peek messages from a queue, and dequeue and process messages using .NET. 

> [!div class="nextstepaction"]
> [Communicate between applications with Azure Queue storage](https://docs.microsoft.com/learn/modules/communicate-between-apps-with-azure-queue-storage/index)

- To learn more about .NET Core, see [Get started with .NET in 10 minutes](https://www.microsoft.com/net/learn/get-started/).
