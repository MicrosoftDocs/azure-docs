---
title: NP-series - Azure Virtual Machines
description: Specifications for the NP-series VMs.
author: vikancha-MSFT
ms.service: virtual-machines
ms.subservice: vm-sizes-gpu
ms.topic: conceptual
ms.date: 02/09/2021
ms.author: vikancha
---

# NP-series 
The NP-series virtual machines are powered by [Xilinx U250 ](https://www.xilinx.com/products/boards-and-kits/alveo/u250.html) FPGAs for accelerating workloads including machine learning inference, video transcoding, and database search & analytics. NP-series VMs are also powered by Intel Xeon 8171M (Skylake) CPUs with all core turbo clock speed of 3.2 GHz.

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
VM Generation Support: Generation 1<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | FPGA | FPGA memory: GiB | Max data disks | Max NICs/Expected network bandwidth (MBps) | 
|---|---|---|---|---|---|---|---|
| Standard_NP10s | 10 | 168 | 736  | 1 | 64  | 8 | 1 / 7500 | 
| Standard_NP20s | 20 | 336 | 1474 | 2 | 128 | 16 | 2 / 15000 | 
| Standard_NP40s | 40 | 672 | 2948 | 4 | 256 | 32 | 4 / 30000 | 



[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]


##  Frequently asked questions

**Q:** What version of Vitis should I use? 

**A:** Xilinx recommends [Vitis 2020.2](https://www.xilinx.com/products/design-tools/vitis/vitis-platform.html)


**Q:** Do I need to use NP VMs to develop my solution? 

**A:** No, you can develop on-premise and deploy to the cloud! Please make sure to follow the attestation documentation to deploy on NP VMs. 

**Q:** What Version of XRT should I use?

**A:** xrt_202020.2.8.832 

**Q:** What is the target deployment platform?

**A:** Use the following platforms.
- xilinx-u250-gen3x16-xdma-platform-2.1-3_all
- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1 

**Q:** Which platform should I target for development?

**A:** xilinx-u250-gen3x16-xdma-2.1-202010-1-dev_1-2954688_all 

**Q:** What are the supported OS (Operating Systems)? 

**A:** Xilinx and Microsoft have validated Ubuntu 18.04 LTS and CentOS 7.8.

 Xilinx has created the following marketplace images to simplify the deployment of these VMs. 

[Xilinx Alveo U250 Deployment VM – Ubuntu18.04](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/xilinx.xilinx_alveo_u250_deployment_vm_ubuntu1804_032321)

[Xilinx Alveo U250 Deployment VM – CentOS7.8](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/xilinx.xilinx_alveo_u250_deployment_vm_centos78_032321)

**Q:** Can I deploy my Own Ubuntu/CentOS VMs and install XRT/Deployment Target Platform? 

**A:** Yes.

**Q:** If I deploy my own Ubuntu18.04 VM then what are the required packages and steps?

**A:** Use Kernel 4.1X per [Xilinx XRT documentation](https://www.xilinx.com/support/documentation/sw_manuals/xilinx2020_2/ug1451-xrt-release-notes.pdf)
       
Install the following packages.
- xrt_202020.2.8.832_18.04-amd64-xrt.deb
       
- xrt_202020.2.8.832_18.04-amd64-azure.deb
       
- xilinx-u250-gen3x16-xdma-platform-2.1-3_all_18.04.deb.tar.gz
       
- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1_all.deb  

**Q:** On Ubuntu, after rebooting my VM I cannot find my FPGA(s): 

**A:** Please verify that your kernel has not been upgraded (uname -a). If so, please downgrade to  kernel 4.1X. 

**Q:** If I deploy my own CentOS7.8 VM then what are the required packages and steps?

**A:** Use Kernel version: 3.10.0-1160.15.2.el7.x86_64

 Install the following packages.
   
 - xrt_202020.2.8.832_7.4.1708-x86_64-xrt.rpm 
      
 - xrt_202020.2.8.832_7.4.1708-x86_64-azure.rpm 
     
 - xilinx-u250-gen3x16-xdma-platform-2.1-3.noarch.rpm.tar.gz 
      
 - xilinx-u250-gen3x16-xdma-validate-2.1-3005608.1.noarch.rpm  

**Q:** When running xbutil validate on CentOS I get this warning: “WARNING: Kernel version 3.10.0-1160.15.2.el7.x86_64 is not officially supported. 4.18.0-193 is the latest supported version.” 

**A:** This can be safely ignored. 

**Q:** What are the differences between OnPrem and NP VMs regarding XRT? 

**A:** On Azure, XDMA 2.1 platform only supports Host_Mem(SB) and DDR data retention features. 

To enable Host_Mem(SB) (1Gb RAM):  sudo xbutil host_mem --enable --size 1g 

To disable Host_Mem(SB): sudo xbutil host_mem --disable 

**Q:** Can I run xbmgmt commands? 

**A:** No, on Azure VMs there is no management support directly from the Azure VM. 

 **Q:** Do I need to load a PLP? 

**A:** No, the PLP is loaded automatically for you, so there is no need to load via xbmgmt commands. 

 
**Q:** Does Azure support different PLPs? 

**A:** Not at this time. We only support the PLP provided in the deployment platform packages. 

**Q:** How can I query the PLP information? 

**A:** Need to run xbutil query and look at the lower portion. 

**Q:** If I create my own VM and deploy XRT manually, what additional changes do I need to do? 

**A:** In the  /opt/xilinx/xrt/setup.sh add an entry for XRT_INI_PATH  pointing to  /opt/xilinx/xrt/xrt.ini

 
The content of /opt/xilinx/xrt/xrt.ini should contain: <br>
[Runtime]<br>
ert=false <br>

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
