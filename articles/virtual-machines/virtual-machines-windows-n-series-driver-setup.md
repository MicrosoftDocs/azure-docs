---
title: Azure N-series driver setup for Windows | Microsoft Docs
description: How to set up NVIDIA GPU drivers for N-series VMs running Windows in Azure
services: virtual-machines-windows
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f3950c34-9406-48ae-bcd9-c0418607b37d
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 11/30/2016
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Set up GPU drivers for N-series Windows VMs
To take advantage of the GPU capabilities of Azure N-series VMs running Windows Server, you must install NVIDIA graphics drivers on each VM after deployment. This article is also available for [Linux VMs](virtual-machines-linux-n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For basic specs, storage capacities, and disk details, see [Sizes for virtual machines](virtual-machines-windows-sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).




## Supported GPU drivers

Connect by Remote Desktop to each N-series VM. Download, extract, and install the supported driver for your Windows operating system. 

### NVIDIA GRID drivers for NV VMs

* [Windows Server 2016](https://go.microsoft.com/fwlink/?linkid=836843) (.zip)

* [Windows Server 2012 R2](https://go.microsoft.com/fwlink/?linkid=836844) (.zip)

### NVIDIA Tesla drivers for NC VMs

* [Windows Server 2016](https://go.microsoft.com/fwlink/?linkid=836841) (.zip)

* [Windows Server 2012 R2](https://go.microsoft.com/fwlink/?linkid=836842) (.zip)



## Verify driver installation

On Azure NV VMs, a restart is required after driver installation. On NC VMs, a restart is not required.

You can verify driver installation in Device Manager. The following example shows successful configuration of the K80 card on an Azure NC VM.

![GPU driver properties](./media/virtual-machines-windows-n-series-driver-setup/GPU_driver_properties.png)

To query the GPU device state, run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/virtual-machines-windows-n-series-driver-setup/smi.png)  

## Next steps

* For more information about the NVIDIA GPUs on the N-series VMs, see:
    * [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
    * [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)

* Developers building GPU-accelerated applications for the NVIDIA Tesla GPUs can also download and install the [CUDA Toolkit 8](https://developer.nvidia.com/cuda-downloads).


