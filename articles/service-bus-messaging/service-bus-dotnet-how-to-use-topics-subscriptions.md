---
title: Send messages to Azure Service Bus topics using azure-messaging-servicebus
description: This quickstart shows you how to send messages to Azure Service Bus topics using the azure-messaging-servicebus package. 
ms.topic: conceptual
ms.tgt_pltfrm: dotnet
ms.date: 09/02/2020
ms.custom: devx-track-csharp
---

# Send messages to Azure Service Bus topics using azure-messaging-servicebus
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
2. Add a method named `SendMessagesToTopicAsync` and add the following code.

    ```csharp
        static async Task SendMessagesToTopicAsync()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create the sender
                ServiceBusSender sender = client.CreateSender(topicName);

                // prepare messages
                ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("First message")));
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("Second message")));
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("Third message")));

                // send the message batch
                await sender.SendMessagesAsync(messageBatch);
                Console.WriteLine($"Sent a batch of three messages to the topic: {topicName}");
            }
        }
    ```

    This method does the following operations:
    1. Create a Service Bus client (`ServiceBusClient`). 
    1. Use the Service Bus client object to create a topic sender (`ServiceBusSender`). 
    1. Create a batch (`ServiceBusMessageBatch`) of messages. 
    1. Then, use the topic sender object to send the batch of messages to the topic.
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

1. Add the following method `ReceiveMessagesFromSubscriptionAsync` to the `Program` class.

    ```csharp
        static async Task ReceiveMessagesFromSubscriptionAsync()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create the receiver
                ServiceBusReceiver receiver = client.CreateReceiver(topicName, subName);

                // receive messages 
                IReadOnlyList<ServiceBusReceivedMessage> receivedMessages = await receiver.ReceiveMessagesAsync(maxMessages: 100);
            
                foreach (ServiceBusReceivedMessage receivedMessage in receivedMessages)
                {
                    // get the message body as a string
                    string body = receivedMessage.Body.ToString();
                    Console.WriteLine($"Received: {body} from subscription: {subName}");
                    // complete the message, thereby deleting it from the service
                    await receiver.CompleteMessageAsync(receivedMessage);
                }
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

