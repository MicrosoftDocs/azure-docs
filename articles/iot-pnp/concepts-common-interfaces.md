---
title: Common interfaces - IoT Plug and Play Preview | Microsoft Docs
description: Description of common interfaces for IoT Plug and Play developers
author: Philmea
ms.author: philmea
ms.date: 12/26/2019
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# IoT Plug and Play Preview common interfaces

All IoT Plug and Play devices are expected to implement some common interfaces. Common interfaces benefit IoT solutions because they provide consistent functionality. [Certification](tutorial-build-device-certification.md) requires your device to implement several common interfaces. You can retrieve common interface definitions from the public model repository.

## Summary of common interfaces

| Name | ID | Description | Implemented by Azure IoT SDK | Must be declared in capability model |
| -------- | -------- | -------- | -------- | -------- | -------- |
| Model Information | urn:azureiot:ModelDiscovery:ModelInformation:1 | For devices to declare the capability model ID and interfaces. Required for all IoT Plug and Play devices. | Yes | No |
| Digital Twin Client SDK Information | urn:azureiot:Client:SDKInformation:1 | Client SDK for connecting the device with Azure. Required for [certification](tutorial-build-device-certification.md) | Yes | No |
| Device information | urn:azureiot:DeviceManagement:DeviceInformation:1 | Hardware and operating system information about the device. Required for [certification](tutorial-build-device-certification.md) | No | Yes |
| Model Definition | urn:azureiot:ModelDiscovery:ModelDefinition:1 | For devices to declare the full definition for its capability model and interfaces. Must be implemented when model definitions aren't hosted in a model repository. | No | Yes |
| Digital Twin | urn:azureiot:ModelDiscovery:DigitalTwin:1 | For solution developers to retrieve the capability model ID and interface IDs for a digital twin. This interface isn't declared or implemented by an IoT Plug and Play device. | No | No |

- Implemented by Azure IoT SDK - Whether the Azure IoT SDK implements the capabilities declared in the interfaces. IoT Plug and Play devices that use the Azure IoT SDK don't need to implement this interface.
- Must be declared in capability model - If 'yes', this interface must be declared within the `"implements":` section of the device capability model for this IoT Plug and Play device.

## Retrieve interface definitions from the public repository

### CLI

You can use the Azure IoT extension for Azure CLI to retrieve the common interfaces from the public model repository.

```azurecli
az iot pnp interface show --interface {InterfaceID}
```

```azurecli
az iot pnp capability-model show --model {ModelID}
```

### VS Code

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug and Play: Open Model Repository** command. Choose **Public repository**. The public model repository opens in VS Code.

1. In the public model repository, enter the interface name in the search field.

1. To create a local copy of the interface, select it in the search results, and then select **Download**.

## Next steps

Now that you've learned about common interfaces, here are some additional resources:

- [Digital Twin Definition Language (DTDL)](https://aka.ms/DTDL)
- [C device SDK](https://docs.microsoft.com/azure/iot-hub/iot-c-sdk-ref/)
- [IoT REST API](https://docs.microsoft.com/rest/api/iothub/device)
