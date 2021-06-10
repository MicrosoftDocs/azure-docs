---
title: Send messages to Azure Service Bus topics using azure-messaging-servicebus
description: This quickstart shows you how to send messages to Azure Service Bus topics using the azure-messaging-servicebus package. 
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 06/09/2021
ms.custom: contperf-fy21q3
---

# Send messages to an Azure Service Bus topic and receive messages from its subscriptions (.NET)
In this tutorial, you'll create two .NET Core console applications. The first application sends messages to a Service Bus topic and the second one receives those messages from a subscription to that topic. These applications use the [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/) NuGet package. For an overview of Service Bus topics and subscriptions, see [Topics and subscriptions](service-bus-messaging-overview.md#topics).

## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in this [Quickstart](service-bus-quickstart-topics-subscriptions-portal.md) to create a Service Bus topic and subscriptions to the topic. 

    > [!IMPORTANT]
    > Note down the connection string to the namespace, the topic name, and the name of one of the subscriptions to the topic. You'll use them later in this tutorial.
- [Visual Studio 2019](https://www.visualstudio.com/vs). 
 
## Send messages to a topic
In this section, you'll create a .NET Core console application in Visual Studio, add code to send messages to the Service Bus topic you created. 

### Create a console application
Launch Visual Studio and create a new **Console App (.NET Core)** project for **C#**. For step-by-step instructions, see [Create a console app](/dotnet/core/tutorials/with-visual-studio).

### Add the Service Bus NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.
1. Select **Browse**. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation, then close the NuGet Package Manager.
 

### Add code to send messages to the topic 

> [!NOTE]
> If you want to see and use the full code instead of going through step-by-step instructions, see [Full code (send messages)](#full-code-receive-messages)

1. In **Program.cs**, add the following `using` statements at the top of the file.

    ```csharp
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Azure.Messaging.ServiceBus;

    ```
1. In the `Program` class, above the `Main` function, declare the following static properties.

    ```csharp
        // connection string to your Service Bus namespace
        static string connectionString = "<NAMESPACE CONNECTION STRING>";

        // name of the Service Bus topic
        static string topicName = "<SERVICE BUS TOPIC NAME>";
    ```

    Replace the following values:
    - `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace
    - `<TOPIC NAME>` with the name of the topic
1. Declare the following static properties in the `Program` class. See code comments for details. 

    ```csharp
        // the client that owns the connection and can be used to create senders and receivers
        static ServiceBusClient client;

        // the sender used to publish messages to the Service Bus topic
        static ServiceBusSender sender;   
    ```
1. Add a method named `CreateMessages` to create a queue (.NET queue, not Service Bus queue) of messages to the `Program` class. Typically, you get these messages from different parts of your application. Here, we create a queue of sample messages. If you aren't familiar with .NET queues, see [Queue.Enqueue](/dotnet/api/system.collections.queue.enqueue).

    ```csharp
        static Queue<ServiceBusMessage> CreateMessages()
        {
            // create a queue containing the messages and return it to the caller
            Queue<ServiceBusMessage> messages = new Queue<ServiceBusMessage>();
            messages.Enqueue(new ServiceBusMessage("First message"));
            messages.Enqueue(new ServiceBusMessage("Second message"));
            messages.Enqueue(new ServiceBusMessage("Third message"));
            return messages;
        }
    ```
1. Add a method named `SendMessages` the `Program` class, and add the following code. This method takes a queue of messages, and prepares one or more batches to send to the Service Bus topic. 

    ```csharp
        static async Task SendMessagesToTopic()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create a sender for the topic 
                ServiceBusSender sender = client.CreateSender(topicName);

                // get the messages to be sent to the Service Bus topic
                Queue<ServiceBusMessage> messages = CreateMessages();

                // total number of messages to be sent to the Service Bus topic
                int messageCount = messages.Count;

                // while all messages are not sent to the Service Bus topic
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

                Console.WriteLine($"Sent a batch of {messageCount} messages to the topic: {topicName}");
            }
        }
    ```    

    Here are the important steps from the code:
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the [CreateSender](/dotnet/api/azure.messaging.servicebus.servicebusclient.createsender) method on the `ServiceBusClient` object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specified Service Bus topic. 
    1. Invokes the helper method `CreateMessages` to get a queue of messages to be sent to the Service Bus topic. 
    1. Creates a [ServiceBusMessageBatch](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch) by using the [ServiceBusSender.CreateMessageBatchAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.createmessagebatchasync).
    1. Add messages to the batch using the [ServiceBusMessageBatch.TryAddMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch.tryaddmessage). As the messages are added to the batch, they're removed from the .NET queue. 
    1. Sends the batch of messages to the Service Bus topic using the [ServiceBusSender.SendMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessagesasync) method.
1. Replace the `Main()` method with the following **async** `Main` method. It calls the `SendMessages` method to send a batch of messages to the queue. 

    ```csharp
        static async Task Main()
        {
            // The Service Bus client types are safe to cache and use as a singleton for the lifetime
            // of the application, which is best practice when messages are being published or read
            // regularly.
            //
            // Create the clients that we'll use for sending and processing messages.
            client = new ServiceBusClient(connectionString);
            sender = client.CreateSender(topicName);

            try
            {
                // send a batch of messages to the topic
                await SendMessagesToTopic();
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

### Test the app to send messages to the topic
1. Run the application. You should see the following output:

    ```console
    Sent a batch of 3 messages to the topic: mytopic
    Press any key to end the application
    ```
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, in the bottom-middle pane, switch to the **Topics** tab, and select the Service Bus topic. In the following example, it's `mytopic`.
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/select-topic.png" alt-text="Select topic":::
    1. On the **Service Bus Topic** page, In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the topic. If you don't see the value, wait for a few minutes and refresh the page to see the updated chart. 

        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png" alt-text="Messages sent to the topic" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png":::
    4. Select the subscription in the bottom pane. In the following example, it's **S1**. On the **Service Bus Subscription** page, you see the **Active message count** as **4**. The subscription has received the four messages that you sent to the topic, but no receiver has picked them yet. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png" alt-text="Messages received at the subscription" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png":::
    
### Full code (send messages)

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Azure.Messaging.ServiceBus;

namespace ServiceBusTopicSender
{
    class Program
    {
        // connection string to your Service Bus namespace
        static string connectionString = "<NAMESPACE CONNECTION STRING>";

        // name of the Service Bus topic
        static string topicName = "<SERVICE BUS TOPIC NAME>";

        // the client that owns the connection and can be used to create senders and receivers
        static ServiceBusClient client;

        // the sender used to publish messages to the Service Bus topic
        static ServiceBusSender sender;

        static Queue<ServiceBusMessage> CreateMessages()
        {
            // create a queue containing the messages and return it to the caller
            Queue<ServiceBusMessage> messages = new Queue<ServiceBusMessage>();
            messages.Enqueue(new ServiceBusMessage("First message"));
            messages.Enqueue(new ServiceBusMessage("Second message"));
            messages.Enqueue(new ServiceBusMessage("Third message"));
            return messages;
        }

        static async Task SendMessagesToTopic()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create a sender for the topic 
                ServiceBusSender sender = client.CreateSender(topicName);

                // get the messages to be sent to the Service Bus topic
                Queue<ServiceBusMessage> messages = CreateMessages();

                // total number of messages to be sent to the Service Bus topic
                int messageCount = messages.Count;

                // while all messages are not sent to the Service Bus topic
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

                Console.WriteLine($"Sent a batch of {messageCount} messages to the topic: {topicName}");
            }
        }

        static async Task Main()
        {
            // The Service Bus client types are safe to cache and use as a singleton for the lifetime
            // of the application, which is best practice when messages are being published or read
            // regularly.
            //
            // Create the clients that we'll use for sending and processing messages.
            client = new ServiceBusClient(connectionString);
            sender = client.CreateSender(topicName);

            try
            {
                // send a batch of messages to the topic
                await SendMessagesToTopic();
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

## Receive messages from a subscription
In this section, you'll create a .NET Core console application that receives messages from the subscription to the Service Bus topic. 

### Create a console application and add Service Bus NuGet package

1. Create another C# .NET Core console application project. 
1. Right-click the newly created project and select **Manage NuGet Packages**.
1. Select **Browse**. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation, then close the NuGet Package Manager.

### Add code to receive messages from the subscription
> [!NOTE]
> If you want to see and use the full code instead of going through the following step-by-step instructions, see [Full code (receive messages)](#full-code-receive-messages)

1. In *Program.cs*, add the following `using` statements at the top of the namespace definition, before the class declaration:

    ```csharp
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using Azure.Messaging.ServiceBus;

    ```

1. In the `Program` class, declare the following static properties:

    ```csharp
        // connection string to your Service Bus namespace
        static string connectionString = "<NAMESPACE CONNECTION STRING>";

        // name of the Service Bus topic
        static string topicName = "<SERVICE BUS TOPIC NAME>";
    
        // name of the subscription to the topic
        static string subscriptionName = "<SERVICE BUS - TOPIC SUBSCRIPTION NAME>";
    ```

    Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of your queue. 
1. Declare the following static properties in the `Program` class. See the code comments for details. 

    ```csharp
        // the client that owns the connection and can be used to create senders and receivers
        static ServiceBusClient client;

        // the processor that reads and processes messages from the queue
        static ServiceBusProcessor processor;

    ```
1. Add the following methods to the `Program` class that handle messages and any errors. 

    ```csharp
        // handle received messages
        static async Task MessageHandler(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            Console.WriteLine($"Received: {body} from subscription: {subscriptionName}");
    
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
1. Add a method named `ReceiveMessagesFromSubscription` to the `Program` class, and add the following code to receive messages from the Service Bus queue. 

    ```csharp
        static async Task ReceiveMessagesFromSubscription()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
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
        }
    ```

    Here are the important steps from the code:
    1. Starts processing messages by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.startprocessingasync) on the `ServiceBusProcessor` object. 
    1. When user presses a key to end the processing, invokes the [StopProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.stopprocessingasync) on the `ServiceBusProcessor` object. 
1. Replace the `Main()` method. It calls the `ReceiveMessages` method to receive messages from the queue. 

    ```csharp
        static async Task Main()
        {
            // The Service Bus client types are safe to cache and use as a singleton for the lifetime
            // of the application, which is best practice when messages are being published or read
            // regularly.
            //
            // Create the clients that we'll use for sending and processing messages.
            client = new ServiceBusClient(connectionString);

            // create a processor that we can use to process the messages
            processor = client.CreateProcessor(topicName, subscriptionName, new ServiceBusProcessorOptions());

            try
            {
                // receive messages from the queue
                await ReceiveMessagesFromSubscription();
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

## Run the app
Run the application. Wait for a minute and then press any key to stop receiving messages. You should see the following output (spacebar for the key). 

```console
Wait for a minute and then press any key to end the processing
Received: First message from subscription: S1
Received: Second message from subscription: S1
Received: Third message from subscription: S1

Stopping the receiver...
Stopped receiving messages
```

Check the portal again. 

- On the **Service Bus Topic** page, in the **Messages** chart, you see eight incoming messages and eight outgoing messages. If you don't see these numbers, wait for a few minutes, and refresh the page to see the updated chart. 

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/messages-size-final.png" alt-text="Messages sent and received" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/messages-size-final.png":::
- On the **Service Bus Subscription** page, you see the **Active message count** as zero. It's because a receiver has received messages from this subscription and completed the messages. 

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page-final.png" alt-text="Active message count at the subscription at the end" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page-final.png":::
    


## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for .NET - Readme](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus)
- [.NET samples for Azure Service Bus on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples)
- [.NET API reference](/dotnet/api/azure.messaging.servicebus?preserve-view=true)
