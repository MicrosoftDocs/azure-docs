---
 title: include file
 description: include file
 services: virtual-machines-windows
 author: dlepow
 ms.service: virtual-machines-windows
 ms.topic: include
 ms.date: 03/20/2018
 ms.author: danlep
 ms.custom: include file
---

## Supported operating systems and drivers

### NC, NCv2, NCv3 and ND-series - NVIDIA Tesla (CUDA) drivers

| OS | Driver |
| -------- |------------- |
| Windows Server 2016 | [390.85](http://us.download.nvidia.com/Windows/Quadro_Certified/390.85/390.85-tesla-desktop-winserver2016-international.exe) (.exe) |
| Windows Server 2012 R2 | [390.85](http://us.download.nvidia.com/Windows/Quadro_Certified/390.85/390.85-tesla-desktop-winserver2008-2012r2-64bit-international.exe) (.exe) |

> [!NOTE]
> Tesla driver download links are current at time of publication. For the latest drivers, visit the [NVIDIA](http://www.nvidia.com/) website.
>

As an alternative to manual CUDA driver installation on a Windows Server VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Windows Server 2016 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.


### NV-series - NVIDIA GRID drivers

| OS | Driver |
| -------- |------------- |
| Windows Server 2016 | [GRID 5.2 (386.09)](https://go.microsoft.com/fwlink/?linkid=836843) (.exe) |
| Windows Server 2012 R2 | [GRID 5.2 (386.09)](https://go.microsoft.com/fwlink/?linkid=836844) (.exe)  |

> [!NOTE]
> Microsoft redistributes NVIDIA GRID driver installers for NV VMs. Install only these GRID drivers on Azure NV VMs. These drivers include licensing for GRID Virtual GPU Software in Azure.
>