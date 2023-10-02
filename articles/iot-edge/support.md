---
title: IoT Edge supported platforms
description: Azure IoT Edge supported operating systems, runtimes, and container engines.
author: PatAltimore
ms.author: patricka
ms.date: 05/03/2023
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Azure IoT Edge supported platforms

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article explains what operating system platforms, IoT Edge runtimes, container engines, and components are supported by IoT Edge whether generally available or in preview.

## Get support

If you experience problems while using the Azure IoT Edge service, there are several ways to seek support. Try one of the following channels for support:

**Reporting bugs** - Most development that goes into the Azure IoT Edge product happens in the IoT Edge open-source project. Bugs can be reported on the [issues page](https://github.com/azure/iotedge/issues) of the project. Bugs related to Azure IoT Edge for Linux on Windows can be reported on the [iotedge-eflow issues page](https://github.com/azure/iotedge-eflow/issues). Fixes rapidly make their way from the projects in to product updates.

**Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com/signin/index/?feature.settingsportalinstance=mpac).

**Feature requests** - The Azure IoT Edge product tracks feature requests via the product's [Azure feedback](https://feedback.azure.com/d365community/forum/0e2fff5d-f524-ec11-b6e6-000d3a4f0da0) community.

## Container engines

Azure IoT Edge modules are implemented as containers, so IoT Edge needs a container engine to launch them. Microsoft provides a container engine, moby-engine, to fulfill this requirement. This container engine is based on the Moby open-source project. Docker CE and Docker EE are other popular container engines. They're also based on the Moby open-source project and are compatible with Azure IoT Edge. Microsoft provides best effort support for systems using those container engines; however, Microsoft can't ship fixes for issues in them. For this reason, Microsoft recommends using moby-engine on production systems.

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

| Operating System | AMD64 | ARM32v7 | ARM64 |
| ---------------- | ----- | ------- | ----- |
| Debian 11 (Bullseye) |  | ![Debian + ARM32v7](./media/support/green-check.png) |  |
| Red Hat Enterprise Linux 9 | ![Red Hat Enterprise Linux 9 + AMD64](./media/support/green-check.png) | | |
| Red Hat Enterprise Linux 8 | ![Red Hat Enterprise Linux 8 + AMD64](./media/support/green-check.png) | | |
| Ubuntu Server 22.04 | ![Ubuntu Server 22.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 22.04 + ARM64](./media/support/green-check.png) |
| Ubuntu Server 20.04 | ![Ubuntu Server 20.04 + AMD64](./media/support/green-check.png) |  | ![Ubuntu Server 20.04 + ARM64](./media/support/green-check.png) |
| Windows 10/11 Pro | ![Windows 10/11 Pro + AMD64](./media/support/green-check.png) |  | ![Win 10 Pro + ARM64](./media/support/green-check.png) |
| Windows 10/11 Enterprise | ![Windows 10/11 Enterprise + AMD64](./media/support/green-check.png) |  | ![Win 10 Enterprise + ARM64](./media/support/green-check.png) |
| Windows 10/11 IoT Enterprise | ![Windows 10/11 IoT Enterprise + AMD64](./media/support/green-check.png) |  | ![Win 10 IoT Enterprise + ARM64](./media/support/green-check.png) |
| Windows Server 2019/2022 | ![Windows Server 2019/2022 + AMD64](./media/support/green-check.png) |  |  |

All Windows operating systems must be minimum build 17763 with all current cumulative updates installed.

