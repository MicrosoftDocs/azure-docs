---
title: Understand and use Azure IoT Hub Device Provisioning SDKs | Microsoft Docs
description: Reference - how to use SDKs to develop for Azure IoT Hub Device Provisioning Service
services: iot-dps
documentationcenter: ''
author: yizhon
manager: arjmands
editor: ''

ms.service: iot-dps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/15/2018
ms.author: yizhon

---

# Understand and use Azure IoT Hub Provisioning SDKs

There are two categories of software development kits (SDKs) for working with IoT Hub Device Provisioning Service:

* **Device SDKs** help you to build registration software that connects to IoT Hub Device Provisioning Service using supported attestation method.

* **Service SDKs** help you to manage your IoT Hub Device Provisioning Service enrollments.

## Azure IoT device SDKs

The Microsoft Azure IoT device SDKs contain code that facilitates building devices and applications that connect to and are managed by Azure IoT Hub Device Provisioning Service.

Azure IoT Hub Provisioning device SDK for C: written in ANSI C (C99) for portability and broad platform compatibility
* Install from [apt-get, MBED, Arduino IDE, or Nuget][lnk-c-package] ??
* [Source code][lnk-c-sdk] 
* [API reference][lnk-c-ref] ??

Azure IoT Hub Provisioning device SDK for .NET:
* Install from [Nuget][lnk-nuget-csharp-device] 
* [Source code][lnk-dotnet-sdk] 
* [API reference][lnk-dotnet-ref] ??

Azure IoT Hub Provisioning device SDK for Java:
* Add to [Maven][lnk-maven-device] project 
* [Source code][lnk-java-sdk] 
* [API reference][lnk-java-ref] 

Azure IoT Hub Provisioning device SDK for Node.js:
* Install from [npm][lnk-npm-device] 
* [Source code][lnk-node-sdk]  
* [API reference][lnk-node-ref] 

Azure IoT Hub Provisioning device SDK for Python:
* Install from [pip][lnk-pip-device] 
* [Source code][lnk-python-sdk] 

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.
> 
> 

## Azure IoT service SDKs

The Azure IoT service SDKs contain code to facilitate building applications that interact directly with IoT Hub to manage devices and security.

Azure IoT Hub Provisioning service SDK for .NET:
* Download from [Nuget][lnk-nuget-csharp-service] 
* [Source code][lnk-dotnet-sdk] 
* [API reference][lnk-dotnet-service-ref] ??

Azure IoT Hub Provisioning service SDK for Java: 
* Add to [Maven][lnk-maven-service] project 
* [Source code][lnk-java-sdk] 
* [API reference][lnk-java-service-ref] 

Azure IoT Hub Provisioning service SDK for Node.js: 
* Download from [npm][lnk-npm-service] 
* [Source code][lnk-node-sdk] 
* [API reference][lnk-node-service-ref] 

Azure IoT Hub Provisioning service SDK for Python: 
* Download from [pip][lnk-pip-service] 
* [Source code][lnk-python-sdk] 

Azure IoT Hub Provisioning service SDK for C: 
* Download from [apt-get, MBED, Arduino IDE, or Nuget][lnk-c-package] ??
* [Source code][lnk-c-sdk] 

> [!NOTE]
> See the readme files in the GitHub repositories for information about using language and platform-specific package managers to install binaries and dependencies on your development machine.


## Next steps

Other reference topics in this IoT Hub developer guide include:

* [IoT Hub Device Provisioning Service REST API reference][lnk-rest-ref]
* [IoT Hub Device Provisioning Service concepts][lnk-service-concept]
* [IoT Hub Device Provisioning Device concepts][lnk-device-concept]


<!-- Links and images -->

[lnk-c-sdk]: https://github.com/Azure/azure-iot-sdk-c
[lnk-dotnet-sdk]: https://github.com/Azure/azure-iot-sdk-csharp
[lnk-java-sdk]: https://github.com/Azure/azure-iot-sdk-java
[lnk-node-sdk]: https://github.com/Azure/azure-iot-sdk-node
[lnk-python-sdk]: https://github.com/Azure/azure-iot-sdk-python

[lnk-dotnet-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices?view=azure-dotnet
[lnk-dotnet-service-ref]: https://docs.microsoft.com/dotnet/api/microsoft.azure.devices
[lnk-c-ref]: https://azure.github.io/azure-iot-sdk-c/index.html
[lnk-java-ref]: https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.provisioning.device
[lnk-node-ref]: https://docs.microsoft.com/javascript/api/azure-iot-provisioning-device
[lnk-rest-ref]: https://docs.microsoft.com/rest/api/iot-dps/
[lnk-java-service-ref]: hhttps://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.provisioning.service
[lnk-node-service-ref]: https://docs.microsoft.com/javascript/api/azure-iot-provisioning-service

[lnk-maven-device]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-device-sdk
[lnk-maven-service]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md#for-the-service-sdk
[lnk-npm-device]: https://www.npmjs.com/package/azure-iot-provisioning-device
[lnk-npm-service]: https://www.npmjs.com/package/azure-iot-provisioning-service
[lnk-nuget-csharp-device]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Client/
[lnk-nuget-csharp-service]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Provisioning.Service/
[lnk-c-package]: https://github.com/Azure/azure-iot-sdk-c/blob/master/iothub_client/readme.md
[lnk-pip-device]: https://pypi.python.org/pypi/azure-iot-provisioning-device-client/
[lnk-pip-service]:https://pypi.python.org/pypi/azure-iothub-provisioningserviceclient/

[lnk-service-concept]: https://docs.microsoft.com/azure/iot-dps/concepts-service
[lnk-device-concept]: https://docs.microsoft.com/azure/iot-dps/concepts-device
