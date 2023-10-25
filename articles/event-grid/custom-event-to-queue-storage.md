---
title: 'Quickstart: Send custom events to storage queue - Event Grid, Azure CLI'
description: 'Quickstart: Use Azure Event Grid and Azure CLI to publish a topic, and subscribe to that event. A storage queue is used for the endpoint.'
ms.date: 12/20/2022
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Route custom events to Azure Queue storage via Event Grid using Azure CLI

[Azure Event Grid](overview.md) is a highly scalable and serverless event broker that you can use to integrate applications using events. Events are delivered by Event Grid to  [supported event handlers](event-handlers.md) and Azure Queue storage is one of them. In this article, you use  Azure CLI for the following steps:

1. Create an Event Grid custom topic.
1. Create an Azure Queue subscription for the custom topic.
1. Send sample events to the custom topic.
1. Verify that those events are delivered to Azure Queue storage.

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

## Create Queue storage

Before subscribing to the custom topic, let's create the endpoint for the event message. You create a Queue storage for collecting the events.

1. Specify a unique name for the Azure Storage account. 

    ```azurecli-interactive
    storagename="<STORAGE ACCOUNT NAME>"    
    ```
1. Run the following commands to create an Azure Storage account and a queue (named `eventqueue`) in the storage.

    ```azurecli-interactive
    queuename="eventqueue"

    az storage account create -n $storagename -g gridResourceGroup -l westus2 --sku Standard_LRS
    key="$(az storage account keys list -n $storagename --query "[0].{value:value}" --output tsv)"    
    az storage queue create --name $queuename --account-name $storagename --account-key $key
    ```

## Subscribe to a custom topic

The following example subscribes to the custom topic you created, and passes the resource ID of the Queue storage for the endpoint. With Azure CLI, you pass the Queue storage ID as the endpoint. The endpoint is in the format:

`/subscriptions/<AZURE SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/queueservices/default/queues/<QUEUE NAME>`

The following script gets the resource ID of the storage account for the queue. It constructs the ID for the queue storage, and subscribes to an Event Grid topic. It sets the endpoint type to `storagequeue` and uses the queue ID for the endpoint.


> [!IMPORTANT]
> Replace expiration date placeholder (`<yyyy-mm-dd>`) with an actual value. For example: `2022-11-17` before running the command.

```azurecli-interactive
storageid=$(az storage account show --name $storagename --resource-group gridResourceGroup --query id --output tsv)
queueid="$storageid/queueservices/default/queues/$queuename"
topicid=$(az eventgrid topic show --name $topicname -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name mystoragequeuesubscription \
  --endpoint-type storagequeue \
  --endpoint $queueid \
  --expiration-date "<yyyy-mm-dd>"
```

The account that creates the event subscription must have write access to the queue storage. Notice that an [expiration date](concepts.md#event-subscription-expiration) is set for the subscription.

If you use the REST API to create the subscription, you pass the ID of the storage account and the name of the queue as a separate parameter.

```json
"destination": {
  "endpointType": "storagequeue",
  "properties": {
    "queueName":"eventqueue",
    "resourceId": "/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>"
  }
  ...
```

## Send an event to your custom topic

Let's trigger an event to see how Event Grid distributes the message to your endpoint. First, let's get the URL and key for the custom topic.

```azurecli-interactive
endpoint=$(az eventgrid topic show --name $topicname -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name $topicname -g gridResourceGroup --query "key1" --output tsv)
```

To simplify this article, you use sample event data to send to the custom topic. Typically, an application or Azure service would send the event data. CURL is a utility that sends HTTP requests. In this article, you use CURL to send the event to the custom topic.  The following example sends three events to the Event Grid topic:

```azurecli-interactive
for i in 1 2 3
do
   event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'
   curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
done
```

Navigate to the Queue storage in the portal, and notice that Event Grid sent those three events to the queue.

:::image type="content" source="./media/custom-event-to-queue-storage/messages.png" alt-text="Screenshot showing the list of messages in the queue that are received from Event Grid.":::

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
