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
ms.date: 03/09/2018
ms.author: chwolf;sethm

---
# Send and receive messages using PowerShell

Microsoft Azure Service Bus is an enterprise integration message broker that provides secure messaging and absolute reliability. A typical Service Bus scenario usually involves decoupling two or more applications, services or processes from each other, and transferring state or data changes. Such scenarios might involve scheduling multiple batch jobs in another application or services, or triggering order fulfillment. For example, a retail company might send their point of sales data to a back office or regional distribution center for replenishment and inventory updates. In this scenario, the workflow sends to and receives messages from a Service Bus queue.

![queue](./media/service-bus-quickstart-powershell/quick-start-queue.png)

This quickstart describes how to send and receive messages to and from a Service Bus queue. You use PowerShell to first create a messaging namespace and a queue within that namespace. The procedure also obtains the authorization credentials on that namespace. Then the .NET Standard client is used to send and receive messages from this queue.

If you do not have an Azure subscription, create a [free account][] before you begin.

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Log in to Azure

Once PowerShell is installed, open Cloud Shell and issue the following commands: 

1. First, install the Service Bus PowerShell module, if you haven't already:

   ```azurepowershell-interactive
   Install-Module AzureRM.ServiceBus
   ```

2. Run the following command to log in to Azure:

   ```azurepowershell-interactive
   Login-AzureRmAccount
   ```

4. Set the current subscription context, or see the currently active subscription:

   ```azurepowershell
   Select-AzureRmSubscription -SubscriptionName "MyAzureSubName" 
   Get-AzureRmContext
   ```

## Use PowerShell to provision resources

Replace all placeholders with the appropriate values, then run the following PowerShell cmdlets:

```azurepowershell
# Create a resource group 
New-AzureRmResourceGroup –Name <resource_group_name> –Location westus2

# Create a Messaging namespace
New-AzureRmServiceBusNamespace -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Location westus2

# Create a queue 
New-AzureRmServiceBusQueue -ResourceGroupName <resource_group_name> -NamespaceName <namespace_name> -Name <queue_name> -EnablePartitioning $False

# Get primary connection string (required in next step)
Get-AzureRmServiceBusKey -ResourceGroupName <resource_group_name> -Namespace <namespace_name> -Name RootManageSharedAccessKey
```

After the `Get-AzureRmServiceBusKey` cmdlet runs, copy and paste the connection string and the queue name you selected, to a temporary location such as Notepad. You will need it in the next step.

## Send and receive messages

After the namespace and queue are created, and you have the necessary credentials, you are ready to send and receive messages. You can examine the code in [this GitHub sample folder](https://github.com/Azure/azure-service-bus/tree/master/samples/DotNet/GettingStarted/BasicSendReceiveQuickStart).

To run the code, do the following:

1. Clone the [Service Bus GitHub repository](https://github.com/Azure/azure-service-bus/).
2. Open a Windows PowerShell prompt with Administrator privileges.
3. Navigate to the sample folder `\azure-service-bus\samples\DotNet\GettingStarted\BasicSendReceiveQuickStart\BasicSendReceiveQuickStart`.
4. If you have not done so already, obtain the connection string using the following PowerShell cmdlet. Be sure to replace `<resource_group_name>` and `<namespace_name>` with your specific values: 

   ```azurepowershell
   Get-AzureRmServiceBusKey -ResourceGroupName <resource_group_name> -Namespace <namespace_name> -Name RootManageSharedAccessKey
   ```
5.	At the PowerShell prompt, type the following command:

   ```shell
   dotnet build
   ```
6.	Navigate to the `bin\Debug\netcoreapp2.0` folder.
7.	Type the following command to run the program. Be sure to replace `myConnectionString` with the value you previously obtained, and `myQueueName` with the name of the queue you created:

   ```shell
   dotnet BasicSendReceiveQuickStart.dll -ConnectionString "myConnectionString" -QueueName "myQueueName"
   ``` 
8. Observe a set of messages being send and received.

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