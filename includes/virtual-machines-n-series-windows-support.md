---
 title: include file
 description: include file
 services: virtual-machines-windows
 author: cynthn
 ms.service: virtual-machines-windows
 ms.topic: include
 ms.date: 02/11/2019
 ms.author: cynthn
 ms.custom: include file
---

## Supported operating systems and drivers

### NVIDIA Tesla (CUDA) drivers

NVIDIA Tesla (CUDA) drivers for NC, NCv2, NCv3, NCasT4_v3, ND, and NDv2-series VMs (optional for NV-series) are supported only on the operating systems listed in the following table. Driver download links are current at time of publication. For the latest drivers, visit the [NVIDIA](https://www.nvidia.com/) website.

> [!TIP]
> As an alternative to manual CUDA driver installation on a Windows Server VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Windows Server 2016 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.


| OS | Driver |
| -------- |------------- |
| Windows Server 2019 | [451.82](http://us.download.nvidia.com/tesla/451.82/451.82-tesla-desktop-winserver-2019-2016-international.exe) (.exe) |
| Windows Server 2016 | [451.82](http://us.download.nvidia.com/tesla/451.82/451.82-tesla-desktop-winserver-2019-2016-international.exe) (.exe) |

### NVIDIA GRID drivers

Microsoft redistributes NVIDIA GRID driver installers for NV and NVv3-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV-series VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure. You do not need to set up a NVIDIA vGPU software license server.

The GRID drivers redistributed by Azure do not work on non-NV series VMs like NCv2, NCv3, ND, and NDv2-series VMs. The one exception is the NCas_T4_V3 VM series where the GRID drivers will enable the graphics functionalities similar to NV-series.

The NC-Series with Nvidia K80 GPUs do not support GRID/graphics applications.  

Please note that the Nvidia extension will always install the latest driver. We provide links to the previous version here for customers, who have dependency on an older version.

For Windows Server 2019, Windows Server 2016 1607, 1709, and Windows 10(up to build 20H2):
- [GRID 12.2 (462.31)](https://go.microsoft.com/fwlink/?linkid=874181) (.exe)
- [GRID 12.1 (461.33)](https://download.microsoft.com/download/9/7/e/97e1be73-d24b-410b-9c08-cc98c7becfa3/461.33_grid_win10_server2016_server2019_64bit_azure_swl.exe) (.exe) 

For Windows Server 2012 R2: 
- [GRID 12.2 (462.31)](https://download.microsoft.com/download/1/2/0/120551f5-cc05-4911-bd29-88fb2747213c/462.31_grid_server2012R2_64bit_azure_swl.exe) (.exe)
- [GRID 12.1 (461.33)](https://download.microsoft.com/download/9/9/c/99caf5c6-af9f-48b2-bcb0-af5ec64b8592/461.33_grid_server2012R2_64bit_azure_swl.exe) (.exe) 


For the complete list of all previous Nvidia GRID driver links please visit [GitHub](https://github.com/Azure/azhpc-extensions/blob/master/NvidiaGPU/resources.json)
