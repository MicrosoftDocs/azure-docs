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
ms.date: 11/16/2017
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

The following example creates a resource group named **eventhubsResourceGroup** in the **West US** region

```cli
az group create --name eventhubsResourceGroup --location westus
```

## Create an Event Hubs namespace

An Event Hubs namespace provides a unique scoping container, referenced by its [fully qualified domain name][], in which you create one or more event hubs. The following example creates a namespace in your resource group. Replace `<namespace_name>` with a unique name for your namespace:

```cli
az eventhubs namespace create --name <namespace_name> -l westus2
```

## Create an event hub

To create an event hub, specify the namespace under which you want it created. The following example shows how to create an event hub:

```cli
az eventhubs entity create --name <eventhub_name> -l westus2
```

## Create a storage account for the Event Processor Host

The Event Processor Host is an intelligent agent that simplifies receiving events from Event Hubs by managing persistent checkpoints and parallel receives. For checkpointing, Event Processor Host requires a storage account. The following example shows how to create a storage account and how to get its keys for access:

```cli
# Create a general purpose standard storage account
az storage account create --name <storage_account_name> --resource-group eventhubsResourceGroup --location westus2 --sku Standard_RAGRS --encryption blob 

# List the storage account access keys
az storage account keys list --resource-group eventhubsResourceGroup --account-name <storage_account_name>
```

## Clean up deployment

Run the following command to remove the resource group, namespace, storage account, and all related resources:

```cli
az group delete --name eventhubsResourceGroup
```

[1]: /media/event-hubs-quickstart-namespace-cli/cli1.png
[2]: /media/event-hubs-quickstart-namespace-cli/cli2.png

[free account]: https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio
[Install Azure CLI 2.0]: /cli/azure/install-azure-cli
[az group create]: /cli/azure/group#az_group_create
[fully qualified domain name]: https://wikipedia.org/wiki/Fully_qualified_domain_name
