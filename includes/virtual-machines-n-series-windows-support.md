---
 title: include file
 description: include file
 services: virtual-machines-windows
 author: dlepow
 ms.service: virtual-machines-windows
 ms.topic: include
 ms.date: 09/24/2018
 ms.author: danlep
 ms.custom: include file
---

## Supported operating systems and drivers

### NVIDIA Tesla (CUDA) drivers

NVIDIA Tesla (CUDA) drivers for NC, NCv2, NCv3, and ND-series VMs (optional for NV-series) are supported only on the operating systems listed in the following table. Driver download links are current at time of publication. For the latest drivers, visit the [NVIDIA](http://www.nvidia.com/) website.

> [!TIP]
> As an alternative to manual CUDA driver installation on a Windows Server VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Windows Server 2016 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.


| OS | Driver |
| -------- |------------- |
| Windows Server 2016 | [398.75](http://us.download.nvidia.com/Windows/Quadro_Certified/398.75/398.75-tesla-desktop-winserver2016-international.exe) (.exe) |
| Windows Server 2012 R2 | [398.75](http://us.download.nvidia.com/Windows/Quadro_Certified/398.75/398.75-tesla-desktop-winserver2008-2012r2-64bit-international.exe) (.exe) |


### NVIDIA GRID drivers

Microsoft redistributes NVIDIA GRID driver installers for NV amd NVv2-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure.

| OS | Driver |
| -------- |------------- |
| Windows Server 2016<br/><br/>Windows 10 | [GRID 6.2 (391.81)](https://go.microsoft.com/fwlink/?linkid=874181) (.exe) |
| Windows Server 2012 R2 | [GRID 6.2 (391.81)](https://go.microsoft.com/fwlink/?linkid=874184) (.exe)  |