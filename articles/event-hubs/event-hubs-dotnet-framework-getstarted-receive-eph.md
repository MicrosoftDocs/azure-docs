---
title: Receive events from Azure Event Hubs using the .NET Framework | Microsoft Docs
description: Follow this tutorial to receive events from Azure Event Hubs using the .NET Framework.
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: c4974bd3-2a79-48a1-aa3b-8ee2d6655b28
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/02/2018
ms.author: shvija

---
# Receive events from Azure Event Hubs using the .NET Framework

## Introduction

Azure Event Hubs is a service that processes large amounts of event data (telemetry) from connected devices and applications. After you collect data into Event Hubs, you can store the data using a storage cluster or transform it using a real-time analytics provider. This large-scale event collection and processing capability is a key component of modern application architectures including the Internet of Things (IoT).

This tutorial shows how to write a .NET Framework console application that receives messages from an event hub using the **[Event Processor Host][Event Processor Host]**. To send events using the .NET Framework, see the [Send events to Azure Event Hubs using the .NET Framework](event-hubs-dotnet-framework-getstarted-send.md) article, or click the appropriate sending language in the left-hand table of contents.

The [Event Processor Host][EventProcessorHost] is a .NET class that simplifies receiving events from event hubs by managing persistent checkpoints and parallel receives from those event hubs. Using the Event Processor Host, you can split events across multiple receivers, even when hosted in different nodes. This example shows how to use the Event Processor Host for a single receiver. The [Scale out event processing][Scale out Event Processing with Event Hubs] sample shows how to use the Event Processor Host with multiple receivers.

## Prerequisites

To complete this tutorial, you need the following prerequisites:

* [Microsoft Visual Studio 2017 or higher](http://visualstudio.com).
* An active Azure account. If you don't have one, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/free/).

## Create an Event Hubs namespace and an event hub

The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and event hub, follow the procedure in [this article](event-hubs-create.md), then proceed with the following steps in this tutorial.

## Create an Azure Storage account

To use the [Event Processor Host][EventProcessorHost], you must have an [Azure Storage account][Azure Storage account]:

1. Sign in to the [Azure portal][Azure portal], and click **Create a resource** at the top left of the screen.

2. Click **Storage**, then click **Storage account**.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-storage1.png)

3. In the **Create storage account** pane, type a name for the storage account. Choose an Azure subscription, resource group, and location in which to create the resource. Then click **Create**.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-storage2.png)

4. In the list of storage accounts, click the newly created storage account.

5. In the storage account pane, click **Access keys**. Copy the value of **key1** to use later in this tutorial.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-storage3.png)

## Create a receiver console application

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **Receiver**.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-receiver-csharp1.png)
2. In Solution Explorer, right-click the **Receiver** project, and then click **Manage NuGet Packages for Solution**.
3. Click the **Browse** tab, then search for `Microsoft Azure Service Bus Event Hub - EventProcessorHost`. Click **Install**, and accept the terms of use.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-eph-csharp1.png)
   
    Visual Studio downloads, installs, and adds a reference to the [Azure Service Bus Event Hub - EventProcessorHost NuGet package](https://www.nuget.org/packages/Microsoft.Azure.ServiceBus.EventProcessorHost), with all its dependencies.
4. Right-click the **Receiver** project, click **Add**, and then click **Class**. Name the new class **SimpleEventProcessor**, and then click **Add** to create the class.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-receive-eph/create-receiver-csharp2.png)
5. Add the following statements at the top of the SimpleEventProcessor.cs file:
    
  ```csharp
  using Microsoft.ServiceBus.Messaging;
  using System.Diagnostics;
  ```
    
  Then, substitute the following code for the body of the class:
    
  ```csharp
  class SimpleEventProcessor : IEventProcessor
  {
    Stopwatch checkpointStopWatch;
    
    async Task IEventProcessor.CloseAsync(PartitionContext context, CloseReason reason)
    {
        Console.WriteLine("Processor Shutting Down. Partition '{0}', Reason: '{1}'.", context.Lease.PartitionId, reason);
        if (reason == CloseReason.Shutdown)
        {
            await context.CheckpointAsync();
        }
    }
    
    Task IEventProcessor.OpenAsync(PartitionContext context)
    {
        Console.WriteLine("SimpleEventProcessor initialized.  Partition: '{0}', Offset: '{1}'", context.Lease.PartitionId, context.Lease.Offset);
        this.checkpointStopWatch = new Stopwatch();
        this.checkpointStopWatch.Start();
        return Task.FromResult<object>(null);
    }
    
    async Task IEventProcessor.ProcessEventsAsync(PartitionContext context, IEnumerable<EventData> messages)
    {
        foreach (EventData eventData in messages)
        {
            string data = Encoding.UTF8.GetString(eventData.GetBytes());
    
            Console.WriteLine(string.Format("Message received.  Partition: '{0}', Data: '{1}'",
                context.Lease.PartitionId, data));
        }
    
        //Call checkpoint every 5 minutes, so that worker can resume processing from 5 minutes back if it restarts.
        if (this.checkpointStopWatch.Elapsed > TimeSpan.FromMinutes(5))
        {
            await context.CheckpointAsync();
            this.checkpointStopWatch.Restart();
        }
    }
  }
  ```
    
  This class is called by the **EventProcessorHost** to process events received from the event hub. The `SimpleEventProcessor` class uses a stopwatch to periodically call the checkpoint method on the **EventProcessorHost** context. This processing ensures that, if the receiver is restarted, it loses no more than five minutes of processing work.
