---
title: Send messages to Azure Service Bus topics using azure-messaging-servicebus
description: This quickstart shows you how to send messages to Azure Service Bus topics using the azure-messaging-servicebus package. 
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 03/16/2021
ms.custom: devx-track-csharp
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (.NET)
In this tutorial, you create a C# application to do the following tasks:

1. Send messages to a Service Bus topic. 

    A Service Bus topic provides an endpoint for sender applications to send messages. A topic can have one or more subscriptions. Each subscription of a topic gets a copy of the message sent to the topic. For more information about Service Bus topics, see [What is Azure Service Bus?](service-bus-messaging-overview.md). 
1. Receive messages from a subscription of the topic. 

    :::image type="content" source="./media/service-bus-messaging-overview/about-service-bus-topic.png" alt-text="Service Bus topics and subscriptions":::

    > [!Important]
    > This quickstart uses the new **Azure.Messaging.ServiceBus** package. If you are using the old Microsoft.Azure.ServiceBus package, see [Send and receive messages using the Microsoft.Azure.ServiceBus package](service-bus-dotnet-how-to-use-topics-subscriptions-legacy.md).

## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in this [Quickstart](service-bus-quickstart-topics-subscriptions-portal.md) to create a Service Bus topic and subscriptions to the topic. 

    > [!NOTE]
    > You will use the connection string to the namespace, the topic name, and the name of one of the subscriptions to the topic in this tutorial.  
