---
title: 'Quickstart: Send custom events to an event hub - Event Grid, Azure CLI'
description: Learn how to use Azure Event Grid and the Azure CLI to publish a topic and subscribe to that event, by using an event hub for the endpoint.
ms.date: 01/31/2024
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Route custom events to an event hub by using Event Grid and the Azure CLI

[Azure Event Grid](overview.md) is a highly scalable and serverless event broker that you can use to integrate applications via events. Event Grid delivers events to [supported event handlers](event-handlers.md), and Azure Event Hubs is one of them.

In this quickstart, you use the Azure CLI to create an Event Grid custom topic and an Event Hubs subscription for that topic. You then send sample events to the custom topic and verify that those events are delivered to an event hub.

[!INCLUDE [quickstarts-free-trial-note.md](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Create a resource group

Event Grid topics are Azure resources, and they must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named `gridResourceGroup` in the `westus2` location.

Select **Open Cloud Shell** to open Azure Cloud Shell on the right pane. Select the **Copy** button to copy the command, paste it in Cloud Shell, and then select the Enter key to run the command.

```azurecli-interactive
az group create --name gridResourceGroup --location westus2
```

[!INCLUDE [register-provider-cli.md](./includes/register-provider-cli.md)]

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to. The following example creates the custom topic in your resource group.

Replace `<TOPIC NAME>` with a unique name for your custom topic. The Event Grid topic name must be unique because a Domain Name System (DNS) entry represents it.

1. Specify a name for the topic:

    ```azurecli-interactive
    topicname="<TOPIC NAME>"
    ```

1. Run the following command to create the topic:

    ```azurecli-interactive
    az eventgrid topic create --name $topicname -l westus2 -g gridResourceGroup
    ```

## Create an event hub

Before you subscribe to the custom topic, create the endpoint for the event message. You create an event hub for collecting the events.

1. Specify a unique name for the Event Hubs namespace:

    ```azurecli-interactive
    namespace="<EVENT HUBS NAMESPACE NAME>"
    ```

1. Run the following commands to create an Event Hubs namespace and an event hub named `demohub` in that namespace:

    ```azurecli-interactive
    hubname=demohub
    
    az eventhubs namespace create --name $namespace --resource-group gridResourceGroup
    az eventhubs eventhub create --name $hubname --namespace-name $namespace --resource-group gridResourceGroup
    ```

## Subscribe to a custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track. The following example subscribes to the custom topic that you created, and it passes the resource ID of the event hub for the endpoint. The endpoint is in this format:

`/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<NAMESPACE NAME>/eventhubs/<EVENT HUB NAME>`

The following script gets the resource ID for the event hub and subscribes to an Event Grid topic. It sets the endpoint type to `eventhub` and uses the event hub ID for the endpoint.

```azurecli-interactive
hubid=$(az eventhubs eventhub show --name $hubname --namespace-name $namespace --resource-group gridResourceGroup --query id --output tsv)
topicid=$(az eventgrid topic show --name $topicname -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name subtoeventhub \
  --endpoint-type eventhub \
  --endpoint $hubid
```

The account that creates the event subscription must have write access to the event hub.

## Send an event to your custom topic

Trigger an event to see how Event Grid distributes the message to your endpoint. First, get the URL and key for the custom topic:

```azurecli-interactive
endpoint=$(az eventgrid topic show --name $topicname -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicname -g gridResourceGroup --query "key1" --output tsv)
```

For the sake of simplicity in this article, you use sample event data to send to the custom topic. Typically, an application or an Azure service would send the event data.

The cURL tool sends HTTP requests. In this article, you use cURL to send the event to the custom topic. The following example sends three events to the Event Grid topic:

```azurecli-interactive
for i in 1 2 3
do
   event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
   curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
done
```

In the Azure portal, on the **Overview** page for your Event Hubs namespace, notice that Event Grid sent those three events to the event hub. You see the same chart on the **Overview** page for the `demohub` Event Hubs instance.

:::image type="content" source="./media/custom-event-to-eventhub/show-result.png" lightbox="./media/custom-event-to-eventhub/show-result.png" alt-text="Screenshot that shows the portal page with an incoming message count of 3.":::

Typically, you create an application that retrieves event messages from the event hub. For more information, see:

- [Get started receiving messages with the event processor host in .NET Standard](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Receive events from Azure Event Hubs by using Java](../event-hubs/event-hubs-java-get-started-send.md)
- [Receive events from Event Hubs by using Apache Storm](../event-hubs/event-hubs-storm-getstarted-receive.md)

## Clean up resources

If you plan to continue working with this event, don't clean up the resources that you created in this article. Otherwise, use the following command to delete the resources:

```azurecli-interactive
az group delete --name gridResourceGroup
```

## Related content

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Azure Blob Storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-logic-app.md)
- [Stream big data into a data warehouse](event-hubs-integration.md)

To learn about publishing events to, and consuming events from, Event Grid by using various programming languages, see the following samples:

- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
- [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
- [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
- [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
