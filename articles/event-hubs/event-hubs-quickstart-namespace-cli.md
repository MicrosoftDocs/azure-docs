---
title: Azure Quickstart - create an Azure Event Hubs namespace and event hub using Azure CLI | Microsoft Docs
description: Quickly learn to create an Event Hubs namespace with an event hub using Azure CLI
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
ms.date: 12/4/2017
ms.author: sethm

---

# Create Event Hubs namespace and event hub using Azure CLI

Azure Event Hubs is a highly scalable data streaming platform and ingestion service capable of receiving and processing millions of events per second. This article shows how to quickly use Azure CLI to create an Event Hubs namespace and an event hub within that namespace. Once provisioned, you can start sending and receiving events to and from the event hub.

If you do not have an Azure subscription, create a [free account][] before you begin.

## Launch Azure Cloud Shell

Azure Cloud Shell is a free Bash shell that you can run directly from within the Azure portal. It has the Azure CLI preinstalled and configured to use with your account. Click **Cloud Shell** on the upper right menu in the Azure portal.

![][1]

This option launches an interactive shell that you can use to run the steps in this article.

![][2]

If you choose to install and use the CLI locally, this article requires that you run the latest version of Azure CLI (2.0.14 or later). To find the version, run the `cli az –version` command. If you need to install or upgrade, see [Install Azure CLI 2.0][].

## Create a resource group

A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. Create a new resource group with [az group create][] command.

The following example creates a resource group named **eventhubsResourceGroup** in the **East US** region:

```azurecli-interactive
az group create --name eventhubsResourceGroup --location eastus
```

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more event hubs. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```azurecli-interactive
az eventhubs namespace create --name <namespace_name> -l eastus2
```

### Get namespace credentials

To obtain the connection string, which contains the credentials you need to connect to the event hub, open the [Azure portal](https://portal.azure.com). 

1. In the portal list of namespaces, click the newly created namespace.

2. Click **Shared access policies**, and then click **RootManageSharedAccessKey**.
    
3. Click the copy button to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string in a temporary location, such as Notepad, to use later.
 
## Create an event hub

To create an event hub, specify the namespace under which you want it created. The following example shows how to create an event hub:

```azurecli-interactive
az eventhubs entity create --name <eventhub_name> -l eastus2
```

## Create a storage account for the Event Processor Host

The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, the Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access:

```azurecli-interactive
# Create a general purpose standard storage account
az storage account create --name <storage_account_name> --resource-group eventhubsResourceGroup --location eastus2 --sku Standard_RAGRS --encryption blob 

# List the storage account access keys
az storage account keys list --resource-group eventhubsResourceGroup --account-name <storage_account_name>
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

Run the following command to remove the resource group, namespace, storage account, and all related resources:

```azurecli-interactive
az group delete --name eventhubsResourceGroup
```

## Next steps

In this article, you’ve created the Event Hubs namespace and other resources required to send and receive events from your event hub. To learn how to send and receive events, continue with the following articles.

* [Send events to your event hub](event-hubs-dotnet-standard-getstarted-send.md)
* [Receive events from your event hub](event-hubs-dotnet-standard-getstarted-receive-eph.md)

[1]: ./media/event-hubs-quickstart-namespace-cli/cli1.png
[2]: ./media/event-hubs-quickstart-namespace-cli/cli2.png
[3]: ./media/event-hubs-quickstart-namespace-cli/sender1.png
[4]: ./media/event-hubs-quickstart-namespace-cli/receiver1.png

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
