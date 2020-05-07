---
title: Prepare your IoT Edge module technical assets - Azure Marketplace
description: Learn about the technical and configuration requirements your Internet of Things (IoT) Edge module technical assets must meet before you can publish them to Azure Marketplace.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/03/2020
---

# Prepare your IoT Edge module technical assets

This article describes the requirements that your Internet of Things (IoT) Edge module technical assets must meet before being published in Azure Marketplace.

## Get started

An IoT Edge module is a Docker-compatible container that runs on an IoT Edge device.

- To learn more about IoT Edge modules, see [Understand Azure IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/iot-edge-modules).
- To get started with your IoT Edge module development, see [Develop your own IoT Edge modules](https://docs.microsoft.com/azure/iot-edge/module-development).

## Technical requirements

Your IoT Edge module must meet the following technical requirements to be certified and published in Azure Marketplace.

### Platform support

Your IoT Edge module must support one of the following platform options:

#### Tier 1 platforms supported by IoT Edge

Your module must support all Tier 1 platforms supported by IoT Edge (as recorded in [Azure IoT Edge support](https://docs.microsoft.com/azure/iot-edge/support)). We recommend this option because it provides a better customer experience. Modules that meet this criteria will be showcased. A module using this platform option must:

- Provide a latest tag and a version tag (for example, 1.0.1) that are manifest tags built with the [GitHub Manifest-tool](https://github.com/estesp/manifest-tool).

- Use the offer listing tab in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace) to add a link under the **Useful links** section to the [Azure IoT Edge Certified device catalog](https://catalog.azureiotsolutions.com/alldevices?filters={%2218%22:[%221%22]}/).

#### A subset of Tier 1 platforms supported by IoT Edge

Your module must support a subset (at least one) of Tier 1 platforms supported by IoT Edge (as recorded in [Azure IoT Edge support](https://docs.microsoft.com/azure/iot-edge/support)). A module using this platform option must:

- Provide a latest tag and a version tag (for example, 1.0.1) that are manifest tags built with the GitHub [manifest-tool](https://github.com/estesp/manifest-tool) if more than one platform is supported. Manifest tags are optional only when one platform is supported.
- Use the offer listing tab in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace) to add a link under the **Useful links** section to at least one IoT Edge device from the [Azure IoT Edge Certified device catalog](https://catalog.azureiotsolutions.com/).

:::image type="content" source="media/iot-edge-module-technical-assets-offer-listing.png" alt-text="This is an image of the Offer Listing section within Partner Center":::

### Device dimensions

IoT Edge module dimensions (such as CPU, RAM, storage, and GPU) on targeted IoT Edge devices must meet the following requirements:

- The module must work with at least one IoT Edge device from the [Azure IoT Edge Certified device catalog](https://catalog.azureiotsolutions.com/).

- The minimum hardware requirements must be documented as the last paragraph in the description of the offer (under the offer listing tab in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace)). Optionally, you can also list the recommended hardware requirements if they differ significantly. For example, add the following section at the end of your offer description:

Copy this HTML text or use the corresponding rich text functions in the editing window.

```html
<p><u>Minimum hardware requirements:</u> Linux x64 and arm32 OS, 1GB of RAM, 500 Mb of storage</p>
```

### Configuration

Your module must include default configuration settings to make the deployment to an IoT Edge device as straightforward as possible. This information can be provided in the **Technical configuration** page for the plan in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace). The container may also include the IoT Edge Module SDK to enable communication with the edge Hub and IoT Hub.

#### Default configuration

IoT Edge modules must be able to start with the default settings provided in the **Technical configuration** page for the plan in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace). The following default settings are available:

- Default **routes**
- Default **module twin desired properties**
- Default **environment variables**
- Default **container create options**

In a scenario where a parameter that's required for a default value doesn't make sense (for example, the IP address of a customer's server), add a parameter as the default value. This value is upper case and enclosed in brackets. For this example, you'd set up the following default environment variable:

```
ServerIPAddress = <MY_SERVER_IP_ADDRESS>
```

#### Configuration documentation

All configuration settings of an IoT Edge module must be clearly documented. For example, you must document how to use its routes, twin desired properties, environment variables, createOptions, and so on. You must either provide a link to your documentation or make it part of your offer or plan description. You can provide this information in the **Offer listing** and **Plan listing** page in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace).

#### Tags and versioning

Customers must be able to easily deploy a module and automatically get updates from the marketplace (in a developer scenario). They also must be able to use and freeze an exact version they've tested (in a production scenario).

To meet these customer expectations and be published in the marketplace, IoT Edge modules must meet the following requirements

- Include a manifest latest tag that points to the latest version on all supported platforms.
- Make version tags in the form X.Y.Z, where X, Y, and Z are integers.
- Include a "version" tag, such as 1.0.1, that points to a specific version on all supported platforms.
- Don't update "version" tags, such as 1.0.1, because they must not be changed.

> [!NOTE]
> Optionally, versioning can include "rolling version" tags, such as 2.0 and 1.0. This supports maintaining multiple major versions in parallel.

### Telemetry

Modules using the IoT Module SDK must set the unique module identifier to PublisherId.OfferId.SkuId for telemetry purposes. A unique identifier helps Azure Marketplace identify the number of module instances that are running.

Use one of the following methods from the IoT Module SDKs to set the ProductInfo to this identifier:

- [C#](https://docs.microsoft.com/dotnet/api/microsoft.azure.devices.client.deviceclient.productinfo?view=azure-dotnet#Microsoft_Azure_Devices_Client_DeviceClient_ProductInfo)
- [C](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
- [Python](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/Iothub_sdk_options.md)
- [Java](https://docs.microsoft.com/java/api/com.microsoft.azure.sdk.iot.device.productinfo?view=azure-java-stable)

For modules that don't use the IoT Module SDK, less precise insights are available through Partner Center, such as the number of downloads.

### Security

IoT Edge modules must avoid [privileged modules](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities). Instead ask for the least privileged access to the host as possible.

### Module IoT SDK

Including the IoT Module SDK isn't a prerequisite for certification. However, including the IoT Module SDK may provide a better user experience. For example, to support routing or sending messages to the Cloud.

The IoT Module SDK is required to get telemetry data about the number of module instances that are running.

## Recertification process

Partners are notified whenever there's a breaking change that affects their modules, such as:

- Tier 1 OS/arch support matrix supported by IoT Edge
- IoT Module SDK
- IoT Edge runtime
- IoT Edge module certification guidelines

Partners must update and recertify their offers by re-publishing them in [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace).

Your offer will also be recertified if you update it, such as adding new image tags.

## Host module in Azure Container Registry

To upload your IoT Edge module to Azure Marketplace, you first need to host it in an [Azure Container Registry](https://azure.microsoft.com/services/container-registry/) (ACR). The module must include all the tags that you want to publish, including the image tags that are referenced by a manifest tag. For more information, see the tutorial [Create an Azure container registry and push a container image](https://docs.microsoft.com/azure/container-instances/container-instances-tutorial-prepare-acr).

## Next steps

- [Create an IoT Edge module offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/azure-iot-edge-module-creation)