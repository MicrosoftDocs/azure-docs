---
title: What's new? IoT Plug and Play Preview Refresh | Microsoft Docs
description: Learn what's new with the IoT Plug and Play Preview Refresh release.
author: rido-min
ms.author: rmpablos
ms.date: 07/06/2020
ms.topic: overview
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: eliotgra
---

# IoT Plug and Play preview refresh

This article describes the key changes in the SDKS, libraries, tools, and services in IoT Plug and Play preview refresh release in July 2020. The previous IoT Plug and Play preview release was in August 2019.

## Digital Twins Definition Language (DTDL)

This release adds support for [DTDL v2](https://github.com/Azure/opendigitaltwins-dtdl) and deprecates [DTDL v1](https://github.com/Azure/opendigitaltwins-dtdl/tree/master/DTDL/v1-preview).

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

## No component and multiple component implementations

Simple devices using a few telemetry, commands, or properties can be described in a single interface without using components. Any existing device can become an IoT Plug and Play by announcing the **Model ID** without any changes to the existing device implementation.

More complex devices might group telemetry, commands, and properties on different interfaces to manage complexity and enable reuse across devices. These devices must be updated to follow a set of simple rules defined in the [IoT Plug and Play Preview message conventions](concepts-convention.md).

## Registration and discovery

In this release, devices announce their **Model ID** with IoT Hub on every connection. IoT Hub caches the **Model ID** enabling backend solutions to retrieve the **Model ID** using the device twin `modelId` property. The **Model ID** can also be retrieved from  `$metadata.$model` in the digital twin.

## Microsoft defined interfaces

The following Microsoft-defined interfaces are deprecated and aren't published in the new model repository:

- **urn:azureiot:ModelDiscovery:DigitalTwin:1**
- **urn:azureiot:ModelDiscovery:ModelInformation:1**

The following interface is published in the new model repository: `dtmi:azure:DeviceManagement:DeviceInformation;1` available in the URL [https://repo.azureiotrepository.com/Models/dtmi:azure:DeviceManagement:DeviceInformation;1?api-version=2020-05-01-preview](https://repo.azureiotrepository.com/Models/dtmi:azure:DeviceManagement:DeviceInformation;1?api-version=2020-05-01-preview).

## DigitalTwinChangeEvents

The event structure of the **DigitalTwinChangeEvents** [event source](../iot-hub/iot-hub-devguide-messages-d2c.md#non-telemetry-events) has changed to use the **JSON-Patch** format. This change is a breaking change with no backward compatibility support.

## Message routing

Telemetry messages have the following changes within [SystemProperties](../iot-hub/iot-hub-devguide-messages-construct.md) collection.

It now includes a **dt-dataschema** property that's the **Model ID** registered by the device.

The **dt-subject** property represents the component sending telemetry message.

The **iothub-interface-name** property is deprecated.

## Device and service SDKs

There's no backward compatibility with previous preview versions of the SDKs. You'll need to change your code if you move to the latest preview version of an SDK.

With the convention-based approach, there's no need for separate device client SDKs. From this preview release, the existing **DigitalTwinClient** libraries are deprecated in all languages. Instead, the IoT Hub device client SDKs have been updated to include an option to announce the **Model ID**.

Devices that don't use components require minimal code changes - just announcing the **Model ID**. More complex devices using a multiple components might require some reusable functions to implement the [conventions](concepts-convention.md). Device samples include a set of functions that you might reuse in your device implementation.

### Service SDKs

The service SDK is available in [Node.js](https://github.com/Azure/azure-iot-sdk-node/blob/digitaltwins-preview/digitaltwins/service/readme.md) and [Python](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-hub/README.md).

## VS Code extension

The [Azure IoT Device Workbench](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-iot-workbench) extension provides authoring support for DTDL v1, integration with the previous version of the model repository, and code generation.

If you require DTDL v2 authoring support in VS Code, install the new [DTDL extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl) in VS Code. The extension doesn't provide integration with the model repository or code generation. Managing models in the repository is now done using a [web UI](https://aka.ms/iotmodelrepo) or [CLI](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot/pnp?view=azure-cli-latest).

## Digital twin service-side REST APIs

The [digital twin service-side REST APIs](https://docs.microsoft.com/rest/api/iothub/service/digitaltwin) and payloads have changed. The supported APIs are:

- Retrieve a digital twin.
- Call a command.
- Update a digital twin using **JSON-Patch** payload.

The existing REST APIs continue to be supported in this release.

## Model repository

There's now a single model repository that contains both public published models, and private RBAC-protected company models. All models have a unique identifier and are immutable once created.

Existing company model repositories from the previous release aren't supported in this release. You can continue to use the [Azure Certified for IoT](https://preview.catalog.azureiotsolutions.com/products) website to manage the old DTDL v1 models. However, you can no longer use this website to register, test, and certify devices.

## Azure IoT Central

Azure IoT Central is currently being updated to support the IoT Plug and Play preview refresh release.
