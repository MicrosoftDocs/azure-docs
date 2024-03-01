---
title: Namespace topics to route MQTT messages to Event Hubs (CLI)
description: 'This tutorial shows how to use namespace topics to route MQTT messages to Azure Event Hubs. You use Azure CLI to do the tasks in this tutorial.'
ms.topic: tutorial
ms.date: 02/28/2024
author: george-guirguis
ms.author: geguirgu
ms.custom:
  - build-2023
  - ignite-2023
ms.subservice: mqtt
---

# Tutorial: Use namespace topics to route MQTT messages to Azure Event Hubs (Azure CLI)
In this tutorial, you learn how to use a namespace topic to route data from MQTT clients to Azure Event Hubs. Here are the high-level steps:

- Create an event subscription in your Event Grid topic.
- Configure routing in your Event Grid namespace.
- View the MQTT messages in Azure Event Hubs by using Azure Stream Analytics.

## Prerequisites

- Complete the quickstart [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-cli.md). In this tutorial, you can update the same namespace to enable routing.
- This tutorial uses event hubs, Event Grid custom topics, and event subscriptions. You can find more information here:
   - Create an event hub to use as an event handler for events sent to the custom topic. For more information, see [Quickstart: Create an event hub using Azure CLI - Azure Event Hubs](/azure/event-hubs/event-hubs-quickstart-cli).
   - Process events sent to the event hub by using Stream Analytics, which writes output to any destination that Stream Analytics supports. For more information, see [Process data from Event Hubs using Stream Analytics - Azure Event Hubs](/azure/event-hubs/process-data-azure-stream-analytics).

## Launch Cloud Shell 

1. Sign into the Azure portal.
1. Select the link to launch the Cloud Shell.
1. Switch to Bash. 

## Create an Event Grid namespace and topic

```azurecli
rgName="RESOURCEGROUPNAME"
nsName="EVENTGRIDNAMESPACENAME"
location="REGION"
nsTopicName="NAMESPACETOPICNAME"

az group create -n $rgName -l $location
az eventgrid namespace create -g $rgName -n $nsName -l $location --topic-spaces-configuration "{state:Enabled}" --identity "{type:SystemAssigned}"
az eventgrid namespace topic create -g $rgName --name $nsTopicName --namespace-name $nsName
```

## Create an Event Hubs namespace and an event hub

```azurecli
ehubNsName="EVENTHUBSNAMESPACENAME`"
ehubName="EVENTHUBNAME"

az eventhubs namespace create --resource-group $rgName --name $ehubNsName
az eventhubs eventhub create --resource-group $rgName --namespace-name $ehubNsName --name $ehubName
```

## Give Event Grid namespace the access to send events to the event hub

```azurecli
egNamespaceServicePrincipalObjectID=$(az ad sp list --display-name $nsName --query [].id -o tsv)
namespaceresourceid=$(az eventhubs namespace show -n $ehubNsName -g $rgName --query "{I:id}" -o tsv) 

az role assignment create --assignee $egNamespaceServicePrincipalObjectID --role "Azure Event Hubs Data Sender" --scope $namespaceresourceid
```

## Create an event subscription with Event Hubs as the endpoint

```azurecli
eventSubscriptionName="EVENTSUBSCRIPTIONNAME"
eventhubresourceid=$(az eventhubs eventhub show -n $ehubName --namespace-name $ehubNsName -g $rgName --query "{I:id}" -o tsv) 

az resource create --api-version 2023-06-01-preview --resource-group $rgName --namespace Microsoft.EventGrid --resource-type eventsubscriptions --name $eventSubscriptionName --parent namespaces/$nsName/topics/$nsTopicName --location $location --properties "{\"deliveryConfiguration\":{\"deliveryMode\":\"Push\",\"push\":{\"maxDeliveryCount\":10,\"deliveryWithResourceIdentity\":{\"identity\":{\"type\":\"SystemAssigned\"},\"destination\":{\"endpointType\":\"EventHub\",\"properties\":{\"resourceId\":\"$eventhubresourceid\"}}}}}}"
```

## Configure routing in the Event Grid namespace

```azurecli
routeTopicResourceId=$(az eventgrid namespace topic show -g $rgName --namespace-name $nsName -n $nsTopicName --query "{I:id}" -o tsv) 
az eventgrid namespace create -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':$routeTopicResourceId}"
```

- ## Client client, topic space, and permission bindings
For more information, see [Quickstart: Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure CLI](mqtt-publish-and-subscribe-cli.md).

```azurecli
clientName="CLIENTNAME"
clientAuthName="client1-authnID" 
clientThumbprint="CERTIFICATETHUMBPRINT"

topicSpaceName="TOPICSPACENAME"
publisherBindingName="PUBLSHERBINDINGNAME"
subscriberBindingName="SUBSCRIBERBINDINGNAME"

az eventgrid namespace client create -g $rgName --namespace-name $nsName -n $clientName --authentication-name $clientAuthName --client-certificate-authentication "{validationScheme:ThumbprintMatch,allowed-thumbprints:[$clientThumbprint]}"

az eventgrid namespace topic-space create -g $rgName --namespace-name $nsName -n $topicSpaceName --topic-templates ['contosotopics/topic1']

az eventgrid namespace permission-binding create -g $rgName --namespace-name $nsName -n $publisherBindingName --client-group-name '$all' --permission publisher --topic-space-name $topicSpaceName

az eventgrid namespace permission-binding create -g $rgName --namespace-name $nsName -n $subscriberBindingName --client-group-name '$all' --permission subscriber --topic-space-name $topicSpaceName
```

## Send messages using MQTTX
Follow steps in the quickstart: [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-portal.md) to use MQTTX to send a few messages.

Verify that the event hub received those messages on the **Overview** page for your Event Hubs namespace.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png" alt-text="Screenshot that shows the Overview page of the event hub with incoming message count." lightbox="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png"::: 

## View routed MQTT messages in Event Hubs by using a Stream Analytics query

Navigate to the Event Hubs instance (event hub) within your event subscription in the Azure portal. Process data from your event hub by using Stream Analytics. For more information, see [Process data from Azure Event Hubs using Stream Analytics - Azure Event Hubs | Microsoft Learn](/azure/event-hubs/process-data-azure-stream-analytics). You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot that shows the MQTT messages data in Event Hubs by using the Stream Analytics query tool.":::


## Next steps

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
