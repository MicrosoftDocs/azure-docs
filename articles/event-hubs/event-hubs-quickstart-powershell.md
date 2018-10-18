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

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This quickstart shows how to create an event hub using Azure PowerShell.

## Prerequisites

To complete this tutorial, make sure you have:

- Azure subscription. If you don't have one, [create a free account][] before you begin.
- [Visual Studio 2017 Update 3 (version 15.3, 26730.01)](http://www.visualstudio.com/vs) or later.
- [.NET Standard SDK](https://www.microsoft.com/net/download/windows), version 2.0 or later.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you're using PowerShell locally, you must run the latest version of PowerShell to complete this quickstart. If you need to install or upgrade, see [Install and Configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-5.7.0).

## Create a resource group

A resource group is a logical collection of Azure resources, and you need a resource group to create an event hub. 

The following example creates a resource group in the East US region. Replace `myResourceGroup` with the name of the resource group you want to use:

```azurepowershell-interactive
New-AzureRmResourceGroup –Name myResourceGroup –Location eastus
```

## Create an Event Hubs namespace

Once your resource group is made, create an Event Hubs namespace within that resource group. An Event Hubs namespace provides a unique fully-qualified domain name in which you can create your event hub. Replace `namespace_name` with a unique name for your namespace:

```azurepowershell-interactive
New-AzureRmEventHubNamespace -ResourceGroupName myResourceGroup -NamespaceName namespace_name -Location eastus
```

## Create an event hub

Now that you have an Event Hubs namespace, create an event hub within that namespace:

```azurepowershell-interactive
New-AzureRmEventHub -ResourceGroupName myResourceGroup -NamespaceName namespace_name -EventHubName eventhub_name
```

## Create a storage account for Event Processor Host

Event Processor Host simplifies receiving events from Event Hubs by managing checkpoints and parallel receivers. For checkpointing, Event Processor Host requires a storage account. To create a storage account and get its keys, run the following commands:

```azurepowershell-interactive
# Create a standard general purpose storage account 
New-AzureRmStorageAccount -ResourceGroupName myResourceGroup -Name storage_account_name -Location eastus -SkuName Standard_LRS 

# Retrieve the storage account key for accessing it
Get-AzureRmStorageAccountKey -ResourceGroupName myResourceGroup -Name storage_account_name
```

An access key is required to connect to your event hub and process events. To get your connection string, run:

```azurepowershell-interactive
Get-AzureRmEventHubKey -ResourceGroupName myResourceGroup -NamespaceName namespace_name -Name RootManageSharedAccessKey
```

Congratulations! You have used Azure PowerShell to create an Event Hubs namespace, and an event hub within that namespace. You have also created an Azure storage account that's used by Event Processor Host to receive events from an event hub. 

## Next steps

In this article, you created the Event Hubs namespace, and used sample applications to send and receive events from your event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see the following tutorials: 

1. **Send events to an event hub**: [.NET Standard](event-hubs-dotnet-standard-getstarted-send.md), [.NET Framework](event-hubs-dotnet-framework-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [Node.js](event-hubs-node-get-started-send.md), [Go](event-hubs-go-get-started-send.md), [C](event-hubs-c-getstarted-send.md)
2. **Receive events from an event hub**: [.NET Standard](event-hubs-dotnet-standard-getstarted-receive-eph.md), [.NET Framework](event-hubs-dotnet-framework-getstarted-receive-eph.md), [Java](event-hubs-java-get-started-receive-eph.md), [Python](event-hubs-python-get-started-receive.md), [Node.js](event-hubs-node-get-started-receive.md), [Go](event-hubs-go-get-started-receive-eph.md), [Apache Storm](event-hubs-storm-getstarted-receive.md)

[create a free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-powershell/receiver1.png
[5]: ./media/event-hubs-quickstart-powershell/metrics.png
