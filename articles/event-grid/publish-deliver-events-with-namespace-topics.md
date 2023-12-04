---
title: Publish and deliver events using namespace topics
description: This article provides step-by-step instructions to publish to Azure Event Grid in the CloudEvents JSON format and deliver those events by using the push delivery model.
ms.topic: quickstart
ms.custom:
  - ignite-2023
ms.author: robece
author: robece
ms.date: 11/15/2023
---

# Publish and deliver events using namespace topics (preview)

The article provides step-by-step instructions to publish events to Azure Event Grid in the [CloudEvents JSON format](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) and deliver those events by using the push delivery model. To be specific, you use Azure CLI and Curl to publish events to a namespace topic in Event Grid and push those events from an event subscription to an Event Hubs handler destination. For more information about the push delivery model, see [Push delivery overview](push-delivery-overview.md).

> [!NOTE]
> - Namespaces, namespace topics, and event subscriptions associated to namespace topics are initially available in the following regions: East US, Central US, South Central US, West US 2, East Asia, Southeast Asia, North Europe, West Europe, UAE North.
> - The Azure [CLI Event Grid extension](/cli/azure/eventgrid) doesn't yet support namespaces and any of the resources it contains. We will use [Azure CLI resource](/cli/azure/resource) to create Event Grid resources.
> - Azure Event Grid namespaces currently supports Shared Access Signatures (SAS) token and access keys authentication.

[!INCLUDE [quickstarts-free-trial-note.md](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Quickstart for Bash in Azure Cloud Shell](/azure/cloud-shell/quickstart).

   [:::image type="icon" source="~/articles/reusable-content/azure-cli/media/hdi-launch-cloud-shell.png" alt-text="Launch Azure Cloud Shell" :::](https://shell.azure.com)

- If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

  - If you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

  - When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

- This article requires version 2.0.70 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Install Event Grid preview extension

By installing the Event Grid preview extension you will get access to the latest features, this step is required in some features that are still in preview.

```azurecli-interactive
az extension add --name eventgrid
```

If you already installed the Event Grid preview extension, you can update it with the following command.

```azurecli-interactive
az extension update --name eventgrid
```

[!INCLUDE [register-provider-cli.md](./includes/register-provider-cli.md)]

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

    ```azurecli-interactive
    location="<your-resource-group-location>"
    ```

2. Create a resource group. Change the location as you see fit.

    ```azurecli-interactive
    az group create --name $resource_group --location $location
    ```

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
    az resource create --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type namespaces --name $namespace --location $location --properties "{}"
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

## Create a new Event Hubs resource

Create an Event Hubs resource that will be used as the handler destination for the namespace topic push delivery subscription.

```azurecli-interactive
eventHubsNamespace="<your-event-hubs-namespace-name>"
```

```azurecli-interactive
eventHubsEventHub="<your-event-hub-name>"
```

```azurecli-interactive
az eventhubs eventhub create --resource-group $resourceGroup --namespace-name $eventHubsNamespace --name $eventHubsEventHub --partition-count 1
```

## Deliver events to Event Hubs using managed identity

To deliver events to event hubs in your Event Hubs namespace using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [namespaces](event-grid-namespace-managed-identity.md), continue reading to the next section to find how to enable managed identity using Azure CLI.
1. [Add the identity to the **Azure Event Hubs Data Sender** role  on the Event Hubs namespace](../event-hubs/authenticate-managed-identity.md#to-assign-azure-roles-using-the-azure-portal), continue reading to the next section to find how to add the role assignment.
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Event Hubs namespace](../event-hubs/event-hubs-service-endpoints.md#trusted-microsoft-services).
1. Configure the event subscription that uses an event hub as an endpoint to use the system-assigned or user-assigned managed identity.

## Enable managed identity in the Event Grid namespace

Enable system assigned managed identity in the Event Grid namespace.

```azurecli-interactive
az eventgrid namespace update --resource-group $resource_group --name $namespace --identity {type:systemassigned}
```

## Add role assignment in Event Hubs for the Event Grid managed identity

1. Get Event Grid namespace system managed identity principal ID.

    ```azurecli-interactive
    principalId=(az eventgrid namespace show --resource-group $resource_group --name $namespace --query identity.principalId -o tsv)
    ```

2. Get Event Hubs event hub resource ID.

    ```azurecli-interactive
    eventHubResourceId=(az eventhubs eventhub show --resource-group $resource_group --namespace-name $eventHubsNamespace --name $eventHubsEventHub --query id -o tsv)
    ```

3. Add role assignment in Event Hubs for the Event Grid system managed identity.

    ```azurecli-interactive
    az role assignment create --role "Azure Event Hubs Data Sender" --assignee $principalId --scope $eventHubResourceId
    ```

## Create an event subscription

Create a new push delivery event subscription.

```azurecli-interactive
event_subscription="<your_event_subscription_name>"
```

```azurecli-interactive
az resource create --api-version 2023-06-01-preview --resource-group $resource_group --namespace Microsoft.EventGrid --resource-type eventsubscriptions --name $event_subscription --parent namespaces/$namespace/topics/$topic --location $location --properties "{\"deliveryConfiguration\":{\"deliveryMode\":\"Push\",\"push\":{\"maxDeliveryCount\":10,\"deliveryWithResourceIdentity\":{\"identity\":{\"type\":\"SystemAssigned\"},\"destination\":{\"endpointType\":\"EventHub\",\"properties\":{\"resourceId\":\"$eventHubResourceId\"}}}}}}"
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

## Next steps

In this article, you created and configured the Event Grid namespace and Event Hubs resources. For step-by-step instructions to receive events from an event hub, see these tutorials:

- [.NET Core](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Java](../event-hubs/event-hubs-java-get-started-send.md)
- [Python](../event-hubs/event-hubs-python-get-started-send.md)
- [JavaScript](../event-hubs/event-hubs-node-get-started-send.md)
- [Go](../event-hubs/event-hubs-go-get-started-send.md)
- [C (send only)](../event-hubs/event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](../event-hubs/event-hubs-storm-getstarted-receive.md)
