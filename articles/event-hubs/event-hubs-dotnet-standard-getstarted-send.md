---
title: Send events to Azure Event Hubs using .NET Standard | Microsoft Docs
description: Get started sending events to Event Hubs in .NET Standard
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/16/2018
ms.author: shvija

---

# Get started sending messages to Azure Event Hubs in .NET Standard

> [!NOTE]
> This sample is available on [GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender).

This tutorial shows how to write a .NET Core console application that sends a set of messages to an event hub. You can run the [GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) solution as-is, replacing the `EventHubConnectionString` and `EventHubName` strings with your event hub values. Or you can follow the steps in this tutorial to create your own.

## Prerequisites

* [Microsoft Visual Studio 2015 or 2017](http://www.visualstudio.com). The examples in this tutorial use Visual Studio 2017, but Visual Studio 2015 is also supported.
* [.NET Core Visual Studio 2015 or 2017 tools](http://www.microsoft.com/net/core).
* An Azure subscription.
* [An event hub namespace and an event hub](event-hubs-quickstart-portal.md).

To send messages to an event hub, this tutorial uses Visual Studio to write a C# console application.

## Create an Event Hubs namespace and an event hub

To create a namespace and an event hub, follow the procedure in [this article](event-hubs-quickstart-portal.md), and then proceed with this tutorial.

## Create a console application

Start Visual Studio. From the **File** menu, click **New**, and then click **Project**. Create a .NET Core console application.

![New project][1]

## Add the Event Hubs NuGet package

Add the [`Microsoft.Azure.EventHubs`](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) .NET Standard library NuGet package to your project by following these steps: 

1. Right-click the newly created project and select **Manage NuGet Packages**.
2. Click the **Browse** tab, then search for "Microsoft.Azure.EventHubs" and select the **Microsoft.Azure.EventHubs** package. Click **Install** to complete the installation, then close this dialog box.

## Write some code to send messages to the event hub

1. Add the following `using` statements to the top of the Program.cs file:

    ```csharp
    using Microsoft.Azure.EventHubs;
	using System.Text;
	using System.Threading.Tasks;
    ```

2. Add constants to the `Program` class for the Event Hubs connection string and entity path (individual event hub name). Replace the placeholders in brackets with the proper values that were obtained when creating the event hub. Make sure that the `{Event Hubs connection string}` is the namespace-level connection string, and not the event hub string. 

    ```csharp
    private static EventHubClient eventHubClient;
    private const string EventHubConnectionString = "{Event Hubs connection string}";
    private const string EventHubName = "{Event Hub path/name}";
    ```

3. Add a new method named `MainAsync` to the `Program` class, as follows:

    ```csharp
    private static async Task MainAsync(string[] args)
    {
        // Creates an EventHubsConnectionStringBuilder object from the connection string, and sets the EntityPath.
        // Typically, the connection string should have the entity path in it, but this simple scenario
        // uses the connection string from the namespace.
        var connectionStringBuilder = new EventHubsConnectionStringBuilder(EventHubConnectionString)
        {
            EntityPath = EventHubName
        };

        eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());

        await SendMessagesToEventHub(100);

        await eventHubClient.CloseAsync();

        Console.WriteLine("Press ENTER to exit.");
        Console.ReadLine();
    }
    ```

4. Add a new method named `SendMessagesToEventHub` to the `Program` class, as follows:

    ```csharp
    // Creates an event hub client and sends 100 messages to the event hub.
    private static async Task SendMessagesToEventHub(int numMessagesToSend)
    {
        for (var i = 0; i < numMessagesToSend; i++)
        {
            try
            {
                var message = $"Message {i}";
                Console.WriteLine($"Sending message: {message}");
                await eventHubClient.SendAsync(new EventData(Encoding.UTF8.GetBytes(message)));
            }
            catch (Exception exception)
            {
                Console.WriteLine($"{DateTime.Now} > Exception: {exception.Message}");
            }

            await Task.Delay(10);
        }

        Console.WriteLine($"{numMessagesToSend} messages sent.");
    }
    ```

5. Add the following code to the `Main` method in the `Program` class:

    ```csharp
    MainAsync(args).GetAwaiter().GetResult();
    ```

   Here is what your Program.cs should look like.

	```csharp
	namespace SampleSender
	{
	    using System;
	    using System.Text;
	    using System.Threading.Tasks;
	    using Microsoft.Azure.EventHubs;

	    public class Program
	    {
	        private static EventHubClient eventHubClient;
	        private const string EventHubConnectionString = "{Event Hubs connection string}";
	        private const string EventHubName = "{Event Hub path/name}";

	        public static void Main(string[] args)
	        {
	            MainAsync(args).GetAwaiter().GetResult();
	        }

	        private static async Task MainAsync(string[] args)
	        {
	            // Creates an EventHubsConnectionStringBuilder object from the connection string, and sets the EntityPath.
	            // Typically, the connection string should have the entity path in it, but for the sake of this simple scenario
	            // we are using the connection string from the namespace.
	            var connectionStringBuilder = new EventHubsConnectionStringBuilder(EventHubConnectionString)
	            {
	                EntityPath = EventHubName
	            };

	            eventHubClient = EventHubClient.CreateFromConnectionString(connectionStringBuilder.ToString());

	            await SendMessagesToEventHub(100);

	            await eventHubClient.CloseAsync();

	            Console.WriteLine("Press ENTER to exit.");
	            Console.ReadLine();
	        }

	        // Creates an event hub client and sends 100 messages to the event hub.
	        private static async Task SendMessagesToEventHub(int numMessagesToSend)
	        {
	            for (var i = 0; i < numMessagesToSend; i++)
	            {
	                try
	                {
	                    var message = $"Message {i}";
	                    Console.WriteLine($"Sending message: {message}");
	                    await eventHubClient.SendAsync(new EventData(Encoding.UTF8.GetBytes(message)));
	                }
	                catch (Exception exception)
	                {
	                    Console.WriteLine($"{DateTime.Now} > Exception: {exception.Message}");
	                }

	                await Task.Delay(10);
	            }

	            Console.WriteLine($"{numMessagesToSend} messages sent.");
	        }
	    }
	}
	```

6. Run the program, and ensure that there are no errors.

Congratulations! You have now sent messages to an event hub.

## Next steps
You can learn more about Event Hubs at the following links:

* [Receive events from Event Hubs](event-hubs-dotnet-standard-getstarted-receive-eph.md)
* [Event Hubs overview](event-hubs-what-is-event-hubs.md)
* [Create an event hub](event-hubs-create.md)
* [Event Hubs FAQ](event-hubs-faq.md)

[1]: ./media/event-hubs-dotnet-standard-getstarted-send/netcoresnd.png
