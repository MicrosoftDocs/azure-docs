---
title: Create and delete routes and endpoints by using the Azure CLI
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using the Azure CLI.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 12/15/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using the Azure CLI

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use the Azure CLI to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=cli).

## Prerequisites

The procedures that are described in the article use the following resources:

* The Azure CLI
* An IoT hub
* An endpoint service in Azure

### Azure CLI

This article uses the Azure CLI to work with IoT Hub and other Azure services. You can choose how you access the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

### IoT hub

To create an IoT hub route, you need an IoT hub that you created by using Azure IoT Hub. Device messages and event logs originate in your IoT hub.

Be sure to have the following hub resource to use when you create your IoT hub route:

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using the Azure CLI](iot-hub-create-using-cli.md).

### Endpoint service

To create an IoT hub route, you need at least one other Azure service to use as an endpoint to the route. The endpoint receives device messages and event logs. You can choose which Azure service you use for an endpoint to connect with your IoT hub route: Event Hubs, Service Bus queues or topics, or Azure Storage. The service that you use to create your endpoint must first exist in your Azure account.

Decide which route type you want to create: an event hub, a Service queue or topic, or a storage account. For the service you choose to use, complete the steps to create an endpoint service.

# [Event Hubs](#tab/eventhubs)

You can choose an Event Hubs resource (namespace and entity).

### Create an Event Hubs resource with authorization rule

1. Create the Event Hubs namespace. For `name`, use a unique value. For `l` (location), use your resource group region.

   ```azurecli
   az eventhubs namespace create --name my-routing-namespace --resource-group my-resource-group -l westus3
   ```

1. Create your Event Hubs instance. For `name`, use a unique value. For `namespace-name`, use the namespace you created in the preceding command.

   ```azurecli
   az eventhubs eventhub create --name my-event-hubs --resource-group my-resource-group --namespace-name my-routing-namespace
   ```

1. Create an authorization rule for your Event Hubs resource.

   > [!TIP]
   > The `name` parameter's value `RootManageSharedAccessKey` is the default name that allows **Manage, Send, Listen** claims (access). If you want to restrict the claims, give the `name` parameter your own unique name and include the `--rights` flag followed by one of the claims. For example, `--name my-name --rights Send`.

   For more information about access, see [Authorize access to Azure Event Hubs](/azure/event-hubs/authorize-access-event-hubs).

   ```azurecli
   az eventhubs eventhub authorization-rule create --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

For more information, see [Quickstart: Create an event hub by using the Azure CLI](/azure/event-hubs/event-hubs-quickstart-cli).

# [Service Bus queue](#tab/servicebusqueue)

You can choose a Service Bus queue resource (namespace and queue).

### Create a Service Bus queue resource with authorization rule

To create a Service bus queue resource with a subscription, you need an authorization rule to access the Service Bus queue.

Create your Service Bus queue resources in this order:

1. Create the namespace.
1. Create the Service Bus queue entity.
1. Create the authorization rule.

To create Service Bus queue resources:

1. Create a new Service Bus namespace. For `name`, use a unique value for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus queue. For `name`, use a unique value for your queue.

   ```azurecli
   az servicebus queue create --resource-group my-resource-group --namespace-name my-namespace --name my-queue
   ```

1. Create a Service Bus authorization rule. For `name`, use a unique value for your authorization rule.

   ```azurecli
   az servicebus queue authorization-rule create --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule --rights Listen
   ```

   For more authorization rule options, see [az servicebus queue authorization-rule create](/cli/azure/servicebus/queue/authorization-rule#az-servicebus-queue-authorization-rule-create).

For more information, see [Use the Azure CLI to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-cli).

# [Service Bus topic](#tab/servicebustopic)

You can choose a Service Bus topic resource (namespace, topic, and subscription).

### Create a Service Bus topic resource with subscription

To create a Service Bus topic resource with a subscription, you need an authorization rule to access the Service Bus topic.

Create your Service Bus topic resources in this order:

1. Create the namespace.
1. Create the Service Bus topic entity.
1. Create the authorization rule.

To create Service Bus topic resources:

1. Create a new Service Bus namespace. For `name`, use a unique value for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus topic. For `name`, use a unique value for your topic.

   ```azurecli
   az servicebus topic create --resource-group my-resource-group --namespace-name my-namespace --name my-topic
   ```

1. Create a Service Bus topic subscription.

   ```azurecli
   az servicebus topic subscription create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name my-subscription
   ```

1. (Optional) If you'd like to filter messages for a subscription, create a Service Bus subscription rule. For `name`, use a unique value for your filter. A filter can be a SQL expression, such as `StoreId IN ('Store1','Store2','Store3')`.

   ```azurecli
   az servicebus topic subscription rule create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --subscription-name my-subscription --name my-filter --filter-sql-expression "my-sql-expression"  
   ```

For more information, see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli).

# [Azure Storage](#tab/azurestorage)

You can choose an Azure Storage resource (account and container).

### Create an Azure Storage resource with container

1. Create a new storage account.

   > [!TIP]
   > Your storage name must be between 3 and 24 characters in length and contain only numbers and lowercase letters. Dashes aren't allowed.

   ```azurecli
   az storage account create --name mystorageaccount --resource-group myresourcegroup
   ```

1. Create a new container in your storage account.

   ```azurecli
   az storage container create --name my-storage-container --account-name mystorageaccount
   ```

   You should see a response in the Azure CLI that's similar to this example:
  
   ```azurecli
   {
   "created": true
   }
   ```

For more information, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli).

---

## Create an endpoint

You can use endpoints in an IoT Hub route. An endpoint can be standalone. For example, you can create one to use in the future. However, a route needs an endpoint. In this article, you create the endpoint first, and then create the route later.

You can use an event hub, a Service Bus queue or topic, or a Storage account as the endpoint for your IoT hub route. An instance of the service that you use for your endpoint must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)

The commands in the following procedures use these references:

* [az eventhubs](/cli/azure/eventhubs)
* [az iot hub](/cli/azure/iot/hub)

### Create an Event Hubs endpoint

1. List your authorization rule to get your Event Hubs connection string. Copy your connection string to use later.

   ```azurecli
   az eventhubs eventhub authorization-rule keys list --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

