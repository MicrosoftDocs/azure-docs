---
title: Transition from Event Grid on IoT Edge to Azure IoT Edge native capabilities.
description: This article explains the transition from Event Grid on Azure IoT Edge to Azure IoT Edge hub module in Azure IoT Edge runtime.
ms.topic: overview
ms.date: 04/13/2022
ms.subservice: iot-edge
---

# Transition from Event Grid on IoT Edge to Azure IoT Edge native capabilities

On March 31, 2023, Azure Event Grid on Azure IoT Edge will be retired. Be sure to transition to IoT Edge native capabilities before that date.

## Why are we retiring it?

There's one major reason to retire Event Grid on IoT Edge, which is currently in preview, in March 2023: Event Grid has been evolving in the cloud native space to provide more robust capabilities not only in Azure but also in on-premises scenarios with [Kubernetes with Azure Arc](../kubernetes/overview.md).

| Event Grid on IoT Edge | IoT Edge hub |
| ---------------------------- | ----------------------------- | 
| - Publish and subscribe to events locally/in the cloud<br/>- Forward events to Event Grid<br/>- Forward events to Azure IoT Hub<br/>- React to Azure Blob Storage events locally | - Connect to IoT Hub<br/>- Route messages between modules or devices locally<br/>- Get offline support<br/>- Filter messages | 

## How to transition to IoT Edge features

To use the IoT Edge features, follow these steps:

1. Learn about the feature differences between [Event Grid on IoT Edge](overview.md#when-to-use-event-grid-on-iot-edge) and [IoT Edge](../../iot-edge/how-to-publish-subscribe.md).
2. Identify your scenario based on the feature table in the next section.
3. Follow the documentation to change your architecture and make code changes based on the scenario you want to transition.
4. Validate your updated architecture by sending and receiving messages/events.

## Event Grid on IoT Edge vs. IoT Edge

The following table highlights the key differences during this transition.

| Event Grid on IoT Edge | IoT Edge |
| --- | ----------- |
| Publish, subscribe, and forward events locally or to the cloud | Use the message routing feature in the IoT Edge hub to facilitate local and cloud communication. It enables device-to-module, module-to-module, and device-to-device communications by brokering messages to keep devices and modules independent from each other. To learn more, see [Using routing for an IoT Edge hub](../../iot-edge/iot-edge-runtime.md#using-routing). </br> </br> If you're subscribing to an IoT Edge hub, it's possible to create an event to publish to Event Grid, if needed. For details, see [Azure IoT Hub and Event Grid on IoT Edge](../../iot-hub/iot-hub-event-grid.md). |
| Forward events to IoT Hub | Use the IoT Edge hub to optimize connections when sending messages to the cloud with offline support. For details, see [IoT Edge hub cloud communication](../../iot-edge/iot-edge-runtime.md#using-routing). |
| React to Blob Storage events on IoT Edge (preview) | You can use Azure function apps to react to Blob Storage events on the cloud when a blob is created or updated. For more information, see [Azure Blob Storage trigger for Azure Functions](../../azure-functions/functions-bindings-storage-blob-trigger.md) and [Tutorial: Deploy Azure Functions as modules - Azure IoT Edge](../../iot-edge/tutorial-deploy-function.md). Blob triggers in an IoT Edge Blob Storage module aren't supported. |
