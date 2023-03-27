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

Microsoft redistributes NVIDIA GRID driver installers for NV and NVv3-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV-series VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure. You don't need to set up a NVIDIA vGPU software license server.

The GRID drivers redistributed by Azure don't work on non-NV series VMs like NCv2, NCv3, ND, and NDv2-series VMs. The one exception is the NCas_T4_V3 VM series where the GRID drivers enable the graphics functionalities similar to NV-series.

The NC-Series with Nvidia K80 GPUs don't support GRID/graphics applications.  

The Nvidia extension always installs the latest driver. The following links to previous versions are provided to support dependencies on older driver versions.

For Windows Server 2022, Windows Server 2019, Windows 11 21H2 and Windows 10 release up to 22H2:
- [GRID 14.1 (512.78)](https://go.microsoft.com/fwlink/?linkid=874181) (.exe)
- [GRID 15.1 (528.24)](https://download.microsoft.com/download/f/a/f/fafa2972-4975-482e-99e6-442d5ad864a1/528.24_grid_win10_win11_server2019_server2022_dch_64bit_international-Azure-swl.exe) (.exe) 

For Windows Server 2012 R2: 
- [GRID 13.1 (472.39)](https://download.microsoft.com/download/7/3/5/735a46dd-7d61-4852-8e34-28bce7f68727/472.39_grid_win8_win7_64bit_Azure-SWL.exe) (.exe)
- [GRID 13 (471.68)](https://download.microsoft.com/download/9/b/4/9b4d4f8d-7962-4a67-839b-37cc95756759/471.68_grid_winserver2012R2_64bit_azure_swl.exe) (.exe)

> [!Note]
> vGPU 15.1 installer process makes an additional remote call to ngx.download.nvidia.com. This is an unexpected change in behavior and NVIDIA will disable this by default starting with vGPU 15.3. In the meantime, update the following regkey before installing vGPU 15.1 driver.
> >
> To disable the remote call to ngx. 
>
>
>[HKEY_LOCAL_MACHINE\SOFTWARE\NVIDIA Corporation\Global\NGXCore]
>
>"EnableOTA"=dword:00000000
>
>To enable the remote call again, change the setting to 1 or simply delete the regkey.




For links to all previous Nvidia GRID driver versions, visit [GitHub](https://github.com/Azure/azhpc-extensions/blob/master/NvidiaGPU/resources.json).

