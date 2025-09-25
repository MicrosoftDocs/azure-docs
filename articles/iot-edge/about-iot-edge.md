---
title: What is Azure IoT Edge
description: Learn how Azure IoT Edge enables you to deploy, run, and monitor containerized Linux workloads at the edge for better business insights and offline decision-making.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-edge
services: iot-edge
ms.topic: overview
ms.date: 08/28/2025
ms.custom:
  - mvc, linux-related-content
  - ai-gen-docs-bap
  - ai-gen-description
  - ai-seo-date:03/20/2025
#customer intent: As a developer, I want to know how to create and deploy custom IoT Edge modules so that I can run my business logic on edge devices.
---

# What is Azure IoT Edge

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

Azure IoT Edge is a device-focused runtime that enables you to deploy, run, and monitor containerized Linux workloads, bringing analytics closer to your devices for faster insights and offline decision-making.

Analytics drives business value in IoT solutions, but not all analytics need to be in the cloud. Azure IoT Edge helps you bring the analytical power of the cloud closer to your devices to drive better business insights and enable offline decision making. For example, you can run anomaly detection workloads at the edge to respond as quickly as possible to emergencies happening on a production line. If you want to reduce bandwidth costs and avoid transferring terabytes of raw data, you can clean and aggregate the data locally then only send the insights to the cloud for analysis.

Azure IoT Edge brings edge-based capabilities to a cloud-based solution and is a feature of [Azure IoT Hub](../iot-hub/iot-concepts-and-iot-hub.md) that enables you to scale out and manage an IoT solution from the cloud. By packaging your business logic into standard containers and using optional pre-built IoT Edge module images from partners or the [Microsoft Artifact Registry](https://mcr.microsoft.com/catalog?cat=IoT%20Edge%20Modules&alphaSort=asc&alphaSortKey=Name), you can easily compose, deploy, and maintain your solution.

Azure IoT Edge is made up of three components:

* **IoT Edge modules** are containers that run Azure services, third-party services, or your own code. Modules are deployed to IoT Edge devices and execute locally on those devices.
* The **IoT Edge runtime** runs on each IoT Edge device and manages the modules deployed to each device.
* A **cloud-based interface** enables you to remotely monitor and manage IoT Edge devices.

>[!NOTE]
>Azure IoT Edge is available in the free and standard tier of IoT Hub. The free tier is for testing and evaluation only. For more information about the basic and standard tiers, see [How to choose the right IoT Hub tier](../iot-hub/iot-hub-scaling.md).

## IoT Edge modules

IoT Edge modules are units of execution, implemented as Docker-compatible containers, that run your business logic at the edge. Multiple modules can be configured to communicate with each other, creating a pipeline of data processing. You can develop custom modules or package certain Azure services into modules that provide insights offline and at the edge.

### Artificial intelligence at the edge

Azure IoT Edge allows you to deploy advanced AI workloads like machine learning, image recognition, and complex event processing directly at the edge—without the need for in-house development. Azure services like Azure Stream Analytics and Azure Machine Learning can all be run on-premises via Azure IoT Edge. You're not limited to Azure services, though. Anyone can create AI modules for their own use.

### Bring your own code

When you want to deploy your own code to your devices, Azure IoT Edge supports that, too. Azure IoT Edge holds to the same programming model as the other Azure IoT services. You can run the same code on a device or in the cloud. Azure IoT Edge supports both Linux and Windows so you can code to the platform of your choice. It supports Java, .NET Core 3.1, Node.js, C, and Python, so your developers can code in a language they already know and use existing business logic.

## IoT Edge runtime

The Azure IoT Edge runtime enables custom and cloud logic on IoT Edge devices. The runtime sits on the IoT Edge device, and performs management and communication operations. The runtime performs several functions:

* Installs and updates workloads on the device.
* Maintains Azure IoT Edge security standards on the device.
* Ensures that IoT Edge modules are always running.
* Reports module health to the cloud for remote monitoring.
* Manages communication between downstream devices and an IoT Edge device, between modules on an IoT Edge device, and between an IoT Edge device and the cloud.

:::image type="content" source="./media/about-iot-edge/runtime.png" alt-text="Diagram of how IoT Edge runtime sends insights and reporting to IoT Hub." lightbox="media/about-iot-edge/runtime.png":::

How you use an Azure IoT Edge device is up to you. The runtime is often used to deploy AI to gateway devices that aggregate and process data from other on-premises devices, but this deployment model is just one option.

The Azure IoT Edge runtime runs on a large set of IoT devices that enables using it in a wide variety of ways. It supports both Linux and Windows operating systems and abstracts hardware details. Use a device smaller than a Raspberry Pi 3 if you're not processing much data, or use an industrial server to run resource-intensive workloads.

## IoT Edge cloud interface

It's difficult to manage the software lifecycle for millions of IoT devices that are often different makes and models or geographically scattered. Workloads are created and configured for a particular type of device, deployed to all of your devices, and monitored to catch any misbehaving devices. These activities can't be done on a per-device basis and must be done at scale.

Azure IoT Edge integrates seamlessly with [Azure IoT Central](../iot-central/index.yml) to provide one control plane for your solution's needs. Cloud services allow you to:

* Create and configure a workload to be run on a specific type of device.
* Send a workload to a set of devices.
* Monitor workloads running on devices in the field.

:::image type="content" source="./media/about-iot-edge/cloud-interface.png" alt-text="Diagram of how device data and actions are coordinated with the cloud." lightbox="media/about-iot-edge/cloud-interface.png":::

## Next steps

Take the next step in learning IoT Edge concepts by deploying your first IoT Edge module to a device:

* [Deploy modules to a Linux IoT Edge device](quickstart-linux.md)
* [Deploy modules to a Windows IoT Edge device](quickstart.md)
