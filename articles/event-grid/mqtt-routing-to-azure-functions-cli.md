---
title: 'Tutorial: Route MQTT messages to Azure Functions - CLI'
description: 'Tutorial: Use custom topics in Azure Event Grid to route MQTT messages to Azure Functions using the Routing feature. You use the Azure CLI in this tutorial.'
ms.topic: tutorial
ms.date: 03/14/2024
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
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
In this step, you create a subscription to the Event Grid topic using the Azure function you created earlier.  

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

Enable system-assigned managed identity for the Event Grid namespace. 

```azurecli-interactive
nsName="EVENTGRIDNAMESPACENAME"
az eventgrid namespace update -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled}" --identity "{type:SystemAssigned}"
```

Then, grant identity the **send** permission to the Event Grid custom topic you created earlier so that it can route message to the custom topic. You do so by adding the managed identity to the **Event Grid Data Sender** role on the custom topic. 

```azurecli-interactive
egNamespaceServicePrincipalObjectID=$(az ad sp list --display-name $nsName --query [].id -o tsv)
topicResourceId=$(az eventgrid topic show --name $topicName -g $rgName --query id --output tsv)
az role assignment create --assignee $egNamespaceServicePrincipalObjectID --role "EventGrid Data Sender" --scope $topicResourceId
```

## Configure routing messages to Azure function via custom topic
In this step, you configure routing for the Event Grid namespace so that the messages it receives are routed to the custom topic you created. 

```azurecli-interactive
az eventgrid namespace update -g $rgName -n $nsName --topic-spaces-configuration "{state:Enabled,'routeTopicResourceId':$topicResourceId,'routingIdentityInfo':{type:SystemAssigned}}"
```        

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

