---
title: Get started with Azure Service Bus topics (.NET)
description: This tutorial shows you how to send messages to Azure Service Bus topics and receive messages from topics' subscriptions using the .NET programming language.
ms.topic: quickstart
ms.tgt_pltfrm: dotnet
ms.date: 11/08/2022
ms.devlang: csharp
ms.custom: contperf-fy22q2, mode-api, passwordless-dotnet, devx-track-dotnet
---

# Get started with Azure Service Bus topics and subscriptions (.NET)

> [!div class="op_single_selector" title1="Select the programming language:"]
> * [C#](service-bus-dotnet-how-to-use-topics-subscriptions.md)
> * [Java](service-bus-java-how-to-use-topics-subscriptions.md)
> * [JavaScript](service-bus-nodejs-how-to-use-topics-subscriptions.md)
> * [Python](service-bus-python-how-to-use-topics-subscriptions.md)


This quickstart shows how to send messages to a Service Bus topic and receive messages from a subscription to that topic by using the [Azure.Messaging.ServiceBus](https://www.nuget.org/packages/Azure.Messaging.ServiceBus/) .NET library.

In this quickstart, you'll do the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus topic, using the Azure portal.
3. Create a Service Bus subscription to that topic, using the Azure portal.
4. Write a .NET console application to send a set of messages to the topic.
5. Write a .NET console application to receive those messages from the subscription.

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic.  For more samples on other and advanced scenarios, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples). 
> - This quick start shows you two ways of connecting to Azure Service Bus: **connection string** and **passwordless**. The first option shows you how to use a connection string to connect to a Service Bus namespace. The second option shows you how to use your security principal in Azure Active Directory and the role-based access control (RBAC) to connect to a Service Bus namespace. You don't need to worry about having hard-coded connection string in your code or in a configuration file or in secure storage like Azure Key Vault. If you are new to Azure, you may find the connection string option easier to follow. We recommend using the passwordless option in real-world applications and production environments. For more information, see [Authentication and authorization](service-bus-authentication-and-authorization.md).

## Prerequisites

If you're new to the service, see [Service Bus overview](service-bus-messaging-overview.md) before you do this quickstart.

- **Azure subscription**. To use Azure services, including Azure Service Bus, you need a subscription. If you don't have an existing Azure account, you can sign up for a [free trial](https://azure.microsoft.com/free/dotnet/).
- **Visual Studio 2022**. The sample application makes use of new features that were introduced in C# 10. You can still use the Service Bus client library with previous C# language versions, but the syntax may vary. To use the latest syntax, we recommend that you install .NET 6.0 or higher and set the language version to `latest`. If you're using Visual Studio, versions before Visual Studio 2022 aren't compatible with the tools needed to build C# 10 projects.

[!INCLUDE [service-bus-create-namespace-portal](./includes/service-bus-create-namespace-portal.md)]

[!INCLUDE [service-bus-create-topic-subscription-portal](./includes/service-bus-create-topic-subscription-portal.md)]

[!INCLUDE [service-bus-passwordless-template-tabbed](../../includes/passwordless/service-bus/service-bus-passwordless-template-tabbed.md)]

## Launch Visual Studio and sign-in to Azure

You can authorize access to the service bus namespace using the following steps:

1. Launch Visual Studio. If you see the **Get started** window, select the **Continue without code** link in the right pane.
1. Select the **Sign in** button in the top right of Visual Studio.

    :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/azure-sign-button-visual-studio.png" alt-text="Screenshot showing the button to sign in to Azure using Visual Studio.":::
1. Sign-in using the Azure AD account you assigned a role to previously.

    :::image type="content" source="..//storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-account-small.png" alt-text="Screenshot showing the account selection.":::

## Send messages to the topic
This section shows you how to create a .NET console application to send messages to a Service Bus topic. 

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic.  For more samples on other and advanced scenarios, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples).

### Create a console application

1. In Visual Studio, select **File** -> **New** -> **Project** menu. 
1. On the **Create a new project** dialog box, do the following steps: If you don't see this dialog box, select **File** on the menu, select **New**, and then select **Project**.
    1. Select **C#** for the programming language.
    1. Select **Console** for the type of the application.
    1. Select **Console App** from the results list.
    1. Then, select **Next**.

        :::image type="content" source="./media/service-bus-dotnet-get-started-with-queues/new-send-project.png" alt-text="Image showing the Create a new project dialog box with C# and Console selected":::
1. Enter **TopicSender** for the project name, **ServiceBusTopicQuickStart** for the solution name, and then select **Next**. 
1. On the **Additional information** page, select **Create** to create the solution and the project.

