---
title: Overview of GPU VMs on your Azure Stack Edge Pro GPU device
description: Describes use of virtual machines optimized for GPU-accelerated workloads on Azure Stack Edge Pro with GPU.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 07/05/2022
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to deploy and manage GPU-accelerated VM workloads on my Azure Stack Edge Pro GPU devices.
---

# GPU virtual machines for Azure Stack Edge Pro GPU devices

[!INCLUDE [applies-to-gpu-pro2-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-pro-2-pro-r-sku.md)]

GPU-accelerated workloads on an Azure Stack Edge Pro GPU device require a GPU virtual machine. This article provides an overview of GPU VMs, including supported OSs, GPU drivers, and VM sizes. Deployment options for GPU VMs used with Kubernetes clusters also are discussed.

## About GPU VMs

Your Azure Stack Edge devices may be equipped with 1 or 2 of Nvidia's Tesla T4 or Tensor Core A2 GPU. To deploy GPU-accelerated VM workloads on these devices, use GPU-optimized VM sizes. The GPU VM chosen should match with the make of the GPU on your Azure Stack Edge device. For more information, see [Supported N series GPU optimized VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#n-series-gpu-optimized).

To take advantage of the GPU capabilities of Azure N-series VMs, Nvidia GPU drivers must be installed. The Nvidia GPU driver extension installs appropriate Nvidia CUDA or GRID drivers. You can [install the GPU extensions using templates or via the Azure portal](#gpu-vm-deployment).

You can [install and manage the extension using the Azure Resource Manager templates](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md) after VM deployment. In the Azure portal, you can install the GPU extension during or after you deploy a VM; for instructions, see [Deploy GPU VMs on your Azure Stack Edge device](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md).

If your device will have a Kubernetes cluster configured, be sure to review [deployment considerations for Kubernetes clusters](#gpu-vms-and-kubernetes) before you deploy GPU VMs.

## Supported OS and GPU drivers 

The Nvidia GPU driver extensions for Windows and Linux support the following OS versions.

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

## GPU VM deployment

You can deploy a GPU VM via the Azure portal or using Azure Resource Manager templates. The GPU extension is installed after VM creation.<!--Wording still needs work!-->

- **Portal:** In the Azure portal, you can quickly [install the GPU extension when you create a VM](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#create-gpu-vms) or [after VM deployment]().<!--Can they remove the GPU extension. Tomorrow, create a new GPU VM to test.-->

- **Templates:** Using Azure Resource Manager templates, [you create a VM](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md#install-gpu-extension-after-deployment) and then [install the GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md).


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
- Learn how to [Deploy GPU VMs](azure-stack-edge-gpu-deploy-gpu-virtual-machine.md).
- Learn how to [Install GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md) on the GPU VMs running on your device.
