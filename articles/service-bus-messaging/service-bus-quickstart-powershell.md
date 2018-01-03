---
title: Azure Quickstart - use PowerShell to create an Azure Service Bus namespace and queue | Microsoft Docs
description: Quickly learn to create a Service Bus messaging namespace with a queue using PowerShell
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
ms.date: 01/03/2018
ms.author: sethm

---

# Create Service Bus namespace and queue using PowerShell

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. This article describes how to use PowerShell to create a Service Bus messaging namespace and a queue within that namespace, and how to obtain the authorization credentials on that namespace. Once these entities are provisioned, you can start sending and receiving messages from Service Bus.

If you do not have an Azure subscription, create a [free account][] before you begin.

This quickstart requires the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

## Log in to Azure

Log in to your Azure subscription with the **Login-AzureRmAccount** cmdlet and follow the on-screen directions:

```powershell
Login-AzureRmAccount
```

## Install Service Bus PowerShell module

First, install the current version of the Service Bus PowerShell module, as follows:

```powershell
Install-Module AzureRM.ServiceBus
```

## Set the current Azure subscription

Decide which Azure subscription you want to use, then set the current Azure subscription context by running the following command:

```powershell
Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
```

You can optionally check to see that you've set the correct context by running the following command:

```powershell
Get-AzureRmContext
``` 

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group.

Create a new resource group by using the **New-AzureRmResourceGroup** cmdlet. For example:

```powershell
New-AzureRmResourceGroup –Name <resource_group_name> –Location westus2
```

## Create a Service Bus namespace

A Service Bus messaging namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more queues, topics, and subscriptions. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```powershell
New-AzureRmServiceBusNamespace -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Location westus2
```

## Create a queue

To create a Service Bus queue, specify the namespace under which you want it created. The following example shows how to create a queue with [partitioning enabled](service-bus-partitioning.md):

```powershell
New-AzureRmServiceBusQueue -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Name <queue_name> -EnablePartitioning $True
```

## Get the connection string

You need the namespace-level connection string in order to perform operations on the messaging entities within that namespace. To obtain the connection string, run the following cmdlet:

```powershell
Get-AzureRmServiceBusKey -ResourceGroupName <resource_group_name> -Namespace <namespace_name> -Name RootManageSharedAccessKey
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

Run the following command to remove the resource group, namespace, storage account, and all related resources

```powershell
Remove-AzureRmResourceGroup -Name eventhubsResourceGroup
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages, continue with the following articles:

* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* [Service Bus queues, topics, and subscriptions](service-bus-queues-topics-subscriptions.md)
* [Get started with Service Bus queues](service-bus-dotnet-get-started-with-queues.md)
* [How to use Service Bus topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
