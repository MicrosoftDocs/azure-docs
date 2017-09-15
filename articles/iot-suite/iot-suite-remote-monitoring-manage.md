---
title: Device management in remote monitoring solution - Azure | Microsoft Docs
description: This tutorial shows you how to manage devices connected to the remote monitoring solution.
services: ''
suite: iot-suite
author: dominicbetts
manager: timlt
ms.author: dobett
ms.service: iot-suite
ms.date: 09/06/2017
ms.topic: article
ms.devlang: NA
ms.tgt_pltfrm: NA
ms.workload: NA
---

# Manage and configure your devices

Contoso has ordered new machinery to expand one of their facilities to increase output. While you wait for the new machinery to be delivered, you want to run a simulation to verify the behavior of your solution. As an operator, you want to manage and configure the devices in the remote monitoring solution.

To provide an extensible way to manage and configure devices, the remote monitoring solution uses IoT Hub features such as [jobs](../iot-hub/iot-hub-devguide-jobs.md) and [direct methods](../iot-hub/iot-hub-devguide-direct-methods.md). To learn how a device developer implements methods on a physical device, see [Customize the remote monitoring preconfigured solution](iot-suite-remote-monitoring-customize.md).

In this tutorial, you learn how to:

>[!div class="checklist"]
> * Provision a simulated device.
> * Test the simulated device.
> * Call device methods from the solution.
> * Reconfigure a device.

## Prerequisites

To follow this tutorial, you need a deployed instance of the remote monitoring solution in your Azure subscription.

If you haven't deployed the remote monitoring solution yet, you should complete the [Deploy the remote monitoring preconfigured solution](iot-suite-remote-monitoring-deploy.md) tutorial.

## Provision a simulated device

Navigate to the **Devices** page in the solution and then choose **Provision**. In the **Provision** panel, choose **Simulated**:

<!-- TODO insert screenshot -->

Leave the number of devices to provision set to **1**. Enter a device ID prefix such as `TestDevice`, choose **Engine** as the **Device Type**, and then choose **Apply** to create the simulated device:

<!-- TODO insert screenshot -->

To learn how to provision a *physical* device, see [Connect your device to the remote monitoring preconfigured solution](iot-suite-connecting-devices-node.md).

## Test the simulated device

To view details of your new simulated device, select it in the list of devices on the **Devices** page. Information about your device displays in the **Device detail** panel:

<!-- TODO insert screenshot -->

In **Device detail**, verify your new device is sending telemetry. To view the different telemetry streams from your device, choose a telemetry name such as **Coolant**:

<!-- TODO insert screenshot -->

The **Device detail** panel displays other information about the device such as tag values, the methods it supports, and the properties reported by the device.

To view detailed diagnostics, choose **Display diagnostics**.

## Act on a device

To act on a device, select it in the list of devices and then choose **Schedule**. The **Engine** device model specifies three methods a device must support:

<!-- TODO insert screenshot -->

Choose **Restart** and set the job name to **Restart engine**:

<!-- Insert screenshot here -->

To track the status of the job on the **Maintenance** page, choose **View**:

<!-- Insert screenshot here -->

### Methods in other devices

Other device types support different methods. The device model specifies the methods the device should support. To schedule a method to run on multiple devices, you can select multiple devices in the list on the **Devices** page. The **Schedule** panel shows the types of method common to all the devices you selected.

## Reconfigure a device

To change the configuration of a device, select it in the device list on the **Devices** page and then choose **Reconfigure**. The reconfigure panel shows the property values for the selected device that you can change:

<!-- Insert screenshot here -->

To make a change, add a name for the job, update the property values, and choose **Apply**:

<!-- Insert screenshot here -->

To track the status of the job on the **Maintenance** page, choose **View**:

<!-- Insert screenshot here -->

## Next steps

This tutorial showed you how to:

<!-- Repeat task list from intro -->
>[!div class="checklist"]
> * Provision a simulated device.
> * Test the simulated device.
> * Call device methods from the solution.
> * Reconfigure a device.

Now that you have learned how to manage your devices, the suggested next steps are to learn how to:

* [Troubleshoot and remediate device issues](iot-suite-remote-monitoring-maintain.md).
* [Test your solution with simulated devices](iot-suite-remote-monitoring-test.md).
* [Connect your device to the remote monitoring preconfigured solution](iot-suite-connecting-devices-node.md).

<!-- Next tutorials in the sequence -->