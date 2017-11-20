---
title: Azure Quickstart - use PowerShell to create an Azure Event Hubs namespace and event hub | Microsoft Docs
description: Quickly learn to create an Event Hubs namespace with an event hub using PowerShell
services: event-hubs
documentationcenter: ''
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: ''
ms.service: event-hubs
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/17/2017
ms.author: sethm

---

# Create Event Hubs namespace and event hub using PowerShell

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. In this article, you use PowerShell to create an Event Hubs namespace, create an event hub, and define the authorization rules on it. Once these are provisioned, you can start sending and receiving events from event hub.

If you do not have an Azure subscription, create a [free account][] before you begin.

This article requires that you are running the latest version of Azure PowerShell. If you need to install or upgrade, see [Install and Configure Azure PowerShell][].

## Log in to Azure

Log in to your Azure subscription with the **Login-AzureRmAccount** cmdlet and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group.

You create a new resource group with the **[New-AzureRmResourceGroup][]** cmdlet. The following example creates a resource group named `eventhubsResourceGroup` in the **West US** region:

```powershell
New-AzureRmResourceGroup -Name eventhubsResourceGroup -Location westus
```

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more event hubs. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```powershell
New-AzureRmEventHubNamespace -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -Location westus2
```

## Create an event hub

To create an event hub, specify the namespace under which you want it created. The following example shows how to create an event hub:

```powershell
New-AzureRmEventHub -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -EventHubName <eventhub_name> -Location westus2
```

## Create a storage account for Event Processor Host

The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, the Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access.

```powershell

# create a standard general-purpose storage account
New-AzureRmStorageAccount -ResourceGroupName eventhubsResourceGroup -Name <storage_account_name> -Location westus2 -SkuName Standard_LRS

# retrieve the first storage account key and display it
$storageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroup -Name $storageAccountName).Value[0]

Write-Host "storage account key 1 = " $storageAccountKey
```

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources

```powershell
Remove-AzureRmResourceGroup -Name eventhubsResourceGroup
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from an event hub. To learn how to send and receive events, continue with the following articles:

* [Send events to your event hub](event-hubs-dotnet-standard-getstarted-send.md)
* [Receive events from your event hub](event-hubs-dotnet-standard-getstarted-receive-eph.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
