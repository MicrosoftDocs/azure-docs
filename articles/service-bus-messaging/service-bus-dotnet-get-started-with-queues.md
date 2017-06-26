---
title: Get started with Azure Service Bus queues | Microsoft Docs
description: Write a C# console application that uses Service Bus messaging queues.
services: service-bus-messaging
documentationcenter: .net
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: 68a34c00-5600-43f6-bbcc-fea599d500da
ms.service: service-bus-messaging
ms.devlang: tbd
ms.topic: hero-article
ms.tgt_pltfrm: dotnet
ms.workload: na
ms.date: 06/26/2017
ms.author: sethm

---
# Get started with Service Bus queues
[!INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

## What will be accomplished
In this tutorial, we will complete the following:

1. Create a Service Bus namespace, using the Azure portal.
2. Create a Service Bus Messaging queue, using the Azure portal.
3. Write a console application to send a message.
4. Write a console application to receive the messages sent in the previous step.

## Prerequisites
1. [Visual Studio 2015 or higher](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2017.
2. An Azure subscription.

[!INCLUDE [create-account-note](../../includes/create-account-note.md)]

## 1. Create a namespace using the Azure portal
If you have already created a Service Bus Messaging namespace, jump to the [Create a queue using the Azure portal](#2-create-a-queue-using-the-azure-portal) section.

[!INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## 2. Create a queue using the Azure portal
If you have already created a Service Bus queue, jump to the [Send messages to the queue](#3-send-messages-to-the-queue) section.

[!INCLUDE [service-bus-create-queue-portal](../../includes/service-bus-create-queue-portal.md)]

## 3. Send messages to the queue
To send messages to the queue, we will write a C# console application using Visual Studio.

### Create a console application

Launch Visual Studio and create a new **Console app (.NET Framework)** project.

### Add the Service Bus NuGet package
1. Right-click the newly created project and select **Manage NuGet Packages**.
2. Click the **Browse** tab, search for **Microsoft Azure Service Bus**, and then select the **WindowsAzure.ServiceBus** item. Click **Install** to complete the installation, then close this dialog box.
   
    ![Select a NuGet package][nuget-pkg]

### Write some code to send a message to the queue
1. Add the following `using` statement to the top of the Program.cs file.
   
    ```csharp
    using Microsoft.ServiceBus.Messaging;
    ```
2. Add the following code to the `Main` method. Set the `connectionString` variable to the connection string that you obtained when creating the namespace, and set `queueName` to the queue name that you used when creating the queue.
   
    ```csharp
    var connectionString = "<your connection string>";
    var queueName = "<your queue name>";
   
    var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
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

    namespace qsend
    {
        class Program
        {
            static void Main(string[] args)
            {
                var connectionString = "Endpoint=sb://<your namespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<your key>";
                var queueName = "<your queue name>";

                var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
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
3. Run the program, and check the Azure portal: click the name of your queue in the namespace **Overview** blade. The queue **Essentials** blade is displayed. Notice that the **Current** value, indicating the size of the queue, should now be 0.2. Each time you run the sender application without retrieving the messages, this value increases.
   
      ![Message size][queue-message]

## 4. Receive messages from the queue

1. To receive the messages you just sent, create a new console application and add a reference to the Service Bus NuGet package, similar to the previous sender application.
2. Add the following `using` statement to the top of the Program.cs file.
   
    ```csharp
    using Microsoft.ServiceBus.Messaging;
    ```
3. Add the following code to the `Main` method. Set the `connectionString` variable to the connection string that was obtained when creating the namespace, and set `queueName` to the queue name that you used when creating the queue.
   
    ```csharp
    var connectionString = "<your connection string";
    var queueName = "<your queue name>";
   
    var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
   
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
   
    namespace GettingStartedWithQueues
    {
      class Program
      {
        static void Main(string[] args)
        {
          var connectionString = "Endpoint=sb://<your namespace>.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=<your key>";;
          var queueName = "<your queue name>";
   
          var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
   
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
4. Run the program, and check the portal again. Notice that the **Current** value should now be 0.
   
    ![Queue length][queue-message-receive]

Congratulations! You have now created a queue, sent a message, and received a message.

## Next steps

Check out our [GitHub repository with samples](https://github.com/Azure/azure-service-bus/tree/master/samples) that demonstrate some of the more advanced features of Service Bus messaging.

<!--Image references-->

[nuget-pkg]: ./media/service-bus-dotnet-get-started-with-queues/nuget-package.png
[queue-message]: ./media/service-bus-dotnet-get-started-with-queues/queue-message.png
[queue-message-receive]: ./media/service-bus-dotnet-get-started-with-queues/queue-message-receive.png
[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples
