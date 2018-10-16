---
title: Azure Quickstart - Create an event hub using PowerShell | Microsoft Docs
description: This quickstart describes how to create an event hub using Azure PowerShell and then send and receive events using .NET Standard SDK. 
services: event-hubs
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 08/16/2018
ms.author: shvija
#Customer intent: How do I stream data and process telemetry from an event hub?

---

# Quickstart: Create an event hub using Azure PowerShell

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to create an event hub using Azure PowerShell, and then send to and receive from an event hub using the .NET Standard SDK.

To complete this quickstart, you need an Azure subscription. If you don't have one, [create a free account][] before you begin.

## Prerequisites

To complete this tutorial, make sure you have:

- [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](http://www.visualstudio.com/vs) or later.
- [.NET Standard SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you're using PowerShell locally, you must run the latest version of PowerShell to complete this quickstart. If you need to install or upgrade, see [Install and Configure Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0).

## Provision resources

### Create a resource group

A resource group is a logical collection of Azure resources, and you need a resource group to create an event hub. 

The following example creates a resource group in the East US region. Replace `myResourceGroup` with the name of the resource group you want to use:

```azurepowershell-interactive
New-AzureRmResourceGroup –Name myResourceGroup –Location eastus
```

### Create an Event Hubs namespace

Once your resource group is made, create an Event Hubs namespace within that resource group. An Event Hubs namespace provides a unique fully-qualified domain name in which you can create your event hub. Replace `namespace_name` with a unique name for your namespace:

```azurepowershell-interactive
New-AzureRmEventHubNamespace -ResourceGroupName myResourceGroup -NamespaceName namespace_name -Location eastus
```

### Create an event hub

Now that you have an Event Hubs namespace, create an event hub within that namespace:

```azurepowershell-interactive
New-AzureRmEventHub -ResourceGroupName myResourceGroup -NamespaceName namespace_name -EventHubName eventhub_name
```

### Create a storage account for Event Processor Host

Event Processor Host simplifies receiving events from Event Hubs by managing checkpoints and parallel receivers. For checkpointing, Event Processor Host requires a storage account. To create a storage account and get its keys, run the following commands:

```azurepowershell-interactive
# Create a standard general purpose storage account 
New-AzureRmStorageAccount -ResourceGroupName myResourceGroup -Name storage_account_name -Location eastus -SkuName Standard_LRS 
e
# Retrieve the storage account key for accessing it
Get-AzureRmStorageAccountKey -ResourceGroupName myResourceGroup -Name storage_account_name
```

### Get the connection string

A connection string is required to connect to your event hub and process events. To get your connection string, run:

```azurepowershell-interactive
Get-AzureRmEventHubKey -ResourceGroupName myResourceGroup -NamespaceName namespace_name -Name RootManageSharedAccessKey
```

## Stream into Event Hubs

You can now start streaming into your Event Hubs. The samples can be downloaded or Git cloned from the [Event Hubs repo](https://github.com/Azure/azure-event-hubs)

### Ingest events

To start streaming events, download the [SampleSender](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) from GitHub, or clone the [Event Hubs GitHub repo](https://github.com/Azure/azure-event-hubs) by issuing the following command:

```bash
git clone https://github.com/Azure/azure-event-hubs.git
```

Navigate to \azure-event-hubs\samples\DotNet\Microsoft.Azure.EventHubs\SampleSender folder, and load the SampleSender.sln file into Visual Studio.

Next, add the [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) Nuget package to the project.

In the Program.cs file, replace the following placeholders with your event hub name and connection string:

```C#
private const string EhConnectionString = "Event Hubs connection string";
private const string EhEntityPath = "Event Hub name";

```

Now, build and run the sample. You can see the events being ingested into your event hub:

![][3]

### Receive and process events

Now download the Event Processor Host receiver sample, which receives the messages you just sent. Download [SampleEphReceiver](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) from GitHub, or clone the [Event Hubs GitHub repo](https://github.com/Azure/azure-event-hubs) by issuing the following command:

```bash
git clone https://github.com/Azure/azure-event-hubs.git
```

Navigate to the \azure-event-hubs\samples\DotNet\Microsoft.Azure.EventHubs\SampleEphReceiver folder, and load the SampleEphReceiver.sln solution file into Visual Studio.

Next, add the [Microsoft.Azure.EventHubs](https://www.nuget.org/packages/Microsoft.Azure.EventHubs/) and [Microsoft.Azure.EventHubs.Processor](https://www.nuget.org/packages/Microsoft.Azure.EventHubs.Processor/) Nuget packages to the project.

In the Program.cs file, replace the following constants with their corresponding values:

```C#
private const string EventHubConnectionString = "Event Hubs connection string";
private const string EventHubName = "Event Hub name";
private const string StorageContainerName = "Storage account container name";
private const string StorageAccountName = "Storage account name";
private const string StorageAccountKey = "Storage account key";
```

Now, build and run the sample. You can see the events being received into your sample application:

![][4]

On the Azure portal, you can view the rate at which events are being processed for a given Event Hubs namespace as shown:

![][5]

## Clean up resources

When you've completed this quickstart, you can delete your resource group and the namespace, storage account, and event hub within it. Replace `myResourceGroup` with the name of the resource group you created. 

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from your event hub. To learn more, continue with the following tutorial:

> [!div class="nextstepaction"]
> [Visualize data anomalies on Event Hubs data streams](event-hubs-tutorial-visualize-anomalies.md)

[create a free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png
