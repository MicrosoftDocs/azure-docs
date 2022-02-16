---
title: Azure IoT Central device management guide
description: Azure IoT Central is an IoT application platform that simplifies the creation of IoT solutions. This guide describes how to manage the IoT devices connected to your IoT Central application. 
author: dominicbetts
ms.author: dobett
ms.date: 01/04/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
ms.custom: mvc

# Device groups, jobs, use dashboards and create personal dashboards
# This article applies to operators.
---

# IoT Central device management guide

An IoT Central application lets you monitor and manage millions of devices throughout their life cycle.

IoT Central lets you complete device management tasks such as:

- Monitor and manage the devices connected to the application.
- Troubleshoot and remediate issues with devices.
- Provision new devices.

## Monitor and manage devices

:::image type="content" source="media/overview-iot-central-operator/simulated-telemetry.png" alt-text="Screenshot that shows a device view":::

To monitor devices, use the custom device views defined by a solution builder. These views can show device telemetry and property values. An example is the **Overview** view shown in the previous screenshot.

For more detailed information, use device groups and the built-in analytics features. To learn more, see [How to use analytics to analyze device data](howto-create-analytics.md).

To manage individual devices, use device views to set device and cloud properties, and call device commands. Examples include the **Manage device** and **Commands** views in the previous screenshot.

To manage devices in bulk, create and schedule jobs. Jobs can update properties and run commands on multiple devices. To learn more, see [Create and run a job in your Azure IoT Central application](howto-manage-devices-in-bulk.md).

To manage IoT Edge devices, you can use the IoT Central UI to[create and edit deployment manifests](concepts-iot-edge.md#iot-edge-deployment-manifests-and-iot-central-device-templates), and then deploy them to your IoT Edge devices. You can also run commands in IoT Edge modules from within IoT Central.  

If your IoT Central application uses *organizations*, an administrator controls which devices you have access to.

## Troubleshoot and remediate issues

The [troubleshooting guide](troubleshoot-connection.md) helps you to diagnose and remediate common issues. You can use the **Devices** page to block devices that appear to be malfunctioning until the problem is resolved.

## Add and remove devices

You can add and remove devices in your IoT Central application either individually or in bulk. To learn more, see:

- [Manage individual devices in your Azure IoT Central application](howto-manage-devices-individually.md).
- [Manage devices in bulk in your Azure IoT Central application](howto-manage-devices-in-bulk.md).

## Personalize

Create personal dashboards in an IoT Central application that contain links to the resources you use most often. To learn more, see [Manage dashboards](howto-manage-dashboards.md).

## Next steps

If you want to learn more about using IoT Central, the suggested next steps are to try the quickstarts, beginning with [Create an Azure IoT Central application](./quick-deploy-iot-central.md).
