---
title: Get started with Azure Service Bus queues (Azure.Messaging.ServiceBus)
description: In this tutorial, you create a .NET Core C# application to send messages to and receive messages from a Service Bus queue.
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 08/01/2021
ms.custom: contperf-fy21q4
---

# Send messages to and receive messages from Azure Service Bus queues (.NET)
This quickstart shows how to send messages to and receive messages from a Service Bus queue using the [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/) .NET library.


## Prerequisites

- **Azure subscription**. To use Azure services, including Azure Service Bus, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- **Microsoft Visual Studio 2019**. The Azure Service Bus client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax won't be available. To make use of the full syntax, we recommend that you compile with the .NET Core SDK 3.0 or higher and language version set to `latest`. If you're using Visual Studio, versions before Visual Studio 2019 aren't compatible with the tools needed to build C# 8.0 projects.
- **Create a Service Bus namespace and a queue**. Follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a Service Bus namespace and a queue. 

    > [!IMPORTANT]
    > Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created. You'll use them later in this tutorial. 


## Send messages
This section shows you how to create a .NET Core console application to send messages to a Service Bus queue. 

### Create a console application

1. Start Visual Studio 2019. 
1. Select **Create a new project**. 
1. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**. 
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application. 
    1. Select **Console Application** from the results list. 
    1. Then, select **Next**. 

        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/new-send-project.png" alt-text="Image showing the Create a new project dialog box with C# and Console selected":::
1. Enter **QueueSender** for the project name, **ServiceBusQueueQuickStart** for the solution name, and then select **Next**. 

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/project-solution-names.png" alt-text="Image showing the solution and project names in the Configure your new project dialog box ":::
1. On the **Additional information** page, select **Create** to create the solution and the project. 

### Add the Service Bus NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.ServiceBus
    ```

### Add code to send messages to the queue

1. Replace code in the **Program.cs** with the following code. Here are the important steps from the code.  
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the `CreateSender` method on the `ServiceBusClient` object to create a `ServiceBusSender` object for the specific Service Bus queue.     
    1. Creates a `ServiceBusMessageBatch` object by using the `ServiceBusSender.CreateMessageBatchAsync` method.
    1. Add messages to the batch using the `ServiceBusMessageBatch.TryAddMessage`. 
    1. Sends the batch of messages to the Service Bus queue using the `ServiceBusSender.SendMessagesAsync` method.
    
        For more information, see code comments.
    
        ```csharp
        using System;
        using System.Threading.Tasks;
        using Azure.Messaging.ServiceBus;
        
        namespace QueueSender
        {
            class Program
            {
                // connection string to your Service Bus namespace
                static string connectionString = "<NAMESPACE CONNECTION STRING>";
    
                // name of your Service Bus queue
                static string queueName = "<QUEUE NAME>";
        
                // the client that owns the connection and can be used to create senders and receivers
                static ServiceBusClient client;
        
                // the sender used to publish messages to the queue
                static ServiceBusSender sender;
        
                // number of messages to be sent to the queue
                private const int numOfMessages = 3;
        
                static async Task Main()
                {
                    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
                    // of the application, which is best practice when messages are being published or read
                    // regularly.
                    //
                    // Create the clients that we'll use for sending and processing messages.
                    client = new ServiceBusClient(connectionString);
                    sender = client.CreateSender(queueName);
        
                    // create a batch 
                    using ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();
        
                    for (int i = 1; i <= numOfMessages; i++)
                    {
                        // try adding a message to the batch
                        if (!messageBatch.TryAddMessage(new ServiceBusMessage($"Message {i}")))
                        {
                            // if it is too large for the batch
                            throw new Exception($"The message {i} is too large to fit in the batch.");
                        }
                    }
        
                    try
                    {
                        // Use the producer client to send the batch of messages to the Service Bus queue
                        await sender.SendMessagesAsync(messageBatch);
                        Console.WriteLine($"A batch of {numOfMessages} messages has been published to the queue.");
                    }
                    finally
                    {
                        // Calling DisposeAsync on client types is required to ensure that network
                        // resources and other unmanaged objects are properly cleaned up.
                        await sender.DisposeAsync();
                        await client.DisposeAsync();
                    }
        
                    Console.WriteLine("Press any key to end the application");
                    Console.ReadKey();
                }
            }
        }   
        ``` 
1. Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue.
1. Build the project, and ensure that there are no errors. 
1. Run the program and wait for the confirmation message.
    
    ```bash
    A batch of 3 messages has been published to the queue
    ```
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, select the queue in the bottom-middle pane. 
    
        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/select-queue.png" alt-text="Image showing the Service Bus Namespace page in the Azure portal with the queue selected." lightbox="./media/service-bus-dotnet-get-started-with-queues/select-queue.png":::
    1. Notice the values in the **Essentials** section.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png" alt-text="Image showing the number of messages received and the size of the queue" lightbox="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png":::

    Notice the following values:
    - The **Active** message count value for the queue is now **3**. Each time you run this sender app without retrieving the messages, this value increases by 3.
    - The **current size** of the queue increments each time the app adds messages to the queue.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the queue. 

## Receive messages
In this section, you'll create a .NET Core console application that receives messages from the queue. 

### Create a project for the receiver

1. In the Solution Explorer window, right-click the **ServiceBusQueueQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console application**, and select **Next**. 
1. Enter **QueueReceiver** for the **Project name**, and select **Create**. 
1. In the **Solution Explorer** window, right-click **QueueReceiver**, and select **Set as a Startup Project**. 

### Add the Service Bus NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. In the **Package Manager Console** window, confirm that **QueueReceiver** is selected for the **Default project**. If not, use the drop-down list to select **QueueReceiver**.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/package-manager-console.png" alt-text="Screenshot showing QueueReceiver project selected in the Package Manager Console":::
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.ServiceBus
    ```

