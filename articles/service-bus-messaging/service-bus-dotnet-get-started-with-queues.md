---
title: Get started with Azure Service Bus queues (Azure.Messaging.ServiceBus)
description: In this tutorial, you create .NET Core console application and use the Azure.Messaging.ServiceBus package to send messages to and receive messages from a Service Bus queue.
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 11/09/2020
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
2. Add a method named `CreateMessages` to create a list of messages to the `Program` class. Typically, you get these messages from different parts of your application. Here, we create a list of sample messages.

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
1. Add a method named `SendMessagesAsync` to the `Program` class, and add the following code. This method takes a list of messages, and prepares one or more batches to send to the Service Bus queue. 

    ```csharp
        static async Task SendMessagesAsync()
        {
            // create a Service Bus client 
            await using (ServiceBusClient client = new ServiceBusClient(connectionString))
            {
                // create a sender for the queue 
                ServiceBusSender sender = client.CreateSender(queueName);

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
                        Console.WriteLine($"Sent a batch of messages to the queue: {queueName}");

                        // dispose the batch object. create a new batch in the next step.
                        messageBatch.Dispose();

                        // create a new batch for the remaining messages
                        messageBatch = await sender.CreateMessageBatchAsync();

                        // add the message failed to be added to the new batch
                        if (!messageBatch.TryAddMessage(listOfMessages[i]))
                        {
                            // if it still fails, the message is probably too big for the batch
                            Console.WriteLine($"Message {i} is too big to fit in a batch. Skipping");
                            break;
                        }
                    }
                }

                // send the final batch
                await sender.SendMessagesAsync(messageBatch);
                messageBatch.Dispose();

                Console.WriteLine($"Sent a batch of messages to the queue: {queueName}");
            }
        }
    ```
1. Replace the `Main()` method with the following **async** `Main` method. It calls the `SendMessagesAsync()` method that you added in the previous step to send messages to the topic.

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

    Notice the following values:
    - The **Active message count** value for the queue is now **3**. Each time you run this sender app without retrieving the messages, this value increases by 3.
    - The current size of the queue increments the **CURRENT** value in **Essentials**  each time the app adds messages to the queue.
    - In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the queue. 

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

                // wait (5 seconds) for the message handler to be invoked a few times
                await Task.Delay(5000);

                // stop processing 
                await processor.StopProcessingAsync();
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

## Run the app
Run the application. You should see the messages that are received in the output window.

:::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/final-output.png" alt-text="Final output":::

Check the portal again. 

- The **Active message count** and **CURRENT** values are now **0**.
- In the **Messages** chart in the bottom **Metrics** section, you can see that there are six incoming messages and six outgoing messages for the queue. 

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/queue-messages-size-final.png" alt-text="Active messages and size after receive":::

## Next steps
Check out our [GitHub repository with samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples). 

