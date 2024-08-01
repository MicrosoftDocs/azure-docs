---
title: NP size series
description: Information on and specifications of the NP-series sizes
author: mattmcinnes
ms.service: azure-virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 07/31/2024
ms.author: mattmcinnes
ms.reviewer: mattmcinnes
---

# NP sizes series

[!INCLUDE [np-summary](./includes/np-series-summary.md)]

## Host specifications
[!INCLUDE [np-series-specs](./includes/np-series-specs.md)]

## Feature support
[Premium Storage](../../premium-storage-performance.md): Supported <br>[Premium Storage caching](../../premium-storage-performance.md): Supported <br>[Live Migration](../../maintenance-and-updates.md): Not Supported <br>[Memory Preserving Updates](../../maintenance-and-updates.md): Not Supported <br>[Generation 2 VMs](../../generation-2.md): Not Supported <br>[Generation 1 VMs](../../generation-2.md): Supported <br>[Accelerated Networking](../../../virtual-network/create-vm-accelerated-networking-cli.md): Not Supported <br>[Ephemeral OS Disk](../../ephemeral-os-disks.md): Supported <br>[Nested Virtualization](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization): Not Supported <br>

## Sizes in series

### [Basics](#tab/sizebasic)

vCPUs (Qty.) and Memory for each size

| Size Name | vCPUs (Qty.) | Memory (GB) |
| --- | --- | --- |
| Standard_NP10s | 10 | 168 |
| Standard_NP20s | 20 | 336 |
| Standard_NP40s | 40 | 672 |

#### VM Basics resources
- [Check vCPU quotas](../../../virtual-machines/quotas.md)

### [Local Storage](#tab/sizestoragelocal)

Local (temp) storage info for each size

| Size Name | Max Temp Storage Disks (Qty.) | Temp Disk Size (GiB) | Temp Disk Random Read (RR)<sup>1</sup> IOPS | Temp Disk Random Read (RR)<sup>1</sup> Speed (MBps) | Temp Disk Random Write (RW)<sup>1</sup> IOPS | Temp Disk Random Write (RW)<sup>1</sup> Speed (MBps) | Local-Special-Disk-Count | Local-Special-Disk-Size-GB | Local-Special-Disk-RR-IOPS | Local-Special-Disk-RR-MBps |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NP10s | 1 | 736 |  |  |  |  |  |  |  |  |
| Standard_NP20s | 1 | 1474 |  |  |  |  |  |  |  |  |
| Standard_NP40s | 1 | 2948 |  |  |  |  |  |  |  |  |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- <sup>1</sup>Temp disk speed often differs between RR (Random Read) and RW (Random Write) operations. RR operations are typically faster than RW operations. The RW speed is usually slower than the RR speed on series where only the RR speed value is listed.
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).

### [Remote Storage](#tab/sizestorageremote)

Remote (uncached) storage info for each size

| Size Name | Max Remote Storage Disks (Qty.) | Uncached Disk IOPS | Uncached Disk Speed (MBps) | Uncached Disk Burst<sup>1</sup> IOPS | Uncached Disk Burst<sup>1</sup> Speed (MBps) | Uncached Special<sup>2</sup> Disk IOPS | Uncached Special<sup>2</sup> Disk Speed (MBps) | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk IOPS | Uncached Burst<sup>1</sup> Special<sup>2</sup> Disk Speed (MBps) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Standard_NP10s | 8 |  |  |  |  |  |  |  |  |
| Standard_NP20s | 16 |  |  |  |  |  |  |  |  |
| Standard_NP40s | 32 |  |  |  |  |  |  |  |  |

#### Storage resources
- [Introduction to Azure managed disks](../../../virtual-machines/managed-disks-overview.md)
- [Azure managed disk types](../../../virtual-machines/disks-types.md)
- [Share an Azure managed disk](../../../virtual-machines/disks-shared.md)

#### Table definitions
- <sup>1</sup>Some sizes support [bursting](../../disk-bursting.md) to temporarily increase disk performance. Burst speeds can be maintained for up to 30 minutes at a time.
- <sup>2</sup>Special Storage refers to either [Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) or [Premium SSD v2](../../../virtual-machines/disks-deploy-premium-v2.md) storage.
- Storage capacity is shown in units of GiB or 1024^3 bytes. When you compare disks measured in GB (1000^3 bytes) to disks measured in GiB (1024^3) remember that capacity numbers given in GiB may appear smaller. For example, 1023 GiB = 1098.4 GB.
- Disk throughput is measured in input/output operations per second (IOPS) and MBps where MBps = 10^6 bytes/sec.
- Data disks can operate in cached or uncached modes. For cached data disk operation, the host cache mode is set to ReadOnly or ReadWrite. For uncached data disk operation, the host cache mode is set to None.
- To learn how to get the best storage performance for your VMs, see [Virtual machine and disk performance](../../../virtual-machines/disks-performance.md).


### [Network](#tab/sizenetwork)

