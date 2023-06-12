---
title: Device Update for IoT Hub supported platforms
description: Device Update for IoT Hub supported operating systems.
author: eshashah
ms.author: eshashah
ms.date: 05/17/2023
ms.topic: concept-article
ms.service: iot-hub-device-update
---
# Device Update for IoT Hub supported platforms


This article explains what operating system platforms, and components are supported by Device Update for IoT Hub (DU) whether generally available or in preview.

## Get support

If you experience problems while using the Device Update service, there are several ways to seek support. Try one of the following channels for support:

**Reporting bugs** - The development that goes into the DU product happens in the Device Update open-source project. Bugs can be reported on the [issues page](https://github.com/Azure/iot-hub-device-update/issues) of the project. Fixes rapidly make their way from the projects in to product updates.

**Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

**Feature requests** - The DU product tracks feature requests via the product's [Device Update Discussions](https://github.com/Azure/iot-hub-device-update/discussions) community.

## Linux Operating Systems

Device Update can run on various most Linux operating systems; however, not all of these systems are supported by Microsoft. The systems listed in the following tables are supported, either generally available or in public preview, and are tested with each new release.

Microsoft has these operating systems in automated tests and provides installation packages for them

It is possible to port the open-source DU agent code to run on other OS versions but these are not tested and maintained by Microsoft.

The systems listed in the following tables are supported by Microsoft, either generally available or in public preview, and are tested with each new release.

| Operating System | AMD64 | ARM32v7 | ARM64 |
| ---------------- | ----- | ------- | ----- |
| Debian 10 (Buster) | ![Debian + AMD64](./media/support/green-check.png)  | ![Debian + ARM32v7](./media/support/green-check.png) | ![Debian + + ARM64](./media/support/green-check.png)  |
| Ubuntu Server 20.04 | ![Ubuntu Server 20.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 20.04 + ARM64](./media/support/green-check.png) |
| Ubuntu Server 18.04 | ![Ubuntu Server 18.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 18.04 + ARM64](./media/support/green-check.png) |


> [!NOTE]
> [Standard support for Ubuntu 18.04 LTS ends on May 31st, 2023](https://ubuntu.com/blog/18-04-end-of-standard-support). Beginning June 2023, Ubuntu 18.04 LTS won't be a supported platform. Ubuntu 18.04 LTS Device Update packages are available until Nov 30th, 2023. If you take no action, Ubuntu 18.04 LTS based Device Update devices continue to work but ongoing security patches and bug fixes in the host packages for Ubuntu 18.04 won't be available after Nov 30th, 2023. To continue to receive support and security updates, we recommend that you update your host OS to a supported platform. 

## Releases and Support

Device Update for IoT Hub release assets and release notes are available on the [Device Update Release](https://github.com/Azure/iot-hub-device-update/releases) page. Support for the APIs, PnP Models and device update reference agents is covered in the table. 

Device Update for IoT Hub 1.0 is the first major release and will continue to receive security fixes and fixes to regressions.  

Device Update (DU) agents use IoT Plug and Play models to send and receive properties and messages from the DU service. Each DU agent requires specific models to be used. Learn more about how device update uses these models and how they can be extended.  

Newer REST Service API versions supports older agents unless specified. Device Update for IoT Hub portal experience uses the latest APIs and have the same support as the API version. 

| Release notes and assets | deviceupdate-agent | Upgrade Supported from agent version | DU PnP Models supported | API Versions|
| ------------------------ | ------------------ | ------------------------------------ | ----------------------- |-------------|
| 1.0.0 | 1.0.0 <br /> 1.0.1 <br /> 1.0.2 | 0.8.x | dtmi:azure:iot:deviceUpdateContractModel;2 <br /> dtmi:azure:iot:deviceUpdateModel;2  | 2022-10-01 |
|0.0.8 (Preview)(Deprecated) | 0.8.0 <br /> 0.8.1 <br /> 0.8.2 |  | dtmi:azure:iot:deviceUpdateContractModel;1 <br /> dtmi:azure:iot:deviceUpdateModel;1 | 2022-10-01 <br /> 2021-06-01-preview (Deprecated)|

The latest API version, 2022-10-01 will be supported until the next stable release and the latest agent version, 1.0.x, will receive bug fixes and security fixes till the next stable release. 

> [!NOTE]
> Users, that have extended from the reference agent and customized the agent, are responsible for ensuring the bug fixes and security fixes are incorporated. You will also need to ensure the agent is built and configured correctly as defined by the service to connect service, perform updates, and manage devices from the IoT hub. 

> [!IMPORTANT]
> Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software.  
> For Device Update for IoT Hub, no stable API or agent version will be deprecated without a replacing version. Deprecated stable versions will be available for no less than 3 years after deprecation is announced to allow users to migrate to in-support agent and API versions. 
> Preview releases (Pre-releases) agents and APIs are not serviced after the release of the stable version. Preview versions are released to test new functionality, gather feedback, and discover and fix issues. Previews are available under Supplemental Terms of Use, and aren't recommended for production workloads. 
> 0.7.0 (Pre-release) is not supported by the latest service and API versions.  
> With the latest stable release, we recommend that all current customers running 0.x.x upgrade their devices to 1.0.x to receive ongoing support. 
