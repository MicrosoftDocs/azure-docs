---
title: Using Proxy Updates with Device Update for Azure IoT Hub| Microsoft Docs
description: Using Proxy Updates with Device Update for Azure IoT Hub
author: ValOlson
ms.author: valls
ms.date: 11/12/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Proxy Updates and multi-component updating

Proxy Updates can support updating multiple **component(s)** on a target IoT device connected to IoT Hub. With Proxy updates, you can (1) target over-the-air updates to multiple components on the IoT device or (2) target over-the-air updates to multiple sensors connected to the IoT device. Use cases where proxy updates is applicable include:

* Targeting specific update files to different partitions on the device.
* Targeting specific update files to different apps/components on the device  
* Targeting specific update files to sensors connected to an IoT devices. These sensors could be connected to the IoT device over a network protocol (for example, USB, CANbus etc.). 

## Pre-requisite
In order to update a component or components that connected to a target IoT Device, the device builder must register a custom **Component Enumerator Extension** that is built specifically for their IoT devices. The Component Enumerator Extension is required so that the Device Update Agent can map a **'child update'** with a specific component, or group of components, which the update is intended for. See [Contoso Component Enumerator](components-enumerator.md) for an example on how to implement and register a custom Component Enumerator extension.

> [!NOTE]
> Device Update *service* does not know anything about **component(s)** on the target device. Only the Device Update agent does the above mapping.

## Example Proxy update
In the following example, we will demonstrate how to do a Proxy update and use the multi-step ordered execution feature introduced in the Public Preview Refresh Release. Multi-step ordered execution feature allows for granular update controls including an install order, pre-install, install, and post-install steps. Use cases include, for example, a required preinstall check that is needed to validate the device state before starting an update, etc. Learn more about [multi-step ordered execution](device-update-multi-step-updates.md).

See this tutorial on how to do a [Proxy update using the Device Update agent](device-update-howto-proxy-updates.md) with sample updates for components connected to a Contoso Virtual Vacuum device.
