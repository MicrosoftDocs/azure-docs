---
title: Message routing with IoT Hub — Azure CLI | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using Azure CLI.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/11/2022
ms.author: kgremban
---

# Message routing with IoT Hub — Azure CLI

This article shows you how to create an endpoint and route in your IoT hub, then delete your endpoint and route. You can also update a route. We use the Azure CLI to create endpoints and routes to Event Hubs, Service Bus queue, Service Bus topic, or Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage and testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure CLI**

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]
> [!NOTE]
> Azure CLI installation by default includes the Azure IoT CLI extension, however for some preview features, please upgrade the IoT CLI extension following the instructions [here](https://github.com/Azure/azure-iot-cli-extension).

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. 

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using the Azure CLI](iot-hub-create-using-cli.md).

You can choose which Azure service (Event Hubs, Service Bus queue or topic, Azure Storage, or Azure Cosmos DB) endpoint that you'd like to connect with your IoT Hub route. 

# [Event Hubs](#tab/eventhubs)

You can choose an Event Hubs resource (namespace and entity). 

### Create an Event Hubs resource with authorization rule

1. Create the Event Hubs namespace. The `name` should be unique. The location, `l`, should be your resource group region.

   ```azurecli
   az eventhubs namespace create --name my-routing-namespace --resource-group my-resource-group -l westus3
   ```

1. Create your Event hubs instance. The `name` should be unique. Use the `namespace-name` you created in the previous command.
   
   ```azurecli
   az eventhubs eventhub create --name my-event-hubs --resource-group my-resource-group --namespace-name my-routing-namespace
   ```

1. Create an authorization rule for your Event hubs resource. 

   > [!TIP]
   > The `name` parameter's value `RootManageSharedAccessKey` is the default name that allows **Manage, Send, Listen** claims (access). If you wanted to restrict the claims, give the `name` parameter your own unique name and include the `--rights` flag followed by one of the claims. For example, `--name my-name --rights Send`.

   For more information about access, see [Authorize access to Azure Event Hubs](/azure/event-hubs/authorize-access-event-hubs).

   ```azurecli
   az eventhubs eventhub authorization-rule create --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

For more information, see [Quickstart: Create an event hub using Azure CLI](/azure/event-hubs/event-hubs-quickstart-cli).

# [Service Bus queue](#tab/servicebusqueue)

You can choose a Service Bus queue resource (namespace and queue). 

### Create a Service Bus queue resource with authorization rule

Create the namespace first, followed by the Service Bus queue entity, then the authorization rule. You need an authorization rule to access the Service Bus queue resource.

1. Create a new Service Bus namespace. Use a unique `name` for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus queue. Use a unique `name` for your queue.

   ```azurecli
   az servicebus queue create --resource-group my-resource-group --namespace-name my-namespace --name my-queue
   ```

1. Create a Service Bus authorization rule. Use a unique `name` for your authorization rule.

   ```azurecli
   az servicebus queue authorization-rule create --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule --rights Listen
   ```

   For more authorization rule options, see [az servicebus queue authorization-rule create](/cli/azure/servicebus/queue/authorization-rule#az-servicebus-queue-authorization-rule-create).

For more information, see [Use the Azure CLI to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-cli).

# [Service Bus topic](#tab/servicebustopic)

You can choose a Service Bus topic resource (namespace, topic, and subscription). 

### Create a Service Bus topic resource with subscription

Create the namespace first, followed by the Service Bus topic entity, then the authorization rule. You need an authorization rule to access the Service Bus topic resource.

1. Create a new Service Bus namespace. Use a unique `name` for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus topic. Use a unique `name` for your topic.

   ```azurecli
   az servicebus topic create --resource-group my-resource-group --namespace-name my-namespace --name my-topic
   ```

1. Create a Service Bus topic subscription.

   ```azurecli
   az servicebus topic subscription create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name my-subscription
   ```

1. (Optional) If you'd like to filter messages for a subscription, create a Service Bus subscription rule. Use a unique `name` for your filter. A filter can be a SQL expression, such as "StoreId IN ('Store1','Store2','Store3')".

   ```azurecli
   az servicebus topic subscription rule create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --subscription-name my-subscription --name my-filter --filter-sql-expression "my-sql-expression"  
   ```

For more information, see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli).

# [Azure Storage](#tab/azurestorage)

You can choose an Azure Storage resource (account and container).

### Create an Azure Storage resource with container

1. Create a new storage account.
   > [!TIP]
   > Your storage name must be between 3 and 24 characters in length and use numbers and lower-case letters only. No dashes are allowed.

   ```azurecli
   az storage account create --name mystorageaccount --resource-group myresourcegroup
   ```

1. Create a new container in your storage account.

   ```azurecli
   az storage container create --name my-storage-container --account-name mystorageaccount
   ```

   You see a confirmation that your container was created in your console.
   ```azurecli
   {
   "created": true
   }
   ```

For more information, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli).

# [Cosmos DB](#tab/cosmosdb)

You can choose a Cosmos DB endpoint.

### Create an Azure Storage resource with container

1. Create a new Cosmos DB account for SQL API
   ```azurecli
   az group create --name my-resource-group --location "eastus" 
   az cosmosdb create --name my-cosmosdb-account --resource-group my-resource-group 
   ```
2. Create a Cosmos DB container
   ```azurecli
   az cosmosdb sql database create --account-name my-cosmosdb-account --resource-group my-resource-group --name my-cosmosdb-database
   az cosmosdb sql container create --account-name my-cosmosdb-account --resource-group my-resource-group --database-name my-cosmosdb-database --name my-cosmosdb-database-container --partition-key-path "/my/path"
   ```
For more information, see [Create an Azure Cosmos DB for NoSQL](/cosmos-db/scripts/cli/nosql/create).

---

## Create an endpoint

Endpoints can be used in an IoT Hub route. An endpoint can be standalone, for example you can create one for later use. However, a route needs an endpoint, so we create the endpoint first and then the route later in this article.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The Azure resource must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)

References used in the following commands:
* [az eventhubs](/cli/azure/eventhubs)
* [az iot hub](/cli/azure/iot/hub)

### Create an Event Hubs endpoint

1. List your authorization rule to get your Event Hubs connection string. Copy your connection string for later use.

   ```azurecli
   az eventhubs eventhub authorization-rule keys list --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

