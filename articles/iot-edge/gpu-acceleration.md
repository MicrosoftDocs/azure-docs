---
title: GPU acceleration for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure your Azure IoT Edge for Linux on Windows virtual machines to use host device GPUs.
author: PatAltimore
ms.author: patricka
ms.date: 6/7/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# GPU acceleration for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

GPUs are a popular choice for artificial intelligence computations, because they offer parallel processing capabilities and can often execute vision-based inferencing faster than CPUs. To better support artificial intelligence and machine learning applications, Azure IoT Edge for Linux on Windows (EFLOW) can expose a GPU to the virtual machine's Linux module.

Azure IoT Edge for Linux on Windows supports several GPU passthrough technologies, including:

* **Direct Device Assignment (DDA)** - GPU cores are allocated either to the Linux virtual machine or the host.

* **GPU-Paravirtualization (GPU-PV)** - The GPU is shared between the Linux virtual machine and the host.

You must select the appropriate passthrough method during deployment to match the supported capabilities of your device's GPU hardware.

> [!IMPORTANT]
> These features may include components developed and owned by NVIDIA Corporation or its licensors. The use of the components is governed by the NVIDIA End-User License Agreement located [on NVIDIA's website](https://www.nvidia.com/content/DriverDownload-March2009/licence.php?lang=us).
>
> By using GPU acceleration features, you are accepting and agreeing to the terms of the NVIDIA End-User License Agreement.

## Prerequisites

The GPU acceleration features of Azure IoT Edge for Linux on Windows currently supports a select set of GPU hardware. Additionally, use of this feature may require specific versions of Windows.

The supported GPUs and required Windows versions are listed below:

| Supported GPUs | GPU Passthrough Type | Supported Windows Versions |
| --------- | --------------- | -------- |
| NVIDIA T4, A2 | DDA |  Windows Server 2019 <br> Windows Server 2022 <br> Windows 10/11 (Pro, Enterprise, IoT Enterprise) |
| NVIDIA GeForce, Quadro, RTX | GPU-PV | Windows 10/11 (Pro, Enterprise, IoT Enterprise) |
| Intel iGPU | GPU-PV | Windows 10/11 (Pro, Enterprise, IoT Enterprise) |

> [!IMPORTANT]
>GPU-PV support may be limited to certain generations of processors or GPU architectures as determined by the GPU vendor. For more information, see [Intel's iGPU driver documentation](https://www.intel.com/content/www/us/en/download/19344/intel-graphics-windows-dch-drivers.html) or [NVIDIA's CUDA for WSL Documentation](https://docs.nvidia.com/cuda/wsl-user-guide/index.html#wsl2-system-requirements).
>
>Windows Server 2019 users must use minimum build 17763 with all current cumulative updates installed.
>
>Windows 10 users must use the [November 2021 update](https://blogs.windows.com/windowsexperience/2021/11/16/how-to-get-the-windows-10-november-2021-update/) build 19044.1620 or higher. After installation, you can verify your build version by running `winver` at the command prompt.
>
> GPU passthrough is not supported with nested virtualization, such as running EFLOW in a Windows virtual machine.


## System setup and installation

The following sections contain setup and installation information, according to your GPU.

### NVIDIA T4/A2 GPUs

For **T4/A2 GPUs**, Microsoft recommends installing a device mitigation driver from your GPU's vendor. While optional, installing a mitigation driver may improve the security of your deployment. For more information, see [Deploy graphics devices using direct device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda#optional---install-the-partitioning-driver).

> [!WARNING]
> Enabling hardware device passthrough may increase security risks. Microsoft recommends a device mitigation driver from your GPU's vendor, when applicable. For more information, see [Deploy graphics devices using discrete device assignment](/windows-server/virtualization/hyper-v/deploy/deploying-graphics-devices-using-dda).

### NVIDIA GeForce/Quadro/RTX GPUs

For **NVIDIA GeForce/Quadro/RTX GPUs**, download and install the [NVIDIA CUDA-enabled driver for Windows Subsystem for Linux (WSL)](https://developer.nvidia.com/cuda/wsl) to use with your existing CUDA ML workflows. Originally developed for WSL, the CUDA for WSL drivers are also used for Azure IoT Edge for Linux on Windows.

Windows 10 users must also [install WSL](/windows/wsl/install) because some of the libraries are shared between WSL and Azure IoT Edge for Linux on Windows. 

### Intel iGPUs

For **Intel iGPUs**, download and install the [Intel Graphics Driver with WSL GPU support](https://www.intel.com/content/www/us/en/download/19344/intel-graphics-windows-dch-drivers.html).

Windows 10 users must also [install WSL](/windows/wsl/install) because some of the libraries are shared between WSL and Azure IoT Edge for Linux on Windows. 

## Enable GPU acceleration in your Azure IoT Edge Linux on Windows deployment
Once system setup is complete, you are ready to [create your deployment of Azure IoT Edge for Linux on Windows](how-to-install-iot-edge-on-windows.md). During this process, you must [enable GPU](reference-iot-edge-for-linux-on-windows-functions.md#deploy-eflow) as part of EFLOW deployment.

For example, the following commands create a GPU-enabled virtual machine with either an NVIDIA A2 GPU or Intel Iris Xe Graphics card.

```powershell
#Deploys EFLOW with NVIDIA A2 assigned to the EFLOW VM
Deploy-Eflow -gpuPassthroughType DirectDeviceAssignment -gpuCount 1 -gpuName "NVIDIA A2"

#Deploys EFLOW with Intel(R) Iris(R) Xe Graphics assigned to the EFLOW VM
Deploy-Eflow -gpuPassthroughType ParaVirtualization -gpuCount 1 -gpuName "Intel(R) Iris(R) Xe Graphics"
```

To find the name of your GPU, you can run the following command or look for Display adapters in Device Manager.
```powershell
(Get-WmiObject win32_VideoController).caption
```

Once installation is complete, you are ready to deploy and run GPU-accelerated Linux modules through Azure IoT Edge for Linux on Windows. 

## Configure GPU acceleration in an existing Azure IoT Edge Linux on Windows deployment
Assigning the GPU at deployment time will result in the most straightforward experience. However, to enable or disable the GPU after deployment use the 'set-eflowvm' command. When using 'set-eflowvm' the default parameter will be used for any argument not specified. For example,

```powershell
#Deploys EFLOW without a GPU assigned to the EFLOW VM
Deploy-Eflow -cpuCount 4 -memoryInMB 16384

#Assigns NVIDIA A2 GPU to the existing deployment (cpu and memory must still be specified, otherwise they will be set to the default values)
Set-EflowVM -cpuCount 4 -memoryInMB 16384 -gpuName "NVIDIA A2" -gpuPassthroughType DirectDeviceAssignment -gpuCount 1

#Reduces the cpuCount and memory (GPU must still be specified, otherwise the GPU will be removed)
Set-EflowVM -cpuCount 2 -memoryInMB 4096 -gpuName "NVIDIA A2" -gpuPassthroughType DirectDeviceAssignment -gpuCount 1

#Removes NVIDIA A2 GPU from the existing deployment
Set-EflowVM -cpuCount 2 -memoryInMB 4096
```

## Next steps

### Get Started with Samples
Visit our [EFLOW Samples Page](https://github.com/Azure/iotedge-eflow/tree/main/samples) to discover several GPU samples which you can try and use. These samples illustrate common manufacturing and retail scenarios such as defect detection, worker safety, and inventory management. Thee open-source samples can serve as a solution template for building your own vision-based machine learning application.

### Learn More from our Partners
Several GPU vendors have provided user guides on getting the most of their hardware and software with EFLOW.
* Learn how to run Intel OpenVINO™ applications on EFLOW by following [Intel's guide on iGPU with Azure IoT Edge for Linux on Windows (EFLOW) & OpenVINO™ Toolkit](https://community.intel.com/t5/Blogs/Tech-Innovation/Artificial-Intelligence-AI/Witness-the-power-of-Intel-iGPU-with-Azure-IoT-Edge-for-Linux-on/post/1382405) and [reference implementations](https://www.intel.com/content/www/us/en/developer/articles/technical/deploy-reference-implementation-to-azure-iot-eflow.html).
* Get started with deploying CUDA-accelerated applications on EFLOW by following [NVIDIA's EFLOW User Guide for GeForce/Quadro/RTX GPUs](https://docs.nvidia.com/cuda/eflow-users-guide/index.html). 

> [!NOTE]
> This guide does not cover DDA-based GPUs such as NVIDIA T4 or A2. 

### Dive into the Technology 
Learn more about GPU passthrough technologies by visiting the [DDA documentation](/windows-server/virtualization/hyper-v/plan/plan-for-gpu-acceleration-in-windows-server#discrete-device-assignment-dda) and [GPU-PV blog post](https://devblogs.microsoft.com/directx/directx-heart-linux/#gpu-virtualization).
