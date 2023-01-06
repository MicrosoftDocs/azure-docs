---
 title: include
 description: include
 services: virtual-machines-windows
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/11/2019
 ms.author: cynthn
 ms.custom: include
---

## Supported operating systems and drivers

### NVIDIA Tesla (CUDA) drivers

NVIDIA Tesla (CUDA) drivers for NC, NCv2, NCv3, NCasT4_v3, ND, and NDv2-series VMs (optional for NV-series) are tested on the operating systems listed in the following table. CUDA driver is generic and not Azure specific. For the latest drivers, visit the [NVIDIA](https://www.nvidia.com/) website.

> [!TIP]
> As an alternative to manual CUDA driver installation on a Windows Server VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Windows Server 2016 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.


| OS | Driver |
| -------- |------------- |
| Windows Server 2019 | [451.82](https://us.download.nvidia.com/tesla/451.82/451.82-tesla-desktop-winserver-2019-2016-international.exe) (.exe) |
| Windows Server 2016 | [451.82](https://us.download.nvidia.com/tesla/451.82/451.82-tesla-desktop-winserver-2019-2016-international.exe) (.exe) |

### NVIDIA GRID drivers

Microsoft redistributes NVIDIA GRID driver installers for NV and NVv3-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV-series VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure. You do not need to set up a NVIDIA vGPU software license server.

The GRID drivers redistributed by Azure do not work on non-NV series VMs like NCv2, NCv3, ND, and NDv2-series VMs. The one exception is the NCas_T4_V3 VM series where the GRID drivers will enable the graphics functionalities similar to NV-series.

The NC-Series with Nvidia K80 GPUs do not support GRID/graphics applications.  

The Nvidia extension always installs the latest driver. The following links to previous versions are provided to support dependencies on older driver versions.

For Windows Server 2022, Windows Server 2019, Windows Server 2016 1607, 1709,  Windows 10 and Windows 11:
- [GRID 14.1 (512.78)](https://go.microsoft.com/fwlink/?linkid=874181) (.exe)
- [GRID 13.1 (472.39)](https://download.microsoft.com/download/3/2/2/322f99aa-57f3-4539-b5fc-718f8c0e2579/472.39_grid_win11_win10_64bit_Azure-SWL.exe) (.exe) 

For Windows Server 2012 R2: 
- [GRID 13.1 (472.39)](https://download.microsoft.com/download/7/3/5/735a46dd-7d61-4852-8e34-28bce7f68727/472.39_grid_win8_win7_64bit_Azure-SWL.exe) (.exe)
- [GRID 13 (471.68)](https://download.microsoft.com/download/9/b/4/9b4d4f8d-7962-4a67-839b-37cc95756759/471.68_grid_winserver2012R2_64bit_azure_swl.exe) (.exe)

> [!Note]
>The Azure NVads A10 v5 VMs only support GRID 14.1(512.78) or higher driver versions. 


For links to all previous Nvidia GRID driver versions, visit [GitHub](https://github.com/Azure/azhpc-extensions/blob/master/NvidiaGPU/resources.json).

