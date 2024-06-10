---
title: Manage routes and endpoints with the Azure CLI
titleSuffix: Azure IoT Hub
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using the message-endpoints and message-routes Azure CLI commands.
author: kgremban
ms.service: iot-hub
ms.custom: devx-track-azurecli
services: iot-hub
ms.topic: how-to
ms.date: 02/03/2023
ms.author: kgremban
---

# Create and delete routes and endpoints by using the Azure CLI

This article shows you how to manage Azure IoT Hub routes and endpoints by using the Azure CLI. Learn how to use the Azure CLI to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, Azure Storage, and Cosmos DB.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](./iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=cli).

## Prerequisites

The procedures that are described in the article use the following resources:

* The Azure CLI
* An IoT hub
* An endpoint service in Azure

### Azure CLI

This article uses the Azure CLI to work with IoT Hub and other Azure services. You can choose how you access the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

### IoT Hub

You need an IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using the Azure CLI](iot-hub-create-using-cli.md).

### Endpoint service

You need at least one other Azure service to use as an endpoint to the route. The endpoint receives device messages and event logs.

Decide which Azure service you want to use as an endpoint to receive routed device and event data: an event hub, a Service queue or topic, a storage account, or a Cosmos DB container. For the service you choose to use, complete the steps to create an endpoint service.

# [Event Hubs](#tab/eventhubs)

1. Create an Event Hubs namespace and an event hub. For more information, see [Quickstart: Create an event hub by using the Azure CLI](../event-hubs/event-hubs-quickstart-cli.md).