> [!NOTE]
> [Standard support for Ubuntu 18.04 LTS ends on May 31st, 2023](https://ubuntu.com/blog/18-04-end-of-standard-support). Beginning June 2023, Ubuntu 18.04 LTS won't be an IoT Edge *tier 1* supported platform. Ubuntu 18.04 LTS IoT Edge packages are available until Nov 30th, 2023. IoT Edge system modules Edge Agent and Edge Hub aren't impacted. If you take no action, Ubuntu 18.04 LTS based IoT Edge devices continue to work but ongoing security patches and bug fixes in the host packages for Ubuntu 18.04 won't be available after Nov 30th, 2023. To continue to receive support and security updates, we recommend that you update your host OS to a *tier 1* supported platform. For more information, see the [Update your IoT Edge devices on Ubuntu 18.04 LTS announcement](https://azure.microsoft.com/updates/update-ubuntu-1804/).

#### Windows containers

We no longer support Windows containers. [IoT Edge for Linux on Windows](iot-edge-for-linux-on-windows.md) is the recommended way to run IoT Edge on Windows devices.

### Tier 2

The systems listed in the following table are considered compatible with Azure IoT Edge, but aren't actively tested or maintained by Microsoft.

> [!IMPORTANT]
> Support for these systems is best effort and may require you reproduce the issue on a tier 1 supported system.

| Operating System | AMD64 | ARM32v7 | ARM64 |
| ---------------- | ----- | ------- | ----- |
| [CentOS-7](https://wiki.centos.org/Manuals/ReleaseNotes/CentOS7) | ![CentOS + AMD64](./media/support/green-check.png) | ![CentOS + ARM32v7](./media/support/green-check.png) | ![CentOS + ARM64](./media/support/green-check.png) |
| [Debian 10 <sup>1</sup>](https://www.debian.org/releases/buster/) | ![Debian 10 + AMD64](./media/support/green-check.png) | ![Debian 10 + ARM32v7](./media/support/green-check.png) | ![Debian 10 + ARM64](./media/support/green-check.png) |
| [Debian 11](https://www.debian.org/releases/bullseye/) | ![Debian 11 + AMD64](./media/support/green-check.png) |  | ![Debian 11 + ARM64](./media/support/green-check.png) |
| [Mentor Embedded Linux Flex OS](https://www.mentor.com/embedded-software/linux/mel-flex-os/) | ![Mentor Embedded Linux Flex OS + AMD64](./media/support/green-check.png) | ![Mentor Embedded Linux Flex OS + ARM32v7](./media/support/green-check.png) | ![Mentor Embedded Linux Flex OS + ARM64](./media/support/green-check.png) |
| [Mentor Embedded Linux Omni OS](https://www.mentor.com/embedded-software/linux/mel-omni-os/) | ![Mentor Embedded Linux Omni OS + AMD64](./media/support/green-check.png) |  | ![Mentor Embedded Linux Omni OS + ARM64](./media/support/green-check.png) |
| [RHEL 7](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7) | ![RHEL 7 + AMD64](./media/support/green-check.png) | ![RHEL 7 + ARM32v7](./media/support/green-check.png) | ![RHEL 7 + ARM64](./media/support/green-check.png) |
| [Ubuntu 20.04 <sup>2</sup>](https://wiki.ubuntu.com/FocalFossa/ReleaseNotes) |  | ![Ubuntu 20.04 + ARM32v7](./media/support/green-check.png) |  |
| [Ubuntu 22.04 <sup>2</sup>](https://wiki.ubuntu.com/JammyJellyfish/ReleaseNotes) |  | ![Ubuntu 22.04 + ARM32v7](./media/support/green-check.png) |  |
| [Wind River 8](https://docs.windriver.com/category/os-wind_river_linux) | ![Wind River 8 + AMD64](./media/support/green-check.png) |  |  |
| [Yocto](https://www.yoctoproject.org/)<br>For Yocto issues, open a [GitHub issue](https://github.com/Azure/meta-iotedge/issues) | ![Yocto + AMD64](./media/support/green-check.png) | ![Yocto + ARM32v7](./media/support/green-check.png) | ![Yocto + ARM64](./media/support/green-check.png) |
| Raspberry Pi OS Buster |  | ![Raspberry Pi OS Buster + ARM32v7](./media/support/green-check.png) | ![Raspberry Pi OS Buster + ARM64](./media/support/green-check.png) |

<sup>1</sup> With the release of 1.3, there are new system calls that cause crashes in Debian 10. To see the workaround, view the [Known issue: Debian 10 (Buster) on ARMv7](https://github.com/Azure/azure-iotedge/releases) section of the 1.3 release notes for details.

<sup>2</sup> Installation packages are made available on the [Azure IoT Edge releases](https://github.com/Azure/azure-iotedge/releases). See the installation steps in [Offline or specific version installation](how-to-provision-single-device-linux-symmetric.md#offline-or-specific-version-installation-optional).

## Releases

The following table lists the currently supported releases. IoT Edge release assets and release notes are available on the [azure-iotedge releases](https://github.com/Azure/azure-iotedge/releases) page.

| Release notes and assets | Type | Release Date | End of Support Date |
| ------------------------ | ---- | ------------ | ------------------- |
| [1.4](https://github.com/Azure/azure-iotedge/releases/tag/1.4.0) | Long-term support (LTS) | August 2022 | November 12, 2024 |

For more information on IoT Edge version history, see, [Version history](version-history.md#version-history).

> [!IMPORTANT]
> * Every Microsoft product has a lifecycle. The lifecycle begins when a product is released and ends when it's no longer supported. Knowing key dates in this lifecycle helps you make informed decisions about when to upgrade or make other changes to your software. IoT Edge is governed by Microsoft's [Modern Lifecycle Policy](/lifecycle/policies/modern).

IoT Edge uses the Microsoft.Azure.Devices.Client SDK. For more information, see the [Azure IoT C# SDK GitHub repo](https://github.com/Azure/azure-iot-sdk-csharp) or the [Azure SDK for .NET reference content](/dotnet/api/overview/azure/iot/client). The following list shows the version of the client SDK that each release is tested against:

| IoT Edge version | Microsoft.Azure.Devices.Client SDK version |
|------------------|--------------------------------------------|
| 1.4              | 1.36.6                                     |

## Virtual Machines

Azure IoT Edge can be run in virtual machines, such as an [Azure Virtual Machine](../virtual-machines/index.yml). Using a virtual machine as an IoT Edge device is common when customers want to augment existing infrastructure with edge intelligence. The family of the host VM OS must match the family of the guest OS used inside a module's container. This requirement is the same as when Azure IoT Edge is run directly on a device. Azure IoT Edge is agnostic of the underlying virtualization technology and works in VMs powered by platforms like Hyper-V and vSphere.

:::image type="content" source="./media/support/edge-on-vm-linux.png" alt-text="Screenshot of an Azure I o T Edge in a virtual machine.":::

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
