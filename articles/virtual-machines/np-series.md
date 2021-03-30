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

# NP-series (Preview) 
The NP-series virtual machines are powered by [Xilinx U250 ](https://www.xilinx.com/products/boards-and-kits/alveo/u250.html) FPGAs for accelerating workloads including machine learning inference, video transcoding, and database search & analytics. NP-series VMs are also powered by Intel Xeon 8171M (Skylake) CPUs with all core turbo clock speed of 3.2 GHz.

Submit a request using the [preview form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR9x_QCQkJXxHl4qOI4jC9YtUOVI0VkgwVjhaTFFQMTVBTDFJVFpBMzJSSCQlQCN0PWcu) to be part of the NP-series preview program.


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

## Supported operating systems and drivers
Visit [Xilinx Runtime (XRT) release notes](https://www.xilinx.com/support/documentation/sw_manuals/xilinx2020_2/ug1451-xrt-release-notes.pdf) to get the full list of supported operating systems.

During the preview program Microsoft Azure engineering teams will share specific instructions for driver installation.

##  Frequently asked questions

**Q:** What version of Vitis should I use? 

**A:** Xilinx recommends [Vitis 2020.2](https://www.xilinx.com/products/design-tools/vitis/vitis-platform.html)


**Q:** Do I need to use NP VMs for develop my solutuion? 

**A:** No, you can develop on-premise and deploy to the cloud! Please make sure you follow the attestation documentation to deploy on NP VMs. 

**Q:** What are the supported OS (Operating Systems)? 

**A:** Xilinx and Microsoft have validated Ubuntu 18.04 LTS and CentOS 7.8.

 Xilinx created the following marketplace images to simplify the deployment of these VMs. 

[Xilinx Alveo U250 Deployment VM – Ubuntu18.04](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/xilinx.xilinx_alveo_u250_deployment_vm_ubuntu1804_032321/)

[Xilinx Alveo U250 Deployment VM – CentOS7.8](https://ms.portal.azure.com/#blade/Microsoft_Azure_Marketplace/GalleryItemDetailsBladeNopdl/id/xilinx.xilinx_alveo_u250_deployment_vm_centos78_032321)

**Q:** Can I deploy my Own Ubuntu/CentOS VMs and install XRT/Deployment Target Platform? 

**A:** Yes.
Can I run xbmgmt commands? 

No, on Azure VMs there is no management support directly from the Azure VM. 

 **Q:** Do I need to load a PLP? 

**A:** No, the PLP is loaded automatically for you, so there is no need to load via xbmgmt commands. 

 
**Q:** Does Azure support different PLPs? 

**A:** Not at this time. We only support the PLP provided in the deployment platform packages. 

**Q:** How can I query the PLP information? 

**A:** Need to run xbutil query and look at the lower portion. 

## Other sizes

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
