---
title: 'Tutorial: Route MQTT messages to Event Hubs by using the CLI'
description: 'Tutorial: Use Azure Event Grid and the Azure CLI to route MQTT messages to Azure Event Hubs.'
ms.topic: tutorial
ms.custom:
  - build-2023
  - devx-track-azurecli
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
---

# Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid with the Azure CLI

Use message routing in Azure Event Grid to send data from your MQTT clients to Azure services, such as storage queues and Azure Event Hubs.

In this tutorial, you learn how to:

- Create an event subscription in your Event Grid topic.
- Configure routing in your Event Grid namespace.
- View the MQTT messages in Azure Event Hubs by using Azure Stream Analytics.

## Prerequisites

- Complete the quickstart [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-cli.md). In this tutorial, you can update the same namespace to enable routing.
- This tutorial uses event hubs, Event Grid custom topics, and event subscriptions. You can find more information here:
   - Create an event hub to use as an event handler for events sent to the custom topic. For more information, see [Quickstart: Create an event hub using Azure CLI - Azure Event Hubs](/azure/event-hubs/event-hubs-quickstart-cli).
   - Process events sent to the event hub by using Stream Analytics, which writes output to any destination that Stream Analytics supports. For more information, see [Process data from Event Hubs using Stream Analytics - Azure Event Hubs](/azure/event-hubs/process-data-azure-stream-analytics).

## Create an Event Grid topic

Create an Event Grid custom topic with your Event Grid custom topic name, region name, and resource group name.

```azurecli-interactive
az eventgrid topic create --name {EG custom topic name} -l {region name} -g {resource group name} --input-schema cloudeventschemav1_0
```

Assign a Data Sender role to the Event Grid topic.

```azurecli-interactive
az role assignment create --assignee "{Your Principal ID}" --role "EventGrid Data Sender" --scope "/subscriptions/{Subscription ID}/resourcegroups/{Resource Group ID}/providers/Microsoft.EventGrid/topics/{EG Custom Topic Name}" 
```

> [!NOTE]
> You can find your principal ID by using this command in PowerShell: `az ad signed-in-user show`.

## Create an Event Grid subscription with Event Hubs as the endpoint

Create an Event Grid subscription. Update it with your subscription ID, resource group ID, and Event Grid custom topic name.

```azurecli-interactive
az eventgrid event-subscription create --name contosoEventSubscription --source-resource-id "/subscriptions/{Your Subscription ID}/resourceGroups/{Your Resource Group ID}/providers/Microsoft.EventGrid/topics/{Your Event Grid Topic Name}" --endpoint-type eventhub --endpoint /subscriptions/{Your Subscription ID}/resourceGroups/{Your Resource Group ID}/providers/Microsoft.EventHub/namespaces/{Event Hub Namespace Name}/eventhubs/{Event Hub Name} --event-delivery-schema cloudeventschemav1_0
```

### Routing Event Grid topic considerations

The Event Grid topic used for routing must fulfill the following requirements:

- It must be set to use the Cloud Event Schema v1.0.
- It must be in the same region as the namespace.
- You need to assign the Event Grid Data Sender role to yourself on the Event Grid topic.

## Configure routing in the Event Grid namespace

We use the namespace created in the quickstart [Publish and subscribe on a MQTT topic](./mqtt-publish-and-subscribe-cli.md).

Use the command to update the namespace to include routing configuration. Update the command with your subscription ID, resource group, namespace name, and an Event Grid topic name.

```azurecli-interactive
az eventgrid namespace create -g demoResGrp1 -n vy-namespace1 --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':'/subscriptions/{Subscription ID}/resourceGroups/{Resource Group}/providers/Microsoft.EventGrid/topics/{Event Grid Topic Name}'}"
```

## View the routed MQTT messages in Event Hubs by using a Stream Analytics query

After you configure the routing for the namespace, publish MQTT messages among the clients. For more information, see [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-cli.md).

Go to the Event Hubs instance within your Event Grid subscription in the Azure portal. Process data from your event hub by using Stream Analytics. For more information, see [Process data from Event Hubs using Stream Analytics - Azure Event Hubs | Microsoft Learn](/azure/event-hubs/process-data-azure-stream-analytics). You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-cli/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot that shows the MQTT messages data in Event Hubs using the Stream Analytics query tool.":::

## Next steps

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
