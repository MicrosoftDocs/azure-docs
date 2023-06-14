---
title: Azure IoT Hub device and service SDKs
description: Links to the Azure IoT Hub SDKs that you can use to build device apps and back-end apps.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: concept-article
ms.date: 11/18/2022
ms.custom: [mqtt, 'Role: IoT Device', 'Role: Cloud Development']
---

# Azure IoT Hub SDKs

There are three categories of software development kits (SDKs) for working with IoT Hub:

* [**IoT Hub device SDKs**](#azure-iot-hub-device-sdks) enable you to build apps that run on your IoT devices using the device client or module client. These apps send telemetry to your IoT hub, and optionally receive messages, jobs, methods, or twin updates from your IoT hub. You can use these SDKs to build device apps that use [Azure IoT Plug and Play](../iot-develop/overview-iot-plug-and-play.md) conventions and models to advertise their capabilities to IoT Plug and Play-enabled applications. You can also use the module client to author [modules](../iot-edge/iot-edge-modules.md) for [Azure IoT Edge runtime](../iot-edge/about-iot-edge.md).

* [**IoT Hub service SDKs**](#azure-iot-hub-service-sdks) enable you to build backend applications to manage your IoT hub, and optionally send messages, schedule jobs, invoke direct methods, or send desired property updates to your IoT devices or modules.

* [**IoT Hub management SDKs**](#azure-iot-hub-management-sdks) help you build backend applications that manage the IoT hubs in your Azure subscription.

Microsoft also provides a set of SDKs for provisioning devices through and building backend services for the [Device Provisioning Service](../iot-dps/about-iot-dps.md). To learn more, see [Microsoft SDKs for IoT Hub Device Provisioning Service](../iot-dps/libraries-sdks.md).

Learn about the [benefits of developing using Azure IoT SDKs](https://azure.microsoft.com/blog/benefits-of-using-the-azure-iot-sdks-in-your-azure-iot-solution/).

## Azure IoT Hub device SDKs

[!INCLUDE [iot-hub-sdks-device](../../includes/iot-hub-sdks-device.md)]

Learn more about the IoT Hub device SDKs in the [IoT device development documentation](../iot-develop/about-iot-sdks.md).

### Embedded device SDKs

[!INCLUDE [iot-hub-sdks-embedded](../../includes/iot-hub-sdks-embedded.md)]

Learn more about the IoT Hub embedded device SDKs in the [IoT device development documentation](../iot-develop/about-iot-sdks.md).

## Azure IoT Hub service SDKs

[!INCLUDE [iot-hub-sdks-service](../../includes/iot-hub-sdks-service.md)]

## Azure IoT Hub management SDKs

[!INCLUDE [iot-hub-sdks-management](../../includes/iot-hub-sdks-management.md)]

## SDK and hardware compatibility

For more information about device SDK compatibility with specific hardware devices, see the [Azure Certified Device catalog](https://devicecatalog.azure.com/) or individual repository.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-partial.md)]

## SDKs for related Azure IoT services

Azure IoT SDKs are also available for the following services:

* [Microsoft SDKs for IoT Hub Device Provisioning Service](../iot-dps/libraries-sdks.md): To help you provision devices through and build backend services for the Device Provisioning Service.

* [Device Update for IoT Hub SDKs](../iot-hub-device-update/understand-device-update.md): To help you deploy over-the-air (OTA) updates for IoT devices.

## Next steps

Learn how to [manage connectivity and reliable messaging](../iot-develop/concepts-manage-device-reconnections.md) using the IoT Hub device SDKs.
