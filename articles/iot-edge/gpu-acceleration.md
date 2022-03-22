---
title: GPU acceleration for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure your Azure IoT Edge for Linux on Windows virtual machines to use host device GPUs.
author: PatAltimore
manager: kgremban
ms.author: patricka
ms.date: 06/22/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# GPU acceleration for Azure IoT Edge for Linux on Windows (Preview)

[!INCLUDE [iot-edge-version-all-supported](../../includes/iot-edge-version-all-supported.md)]

GPUs are a popular choice for artificial intelligence computations, because they offer parallel processing capabilities and can often execute vision-based inferencing faster than CPUs. To better support artificial intelligence and machine learning applications, Azure IoT Edge for Linux on Windows can expose a GPU to the virtual machine's Linux module.

> [!NOTE]
> The GPU acceleration features detailed below are in preview and are subject to change.

Azure IoT Edge for Linux on Windows supports several GPU passthrough technologies, including:

* **Direct Device Assignment (DDA)** - GPU cores are allocated either to the Linux virtual machine or the host.

* **GPU-Paravirtualization (GPU-PV)** - The GPU is shared between the Linux virtual machine and the host.

You must select the appropriate passthrough method during deployment to match the supported capabilities of your device's GPU hardware.

> [!IMPORTANT]
> These features may include components developed and owned by NVIDIA Corporation or its licensors. The use of the components is governed by the NVIDIA End-User License Agreement located [on NVIDIA's website](https://www.nvidia.com/content/DriverDownload-March2009/licence.php?lang=us).
>
> By using GPU acceleration features, you are accepting and agreeing to the terms of the NVIDIA End-User License Agreement.

## Prerequisites

The GPU acceleration features of Azure IoT Edge for Linux on Windows currently supports a select set of GPU hardware. Additionally, use of this feature may require specific versions of Windows, depending on your configuration.

The supported GPUs and required Windows versions are listed below:

* NVIDIA T4 (supports DDA)

  * Windows Server 2019, build 17763 with all current cumulative updates installed
  * Windows Server 2022
  * Windows 11 (Pro, Enterprise, IoT Enterprise)

* NVIDIA GeForce/Quadro (supports GPU-PV)

  * Windows 10 (Pro, Enterprise, IoT Enterprise), minimum build 19044.1263 or later
  * Windows 11 (Pro, Enterprise, IoT Enterprise)

* Select Intel Integrated GPUs (supports GPU-PV)

  * Windows 10 (Pro, Enterprise, IoT Enterprise), minimum build 19044.1263 or later
  * Windows 11 (Pro, Enterprise, IoT Enterprise)

Intel iGPU support is available for select processors. For more information, see the Intel driver documentation.

Windows 10 users must use the [November 2021 update](https://blogs.windows.com/windowsexperience/2021/11/16/how-to-get-the-windows-10-november-2021-update/). After installation, you can verify your build version by running `winver` at the command prompt.

## System setup and installation

The following sections contain information related to setup and installation.

### NVIDIA T4 GPUs

For **T4 GPUs**, Microsoft recommends installing a device mitigation driver from your GPU's vendor. While optional, installing a mitigation driver may improve the security of your deployment. For more information, see [Deploy graphics devices using direct device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda#optional---install-the-partitioning-driver).

> [!WARNING]
> Enabling hardware device passthrough may increase security risks. Microsoft recommends a device mitigation driver from your GPU's vendor, when applicable. For more information, see [Deploy graphics devices using discrete device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda).

### NVIDIA GeForce/Quadro GPUs

For **GeForce/Quadro GPUs**, download and install the [NVIDIA CUDA-enabled driver for Windows Subsystem for Linux (WSL)](https://developer.nvidia.com/cuda/wsl) to use with your existing CUDA ML workflows. Originally developed for WSL, the CUDA for WSL drivers are also used for Azure IoT Edge for Linux on Windows.

Windows 10 users must also [install WSL](/windows/wsl/install) because some of the libraries are shared between WSL and Azure IoT Edge for Linux on Windows. 

### Intel iGPUs

For **Intel iGPUs**, download and install the [Intel Graphics Driver with WSL GPU support](https://www.intel.com/content/www/us/en/download-center/home.html?wapkw=quicklink:download-center).

Windows 10 users must also [install WSL](/windows/wsl/install) because some of the libraries are shared between WSL and Azure IoT Edge for Linux on Windows. 

## Using GPU acceleration for your Linux on Windows deployment

Now you are ready to deploy and run GPU-accelerated Linux modules in your Windows environment through Azure IoT Edge for Linux on Windows. More details on the deployment process can be found in [guide for provisioning a single IoT Edge for Linux on Windows device using symmetric keys](how-to-provision-single-device-linux-on-windows-symmetric.md) or [using X.509 certificates](how-to-provision-single-device-linux-on-windows-x509.md).

## Next steps

* [Create your deployment of Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md)

* Try our [GPU-enabled sample featuring Vision on Edge](https://github.com/Azure-Samples/azure-intelligent-edge-patterns/blob/master/factory-ai-vision/Tutorial/Eflow.md), a solution template illustrating how to build your own vision-based machine learning application.

* Learn more about GPU passthrough technologies by visiting the [DDA documentation](/windows-server/virtualization/hyper-v/plan/plan-for-gpu-acceleration-in-windows-server#discrete-device-assignment-dda) and [GPU-PV blog post](https://devblogs.microsoft.com/directx/directx-heart-linux/#gpu-virtualization).
