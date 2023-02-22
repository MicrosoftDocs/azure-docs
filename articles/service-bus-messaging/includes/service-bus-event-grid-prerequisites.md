---
title: include file
description: include file
services: service-bus-messaging
author: spelluru
ms.service: service-bus-messaging
ms.topic: include
ms.date: 12/08/2022
ms.author: spelluru
ms.custom: "include file"

---

## Prerequisites
If you don't have an [Azure subscription](../../guides/developer/azure-developer-guide.md#understanding-accounts-subscriptions-and-billing), create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Create a Service Bus namespace
Follow instructions in this tutorial: [Quickstart: Use the Azure portal to create a Service Bus topic and subscriptions to the topic](../service-bus-quickstart-topics-subscriptions-portal.md) to do the following tasks:

- Create a **premium** Service Bus namespace. 
- Get the connection string. 
- Create a Service Bus topic.
- Create a subscription to the topic. You need only one subscription in this tutorial, so no need to create subscriptions S2 and S3. 

## Send messages to the Service Bus topic
In this step, you use a sample application to send messages to the Service Bus topic you created in the previous step. 

1. Clone the [GitHub azure-service-bus repository](https://github.com/Azure/azure-service-bus/) or download the zip file and extract files from it. 
2. In Visual Studio, go to the *\samples\DotNet\Azure.Messaging.ServiceBus\ServiceBusEventGridIntegrationV2* folder, and then open the *SBEventGridIntegration.sln* file.
3. In the Solution Explorer window, expand the **MessageSender** project, and select **Program.cs**.
4. Replace `<SERVICE BUS NAMESPACE - CONNECTION STRING>` with the connection string to your Service Bus namespace and `<TOPIC NAME>` with the name of the topic. 

    ```csharp
    const string ServiceBusConnectionString = "<SERVICE BUS NAMESPACE - CONNECTION STRING>";
    const string TopicName = "<TOPIC NAME>";
    ```
5. Build and run the program to send 5 test messages (`const int numberOfMessages = 5;`) to the Service Bus topic. 

    :::image type="content" source="./media/service-bus-event-grid-prerequisites/console-app-output.png" alt-text="Console app output":::