### Add the code to receive messages from the queue
In this section, you'll add code to retrieve messages from the queue.

1. Replace code in the **Program.cs** with the following code. Here are the important steps from the code.
    Here are the important steps from the code:
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the `CreateProcessor` method on the `ServiceBusClient` object to create a `ServiceBusProcessor` object for the specified Service Bus queue. 
    1. Specifies handlers for the `ProcessMessageAsync` and `ProcessErrorAsync` events of the `ServiceBusProcessor` object. 
    1. Starts processing messages by invoking the `StartProcessingAsync` on the `ServiceBusProcessor` object. 
    1. When user presses a key to end the processing, invokes the `StopProcessingAsync` on the `ServiceBusProcessor` object. 

        For more information, see code comments.

        ```csharp
        using System;
        using System.Threading.Tasks;
        using Azure.Messaging.ServiceBus;
        
        namespace QueueReceiver
        {
            class Program
            {
                // connection string to your Service Bus namespace
                static string connectionString = "<NAMESPACE CONNECTION STRING>";
        
                // name of your Service Bus queue
                static string queueName = "<QUEUE NAME>";
        
        
                // the client that owns the connection and can be used to create senders and receivers
                static ServiceBusClient client;
        
                // the processor that reads and processes messages from the queue
                static ServiceBusProcessor processor;
        
                // handle received messages
                static async Task MessageHandler(ProcessMessageEventArgs args)
                {
                    string body = args.Message.Body.ToString();
                    Console.WriteLine($"Received: {body}");
        
                    // complete the message. messages is deleted from the queue. 
                    await args.CompleteMessageAsync(args.Message);
                }
        
                // handle any errors when receiving messages
                static Task ErrorHandler(ProcessErrorEventArgs args)
                {
                    Console.WriteLine(args.Exception.ToString());
                    return Task.CompletedTask;
                }
        
                static async Task Main()
                {
                    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
                    // of the application, which is best practice when messages are being published or read
                    // regularly.
                    //
        
                    // Create the client object that will be used to create sender and receiver objects
                    client = new ServiceBusClient(connectionString);
        
                    // create a processor that we can use to process the messages
                    processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions());
        
                    try
                    {
                        // add handler to process messages
                        processor.ProcessMessageAsync += MessageHandler;
        
                        // add handler to process any errors
                        processor.ProcessErrorAsync += ErrorHandler;
        
                        // start processing 
                        await processor.StartProcessingAsync();
        
                        Console.WriteLine("Wait for a minute and then press any key to end the processing");
                        Console.ReadKey();
        
                        // stop processing 
                        Console.WriteLine("\nStopping the receiver...");
                        await processor.StopProcessingAsync();
                        Console.WriteLine("Stopped receiving messages");
                    }
                    finally
                    {
                        // Calling DisposeAsync on client types is required to ensure that network
                        // resources and other unmanaged objects are properly cleaned up.
                        await processor.DisposeAsync();
                        await client.DisposeAsync();
                    }
                }
            }
        }
        ```
1. Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue. 
1. Build the project, and ensure that there are no errors.
1. Run the receiver application. You should see the received messages. Press any key to stop the receiver and the application. 

    ```console
    Wait for a minute and then press any key to end the processing
    Received: Message 1
    Received: Message 2
    Received: Message 3
    
    Stopping the receiver...
    Stopped receiving messages
    ```
1. Check the portal again. Wait for a few minutes and refresh the page if you don't see `0` for **Active** messages. 

    - The **Active** message count and **Current size** values are now **0**.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are eight incoming messages and eight outgoing messages for the queue. 
    
        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png" alt-text="Active messages and size after receive" lightbox="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png":::


## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for .NET - Readme](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus)
- [Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples)
- [.NET API reference](/dotnet/api/azure.messaging.servicebus)
