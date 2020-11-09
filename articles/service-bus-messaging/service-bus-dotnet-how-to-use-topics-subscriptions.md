---
title: Send messages to Azure Service Bus topics using azure-messaging-servicebus
description: This quickstart shows you how to send messages to Azure Service Bus topics using the azure-messaging-servicebus package. 
ms.topic: conceptual
ms.tgt_pltfrm: dotnet
ms.date: 09/02/2020
ms.custom: devx-track-csharp
---

# Send messages to an Azure Service Bus topic and receive messages from subscriptions to the topic (.NET)
This tutorial shows you how to create a .NET Core console application that sends messages to a Service Bus topic and receives messages from a subscription of the topic. 

> [!Important]
> This quickstart uses the new **Azure.Messaging.ServiceBus** package. For a quickstart that uses the old Microsoft.Azure.ServiceBus package, see [Send and receive messages using the Microsoft.Azure.ServiceBus package](service-bus-dotnet-how-to-use-topics-subscriptions-legacy.md).

## Prerequisites

- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [Visual Studio or MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A85619ABF) or sign-up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- Follow steps in the [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](service-bus-quickstart-topics-subscriptions-portal.md). Note down the connection string, topic name, and a subscription name. You will use only one subscription for this quickstart. 
- [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](https://www.visualstudio.com/vs) or later.
- [NET Core SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

## Create a console application
Launch Visual Studio and create a new **Console App (.NET Core)** project for C#. 

## Add the Service Bus NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.
1. Select **Browse**. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation, then close the NuGet Package Manager.

## Send messages to a topic

1. In Program.cs, add the following `using` statements at the top of the namespace definition, before the class declaration:
   
    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    ```
1. In the `Program` class, declare the following variables:

    ```csharp
        static string connectionString = "<NAMESPACE CONNECTION STRING>";
        static string topicName = "<TOPIC NAME>";
        static string subName = "<SUBSCRIPTION NAME>";
    ```

    Replace the following values:
    - `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace
    - `<TOPIC NAME>` with the name of the topic
    - `<SUBSCRIPTION NAME>` with the name of the subscription
2. Add a method named `CreateMessages` to create a list of messages to the `Program` class. Typically, you get these messages from different parts of your application. Here, we are simply making a list of messages.

    ```csharp
        static IList<ServiceBusMessage> CreateMessages()
        {
            // create a list of messages and return it to the caller
            List<ServiceBusMessage> listOfMessages = new List<ServiceBusMessage>();
            listOfMessages.Add(new ServiceBusMessage(Encoding.UTF8.GetBytes("First message")));
            listOfMessages.Add(new ServiceBusMessage(Encoding.UTF8.GetBytes("Second message")));
            listOfMessages.Add(new ServiceBusMessage(Encoding.UTF8.GetBytes("Third message")));
            return listOfMessages;
        }
    ```
1. 1. Add a method named `SendMessagesAsync` to the `Program` class, and add the following code. This method takes a list of messages, and prepares one or more batches to send to the Service Bus topic. 

    ```csharp
        static async Task SendMessagesToTopicAsync()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create a sender for the queue 
                ServiceBusSender sender = client.CreateSender(topicName);

                // prepare messages
                IList<ServiceBusMessage> listOfMessages = CreateMessages();

                // create a batch object
                ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();

                for (var i = 0; i < listOfMessages.Count; i++)
                {
                    // try adding a message to the batch
                    if (!messageBatch.TryAddMessage(listOfMessages[i]))
                    {
                        // if it fails to add the message

                        // send the current batch as it's full
                        await sender.SendMessagesAsync(messageBatch);
                        messageBatch.Dispose();

                        // create a new batch for the remaining messages
                        messageBatch = await sender.CreateMessageBatchAsync();

                        // add the message failed to be added in the previous batch to the new batch
                        if (!messageBatch.TryAddMessage(listOfMessages[i]))
                        {
                            // if it still fails, the message is probably too big for the batch
                            Console.WriteLine($"Message {i} is too big to fit in a batch");
                            break;
                        }
                    }
                }

                // send the final batch
                await sender.SendMessagesAsync(messageBatch);
                messageBatch.Dispose();

                Console.WriteLine($"Sent a batch of {listOfMessages.Count} messages to the topic: {topicName}");
            }
        }
    ```
1. Replace the `Main()` method with the following **async** `Main` method. It calls the `SendMessagesToTopicAsync()` method that you added in the previous step to send messages to the topic. 

    ```csharp
        static async Task Main()
        {
            // send messages to the topic
            await SendMessagesToTopicAsync();
        }
    ```
5. Run the application.

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-command-prompt.png" alt-text="Command prompt message":::    
1. Navigate to the **Service Bus Topic** page for your topic in the Azure portal. You see some useful information such as active message count and current size. 

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png" alt-text="Messages received with count and size":::

    The **Message count** value for the **subscription** is now **3**. Each time you run this sender app without retrieving messages from the subscription, this value increases by 3.

    The current size of the topic increments the **Current size** value in **Essentials**  each time the app adds messages to the topic.

    In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the topic. Wait for a few minutes and refresh the page to see the updated chart. 

    Select **Refresh** on the toolbar to if you don't see values. 

    The next section describes how to retrieve these messages from the subscription of the topic.

## Receive messages from a subscription

1. Add the following methods to the `Program` class that handle messages and any errors. 

    ```csharp
        static async Task MessageHandler(ProcessMessageEventArgs args)
        {
            string body = args.Message.Body.ToString();
            Console.WriteLine($"Received: {body} from subscription: {subName}");

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
                ServiceBusProcessor processor = client.CreateProcessor(topicName, subName, new ServiceBusProcessorOptions());

                // add handler to process messages
                processor.ProcessMessageAsync += MessageHandler;

                // add handler to process any errors
                processor.ProcessErrorAsync += ErrorHandler;

                // start processing 
                await processor.StartProcessingAsync();

                // wait (5 seconds) for the message handler to be invokved a few times
                await Task.Delay(5000);

                // stop processing 
                await processor.StopProcessingAsync();
            }
        }
    ```
1. Add a call to the `ReceiveMessagesFromSubscriptionAsync` method to the `Main` method. Comment out the `SendMessagesToTopicAsync` method if you want to test only receiving of messages. If you don't, you see another three messages sent to the topic. 

    ```csharp
        static async Task Main()
        {
            // send messages to the topic
            await SendMessagesToTopicAsync();

            // receive messages from the subscription
            await ReceiveMessagesFromSubscriptionAsync();
        }
    ```
5. Run the application. You should see the received messages in the output window.

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/final-output.png" alt-text="Final output":::

    Check the portal again. The **Message count** and **Current size** values are now **0**. It's because the messages have been received and completed (using `CompleteMessageAsync`).

    In the **Messages** chart in the bottom **Metrics** section, you can see that there are six incoming messages and six outgoing messages. Wait for a few minutes and refresh the page to see the updated chart. 

    :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/messages-size-final.png" alt-text="Active messages and size after receive":::


## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples). 

