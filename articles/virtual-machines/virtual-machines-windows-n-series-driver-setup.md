---
title: N-series driver setup for Windows | Microsoft Docs
description: How to set up NVIDIA GPU drivers for N-series VMs in Azure
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager,azure-service-management

ms.assetid: f3950c34-9406-48ae-bcd9-c0418607b37d
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/23/2016
ms.author: danlep

---
# Set up GPU drivers for N-series VMs
To take advantage of the GPU capabilities of Azure N-series VMs running Windows Server, you must install NVIDIA drivers on each VM after deployment. This article provides basic setup instructions. This article is also available for [Linux VMs](virtual-machines-linux-n-series-driver-setup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For basic specs, storage capacities, and disk details, see [Sizes for virtual machines](virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For more information about the NVIDIA GPUs on the N-series VMs, see:
* [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
* [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)


## Supported GPU drivers

Connect to each N-series VM by RDP. Download and install the latest Tesla driver for your Windows operating system on each VM. 

| Operating system | Driver download |
| --- | --- | 
| Windows Server 2016 | [Version 369.73](http://www.nvidia.com/download/driverResults.aspx/111406/) |
| Windows Server 2012 R2 | [Version 369.73](http://www.nvidia.com/download/driverResults.aspx/111404/) |




Browse additional drivers at [NVIDIA driver downloads](http://www.nvidia.com/Download/index.aspx?).

> [!NOTE]
> Developers building GPU-accelerated applications for the NVIDIA Tesla GPUs can download and install the [CUDA Toolkit 8](https://developer.nvidia.com/cuda-downloads).
>

## Verify driver installation

On Azure NV VMs, a restart is required after driver installation. On NC VMs, a restart is not required.

You can verify driver installation in Device Manager. The following screenshot shows successful configuration of the K80 card on an Azure NC VM.

![GPU driver properties](./media/virtual-machines-windows-n-series-driver-setup/GPU_driver_properties.png)

To query the GPU device state, run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/virtual-machines-windows-n-series-driver-setup/smi.png)  


## RDMA network setup for NC24r VMs

## Next steps


