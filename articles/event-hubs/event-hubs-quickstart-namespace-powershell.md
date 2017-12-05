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
ms.date: 12/1/2017
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

You create a new resource group with the **[New-AzureRmResourceGroup][]** cmdlet. The following example creates a resource group named `eventhubsResourceGroup` in the **East US** region:

```powershell
New-AzureRmResourceGroup -Name eventhubsResourceGroup -Location eastus
```

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more event hubs. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```powershell
New-AzureRmEventHubNamespace -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -Location eastus2
```

### Get namespace credentials

To obtain the connection string, which contains the credentials you need to connect to the event hub, open the [Azure portal](https://portal.azure.com). 

1. In the portal list of namespaces, click the newly created namespace.

2. Click **Shared access policies**, and then click **RootManageSharedAccessKey**.
    
3. Click the copy button to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string in a temporary location, such as Notepad, to use later.

## Create an event hub

To create an event hub, specify the namespace under which you want it created. The following example shows how to create an event hub:

```powershell
New-AzureRmEventHub -ResourceGroupName eventhubsResourceGroup -NamespaceName <namespace_name> -EventHubName <eventhub_name> -Location eastus2
```

## Create a storage account for Event Processor Host

The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, the Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access.

```powershell

# create a standard general-purpose storage account
New-AzureRmStorageAccount -ResourceGroupName eventhubsResourceGroup -Name <storage_account_name> -Location eastus2 -SkuName Standard_LRS

# retrieve the first storage account key and display it
$storageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $resourceGroup -Name $storageAccountName).Value[0]

Write-Host "storage account key 1 = " $storageAccountKey
```

## Download and run the samples

The next step is to run the sample code that sends events to an event hub, and receives those events using the Event Processor Host. 

First, download the [SampleSender](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) and [SampleEphReceiver](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) samples from GitHub, or clone the [azure-event-hubs repo](https://github.com/Azure/azure-event-hubs).

### Sender

1. Open Visual Studio, then from the **File** menu, click **Open**, and then click **Project/Solution**.

2. Locate the **SampleSender** sample folder you downloaded previously, then double-click the SampleSender.sln file to load the project in Visual Studio.

3. In Solution Explorer, double-click Program.cs to open the file in the Visual Studio editor.

4. Replace the `EventHubConnectionString` value with the connection string you obtained in the "Get namespace credentials" section of this article.

5. Replace `EventHubName` with the name of the event hub you created within that namespace.

6. From the **Build** menu, click **Build Solution** to ensure there are no errors.

### Receiver

1. Open Visual Studio, then from the **File** menu, click **Open**, and then click **Project/Solution**.

2. Locate the **SampleEphReceiver** sample folder you downloaded in step 1, then double-click the SampleEphReceiver.sln file to load the project in Visual Studio.

3. In Solution Explorer, double-click Program.cs to open the file in the Visual Studio editor.

4. Replace the following variable values:
	1. `EventHubConnectionString`: replace with the connection string you obtained when you created the namespace.
	2. `EhEntityPath`: the name of the event hub you created within that namespace.
	3. `StorageContainerName`: the name of a storage container. Give it a name, and the container will be created for you when you run the app.
	4. `StorageAccountName`: the name of the storage account you created.
	5. `StorageAccountKey`: the storage account key you obtained from the Azure portal.

5. From the **Build** menu, click **Build Solution** to ensure there are no errors.

### Run the apps

First, run the **SampleSender** application and observe 100 messages being sent. Press **Enter** to end the program.

![][3]

Then, run the **SampleEphReceiver** app, and observe the messages being received into the Event Processor Host.

![][4]

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources

```powershell
Remove-AzureRmResourceGroup -Name eventhubsResourceGroup
```

## Next steps

In this article, you created the Event Hubs namespace and other resources required to send and receive events from an event hub. To learn more, continue with the following articles:

* [Send events to your event hub](event-hubs-dotnet-standard-getstarted-send.md)
* [Receive events from your event hub](event-hubs-dotnet-standard-getstarted-receive-eph.md)

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install and Configure Azure PowerShell]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps
[New-AzureRmResourceGroup]: https://docs.microsoft.com/powershell/module/azurerm.resources/new-azurermresourcegroup
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
[3]: ./media/event-hubs-quickstart-namespace-powershell/sender1.png
[4]: ./media/event-hubs-quickstart-namespace-powershell/receiver1.png