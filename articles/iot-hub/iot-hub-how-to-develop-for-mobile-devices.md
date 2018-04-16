--
title: Develop for mobile devices | Microsoft Docs
description: Developer guide - Learn about how to develop for mobile devices using Azure IoT Hub SDKs.
services: iot-hub
documentationcenter: ''
author: yizhon
manager: timlt
editor: ''

ms.assetid: c5c9a497-bb03-4301-be2d-00edfb7d308f
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/16/2018
ms.author: yizhon

---
# Develop for mobile devices

Things in the Internet of Things may refer to a wide range of devices with varying capability: sensors, microcontrollers, smart devices, industrial gateways, and even mobile devices.  A mobile device can be an IoT device, where it is sending device-to-cloud telemetry and managed by the cloud.  It can also be the device running a back-end service application, which manages other IoT devices.  In both cases, [Azure IoT Hub SDKs][lnk-sdk-overview] can be used to develop applications that work for mobile devices.

## Develop for native iOS platform

Azure IoT Hub SDKs provide native iOS platform support through Azure IoT Hub C SDK.  You can think of this as an iOS SDK that you can incorporate in your Swift or Objective C XCode project.  There are two ways to use the C SDK on iOS: you can use the CocoaPod libraries in XCode project directly; or you can download the source code for C SDK and build for iOS platform following the [build instruction][lnk-c-devbox] for MacOS.

The interface for iOS SDK is very similar to the interface for Azure IoT Hub C SDK, written in C99 for maximum portability to various platforms.  The porting process involves writing a thin adoption layer for the platform specific components, which can be found here for [iOS][lnk-ios-pal].  All the features in the C SDK can be leveraged on iOS platform directly, including the Azure IoT Hub features supported, as well as SDK specific features such as retry policy for network reliability. 

These documentations walk through how to develop a device application or service application on an iOS device:
- Quickstart: Send telemetry from a device to an IoT hub [lnk-device-ios-quickstart]
- Send messages from the cloud to your device with IoT hub [lnk-service-ios-quickstart]

### Develop with Azure IoT Hub CocoaPod libraries

Azure IoT Hub SDKs releases a set of Objective-C CocoaPod libraries for iOS development.  The latest list of CocoaPod libraries is published [here][lnk-cocoapod-list].  Once the relevant libraries are incorporated into your XCode project, there are two ways to write IoT Hub related code:
- Objective C function: If your project is written in Objective-C, you can call APIs from Azure IoT Hub C SDK directly.  If your project is written in Swift, you can call ``@objc func`` before creating your function, and proceed to writing all logics related to Azure IoT Hub using C or Objective-C code.  A set of samples demonstrating both can be found [here][lnk-ios-samples-repo].
- Incorporate C samples: If you have written a C device application, you can reference it directly in your XCode project:
    - Add the sample.c file to your XCode project from XCode.
    - Add the header file to your dependency.  The SDK includes an 'ios-sample.h' file as a sample.  For more information, please visit Apple's documentation page for [Objective-C](https://developer.apple.com/documentation/objectivec).

## Next steps
* [IoT Hub REST API reference][lnk-rest-ref]
* [Azure IoT C SDK source code][lnk-c-sdk]

[lnk-sdk-overview]: https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-sdks
[lnk-c-devbox]: https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md
[lnk-device-ios-quickstart]:https://docs.microsoft.com/azure/iot-hub/quickstart-send-telemetry-ios
[lnk-service-ios-quickstart]: https://docs.microsoft.com/azure/iot-hub/iot-hub-ios-swift-c2d
[lnk-cocoapod-list]: https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/samples/ios/CocoaPods.md
[lnk-ios-samples-repo]: https://github.com/Azure-Samples/azure-iot-ios-samples
[lnk-ios-pal]: https://github.com/Azure/azure-c-shared-utility/tree/master/pal/ios-osx
[lnk-c-sdk]: https://github.com/Azure/azure-iot-sdk-c