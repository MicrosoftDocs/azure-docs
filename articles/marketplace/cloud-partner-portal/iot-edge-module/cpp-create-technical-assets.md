---
title: Create Azure IoT Edge module technical assets | Azure Marketplace
description: Create the technical assets for an IoT Edge module.
services: Azure, Marketplace, Cloud Partner Portal, 
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 10/18/2018
ms.author: pabutler
---

# Prepare your IoT Edge module technical assets

This article describes the requirements that your IoT Edge module technical assets need to meet before being published on Azure Marketplace.

## Understanding IoT Edge modules and getting started

An IoT Edge module is a Docker-compatible container that's made to run on an IoT Edge device.

- To learn more about IoT Edge modules, see [Understand Azure IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/iot-edge-modules).
- To get started with your IoT Edge module development, see [requirements and tools for developing IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/module-development).

## Technical requirements

The following technical requirements must be met in order for your IoT Edge module to be certified and published on the Azure Marketplace.

### Platform support

Your IoT Edge module must support one of the following platform options.

#### Tier 1 platforms supported by IoT Edge

Support all Tier 1 platforms supported by IoT Edge (as recorded in [Azure IoT Edge support](https://docs.microsoft.com/azure/iot-edge/support)). We recommend this option because it provides a better customer experience. Modules meeting this criteria will be showcased. A module using this platform option must:

- Provide a `latest` tag and a version tag (for example, `1.0.1`) that are manifest tags built with the GitHub [manifest-tool](https://github.com/estesp/manifest-tool).
- Use the [the Marketplace tab](./cpp-marketplace-tab.md) to add a link to [Compatible IoT Edge certified devices](https://aka.ms/iot-edge-certified). This link resolves to `https://aka.ms/iot-edge-certified`, a website where customers can browse or search for certified devices. This website is also known as the [Azure IoT Edge Certified](https://catalog.azureiotsolutions.com/) device catalog.

#### A subset of Tier 1 platforms supported by IoT Edge
  
Support a subset (at least one) of Tier 1 platforms supported by IoT Edge (as recorded in [Azure IoT Edge support](https://docs.microsoft.com/azure/iot-edge/support)). A module using this platform option must:

- Provide a `latest` tag and a version tag (for example, `1.0.1`) that are manifest tags built with the GitHub [manifest-tool](https://github.com/estesp/manifest-tool) if more than one platform is supported. Manifest tags are optional only when one platform is supported.
- Use the [Marketplace tab](./cpp-marketplace-tab.md) to provide a link to at least one IoT Edge device in the [Azure IoT Edge Certified](https://catalog.azureiotsolutions.com/) device catalog.

### Device dimensions

IoT Edge module dimensions (CPU/RAM/Storage/GPU/etc.) on targeted IoT Edge devices must meet the following requirements:

- The module must **work with at least one IoT Edge certified** device in the [Azure IoT Edge Certified](https://catalog.azureiotsolutions.com/) device catalog.
- The **Minimum hardware requirements** must be documented as the last paragraph in the description of the offer (under the [Marketplace tab](./cpp-marketplace-tab.md)). Optionally, you can also list the recommended hardware requirements if they differ significantly. For example, add the following section at the end of your offer description:

  ```html
    <p><u>Minimum hardware requirements:</u> Linux x64 and arm32  OS, 1GB of RAM, 500 Mb of storage</p>
  ```

### Configuration

It also includes default configuration settings to make the deployment to an IoT Edge device as straight-forward as possible. The container may also include the IoT Edge Module SDK to enable communication with the edgeHub and IoT Hub.

#### Default configuration

IoT Edge modules must be able to start with the default settings provided in [SKU tab of the Cloud Partner portal](./cpp-skus-tab.md). The following default settings are available:

- Default **routes**
- Default **twin desired properties**
- Default **environment variables**
- Default **createOptions**

In a scenario where a parameter required for a default value doesn't make sense (for example, the IP address of a customer's server), you add a parameter as the default value. This value is enclosed in brackets and in upper case. For this example, you'd set up the following default environment variable:

```
    ServerIPAddress = <MY_SERVER_IP_ADDRESS>
```

#### Configuration documentation

All configuration settings of an IoT Edge module must be clearly documented (how to use its routes, twin desired properties, environment variables, createOptions, and so on.) Provide a link to your documentation, or the documentation must be part of your offer/sku description.

### Tags and versioning

Customers must be able to easily deploy a module and automatically get updates from the marketplace (in a developer scenario.) They also must be able to use and freeze an exact version they've tested (in a production scenario.)

To meet these customer's expectations and be published in the marketplace, IoT Edge modules must meet the following requirements:

- Include a manifest `latest` tag, that points the latest version on all supported platforms.
- Version tags must be of the form X.Y.Z, where X, Y, and Z are integers.
- Include a "version" tag, like `1.0.1`, that points to a specific version on all supported platforms.
- Don't update "version" tags, like `1.0.1`, because they must be immutable.

>[!Note]
>Optionally, versioning can include "rolling version" tags, such as `2.0` and `1.0`. This supports maintaining multiple major versions in parallel.

### Telemetry

Modules using the IoT Module SDK must set the unique module identifier to `PublisherId.OfferId.SkuId` for telemetry purposes. A unique identifier enables the Azure Marketplace to identify the number of module instances that are running.

 Use the following methods from the IoT Module SDKs to set the `ProductInfo` to this identifier:

- [C\#](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.productinfo?view=azure-dotnet#Microsoft_Azure_Devices_Client_DeviceClient_ProductInfo) 
- [C](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
- [Python](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
- [Java](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.productinfo?view=azure-java-stable)

For modules that don't use the IoT Module SDK, less precise insights are available through the Cloud Partner Portal such as the number of downloads.

### Security

IoT Edge modules must ask for the least privileged access to the host as possible. [Privileged modules](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) should be avoided.

### Module IoT SDK

Including the IoT Module SDK isn't a prerequisite for certification. However, including the IoT Module SDK may provide a better user experience. For example, to support routing or sending messages to the Cloud.

The IoT Module SDK is required to get telemetry data about the number of module instances running.


## Recertification process

<!-- Add legal time windows-->
Partners will get notified whenever there is a breaking change that affects their modules, such as:

- Tier 1 os/arch support matrix supported by IoT Edge
- IoT Module SDK
- IoT Edge Runtime
- The IoT Edge module certification guidelines

Partners will have to update their modules and recertify them using the Cloud Partner Portal tool.

## Host your IoT Edge module in an Azure Container Registry

To upload your IoT Edge module to the Cloud Partner Portal, you first need to host it in an [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) (ACR). The module must include all the tags that you want to publish, including the image tags referenced by a manifest tag.


## Next steps

- [Create your IoT Edge module offer](./cpp-create-offer.md)
