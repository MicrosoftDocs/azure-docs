---
title: Quickstart - Create an event hub using Azure CLI
description: This quickstart describes how to create an event hub using Azure CLI and then send and receive events using Java.
ms.topic: quickstart
ms.date: 03/13/2023
ms.author: spelluru
ms.custom: devx-track-azurecli, mode-api, devx-track-extended-java
---

# Quickstart: Create an event hub using Azure CLI
In this quickstart, you will create an event hub using Azure CLI.


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.4 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group
Run the following command to create a resource group. A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. 

Select **Copy** to copy the command and paste it into the Cloud Shell or CLI window, and run it. Update the resource group name and the region if you like.

```azurecli-interactive
rgName="contosorg$RANDOM"
region="eastus"
az group create --name $rgName --location $region
```

You see the output similar to the following one. You see the resource group name in the `name` field with a random number replacing `$RANDOM`. 

```json
{
  "id": "/subscriptions/0000000000-0000-0000-0000-000000000000000/resourceGroups/contosorg32744",
  "location": "eastus",
  "managedBy": null,
  "name": "contosorg32744",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create an Event Hubs namespace
Run the following command to create an Event Hubs namespace. An Event Hubs namespace provides a unique scoping container, referenced by its fully qualified domain name, in which you create one or more event hubs. Update the name of the namespace if you like. 

```azurecli-interactive
# Create an Event Hubs namespace. Specify a name for the Event Hubs namespace.
namespaceName="contosoehubns$RANDOM"
az eventhubs namespace create --name $namespaceName --resource-group $rgName -l $region
```

You see the output similar to the following one. You see the name of the namespace in the `name` field.

```json
{
  "createdAt": "2023-03-13T20:28:53.037Z",
  "disableLocalAuth": false,
  "id": "/subscriptions/0000000000-0000-0000-0000-0000000000000000/resourceGroups/contosorg32744/providers/Microsoft.EventHub/namespaces/contosoehubns17861",
  "isAutoInflateEnabled": false,
  "kafkaEnabled": true,
  "location": "East US",
  "maximumThroughputUnits": 0,
  "metricId": "0000000000-0000-0000-0000-0000000000000000:contosoehubns17861",
  "minimumTlsVersion": "1.2",
  "name": "contosoehubns17861",
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "contosorg32744",
  "serviceBusEndpoint": "https://contosoehubns17861.servicebus.windows.net:443/",
  "sku": {
    "capacity": 1,
    "name": "Standard",
    "tier": "Standard"
  },
  "status": "Active",
  "tags": {},
  "type": "Microsoft.EventHub/Namespaces",
  "updatedAt": "2023-03-13T20:29:45.637Z",
  "zoneRedundant": false
}
```

## Create an event hub
Run the following command to create an event hub. Update the name of the event hub if you like. 

```azurecli-interactive
# Create an event hub. Specify a name for the event hub. 
eventhubName="contosoehub$RANDOM"
az eventhubs eventhub create --name $eventhubName --resource-group $rgName --namespace-name $namespaceName
```

You see the output similar to the following one. You see the name of the event hub in the `name` field. 

```json
{
  "captureDescription": null,
  "createdAt": "2023-03-13T20:32:04.457000+00:00",
  "id": "/subscriptions/000000000-0000-0000-0000-00000000000000/resourceGroups/contosorg32744/providers/Microsoft.EventHub/namespaces/contosoehubns17861/eventhubs/contosoehub23255",
  "location": "eastus",
  "messageRetentionInDays": 7,
  "name": "contosoehub23255",
  "partitionCount": 4,
  "partitionIds": [
    "0",
    "1",
    "2",
    "3"
  ],
  "resourceGroup": "contosorg32744",
  "status": "Active",
  "systemData": null,
  "type": "Microsoft.EventHub/namespaces/eventhubs",
  "updatedAt": "2023-03-13T20:32:04.727000+00:00"
}
```

Congratulations! You have used Azure CLI to create an Event Hubs namespace, and an event hub within that namespace. 

## Clean up resources
If you want to keep this event hub so that you can test sending and receiving events, ignore this section. Otherwise, run the following command to delete the resource group. This command deletes all the resources in the resource group and the resource group itself.

```azurecli-interactive
az group delete --name $rgName
```

## Next steps

In this article, you created a resource group, an Event Hubs namespace, and an event hub. For step-by-step instructions to send events to (or) receive events from an event hub, see the **Send and receive events** tutorials: 

- [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
- [Java](event-hubs-java-get-started-send.md)
- [Python](event-hubs-python-get-started-send.md)
- [JavaScript](event-hubs-node-get-started-send.md)
- [Go](event-hubs-go-get-started-send.md)
- [C (send only)](event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](event-hubs-storm-getstarted-receive.md)
