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

This article describes the key changes in the IoT Plug and Play May 2020 preview release SDKs, libraries, tools, and services. The previous IoT Plug and Play preview release was in August 2019.

## Digital Twin Definition Language (DTDL)

This release adds support for DTDL v2 and deprecates [DTDL v1](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

The following list shows the key differences between DTDL v1 and DTDL v2. In DTDL v2:

- Model IDs have the prefix `dtmi` instead of `urn`. Digital twin model identifiers (DTMI) replace the `urn` prefixed digital twin IDs used in DTDL v1.
- Set the `@context` to `dtmi:dtdl:context;2` instead of `http://azureiot.com/v1/contexts/IoTModel.json`.
- Use the **Interface** type instead of the **CapabilityModel** types to model a device.
- **Components** replace **Interface** instances. You can define **Relationships** and **Components** as part of the content of an **Interface**.
- An **Interface** can inherit from another **Interface**.
- You can extend DTDL using _extensible semantic types_. This extensible type system offers greater flexibility than the hard-coded semantic types such as temperature and humidity in DTDL v1.
- The **displayUnit** property has been removed.
- You can't use leading or trailing underscores in a name. Leading underscores in a name are reserved for system use.

In this release, all libraries, services, and tooling continue to support both DTDL v1 and DTDL v2 models.

## Model repository

There's now a single model repository that contains both public published models, and private RBAC-protected company models. Both public and private models are now available at the same endpoint. All models have a unique identifier and are immutable once created.

Existing company model repositories from the previous release are supported in this release. You can continue to use the [Azure Certified for IoT](https://preview.catalog.azureiotsolutions.com/products) website to manage the old DTDL v1 models. However, you can no longer use this website to register, test, and certify devices.

The Azure IoT extension for the Azure CLI does not support the new model repository. The `az iot pnp` commands only work the model repositories from the previous release.

## Model resolution

In this release, IoT Hub no longer provides model storage, resolution, or retrieval.

## Registration and discovery

In this release, devices register their **Interface ID** with IoT Hub on every connection. Previously, a device announced the capability model and interfaces it supported in a telemetry message sent to IoT Hub, and IoT Hub cached this information.

IoT Hub supports both discovery protocols in this release.

## Microsoft defined interfaces

The following Microsoft-defined interfaces are deprecated and aren't published in the new model repository:

- **urn:azureiot:ModelDiscovery:DigitalTwin:1**
- **urn:azureiot:ModelDiscovery:ModelInformation:1**

## Telemetry messages

This release reduces the number and size of the telemetry message a device needs to send.

In this release, IoT Hub passes through telemetry messages that use the format from the previous release.

## DigitalTwinChangeEvents

The event structure of the **DigitalTwinChangeEvents** [event source](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events) has changed to use the **JSON-Patch** format. This is a breaking change with no backward compatibility support.

## VS Code extension

The [Azure IoT Device Workbench](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-iot-workbench) extension now provides authoring support for DTDL v2.

The extension no longer provides integration with the model repository or code generation.

Managing models in the repository is now done using a web UI.

If you require DTDL v1 support in VS Code, including the model repository UI and code generation, install the last version of the extension that supports DTDL v1.

## Code generation CLI

The previous version of the code generator remains available if you need to work with DTDL v1 models.

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
- **DigitalTwin_DeviceClient_CreateFromDeviceHandle**: Add a new parameter, **rootInterfaceName**, to specify the DTMI value of the root.

Currently, the device SDK is available in [C](https://github.com/Azure/azure-iot-sdk-c/tree/public-preview/digitaltwin_client/doc/readme.md), [Python](https://github.com/Azure/azure-iot-sdk-python/tree/digitaltwins-preview/azure-iot-device), and [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/digitaltwins-preview/digitaltwins/device/readme.md).

The service SDK is available in [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/digitaltwins-preview/digitaltwins/service/readme.md) and Python. There are multiple service SDK changes.
