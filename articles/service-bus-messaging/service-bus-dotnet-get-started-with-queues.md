---
title: Get started with Azure Service Bus queues (Azure.Messaging.ServiceBus)
description: In this tutorial, you create .NET Core console application and use the Azure.Messaging.ServiceBus package to send messages to and receive messages from a Service Bus queue.
ms.topic: conceptual
ms.tgt_pltfrm: dotnet
ms.date: 10/30/2020
ms.custom: devx-track-csharp
---

# Azure Service Bus - Send and receive messages using Azure.Messaging.ServiceBus
In this tutorial, you create a .NET Core console application to send messages to and receive messages from a Service Bus queue using the **Azure.Messaging.ServiceBus** package. 

> [!Important]
> This quickstart uses the new Azure.Messaging.ServiceBus package. For a quickstart that uses the old Microsoft.Azure.ServiceBus package, see [Send and receive events using Microsoft.Azure.ServiceBus package](service-bus-dotnet-get-started-with-queues-legacy.md).

## Prerequisites

- [Visual Studio 2019](https://www.visualstudio.com/vs).
- [NET Core SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.
- An Azure subscription. To complete this tutorial, you need an Azure account. You can activate your [MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/credit-for-visual-studio-subscribers/?WT.mc_id=A85619ABF) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A85619ABF).
- If you don't have a queue to work with, follow steps in the [Use Azure portal to create a Service Bus queue](service-bus-quickstart-portal.md) article to create a queue. Note down the connection string for your Service Bus namespace and the name of the queue you created.

## Send messages
To send messages to the queue, write a C# console application using Visual Studio.

### Create a console application
Launch Visual Studio and create a new **Console App (.NET Core)** project for C#. 

### Add the Service Bus NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.
1. Select **Browse**. Search for and select **[Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/)**.
1. Select **Install** to complete the installation, then close the NuGet Package Manager.

### Send messages to a queue

1. In *Program.cs*, add the following `using` statements at the top of the namespace definition, before the class declaration:

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
        static string queueName = "<QUEUE NAME>";
    ```

    Replace `<NAMESPACE CONNECTION STRING>` with the connection string to your Service Bus namespace. And, replace `<QUEUE NAME>` with the name of the queue.     
2. Add a method named `SendMessagesAsync` and add the following code.

    ```csharp
        static async Task SendMessagesAsync()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create a sender for the queue 
                ServiceBusSender sender = client.CreateSender(queueName);

                // prepare a batch of messages
                ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync();
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("First message")));
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("Second message")));
                messageBatch.TryAddMessage(new ServiceBusMessage(Encoding.UTF8.GetBytes("Third message")));

                // Use the sender object to send the batch of messages
                await sender.SendMessagesAsync(messageBatch);
                Console.WriteLine("Sent a batch of three messages");
            }
        }
    ```

    This method does the following operations:
    1. Create a Service Bus client (`ServiceBusClient`). 
    1. Use the Service Bus client object to create a queue sender (`ServiceBusSender`). 
    1. Create a batch (`ServiceBusMessageBatch`) of messages. 
    1. Then, use the queue sender object to send the batch of messages to the queue. 
1. Replace the `Main()` method with the following **async** `Main` method. It calls the `SendMessagesAsync()` method that you'll add in the next step to send messages to the queue. 

    ```csharp
        static async Task Main()
        {
            // send messages to the queue
            await SendMessagesAsync();
        }
    ```
5. Run the application.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/sent-messages-command-prompt.png" alt-text="Command prompt message":::    
1. Check the Azure portal. Select the name of your queue in the namespace **Overview** window to display queue **Essentials**.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/sent-messages-essentials.png" alt-text="Messages received with count and size":::

    The **Active message count** value for the queue is now **3**. Each time you run this sender app without retrieving the messages, this value increases by 3.

    The current size of the queue increments the **CURRENT** value in **Essentials**  each time the app adds messages to the queue.

    In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the queue. 

    The next section describes how to retrieve these messages from the queue.

## Receive messages from a queue
In this section, you'll add code to retrieve messages from the queue.

1. Add a method named `ReceiveMessagesAsync` and add the following code.

    ```csharp
        static async Task ReceiveMessagesAsync()
        {
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {

                // create a receiver for the queue
                ServiceBusReceiver receiver = client.CreateReceiver(queueName);

                // receive messages
                IReadOnlyList<ServiceBusReceivedMessage> receivedMessages = await receiver.ReceiveMessagesAsync(maxMessages: 100);

                // for each message, print the body of the message
                foreach (ServiceBusReceivedMessage receivedMessage in receivedMessages)
                {
                    // get the message body as a string
                    string body = receivedMessage.Body.ToString();
                    Console.WriteLine($"Received: {body}");
                    // complete the message, thereby deleting it from the service
                    await receiver.CompleteMessageAsync(receivedMessage);
                }
            }
        }    
    ```
1. Add a call to `ReceiveMessagesAsync` method from the `Main` method. Comment out the `SendMessagesAsync` method if you want to test only receiving of messages. If you don't, you see another three messages sent to the queue. 

    ```csharp
        static async Task Main()
        {
            // send messages to the queue
            await SendMessagesAsync();

            // receive message from the queue
            await ReceiveMessagesAsync();
        }
    ```
5. Run the application. You should see the messages that are received in the output window.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/final-output.png" alt-text="Final output":::

    Check the portal again. The **Active message count** and **CURRENT** values are now **0**.

    In the **Messages** chart in the bottom **Metrics** section, you can see that there are six incoming messages and six outgoing messages for the queue. 

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png" alt-text="Active messages and size after receive":::

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples). 

