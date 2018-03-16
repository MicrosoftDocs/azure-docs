---
title: Azure Quickstart - process event streams using PowerShell | Microsoft Docs
description: Quickly learn to process event streams using PowerShell
services: event-hubs
documentationcenter: ''
author: sethmanheim
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/12/2018
ms.author: sethm

---

# Process event streams using PowerShell

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to use PowerShell to deploy resources, and use sample clients to ingest and process events into Event Hubs. 

If you do not have an Azure subscription, start by creating a [free account][].

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Log on to Azure

Once PowerShell is installed, perform the following steps to install the Event Hubs PowerShell module, and to log on to Azure:

1. Issue the following command to install the Event Hubs PowerShell module:

   ```azurepowershell-interactive
   Install-Module AzureRM.EventHub
   ```

2. Run the following command to log on to Azure:

   ```azurepowershell-interactive
   Login-AzureRmAccount
   ```

3. Change to the current subscription or see the currently active subscription:

   ```azurepowershell
   Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
   Get-AzureRmContext
   ```

## Provision resources

After logging in to Azure, issue the following commands to provision Event Hubs resources. Be sure to replace all placeholders with the appropriate values:

```azurepowershell
# Create a resource group 
New-AzureRmResourceGroup -Name eventhubsResourceGroup -Location eastus

# Create an Event Hubs namespace
New-AzureRmEventHubNamespace -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -Location eastus

# Get the connection string, which contains the credentials you need to connect to the event hub
Get-AzureRmEventHubKey -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -EventHubName <eventhub_name> -Name RootManageSharedAccessKey

# Create an event hub
New-AzureRmEventHub -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -EventHubName <eventhub_name> -Location eastus

# Create a storage account for Event Processor Host
New-AzureRmStorageAccount -ResourceGroupName eventhubsResourceGroup -Name <storage_account_name> -Location eastus -SkuName Standard_LRS

# retrieve the first storage account key and display it
$storageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroup -Name $storageAccountName).Value[0]
Write-Host "storage account key 1 = " $storageAccountKey

```

## Stream into Event Hubs

The next step is to run the sample code that streams events to an event hub, and receives those events using the Event Processor Host. 

First, download the [SampleSender](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) and [SampleEphReceiver](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) samples from GitHub, or clone the [azure-event-hubs repo](https://github.com/Azure/azure-event-hubs).

## Stream events

1. Open Visual Studio, then from the **File** menu, click **Open**, and then click **Project/Solution**.

2. Locate the **SampleSender** sample folder you downloaded previously, then double-click the SampleSender.sln file to load the project in Visual Studio.

3. In Solution Explorer, double-click Program.cs to open the file in the Visual Studio editor.

4. Replace the `EventHubConnectionString` value with the connection string you obtained in the "Get namespace credentials" section of this article.

5. Replace `EventHubName` with the name of the event hub you created within that namespace.

6. From the **Build** menu, click **Build Solution** to ensure there are no errors.

## Receive and process events

1. Open Visual Studio, then from the **File** menu, click **Open**, and then click **Project/Solution**.

2. Locate the **SampleEphReceiver** sample folder you downloaded in step 1, then double-click the SampleEphReceiver.sln file to load the project in Visual Studio.

3. In Solution Explorer, double-click Program.cs to open the file in the Visual Studio editor.

4. Replace the following variable values:
	1. `EventHubConnectionString`: Replace with the connection string you obtained when you created the namespace.
	2. `EventHubName`: The name of the event hub you created within that namespace.
	3. `StorageContainerName`: The name of a storage container. Give it a unique name, and the container is created for you when you run the app.
	4. `StorageAccountName`: The name of the storage account you created.
	5. `StorageAccountKey`: The storage account key you obtained from the Azure portal.

5. From the **Build** menu, click **Build Solution** to ensure there are no errors.

## Run the apps

First, run the **SampleSender** application and observe 100 messages being sent. Press **Enter** to end the program.

![][3]

Then, run the **SampleEphReceiver** app, and observe the messages being received into the Event Processor Host.

![][4]

You can view the incoming and outgoing message count in the portal metrics window for the Event Hubs namespace. The following example shows these results after running the programs twice (sending and receiving two sets of 100 messages):

![][5]

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name eventhubsResourceGroup
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from an event hub. To learn more, continue with the following articles:

* [Event Hubs PowerShell script sample](https://github.com/Azure/azure-event-hubs/samples/DotNet/Quickstart_PSsample1.ps1)
* [Send events to your event hub](event-hubs-dotnet-standard-getstarted-send.md)
* [Receive events from your event hub](event-hubs-dotnet-standard-getstarted-receive-eph.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png