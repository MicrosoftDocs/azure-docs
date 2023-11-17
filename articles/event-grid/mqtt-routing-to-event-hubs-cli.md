---
title: 'Tutorial: Route MQTT messages to Event Hubs using CLI'
description: 'Tutorial: Use Azure Event Grid and Azure CLI to route MQTT messages to Azure Event Hubs.'
ms.topic: tutorial
ms.custom:
  - build-2023
  - devx-track-azurecli
  - ignite-2023
ms.date: 11/15/2023
author: veyaddan
ms.author: veyaddan
---

# Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid with Azure CLI 

Use message routing in Azure Event Grid to send data from your MQTT clients to Azure services such as storage queues, and Event Hubs.

In this article, you perform the following tasks:
- Create Event Subscription in your Event Grid topic
- Configure routing in your Event Grid Namespace
- View the MQTT messages in the Event Hubs using Stream Analytics

## Prerequisites
- Complete the [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-cli.md) Quickstart.  In this tutorial, you can update the same namespace to enable routing.
- This tutorial uses Event Hubs, Event Grid Custom Topics, and Event Subscriptions.  You can find more information here:
- Create an event hub that is used as an event handler for events sent to the custom topic - [Quickstart - Create an event hub using Azure CLI - Azure Event Hubs](/azure/event-hubs/event-hubs-quickstart-cli).
- Process events sent to the event hub using Stream Analytics, which writes output to any destination that ASA supports - [Process data from Event Hubs Azure using Stream Analytics - Azure Event Hubs](/azure/event-hubs/process-data-azure-stream-analytics).

## Create Event Grid topic
- Create Event Grid Custom Topic with your EG custom topic name, region name and resource group name.

```azurecli-interactive
az eventgrid topic create --name {EG custom topic name} -l {region name} -g {resource group name} --input-schema cloudeventschemav1_0
```

- Assign Data Sender role to the Event Grid topic

```azurecli-interactive
az role assignment create --assignee "{Your Principal ID}" --role "EventGrid Data Sender" --scope "/subscriptions/{Subscription ID}/resourcegroups/{Resource Group ID}/providers/Microsoft.EventGrid/topics/{EG Custom Topic Name}" 
```

> [!NOTE]
> You can find your principal ID using the command in PowerShell
> - az ad signed-in-user show

## Create Event Subscription with Event Hubs as endpoint
- Create Event Grid Subscription.  Update it with your subscription ID, resource group ID, EG custom topic name.

```azurecli-interactive
az eventgrid event-subscription create --name contosoEventSubscription --source-resource-id "/subscriptions/{Your Subscription ID}/resourceGroups/{Your Resource Group ID}/providers/Microsoft.EventGrid/topics/{Your Event Grid Topic Name}" --endpoint-type eventhub --endpoint /subscriptions/{Your Subscription ID}/resourceGroups/{Your Resource Group ID}/providers/Microsoft.EventHub/namespaces/{Event Hub Namespace Name}/eventhubs/{Event Hub Name} --event-delivery-schema cloudeventschemav1_0
```

> [!NOTE]
> **Routing Event Grid topic considerations:**
> The Event Grid topic that is used for routing has to fulfill following requirements:
> - It needs to be set to use the Cloud Event Schema v1.0.
> - It needs to be in the same region as the namespace.
> - You need to assign "EventGrid Data Sender" role to yourself on the Event Grid Topic.

## Configure routing in the Event Grid Namespace
We use the namespace created in the [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-cli.md).

Use the command to update the namespace to include routing configuration.  Update the command with your subscription ID, Resource group, Namespace name, and an Event Grid Topic Name.

```azurecli-interactive
az eventgrid namespace create -g demoResGrp1 -n vy-namespace1 --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':'/subscriptions/{Subscription ID}/resourceGroups/{Resource Group}/providers/Microsoft.EventGrid/topics/{Event Grid Topic Name}'}"
```

## Viewing the routed MQTT messages in Azure Event Hubs using Azure Stream Analytics query

- After configuring the routing for the namespace, publish MQTT messages among the clients (as described in the article [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-cli.md).)

- Navigate to the Event Hubs instance within your Event Subscription on Azure portal.  Process data from your event hub using Azure Stream Analytics.  ([Process data from Event Hubs Azure using Stream Analytics - Azure Event Hubs | Microsoft Learn](/azure/event-hubs/process-data-azure-stream-analytics))  You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-cli/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot showing the MQTT messages data in Event Hubs using Azure Stream Analytics query tool.":::

## Next steps
- For code samples, go to [this repository.](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main)
