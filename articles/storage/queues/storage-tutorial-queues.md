---
title: Tutorial - Work with Azure Storage queues in .NET
description: A tutorial on how to use the Azure Queue service to create queues, and insert, get, and delete messages using .NET code.
author: mhopkins-msft

ms.author: mhopkins
ms.date: 06/09/2020
ms.service: storage
ms.subservice: queues
ms.topic: tutorial
ms.reviewer: cbrooks
# Customer intent: As a developer, I want to use queues in my app so that my service will scale automatically during high demand times without losing data.
---

# Tutorial: Work with Azure storage queues in .NET

Azure Queue storage implements cloud-based queues to enable communication between components of a distributed application. Each queue maintains a list of messages that can be added by a sender component and processed by a receiver component. With a queue, your application can scale immediately to meet demand. This article shows the basic steps for working with an Azure storage queue.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure storage account
> - Create the app
> - Add the Azure client libraries
> - Add support for asynchronous code
> - Create a queue
> - Insert messages into a queue
> - Dequeue messages
> - Delete an empty queue
> - Check for command-line arguments
> - Build and run the app

## Prerequisites

- Get your free copy of the cross platform [Visual Studio Code](https://code.visualstudio.com/download) editor.
- Download and install the [.NET Core SDK](https://dotnet.microsoft.com/download) version 3.1 or later.
- If you don’t have a current Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Create an Azure storage account

First, create an Azure storage account. For a step-by-step guide to creating a storage account, see the [Create a storage account](../common/storage-account-create.md?toc=%2Fazure%2Fstorage%2Fqueues%2Ftoc.json) quickstart. This is a separate step you perform after creating a free Azure account in the prerequisites.

## Create the app

Create a .NET Core application named **QueueApp**. For simplicity, this app will both send and receive messages through the queue.

1. In a console window (such as CMD, PowerShell, or Azure CLI), use the `dotnet new` command to create a new console app with the name **QueueApp**. This command creates a simple "Hello World" C# project with a single source file: **Program.cs**.

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

   You should see results similar to the following output:

   ```output
   C:\Tutorials>dotnet new console -n QueueApp
   The template "Console Application" was created successfully.

   Processing post-creation actions...
   Running 'dotnet restore' on QueueApp\QueueApp.csproj...
     Restore completed in 155.63 ms for C:\Tutorials\QueueApp\QueueApp.csproj.

   Restore succeeded.

   C:\Tutorials>cd QueueApp

   C:\Tutorials\QueueApp>dotnet build
   Microsoft (R) Build Engine version 16.0.450+ga8dc7f1d34 for .NET Core
   Copyright (C) Microsoft Corporation. All rights reserved.

     Restore completed in 40.87 ms for C:\Tutorials\QueueApp\QueueApp.csproj.
     QueueApp -> C:\Tutorials\QueueApp\bin\Debug\netcoreapp3.1\QueueApp.dll

   Build succeeded.
       0 Warning(s)
       0 Error(s)

   Time Elapsed 00:00:02.40

   C:\Tutorials\QueueApp>_
   ```

## Add the Azure client libraries

1. Add the Azure Storage client libraries to the project by using the `dotnet add package` command.

   # [\.NET v12](#tab/dotnet)

   Execute the following command from the project folder in the console window.

   ```console
   dotnet add package Azure.Storage.Queues
   ```

   # [\.NET v11](#tab/dotnetv11)

   Execute the following commands from the project folder in the console window.

   ```console
   dotnet add package Microsoft.Azure.Storage.Common
   ```

   ```console
   dotnet add package Microsoft.Azure.Storage.Queue
   ```
   ---

### Add using statements

1. From the command line in the project directory, type `code .` to open Visual Studio Code in the current directory. Keep the command-line window open. There will be more commands to execute later. If you're prompted to add C# assets required to build and debug, click the **Yes** button.

1. Open the **Program.cs** source file and add the following namespaces right after the `using System;` statement. This app uses types from these namespaces to connect to Azure Storage and work with queues.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_UsingStatements":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_UsingStatements":::

1. Save the **Program.cs** file.

## Add support for asynchronous code

Since the app uses cloud resources, the code runs asynchronously.

1. Update the **Main** method to run asynchronously. Replace **void** with an **async Task** return value.

   ```csharp
   static async Task Main(string[] args)
   ```

1. Save the **Program.cs** file.

## Create a queue

Before making any calls into Azure APIs, you must get your credentials from the Azure portal.

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

### Add the connection string to the app

Add the connection string into the app so it can access the storage account.

1. Switch back to Visual Studio Code.

1. In the **Main**  method, replace the `Console.WriteLine("Hello World!");` code with the following line that gets the connection string from the environment variable.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_DeclareConnectionString":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_DeclareConnectionString":::

1. Add the following code to **Main** to create a queue object, which is later passed into the send and receive methods.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_CreateQueueClient":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_CreateQueueClient":::

1. Save the file.

## Insert messages into the queue

Create a new method to send a message into the queue.

1. Add the following **InsertMessageAsync** method to your **Program** class.

   # [\.NET v12](#tab/dotnet)

   This method is passed a queue reference. A new queue is created, if it doesn't already exist, by calling [CreateIfNotExistsAsync](/dotnet/api/azure.storage.queues.queueclient.createifnotexistsasync). Then, it adds the *newMessage* to the queue by calling [SendMessageAsync](/dotnet/api/azure.storage.queues.queueclient.sendmessageasync).

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_InsertMessage":::

   # [\.NET v11](#tab/dotnetv11)

   This method is passed a queue reference. A new queue is created, if it doesn't already exist, by calling [CreateIfNotExistsAsync](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.createifnotexistsasync). Then, it adds the *newMessage* to the queue by calling [AddMessageAsync](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.addmessageasync).

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_InsertMessage":::

1. **Optional** By default, the maximum time-to-live for a message is set to seven days. You can specify any positive number for the message time-to-live. The following code snippet adds a message that *never* expires.

   # [\.NET v12](#tab/dotnet)

    To add a message that doesn't expire, use `Timespan.FromSeconds(-1)` in your call to **SendMessageAsync**.

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Initial.cs" id="snippet_SendNonExpiringMessage":::

   # [\.NET v11](#tab/dotnetv11)

    To add a message that doesn't expire, use `Timespan.FromSeconds(-1)` in your call to **AddMessageAsync**.

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Initial.cs" id="snippet_SendNonExpiringMessage":::

1. Save the file.

A queue message must be in a format compatible with an XML request using UTF-8 encoding. A message may be up to 64 KB in size. If a message contains binary data, [Base64-encode](/dotnet/api/system.convert.tobase64string) the message.

## Dequeue messages

Create a new method to retrieve a message from the queue. Once the message is successfully received, it's important to delete it from the queue so it isn't processed more than once.

1. Add a new method called **RetrieveNextMessageAsync** to your **Program** class.

   # [\.NET v12](#tab/dotnet)

   This method receives a message from the queue by calling [ReceiveMessagesAsync](/dotnet/api/azure.storage.queues.queueclient.receivemessagesasync), passing 1 in the first parameter to retrieve only the next message in the queue. After the message is received, delete it from the queue by calling [DeleteMessageAsync](/dotnet/api/azure.storage.queues.queueclient.deletemessageasync).

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Initial.cs" id="snippet_InitialRetrieveMessage":::

   # [\.NET v11](#tab/dotnetv11)

   This method receives a message from the queue by calling [GetMessageAsync](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessageasync). After the message is received, delete it from the queue by calling [DeleteMessageAsync](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.deletemessageasync).

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Initial.cs" id="snippet_InitialRetrieveMessage":::

1. Save the file.

## Delete an empty queue

It's a best practice at the end of a project to identify whether you still need the resources you created. Resources left running can cost you money. If the queue exists but is empty, ask the user if they would like to delete it.

1. Expand the **RetrieveNextMessageAsync** method to include a prompt to delete the empty queue.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_RetrieveMessage":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_RetrieveMessage":::

1. Save the file.

## Check for command-line arguments

If there are any command-line arguments passed into the app, assume they're a message to be added to the queue. Join the arguments together to make a string. Add this string to the message queue by calling the **InsertMessageAsync** method we added earlier.

If there are no command-line arguments, attempt a retrieve operation. Call the **RetrieveNextMessageAsync** method to retrieve the next message in the queue.

Finally, wait for user input before exiting by calling **Console.ReadLine**.

1. Expand the **Main** method to check for command-line arguments and wait for user input.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_Main":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_Main":::

1. Save the file.

## Complete code

Here is the complete code listing for this project.

   # [\.NET v12](#tab/dotnet)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v12/QueueApp/Program.cs" id="snippet_AllCode":::

   # [\.NET v11](#tab/dotnetv11)

   :::code language="csharp" source="~/azure-storage-snippets/queues/tutorial/dotnet/dotnet-v11/QueueApp/Program.cs" id="snippet_AllCode":::
   ---

## Build and run the app

1. From the command line in the project directory, run the following dotnet command to build the project.

   ```console
   dotnet build
   ```

1. After the project builds successfully, run the following command to add the first message to the queue.

   ```console
   dotnet run First queue message
   ```

   You should see this output:

   ```output
   C:\Tutorials\QueueApp>dotnet run First queue message
   The queue was created.
   Sent: First queue message
   Press Enter..._
   ```

1. Run the app with no command-line arguments to receive and remove the first message in the queue.

   ```console
   dotnet run
   ```

1. Continue to run the app until all the messages are removed. If you run it one more time, you'll get a message that the queue is empty and a prompt to delete the queue.

   ```output
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

In this tutorial, you learned how to:

1. Create a queue
1. Add and remove messages from a queue
1. Delete an Azure storage queue

Check out the Azure queues quickstarts for more information.

> [!div class="nextstepaction"]
> [Queues quickstart for the portal](storage-quickstart-queues-portal.md)

- [Queues quickstart for .NET](storage-quickstart-queues-dotnet.md)
- [Queues quickstart for Java](storage-quickstart-queues-java.md)
- [Queues quickstart for Python](storage-quickstart-queues-python.md)
- [Queues quickstart for JavaScript](storage-quickstart-queues-nodejs.md)
