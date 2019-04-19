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
# Customer intent: As a developer, I want to use queues in my app so that my service will scale automatically during high demand times without losing data.
---

# Tutorial: Work with Azure storage queues

Azure Queue storage implements cloud-based queues to enable communication between components of a distributed application. Each queue maintains a list of messages that can be added by a sender component and processed by a receiver component. With a queue, your application can scale immediately to meet demand, improving resiliency. This article shows the basic steps for working with an Azure storage queue.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure storage account
> - Create the app
> - Add support for asynchronous code
> - Create a queue
> - Programmatically access a queue
> - Insert messages into a queue
> - Dequeue messages
> - Delete an empty queue
> - Check for command-line arguments
> - Build and run the app

## Prerequisites

- Get your free copy of the cross platform [Visual Studio Code](https://code.visualstudio.com/download) editor.
- Download and install the [.NET Core SDK](https://dotnet.microsoft.com/download).
- If you don’t have a current Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create an Azure storage account

First, create an Azure storage account. For a step-by-step guide to creating a storage account, see the [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2Fazure%2Fstorage%2Fqueues%2Ftoc.json) quickstart.

## Create the app

Create a .NET Core application named **QueueApp**. For simplicity, this app will both send and receive messages through the queue.

1. In a console window, (such as CMD, PowerShell, or Azure CLI) use the `dotnet new` command to create a new console app with the name **QueueApp**. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

   ```console
   dotnet new console -n QueueApp
   ```

2. Switch to the newly created **QueueApp** folder and build the app to verify that all is well.

   ```console
   cd QueueApp
   ```

   ```console
   dotnet build
   ```

## Add support for asynchronous code

Since the app uses cloud resources, the code runs asynchronously. However, C#'s **async** and **await** weren't valid keywords in **Main** methods until C# 7.1. You can easily switch to that compiler through a flag in the .csproj file.

1. Open the **QueueApp.csproj** file in the editor.

2. Add `<LangVersion>7.1</LangVersion>` into the first **PropertyGroup** in the build file.

   ```xml
   <Project Sdk="Microsoft.NET.Sdk">

     <PropertyGroup>
       <OutputType>Exe</OutputType>
       <TargetFramework>netcoreapp2.1</TargetFramework>
       <LangVersion>7.1</LangVersion>
     </PropertyGroup>

   ...

   ```

3. Save the **QueueApp.csproj** file.

## Create a queue

1. Remove the "Hello World" code from the **Main** method.

2. Update **Main** to create a **CloudQueue** object which is passed into the send and receive methods.

   ```csharp
        static async Task Main(string[] args)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            CloudQueue queue = queueClient.GetQueueReference("mystoragequeue");
        }
   ```

## Programmatically access a queue

1. Install the **WindowsAzure. Storage** package to the project with the `dotnet add package` command. Execute the following dotnet command in the same folder as the project.

   ```console
   dotnet add package WindowsAzure.Storage
   ```

2. At the top of the **Program.cs** file, add the following namespaces. We'll be using types from these namespaces to connect to Azure Storage and work with queues.

   ```csharp
   using System.Threading.Tasks;
   using Microsoft.WindowsAzure.Storage;
   using Microsoft.WindowsAzure.Storage.Queue;
   ```

### Get your connection string

The client library uses a connection string to establish your connection. Your connection string is available in the **Settings** section of your storage account in the Azure portal.

1. In your browser, sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to your storage account in the Azure portal.

3. Select **Access keys**

4. Click the **Copy** button to the right of the **Connection string** field.

![Connection string](media/storage-tutorial-queues/get-connection-string.png)

The connection string is in this format:

   ```csharp
   private const string connectionString = "DefaultEndpointsProtocol=https;AccountName=<your storage account name>;AccountKey=<your key>;EndpointSuffix=core.windows.net";
   ```

### Add the connection string to the app

Add the connection string into the app so it can access the storage account.

1. From the command line in the project directory, type `code .` to open Visual Studio Code.

2. Open the **Program.cs** source file in the project.

3. In the **Program** class, add a `private const string connectionString =` member to hold the connection string.

4. After the equal sign, paste the string value that you copied earlier in your Azure portal.

   Your code should look similar to the following. The **connectionString** value will be unique to your account.

   ```csharp
   using System;

   namespace QueueApp
   {
       class Program
       {
           private const string connectionString = "DefaultEndpointsProtocol=https; ...";

           static void Main(string[] args)
           {
               Console.WriteLine("Hello World!");
           }
       }
   }
   ```

5. Save the file.

## Insert messages into the queue

Create a new method to asynchronously send a message into the queue. Add the following method to your **Program** class. This method gets a queue reference, then creates a new queue if it doesn't already exist by calling [CreateIfNotExistsAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue.createifnotexistsasync?view=azure-dotnet). Then, it adds the message to the queue by calling [AddMessageAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue.addmessageasync?view=azure-dotnet).

   ```csharp
   static async Task SendMessageAsync(CloudQueue theQueue, string newMessage)
   {
       bool createdQueue = await theQueue.CreateIfNotExistsAsync();

       if (createdQueue)
       {
           Console.WriteLine("The queue was created.");
       }

       CloudQueueMessage message = new CloudQueueMessage(newMessage);
       await theQueue.AddMessageAsync(message);
   }
   ```

## Dequeue messages

Create a new method called **ReceiveMessageAsync** to asynchronously receive a message from the queue by calling [GetMessageAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue.getmessageasync?view=azure-dotnet). Once the message is successfully received, it's important to delete it from the queue so it isn't processed more than once. After the message is received, delete it from the queue by calling [DeleteMessageAsync](https://docs.microsoft.com/dotnet/api/microsoft.windowsazure.storage.queue.cloudqueue.deletemessageasync?view=azure-dotnet).

Add the following method to your **Program** class.

   ```csharp
   static async Task<string> ReceiveMessageAsync(CloudQueue theQueue)
   {
       bool exists = await theQueue.ExistsAsync();

       if (exists)
       {
           CloudQueueMessage retrievedMessage = await theQueue.GetMessageAsync();

           if (retrievedMessage != null)
           {
               string theMessage = retrievedMessage.AsString;
               await theQueue.DeleteMessageAsync(retrievedMessage);
               return theMessage;
           }
       }
   }
   ```

## Delete an empty queue

It's a best practice at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. If the queue exists but is empty, ask the user if they would like to delete it.

Expand the **ReceiveMessageAsync** method to include a prompt to delete the empty queue.

   ```csharp
   static async Task<string> ReceiveMessageAsync(CloudQueue theQueue)
   {
       bool exists = await theQueue.ExistsAsync();

       if (exists)
       {
           CloudQueueMessage retrievedMessage = await theQueue.GetMessageAsync();

           if (retrievedMessage != null)
           {
               string theMessage = retrievedMessage.AsString;
               await theQueue.DeleteMessageAsync(retrievedMessage);
               return theMessage;
           }
           else
           {
               Console.Write("The queue is empty. Attempt to delete it? (Y/N) ");
               string response = Console.ReadLine();

               if (response == "Y" || response == "y")
               {
                   await theQueue.DeleteIfExistsAsync();
                   return "The queue was deleted.";
               }
               else
               {
                   return "The queue was not deleted.";
               }
           }
       }
       else
       {
           return "The queue does not exist.";
       }
   }
   ```

## Check for command-line arguments

1. Check for command-line arguments. If there are any, assume they're the message and join them together to make a string. Add this string to the message queue by calling the **SendMessageAsync** method we added earlier.

   If there are no command-line arguments, the app will instead retrieve the first message in the queue and delete it by calling the **ReceiveMessageAsync** method.

2. Finally, wait for user input before exiting by calling **Console.ReadLine**.

The fully updated **Main** method follows:

   ```csharp
        static async Task Main(string[] args)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            CloudQueue queue = queueClient.GetQueueReference("mystoragequeue");

            if (args.Length > 0)
            {
                string value = String.Join(" ", args);
                await SendMessageAsync(queue, value);
                Console.WriteLine($"Sent: {value}");
            }
            else
            {
                string value = await ReceiveMessageAsync(queue);
                Console.WriteLine($"Received: {value}");
            }

            Console.Write("Press Enter...");
            Console.ReadLine();
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
        // The string value is broken up for better onscreen formatting
        private const string connectionString = "DefaultEndpointsProtocol=https;" +
                                                "AccountName=<your storage account name>;" +
                                                "AccountKey=<your key>;" +
                                                "EndpointSuffix=core.windows.net";

        static async Task Main(string[] args)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionString);
            CloudQueueClient queueClient = storageAccount.CreateCloudQueueClient();
            CloudQueue queue = queueClient.GetQueueReference("mystoragequeue");

            if (args.Length > 0)
            {
                string value = String.Join(" ", args);
                await SendMessageAsync(queue, value);
                Console.WriteLine($"Sent: {value}");
            }
            else
            {
                string value = await ReceiveMessageAsync(queue);
                Console.WriteLine($"Received {value}");
            }

            Console.Write("Press Enter...");
            Console.ReadLine();
        }

        static async Task SendMessageAsync(CloudQueue theQueue, string newMessage)
        {
            bool createdQueue = await theQueue.CreateIfNotExistsAsync();

            if (createdQueue)
            {
                Console.WriteLine("The queue was created.");
            }

            CloudQueueMessage message = new CloudQueueMessage(newMessage);
            await theQueue.AddMessageAsync(message);
        }

        static async Task<string> ReceiveMessageAsync(CloudQueue theQueue)
        {
            bool exists = await theQueue.ExistsAsync();

            if (exists)
            {
                CloudQueueMessage retrievedMessage = await theQueue.GetMessageAsync();

                if (retrievedMessage != null)
                {
                    string theMessage = retrievedMessage.AsString;
                    await theQueue.DeleteMessageAsync(retrievedMessage);
                    return theMessage;
                }
                else
                {
                    Console.Write("The queue is empty. Attempt to delete it? (Y/N) ");
                    string response = Console.ReadLine();

                    if (response == "Y" || response == "y")
                    {
                        await theQueue.DeleteIfExistsAsync();
                        return "The queue was deleted.";
                    }
                    else
                    {
                        return "The queue was not deleted.";
                    }
                }
            }
            else
            {
                return "The queue does not exist. Add a message to the command line to create the queue and store the message.";
            }
        }
    }
   }
   ```

## Build and run the app

1. From the command line in the project directory, run the following dotnet command to build the project.

   ```console
   dotnet build
   ```

2. After the project builds successfully, run the following command to add the first message to the queue.

   ```console
   dotnet run First queue message
   ```

You should see this output:

   ```console
   C:\Tutorials\QueueApp>dotnet run First queue message
   The queue was created.
   Sent: First queue message
   Press Enter..._
   ```

3. Run the app with no command-line arguments to receive and remove the first message in the queue.

   ```console
   dotnet run
   ```

4. Continue to run the app until all the messages are removed. If you run it one more time, you'll get a message that the queue is empty and a prompt to delete the queue.

   ```console
   C:\Tutorials\QueueApp>dotnet run First queue message
   The queue was created.
   Sent: First queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run Second queue message
   Sent: Second queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run Third queue message
   Sent: Third queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run
   Received: First queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run
   Received: Second queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run
   Received: Third queue message
   Press Enter...

   C:\Tutorials\QueueApp>dotnet run
   The queue is empty. Attempt to delete it? (Y/N) Y
   Received: The queue was deleted.
   Press Enter...

   C:\Tutorials\QueueApp>_
   ```

## Next steps

In this tutorial, you've learned how to create a queue, and how to add and remove message from the queue.

> [!div class="nextstepaction"]
> [Queues quickstart](storage-quickstart-queues-portal.md)
