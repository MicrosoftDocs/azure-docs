---
title: Common interfaces - IoT Plug and Play Preview | Microsoft Docs
description: Description of common interfaces for IoT Plug and Play developers
author: dominicbetts
ms.author: dobett
ms.date: 05/14/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview common interfaces

All IoT Plug and Play devices are expected to implement some common interfaces. Common interfaces benefit IoT solutions because they provide consistent functionality. You can retrieve common interface definitions from the public model repository.

## Summary of common interfaces

| Name | ID | Description | Can be declared in device model |
| -------- | -------- | -------- | -------- | -------- | -------- |
| Digital Twin Client SDK Information | dtmi:azure:Client:SDKInformation;1 | Client SDK for connecting the device with Azure. | Yes |
| Device information | dtmi:azure:DeviceManagement:DeviceInformation;1 | Hardware and operating system information about the device. | Yes |

## Retrieve interface definitions

You can log into [Azure IoT Model Repository portal (preview)](https://aka.ms/iotmodelrepo) to retrieve the definition of common interfaces. These common interfaces can be found under Public Models. For more information, see [Understand Plug and Play Model Repository (Preview)](concepts-model-repository.md).

## Next steps

Now that you've learned about common interfaces, here are some additional resources:

- [Digital Twins Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
