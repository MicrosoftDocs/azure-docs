---
title: Tutorial - Work with Azure storage queues
description: A tutorial on how to use the Azure Queue service to create queues, and insert, get, and delete messages.
services: storage
author: mhopkins-msft
ms.author: mhopkins
ms.service: storage
ms.subservice: queues
ms.topic: tutorial
ms.date: 04/03/2019
#Customer intent: As a developer, I want to use queues in my app so that my service will scale automatically during high demand times without losing data.
---

# Tutorial: Work with Azure storage queues

Queues let your application scale automatically and immediately when demand changes. This makes them useful for critical business data that would be damaging to lose. A queue increases resiliency by temporarily storing waiting messages. At times of low or normal demand, the size of the queue remains small because the destination component removes messages from the queue faster than they are added. At times of high demand, the queue may increase in size, but messages are not lost. The destination component can catch up and empty the queue as demand returns to normal. The article demonstrates the basic steps for creating an Azure storage queue.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure storage account
> - Create the app
> - Get your connection string
> - Programmatically access a queue
> - Insert messages into the queue
> - Get messages from the queue
> - Delete messages from the queue

## Prerequisites

- Get your free copy of the cross platform [Visual Studio Code](https://code.visualstudio.com/download) editor.
- If you don't already have the .NET SDK installed by installing Visual Studio, download and install the [.NET Core SDK](https://dotnet.microsoft.com/download).
- If you don’t have a current Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an Azure storage account

The first step in creating a queue is to create the Azure Storage Account that will store our data. There are several options you can supply when you create the account, most of which you can use the default selection. See the [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2Fazure%2Fstorage%2Fqueues%2Ftoc.json) quickstart for a step-by-step guide to creating a storage account.

## Create the app

We'll create a .NET Core application that you can run on Linux, macOS, or Windows. Let's name it **QueueApp**. For simplicity, we'll use a single app that will both send and receive messages through our queue.

1. Use the `dotnet new` command to create a new console app with the name **QueueApp**. You can type commands into the Cloud Shell on the right, or if you are working locally, in a terminal/console window. This command creates a simple app with a single source file: `Program.cs`.

```console
dotnet new console -n QueueApp
```

1. Switch to the newly created `QueueApp` folder and build the app to verify that all is well.

```console
cd QueueApp
```

```console
dotnet build
```

## Get your connection string

The client library uses a **connection string** to establish your connection. Your connection string is available in the **Settings** section of your Storage Account in the Azure portal. Click the **Copy** button to the right of the **Connection string** field.

![Connection string](media/storage-tutorial-queues/get-connection-string.png)

The connection string will look something like this:

```csharp
private const string connectionString = "DefaultEndpointsProtocol=https;AccountName=<your storage account name>;AccountKey=<your key>;EndpointSuffix=core.windows.net";
```

### Add the connection string to the app

Add the connection string into the app so it can access the storage account.

1. From the command line in the project directory, type `code .` to open Visual Studio Code.

2. Open the `Program.cs` source file in the project.

3. In the `Program` class, add a const string value to hold the connection string. You only need the value (it starts with the text DefaultEndpointsProtocol).

Your code should look something like this (the string value will be unique to your account).

```csharp
...
namespace QueueApp
{
    class Program
    {
        private const string connectionString = "DefaultEndpointsProtocol=https; ...";

        ...
    }
}
```

4. Save the file.

## Programmatically access a queue

1. Install the `WindowsAzure.Storage` package to the project with the `dotnet add package` command. Do this in the same folder as the project.

```console
dotnet add package WindowsAzure.Storage
```

2. At the top of the file, add the following namespaces. We'll be using types from both of these to connect to Azure Storage and then to work with queues.

```csharp
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue; 
```

1. Add the following method to your `Program` class to get a reference to the `CloudQueue`. This method will be called for both Send and Receive operations.

```csharp
static CloudQueue GetQueue()
{
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
    CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
    return queueClient.GetQueueReference("newsqueue");
}
```

## Insert messages into the queue

Create a new method to asynchronously send a news story into a queue. Add the following method to your `Program` class.

```csharp
static async Task SendArticleAsync(string newsMessage)
{
    CloudQueue queue = GetQueue();
    bool createdQueue = await queue.CreateIfNotExistsAsync();

    if (createdQueue)
    {
        Console.WriteLine("The queue of news articles was created.");
    }

    CloudQueueMessage articleMessage = new CloudQueueMessage(newsMessage);
    await queue.AddMessageAsync(articleMessage);
}
```

## Dequeue messages

Once we've successfully received the message from the queue, it is safe to delete it so we don't process it more than once. Create a new method to asynchronously receive a news story from a queue. After the message is received, delete it from the queue. Add the following method to your `Program` class.

```csharp
static async Task<string> ReceiveArticleAsync()
{
    CloudQueue queue = GetQueue();
    bool exists = await queue.ExistsAsync();
    if (exists)
    {
        CloudQueueMessage retrievedArticle = await queue.GetMessageAsync();
        if (retrievedArticle != null)
        {
            string newsMessage = retrievedArticle.AsString;
            await queue.DeleteMessageAsync(retrievedArticle);
            return newsMessage;
        }
    }

    return "<queue empty or not created>";
}
```

## Complete code

Here is the complete code listing for this project.

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;

namespace QueueApp
{
    class Program
    {
        private const string connectionString = "DefaultEndpointsProtocol=https;AccountName=<your storage account name>;AccountKey=<your key>;EndpointSuffix=core.windows.net";

        static async Task Main(string[] args)
        {
            if (args.Length > 0)
            {
                string value = String.Join(" ", args);
                await SendArticleAsync(value);
                Console.WriteLine($"Sent: {value}");
            }
            else
            {
                string value = await ReceiveArticleAsync();
                Console.WriteLine($"Received {value}");
            }
        }

        static async Task SendArticleAsync(string newsMessage)
        {
            CloudQueue queue = GetQueue();
            bool createdQueue = await queue.CreateIfNotExistsAsync();

            if (createdQueue)
            {
                Console.WriteLine("The queue of news articles was created.");
            }

            CloudQueueMessage articleMessage = new CloudQueueMessage(newsMessage);
            await queue.AddMessageAsync(articleMessage);
        }

        static async Task<string> ReceiveArticleAsync()
        {
            CloudQueue queue = GetQueue();
            bool exists = await queue.ExistsAsync();
            if (exists)
            {
                CloudQueueMessage retrievedArticle = await queue.GetMessageAsync();
                if (retrievedArticle != null)
                {
                    string newsMessage = retrievedArticle.AsString;
                    await queue.DeleteMessageAsync(retrievedArticle);
                    return newsMessage;
                }
            }

            return "<queue empty or not created>";
        }

        static CloudQueue GetQueue()
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            return queueClient.GetQueueReference("newsqueue");
        }
    }
}

```

## Clean up resources

When you're working in your own subscription, it's a best practice at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. You can delete resources one by one or just delete the resource group to get rid of the entire set.

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps](storage-quickstart-queues-portal.md)
