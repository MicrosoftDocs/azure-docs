---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Understand Azure IoT Edge modules | Microsoft Docs 
description: Learn about Azure IoT Edge modules and how they are configured
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 10/05/2017
ms.topic: article
ms.service: iot-edge

---

# Understand Azure IoT Edge modules - Public preview

Azure IoT Edge modules are the programs that run your cloud or business logic on the edge. To understand how modules are developed, deployed, and maintained, it helps to think of four conceptual pieces that make up a module:

* A **module image** is the logic that defines a module.
* A **module instance** is the specific unit of computation running the module image on an IoT Edge device. The module instance is started by the IoT Edge runtime. 
* A **module identity** is a unique identifier to manage each module instance.
* A **module twin** is a configuration document that exists in the cloud so that you can make changes remotely. 

## Module images and instances

When you take logic from an Azure service or your own business analytics and package it in a container, that's a module image. The images exist in the cloud and can be updated or changed. A module that uses machine learning to predict production line output exists as a separate image than a module that uses computer vision to control a drone. 

Each time a module image is deployed to a device and started by the IoT Edge runtime, a new instance of that module is created. A factory in Germany and a factory in Saudi Arabia may use the same production line module image from the cloud, but they each run a different module instance. 

![Module images in cloud - module instances on devices][1]

In implementation, modules images exist as container images in a repository, and module instances are containers on devices. As use cases for Azure IoT Edge grow, new types of module images an instances will be created. For example, resource constrained devices cannot run containers so may require module images that exist as dynamic link libraries and instances that are executables. 

## Module identities

Every module instance has a corresponding identity that is unique across all instances. Module identities are tracked in the cloud. By maintaining unique identities, you can remotely manage and monitor all the module instances running on your devices. 

Consider the same example of factories that run separate instances of a production line module. To give each module instance a unique identity, we combine the device name with the module name. This naming convention makes it easy to distinguish where each module instance is running. 

There may be scenarios when you need to deploy one module image multiple times on the same device. To ensure that each of these instances has a unique identity, we add a numerical identifier to the module name. 

![Module identities are unique][2]

## Module twins

Each module instance also has a corresponding module twin that you can use to configure the module instance. The instance and the twin are associated with each other through the module identity. 

A module twin is a JSON document that stores module information and configuration properties. This concept parallels the [device identity][lnk-device-identity] and [device twin][lnk-device-twin] concepts from IoT Hub. The structure of a module twin is exactly the same as a device twin. The APIs used to interact with both types of twins are also the same. The only difference between the two is the identity used to instantiate the client SDK. 

```
// Create a DeviceClient object. This DeviceClient will act on behalf of a 
// module since it is created with a module’s connection string instead 
// of a device connection string. 
DeviceClient client = new DeviceClient.CreateFromConnectionString(moduleConnectionString, settings); 
await client.OpenAsync(); 
 
// Get the model twin 
Twin twin = await client.GetTwinAsync(); 
```

## Next steps
 - [Understand the Azure IoT Edge runtime and its architecture][lnk-runtime]

<!-- Images -->
[1]: ./media/iot-edge-modules/image_instance.png
[2]: ./media/iot-edge-modules/identity.png

<!-- Links -->
[lnk-device-identity]: ../iot-hub/iot-hub-devguide-identity-registry.md
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-runtime]: iot-edge-runtime.md