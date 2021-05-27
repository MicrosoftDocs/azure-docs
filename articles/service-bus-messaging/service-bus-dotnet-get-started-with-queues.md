---
title: Get started with Azure Service Bus queues (Azure.Messaging.ServiceBus)
description: In this tutorial, you create a .NET Core C# application to send messages to and receive messages from a Service Bus queue.
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 11/13/2020
ms.custom: devx-track-csharp
---

# Send messages to and receive messages from Azure Service Bus queues (.NET)
In this tutorial, you create a .NET Core console application to send messages to and receive messages from a Service Bus queue using the **Azure.Messaging.ServiceBus** package. 

> [!Important]
> This quickstart uses the new Azure.Messaging.ServiceBus package. For a quickstart that uses the old Microsoft.Azure.ServiceBus package, see [Send and receive events using Microsoft.Azure.ServiceBus package](service-bus-dotnet-get-started-with-queues-legacy.md).

## Prerequisites

- [Visual Studio 2019](https://www.visualstudio.com/vs)
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the **connection string** for your Service Bus namespace and the name of the **queue** you created.

## Send messages to a queue
In this quick start, you'll create a C# .NET Core console application to send messages to the queue.

### Create a console application
Launch Visual Studio and create a new **Console App (.NET Core)** project for C#. 

### Add the Service Bus NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.
1. Select **Browse**. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation, then close the NuGet Package Manager.

### Add code to send messages to the queue

1. In *Program.cs*, add the following `using` statements at the top of the namespace definition, before the class declaration:

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    
    using Azure.Messaging.ServiceBus;
    ```

1. In the `Program` class, declare the following variables:

    ```csharp
        static string connectionString = "<NAMESPACE CONNECTION STRING>";
        static string queueName = "<QUEUE NAME>";
    ```

    Enter your connection string for the namespace as the `connectionString` variable. Enter your queue name.

1. Directly after the `Main()` method, add the following `SendMessagesAsync()` method that does the work of sending a message:

    ```csharp
        static async Task SendMessageAsync()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {
                // create a sender for the queue 
                ServiceBusSender sender = client.CreateSender(queueName);

                // create a message that we can send
                ServiceBusMessage message = new ServiceBusMessage("Hello world!");

                // send the message
                await sender.SendMessageAsync(message);
                Console.WriteLine($"Sent a single message to the queue: {queueName}");
            }
        }
    ```
1. Add a method named `CreateMessages` to create a queue (.NET queue) of messages to the `Program` class. Typically, you get these messages from different parts of your application. Here, we create a queue of sample messages.

    ```csharp
        static Queue<ServiceBusMessage> CreateMessages()
        {
            // create a queue containing the messages and return it to the caller
            Queue<ServiceBusMessage> messages = new Queue<ServiceBusMessage>();
            messages.Enqueue(new ServiceBusMessage("First message in the batch"));
            messages.Enqueue(new ServiceBusMessage("Second message in the batch"));
            messages.Enqueue(new ServiceBusMessage("Third message in the batch"));
            return messages;
        }
    ```
1. Add a method named `SendMessageBatchAsync` to the `Program` class, and add the following code. This method takes a queue of messages, and prepares one or more batches to send to the Service Bus queue. 

    ```csharp
        static async Task SendMessageBatchAsync()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {
                // create a sender for the queue 
                ServiceBusSender sender = client.CreateSender(queueName);

                // get the messages to be sent to the Service Bus queue
                Queue<ServiceBusMessage> messages = CreateMessages();

                // total number of messages to be sent to the Service Bus queue
                int messageCount = messages.Count;

                // while all messages are not sent to the Service Bus queue
                while (messages.Count > 0)
                {
                    // start a new batch 
                    using ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();

                    // add the first message to the batch
                    if (messageBatch.TryAddMessage(messages.Peek()))
                    {
                        // dequeue the message from the .NET queue once the message is added to the batch
                        messages.Dequeue();
                    }
                    else
                    {
                        // if the first message can't fit, then it is too large for the batch
                        throw new Exception($"Message {messageCount - messages.Count} is too large and cannot be sent.");
                    }

                    // add as many messages as possible to the current batch
                    while (messages.Count > 0 && messageBatch.TryAddMessage(messages.Peek()))
                    {
                        // dequeue the message from the .NET queue as it has been added to the batch
                        messages.Dequeue();
                    }
        
                    // now, send the batch
                    await sender.SendMessagesAsync(messageBatch);
        
                    // if there are any remaining messages in the .NET queue, the while loop repeats 
                }

                Console.WriteLine($"Sent a batch of {messageCount} messages to the topic: {queueName}");
            }
        }
    ```
1. Replace the `Main()` method with the following **async** `Main` method. It calls both the send methods to send a single message and a batch of messages to the queue. 

    ```csharp
        static async Task Main()
        {
            // send a message to the queue
            await SendMessageAsync();

            // send a batch of messages to the queue
            await SendMessageBatchAsync();
        }
    ```
5. Run the application. You should see the following messages. 

    ```console
    Sent a single message to the queue: myqueue
    Sent a batch of messages to the queue: myqueue
    ```       
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, select the queue in the bottom-middle pane. 
    1. Notice the values in the **Essentials** section.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png" alt-text="Messages received with count and size" lightbox="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png":::

    Notice the following values:
    - The **Active message count** value for the queue is now **4**. Each time you run this sender app without retrieving the messages, this value increases by 4.
    - The current size of the queue increments the **CURRENT** value in **Essentials**  each time the app adds messages to the queue.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are four incoming messages for the queue. 

## Receive messages from a queue
In this section, you'll add code to retrieve messages from the queue.

1. Add the following methods to the `Program` class that handle messages and any errors. 

    ```csharp
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
    ```
1. Add a method named `ReceiveMessagesAsync` to the `Program` class, and add the following code to receive messages. 

    ```csharp
        static async Task ReceiveMessagesAsync()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {
                // create a processor that we can use to process the messages
                ServiceBusProcessor processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions());

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
        }
    ```
1. Add a call to `ReceiveMessagesAsync` method from the `Main` method. Comment out the `SendMessagesAsync` method if you want to test only receiving of messages. If you don't, you see another four messages sent to the queue. 

    ```csharp
        static async Task Main()
        {
            // send a message to the queue
            await SendMessageAsync();

            // send a batch of messages to the queue
            await SendMessageBatchAsync();

            // receive message from the queue
            await ReceiveMessagesAsync();
        }
    ```

## Run the app
Run the application. Wait for a minute and then press any key to stop receiving messages. You should see the following output (spacebar for the key). 

```console
Sent a single message to the queue: myqueue
Sent a batch of messages to the queue: myqueue
Wait for a minute and then press any key to end the processing
Received: Hello world!
Received: First message in the batch
Received: Second message in the batch
Received: Third message in the batch
Received: Hello world!
Received: First message in the batch
Received: Second message in the batch
Received: Third message in the batch

Stopping the receiver...
Stopped receiving messages
```

Check the portal again. 

- The **Active message count** and **CURRENT** values are now **0**.
- In the **Messages** chart in the bottom **Metrics** section, you can see that there are eight incoming messages and eight outgoing messages for the queue. 

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png" alt-text="Active messages and size after receive" lightbox="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png":::

## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for .NET - Readme](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus)
- [Samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples)
- [.NET API reference](/dotnet/api/azure.messaging.servicebus?preserve-view=true)