- [Visual Studio 2019](https://www.visualstudio.com/vs). 
 
## Send messages to a topic
In this section, you'll create a .NET Core console application in Visual Studio, add code to send messages to the Service Bus topic you created. 

### Create a console application
Create a .NET Core console application using Visual Studio. 

1. Launch Visual Studio.  
1. If you see the **Get started** page, select **Create a new project**. 
1. On the **Create a new project** page, follow these steps: 
    1. For the programming language, select **C#**. 
    1. For the project type, select **Console**. 
    1. Select **Console App (.NET Core)** from the list of templates. 
    1. Then, select **Next**. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/create-console-project.png" alt-text="Create a console app project":::
1. On the **Configure your new project** page, follow these steps: 
    1. For **Project name**, enter a name for the project. 
    1. For **Location**, select a location for the project and solution files. 
    1. For **Solution name**, enter a name for the solution. A Visual Studio solution can have one or more projects. In this quick start, the solution will have only one project. 
    1. Select **Create** to create the project. 
            
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/create-console-project-2.png" alt-text="Enter project and solution name and location":::    


### Add the Service Bus NuGet package
1. Right-click the newly created project and select **Manage NuGet Packages**.

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/manage-nuget-packages-menu.png" alt-text="Manage NuGet Packages menu":::        
1. Switch to the **Browse** tab.
1. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation.

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/select-service-bus-package.png" alt-text="Select Service Bus NuGet package.":::
5. If you see the **Preview Changes** dialog box, select **OK** to continue. 
1. If you see the **License Acceptance** page, select **I Accept** to continue. 
    

### Add code to send messages to the topic 

1. In the **Solution Explorer** window, double-click **Program.cs** to open the file in the editor. 
1. Add the following `using` statements at the top of the namespace definition, before the class declaration:
   
    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    ```
1. In the `Program` class, above the `Main` function, declare the following variables:

    ```csharp
        static string connectionString = "<NAMESPACE CONNECTION STRING>";
        static string topicName = "<SERVICE BUS TOPIC NAME>";
        static string subscriptionName = "<SERVICE BUS - TOPIC SUBSCRIPTION NAME>";
    ```

    Replace the following values:
    - `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace
    - `<TOPIC NAME>` with the name of the topic
    - `<SUBSCRIPTION NAME>` with the name of the subscription

### Send a single message to the topic
Add a method named `SendMessageToTopicAsync` to the `Program` class above or below the `Main` method. This method sends a single message to the topic.

```csharp
    static async Task SendMessageToTopicAsync()
    {
        // create a Service Bus client 
        await using (ServiceBusClient client = new ServiceBusClient(connectionString))
        {
            // create a sender for the topic
            ServiceBusSender sender = client.CreateSender(topicName);
            await sender.SendMessageAsync(new ServiceBusMessage("Hello, World!"));
            Console.WriteLine($"Sent a single message to the topic: {topicName}");
        }
    }
```

This method does the following steps: 
1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
1. Uses the `ServiceBusClient` object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specified Service Bus topic. This step uses the [ServiceBusClient.CreateSender](/dotnet/api/azure.messaging.servicebus.servicebusclient.createsender) method.
1. Then, the method sends a single test message to the Service Bus topic using the [ServiceBusSender.SendMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessageasync) method. 

### Send a batch of messages to the topic
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
1. Add a method named `SendMessageBatchAsync` the `Program` class, and add the following code. This method takes a queue of messages, and prepares one or more batches to send to the Service Bus topic. 

    ```csharp
        static async Task SendMessageBatchToTopicAsync()
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
    1. Invokes the helper method `GetMessages` to get a queue of messages to be sent to the Service Bus topic. 
    1. Creates a [ServiceBusMessageBatch](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch) by using the [ServiceBusSender.CreateMessageBatchAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.createmessagebatchasync).
    1. Add messages to the batch using the [ServiceBusMessageBatch.TryAddMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch.tryaddmessage). As the messages are added to the batch, they're removed from the .NET queue. 
    1. Sends the batch of messages to the Service Bus topic using the [ServiceBusSender.SendMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessagesasync) method.

### Update the main method
Replace the `Main()` method with the following **async** `Main` method. It calls both the send methods to send a single message and a batch of messages to the topic.  

```csharp
    static async Task Main()
    {
        // send a single message to the topic
        await SendMessageToTopicAsync();

        // send a batch of messages to the topic
        await SendMessageBatchToTopicAsync();
    }
```

### Test the app to send messages to the topic
1. Run the application. You should see the following output:

    ```console
    Sent a single message to the topic: mytopic
    Sent a batch of 3 messages to the topic: mytopic
    ```
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, in the bottom-middle pane, switch to the **Topics** tab, and select the Service Bus topic. In the following example, it's `mytopic`.
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/select-topic.png" alt-text="Select topic":::
    1. On the **Service Bus Topic** page, In the **Messages** chart in the bottom **Metrics** section, you can see that there are four incoming messages for the topic. If you don't see the value, wait for a few minutes and refresh the page to see the updated chart. 

        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png" alt-text="Messages sent to the topic" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png":::
    4. Select the subscription in the bottom pane. In the following example, it's **S1**. On the **Service Bus Subscription** page, you see the **Active message count** as **4**. The subscription has received the four messages that you sent to the topic, but no receiver has picked them yet. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png" alt-text="Messages received at the subscription" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png":::
    

## Receive messages from a subscription

1. Add the following methods to the `Program` class that handle messages and any errors. 

    ```csharp
        static async Task MessageHandler(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            Console.WriteLine($"Received: {body} from subscription: {subscriptionName}");

            // complete the message. messages is deleted from the queue. 
            await args.CompleteMessageAsync(args.Message);
        }

        static Task ErrorHandler(ProcessErrorEventArgs args)
        {
            Console.WriteLine(args.Exception.ToString());
            return Task.CompletedTask;
        }
    ```
1. Add the following method `ReceiveMessagesFromSubscriptionAsync` to the `Program` class.

    ```csharp
        static async Task ReceiveMessagesFromSubscriptionAsync()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {
                // create a processor that we can use to process the messages
                ServiceBusProcessor processor = client.CreateProcessor(topicName, subscriptionName, new ServiceBusProcessorOptions());

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
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the [CreateProcessor](/dotnet/api/azure.messaging.servicebus.servicebusclient.createprocessor) method on the `ServiceBusClient` object to create a [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object for the specified Service Bus topic and the subscription combination. 
    1. Specifies handlers for the [ProcessMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processmessageasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processerrorasync) events of the `ServiceBusProcessor` object. 
    1. Starts processing messages by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.startprocessingasync) on the `ServiceBusProcessor` object. 
    1. When user presses a key to end the processing, invokes the [StopProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.stopprocessingasync) on the `ServiceBusProcessor` object. 
1. Add a call to the `ReceiveMessagesFromSubscriptionAsync` method to the `Main` method. Comment out the `SendMessagesToTopicAsync` method if you want to test only receiving of messages. If you don't, you see another four messages sent to the topic. 

    ```csharp
        static async Task Main()
        {
            // send a message to the topic
            await SendMessageToTopicAsync();

            // send a batch of messages to the topic
            await SendMessageBatchToTopicAsync();

            // receive messages from the subscription
            await ReceiveMessagesFromSubscriptionAsync();
        }
    ```
## Run the app
Run the application. Wait for a minute and then press any key to stop receiving messages. You should see the following output (spacebar for the key). 

```console
Sent a single message to the topic: mytopic
Sent a batch of 3 messages to the topic: mytopic
Wait for a minute and then press any key to end the processing
Received: Hello, World! from subscription: mysub
Received: First message from subscription: mysub
Received: Second message from subscription: mysub
Received: Third message from subscription: mysub
Received: Hello, World! from subscription: mysub
Received: First message from subscription: mysub
Received: Second message from subscription: mysub
Received: Third message from subscription: mysub

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