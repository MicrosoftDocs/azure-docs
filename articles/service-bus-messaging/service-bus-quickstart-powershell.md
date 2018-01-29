---
title: Send and receive messages to and from Azure Service Bus | Microsoft Docs
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
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/29/2018
ms.author: sethm

---
# Send and receive messages using PowerShell and .NET Standard

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. Such scenarios might involve scheduling multiple batch jobs in another application or services, or triggering order fulfillment. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. In this scenario, the workflow sends to and receives messages from a Service Bus queue.

![queue](./media/service-bus-quickstart-powershell/quick-start-queue.png)

This quickstart describes how to send and receive messages to and from a Service Bus queue using PowerShell to first create a messaging namespace and a queue within that namespace. The procedure also obtains the authorization credentials on that namespace. Then the .NET Standard client is used to send and receive messages from this queue.

## Prerequisites

1. If you do not have an Azure subscription, create a [free account][] before you begin.
2. Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].
3. Install and configure [Git][]. 

## Create queue

Run the following PowerShell cmdlets. Replace all placeholders with the appropriate values.

```powershell
# Run this first - Log on and install Service Bus module
Login-AzureRmAccount
Install-Module AzureRM.ServiceBus

# Optional - Use this to change to the current subscription or to see the subscription you currently use
Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
Get-AzureRmContext

# Create resource group 
New-AzureRmResourceGroup –Name <resource_group_name> –Location westus2

# Create a namespace
New-AzureRmServiceBusNamespace -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Location westus2

# Create a queue 
New-AzureRmServiceBusQueue -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Name <queue_name> -EnablePartitioning $False

# Get primary connection string (required in next step)
Get-AzureRmServiceBusKey -ResourceGroupName <resource_group_name> -Namespace <namespace_name> -Name RootManageSharedAccessKey
```

Copy and paste the **PrimaryConnectionString** and the **Queue name** you select to a temporary location, such as Notepad. You will need it in the next step.

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

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-azurerm-ps
[Git]: https://www.visualstudio.com/learn/install-and-set-up-git/
[service-bus-flow]: ./media/service-bus-quickstart-powershell/quick-start-queue.png