---
title: Develop modules for Azure IoT Edge | Microsoft Docs 
description: Develop custom modules for Azure IoT Edge that can communicate with the runtime and IoT Hub
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/05/2017
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Understand the requirements and tools for developing IoT Edge modules

This article explains what functionalities are available when writing applications that run as IoT Edge module, and how to take advantage of them.

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

See [Develop and deploy an IoT Edge module to a simulated device](tutorial-csharp-module.md) for an example of a module application that sends device-to-cloud messages, and uses the module twin.

### Device-to-cloud messages
In order to enable complex processing of device-to-cloud messages, IoT Edge hub provides declarative routing of messages between modules, and between modules and IoT Hub. Declarative routing allows modules to intercept and process messages sent by other modules and propagate them into complex pipelines. The article [Module composition](module-composition.md) explains how to compose modules into complex pipelines using routes.

An IoT Edge module, as opposed to a normal IoT Hub device application, can receive device-to-cloud messages that are being proxied by its local IoT Edge hub in order to process them.

IoT Edge hub propagates the messages to your module based on declarative routes described in the [Module composition](module-composition.md) article. When developing an IoT Edge module, you can receive these messages by setting message handlers.

In order to simplify the creation of routes, IoT Edge adds the concept of module *input* and *output* endpoints. A module can receive all device-to-cloud messages routed to it without specifying any input, and can send device-to-cloud messages without specifying any output.
Using explicit inputs and outputs, though, makes routing rules simpler to understand. For more information on routing rules and input and output endpoints for modules, see [Module composition](module-composition.md).

Finally, device-to-cloud messages handled by the Edge hub are stamped with the following system properties:

| Property | Description |
| -------- | ----------- |
| $connectionDeviceId | The device ID of the client that sent the message |
| $connectionModuleId | The module ID of the module that sent the message |
| $inputName | The input that received this message. Can be empty. |
| $outputName | The output used to send the message. Can be empty. |

### Connecting to IoT Edge hub from a module
Connecting to the local IoT Edge hub from a module involves two steps: 
1. Use the connection string provided by the IoT Edge runtime when your module starts.
2. Make sure your application accepts the certificate presented by the IoT Edge hub on that device.

The connecting string to use is injected by the IoT Edge runtime in the environment variable `EdgeHubConnectionString`. This makes it available to any program that wants to use it.

Analogously, the certificate to use to validate the IoT Edge hub connection is injected by the IoT Edge runtime in a file whose path is available in the environment variable `EdgeModuleCACertificateFile`.

## Next steps

After you develop a module, learn how to [Deploy and monitor IoT Edge modules at scale](how-to-deploy-monitor.md).

