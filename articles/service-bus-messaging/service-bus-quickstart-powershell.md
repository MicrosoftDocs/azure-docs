---
title: Azure Quickstart - use PowerShell to create Service Bus entities and the .NET client to send and receive messages from Azure Service Bus | Microsoft Docs
description: Quickly learn to send and receive Service Bus messages using PowerShell and the .NET client
services: service-bus-messaging
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: 'ChristianWolf42'

ms.assetid: ''
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/19/2018
ms.author: sethm

---

# Send and receive messages to a Queue using PowerShell and the .NET Core client

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. A basic example could be scheduling multiple batch jobs in another application or services or triggering order fulfillment.. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. For this, they would, for example, send and receive messages from a Service Bus Queue.

<p align="center"><img src="./media/service-bus-quickstart-powershell/quick-start-queue.png"></p>

## What is be accomplished
This quickstart describes how to send and receive messages to a Service Bus Queue using PowerShell to create a messaging namespace and a queue within that namespace and obtain the authorization credentials on that namespace. Then the .Net Core client is used to send and receive messages from this Queue.

## Prerequisites
1. If you do not have an Azure subscription, create a [free account][] before you begin.
2. Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].
3. Install and configure [Git][]. 

## Create Queue
Copy the following command lets into a text or ps1 file. Then use Windows + X to open a Powershell command prompt with Admin rights or open the PowerShell ISE as Administrator via right click, run as Admin. Replace all <place holders> and execute the script.

```powershell
# Run first - Logon and Install Service Bus Module
Login-AzureRmAccount
Install-Module AzureRM.ServiceBus

# Optional - Use this to change to the regarding subscription or to see the subscription you currently use
Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
Get-AzureRmContext

# Run second 
# Create Resource group 
New-AzureRmResourceGroup –Name <resource_group_name> –Location westus2

# Create namespace
New-AzureRmServiceBusNamespace -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Location westus2

# Create queue 
New-AzureRmServiceBusQueue -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Name <queue_name> -EnablePartitioning $False

# Get Primary connection string (Required in next step)
Get-AzureRmServiceBusKey -ResourceGroupName <resource_group_name> -Namespace <namespace_name> -Name RootManageSharedAccessKey
```

Copy and paste the **PrimaryConnectionString** value to a temporary location, such as Notepad, to use later. Also take note of the **Queue name** you select as you need it later.

## Send and receive messages

After the namespace and queue are created, and you have the necessary credentials, you are ready to send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/Microsoft.Azure.ServiceBus/BasicSendReceiveUsingQueueClient).

To execute the code, do the following steps:
1.	Navigate to [this GitHub repository](https://github.com/Azure/azure-service-bus), and [clone](https://docs.microsoft.com/en-us/vsts/git/tutorial/clone?tabs=visual-studio) it.
2.	Go to the repository on your computer and navigate to the following folder: \samples\DotNet\GettingStarted\Microsoft.Azure.ServiceBus\BasicSendReceiveUsingQueueClient. This is assuming you are in the root folder of the repository. Your full path could, for example be:
C:\repos\azure-service-bus\samples\DotNet\GettingStarted\Microsoft.Azure.ServiceBus\BasicSendReceiveUsingQueueClient.
3.	**BasicSendReceiveUsingQueueClient.csproj** file in Visual Studio.
4.	Double-click **Program.cs** to open it in the Visual Studio editor.
5.	Replace the value of the ServiceBusConnectionString constant with the full connection string you obtained in the previous section.
6.	Replace the value of QueueName with the name of the queue you created previously.
7.	Build and run the program, and observe 10 messages being sent to the queue, and received in parallel from the queue.


## Clean up deployment

Run the following command to remove the resource group, namespace, and all related resources:

```powershell
Remove-AzureRmResourceGroup -Name <resource_group_name>
```

## Next steps

In this article, you created a Service Bus namespace and other resources required to send and receive messages from a queue. To learn more about sending and receiving messages and service bus, continue with the following articles:

* Service Bus messaging overview
* [Service Bus fundamentals](service-bus-fundamentals-hybrid-solutions.md)
* Learn how to use topics and subscriptions
* Check out our How tos


[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: /powershell/azure/install-azurerm-ps
[Git]: https://www.visualstudio.com/learn/install-and-set-up-git/
[service-bus-flow]: ./media/service-bus-quickstart-powershell/quick-start-queue.png