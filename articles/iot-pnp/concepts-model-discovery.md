---
title: Implement IoT Plug and Play Preview model discovery | Microsoft Docs
description: As a solution builder, learn about how you can implement IoT Plug and Play model discovery in your solution.
author: JimacoMS3
ms.author: v-jambra
ms.date: 12/26/2019
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Implement IoT Plug and Play Preview model discovery in an IoT solution

This article describes how, as a solution builder, you can implement IoT Plug and Play Preview model discovery in an IoT solution.  IoT Plug and Play model discovery is how IoT Plug and Play devices identify their supported capability models and interfaces, and how an IoT solution retrieves those capability models and interfaces.

There are two broad categories of IoT solution: purpose-built solutions that work with a known set of IoT Plug and Play devices, and model-driven solutions that work with any IoT Plug and Play device.

This concept article describes how to implement model discovery in both types of solution.

## Model discovery

When an IoT Plug and Play device connects to your IoT hub using connection string, it sends the model ID via Mqtt Connection Packet or Amqp Link settings. This message includes the model ID that the device implements. Once Discovery is done successfully, a Digital Twin notification change event will be sent where model ID is part of the notification body. For your solution to work with the device, it must resolve the model ID and retrieve the definitions for each interface the device implements.


### Purpose-built IoT solutions

A purpose-built IoT solution works with a known set of IoT Plug and Play device models and interfaces.

You'll have the device model and interfaces for the devices that will connect to your solution ahead of time. Use the following steps to prepare your solution:

1. Store the interface JSON files in a [model repository](./howto-manage-models.md) where your solution can read them.
1. Write logic in your IoT solution based on the expected IoT Plug and Play device models and interface.
1. Subscribe to the digital twin change notifications from the IoT hub your solution uses.

When you receive a notification for a new device connection, follow these steps:

1. In the digital twin change notification you can retrieve the ID of the device model implemented by the device.
1. Compare the ID of the device model against the ID of the device models you stored ahead of time.
1. Now you know what type of device has connected. 
1. Retrieve the IDs of interfaces from the device model, and compare the IDs against the interfaces you stored ahead of time to understand each interface's definition.
1. Use the logic you wrote earlier to enable your solution to interact with the device appropriately.

### Model-driven solutions

A model-driven IoT solution can work with any IoT Plug and Play device. Building a model driven IoT Solution is more complex, but the benefit is that your solution works with any devices added in the future.

To build a model-driven IoT solution, you need to build logic against the IoT Plug and Play interface primitives: telemetry, properties, and commands. Your IoT solution's logic represent a device by combining multiple telemetry, property, and command capabilities.

Your solution must also subscribe to digital twin change notifications from the IoT hub it uses.

When your solution receives a notification for a new device connection, follow these steps:

1. Read the notification to retrieve the model ID of the device.
1. Check to see if the device model is present in any caches you've built for storing the JSON files retrieved earlier.
1. Enumerate the interfaces implemented by your device to retrieve the definition of each from any caches you've built for storing the JSON files retrieved earlier.
1. At any time, you can call the digital twins API to retrieve the model ID for the device.

## Next steps

Now that you've learned about model discovery an IoT solution, learn more about the [Azure IoT Platform](overview-iot-plug-and-play.md) to leverage other capabilities for your solution.