### Add the NuGet packages to the project

### [Passwordless](#tab/passwordless)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package.

    ```powershell
    Install-Package Azure.Messaging.ServiceBus
    ```
1. Run the following command to install the **Azure.Identity** NuGet package.

    ```powershell
    Install-Package Azure.Identity
    ```

### [Connection String](#tab/connection-string)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```Powershell
    Install-Package Azure.Messaging.ServiceBus
    ```
---


### Add code to send messages to the topic 

1. Replace the contents of Program.cs with the following code. The important steps are outlined below, with additional information in the code comments.

    ## [Passwordless](#tab/passwordless)

    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the `DefaultAzureCredential` object. `DefaultAzureCredential` will automatically discover and use the credentials of your Visual Studio login to authenticate to Azure Service Bus. 
    1. Invokes the [CreateSender](/dotnet/api/azure.messaging.servicebus.servicebusclient.createsender) method on the `ServiceBusClient` object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specific Service Bus topic.     
    1. Creates a [ServiceBusMessageBatch](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch) object by using the [ServiceBusSender.CreateMessageBatchAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.createmessagebatchasync).
    1. Add messages to the batch using the [ServiceBusMessageBatch.TryAddMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch.tryaddmessage). 
    1. Sends the batch of messages to the Service Bus topic using the [ServiceBusSender.SendMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessagesasync) method.

    > [!IMPORTANT]
    > Update placeholder values (`<NAMESPACE-NAME>` and `<TOPIC-NAME>`) in the code snippet with names of your Service Bus namespace and topic.
    
    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    using Azure.Identity;

    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the sender used to publish messages to the topic
    ServiceBusSender sender;

    // number of messages to be sent to the topic
    const int numOfMessages = 3;

    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.

    //TODO: Replace the "<NAMESPACE-NAME>" and "<TOPIC-NAME>" placeholders.
    client = new ServiceBusClient(
        "<NAMESPACE-NAME>.servicebus.windows.net",
        new DefaultAzureCredential());
    sender = client.CreateSender("<TOPIC-NAME>");

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
    ```

    ## [Connection String](#tab/connection-string)

    > [!IMPORTANT]
    > Update placeholder values (`<NAMESPACE-CONNECTION-STRING>` and `<TOPIC-NAME>`) in the code snippet with actual values you noted down earlier.

    1. Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    1. Invokes the [CreateSender](/dotnet/api/azure.messaging.servicebus.servicebusclient.createsender) method on the `ServiceBusClient` object to create a [ServiceBusSender](/dotnet/api/azure.messaging.servicebus.servicebussender) object for the specific Service Bus topic.     
    1. Creates a [ServiceBusMessageBatch](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch) object by using the [ServiceBusSender.CreateMessageBatchAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.createmessagebatchasync).
    1. Add messages to the batch using the [ServiceBusMessageBatch.TryAddMessage](/dotnet/api/azure.messaging.servicebus.servicebusmessagebatch.tryaddmessage). 
    1. Sends the batch of messages to the Service Bus topic using the [ServiceBusSender.SendMessagesAsync](/dotnet/api/azure.messaging.servicebus.servicebussender.sendmessagesasync) method.
    
    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;

    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the sender used to publish messages to the topic
    ServiceBusSender sender;

    // number of messages to be sent to the topic
    const int numOfMessages = 3;

    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.
    //TODO: Replace the "<NAMESPACE-CONNECTION-STRING>" and "<TOPIC-NAME>" placeholders.
    client = new ServiceBusClient("<NAMESPACE-CONNECTION-STRING>");
    sender = client.CreateSender("<TOPIC-NAME>");

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
    ```

    ---

1. Build the project, and ensure that there are no errors. 
1. Run the program and wait for the confirmation message.
    
    ```bash
    A batch of 3 messages has been published to the topic
    ```

    > [!IMPORTANT]
    > In most cases, it will take a minute or two for the role assignment to propagate in Azure. In rare cases, it may take up to **eight minutes**. If you receive authentication errors when you first run your code, wait a few moments and try again.
1. In the Azure portal, follow these steps:
    1. Navigate to your Service Bus namespace. 
    1. On the **Overview** page, in the bottom-middle pane, switch to the **Topics** tab, and select the Service Bus topic. In the following example, it's `mytopic`.
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/select-topic.png" alt-text="Select topic":::
    1. On the **Service Bus Topic** page, In the **Messages** chart in the bottom **Metrics** section, you can see that there are three incoming messages for the topic. If you don't see the value, wait for a few minutes, and refresh the page to see the updated chart. 

        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png" alt-text="Messages sent to the topic" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/sent-messages-essentials.png":::
    4. Select the subscription in the bottom pane. In the following example, it's **S1**. On the **Service Bus Subscription** page, you see the **Active message count** as **3**. The subscription has received the three messages that you sent to the topic, but no receiver has picked them yet. 
    
        :::image type="content" source="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png" alt-text="Messages received at the subscription" lightbox="./media/service-bus-dotnet-how-to-use-topics-subscriptions/subscription-page.png":::
    
## Receive messages from a subscription
In this section, you'll create a .NET console application that receives messages from the subscription to the Service Bus topic. 

> [!NOTE]
> This quick start provides step-by-step instructions to implement a simple scenario of sending a batch of messages to a Service Bus topic and receiving those messages from a subscription of the topic.  For more samples on other and advanced scenarios, see [Service Bus .NET samples on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/servicebus/Azure.Messaging.ServiceBus/samples).

### Create a project for the receiver

1. In the Solution Explorer window, right-click the **ServiceBusTopicQuickStart** solution, point to **Add**, and select **New Project**. 
1. Select **Console application**, and select **Next**. 
1. Enter **SubscriptionReceiver** for the **Project name**, and select **Next**. 
1. On the **Additional information** page, select **Create**. 
1. In the **Solution Explorer** window, right-click **SubscriptionReceiver**, and select **Set as a Startup Project**. 

### Add the NuGet packages to the project


### [Passwordless](#tab/passwordless)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Select **SubscriptionReceiver** for **Default project** drop-down list. 
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package.

    ```powershell
    Install-Package Azure.Messaging.ServiceBus
    ```
1. Run the following command to install the **Azure.Identity** NuGet package.

    ```powershell
    Install-Package Azure.Identity
    ```

### [Connection String](#tab/connection-string)

1. Select **Tools** > **NuGet Package Manager** > **Package Manager Console** from the menu.
1. Run the following command to install the **Azure.Messaging.ServiceBus** NuGet package:

    ```Powershell
    Install-Package Azure.Messaging.ServiceBus
    ```

---

### Add code to receive messages from the subscription

In this section, you'll add code to retrieve messages from the subscription.

1. Replace the existing contents of `Program.cs` with the following properties and methods:


     ## [Passwordless](#tab/passwordless)

    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    using Azure.Identity;

    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the processor that reads and processes messages from the subscription
    ServiceBusProcessor processor;    

    // handle received messages
    async Task MessageHandler(ProcessMessageEventArgs args)
    {
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body} from subscription.");

        // complete the message. messages is deleted from the subscription. 
        await args.CompleteMessageAsync(args.Message);
    }

    // handle any errors when receiving messages
    Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
    ```


     ## [Connection String](#tab/connection-string)

    ```csharp
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;

    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the processor that reads and processes messages from the subscription
    ServiceBusProcessor processor;    

    // handle received messages
    async Task MessageHandler(ProcessMessageEventArgs args)
    {
        // TODO: Replace the <TOPIC-SUBSCRIPTION-NAME> placeholder
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body} from subscription: <TOPIC-SUBSCRIPTION-NAME>");

        // complete the message. messages is deleted from the subscription. 
        await args.CompleteMessageAsync(args.Message);
    }

    // handle any errors when receiving messages
    Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
    ```

    ---
