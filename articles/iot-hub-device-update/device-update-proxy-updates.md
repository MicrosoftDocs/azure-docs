---
title: Using Proxy Updates with Device Update for Azure IoT Hub
description: Using Proxy Updates with Device Update for Azure IoT Hub
author: kgremban
ms.author: kgremban
ms.date: 11/12/2021
ms.topic: concept-article
ms.service: iot-hub-device-update
---

# Proxy updates and multi-component updating

With proxy updates, you can target over-the-air updates to multiple components on the IoT device or to multiple sensors connected to the IoT device. Use cases where proxy updates are applicable include:

* Targeting specific update files to different partitions on the device.
* Targeting specific update files to different apps/components on the device  
* Targeting specific update files to sensors connected to an IoT device. These sensors could be connected to the IoT device over a network protocol (for example, USB, CANbus etc.).

## Prerequisites

In order to update a component or components that connect to a target IoT device, the device builder must register a custom **component enumerator extension** that is built specifically for their IoT devices. The component enumerator extension is required so that the Device Update agent can map a **child update** with a specific component, or group of components, which the update is intended for. See [Contoso component enumerator](components-enumerator.md) for an example on how to implement and register a custom component enumerator extension.

> [!NOTE]
> The Device Update service does not know anything about component(s) on the target device. Only the Device Update agent is aware of the mapping from the component enumerator.

## Multi-step ordered execution

Multi-step ordered execution feature allows for granular update controls including an install order, pre-install, install, and post-install steps. For example, this feature could enable a required pre-install check that is needed to validate the device state before starting an update. Learn more about [multi-step ordered execution](device-update-multi-step-updates.md).

## Next steps

See this tutorial on how to do a [Proxy update using the Device Update agent](device-update-howto-proxy-updates.md) with sample updates for components connected to a Contoso Virtual Vacuum device.
