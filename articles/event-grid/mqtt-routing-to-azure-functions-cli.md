---
title: 'Tutorial: Route MQTT messages to Azure Functions - CLI'
description: 'Tutorial: Use custom topics in Azure Event Grid to route MQTT messages to Azure Functions using the Routing feature. You use the Azure CLI in this tutorial.'
ms.topic: tutorial
ms.date: 03/14/2024
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
ms.custom: devx-track-azurecli
---

# Tutorial: Route MQTT messages in Azure Event Grid to Azure Functions using custom topics - Azure CLI

In this tutorial, you learn how to route MQTT messages received by an Azure Event Grid namespace to an Azure function via an Event Grid custom topic by following these steps:

If you don't have an Azure subscription, you can sign up for a [free trial](https://azure.microsoft.com/free/dotnet).

## Prerequisites
Follow instructions from [Create an Azure function using Visual Studio Code](../azure-functions/functions-develop-vs-code.md), but use the **Azure Event Grid Trigger** instead of using the **HTTP Trigger**. You should see code similar to the following example:

```csharp
using System;
using Azure.Messaging;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public class MyEventGridTriggerFunc
    {
        private readonly ILogger<MyEventGridTriggerFunc> _logger;

        public MyEventGridTriggerFunc(ILogger<MyEventGridTriggerFunc> logger)
        {
            _logger = logger;
        }

        [Function(nameof(MyEventGridTriggerFunc))]
        public void Run([EventGridTrigger] CloudEvent cloudEvent)
        {
            _logger.LogInformation("Event type: {type}, Event subject: {subject}", cloudEvent.Type, cloudEvent.Subject);
        }
    }
}
```

You use this Azure function as an event handler for a topic's subscription later in this tutorial. 

> [!NOTE]
> - Create all resources in the same region. 
> - This tutorial has been tested with an Azure function that uses .NET 8.0 (isolated) runtime stack.

## Create an Event Grid topic (custom topic)

In this step, you create an Event Grid topic. 

1. Copy and paste the script to an editor. 
1. Replace the following values.
1. Select **Open Cloud Shell**. 
1. Switch from **PowerShell** to **Bash** (in the upper-left corner of the Cloud Shell window).
1. Copy and paste the script from the editor to Cloud Shell and run the script. 

The script creates an Azure resource group and an Event Grid custom topic in it. Later in this tutorial, you configure routing for an Event Grid namespace so that the events or messages sent to the namespace are routed to the custom topic and then to the Azure function via subscription to the topic. 

| Placeholder | Description | 
| ----------- | ----------- | 
|`RESOURCEGROUPNAME` | Name of the resource group to be created. |
| `REGION` | Region in which you want to create the resource group and the custom topic. |
| `TOPICNAME` | Name of the custom topic to be created. | 

