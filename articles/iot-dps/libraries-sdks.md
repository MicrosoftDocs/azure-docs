---
title: IoT Hub Device Provisioning Service libraries and SDKs
description: Information about the device and service libraries available for developing solutions with Device Provisioning Service (CPS).
author: kgremban
ms.author: kgremban
ms.date: 08/03/2022
ms.topic: reference
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Microsoft SDKs for IoT Hub Device Provisioning Service

The Azure IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub. The DPS package provides SDKs to help you build backend and device applications that leverage DPS to provide zero-touch, just-in-time provisioning to one or more IoT hubs. The SDKs are published in a variety of popular languages and handle the underlying transport and security protocols between your devices or backend apps and DPS, freeing developers to focus on application development. Additionally, using the SDKs provides you with support for future updates to DPS, including security updates.

There are three categories of software development kits (SDKs) for working with DPS:

- [DPS device SDKs](#device-sdks) provide data plane operations for devices. You use the device SDK to provision a device through DPS.

- [DPS service SDKs](#service-sdks) provide data plane operations for backend apps. You can use the service SDKs to create and manage individual enrollments and enrollment groups, and to query and manage device registration records.

- [DPS management SDKs](#management-sdks) provide control plane operations for backend apps. You can use the management SDKs to create and manage DPS instances and metadata. For example, to create and manage DPS instances in your subscription, to upload and verify certificates with a DPS instance, or to create and manage authorization policies or allocation policies in a DPS instance.

The DPS SDKs help to provision devices to your IoT hubs. Microsoft also provides a set of SDKs to help you build device apps and backend apps that communicate directly with Azure IoT Hub. For example, to help your provisioned devices send telemetry to your IoT hub, and, optionally, to receive messages and job, method, or twin updates from your IoT hub. To learn more, see [Azure IoT Hub SDKs](../iot-hub/iot-hub-devguide-sdks.md).

## Device SDKs

[!INCLUDE [iot-dps-sdks-device](../../includes/iot-dps-sdks-device.md)]

### Embedded device SDKs

[!INCLUDE [iot-dps-sdks-embedded](../../includes/iot-dps-sdks-embedded.md)]

## Service SDKs

[!INCLUDE [iot-dps-sdks-service](../../includes/iot-dps-sdks-service.md)]

## Management SDKs

[!INCLUDE [iot-dps-sdks-management](../../includes/iot-dps-sdks-management.md)]

## Next steps

The Device Provisioning Service documentation provides [tutorials](how-to-legacy-device-symm-key.md) and [additional samples](quick-create-simulated-device-tpm.md) that you can use to try out the SDKs and libraries.