6. In the **Program** class, add the following `using` statement at the top of the file:
    
  ```csharp
  using Microsoft.ServiceBus.Messaging;
  ```
    
  Then, replace the `Main` method in the `Program` class with the following code, substituting the event hub name and the namespace-level connection string that you saved previously, and the storage account and key that you copied in the previous sections. 
    
  ```csharp
  static void Main(string[] args)
  {
    string eventHubConnectionString = "{Event Hubs namespace connection string}";
    string eventHubName = "{Event Hub name}";
    string storageAccountName = "{storage account name}";
    string storageAccountKey = "{storage account key}";
    string storageConnectionString = string.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", storageAccountName, storageAccountKey);
    
    string eventProcessorHostName = Guid.NewGuid().ToString();
    EventProcessorHost eventProcessorHost = new EventProcessorHost(eventProcessorHostName, eventHubName, EventHubConsumerGroup.DefaultGroupName, eventHubConnectionString, storageConnectionString);
    Console.WriteLine("Registering EventProcessor...");
    var options = new EventProcessorOptions();
    options.ExceptionReceived += (sender, e) => { Console.WriteLine(e.Exception); };
    eventProcessorHost.RegisterEventProcessorAsync<SimpleEventProcessor>(options).Wait();
    
    Console.WriteLine("Receiving. Press enter key to stop worker.");
    Console.ReadLine();
    eventProcessorHost.UnregisterEventProcessorAsync().Wait();
  }
  ```

7. Run the program, and ensure that there are no errors.
  
Congratulations! You have now received messages from an event hub using the Event Processor Host.


> [!NOTE]
> This tutorial uses a single instance of [EventProcessorHost][EventProcessorHost]. To increase throughput, it is recommended that you run multiple instances of [EventProcessorHost][EventProcessorHost], as shown in the [Scaled out event processing](https://code.msdn.microsoft.com/Service-Bus-Event-Hub-45f43fc3) sample. In those cases, the various instances automatically coordinate with each other to load balance the received events. If you want multiple receivers to each process *all* the events, you must use the **ConsumerGroup** concept. When receiving events from different machines, it might be useful to specify names for [EventProcessorHost][EventProcessorHost] instances based on the machines (or roles) in which they are deployed. For more information about these topics, see the [Event Hubs overview][Event Hubs overview] and the [Event Hubs programming guide][Event Hubs Programming Guide] topics.
> 
> 

## Next steps

Now that you've built a working application that creates an event hub and sends and receives data, you can learn more by visiting the following links:

* [Event Processor Host overview][Event Processor Host]
* [Event Hubs overview][Event Hubs overview]
* [Event Hubs FAQ](event-hubs-faq.md)

<!-- Images. -->
[19]: ./media/event-hubs-csharp-ephcs-getstarted/create-eh-proj1.png
[20]: ./media/event-hubs-csharp-ephcs-getstarted/create-eh-proj2.png
[21]: ./media/event-hubs-csharp-ephcs-getstarted/run-csharp-ephcs1.png
[22]: ./media/event-hubs-csharp-ephcs-getstarted/run-csharp-ephcs2.png

<!-- Links -->
[EventProcessorHost]: /dotnet/api/microsoft.servicebus.messaging.eventprocessorhost
[Event Hubs overview]: event-hubs-about.md
[Scale out Event Processing with Event Hubs]: https://code.msdn.microsoft.com/Service-Bus-Event-Hub-45f43fc3
[Event Hubs Programming Guide]: event-hubs-programming-guide.md
[Azure Storage account]:../storage/common/storage-create-storage-account.md
[Event Processor Host]: event-hubs-event-processor-host.md
[Azure portal]: https://portal.azure.com
