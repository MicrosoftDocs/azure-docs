---
title: Get started with Azure Service Bus topics and subscriptions
description: This quickstart shows you how to send messages to Azure Service Bus topics using the azure-messaging-servicebus package. 
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 06/29/2021
ms.custom: contperf-fy21q3
---

# Send messages to an Azure Service Bus topic and receive messages from its subscriptions (.NET)
This quickstart shows how to send messages to a Service Bus topic and receive messages a subscription to that topic by using the [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/) .NET library.

## Prerequisites
If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart. 

- **Azure subscription**. To use Azure services, including Azure Service Bus, you need a subscription.  If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/) or use your MSDN subscriber benefits when you [create an account](https://azure.microsoft.com).
- **Microsoft Visual Studio 2019**. The Azure Service Bus client library makes use of new features that were introduced in C# 8.0.  You can still use the library with  previous C# language versions, but the new syntax won't be available. To make use of the full syntax, we recommend that you compile with the [.NET Core SDK](https://dotnet.microsoft.com/download) 3.0 or higher and [language version](/dotnet/csharp/language-reference/configure-language-version#override-a-default) set to `latest`. If you're using Visual Studio, versions before Visual Studio 2019 aren't compatible with the tools needed to build C# 8.0 projects. Visual Studio 2019, including the free Community edition, can be downloaded [here](https://visualstudio.microsoft.com/vs/).
- Follow steps in this [Quickstart](service-bus-quickstart-topics-subscriptions-portal.md) to create a Service Bus topic and subscriptions to the topic. 

    > [!IMPORTANT]
    > Note down the connection string to the namespace, the topic name, and the name of one of the subscriptions to the topic. You'll use them later in this tutorial.
 
## Send messages to a topic
This section shows you how to create a .NET Core console application to send messages to a Service Bus topic. 

### Create a console application

1. Start Visual Studio 2019. 
1. Select **Create a new project**. 
1. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**. 
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application. 
    1. Select **Console Application** from the results list. 
    1. Then, select **Next**. 

        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/new-send-project.png" alt-text="Image showing the Create a new project dialog box with C# and Console selected":::
1. Enter **TopicSender** for the project name, **ServiceBusTopicQuickStart** for the solution name, and then select **Next**. 
1. On the **Additional information** page, select **Create** to create the solution and the project.

### Add the Service Bus NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.ServiceBus
    ```

### Add code to send messages to the topic 

1. Replace code in the **Program.cs** with the following code. Here are the important steps from the code.  
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the `CreateSender` method on the `ServiceBusClient` object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specific Service Bus topic.     
    1. Creates a `ServiceBusMessageBatch` object by using the `ServiceBusSender.CreateMessageBatchAsync` method.
    1. Add messages to the batch using the `ServiceBusMessageBatch.TryAddMessage` method. 
    1. Sends the batch of messages to the Service Bus topic using the `ServiceBusSender.SendMessagesAsync` method.
    
        For more information, see code comments.
        ```csharp
        using System;
        using System.Threading.Tasks;
        using Azure.Messaging.ServiceBus;
        
        namespace TopicSender
        {
            class Program
            {
                // connection string to your Service Bus namespace
                static string connectionString = "<NAMESPACE CONNECTION STRING>";
        
                // name of your Service Bus topic
                static string topicName = "<TOPIC NAME>";
        
                // the client that owns the connection and can be used to create senders and receivers
                static ServiceBusClient client;
        
                // the sender used to publish messages to the topic
                static ServiceBusSender sender;
        
                // number of messages to be sent to the topic
                private const int numOfMessages = 3;
        
                static async Task Main()
                {
                    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
                    // of the application, which is best practice when messages are being published or read
                    // regularly.
                    //
                    // Create the clients that we'll use for sending and processing messages.
                    client = new ServiceBusClient(connectionString);
                    sender = client.CreateSender(topicName);
        
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
                        // Use the producer client to send the batch of messages to the Service Bus topic
                        await sender.SendMessagesAsync(messageBatch);
                        Console.WriteLine($"A batch of {numOfMessages} messages has been published to the topic.");
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
1. Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<TOPIC NAME>` with the name of your Service Bus topic. 
1. Build the project, and ensure that there are no errors. 
1. Run the program and wait for the confirmation message.
    
    ```bash
    A batch of 3 messages has been published to the topic
    ```
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, in the bottom-middle pane, switch to the **Topics** tab, and select the Service Bus topic. In the following example, it's `mytopic`.
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/select-topic.png" alt-text="Select topic":::
    1. On the **Service Bus Topic** page, In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the topic. If you don't see the value, wait for a few minutes and refresh the page to see the updated chart. 

        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png" alt-text="Messages sent to the topic" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png":::
    4. Select the subscription in the bottom pane. In the following example, it's **S1**. On the **Service Bus Subscription** page, you see the **Active message count** as **3**. The subscription has received the three messages that you sent to the topic, but no receiver has picked them yet. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png" alt-text="Messages received at the subscription" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png":::
    
## Receive messages from a subscription
In this section, you'll create a .NET Core console application that receives messages from the subscription to the Service Bus topic. 

### Create a project for the receiver

1. In the Solution Explorer window, right-click the **ServiceBusTopicQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console application**, and select **Next**. 
1. Enter **SubscriptionReceiver** for the **Project name**, and select **Next**. 
1. On the **Additional information** page, select **Create**. 
1. In the **Solution Explorer** window, right-click **SubscriptionReceiver**, and select **Set as a Startup Project**. 

### Add the Service Bus NuGet package

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu. 
1. In the **Package Manager Console** window, confirm that **SubscriptionReceiver** is selected for the **Default project**. If not, use the drop-down list to select **SubscriptionReceiver**.
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```cmd
    Install-Package Azure.Messaging.ServiceBus
    ```

### Add code to receive messages from the subscription
1. Replace code in the **Program.cs** with the following code. Here are the important steps from the code.
    Here are the important steps from the code:
    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the `CreateProcessor` method on the `ServiceBusClient` object to create a [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object for the specified Service Bus queue. 
    1. Specifies handlers for the `ProcessMessageAsync`and `ProcessErrorAsync` events of the `ServiceBusProcessor` object. 
    1. Starts processing messages by invoking the `StartProcessingAsync` on the `ServiceBusProcessor` object. 
    1. When user presses a key to end the processing, invokes the `StopProcessingAsync` on the `ServiceBusProcessor` object. 

        For more information, see code comments.

        ```csharp
        using System;
        using System.Threading.Tasks;
        using Azure.Messaging.ServiceBus;
        
        namespace SubscriptionReceiver
        {
            class Program
            {
                // connection string to your Service Bus namespace
                static string connectionString = "<NAMESPACE CONNECTION STRING>";
        
                // name of the Service Bus topic
                static string topicName = "<SERVICE BUS TOPIC NAME>";
            
                // name of the subscription to the topic
                static string subscriptionName = "<SERVICE BUS - TOPIC SUBSCRIPTION NAME>";
        
                // the client that owns the connection and can be used to create senders and receivers
                static ServiceBusClient client;
        
                // the processor that reads and processes messages from the subscription
                static ServiceBusProcessor processor;
        
                // handle received messages
                static async Task MessageHandler(ProcessMessageEventArgs args)
                {
                    string body = args.Message.Body.ToString();
                    Console.WriteLine($"Received: {body} from subscription: {subscriptionName}");
        
                    // complete the message. messages is deleted from the subscription. 
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
                    // Create the clients that we'll use for sending and processing messages.
                    client = new ServiceBusClient(connectionString);
        
                    // create a processor that we can use to process the messages
                    processor = client.CreateProcessor(topicName, subscriptionName, new ServiceBusProcessorOptions());
        
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
1. Replace the placeholders with correct values:
    - `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace
    - `<TOPIC NAME>` with the name of your Service Bus topic
    - `<SERVICE BUS - TOPIC SUBSCRIPTION NAME>` with the name of the subscription to the topic. 
1. Build the project, and ensure that there are no errors.
1. Run the receiver application. You should see the received messages. Press any key to stop the receiver and the application. 

    ```console
    Wait for a minute and then press any key to end the processing
    Received: Message 1 from subscription: S1
    Received: Message 2 from subscription: S1
    Received: Message 3 from subscription: S1
    
    Stopping the receiver...
    Stopped receiving messages
    ```
1. Check the portal again. 
    - On the **Service Bus Topic** page, in the **Messages** chart, you see three incoming messages and three outgoing messages. If you don't see these numbers, wait for a few minutes, and refresh the page to see the updated chart. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/messages-size-final.png" alt-text="Messages sent and received" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/messages-size-final.png":::
    - On the **Service Bus Subscription** page, you see the **Active message count** as zero. It's because a receiver has received messages from this subscription and completed the messages. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page-final.png" alt-text="Active message count at the subscription at the end" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page-final.png":::
        


## Next steps
See the following documentation and samples:

- [Azure Service Bus client library for .NET - Readme](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus)
- [.NET samples for Azure Service Bus on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples)
- [.NET API reference](/dotnet/api/azure.messaging.servicebus?preserve-view=true)
