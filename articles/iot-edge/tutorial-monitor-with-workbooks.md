---
title: Tutorial - Azure Monitor workbooks for IoT Edge
description: Learn how to monitor IoT Edge modules and devices using Azure Monitor Workbooks for IoT
author: kgremban
manager: lizross
ms.author: kgremban
ms.date: 08/02/2021
ms.topic: tutorial
ms.service: iot-edge
services: iot-edge
ms.custom: mvc
---

# Tutorial: Monitor IoT Edge devices

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

Use Azure Monitor workbooks to monitor the health and performance of your Azure IoT Edge deployments.

In this tutoria, you learn how to:

> [!div class="checklist"]
>
> * Understand what metrics are shared by IoT Edge devices.
> * Deploy the **metrics-collector** module to an IoT Edge device.
> * View curated visualizations of the metrics collected from the device.
> * Create a log alert rule to monitor your devices.

## Prerequisites

An IoT Edge device with the simulated temperature sensor module deployed to it. If you don't have a device ready, follow the steps in [Deploy your first IoT Edge module to a virtual Linux device](quickstart-linux.md) to create one using a virtual machine.

## IoT Edge built-in metrics

Every IoT Edge device relies on two modules, the *runtime modules*, which are tasked with managing the lifecycle and communication of all the other modules on a device. These modules are called the **IoT Edge agent** and the **IoT Edge hub**. To learn more about these modules, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

Both of the runtime modules create metrics that allow you to remotely monitor how an IoT Edge device or its individual modules are performing. The IoT Edge agent reports on the state of individual modules as well as the host device, so creates metrics like how long a module has been running correctly, or the amount of RAM and percent of CPU being used on the device. The IoT Edge hub reports on communications on the device, so creates metrics like the total number of messages sent and received, or the time it takes to resolve a direct method. For the full list of available metrics, see [Access built-in metrics](how-to-access-built-in-metrics.md).