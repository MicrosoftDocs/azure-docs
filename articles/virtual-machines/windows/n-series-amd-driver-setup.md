---
title: Azure N-series AMD GPU driver setup for Windows 
description: How to set up AMD GPU drivers for N-series VMs running Windows Server or Windows in Azure
author: vikancha-MSFT
manager: jkabat
ms.service: virtual-machines-windows
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 12/4/2019
ms.author: vikancha

---

# Install AMD GPU drivers on N-series VMs running Windows

To take advantage of the GPU capabilities of the new Azure NVv4 series VMs running Windows, AMD GPU drivers must be installed. The [AMD GPU Driver Extension](../extensions/hpccompute-amd-gpu-windows.md) installs AMD GPU drivers on a NVv4-series VM. Install or manage the extension using the Azure portal or tools such as Azure PowerShell or Azure Resource Manager templates. See the [AMD GPU Driver Extension documentation](../extensions/hpccompute-amd-gpu-windows.md) for supported operating systems and deployment steps.

If you choose to install AMD GPU drivers manually, this article provides supported operating systems, drivers, and installation and verification steps.

Only GPU drivers published by Microsoft are supported on NVv4 VMs. Please DO NOT install GPU drivers from any other source.

For basic specs, storage capacities, and disk details, see [GPU Windows VM sizes](../sizes-gpu.md?toc=/azure/virtual-machines/windows/toc.json).



## Supported operating systems and drivers

| OS | Driver |
| -------- |------------- |
| Windows 10 Enterprise multi-session - Build 1903 <br/><br/>Windows 10 - Build 1809<br/><br/>Windows Server 2016<br/><br/>Windows Server 2019 | [20.Q1.Hotfix](https://download.microsoft.com/download/d/e/f/def0fb44-15ab-4b83-959a-8094eb9d0dfe/AMD-Azure-NVv4-Driver-20Q1-Hotfix3.exe) (.exe) |


## Driver installation

1. Connect by Remote Desktop to each NVv4-series VM.

2. If you need to uninstall the previous driver version then download the AMD cleanup utility [here](https://download.microsoft.com/download/4/f/1/4f19b714-9304-410f-9c64-826404e07857/AMDCleanupUtilityni.exe) Please do not use the utility that comes with the previous version of the driver.

3. Download and install the latest driver.

4. Reboot the VM.

## Verify driver installation

You can verify driver installation in Device Manager. The following example shows successful configuration of the Radeon Instinct MI25 card on an Azure NVv4 VM.
<br />
![GPU driver properties](./media/n-series-amd-driver-setup/device-manager.png)

You can use dxdiag to verify the GPU display properties including the video RAM. The following example shows a 1/2 partition of the Radeon Instinct MI25 card on an Azure NVv4 VM.
<br />
![GPU driver properties](./media/n-series-amd-driver-setup/dxdiag-output-new.png)

If you are running Windows 10 build 1903 or higher then dxdiag will show no information in the 'Display' tab. Please use the 'Save All Information' option at the bottom and the output file will show the information related to AMD MI25 GPU.

![GPU driver properties](./media/n-series-amd-driver-setup/dxdiag-details.png)