1. Create your custom endpoint. Use the connection string in this command that you copied in the preceding step. The value for `endpoint-type` must be `eventhub`. For all other parameters, use values for your scenario.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-event-hub-endpoint --endpoint-type eventhub --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "my connection string"
   ```

   For a list of all routing endpoint options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

# [Service Bus queue](#tab/servicebusqueue)

The commands in the following procedures use these references:

* [az servicebus](/cli/azure/servicebus)
* [az iot hub](/cli/azure/iot/hub)

### Create a Service Bus queue endpoint

1. List your authorization rule keys to get your Service Bus queue connection string. Copy your connection string to use later.

   ```azurecli
   az servicebus queue authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule
   ```

1. Create a new Service Bus queue endpoint. The `endpoint-type` must be `servicebusqueue`, otherwise all parameters should have your own values.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-queue-endpoint --endpoint-type servicebusqueue --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>"
   ```

# [Service Bus topic](#tab/servicebustopic)

The commands in the following procedures use these references:

* [az servicebus](/cli/azure/servicebus)
* [az iot hub](/cli/azure/iot/hub)

### Create a Service Bus topic endpoint

1. List your authorization rule keys to get your Service Bus topic connection string. Copy your connection string to use later. The default name of your authorization rule that comes with a new namespace is `RootManageSharedAccessKey`.

   ```azurecli
   az servicebus topic authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name RootManageSharedAccessKey
   ```