1. Create an authorization rule that will be used to give IoT Hub permission to send data to the event hub.

   > [!TIP]
   > The `name` parameter's value `RootManageSharedAccessKey` is the default name that allows **Manage, Send, Listen** claims (access). If you want to restrict the claims, give the `name` parameter your own unique name and include the `--rights` flag followed by one of the claims. For example, `--name my-name --rights Send`.

   ```azurecli
   az eventhubs eventhub authorization-rule create --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

   For more information, see [Authorize access to Azure Event Hubs](../event-hubs/authorize-access-event-hubs.md).

# [Service Bus queue](#tab/servicebusqueue)

1. Create a Service Bus namespace and queue. For more information, see [Use the Azure CLI to create a Service Bus namespace and a queue](../service-bus-messaging/service-bus-quickstart-cli.md).

1. Create an authorization rule that will give IoT Hub permission to send data to the queue. For `name`, use a unique value for your authorization rule.

   ```azurecli
   az servicebus queue authorization-rule create --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule --rights Listen
   ```

   For more authorization rule options, see [az servicebus queue authorization-rule create](/cli/azure/servicebus/queue/authorization-rule#az-servicebus-queue-authorization-rule-create).

# [Service Bus topic](#tab/servicebustopic)

Create a Service Bus namespace, topic, and subscription. For more information, see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](../service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli.md).

# [Azure Storage](#tab/azurestorage)

1. Create a storage account. For more information, see [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-cli).

1. Create a container in your storage account. For more information, see [Manage blob containers using Azure CLI](../storage/blobs/blob-containers-cli.md)

# [Cosmos DB](#tab/cosmosdb)

Create a Cosmos DB account for SQL API and a Cosmos DB container. For more information, see [Create an Azure Cosmos DB for NoSQL](../cosmos-db/scripts/cli/nosql/create.md).

---

## Create an endpoint

All IoT Hub routes point to an endpoint, which will receive the routed device and event data. More than one route can point to the same endpoint. Currently, IoT Hub supports endpoints for Event hubs, Service Bus queues or topics, Storage, and Cosmos DB. An instance of the service that you use for your endpoint must exist in your Azure subscription before you create the endpoint.

> [!NOTE]
> This article uses the [az iot hub message-endpoint](/cli/azure/iot/hub/message-endpoint) command group, which was introduced in version 0.19.0 of the azure-iot extension for the Azure CLI. Previous versions of the azure-iot extension used the [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint) command group, which is similar and still supported but does not support creating Cosmos DB endpoints.
>
> Use the following command to update to the latest version of the azure-iot extension:
>
> ```azurecli
> az extension update --name azure-iot
> ```

# [Event Hubs](#tab/eventhubs)

To create an Event Hubs endpoint, use the authorization rule that you created in the prerequisites.

1. Use the [az eventhubs eventhub authorization-rule keys list](/cli/azure/eventhubs/eventhub/authorization-rule/keys#az-eventhubs-eventhub-authorization-rule-keys-list) command to list your authorization rule. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *eventhub_group* | Resource group of the event hub. |
   | *eventhub_namespace* | Name of the Event Hubs namespace. |
   | *eventhub_name* | Name of the event hub. |
   | *rule_name* | The name of the authorization rule for the event hub. If you copied the example in the prerequisites, this name is `RootManageSharedAccessKey`. |

   ```azurecli
   az eventhubs eventhub authorization-rule keys list --resource-group {eventhub_group} --namespace-name {eventhub_namespace} --eventhub-name my-event-hubs --name {rule_name}
   ```

1. Copy your event hub connection string from the output.

1. Use the [az iot hub message-endpoint create eventhub](/cli/azure/iot/hub/message-endpoint/create#az-iot-hub-message-endpoint-create-eventhub) command to create your custom endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this endpoint is being created. |
   | *endpoint_name*    | A unique name for the new endpoint. |
   | *eventhub_subscription* | Subscription ID of the event hub. This argument can be left out if the event hub is in the same subscription as the IoT hub. |
   | *eventhub_group* | Resource group of the event hub. This argument can be left out if the event hub is in the same resource group as the IoT hub. |
   | *eventhub_connection_string* | The connection string that you copied from the event hub authorization rule. |

   ```azurecli
   az iot hub message-endpoint create eventhub --hub-name {iothub_name} --endpoint-name {endpoint_name}  --connection-string "{eventhub_connection_string}" --endpoint-subscription-id {eventhub_subscription} --endpoint-resource-group {eventhub_group}
   ```

# [Service Bus queue](#tab/servicebusqueue)

To create a Service Bus queue endpoint, use the authorization rule that you created in the prerequisites.

1. Use the [az servicebus queue authorization-rule keys list](/cli/azure/servicebus/queue/authorization-rule/keys#az-servicebus-queue-authorization-rule-keys-list) command to get your Service Bus queue connection string. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *queue_group* | Resource group of the Service Bus queue. |
   | *queue_namespace* | Name of the Service Bus queue namespace. |
   | *queue_name* | Name of the queue. |
   | *rule_name* | The name of the authorization rule for the queue. If you copied the example in the prerequisites, this name is `my-auth-rule`. |

   ```azurecli
   az servicebus queue authorization-rule keys list --resource-group {queue_group} --namespace-name {queue_namespace} --queue-name {queue_name} --name {rule_name}
   ```

1. Copy your Service Bus queue connection string from the output.

1. Use the [az iot hub message-endpoint create servicebus-queue](/cli/azure/iot/hub/message-endpoint/create#az-iot-hub-message-endpoint-create-servicebus-queue) command to create your custom endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this endpoint is being created. |
   | *endpoint_name*    | A unique name for the new endpoint. |
   | *queue_connection_string* | The connection string that you copied from the Service Bus queue authorization rule. |
   | *queue_subscription* | Subscription ID of the Service Bus queue. This argument can be left out if the queue is in the same subscription as the IoT hub. |
   | *queue_group* | Resource group of the Service Bus queue. This argument can be left out if the queue is in the same resource group as the IoT hub. |

   ```azurecli
   az iot hub message-endpoint create servicebus-queue --hub-name {iothub_name} --endpoint-name {endpoint_name} --connection-string "Endpoint={queue_connection_string}" --endpoint-resource-group {queue_group} --endpoint-subscription-id {queue_subscription}
   ```

# [Service Bus topic](#tab/servicebustopic)

1. Use the [az servicebus topic authorization-rule keys list](/cli/azure/servicebus/topic/authorization-rule/keys#az-servicebus-topic-authorization-rule-keys-list) to get your Service Bus topic connection string. The default name of your authorization rule that comes with a new namespace is `RootManageSharedAccessKey`. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *topic_group* | Resource group of the Service Bus topic. |
   | *topic_namespace* | Name of the Service Bus topic namespace. |
   | *topic_name* | Name of the topic. |

   ```azurecli
   az servicebus topic authorization-rule keys list --resource-group {topic_group} --namespace-name {topic_namespace} --topic-name {topic_name} --name RootManageSharedAccessKey
   ```

1. Copy your Service Bus topic connection string from the output.

1. Use the [az iot hub message-endpoint create servicebus-topic](/cli/azure/iot/hub/message-endpoint/create#az-iot-hub-message-endpoint-create-servicebus-topic) command to create your custom endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this endpoint is being created. |
   | *endpoint_name*    | A unique name for the new endpoint. |
   | *topic_connection_string* | The connection string that you copied from the Service Bus topic authorization rule. |
   | *topic_subscription* | Subscription ID of the Service Bus topic. This argument can be left out if the topic is in the same subscription as the IoT hub. |
   | *topic_group* | Resource group of the Service Bus topic. This argument can be left out if the topic is in the same resource group as the IoT hub. |

   ```azurecli
   az iot hub message-endpoint create servicebus-topic --hub-name {iothub_name} --endpoint-name {endpoint_name} --connection-string "Endpoint={topic_connection_string};EntityPath=my-service-bus-topic --endpoint-resource-group {topic_group} --endpoint-subscription-id {topic_subscription}
   ```

# [Azure Storage](#tab/azurestorage)

1. Use the [az storage account show-connection-string](/cli/azure/storage/account#az-storage-account-show-connection-string) command to get the connection string from your Azure Storage resource to create an endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *storage_group* | Resource group of the storage account. |
   | *storage_name* | Name of the storage account. |

   ```azurecli
   az storage account show-connection-string --resource-group my-resource-group --name my-storage-account 
   ```

1. Copy your storage account connection string from the output.

1. Use the [az iot hub message-endpoint create storage-container](/cli/azure/iot/hub/message-endpoint/create#az-iot-hub-message-endpoint-create-storage-container) command to create a new Azure Storage endpoint. For all other parameters, use values for your scenario. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this endpoint is being created. |
   | *endpoint_name*    | A unique name for the new endpoint. |
   | *storage_connection_string* | The connection string that you copied from the storage account command. |
   | *container_name* | The name of the container in your storage account where the data will be sent. |
   | *storage_subscription* | Subscription ID of the Service Bus storage. This argument can be left out if the storage is in the same subscription as the IoT hub. |
   | *storage_group* | Resource group of the Service Bus storage. This argument can be left out if the topic is in the same resource group as the IoT hub. |

   ```azurecli
   az iot hub message-endpoint create storage-container--hub-name {iothub_name} --endpoint-name {endpoint_name} --container {container_name} --endpoint-resource-group {storage_group} --connection-string "DefaultEndpointsProtocol={storage_connection_string}" --endpoint-subscription-id {storage_subscription} --resource-group {storage_group}
   ```

# [Cosmos DB](#tab/cosmosdb)

1. Use the [az cosmosdb keys list](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command to get the connection string from your Cosmos DB database account.

   ```azurecli
   az cosmosdb keys list --name my-cosmosdb-account --resource-group my-resource-group --type connection-strings
   ```

1. Copy your Cosmos DB connection string from the output.

1. Use the [az iot hub message-endpoint create cosmosdb-container](/cli/azure/iot/hub/message-endpoint/create#az-iot-hub-message-endpoint-create-cosmosdb-container) command to create your custom endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this endpoint is being created. |
   | *endpoint_name*    | A unique name for the new endpoint. |
   | *cosmosdb_connection_string* | The connection string that you copied from the Cosmos DB account command. |
   | *container_name* | The name of the container in your Cosmos DB account where the data will be sent. |
   | *database_name* | The name of the database in your Cosmos DB account where the data will be sent. |
   | *cosmosdb_subscription* | Subscription ID of the Cosmos DB database account. This argument can be left out if the database is in the same subscription as the IoT hub. |
   | *cosmosdb_group* | Resource group of the Cosmos DB database account. This argument can be left out if the database is in the same resource group as the IoT hub. |

   ```azurecli
   az iot hub message-endpoint create cosmosdb-container --hub-name {iothub_name} --endpoint-name {endpoint_name} --connection-string "{cosmosdb_connection_string}" --container {container_name} --database-name {database_name} --resource-group my-resource-group --endpoint-account my-cosmosdb-account --container my-cosmosdb-database-container
   ```

   > [!NOTE]
   > If you are using managed identities instead of connection string, use the [az cosmosdb sql role assignment create](/cli/azure/cosmosdb/sql/role/assignment#az-cosmosdb-sql-role-assignment-create) command to authenticate your identity to the Cosmos DB account.
   >
   >```azurecli
   >az cosmosdb sql role assignment create -a my-cosmosdb-account -g my-resource-group --scope '/' -n 'Cosmos DB Built-in Data Contributor' -p "IoT Hub System Assigned or User Assigned Identity"
   >```

---

## Delete an endpoint

If you want to delete an endpoint from your IoT hub, use the [az iot hub message-endpoint delete](/cli/azure/iot/hub/message-endpoint#az-iot-hub-message-endpoint-delete) command. With this command, you can delete a single endpoint, delete all endpoints of a single type, or delete all endpoints from a hub.

For example, the following command deletes all endpoints in an IoT hub that point to Storage resources:

```azurecli
az iot hub message-endpoint delete --hub-name {iothub_name} --endpoint-type storage-container
```

## Create an IoT Hub route

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Optionally, you can [Add queries to message routes](iot-hub-devguide-routing-query-syntax.md) to filter messages or events before they go to the endpoint.

> [!NOTE]
> This article uses the [az iot hub message-route](/cli/azure/iot/hub/message-route) command group, which was introduced in version 0.19.0 of the azure-iot extension for the Azure CLI. Previous versions of the azure-iot extension used the [az iot hub route](/cli/azure/iot/hub/route) command group, which is similar and still supported.
>
> Use the following command to update to the latest version of the azure-iot extension:
>
> ```azurecli
> az extension update --name azure-iot
> ```

1. Use the [az iot hub message-route create](/cli/azure/iot/hub/message-route#az-iot-hub-route-create) command to create a new IoT Hub route by using that endpoint. Provide the following values for the placeholder parameters:

   | parameter | value |
   | --------- | ----- |
   | *iothub_name* | The name of the IoT hub where this route is being created. |
   | *route_name* | A unique name for the new route. |
   | *endpoint_name* | The name of the endpoint that the route will send data to. |
   | *data_source* | The source of the route. Accepted values are: `deviceconnectionstateevents`, `devicejoblifecycleevents`, `devicelifecycleevents`, `devicemessages`, `digitaltwinchangeevents`, `invalid`, or `twinchangeevents`. |

   ```azurecli
   az iot hub message-route create --hub-name {iothub_name} --route-name {route_name} --endpoint-name {endpoint_name} --source {data_source}
   ```

1. To confirm that the new route is in your IoT hub, use the [az iot hub message-route list](/cli/azure/iot/hub/message-route#az-iot-hub-message-route-list) command to see all routes in your IoT hub:

   ```azurecli
   az iot hub message-route list --hub-name {iothub_name}
   ```

   You should see a response in the Azure CLI that's similar to this example:

   ```json
   [
      {
        "condition": "true",
        "endpointNames": [
          "endpoint_name"
        ],
        "isEnabled": true,
        "name": "route_name",
        "source": "DeviceConnectionStateEvents"
      }
   ]
   ```

## Update an IoT Hub route

You can update some properties of a route after it's created. You can change the source, endpoint, condition, or enabled state of an existing route.

Use the [az iot hub message-route show](/cli/azure/iot/hub/message-route#az-iot-hub-message-route-show) command to view the details of a route.

   ```azurecli
   az iot hub message-route show --hub-name {iothub_name} --route-name {route_name}
   ```

Use the [az iot hub message-route update](/cli/azure/iot/hub/message-route#az-iot-hub-message-route-update) command to update the properties of a route. For example, the following command updates the route's source.

   ```azurecli
   az iot hub message-route update --hub-name {iothub_name} --route-name {route_name} --source devicejoblifecycleevents
   ```

## Delete an IoT Hub route

Use the [az iot hub message-route delete](/cli/azure/iot/hub/message-route#az-iot-hub-message-route-delete) command to delete a route from your IoT hub.

Deleting a route doesn't delete its endpoint because other routes may point to the same endpoint. If you want to delete an endpoint, you can do so separately from deleting a route.

```azurecli
az iot hub message-route delete --hub-name {iothub_name} --route-name {route_name}
```

## Manage the fallback route

The fallback route sends all the messages from `devicemessages` source that don't satisfy query conditions on any of the existing routes to the built-in endpoint.

Use the [az iot hub message-route fallback show](/cli/azure/iot/hub/message-route/fallback#az-iot-hub-message-route-fallback-show) command to see the status of the fallback route in your IoT hub.

```azurecli
az iot hub message-route fallback show --hub-name {iothub_name}
```

Use the [az iot hub message-route fallback set](/cli/azure/iot/hub/message-route/fallback#az-iot-hub-message-route-fallback-set) command to enable or disable the fallback route in your IoT hub.

```azurecli
az iot hub message-route fallback set --hub-name {iothub_name} --enabled {true_false}
```

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, Service Bus queues and topics, and Azure Storage.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=cli). In the tutorial, you create a storage route and test it with a device in your IoT hub.