Network interface info for each size

| Size Name | Max NICs (Qty.) | Max Bandwidth (Mbps) |
| --- | --- | --- |
| Standard_NP10s | 1 | 7500 |
| Standard_NP20s | 2 | 15000 |
| Standard_NP40s | 4 | 30000 |

#### Networking resources
- [Virtual networks and virtual machines in Azure](../../../virtual-network/network-overview.md)
- [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)

#### Table definitions
- Expected network bandwidth is the maximum aggregated bandwidth allocated per VM type across all NICs, for all destinations. For more information, see [Virtual machine network bandwidth](../../../virtual-network/virtual-machine-network-throughput.md)
- Upper limits aren't guaranteed. Limits offer guidance for selecting the right VM type for the intended application. Actual network performance will depend on several factors including network congestion, application loads, and network settings. For information on optimizing network throughput, see [Optimize network throughput for Azure virtual machines](../../../virtual-network/virtual-network-optimize-network-bandwidth.md). 
-  To achieve the expected network performance on Linux or Windows, you may need to select a specific version or optimize your VM. For more information, see [Bandwidth/Throughput testing (NTTTCP)](../../../virtual-network/virtual-network-bandwidth-testing.md).

### [Accelerators](#tab/sizeaccelerators)

Accelerator (GPUs, FPGAs, etc.) info for each size

| Size Name | Accelerators (Qty.) | Accelerator-Memory (GB) |
| --- | --- | --- |
| Standard_NP10s | 1 | 64 |
| Standard_NP20s | 2 | 128 |
| Standard_NP40s | 4 | 256 |

---

## Frequently asked questions
**Q:** What's the difference between Xilinx U250 and the AMD Alveo U250?

**A:** AMD Acquired Xilinx and renamed their FPGA line to Alveo. They are identical and use the same drivers, but the original Xilinx page redirects to AMD's new site.

**Q:** How to request quota for NP VMs?

**A:** Follow this page [Increase VM-family vCPU quotas](../../../azure-portal/supportability/per-vm-quota-requests.md). NP VMs are available in East US, West US2, SouthCentral US, West Europe, SouthEast Asia, Japan East, and Canada Central.

**Q:** What version of Vitis should I use? 

**A:** Xilinx recommends [Vitis 2022.1](https://www.xilinx.com/products/design-tools/vitis/vitis-platform.html), you can also use the Development VM marketplace options (Vitis 2022.1 Development VM for Ubuntu 18.04, Ubuntu 20.04, and CentOS 7.8)

**Q:** Do I need to use NP VMs to develop my solution? 

**A:** No, you can develop on-premises and deploy to the cloud. Make sure to follow the [attestation documentation](../../field-programmable-gate-arrays-attestation.md) to deploy on NP VMs. 

**Q:** What shell version is supported and how can I get the development files?

**A:** The FPGAs in Azure NP VMs support Xilinx Shell 2.1 (gen3x16-xdma-shell_2.1). See Xilinx Page [Xilinx/Azure with Alveo U250](https://www.amd.com/en/where-to-buy/accelerators/alveo/cloud-solutions/microsoft-azure.html) to get the development shell files.

**Q:** Which file returned from attestation should I use when programming my FPGA in an NP VM?

**A:** Attestation returns two xclbins, **design.bit.xclbin** and **design.azure.xclbin**. Use **design.azure.xclbin**.

**Q:** Where should I get all the XRT / Platform files?

**A:** Visit Xilinx's [Microsoft-Azure](https://www.amd.com/en/where-to-buy/accelerators/alveo/cloud-solutions/microsoft-azure.html) site for all files.

**Q:** What Version of XRT should I use?

**A:** xrt_202210.2.13.479 

**Q:** What is the target deployment platform?

**A:** Use the following platforms.
- xilinx-u250-gen3x16-xdma-platform-2.1-3_all
- xilinx-u250-gen3x16-xdma-validate_2.1-3005608.1 

**Q:** Which platform should I target for development?

**A:** xilinx-u250-gen3x16-xdma-2.1-202010-1-dev_1-2954688_all 

**Q:** What are the supported Operating Systems? 

**A:** Xilinx and Microsoft validated Ubuntu 18.04 LTS, Ubuntu 20.04 LTS, and CentOS 7.8.

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

**Q:** What are the differences between on-premises FPGAs and NP VMs?

**A:** 
<br>
<b>- Regarding XOCL/XCLMGMT: </b>
<br>
On Azure NP VMs, only the role endpoint (Device ID 5005), which uses the XOCL driver, is present.

In on-premises FPGAs, both the management endpoint (Device ID 5004) and role endpoint (Device ID 5005), which use the XCLMGMT and XOCL drivers respectively, are present.

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

On-premises FPGA in Linux exposes
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

**A:** No. The FPGA Attestation service performs a series of validations on a design checkpoint file and generates an error if the user's application contains connections to the FPGA card's QSFP networking ports.

[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
