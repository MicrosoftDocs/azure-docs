---
title: Create message routing and endpoints — Azure CLI | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using Azure CLI.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 10/28/2022
ms.author: kgremban
---

# Message routing with IoT Hub — Azure CLI

This article shows you how to create a route and endpoint in your IoT hub, then delete your route and endpoint. We use the Azure CLI to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure CLI**

[!INCLUDE [azure-cli-prepare-your-environment-no-header](../../includes/azure-cli-prepare-your-environment-no-header.md)]

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using the Azure CLI](/azure/iot-hub/iot-hub-create-using-cli).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub using Azure CLI](/azure/event-hubs/event-hubs-quickstart-cli).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use the Azure CLI to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-cli).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli).

## Create, update, or remove endpoints and routes

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The service must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)

References used in the following commands:
* [az iot hub](/cli/azure/iot/hub)
* [az eventhubs](/cli/azure/eventhubs)

### Create an Event Hubs resource with authorization rule

1. Create the Event Hubs namespace. The **name** should be unique. The location, **l**, should be your resource group location.

   ```azurecli
   az eventhubs namespace create --name my-routing-namespace --resource-group my-resource-group -l westus3
   ```

1. Create your Event hub instance. The **name** should be unique. Use the **namespace-name** you created in the previous command.
   
   ```azurecli
   az eventhubs eventhub create --name my-event-hubs --resource-group my-resource-group --namespace-name my-routing-namespace
   ```

1. Create an authorization rule for your Event hub. 

   > [!TIP]
   > The **name** parameter's value **RootManageSharedAccessKey** is the default name that allows **Manage, Send, Listen** claims (access). If you wanted to restrict the claims, give the **name** parameter your own unique name and include the `--rights` flag followed by one of the claims. For example, `--name my-name --rights Send`.

   For more information about access, see [Authorize access to Azure Event Hubs](/azure/event-hubs/authorize-access-event-hubs).

   ```azurecli
   az eventhubs eventhub authorization-rule create --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

### Create an Event Hubs endpoint

1. List your authorization rule to get your connection string. Copy your connection string for later use.

   ```azurecli
   az eventhubs eventhub authorization-rule keys list --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

1. Create your custom endpoint first (before the route). Use the connection string in this command that you copied in the last step. The **endpoint-type** must be `eventhub`, otherwise all other values should be your own.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-event-hub-endpoint --endpoint-type eventhub --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "my connection string"
   ```

   To see all routing endpoint options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

### Create an IoT Hub route

1. With a custom endpoint to Event Hubs already made, you can now create a route in your IoT hub.

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

References used in the following commands:
* [az iot hub](/cli/azure/iot/hub)
* [az servicebus](/cli/azure/servicebus)

### Create a Service Bus queue resource with authorization rule

If you don't yet have a Service Bus queue, you can create one in a few commands. We create the namespace first, followed by the Service Bus queue entity and then the authorization rule.

1. Create a new Service Bus namespace. Use a unique **name** for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus queue. Use a unique **name** for your queue.

   ```azurecli
   az servicebus queue create --resource-group my-resource-group --namespace-name my-namespace --name my-queue
   ```

1. Create a Service Bus authorization rule. Use a unique **name** for your authorization rule.

   ```azurecli
   az servicebus queue authorization-rule create --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule --rights Listen
   ```

   For more authorization rule options, see [az servicebus queue authorization-rule create](/cli/azure/servicebus/queue/authorization-rule#az-servicebus-queue-authorization-rule-create).

### Create a Service Bus queue endpoint

Before creating an IoT Hub route to a Service Bus queue, you must create the endpoint first. Let's create a new endpoint using the `az iot hub` commands.

1. You need the connection string from your Service Bus queue to create an endpoint. Get the string using the `list` command and copy it for the next step.

   ```azurecli
   az servicebus queue authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --queue-name my-queue --name my-auth-rule
   ```

1. Create a new Service Bus queue endpoint. The **endpoint-type** must be **servicebusqueue**, otherwise all parameters should have your own values.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-queue-endpoint --endpoint-type servicebusqueue --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>"
   ```

### Create an IoT Hub route

1. Create a new IoT hub route with your Service Bus queue endpoint.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-queue-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. List your IoT hub routes to confirm your new Service Bus queue route.

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

# [Service Bus topic](#tab/servicebustopic)

References used in the following commands:
* [az iot hub](/cli/azure/iot/hub)
* [az servicebus](/cli/azure/servicebus)

### Create a Service Bus queue resource with subscription

