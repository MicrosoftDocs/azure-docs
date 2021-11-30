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

This document describes how Proxy Updates can support updating multiple **component(s)** on the target IoT device by using the multi-step ordered execution feature introduced in the Public Preview Refresh Release.  

Proxy updates can target over-the-air updates to multiple components on the target IoT device or multiple sensors connected to the target IoT device. Use cases where proxy updates is applicable include:
* Targeting specific update files to different partitions on the device.
* Targeting specific update files to different apps/components on the device  
* Targeting specific update files to sensors connected to IoT devices over a network protocol (e.g., USB, CANbus etc.). 

In order to update a component or components that connected to a IoTHub-Connected target IoT Device (also refered in the documentation as '**Host Device**' from here on), the device builder must register a custom **Component Enumerator Extension** that is built specifically for their IoT devices. This is required so that the Device Update Agent can map a **'child update'** with a specific component, or group of components, which the update is intended for.  

> Note: It's important to understand that Device Update service does not know anything about **component(s)** on the target device.

> Note: Multi-step ordered execution feature allow for granular update controls including an install order, pre-install, install and post-install steps. Use cases include
> a required preinstall check that is needed to validate the device state before starting an update, etc. Learn more about [multi-step ordered execution](https://github.com/Azure/adu-private-preview/blob/user/wewilair/v0.8.0-docs/docs/agent-reference/update-manifest-v4-schema.md).

## How to register multiple components with the Component Enumerator Extension

See [Contoso Component Enumerator](../../src/extensions/component-enumerators/examples/contoso-component-enumerator/README.md) for example on how to implement and register a custom Component Enumerator extension.

## Example Proxy Update

See [tutorial using the Device Update agent to do Proxy Updates](device-update-howto-proxy-updates.md) with sample updates for components connected to a Contoso Virtual Vacuum device.

 
