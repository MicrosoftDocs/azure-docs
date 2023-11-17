---
title: Publish and consume events using namespace topics
description: This article provides step-by-step instructions to publish events to Azure Event Grid in the CloudEvents JSON format and consume those events by using the pull delivery model.
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.author: jafernan
author: jfggdl
ms.date: 11/15/2023
---

# Publish to namespace topics and consume events in Azure Event Grid

This article provides a quick introduction to pull delivery using the ``curl`` bash shell command to publish, receive, and acknowledge events. Event Grid resources are created using CLI commands. This article is suitable for a quick test of the pull delivery functionality. For sample code using the data plane SDKs, see the [.NET](event-grid-dotnet-get-started-pull-delivery.md) or the Java samples. For Java, we provide the sample code in two articles: [publish events](publish-events-to-namespace-topics-java.md) and [receive events](receive-events-from-namespace-topics-java.md) quickstarts.
 For more information about the pull delivery model, see the [concepts](concepts-event-grid-namespaces.md) and [pull delivery overview](pull-delivery-overview.md) articles.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.0.70 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.  

## Create a resource group
Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command. You use this resource group to contain all resources created in this article.

The general steps to use Cloud Shell to run commands are:

- Select **Open Cloud Shell** to see an Azure Cloud Shell window on the right pane. 
- Copy the command and paste into the Azure Cloud Shell window.
- Press ENTER to run the command.

1. Declare a variable to hold the name of an Azure resource group. Specify a name for the resource group by replacing `<your-resource-group-name>` with a value you like. 

    ```azurecli-interactive
    resource_group="<your-resource-group-name>"
    ```
2. Create a resource group. Change the location as you see fit. 

    ```azurecli-interactive
    az group create --name $resource_group --location eastus
    ```

[!INCLUDE [register-provider-cli.md](./includes/register-provider-cli.md)]

## Create a namespace

An Event Grid namespace provides a user-defined endpoint to which you post your events. The following example creates a namespace in your resource group using Bash in Azure Cloud Shell. The namespace name must be unique because it's part of a Domain Name System (DNS) entry. A namespace name should meet the following rules:

- It should be between 3-50 characters.
- It should be regionally unique.
- Only allowed characters are a-z, A-Z, 0-9 and -
- It shouldn't start with reserved key word prefixes like `Microsoft`, `System` or `EventGrid`.
    
1. Declare a variable to hold the name for your Event Grid namespace. Specify a name for the namespace by replacing `<your-namespace-name>` with a value you like.

    ```azurecli-interactive
    namespace="<your-namespace-name>"
    ```
2. Create a namespace. You might want to change the location where it's deployed. 

    ```azurecli-interactive
    az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --location eastus --properties "{}"
    ```

## Create a namespace topic

Create a topic that's used to hold all events published to the namespace endpoint.

1. Declare a variable to hold the name for your namespace topic. Specify a name for the namespace topic by replacing `<your-topic-name>` with a value you like.

    ```azurecli-interactive
    topic="<your-topic-name>"
    ```
2. Create your namespace topic:

    ```azurecli-interactive
    az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type topics --name $topic --parent namespaces/$namespace --properties "{}"
    ```

## Create an event subscription

Create an event subscription setting its delivery mode to *queue*, which supports [pull delivery](pull-delivery-overview.md). For more information on all configuration options,see the latest Event Grid control plane [REST API](/rest/api/eventgrid).

1. Declare a variable to hold the name for an event subscription to your namespace topic. Specify a name for the event subscription by replacing `<your-event-subscription-name>` with a value you like.

    ```azurecli-interactive
    event_subscription="<your-event-subscription-name>"
    ```
2. Create an event subscription to the namespace topic:

    ```azurecli-interactive
    az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type eventsubscriptions --name $event_subscription --parent namespaces/$namespace/topics/$topic --properties "{ \"deliveryConfiguration\":{\"deliveryMode\":\"Queue\",\"queue\":{\"receiveLockDurationInSeconds\":300}} }"
    ```

