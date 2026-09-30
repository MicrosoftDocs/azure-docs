---
title: How Azure IoT Edge Modules Run Logic on Devices
description: Learn how Azure IoT Edge modules run logic on devices, using containerized applications, and secure communication with IoT Hub.
author: sethmanheim
ms.author: sethm
ms.date: 02/27/2026
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom:
  - devx-track-csharp
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-gen-description
#customer intent: As a developer, I want to understand how Azure IoT Edge modules run logic on devices so that I can design and deploy edge solutions effectively.
---

# Understand Azure IoT Edge modules

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge lets you deploy and manage business logic on edge devices by using *modules*. Azure IoT Edge modules are the smallest unit of computation managed by IoT Edge. They can contain Azure services, such as Azure Stream Analytics, or your own solution-specific code. To understand how modules are developed, deployed, and maintained, consider the four conceptual elements of a module:

* A **module image** is a package containing the software that defines a module.
* A **module instance** is the specific unit of computation running the module image on an IoT Edge device. The IoT Edge runtime starts the module instance.
* A **module identity** is a piece of information, including security credentials, that IoT Hub stores and associates with each module instance.
* A **module twin** is a JSON document that IoT Hub stores and contains state information for a module instance, including metadata, configurations, and conditions.

## Module images and instances

IoT Edge module images contain applications that take advantage of the management, security, and communication features of the IoT Edge runtime. You can develop your own module images or export one from a supported Azure service, such as Azure Stream Analytics.
You manage images in the cloud. You can update, change, and deploy them in different solutions. For example, a module that uses machine learning to predict production line output is a separate image from a module that uses computer vision to control a drone.

Each time the IoT Edge runtime deploys and starts a module image on a device, it creates a new instance of that module. Two devices in different parts of the world can use the same module image. However, each device has its own module instance when the module starts on the device.

![Diagram - Module images in cloud, module instances on devices](./media/iot-edge-modules/image_instance.png)

In implementation, module images exist as container images in a repository, and module instances are containers on devices.

## Module identities

When the IoT Edge runtime creates a new module instance, it assigns a corresponding module identity. IoT Hub stores the module identity, which serves as the addressing and security scope for all local and cloud communications for the module instance.

The module instance's identity depends on the device's identity and the name you assign to the module in your solution. For example, if you name a module `insight` and deploy it on a device called `Hannover01`, the IoT Edge runtime creates a corresponding module identity called `/devices/Hannover01/modules/insight`.

In scenarios where you need to deploy one module image multiple times on the same device, you can deploy it with different names.

![Diagram - Module identities are unique within devices and across devices](./media/iot-edge-modules/identity.png)

## Module twins

Each module instance has a corresponding module twin you use to configure it. The module identity links the instance and the twin.

A module twin is a JSON document that stores module information and configuration properties. This concept parallels the [device twin](../iot-hub/iot-hub-devguide-device-twins.md) concept from IoT Hub. A module twin's structure is the same as a device twin's. The APIs for interacting with both types of twins are the same. The only difference between the two is the identity used to instantiate the client SDK.

```csharp
// Create a ModuleClient object. This ModuleClient will act on behalf of a
// module since it is created with a module's connection string instead
// of a device connection string.
ModuleClient client = new ModuleClient.CreateFromEnvironmentAsync(settings);
await client.OpenAsync();

// Get the module twin
Twin twin = await client.GetTwinAsync();
```
## Offline capabilities

Azure IoT Edge modules operate offline indefinitely after syncing with IoT Hub once. IoT Edge devices can also extend this offline capability to other IoT devices. For more information, see [Understand extended offline capabilities for IoT Edge devices, modules, and downstream devices](offline-capabilities.md).

## Next steps

* [Understand the requirements and tools for developing IoT Edge modules](module-development.md)
* [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md)
