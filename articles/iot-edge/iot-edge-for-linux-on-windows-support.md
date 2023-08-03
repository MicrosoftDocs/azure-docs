---
title: Supported operating systems, container engines - Azure IoT Edge for Linux on Windows
description: Learn which operating systems can run Azure IoT Edge for Linux on Windows
author: PatAltimore
ms.author: fcabrera
ms.date: 11/15/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Azure IoT Edge for Linux on Windows supported systems

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

This article provides details about which systems are supported by IoT Edge for Linux on Windows, whether generally available or in preview. 

## Get support

If you experience problems while using Azure IoT Edge for Linux on Windows, there are several ways to seek support. Try one of the following channels for support:

**Reporting bugs** - Bugs can be reported on the [issues page](https://github.com/azure/iotedge-eflow/issues) of the project. Bugs related to Azure IoT Edge can be reported on the [IoT Edge issues page](https://github.com/azure/iotedge/issues). Fixes rapidly make their way from the projects in to product updates.

**Microsoft Customer Support team** - Users who have a [support plan](https://azure.microsoft.com/support/plans/) can engage the Microsoft Customer Support team by creating a support ticket directly from the [Azure portal](https://portal.azure.com).


## Container engines

By default, Azure IoT Edge for Linux on Windows includes IoT Edge runtime as part of the virtual machine composition. The IoT Edge runtime provides moby-engine as the container engine, to run modules implemented as containers. This container engine is based on the Moby open-source project. For more information about container engines, support, and IoT Edge, see [IoT Edge Platform support](./support.md).


## Operating systems

IoT Edge for Linux on Windows uses IoT Edge in a Linux virtual machine running on a Windows host. In this way, you can run Linux modules on a Windows device. Azure IoT Edge for Linux on Windows runs on the following Windows SKUs:

* **Windows Client** 
  * Pro, Enterprise, IoT Enterprise SKUs
  * Windows 10 - Minimum build 17763 with all current cumulative updates installed
  * Windows 11
* **Windows Server**
  * Windows Server 2019 - Minimum build 17763 with all current cumulative updates installed
  * Windows Server 2022


## Platform support
Azure IoT Edge for Linux on Windows supports the following architectures:

| Version | AMD64 | ARM64 |
| ---------------- | ----- |  ----- |
| EFLOW 1.1 LTS | ![AMD64](./media/support/green-check.png) | |
| EFLOW Continuous Release (CR) ([Public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)) | ![AMD64](./media/support/green-check.png) | ![ARM64](./media/support/green-check.png) |
| EFLOW 1.4 LTS | ![AMD64](./media/support/green-check.png) | ![ARM64](./media/support/green-check.png) |

For more information about Windows ARM64 supported processors, see [Windows Processor Requirements](/windows-hardware/design/minimum/windows-processor-requirements).

## Nested virtualization

Azure IoT Edge for Linux on Windows (EFLOW) can run in Windows virtual machines. Using a virtual machine as an IoT Edge device is common when customers want to augment existing infrastructure with edge intelligence. In order to run the EFLOW virtual machine inside a Windows VM, the host VM must support nested virtualization. EFLOW supports the following nested virtualization scenarios:

| Version | Hyper-V VM | Azure VM | VMware ESXi VM | Other Hypervisor | 
| ---------------- | ----- |  ----- | ----- | ----- | 
| EFLOW 1.1 LTS | ![1.1LTS](./media/support/green-check.png) |  ![1.1LTS](./media/support/green-check.png) |  ![1.1LTS](./media/support/green-check.png) | - |  
| EFLOW Continuous Release (CR) ([Public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)) | ![CR](./media/support/green-check.png) | ![CR](./media/support/green-check.png) |  ![CR](./media/support/green-check.png) | - |
| EFLOW 1.4 LTS | ![1.4LTS](./media/support/green-check.png) |  ![1.4LTS](./media/support/green-check.png) |  ![1.4LTS](./media/support/green-check.png) | - |  
 
For more information, see [EFLOW Nested virtualization](./nested-virtualization.md).

### VMware virtual machine
Azure IoT Edge for Linux on Windows supports running inside a Windows virtual machine running on top of [VMware ESXi](https://www.vmware.com/products/esxi-and-esx.html) product family. Specific networking and virtualization configurations are needed to support this scenario. For more information about VMware configuration, see [EFLOW Nested virtualization](./nested-virtualization.md).

## Releases

IoT Edge for Linux on Windows release assets and release notes are available on the [iotedge-eflow releases](https://github.com/Azure/iotedge-eflow/releases) page. This section reflects information from those release notes to help you visualize the components of each version more easily.

The following table lists the components included in each release. Each release train is independent, and we don't guarantee backwards compatibility and migration between versions. For more information about IoT Edge version, see [IoT Edge platform support](./support.md).

| Release | IoT Edge | CBL-Mariner | Defender for IoT |
| ------- | -------- | ----------- | ---------------- |
| **1.1 LTS** | 1.1 | 2.0 | - |
| **Continuous Release** | 1.3 | 2.0 | 3.12.3 |
| **1.4 LTS** | 1.4 | 2.0 | 3.12.3 |


## Minimum system requirements

Azure IoT Edge for Linux on Windows runs great on small edge devices to server grade hardware. Choosing the right hardware for your scenario depends on the workloads that you want to run. 

A Windows device with the following minimum requirements:

* Hardware requirements
  * Minimum Free Memory: 1 GB
  * Minimum Free Disk Space: 10 GB

* Virtualization support
  * On Windows 10, enable Hyper-V. For more information, see [Install Hyper-V on Windows 10](/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
  * On Windows Server, install the Hyper-V role and create a default network switch. For more information, see [Nested virtualization for Azure IoT Edge for Linux on Windows](./nested-virtualization.md).
  * On a virtual machine, configure nested virtualization. For more information, see [nested virtualization](./nested-virtualization.md).

## Next steps

Read more about [IoT Edge for Linux on Windows security premises](./iot-edge-for-linux-on-windows-security.md).

Stay up-to-date with the latest [IoT Edge for Linux on Windows updates](./iot-edge-for-linux-on-windows-updates.md).