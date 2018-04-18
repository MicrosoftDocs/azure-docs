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
ms.date: 04/18/2018
ms.author: sethm

---

# Process events using PowerShell and .NET Standard

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to create an event hub using Azure PowerShell, and then send to and receive from an event hub using the .NET Standard SDK.

## Prerequisites

To complete this tutorial, make sure you have:

1. An Azure subscription. If you don't have one, [create a free subscription](https://azure.microsoft.com/en-us/free/) before you begin.
2. [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](http://www.visualstudio.com/vs) or later.
3. [.NET Standard SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you're using PowerShell locally, you must run the latest version of PowerShell to complete this quickstart. If you need to install or upgrade, see [Install and Configure Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0).

## Log on to Azure

Once PowerShell is installed, install the Event Hubs PowerShell module and log on to Azure.

1. Install the Event Hubs PowerShell module:

   ```azurepowershell-interactive
   Install-Module AzureRM.EventHub
   ```

2. Log on to Azure:

   ```azurepowershell-interactive
   Login-AzureRmAccount
   ```

3. Select your Azure subscription. Replace `MyAzureSub` with the name of the Azure subscription you want to use:

   ```azurepowershell
   Select-AzureRmSubscription -SubscriptionName "MyAzureSub"
   ```

## Provision resources

### Create a resource group

A [resource group](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview#resource-groups) is a logical collection of Azure resources, and you need a resource group to create an event hub. 

The following example creates a resource group named `eventhubsResourceGroup` in the East US region:

```powershell
New-AzureRmResourceGroup –Name eventhubsResourceGroup –Location east
```

### Create an Event Hubs namespace

Once your resource group is made, create an Event Hubs namespace within that resource group. An Event Hubs namespace provides a unique fully-qualified domain name in which you can create your event hub. Replace `<namespace_name>` with a unique name for your namespace.

```powershell
New-AzureRmEventHubNamespace -ResourceGroupName eventhubsResourceGroup  -NamespaceName <namespace_name> -Location eastus
```

### Create an event hub

Now that you have an Event Hubs namespace, it's time to create an event hub within that namespace.

```powershell
  New-AzureRmEventHub -ResourceGroupName eventhubsResourceGroup   -NamespaceName <eventhubs_namespace_name> -EventHubName <eventhub_name> -Location eastus 
```

### Create a storage account for Event Processor Host

Event Processor Host simplifies receiving events from Event Hubs by managing checkpoints and parallel receivers. For checkpointing, Event Processor Host requires a storage account. To create a storage account and get its keys, run:

```powershell
# create a standard general-purpose storage account 
New-AzureRmStorageAccount -ResourceGroupName eventhubsResourceGroup   
  -Name <storage_account_name>
  -Location eastus
  -SkuName Standard_LRS 

# retrieve the storage account key for accessing it
Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroup -Name $storageAccountName).Value[0]

```

### Get the connection string

A connection string is required to connect to your event hub and process events. To get your connection string, run:

```powershell
Get-AzureRmEventHubKey -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -EventHubName <eventhub_name> -Name RootManageSharedAccessKey
```

## Stream into Event Hubs

You can now start streaming into your Event Hubs. The samples can be downloaded or Git cloned from the [Event Hubs repo](https://github.com/Azure/azure-event-hubs)

### Ingest events

1. Download the [SampleSender](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) from GitHub, or clone the [azure-event-hubs repo](https://github.com/Azure/azure-event-hubs).

2. Navigate to \azure-event-hubs\samples\DotNet\Microsoft.Azure.EventHubs\SampleSender folder.

3. Load SampleSender.sln file from your downloaded location in Visual Studio.

4. Add [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) Nuget package to the project.

5. In Program.cs, replace the following place holders with your event hub name and connection string:

  ```C#
  private const string EhConnectionString = "Event Hubs connection string";
  private const string EhEntityPath = "Event Hub name";

  ```
6. Build and run the sample. You can see the events being ingested into your event hub.

    ![][3]

### Receive and process events

1. Download the [SampleEphReceiver](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) from GitHub, or clone the [azure-event-hubs repo](https://github.com/Azure/azure-event-hubs).

2. Navigate to the \azure-event-hubs\samples\DotNet\Microsoft.Azure.EventHubs\SampleEphReceiver folder.

3. Load the SampleEphReceiver.sln solution file into Visual Studio.

4. Add the [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) and [Microsoft.Azure.EventHubs.Processor](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/) Nuget packages to the project.

5. In Program.cs, replace the following constants with their corresponding values:

  ```C#
  private const string EventHubConnectionString = "Event Hubs connection string";
  private const string EventHubName = "Event Hub name";
  private const string StorageContainerName = "Storage account container name";
  private const string StorageAccountName = "Storage account name";
  private const string StorageAccountKey = "Storage account key";

  ```
6. Build and run the sample. You can see the events being received on your sample application

    ![][4]

On the Azure portal, you can view the rate at which events are being processed for a given Event Hubs namespace as shown:

   ![][5]

## Clean up deployment

When you've completed the quickstart, you can delete your resource group and the namespace, storage account, and event hub within it. Replace `myResourceGroup` with the name of the resource group you created. 

```azurepowershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

Congratulations! You created an event hub and you sent and received events. To learn more, continue with the following articles:

* [Download the PowerShell script for provisioning Event Hubs resources](https://github.com/Azure/azure-event-hubs/blob/master/samples/DotNet/Quickstart_PSsample1.ps1)
* [Learn about Event Processor Host](event-hubs-dotnet-standard-getstarted-send.md)
* [Understanding the data streaming world](event-hubs-dotnet-standard-getstarted-receive-eph.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png
