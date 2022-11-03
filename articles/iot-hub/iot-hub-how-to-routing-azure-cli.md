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

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The service must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)

Let's create a new Event Hubs resource, if you haven't already. Skip ahead to step 3, if you already have an Event Hubs resource.

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

1. List your authorization rule to get your connection string. Copy your connection string for later use.

   ```azurecli
   az eventhubs eventhub authorization-rule keys list --resource-group my-resource-group --namespace-name my-routing-namespace --eventhub-name my-event-hubs --name RootManageSharedAccessKey
   ```

1. Create your custom endpoint first (before the route). Use the connection string in this command that you copied in the last step. The **endpoint-type** must be `eventhub`, otherwise all other values should be your own.

   ```azurecli
   az iot hub routing-endpoint create --endpoint-name my-event-hub-endpoint --endpoint-type eventhub --endpoint-resource-group my-resource-group --endpoint-subscription-id xxxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx --hub-name my-iot-hub --connection-string "my connection string"
   ```

   To see all routing endpoint options, see [az iot hub routing-endpoint](/cli/azure/iot/hub/routing-endpoint).

1. Now that you have a custom endpoint to Event Hubs, create a route in your IoT hub.

   The default fallback route in IoT Hub collects messages from `DeviceMessages`, so let's choose another option for our custom route, such as `DeviceConnectionStateEvents`. For more information on source options, see [az iot hub route](/cli/azure/iot/hub/route#az-iot-hub-route-create-required-parameters).

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

If you need to create a Service Bus queue, see [Use the Azure CLI to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-cli).



# [Service Bus topic](#tab/servicebustopic)

If you need to create a Service Bus topic (with subscription), see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli).



# [Azure Storage](#tab/azurestorage)

If you need to create an Azure Storage resource (with container), see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli).