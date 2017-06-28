---
title: Get started with Azure Service Bus topics and subscriptions | Microsoft Docs
description: Write a C# console application that uses Service Bus messaging topics and subscriptions.
services: service-bus-messaging
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: hero-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 06/30/2017
ms.author: sethm

---
# Get started with Service Bus topics

[!INCLUDE [service-bus-selector-topics](../../includes/service-bus-selector-topics.md)]

## What will be accomplished

This tutorial covers the following steps:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus topic, using the Azure portal.
3. Create a Service Bus subscription to that topic, using the Azure portal.
4. Write a console application to send a message to the topic.
5. Write a console application to receive that message from the subscription.

## Prerequisites

1. [Visual Studio 2015 or higher](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2017.
2. An Azure subscription.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## 1. Create a namespace using the Azure portal

If you have already created a Service Bus Messaging namespace, jump to the [Create a topic using the Azure portal](#2-create-a-topic-using-the-azure-portal) section.

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## 2. Create a topic using the Azure portal

1. Log on to the [Azure portal][azure-portal].
2. In the left navigation pane of the portal, click **Service Bus** (if you don't see **Service Bus**, click **More services**).
3. Click the namespace in which you would like to create the topic. In this case, it is **nstest1**.
   
    ![Create a queue][createqueue1]
4. In the **Service Bus namespace** blade, click **Topics**, then click **Add topic**.
   
    ![Select Queues][createqueue2]
5. Enter a name for the topic, and uncheck the **Enable partitioning** option. Leave the other options with their default values.
   
    ![Select New][createqueue3]
6. At the bottom of the blade, click **Create**.

## 3. Create a subscription to the topic

1. In the portal **All resources** pane, click the namespace you created in step 1, then click name of the topic you created in step 2.
2. A the top of the overview pane, click the plus sign next to **Subscription** to add a subscription to this topic.
3. Enter a name for the subscription. Leave the other options with their default values.

## 4. Send messages to the topic

To send messages to the topic, we write a C# console application using Visual Studio.

### Create a console application

Launch Visual Studio and create a new **Console app (.NET Framework)** project.

### Add the Service Bus NuGet package

1. Right-click the newly created project and select **Manage NuGet Packages**.
2. Click the **Browse** tab, search for **Microsoft Azure Service Bus**, and then select the **WindowsAzure.ServiceBus** item. Click **Install** to complete the installation, then close this dialog box.
   
    ![Select a NuGet package][nuget-pkg]

### Write some code to send a message to the topic

1. Add the following `using` statement to the top of the Program.cs file.
   
    ```csharp
    using Microsoft.ServiceBus.Messaging;
    ```
2. Add the following code to the `Main` method. Set the `connectionString` variable to the connection string that you obtained when creating the namespace, and set `topicName` to the name that you used when creating the topic.
   
    ```csharp
    var connectionString = "<your connection string>";
    var topicName = "<your topic name>";
   
    var client = TopicClient.CreateFromConnectionString(connectionString, topicName);
    var message = new BrokeredMessage("This is a test message!");

    Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
    Console.WriteLine(String.Format("Message id: {0}", message.MessageId));

    client.Send(message);

    Console.WriteLine("Message successfully sent! Press ENTER to exit program");
    Console.ReadLine();
    ```
   
    Here is what your Program.cs file should look like.
   
    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.ServiceBus.Messaging;

    namespace tsend
    {
        class Program
        {
            static void Main(string[] args)
            {
                var connectionString = "Endpoint=sb://<your namespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<your key>";
                var topicName = "<your topic name>";

                var client = TopicClient.CreateFromConnectionString(connectionString, topicName);
                var message = new BrokeredMessage("This is a test message!");

                Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
                Console.WriteLine(String.Format("Message id: {0}", message.MessageId));

                client.Send(message);

                Console.WriteLine("Message successfully sent! Press ENTER to exit program");
                Console.ReadLine();
            }
        }
    }
    ```
3. Run the program, and check the Azure portal: click the name of your topic in the namespace **Overview** blade. The topic **Essentials** blade is displayed. In the subscription(s) listed near the bottom of the blade, notice that the **Message Count** value for each subscription should now be 1. Each time you run the sender application without retrieving the messages, this value increases by 1. Also note that the current size of the topic increments each time the app adds a message to the topic/subscription.
   
      ![Message size][queue-message]

## 5. Receive messages from the subscription

1. To receive the message you just sent, create a new console application and add a reference to the Service Bus NuGet package, similar to the previous sender application.
2. Add the following `using` statement to the top of the Program.cs file.
   
    ```csharp
    using Microsoft.ServiceBus.Messaging;
    ```
3. Add the following code to the `Main` method. Set the `connectionString` variable to the connection string you obtained when creating the namespace, and set `topicName` to the name that you used when creating the topic.
   
    ```csharp
    var connectionString = "<your connection string>";
    var topicName = "<your topic name>";
   
    var client = SubscriptionClient.CreateFromConnectionString(connectionString, topicName, "<your subscription name>");
   
    client.OnMessage(message =>
    {
      Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
      Console.WriteLine(String.Format("Message id: {0}", message.MessageId));
    });
   
    Console.WriteLine("Press ENTER to exit program");
    Console.ReadLine();
    ```
   
    Here is what your Program.cs file should look like:
   
    ```csharp
    using System;
    using Microsoft.ServiceBus.Messaging;
   
    namespace GettingStartedWithTopics
    {
      class Program
      {
        static void Main(string[] args)
        {
          var connectionString = "Endpoint=sb://<your namespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<your key>";;
          var topicName = "<your topic name>";
   
          var client = SubscriptionClient.CreateFromConnectionString(connectionString, topicName, "<your subscription name>");
   
          client.OnMessage(message =>
          {
            Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
            Console.WriteLine(String.Format("Message id: {0}", message.MessageId));
          });

          Console.WriteLine("Press ENTER to exit program");   
          Console.ReadLine();
        }
      }
    }
    ```
4. Run the program, and check the portal again. Notice that the **Message Count** and **Current** values are now 0.
   
    ![Queue length][queue-message-receive]

Congratulations! You have now created a topic and subscription, sent a message, and received that message.

## Next steps

Check out our [GitHub repository with samples](https://github.com/Azure/azure-service-bus/tree/master/samples) that demonstrate some of the more advanced features of Service Bus messaging.

<!--Image references-->

[nuget-pkg]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/nuget-package.png
[queue-message]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/topic-message.png
[queue-message-receive]: ./media/service-bus-dotnet-how-to-use-topics-subscriptions/topic-message-receive.png
[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples
