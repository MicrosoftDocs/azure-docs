---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 10/15/2020
ms.author: spelluru
ms.custom: "include file"

---

## Prerequisites
If you don't have an [Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Create a Service Bus namespace
Follow instructions in this tutorial: [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](../articles/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md) to do the following tasks:

- Create a **premium** Service Bus namespace. 
- Get the connection string. 
- Create a Service Bus topic.
- Create a subscription to the topic. You will only one subscription in this tutorial, so no need to create subscriptions S2 and S3. 

## Prepare a sample application to send messages
You can use any method to send a message to your Service Bus topic. The sample code at the end of this procedure assumes that you're using Visual Studio 2017.

1. Clone [the GitHub azure-service-bus repository](https://github.com/Azure/azure-service-bus/).
2. In Visual Studio, go to the *\samples\DotNet\Microsoft.ServiceBus.Messaging\ServiceBusEventGridIntegration* folder, and then open the *SBEventGridIntegration.sln* file.
3. Go to the **MessageSender** project, and then select **Program.cs**.
4. Fill in your Service Bus topic name and the connection string you got from the previous step:

    ```csharp
    const string ServiceBusConnectionString = "<SERVICE BUS NAMESPACE - CONNECTION STRING>";
    const string TopicName = "<TOPIC NAME>";
    ```
5. Update the `numberOfMessages` value to **5**. 
5. Build and run the program to send test messages to the Service Bus topic. 

## Send messages to the Service Bus topic
1. Run the .NET C# application, which sends messages to the Service Bus topic. 

    :::image type="content" source="./media/service-bus-event-grid-prerequisites/console-app-output.png" alt-text="Console app output":::
    