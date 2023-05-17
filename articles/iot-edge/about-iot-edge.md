---
title: What is Azure IoT Edge | Microsoft Docs
description: Overview of the Azure IoT Edge service
author: PatAltimore
ms.service: iot-edge
services: iot-edge
ms.topic: overview
ms.date: 1/31/2023
ms.author: patricka
ms.custom: mvc
---

# What is Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge is a device-focused runtime that enables you to deploy, run, and monitor containerized Linux workloads.

Analytics drives business value in IoT solutions, but not all analytics need to be in the cloud. Azure IoT Edge helps you bring the analytical power of the cloud closer to your devices to drive better business insights and enable offline decision making. For example, you can run anomaly detection workloads at the edge to respond as quickly as possible to emergencies happening on a production line. If you want to reduce bandwidth costs and avoid transferring terabytes of raw data, you can clean and aggregate the data locally then only send the insights to the cloud for analysis.

Azure IoT Edge is a feature of [Azure IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) and enables you to scale out and manage an IoT solution from the cloud. By packaging your business logic into standard containers and using optional pre-built [IoT Edge modules from the Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules) you can easily compose, deploy, and maintain your solution.

Azure IoT Edge is made up of three components:

* **IoT Edge modules** are containers that run Azure services, third-party services, or your own code. Modules are deployed to IoT Edge devices and execute locally on those devices.
* The **IoT Edge runtime** runs on each IoT Edge device and manages the modules deployed to each device.
* A **cloud-based interface** enables you to remotely monitor and manage IoT Edge devices.

>[!NOTE]
>Azure IoT Edge is available in the free and standard tier of IoT Hub. The free tier is for testing and evaluation only. For more information about the basic and standard tiers, see [How to choose the right IoT Hub tier](../iot-hub/iot-hub-scaling.md).

## IoT Edge modules

IoT Edge modules are units of execution, implemented as Docker-compatible containers, that run your business logic at the edge. Multiple modules can be configured to communicate with each other, creating a pipeline of data processing. You can develop custom modules or package certain Azure services into modules that provide insights offline and at the edge.

### Artificial intelligence at the edge

Azure IoT Edge allows you to deploy complex event processing, machine learning, image recognition, and other high value AI without writing it in-house. Azure services like Azure Stream Analytics and Azure Machine Learning can all be run on-premises via Azure IoT Edge. You're not limited to Azure services, though. Anyone is able to create AI modules for your own use or optionally make them available to the community through the Azure Marketplace.

### Bring your own code

When you want to deploy your own code to your devices, Azure IoT Edge supports that, too. Azure IoT Edge holds to the same programming model as the other Azure IoT services. You can run the same code on a device or in the cloud. Azure IoT Edge supports both Linux and Windows so you can code to the platform of your choice. It supports Java, .NET Core 3.1, Node.js, C, and Python so your developers can code in a language they already know and use existing business logic.

## IoT Edge runtime

The Azure IoT Edge runtime enables custom and cloud logic on IoT Edge devices. The runtime sits on the IoT Edge device, and performs management and communication operations. The runtime performs several functions:

* Installs and updates workloads on the device.
* Maintains Azure IoT Edge security standards on the device.
* Ensures that IoT Edge modules are always running.
* Reports module health to the cloud for remote monitoring.
* Manages communication between downstream devices and an IoT Edge device, between modules on an IoT Edge device, and between an IoT Edge device and the cloud.

:::image type="content" source="./media/about-iot-edge/runtime.png" alt-text="Diagram of how IoT Edge runtime sends insights and reporting to IoT Hub.":::

How you use an Azure IoT Edge device is up to you. The runtime is often used to deploy AI to gateway devices which aggregate and process data from other on-premises devices, but this deployment model is just one option.

The Azure IoT Edge runtime runs on a large set of IoT devices that enables using it in a wide variety of ways. It supports both Linux and Windows operating systems and abstracts hardware details. Use a device smaller than a Raspberry Pi 3 if you're not processing much data, or use an industrial server to run resource-intensive workloads.

## IoT Edge cloud interface

It's difficult to manage the software life cycle for millions of IoT devices that are often different makes and models or geographically scattered. Workloads are created and configured for a particular type of device, deployed to all of your devices, and monitored to catch any misbehaving devices. These activities can't be done on a per device basis and must be done at scale.

Azure IoT Edge integrates seamlessly with [Azure IoT Central](../iot-central/index.yml) to provide one control plane for your solution's needs. Cloud services allow you to:

* Create and configure a workload to be run on a specific type of device.
* Send a workload to a set of devices.
* Monitor workloads running on devices in the field.

:::image type="content" source="./media/about-iot-edge/cloud-interface.png" alt-text="Diagram of how device telemetry and actions are coordinated with the cloud.":::

## Next steps

Try out IoT Edge concepts by deploying your first IoT Edge module to a device:

* [Deploy modules to a Linux IoT Edge device](quickstart-linux.md)
* [Deploy modules to a Windows IoT Edge device](quickstart.md)