1. Append the following code to the end of `Program.cs`.

     ## [Passwordless](#tab/passwordless)

    * Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the `DefaultAzureCredential` object. `DefaultAzureCredential` will automatically discover and use the credentials of your Visual Studio login to authenticate to Azure Service Bus.
    * Invokes the [CreateProcessor](/dotnet/api/azure.messaging.servicebus.servicebusclient.createprocessor) method on the `ServiceBusClient` object to create a [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object for the specified Service Bus topic. 
    * Specifies handlers for the [ProcessMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processmessageasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processerrorasync) events of the `ServiceBusProcessor` object. 
    * Starts processing messages by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.startprocessingasync) on the `ServiceBusProcessor` object. 
    * When user presses a key to end the processing, invokes the [StopProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.stopprocessingasync) on the `ServiceBusProcessor` object. 
    
    > [!IMPORTANT]
    > Update placeholder values (`<NAMESPACE-NAME>`, `<TOPIC-NAME>`, `<SUBSCRIPTION-NAME>`) in the code snippet with names of your Service Bus namespace, topic, and subscription.

    For more information, see code comments.

    ```csharp
    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.
    //
    // Create the clients that we'll use for sending and processing messages.
    // TODO: Replace the <NAMESPACE-NAME> placeholder
    client = new ServiceBusClient(
        "<NAMESPACE-NAME>.servicebus.windows.net",
        new DefaultAzureCredential());

    // create a processor that we can use to process the messages
    // TODO: Replace the <TOPIC-NAME> and <SUBSCRIPTION-NAME> placeholders
    processor = client.CreateProcessor("<TOPIC-NAME>", "<SUBSCRIPTION-NAME>", new ServiceBusProcessorOptions());

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
    ```

    ## [Connection String](#tab/connection-string)

    > [!IMPORTANT]
    > Update placeholder values (`<NAMESPACE-CONNECTION-STRING>`, `<TOPIC-NAME>`, `<SUBSCRIPTION-NAME>`) in the code snippet with actual values you noted down earlier.

    * Creates a [ServiceBusClient](/dotnet/api/azure.messaging.servicebus.servicebusclient) object using the connection string to the namespace. 
    * Invokes the [CreateProcessor](/dotnet/api/azure.messaging.servicebus.servicebusclient.createprocessor) method on the `ServiceBusClient` object to create a [ServiceBusProcessor](/dotnet/api/azure.messaging.servicebus.servicebusprocessor) object for the specified Service Bus topic. 
    * Specifies handlers for the [ProcessMessageAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processmessageasync) and [ProcessErrorAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.processerrorasync) events of the `ServiceBusProcessor` object. 
    * Starts processing messages by invoking the [StartProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.startprocessingasync) on the `ServiceBusProcessor` object. 
    * When user presses a key to end the processing, invokes the [StopProcessingAsync](/dotnet/api/azure.messaging.servicebus.servicebusprocessor.stopprocessingasync) on the `ServiceBusProcessor` object. 
    
    For more information, see code comments.

    ```csharp
    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.
    //
    // Create the clients that we'll use for sending and processing messages.
    // TODO: Replace the <NAMESPACE-CONNECTION-STRING> placeholder
    client = new ServiceBusClient("<NAMESPACE-CONNECTION-STRING>");

    // create a processor that we can use to process the messages
    // TODO: Replace the <TOPIC-NAME> and <SUBSCRIPTION-NAME> placeholders
    processor = client.CreateProcessor("<TOPIC-NAME>", "<SUBSCRIPTION-NAME>", new ServiceBusProcessorOptions());

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
    ```

    ---

