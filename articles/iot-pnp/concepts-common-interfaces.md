---
title: Common interfaces - IoT Plug and Play Preview | Microsoft Docs
description: Description of common interfaces for IoT Plug and Play developers
author: dominicbetts
ms.author: dobett
ms.date: 12/26/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview common interfaces

All IoT Plug and Play devices are expected to implement some common interfaces. Common interfaces benefit IoT solutions because they provide consistent functionality. You can retrieve common interface definitions from the public model repository.

## Summary of common interfaces

| Name | ID | Description | Implemented by Azure IoT SDK | Must be declared in capability model |
| -------- | -------- | -------- | -------- | -------- | -------- |
| Digital Twin Client SDK Information | dtmi:azure:Client:SDKInformation;1 | Client SDK for connecting the device with Azure. | Yes | No |
| Device information | dtmi:azure:DeviceManagement:DeviceInformation;1 | Hardware and operating system information about the device. | No | Yes |


- Implemented by Azure IoT SDK - Whether the Azure IoT SDK implements the capabilities declared in the interfaces. IoT Plug and Play devices that use the Azure IoT SDK don't need to implement this interface.
- Must be declared in capability model - If 'yes', this interface must be declared within the `"implements":` section of the device capability model for this IoT Plug and Play device.

## Retrieve interface definitions from Plug and Play Model Repository
You can log into [Plug and Play Model Repository (Preview)] (https://iotmodels.azure.com) to retrieve the definition of common interfaces. These common interfaces can be found under Public Models. To learn more about Plug and Play Model Repository, please go to [Understand Plug and Play Model Repository (Preview)](concepts-model-repository.md).


## Next steps

Now that you've learned about common interfaces, here are some additional resources:

- [Digital Twin Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