1. Create your custom endpoint. Use the connection string in this command that you copied in the last step. The `endpoint-type` must be `eventhub`, otherwise all other values should be your own.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-event-hub-endpoint --endpoint-type eventhub --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "my connection string"
   ```

   To see all routing endpoint options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

# [Service Bus queue](#tab/servicebusqueue)

References used in the following commands:
* [az servicebus](/cli/azure/servicebus)
* [az iot hub](/cli/azure/iot/hub)

### Create a Service Bus queue endpoint

1. List your authorization rule keys to get your Service Bus queue connection string. Copy your connection string for later use.

   ```azurecli
   az servicebus queue authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule
   ```

1. Create a new Service Bus queue endpoint. The `endpoint-type` must be `servicebusqueue`, otherwise all parameters should have your own values.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-queue-endpoint --endpoint-type servicebusqueue --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>"
   ```

# [Service Bus topic](#tab/servicebustopic)

References used in the following commands:
* [az servicebus](/cli/azure/servicebus)
* [az iot hub](/cli/azure/iot/hub)

### Create a Service Bus topic endpoint

1. List your authorization rule keys to get your Service Bus topic connection string. Copy your connection string for later use. The default name of your authorization rule that comes with a new namespace is **RootManageSharedAccessKey**.

   ```azurecli
   az servicebus topic authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name RootManageSharedAccessKey
   ```

1. Create a new Service Bus topic endpoint. The `endpoint-type` must be `servicebustopic`, otherwise all parameters should have your own values. Replace `Endpoint=<my connection string>` with the connection string you copied from the previous step. Add `;EntityPath=my-service-bus-topic` to the end of your connection string. Since we didn't create a custom authorization rule, the namespace connection string doesn't include the entity path information, but the entity path is required to make a Service Bus topic endpoint. Replace the `my-service-bus-topic` part of the entity path string with the name of your Service Bus topic.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-topic-endpoint --endpoint-type servicebustopic --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>;EntityPath=my-service-bus-topic"
   ```

# [Azure Storage](#tab/azurestorage)

References used in the following commands:
* [az storage](/cli/azure/storage)
* [az iot hub](/cli/azure/iot/hub)

### Create an Azure Storage endpoint

1. You need the connection string from your Azure Storage resource to create an endpoint. Get the string using the `show-connection-string` command and copy it for the next step.

   ```azurecli
   az storage account show-connection-string --resource-group my-resource-group --name my-storage-account 
   ```

1. Create a new Azure Storage endpoint. The `endpoint-type` must be `azurestoragecontainer`, otherwise all parameters should have your own values. Use the connection string you copied from the previous step.

   ```azurecli
   az iot hub routing-endpoint create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --endpoint-type azurestoragecontainer --container my-storage-container --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --connection-string "DefaultEndpointsProtocol=<my connection string>"
   ```

   For more parameter options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

# [Cosmos DB](#tab/cosmosdb)

References used in the following commands:
* [az cosmosdb](/cli/azure/cosmosdb)
* [az iot hub](/cli/azure/iot/hub)

### Create a Cosmos DB endpoint

1. Find the Cosmos DB connection string and copy for later use.

   ```azurecli
   az cosmosdb keys list --name my-cosmosdb-account --resource-group my-resource-group --type connection-strings
   ```

1. Create your custom endpoint. Use the connection string in this command that you copied in the last step. The `endpoint-type` must be `eventhub`, otherwise all other values should be your own.

   ```azurecli
   az iot hub message-endpoint cosmosdb-collection create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-cosmosdb-endpoint --endpoint-account my-cosmosdb-account --database-name my-cosmosdb-database --container my-cosmosdb-database-container --connection-string "copied-connection-string"
   ```
> [!NOTE]
> If you are using managed identities instead of connection string, you have to use the following command to authenticate your identity to the CosmosDB account.
   To see all routing endpoint options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).
   
   ```azurecli
   az cosmosdb sql role assignment create -a my-cosmosdb-account -g my-resource-group --scope '/' -n 'Cosmos DB Built-in Data Contributor' -p "IoT Hub System Assigned or User Assigned Identity"
   ```
---

## Create an IoT Hub route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Optionally, you can [Add queries to message routes](iot-hub-devguide-routing-query-syntax.md) to filter messages or events before they go to the endpoint.

# [Event Hubs](#tab/eventhubs)

1. With your existing Event Hubs endpoint, create a new IoT Hub route, using that endpoint. Use the endpoint name for `endpoint`. Use a unique name for `route-name`.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-event-hub-endpoint --hub-name my-iot-hub --route-name my-event-hub-route --source deviceconnectionstateevents
   ```