1. Create a new Service Bus topic endpoint. The `endpoint-type` must be `servicebustopic`. For all other parameters, use values for your scenario. Replace `Endpoint=<my connection string>` with the connection string you copied in the preceding step. Add `;EntityPath=my-service-bus-topic` to the end of your connection string.

   Because you don't create a custom authorization rule in this article, the namespace connection string doesn't include the entity path information. But, the entity path is required to make a Service Bus topic endpoint. In the entity path string, replace `my-service-bus-topic` with the name of your Service Bus topic.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-topic-endpoint --endpoint-type servicebustopic --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>;EntityPath=my-service-bus-topic"
   ```

# [Azure Storage](#tab/azurestorage)

The commands in the following procedures use these references:

* [az storage](/cli/azure/storage)
* [az iot hub](/cli/azure/iot/hub)

### Create an Azure Storage endpoint

1. You need the connection string from your Azure Storage resource to create an endpoint. To get the string, run the `show-connection-string` command. Copy the connection string to use it in the next step.

   ```azurecli
   az storage account show-connection-string --resource-group my-resource-group --name my-storage-account 
   ```

1. Create a new Azure Storage endpoint. The value for `endpoint-type` must be `azurestoragecontainer`. For all other parameters, use values for your scenario. Use the connection string you copied in the preceding step.

   ```azurecli
   az iot hub routing-endpoint create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --endpoint-type azurestoragecontainer --container my-storage-container --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --connection-string "DefaultEndpointsProtocol=<my connection string>"
   ```

   For more parameter options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

---

## Create an IoT Hub route

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Optionally, you can [Add queries to message routes](iot-hub-devguide-routing-query-syntax.md) to filter messages or events before they go to the endpoint.

# [Event Hubs](#tab/eventhubs)

1. With your existing Event Hubs endpoint, create a new IoT Hub route by using that endpoint. For `endpoint`, use the endpoint name. For `route-name`, use a unique value.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`. Choose a different option for your custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-event-hub-endpoint --hub-name my-iot-hub --route-name my-event-hub-route --source deviceconnectionstateevents
   ```

1. To confirm that the new route is in your IoT hub, run this command:

   ```azurecli
   az iot hub route list -g my-resource-group --hub-name my-iot-hub
   ```

   You should see a response in the Azure CLI that's similar to this example:

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

1. With your existing Service Bus queue endpoint, create a new IoT Hub route by using that endpoint. For `endpoint`, use the endpoint name. For `route-name`, use a unique value.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`. Choose a different option for your custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-queue-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. To confirm that your new Service Bus queue route was created, list your IoT hub routes:

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see a response in the Azure CLI that's similar to this example:

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

1. With your existing Service Bus topic endpoint, create a new IoT Hub route by using that endpoint. For `endpoint`, use the endpoint name. For `route-name`, use a unique value.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`. Choose a different option for your custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-topic-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. To confirm that your new Service Bus topic route was created, list your IoT hub routes:

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see a response in the Azure CLI that's similar to this example:

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

1. With your existing Azure storage endpoint, create a new IoT Hub route by using that endpoint. For `endpoint`, use the endpoint name. For `route-name`, use a unique value.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`. Choose a different option for your custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --source deviceconnectionstateevents --route-name my-route
   ```

1. To confirm that your new route is in your IoT hub, run this command:

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

   You should see a response in the Azure CLI that's similar to this example:

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

---

### Update an IoT Hub route

With an IoT Hub route, no matter what type of endpoint you create, you can update some properties of the route.

1. To change a parameter, use the [az iot hub route update](/cli/azure/iot/hub/route#az-iot-hub-route-update) command. For example, you can change `source` from `deviceconnectionstateevents` to `devicejoblifecycleevents`.

   ```azurecli
   az iot hub route update --resource-group my-resource-group --hub-name my-iot-hub --source devicejoblifecycleevents --route-name my-route
   ```

1. Use the `az iot hub route show` command to confirm the change in your route.

   ```azurecli
   az iot hub route show --resource-group my-resource-group --hub-name my-iot-hub --route-name my-route
   ```

### Delete an endpoint

To delete an endpoint:

```azurecli
az iot hub routing-endpoint delete --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-endpoint 
```

### Delete an IoT Hub route

To delete an IoT Hub route:

```azurecli
az iot hub route delete --resource-group my-resource-group --hub-name my-iot-hub --route-name my-route
```

> [!TIP]
> Deleting a route doesn't delete any endpoints in your Azure account. You must delete an endpoint separately from deleting a route.

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, Service Bus queues and topics, and Azure Storage.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=cli). In the tutorial, you create a storage route and test it with a device in your IoT hub.