## Send events to your topic
Now, send a sample event to the namespace topic by following steps in this section. 

### List namespace access keys

1. Get the access keys associated with the namespace you created. You use one of them to authenticate when publishing events. To list your keys, you need the full namespace resource ID first. Get it by running the following command:

    ```azurecli-interactive 
    namespace_resource_id=$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "id" --output tsv)
    ```
2. Get the first key from the namespace:

    ```azurecli-interactive
    key=$(az resource invoke-action --action listKeys --ids $namespace_resource_id --query "key1" --output tsv)
    ```

### Publish an event

1. Retrieve the namespace hostname. You use it to compose the namespace HTTP endpoint to which events are sent. The following operations were first available with API version `2023-06-01-preview`.

    ```azurecli-interactive
    publish_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic:publish?api-version=2023-06-01-preview
    ```
2. Create a sample [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) compliant event:

    ```azurecli-interactive
    event=' { "specversion": "1.0", "id": "'"$RANDOM"'", "type": "com.yourcompany.order.ordercreatedV2", "source" : "/mycontext", "subject": "orders/O-234595", "time": "'`date +%Y-%m-%dT%H:%M:%SZ`'", "datacontenttype" : "application/json", "data":{ "orderId": "O-234595", "url": "https://yourcompany.com/orders/o-234595"}} '
    ```

    The `data` element is the payload of your event. Any well-formed JSON can go in this field. For more information on properties (also known as context attributes) that can go in an event, see the [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specifications.    
3. Use CURL to send the event to the topic. CURL is a utility that sends HTTP requests.

    ```azurecli-interactive
    curl -X POST -H "Content-Type: application/cloudevents+json" -H "Authorization:SharedAccessKey $key" -d "$event" $publish_operation_uri
    ```

### Receive the event

You receive events from Event Grid using an endpoint that refers to an event subscription. 

1. Compose that endpoint by running the following command:

    ```azurecli-interactive
    receive_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic/eventsubscriptions/$event_subscription:receive?api-version=2023-06-01-preview
    ```
2. Submit a request to consume the event:

    ```azurecli-interactive
    curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" $receive_operation_uri
    ```

### Acknowledge an event

After you receive an event, you pass that event to your application for processing. Once you have successfully processed your event, you no longer need that event to be in your event subscription. To instruct Event Grid to delete the event, you **acknowledge** it using its lock token that you got on the receive operation's response. 

1. In the previous step, you should have received a response that includes a `brokerProperties` object with a `lockToken` property. Copy the lock token value and set it on an environment variable:

    ```azurecli-interactive
    lockToken="<paste-the-lock-token-here>"
    ```
2. Now, build the acknowledge operation payload, which specifies the lock token for the event you want to be acknowledged.

    ```azurecli-interactive
    acknowledge_request_payload=' { "lockTokens": ["'$lockToken'"]} '
    ```
3. Proceed with building the string with the acknowledge operation URI:

    ```azurecli-interactive
    acknowledge_operation_uri="https://"$(az resource show --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --query "properties.topicsConfiguration.hostname" --output tsv)"/topics/"$topic/eventsubscriptions/$event_subscription:acknowledge?api-version=2023-06-01-preview
    ```
4. Finally, submit a request to acknowledge the event received:

    ```azurecli-interactive
    curl -X POST -H "Content-Type: application/json" -H "Authorization:SharedAccessKey $key" -d "$acknowledge_request_payload" $acknowledge_operation_uri
    ```
    
    If the acknowledge operation is executed before the lock token expires (300 seconds as set when we created the event subscription), you should see a response like the following example:
    
    ```json
    {"succeededLockTokens":["CiYKJDQ4NjY5MDEyLTk1OTAtNDdENS1BODdCLUYyMDczNTYxNjcyMxISChDZae43pMpE8J8ovYMSQBZS"],"failedLockTokens":[]}
    ```
    
## Next steps
To learn more about pull delivery model, see [Pull delivery overview](pull-delivery-overview.md).