The script uses the [`az eventgrid topic create`](/cli/azure/eventgrid/topic#az-eventgrid-topic-create) command to create an Event Grid topic or custom topic. The schema type is specified as the cloud event schema. 

```azurecli-interactive
rgName="RESOURCEGROUPNAME"
location="REGION"
topicName="TOPICNAME"

az group create -n $rgName -l $location

az eventgrid topic create --name $topicName -l $location -g $rgName --input-schema cloudeventschemav1_0
```

> [!NOTE]
> Use **Cloud event schema** everywhere in this tutorial.  

## Add a subscription to the topic using the function

In this step, you create a subscription to the custom topic using the Azure function you created earlier. 

Replace the following values and run the script in the Cloud Shell. The script uses the [`az eventgrid event-subscription create`](/cli/azure/eventgrid/event-subscription#az-eventgrid-event-subscription-create) command to create an Azure function subscription to the custom topic. In the command, source ID is the topic's resource ID and endpoint is the function's resource ID. The endpoint type is set to Azure function and event delivery schema is specified as the cloud event schema.

| Placeholder | Description | 
| ----------- | ----------- | 
|`FUNCTIONRESOURCEGROUP` | Name of the resource group that has the Azure Functions app. |
| `FUNCTIONSAPPNAME` | Name of the Azure Functions app. |
| `FUNCTIONNAME` | Name of the Azure function. | 

```azurecli-interactive
funcAppRgName="FUNCTIONRESOURCEGROUP"
funcAppName="FUNCTIONSAPPNAME"
funcName="FUNCTIONNAME"
funcResourceId=$(az functionapp function show -g $funcAppRgName -n $funcAppName --function-name $funcName --query "{I:id}" -o tsv)

topicResourceId=$(az eventgrid topic show --name $topicName -g $rgName --query id --output tsv)
eventSubscriptionName="EVENTSUBSCRIPTIONNAME"
az eventgrid event-subscription create --name $eventSubscriptionName --source-resource-id $topicResourceId  --endpoint-type azurefunction --endpoint $funcResourceId --event-delivery-schema cloudeventschemav1_0
```


## Create namespace, clients, topic spaces, and permission bindings

Follow instructions from [Quickstart: Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure CLI](mqtt-publish-and-subscribe-cli.md) to: 

1. Create an Event Grid namespace. 
1. Create two clients.
1. Create a topic space.
1. Create publisher and subscriber permission bindings. 
1. Test using [MQTTX app](mqtt-publish-and-subscribe-portal.md#connecting-the-clients-to-the-eg-namespace-using-mqttx-app) to confirm that clients are able to send and receive messages. 

## Enable managed identity for the namespace

Replace the following value and run the script to enable system-assigned managed identity for the Event Grid namespace. 

| Placeholder | Description | 
| ----------- | ----------- | 
|`EVENTGRIDNAMESPACENAME` | Name of the Event Grid namespace. |

The script uses the [`az eventgrid namespace update`](/cli/azure/eventgrid/namespace#az-eventgrid-namespace-update) command with `identity` set to `SystemAssigned` identity.


```azurecli-interactive
nsName="EVENTGRIDNAMESPACENAME"
az eventgrid namespace update -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled}" --identity "{type:SystemAssigned}"
```

Then, grant namespace's managed identity the **send** permission on the Event Grid custom topic you created earlier so that the namespace can send or route messages to the custom topic. You do so by adding the managed identity to the **Event Grid Data Sender** role on the custom topic. 


```azurecli-interactive
egNamespaceServicePrincipalObjectID=$(az ad sp list --display-name $nsName --query [].id -o tsv)
topicResourceId=$(az eventgrid topic show --name $topicName -g $rgName --query id --output tsv)
az role assignment create --assignee $egNamespaceServicePrincipalObjectID --role "EventGrid Data Sender" --scope $topicResourceId
```

The script uses the [`az role assignment create`](/cli/azure/role/assignment#az-role-assignment-create) command with the IDs of namespace's managed identity and the custom topic, and assigns **Event Grid Data Sender** role to the namespace's managed identity on the custom topic. 


## Configure routing messages to Azure function via custom topic

In this step, you configure routing for the Event Grid namespace so that the messages it receives are routed to the custom topic you created. 

```azurecli-interactive
az eventgrid namespace update -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':$topicResourceId,'routingIdentityInfo':{type:SystemAssigned}}"
```        

The script uses the [`az eventgrid namespace update`](/cli/azure/eventgrid/namespace#az-eventgrid-namespace-update) command to set the routing topic and the type of managed identity to use to route events to the topic. 

## Send test MQTT messages using MQTTX
Send test MQTT messages to the namespace and confirm that the function receives them.

Follow instructions from the [Publish, subscribe messages using MQTTX app](mqtt-publish-and-subscribe-portal.md#publishsubscribe-using-mqttx-app) article to send a few test messages to the Event Grid namespace.

Here's the flow of the events or messages:

1. MQTTX sends messages to the topic space of the Event Grid namespace.
1. The messages get routed to the custom topic that you configured.
1. The messages are forwarded to the event subscription, which is the Azure function. 
1. Use the logging feature to verify that the function has received the event.

    :::image type="content" source="./media/mqtt-routing-to-azure-functions-portal/function-log-stream.png" alt-text="Screenshot that shows the Log stream page for an Azure function." lightbox="./media/mqtt-routing-to-azure-functions-portal/function-log-stream.png":::                 

## Next step

> [!div class="nextstepaction"]
> See code samples in [this GitHub repository](https://github.com/Azure-Samples/MqttApplicationSamples/tree/main).
