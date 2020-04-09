---
title: Azure N-series AMD GPU driver setup for Windows 
description: How to set up AMD GPU drivers for N-series VMs running Windows Server or Windows in Azure
services: virtual-machines-windows
author: vikancha
manager: jkabat
editor: ''
tags: azure-resource-manager


ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/4/2019
ms.author: vikancha

---

# Install AMD GPU drivers on N-series VMs running Windows

To take advantage of the GPU capabilities of the new Azure NVv4 series VMs running Windows, AMD GPU drivers must be installed. The AMD driver extension will be available in the coming weeks. This article provides supported operating systems, drivers, and manual installation and verification steps.

For basic specs, storage capacities, and disk details, see [GPU Windows VM sizes](sizes-gpu.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).



## Supported operating systems and drivers

| OS | Driver |
| -------- |------------- |
| Windows 10 EVD - Build 1903 <br/><br/>Windows 10 - Build 1809<br/><br/>Windows Server 2016<br/><br/>Windows Server 2019 | [20.Q1.1](https://download.microsoft.com/download/3/8/9/3893407b-e8aa-4079-8592-735d7dd1c19a/Radeon-Pro-Software-for-Enterprise-GA.exe) (.exe) |


## Driver installation

1. Connect by Remote Desktop to each NVv4-series VM.

2. If you are a NVv4 preview customer then please stop the VM and wait for it to move to Stopped(Deallocated) state.

3. Please start the VM and download the latest [AMD Cleanup Utility](https://download.microsoft.com/download/4/f/1/4f19b714-9304-410f-9c64-826404e07857/AMDCleanupUtilityni.exe). Uninstall the existing driver by running "amdcleanuputility-x64.exe". Please DO NOT use any exisitng cleanup utility that was installed with the previous driver.  

4. Download and install the latest driver.

5. Reboot the VM.

## Verify driver installation

You can verify driver installation in Device Manager. The following example shows successful configuration of the Radeon Instinct MI25 card on an Azure NVv4 VM.
<br />
![GPU driver properties](./media/n-series-amd-driver-setup/device-manager.png)

You can use dxdiag to verify the GPU display properties including the video RAM. The following example shows a 1/8th partition of the Radeon Instinct MI25 card on an Azure NVv4 VM.
<br />
![GPU driver properties](./media/n-series-amd-driver-setup/dxdiag2.png)

If you are running Windows 10 build 1903 or higher then dxdiag will show no information in the 'Display' tab. Please use the 'Save All Information' option at the bottom and the output filw will show the informaiton related to AMD MI25 GPU.

![GPU driver properties](./media/n-series-amd-driver-setup/dxdiag3.PNG)


