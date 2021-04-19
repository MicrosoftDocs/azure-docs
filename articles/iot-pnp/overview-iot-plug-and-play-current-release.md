---
title: IoT Plug and Play current release | Microsoft Docs
description: Learn what's included in the current IoT Plug and Play release.
author: dominicbetts
ms.author: dobett
ms.date: 10/01/2020
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
---

# What is in the current IoT Plug and Play release?

This article summarizes the tools, SDKs, and APIs that support the current IoT Plug and Play release. Version numbers shown reflect the version number at the time IoT Plug and Play became generally available. Version numbers may increment following the release.

## Modeling language

[Digital Twins Definition Language (DTDL) v2](https://github.com/Azure/opendigitaltwins-dtdl).

To learn more about how IoT Plug and Play devices work with DTDL, see [IoT Plug and Play conventions](concepts-convention.md).

## Tools and utilities

- Azure IoT explorer 0.12.0.

    To learn more, see [Install and use Azure IoT explorer](howto-use-iot-explorer.md).

- VS Code extension 1.0.0.

    To learn more, see [Install and use the DTDL authoring tools](howto-use-dtdl-authoring-tools.md).

- Visual Studio 2019 extension 1.0.0.

    To learn more, see [Install and use the DTDL authoring tools](howto-use-dtdl-authoring-tools.md).

- Azure CLI IoT extension 0.10.0.

    The Azure IoT extension includes commands to help certify devices. See `az iot product -h`.

## Libraries and SDKs

To learn more about the libraries and SDKs, see [Microsoft SDKs for IoT Plug and Play](libraries-sdks.md).

- C device SDK [vcpkg 1.3.9](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/setting_up_vcpkg.md)
- Embedded C device SDK [GitHub](https://github.com/Azure/azure-sdk-for-c/)
- .NET device SDK [NuGet 1.31.0](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client)
- Java device SDK [Maven 1.26.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-device-client)
- Python device SDK [pip 2.3.0](https://pypi.org/project/azure-iot-device/)
- Node.js device SDK [npm 1.17.2](https://www.npmjs.com/package/azure-iot-device)
- .NET - IoT Hub service [NuGet 1.27.1](https://www.nuget.org/packages/Microsoft.Azure.Devices )
- Java - IoT Hub service [Maven 1.26.0](https://mvnrepository.com/artifact/com.microsoft.azure.sdk.iot/iot-service-client/1.26.0)
- Node.js - IoT Hub service [npm 1.13.0](https://www.npmjs.com/package/azure-iothub)
- Python - IoT Hub/Digital Twins service [pip 2.2.3](https://pypi.org/project/azure-iot-hub)
- DTDL model parser [NuGet](https://www.nuget.org/packages/Microsoft.Azure.DigitalTwins.Parser).

## REST APIs

REST API [2020-09-30](/rest/api/iothub).

To learn more, see [IoT Plug and Play developer guide](concepts-developer-guide-service.md).

## IoT Hub

IoT Plug and Play is supported by IoT Hub in all regions. IoT Plug and Play is only supported by standard or free tier IoT hubs.

## Announcements

For current and previous IoT Plug and Play announcements, see the following blog posts:

- [Public preview refresh (Posted on August 29, 2020)](https://techcommunity.microsoft.com/t5/internet-of-things/add-quot-plug-and-play-quot-to-your-iot-solutions/ba-p/1548531)
- [Prepare and certify your devices for IoT Plug and Play (Posted on August 26, 2020)](https://azure.microsoft.com/blog/prepare-and-certify-your-devices-for-iot-plug-and-play/)
- [IoT Plug and Play is now available in preview (Posted on August 22, 2019)](https://azure.microsoft.com/blog/iot-plug-and-play-is-now-available-in-preview/)
- [Build with Azure IoT Central and IoT Plug and Play (Posted on May 7, 2019)](https://azure.microsoft.com/blog/build-with-azure-iot-central-and-iot-plug-and-play/)

## Next steps

The suggested next step is to review [What is IoT Plug and Play?](overview-iot-plug-and-play.md).