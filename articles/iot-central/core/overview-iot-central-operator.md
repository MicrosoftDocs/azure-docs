---
title: Azure IoT Central operator guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This article provides an overview of the operator role in IoT Central. 
author: dominicbetts
ms.author: dobett
ms.date: 03/19/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc

# Device groups, jobs, use dashboards and create personal dashboards
# This article applies to operators.
---

# IoT Central operator guide

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle. This guide is for operators who use an IoT Central application to manage IoT devices.

An operator:

- Monitors and manages the devices connected to the application.
- Troubleshoots and remediates issues with devices.
- Provisions new devices.

## Monitor and manage devices

:::image type="content" source="media/overview-iot-central-operator/simulated-telemetry.png" alt-text="Screenshot that shows a device view":::

To monitor devices, an operator can use the device views defined by the solution builder as part of the device template. These views can show device telemetry and property values. An example is the **Overview** view shown on the previous screenshot.

For more detailed information, an operator can use device groups and the built-in analytics features. To learn more, see [How to use analytics to analyze device data](howto-create-analytics.md).

To manage individual devices, an operator can use device views to set device and cloud properties, and call device commands. Examples, include the **Manage device** and **Commands** views in the previous screenshot.

To manage devices in bulk, an operator can create and schedule jobs. Jobs can update properties and run commands on multiple devices. To learn more, see [Create and run a job in your Azure IoT Central application](howto-manage-devices-in-bulk.md).

## Troubleshoot and remediate issues

The operator is responsible for the health of the application and its devices. The [troubleshooting guide](troubleshoot-connection.md) helps operators diagnose and remediate common issues. An operator can use the **Devices** page to block devices that appear to be malfunctioning until the problem is resolved.

## Add and remove devices

The operator can add and remove devices to your IoT Central application either individually or in bulk. To learn more, see [Manage devices in your Azure IoT Central application](howto-manage-devices-individually.md).

## Personalize

Operators can create personal dashboards in an IoT Central application that contain links to the resources they use most often. To learn more, see [Manage dashboards](howto-manage-dashboards.md).

## Next steps

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
