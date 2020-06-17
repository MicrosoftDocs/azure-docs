---
title: Implement IoT Plug and Play Preview model discovery | Microsoft Docs
description: As a solution developer, learn about how you can implement IoT Plug and Play model discovery in your solution.
author: Philmea
ms.author: philmea
ms.date: 12/26/2019
ms.topic: conceptual
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea
---

# Implement IoT Plug and Play Preview model discovery in an IoT solution

This article describes how, as a solution developer, you can implement IoT Plug and Play Preview model discovery in an IoT solution.  IoT Plug and Play model discovery is how IoT Plug and Play devices identify their supported capability models and interfaces, and how an IoT solution retrieves those capability models and interfaces.

There are two broad categories of IoT solution: purpose-built solutions that work with a known set of IoT Plug and Play devices, and model-driven solutions that work with any IoT Plug and Play device.

This concept article describes how to implement model discovery in both types of solution.

## Model discovery

When an IoT Plug and Play device first connects to your IoT hub, it sends a model information telemetry message. This message includes the IDs of the interfaces the device implements. For your solution to work with the device, it must resolve those IDs and retrieve the definitions for each interface.

Here are the steps an IoT Plug and Play device takes when it uses the Device Provisioning Service (DPS) to connect to a hub:

1. When the device is turned on, it connects to the global end point for DPS and authenticates using one of the allowed methods.
1. DPS then authenticates the device and looks up the rule that tells it which IoT hub to assign the device to. DPS then registers the device with that hub.
1. DPS returns an IoT Hub connection string to the device.
1. The device then sends a discovery telemetry message to your IoT Hub. The discovery telemetry message contains the IDs of the interfaces the device implements.
1. The IoT Plug and Play device is now ready to work with a solution that uses your IoT hub.

If the device connects directly to your IoT hub, it connects using a connection string that's embedded in the device code. The device then sends a discovery telemetry message to your IoT Hub.

See the [ModelInformation](concepts-common-interfaces.md) interface to learn more about the model information telemetry message.

### Purpose-built IoT solutions

A purpose-built IoT solution works with a known set of IoT Plug and Play device capability models and interfaces.

You'll have the capability model and interfaces for the devices that will connect to your solution ahead of time. Use the following steps to prepare your solution:

1. Store the interface JSON files in a [model repository](./howto-manage-models.md) where your solution can read them.
1. Write logic in your IoT solution based on the expected IoT Plug and Play capability models and interface.
1. Subscribe to notifications from the IoT hub your solution uses.

When you receive a notification for a new device connection, follow these steps:

1. Read the discovery telemetry message to retrieve the IDs of the capability model and interfaces implemented by the device.
1. Compare the ID of the capability model against the IDs of the capability models you stored ahead of time.
1. Now you know what type of device has connected. Use the logic you wrote earlier to enable users to interact with the device appropriately.

### Model-driven solutions

A model-driven IoT solution can work with any IoT Plug and Play device. Building a model driven IoT Solution is more complex, but the benefit is that your solution works with any devices added in the future.

To build a model-driven IoT solution, you need to build logic against the IoT Plug and Play interface primitives: telemetry, properties, and commands. Your IoT solution's logic represent a device by combining multiple telemetry, property, and command capabilities.

Your solution must also subscribe to notifications from the IoT hub it uses.

When your solution receives a notification for a new device connection, follow these steps:

1. Read the discovery telemetry message to retrieve the IDs of the capability model and interfaces implemented by the device.
1. For each ID, read the full JSON file to find the device's capabilities.
1. Check to see if each interface is present in any caches you've built for storing the JSON files retrieved earlier by your solution.
1. Then, check if an interface with that ID is present in the public model repository. For more information, see [Public model repository](howto-manage-models.md).
1. If the interface isn't present in the public model repository, try looking for it in any company model repositories known to your solution. You need a connection string to access a company model repository. For more information, see [Company model repository](howto-manage-models.md).
1. If you can't find all the interfaces in either the public model repository, or in a company model repository, you can check if the device can provide the interface definition. A device can implement the standard [ModelDefinition](concepts-common-interfaces.md) interface to publish information about how to retrieve interface files with a command.
1. If you found JSON files for each interface implemented by the device, you can enumerate the capabilities of the device. Use the logic you wrote earlier to enable users to interact with the device.
1. At any time, you can call the digital twins API to retrieve the capability model ID and interface IDs for the device.

## Next steps

Now that you've learned about model discovery an IoT solution, learn more about the [Azure IoT Platform](overview-iot-plug-and-play.md) to leverage other capabilities for your solution.
