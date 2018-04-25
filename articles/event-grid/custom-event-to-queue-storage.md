---
title: Send custom events for Azure Event Grid to storage queue | Microsoft Docs
description: Use Azure Event Grid and Azure CLI to publish a topic, and subscribe to that event. A storage queue is used for the endpoint. 
services: event-grid 
keywords: 
author: tfitzmac
ms.author: tomfitz
ms.date: 04/25/2018
ms.topic: hero-article
ms.service: event-grid
---
# Route custom events to Azure Queue storage with Azure CLI and Event Grid

Azure Event Grid is an eventing service for the cloud. Azure Queue storage is one of the supported event handlers. In this article, you use the Azure CLI to create a custom topic, subscribe to the topic, and trigger the event to view the result. You send the events to the Queue storage.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the latest version of Azure CLI (2.0.24 or later). To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

If you aren't using Cloud Shell, you must first sign in using `az login`.

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. 

The following example creates a resource group named *gridResourceGroup* in the *westus2* location.

```azurecli-interactive
az group create --name gridResourceGroup --location westus2
```

## Create a custom topic

An event grid topic provides a user-defined endpoint that you post your events to. The following example creates the custom topic in your resource group. Replace `<topic_name>` with a unique name for your topic. The topic name must be unique because it is represented by a DNS entry.

```azurecli-interactive
az eventgrid topic create --name <topic_name> -l westus2 -g gridResourceGroup
```

## Create Queue storage

Before subscribing to the topic, let's create the endpoint for the event message. You create a Queue storage for collecting the events.

```azurecli-interactive
storagename="<unique-storage-name>"
az storage account create -n $storagename -g gridResourceGroup -l westus2 --sku Standard_LRS
az storage queue create --name eventqueue --account-name $storagename
```

## Subscribe to a topic

You subscribe to a topic to tell Event Grid which events you want to track. The following example subscribes to the topic you created, and passes the resource ID of the Queue storage for the endpoint. The Queue storage ID is in the format `/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-name>/queueservices/default/queues/<queue-name>`.

Replace `<event_subscription_name>` with a name for your subscription. For `<topic_name>`, use the value you created earlier. 

```azurecli-interactive
storageid=$(az storage account show --name $storagename --resource-group gridResourceGroup --query id --output tsv)
queueid="$storageid/queueservices/default/queues/eventqueue"

az eventgrid event-subscription create --topic-name <topic_name> -g gridResourceGroup --name <event_subscription_name> --endpoint-type storagequeue --endpoint $queueid
```

## Send an event to your topic

Let's trigger an event to see how Event Grid distributes the message to your endpoint. First, let's get the URL and key for the custom topic. Again, use your topic name for `<topic_name>`.

```azurecli-interactive
endpoint=$(az eventgrid topic show --name <topic_name> -g gridResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name <topic_name> -g gridResourceGroup --query "key1" --output tsv)
```

To simplify this article, you use sample event data to send to the topic. Typically, an application or Azure service would send the event data. CURL is a utility that sends HTTP requests. In this article, use CURL to send the event to the topic.  The following example sends three events to the event grid topic:

```azurecli-interactive
for i in 1 2 3
do
   body=$(eval echo "'$(curl https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/event-grid/customevent.json)'")
   curl -X POST -H "aeg-sas-key: $key" -d "$body" $endpoint
done
```

Navigate to the Queue storage in the portal, and notice that Event Grid sent those three events to the queue.

![Show messages](./media/custom-event-to-queue-storage/messages.png)


## Clean up resources
If you plan to continue working with this event, don't clean up the resources created in this article. Otherwise, use the following command to delete the resources you created in this article.

```azurecli-interactive
az group delete --name gridResourceGroup
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about what Event Grid can help you do:

- [About Event Grid](overview.md)
- [Route Blob storage events to a custom web endpoint](../storage/blobs/storage-blob-event-quickstart.md?toc=%2fazure%2fevent-grid%2ftoc.json)
- [Monitor virtual machine changes with Azure Event Grid and Logic Apps](monitor-virtual-machine-changes-event-grid-logic-app.md)
- [Stream big data into a data warehouse](event-grid-event-hubs-integration.md)
