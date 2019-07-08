---
title: Develop modules for Azure IoT Edge | Microsoft Docs 
description: Develop custom modules for Azure IoT Edge that can communicate with the runtime and IoT Hub
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 02/25/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Develop your own IoT Edge modules

Azure IoT Edge modules can connect with other Azure services and contribute to your larger cloud data pipeline. This article describes how you can develop modules to communicate with the IoT Edge runtime and IoT Hub, and therefore the rest of the Azure cloud. 

## IoT Edge runtime environment
The IoT Edge runtime provides the infrastructure to integrate the functionality of multiple IoT Edge modules and to deploy them onto IoT Edge devices. At a high level, any program can be packaged as an IoT Edge module. However, to take full advantage of IoT Edge communication and management functionalities, a program running in a module can connect to the local IoT Edge hub, integrated in the IoT Edge runtime.

## Using the IoT Edge hub
The IoT Edge hub provides two main functionalities: proxy to IoT Hub, and local communications.

### IoT Hub primitives
IoT Hub sees a module instance analogously to a device, in the sense that:

* it has a module twin that is distinct and isolated from the [device twin](../iot-hub/iot-hub-devguide-device-twins.md) and the other module twins of that device;
* it can send [device-to-cloud messages](../iot-hub/iot-hub-devguide-messaging.md);
* it can receive [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md) targeted specifically at its identity.

Currently, a module cannot receive cloud-to-device messages nor use the file upload feature.

When writing a module, you can use the [Azure IoT Device SDK](../iot-hub/iot-hub-devguide-sdks.md) to connect to the IoT Edge hub and use the above functionality as you would when using IoT Hub with a device application, the only difference being that, from your application back-end, you have to refer to the module identity instead of the device identity.

### Device-to-cloud messages
To enable complex processing of device-to-cloud messages, IoT Edge hub provides declarative routing of messages between modules, and between modules and IoT Hub. Declarative routing allows modules to intercept and process messages sent by other modules and propagate them into complex pipelines. For more information, see [deploy modules and establish routes in IoT Edge](module-composition.md).

An IoT Edge module, as opposed to a normal IoT Hub device application, can receive device-to-cloud messages that are being proxied by its local IoT Edge hub in order to process them.

IoT Edge hub propagates the messages to your module based on declarative routes described in the [deployment manifest](module-composition.md). When developing an IoT Edge module, you can receive these messages by setting message handlers.

To simplify the creation of routes, IoT Edge adds the concept of module *input* and *output* endpoints. A module can receive all device-to-cloud messages routed to it without specifying any input, and can send device-to-cloud messages without specifying any output. Using explicit inputs and outputs, though, makes routing rules simpler to understand. 

Finally, device-to-cloud messages handled by the Edge hub are stamped with the following system properties:

| Property | Description |
| -------- | ----------- |
| $connectionDeviceId | The device ID of the client that sent the message |
| $connectionModuleId | The module ID of the module that sent the message |
| $inputName | The input that received this message. Can be empty. |
| $outputName | The output used to send the message. Can be empty. |

### Connecting to IoT Edge hub from a module
Connecting to the local IoT Edge hub from a module involves two steps: 
1. Create a ModuleClient instance in your application.
2. Make sure your application accepts the certificate presented by the IoT Edge hub on that device.

Create a ModuleClient instance to connect your module to the IoT Edge hub running on the device, similar to how DeviceClient instances connect IoT devices to IoT Hub. For more information about the ModuleClient class and its communication methods, see the API reference for your preferred SDK language: [C#](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.moduleclient?view=azure-dotnet), [C and Python](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/iothub-module-client-h), [Java](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.moduleclient?view=azure-java-stable), or [Node.js](https://docs.microsoft.com/javascript/api/azure-iot-device/moduleclient?view=azure-node-latest).


## Next steps

[Prepare your development and test environment for IoT Edge](development-environment.md)

[Use Visual Studio to develop C# modules for IoT Edge](how-to-visual-studio-develop-module.md)

[Use Visual Studio Code to develop modules for IoT Edge](how-to-vs-code-develop-module.md)

