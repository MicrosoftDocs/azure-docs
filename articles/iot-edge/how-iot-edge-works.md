---
title: How Azure IoT Edge works | Microsoft Docs
description: Overview of the Azure IoT Edge service
services: iot-Edge
documentationcenter: ''
author: kgremban
manager: timlt
editor: chipalost

ms.assetid:
ms.service: iot-hub
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2017
ms.author: kgremban
ms.custom: 
---

# How Azure IoT Edge works - Public preview

Azure IoT Edge moves cloud analytics and custom business logic to devices so that your organization can focus on business insights instead of data management. Enable your solution to truly scale by configuring your IoT software, deploying it to devices via standard containers, and monitoring it all from the cloud.

Analytics drives business value in IoT solutions, but not all analytics needs to be in the cloud. If you want a device to respond to emergencies as quickly as possible, you can perform anomaly detection on the device itself. Similarly, if you want to reduct bandwidth costs and avoid transferring terabytes of raw data, you can perform data cleaning and aggregation locally then send the insights to the cloud. 

Azure IoT Edge is made up of three components:
* IoT Edge modules are containers that run Azure services or your own code, and are deployed on IoT Edge devices. 
* The IoT Edge runtime is deployed to each IoT Edge device, and manages the modules. 
* A cloud-based interface enables you to remotely monitor and manage IoT Edge devices.

## IoT Edge modules

IoT Edge modules are units of execution, currently implemented as Docker compatible containers, that run your business logic at the edge. Multiple modules can be configured to communicate with each other, creating a pipeline of data processing. You can develop custom modules or package certain Azure services into modules that provide insights offline and at the edge. 

### Azure on the edge

When you use Azure IoT Hub to manage your devices, it's easy to integrate with other Azure services to store and process data to create insights or make business decisions. Azure IoT Edge is designed to enhance this relationship. If you already use a cloud analytics service to process data from your devices, you shouldn't need to rewrite the logic in order to move it to the edge. Instead, Azure IoT Edge allows you to deploy the event processing, machine learning, image recognition, and AI products that you're familiar with. 

### Bring your own code

When you do want to deploy your own code to your devices, Azure IoT Edge supports that, too. Azure IoT Edge holds to the same programming model as the other Azure IoT services. This consistency means that the same code can be run on a device or in the cloud. Azure IoT Edge supports both Linux and Windows so you can code to the platform of your choice. It supports Java, .NET Core 2.0, Node.js, C, and Python so your developers can code in a language they already know and use existing business logic without writing it from scratch.

## IoT Edge runtime

The Azure IoT Edge runtime enables custom and cloud logic on IoT Edge devices. It lets you locally run workloads tailored to a specific type of device. The runtime performs several functions:

* Installs modules on a device.
* Ensures modules are always running.
* Reports module health to the cloud for remote monitoring.
* Facilitates communication between a downstream leaf device and the IoT Edge device.
* Facilitates communication between modules.
* Facilitates communication between the IoT Edge device and cloud.
* Performs security checks on modules before they run and during operation.

![IoT Edge runtime sends insights and reporting to IoT Hub][1]

## IoT Edge cloud interface

Managing the software lifecycle for enterprise devices is complicated. Managing the software lifecycle for millions of heterogenous IoT devices is even more difficult. Workloads must be created and configured for a particular type of device, deployed at scale to the millions of devices in your solution, and monitored to catch any misbehaving devices. These activities can’t be done on a per device basis and must be done at scale.

Azure IoT Edge integrates seamlessly with Azure IoT Suite to provide one control plane for your solution’s needs. Cloud services allow users to:

* Create and configure a workload to be run on a specific type of device.
* Send a workload to a set of devices.
* Monitor workloads running on devices in the field.

![Telemetry, insights, and actions of devices are coordinated with the cloud][2]

## Next steps

Try out these concepts by [deploying IoT Edge on a simulated device][lnk-quickstart].

<!-- Images -->
[1]: ./media/how-iot-edge-works/runtime.png
[2]: ./media/how-iot-edge-works/cloud-interface.png

<!-- Links -->
[lnk-quickstart]: quickstart.md