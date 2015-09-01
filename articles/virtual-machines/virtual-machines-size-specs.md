<properties
 pageTitle="Virtual machine sizes"
 description="Lists the different sizes for virtual machines and their capacities."
 services="virtual-machines"
 documentationCenter=""
 authors="KBDAzure"
 manager="timlt"
 editor=""
 tags="azure-resource-manager,azure-service-management"/>

<tags
ms.service="virtual-machines"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="vm-multiple"
 ms.workload="infrastructure-services"
 ms.date="09/02/2015"
 ms.author="kathydav"/>

# Sizes for virtual machines

## Overview

This article describes the available sizes and options for the virtual machine-based compute resources you can use to run your apps and workloads.  It also provides deployment considerations to be aware of when you're planning to use these resources.

Azure Virtual Machines and Cloud Services are two of several types of compute resources offered by Azure. For explanations, see [Compute hosting options provided by Azure](http://go.microsoft.com/fwlink/p/?LinkID=311926).

>[AZURE.NOTE] To see related Azure limits, see [Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md).

## Planning considerations

Virtual machines are available in two tiers: basic and standard. Both types offer a choice of sizes, but the basic tier doesn’t provide some capabilities available in the standard tier, such as load-balancing and auto-scaling. The standard tier of sizes consists of different series: A, D, DS, G, and GS. Considerations for some of these sizes include:

*   D-series VMs are designed to run applications that demand higher compute power and temporary disk performance. D-series VMs provide faster processors, a higher memory-to-core ratio, and a solid-state drive (SSD) for the temporary disk. For details, see the announcement on the Azure blog, [New D-Series Virtual Machine Sizes](http://azure.microsoft.com/blog/2014/09/22/new-d-series-virtual-machine-sizes/).  

*   G-series VMs offer the biggest size and best performance and run on hosts that have Intel Xeon E5 V3 family processors.

*   DS-series and GS-series VMs can use Premium Storage, which provides high-performance, low-latency storage for I/O intensive workloads. These VMs use solid-state drives (SSDs) to host a virtual machine’s disks and also provide a local SSD disk cache. Premium Storage is available in certain regions. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../storage-premium-storage-preview-portal.md).

The size of the virtual machine affects the pricing. The size also affects the processing, memory, and storage capacity of the virtual machine. Storage costs are calculated separately based on used pages in the storage account. For details, see [Virtual Machines Pricing Details](http://azure.microsoft.com/pricing/details/virtual-machines/) and [Azure Storage Pricing](http://azure.microsoft.com/pricing/details/storage/). For more details about storage for VMss, see [About disks and VHDs for virtual machines ](virtual-machines-disks-vhds.md).

The following considerations might help you decide on a size:

*   The A0\Basic_A0 size is available only by using Azure SDK version 1.3 or later.  

*   A1\Basic_A1 is the smallest size recommended for production workloads.  

*   Select a virtual machine that has four or eight CPU cores when using SQL Server Enterprise Edition.  

*   Some of the physical hosts in Azure data centers may not support larger virtual machine sizes, such as A5 – A11\. As a result, you may see the error message **Failed to configure virtual machine <machine name>** or **Failed to create virtual machine <machine name>** when resizing an existing virtual machine to a new size; creating a new virtual machine in a virtual network created before April 16, 2013; or adding a new virtual machine to an existing cloud service. See the topic [Error: “Failed to configure virtual machine”](https://social.msdn.microsoft.com/Forums/en-US/9693f56c-fcd3-4d42-850e-5e3b56c7d6be/error-failed-to-configure-virtual-machine-with-a5-a6-or-a7-vm-size?forum=WAVirtualMachinesforWindows) on the support forum for workarounds for each deployment scenario.  

*   The A8/A10 and A9/A11 virtual machine sizes have the same capacities. The A8 and A9 virtual machine instances include an additional network adapter that is connected to a remote direct memory access (RDMA) network for fast communication between virtual machines. The A8 and A9 instances are designed for high-performance computing applications that require constant and low-latency communication between nodes during execution, for example, applications that use the Message Passing Interface (MPI). The A10 and A11 virtual machine instances do not include the additional network adapter. A10 and A11 instances are designed for high-performance computing applications that do not require constant and low-latency communication between nodes, also known as parametric or embarrassingly parallel applications.  

## General limits

This table shows limits that apply regardless of a virtual machine's size, for virtual machines created using the Service Management deployment model.

[AZURE.INCLUDE [azure-virtual-machines-limits](../../includes/azure-virtual-machines-limits.md)]

This table shows limits that apply regardless of a virtual machine's size, for virtual machines created using the Resource Manager deployment model.

[AZURE.INCLUDE [azure-virtual-machines-limits-azure-resource-manager](../../includes/azure-virtual-machines-limits-azure-resource-manager.md)]

## Size tables

The following tables show the sizes and the capacities they provide.

>[AZURE.NOTE] Storage capacity is represented by using 1024^3 bytes as the unit of measurement for GB. This is sometimes referred to as gibibyte, or base 2 definition. When comparing sizes that use different base systems, remember that base 2 sizes may appear smaller than base 10 but for any specific size (such as 1 GB) a base 2 system provides more capacity than a base 10 system, because 1024^3 is greater than 1000^3.

## Basic tier

|Size – Azure Portal\cmdlets & APIs|CPU cores|Memory|Max. disk sizes – virtual machine|Max. data disks 1023 GB each)|Max. IOPS (300 per disk)|
|---|---|---|---|---|---|
|A0\Basic_A0|1|768 MB|<p>OS = 1023 GB</p><p>Temporary = 20 GB</p>|1|1x300|
|A1\Basic_A1|1|1.75 GB|<p>OS = 1023 GB</p><p>Temporary = 40 GB</p>|2|2x300|
|A2\Basic_A2|2|3.5 GB|<p>OS = 1023 GB</p><p>Temporary = 60 GB</p>|4|4x300|
|A3\Basic_A3|4|7 GB|<p>OS = 1023 GB</p><p>Temporary = 120 GB</p>|8|8x300|
|A4\Basic_A4|8|14 GB|<p>OS = 1023 GB</p><p>Temporary = 240 GB</p>|16|16x300|

## Standard tier
### A series and D series

|Size – Azure Portal\cmdlets & APIs|CPU cores|Memory|Max. disk sizes – virtual machine|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|
|A0\ extra small|1|768 MB|<p>OS = 1023 GB</p><p>Temporary = 20 GB</p>|1|1x500|
|A1\small|1|1.75 GB|<p>OS = 1023 GB</p><p>Temporary = 70 GB</p>|2|2x500|
|A2\medium|2|3.5 GB|<p>OS = 1023 GB</p><p>Temporary = 135 GB</p>|4|4x500|
|A3\large|4|7 GB|<p>OS = 1023 GB</p><p>Temporary = 285 GB</p>|8|8x500|
|A4\extra large|8|14 GB|<p>OS = 1023 GB</p><p>Temporary = 605 GB</p>|16|16x500|
|A5\same|2|14 GB|<p>OS = 1023 GB</p><p>Temporary = 135 GB</p>|4|4X500|
|A6\same|4|28 GB|<p>OS = 1023 GB</p><p>Temporary = 285 GB</p>|8|8x500|
|A7\same|8|56 GB|<p>OS = 1023 GB</p><p>Temporary = 605 GB</p>|16|16x500|
|A8\same|8|56 GB|<p><p>OS = 1023 GB</p><p>Temporary = 382 GB</p><blockquote><p>Note: For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 compute intensive instances</a>.</p></blockquote>|16|16x500|
|A9\same|16|112 GB|<p><p>OS = 1023 GB</p><p>Temporary = 382 GB</p><blockquote><p>Note: For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 compute intensive instances</a>.</p></blockquote>|16|16x500|
|A10\same|8|56 GB|<p><p>OS = 1023 GB</p><p>Temporary = 382 GB</p><blockquote><p>Note: For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 compute intensive instances</a>.</p></blockquote>|16|16x500|
|A11\same|16|112 GB|<p><p>OS = 1023 GB</p><p>Temporary = 382 GB</p><blockquote><p>Note: For information and considerations about using this size, see <a href="http://go.microsoft.com/fwlink/p/?linkid=328042">About the A8, A9, A10, and A11 compute intensive instances</a>.</p></blockquote>|16|16x500|
|Standard_D1\same|1|3.5 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =50 GB</p>|2|2x500|
|Standard_D2\same|2|7 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =100 GB</p>|4|4x500|
|Standard_D3\same|4|14 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =200 GB</p>|8|8x500|
|Standard_D4\same|8|28 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =400 GB</p>|16|16x500|
|Standard_D11\same|2|14 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =100 GB</p>|4|4x500|
|Standard_D12\same|4|28 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =200 GB</p>|8|8x500|
|Standard_D13\same|8|56 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =400 GB</p>|16|16x500|
|Standard_D14\same|16|112 GB|<p>OS = 1023 GB</p><p>Temporary (SSD) =800 GB</p>|32|32x500|


### Standard tier – DS series*

|Size – Azure Portal\cmdlets & APIs|CPU cores|Memory|Max. disk sizes – virtual machine|Max. data disks (1023 GB each)|Cache size (GB)|Max. disk IOPS &amp; bandwidth|
|---|---|---|---|---|---|---|
|Standard_DS1\same|1|3.5|<p>OS = 1023 GB</p><p>Local SSD disk = 7 GB</p>|2|43|<p>3,200</p><p>32 MB per second</p>|
|Standard_DS2\same|2|7|<p>OS = 1023 GB</p><p>Local SSD disk = 14 GB</p>|4|86|<p>6,400</p><p>64 MB per second</p>|
|Standard_DS3\same|4|14|<p>OS = 1023 GB</p><p>Local SSD disk = 28 GB</p>|8|172|<p>12,800</p><p>128 MB per second</p>|
|Standard_DS4\same|8|28|<p>OS = 1023 GB</p><p>Local SSD disk = 56 GB</p>|16|344|<p>25,600</p><p>256 MB per second</p>|
|Standard_DS11\same|2|14|<p>OS = 1023 GB</p><p>Local SSD disk = 28 GB</p>|4|72|<p>6,400</p><p>64 MB per second</p>|
|Standard_DS12\same|4|28|<p>OS = 1023 GB</p><p>Local SSD disk = 56 GB</p>|8|144|<p>12,800</p><p>128 MB per second</p>|
|Standard_DS13\same|8|56|<p>OS = 1023 GB</p><p>Local SSD disk = 112 GB</p>|16|288|<p>25,600</p><p>256 MB per second</p>|
|Standard_DS14\same|16|112|<p>OS = 1023 GB</p><p>Local SSD disk = 224 GB</p>|32|576|<p>50,000</p><p>512 MB per second</p>|

*The maximum input/output operations per second (IOPS) and throughput (bandwidth) possible with a DS series VM is affected by the size of the disk. For details, see [Premium Storage: High-performance storage for Azure virtual machine workloads](../storage-premium-storage-preview-portal.md).

### Standard tier – G series

|Size – Azure Portal\cmdlets &amp; APIs|CPU cores|Memory|Max. disk sizes – virtual machine|Max. data disks (1023 GB each)|Max. IOPS (500 per disk)|
|---|---|---|---|---|---|
|Standard_G1\same|2|28 GB|<p>OS = 1023 GB</p><p>Local SSD disk = 384 GB</p>|4|4 x 500|
|Standard_G2\same|4|56 GB|<p>OS = 1023 GB</p><p>Local SSD disk = 768 GB</p>|8|8 x 500|
|Standard_G3\same|8|112 GB|<p>OS = 1023 GB</p><p>Local SSD disk = 1,536 GB</p>|16|16 x 500|
|Standard_G4\same|16|224 GB|<p>OS = 1023 GB</p><p>Local SSD disk = 3,072 GB</p>|32|32 x 500|
|Standard_G5\same|32|448 GB|<p>OS = 1023 GB</p><p>Local SSD disk = 6,144 GB</p>|64|<p>64 x 500</p>|

### Standard tier - GS series

|Size – Azure Portal\cmdlets & APIs|CPU cores|Memory|Max. disk sizes – virtual machine|Max. data disks (1023 GB each)|Cache size (GB)|Max. disk IOPS &amp; bandwidth|
|---|---|---|---|---|---|---|
|Standard_GS1|2|28|<p>OS = 1023 GB</p><p>Local SSD disk = 56 GB</p>|4|264|<p>5,000</p><p>125 MB per second</p>|
|Standard_GS2|4|56|<p>OS = 1023 GB</p><p>Local SSD disk = 112 GB</p>|8|528|<p>10,000</p><p>250 MB per second</p>|
|Standard_GS3|8|112|<p>OS = 1023 GB</p><p>Local SSD disk = 224 GB</p>|16|1056|<p>20,000</p><p>500 MB per second</p>|
|Standard_GS4|16|224|<p>OS = 1023 GB</p><p>Local SSD disk = 448 GB</p>|32|2112|<p>40,000</p><p>1,000 MB per second</p>|
|Standard_GS5|32|448|<p>OS = 1023 GB</p><p>Local SSD disk = 896 GB</p>|64|4224|<p>80,000</p><p>2,000 MB per second</p>|


### See also

[Azure subscription and service limits, quotas, and constraints](../azure-subscription-service-limits.md)

[About the A8, A9, A10, and A11 compute intensive instances](virtual-machines-a8-a9-a10-a11-specs.md)
