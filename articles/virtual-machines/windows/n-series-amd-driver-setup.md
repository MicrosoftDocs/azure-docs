# Install AMD GPU drivers on N-series VMs running Windows 

To take advantage of the GPU capabilities of the new Azure NVv4 series VMs running Windows, AMD GPU drivers must be installed. The AMD driver extension will be available in the coming weeks. This article provides supported operating systems, drivers, and manual installation and verification steps.

For basic specs, storage capacities, and disk details, see [GPU Windows VM sizes](sizes-gpu.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

[!INCLUDE [virtual-machines-n-series-windows-support](../../../includes/virtual-machines-n-series-windows-support.md)]

## Supported operating systems and drivers
| OS | Driver |
| -------- |------------- |
| Windows 10 EVD - Build 1903 <br/><br/>Windows 10 - Build 1809<br/><br/>Windows Server 2016<br/><br/>Windows Server 2019 | [26.20.13024.5](http://download.microsoft.com/download/f/c/b/fcbcbccd-3d38-4d2c-94ff-a109732d1db0/AMD_Radeon_Preview_Win.zip) (.zip) |



## Driver installation

1. Connect by Remote Desktop to each NVv4-series VM.

2. Download, extract, and install the supported driver for your Windows operating system.

## Verify driver installation
You can verify driver installation in Device Manager. The following example shows successful configuration of the Radeon Instinct MI25 card on an Azure NVv4 VM.
![GPU driver properties](./media/n-series-amd-driver-setup/GPU_driver_properties.png)
