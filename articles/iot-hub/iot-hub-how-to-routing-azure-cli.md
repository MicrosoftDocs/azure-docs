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

* (Optional) An Event Hubs resource. If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub using Azure CLI](/azure/event-hubs/event-hubs-quickstart-cli).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use the Azure CLI to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-cli).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Use Azure CLI to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-tutorial-topics-subscriptions-cli).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-cli).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The service must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)



# [Service Bus queue](#tab/servicebusqueue)



# [Service Bus topic](#tab/servicebustopic)



# [Azure Storage](#tab/azurestorage)
