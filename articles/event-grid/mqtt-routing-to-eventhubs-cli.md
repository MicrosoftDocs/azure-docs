---
title: 'Tutorial: Route MQTT messages to Event Hubs'
description: 'Tutorial: Use Azure Event Grid and Azure CLI to route MQTT messages to Azure Event Hubs.' 
ms.topic: tutorial 
ms.date: 04/20/2023
author: veyaddan
ms.author: veyaddan
---


# Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid with Azure CLI

Use message routing in Azure Event Grid to send telemetry data from your MQTT clients to Azure services such as storage queues, and Event Hubs.

In this tutorial, you will perform the following tasks:
- Create Event Subscription in your Event Grid Topic
- Configure routing in your Event Grid Namespace
- View the MQTT messages in the Event Hubs using Stream Analytics

## Prerequisites

- If you don't have an [Azure subscription](https://learn.microsoft.com/en-us/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing), create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- If you're new to Azure Event Grid, read through [Event Grid overview](https://learn.microsoft.com/en-us/azure/event-grid/overview) before starting this tutorial.
- •	Register the Event Grid resource provider as per [Register the Event Grid resource provider](https://learn.microsoft.com/en-us/azure/event-grid/custom-event-quickstart-portal#register-the-event-grid-resource-provider).
- Make sure that port 8883 is open in your firewall. The sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments.
- An Event Grid Namespace in your Azure subscription. If you don't have a namespace yet, you can follow the steps in [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-cli.md).
- This tutorial uses Event Hubs, Event Grid Custom Topics, and Event Subscriptions.  You can find more information here:
    - Creating an Event Grid Topic:  [Create a custom topic using CLI](https://learn.microsoft.com/en-us/azure/event-grid/custom-event-quickstart-portal).  While creating the Event Grid Topic, ensure to create with Event Schema as Cloud Event Schema v1.0 in the Advanced tab.
    - Creating an Event Hubs:  [Quickstart - Create an event hub using Azure CLI - Azure Event Hubs | Microsoft Learn](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-cli).
    - You can view the Event Hubs data using Stream Analytics:  [Process data from Event Hubs Azure using Stream Analytics - Azure Event Hubs | Microsoft Learn](https://learn.microsoft.com/en-us/azure/event-hubs/process-data-azure-stream-analytics).


## Create Event Grid Topic
1. Create Event Grid Custom Topic using below command with your EG custom topic name, region name and resource group name.

```azurecli-interactive
az eventgrid topic create --name `EG custom topic name` -l `region name` -g `resource group name` --input-schema cloudeventschemav1_0
```

2. Assign Data Sender role to the Event Grid Topic

```azurecli-interactive
az role assignment create --assignee "`Service Principal ID`" --role "EventGrid Data Sender" --scope "/subscriptions/`Subscription ID`/resourcegroups/`Resource Group ID`/providers/Microsoft.EventGrid/topics/`EG Custom Topic Name`" 
```

## Create Event Subscription with Event Hubs as endpoint
3. Create Event Grid Subscription using below command.  Update it with your subscription ID, resource group ID, EG custom topic name.

```azurecli-interactive
az eventgrid event-subscription create --name contosoEventSubscription \
--source-resource-id "/subscriptions/`Your Subscription ID`/resourceGroups/`Your Resource Group ID`/providers/Microsoft.EventGrid/topics/`Your Event Grid Topic Name`" \
--endpoint-type eventhub \
--endpoint /subscriptions/`Your Subscription ID`/resourceGroups/`Your Resource Group ID`/providers/Microsoft.EventHub/namespaces/`Event Hub Namespace Name`/eventhubs/`Event Hub Name`
--event-delivery-schema cloudeventschemav1_0
```

## Configure routing in the Event Grid Namespace
4. Save the below Namespace object in namespace.json file in resources folder.

{
    "properties": {
        "inputSchema": "CloudEventSchemaV1_0",
        "topicSpacesConfiguration": {
            "state": "Enabled",
            "routeTopicResourceId": "/subscriptions/`Subscription ID`/resourceGroups/`Resource Group ID`/providers/Microsoft.EventGrid/topics/`EG Custom Topic Name`"
        }
    },
    "location": "`region name`"
}

Use the az resource command to create a namespace.  Update below with your subscription ID, Resource group ID, and a Namespace name.

```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces --id /subscriptions/`Subscription ID`/resourceGroups/`Resource Group`/providers/Microsoft.EventGrid/namespaces/`Namespace Name` --is-full-object --api-version 2023-06-01-preview --properties @./resources/namespace.json
```

## Viewing the routed MQTT messages in Event Hubs using Stream Analytics

5. After configuring the routing for the namespace, publish MQTT messages among the clients (as described in the article Publish and subscribe on a MQTT topic.)

6. Navigate to the Event Hubs instance within you Event Subscription on Azure portal.  Process data from your event hub using Azure Stream Analytics.  (Process data from Event Hubs Azure using Stream Analytics - Azure Event Hubs | Microsoft Learn)  You will be able to see the MQTT messages in the query.
