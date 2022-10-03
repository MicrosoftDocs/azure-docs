---
title: Quickstart - Use Azure Service Bus queues from .NET app
description: This quickstart shows you how to send messages to and receive messages from Azure Service Bus queues using the .NET programming language.
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 09/21/2022
ms.devlang: csharp
ms.custom: contperf-fy22q2, mode-api
---

# Quickstart: Send and receive messages from an Azure Service Bus queue (.NET)

In this quickstart, you will do the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus queue, using the Azure portal.
3. Write a .NET Core console application to send a set of messages to the queue.
4. Write a .NET Core console application to receive those messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus queue and then receiving them. For an overview of the .NET client library, see [Azure Service Bus client library for .NET](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/servicebus/Azure.Messaging.ServiceBus/README.md). For more samples, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples).

## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- **Azure subscription**. To use Azure services, including Azure Service Bus, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/).
- **Microsoft Visual Studio 2019**. The Azure Service Bus client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax won't be available. To make use of the full syntax, we recommend that you compile with the .NET Core SDK 3.0 or higher and language version set to `latest`. If you're using Visual Studio, versions before Visual Studio 2019 aren't compatible with the tools needed to build C# 8.0 projects.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-queue-portal](./includes/service-bus-create-queue-portal.md)]

## Send messages to the queue

This section shows you how to create a .NET Core console application to send messages to a Service Bus queue.

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus queue and then receiving them. For more samples on other and advanced scenarios, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples).

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

