---
title: Namespace topics to route MQTT messages to Event Hubs (CLI)
description: 'This tutorial shows how to use namespace topics to route MQTT messages to Azure Event Hubs. You use Azure CLI to do the tasks in this tutorial.'
ms.topic: tutorial
ms.date: 02/28/2024
author: george-guirguis
ms.author: geguirgu
ms.custom: build-2023, ignite-2023, devx-track-azurecli
ms.subservice: mqtt
---

# Tutorial: Use namespace topics to route MQTT messages to Azure Event Hubs (Azure CLI)
In this tutorial, you learn how to use a namespace topic to route data from MQTT clients to Azure Event Hubs. Here are the high-level steps:

## Prerequisites

- If you don't have an Azure subscription, create an [Azure free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- If you're new to Event Grid, read the [Event Grid overview](overview.md) before you start this tutorial.
- Register the Event Grid resource provider according to the steps in [Register the Event Grid resource provider](custom-event-quickstart-portal.md#register-the-event-grid-resource-provider).
- Make sure that port **8883** is open in your firewall. The sample in this tutorial uses the MQTT protocol, which communicates over port 8883. This port might be blocked in some corporate and educational network environments.

## Launch Cloud Shell 

1. Sign into the [Azure portal](https://portal.azure.com).
1. Select the link to launch the Cloud Shell.
1. Switch to Bash. 

    :::image type="content" source="./media/mqtt-routing-to-event-hubs-cli-namespace-topics/cloud-shell-bash.png" alt-text="Screenshot that shows the Azure portal with Cloud Shell open and Bash selected.":::

## Create an Event Grid namespace and topic

 To create an Event Grid namespace and a topic in the namespace, copy the following script to an editor, replace placeholders with actual values, and run the commands.

| Placeholder | Comments | 
| ----------- | -------- |
| `RESOURCEGROUPNAME` | Specify a name for the resource group to be created. |
| `EVENTGRIDNAMESPACENAME` | Specify the name for the Event Grid namespace. |
| `REGION` | Specify the location in which you want to create the resources. |
| `NAMESPACETOPICNAME` | Specify a name for the namespace topic. |



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

To create an Event Hubs namespace and an event hub in the namespace, replace placeholders with actual values, and run the following commands. This event hub is used as an event handler in the event subscription you create in this tutorial.

| Placeholder | Comments | 
| ----------- | -------- |
| `EVENTHUBSNAMESPACENAME` | Specify a name for Event Hubs namespace to be created. |
| `EVENTHUBNAME` | Specify the name for Event Hubs instance (event hub) to be created in the Event Hubs namespace. |

```azurecli
ehubNsName="EVENTHUBSNAMESPACENAME`"
ehubName="EVENTHUBNAME"

az eventhubs namespace create --resource-group $rgName --name $ehubNsName
az eventhubs eventhub create --resource-group $rgName --namespace-name $ehubNsName --name $ehubName
```

## Give Event Grid namespace the access to send events to the event hub

Run the following command to add the service principal of the Event Grid namespace to the Azure Event Hubs Data Sender role on the Event Hubs namespace. It allows the Event Grid namespace and resources in it to send events to the event hub in the Event Hubs namespace.

```azurecli
egNamespaceServicePrincipalObjectID=$(az ad sp list --display-name $nsName --query [].id -o tsv)
namespaceresourceid=$(az eventhubs namespace show -n $ehubNsName -g $rgName --query "{I:id}" -o tsv) 

az role assignment create --assignee $egNamespaceServicePrincipalObjectID --role "Azure Event Hubs Data Sender" --scope $namespaceresourceid
```

## Create an event subscription with Event Hubs as the endpoint

To create an event subscription for the namespace topic you created earlier, replace placeholders with actual values, and run the following commands. This subscription is configured to use the event hub as the event handler. 

| Placeholder | Comments | 
| ----------- | -------- |
| `EVENTSUBSCRIPTIONNAME` | Specify a name for the event subscription for the namespace topic. |


```azurecli
eventSubscriptionName="EVENTSUBSCRIPTIONNAME"
eventhubresourceid=$(az eventhubs eventhub show -n $ehubName --namespace-name $ehubNsName -g $rgName --query "{I:id}" -o tsv) 

az resource create --api-version 2023-06-01-preview --resource-group $rgName --namespace Microsoft.EventGrid --resource-type eventsubscriptions --name $eventSubscriptionName --parent namespaces/$nsName/topics/$nsTopicName --location $location --properties "{\"deliveryConfiguration\":{\"deliveryMode\":\"Push\",\"push\":{\"maxDeliveryCount\":10,\"deliveryWithResourceIdentity\":{\"identity\":{\"type\":\"SystemAssigned\"},\"destination\":{\"endpointType\":\"EventHub\",\"properties\":{\"resourceId\":\"$eventhubresourceid\"}}}}}}"
```

## Configure routing in the Event Grid namespace

Run the following commands to enable routing on the namespace to route messages or events to the namespace topic you created earlier. The event subscription on that namespace topic forwards those events to the event hub that's configured as an event handler. 

```azurecli
routeTopicResourceId=$(az eventgrid namespace topic show -g $rgName --namespace-name $nsName -n $nsTopicName --query "{I:id}" -o tsv) 
az eventgrid namespace create -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':$routeTopicResourceId}"
```

## Client client, topic space, and permission bindings

Now, create a client to send a few messages for testing. In this step, you create a client, a topic space with a topic, and publisher and subscriber bindings. 
 
For detailed instructions, see [Quickstart: Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure CLI](mqtt-publish-and-subscribe-cli.md).

| Placeholder | Comments | 
| ----------- | -------- |
| `CLIENTNAME` | Specify a name for client that send a few test messages. |
| `CERTIFICATETHUMBPRINT` | Thumbprint of client's certificate. See the above quickstart for instructions to create a certificate and extract a thumbprint. Use the same thumbprint in the MQTTX tool to send test messages. |
| `TOPICSPACENAME` | Specify a name for the topic space to be created. |
| `PUBLSHERBINDINGNAME` | Specify a name for the publisher binding. |
| `SUBSCRIBERBINDINGNAME` | Specify a name for the subscriber binding. |


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
Use MQTTX to send a few test messages. For step-by-step instructions, see the quickstart: [Publish and subscribe on an MQTT topic](./mqtt-publish-and-subscribe-portal.md).

Verify that the event hub received those messages on the **Overview** page for your Event Hubs namespace.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png" alt-text="Screenshot that shows the Overview page of the event hub with incoming message count." lightbox="./media/mqtt-routing-to-event-hubs-portal-namespace-topics/verify-incoming-messages.png"::: 

## View routed MQTT messages in Event Hubs by using a Stream Analytics query

Navigate to the Event Hubs instance (event hub) within your event subscription in the Azure portal. Process data from your event hub by using Stream Analytics. For more information, see [Process data from Azure Event Hubs using Stream Analytics - Azure Event Hubs | Microsoft Learn](../event-hubs/process-data-azure-stream-analytics.md). You can see the MQTT messages in the query.

:::image type="content" source="./media/mqtt-routing-to-event-hubs-portal/view-data-in-event-hub-instance-using-azure-stream-analytics-query.png" alt-text="Screenshot that shows the MQTT messages data in Event Hubs by using the Stream Analytics query tool.":::


## Next steps

For code samples, go to [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