1. Here's what your `Program.cs` should look like:  

    ## [Passwordless](#tab/passwordless)
    
    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    using Azure.Identity;
    
    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the processor that reads and processes messages from the subscription
    ServiceBusProcessor processor;

    // handle received messages
    async Task MessageHandler(ProcessMessageEventArgs args)
    {
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body} from subscription.");

        // complete the message. messages is deleted from the subscription. 
        await args.CompleteMessageAsync(args.Message);
    }

    // handle any errors when receiving messages
    Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
    
    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.
    //
    // Create the clients that we'll use for sending and processing messages.
    // TODO: Replace the <NAMESPACE-NAME> placeholder
    client = new ServiceBusClient(
        "<NAMESPACE-NAME>.servicebus.windows.net",
        new DefaultAzureCredential());

    // create a processor that we can use to process the messages
    // TODO: Replace the <TOPIC-NAME> and <SUBSCRIPTION-NAME> placeholders
    processor = client.CreateProcessor("<TOPIC-NAME>", "<SUBSCRIPTION-NAME>", new ServiceBusProcessorOptions());

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
    ```

    ## [Connection String](#tab/connection-string)

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.Messaging.ServiceBus;
    
    // the client that owns the connection and can be used to create senders and receivers
    ServiceBusClient client;

    // the processor that reads and processes messages from the subscription
    ServiceBusProcessor processor;

    // handle received messages
    async Task MessageHandler(ProcessMessageEventArgs args)
    {
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body} from subscription.");

        // complete the message. messages is deleted from the subscription. 
        await args.CompleteMessageAsync(args.Message);
    }

    // handle any errors when receiving messages
    Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
    
    // The Service Bus client types are safe to cache and use as a singleton for the lifetime
    // of the application, which is best practice when messages are being published or read
    // regularly.
    //
    // Create the clients that we'll use for sending and processing messages.
    // TODO: Replace the <NAMESPACE-CONNECTION-STRING> placeholder
    client = new ServiceBusClient("<NAMESPACE-CONNECTION-STRING>");

    // create a processor that we can use to process the messages
    // TODO: Replace the <TOPIC-NAME> and <SUBSCRIPTION-NAME> placeholders
    processor = client.CreateProcessor("<TOPIC-NAME>", "<SUBSCRIPTION-NAME>", new ServiceBusProcessorOptions());

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
    ```

    ---

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
