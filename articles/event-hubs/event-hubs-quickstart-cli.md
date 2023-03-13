---
title: Quickstart - Create an event hub using Azure CLI
description: This quickstart describes how to create an event hub using Azure CLI and then send and receive events using Java.
ms.topic: quickstart
ms.date: 03/13/2023
ms.author: spelluru
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Create an event hub using Azure CLI
In this quickstart, you will create an event hub using Azure CLI.


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group
A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. Run the following command to create a resource group. Select **Copy** to copy the command and paste it into the Cloud Shell, and run it. 

```azurecli-interactive
rgName="contosorg$RANDOM"
region="eastus"
az group create --name $rgName --location $region
```

## Create an Event Hubs namespace
An Event Hubs namespace provides a unique scoping container, referenced by its fully qualified domain name, in which you create one or more event hubs. To create a namespace in your resource group, run the following command:

```azurecli-interactive
# Create an Event Hubs namespace. Specify a name for the Event Hubs namespace.
namespaceName="contosoehubns$RANDOM"
az eventhubs namespace create --name $namespaceName --resource-group $rgName -l $region
```

## Create an event hub
Run the following command to create an event hub:

```azurecli-interactive
# Create an event hub. Specify a name for the event hub. 
eventhubName="contosoehub$RANDOM"
az eventhubs eventhub create --name $eventhubName --resource-group $rgName --namespace-name $namespaceName
```

Congratulations! You have used Azure CLI to create an Event Hubs namespace, and an event hub within that namespace. 

## Clean up resources
If you want to keep this event hub so that you can test sending and receiving events, ignore this section. Otherwise, run the following command to delete the resource group. This command deletes all the resources in the resource group and the resource group itself.

```azurecli-interactive
az group delete --name $rgName
```

## Next steps

> [!div class="nextstepaction"]
> In this article, you created a resource group, an Event Hubs namespace, and an event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials: [.NET Core](event-hubs-dotnet-standard-getstarted-send.md), [Java](event-hubs-java-get-started-send.md), [Python](event-hubs-python-get-started-send.md), [JavaScript](event-hubs-node-get-started-send.md), [Go](event-hubs-go-get-started-send.md), [C (send only)](event-hubs-c-getstarted-send.md), [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)

