---
title: Publish and consume events or messages using namespace topics
description: Describes the steps to publish and consume events or messages using namespace topics. 
ms.topic: quickstart
ms.author: jafernan
author: jfggdl
ms.custom: references_regions
ms.date: 05/24/2023
---

# Publish to namespace topics and consume events

This article describes the steps to publish and consume events using the [CloudEvents](https://github.com/cloudevents/spec) with [JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) using namespace topics and event subscriptions.

Follow the steps in this article if you need to send application events to Event Grid so that they're received by consumer clients. Consumers connect to Event Grid to read the events ([pull delivery](pull-delivery-overview.md)).

>[!Important]
> Namespaces, namespace topics, and event subscriptions associated to namespace topics are iniatially available in the following regions:
>
>- East US
>- Central US
>- South Central US
>- West US 2
>- East Asia
>- Southeast Asia
>- North Europe
>- West Europe
>- UAE North


>[!Important]
> The Azure [CLI Event Grid extension](/cli/azure/eventgrid) does not yet support namespaces and any of the resources it contains. We will use [Azure CLI resource](/cli/azure/resource) to create Event Grid resources.

>[!Important]
> Azure Event Grid namespaces currently supports Shared Access Signatures (SAS) token and access keys authentication.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.70 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.  

## Create a resource group

The resource group is a logical collection into which Azure resources are deployed and managed.

Create a resource group with the [az group create](/cli/azure/group#az-group-create) command. We use this resource group to contain all resources created in this article.

The general steps to use Cloud Shell to run commands are:
- Select **Open Cloud Shell** to see an Azure Cloud Shell window on the right pane. 
- Copy the command and paste into the Azure Cloud Shell window.
- Press ENTER to run the command.

First, set the name of the resource group on an environmental variable. 

```azurecli-interactive
resource_group=<your-resource-group-name>
```

Create a resource group. Change the location as you see fit. 
```azurecli-interactive
az group create --name $resource_group --location eastus
```

[!INCLUDE [register-provider-cli.md](./includes/register-provider-cli.md)]

## Create a namespace

An Event Grid namespace provides a user-defined endpoint to which you post your events. The following example creates a namespace in your resource group using Bash in Azure Cloud Shell. The namespace name must be unique because it's part of a DNS entry. A namespace name should meet the following rules:
- It should be between 3-50 characters
- It should be regionally unique
- Only allowed characters a-z, A-Z, 0-9 and -
- It shouldn't start with reserved key word prefixes like `Microsoft`, `System` or `EventGrid`.
    
Set the name you want to provide to your namespace on an environmental variable.

```azurecli-interactive
namespace=<your-namespace-name>
```

Create a namespace. You may want to change the location where it's deployed. 

```azurecli-interactive
az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --location centraluseuap --properties "{}"
```

## Create a namespace topic

The topic created is used to hold all  events published to the namespace endpoint.

Set your topic name to a variable.
```azurecli-interactive
topic=<your-topic-name>
```

Create your namespace topic:

```azurecli-interactive
az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type topics --name $topic --parent namespaces/$namespace --properties "{}"
```

## Create an event subscription

Create an event subscription setting its delivery mode to *queue*, which supports [pull delivery](pull-delivery-overview.md#pull-delivery-1). For more information on all configuration options,see the latest Event Grid control plane [REST API](/rest/api/eventgrid).

Set the name of your event subscription on a variable:
```azurecli-interactive
event_subscription=<your-event-subscription-name>
```

```azurecli-interactive
az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type eventsubscriptions --name $event_subscription --parent namespaces/$namespace/topics/$topic --properties "{ \"deliveryConfiguration\":{\"deliveryMode\":\"Queue\",\"queue\":{\"receiveLockDurationInSeconds\":300}} }"
```

## Send events to your topic
Follow the steps in the coming sections for a simple way to test sending events to your topic.

### List namespace access keys

Get the access keys associated to the namespace created. You use one of them to authenticate when publishing events. In order to list your keys, you need the full namespace resource ID first.

```azurecli-interactive 
namespace_resource_id=$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "id" --output tsv)
```

Get the first key from the namespace:

```azurecli-interactive
key=$(az resource invoke-action --action listKeys --ids $namespace_resource_id --query "key1" --output tsv)
```
### Publish an event

Retrieve the namespace hostname. You use it to compose the namespace HTTP endpoint to which events are sent. Please note that the following operations were first available with API version `2023-06-01-preview`.

```azurecli-interactive
publish_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic:publish?api-version=2023-06-01-preview
```

Create a sample CloudEvents-compliant event:

```azurecli-interactive
event=' { "specversion": "1.0", "id": "'"$RANDOM"'", "type": "com.yourcompany.order.ordercreatedV2", "source" : "/mycontext", "subject": "orders/O-234595", "time": "'`date +%Y-%m-%dT%H:%M:%SZ`'", "datacontenttype" : "application/json", "data":{ "orderId": "O-234595", "url": "https://yourcompany.com/orders/o-234595"}} '
```

The `data` element is the payload of your event. Any well-formed JSON can go in this field. For more information on properties (also known as context attributes) that can go in an event, see the [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specifications.

CURL is a utility that sends HTTP requests. In this article, use CURL to send the event to the topic.

```azurecli-interactive
curl -X POST -H "Content-Type: application/cloudevents+json" -H "Authorization:SharedAccessKey $key" -d "$event" $publish_operation_uri
```

### Receive the event

You receive events from Event Grid using an endpoint that refers to an event subscription. Compose that endpoint with the following command:

```azurecli-interactive
receive_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic/eventsubscriptions/$event_subscription:receive?api-version=2023-06-01-preview
```

Submit a request to consume the event:

```azurecli-interactive
curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" -d "$event" $receive_operation_uri
```
### Acknowledge an event

After you receive an event, you pass that event to your application for processing. Once you have successfully processed your event, you no longer need that event to be in your event subscription. To instruct Event Grid to delete the event, you **acknowledge** it using its lock token that you got on the receive operation's response. In the previous step, you should have received a response that includes a `brokerProperties` object with a `lockToken` property. Copy the lock token value and set it on an environment variable:

```azurecli-interactive
lockToken=<paste-the-lock-token-here>
```

Now, build the acknowledge operation payload, which specifies the lock token for the event you want to be acknowledged.

```azurecli-interactive
acknowledge_request_payload=' { "lockTokens": ["'$lockToken'"]} '
```

Proceed with building the string with the acknowledge operation URI:

```azurecli-interactive
acknowledge_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic/eventsubscriptions/$event_subscription:acknowledge?api-version=2023-06-01-preview
```

Finally, submit a request to acknowledge the event received:

```azurecli-interactive
curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" -d "$acknowledge_request_payload" $acknowledge_operation_uri
```

If the acknowledge operation is executed before the lock token expires (300 seconds as set when we created the event subscription), you should see a response like the following:

```json
{"succeededLockTokens":["CiYKJDQ4NjY5MDEyLTk1OTAtNDdENS1BODdCLUYyMDczNTYxNjcyMxISChDZae43pMpE8J8ovYMSQBZS"],"failedLockTokens":[]}
```