1. In **Program.cs**, add the following `using` statements at the top of the namespace definition, before the class declaration.

    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    ```

2. Within the `Program` class, declare the following properties, just before the `Main` method.

    Replace `<NAMESPACE CONNECTION STRING>` with the primary connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue.

    ```csharp

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

    ```

3. Replace code in the `Main` method with the following code. See code comments for details about the code. Here are the important steps from the code.  
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the primary connection string to the namespace.
    1. Invokes the [CreateSender](/dotnet/api/azure.messaging.servicebus.servicebusclient.createsender) method on the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specific Service Bus queue.
    1. Creates a [ServiceBusMessageBatch](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch) object by using the [ServiceBusSender.CreateMessageBatchAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.createmessagebatchasync) method.
    1. Add messages to the batch using the [ServiceBusMessageBatch.TryAddMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch.tryaddmessage).
    1. Sends the batch of messages to the Service Bus queue using the [ServiceBusSender.SendMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessagesasync) method.

        ```csharp
        static async Task Main()
        {
            // The Service Bus client types are safe to cache and use as a singleton for the lifetime
            // of the application, which is best practice when messages are being published or read
            // regularly.
            //
            // set the transport type to AmqpWebSockets so that the ServiceBusClient uses the port 443. 
            // If you use the default AmqpTcp, you will need to make sure that the ports 5671 and 5672 are open

            var clientOptions = new ServiceBusClientOptions() { TransportType = ServiceBusTransportType.AmqpWebSockets };
            client = new ServiceBusClient(connectionString, clientOptions);
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
        ```

4. Here's what your Program.cs file should look like:

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
                // set the transport type to AmqpWebSockets so that the ServiceBusClient uses the port 443. 
                // If you use the default AmqpTcp, you will need to make sure that the ports 5671 and 5672 are open
    
                var clientOptions = new ServiceBusClientOptions() { TransportType = ServiceBusTransportType.AmqpWebSockets };
                client = new ServiceBusClient(connectionString, clientOptions);
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

5. Replace `<NAMESPACE CONNECTION STRING>` with the primary connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue.
6. Build the project, and ensure that there are no errors.
7. Run the program and wait for the confirmation message.

    ```bash
    A batch of 3 messages has been published to the queue
    ```

8. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace.
    1. On the **Overview** page, select the queue in the bottom-middle pane.

        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/select-queue.png" alt-text="Image showing the Service Bus Namespace page in the Azure portal with the queue selected." lightbox="./media/service-bus-dotnet-get-started-with-queues/select-queue.png":::
    1. Notice the values in the **Essentials** section.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png" alt-text="Image showing the number of messages received and the size of the queue" lightbox="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png":::

    Notice the following values:
    - The **Active** message count value for the queue is now **3**. Each time you run this sender app without retrieving the messages, this value increases by 3.
    - The **current size** of the queue increments each time the app adds messages to the queue.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the queue.

## Receive messages from the queue

In this section, you'll create a .NET Core console application that receives messages from the queue.

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus queue and then receiving them. For more samples on other and advanced scenarios, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples).

### Create a project for the receiver

1. In the Solution Explorer window, right-click the **ServiceBusQueueQuickStart** solution, point to **Add**, and select **New Project**.
1. Select **Console application**, and select **Next**.
1. Enter **QueueReceiver** for the **Project name**, and select **Create**.
1. In the **Solution Explorer** window, right-click **QueueReceiver**, and select **Set as a Startup Project**.

### Add the Service Bus NuGet package to the Receiver project

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. In the **Package Manager Console** window, confirm that **QueueReceiver** is selected for the **Default project**. If not, use the drop-down list to select **QueueReceiver**.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/package-manager-console.png" alt-text="Screenshot showing QueueReceiver project selected in the Package Manager Console":::
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.ServiceBus
    ```

### Add the code to receive messages from the queue

In this section, you'll add code to retrieve messages from the queue.

1. In **Program.cs**, add the following `using` statements at the top of the namespace definition, before the class declaration.

    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    ```

2. Within the `Program` class, declare the following properties, just before the `Main` method.

    Replace `<NAMESPACE CONNECTION STRING>` with the primary connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue.

    ```csharp
    // connection string to your Service Bus namespace
    static string connectionString = "<NAMESPACE CONNECTION STRING>";

    // name of your Service Bus queue
    static string queueName = "<QUEUE NAME>";

    // the client that owns the connection and can be used to create senders and receivers
    static ServiceBusClient client;

    // the processor that reads and processes messages from the queue
    static ServiceBusProcessor processor;
    ```

3. Add the following methods to the `Program` class to handle received messages and any errors.

    ```csharp
    // handle received messages
    static async Task MessageHandler(ProcessMessageEventArgs args)
    {
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body}");

        // complete the message. message is deleted from the queue. 
        await args.CompleteMessageAsync(args.Message);
    }

    // handle any errors when receiving messages
    static Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
    ```

4. Replace code in the `Main` method with the following code. See code comments for details about the code. Here are the important steps from the code.
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the primary connection string to the namespace.
    1. Invokes the [CreateProcessor](/dotnet/api/azure.messaging.servicebus.servicebusclient.createprocessor) method on the [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object to create a [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object for the specified Service Bus queue.
    1. Specifies handlers for the [ProcessMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processmessageasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processerrorasync) events of the [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object.
    1. Starts processing messages by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.startprocessingasync) on the [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object.
    1. When user presses a key to end the processing, invokes the [StopProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.stopprocessingasync) on the [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object.

        For more information, see code comments.

        ```csharp
                static async Task Main()
                {
                    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
                    // of the application, which is best practice when messages are being published or read
                    // regularly.
                    //
                    // set the transport type to AmqpWebSockets so that the ServiceBusClient uses the port 443. 
                    // If you use the default AmqpTcp, you will need to make sure that the ports 5671 and 5672 are open
        
                    var clientOptions = new ServiceBusClientOptions() { TransportType = ServiceBusTransportType.AmqpWebSockets };
                    client = new ServiceBusClient(connectionString, clientOptions);
            
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
        ```

5. Here's what your `Program.cs` should look like:  

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
                // set the transport type to AmqpWebSockets so that the ServiceBusClient uses the port 443. 
                // If you use the default AmqpTcp, you will need to make sure that the ports 5671 and 5672 are open
    
                var clientOptions = new ServiceBusClientOptions() { TransportType = ServiceBusTransportType.AmqpWebSockets };
                client = new ServiceBusClient(connectionString, clientOptions);
    
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

6. Replace `<NAMESPACE CONNECTION STRING>` with the primary connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue.
7. Build the project, and ensure that there are no errors.
8. Run the receiver application. You should see the received messages. Press any key to stop the receiver and the application.

    ```console
    Wait for a minute and then press any key to end the processing
    Received: Message 1
    Received: Message 2
    Received: Message 3
    
    Stopping the receiver...
    Stopped receiving messages
    ```

9. Check the portal again. Wait for a few minutes and refresh the page if you don't see `0` for **Active** messages.

    - The **Active** message count and **Current size** values are now **0**.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages and three outgoing messages for the queue.

        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png" alt-text="Screenshot showing active messages and size after receive." lightbox="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png":::

## Clean up resources

Navigate to your Service Bus namespace in the Azure portal, and select **Delete** on the Azure portal to delete the namespace and the queue in it.

## See also

See the following documentation and samples:

- [Azure Service Bus client library for .NET - Readme](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus)
- [Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples)
- [.NET API reference](/dotnet/api/azure.messaging.servicebus)

## Next steps

> [!div class="nextstepaction"]
> [Get started with Azure Service Bus topics and subscriptions (.NET)](service-bus-dotnet-how-to-use-topics-subscriptions.md)
