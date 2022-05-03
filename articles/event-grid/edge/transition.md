---
title: Transition from Event Grid on Azure IoT Edge to Azure IoT Edge
description: This article explains transition from Event Grid on Azure IoT Edge to Azure IoT Edge Hub module in Azure IoT Edge runtime.
ms.topic: overview
ms.date: 04/13/2022
ms.subservice: iot-edge
---

# Transition from Event Grid on Azure IoT Edge to Azure IoT Edge native capabilities

On March 31, 2023, Event Grid on Azure IoT Edge will be retired, so make sure to transition to IoT Edge native capabilities prior to that date.

## Why are we retiring?

There's one major reason for deciding to retire Event Grid on IoT Edge, which is currently in Preview, in March 2023: Event Grid has been evolving in the cloud native space to provide more robust capabilities not only in Azure but also in on-prem scenarios with [Kubernetes with Azure Arc](../kubernetes/overview.md).

| Event Grid on Azure IoT Edge | Azure IoT Edge Hub |
| ---------------------------- | ----------------------------- | 
| - Publishing and subscribing to events locally/cloud<br/>- Forwarding events to Event Grid<br/>- Forwarding events to IoT Hub<br/>- React to Blob Storage events locally | - Connectivity to Azure IoT Hub<br/>- Route messages between modules or devices locally<br/>- Offline support<br/>- Message filtering | 

## How to transition to Azure IoT Edge features

To transition to use the Azure IoT Edge features, follow these steps.

1. Learn about the feature differences between [Event Grid on Azure IoT Edge](overview.md#when-to-use-event-grid-on-iot-edge) and [Azure IoT Edge](../../iot-edge/how-to-publish-subscribe.md).
2. Identify your scenario based on the feature table in the next section. 
3. Follow the documentation to change your architecture and make code changes based on the scenario you want to transition.
4. Validate your updated architecture by sending and receiving messages/events.

## Event Grid on Azure IoT Edge vs. Azure IoT Edge

The following table highlights the key differences during this transition.

| Event Grid on Azure IoT Edge | Azure IoT Edge |
| --- | ----------- |
| Publish, subscribe and forward events locally or cloud | Use the message routing feature in IoT Edge Hub to facilitate local and cloud communication. It enables device-to-module, module-to-module, and device-to-device communications by brokering messages to keep devices and modules independent from each other. To learn more, see [using routing for IoT Edge hub](../../iot-edge/iot-edge-runtime.md#using-routing). </br> </br> If you're subscribing to IoT Hub, it’s possible to create an event to publish to Event Grid if you need. For details, see [Azure IoT Hub and Event Grid](../../iot-hub/iot-hub-event-grid.md). |
| Forward events to IoT Hub | Use IoT Edge Hub to optimize connections to send messages to the cloud with offline support. For details, see [IoT Edge Hub cloud communication](../../iot-edge/iot-edge-runtime.md#using-routing). |
| React to Blob Storage events on IoT Edge (Preview) | You can use Azure Function Apps to react to blob storage events on cloud when a blob is created or updated. For more information, see [Azure Blob storage trigger for Azure Functions](../../azure-functions/functions-bindings-storage-blob-trigger.md) and [Tutorial: Deploy Azure Functions as modules - Azure IoT Edge](../../iot-edge/tutorial-deploy-function.md). Blob triggers in IoT Edge blob storage module aren't supported. |