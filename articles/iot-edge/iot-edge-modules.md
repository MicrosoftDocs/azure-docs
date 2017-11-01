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

# Understand Azure IoT Edge modules

Azure IoT Edge modules are the programs that run your cloud or business logic on the edge. To understand how modules are developed, deployed, and maintained, it helps to think of four conceptual pieces that make up a module:

* A **module image** is the logic that defines a module.
* A **module instance** is the specific unit of computation running the module image on an IoT Edge device. The module instance is started by the IoT Edge runtime. 
* A **module identity** is a unique identifier to manage each module instance.
* A **module twin** is a configuration document that exists in the cloud so that you can make changes remotely. 

## Module images and instances

When you take logic from an Azure service or your own business analytics and package it in a container, that's a module image. The images exist in the cloud and can be updated or changed. A module made to predict oil well failure exists as a separate image than a module made to predict energy usage by a smart building. 

Each time a module image is deployed to a device and started by the IoT Edge runtime, a new instance of that module is created. An oil well in Texas and an oil well in Saudi Arabia may be based off of the same module image in the cloud, but they each run a different module instance. 

In implementation, modules images exist as container images in a repository, and module instances are containers on devices. As use cases for Azure IoT Edge grow, new types of module images an instances will be created. For example, resource constrained devices cannot run containers so may require module images that exist as dynamic link libraries and instances that are executables. 

