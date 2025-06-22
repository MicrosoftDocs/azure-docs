---
title: Use jobs to schedule tasks for groups of devices
titleSuffix: Azure IoT Hub
description: How to use the service SDK to schedule a job that invokes a device direct method and updates desired device twin properties.
author: SoniaLopezBravo
ms.author: sonialopez
manager: lizross
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 1/15/2025
zone_pivot_groups: iot-hub-howto-c2d-1
---

# How to schedule and broadcast jobs

This article shows you how to create back-end app code to schedule and broadcast jobs.

Use Azure IoT Hub to schedule and track jobs that update up to millions of devices for these operations:

* Invoke direct methods
* Updated device twins

A job wraps one of these actions and tracks the execution against a set of devices that is defined by a device twin query. For example, a back-end app can use a job to invoke a direct method on 10,000 devices that reboots the devices. You specify the set of devices with a device twin query and schedule the job to run at a future time. The job monitors progress as each of the devices receives and executes the reboot direct method.

To learn more about each of these capabilities, see:

* Device twin and properties: [Get started with device twins](device-twins-dotnet.md) and [Understand and use device twins in IoT Hub](iot-hub-devguide-device-twins.md)
* Direct methods: [IoT Hub developer guide - direct methods](iot-hub-devguide-direct-methods.md)

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

> [!NOTE]
> This article is meant to complement [Azure IoT SDKs](iot-hub-devguide-sdks.md) samples that are referenced from within this article. You can use SDK tools to build both device and back-end applications.

## Prerequisites

* An IoT hub

* A registered device

* If your application uses the MQTT protocol, make sure that port 8883 is open in your firewall. The MQTT protocol communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connect-to-iot-hub).

:::zone pivot="programming-language-csharp"

[!INCLUDE [iot-hub-howto-schedule-broadcast-jobs-dotnet](../../includes/iot-hub-howto-schedule-broadcast-jobs-dotnet.md)]

:::zone-end

:::zone pivot="programming-language-java"

[!INCLUDE [iot-hub-howto-schedule-broadcast-jobs-java](../../includes/iot-hub-howto-schedule-broadcast-jobs-java.md)]

:::zone-end

:::zone pivot="programming-language-python"

[!INCLUDE [iot-hub-howto-schedule-broadcast-jobs-python](../../includes/iot-hub-howto-schedule-broadcast-jobs-python.md)]

:::zone-end

:::zone pivot="programming-language-node"

[!INCLUDE [iot-hub-howto-schedule-broadcast-jobs-node](../../includes/iot-hub-howto-schedule-broadcast-jobs-node.md)]

:::zone-end
