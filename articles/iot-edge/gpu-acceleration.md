---
title: GPU acceleration for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure your Azure IoT Edge for Linux on Windows virtual machines to use host device GPUs.
author: v-tcassi
manager: kgremban
ms.author: v-tcassi
ms.date: 06/22/2021
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
monikerRange: "=iotedge-2018-06"
---

# GPU acceleration for Azure IoT Edge for Linux on Windows (Preview)

GPUs are a popular choice for artificial intelligence computations, because they offer parallel processing capabilities and can often execute vision-based inferencing faster than CPUs. To better support artificial intelligence and machine learning applications, Azure IoT Edge for Linux on Windows can expose a GPU to the virtual machine's Linux module.

> [!NOTE]
> The GPU acceleration features detailed below are in preview and are subject to change.

Azure IoT Edge for Linux on Windows supports several GPU passthrough technologies, including:

* **Direct Device Assignment (DDA)** - GPU cores are allocated either to the Linux virtual machine or the host.

* **GPU-Paravirtualization (GPU-PV)** - The GPU is shared between the Linux virtual machine and the host.

The Azure IoT Edge for Linux on Windows deployment will automatically select the appropriate passthrough method to match the supported capabilities of your device's GPU hardware.

> [!IMPORTANT]
> These features may include components developed and owned by NVIDIA Corporation or its licensors. The use of the components is governed by the NVIDIA End-User License Agreement located [on NVIDIA's website](https://www.nvidia.com/content/DriverDownload-March2009/licence.php?lang=us).
>
> By using GPU acceleration features, you are accepting and agreeing to the terms of the NVIDIA End-User License Agreement.

## Prerequisites

The GPU acceleration features of Azure IoT Edge for Linux on Windows currently supports a select set of GPU hardware. Additionally, use of this feature may require the latest Windows Insider Dev Channel build, depending on your configuration.

The supported GPUs and required Windows versions are listed below:

* NVIDIA T4 (supports DDA)

  * Windows Server, build 17763 or higher
  * Windows Enterprise or Professional, build 21318 or higher (Windows Insider build)

* NVIDIA GeForce/Quadro (supports GPU-PV)

  * Windows Enterprise or Professional, build 20145 or higher (Windows Insider build)

### Windows Insider builds

For Windows Enterprise or Professional users, you will need to [register for the Windows Insider Program](https://insider.windows.com/getting-started#register).

Once you register, follow the instructions on the **2. Flight** tab to get access to the appropriate Windows Insider build. When selecting the channel you wish to use, select the [dev channel](/windows-insider/flight-hub/#active-development-builds-of-windows-10). After installation, you can verify your build version number by running `winver` via command prompt.

### T4 GPUs

For **T4 GPUs**, Microsoft recommends installing a device mitigation driver from your GPU's vendor. While optional, installing a mitigation driver may improve the security of your deployment. For more information, see [Deploy graphics devices using direct device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda#optional---install-the-partitioning-driver).

> [!WARNING]
> Enabling hardware device passthrough may increase security risks. We recommend that you install a device mitigation driver from your GPU's vendor.

### GeForce/Quadro GPUs

For **GeForce/Quadro GPUs**, download and install the [NVIDIA CUDA-enabled driver for Windows Subsystem for Linux (WSL)](https://developer.nvidia.com/cuda/wsl) to use with your existing CUDA ML workflows. Originally developed for WSL, the CUDA for WSL drivers are also used for Azure IoT Edge for Linux on Windows.

## Using GPU acceleration for your Linux on Windows deployment

Now you are ready to deploy and run GPU-accelerated Linux modules in your Windows environment through Azure IoT Edge for Linux on Windows. More details on the deployment process can be found in [Install Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md).

## Next steps

* [Create your deployment of Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md)

* Try our [GPU-enabled sample featuring Vision on Edge](https://github.com/Azure-Samples/azure-intelligent-edge-patterns/blob/master/factory-ai-vision/Tutorial/Eflow.md), a solution template illustrating how to build your own vision-based machine learning application.

* Learn more about GPU passthrough technologies by visiting the [DDA documentation](/windows-server/virtualization/hyper-v/plan/plan-for-gpu-acceleration-in-windows-server#discrete-device-assignment-dda) and [GPU-PV blog post](https://devblogs.microsoft.com/directx/directx-heart-linux/#gpu-virtualization).