1. A new route should show in your IoT hub. Run this command to confirm the route is there.

   ```azurecli
   az iot hub route list -g my-resource-group --hub-name my-iot-hub
   ```
   
   You should see a similar response in your console.

   ```json
   [
      {
        "condition": "true",
        "endpointNames": [
          "my-event-hub-endpoint"
        ],
        "isEnabled": true,
        "name": "my-event-hub-route",
        "source": "DeviceConnectionStateEvents"
      }
   ]
   ```

# [Service Bus queue](#tab/servicebusqueue)

1. With your existing Service Bus queue endpoint, create a new IoT Hub route, using that endpoint. Use the endpoint name for `endpoint`. Use a unique name for `route-name`.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-queue-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. List your IoT hub routes to confirm your new Service Bus queue route.

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see something similar in your Azure CLI.

   ```json
     {
        "condition": "true",
        "endpointNames": [
          "my-service-bus-queue-endpoint"
        ],
        "isEnabled": true,
        "name": "my-service-bus-queue-route",
        "source": "DeviceConnectionStateEvents"
      }
   ```

# [Service Bus topic](#tab/servicebustopic)

1. With your existing Service Bus topic endpoint, create a new IoT Hub route, using that endpoint. Use the endpoint name for `endpoint`. Use a unique name for `route-name`.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-topic-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. List your IoT hub routes to confirm your new Service Bus topic route.

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see something similar in your Azure CLI.

   ```json
     {
        "condition": "true",
        "endpointNames": [
          "my-service-bus-topic-endpoint"
        ],
        "isEnabled": true,
        "name": "my-service-bus-topic-route",
        "source": "DeviceConnectionStateEvents"
      }
   ```

# [Azure Storage](#tab/azurestorage)

1. With your existing Azure storage endpoint, create a new IoT Hub route, using that endpoint. Use the endpoint name for `endpoint`. Use a unique name for `route-name`.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --source deviceconnectionstateevents --route-name my-route
   ```

1. Confirm that your new route is in your IoT hub.

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see something similar in your Azure CLI.

   ```json
     {
        "condition": "true",
        "endpointNames": [
          "my-storage-endpoint"
        ],
        "isEnabled": true,
        "name": "my-storage-route",
        "source": "DeviceConnectionStateEvents"
      }
   ```
# [Cosmos DB](#tab/cosmosdb)

1. With your existing Cosmos DB endpoint, create a new IoT Hub route, using that endpoint. Use the endpoint name for `endpoint`. Use a unique name for `route-name`.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-cosmosdb-endpoint --hub-name my-iot-hub --route-name my-cosmosdb-route --source deviceconnectionstateevents
   ```

1. A new route should show in your IoT hub. Run this command to confirm the route is there.

   ```azurecli
   az iot hub route list -g my-resource-group --hub-name my-iot-hub
   ```
   
   You should see a similar response in your console.

   ```json
   [
      {
        "condition": "true",
        "endpointNames": [
          "my-cosmosdb-endpoint"
        ],
        "isEnabled": true,
        "name": "my-cosmosdb-route",
        "source": "DeviceConnectionStateEvents"
      }
   ]
   ```
---

### Update an IoT Hub route

With an IoT Hub route, no matter the type of endpoint, you can update some properties of the route.

1. To change a parameter, use the [az iot hub route update](/cli/azure/iot/hub/route#az-iot-hub-route-update) command. For example, you can change `source` from `deviceconnectionstateevents` to `devicejoblifecycleevents`.

   ```azurecli
   az iot hub route update --resource-group my-resource-group --hub-name my-iot-hub --source devicejoblifecycleevents --route-name my-route
   ```

1. Use the `az iot hub route show` command to confirm the change in your route.

   ```azurecli
   az iot hub route show --resource-group my-resource-group --hub-name my-iot-hub --route-name my-route
   ```

### Delete an endpoint

```azurecli
az iot hub routing-endpoint delete --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-endpoint 
```

### Delete an IoT Hub route

```azurecli
az iot hub route delete --resource-group my-resource-group --hub-name my-iot-hub --route-name my-route
```

> [!TIP]
> Deleting a route won't delete endpoints in your Azure account. The endpoints must be deleted separately.


## Next Steps

In this how-to article you learned how to create a route and endpoint for your Event Hubs, Service Bus queue or topic, and Azure Storage. 

To further your exploration into message routing, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=cli). In this tutorial, you'll create a storage route and test it with a device in your IoT hub.
