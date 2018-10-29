---
title: What is Azure IoT Edge | Microsoft Docs
description: Overview of the Azure IoT Edge service
author: kgremban
manager: timlt
# this is the PM responsible
ms.reviewer: chipalost
ms.service: iot-edge
services: iot-edge
ms.topic: overview
ms.date: 06/12/2018
ms.author: kgremban
ms.custom: mvc
---

# What is Azure IoT Edge

Azure IoT Edge moves cloud analytics and custom business logic to devices so that your organization can focus on business insights instead of data management. Enable your solution to truly scale by configuring your IoT software, deploying it to devices via standard containers, and monitoring it all from the cloud.

>[!NOTE]
>Azure IoT Edge is available in the free and standard tier of IoT Hub. The free tier is for testing and evaluation only. For more information about the basic and standard tiers, see [How to choose the right IoT Hub tier](../iot-hub/iot-hub-scaling.md).

Analytics drives business value in IoT solutions, but not all analytics needs to be in the cloud. If you want a device to respond to emergencies as quickly as possible, you can perform anomaly detection on the device itself. Similarly, if you want to reduce bandwidth costs and avoid transferring terabytes of raw data, you can perform data cleaning and aggregation locally. Then send the insights to the cloud. 

Azure IoT Edge is made up of three components:
* IoT Edge modules are containers that run Azure services, 3rd party services, or your own code. They are deployed to IoT Edge devices and execute locally on those devices. 
* The IoT Edge runtime runs on each IoT Edge device and manages the modules deployed to each device. 
* A cloud-based interface enables you to remotely monitor and manage IoT Edge devices.

## IoT Edge modules

IoT Edge modules are units of execution, currently implemented as Docker compatible containers, that run your business logic at the edge. Multiple modules can be configured to communicate with each other, creating a pipeline of data processing. You can develop custom modules or package certain Azure services into modules that provide insights offline and at the edge. 

### Artificial Intelligence on the edge

Azure IoT Edge allows you to deploy complex event processing, machine learning, image recognition and other high value AI without writing it in house. Azure services like Azure Functions, Azure Stream Analytics, and Azure Machine Learning can all be run on premises via Azure IoT Edge; however you’re not limited to Azure services. Anyone is able to create AI modules and make them available to the community for use. 

### Bring your own code

When you want to deploy your own code to your devices, Azure IoT Edge supports that, too. Azure IoT Edge holds to the same programming model as the other Azure IoT services. The same code can be run on a device or in the cloud. Azure IoT Edge supports both Linux and Windows so you can code to the platform of your choice. It supports Java, .NET Core 2.0, Node.js, C, and Python so your developers can code in a language they already know and use existing business logic without writing it from scratch.

## IoT Edge runtime

The Azure IoT Edge runtime enables custom and cloud logic on IoT Edge devices. It sits on the IoT Edge device, and performs management and communication operations. The runtime performs several functions:

* Installs and updates workloads on the device.
* Maintains Azure IoT Edge security standards on the device.
* Ensures that IoT Edge modules are always running.
* Reports module health to the cloud for remote monitoring.
* Facilitates communication between downstream leaf devices and the IoT Edge device.
* Facilitates communication between modules on the IoT Edge device.
* Facilitates communication between the IoT Edge device and the cloud.

![IoT Edge runtime sends insights and reporting to IoT Hub](./media/about-iot-edge/runtime.png)

How you use an Azure IoT Edge device is completely up to you. The runtime is often used to deploy AI to gateways which aggregate and process data from multiple other on premises devices, however this is just one option. Leaf devices could also be Azure IoT Edge devices, regardless of whether they are connected to a gateway or directly to the cloud.

The Azure IoT Edge runtime runs on a large set of IoT devices to enable using the runtime in a wide variety of ways. It supports both Linux and Windows operating systems as well as abstracts hardware details. Use a device smaller than a Raspberry Pi 3 if you’re not processing much data or scale up to an industrialized server to run resource intensive workloads.

## IoT Edge cloud interface

Managing the software lifecycle for enterprise devices is complicated. Managing the software lifecycle for millions of heterogenous IoT devices is even more difficult. Workloads must be created and configured for a particular type of device, deployed at scale to the millions of devices in your solution, and monitored to catch any misbehaving devices. These activities can’t be done on a per device basis and must be done at scale.

Azure IoT Edge integrates seamlessly with Azure IoT solution accelerators to provide one control plane for your solution’s needs. Cloud services allow users to:

* Create and configure a workload to be run on a specific type of device.
* Send a workload to a set of devices.
* Monitor workloads running on devices in the field.

![Telemetry, insights, and actions of devices are coordinated with the cloud](./media/about-iot-edge/cloud-interface.png)

## Next steps

Try out these concepts by [deploying IoT Edge on a simulated device](quickstart.md).

 
