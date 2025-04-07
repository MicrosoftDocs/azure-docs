---
title: IoT Edge supported platforms
description: Azure IoT Edge supported operating systems, runtimes, and container engines.
author: PatAltimore
ms.author: patricka
ms.date: 02/12/2025
ms.topic: conceptual
ms.service: azure-iot-edge
services: iot-edge
---

# Azure IoT Edge supported platforms

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article explains what operating system platforms, IoT Edge runtimes, container engines, and components are supported by IoT Edge whether generally available or in preview.

## Get support

If you experience problems while using the Azure IoT Edge service, there are several ways to seek support. Try one of the following channels for support:

**Reporting bugs** - Most development that goes into the Azure IoT Edge product happens in the IoT Edge open-source project. Bugs can be reported on the [issues page](https://github.com/azure/iotedge/issues) of the project. Bugs related to Azure IoT Edge for Linux on Windows can be reported on the [iotedge-eflow issues page](https://github.com/azure/iotedge-eflow/issues). Fixes rapidly make their way from the projects in to product updates.

**Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

**Feature requests** - The Azure IoT Edge product tracks feature requests via the product's [Azure feedback](https://feedback.azure.com/d365community/forum/0e2fff5d-f524-ec11-b6e6-000d3a4f0da0) community.

## Container engines

Azure IoT Edge modules are implemented as containers, so IoT Edge needs a container engine to launch them. Microsoft provides a container engine, moby-engine, to fulfill this requirement. This container engine is based on the Moby open-source project. Docker CE and Docker EE are other popular container engines. They're also based on the Moby open-source project and are compatible with Azure IoT Edge. Microsoft provides best effort support for systems using those container engines; however, Microsoft can't ship fixes for issues in them. For this reason, Microsoft recommends using moby-engine on production systems. If you are using Ubuntu Core snaps, the Docker snap is serviced by Canonical and supported for production scenarios.

:::image type="content" source="./media/support/only-moby-for-production.png" alt-text="Screenshot of the Moby engine as a container runtime.":::

## Operating systems

Azure IoT Edge runs on most operating systems that can run containers; however, not all of these systems are equally supported. Operating systems are grouped into tiers that represent the level of support users can expect.

* Tier 1 systems are supported. For tier 1 systems, Microsoft:
  * has this operating system in automated tests
  * provides installation packages for them
* Tier 2 systems are compatible with Azure IoT Edge and can be used relatively easily. For tier 2 systems:
  * Microsoft has done informal testing on the platforms or knows of a partner successfully running Azure IoT Edge on the platform
  * Installation packages for other platforms may work on these platforms

### Tier 1

The systems listed in the following tables are supported by Microsoft, either generally available or in public preview, and are tested with each new release.

#### Linux containers

Modules built as Linux containers can be deployed to either Linux or Windows devices. For Linux devices, the IoT Edge runtime is installed directly on the host device. For Windows devices, a Linux virtual machine prebuilt with the IoT Edge runtime runs on the host device.

[IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) is the recommended way to run IoT Edge on Windows devices.

| Operating System | AMD64 | ARM32v7 | ARM64 | End of OS provider standard support |
| ---------------- | ----- | ------- | ----- | -------------- |
| [Debian 12](https://www.debian.org/releases/bookworm/) | ![Debian + AMD64](./media/support/green-check.png) | ![Debian + ARM32v7](./media/support/green-check.png) | ![Debian + ARM64](./media/support/green-check.png) | [June 2028](https://wiki.debian.org/LTS) |
| [Debian 11](https://www.debian.org/releases/bullseye/) |  | ![Debian + ARM32v7](./media/support/green-check.png) |  | [June 2026](https://wiki.debian.org/LTS) |
| [Red Hat Enterprise Linux 9](https://access.redhat.com/articles/3078) | ![Red Hat Enterprise Linux 9 + AMD64](./media/support/green-check.png) | | | [May 2032](https://access.redhat.com/product-life-cycles?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204) |
| [Red Hat Enterprise Linux 8](https://access.redhat.com/articles/3078) | ![Red Hat Enterprise Linux 8 + AMD64](./media/support/green-check.png) | | | [May 2029](https://access.redhat.com/product-life-cycles?product=Red%20Hat%20Enterprise%20Linux,OpenShift%20Container%20Platform%204) |
| [Ubuntu Server 24.04](https://wiki.ubuntu.com/NobleNumbat/ReleaseNotes) | ![Ubuntu Server 24.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 24.04 + ARM64](./media/support/green-check.png) | [June 2029](https://wiki.ubuntu.com/Releases) |
| [Ubuntu Server 22.04](https://wiki.ubuntu.com/JammyJellyfish/ReleaseNotes) | ![Ubuntu Server 22.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 22.04 + ARM64](./media/support/green-check.png) | [June 2027](https://wiki.ubuntu.com/Releases) |
| [Ubuntu Server 20.04](https://wiki.ubuntu.com/FocalFossa/ReleaseNotes) | ![Ubuntu Server 20.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 20.04 + ARM64](./media/support/green-check.png) | [May 2025](https://wiki.ubuntu.com/Releases) |
| [Ubuntu Core <sup>1</sup>](https://snapcraft.io/azure-iot-edge) | ![Ubuntu Core + AMD64](./media/support/green-check.png) |  | ![Ubuntu Core + ARM64](./media/support/green-check.png)  | [April 2027](https://ubuntu.com/about/release-cycle) |
| [Windows 10/11](iot-edge-for-linux-on-windows.md#prerequisites) | ![Windows 10/11 + AMD64](./media/support/green-check.png) |  | ![Windows 10/11 + ARM64](./media/support/green-check.png) | See [Azure IoT EFLOW](iot-edge-for-linux-on-windows.md#prerequisites) for supported Windows OS versions. |
| [Windows Server 2019/2022](iot-edge-for-linux-on-windows.md#prerequisites) | ![Windows Server 2019/2022 + AMD64](./media/support/green-check.png) | | | See [Azure IoT EFLOW](iot-edge-for-linux-on-windows.md#prerequisites) for supported Windows OS versions. |

<sup>1</sup> Ubuntu Core is fully supported but the automated testing of Snaps currently happens on Ubuntu 22.04 Server LTS. 

> [!NOTE]
> When a *Tier 1* operating system reaches its end of standard support date, it's removed from the *Tier 1* supported platform list. If you take no action, IoT Edge devices running on the unsupported operating system continue to work but ongoing security patches and bug fixes in the host packages for the operating system won't be available after the end of support date. To continue to receive support and security updates, we recommend that you update your host OS to a *Tier 1* supported platform.

#### Windows containers

We no longer support Windows containers. [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) is the recommended way to run IoT Edge on Windows devices.

### Tier 2

The systems listed in the following table are considered compatible with Azure IoT Edge, but aren't actively tested or maintained by Microsoft.

> [!IMPORTANT]
> Support for these systems is best effort and may require you reproduce the issue on a tier 1 supported system.
>
> Installation packages are made available on the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). See the installation steps in [Offline or specific version installation](how-to-provision-single-device-linux-symmetric.md#offline-or-specific-version-installation-optional).

| Operating System | AMD64 | ARM32v7 | ARM64 | End of OS provider standard support |
| ---------------- | ----- | ------- | ----- | -------------- |
| [Debian 11](https://www.debian.org/releases/bullseye/) | ![Debian 11 + AMD64](./media/support/green-check.png) |  | ![Debian 11 + ARM64](./media/support/green-check.png) | [June 2026](https://wiki.debian.org/LTS) |
| [Mentor Embedded Linux Flex OS](https://www.mentor.com/embedded-software/linux/mel-flex-os/) | ![Mentor Embedded Linux Flex OS + AMD64](./media/support/green-check.png) | ![Mentor Embedded Linux Flex OS + ARM32v7](./media/support/green-check.png) | ![Mentor Embedded Linux Flex OS + ARM64](./media/support/green-check.png) |  |
| [Mentor Embedded Linux Omni OS](https://www.mentor.com/embedded-software/linux/mel-omni-os/) | ![Mentor Embedded Linux Omni OS + AMD64](./media/support/green-check.png) |  | ![Mentor Embedded Linux Omni OS + ARM64](./media/support/green-check.png) |  |
| [Ubuntu Server 24.04](https://wiki.ubuntu.com/NobleNumbat/ReleaseNotes) |  | ![Ubuntu 24.04 + ARM32v7](./media/support/green-check.png) |  | [June 2029](https://wiki.ubuntu.com/Releases) |
| [Ubuntu Server 22.04](https://wiki.ubuntu.com/JammyJellyfish/ReleaseNotes) |  | ![Ubuntu 22.04 + ARM32v7](./media/support/green-check.png) |  | [June 2027](https://wiki.ubuntu.com/Releases) |
| [Ubuntu Server 20.04](https://wiki.ubuntu.com/FocalFossa/ReleaseNotes) |  | ![Ubuntu 20.04 + ARM32v7](./media/support/green-check.png) |  | [May 2025](https://wiki.ubuntu.com/Releases) |
| [Wind River 8](https://docs.windriver.com/category/os-wind_river_linux) | ![Wind River 8 + AMD64](./media/support/green-check.png) |  |  |  |
| [Yocto (scarthgap)](https://www.yoctoproject.org/)<br>For Yocto issues, open a [GitHub issue](https://github.com/Azure/meta-iotedge/issues) | ![Yocto + AMD64](./media/support/green-check.png) | ![Yocto + ARM32v7](./media/support/green-check.png) | ![Yocto + ARM64](./media/support/green-check.png) | [April 2028](https://wiki.yoctoproject.org/wiki/Releases) |
| [Yocto (kirkstone)](https://www.yoctoproject.org/)<br>For Yocto issues, open a [GitHub issue](https://github.com/Azure/meta-iotedge/issues) | ![Yocto + AMD64](./media/support/green-check.png) | ![Yocto + ARM32v7](./media/support/green-check.png) | ![Yocto + ARM64](./media/support/green-check.png) | [April 2026](https://wiki.yoctoproject.org/wiki/Releases) |

> [!NOTE]
> When a *Tier 2* operating system reaches its end of standard support date, it's removed from the supported platform list. If you take no action, IoT Edge devices running on the unsupported operating system continue to work but ongoing security patches and bug fixes in the host packages for the operating system won't be available after the end of support date. To continue to receive support and security updates, we recommend that you update your host OS to a *Tier 1* supported platform.

## Releases

The following table lists the currently supported releases. IoT Edge release assets and release notes are available on the [azure-iotedge releases](https://github.com/Azure/azure-iotedge/releases) page.

| Release notes and assets | Type | Release Date | End of Support Date |
| ------------------------ | ---- | ------------ | ------------------- |
| [1.5](https://github.com/Azure/azure-iotedge/releases/tag/1.5.0) | Long-term support (LTS) | April 2024 | November 10, 2026 |

For more information on IoT Edge version history, see, [Version history](version-history.md#version-history).

> [!IMPORTANT]
> * Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. IoT Edge is governed by Microsoft's [Modern Lifecycle Policy](/lifecycle/policies/modern).

IoT Edge uses the Microsoft.Azure.Devices.Client SDK. For more information, see the [Azure IoT C# SDK GitHub repo](https://github.com/Azure/azure-iot-sdk-csharp) or the [Azure SDK for .NET reference content](/dotnet/azure/sdk/azure-sdk-for-dotnet). The following list shows the version of the client SDK that each release is tested against:

| IoT Edge version | Microsoft.Azure.Devices.Client SDK version |
|------------------|--------------------------------------------|
| 1.5              | 1.42.x |
| 1.4              | 1.36.6 |

## Virtual Machines

Azure IoT Edge can be run in virtual machines, such as an [Azure Virtual Machine](/azure/virtual-machines/). Using a virtual machine as an IoT Edge device is common when customers want to augment existing infrastructure with edge intelligence. The family of the host VM OS must match the family of the guest OS used inside a module's container. This requirement is the same as when Azure IoT Edge is run directly on a device. Azure IoT Edge is agnostic of the underlying virtualization technology and works in VMs powered by platforms like Hyper-V and vSphere.

:::image type="content" source="./media/support/edge-on-vm-linux.png" alt-text="Screenshot of an Azure IoT Edge in a virtual machine.":::

## Minimum system requirements

Azure IoT Edge runs great on devices as small as a Raspberry Pi3 to server grade hardware. Choosing the right hardware for your scenario depends on the workloads that you want to run. Making the final device decision can be complicated; however, you can easily start prototyping a solution on traditional laptops or desktops.

Experience while prototyping will help guide your final device selection. Questions you should consider include:

* How many modules are in your workload?
* How many layers do your modules' containers share?
* In what language are your modules written?
* How much data will your modules be processing?
* Do your modules need any specialized hardware for accelerating their workloads?
* What are the desired performance characteristics of your solution?
* What is your hardware budget?
