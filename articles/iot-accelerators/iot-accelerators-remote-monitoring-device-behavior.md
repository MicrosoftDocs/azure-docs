---
title: Simulated device behavior in remote monitoring solution - Azure | Microsoft Docs
description: This article describes how to use JavaScript to define the behavior of a simulated device in the remote monitoring solution.
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-accelerators
services: iot-accelerators
ms.date: 01/29/2018
ms.topic: conceptual
---

# Implement the device model behavior

The article [Understand the device model schema](iot-accelerators-remote-monitoring-device-schema.md) described the schema that defines a simulated device model. That article referred to two types of JavaScript file that implement the behavior of a simulated device:

- **State** JavaScript files that run at fixed intervals to update the internal state of the device.
- **Method** JavaScript files that run when the solution invokes a method on the device.

In this article, you learn how to:

>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device responds to a method call from the Remote Monitoring solution
> * Debug your scripts

[!INCLUDE [iot-accelerators-device-schema](../../includes/iot-accelerators-device-schema.md)]

## Next steps

This article described how to define the behavior of your own custom simulated device model. This article showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Control the state of a simulated device
> * Define how a simulated device responds to a method call from the Remote Monitoring solution
> * Debug your scripts

Now that you've learned how to specify the behavior of a simulated device, the suggested next step is to learn how to [Create a simulated device](iot-accelerators-remote-monitoring-create-simulated-device.md).

For more developer information about the Remote Monitoring solution, see:

* [Developer Reference Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Reference-Guide)
* [Developer Troubleshooting Guide](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet/wiki/Developer-Troubleshooting-Guide)

<!-- Next tutorials in the sequence -->
