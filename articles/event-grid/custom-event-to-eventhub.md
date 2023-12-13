---
title: 'Quickstart: Send custom events to Event Hubs - Event Grid, Azure CLI'
description: 'Quickstart: Use Azure Event Grid and Azure CLI to publish a topic, and subscribe to that event. An event hub is used for the endpoint.'
ms.date: 11/18/2022
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Route custom events to Azure Event Hubs with Azure CLI and Event Grid

[Azure Event Grid](overview.md) is a highly scalable and serverless event broker that you can use to integrate applications using events. Events are delivered by Event Grid to  [supported event handlers](event-handlers.md) and Azure Event Hubs is one of them. In this article, you use  Azure CLI for the following steps:

1. Create an Event Grid custom topic.
1. Create an Azure Event Hubs subscription for the custom topic.
1. Send sample events to the custom topic.
1. Verify that those events are delivered to the event hub.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. The following example creates a resource group named **gridResourceGroup** in the **westus2** location.

> [!NOTE]
> Select **Try it** next to the CLI example to launch Cloud Shell in the right pane. Select **Copy** button to copy the command, paste it in the Cloud Shell window, and then press ENTER to run the command.

```azurecli-interactive
az group create --name gridResourceGroup --location westus2
```

[!INCLUDE [register-provider-cli.md](./includes/register-provider-cli.md)]

## Create a custom topic

An Event Grid topic provides a user-defined endpoint that you post your events to. The following example creates the custom topic in your resource group. Replace `<topic_name>` with a unique name for your custom topic. The Event Grid topic name must be unique because it's represented by a DNS entry.

1. Specify a name for the topic. 

    ```azurecli-interactive
    topicname="<TOPIC NAME>"
    ```    
1. Run the following command to create the topic. 

    ```azurecli-interactive
    az eventgrid topic create --name $topicname -l westus2 -g gridResourceGroup
    ```

## Create an event hub

Before subscribing to the custom topic, let's create the endpoint for the event message. You create an event hub for collecting the events.

1. Specify a unique name for the Event Hubs namespace. 

    ```azurecli-interactive
    namespace="<EVENT HUBS NAMESPACE NAME>"
    ```
1. Run the following commands to create an Event Hubs namespace and an event hub named `demohub` in that namespace.


    ```azurecli-interactive
    hubname=demohub
    
    az eventhubs namespace create --name $namespace --resource-group gridResourceGroup
    az eventhubs eventhub create --name $hubname --namespace-name $namespace --resource-group gridResourceGroup
    ```

## Subscribe to a custom topic

You subscribe to an Event Grid topic to tell Event Grid which events you want to track. The following example subscribes to the custom topic you created, and passes the resource ID of the event hub for the endpoint. The endpoint is in the format:

`/subscriptions/<AZURE SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.EventHub/namespaces/<NAMESPACE NAME>/eventhubs/<EVENT HUB NAME>`

The following script gets the resource ID for the event hub, and subscribes to an Event Grid topic. It sets the endpoint type to `eventhub` and uses the event hub ID for the endpoint.

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

Let's trigger an event to see how Event Grid distributes the message to your endpoint. First, let's get the URL and key for the custom topic.

```azurecli-interactive
endpoint=$(az eventgrid topic show --name $topicname -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicname -g gridResourceGroup --query "key1" --output tsv)
```

To simplify this article, you use sample event data to send to the custom topic. Typically, an application or Azure service would send the event data. CURL is a utility that sends HTTP requests. In this article, use CURL to send the event to the custom topic.  The following example sends three events to the Event Grid topic:

```azurecli-interactive
for i in 1 2 3
do
   event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
   curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
done
```

On the **Overview** page for your Event Hubs namespace in the Azure portal, notice that Event Grid sent those three events to the event hub. You'll see the same chart on the **Overview** page for the `demohub` Event Hubs instance page. 

:::image type="content" source="./media/custom-event-to-eventhub/show-result.png" lightbox="./media/custom-event-to-eventhub/show-result.png" alt-text="Image showing the portal page with incoming message count as 3.":::

Typically, you create an application that retrieves the events from the event hub. To create an application that gets messages from an event hub, see:

* [Get started receiving messages with the Event Processor Host in .NET Standard](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
* [Receive events from Azure Event Hubs using Java](../event-hubs/event-hubs-java-get-started-send.md)
* [Receive events from Event Hubs using Apache Storm](../event-hubs/event-hubs-storm-getstarted-receive.md)

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

See the following samples to learn about publishing events to and consuming events from Event Grid using different programming languages. 

- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
- [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
- [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
- [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
