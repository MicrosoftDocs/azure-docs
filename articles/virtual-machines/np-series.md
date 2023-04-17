---
title: NP-series - Azure Virtual Machines
description: Specifications for the NP-series VMs.
author: charest
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 03/07/2023
ms.author: marccharest
---

# NP-series 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The NP-series virtual machines are powered by [Xilinx U250](https://www.xilinx.com/products/boards-and-kits/alveo/u250.html) FPGAs for accelerating workloads including machine learning inference, video transcoding, and database search & analytics. NP-series VMs are also powered by Intel Xeon 8171M (Skylake) CPUs with all core turbo clock speed of 3.2 GHz.

[Premium Storage](premium-storage-performance.md): Supported<br>
[Premium Storage caching](premium-storage-performance.md): Supported<br>
[Live Migration](maintenance-and-updates.md): Not Supported<br>
[Memory Preserving Updates](maintenance-and-updates.md): Not Supported<br>
VM Generation Support: Generation 1<br>
[Accelerated Networking](../virtual-network/create-vm-accelerated-networking-cli.md): Supported<br>
[Ephemeral OS Disks](ephemeral-os-disks.md): Supported<br>
[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>
<br>

| Size | vCPU | Memory: GiB | Temp storage (SSD) GiB | FPGA | FPGA memory: GiB | Max data disks | Max NICs/ Expected network bandwidth (Mbps) | 
|---|---|---|---|---|---|---|---|
| Standard_NP10s | 10 | 168 | 736  | 1 | 64  | 8 | 1 / 7500 | 
| Standard_NP20s | 20 | 336 | 1474 | 2 | 128 | 16 | 2 / 15000 | 
| Standard_NP40s | 40 | 672 | 2948 | 4 | 256 | 32 | 4 / 30000 | 



[!INCLUDE [virtual-machines-common-sizes-table-defs](../../includes/virtual-machines-common-sizes-table-defs.md)]


##  Frequently asked questions

**Q:** How to request quota for NP VMs?

**A:** Follow this page [Increase VM-family vCPU quotas](../azure-portal/supportability/per-vm-quota-requests.md). NP VMs are available in East US, West US2, West Europe, SouthEast Asia, and SouthCentral US.

**Q:** What version of Vitis should I use? 

**A:** Xilinx recommends [Vitis 2022.1](https://www.xilinx.com/products/design-tools/vitis/vitis-platform.html), you can also use the Development VM marketplace options (Vitis 2022.1 Development VM for Ubuntu 18.04, Ubuntu 20.04, and CentOS 7.8)

**Q:** Do I need to use NP VMs to develop my solution? 

**A:** No, you can develop on-premises and deploy to the cloud. Make sure to follow the [attestation documentation](./field-programmable-gate-arrays-attestation.md) to deploy on NP VMs. 

**Q:** What shell version is supported and how can I get the development files?

**A:** The FPGAs in Azure NP VMs support Xilinx Shell 2.1 (gen3x16-xdma-shell_2.1). See Xilinx Page [Xilinx/Azure with Alveo U250](https://www.xilinx.com/microsoft-azure.html) to get the development shell files.

**Q:** Which file returned from attestation should I use when programming my FPGA in an NP VM?

**A:** Attestation returns two xclbins, **design.bit.xclbin** and **design.azure.xclbin**. Use **design.azure.xclbin**.

**Q:** Where should I get all the XRT / Platform files?

**A:** Visit Xilinx's [Microsoft-Azure](https://www.xilinx.com/microsoft-azure.html) site for all files.

**Q:** What Version of XRT should I use?

**A:** xrt_202210.2.13.479 

**Q:** What is the target deployment platform?

**A:** Use the following platforms.
- xilinx-u250-gen3x16-xdma-platform-2.1-3_all
- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1 

**Q:** Which platform should I target for development?

**A:** xilinx-u250-gen3x16-xdma-2.1-202010-1-dev_1-2954688_all 

**Q:** What are the supported Operating Systems? 

**A:** Xilinx and Microsoft have validated Ubuntu 18.04 LTS, Ubuntu 20.04 LTS, and CentOS 7.8.

>Xilinx has created the following marketplace images to simplify the deployment of these VMs: 
>
>- Xilinx Alveo U250 2022.1 Deployment VM [Ubuntu18.04](https://portal.azure.com/#create/xilinx.vitis2022_1_ubuntu1804_development_imagevitis2022_1_ubuntu1804)
>
>- Xilinx Alveo U250 2022.1 Deployment VM [Ubuntu20.04](https://portal.azure.com/#create/xilinx.vitis2022_1_ubuntu2004_development_imagevitis2022_1_ubuntu2004)
>
>- Xilinx Alveo U250 2022.1 Deployment VM [CentOS7.8](https://portal.azure.com/#create/xilinx.vitis2022_1_centos78_development_imagevitis2022_1_centos78)

**Q:** Can I deploy my Own Ubuntu / CentOS VMs and install XRT / Deployment Target Platform? 

**A:** Yes.

**Q:** If I deploy my own Ubuntu18.04 VM then what are the required packages and steps?

**A:** Follow the guidance in Xilinx XRT documentation [Xilinx XRT documentation](https://docs.xilinx.com/r/en-US/ug1451-xrt-release-notes/XRT-Operating-System-Support)

>Install the following packages.
>- xrt_202210.2.13.479_18.04-amd64-xrt.deb
>
>- xrt_202210.2.13.479_18.04-amd64-azure.deb
>       
>- xilinx-u250-gen3x16-xdma-platform-2.1-3_all_18.04.deb.tar.gz
>       
>- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1_all.deb  

**Q:** If I deploy my own Ubuntu20.04 VM then what are the required packages and steps?

**A:** Follow the guidance in Xilinx XRT documentation [Xilinx XRT documentation](https://docs.xilinx.com/r/en-US/ug1451-xrt-release-notes/XRT-Operating-System-Support)
       
>Install the following packages.
>- xrt_202210.2.13.479_20.04-amd64-xrt.deb
>       
>- xrt_202210.2.13.479_20.04-amd64-azure.deb
>       
>- xilinx-u250-gen3x16-xdma-platform-2.1-3_all_18.04.deb.tar.gz
>       
>- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1_all.deb 

**Q:** If I deploy my own CentOS7.8 VM then what are the required packages and steps?

**A:** Follow the guidance in Xilinx XRT documentation [Xilinx XRT documentation](https://docs.xilinx.com/r/en-US/ug1451-xrt-release-notes/XRT-Operating-System-Support)

 >Install the following packages.  
 >- xrt_202210.2.13.479_7.8.2003-x86_64-xrt.rpm
 >     
 >- xrt_202210.2.13.479_7.8.2003-x86_64-azure.rpm
 >    
 >- xilinx-u250-gen3x16-xdma-platform-2.1-3.noarch.rpm.tar.gz 
 >     
 >- xilinx-u250-gen3x16-xdma-validate-2.1-3005608.1.noarch.rpm  

**Q:** What are the differences between on-premise FPGAs and NP VMs?

**A:** 
<br>
<b>- Regarding XOCL/XCLMGMT: </b>
<br>
On Azure NP VMs, only the role endpoint (Device ID 5005), which uses the XOCL driver, is present.

In on-premise FPGAs, both the management endpoint (Device ID 5004) and role endpoint (Device ID 5005), which use the XCLMGMT and XOCL drivers respectively, are present.

<br>
<b>- Regarding XRT: </b>
<br>
On Azure NP VMs, the XDMA 2.1 platform only supports Host_Mem(SB). 
<br>
To enable Host_Mem(SB) (up to 1-Gb RAM):  sudo xbutil host_mem --enable --size 1g 
<br>
To disable Host_Mem(SB): sudo xbutil host_mem --disable 
<br>

<br>
Starting on XRT2021.1:

On-premise FPGA in Linux exposes
[M2M data transfer](https://xilinx.github.io/XRT/master/html/m2m.html).
<br>
This feature isn't supported in Azure NP VMs.
 
**Q:** Can I run xbmgmt commands? 

**A:** No, on Azure VMs there's no management support directly from the Azure VM. 

 **Q:** Do I need to load a PLP? 

**A:** No, the PLP is loaded automatically for you, so there's no need to load via xbmgmt commands. 

 
**Q:** Does Azure support different PLPs? 

**A:** Not at this time. We only support the PLP provided in the deployment platform packages. 

**Q:** How can I query the PLP information? 

**A:** Need to run xbutil query and look at the lower portion. 

**Q:** Do Azure NP VMs support FPGA bitstreams with Networking GT Kernel connections?

**A:** No. The FPGA Attestation service performs a series of validations on a design checkpoint file and will generate an error if the user's application contains connections to the FPGA card's QSFP networking ports.

## Other sizes and information

- [General purpose](sizes-general.md)
- [Memory optimized](sizes-memory.md)
- [Storage optimized](sizes-storage.md)
- [GPU optimized](sizes-gpu.md)
- [High performance compute](sizes-hpc.md)
- [Previous generations](sizes-previous-gen.md)

Pricing Calculator: [Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

For more information on disk types, see [What disk types are available in Azure?](disks-types.md)

## Next steps

Learn more about how [Azure compute units (ACU)](acu.md) can help you compare compute performance across Azure SKUs.
