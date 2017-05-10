---
title: Receive events from Azure Event Hubs using .NET Standard | Microsoft Docs
description: Get started receiving messages with the EventProcessorHost in .NET Standard
services: event-hubs
documentationcenter: na
author: jtaubensee
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/27/2017
ms.author: jotaub;sethm
---

# Get started receiving messages with the Event Processor Host in .NET Standard

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver).

This tutorial shows how to write a .NET Core console application that receives messages from an event hub by using **EventProcessorHost**. You can run the [GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) solution as-is, replacing the strings with your event hub and storage account values. Or you can follow the steps in this tutorial to create your own.

## Prerequisites

* [Microsoft Visual Studio 2015 or 2017](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2017, but Visual Studio 2015 is also supported.
* [.NET Core Visual Studio 2015 or 2017 tools](http://www.microsoft.com/net/core).
* An Azure subscription.
* An Azure Event Hubs namespace.
* An Azure storage account.

## Create an Event Hubs namespace and an event hub  

The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace for the Event Hubs type, and obtain the management credentials that your application needs to communicate with the event hub. To create a namespace and event hub, follow the procedure in [this article](event-hubs-create.md), and then proceed with the following steps.  

## Create an Azure storage account  

1. Sign in to the [Azure portal](https://portal.azure.com).  
2. In the left navigation pane of the portal, click **New**, click **Storage**, and then click **Storage Account**.  
3. Complete the fields in the storage account blade, and then click **Create**.

	![Create storage account][1]

4. After you see the **Deployments Succeeded** message, click the name of the new storage account. In the **Essentials** blade, click **Blobs**. When the **Blob service** blade opens, click **+ Container** at the top. Give the container a name, and then close the **Blob service** blade.  
5. Click **Access keys** in the left blade and copy the name of the storage container, the storage account, and the value of **key1**. Save these values to Notepad or some other temporary location.  

## Create a console application

Start Visual Studio. From the **File** menu, click **New**, and then click **Project**. Create a .NET Core console application.

![New project][2]

## Add the Event Hubs NuGet package

Add the following NuGet packages to the project:
* [`Microsoft.Azure.EventHubs`](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/)
* [`Microsoft.Azure.EventHubs.Processor`](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/)

## Implement the IEventProcessor interface

1. In Solution Explorer, right-click the project, click **Add**, and then click **Class**. Name the new class **SimpleEventProcessor**.

2. Open the SimpleEventProcessor.cs file and add the following `using` statements to the top of the file.

    ```csharp
    using Microsoft.Azure.EventHubs;
    using Microsoft.Azure.EventHubs.Processor;
	using System.Threading.Tasks;
    ```

3. Implement the `IEventProcessor` interface. Replace the entire contents of the `SimpleEventProcessor` class with the following code:

    ```csharp
    public class SimpleEventProcessor : IEventProcessor
    {
        public Task CloseAsync(PartitionContext context, CloseReason reason)
        {
            Console.WriteLine($"Processor Shutting Down. Partition '{context.PartitionId}', Reason: '{reason}'.");
            return Task.CompletedTask;
        }

        public Task OpenAsync(PartitionContext context)
        {
            Console.WriteLine($"SimpleEventProcessor initialized. Partition: '{context.PartitionId}'");
            return Task.CompletedTask;
        }

        public Task ProcessErrorAsync(PartitionContext context, Exception error)
        {
            Console.WriteLine($"Error on Partition: {context.PartitionId}, Error: {error.Message}");
            return Task.CompletedTask;
        }

        public Task ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
        {
            foreach (var eventData in messages)
            {
                var data = Encoding.UTF8.GetString(eventData.Body.Array, eventData.Body.Offset, eventData.Body.Count);
                Console.WriteLine($"Message received. Partition: '{context.PartitionId}', Data: '{data}'");
            }

            return context.CheckpointAsync();
        }
    }
    ```

## Write a main console method that uses the SimpleEventProcessor class to receive messages

1. Add the following `using` statements to the top of the Program.cs file.

    ```csharp
    using Microsoft.Azure.EventHubs;
    using Microsoft.Azure.EventHubs.Processor;
	using System.Threading.Tasks;
    ```

2. Add constants to the `Program` class for the event hub connection string, event hub name, storage account container name, storage account name, and storage account key. Add the following code, replacing the placeholders with their corresponding values.

    ```csharp
    private const string EhConnectionString = "{Event Hubs connection string}";
    private const string EhEntityPath = "{Event Hub path/name}";
    private const string StorageContainerName = "{Storage account container name}";
    private const string StorageAccountName = "{Storage account name}";
    private const string StorageAccountKey = "{Storage account key}";

    private static readonly string StorageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", StorageAccountName, StorageAccountKey);
    ```   

3. Add a new method named `MainAsync` to the `Program` class, as follows:

    ```csharp
    private static async Task MainAsync(string[] args)
    {
        Console.WriteLine("Registering EventProcessor...");

        var eventProcessorHost = new EventProcessorHost(
            EhEntityPath,
            PartitionReceiver.DefaultConsumerGroupName,
            EhConnectionString,
            StorageConnectionString,
            StorageContainerName);

        // Registers the Event Processor Host and starts receiving messages
        await eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>();

        Console.WriteLine("Receiving. Press ENTER to stop worker.");
        Console.ReadLine();

        // Disposes of the Event Processor Host
        await eventProcessorHost.UnregisterEventProcessorAsync();
    }
    ```

3. Add the following line of code to the `Main` method:

    ```csharp
    MainAsync(args).GetAwaiter().GetResult();
    ```

	Here is what your Program.cs file should look like:

    ```csharp
    namespace SampleEphReceiver
    {

        public class Program
        {
            private const string EhConnectionString = "{Event Hubs connection string}";
            private const string EhEntityPath = "{Event Hub path/name}";
            private const string StorageContainerName = "{Storage account container name}";
            private const string StorageAccountName = "{Storage account name}";
            private const string StorageAccountKey = "{Storage account key}";

            private static readonly string StorageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", StorageAccountName, StorageAccountKey);

            public static void Main(string[] args)
            {
                MainAsync(args).GetAwaiter().GetResult();
            }

            private static async Task MainAsync(string[] args)
            {
                Console.WriteLine("Registering EventProcessor...");

                var eventProcessorHost = new EventProcessorHost(
                    EhEntityPath,
                    PartitionReceiver.DefaultConsumerGroupName,
                    EhConnectionString,
                    StorageConnectionString,
                    StorageContainerName);

                // Registers the Event Processor Host and starts receiving messages
                await eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>();

                Console.WriteLine("Receiving. Press ENTER to stop worker.");
                Console.ReadLine();

                // Disposes of the Event Processor Host
                await eventProcessorHost.UnregisterEventProcessorAsync();
            }
        }
    }
    ```

4. Run the program, and ensure that there are no errors.

Congratulations! You have now received messages from an event hub by using the Event Processor Host.

## Next steps
You can learn more about Event Hubs by visiting the following links:

* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

[1]: ./media/event-hubs-dotnet-standard-getstarted-receive-eph/event-hubs-python1.png
[2]: ./media/event-hubs-dotnet-standard-getstarted-receive-eph/netcore.png
