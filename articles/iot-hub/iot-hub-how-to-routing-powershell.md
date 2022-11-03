---
title: Create message routing and endpoints — PowerShell | Microsoft Docs
description: A how-to article that creates and deletes routes and endpoints in IoT Hub, using PowerShell.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 10/28/2022
ms.author: kgremban
---

# Message routing with IoT Hub — PowerShell

This article shows you how to create a route and endpoint in your IoT hub, then delete your route and endpoint. We use the PowerShell to create routes and endpoints to Event Hubs, Service Bus queue, Service Bus topic, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and testing on a simulated device, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

**Azure PowerShell**

To use PowerShell locally, install the [Azure PowerShell module](/powershell/azure/install-az-ps). Alternatively, to use the Azure PowerShell in a browser enable [Azure Cloud Shell](/azure/cloud-shell/overview).

**IoT Hub and an endpoint service**

You need an IoT hub and at least one other service to serve as an endpoint to an IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) endpoint that you'd like to connect with your IoT Hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps in [Create an IoT hub using the New-AzIotHub cmdlet](/azure/iot-hub/iot-hub-create-using-powershell).

* (Optional) An Event Hubs resource (with container). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub using Azure PowerShell](/azure/event-hubs/event-hubs-quickstart-powershell).

* (Optional) A Service Bus queue resource. If you need to create a new Service Bus queue, see [Use Azure PowerShell to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-powershell).

* (Optional) A Service Bus topic resource. If you need to create a new Service Bus topic, see the [New-AzServiceBusTopic](/powershell/module/az.servicebus/new-azservicebustopic) reference and the [Azure Service Bus Messaging](/azure/service-bus-messaging/) documentation.

* (Optional) An Azure Storage resource. If you need to create a new Azure Storage, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-powershell).

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint, where the messages or events end up, and a data source, where the messages or events originate. You choose these locations when creating a new route in the IoT Hub. Routing queries are then used to filter messages or events before they go to the endpoint.

You can use Events Hubs, a Service Bus queue or topic, or an Azure storage to be the endpoint for your IoT hub route. The service must first exist in your Azure account.

# [Event Hubs](#tab/eventhubs)



# [Service Bus queue](#tab/servicebusqueue)



# [Service Bus topic](#tab/servicebustopic)



# [Azure Storage](#tab/azurestorage)
