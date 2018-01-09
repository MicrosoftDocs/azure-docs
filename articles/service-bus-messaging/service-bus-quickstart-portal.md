---
title: Azure Quickstart - use Azure portal to send and receive messages from Azure Service Bus | Microsoft Docs
description: Quickly learn to send and receive Service Bus messages using Azure portal
services: service-bus-messaging
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/09/2018
ms.author: sethm

---

# Send and receive messages from a queue

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario might involve decoupling two or more applications from each other, and transferring order fulfillment information between those two applications. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates.  

![service-bus-flow][service-bus-flow]

This quickstart describes how to send and receive messages with Service Bus, using the Azure portal to create a messaging namespace and a queue within that namespace, and obtain the authorization credentials on that namespace.

If you do not have an Azure subscription, create a [free account][] before you begin.

## Create a Service Bus messaging namespace

A Service Bus messaging namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more queues, topics, and subscriptions. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

1. Log on to the [Azure portal][Azure portal].
2. In the left navigation pane of the portal, click **+ Create a resource**, then click **Enterprise Integration**, and then click **Service Bus**.
3. In the **Create namespace** dialog, enter a namespace name. The system immediately checks to see if the name is available.
4. After making sure the namespace name is available, choose the pricing tier (Basic, Standard, or Premium).
5. In the **Subscription** field, choose an Azure subscription in which to create the namespace.
6. In the **Resource group** field, choose an existing resource group in which the namespace will live, or create a new one.      
7. In **Location**, choose the country or region in which your namespace should be hosted.
   ![Create namespace][create-namespace]
8. Click **Create**. The system now creates your namespace and enables it. You might have to wait several minutes as the system provisions resources for your account.

### Obtain the management credentials

Creating a new namespace automatically generates an initial Shared Access Signature (SAS) rule with an associated pair of primary and secondary keys that each grant full control over all aspects of the namespace. See [Service Bus authentication and authorization](service-bus-authentication-and-authorization.md) for information about how to create further rules with more constrained rights for regular senders and receivers. To copy the initial rule, follow these steps: 

1.  Click **All resources**, then click the newly created namespace name.
2. In the namespace window, click **Shared access policies**.
3. In the **Shared access policies** screen, click **RootManageSharedAccessKey**.
   
    ![connection-info][connection-info]
4. In the **Policy: RootManageSharedAccessKey** window, click the copy button next to **Connection string–primary key**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location. 
    ![connection-string][connection-string]
5. Repeat the previous step, copying and pasting the value of **Primary key** to a temporary location for later use.

## Create a queue

To create a Service Bus queue, specify the namespace under which you want it created. The following example shows how to create a queue on the portal:

1. In the left navigation pane of the portal, click **Service Bus** (if you don't see **Service Bus**, click **More services**).
2. Click the namespace in which you would like to create the queue. In this case, it is **sbnstest1**.
3. In the namespace window, click **Queues**, then in the **Queues** window, click **+ Queue**.
   
    ![Select Queues][createqueue2]
4. Enter the queue **Name** and leave the other values with their defaults.
5. At the bottom of the window, click **Create**.

## Send and receive messages

After the namespace and queue are provisioned, and you have the necessary credentials, you are ready to send and receive messages.

1. Navigate to [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient), and load the **BasicSendReceiveUsingQueueClient.csproj** file into Visual Studio.
2. Double-click **Program.cs** to open it in the Visual Studio editor.
3. Replace the value of the `ServiceBusConnectionString` constant with the full connection string you obtained in the [previous section](#obtain-the-management-credentials).
4. Replace the value of `QueueName` with the name of the queue you [created previously](#create-a-queue).
5. Build and run the program, and observe 10 messages being sent to the queue, and received in parallel from the queue.

## Clean up resources

When no longer needed, delete the namespace and queue. To do so, select these resources on the portal and click **Delete**. 

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages, continue with the following articles:

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[Azure portal]: https://portal.azure.com/

[connection-info]: ./media/service-bus-quickstart-portal/connection-info.png
[connection-string]: ./media/service-bus-quickstart-portal/connection-string.png
[createqueue2]: ./media/service-bus-quickstart-portal/create-queue2.png
[service-bus-flow]: ./media/service-bus-quickstart-portal/service-bus-flow.png
[create-namespace]: ./media/service-bus-quickstart-portal/create-namespace.png