---
title: Understand Azure IoT Edge modules | Microsoft Docs 
description: Learn about Azure IoT Edge modules and how they are configured
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 09/21/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Understand Azure IoT Edge modules

Azure IoT Edge lets you deploy and manage business logic on the edge in the form of *modules*. Azure IoT Edge modules are the smallest unit of computation managed by IoT Edge, and can contain Azure services (such as Azure Stream Analytics) or your own solution-specific code. To understand how modules are developed, deployed, and maintained, it helps to think of four conceptual pieces that make up a module:

* A **module image** is a package containing the software that defines a module.
* A **module instance** is the specific unit of computation running the module image on an IoT Edge device. The module instance is started by the IoT Edge runtime.
* A **module identity** is a piece of information (including security credentials) stored in IoT Hub, that is associated to each module instance.
* A **module twin** is a JSON document stored in IoT Hub, that contains state information for a module instance, including metadata, configurations, and conditions. 

## Module images and instances

IoT Edge module images contain applications that take advantage of the management, security, and communication features of the IoT Edge runtime. You can develop your own module images, or export one from a supported Azure service, such as Azure Stream Analytics.
The images exist in the cloud and they can be updated, changed, and deployed in different solutions. For instance, a module that uses machine learning to predict production line output exists as a separate image than a module that uses computer vision to control a drone. 

Each time a module image is deployed to a device and started by the IoT Edge runtime, a new instance of that module is created. Two devices in different parts of the world could use the same module image; however each would have their own module instance when the module is started on the device. 

![Module images in cloud - module instances on devices][1]

In implementation, modules images exist as container images in a repository, and module instances are containers on devices. 

<!--
As use cases for Azure IoT Edge grow, new types of module images and instances will be created. For example, resource constrained devices cannot run containers so may require module images that exist as dynamic link libraries and instances that are executables. 
-->

## Module identities

When a new module instance is created by the IoT Edge runtime, the instance is associated with a corresponding module identity. The module identity is stored in IoT Hub, and is employed as the addressing and security scope for all local and cloud communications for that specific module instance.
The identity associated with a module instance depends on the identity of the device on which the instance is running and the name you provide to that module in your solution. For instance, if you call `insight` a module that uses an Azure Stream Analytics, and you deploy it on a device called `Hannover01`, the IoT Edge runtime creates a corresponding module identity called `/devices/Hannover01/modules/insight`.

Clearly, in scenarios when you need to deploy one module image multiple times on the same device, you can deploy the same image multiple times with different names.

![Module identities are unique][2]

## Module twins

Each module instance also has a corresponding module twin that you can use to configure the module instance. The instance and the twin are associated with each other through the module identity. 

A module twin is a JSON document that stores module information and configuration properties. This concept parallels the [device twin][lnk-device-twin] concept from IoT Hub. The structure of a module twin is exactly the same as a device twin. The APIs used to interact with both types of twins are also the same. The only difference between the two is the identity used to instantiate the client SDK. 

```csharp
// Create a ModuleClient object. This ModuleClient will act on behalf of a 
// module since it is created with a module’s connection string instead 
// of a device connection string. 
ModuleClient client = new ModuleClient.CreateFromEnvironmentAsync(settings); 
await client.OpenAsync(); 
 
// Get the module twin 
Twin twin = await client.GetTwinAsync(); 
```

## Offline capabilities

Azure IoT Edge supports offline operations on your IoT Edge devices. These capabilities are limited for now. 

IoT Edge modules can be offline for extended periods as long as the following requirements are met: 

* **Message time-to-live (TTL) has not expired**. The default value for message TTL is two hours, but can be changed higher or lower in the Store and forward configuration in the IoT Edge hub settings. 
* **Modules don't need to reauthenticate with the IoT Edge hub when offline**. Modules can only authenticate with Edge hubs that have an active connection with an IoT hub. Modules need to re-authenticate if they are restarted for any reason. Modules can still send messages to the Edge hub after their SAS token has expired. When connectivity resumes, the Edge hub requests a new token from the module and validates it with the IoT hub. If successful, the Edge hub forwards the module messages it has stored, even the messages that were sent while the module's token was expired. 
* **The module that sent the messages while offline is still functional when connectivity resumes**. Upon reconnecting to IoT Hub, the Edge hub needs to validate a new module token (if the previous one expired) before it can forward the module messages. If the module is not available to provide a new token, the Edge hub cannot act on the module's stored messages. 
* **The Edge hub has disk space to store the messages**. By default, messages are stored in the Edge hub container's filesystem. There is a configuration option to specify a mounted volume to store the messages instead. In either case, there needs to be space available to store the messages for deferred delivery to IoT Hub.  

Additional offline capabilities are available in public preview. For more information, see [Understand extended offline capabilities for IoT Edge devices, modules, and child devices](offline-capabilities.md).

## Next steps
 - [Understand the requirements and tools for developing IoT Edge modules][lnk-mod-dev]
 - [Understand the Azure IoT Edge runtime and its architecture][lnk-runtime]

<!-- Images -->
[1]: ./media/iot-edge-modules/image_instance.png
[2]: ./media/iot-edge-modules/identity.png

<!-- Links -->
[lnk-device-identity]: ../iot-hub/iot-hub-devguide-identity-registry.md
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-runtime]: iot-edge-runtime.md
[lnk-mod-dev]: module-development.md
