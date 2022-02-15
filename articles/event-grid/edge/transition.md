---
title: Transition from Event Grid on Azure IoT Edge to Azure IoT Edge
description: This article explains transition from Event Grid on Azure IoT Edge to Azure IoT Edge MQTT Broker or IoT Hub message routing.
ms.topic: overview
ms.date: 02/15/2022
ms.subservice: iot-edge
---

# ransition from Event Grid on Azure IoT Edge to Azure IoT Edge native capabilities

On March 31, 2023, Event Grid on Azure IoT Edge support will be retired, so make sure to transition to IoT Edge native capabilities prior to that date.

## Steps to complete the transition

To transition to use the Azure IoT Edge features, we recommend the following approach.

1. Learn about the feature differences between Event Grid on Azure IoT Edge and Azure IoT Edge.
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