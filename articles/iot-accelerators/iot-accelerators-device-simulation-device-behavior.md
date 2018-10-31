---
title: Simulated device behavior in device simulation solution - Azure | Microsoft Docs
description: This article describes how to use JavaScript to define the behavior of a simulated device in the device simulation solution.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 01/29/2018
ms.topic: conceptual
---

# Implement the device model behavior

The article [Understand the device model schema](iot-accelerators-device-simulation-device-schema.md) described the schema that defines a simulated device model. That article referred to two types of JavaScript file that implement the behavior of a simulated device:

- **State**: JavaScript files that run at fixed intervals to update the internal state of the device.
- **Method**: JavaScript files that run when the solution invokes a method on the device.

In this article, you learn how to:

>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device responds to a method call from the IoT hub it's connected to
> * Debug your scripts

[!INCLUDE [iot-accelerators-device-schema](../../includes/iot-accelerators-device-schema.md)]

## Next steps

This article described how to define the behavior of your own custom simulated device model. This article showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device responds to a method call from the IoT hub it's connected to
> * Debug your scripts

Now that you've learned how to specify the behavior of a simulated device, the suggested next step is to learn how to [Create a simulated device](iot-accelerators-device-simulation-create-simulated-device.md).

For more developer information about the Device Simulation solution, see the [Developer Reference Guide](https://github.com/Azure/device-simulation-dotnet/wiki/Simulation-Service-Developer-Reference-Guide).
