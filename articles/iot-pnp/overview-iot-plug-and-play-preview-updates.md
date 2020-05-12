---
title: What's new? IoT Plug and Play Preview May 2020 | Microsoft Docs
description: Learn what's new with the May 2020 IoT Plug and Play Preview release.
author: dominicbetts
ms.author: dobett
ms.date: 04/15/2020
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: eliotgra
---

# IoT Plug and Play Preview - May 2020

This article describes the key changes in the SDKS, libraries, tools, and services in IoT Plug and Play May 2020 preview release. The previous IoT Plug and Play preview release was in August 2019.

## Digital Twins Definition Language (DTDL)

This release adds support for DTDL v2 and deprecates [DTDL v1](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

The following list shows the key differences between DTDL v1 and DTDL v2. In DTDL v2:

- Model IDs have the prefix `dtmi` instead of `urn`. Digital twin model identifiers (DTMI) replace the `urn` prefixed digital twin IDs used in DTDL v1. The version is now preceded with a `;`. For example, previously where you used `urn:CompanyName:Model:1`, you now use `dtmi:CompanyName:Model;1`.
- Set the `@context` to `dtmi:dtdl:context;2` instead of `http://azureiot.com/v1/contexts/IoTModel.json`.
- Use the **Interface** type instead of the **CapabilityModel** types to model a device.
- **Components** replace **Interface** instances. You can define **Relationships** and **Components** as part of the content of an **Interface**.
- An **Interface** can inherit from another **Interface**.
- You can extend DTDL using _extensible semantic types_. This extensible type system offers greater flexibility than the hard-coded semantic types such as temperature and humidity in DTDL v1.
- The **displayUnit** property has been removed.
- You can't use leading or trailing underscores in a name. Leading underscores in a name are reserved for system use.

To work with DTDL v1, you need to use the previous version of the SDK and Azure IoT Explorer 0.10.x. To work with DTDL v2, you need the latest version of the SDK and Azure IoT Explorer 0.11.x.

## Model repository

There's now a single model repository that contains both public published models, and private RBAC-protected company models. All models have a unique identifier and are immutable once created.

Existing company model repositories from the previous release are not supported in this release. You can continue to use the [Azure Certified for IoT](https://preview.catalog.azureiotsolutions.com/products) website to manage the old DTDL v1 models. However, you can no longer use this website to register, test, and certify devices.

The Azure IoT extension for the Azure CLI does not support the new model repository. The `az iot pnp` commands only work the model repositories from the previous release.

## Model resolution

In this release, IoT Hub no longer provides model resolution, or retrieval.

## Registration and discovery

In this release, devices register their **Model ID** with IoT Hub on every connection. Previously, a device announced the capability model and interfaces it supported in a telemetry message sent to IoT Hub, and IoT Hub cached this information.

You can use both the current and previous preview versions of the SDKs and Azure IoT Explorer tool with IoT Hub. However, if a device uses the previous preview version of the SDK, you must use the previous version of Azure IoT Explorer. Similarly, if a device uses the latest preview version of the SDK, you must use the latest version of Azure IoT Explorer.

## Microsoft defined interfaces

The following Microsoft-defined interfaces are deprecated and aren't published in the new model repository:

- **urn:azureiot:ModelDiscovery:DigitalTwin:1**
- **urn:azureiot:ModelDiscovery:ModelInformation:1**

The following interfaces are published in the new model repository:

- **dtmi:azure:DeviceManagement:DeviceInformation;1**
- **dtmi:azure:Client:SDKInformation;1**

## Telemetry messages

This release reduces the number and size of the telemetry message a device needs to send.

## DigitalTwinChangeEvents

The event structure of the **DigitalTwinChangeEvents** [event source](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events) has changed to use the **JSON-Patch** format. This is a breaking change with no backward compatibility support.

## VS Code extension

The [Azure IoT Device Workbench](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-iot-workbench) extension provides authoring support for DTDL v1, integration with the previous version of the model repository, and code generation.

If you require DTDL v2 authoring support in VS Code, install the new [DTDL extension](https://github.com/azure/vscode-dtdl) in VS Code. The extension does not provides integration with the model repository or code generation. Managing models in the repository is now done using a [web UI](https://aka.ms/iotmodelrepo).

## Digital twin service-side REST APIs

The [digital twin service-side REST APIs](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin) and payloads have changed. The supported APIs are:

- Update a digital twin using **JSON-Patch** payload.
- Retrieve a digital twin.
- Call a command.

The existing REST APIs continue to be supported in this release. REST APIs are versioned.

## Device and service SDKs

There's no backward compatibility with previous preview versions of the SDKs. You'll need to change your code if you move to the latest preview version of an SDK.

The [C device SDK API](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/doc/readme.md) changes are:

- **DigitalTwin_DeviceClient_RegisterInterfacesAsync**: Remove **deviceCapabilityModel** parameter.
- **DigitalTwin_DeviceClient_CreateFromDeviceHandle**: Add a new parameter, **ModelId**, to specify the DTMI value of the root.

Currently, the device SDK is available in [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/doc/readme.md), [Python](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview/azure-iot-device), and [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/digitaltwins-preview/digitaltwins/device/readme.md).

The service SDK is available in [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/digitaltwins-preview/digitaltwins/service/readme.md) and Python. There are multiple service SDK changes.
