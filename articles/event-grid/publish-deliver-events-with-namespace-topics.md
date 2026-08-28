---
title: "Quickstart: Deliver events to Event Hubs by using namespace topics (CLI)"
description: Use the Azure CLI to publish events to an Event Grid namespace topic in the CloudEvents JSON format and push them to Azure Event Hubs.
ms.topic: quickstart
ms.custom: ignite-2023, devx-track-azurecli, build-2024
ms.author: robece
author: robece
ms.date: 08/26/2026
ai-usage: ai-assisted

#customer intent: As a developer, I want to publish events to an Event Grid namespace topic and push them to Event Hubs so that I can build event-driven solutions.
---

# Quickstart: Deliver events to Azure Event Hubs by using namespace topics (Azure CLI)

In this quickstart, you use the Azure CLI to publish events to an Event Grid namespace topic in the CloudEvents JSON format, and then push those events to an Azure Event Hubs handler. You create the Event Grid and Event Hubs resources, configure a managed identity for secure delivery, and send a sample event by using cURL.

By using Azure Event Grid namespace topics, you can publish events and deliver them to handlers such as Azure Event Hubs. Delivering events to Event Hubs is useful when you need to collect high-volume event streams or telemetry for downstream analytics, storage, or further processing.

[!INCLUDE [quickstarts-free-trial-note.md](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Use the Bash environment in [Azure Cloud Shell](../cloud-shell/overview.md). For more information, see [Quickstart for Bash in Azure Cloud Shell](../cloud-shell/quickstart.md).

   [:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Launch Azure Cloud Shell":::](https://shell.azure.com)

- If you prefer to run CLI reference commands locally, [install](/cli/azure/install-azure-cli) the Azure CLI. If you're running on Windows or macOS, consider running Azure CLI in a Docker container. For more information, see [How to run the Azure CLI in a Docker container](/cli/azure/run-azure-cli-docker).

  - If you're using a local installation, sign in to the Azure CLI by using the [`az login`](/cli/azure/reference-index#az-login) command. To finish the authentication process, follow the steps displayed in your terminal. For other sign-in options, see [Sign in with the Azure CLI](/cli/azure/authenticate-azure-cli).

  - When you're prompted, install the Azure CLI extension on first use. For more information about extensions, see [Use extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

  - Run [az version](/cli/azure/reference-index?#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az-upgrade).

- This quickstart requires version 2.53.0 or later of the Azure CLI. The `az eventgrid namespace` commands come from the `eventgrid` extension, version 2.51.0 or later, which installs automatically the first time you run one of these commands. If you use Azure Cloud Shell, the latest version is already installed.

[!INCLUDE [register-provider-cli.md](~/reusable-content/ce-skilling/azure/includes/event-grid/register-provider-cli.md)]

## Create a resource group

Create an Azure resource group with the [az group create](/cli/azure/group#az-group-create) command. Use this resource group to hold all the resources you create in this quickstart.

1. Declare a variable to hold the name of an Azure resource group. Specify a name for the resource group by replacing `<your-resource-group-name>` with a value you like.

    ```azurecli-interactive
    resource_group="<your-resource-group-name>"
    ```

    ```azurecli-interactive
    location="<your-resource-group-location>"
    ```

1. Create a resource group. Change the location as you see fit.

    ```azurecli-interactive
    az group create --name $resource_group --location $location
    ```

## Create an Event Grid namespace

An Event Grid namespace provides a user-defined endpoint to which you post your events. The following example creates a namespace in your resource group by using Bash in Azure Cloud Shell. The namespace name must be unique because it's part of a Domain Name System (DNS) entry. A namespace name should meet the following rules:

- It should be between 3 and 50 characters.
- It should be regionally unique.
- Allowed characters are a-z, A-Z, 0-9, and -.
- It shouldn't start with reserved key word prefixes like `Microsoft`, `System`, or `EventGrid`.

1. Declare a variable to hold the name for your Event Grid namespace. Specify a name for the namespace by replacing `<your-namespace-name>` with a value you like.

    ```azurecli-interactive
    namespace="<your-namespace-name>"
    ```

1. Create a namespace. You might want to change the location where it's deployed.

    ```azurecli-interactive
    az eventgrid namespace create -g $resource_group -n $namespace -l $location
    ```

## Create an Event Grid namespace topic

Create a topic to hold all events published to the namespace endpoint.

1. Declare a variable to hold the name for your namespace topic. Specify a name for the namespace topic by replacing `<your-topic-name>` with a value you like.

    ```azurecli-interactive
    topic="<your-topic-name>"
    ```

1. Create your namespace topic:

    ```azurecli-interactive
    az eventgrid namespace topic create -g $resource_group -n $topic --namespace-name $namespace 
    ```

## Create a new Event Hubs resource

Create an Event Hubs resource that you use as the handler destination for the namespace topic push delivery subscription.

1. Declare a variable to hold the Event Hubs namespace name.

    ```azurecli-interactive
    eventHubsNamespace="<your-event-hubs-namespace-name>"
    ```

1. Create the Event Hubs namespace.

    ```azurecli-interactive
    az eventhubs namespace create --resource-group $resource_group --name $eventHubsNamespace --location $location
    ```

1. Declare a variable to hold the event hub name.

    ```azurecli-interactive
    eventHubsEventHub="<your-event-hub-name>"
    ```

1. Run the following command to create an event hub in the namespace.

    ```azurecli-interactive
    az eventhubs eventhub create --resource-group $resource_group --namespace-name $eventHubsNamespace --name $eventHubsEventHub
    ```
    
## Deliver events to Event Hubs by using managed identity

To deliver events to event hubs in your Event Hubs namespace by using managed identity, follow these steps:

1. Enable system-assigned or user-assigned managed identity: [namespaces](event-grid-namespace-managed-identity.md). Continue reading to the next section to find how to enable managed identity by using Azure CLI.
1. [Add the identity to the **Azure Event Hubs Data Sender** role on the Event Hubs namespace](../event-hubs/authenticate-managed-identity.md#azure-built-in-roles-for-event-hubs). To learn how to add the role assignment, see the next section.
1. [Enable the **Allow trusted Microsoft services to bypass this firewall** setting on your Event Hubs namespace](../event-hubs/event-hubs-service-endpoints.md#trusted-microsoft-services).
1. Configure the event subscription that uses an event hub as an endpoint to use the system-assigned or user-assigned managed identity.


## Enable managed identity in the Event Grid namespace

Enable system-assigned managed identity in the Event Grid namespace.

```azurecli-interactive
az eventgrid namespace update --resource-group $resource_group --name $namespace --identity "{type:SystemAssigned}"
```

## Add role assignment in Event Hubs for the Event Grid managed identity

1. Get Event Grid namespace system managed identity principal ID.

    ```azurecli-interactive
    principalId=$(az eventgrid namespace show --resource-group $resource_group --name $namespace --query identity.principalId -o tsv)
    ```

1. Get Event Hubs event hub resource ID.

    ```azurecli-interactive
    eventHubResourceId=$(az eventhubs eventhub show --resource-group $resource_group --namespace-name $eventHubsNamespace --name $eventHubsEventHub --query id -o tsv)
    ```

1. Add role assignment in Event Hubs for the Event Grid system managed identity.

    ```azurecli-interactive
    az role assignment create --role "Azure Event Hubs Data Sender" --assignee $principalId --scope $eventHubResourceId
    ```

## Create an event subscription

Create a push delivery event subscription that uses the Event Grid namespace's managed identity to deliver events to your event hub.

```azurecli-interactive
event_subscription="<your-event-subscription-name>"
```

```azurecli-interactive
az eventgrid namespace topic event-subscription create --resource-group $resource_group --namespace-name $namespace --topic-name $topic --name $event_subscription --delivery-configuration "{deliveryMode:Push,push:{maxDeliveryCount:10,deliveryWithResourceIdentity:{identity:{type:SystemAssigned},destination:{endpointType:EventHub,properties:{resourceId:$eventHubResourceId}}}}}"
```

## Send a test event to the namespace topic

Now, send a sample event to the namespace topic by following steps in this section.

### List namespace access keys

1. Get the access keys associated with the namespace you created. Use one of them to authenticate when publishing events. To list your keys, you need the full namespace resource ID first. Get it by running the following command:

    ```azurecli-interactive
    namespace_resource_id=$(az eventgrid namespace show -g $resource_group -n $namespace --query "id" --output tsv)
    ```

1. Get the first key from the namespace:

    ```azurecli-interactive
    key=$(az eventgrid namespace list-key -g $resource_group --namespace-name $namespace --query "key1" --output tsv)
    ```

### Publish an event

1. Retrieve the namespace hostname. Use it to compose the namespace HTTP endpoint to which you send events.

    ```azurecli-interactive
    publish_operation_uri="https://"$(az eventgrid namespace show -g $resource_group -n $namespace --query "topicsConfiguration.hostname" --output tsv)"/topics/"$topic:publish?api-version=2023-06-01-preview
    ```

1. Create a sample [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/formats/json-format.md) compliant event:

    ```azurecli-interactive
    event=' { "specversion": "1.0", "id": "'"$RANDOM"'", "type": "com.yourcompany.order.ordercreatedV2", "source" : "/mycontext", "subject": "orders/O-234595", "time": "'`date +%Y-%m-%dT%H:%M:%SZ`'", "datacontenttype" : "application/json", "data":{ "orderId": "O-234595", "url": "https://yourcompany.com/orders/o-234595"}} '
    ```

    The `data` element is the payload of your event. Any well-formed JSON can go in this field. For more information about properties (also known as context attributes) that can go in an event, see the [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specifications.

1. Use cURL to send the event to the topic. cURL is a utility that sends HTTP requests.

    ```azurecli-interactive
    curl -X POST -H "Content-Type: application/cloudevents+json" -H "Authorization:SharedAccessKey $key" -d "$event" $publish_operation_uri
    ```

    In the Azure portal, go to your **Event Hubs namespace** page, refresh the page, and verify that the incoming messages counter in the chart shows that an event was received.

    :::image type="content" source="./media/publish-events-using-namespace-topics-portal/event-hub-received-event.png" alt-text="Screenshot that shows the Event hub page with chart showing an event has been received." lightbox="./media/publish-events-using-namespace-topics-portal/event-hub-received-event.png":::

## Clean up resources

If you no longer need the resources that you created, delete them to avoid incurring extra charges. Delete the resource group and all the resources it contains:

```azurecli-interactive
az group delete --name $resource_group
```

## Next steps

In this quickstart, you created and configured the Event Grid namespace and Event Hubs resources, and you pushed events to an event hub. To learn how to receive events from an event hub, see these tutorials:

- [.NET Core](../event-hubs/event-hubs-dotnet-standard-getstarted-send.md)
- [Java](../event-hubs/event-hubs-java-get-started-send.md)
- [Python](../event-hubs/event-hubs-python-get-started-send.md)
- [JavaScript](../event-hubs/event-hubs-node-get-started-send.md)
- [Go](../event-hubs/event-hubs-go-get-started-send.md)
- [C (send only)](../event-hubs/event-hubs-c-getstarted-send.md)
- [Apache Storm (receive only)](../event-hubs/event-hubs-storm-getstarted-receive.md)
