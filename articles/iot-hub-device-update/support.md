---
title: Device Update for IoT Hub supported platforms
description: Device Update for IoT Hub supported operating systems.
author: cwatson-cat
ms.author: cwatson
ms.date: 05/17/2023
ms.topic: concept-article
ms.service: azure-iot-hub
ms.custom: linux-related-content
ms.subservice: device-update
---
# Device Update for IoT Hub supported platforms

This article explains which operating systems and components are supported by Device Update for IoT Hub (DU), whether generally available or in preview.

## Get support

If you experience problems while using the Device Update service, there are several ways to seek support. Try one of the following channels for support:

**Reporting bugs** - The development that goes into the DU product happens in the Device Update open-source project. Bugs can be reported on the [issues page](https://github.com/Azure/iot-hub-device-update/issues) of the project. Fixes rapidly make their way from the projects in to product updates.

**Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

**Feature requests** - The DU product tracks feature requests via the product's [Device Update Discussions](https://github.com/Azure/iot-hub-device-update/blob/develop/CONTRIBUTING.md) community.

## Linux Operating Systems

Device Update can run on a wide range of Linux operating systems; however, not all operating systems are supported by Microsoft. The systems listed in the following table are supported, either generally available or in public preview, and are validated through automated testing with each release.

For some platforms, prebuilt installation packages may be available. Customers can also build or integrate the Device Update agent from source or use release artifacts. For more information about how to build the Device Update agent from source, see [how to build the device update agent](https://github.com/Azure/iot-hub-device-update/blob/develop/docs/agent-reference/how-to-build-agent-code.md).

It's possible to port the open-source Device Update agent to other operating systems. However, these builds aren't tested or maintained by Microsoft.

| Operating System | AMD64 | ARM32v7 | ARM64 |
| ---------------- | ----- | ------- | ----- |
| Debian 11 (Bullseye) | ![Debian 11 + AMD64](./media/support/green-check.png)  | ![Debian 11 + ARM32v7](./media/support/green-check.png) | ![Debian 11 + ARM64](./media/support/green-check.png)  |
| Debian 12 (Bookworm) | ![Debian 12 + AMD64](./media/support/green-check.png)  | ![Debian 12 + ARM32v7](./media/support/green-check.png) | ![Debian 12 + ARM64](./media/support/green-check.png)  |
| Debian 13 (Trixie) | ![Debian 13 + AMD64](./media/support/green-check.png)  | ![Debian 13 + ARM32v7](./media/support/green-check.png) | ![Debian 13 + ARM64](./media/support/green-check.png)  |
| Ubuntu Server 20.04 | ![Ubuntu Server 20.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 20.04 + ARM64](./media/support/green-check.png) |
| Ubuntu Server 22.04 | ![Ubuntu Server 22.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 22.04 + ARM64](./media/support/green-check.png) |
| Ubuntu Server 24.04 | ![Ubuntu Server 24.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 24.04 + ARM64](./media/support/green-check.png) |

## Releases and Support

You can find Device Update for IoT Hub release assets and release notes on the [Device Update Release](https://github.com/Azure/iot-hub-device-update/releases) page. 

The following table summarizes support for APIs, IoT Plug and Play (PnP) models, and Device Update reference agents.

Device Update agents use IoT Plug and Play (PnP) models to communicate with the service. The models listed in the following table identify the interfaces required for each agent version. For more information, see [IoT Plug and Play in Azure Device Update for IoT Hub](https://learn.microsoft.com/en-us/azure/iot-hub-device-update/device-update-plug-and-play).

The latest Device Update agent release is **1.3.0**, which includes ongoing improvements and expanded platform support. Customers should use version 1.0.0 or later and are encouraged to use the latest available version. 

| Release notes and assets | deviceupdate-agent | Upgrade Supported from agent version | DU PnP Models supported | API Versions|
| ------------------------ | ------------------ | ------------------------------------ | ----------------------- |-------------|
| 1.3.0 | 1.3.0 <br /> | 1.2.0 | dtmi:azure:iot:deviceUpdateContractModel; 3 <br /> dtmi:azure:iot:deviceUpdateModel; 3  | 2022-10-01 |
| 1.2.0 | 1.2.0 <br /> | 1.1.0 | dtmi:azure:iot:deviceUpdateContractModel; 3 <br /> dtmi:azure:iot:deviceUpdateModel; 3  | 2022-10-01 |
| 1.1.0 | 1.1.0|1.0.x | dtmi:azure:iot:deviceUpdateContractModel; 3 <br /> dtmi:azure:iot:deviceUpdateModel; 3| 2022-10-01 |
| 1.0.0 | 1.0.0 <br /> 1.0.1 <br /> 1.0.2 | 0.8.x | dtmi:azure:iot:deviceUpdateContractModel; 2 <br /> dtmi:azure:iot:deviceUpdateModel; 2  | 2022-10-01 |
|0.0.8 (Preview)(Deprecated) | 0.8.0 <br /> 0.8.1 <br /> 0.8.2 |  | dtmi:azure:iot:deviceUpdateContractModel; 1 <br /> dtmi:azure:iot:deviceUpdateModel; 1 | 2022-10-01 <br /> 2021-06-01-preview (Deprecated)|

Newer REST service API versions support older agents unless otherwise specified. The Device Update portal experience uses the latest API version.

> [!NOTE]
> Users that have extended from the reference agent and customized the agent are responsible for ensuring the bug fixes and security fixes are incorporated. You will also need to ensure the agent is built and configured correctly as defined by the service to connect to the service, perform updates, and manage devices from the IoT hub. 

> [!IMPORTANT]
> Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software.  
> For Device Update for IoT Hub, no stable API or agent version will be deprecated without a replacing version. Deprecated stable versions will be available for no less than three years after deprecation is announced to allow users to migrate to in-support agent and API versions. 
> Preview releases (Prereleases) agents and APIs are not serviced after the release of the stable version. Preview versions are released to test new functionality, gather feedback, and discover and fix issues. Previews are available under Supplemental Terms of Use, and aren't recommended for production workloads. 
> 0.7.0 (Prerelease) is not supported by the latest service and API versions.  
> With the latest stable release, we recommend that all current customers running 0.x.x upgrade their devices to 1.0.x to receive ongoing support. 
