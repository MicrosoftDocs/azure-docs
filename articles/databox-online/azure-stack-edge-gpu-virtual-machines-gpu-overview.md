---
title: GPU virtual machines on Azure Stack Edge Pro with GPU devices
description: Describes how to create and manage GPU virtual machines (VMs) on an Azure Stack Edge Pro GPU device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/09/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand GPU options, capabilities, and the requirements for the OS, GPU driver, and VM size for Azure Stack Edge Pro with GPU devices. And I need to know how to create and manage GPU VMs.
---

# GPU virtual machines on Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article provides an overview of GPU virtual machines (VMs) on your Azure Stack Edge Pro GPU device.


## About GPU VMs

Your Azure Stack Edge devices may be equipped with 1 or 2 of Nvidia's Tesla T4 GPU. To deploy GPU-accelerated VM workloads on these devices, use GPU optimized VM sizes. For example, the NC T4 v3-series should be used to deploy inference workloads featuring T4 GPUs. 

For more information, see [NC T4 v3-series VMs](../virtual-machines/nct4-v3-series.md).

## Supported OS and GPU drivers 

To take advantage of the GPU capabilities of Azure N-series VMs, Nvidia GPU drivers must be installed. 

The Nvidia GPU driver extension installs appropriate Nvidia CUDA or GRID drivers. You can install or manage the extension using the Azure Resource Manager templates.

### Supported OS for GPU extension for Windows

This extension supports the following operating systems (OSs). Other versions may work but have not been tested in-house on GPU VMs running on Azure Stack Edge devices.

| Distribution | Version |
|---|---|
| Windows Server 2019 | Core |
| Windows Server 2016 | Core |

### Supported OS for GPU extension for Linux

This extension supports the following OS distros, depending on the driver support for specific OS version. Other versions may work but have not been tested in-house on GPU VMs running on Azure Stack Edge devices.


| Distribution | Version |
|---|---|
| Ubuntu | 18.04 LTS |
| Red Hat Enterprise Linux | 7.4 |


## GPU VMs and Kubernetes

Before you deploy GPU VMs on your device, review the following considerations if Kubernetes is configured on the device.

#### For 1-GPU device: 

- **Create a GPU VM followed by Kubernetes configuration on your device**: In this scenario, the GPU VM creation and Kubernetes configuration will both be successful. Kubernetes will not have access to the GPU in this case.

- **Configure Kubernetes on your device followed by creation of a GPU VM**: In this scenario, the Kubernetes will claim the GPU on your device and the VM creation will fail as there are no GPU resources available.

#### For 2-GPU device

- **Create a GPU VM followed by Kubernetes configuration on your device**: In this scenario, the GPU VM that you create will claim one GPU on your device and Kubernetes configuration will also be successful and claim the remaining one GPU.	

- **Create two GPU VMs followed by Kubernetes configuration on your device**: In this scenario, the two GPU VMs will claim the two GPUs on the device and the Kubernetes is configured successfully with no GPUs. 

- **Configure Kubernetes on your device followed by creation of a GPU VM**: In this scenario, the Kubernetes will claim both the GPUs on your device and the VM creation will fail as no GPU resources are available.

<!--Li indicated that this is fixed. If you have GPU VMs running on your device and Kubernetes is also configured, then anytime the VM is deallocated (when you stop or remove a VM using Stop-AzureRmVM or Remove-AzureRmVM), there is a risk that the Kubernetes cluster will claim all the GPUs available on the device. In such an instance, you will not be able to restart the GPU VMs deployed on your device or create GPU VMs. -->

## Next steps

- Review the [Azure Stack Edge Pro GPU system requirements](azure-stack-edge-gpu-system-requirements.md).

- Understand the [Azure Stack Edge Pro GPU limits](azure-stack-edge-limits.md).
- Deploy [Azure Stack Edge Pro GPU](azure-stack-edge-gpu-deploy-prep.md) in Azure portal.
