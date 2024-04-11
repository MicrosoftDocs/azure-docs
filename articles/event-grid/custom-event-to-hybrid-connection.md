---
title: 'Tutorial: Send custom events to hybrid connection - Event Grid'
description: 'Tutorial: Use Azure Event Grid and Azure CLI to publish a topic, and subscribe to that event. A hybrid connection is used for the endpoint.' 
ms.date: 09/29/2021
ms.topic: tutorial 
ms.custom: devx-track-azurecli
---

# Tutorial: Route custom events to Azure Relay Hybrid Connections with Azure CLI and Event Grid

Azure Event Grid is an eventing service for the cloud. Azure Relay Hybrid Connections is one of the supported event handlers. You use hybrid connections as the event handler when you need to process events from applications that don't have a public endpoint. These applications might be within your corporate enterprise network. In this article, you use the Azure CLI to create a custom topic, subscribe to the custom topic, and trigger the event to view the result. You send the events to the hybrid connection.

## Prerequisites

- This article assumes you already have a hybrid connection and a listener application. To get started with hybrid connections, see [Get started with Relay Hybrid Connections - .NET](../azure-relay/relay-hybrid-connections-dotnet-get-started.md) or [Get started with Relay Hybrid Connections - Node](../azure-relay/relay-hybrid-connections-node-get-started.md).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.56 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. 

The following example creates a resource group named *gridResourceGroup* in the *westus2* location.

```azurecli-interactive
az group create --name gridResourceGroup --location westus2
```

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to. The following example creates the custom topic in your resource group. Replace `<topic_name>` with a unique name for your custom topic. The Event Grid topic name must be unique because it's represented by a DNS entry.

```azurecli-interactive
az eventgrid topic create --name <topic_name> -l westus2 -g gridResourceGroup
```

## Subscribe to a custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track. The following example subscribes to the custom topic you created, and passes the resource ID of the hybrid connection for the endpoint. The hybrid connection ID is in the format:

`/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Relay/namespaces/<relay-namespace>/hybridConnections/<hybrid-connection-name>`

The following script gets the resource ID of the relay namespace. It constructs the ID for the hybrid connection, and subscribes to an Event Grid topic. The script sets the endpoint type to `hybridconnection` and uses the hybrid connection ID for the endpoint.

```azurecli-interactive
relayname=<namespace-name>
relayrg=<resource-group-for-relay>
hybridname=<hybrid-name>

relayid=$(az resource show --name $relayname --resource-group $relayrg --resource-type Microsoft.Relay/namespaces --query id --output tsv)
hybridid="$relayid/hybridConnections/$hybridname"
topicid=$(az eventgrid topic show --name <topic_name> -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name <event_subscription_name> \
  --endpoint-type hybridconnection \
  --endpoint $hybridid \
  --expiration-date "<yyyy-mm-dd>"
```

Notice that an [expiration date](concepts.md#event-subscription-expiration) is set for the subscription.

## Create application to process events

You need an application that can retrieve events from the hybrid connection. The [Microsoft Azure Event Grid Hybrid Connection Consumer sample for C#](https://github.com/Azure-Samples/event-grid-dotnet-hybridconnection-destination) performs that operation. You've already finished the prerequisite steps.

1. Make sure you have Visual Studio 2019 or later.

1. Clone the repository to your local machine.

1. Load HybridConnectionConsumer project in Visual Studio.

1. In Program.cs, replace `<relayConnectionString>` and `<hybridConnectionName>` with the relay connection string and hybrid connection name that you created.

1. Compile and run the application from Visual Studio.

## Send an event to your topic

Let's trigger an event to see how Event Grid distributes the message to your endpoint. This article shows how to use Azure CLI to trigger the event. Alternatively, you can use [Event Grid publisher application](https://github.com/Azure-Samples/event-grid-dotnet-publish-consume-events/tree/master/EventGridPublisher).

First, let's get the URL and key for the custom topic. Again, use your custom topic name for `<topic_name>`.

```azurecli-interactive
endpoint=$(az eventgrid topic show --name <topic_name> -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name <topic_name> -g gridResourceGroup --query "key1" --output tsv)
```

To simplify this article, you use sample event data to send to the custom topic. Typically, an application or Azure service would send the event data. CURL is a utility that sends HTTP requests. In this article, use CURL to send the event to the custom topic.

```azurecli-interactive
event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
```

Your listener application should receive the event message.

## Clean up resources
If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, use the following command to delete the resources you created in this article.

```azurecli-interactive
az group delete --name gridResourceGroup
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md)
- [Stream big data into a data warehouse](event-hubs-integration.md)