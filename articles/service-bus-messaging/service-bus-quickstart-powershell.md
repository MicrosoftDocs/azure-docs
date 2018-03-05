---
title: Azure quickstart - Send and receive messages to and from Azure Service Bus | Microsoft Docs
description: Learn to send and receive Service Bus messages using PowerShell and the .NET Standard client
services: service-bus-messaging
documentationcenter: ''
author: ChristianWolf42
manager: timlt
editor: ''

ms.assetid: ''
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/02/2018
ms.author: chwolf;sethm

---
# Send and receive messages using PowerShell

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. Such scenarios might involve scheduling multiple batch jobs in another application or services, or triggering order fulfillment. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. In this scenario, the workflow sends to and receives messages from a Service Bus queue.

![queue](./media/service-bus-quickstart-powershell/quick-start-queue.png)

This quickstart describes how to send and receive messages to and from a Service Bus queue using PowerShell to first create a messaging namespace and a queue within that namespace. The procedure also obtains the authorization credentials on that namespace. Then the .NET Standard client is used to send and receive messages from this queue.

If you do not have an Azure subscription, create a [free account][] before you begin.

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Log in to Azure

Log in to your Azure subscription with the **Login-AzureRmAccount** cmdlet and follow the on-screen directions.

```azurepowershell-interactive
Login-AzureRmAccount
```

## Check subscription context

Optionally, you can use these commands to change to the current subscription or to see the subscription you currently use:

```azurepowershell-interactive
Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
Get-AzureRmContext
```

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group.

You create a new resource group with the **[New-AzureRmResourceGroup][]** cmdlet. The following example creates a resource group named `ServiceBusResourceGroup` in the **East US** region:

```azurepowershell-interactive
New-AzureRmResourceGroup -Name ServiceBusResourceGroup -Location eastus
```

## Create a messaging namespace

A Service Bus messaging namespace provides a unique scoping container for a group of Service Bus objects. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```azurepowershell-interactive
New-AzureRmServiceBusNamespace -ResourceGroupName ServiceBusResourceGroup -NamespaceName <namespace_name> -Location eastus
```

## Create a queue

To create a queue, issue the following command. Specify the namespace in which you want to create it, and replace `<queue_name>` with a unique name for the queue, as in the following example:

```azurepowershell-interactive
New-AzureRmServiceBusQueue -ResourceGroupName ServiceBusResourceGroup -NamespaceName <namespace_name> -Name <queue_name> -EnablePartitioning $False
```

## Get credentials

To obtain the connection string, which contains the credentials you need to connect to the queue, run the following cmdlet:

```azurepowershell-interactive
Get-AzureRmServiceBusKey -ResourceGroupName ServiceBusResourceGroup -Namespace <namespace_name> -Name RootManageSharedAccessKey
```

Copy and paste the **PrimaryConnectionString** and the **queue_name** you selected to a temporary location, such as Notepad. You will need it in the next step.

## Send and receive messages

After the namespace and queue are created, and you have the necessary credentials, you are ready to send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient).

To execute the code, do the following:

1. Navigate to [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient), and load the **BasicSendReceiveUsingQueueClient.csproj** file into Visual Studio.
2.	Double-click **Program.cs** to open it in the Visual Studio editor.
3.	Replace the value of the `ServiceBusConnectionString` constant with the full connection string you obtained in the previous section.
4.	Replace the value of `QueueName` with the name of the queue you created previously.
5.	Build and run the program, and observe 10 messages being sent to the queue, and received in parallel from the queue.

## Clean up deployment

Run the following command to remove the resource group, namespace, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name <resource_group_name>
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a Service Bus queue. To learn more about Service Bus, continue with the following articles:

* [Service Bus messaging overview](service-bus-messaging-overview.md)
* [Learn how to use topics and subscriptions](service-bus-dotnet-how-to-use-topics-subscriptions.md)

[New-AzureRmResourceGroup]: /powershell/module/azurerm.resources/new-azurermresourcegroup
[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-azurerm-ps
[Git]: https://www.visualstudio.com/learn/install-and-set-up-git/
[service-bus-flow]: ./media/service-bus-quickstart-powershell/quick-start-queue.png