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
ms.date: 04/03/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---
# Set up GPU drivers for N-series VMs running Windows Server
To take advantage of the GPU capabilities of Azure N-series VMs running Windows Server 2016 or Windows Server 2012 R2, you must install NVIDIA graphics drivers on each VM after deployment. Driver setup information is also available for [Linux VMs](../linux/n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

For basic specs, storage capacities, and disk details, see [Sizes for virtual machines](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). See also [General considerations for N-series VMs](#general-considerations-for-n-series-vms).



## Supported GPU drivers

Connect by Remote Desktop to each N-series VM. Download, extract, and install the supported driver for your Windows operating system. 

### NVIDIA Tesla drivers for NC VMs (Tesla K80)



| OS | Driver version |
| -------- |------------- |
| Windows Server 2016 | [376.84](http://us.download.nvidia.com/Windows/Quadro_Certified/376.84/376.84-tesla-desktop-winserver2016-international-whql.exe) (.exe) |
| Windows Server 2012 R2 | [376.84](http://us.download.nvidia.com/Windows/Quadro_Certified/376.84/376.84-tesla-desktop-winserver2008-2012r2-64bit-international-whql.exe) (.exe) |

> [!NOTE]
> Tesla driver download links provided here are current at time of publication. For the latest drivers, visit the [NVIDIA](http://www.nvidia.com/) website.
>

### NVIDIA GRID drivers for NV VMs (Tesla M60)

| OS | Driver version |
| -------- |------------- |
| Windows Server 2016 | [369.95](https://go.microsoft.com/fwlink/?linkid=836843) (.zip) |
| Windows Server 2012 R2 | [369.95](https://go.microsoft.com/fwlink/?linkid=836844) (.zip)  |



## Verify GPU driver installation

On Azure NV VMs, a restart is required after driver installation. On NC VMs, a restart is not required.

You can verify driver installation in Device Manager. The following example shows successful configuration of the Tesla K80 card on an Azure NC VM.

![GPU driver properties](./media/n-series-driver-setup/GPU_driver_properties.png)

To query the GPU device state, run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/n-series-driver-setup/smi.png)  

## RDMA network for NC24r VMs

RDMA network connectivity can be enabled on NC24r VMs deployed in the same availability set. The HpcVmDrivers extension must be added to install Windows network device drivers that enable RDMA connectivity. To add the VM extension to an NC24r VM, use [Azure PowerShell](/powershell/azure/overview) cmdlets for Azure Resource Manager.

> [!NOTE]
> Currently, only Windows Server 2012 R2 supports the RDMA network on NC24r VMs.
> 

To install the latest version 1.1 HpcVMDrivers extension on an existing RDMA-capable VM named myVM in the West US region:
  ```PowerShell
  Set-AzureRmVMExtension -ResourceGroupName "myResourceGroup" -Location "westus" -VMName "myVM" -ExtensionName "HpcVmDrivers" -Publisher "Microsoft.HpcCompute" -Type "HpcVmDrivers" -TypeHandlerVersion "1.1"
  ```
  For more information, see [Virtual machine extensions and features for Windows](extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

The RDMA network supports Message Passing Interface (MPI) traffic for applications running with [Microsoft MPI](https://msdn.microsoft.com/library/bb524831(v=vs.85).aspx) or Intel MPI 5.x. 

[!INCLUDE [virtual-machines-n-series-considerations](../../../includes/virtual-machines-n-series-considerations.md)]

## Next steps

* For more information about the NVIDIA GPUs on the N-series VMs, see:
    * [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
    * [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)

* Developers building GPU-accelerated applications for the NVIDIA Tesla GPUs can also download and install the CUDA Toolkit 8 for [Windows Server 2016](https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda_8.0.61_win10-exe) or [Windows Server 2012 R2](https://developer.nvidia.com/compute/cuda/8.0/Prod2/local_installers/cuda_8.0.61_windows-exe). For more information, see the [CUDA Installation Guide](http://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/index.html#axzz4ZcwJvqYi).


