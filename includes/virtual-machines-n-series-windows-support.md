---
 title: include
 description: include
 services: virtual-machines-windows
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/18/2023
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
> [!Note]
> The Azure NVads A10 v5 VMs only support GRID 14.1(510.73) or higher driver version.
>

Microsoft redistributes NVIDIA GRID driver installers for NV,NVv3 and NVads A10 v5-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV-series VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure. You don't need to set up a NVIDIA vGPU software license server.

The GRID drivers redistributed by Azure don't work on non-NV series VMs like NCv2, NCv3, ND, and NDv2-series VMs. The one exception is the NCas_T4_V3 VM series where the GRID drivers enable the graphics functionalities similar to NV-series.

The NC-Series with Nvidia K80 GPUs don't support GRID/graphics applications.  

The Nvidia extension always installs the latest driver. 

For Windows 11 22H2/21H2, Windows 10 22H2, Server 2019/2022:

- [GRID 16.1 (536.25)](https://go.microsoft.com/fwlink/?linkid=874181) (.exe)

The following links to previous versions are provided to support dependencies on older driver versions.

For Windows 11, Windows 10  and Server 2019/20
- [GRID 15.2 (528.89)](https://download.microsoft.com/download/2/5/a/25ad21ca-ed89-41b4-935f-73023ef6c5af/528.89_grid_win10_win11_server2019_server2022_dch_64bit_international_Azure_swl.exe) (.exe) 

For Windows Server 2016 1607, 1709:
- [GRID 14.1 (512.78)](https://download.microsoft.com/download/7/3/6/7361d1b9-08c8-4571-87aa-18cf671e71a0/512.78_grid_win10_win11_server2016_server2019_server2022_64bit_azure_swl.exe) (.exe)  is the last supported driver from NVIDIA. The newer 15.x and above do not support Windows Server 2016. 

For Windows Server 2012 R2: 
- [GRID 13.1 (472.39)](https://download.microsoft.com/download/7/3/5/735a46dd-7d61-4852-8e34-28bce7f68727/472.39_grid_win8_win7_64bit_Azure-SWL.exe) (.exe)
- [GRID 13 (471.68)](https://download.microsoft.com/download/9/b/4/9b4d4f8d-7962-4a67-839b-37cc95756759/471.68_grid_winserver2012R2_64bit_azure_swl.exe) (.exe)

> [!Note]
> vGPU 15.1/15.2 installer process makes an additional remote call to ngx.download.nvidia.com. This is an unexpected change in behavior and NVIDIA will disable this by default starting with vGPU 15.3 or higher. In the meantime, update the following regkey before installing vGPU 15.1/15.2 driver.
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

