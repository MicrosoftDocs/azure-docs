---
title: IoT Plug and Play libraries and SDKs
description: Information about the device and service libraries available for developing IoT Plug and Play enabled solutions.
author: dominicbetts
ms.author: dobett
ms.date: 01/08/2020
ms.topic: reference
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc
---

# IoT Plug and Play libraries and SDKs

The IoT Plug and Play libraries and SDKs enable developers to build IoT solutions using a variety of programming languages on multiple platforms. The following table includes links to samples and quickstarts to help you get started:

## Microsoft-supported libraries and SDKs

| Platform | Library/Package | Source code | Sample | Quickstart | Reference |
| -------- | ------- | ----------- | ------ | ---------- | --------- |
| C/Linux  | [Device SDK on apt-get](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/iothub_client/readme.md#aptgetpackage) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) | [Digital Twin client samples](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/samples) | [Connect to IoT Hub](./quickstart-connect-pnp-device-c-linux.md) | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| C/Windows  | [Device SDK on Vcpkg](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/doc/setting_up_vcpkg.md#setup-c-sdk-vcpkg-for-windows-development-environment) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) | [Digital Twin client samples](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/samples) | [Connect to IoT Hub](./quickstart-connect-pnp-device-c-windows.md) | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| C/mbed  | [Device SDK on EMBED](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/iothub_client/readme.md#mbed) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) | [Digital Twin client samples](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/samples) |  | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| C/Arduino  | [Device SDK in Arduino IDE](https://github.com/Azure/azure-iot-sdk-c/blob/public-preview/iothub_client/readme.md#arduino) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) | [Digital Twin client samples](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/samples) |  | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| C/iOS  | [Device SDK on CocoaPod](https://cocoapods.org/pods/AzureIoTHubClient) | [GitHub](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview) | [Digital Twin client samples](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/samples) |  | [Reference](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/) |
| Node.js | [NPM](https://www.npmjs.com/package/azure-iot-digitaltwins-device) | [GitHub](https://github.com/Azure/azure-iot-sdk-node/tree/digitaltwins-preview) | [Digital Twin samples](https://github.com/Azure/azure-iot-sdk-node/tree/digitaltwins-preview/digitaltwins/samples) | [Connect to IoT Hub](./quickstart-connect-pnp-device-node.md) | [Reference](https://docs.microsoft.com/javascript/api/azure-iot-device/) |

## IoT Hub support

IoT Plug and Play device capabilities are only supported by [free and standard tier IoT hubs](../iot-hub/iot-hub-scaling.md).

## Next steps

In addition to the device SDKs and libraries, you can use REST APIs to interact with the model repositories.