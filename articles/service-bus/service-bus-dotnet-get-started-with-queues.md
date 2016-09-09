<properties
    pageTitle="Get started with Service Bus queues | Microsoft Azure"
    description="How to write a C# console application for Service Bus messaging"
    services="service-bus"
    documentationCenter=".net"
    authors="jtaubensee"
    manager="timlt"
    editor=""/>

<tags
    ms.service="service-bus"
    ms.devlang="tbd"
    ms.topic="get-started-article"
    ms.tgt_pltfrm="dotnet"
    ms.workload="na"
    ms.date="06/07/2016"
    ms.author="jotaub;sethm"/>

# Get started with Service Bus Queues

[AZURE.INCLUDE [service-bus-selector-queues](../../includes/service-bus-selector-queues.md)]

## What will be accomplished

In this tutorial, we will complete the following:

1. Create a Service Bus namespace, using the Azure portal.

2. Create a Service Bus Messaging queue, using the Azure portal.

3. Write a console application to send a message.

4. Write a console application to receive messages.

## Prerequisites

1. [Visual Studio 2013 or Visual Studio 2015](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2015.

2. An Azure subscription.

[AZURE.INCLUDE [create-account-note](../../includes/create-account-note.md)]

## 1. Create a namespace using the Azure portal

If you already have a Service Bus namespace created, jump to the [Create a queue using the Azure portal](#2-create-a-queue-using-the-azure-portal) section.

[AZURE.INCLUDE [service-bus-create-namespace-portal](../../includes/service-bus-create-namespace-portal.md)]

## 2. Create a queue using the Azure portal

If you already have a Service Bus queue created, jump to the [Send messages to the queue](#3-send-messages-to-the-queue) section.

[AZURE.INCLUDE [service-bus-create-queue-portal](../../includes/service-bus-create-queue-portal.md)]

## 3. Send messages to the queue

In order to send messages to the queue, we will write a C# console application using Visual Studio.

### Create a console application

1. Launch Visual Studio and create a new Console application.

### Add the Service Bus NuGet package

1. Right click on the newly created project and select **Manage NuGet Packages**.

2. Click the **Browse** tab, then search for “Microsoft Azure Service Bus” and select the **Microsoft Azure Service Bus** item. Click **Install** to complete the installation, then close this dialog box.

    ![Select a NuGet package][nuget-pkg]

### Write some code to send a message to the queue

1. Add the following using statement to the top of the Program.cs file.

    ```
    using Microsoft.ServiceBus.Messaging;
    ```
    
2. Add the following code to the `Main` method, set the **connectionString** variable as the connection string that was obtained when creating the namespace, and set **queueName** as the queue name that used when creating the queue.

    ```
    var connectionString = "<Your connection string>";
    var queueName = "<Your queue name>";
  
    var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
    var message = new BrokeredMessage("This is a test message!");
    client.Send(message);
    ```

    Here is what your Program.cs should look like.

    ```
    using System;
    using Microsoft.ServiceBus.Messaging;

    namespace GettingStartedWithQueues
    {
        class Program
        {
            static void Main(string[] args)
            {
                var connectionString = "<Your connection string>";
                var queueName = "<Your queue name>";

                var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
                var message = new BrokeredMessage("This is a test message!");

                client.Send(message);
            }
        }
    }
    ```
  
3. Run the program, and check the Azure classic portal. Notice that the **Queue Length** value should now be 1.
    
      ![Queue length][queue-length-send]
    
## 4. Receive messages from the queue

1. Create a new console application and add a reference to the Service Bus NuGet package, similar to the sending application above.

2. Add the following `using` statement to the top of the Program.cs file.
  
    ```
    using Microsoft.ServiceBus.Messaging;
    ```
  
3. Add the following code to the `Main` method, set the **connectionString** variable as the connection string that was obtained when creating the namespace, and set **queueName** as the queue name that you used when creating the queue.

    ```
    var connectionString = "";
    var queueName = "samplequeue";
  
    var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
  
    client.OnMessage(message =>
    {
      Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
      Console.WriteLine(String.Format("Message id: {0}", message.MessageId));
    });
  
    Console.ReadLine();
    ```

	Here is what your Program.cs file should look like:

    ```
    using System;
    using Microsoft.ServiceBus.Messaging;
  
    namespace GettingStartedWithQueues
    {
      class Program
      {
        static void Main(string[] args)
        {
          var connectionString = "";
          var queueName = "samplequeue";
  
          var client = QueueClient.CreateFromConnectionString(connectionString, queueName);
  
          client.OnMessage(message =>
          {
            Console.WriteLine(String.Format("Message body: {0}", message.GetBody<String>()));
            Console.WriteLine(String.Format("Message id: {0}", message.MessageId));
          });
  
          Console.ReadLine();
        }
      }
    }
    ```
  
4. Run the program, and check the portal. Notice that the **Queue Length** value should now be 0.

    ![Queue length][queue-length-receive]
  
Congratulations! You have now created a queue, sent a message, and received a message.

## Next steps

Check out our [GitHub repository with samples](https://github.com/Azure-Samples/azure-servicebus-messaging-samples) that demonstrate some of the more advanced features of Azure Service Bus messaging.

<!--Image references-->

[nuget-pkg]: ./media/service-bus-dotnet-get-started-with-queues/nuget-package.png
[queue-length-send]: ./media/service-bus-dotnet-get-started-with-queues/queue-length-send.png
[queue-length-receive]: ./media/service-bus-dotnet-get-started-with-queues/queue-length-receive.png


<!--Reference style links - using these makes the source content way more readable than using inline links-->

[github-samples]: https://github.com/Azure-Samples/azure-servicebus-messaging-samples