---
title: Route Azure Blob storage events to a custom web endpoint (preview) | Microsoft Docs
description: Use Azure Event Grid to subscribe to Blob storage events. 
services: storage,event-grid 
keywords: 
author: cbrooksmsft
ms.author: cbrooks
ms.date: 08/18/2017
ms.topic: hero-article
ms.service: storage
---

# Route Blob storage events to a custom web endpoint (preview)

Azure Event Grid is an eventing service for the cloud. In this article, you use the Azure CLI to subscribe to Blob storage events, and trigger the event to view the result. 

> [!IMPORTANT]
> You must be registered for the Blob storage events preview to complete this tutorial.  Learn more about the preview program [here](storage-blob-event-overview.md#join-the-preview).

Typically, you send events to an endpoint that responds to the event, such as a webhook or Azure Function. To simplify the example shown in this article, we send the events to a URL that merely collects the messages. You create this URL by using an open source, third-party tool called [RequestBin](https://requestb.in/).

> [!NOTE]
> **RequestBin** is an open source tool that is not intended for high throughput usage. The use of the tool here is purely demonstrative. If you push more than one event at a time, you might not see all of your events in the tool.

When you complete the steps described in this article, you see that the event data has been sent to an endpoint.

![Event data](./media/storage-blob-event-quickstart/request-result.png)

[!INCLUDE [quickstarts-free-trial-note.md](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the latest version of Azure CLI (2.0.14 or later). To find the version, run `az --version`. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Create a resource group

Event Grid topics are Azure resources, and must be placed in an Azure resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#create) command. 

The following example creates a resource group named `<resource_group_name>` in the *westcentralus* location.  Replace `<resource_group_name>` with a unique name for your resource group.

```azurecli-interactive
az group create --name <resource_group_name> --location westcentralus
```

## Create a Blob storage account

To use Azure Storage, you need a storage account.  Blob storage events are currently available today only in Blob storage accounts.

A Blob storage account is a specialized storage account for storing your unstructured data as blobs (objects) in Azure Storage. Blob storage accounts are similar to your existing general-purpose storage accounts and share all the great durability, availability, scalability, and performance features that you use today including 100% API consistency for block blobs and append blobs. For applications requiring only block or append blob storage, we recommend using Blob storage accounts.

> [!NOTE]
> For the preview release, Blob storage events are available only for storage accounts in the **westcentralus** location.

Replace `<storage_account_name>` with a unique name for your storage account, and `<resource_group_name>` with the resource group you created earlier.

```azurecli-interactive
az storage account create \
  --name <storage_account_name> \
  --location westcentralus \
  --resource-group <resource_group_name> \
  --sku Standard_LRS \
  --kind BlobStorage \
  --access-tier Hot
```

## Create a message endpoint

Before subscribing to events from the Blob storage account, let's create the endpoint for the event message. Rather than write code to respond to the event, we will create an endpoint that collects the messages so you can view them. RequestBin is an open source, third-party tool that enables you to create an endpoint, and view requests that are sent to it. Go to [RequestBin](https://requestb.in/), and click **Create a RequestBin**.  Copy the bin URL, because you need it when subscribing to the topic.

## Subscribe to your Blob storage account

You subscribe to a topic to tell Event Grid which events you want to track. The following example subscribes to the Blob storage account you created, and passes the URL from RequestBin as the endpoint for event notification. Replace `<event_subscription_name>` with a unique name for your event subscription, and `<URL_from_RequestBin>` with the value from the preceding section. By specifying an endpoint when subscribing, Event Grid handles the routing of events to that endpoint. For `<resource_group_name>` and `<storage_account_name>`, use the values you created earlier. 

```azurecli-interactive
az eventgrid resource event-subscription create \
--endpoint <URL_from_RequestBin> \
--name <event_subscription_name> \
--provider-namespace Microsoft.Storage \
--resource-type storageAccounts \
--resource-group <resource_group_name> \
--resource-name <storage_account_name>
```

## Trigger an event from Blob storage

Now, let's trigger an event to see how Event Grid distributes the message to your endpoint. First,let's configure the name and key for the storage account, then we'll create a container, then create and upload a file. Again, use the values for `<storage_account_name>` and `<resource_group_name>`  you created earlier.

```azurecli-interactive
export AZURE_STORAGE_ACCOUNT=<storage_account_name>
export AZURE_STORAGE_ACCESS_KEY="$(az storage account keys list --account-name <storage_account_name> --resource-group <resource_group_name> --query "[0].value" --output tsv)"

az storage container create --name testcontainer

touch testfile.txt
az storage blob upload --file testfile.txt --container-name testcontainer --name testfile.txt
```

You have triggered the event, and Event Grid sent the message to the endpoint you configured when subscribing. Browse to the RequestBin URL that you created earlier. Or, click refresh in your open RequestBin browser. You see the event you just sent. 

```json
[{
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/myrg/providers/Microsoft.Storage/storageAccounts/myblobstorageaccount",
  "subject": "/blobServices/default/containers/testcontainer/blobs/testfile.txt",
  "eventType": "Microsoft.Storage.BlobCreated",
  "eventTime": "2017-08-16T20:33:51.0595757Z",
  "id": "4d96b1d4-0001-00b3-58ce-16568c064fab",
  "data": {
    "api": "PutBlockList",
    "clientRequestId": "d65ca2e2-a168-4155-b7a4-2c925c18902f",
    "requestId": "4d96b1d4-0001-00b3-58ce-16568c000000",
    "eTag": "0x8D4E4E61AE038AD",
    "contentType": "text/plain",
    "contentLength": 0,
    "blobType": "BlockBlob",
    "url": "https://myblobstorageaccount.blob.core.windows.net/testcontainer/testblob1.txt",
    "sequencer": "00000000000000EB0000000000046199",
    "storageDiagnostics": {
      "batchId": "dffea416-b46e-4613-ac19-0371c0c5e352"
    }
  }
}]

```

## Clean up resources
If you plan to continue working with this storage account and event subscription, do not clean up the resources created in this article. If you do not plan to continue, use the following command to delete the resources you created in this article.

Replace `<resource_group_name>` with the resource group you created above.

```azurecli-interactive
az group delete --name <resource_group_name>
```

## Next steps

Now that you know how to create topics and event subscriptions, learn more about Blob storage Events and what Event Grid can help you do:

- [Reacting to Blob storage events](storage-blob-event-overview.md)
- [About Event Grid](../../event-grid/overview.md)
