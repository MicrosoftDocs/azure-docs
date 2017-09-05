---
title: Device management on Azure IoT Suite remote monitoring | Microsoft Docs
description: This tutorial shows you how to manage devices connected to the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/05/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Manage and configure your devices

Contoso has ordered new machinery to expand one of their facilities to increase output. While you wait for the new machinery to be delivered, you want to run a simulation to verify the behavior of your solution.

This tutorial shows you how to manage the devices connected to your solution from the solution dashboard.

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Provision a simulated device.
> * Test the simulated device.
> * Call device methods from the dashboard.
> * Provision a physical device.

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Provision a simulated device

Navigate to the **Devices** page in the solution and then choose **Add devices**:

<!-- TODO insert screenshot -->

Choose **Manual** and **Simulated device**. Enter a **Device ID** such as `myTestDevice`, choose **Engine** as the **Device Type**, and then choose **Create device** to create the simulated device:

<!-- TODO insert screenshot -->

## Test the simulated device

To view details of your new simulated device, select it in the list of devices:

<!-- TODO insert screenshot -->

In **Device details**, verify your new device is sending telemetry:

<!-- TODO insert screenshot -->

The **Device details** section displays other information about the device such as the methods it supports and the metadata it sent to the solution.

## Act on a device

To act on a device, select it in the list of devices and then choose **Act on device**:

<!-- TODO insert screenshot -->

In **Device details**, verify your new device is sending telemetry:

<!-- TODO insert screenshot -->

The **Device details** section displays other information about the device such as the methods it supports and the metadata it sent to the solution.

### Reboot

Choose the **Reboot** task. Then verify the simulated device responds to the action:
<!-- TODO Need to check exactly how to see the response from the device -->

<!-- TODO insert screenshot -->

### Firmware update

Choose the **Firmware update** task. Then verify the simulated device responds to the action:
<!-- TODO Need to check exactly how to see the response from the device -->

<!-- TODO insert screenshot -->

### Empty tank

Choose the **Empty tank** task. Then verify the simulated device responds to the action:
<!-- TODO Need to check exactly how to see the response from the device -->

<!-- TODO insert screenshot -->

### Fill tank

Choose the **Fill tank** task. Then verify the simulated device responds to the action:
<!-- TODO Need to check exactly how to see the response from the device -->

<!-- TODO insert screenshot -->

### Methods in other devices

Other device types support different actions. When a device first connects to the solution, it sends a list of supported actions in the reported properties.

> [!NOTE]
> Actions are implemented as [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md) in the simulated devices.

## Provision a physical device

Navigate to the **Devices** page in the solution and then choose **Add devices**:

<!-- TODO insert screenshot -->

Choose **Manual**. Enter a **Device ID** such as `myPhysicalDevice`, choose an authentication, and then choose **Create device** to create the simulated device:

<!-- TODO insert screenshot -->

If you choose **Symmetric key** as the authentication type, the solution can generate keys for you. Your physical device must use the **Device ID** and one of the keys to connect to the solution.

## Next steps

This tutorial showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Provision a simulated device.
> * Test the simulated device.
> * Call device methods from the dashboard.
> * Provision a physical device.

Now that you have learned how to manage your devices, the suggested next steps are to learn how to:

* [Troubleshoot and remediate device issues](iot-suite-remote-monitoring-maintain.md).
* [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).
* [Connect your device to the remote monitoring preconfigured solution](iot-suite-connecting-devices-node.md)

<!-- Next tutorials in the sequence -->