---
title: Transition from Event Grid on Azure IoT Edge to Azure IoT Edge
description: This article explains transition from Event Grid on Azure IoT Edge to Azure IoT Edge MQTT Broker or IoT Hub message routing.
ms.topic: overview
ms.date: 02/16/2022
ms.subservice: iot-edge
---

# Transition from Event Grid on Azure IoT Edge to Azure IoT Edge native capabilities

On March 31, 2023, Event Grid on Azure IoT Edge will be retired, so make sure to transition to IoT Edge native capabilities prior to that date.

## Why are we retiring? 
There are multiple reasons for deciding to retire Event Grid on IoT Edge, which is currently in Preview, in March 2023.

- Event Grid has been evolving in the cloud native space to provide more robust capabilities not only in Azure but also in on-prem scenarios with [Kubernetes with Azure Arc](../kubernetes/overview.md).
- We've seen an increase of adoption of MQTT brokers in the IoT space, this adoption has been the motivation to allow IoT Edge team to build a new native MQTT broker that provides a better integration for pub/sub messaging scenarios. With the new MQTT broker provided natively on IoT Edge, you'll be able to connect to this broker, publish, and subscribe to messages over user-defined topics, and use IoT Hub messaging primitives. The IoT Edge MQTT broker is built in the IoT Edge hub.

Here's the list of the features that will be removed with the retirement of Event Grid on Azure IoT Edge and a list of the new IoT Edge native capabilities. 

| Event Grid on Azure IoT Edge | MQTT broker on Azure IoT Edge |
| ---------------------------- | ----------------------------- | 
| - Publishing and subscribing to events locally/cloud<br/>- Forwarding events to Event Grid<br/>- Forwarding events to IoT Hub<br/>- React to Blob Storage events locally | - Connectivity to IoT Edge hub<br/>- Publish and subscribe on user-defined topics<br/>- Publish and subscribe on IoT Hub topics<br/>- Publish and subscribe between MQTT brokers | 


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
| Publish, subscribe and forward events locally or cloud | You can use Azure IoT Edge MQTT broker to publish and subscribe messages. To learn how to connect to this broker, publish and subscribe to messages over user-defined topics, and use IoT Hub messaging primitives, see [publish and subscribe with Azure IoT Edge](../../iot-edge/how-to-publish-subscribe.md). The IoT Edge MQTT broker is built in the IoT Edge hub. For more information, see [the brokering capabilities of the IoT Edge hub](../../iot-edge/iot-edge-runtime.md). </br> </br> If you're subscribing to IoT Hub, it’s possible to create an event to publish to Event Grid if you need. For details, see [Azure IoT Hub and Event Grid](../../iot-hub/iot-hub-event-grid.md). |
| Forward events to IoT Hub | You can use IoT Hub message routing to send device-cloud messages to different endpoints. For details, see [Understand Azure IoT Hub message routing](../../iot-hub/iot-hub-devguide-messages-d2c.md). |
| React to Blob Storage events on IoT Edge (Preview) | You can use Azure Function Apps to react to blob storage events on cloud when a blob is created or updated. For more information, see [Azure Blob storage trigger for Azure Functions](../../azure-functions/functions-bindings-storage-blob-trigger.md) and [Tutorial: Deploy Azure Functions as modules - Azure IoT Edge](../../iot-edge/tutorial-deploy-function.md). Blob triggers in IoT Edge blob storage module aren't supported. |
