---
title: 'Quickstart: Send custom events to a queue - Event Grid, Azure CLI'
description: Learn how to use Azure Event Grid and the Azure CLI to publish a topic and subscribe to that event, by using a queue for the endpoint.
ms.date: 01/31/2024
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Route custom events to a queue by using Event Grid and the Azure CLI

[Azure Event Grid](overview.md) is a highly scalable and serverless event broker that you can use to integrate applications via events. Event Grid delivers events to  [supported event handlers](event-handlers.md), and Azure Queue storage is one of them.

In this quickstart, you use the Azure CLI to create an Event Grid custom topic and a Queue Storage subscription for that topic. You then send sample events to the custom topic and verify that those events are delivered to a queue.

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

## Create a queue

Before you subscribe to the custom topic, create the endpoint for the event message. You create a queue for collecting the events.

1. Specify a unique name for the Azure storage account:

    ```azurecli-interactive
    storagename="<STORAGE ACCOUNT NAME>"    
    ```

1. Run the following commands to create a storage account and a queue (named `eventqueue`) in the storage:

    ```azurecli-interactive
    queuename="eventqueue"

    az storage account create -n $storagename -g gridResourceGroup -l westus2 --sku Standard_LRS
    key="$(az storage account keys list -n $storagename --query "[0].{value:value}" --output tsv)"    
    az storage queue create --name $queuename --account-name $storagename --account-key $key
    ```

## Subscribe to a custom topic

The following example subscribes to the custom topic that you created, and it passes the resource ID of the queue for the endpoint. With the Azure CLI, you pass the queue ID as the endpoint. The endpoint is in this format:

`/subscriptions/<AZURE SUBSCRIPTION ID>/resourcegroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>/queueservices/default/queues/<QUEUE NAME>`

The following script gets the resource ID of the storage account for the queue. It constructs the queue ID and subscribes to an Event Grid topic. It sets the endpoint type to `storagequeue` and uses the queue ID for the endpoint.

Before you run the command, replace the placeholder for the [expiration date](concepts.md#event-subscription-expiration) (`<yyyy-mm-dd>`) with an actual value for the year, month, and day.

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

The account that creates the event subscription must have write access to the queue. Notice that an expiration date is set for the subscription.

If you use the REST API to create the subscription, you pass the ID of the storage account and the name of the queue as a separate parameter:

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

Go to the queue in the Azure portal, and notice that Event Grid sent those three events to the queue.

:::image type="content" source="./media/custom-event-to-queue-storage/messages.png" alt-text="Screenshot that shows a list of messages received from Event Grid in a queue.":::

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
