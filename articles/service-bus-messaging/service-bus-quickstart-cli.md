---
title: Azure Quickstart - use Azure CLI to send and receive messages from Azure Service Bus | Microsoft Docs
description: Quickly learn to send and receive Service Bus messages
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

# Send and receive messages from a queue using Azure CLI

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario might involve decoupling two or more applications from each other, and transferring order fulfillment information between those two applications. For example, a retail company might send their point of sale (POS) data to a back office or regional distribution center for replenishment and inventory updates.  

![service-bus-flow][service-bus-flow]

This quickstart describes how to send and receive messages with Service Bus, using Azure CLI to create a messaging namespace and a queue within that namespace, and obtain the authorization credentials on that namespace.

If you do not have an Azure subscription, create a [free account][] before you begin.

## Launch Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly from within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click **Cloud Shell** on the upper right menu in the Azure portal.

![][1]

This option launches an interactive shell that you can use to run the steps in this article.

![][2]

If you choose to install and use the CLI locally, this article requires that you run the latest version of Azure CLI (2.0.14 or later). To find the version, run the `cli az –version` command. If you need to install or upgrade, see [Install Azure CLI 2.0][].

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. Create a new resource group with [az group create][] command.

The following example creates a resource group named **serviceBusResourceGroup** in the **East US** region

```azurecli-interactive
az group create --name serviceBusResourceGroup --location eastus
```

## Create a Service Bus namespace

A Service Bus messaging namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more queues, topics, and subscriptions. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```azurecli-interactive
az servicebus namespace create --name <namespace_name> -location eastus
```

## Create a queue

To create a Service Bus queue, specify the namespace under which you want it created. The following example shows how to create a queue:

```azurecli-interactive
az servicebus entity create --name <queue_name> -location eastus
```

## Get the connection string

You need the namespace-level connection string in order to perform operations on the messaging entities within that namespace. To obtain the connection string, run the following command:

```azurecli-interactive
az servicebus TBD
```

Copy and paste the **PrimaryConnectionString** value to a temporary location, such as Notepad, to use later.

## Send and receive messages

After the namespace and queue are provisioned, and you have the necessary credentials, you are ready to send and receive messages.

1. Navigate to [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient), and load the **BasicSendReceiveUsingQueueClient.csproj** file into Visual Studio.
2. Double-click **Program.cs** to open it in the Visual Studio editor.
3. Replace the value of the `ServiceBusConnectionString` constant with the full connection string you obtained in the [previous section](#get-the-connection-string).
4. Replace the value of `QueueName` with the name of the queue you [created previously](#create-a-queue).
5. Build and run the program, and observe 10 messages being sent to the queue, and received in parallel from the queue.

## Clean up deployment

Run the following command to remove the resource group, namespace, and all related resources:

```azurecli-interactive
TBD
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages, continue with the following articles:

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name

[1]: ./media/service-bus-quickstart-cli/cli1.png
[2]: ./media/service-bus-quickstart-cli/cli2.png
[service-bus-flow]: ./media/service-bus-quickstart-cli/service-bus-flow.png