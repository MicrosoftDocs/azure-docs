---
title: Send events to Azure Event Hubs using the .NET Framework | Microsoft Docs
description: Get started sending events to Event Hubs using the .NET Framework
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: c4974bd3-2a79-48a1-aa3b-8ee2d6655b28
ms.service: event-hubs
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/03/2018
ms.author: shvija

---
# Send events to Azure Event Hubs using the .NET Framework

Event Hubs is a service that processes large amounts of event data (telemetry) from connected devices and applications. After you collect data into Event Hubs, you can store the data using a storage cluster or transform it using a real-time analytics provider. This large-scale event collection and processing capability is a key component of modern application architectures including the Internet of Things (IoT).

This tutorial shows how to use the [Azure portal](https://portal.azure.com) to create an event hub. It also shows how to send events to an event hub using a console application written in C# using the .NET Framework. To receive events using the .NET Framework, see the [Receive events using the .NET Framework](event-hubs-dotnet-framework-getstarted-receive-eph.md) article, or click the appropriate receiving language in the left-hand table of contents.

To complete this tutorial, you need the following prerequisites:

* [Microsoft Visual Studio 2017 or higher](http://visualstudio.com).
* An active Azure account. If you don't have one, you can create a free account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/free/).

## Create an Event Hubs namespace and an event hub

The first step is to use the [Azure portal](https://portal.azure.com) to create a namespace of type Event Hubs, and obtain the management credentials your application needs to communicate with the event hub. To create a namespace and event hub, follow the procedure in [this article](event-hubs-create.md), then proceed with the following steps in this tutorial.

## Create a sender console application

In this section, you write a Windows console app that sends events to your event hub.

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console Application** project template. Name the project **Sender**.
   
    ![](./media/event-hubs-dotnet-framework-getstarted-send/create-sender-csharp1.png)
2. In Solution Explorer, right-click the **Sender** project, and then click **Manage NuGet Packages for Solution**. 
3. Click the **Browse** tab, then search for `WindowsAzure.ServiceBus`. Click **Install**, and accept the terms of use. 
   
    ![](./media/event-hubs-dotnet-framework-getstarted-send/create-sender-csharp2.png)
   
    Visual Studio downloads, installs, and adds a reference to the [Azure Service Bus library NuGet package](https://www.nuget.org/packages/WindowsAzure.ServiceBus).
4. Add the following `using` statements at the top of the **Program.cs** file:
   
  ```csharp
  using System.Threading;
  using Microsoft.ServiceBus.Messaging;
  ```
5. Add the following fields to the **Program** class, substituting the placeholder values with the name of the event hub you created in the previous section, and the namespace-level connection string you saved previously.
   
  ```csharp
  static string eventHubName = "Your Event Hub name";
  static string connectionString = "namespace connection string";
  ```
6. Add the following method to the **Program** class:
   
  ```csharp
  static void SendingRandomMessages()
  {
      var eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, eventHubName);
      while (true)
      {
          try
          {
              var message = Guid.NewGuid().ToString();
              Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, message);
              eventHubClient.Send(new EventData(Encoding.UTF8.GetBytes(message)));
          }
          catch (Exception exception)
          {
              Console.ForegroundColor = ConsoleColor.Red;
              Console.WriteLine("{0} > Exception: {1}", DateTime.Now, exception.Message);
              Console.ResetColor();
          }
   
          Thread.Sleep(200);
      }
  }
  ```
   
  This method continuously sends events to your event hub with a 200-ms delay.
7. Finally, add the following lines to the **Main** method:
   
  ```csharp
  Console.WriteLine("Press Ctrl-C to stop the sender process");
  Console.WriteLine("Press Enter to start now");
  Console.ReadLine();
  SendingRandomMessages();
  ```
8. Run the program, and ensure that there are no errors.
  
Congratulations! You have now sent messages to an event hub.

## Next steps

Now that you've built a working application that creates an event hub and sends data, you can move on to the following scenarios:

* [Receive events using the Event Processor Host](event-hubs-dotnet-framework-getstarted-receive-eph.md)
* [Event Processor Host reference](/dotnet/api/microsoft.servicebus.messaging.eventprocessorhost)
* [Event Hubs overview](event-hubs-what-is-event-hubs.md)

<!-- Images. -->
[19]: ./media/event-hubs-csharp-ephcs-getstarted/create-eh-proj1.png
[20]: ./media/event-hubs-csharp-ephcs-getstarted/create-eh-proj2.png
[21]: ./media/event-hubs-csharp-ephcs-getstarted/run-csharp-ephcs1.png
[22]: ./media/event-hubs-csharp-ephcs-getstarted/run-csharp-ephcs2.png

