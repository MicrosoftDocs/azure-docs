---
title: Create message routing and endpoints — Azure portal | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using the Azure portal.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 10/28/2022
ms.author: kgremban
---

# Message routing with IoT Hub — Azure portal

This article shows you how to create a route and endpoint in your IoT hub, then delete your route or endpoint. We use the Azure portal to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

You can choose which Azure service (Event Hubs, Service Bus, or Azure Storage) endpoint that you'd like to connect with an IoT Hub route. These services are all optional prerequisites.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using the Azure portal](/azure/iot-hub/iot-hub-create-through-portal).

* (Optional) An Event Hubs resource. If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub using Azure portal](/azure/event-hubs/event-hubs-create).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use Azure portal to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-portal).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).