If you don't yet have a Service Bus topic, you can create one in a few commands. We create the namespace first, followed by the Service Bus topic entity and then the authorization rule.

1. Create a new Service Bus namespace. Use a unique **name** for your namespace.

   ```azurecli
   az servicebus namespace create --resource-group my-resource-group --name my-namespace
   ```

1. Create a new Service Bus topic. Use a unique **name** for your queue.

   ```azurecli
   az servicebus topic create --resource-group my-resource-group --namespace-name my-namespace --name my-topic
   ```

1. Create a Service Bus topic subscription.

   ```azurecli
   az servicebus topic subscription create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name my-subscription
   ```

1. (Optional) If you'd like to filter messages for a subscription, create a Service Bus subscription rule. Use a unique **name** for your filter. A filter can be a SQL expression, such as "StoreId IN ('Store1','Store2','Store3')".

   ```azurecli
   az servicebus topic subscription rule create --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --subscription-name my-subscription --name my-filter --filter-sql-expression "my-sql-expression"  
   ```

### Create a Service Bus topic endpoint

Before creating an IoT Hub route to a Service Bus topic, you must create the endpoint first. Let's create a new endpoint using the `az iot hub` commands.

1. You need the connection string from your Service Bus topic to create an endpoint. Get the string using the `list` command and copy it for the next step. The default name of your authorization rule that comes with a new namespace is **RootManageSharedAccessKey**.

   ```azurecli
   az servicebus topic authorization-rule keys list --resource-group my-resource-group --namespace-name my-namespace --topic-name my-topic --name RootManageSharedAccessKey
   ```

1. Create a new Service Bus topic endpoint. The **endpoint-type** must be **servicebustopic**, otherwise all parameters should have your own values. Use the connection string you copied from the previous step. Add `;EntityPath=my-service-bus-topic` to the end of your connection string. Since we didn't create a custom authorization rule, the namespace connection string doesn't include the entity path information, but the entity path is required to make a Service Bus topic endpoint. Replace the `my-service-bus-topic` part of the entity path string with the name of your Service Bus topic.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-service-bus-topic-endpoint --endpoint-type servicebustopic --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "Endpoint=<my connection string>;EntityPath=my-service-bus-topic"
   ```

### Create an IoT Hub route

1. Create a new IoT hub route with your Service Bus queue endpoint. Use a unique name for **route-name**.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --endpoint my-service-bus-topic-endpoint --hub-name my-iot-hub --route-name my-route --source deviceconnectionstateevents
   ```

1. List your IoT hub routes to confirm your new Service Bus topic route.

   ```azurecli
   az iot hub route list --resource-group my-resource-group --hub-name my-iot-hub
   ```

# [Azure Storage](#tab/azurestorage)

References used in the following commands:
* [az iot hub](/cli/azure/iot/hub)
* [az storage](/cli/azure/storage)

### Create an Azure Storage resource with container

If you don't yet have an Azure Storage account and container, you can create one in a few commands.

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

### Create an Azure Storage endpoint

Before creating an IoT Hub route to an Azure Storage, you must create the endpoint first. Let's create a new endpoint using the `az iot hub` commands.

1. You need the connection string from your Azure Storage resource to create an endpoint. Get the string using the `show` command and copy it for the next step.

   ```azurecli
   az storage account show-connection-string --resource-group my-resource-group --name my-storage-account 
   ```

1. Create a new Azure Storage endpoint. The **endpoint-type** must be **azurestoragecontainer**, otherwise all parameters should have your own values. Use the connection string you copied from the previous step.

   ```azurecli
   az iot hub routing-endpoint create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --endpoint-type azurestoragecontainer --container my-storage-container --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx --connection-string "DefaultEndpointsProtocol=<my connection string>"
   ```

   For more parameter options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

### Create an IoT hub route to Azure Storage

1. Now that you have an Azure storage endpoint, create a new IoT Hub route that uses the endpoint.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

   ```azurecli
   az iot hub route create --resource-group my-resource-group --hub-name my-iot-hub --endpoint-name my-storage-endpoint --source deviceconnectionstateevents --route-name my-route
   ```

1. Confirm that your new route is in your IoT hub.

   ```azurecli
   
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

### Update an IoT Hub route

With an IoT Hub route, no matter the type of endpoint, you can update some properties of the route.

Try changing one of the parameters, for example the **source** from **deviceconnectionstateevents** to **devicejoblifecycleevents**.

```azurecli
az iot hub route update --resource-group my-resource-group --hub-name my-iot-hub --source devicejoblifecycleevents --route-name my-route
```

Use the `az iot hub route show` command to confirm the change in your route.

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

